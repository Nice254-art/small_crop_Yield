import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, Edit } from "lucide-react";
import FieldForm from "@/components/forms/FieldForm";
import type { Field } from "@shared/schema";

export default function FieldsOverview() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);

  const { data: fields, isLoading } = useQuery({
    queryKey: ["/api/fields"],
    enabled: !!user,
  });

  const getHealthStatus = (field: Field) => {
    // Mock health status - in real app this would come from latest satellite data
    const statuses = [
      { status: 'Healthy', variant: 'default' },
      { status: 'Needs Attention', variant: 'secondary' },
      { status: 'Critical', variant: 'destructive' }
    ];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const getPredictedYield = () => {
    return (Math.random() * 3 + 1).toFixed(1);
  };

  const handleEdit = (field: Field) => {
    setEditingField(field);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Field Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Field Management</CardTitle>
            <Button onClick={() => {
              setEditingField(null);
              setIsDialogOpen(true);
            }} data-testid="button-add-field-overview">
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!fields || fields.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No fields added yet. Add your first field to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field Name</TableHead>
                    <TableHead>Size (Acres)</TableHead>
                    <TableHead>Crop Type</TableHead>
                    <TableHead>Health Status</TableHead>
                    <TableHead>Predicted Yield</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field) => {
                    const { status, variant } = getHealthStatus(field);
                    const predictedYield = getPredictedYield();
                    
                    return (
                      <TableRow key={field.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <div className="font-medium" data-testid={`table-field-name-${field.id}`}>
                              {field.name}
                            </div>
                            <div className="text-sm text-muted-foreground" data-testid={`table-field-location-${field.id}`}>
                              {field.location || 'Location not set'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell data-testid={`table-field-size-${field.id}`}>
                          {field.size}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" data-testid={`table-field-crop-${field.id}`}>
                            {field.cropType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={`status-indicator status-${variant === 'default' ? 'healthy' : variant === 'secondary' ? 'warning' : 'critical'}`}></span>
                            <span data-testid={`table-field-status-${field.id}`}>{status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium" data-testid={`table-field-yield-${field.id}`}>
                          {predictedYield}t
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" data-testid={`table-button-view-${field.id}`}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEdit(field)}
                              data-testid={`table-button-edit-${field.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingField ? 'Edit Field' : 'Add New Field'}</DialogTitle>
          </DialogHeader>
          <FieldForm 
            field={editingField} 
            onSuccess={() => {
              setIsDialogOpen(false);
              setEditingField(null);
            }} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
