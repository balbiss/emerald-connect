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
const VPS_API_KEY = process.env.VPS_API_KEY || '280896Ab@01733190252';
const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';

// VALIDAÇÃO CRÍTICA NA INICIALIZAÇÃO
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ ERRO CRÍTICO: SUPABASE_URL ou SUPABASE_SERVICE_KEY não definidos!');
  console.error('Certifique-se de configurar as variáveis de ambiente corretamente.');
  process.exit(1); 
}

// CLIENTE SUPABASE (MODO ADMIN PARA BYPASS RLS NO WORKER)
let supabase;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  console.log('✅ Cliente Supabase inicializado.');
} catch (error) {
  console.error('❌ Erro ao inicializar cliente Supabase:', error.message);
  process.exit(1);
}

// FILA DE DISPARO (REDIS)
let messageQueue;
try {
  messageQueue = new Bull('message-disparo', REDIS_URL);
  console.log('✅ Fila Bull inicializada (Redis).');
} catch (error) {
  console.error('❌ Erro ao inicializar fila Redis:', error.message);
}

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
app.get('/api-proxy/instances/:id/settings', async (req, res) => {
  try {
    const { data } = await api.get(`/api/instances/${req.params.id}/settings`);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Error' });
  }
});

app.post('/api-proxy/instances/:id/settings', async (req, res) => {
  try {
    const { data } = await api.post(`/api/instances/${req.params.id}/settings`, req.body);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Error' });
  }
});

// Webhook
app.get('/api-proxy/instances/:id/webhook', async (req, res) => {
  try {
    const { data } = await api.get(`/api/instances/${req.params.id}/webhook`);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Error' });
  }
});

app.post('/api-proxy/instances/:id/webhook', async (req, res) => {
  try {
    const { data } = await api.post(`/api/instances/${req.params.id}/webhook`, req.body);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Internal Error' });
  }
});

// Lista todas as instâncias
app.get('/api-proxy/instances', async (req, res) => {
  try {
    const { data } = await api.get('/api/instances');
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- 2. WORKER DE DISPARO (SUPABASE -> FILA -> API) ---

// Processador da fila
messageQueue.process(async (job) => {
  const { campaignId, userId, instanceId, numberInfo, messageData, delay, isLast } = job.data;
  const targetNumber = numberInfo.phone;
  const targetName = numberInfo.name || '';
  
  console.log(`[Job ${job.id}] Enviando para: ${targetNumber} (${targetName}) - Campanha: ${campaignId}`);

  try {
    const { data: campaign, error: cError } = await supabase
      .from('campaigns')
      .select('status, sent_count, numbers_list')
      .eq('id', campaignId)
      .single();

    if (cError || !campaign || campaign.status === 'paused') return;

    if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));

    const applyVariables = (text) => {
      if (!text || typeof text !== 'string') return text;
      return text.replace(/\{\{nome\}\}/gi, targetName || 'Cliente').replace(/\{\{numero\}\}/gi, targetNumber);
    };

    let endpoint = '/send-text';
    let payload = { jid: `${targetNumber}@s.whatsapp.net` };
    
    if (messageData.type === 'text' && messageData.text) {
       payload = { ...payload, text: applyVariables(messageData.text) };
    } else if (messageData.type === 'carousel' && messageData.carousel) {
      endpoint = '/send-carousel';
      const firstCard = messageData.carousel[0] || {};
      payload = { 
         ...payload, 
         title: applyVariables(messageData.text || firstCard.title || 'Confira as ofertas!'),
         body: applyVariables(messageData.body || firstCard.description || ' '),
         footer: applyVariables(messageData.footer || ' '),
         cards: messageData.carousel.map(card => ({
            imageUrl: card.imageUrl || card.mediaUrl,
            title: applyVariables(card.title),
            body: applyVariables(card.description || card.body),
            footer: applyVariables(card.footer || ''),
            buttons: card.buttons ? card.buttons.map(b => ({
               id: b.id || `btn_${Math.random().toString(36).substr(2, 9)}`,
               title: applyVariables(b.label || b.title)
            })) : []
         }))
      };
    } else if (messageData.type === 'interactive' && messageData.poll) {
      endpoint = '/send-poll';
      payload = { 
         ...payload, 
         name: applyVariables(messageData.poll.question),
         selectableCount: messageData.poll.allowMultiple ? 0 : 1,
         options: messageData.poll.options.map(o => applyVariables(o.label || o))
      };
    } else if (messageData.type === 'buttons' && messageData.buttons) {
      endpoint = '/send-buttons';
      payload = { 
         ...payload, 
         text: applyVariables(messageData.text),
         footer: applyVariables(messageData.footer || ''),
         buttons: messageData.buttons.map((b, i) => ({
             type: b.type === 'url' ? 'cta_url' : b.type === 'call' ? 'cta_call' : b.type === 'copy' ? 'cta_copy' : 'quick_reply',
             displayText: applyVariables(b.label),
             id: b.id || `btn_${i}`,
             ...(b.type === 'url' && { url: b.value }),
             ...(b.type === 'call' && { phoneNumber: b.value }),
             ...(b.type === 'copy' && { copyCode: b.value })
         }))
      };
    } else if (messageData.type === 'media' && messageData.media) {
      const mediaType = messageData.media.type || 'image';
      endpoint = `/send-${mediaType}`;
      payload = { 
         ...payload, 
         url: messageData.media.url,
         caption: applyVariables(messageData.media.caption),
         ...(mediaType === 'audio' && { ptt: true }),
         ...(mediaType === 'document' && { fileName: messageData.media.filename || 'documento' })
      };
    }

    console.log(`[Job ${job.id}] Endpoint: ${endpoint} | Payload JID: ${payload.jid}`);
    const { data } = await api.post(`/api/instances/${instanceId}${endpoint}`, payload);
    
    if (data.success) {
      // Salvar log de sucesso
      await supabase.from('message_logs').insert([{
        user_id: userId,
        campaign_id: campaignId,
        remote_jid: data.remoteJid || `${targetNumber}@s.whatsapp.net`,
        message_id_api: data.messageId,
        status: 'SENT'
      }]);
      // Incrementar contador via RPC atômica
      await supabase.rpc('increment_campaign_sent_count', { campaign_id: campaignId });
      // Marcar como concluída no último job
      if (isLast) {
        await supabase.from('campaigns')
          .update({ status: 'completed' })
          .eq('id', campaignId)
          .not('status', 'eq', 'paused'); // Não sobrescrever se foi pausada
        console.log(`✅ Campanha ${campaignId} CONCLUÍDA!`);
      }
    } else {
      console.warn(`[Job ${job.id}] API retornou erro:`, data);
    }
    return data;
  } catch (error) {
    console.error(`[Job ${job.id}] Erro no envio para ${targetNumber}:`, error.response?.data || error.message);
    // Salvar log de erro
    try {
      await supabase.from('message_logs').insert([{
        user_id: userId,
        campaign_id: campaignId,
        remote_jid: `${targetNumber}@s.whatsapp.net`,
        status: 'ERROR',
        error_message: error.response?.data?.error || error.message
      }]);
    } catch (logErr) {
      console.error('Erro ao salvar log de falha:', logErr.message);
    }
    throw error;
  }
});

async function monitorCampaigns() {
  try {
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .in('status', ['PENDING', 'pending', 'scheduled']);
      
    if (error || !campaigns?.length) return;

    for (const campaign of campaigns) {
      if (campaign.status === 'scheduled' && new Date(campaign.scheduled_at) > new Date()) continue;

      const { data: lock, error: lockErr } = await supabase
        .from('campaigns')
        .update({ status: 'processing', updated_at: new Date().toISOString() })
        .eq('id', campaign.id)
        .eq('status', campaign.status)
        .select();

      if (lockErr || !lock?.length) continue;

      const numbers = campaign.numbers_list || [];
      const sentCount = campaign.sent_count || 0;
      const numbersToProcess = numbers.slice(sentCount);

      if (numbersToProcess.length === 0) {
         await supabase.from('campaigns').update({ status: 'completed' }).eq('id', campaign.id);
         continue;
      }

      const config = campaign.message_config || {};
      const minDelayMs = (config.options?.delayMin || 5) * 1000;
      const maxDelayMs = (config.options?.delayMax || 15) * 1000;
      console.log(`📦 [${campaign.name}] Enfileirando ${numbersToProcess.length} números. Delay: ${minDelayMs/1000}s-${maxDelayMs/1000}s`);

      for (let i = 0; i < numbersToProcess.length; i++) {
        const numRaw = numbersToProcess[i];
        const parts = numRaw.split('|');
        const phone = parts[0].replace('@s.whatsapp.net', '').replace(/[^0-9]/g, '');
        const name = parts[1] || '';
        
        if (!phone || phone.length < 8) {
          console.warn(`⚠️ Número inválido ignorado: "${numRaw}"`);
          continue;
        }
        
        const randomDelay = i === 0 ? 0 : Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs;
        
        messageQueue.add({
          campaignId: campaign.id,
          userId: campaign.user_id,
          instanceId: campaign.instance_id_api,
          numberInfo: { phone, name },
          messageData: config,
          delay: randomDelay,
          isLast: i === numbersToProcess.length - 1
        }, { attempts: 3, backoff: 10000, removeOnComplete: true });
      }
      console.log(`✅ Campanha [${campaign.id}] enfileirada com sucesso.`);
    }
  } catch (err) {
    console.error('❌ ERRO CRÍTICO NO MONITOR:', err.message);
  }
}

// Iniciar monitoramento imediatamente e depois a cada 15 segundos
monitorCampaigns();
setInterval(monitorCampaigns, 15000);

app.listen(PORT, () => {
  console.log(`Emerald VPS Backend rodando na porta ${PORT}`);
  console.log(`API Pastorini alvo: ${VPS_API_URL}`);
});
