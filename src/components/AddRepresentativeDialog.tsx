import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { generateCryptoId } from "@/lib/idGenerator";

// Validation schema
const representativeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
  joinDate: z.date().optional(),
});

type RepresentativeFormData = z.infer<typeof representativeSchema>;

interface AddRepresentativeDialogProps {
  onAdd: (representative: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    joinDate: string;
  }) => void;
}

export function AddRepresentativeDialog({ onAdd }: AddRepresentativeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<RepresentativeFormData>>({
    name: "",
    email: "",
    phone: "",
    role: "",
    joinDate: new Date(),
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "",
      joinDate: new Date(),
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    try {
      // Validate the form data
      const validatedData = representativeSchema.parse(formData);
      setIsSubmitting(true);

      // Generate unique ID for the representative
      const representativeId = generateCryptoId();

      // Format join date as YYYY-MM-DD
      const joinDate = validatedData.joinDate 
        ? format(validatedData.joinDate, 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd');

      // Create the representative object
      const newRepresentative = {
        id: representativeId,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        role: validatedData.role,
        joinDate,
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Call the onAdd callback
      onAdd(newRepresentative);

      // Show success toast
      toast({
        title: "Representative added",
        description: `${validatedData.name} has been added successfully.`,
      });

      // Close dialog and reset form
      setOpen(false);
      resetForm();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            zodErrors[err.path.join('.')] = err.message;
          }
        });
        setErrors(zodErrors);
        toast({
          title: "Validation error",
          description: "Please check the form fields and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add representative. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Representative
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Representative</DialogTitle>
          <DialogDescription>
            Enter the representative's information to add them to the company.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">
                Name *
              </Label>
              <Input
                id="name"
                placeholder="e.g., John Martinez"
                value={formData.name || ""}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  setErrors(prev => ({ ...prev, name: "" }));
                }}
                className="h-11"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., john.martinez@company.com"
                value={formData.email || ""}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, email: e.target.value }));
                  setErrors(prev => ({ ...prev, email: "" }));
                }}
                className="h-11"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base font-semibold">
                Phone *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., (415) 555-0123"
                value={formData.phone || ""}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, phone: e.target.value }));
                  setErrors(prev => ({ ...prev, phone: "" }));
                }}
                className="h-11"
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-base font-semibold">
                Role *
              </Label>
              <Input
                id="role"
                placeholder="e.g., Operations Manager, Technical Lead"
                value={formData.role || ""}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, role: e.target.value }));
                  setErrors(prev => ({ ...prev, role: "" }));
                }}
                className="h-11"
              />
              {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="joinDate" className="text-base font-semibold">
                Join Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal h-11 ${!formData.joinDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.joinDate ? format(formData.joinDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.joinDate}
                    onSelect={(date) => {
                      setFormData(prev => ({ ...prev, joinDate: date }));
                      setErrors(prev => ({ ...prev, joinDate: "" }));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.joinDate && <p className="text-sm text-destructive">{errors.joinDate}</p>}
              <p className="text-xs text-muted-foreground">
                Defaults to today's date if not specified.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Representative"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

