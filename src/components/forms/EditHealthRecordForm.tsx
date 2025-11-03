
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import { useHealthRecords, HealthRecord } from "@/hooks/useHealthRecords";

interface EditHealthRecordFormProps {
  record: HealthRecord;
  trigger?: React.ReactNode;
}

const EditHealthRecordForm = ({ record, trigger }: EditHealthRecordFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: record.date,
    height_cm: record.height_cm?.toString() || '',
    weight_kg: record.weight_kg?.toString() || '',
    vision: record.vision || '',
    sickle_cell_status: record.sickle_cell_status || '',
    sickle_cell_type: record.sickle_cell_type || '',
    stage: record.stage || ''
  });

  const { updateHealthRecord } = useHealthRecords();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.height_cm || !formData.weight_kg) {
      return;
    }

    updateHealthRecord({
      id: record.h_id,
      date: formData.date,
      height_cm: parseFloat(formData.height_cm),
      weight_kg: parseFloat(formData.weight_kg),
      vision: formData.vision || null,
      sickle_cell_status: formData.sickle_cell_status || null,
      sickle_cell_type: formData.sickle_cell_type || null,
      stage: formData.stage || null
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
          <DialogTitle>Edit Health Record</DialogTitle>
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
              Update Health Record
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditHealthRecordForm;
