import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users } from "lucide-react";
import AddStudentForm from "@/components/forms/AddStudentForm";
import ComprehensiveAddStudentForm from "@/components/forms/ComprehensiveAddStudentForm";
import EditStudentForm from "@/components/forms/EditStudentForm";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { StudentWithHealth } from "@/hooks/useStudents";

interface StudentsTableProps {
  filteredStudents: StudentWithHealth[];
  userRole: string;
  assignedClass?: string | null;
  selectedClass: string;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  deleteStudent: (id: string) => void;
}

export default function StudentsTable({
  filteredStudents,
  userRole,
  assignedClass,
  selectedClass,
  canAdd,
  canEdit,
  canDelete,
  deleteStudent
}: StudentsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>
              Student List 
              {userRole === 'teacher' ? ` - Class ${assignedClass}` : 
               (selectedClass !== "all" && ` - Class ${selectedClass}`)}
            </span>
          </div>
          {canAdd && (
            <div className="flex space-x-2">
              <AddStudentForm />
              {userRole === 'admin' && <ComprehensiveAddStudentForm />}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No students found</h3>
            <p className="mt-2 text-gray-600">
              {canAdd ? 'Get started by adding some students.' : 'No students assigned to your class yet.'}
            </p>
            {canAdd && (
              <div className="mt-4 flex gap-2 justify-center">
                <AddStudentForm />
              </div>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>BMI</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Checkup</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.student_id}>
                  <TableCell className="font-medium">{student.s_name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.latest_bmi?.toFixed(1) || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'Normal' ? 'default' : 'destructive'}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{student.last_checkup ? new Date(student.last_checkup).toLocaleDateString() : 'Never'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {canEdit && <EditStudentForm student={student} />}
                      {canDelete && (
                        <DeleteConfirmDialog
                          onConfirm={() => deleteStudent(student.student_id)}
                          title="Delete Student"
                          description="Are you sure you want to delete this student? This action cannot be undone."
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}