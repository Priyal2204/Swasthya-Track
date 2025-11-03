
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVaccinationStatus } from "@/hooks/useVaccinationStatus";
import { useStudents } from "@/hooks/useStudents";

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

const VaccinationStatusPieChart = ({ selectedClass }: { selectedClass?: string }) => {
  const { vaccinationStatus } = useVaccinationStatus();
  const { students } = useStudents();

  const filteredStudents = selectedClass 
    ? students.filter(student => student.class === selectedClass)
    : students;

  const filteredVaccinations = vaccinationStatus.filter(vaccination =>
    filteredStudents.some(student => student.student_id === vaccination.student_id)
  );

  const statusData = filteredVaccinations.reduce((acc, vaccination) => {
    const status = vaccination.status || 'Pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusData).map(([status, count]) => ({
    name: status,
    value: count,
    percentage: (count / filteredVaccinations.length) * 100
  }));

  if (filteredVaccinations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vaccination Status {selectedClass && `- Class ${selectedClass}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No vaccination data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vaccination Status {selectedClass && `- Class ${selectedClass}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, name]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VaccinationStatusPieChart;
