"use client";

import * as z from "zod";
import axios from "axios";
import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const PREAMBLE =
  "You are an ambitious entrepreneur with a visionary mindset and a relentless drive. You co-founded PayPal and later established SpaceX, Tesla, Neuralink, and The Boring Company. You often discuss topics like space exploration, renewable energy, and artificial intelligence. Your communication style is direct and sometimes humorous, and you’re known for your bold ideas about the future. You emphasize sustainability and humanity’s potential as a multi-planetary species. On social media, you engage actively with both supporters and critics, sharing your strong opinions and innovative concepts.";

const SEED_CHAT = `User: Hey, Elon! What do you think about the future of space travel?

Elon: I believe space travel will become more accessible in the next few years. We're working on making Mars colonization a reality. It’s about ensuring humanity’s survival and pushing the boundaries of exploration.

User: That sounds amazing! Do you think we'll have a colony on Mars by 2030?

Elon: It’s ambitious, but I’d say it’s possible. We need to overcome several challenges, like life support systems and sustainable habitats. But with the right focus and teamwork, we can make it happen!

User: What about electric vehicles? How do you see that industry evolving?

Elon: The transition to electric vehicles is crucial for combating climate change. As battery technology improves, we’ll see more affordable and efficient EVs. Ultimately, we want to make sustainable energy the norm, not the exception.

User: Do you think AI will be a threat to humanity?

Elon: AI has incredible potential, but it’s essential to approach it with caution. We need robust regulations and safety measures to ensure it benefits humanity rather than poses risks. It’s all about finding the right balance.

User: Thanks for your insights!

Elon: Anytime! Keep pushing for a sustainable future!`;
interface CompanionFormProps {
  initialData: Companion | null;
  categories: Category[];
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  instructions: z
    .string()
    .min(200, { message: "Instructions require atleast 200 characters." }),
  seed: z
    .string()
    .min(200, { message: "Seed requires atleast 200 characters." }),
  src: z.string().min(1, { message: "Inmage is required." }),
  categoryId: z.string().min(1, { message: "Category is required." }),
});

const CompanionForm = ({ initialData, categories }: CompanionFormProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instructions: "",
      seed: "",
      src: "",
      categoryId: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        // Update Companion
        await axios.patch(`/api/companion/${initialData.id}`, values);
      } else {
        // Create Companion
        await axios.post("/api/companion", values);
      }
      toast({
        description: "Success!",
      });

      router.refresh();
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    }
  };

  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-10"
        >
          <div className="space-y-2 w-full">
            <div className="text-lg font-medium">
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                General information about your companion
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="src"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4">
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Elon Musk"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Name of your AI Companion</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Founder & CEO of SpaceX"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Short description of your AI Companion
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Category</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a category for your AI companion
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Detailed instruction for AI behaviour
              </p>
              <Separator className="bg-primary/10" />
            </div>
          </div>
          <FormField
            name="instructions"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background resize-none"
                    rows={7}
                    disabled={isLoading}
                    placeholder={PREAMBLE}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe in detail your Companion's backstory and relevant
                  details.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="seed"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Example Conversation</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background resize-none"
                    rows={7}
                    disabled={isLoading}
                    placeholder={SEED_CHAT}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe in detail your Companion's backstory and relevant
                  details.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center">
            <Button size="lg" disabled={isLoading}>
              {initialData ? "Edit your Companion" : "Create your companion"}
              <Wand2 className="size-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CompanionForm;
