
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Filter, RotateCcw } from 'lucide-react';

interface DateRangeFilterProps {
  onFilterChange: (filters: {
    dateFrom: string;
    dateTo: string;
    eventType: string;
  }) => void;
  className?: string;
}

export default function DateRangeFilter({ onFilterChange, className }: DateRangeFilterProps) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [eventType, setEventType] = useState('all');

  const handleApplyFilters = () => {
    console.log('Applying filters:', { dateFrom, dateTo, eventType });
    onFilterChange({
      dateFrom,
      dateTo,
      eventType
    });
  };

  const handleClearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setEventType('all');
    onFilterChange({
      dateFrom: '',
      dateTo: '',
      eventType: 'all'
    });
  };

  // Set quick date ranges
  const setQuickRange = (days: number) => {
    const today = new Date();
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - days);
    
    setDateFrom(fromDate.toISOString().split('T')[0]);
    setDateTo(today.toISOString().split('T')[0]);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-blue-600" />
          <span>Date & Event Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dateFrom">From Date</Label>
            <Input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateTo">To Date</Label>
            <Input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Date Ranges */}
        <div className="space-y-2">
          <Label>Quick Ranges</Label>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuickRange(7)}
            >
              Last 7 days
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuickRange(30)}
            >
              Last 30 days
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setQuickRange(90)}
            >
              Last 3 months
            </Button>
          </div>
        </div>

        {/* Event Type Filter */}
        <div className="space-y-2">
          <Label>Event Type</Label>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="health">Health Checkups</SelectItem>
              <SelectItem value="vaccination">Vaccinations</SelectItem>
              <SelectItem value="nutrition">Meal Records</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button onClick={handleApplyFilters} className="flex-1">
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleClearFilters}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
