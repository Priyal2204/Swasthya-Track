
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useComprehensiveStudentForm } from "@/hooks/useComprehensiveStudentForm";
import StudentInfoTab from "./student-form-tabs/StudentInfoTab";
import HealthRecordTab from "./student-form-tabs/HealthRecordTab";
import VaccinationTab from "./student-form-tabs/VaccinationTab";
import NutritionTab from "./student-form-tabs/NutritionTab";

interface ComprehensiveAddStudentFormProps {
  trigger?: React.ReactNode;
}

const ComprehensiveAddStudentForm = ({ trigger }: ComprehensiveAddStudentFormProps) => {
  const [open, setOpen] = useState(false);
  
  const {
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
  } = useComprehensiveStudentForm();

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetAllForms();
    }
  };

  const handleTabChange = (value: string) => {
    if (value === "student" || createdStudentId) {
      setActiveTab(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="medical-gradient text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Student & Records
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Student & Complete Records</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="student" className="cursor-pointer">
              Student Info
            </TabsTrigger>
            <TabsTrigger 
              value="health" 
              disabled={!createdStudentId}
              className={createdStudentId ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
            >
              Health Record
            </TabsTrigger>
            <TabsTrigger 
              value="vaccination" 
              disabled={!createdStudentId}
              className={createdStudentId ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
            >
              Vaccination
            </TabsTrigger>
            <TabsTrigger 
              value="nutrition" 
              disabled={!createdStudentId}
              className={createdStudentId ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
            >
              Meal Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <StudentInfoTab
              studentData={studentData}
              setStudentData={setStudentData}
              onSubmit={addStudentMutation.mutate}
              isLoading={addStudentMutation.isPending}
              onCancel={() => setOpen(false)}
            />
          </TabsContent>

          <TabsContent value="health">
            <HealthRecordTab
              healthData={healthData}
              setHealthData={setHealthData}
              onSubmit={addHealthRecordMutation.mutate}
              isLoading={addHealthRecordMutation.isPending}
              onBack={() => setActiveTab("student")}
              createdStudentId={createdStudentId}
            />
          </TabsContent>

          <TabsContent value="vaccination">
            <VaccinationTab
              vaccinationData={vaccinationData}
              setVaccinationData={setVaccinationData}
              onSubmit={addVaccinationStatusMutation.mutate}
              isLoading={addVaccinationStatusMutation.isPending}
              onBack={() => setActiveTab("health")}
              createdStudentId={createdStudentId}
            />
          </TabsContent>

          <TabsContent value="nutrition">
            <NutritionTab
              nutritionData={nutritionData}
              setNutritionData={setNutritionData}
              onSubmit={(data) => {
                addNutritionLogMutation.mutate(data);
                setOpen(false);
              }}
              isLoading={addNutritionLogMutation.isPending}
              onBack={() => setActiveTab("vaccination")}
              createdStudentId={createdStudentId}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ComprehensiveAddStudentForm;
