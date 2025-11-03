import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, Utensils, Users } from "lucide-react";

interface StatsCardsProps {
  stats: {
    underweightPercentage: number;
    underweightCount: number;
    mealsServedToday: number;
    mealAttendancePercentage: number;
  } | null;
  filteredStudentsCount: number;
  userRole: string;
  assignedClass?: string | null;
  selectedClass: string;
}

export default function StatsCards({ 
  stats, 
  filteredStudentsCount, 
  userRole, 
  assignedClass, 
  selectedClass 
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="border-orange-100 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Underweight Students</p>
              <p className="text-3xl font-bold text-orange-900">{stats?.underweightPercentage || 0}%</p>
              <p className="text-sm text-orange-700">{stats?.underweightCount || 0} of {filteredStudentsCount} students</p>
            </div>
            <TrendingDown className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-100 bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Meals Served Today</p>
              <p className="text-3xl font-bold text-green-900">{stats?.mealsServedToday || 0}</p>
              <p className="text-sm text-green-700">{stats?.mealAttendancePercentage || 0}% attendance</p>
            </div>
            <Utensils className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-100 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                {userRole === 'teacher' ? `My Students (Class ${assignedClass})` : 'Total Students'}
              </p>
              <p className="text-3xl font-bold text-blue-900">{filteredStudentsCount}</p>
              <p className="text-sm text-blue-700">
                {userRole === 'teacher' ? `Class ${assignedClass}` : 
                 (selectedClass === "all" ? "All classes" : `Class ${selectedClass}`)}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}