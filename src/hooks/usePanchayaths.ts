
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Panchayath {
  id: string;
  name: string;
  malayalam_name: string;
  district: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const usePanchayaths = () => {
  const [panchayaths, setPanchayaths] = useState<Panchayath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPanchayaths = async () => {
    try {
      const { data, error } = await supabase
        .from('panchayaths')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching panchayaths:', error);
        toast({
          title: "Error",
          description: "Failed to fetch panchayaths",
          variant: "destructive"
        });
        return;
      }

      setPanchayaths(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPanchayath = async (panchayath: Omit<Panchayath, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('panchayaths')
        .insert([panchayath]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add panchayath",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Panchayath added successfully",
      });
      return true;
    } catch (error) {
      console.error('Error adding panchayath:', error);
      return false;
    }
  };

  const updatePanchayath = async (id: string, updates: Partial<Panchayath>) => {
    try {
      const { error } = await supabase
        .from('panchayaths')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update panchayath",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Panchayath updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating panchayath:', error);
      return false;
    }
  };

  const deletePanchayath = async (id: string) => {
    try {
      const { error } = await supabase
        .from('panchayaths')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete panchayath",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Panchayath deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting panchayath:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchPanchayaths();

    // Set up real-time subscription
    const channel = supabase
      .channel('panchayaths-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'panchayaths'
        },
        () => {
          fetchPanchayaths();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    panchayaths,
    isLoading,
    addPanchayath,
    updatePanchayath,
    deletePanchayath,
    refreshPanchayaths: fetchPanchayaths
  };
};
