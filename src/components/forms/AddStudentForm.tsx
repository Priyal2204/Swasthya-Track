
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useStudents } from "@/hooks/useStudents";

interface AddStudentFormProps {
  trigger?: React.ReactNode;
}

const AddStudentForm = ({ trigger }: AddStudentFormProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    s_name: '',
    class: '',
    age: '',
    gender: ''
  });

  const { addStudent } = useStudents();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addStudent({
      s_name: formData.s_name,
      class: formData.class,
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || null,
      school_id: null // Will be set automatically in the hook
    });

    setFormData({ s_name: '', class: '', age: '', gender: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="medical-gradient text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              value={formData.s_name}
              onChange={(e) => setFormData({ ...formData, s_name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="class">Class</Label>
            <Input
              id="class"
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="medical-gradient text-white">
              Add Student
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentForm;
