
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import { useVaccinationStatus, VaccinationStatus } from "@/hooks/useVaccinationStatus";

interface EditVaccinationStatusFormProps {
  vaccination: VaccinationStatus;
  trigger?: React.ReactNode;
}

const EditVaccinationStatusForm = ({ vaccination, trigger }: EditVaccinationStatusFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    vaccine_name: vaccination.vaccine_name,
    due_date: vaccination.due_date || '',
    vaccination_type: vaccination.vaccination_type || '',
    status: vaccination.status || 'Pending',
    completed_date: vaccination.completed_date || ''
  });

  const { updateVaccinationStatus } = useVaccinationStatus();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateVaccinationStatus({
      id: vaccination.v_id,
      vaccine_name: formData.vaccine_name,
      due_date: formData.due_date || null,
      vaccination_type: formData.vaccination_type || null,
      status: formData.status || null,
      completed_date: formData.completed_date || null
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Vaccination Status</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              Update Vaccination Status
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVaccinationStatusForm;
