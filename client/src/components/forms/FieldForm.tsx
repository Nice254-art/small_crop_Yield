import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertFieldSchema, type Field } from "@shared/schema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fieldFormSchema = insertFieldSchema.extend({
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
  size: z.string().min(1, "Size is required"),
});

type FieldFormData = z.infer<typeof fieldFormSchema>;

interface FieldFormProps {
  field: Field | null;
  onSuccess: () => void;
}

export default function FieldForm({ field, onSuccess }: FieldFormProps) {
  const { toast } = useToast();

  const form = useForm<FieldFormData>({
    resolver: zodResolver(fieldFormSchema),
    defaultValues: {
      name: field?.name || "",
      latitude: field?.latitude || "",
      longitude: field?.longitude || "",
      size: field?.size || "",
      cropType: field?.cropType || "maize",
      location: field?.location || "",
      plantingDate: field?.plantingDate ? new Date(field.plantingDate).toISOString().split('T')[0] : "",
      expectedHarvestDate: field?.expectedHarvestDate ? new Date(field.expectedHarvestDate).toISOString().split('T')[0] : "",
    },
  });

  const createFieldMutation = useMutation({
    mutationFn: async (data: FieldFormData) => {
      const fieldData = {
        ...data,
        latitude: data.latitude,
        longitude: data.longitude,
        size: data.size,
        plantingDate: data.plantingDate ? new Date(data.plantingDate) : undefined,
        expectedHarvestDate: data.expectedHarvestDate ? new Date(data.expectedHarvestDate) : undefined,
      };

      if (field) {
        return await apiRequest("PUT", `/api/fields/${field.id}`, fieldData);
      } else {
        return await apiRequest("POST", "/api/fields", fieldData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fields"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: field ? "Field updated successfully" : "Field created successfully",
      });
      onSuccess();
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
        description: field ? "Failed to update field" : "Failed to create field",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FieldFormData) => {
    createFieldMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., North Field A1" 
                  {...field} 
                  data-testid="input-field-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="-1.2921" 
                    {...field} 
                    data-testid="input-field-latitude"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="36.8219" 
                    {...field} 
                    data-testid="input-field-longitude"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size (Acres)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="25.5" 
                    {...field} 
                    data-testid="input-field-size"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cropType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crop Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-crop-type">
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="maize">Maize</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="sorghum">Sorghum</SelectItem>
                    <SelectItem value="millet">Millet</SelectItem>
                    <SelectItem value="beans">Beans</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="e.g., Near the river, next to the main road..."
                  {...field} 
                  data-testid="textarea-field-location"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="plantingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Planting Date (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    data-testid="input-planting-date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expectedHarvestDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Harvest Date (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    data-testid="input-harvest-date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onSuccess}
            data-testid="button-cancel-field"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createFieldMutation.isPending}
            data-testid="button-save-field"
          >
            {createFieldMutation.isPending 
              ? "Saving..." 
              : field 
                ? "Update Field" 
                : "Create Field"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
