
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudents } from "@/hooks/useStudents";

const BMIDistributionChart = ({ selectedClass }: { selectedClass?: string }) => {
  const { students } = useStudents();

  const filteredStudents = selectedClass 
    ? students.filter(student => student.class === selectedClass)
    : students;

  const bmiData = filteredStudents.reduce((acc, student) => {
    const bmi = student.latest_bmi;
    if (!bmi) {
      acc['No Data'] = (acc['No Data'] || 0) + 1;
      return acc;
    }

    let category;
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(bmiData).map(([category, count]) => ({
    category,
    count,
    percentage: filteredStudents.length > 0 ? Number(((Number(count) / filteredStudents.length) * 100).toFixed(1)) : 0
  }));

  if (filteredStudents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>BMI Distribution {selectedClass && `- Class ${selectedClass}`}</CardTitle>
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
        <CardTitle>BMI Distribution {selectedClass && `- Class ${selectedClass}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value, name) => [value, 'Students']} />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BMIDistributionChart;
