import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Registration = Tables<'registrations'>;

export const useRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all registrations
  const fetchRegistrations = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching registrations:', error);
        toast({
          title: "Error",
          description: "Failed to fetch registrations.",
          variant: "destructive",
        });
        return;
      }

      setRegistrations(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Update status of a registration
  const updateRegistrationStatus = useCallback(
    async (id: string, status: string) => {
      try {
        const { error } = await supabase
          .from('registrations')
          .update({ status })
          .eq('id', id);

        if (error) {
          console.error('Error updating status:', error);
          toast({
            title: "Error",
            description: "Failed to update registration status.",
            variant: "destructive",
          });
          return false;
        }

        toast({
          title: "Success",
          description: "Registration status updated successfully.",
        });

        // Optionally refresh the list
        await fetchRegistrations();

        return true;
      } catch (error) {
        console.error('Unexpected error updating status:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
        return false;
      }
    },
    [toast, fetchRegistrations]
  );

  // Fetch initial data and subscribe to changes
  useEffect(() => {
    fetchRegistrations();

    const channel = supabase
      .channel('registrations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registrations',
        },
        () => {
          fetchRegistrations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRegistrations]);

  return {
    registrations,
    isLoading,
    updateRegistrationStatus,
    refreshRegistrations: fetchRegistrations,
  };
};
