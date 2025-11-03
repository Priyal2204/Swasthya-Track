
-- Enable RLS on all tables and create comprehensive policies

-- Students table policies
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view students from their school" 
ON public.students 
FOR SELECT 
TO authenticated 
USING (school_id = (SELECT get_user_school_id()));

CREATE POLICY "Users can insert students to their school" 
ON public.students 
FOR INSERT 
TO authenticated 
WITH CHECK (school_id = (SELECT get_user_school_id()));

CREATE POLICY "Users can update students from their school" 
ON public.students 
FOR UPDATE 
TO authenticated 
USING (school_id = (SELECT get_user_school_id()))
WITH CHECK (school_id = (SELECT get_user_school_id()));

CREATE POLICY "Users can delete students from their school" 
ON public.students 
FOR DELETE 
TO authenticated 
USING (school_id = (SELECT get_user_school_id()));

-- Health records table policies
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view health records from their school" 
ON public.health_records 
FOR SELECT 
TO authenticated 
USING (student_id IN (SELECT student_id FROM students WHERE school_id = (SELECT get_user_school_id())));

CREATE POLICY "Users can insert health records for their school students" 
ON public.health_records 
FOR INSERT 
TO authenticated 
WITH CHECK (student_id IN (SELECT student_id FROM students WHERE school_id = (SELECT get_user_school_id())));

CREATE POLICY "Users can update health records from their school" 
ON public.health_records 
FOR UPDATE 
TO authenticated 
USING (student_id IN (SELECT student_id FROM students WHERE school_id = (SELECT get_user_school_id())))
WITH CHECK (student_id IN (SELECT student_id FROM students WHERE school_id = (SELECT get_user_school_id())));

CREATE POLICY "Users can delete health records from their school" 
ON public.health_records 
FOR DELETE 
TO authenticated 
USING (student_id IN (SELECT student_id FROM students WHERE school_id = (SELECT get_user_school_id())));

-- Nutrition logs table policies
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view nutrition logs from their school" 
ON public.nutrition_logs 
FOR SELECT 
TO authenticated 
USING (student_id IN (SELECT student_id FROM students WHERE school_id = (SELECT get_user_school_id())));

CREATE POLICY "Users can insert nutrition logs for their school students" 
ON public.nutrition_logs 
FOR INSERT 
TO authenticated 
WITH CHECK (student_id IN (SELECT student_id FROM students WHERE school_id = (SELECT get_user_school_id())));

CREATE POLICY "Users can update nutrition logs from their school" 
ON public.nutrition_logs 
FOR UPDATE 
TO authenticated 
USING (student_id IN (SELECT student_id FROM students WHERE school_id = (SELECT get_user_school_id())))
WITH CHECK (student_id IN (SELECT student_id FROM students WHERE school_id = (SELECT get_user_school_id())));

CREATE POLICY "Users can delete nutrition logs from their school" 
ON public.nutrition_logs 
FOR DELETE 
TO authenticated 
USING (student_id IN (SELECT student_id FROM students WHERE school_id = (SELECT get_user_school_id())));

-- Vaccination status table policies
ALTER TABLE public.vaccination_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view vaccination status from their school" 
ON public.vaccination_status 
FOR SELECT 
TO authenticated 
USING (student_id IN (SELECT student_id FROM students WHERE school_id = (SELECT get_user_school_id())));

CREATE POLICY "Users can insert vaccination status for their school students" 
ON public.vaccination_status 
FOR INSERT 
TO authenticated 
WITH CHECK (student_id IN (SELECT student_id FROM students WHERE school_id = (SELECT get_user_school_id())));

CREATE POLICY "Users can update vaccination status from their school" 
ON public.vaccination_status 
FOR UPDATE 
TO authenticated 
USING (student_id IN (SELECT student_id FROM students WHERE school_id = (SELECT get_user_school_id())))
WITH CHECK (student_id IN (SELECT student_id FROM students WHERE school_id = (SELECT get_user_school_id())));

CREATE POLICY "Users can delete vaccination status from their school" 
ON public.vaccination_status 
FOR DELETE 
TO authenticated 
USING (student_id IN (SELECT student_id FROM students WHERE school_id = (SELECT get_user_school_id())));

-- Teachers table policies
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view teachers from their school" 
ON public.teachers 
FOR SELECT 
TO authenticated 
USING (school_id = (SELECT get_user_school_id()));

-- Admins table policies  
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view admins from their school" 
ON public.admins 
FOR SELECT 
TO authenticated 
USING (school_id = (SELECT get_user_school_id()));

-- Enable realtime for all tables
ALTER TABLE public.students REPLICA IDENTITY FULL;
ALTER TABLE public.health_records REPLICA IDENTITY FULL;
ALTER TABLE public.nutrition_logs REPLICA IDENTITY FULL;
ALTER TABLE public.vaccination_status REPLICA IDENTITY FULL;
ALTER TABLE public.teachers REPLICA IDENTITY FULL;
ALTER TABLE public.admins REPLICA IDENTITY FULL;
ALTER TABLE public.schools REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
ALTER PUBLICATION supabase_realtime ADD TABLE public.health_records;
ALTER PUBLICATION supabase_realtime ADD TABLE public.nutrition_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vaccination_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.teachers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admins;
ALTER PUBLICATION supabase_realtime ADD TABLE public.schools;
