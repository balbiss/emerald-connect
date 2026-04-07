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
  const { campaignId, userId, instanceId, number, messageData } = job.data;
  
  try {
    // Escolher endpoint baseado no tipo de mensagem
    let endpoint = '/send-text';
    let payload = { jid: `${number}@s.whatsapp.net`, text: messageData.text };
    
    if (messageData.type === 'carousel') {
      endpoint = '/send-carousel';
      payload = { jid: `${number}@s.whatsapp.net`, ...messageData.carousel };
    } else if (messageData.type === 'poll') {
      endpoint = '/send-poll';
      payload = { jid: `${number}@s.whatsapp.net`, ...messageData.poll };
    }

    const { data } = await api.post(`/api/instances/${instanceId}${endpoint}`, payload);
    
    if (data.success) {
      // Gravar log no Supabase
      await supabase.from('message_logs').insert([{
        user_id: userId,
        campaign_id: campaignId,
        remote_jid: data.remoteJid,
        message_id_api: data.messageId,
        status: 'SENT'
      }]);
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
  console.log('Vigilante: Monitorando campanhas pending...');
  
  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('status', 'PENDING');
    
  if (error) {
     console.error('Erro ao buscar campanhas:', error);
     return;
  }

  for (const campaign of campaigns) {
    console.log(`Iniciando Campanha: ${campaign.name}`);
    
    // 1. Marcar como PROCESSING
    await supabase.from('campaigns').update({ status: 'PROCESSING' }).eq('id', campaign.id);
    
    // 2. Fragmentar números (Neste exemplo simplificado, assumimos que numbers é um array no JSONB ou string separada por vírgula)
    const numbers = campaign.numbers_list || []; // Ajustado conforme seu schema real se houver
    
    // Se não tiver lista, pegamos do audience proxy (opcional)
    if (numbers.length === 0) {
        // Lógica para carregar contatos da lista se houver
    }

    for (const num of numbers) {
      messageQueue.add({
        campaignId: campaign.id,
        userId: campaign.user_id,
        instanceId: campaign.instance_id_api, // ID da instância na VPS
        number: num,
        messageData: campaign.message_config // Configuração exportada do MessageBuilder
      }, {
        attempts: 3,
        backoff: 5000
      });
    }
  }
}

// Iniciar monitoramento a cada 10 segundos
setInterval(monitorCampaigns, 10000);

app.listen(PORT, () => {
  console.log(`Emerald VPS Backend rodando na porta ${PORT}`);
  console.log(`API Pastorini alvo: ${VPS_API_URL}`);
});
