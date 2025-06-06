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
import { Pencil, Plus } from "lucide-react";
import type { Event } from "@/lib/types";
import { DatePicker } from "../ui/date-picker";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";

const FormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  link: z.string(),
  start: z.date({ required_error: "Start date is required." }),
  end: z.date({
    required_error:
      "End date is required. Set it the same as the start date if the event is only one day.",
  }),
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
  const [open, setOpen] = useState(false);

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

    setOpen(false);
    refreshEvents();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {event ? (
          <Button variant="outline" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        aria-describedby="add or update an event"
        className="sm:max-w-md"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {event ? "Edit Event" : "Add New Event"}
              </DialogTitle>
              <DialogDescription>
                {event ? "Modify" : "Fill out"} the fields below to{" "}
                {event ? "update this" : "add an"} event
              </DialogDescription>
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
                    <FormLabel>Event Description</FormLabel>
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
                    <FormLabel>Event Link</FormLabel>
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
              <Button type="submit">{event ? "Update" : "Add"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
