
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useDashboardStats = () => {
  const { schoolId } = useAuth();

  return useQuery({
    queryKey: ['dashboard-stats', schoolId],
    queryFn: async () => {
      if (!schoolId) return null;

      // Get total students
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('student_id')
        .eq('school_id', schoolId);

      if (studentsError) throw studentsError;

      const totalStudents = students?.length || 0;

      // Get underweight students (BMI < 18.5)
      const { data: healthRecords, error: healthError } = await supabase
        .from('health_records')
        .select(`
          bmi,
          students!inner(school_id)
        `)
        .eq('students.school_id', schoolId)
        .not('bmi', 'is', null);

      if (healthError) throw healthError;

      const underweightCount = healthRecords?.filter(record => 
        record.bmi && record.bmi < 18.5
      ).length || 0;

      // Get today's meal attendance
      const today = new Date().toISOString().split('T')[0];
      const { data: todayMeals, error: mealsError } = await supabase
        .from('nutrition_logs')
        .select(`
          present,
          students!inner(school_id)
        `)
        .eq('students.school_id', schoolId)
        .eq('date', today);

      if (mealsError) throw mealsError;

      const mealsServedToday = todayMeals?.filter(meal => meal.present).length || 0;

      // Get school name
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .select('school_name')
        .eq('school_id', schoolId)
        .single();

      if (schoolError) throw schoolError;

      return {
        totalStudents,
        underweightCount,
        underweightPercentage: totalStudents > 0 ? Math.round((underweightCount / totalStudents) * 100) : 0,
        mealsServedToday,
        mealAttendancePercentage: totalStudents > 0 ? Math.round((mealsServedToday / totalStudents) * 100) : 0,
        schoolName: schoolData?.school_name || 'Unknown School'
      };
    },
    enabled: !!schoolId,
    refetchInterval: 30000 // Refresh every 30 seconds for real-time updates
  });
};
