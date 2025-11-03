import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Download } from "lucide-react";

interface QuickActionsCardProps {
  userRole: string;
  selectedClass: string;
  onExportData: () => void;
}

export default function QuickActionsCard({ userRole, selectedClass, onExportData }: QuickActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {userRole === 'admin' && (
          <Button variant="outline" className="w-full justify-start" onClick={onExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export Report {selectedClass !== "all" && `(Class ${selectedClass})`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}