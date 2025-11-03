import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, TrendingDown, Utensils, LogOut, Heart, Activity, Calendar, 
  Download, BarChart3, Shield 
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useStudents } from "@/hooks/useStudents";
import { useHealthRecords } from "@/hooks/useHealthRecords";
import { useNutritionLogs } from "@/hooks/useNutritionLogs";
import { useVaccinationStatus } from "@/hooks/useVaccinationStatus";
import AddStudentForm from "@/components/forms/AddStudentForm";
import AddHealthRecordForm from "@/components/forms/AddHealthRecordForm";
import AddNutritionLogForm from "@/components/forms/AddNutritionLogForm";
import AddVaccinationStatusForm from "@/components/forms/AddVaccinationStatusForm";
import EditStudentForm from "@/components/forms/EditStudentForm";
import EditHealthRecordForm from "@/components/forms/EditHealthRecordForm";
import EditNutritionLogForm from "@/components/forms/EditNutritionLogForm";
import EditVaccinationStatusForm from "@/components/forms/EditVaccinationStatusForm";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import ComprehensiveAddStudentForm from "@/components/forms/ComprehensiveAddStudentForm";
import GenderRatioPieChart from "@/components/charts/GenderRatioPieChart";
import VaccinationStatusPieChart from "@/components/charts/VaccinationStatusPieChart";
import BMIDistributionChart from "@/components/charts/BMIDistributionChart";
import ClassFilter from "@/components/filters/ClassFilter";
import DateRangeFilter from "@/components/filters/DateRangeFilter";
import HealthCalendar from "@/components/calendar/HealthCalendar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardProps {
  onLogout: () => void;
}

interface FilteredEvent {
  id: string;
  type: 'health' | 'vaccination' | 'nutrition';
  title: string;
  student: string;
  date: string;
  status?: string;
  details?: string;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedClass, setSelectedClass] = useState("all");
  const [dateFilters, setDateFilters] = useState({
    dateFrom: '',
    dateTo: '',
    eventType: 'all'
  });
  
  const { schoolId, userRole, assignedClass } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { students, isLoading: studentsLoading, deleteStudent } = useStudents();
  const { healthRecords, isLoading: healthLoading, deleteHealthRecord } = useHealthRecords();
  const { nutritionLogs, isLoading: nutritionLoading, deleteNutritionLog } = useNutritionLogs();
  const { vaccinationStatus, isLoading: vaccinationLoading, deleteVaccinationStatus } = useVaccinationStatus();

  // Apply role-based filtering for students only
  const getStudentFilteredData = (data: any[]) => {
    let filtered = data;

    // Apply role-based class filtering
    if (userRole === 'teacher' && assignedClass) {
      filtered = filtered.filter(item => {
        if ('class' in item) return item.class === assignedClass;
        return false;
      });
    } else if (selectedClass !== "all") {
      filtered = filtered.filter(item => {
        if ('class' in item) return item.class === selectedClass;
        return false;
      });
    }

    return filtered;
  };

  // Apply role-based and date/event filtering for event data
  const getEventFilteredData = (data: any[]) => {
    let filtered = data;

    // Apply role-based class filtering
    if (userRole === 'teacher' && assignedClass) {
      filtered = filtered.filter(item => {
        if ('students' in item && item.students) return item.students.class === assignedClass;
        return false;
      });
    } else if (selectedClass !== "all") {
      filtered = filtered.filter(item => {
        if ('students' in item && item.students) return item.students.class === selectedClass;
        return false;
      });
    }

    // Apply date filtering
    if (dateFilters.dateFrom || dateFilters.dateTo) {
      filtered = filtered.filter(item => {
        const itemDate = item.date || item.due_date || item.completed_date || item.created_at;
        if (!itemDate) return false;
        
        const date = new Date(itemDate);
        const fromDate = dateFilters.dateFrom ? new Date(dateFilters.dateFrom) : null;
        const toDate = dateFilters.dateTo ? new Date(dateFilters.dateTo) : null;
        
        if (fromDate && date < fromDate) return false;
        if (toDate && date > toDate) return false;
        
        return true;
      });
    }

    // Apply event type filtering
    if (dateFilters.eventType !== 'all') {
      filtered = filtered.filter(item => {
        // Determine the type of data
        if ('bmi' in item || 'h_id' in item) {
          return dateFilters.eventType === 'health';
        }
        if ('vaccine_name' in item || 'v_id' in item) {
          return dateFilters.eventType === 'vaccination';
        }
        if ('present' in item || 'n_id' in item) {
          return dateFilters.eventType === 'nutrition';
        }
        return true;
      });
    }

    return filtered;
  };

  const filteredStudents = getStudentFilteredData(students);
  const filteredHealthRecords = getEventFilteredData(healthRecords);
  const filteredNutritionLogs = getEventFilteredData(nutritionLogs);
  const filteredVaccinationStatus = getEventFilteredData(vaccinationStatus);

  // Create a unified events list for the overview tab
  const getFilteredEvents = (): FilteredEvent[] => {
    const events: FilteredEvent[] = [
      ...filteredHealthRecords.filter(record => record.students?.s_name).map(record => ({
        id: `health-${record.h_id}`,
        type: 'health' as const,
        title: 'Health Checkup',
        student: record.students?.s_name || 'Unknown',
        date: record.date,
        details: `BMI: ${record.bmi?.toFixed(1) || 'N/A'}`
      })),
      ...filteredVaccinationStatus.filter(vacc => vacc.students?.s_name && (vacc.due_date || vacc.completed_date)).map(vacc => ({
        id: `vaccination-${vacc.v_id}`,
        type: 'vaccination' as const,
        title: vacc.vaccine_name,
        student: vacc.students?.s_name || 'Unknown',
        date: vacc.due_date || vacc.completed_date || '',
        status: vacc.status || 'Pending'
      })),
      ...filteredNutritionLogs.filter(nutrition => nutrition.students?.s_name).map(nutrition => ({
        id: `nutrition-${nutrition.n_id}`,
        type: 'nutrition' as const,
        title: 'Meal Record',
        student: nutrition.students?.s_name || 'Unknown',
        date: nutrition.date,
        status: nutrition.present ? 'Present' : 'Absent'
      }))
    ].filter(event => event.date) // Only include events with valid dates
     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ascending

    return events;
  };

  const filteredEvents = getFilteredEvents();

  // Real-time subscriptions
  useEffect(() => {
    if (!schoolId) return;

    const channels = [
      supabase.channel('students-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, () => {
        console.log('Students data changed');
      }),
      supabase.channel('health-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'health_records' }, () => {
        console.log('Health records data changed');
      }),
      supabase.channel('nutrition-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'nutrition_logs' }, () => {
        console.log('Nutrition logs data changed');
      }),
      supabase.channel('vaccination-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'vaccination_status' }, () => {
        console.log('Vaccination status data changed');
      })
    ];

    channels.forEach(channel => channel.subscribe());

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [schoolId]);

  const exportData = async () => {
    // Create CSV data based on current filters
    const csvData = filteredStudents.map(student => ({
      Name: student.s_name,
      Class: student.class,
      Age: student.age || 'N/A',
      BMI: student.latest_bmi?.toFixed(1) || 'N/A',
      Status: student.status,
      LastCheckup: student.last_checkup || 'N/A'
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => row[header as keyof typeof row]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${stats?.schoolName || 'school'}_report_${selectedClass !== "all" ? `class_${selectedClass}_` : ''}${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'health': return <Heart className="h-4 w-4 text-red-500" />;
      case 'vaccination': return <Shield className="h-4 w-4 text-blue-500" />;
      case 'nutrition': return <Utensils className="h-4 w-4 text-green-500" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Completed': return 'default';
      case 'Present': return 'default';
      case 'Pending': return 'secondary';
      case 'Overdue': return 'destructive';
      case 'Absent': return 'destructive';
      default: return 'secondary';
    }
  };

  if (statsLoading) {
    return <div>Loading dashboard...</div>;
  }

  const canDelete = userRole === 'admin';
  const canEdit = userRole === 'admin';
  const canAdd = true; // Both admin and teacher can add records

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/8619ed4b-321a-4650-b3dd-d44d66885783.png" 
              alt="SwasthyaTrack Logo" 
              className="h-8 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">SwasthyaTrack Dashboard</h1>
              <p className="text-sm text-gray-600">
                {userRole === 'admin' ? 'Administrator View' : `Teacher View - Class ${assignedClass}`} - {stats?.schoolName || 'Loading...'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {userRole === 'admin' && (
              <ClassFilter 
                selectedClass={selectedClass} 
                onClassChange={setSelectedClass}
                placeholder="Filter by Class"
              />
            )}
            <Badge variant="outline" className={userRole === 'admin' ? 'text-blue-600 border-blue-200' : 'text-green-600 border-green-200'}>
              <Shield className="mr-1 h-3 w-3" />
              {userRole === 'admin' ? 'Admin' : 'Teacher'}
            </Badge>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-orange-100 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Underweight Students</p>
                    <p className="text-3xl font-bold text-orange-900">{stats?.underweightPercentage || 0}%</p>
                    <p className="text-sm text-orange-700">{stats?.underweightCount || 0} of {filteredStudents.length} students</p>
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
                    <p className="text-3xl font-bold text-blue-900">{filteredStudents.length}</p>
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

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="health">Health Records</TabsTrigger>
              <TabsTrigger value="meals">Meal Logs</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Date Range Filter */}
              <DateRangeFilter 
                onFilterChange={setDateFilters}
                className="lg:w-1/3"
              />

              <div className="grid lg:grid-cols-2 gap-6">
                <GenderRatioPieChart selectedClass={userRole === 'teacher' ? assignedClass : (selectedClass === "all" ? undefined : selectedClass)} />
                <VaccinationStatusPieChart selectedClass={userRole === 'teacher' ? assignedClass : (selectedClass === "all" ? undefined : selectedClass)} />
              </div>

              <div className="grid lg:grid-cols-1 gap-6">
                <BMIDistributionChart selectedClass={userRole === 'teacher' ? assignedClass : (selectedClass === "all" ? undefined : selectedClass)} />
              </div>

              {/* Filtered Events Display */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <span>
                      Filtered Events 
                      {dateFilters.dateFrom && dateFilters.dateTo && 
                        ` (${new Date(dateFilters.dateFrom).toLocaleDateString()} - ${new Date(dateFilters.dateTo).toLocaleDateString()})`
                      }
                      {dateFilters.eventType !== 'all' && ` - ${dateFilters.eventType}`}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredEvents.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        No events found for the selected filters
                      </p>
                    ) : (
                      filteredEvents.map(event => (
                        <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          {getEventIcon(event.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{event.title}</p>
                            <p className="text-sm text-gray-600">{event.student}</p>
                            <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                            {event.details && (
                              <p className="text-xs text-gray-500">{event.details}</p>
                            )}
                          </div>
                          {event.status && (
                            <Badge variant={getStatusColor(event.status)} className="text-xs">
                              {event.status}
                            </Badge>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userRole === 'admin' && (
                    <Button variant="outline" className="w-full justify-start" onClick={exportData}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Report {selectedClass !== "all" && `(Class ${selectedClass})`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              <HealthCalendar />
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
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
            </TabsContent>

            <TabsContent value="health" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        <span>
                          Health Records 
                          {userRole === 'teacher' ? ` - Class ${assignedClass}` : 
                           (selectedClass !== "all" && ` - Class ${selectedClass}`)}
                        </span>
                      </div>
                      {canAdd && <AddHealthRecordForm />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>BMI</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredHealthRecords.slice(0, 10).map((record) => (
                          <TableRow key={record.h_id}>
                            <TableCell>{record.students?.s_name}</TableCell>
                            <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                            <TableCell>{record.bmi?.toFixed(1) || 'N/A'}</TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                {canEdit && <EditHealthRecordForm record={record} />}
                                {canDelete && (
                                  <DeleteConfirmDialog
                                    onConfirm={() => deleteHealthRecord(record.h_id)}
                                    title="Delete Health Record"
                                    description="Are you sure you want to delete this health record? This action cannot be undone."
                                  />
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-blue-500" />
                        <span>
                          Vaccination Status 
                          {userRole === 'teacher' ? ` - Class ${assignedClass}` : 
                           (selectedClass !== "all" && ` - Class ${selectedClass}`)}
                        </span>
                      </div>
                      {canAdd && <AddVaccinationStatusForm />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Vaccine</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredVaccinationStatus.slice(0, 10).map((vaccination) => (
                          <TableRow key={vaccination.v_id}>
                            <TableCell>{vaccination.students?.s_name}</TableCell>
                            <TableCell>{vaccination.vaccine_name}</TableCell>
                            <TableCell>
                              <Badge variant={vaccination.status === 'Completed' ? 'default' : 'destructive'}>
                                {vaccination.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {vaccination.due_date ? new Date(vaccination.due_date).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                {canEdit && <EditVaccinationStatusForm vaccination={vaccination} />}
                                {canDelete && (
                                  <DeleteConfirmDialog
                                    onConfirm={() => deleteVaccinationStatus(vaccination.v_id)}
                                    title="Delete Vaccination Status"
                                    description="Are you sure you want to delete this vaccination status? This action cannot be undone."
                                  />
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="meals" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Utensils className="h-5 w-5 text-green-500" />
                      <span>
                        Meal Attendance Tracking 
                        {userRole === 'teacher' ? ` - Class ${assignedClass}` : 
                         (selectedClass !== "all" && ` - Class ${selectedClass}`)}
                      </span>
                    </div>
                    {canAdd && <AddNutritionLogForm />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Present</TableHead>
                        <TableHead>Calories</TableHead>
                        <TableHead>Protein (g)</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNutritionLogs.map((log) => (
                        <TableRow key={log.n_id}>
                          <TableCell>{log.students?.s_name}</TableCell>
                          <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={log.present ? 'default' : 'destructive'}>
                              {log.present ? 'Yes' : 'No'}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.calories || 'N/A'}</TableCell>
                          <TableCell>{log.protein_g || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              {canEdit && <EditNutritionLogForm log={log} />}
                              {canDelete && (
                                <DeleteConfirmDialog
                                  onConfirm={() => deleteNutritionLog(log.n_id)}
                                  title="Delete Meal Log"
                                  description="Are you sure you want to delete this meal log? This action cannot be undone."
                                />
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
