
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit } from "lucide-react";
import { useNutritionLogs, NutritionLog } from "@/hooks/useNutritionLogs";

interface EditNutritionLogFormProps {
  log: NutritionLog;
  trigger?: React.ReactNode;
}

const EditNutritionLogForm = ({ log, trigger }: EditNutritionLogFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: log.date,
    present: log.present || false,
    calories: log.calories?.toString() || '',
    protein_g: log.protein_g?.toString() || ''
  });

  const { updateNutritionLog } = useNutritionLogs();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateNutritionLog({
      id: log.n_id,
      date: formData.date,
      present: formData.present,
      calories: formData.calories ? parseFloat(formData.calories) : null,
      protein_g: formData.protein_g ? parseFloat(formData.protein_g) : null
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Meal Log</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="present"
              checked={formData.present}
              onCheckedChange={(checked) => setFormData({ ...formData, present: checked as boolean })}
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
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                placeholder="Estimated calories"
              />
            </div>
            
            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                step="0.1"
                value={formData.protein_g}
                onChange={(e) => setFormData({ ...formData, protein_g: e.target.value })}
                placeholder="Protein in grams"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="medical-gradient text-white">
              Update Meal Log
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNutritionLogForm;
