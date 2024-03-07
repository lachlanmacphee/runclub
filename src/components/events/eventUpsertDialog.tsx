import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { usePocket } from "@/contexts";
import { useToast } from "../ui/use-toast";
import { Pencil } from "lucide-react";
import type { Event } from "@/lib/types";
import { DatePicker } from "../ui/date-picker";

const FormSchema = z.object({
  title: z.string(),
  description: z.string(),
  link: z.string(),
  start: z.date(),
  end: z.date(),
});

export function EventUpsertDialog({
  refreshEvents,
  event,
}: {
  refreshEvents: VoidFunction;
  event?: Event;
}) {
  const { pb } = usePocket();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      link: event?.link ?? "",
      start: event?.start,
      end: event?.end,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (event && event.id) {
      await pb.collection("events").update(event.id, {
        title: data.title,
        description: data.description,
        link: data.link,
        start: data.start,
        end: data.end,
      });
      toast({
        title: "Event Updated",
        description: `"${data.title}" has been updated with the information you provided.`,
      });
    } else {
      await pb.collection("events").create({
        title: data.title,
        description: data.description,
        link: data.link,
        start: data.start,
        end: data.end,
      });
      toast({
        title: "Event Added",
        description: `We've added "${data.title}" to the events list.`,
      });
    }

    refreshEvents();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {event ? (
          <Button variant="outline" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="w-full sm:w-48">Add Event</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Description (encouraged)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Link (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DatePicker date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <DatePicker date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="gap-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit">{event ? "Update" : "Add"}</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
