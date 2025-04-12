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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useState } from "react";
import { Volunteer } from "@/lib/types";
import { Minus } from "lucide-react";

const FormSchema = z.object({
  id: z.string(),
});

export function AdminRemoveVolunteer({
  tuesdays,
  volunteers,
}: {
  tuesdays: string[];
  volunteers: { [key: string]: Volunteer[] };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { pb } = usePocket();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [selectedDate, setSelectedDate] = useState(tuesdays[0]);

  async function onSubmit({ id }: z.infer<typeof FormSchema>) {
    await pb.collection("volunteers").delete(id);

    toast({
      title: "Volunteer Removed",
    });

    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Minus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Remove Volunteer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Select
                value={selectedDate}
                onValueChange={(val) => setSelectedDate(val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tuesdays.map((dateStr) => {
                    const date = new Date(dateStr);
                    return (
                      <SelectItem key={dateStr} value={dateStr}>
                        {date.toLocaleDateString("en-us", {
                          month: "short",
                          day: "numeric",
                        })}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {selectedDate && (
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volunteer</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a volunteer to remove..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {volunteers[selectedDate]?.map((vol) => (
                            <SelectItem value={vol.id} key={vol.id}>
                              {vol.expand.user_id?.name ??
                                vol.expand.waiver_id?.fname +
                                  " " +
                                  vol.expand.waiver_id?.lname}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <DialogFooter className="gap-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit">Remove</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
