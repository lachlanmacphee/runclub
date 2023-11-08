import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  date: z.date(),
  location: z.enum(["albertParkLake"]),
  participants: z.array(
    z.object({ bib: z.number(), name: z.string(), distance: z.number() })
  ),
});

export function NewRun() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(),
      location: "albertParkLake",
      participants: [{ bib: 1, name: "", distance: 5 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const participantsLength = fields.length;

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="flex flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DatePicker date={field.value} setDate={field.onChange} />
                </FormControl>
                <FormDescription>
                  Select the date for the run. If you are creating it for today,
                  leave it as is.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
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
                    <SelectItem value="albertParkLake">
                      Albert Park Lake
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the location for the run from the available options.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Table className="max-h-64">
            <TableHeader>
              <TableRow>
                <TableHead>Bib</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input {...form.register(`participants.${index}.bib`)} />
                  </TableCell>
                  <TableCell>
                    <Input {...form.register(`participants.${index}.name`)} />
                  </TableCell>
                  <TableCell>
                    <Input
                      {...form.register(`participants.${index}.distance`)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => remove(index)}
                      variant="destructive"
                      size="icon"
                    >
                      <Trash />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      append(
                        {
                          bib: participantsLength + 1,
                          name: "",
                          distance: 5,
                        },
                        {
                          focusName: `participants.${participantsLength}.name`,
                        }
                      )
                    }
                  >
                    <Plus />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
