
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface NutritionLog {
  n_id: string;
  student_id: string;
  date: string;
  present: boolean | null;
  calories: number | null;
  protein_g: number | null;
  created_at: string;
  students?: {
    s_name: string;
    class: string;
  };
}

export const useNutritionLogs = () => {
  const { schoolId } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const nutritionLogsQuery = useQuery({
    queryKey: ['nutrition-logs', schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      
      const { data, error } = await supabase
        .from('nutrition_logs')
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

  const addNutritionLogMutation = useMutation({
    mutationFn: async (logData: Omit<NutritionLog, 'n_id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('nutrition_logs')
        .insert([logData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-logs'] });
      toast({ title: "Nutrition log added successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error adding nutrition log", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  const updateNutritionLogMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<NutritionLog> & { id: string }) => {
      const { data, error } = await supabase
        .from('nutrition_logs')
        .update(updateData)
        .eq('n_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-logs'] });
      toast({ title: "Nutrition log updated successfully!" });
    }
  });

  const deleteNutritionLogMutation = useMutation({
    mutationFn: async (logId: string) => {
      const { error } = await supabase
        .from('nutrition_logs')
        .delete()
        .eq('n_id', logId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-logs'] });
      toast({ title: "Nutrition log deleted successfully!" });
    }
  });

  return {
    nutritionLogs: nutritionLogsQuery.data || [],
    isLoading: nutritionLogsQuery.isLoading,
    addNutritionLog: addNutritionLogMutation.mutate,
    updateNutritionLog: updateNutritionLogMutation.mutate,
    deleteNutritionLog: deleteNutritionLogMutation.mutate
  };
};
