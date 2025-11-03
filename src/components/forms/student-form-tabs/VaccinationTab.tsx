
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

interface VaccinationTabProps {
  vaccinationData: {
    vaccine_name: string;
    vaccination_type: string;
    status: string;
    due_date: string;
    completed_date: string;
  };
  setVaccinationData: (data: any) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onBack: () => void;
  createdStudentId: string | null;
}

const VaccinationTab = ({ vaccinationData, setVaccinationData, onSubmit, isLoading, onBack, createdStudentId }: VaccinationTabProps) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting vaccination form with student ID:', createdStudentId);
    
    if (!createdStudentId) {
      toast({ title: "Error", description: "Student must be created first", variant: "destructive" });
      return;
    }

    if (!vaccinationData.vaccine_name) {
      toast({ 
        title: "Error", 
        description: "Please fill in vaccine name", 
        variant: "destructive" 
      });
      return;
    }

    onSubmit({
      student_id: createdStudentId,
      vaccine_name: vaccinationData.vaccine_name,
      vaccination_type: vaccinationData.vaccination_type || null,
      status: vaccinationData.status || 'Pending',
      due_date: vaccinationData.due_date || null,
      completed_date: vaccinationData.completed_date || null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="vaccine_name">Vaccine Name *</Label>
        <Input
          id="vaccine_name"
          value={vaccinationData.vaccine_name}
          onChange={(e) => setVaccinationData({ ...vaccinationData, vaccine_name: e.target.value })}
          required
          placeholder="e.g., MMR, Polio"
        />
      </div>

      <div>
        <Label htmlFor="vaccination_type">Vaccination Type</Label>
        <Input
          id="vaccination_type"
          value={vaccinationData.vaccination_type}
          onChange={(e) => setVaccinationData({ ...vaccinationData, vaccination_type: e.target.value })}
          placeholder="e.g., Primary, Booster"
        />
      </div>
      
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={vaccinationData.status} onValueChange={(value) => setVaccinationData({ ...vaccinationData, status: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            type="date"
            value={vaccinationData.due_date}
            onChange={(e) => setVaccinationData({ ...vaccinationData, due_date: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="completed_date">Completed Date</Label>
          <Input
            id="completed_date"
            type="date"
            value={vaccinationData.completed_date}
            onChange={(e) => setVaccinationData({ ...vaccinationData, completed_date: e.target.value })}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="medical-gradient text-white" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Vaccination & Continue'}
        </Button>
      </div>
    </form>
  );
};

export default VaccinationTab;
