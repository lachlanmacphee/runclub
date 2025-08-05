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
import { Textarea } from "../ui/textarea";
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
import { usePocket } from "@/contexts";
import { useToast } from "../ui/use-toast";
import { Pencil, Plus } from "lucide-react";
import type { Donation } from "@/lib/types";
import { DatePicker } from "../ui/date-picker";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";

const FormSchema = z.object({
  recipient: z.string().min(1, {
    message: "Recipient is required.",
  }),
  amount: z.number().positive({
    message: "Amount must be a positive number.",
  }),
  description: z.string().optional(),
  date: z.date({ required_error: "Date is required." }),
  receipt_url: z.string().url().optional().or(z.literal("")),
  category: z.string().min(1, {
    message: "Category is required.",
  }),
});

const categories = [
  { value: "charity", label: "Charity" },
  { value: "community", label: "Community" },
  { value: "environment", label: "Environment" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "sports", label: "Sports" },
  { value: "other", label: "Other" },
];

export function DonationUpsertDialog({
  refreshDonations,
  donation,
}: {
  refreshDonations: VoidFunction;
  donation?: Donation;
}) {
  const { pb } = usePocket();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      recipient: donation?.recipient ?? "",
      amount: donation?.amount ?? 0,
      description: donation?.description ?? "",
      date: donation?.date,
      receipt_url: donation?.receipt_url ?? "",
      category: donation?.category ?? "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (donation && donation.id) {
      await pb.collection("donations").update(donation.id, {
        recipient: data.recipient,
        amount: data.amount,
        description: data.description,
        date: data.date,
        receipt_url: data.receipt_url,
        category: data.category,
      });
      toast({
        title: "Donation Updated",
        description: `Donation to "${data.recipient}" has been updated with the information you provided.`,
      });
    } else {
      await pb.collection("donations").create({
        recipient: data.recipient,
        amount: data.amount,
        description: data.description,
        date: data.date,
        receipt_url: data.receipt_url,
        category: data.category,
      });
      toast({
        title: "Donation Added",
        description: `We've added the donation to "${data.recipient}" to the donations list.`,
      });
    }

    setOpen(false);
    refreshDonations();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {donation ? (
          <Button variant="outline" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Donation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        aria-describedby="add or update a donation"
        className="sm:max-w-md"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {donation ? "Edit Donation" : "Add New Donation"}
              </DialogTitle>
              <DialogDescription>
                {donation ? "Modify" : "Fill out"} the fields below to{" "}
                {donation ? "update this" : "add a"} donation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Organization or cause name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (AUD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <DatePicker date={field.value} setDate={field.onChange} />
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
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional details about the donation"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receipt_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Receipt URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/receipt"
                        {...field}
                      />
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
              <Button type="submit">{donation ? "Update" : "Add"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
