
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'teacher';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  schoolId: string | null;
  assignedClass: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string, role: 'teacher' | 'admin', schoolName: string, assignedClass?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [assignedClass, setAssignedClass] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(async () => {
            await fetchUserRoleAndSchool(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
          setSchoolId(null);
          setAssignedClass(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRoleAndSchool(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoleAndSchool = async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId);

      // Check legacy tables for backward compatibility
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('school_id, assigned_class')
        .eq('user_id', userId)
        .maybeSingle();

      if (teacherError) {
        console.error('Teacher query error:', teacherError);
      }

      if (teacherData) {
        console.log('User is a teacher (legacy):', teacherData);
        setUserRole('teacher');
        setSchoolId(teacherData.school_id);
        setAssignedClass(teacherData.assigned_class);
        return;
      }

      // Check if user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('school_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (adminError) {
        console.error('Admin query error:', adminError);
      }

      if (adminData) {
        console.log('User is an admin (legacy):', adminData);
        setUserRole('admin');
        setSchoolId(adminData.school_id);
        return;
      }

      // No role found
      console.log('No role found for user');
      setUserRole(null);
      setSchoolId(null);
      setAssignedClass(null);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in."
      });
    }

    return { error };
  };

  const signUp = async (email: string, password: string, name: string, role: 'teacher' | 'admin', schoolName: string, assignedClass?: string) => {
    console.log('Attempting sign up for:', email, 'Role:', role, 'School:', schoolName);
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }

    if (data.user) {
      try {
        console.log('User created, setting up profile...');
        
        // Check if school exists by name
        const { data: existingSchool, error: schoolQueryError } = await supabase
          .from('schools')
          .select('school_id')
          .eq('school_name', schoolName)
          .maybeSingle();

        if (schoolQueryError) {
          console.error('School query error:', schoolQueryError);
          toast({
            title: "School Lookup Failed",
            description: schoolQueryError.message,
            variant: "destructive"
          });
          return { error: schoolQueryError };
        }

        let schoolIdValue: string;

        if (existingSchool) {
          console.log('School exists:', existingSchool);
          schoolIdValue = existingSchool.school_id;
        } else {
          console.log('Creating new school:', schoolName);
          const { data: newSchool, error: schoolError } = await supabase
            .from('schools')
            .insert([{ school_name: schoolName }])
            .select('school_id')
            .single();

          if (schoolError) {
            console.error('School creation error:', schoolError);
            toast({
              title: "School Creation Failed",
              description: schoolError.message,
              variant: "destructive"
            });
            return { error: schoolError };
          }

          console.log('New school created:', newSchool);
          schoolIdValue = newSchool.school_id;
        }

        // Create user profile in appropriate table
        const profileData = {
          user_id: data.user.id,
          name,
          email,
          school_id: schoolIdValue
        };

        console.log('Creating profile with data:', profileData);

        if (role === 'teacher') {
          const { error: profileError } = await supabase
            .from('teachers')
            .insert([{ 
              user_id: profileData.user_id,
              t_name: profileData.name,
              email: profileData.email,
              school_id: profileData.school_id,
              assigned_class: assignedClass || 'General'
            }]);

          if (profileError) {
            console.error('Teacher profile creation error:', profileError);
            toast({
              title: "Profile Creation Failed",
              description: profileError.message,
              variant: "destructive"
            });
            return { error: profileError };
          }
        } else {
          const { error: profileError } = await supabase
            .from('admins')
            .insert([profileData]);

          if (profileError) {
            console.error('Admin profile creation error:', profileError);
            toast({
              title: "Profile Creation Failed",
              description: profileError.message,
              variant: "destructive"
            });
            return { error: profileError };
          }
        }

        // Role entry will be handled by database policies and functions

        console.log('Profile created successfully');
        toast({
          title: "Registration Successful!",
          description: "Please check your email to verify your account."
        });
      } catch (err) {
        console.error('Registration error:', err);
        toast({
          title: "Registration Failed",
          description: "An unexpected error occurred during registration.",
          variant: "destructive"
        });
        return { error: err };
      }
    }

    return { error: null };
  };

  const signOut = async () => {
    console.log('Signing out');
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setUserRole(null);
      setSchoolId(null);
      setAssignedClass(null);
      toast({
        title: "Logged out successfully",
        description: "See you next time!"
      });
    }
  };

  const value = {
    user,
    session,
    userRole,
    schoolId,
    assignedClass,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
