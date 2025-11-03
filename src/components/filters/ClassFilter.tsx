
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudents } from "@/hooks/useStudents";

interface ClassFilterProps {
  selectedClass: string;
  onClassChange: (classValue: string) => void;
  placeholder?: string;
}

const ClassFilter = ({ selectedClass, onClassChange, placeholder = "All Classes" }: ClassFilterProps) => {
  const { students } = useStudents();

  const uniqueClasses = Array.from(new Set(students.map(student => student.class))).sort();

  return (
    <Select value={selectedClass} onValueChange={onClassChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Classes</SelectItem>
        {uniqueClasses.map((classValue) => (
          <SelectItem key={classValue} value={classValue}>
            Class {classValue}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ClassFilter;
