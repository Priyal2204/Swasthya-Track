
import { useState } from 'react';
import Calendar from 'react-calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Filter, Users, Heart, Utensils, Shield } from 'lucide-react';
import { useHealthRecords } from '@/hooks/useHealthRecords';
import { useNutritionLogs } from '@/hooks/useNutritionLogs';
import { useVaccinationStatus } from '@/hooks/useVaccinationStatus';
import { useStudents } from '@/hooks/useStudents';
import { useAuth } from '@/contexts/AuthContext';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface HealthEvent {
  id: string;
  type: 'health' | 'vaccination' | 'nutrition';
  title: string;
  student: string;
  date: string;
  status?: string;
  details?: string;
}

export default function HealthCalendar() {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  
  const { userRole, assignedClass } = useAuth();
  const { healthRecords } = useHealthRecords();
  const { nutritionLogs } = useNutritionLogs();
  const { vaccinationStatus } = useVaccinationStatus();
  const { students } = useStudents();

  // Get unique classes for filter
  const availableClasses = [...new Set(students.map(s => s.class))];

  // Filter students based on role and selected class
  const filteredStudents = students.filter(student => {
    if (userRole === 'teacher' && assignedClass) {
      return student.class === assignedClass;
    }
    if (selectedClass !== 'all') {
      return student.class === selectedClass;
    }
    return true;
  });

  // Create events from health data
  const healthEvents: HealthEvent[] = [
    ...healthRecords.filter(record => record.students?.s_name).map(record => ({
      id: `health-${record.h_id}`,
      type: 'health' as const,
      title: 'Health Checkup',
      student: record.students?.s_name || 'Unknown',
      date: record.date,
      details: `BMI: ${record.bmi?.toFixed(1) || 'N/A'}`
    })),
    ...vaccinationStatus.filter(vacc => vacc.students?.s_name && (vacc.due_date || vacc.completed_date)).map(vacc => ({
      id: `vaccination-${vacc.v_id}`,
      type: 'vaccination' as const,
      title: vacc.vaccine_name,
      student: vacc.students?.s_name || 'Unknown',
      date: vacc.due_date || vacc.completed_date || '',
      status: vacc.status || 'Pending'
    })),
    ...nutritionLogs.filter(nutrition => nutrition.students?.s_name).map(nutrition => ({
      id: `nutrition-${nutrition.n_id}`,
      type: 'nutrition' as const,
      title: 'Meal Record',
      student: nutrition.students?.s_name || 'Unknown',
      date: nutrition.date,
      status: nutrition.present ? 'Present' : 'Absent'
    }))
  ].filter(event => {
    // Only include events with valid dates
    if (!event.date) return false;
    
    // Filter by student class
    const student = students.find(s => s.s_name === event.student);
    if (!student) return false;
    
    if (userRole === 'teacher' && assignedClass) {
      if (student.class !== assignedClass) return false;
    } else if (selectedClass !== 'all') {
      if (student.class !== selectedClass) return false;
    }

    // Filter by event type
    if (eventFilter !== 'all' && event.type !== eventFilter) return false;

    return true;
  });

  // Get events for selected date
  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return healthEvents.filter(event => event.date === dateString);
  };

  // Get events for currently selected date
  const selectedDateEvents = selectedDate instanceof Date 
    ? getEventsForDate(selectedDate)
    : [];

  // Check if a date has events for styling
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayEvents = getEventsForDate(date);
      if (dayEvents.length > 0) {
        return (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        );
      }
    }
    return null;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'health': return <Heart className="h-4 w-4 text-red-500" />;
      case 'vaccination': return <Shield className="h-4 w-4 text-blue-500" />;
      case 'nutrition': return <Utensils className="h-4 w-4 text-green-500" />;
      default: return <CalendarIcon className="h-4 w-4" />;
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

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <span>Calendar Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {userRole === 'admin' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Class Filter</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {availableClasses.map(className => (
                      <SelectItem key={className} value={className}>
                        Class {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Type</label>
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="health">Health Checkups</SelectItem>
                  <SelectItem value="vaccination">Vaccinations</SelectItem>
                  <SelectItem value="nutrition">Meal Records</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <span>Health Calendar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="calendar-container">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
                className="w-full border-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Events for Selected Date */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>
                Events for {selectedDate instanceof Date 
                  ? selectedDate.toLocaleDateString() 
                  : 'Selected Date'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedDateEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No events scheduled for this date
                </p>
              ) : (
                selectedDateEvents.map(event => (
                  <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getEventIcon(event.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-sm text-gray-600">{event.student}</p>
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
      </div>

      {/* Upcoming Events Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events (Next 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(() => {
              const nextWeek = new Date();
              nextWeek.setDate(nextWeek.getDate() + 7);
              const upcomingEvents = healthEvents.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= new Date() && eventDate <= nextWeek;
              }).slice(0, 5);

              return upcomingEvents.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No upcoming events in the next 7 days
                </p>
              ) : (
                upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      {getEventIcon(event.type)}
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-gray-600">{event.student}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{new Date(event.date).toLocaleDateString()}</p>
                      {event.status && (
                        <Badge variant={getStatusColor(event.status)} className="text-xs">
                          {event.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              );
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
