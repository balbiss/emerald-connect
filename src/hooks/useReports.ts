import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface MessageLog {
  id: string;
  user_id: string;
  campaign_id: string;
  remote_jid: string;
  message_id_api?: string;
  status: string;
  error_message?: string;
  created_at: string;
  campaigns?: {
    name: string;
  };
}

export function useReports() {
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("message_logs")
        .select("*, campaigns(name)")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      console.error("Error fetching logs:", error);
      toast.error("Erro ao carregar relatórios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    // Realtime for logs (optional but nice)
    const channel = supabase
      .channel("message_logs_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message_logs" },
        (payload) => {
          setLogs((prev) => [payload.new as MessageLog, ...prev.slice(0, 99)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { logs, loading, refresh: fetchLogs };
}
