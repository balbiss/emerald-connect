import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface Campaign {
  id: string;
  name: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'SCHEDULED' | 'pending' | 'processing' | 'completed' | 'scheduled' | 'paused';
  total_numbers: number;
  scheduled_at: string;
  created_at: string;
  sent_count?: number;
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      // Busca campanhas com sent_count diretamente do banco (campo atualizado pelo RPC)
      // Não usa message_logs para contar (evita N queries lentas e inconsistência de progresso)
      const { data: campaignsData, error: campaignsError } = await supabase
        .from("campaigns")
        .select("id, name, status, total_numbers, scheduled_at, created_at, sent_count")
        .order("created_at", { ascending: false });

      if (campaignsError) throw campaignsError;

      setCampaigns(campaignsData || []);
    } catch (error: any) {
      console.error("Error fetching campaigns:", error);
      toast.error("Erro ao carregar campanhas: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();

    const channel = supabase
      .channel("campaigns_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "campaigns" },
        () => fetchCampaigns()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { campaigns, loading, refresh: fetchCampaigns };
}

export function useCampaignActions() {
  const [isCreating, setIsCreating] = useState(false);

  const createCampaign = async (campaignData: {
    name: string;
    instance_id: string;
    numbers_list: string[];
    message_config: any;
    scheduled_at?: string;
  }) => {
    setIsCreating(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Usuário não autenticado");

      const novaCampanha = {
        name: campaignData.name,
        user_id: userData.user.id,
        instance_id_api: campaignData.instance_id,
        numbers_list: campaignData.numbers_list,
        message_config: campaignData.message_config,
        total_numbers: campaignData.numbers_list.length,
        status: campaignData.scheduled_at ? "scheduled" : "pending",
        scheduled_at: campaignData.scheduled_at || null
      };

      const { data, error } = await supabase
        .from("campaigns")
        .insert([novaCampanha])
        .select();

      if (error) {
         toast.error(`Falha bruta: ${error.message} (Cód: ${error.code})`);
         console.error("ERRO COMPLETO NATIVO:", error);
         
         // Se for violacao de check do banco de dados (letra PENDING), faz o fallback:
         if (error.code === '23514') {
             const { error: errFallback } = await supabase.from("campaigns").insert([{...novaCampanha, status: 'PENDING'}]);
             if (errFallback) {
                 toast.error(`Falha definitiva: ${errFallback.message}`);
                 return null;
             }
             toast.success("Campanha criada e enviada (Via Fallback PENDING!)");
             return novaCampanha;
         }
         
         return null;
      }
      
      toast.success("Campanha criada com sucesso!");
      return data;
    } catch (error: any) {
      console.error("Error creating campaign try-catch:", error);
      toast.error(error?.message || "Exceção ao criar campanha");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const pauseCampaign = async (id: string) => {
    try {
      const { error } = await supabase
        .from("campaigns")
        .update({ status: 'paused' })
        .eq('id', id);

      if (error) throw error;
      toast.success("Campanha pausada com sucesso!");
      return true;
    } catch (error: any) {
      toast.error("Erro ao pausar: " + error.message);
      return false;
    }
  };

  const resumeCampaign = async (id: string) => {
    try {
      const { error } = await supabase
        .from("campaigns")
        .update({ status: 'pending' })
        .eq('id', id);

      if (error) throw error;
      toast.success("Campanha retomada (enviada para a fila)!");
      return true;
    } catch (error: any) {
      toast.error("Erro ao retomar: " + error.message);
      return false;
    }
  };

  const bulkDeleteCampaigns = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from("campaigns")
        .delete()
        .in('id', ids);

      if (error) throw error;
      toast.success(`${ids.length} campanha(s) removida(s) com sucesso!`);
      return true;
    } catch (error: any) {
      toast.error("Erro ao excluir: " + error.message);
      return false;
    }
  };

  return { createCampaign, pauseCampaign, resumeCampaign, bulkDeleteCampaigns, isCreating };
}
