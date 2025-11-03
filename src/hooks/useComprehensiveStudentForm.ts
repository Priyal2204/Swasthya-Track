
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useComprehensiveStudentForm = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [createdStudentId, setCreatedStudentId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { schoolId } = useAuth();
  const queryClient = useQueryClient();

  // Student form data
  const [studentData, setStudentData] = useState({
    s_name: '',
    class: '',
    age: '',
    gender: ''
  });

  // Health record form data
  const [healthData, setHealthData] = useState({
    date: new Date().toISOString().split('T')[0],
    height_cm: '',
    weight_kg: '',
    vision: '',
    sickle_cell_status: '',
    sickle_cell_type: '',
    stage: ''
  });

  // Vaccination status form data
  const [vaccinationData, setVaccinationData] = useState({
    vaccine_name: '',
    vaccination_type: '',
    status: 'Pending',
    due_date: '',
    completed_date: ''
  });

  // Nutrition log form data
  const [nutritionData, setNutritionData] = useState({
    date: new Date().toISOString().split('T')[0],
    present: false,
    calories: '',
    protein_g: ''
  });

  // Student creation mutation
  const addStudentMutation = useMutation({
    mutationFn: async (studentData: any) => {
      console.log('Creating student with data:', studentData);
      const { data, error } = await supabase
        .from('students')
        .insert([{ ...studentData, school_id: schoolId }])
        .select()
        .single();

      if (error) {
        console.error('Error creating student:', error);
        throw error;
      }
      console.log('Student created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setCreatedStudentId(data.student_id);
      console.log('Student ID set:', data.student_id);
      toast({ title: "Student added successfully!" });
      setActiveTab("health");
    },
    onError: (error: any) => {
      console.error('Student creation error:', error);
      toast({ 
        title: "Error adding student", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  // Health record creation mutation
  const addHealthRecordMutation = useMutation({
    mutationFn: async (recordData: any) => {
      console.log('Creating health record with data:', recordData);
      const bmi = recordData.height_cm && recordData.weight_kg 
        ? recordData.weight_kg / Math.pow(recordData.height_cm / 100, 2) 
        : null;
      
      const { data, error } = await supabase
        .from('health_records')
        .insert([{ ...recordData, bmi }])
        .select()
        .single();

      if (error) {
        console.error('Error creating health record:', error);
        throw error;
      }
      console.log('Health record created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-records'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: "Health record added successfully!" });
      setActiveTab("vaccination");
    },
    onError: (error: any) => {
      console.error('Health record creation error:', error);
      toast({ 
        title: "Error adding health record", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  // Vaccination status creation mutation
  const addVaccinationStatusMutation = useMutation({
    mutationFn: async (statusData: any) => {
      console.log('Creating vaccination status with data:', statusData);
      const { data, error } = await supabase
        .from('vaccination_status')
        .insert([statusData])
        .select()
        .single();

      if (error) {
        console.error('Error creating vaccination status:', error);
        throw error;
      }
      console.log('Vaccination status created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaccination-status'] });
      toast({ title: "Vaccination status added successfully!" });
      setActiveTab("nutrition");
    },
    onError: (error: any) => {
      console.error('Vaccination status creation error:', error);
      toast({ 
        title: "Error adding vaccination status", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  // Nutrition log creation mutation
  const addNutritionLogMutation = useMutation({
    mutationFn: async (logData: any) => {
      console.log('Creating nutrition log with data:', logData);
      const { data, error } = await supabase
        .from('nutrition_logs')
        .insert([logData])
        .select()
        .single();

      if (error) {
        console.error('Error creating nutrition log:', error);
        throw error;
      }
      console.log('Nutrition log created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-logs'] });
      toast({ title: "Nutrition log added successfully!" });
      resetAllForms();
    },
    onError: (error: any) => {
      console.error('Nutrition log creation error:', error);
      toast({ 
        title: "Error adding nutrition log", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  const resetAllForms = () => {
    setStudentData({ s_name: '', class: '', age: '', gender: '' });
    setHealthData({
      date: new Date().toISOString().split('T')[0],
      height_cm: '',
      weight_kg: '',
      vision: '',
      sickle_cell_status: '',
      sickle_cell_type: '',
      stage: ''
    });
    setVaccinationData({
      vaccine_name: '',
      vaccination_type: '',
      status: 'Pending',
      due_date: '',
      completed_date: ''
    });
    setNutritionData({
      date: new Date().toISOString().split('T')[0],
      present: false,
      calories: '',
      protein_g: ''
    });
    setCreatedStudentId(null);
    setActiveTab("student");
  };

  return {
    activeTab,
    setActiveTab,
    createdStudentId,
    studentData,
    setStudentData,
    healthData,
    setHealthData,
    vaccinationData,
    setVaccinationData,
    nutritionData,
    setNutritionData,
    addStudentMutation,
    addHealthRecordMutation,
    addVaccinationStatusMutation,
    addNutritionLogMutation,
    resetAllForms
  };
};
