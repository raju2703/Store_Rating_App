import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateStoreSchema } from "@shared/validation";
import { z } from "zod";
import { UserRole } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type FormData = z.infer<typeof validateStoreSchema>;

interface AddStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddStoreDialog({ open, onOpenChange }: AddStoreDialogProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Get list of owners to choose from
  const { data: owners = [], isLoading: loadingOwners } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const users = await response.json();
      return users.filter((user: any) => user.role === UserRole.OWNER);
    },
    enabled: open,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(validateStoreSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      ownerId: undefined,
    },
  });

  const addStoreMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/admin/stores", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/statistics"] });
      toast({
        title: "Store created",
        description: "The store has been created successfully.",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create store",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setSubmitting(false);
    },
  });

  const onSubmit = (data: FormData) => {
    setSubmitting(true);
    addStoreMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Store</DialogTitle>
          <DialogDescription>
            Create a new store in the system. You'll need to select a store owner.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Store name" {...field} />
                  </FormControl>
                  <p className="text-xs text-gray-500">20-60 characters.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Email address" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Store address"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500">Maximum 400 characters.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Owner</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a store owner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingOwners ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : owners.length > 0 ? (
                        owners.map((owner: any) => (
                          <SelectItem key={owner.id} value={owner.id.toString()}>
                            {owner.name} ({owner.email})
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-4 text-center text-sm text-gray-500">
                          No store owners found. Please create a store owner first.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {owners.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      Go to the Users section and create a user with the "Store Owner" role first.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Store"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
