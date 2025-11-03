
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

interface HealthRecordTabProps {
  healthData: {
    date: string;
    height_cm: string;
    weight_kg: string;
    vision: string;
    sickle_cell_status: string;
    sickle_cell_type: string;
    stage: string;
  };
  setHealthData: (data: any) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onBack: () => void;
  createdStudentId: string | null;
}

const HealthRecordTab = ({ healthData, setHealthData, onSubmit, isLoading, onBack, createdStudentId }: HealthRecordTabProps) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting health form with student ID:', createdStudentId);
    
    if (!createdStudentId) {
      toast({ title: "Error", description: "Student must be created first", variant: "destructive" });
      return;
    }

    if (!healthData.height_cm || !healthData.weight_kg) {
      toast({ 
        title: "Error", 
        description: "Please fill in required fields (Height and Weight)", 
        variant: "destructive" 
      });
      return;
    }

    onSubmit({
      student_id: createdStudentId,
      date: healthData.date,
      height_cm: parseFloat(healthData.height_cm),
      weight_kg: parseFloat(healthData.weight_kg),
      vision: healthData.vision || null,
      sickle_cell_status: healthData.sickle_cell_status || null,
      sickle_cell_type: healthData.sickle_cell_type || null,
      stage: healthData.stage || null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="date">Date *</Label>
        <Input
          id="date"
          type="date"
          value={healthData.date}
          onChange={(e) => setHealthData({ ...healthData, date: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height">Height (cm) *</Label>
          <Input
            id="height"
            type="number"
            step="0.1"
            value={healthData.height_cm}
            onChange={(e) => setHealthData({ ...healthData, height_cm: e.target.value })}
            required
            placeholder="Enter height in cm"
          />
        </div>
        
        <div>
          <Label htmlFor="weight">Weight (kg) *</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            value={healthData.weight_kg}
            onChange={(e) => setHealthData({ ...healthData, weight_kg: e.target.value })}
            required
            placeholder="Enter weight in kg"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="vision">Vision</Label>
        <Input
          id="vision"
          value={healthData.vision}
          onChange={(e) => setHealthData({ ...healthData, vision: e.target.value })}
          placeholder="e.g., 20/20, Needs glasses"
        />
      </div>

      <div>
        <Label htmlFor="sickle_cell_status">Sickle Cell Status</Label>
        <Select value={healthData.sickle_cell_status} onValueChange={(value) => setHealthData({ ...healthData, sickle_cell_status: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Negative">Negative</SelectItem>
            <SelectItem value="Positive">Positive</SelectItem>
            <SelectItem value="Carrier">Carrier</SelectItem>
            <SelectItem value="Unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="sickle_cell_type">Sickle Cell Type</Label>
        <Input
          id="sickle_cell_type"
          value={healthData.sickle_cell_type}
          onChange={(e) => setHealthData({ ...healthData, sickle_cell_type: e.target.value })}
          placeholder="e.g., HbSS, HbSC"
        />
      </div>

      <div>
        <Label htmlFor="stage">Stage</Label>
        <Input
          id="stage"
          value={healthData.stage}
          onChange={(e) => setHealthData({ ...healthData, stage: e.target.value })}
          placeholder="Development stage"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="medical-gradient text-white" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Health Record & Continue'}
        </Button>
      </div>
    </form>
  );
};

export default HealthRecordTab;
