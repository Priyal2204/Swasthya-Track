
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

interface StudentInfoTabProps {
  studentData: {
    s_name: string;
    class: string;
    age: string;
    gender: string;
  };
  setStudentData: (data: any) => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  onCancel: () => void;
}

const StudentInfoTab = ({ studentData, setStudentData, onSubmit, isLoading, onCancel }: StudentInfoTabProps) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting student form with data:', studentData);
    
    if (!studentData.s_name || !studentData.class) {
      toast({ 
        title: "Error", 
        description: "Please fill in required fields (Name and Class)", 
        variant: "destructive" 
      });
      return;
    }

    onSubmit({
      s_name: studentData.s_name,
      class: studentData.class,
      age: studentData.age ? parseInt(studentData.age) : null,
      gender: studentData.gender || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Student Name *</Label>
        <Input
          id="name"
          value={studentData.s_name}
          onChange={(e) => setStudentData({ ...studentData, s_name: e.target.value })}
          required
          placeholder="Enter student name"
        />
      </div>
      
      <div>
        <Label htmlFor="class">Class *</Label>
        <Input
          id="class"
          value={studentData.class}
          onChange={(e) => setStudentData({ ...studentData, class: e.target.value })}
          required
          placeholder="Enter class"
        />
      </div>
      
      <div>
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={studentData.age}
          onChange={(e) => setStudentData({ ...studentData, age: e.target.value })}
          placeholder="Enter age"
        />
      </div>
      
      <div>
        <Label htmlFor="gender">Gender</Label>
        <Select value={studentData.gender} onValueChange={(value) => setStudentData({ ...studentData, gender: value })}>
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="medical-gradient text-white" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Student & Continue'}
        </Button>
      </div>
    </form>
  );
};

export default StudentInfoTab;
