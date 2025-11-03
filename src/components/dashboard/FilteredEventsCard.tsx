import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Heart, Shield, Utensils, Calendar } from "lucide-react";

interface FilteredEvent {
  id: string;
  type: 'health' | 'vaccination' | 'nutrition';
  title: string;
  student: string;
  date: string;
  status?: string;
  details?: string;
}

interface FilteredEventsCardProps {
  filteredEvents: FilteredEvent[];
  dateFilters: {
    dateFrom: string;
    dateTo: string;
    eventType: string;
  };
}

export default function FilteredEventsCard({ filteredEvents, dateFilters }: FilteredEventsCardProps) {
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

  return (
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
  );
}