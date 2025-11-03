
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'teacher');

-- Create user_roles table to store role assignments
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  school_id UUID REFERENCES public.schools(school_id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, school_id)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND school_id = (SELECT get_user_school_id())
  );
END;
$$;

-- Create security definer function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(required_role user_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 
      FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = required_role
      AND school_id = (SELECT get_user_school_id())
    )
  );
END;
$$;

-- Update teachers table to include assigned_class properly
ALTER TABLE public.teachers 
ALTER COLUMN assigned_class SET NOT NULL;

-- Create security definer function to get teacher's assigned class
CREATE OR REPLACE FUNCTION public.get_teacher_assigned_class()
RETURNS TEXT
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT assigned_class 
    FROM public.teachers 
    WHERE user_id = auth.uid()
  );
END;
$$;

-- Update existing RLS policies for students table to include role-based access
DROP POLICY IF EXISTS "Users can view students from their school" ON public.students;
DROP POLICY IF EXISTS "Users can insert students to their school" ON public.students;
DROP POLICY IF EXISTS "Users can update students from their school" ON public.students;
DROP POLICY IF EXISTS "Users can delete students from their school" ON public.students;

CREATE POLICY "Role-based student access for SELECT" 
ON public.students 
FOR SELECT 
TO authenticated 
USING (
  school_id = (SELECT get_user_school_id()) 
  AND (
    public.has_role('admin'::user_role) 
    OR (
      public.has_role('teacher'::user_role) 
      AND class = public.get_teacher_assigned_class()
    )
  )
);

CREATE POLICY "Role-based student access for INSERT" 
ON public.students 
FOR INSERT 
TO authenticated 
WITH CHECK (
  school_id = (SELECT get_user_school_id()) 
  AND (
    public.has_role('admin'::user_role) 
    OR (
      public.has_role('teacher'::user_role) 
      AND class = public.get_teacher_assigned_class()
    )
  )
);

CREATE POLICY "Role-based student access for UPDATE" 
ON public.students 
FOR UPDATE 
TO authenticated 
USING (
  school_id = (SELECT get_user_school_id()) 
  AND public.has_role('admin'::user_role)
)
WITH CHECK (
  school_id = (SELECT get_user_school_id()) 
  AND public.has_role('admin'::user_role)
);

CREATE POLICY "Role-based student access for DELETE" 
ON public.students 
FOR DELETE 
TO authenticated 
USING (
  school_id = (SELECT get_user_school_id()) 
  AND public.has_role('admin'::user_role)
);

-- Update health_records policies for role-based access
DROP POLICY IF EXISTS "Users can view health records from their school" ON public.health_records;
DROP POLICY IF EXISTS "Users can insert health records for their school students" ON public.health_records;
DROP POLICY IF EXISTS "Users can update health records from their school" ON public.health_records;
DROP POLICY IF EXISTS "Users can delete health records from their school" ON public.health_records;

CREATE POLICY "Role-based health records access for SELECT" 
ON public.health_records 
FOR SELECT 
TO authenticated 
USING (
  student_id IN (
    SELECT student_id 
    FROM students 
    WHERE school_id = (SELECT get_user_school_id())
    AND (
      public.has_role('admin'::user_role) 
      OR (
        public.has_role('teacher'::user_role) 
        AND class = public.get_teacher_assigned_class()
      )
    )
  )
);

CREATE POLICY "Role-based health records access for INSERT" 
ON public.health_records 
FOR INSERT 
TO authenticated 
WITH CHECK (
  student_id IN (
    SELECT student_id 
    FROM students 
    WHERE school_id = (SELECT get_user_school_id())
    AND (
      public.has_role('admin'::user_role) 
      OR (
        public.has_role('teacher'::user_role) 
        AND class = public.get_teacher_assigned_class()
      )
    )
  )
);

CREATE POLICY "Role-based health records access for UPDATE" 
ON public.health_records 
FOR UPDATE 
TO authenticated 
USING (
  student_id IN (
    SELECT student_id 
    FROM students 
    WHERE school_id = (SELECT get_user_school_id())
    AND public.has_role('admin'::user_role)
  )
)
WITH CHECK (
  student_id IN (
    SELECT student_id 
    FROM students 
    WHERE school_id = (SELECT get_user_school_id())
    AND public.has_role('admin'::user_role)
  )
);

CREATE POLICY "Role-based health records access for DELETE" 
ON public.health_records 
FOR DELETE 
TO authenticated 
USING (
  student_id IN (
    SELECT student_id 
    FROM students 
    WHERE school_id = (SELECT get_user_school_id())
    AND public.has_role('admin'::user_role)
  )
);

-- Apply similar role-based policies to nutrition_logs and vaccination_status
DROP POLICY IF EXISTS "Users can view nutrition logs from their school" ON public.nutrition_logs;
DROP POLICY IF EXISTS "Users can insert nutrition logs for their school students" ON public.nutrition_logs;
DROP POLICY IF EXISTS "Users can update nutrition logs from their school" ON public.nutrition_logs;
DROP POLICY IF EXISTS "Users can delete nutrition logs from their school" ON public.nutrition_logs;

CREATE POLICY "Role-based nutrition logs access for SELECT" 
ON public.nutrition_logs 
FOR SELECT 
TO authenticated 
USING (
  student_id IN (
    SELECT student_id 
    FROM students 
    WHERE school_id = (SELECT get_user_school_id())
    AND (
      public.has_role('admin'::user_role) 
      OR (
        public.has_role('teacher'::user_role) 
        AND class = public.get_teacher_assigned_class()
      )
    )
  )
);

CREATE POLICY "Role-based nutrition logs access for INSERT" 
ON public.nutrition_logs 
FOR INSERT 
TO authenticated 
WITH CHECK (
  student_id IN (
    SELECT student_id 
    FROM students 
    WHERE school_id = (SELECT get_user_school_id())
    AND (
      public.has_role('admin'::user_role) 
      OR (
        public.has_role('teacher'::user_role) 
        AND class = public.get_teacher_assigned_class()
      )
    )
  )
);

CREATE POLICY "Role-based nutrition logs access for UPDATE" 
ON public.nutrition_logs 
FOR UPDATE 
TO authenticated 
USING (
  student_id IN (
    SELECT student_id 
    FROM students 
    WHERE school_id = (SELECT get_user_school_id())
    AND public.has_role('admin'::user_role)
  )
)
WITH CHECK (
  student_id IN (
    SELECT student_id 
    FROM students 
    WHERE school_id = (SELECT get_user_school_id())
    AND public.has_role('admin'::user_role)
  )
);

CREATE POLICY "Role-based nutrition logs access for DELETE" 
ON public.nutrition_logs 
FOR DELETE 
TO authenticated 
USING (
  student_id IN (
    SELECT student_id 
    FROM students 
    WHERE school_id = (SELECT get_user_school_id())
    AND public.has_role('admin'::user_role)
  )
);

-- Apply role-based policies to vaccination_status
DROP POLICY IF EXISTS "Users can view vaccination status from their school" ON public.vaccination_status;
DROP POLICY IF EXISTS "Users can insert vaccination status for their school students" ON public.vaccination_status;
DROP POLICY IF EXISTS "Users can update vaccination status from their school" ON public.vaccination_status;
DROP POLICY IF EXISTS "Users can delete vaccination status from their school" ON public.vaccination_status;

CREATE POLICY "Role-based vaccination status access for SELECT" 
ON public.vaccination_status 
FOR SELECT 
TO authenticated 
USING (
  student_id IN (
    SELECT student_id 
    FROM students 
    WHERE school_id = (SELECT get_user_school_id())
    AND (
      public.has_role('admin'::user_role) 
      OR (
        public.has_role('teacher'::user_role) 
        AND class = public.get_teacher_assigned_class()
      )
    )
  )
);

CREATE POLICY "Role-based vaccination status access for INSERT" 
ON public.vaccination_status 
FOR INSERT 
TO authenticated 
WITH CHECK (
  student_id IN (
    SELECT student_id 
    FROM students 
    WHERE school_id = (SELECT get_user_school_id())
    AND (
      public.has_role('admin'::user_role) 
      OR (
        public.has_role('teacher'::user_role) 
        AND class = public.get_teacher_assigned_class()
      )
    )
  )
);

CREATE POLICY "Role-based vaccination status access for UPDATE" 
ON public.vaccination_status 
FOR UPDATE 
TO authenticated 
USING (
  student_id IN (
    SELECT student_id 
    FROM students 
    WHERE school_id = (SELECT get_user_school_id())
    AND public.has_role('admin'::user_role)
  )
)
WITH CHECK (
  student_id IN (
    SELECT student_id 
    FROM students 
    WHERE school_id = (SELECT get_user_school_id())
    AND public.has_role('admin'::user_role)
  )
);

CREATE POLICY "Role-based vaccination status access for DELETE" 
ON public.vaccination_status 
FOR DELETE 
TO authenticated 
USING (
  student_id IN (
    SELECT student_id 
    FROM students 
    WHERE school_id = (SELECT get_user_school_id())
    AND public.has_role('admin'::user_role)
  )
);

-- Create RLS policy for user_roles table
CREATE POLICY "Users can view their own role" 
ON public.user_roles 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- Enable realtime for user_roles table
ALTER TABLE public.user_roles REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;
