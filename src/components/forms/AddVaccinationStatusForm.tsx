
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useVaccinationStatus } from "@/hooks/useVaccinationStatus";
import { useStudents } from "@/hooks/useStudents";

interface AddVaccinationStatusFormProps {
  trigger?: React.ReactNode;
}

const AddVaccinationStatusForm = ({ trigger }: AddVaccinationStatusFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    vaccine_name: '',
    due_date: '',
    vaccination_type: '',
    status: 'Pending',
    completed_date: ''
  });

  const { addVaccinationStatus } = useVaccinationStatus();
  const { students } = useStudents();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addVaccinationStatus({
      student_id: formData.student_id,
      vaccine_name: formData.vaccine_name,
      due_date: formData.due_date || null,
      vaccination_type: formData.vaccination_type || null,
      status: formData.status || null,
      completed_date: formData.completed_date || null
    });

    setFormData({
      student_id: '',
      vaccine_name: '',
      due_date: '',
      vaccination_type: '',
      status: 'Pending',
      completed_date: ''
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="medical-gradient text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Vaccination Status
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Vaccination Status</DialogTitle>
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
              <Label htmlFor="vaccine_name">Vaccine Name</Label>
              <Input
                id="vaccine_name"
                value={formData.vaccine_name}
                onChange={(e) => setFormData({ ...formData, vaccine_name: e.target.value })}
                required
                placeholder="e.g., MMR, Polio"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vaccination_type">Vaccination Type</Label>
              <Input
                id="vaccination_type"
                value={formData.vaccination_type}
                onChange={(e) => setFormData({ ...formData, vaccination_type: e.target.value })}
                placeholder="e.g., Primary, Booster"
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="completed_date">Completed Date</Label>
              <Input
                id="completed_date"
                type="date"
                value={formData.completed_date}
                onChange={(e) => setFormData({ ...formData, completed_date: e.target.value })}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="medical-gradient text-white">
              Add Vaccination Status
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVaccinationStatusForm;
