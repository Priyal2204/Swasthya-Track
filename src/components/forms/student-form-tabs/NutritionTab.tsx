
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';

interface NutritionTabProps {
  nutritionData: {
    date: string;
    present: boolean;
    calories: string;
    protein_g: string;
  };
  setNutritionData: (data: any) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onBack: () => void;
  createdStudentId: string | null;
}

const NutritionTab = ({ nutritionData, setNutritionData, onSubmit, isLoading, onBack, createdStudentId }: NutritionTabProps) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting nutrition form with student ID:', createdStudentId);
    
    if (!createdStudentId) {
      toast({ title: "Error", description: "Student must be created first", variant: "destructive" });
      return;
    }

    onSubmit({
      student_id: createdStudentId,
      date: nutritionData.date,
      present: nutritionData.present,
      calories: nutritionData.calories ? parseFloat(nutritionData.calories) : null,
      protein_g: nutritionData.protein_g ? parseFloat(nutritionData.protein_g) : null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="date">Date *</Label>
        <Input
          id="date"
          type="date"
          value={nutritionData.date}
          onChange={(e) => setNutritionData({ ...nutritionData, date: e.target.value })}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="present"
          checked={nutritionData.present}
          onCheckedChange={(checked) => setNutritionData({ ...nutritionData, present: checked as boolean })}
        />
        <Label htmlFor="present">Present for meal</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="calories">Calories</Label>
          <Input
            id="calories"
            type="number"
            step="0.1"
            value={nutritionData.calories}
            onChange={(e) => setNutritionData({ ...nutritionData, calories: e.target.value })}
            placeholder="Estimated calories"
          />
        </div>
        
        <div>
          <Label htmlFor="protein">Protein (g)</Label>
          <Input
            id="protein"
            type="number"
            step="0.1"
            value={nutritionData.protein_g}
            onChange={(e) => setNutritionData({ ...nutritionData, protein_g: e.target.value })}
            placeholder="Protein in grams"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="medical-gradient text-white" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Complete & Save All Records'}
        </Button>
      </div>
    </form>
  );
};

export default NutritionTab;
