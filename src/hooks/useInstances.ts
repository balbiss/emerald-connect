import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface Instance {
  id: string;
  user_id: string;
  instance_id_api: string;
  name: string;
  status: string;
  proxy_url?: string;
  reject_calls: boolean;
  always_online: boolean;
  read_messages: boolean;
  ignore_groups: boolean;
  created_at: string;
}

export function useInstances() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [planLimit, setPlanLimit] = useState(0);

  const fetchInstances = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return;

    try {
      // Fetch instances
      const { data: instData, error: instError } = await supabase
        .from("whatsapp_instances")
        .select("*")
        .order("created_at", { ascending: false });

      if (instError) throw instError;
      setInstances(instData || []);

      // Fetch plan limit via profile join
      const { data: profData, error: profError } = await supabase
        .from("profiles")
        .select("plans(max_instances)")
        .single();

      if (profError) throw profError;
      setPlanLimit((profData as any).plans?.max_instances || 0);

    } catch (error: any) {
      console.error("Error fetching instances:", error);
      toast.error("Erro ao carregar instâncias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstances();

    // Realtime subscription
    const channel = supabase
      .channel("whatsapp_instances_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "whatsapp_instances",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setInstances((prev) => [payload.new as Instance, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setInstances((prev) =>
              prev.map((i) => (i.id === payload.new.id ? (payload.new as Instance) : i))
            );
            if (payload.old.status !== payload.new.status) {
                toast.info(`Instância "${payload.new.name}" agora está ${payload.new.status}`);
            }
          } else if (payload.eventType === "DELETE") {
            setInstances((prev) => prev.filter((i) => i.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { instances, loading, planLimit, refresh: fetchInstances };
}
