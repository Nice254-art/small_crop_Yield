import { useState } from "react";
import { Plus, TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FieldForm from "@/components/forms/FieldForm";

export default function QuickActionsWidget() {
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);

  const handleRequestAnalysis = () => {
    // TODO: Implement analysis request
    alert("Analysis request feature coming soon!");
  };

  const handleDownloadReport = () => {
    // TODO: Implement report download
    alert("Report download feature coming soon!");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button 
              className="w-full flex items-center justify-between p-3" 
              onClick={() => setIsAddFieldOpen(true)}
              data-testid="button-add-field-quick"
            >
              <span className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add New Field
              </span>
              <i className="fas fa-chevron-right text-sm"></i>
            </Button>
            
            <Button 
              variant="secondary"
              className="w-full flex items-center justify-between p-3" 
              onClick={handleRequestAnalysis}
              data-testid="button-request-analysis"
            >
              <span className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Request Analysis
              </span>
              <i className="fas fa-chevron-right text-sm"></i>
            </Button>
            
            <Button 
              variant="outline"
              className="w-full flex items-center justify-between p-3" 
              onClick={handleDownloadReport}
              data-testid="button-download-report"
            >
              <span className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </span>
              <i className="fas fa-chevron-right text-sm"></i>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Field</DialogTitle>
          </DialogHeader>
          <FieldForm 
            field={null} 
            onSuccess={() => setIsAddFieldOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
