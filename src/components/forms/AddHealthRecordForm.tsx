
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useHealthRecords } from "@/hooks/useHealthRecords";
import { useStudents } from "@/hooks/useStudents";

interface AddHealthRecordFormProps {
  trigger?: React.ReactNode;
}

const AddHealthRecordForm = ({ trigger }: AddHealthRecordFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    date: new Date().toISOString().split('T')[0],
    height_cm: '',
    weight_kg: '',
    vision: '',
    sickle_cell_status: '',
    sickle_cell_type: '',
    stage: ''
  });

  const { addHealthRecord } = useHealthRecords();
  const { students } = useStudents();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.height_cm || !formData.weight_kg) {
      return;
    }

    addHealthRecord({
      student_id: formData.student_id,
      date: formData.date,
      height_cm: parseFloat(formData.height_cm),
      weight_kg: parseFloat(formData.weight_kg),
      vision: formData.vision || null,
      sickle_cell_status: formData.sickle_cell_status || null,
      sickle_cell_type: formData.sickle_cell_type || null,
      stage: formData.stage || null
    });

    setFormData({
      student_id: '',
      date: new Date().toISOString().split('T')[0],
      height_cm: '',
      weight_kg: '',
      vision: '',
      sickle_cell_status: '',
      sickle_cell_type: '',
      stage: ''
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="medical-gradient text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Health Record
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Health Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                value={formData.height_cm}
                onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vision">Vision</Label>
              <Input
                id="vision"
                value={formData.vision}
                onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                placeholder="e.g., 20/20, Needs glasses"
              />
            </div>
            
            <div>
              <Label htmlFor="sickle_cell_status">Sickle Cell Status</Label>
              <Select value={formData.sickle_cell_status} onValueChange={(value) => setFormData({ ...formData, sickle_cell_status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Positive">Positive</SelectItem>
                  <SelectItem value="Negative">Negative</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sickle_cell_type">Sickle Cell Type</Label>
              <Input
                id="sickle_cell_type"
                value={formData.sickle_cell_type}
                onChange={(e) => setFormData({ ...formData, sickle_cell_type: e.target.value })}
                placeholder="e.g., HbSS, HbSC"
              />
            </div>
            
            <div>
              <Label htmlFor="stage">Stage</Label>
              <Input
                id="stage"
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                placeholder="Development stage"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="medical-gradient text-white">
              Add Health Record
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHealthRecordForm;
