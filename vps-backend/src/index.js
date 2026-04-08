require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const Bull = require('bull');

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURAÇÕES (VPS & SUPABASE)
const PORT = process.env.PORT || 4000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const VPS_API_URL = process.env.VPS_API_URL || 'https://zap.inoovaweb.com.br';
const VPS_API_KEY = process.env.VPS_API_KEY || '280896Ab@';
const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';

// CLIENTE SUPABASE (MODO ADMIN PARA BYPASS RLS NO WORKER)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// FILA DE DISPARO (REDIS)
const messageQueue = new Bull('message-disparo', REDIS_URL);

// --- 1. PROXY DE API (LOVABLE -> PASTORINI API) ---
const api = axios.create({
  baseURL: VPS_API_URL,
  headers: { 'x-api-key': VPS_API_KEY }
});

// Criar Instância
app.post('/api-proxy/instances', async (req, res) => {
  try {
    const { data } = await api.post('/api/instances', req.body);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Error' });
  }
});

// QR Code
app.get('/api-proxy/instances/:id/qr', async (req, res) => {
  try {
    const { data } = await api.get(`/api/instances/${req.params.id}/qr`);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Error' });
  }
});

// Status
app.get('/api-proxy/instances/:id/status', async (req, res) => {
  try {
    const { data } = await api.get(`/api/instances/${req.params.id}/status`);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Error' });
  }
});

// Proxy de Instância (Individual)
app.post('/api-proxy/instances/:id/proxy', async (req, res) => {
  try {
    const { data } = await api.post(`/api/instances/${req.params.id}/proxy`, req.body);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Error' });
  }
});

// Configurações
app.post('/api-proxy/instances/:id/settings', async (req, res) => {
  try {
    const { data } = await api.post(`/api/instances/${req.params.id}/settings`, req.body);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Error' });
  }
});

// Deletar Instância
app.delete('/api-proxy/instances/:id', async (req, res) => {
  try {
    const { data } = await api.delete(`/api/instances/${req.params.id}`);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Error' });
  }
});

// --- 2. WORKER DE DISPARO (SUPABASE -> FILA -> API) ---

// Processador da fila
messageQueue.process(async (job) => {
  const { campaignId, userId, instanceId, number, messageData, delay } = job.data;
  
  try {
    // 1. Aguardar delay se configurado (Randomização/Delay entre mensagens)
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // 2. Escolher endpoint e payload baseado na Pastorini API v1.6
    let endpoint = '/send-text';
    let payload = { jid: `${number}@s.whatsapp.net`, ...messageData.text };
    
    // Suporte a diferentes tipos de mensagens da PAPI v1.6
    if (messageData.type === 'carousel') {
      endpoint = '/send-carousel';
      payload = { jid: `${number}@s.whatsapp.net`, ...messageData.carousel };
    } else if (messageData.type === 'poll') {
      endpoint = '/send-poll';
      payload = { jid: `${number}@s.whatsapp.net`, ...messageData.poll };
    } else if (messageData.type === 'buttons') {
      endpoint = '/send-buttons';
      payload = { jid: `${number}@s.whatsapp.net`, ...messageData.buttons };
    } else if (messageData.type === 'media') {
      // Ajuste para send-image, send-video, etc se necessário
      const mediaType = messageData.media?.type || 'image';
      endpoint = `/send-${mediaType}`;
      payload = { jid: `${number}@s.whatsapp.net`, ...messageData.media };
    }

    const { data } = await api.post(`/api/instances/${instanceId}${endpoint}`, payload);
    
    if (data.success) {
      // Gravar log de sucesso
      await supabase.from('message_logs').insert([{
        user_id: userId,
        campaign_id: campaignId,
        remote_jid: data.remoteJid || `${number}@s.whatsapp.net`,
        message_id_api: data.messageId,
        status: 'SENT'
      }]);

      // IMPORTANTE: Incrementar o contador de envios na campanha para a barra de progresso do frontend
      await supabase.rpc('increment_campaign_sent_count', { campaign_id: campaignId });
    }
    
    return data;
  } catch (error) {
    console.error(`Erro no envio para ${number}:`, error.message);
    
    await supabase.from('message_logs').insert([{
        user_id: userId,
        campaign_id: campaignId,
        remote_jid: `${number}@s.whatsapp.net`,
        status: 'ERROR',
        error_message: error.response?.data?.error || error.message
    }]);

    throw error;
  }
});

// Monitor de Campanhas (Vigilante)
async function monitorCampaigns() {
  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('status', 'PENDING');
    
  if (error || !campaigns?.length) return;

  for (const campaign of campaigns) {
    console.log(`🚀 Iniciando Campanha: ${campaign.name} (${campaign.numbers_list?.length} números)`);
    
    // 1. Marcar como PROCESSING
    await supabase.from('campaigns').update({ status: 'PROCESSING' }).eq('id', campaign.id);
    
    const numbers = campaign.numbers_list || [];
    const config = campaign.message_config || {};
    
    // Configurações de delay (padronizadas ou customizadas)
    const minDelay = config.minDelay || 2000;
    const maxDelay = config.maxDelay || 5000;

    for (let i = 0; i < numbers.length; i++) {
      const num = numbers[i];
      
      // Lógica de delay individual para cada job na fila (randomização entre min e max)
      const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      
      messageQueue.add({
        campaignId: campaign.id,
        userId: campaign.user_id,
        instanceId: campaign.instance_id_api,
        number: num,
        messageData: config,
        delay: i === 0 ? 0 : randomDelay // Primeira mensagem sai na hora, as outras com delay
      }, {
        attempts: 3,
        backoff: 10000,
        removeOnComplete: true
      });
    }

    console.log(`✅ Campanha ${campaign.name} enviada para a fila do Bull.`);
  }
}

// Iniciar monitoramento a cada 10 segundos
setInterval(monitorCampaigns, 10000);

app.listen(PORT, () => {
  console.log(`Emerald VPS Backend rodando na porta ${PORT}`);
  console.log(`API Pastorini alvo: ${VPS_API_URL}`);
});
