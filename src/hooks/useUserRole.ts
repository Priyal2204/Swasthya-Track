
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'teacher';

export const useUserRole = (userId: string | null) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [assignedClass, setAssignedClass] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setUserRole(null);
      setSchoolId(null);
      setAssignedClass(null);
      setLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        // Check if user is a teacher
        const { data: teacherData } = await supabase
          .from('teachers')
          .select('school_id, assigned_class')
          .eq('user_id', userId)
          .maybeSingle();

        if (teacherData) {
          setUserRole('teacher');
          setSchoolId(teacherData.school_id);
          setAssignedClass(teacherData.assigned_class);
          setLoading(false);
          return;
        }

        // Check if user is an admin
        const { data: adminData } = await supabase
          .from('admins')
          .select('school_id')
          .eq('user_id', userId)
          .maybeSingle();

        if (adminData) {
          setUserRole('admin');
          setSchoolId(adminData.school_id);
          setAssignedClass(null);
          setLoading(false);
          return;
        }

        // No role found
        setUserRole(null);
        setSchoolId(null);
        setAssignedClass(null);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
        setSchoolId(null);
        setAssignedClass(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [userId]);

  return { userRole, schoolId, assignedClass, loading };
};
