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
import { getTuesdaysForNext3Months } from "@/lib/utils";
import { useMembers } from "@/hooks/useMembers";
import { useState } from "react";

const tuesdaysForNext3Months: Date[] = getTuesdaysForNext3Months();

const FormSchema = z.object({
  run_date: z.string(),
  waiver_id: z.string(),
});

export function AdminAddVolunteer() {
  const [isOpen, setIsOpen] = useState(false);
  const { pb } = usePocket();
  const { toast } = useToast();
  const { members } = useMembers();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      run_date: tuesdaysForNext3Months[0].toDateString(),
    },
  });

  async function onSubmit({
    run_date: run_date_str,
    waiver_id,
  }: z.infer<typeof FormSchema>) {
    const run_date = new Date(run_date_str);

    const res = await pb.collection("volunteers").getFullList({
      filter: pb.filter("run_date = {:run_date}", {
        run_date,
      }),
    });

    if (res.length == 3) {
      setIsOpen(false);
      toast({
        title: "Volunteer Signup Failed",
        variant: "destructive",
        duration: 5000,
        description:
          "There are already 3 volunteers signed up for this run. Please refresh the page to get the latest data",
      });
      return;
    }

    await pb.collection("volunteers").create({ run_date, waiver_id });
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Volunteer Manually</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Volunteers Manually</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="run_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Run Date</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tuesdaysForNext3Months.map((date) => (
                          <SelectItem
                            key={date.toDateString()}
                            value={date.toDateString()}
                          >
                            {date.toLocaleDateString("en-us", {
                              month: "short",
                              day: "numeric",
                            })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="waiver_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem
                            key={member.waiver_id}
                            value={member.waiver_id}
                          >
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              <Button type="submit">Add</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
