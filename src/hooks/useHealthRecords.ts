
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface HealthRecord {
  h_id: string;
  student_id: string;
  date: string;
  height_cm: number | null;
  weight_kg: number | null;
  bmi: number | null;
  vision: string | null;
  sickle_cell_status: string | null;
  sickle_cell_type: string | null;
  stage: string | null;
  created_at: string;
  students?: {
    s_name: string;
    class: string;
  };
}

export const useHealthRecords = () => {
  const { schoolId } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const healthRecordsQuery = useQuery({
    queryKey: ['health-records', schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      
      const { data, error } = await supabase
        .from('health_records')
        .select(`
          *,
          students(s_name, class)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!schoolId
  });

  const addHealthRecordMutation = useMutation({
    mutationFn: async (recordData: Omit<HealthRecord, 'h_id' | 'created_at' | 'bmi'> & { height_cm: number; weight_kg: number }) => {
      // Calculate BMI
      const bmi = recordData.weight_kg / Math.pow(recordData.height_cm / 100, 2);
      
      const { data, error } = await supabase
        .from('health_records')
        .insert([{ ...recordData, bmi }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: "Health record added successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error adding health record", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  const updateHealthRecordMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<HealthRecord> & { id: string }) => {
      // Recalculate BMI if height or weight changed
      let finalData = { ...updateData };
      if (updateData.height_cm && updateData.weight_kg) {
        finalData.bmi = updateData.weight_kg / Math.pow(updateData.height_cm / 100, 2);
      }

      const { data, error } = await supabase
        .from('health_records')
        .update(finalData)
        .eq('h_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: "Health record updated successfully!" });
    }
  });

  const deleteHealthRecordMutation = useMutation({
    mutationFn: async (recordId: string) => {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('h_id', recordId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: "Health record deleted successfully!" });
    }
  });

  return {
    healthRecords: healthRecordsQuery.data || [],
    isLoading: healthRecordsQuery.isLoading,
    addHealthRecord: addHealthRecordMutation.mutate,
    updateHealthRecord: updateHealthRecordMutation.mutate,
    deleteHealthRecord: deleteHealthRecordMutation.mutate
  };
};
