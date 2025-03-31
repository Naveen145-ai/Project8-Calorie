import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InsertWaitlistEntry, insertWaitlistSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle } from "lucide-react";

// Extend the schema to add client-side validation
const waitlistFormSchema = insertWaitlistSchema.extend({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;

const interestOptions = [
  { id: "nutrition", label: "Nutrition tracking" },
  { id: "meal", label: "Meal planning" },
  { id: "workout", label: "Workout plans" },
  { id: "alternatives", label: "Healthier food alternatives" },
];

export default function WaitlistForm() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      interests: [],
    },
  });

  const onSubmit = async (values: WaitlistFormValues) => {
    try {
      await apiRequest("POST", "/api/waitlist", values);
      
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll be in touch soon!",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold font-montserrat mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-4">
          You've successfully joined our waitlist. We'll notify you at {form.getValues().email} when NutriScan AI is ready.
        </p>
        <p className="text-sm text-muted-foreground">Check your email for a confirmation message.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
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
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="interests"
          render={() => (
            <FormItem>
              <FormLabel>I'm interested in:</FormLabel>
              <div className="space-y-2">
                {interestOptions.map((option) => (
                  <FormField
                    key={option.id}
                    control={form.control}
                    name="interests"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={option.id}
                          className="flex items-center space-x-2 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value || [], option.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-sm">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg py-3 px-6 transition-colors"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Secure My Spot
        </Button>
        
        <p className="text-sm text-muted-foreground text-center mt-4">
          We'll notify you as soon as NutriScan AI is ready for you!
        </p>
      </form>
    </Form>
  );
}
