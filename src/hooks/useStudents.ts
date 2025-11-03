
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Student {
  student_id: string;
  s_name: string;
  class: string;
  age: number | null;
  gender: string | null;
  school_id: string | null;
  created_at: string;
}

export interface StudentWithHealth extends Student {
  latest_bmi: number | null;
  status: string;
  last_checkup: string | null;
}

export const useStudents = () => {
  const { schoolId } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const studentsQuery = useQuery({
    queryKey: ['students', schoolId],
    queryFn: async () => {
      if (!schoolId) return [];
      
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          health_records(bmi, date)
        `)
        .eq('school_id', schoolId)
        .order('s_name');

      if (error) throw error;

      return data.map((student: any) => {
        const latestHealth = student.health_records
          ?.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        
        const bmi = latestHealth?.bmi || null;
        const status = bmi ? (bmi < 18.5 ? 'Underweight' : 'Normal') : 'No Data';
        
        return {
          ...student,
          latest_bmi: bmi,
          status,
          last_checkup: latestHealth?.date || null
        };
      });
    },
    enabled: !!schoolId
  });

  const addStudentMutation = useMutation({
    mutationFn: async (studentData: Omit<Student, 'student_id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('students')
        .insert([{ ...studentData, school_id: schoolId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: "Student added successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error adding student", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Student> & { id: string }) => {
      const { data, error } = await supabase
        .from('students')
        .update(updateData)
        .eq('student_id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: "Student updated successfully!" });
    }
  });

  const deleteStudentMutation = useMutation({
    mutationFn: async (studentId: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('student_id', studentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: "Student deleted successfully!" });
    }
  });

  return {
    students: studentsQuery.data || [],
    isLoading: studentsQuery.isLoading,
    addStudent: addStudentMutation.mutate,
    updateStudent: updateStudentMutation.mutate,
    deleteStudent: deleteStudentMutation.mutate
  };
};
