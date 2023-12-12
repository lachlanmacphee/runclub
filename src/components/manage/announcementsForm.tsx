import { useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AnnouncementTypes, announcementTypes } from "@/lib/constants";
import { AnnouncementBanner } from "../navbar/announcementBanner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const FormSchema = z.object({
  type: z.nativeEnum(AnnouncementTypes),
  daysToShow: z.string(),
});

export function Announcements() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: AnnouncementTypes.ChristmasParty,
      daysToShow: "1",
    },
  });

  const currentType = form.watch("type");

  const onSubmit = useCallback(async (data: z.infer<typeof FormSchema>) => {
    try {
      // do something with data
      console.log(data);
    } catch {
      toast({
        title: "Update Failed",
        variant: "destructive",
        duration: 3000,
        description: "Failed to update the announcement...",
      });
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold text-2xl">Announcements</h2>
      <Form {...form}>
        <h3 className="font-semibold text-lg">Preview</h3>
        <AnnouncementBanner type={currentType} isPreview />
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {Object.values(AnnouncementTypes).map((type) => (
                      <FormItem
                        className="flex items-center space-x-3 space-y-0"
                        key={type}
                      >
                        <FormControl>
                          <RadioGroupItem value={type} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {announcementTypes[type]}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="daysToShow"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Days To Display</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
        <Button type="submit" className="max-w-sm mt-3">
          Update
        </Button>
      </Form>
    </div>
  );
}
