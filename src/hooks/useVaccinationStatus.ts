
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface VaccinationStatus {
  v_id: string;
  student_id: string;
  vaccine_name: string;
  due_date: string | null;
  vaccination_type: string | null;
  status: string | null;
  completed_date: string | null;
  created_at: string;
  students?: {
    s_name: string;
    class: string;
  };
}

export const useVaccinationStatus = () => {
  const { schoolId } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const vaccinationStatusQuery = useQuery({
    queryKey: ['vaccination-status', schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      
      const { data, error } = await supabase
        .from('vaccination_status')
        .select(`
          *,
          students(s_name, class)
        `)
        .order('due_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!schoolId
  });

  const addVaccinationStatusMutation = useMutation({
    mutationFn: async (statusData: Omit<VaccinationStatus, 'v_id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('vaccination_status')
        .insert([statusData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccination-status'] });
      toast({ title: "Vaccination status added successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error adding vaccination status", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  const updateVaccinationStatusMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<VaccinationStatus> & { id: string }) => {
      const { data, error } = await supabase
        .from('vaccination_status')
        .update(updateData)
        .eq('v_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccination-status'] });
      toast({ title: "Vaccination status updated successfully!" });
    }
  });

  const deleteVaccinationStatusMutation = useMutation({
    mutationFn: async (statusId: string) => {
      const { error } = await supabase
        .from('vaccination_status')
        .delete()
        .eq('v_id', statusId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccination-status'] });
      toast({ title: "Vaccination status deleted successfully!" });
    }
  });

  return {
    vaccinationStatus: vaccinationStatusQuery.data || [],
    isLoading: vaccinationStatusQuery.isLoading,
    addVaccinationStatus: addVaccinationStatusMutation.mutate,
    updateVaccinationStatus: updateVaccinationStatusMutation.mutate,
    deleteVaccinationStatus: deleteVaccinationStatusMutation.mutate
  };
};
