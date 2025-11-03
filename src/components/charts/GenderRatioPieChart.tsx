
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudents } from "@/hooks/useStudents";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const GenderRatioPieChart = ({ selectedClass }: { selectedClass?: string }) => {
  const { students } = useStudents();

  const filteredStudents = selectedClass 
    ? students.filter(student => student.class === selectedClass)
    : students;

  const genderData = filteredStudents.reduce((acc, student) => {
    const gender = student.gender || 'Unknown';
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(genderData).map(([gender, count]) => ({
    gender,
    count,
    percentage: filteredStudents.length > 0 ? Number(((Number(count) / filteredStudents.length) * 100).toFixed(1)) : 0
  }));

  if (filteredStudents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gender Distribution {selectedClass && `- Class ${selectedClass}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No student data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gender Distribution {selectedClass && `- Class ${selectedClass}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ gender, percentage }) => `${gender}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [value, 'Students']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GenderRatioPieChart;
