import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import FieldForm from "@/components/forms/FieldForm";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import type { Field } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Fields() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: fields, isLoading: fieldsLoading } = useQuery({
    queryKey: ["/api/fields"],
    enabled: isAuthenticated,
  });

  const deleteFieldMutation = useMutation({
    mutationFn: async (fieldId: string) => {
      const response = await fetch(`/api/fields/${fieldId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fields"] });
      toast({
        title: "Success",
        description: "Field deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete field",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const handleEdit = (field: Field) => {
    setEditingField(field);
    setIsDialogOpen(true);
  };

  const handleDelete = (fieldId: string) => {
    if (confirm('Are you sure you want to delete this field?')) {
      deleteFieldMutation.mutate(fieldId);
    }
  };

  const getHealthStatus = (field: Field) => {
    // Mock health status logic - in real app this would come from satellite data
    const statuses = ['Healthy', 'Needs Attention', 'Critical'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const variant = status === 'Healthy' ? 'default' : 
                   status === 'Needs Attention' ? 'secondary' : 'destructive';
    return { status, variant };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Field Management</h1>
          <p className="text-muted-foreground">Manage your agricultural fields and monitor their health</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingField(null)} data-testid="button-add-field">
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          </DialogTrigger>
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
      </div>

      {fieldsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !fields || fields.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Seedling className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Fields Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first field to begin monitoring crop health and yield predictions.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingField(null)} data-testid="button-add-first-field">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Field
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Field</DialogTitle>
                </DialogHeader>
                <FieldForm 
                  field={null} 
                  onSuccess={() => {
                    setIsDialogOpen(false);
                  }} 
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field) => {
            const { status, variant } = getHealthStatus(field);
            return (
              <Card key={field.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg" data-testid={`text-field-name-${field.id}`}>
                      {field.name}
                    </CardTitle>
                    <Badge variant={variant as any} data-testid={`badge-status-${field.id}`}>
                      {status}
                    </Badge>
                  </div>
                  <CardDescription data-testid={`text-field-location-${field.id}`}>
                    {field.location || `${field.latitude}, ${field.longitude}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span data-testid={`text-field-size-${field.id}`}>
                        {field.size} acres
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Crop:</span>
                      <span data-testid={`text-field-crop-${field.id}`}>
                        {field.cropType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Planting Date:</span>
                      <span data-testid={`text-field-planting-${field.id}`}>
                        {field.plantingDate ? new Date(field.plantingDate).toLocaleDateString() : 'Not set'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 pt-4 border-t border-border">
                    <Button 
                      variant="outline" 
                      size="sm"
                      data-testid={`button-view-${field.id}`}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(field)}
                        data-testid={`button-edit-${field.id}`}
                      >
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(field.id)}
                        disabled={deleteFieldMutation.isPending}
                        data-testid={`button-delete-${field.id}`}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
