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
import { AnnouncementBanner } from "../navbar/announcementBanner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePocket } from "@/contexts";

const FormSchema = z.object({
  icon: z.string(),
  message: z.string().min(10),
  daysToShow: z.string(),
});

function IconField({ icon }: { icon: string }) {
  return (
    <FormItem className="flex items-center space-x-3 space-y-0" key={icon}>
      <FormControl>
        <RadioGroupItem value={icon} />
      </FormControl>
      <FormLabel className="font-normal">{icon}</FormLabel>
    </FormItem>
  );
}

export function Announcements() {
  const { pb } = usePocket();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      icon: "Party",
      message: "",
      daysToShow: "1",
    },
  });

  const currentIcon = form.watch("icon");
  const currentMessage = form.watch("message");

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      try {
        const announcementEndTime =
          Date.now() + 1000 * 60 * 60 * 24 * Number(data.daysToShow);

        const recordData = {
          endUnixTime: announcementEndTime,
          icon: data.icon,
          message: data.message,
        };

        await pb.collection("announcements").create(recordData);

        toast({
          title: "Announcement Updated",
          duration: 3000,
          description: `Updated the announcement. It will display for the next ${data.daysToShow} day/s.`,
        });
      } catch {
        toast({
          title: "Update Failed",
          variant: "destructive",
          duration: 3000,
          description: "Failed to update the announcement...",
        });
      }
    },
    [pb]
  );

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold text-2xl">Announcements</h2>
      <Form {...form}>
        <h3 className="font-semibold text-lg">Preview</h3>
        <AnnouncementBanner
          icon={currentIcon}
          message={currentMessage}
          isPreview
        />
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <IconField icon="Alert" />
                    <IconField icon="Party" />
                    <IconField icon="Car" />
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your message here" />
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
          <Button type="submit" className="max-w-sm mt-3">
            Update
          </Button>
        </form>
      </Form>
    </div>
  );
}
