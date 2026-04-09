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
  const { campaignId, userId, instanceId, numberInfo, messageData, delay } = job.data;
  const targetNumber = numberInfo.phone;
  const targetName = numberInfo.name || '';
  
  console.log(`[Job ${job.id}] Enviando para: ${targetNumber} (${targetName}) - Campanha: ${campaignId}`);

  try {
    // 0. Verificar se a campanha ainda está ativa (Suporte a PAUSA)
    const { data: campaign, error: cError } = await supabase
      .from('campaigns')
      .select('status, sent_count')
      .eq('id', campaignId)
      .single();

    if (cError || !campaign) {
      console.log(`[Job ${job.id}] Campanha ${campaignId} não encontrada ou erro. Pulando.`);
      return;
    }

    if (campaign.status === 'paused') {
      console.log(`[Job ${job.id}] Campanha ${campaignId} PAUSADA. Interrompendo este job.`);
      // Nota: O monitor de campanhas cuidará da retomada recriando a fila a partir do sent_count.
      return;
    }

    // 1. Aguardar delay se configurado (Randomização/Delay entre mensagens)
    if (delay > 0) {
      console.log(`[Job ${job.id}] Aguardando delay de ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Função utilitária para substituir {{nome}} e similares
    const applyVariables = (text) => {
      if (!text || typeof text !== 'string') return text;
      return text.replace(/\{\{nome\}\}/gi, targetName || 'Cliente').replace(/\{\{numero\}\}/gi, targetNumber);
    };

    // 2. Escolher endpoint e payload baseado na Pastorini API v1.6
    let endpoint = '/send-text';
    let payload = { jid: `${targetNumber}@s.whatsapp.net` };
    
    // Suporte a diferentes tipos de mensagens da PAPI v1.6 aplicando as variáveis
    if (messageData.type === 'text' && messageData.text) {
       payload = { ...payload, text: applyVariables(messageData.text) };
    } else if (messageData.type === 'carousel' && messageData.carousel) {
      endpoint = '/send-carousel';
      // PAPI v1.6 exige title e body no nível superior. Usamos o texto da campanha ou o título do primeiro card como fallback.
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
         selectableCount: messageData.poll.allowMultiple ? 0 : 1, // 0 = multiple, 1 = single per doc
         options: messageData.poll.options.map(o => applyVariables(o.label || o))
      };
    } else if (messageData.type === 'buttons' && messageData.buttons) {
      endpoint = '/send-buttons';
      payload = { 
         ...payload, 
         text: applyVariables(messageData.text),
         footer: applyVariables(messageData.footer || ''),
         buttons: messageData.buttons.map((b, i) => ({
             type: b.type === 'url' ? 'cta_url' : b.type === 'call' ? 'cta_call' : 'quick_reply',
             displayText: applyVariables(b.label),
             id: b.id || `btn_${i}`,
             ...(b.type === 'url' && { url: b.value }),
             ...(b.type === 'call' && { phoneNumber: b.value })
         }))
      };
    } else if (messageData.type === 'media' && messageData.media) {
      const mediaType = messageData.media.type || 'image';
      endpoint = `/send-${mediaType}`;
      payload = { 
         ...payload, 
         url: messageData.media.url,
         caption: applyVariables(messageData.media.caption),
         ...(mediaType === 'audio' && { ptt: true }), // Sempre usar PTT para áudio na v1.6 por padrão
         ...(mediaType === 'document' && { fileName: messageData.media.filename || 'documento' })
      };
    }

    const { data } = await api.post(`/api/instances/${instanceId}${endpoint}`, payload);
    
    if (data.success) {
      // Gravar log de sucesso
      await supabase.from('message_logs').insert([{
        user_id: userId,
        campaign_id: campaignId,
        remote_jid: data.remoteJid || `${targetNumber}@s.whatsapp.net`,
        message_id_api: data.messageId,
        status: 'SENT'
      }]);

      // IMPORTANTE: Incrementar o contador de envios na campanha para a barra de progresso do frontend
      await supabase.rpc('increment_campaign_sent_count', { campaign_id: campaignId });
    }
    
    return data;
  } catch (error) {
    console.error(`Erro no envio para ${targetNumber}:`, error.message);
    
    await supabase.from('message_logs').insert([{
        user_id: userId,
        campaign_id: campaignId,
        remote_jid: `${targetNumber}@s.whatsapp.net`,
        status: 'ERROR',
        error_message: error.response?.data?.error || error.message
    }]);

    throw error;
  }
});

// Monitor de Campanhas (Vigilante)
async function monitorCampaigns() {
  try {
    console.log('--- Verificando novas campanhas para processar... ---');
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .in('status', ['PENDING', 'pending', 'scheduled']); // Pega pendentes e agendadas
      
    if (error) {
       console.error('❌ Erro Supabase ao monitorar:', error.message);
       return;
    }

    if (!campaigns?.length) {
       console.log('Dormindo... (Nenhuma campanha encontrada)');
       return;
    }

    for (const campaign of campaigns) {
      try {
        // Se estiver agendada, checar se ja passou da hora
        if (campaign.status === 'scheduled' && campaign.scheduled_at) {
           if (new Date(campaign.scheduled_at) > new Date()) continue; 
        }

        console.log(`🚀 Processando Campanha [ID: ${campaign.id}]: ${campaign.name}`);
        
        const { error: updateError } = await supabase.from('campaigns').update({ status: 'processing' }).eq('id', campaign.id);
        
        if (updateError) {
           console.error(`❌ Erro ao atualizar status:`, updateError.message);
           continue;
        }
        
        const numbers = campaign.numbers_list || [];
        const config = campaign.message_config || {};
        const sentCount = campaign.sent_count || 0;
        
        // SUPORTE A RETOMADA: Começar do índice correto
        const numbersToProcess = numbers.slice(sentCount);
        
        const minDelay = config.options?.delayMin ? config.options.delayMin * 1000 : 5000;
        const maxDelay = config.options?.delayMax ? config.options.delayMax * 1000 : 15000;

        if (numbersToProcess.length === 0) {
           console.log(`✅ Campanha ${campaign.id} já concluída ou sem novos números.`);
           await supabase.from('campaigns').update({ status: 'completed' }).eq('id', campaign.id);
           continue;
        }

        console.log(`📦 Adicionando ${numbersToProcess.length} números na fila Bull... (Iniciando de ${sentCount})`);

        for (let i = 0; i < numbersToProcess.length; i++) {
          const numRaw = numbersToProcess[i];
          let phone = numRaw;
          let name = '';
          
          if (numRaw.includes('|')) {
             const parts = numRaw.split('|');
             phone = parts[0].trim();
             name = parts.slice(1).join(' ').trim();
          }
          phone = phone.replace('@s.whatsapp.net', '').replace(/[^0-9]/g, '');
          const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
          
          messageQueue.add({
            campaignId: campaign.id,
            userId: campaign.user_id,
            instanceId: campaign.instance_id_api,
            numberInfo: { phone, name },
            messageData: config,
            delay: i === 0 ? 0 : randomDelay
          }, {
            attempts: 3,
            backoff: 10000,
            removeOnComplete: true
          });
        }
        console.log(`✅ Campanha ${campaign.id} agendada na fila com sucesso.`);
      } catch (innerErr) {
        console.error(`❌ Falha grave na campanha ${campaign.id}:`, innerErr.message);
      }
    }
  } catch (err) {
    console.error('❌ ERRO CRÍTICO NO MONITOR:', err.message);
  }
}

// Iniciar monitoramento imediato e depois a cada 10 segundos
monitorCampaigns();
setInterval(monitorCampaigns, 10000);

app.listen(PORT, () => {
  console.log(`Emerald VPS Backend rodando na porta ${PORT}`);
  console.log(`API Pastorini alvo: ${VPS_API_URL}`);
});
