
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Registration {
  id: string;
  uid: string;
  category: string;
  full_name: string;
  address: string;
  whatsapp_number: string;
  mobile_number: string;
  panchayath: string;
  ward: string;
  pro_details: string;
  status: "Approved" | "Pending" | "Rejected";
  created_at: string;
  updated_at: string;
}

export const useRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching registrations:', error);
        toast({
          title: "Error",
          description: "Failed to fetch registrations",
          variant: "destructive"
        });
        return;
      }

      setRegistrations(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRegistrationStatus = async (id: string, status: "Approved" | "Pending" | "Rejected") => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update registration status",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Registration status updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchRegistrations();

    // Set up real-time subscription
    const channel = supabase
      .channel('registrations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registrations'
        },
        () => {
          fetchRegistrations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    registrations,
    isLoading,
    updateRegistrationStatus,
    refreshRegistrations: fetchRegistrations
  };
};
