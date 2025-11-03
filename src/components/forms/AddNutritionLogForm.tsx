
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { useNutritionLogs } from "@/hooks/useNutritionLogs";
import { useStudents } from "@/hooks/useStudents";

interface AddNutritionLogFormProps {
  trigger?: React.ReactNode;
}

const AddNutritionLogForm = ({ trigger }: AddNutritionLogFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    date: new Date().toISOString().split('T')[0],
    present: false,
    calories: '',
    protein_g: ''
  });

  const { addNutritionLog } = useNutritionLogs();
  const { students } = useStudents();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addNutritionLog({
      student_id: formData.student_id,
      date: formData.date,
      present: formData.present,
      calories: formData.calories ? parseFloat(formData.calories) : null,
      protein_g: formData.protein_g ? parseFloat(formData.protein_g) : null
    });

    setFormData({
      student_id: '',
      date: new Date().toISOString().split('T')[0],
      present: false,
      calories: '',
      protein_g: ''
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="medical-gradient text-white">
            <Plus className="mr-2 h-4 w-4" />
            Log Today's Meals
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Meal Attendance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="student">Student</Label>
            <Select value={formData.student_id} onValueChange={(value) => setFormData({ ...formData, student_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.student_id} value={student.student_id}>
                    {student.s_name} - {student.class}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
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
              Log Meal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNutritionLogForm;
