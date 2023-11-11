import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";

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
import { hasDuplicates } from "@/utils";
import { usePocket } from "@/contexts";
import { User } from "@/types";

const FormSchema = z
  .object({
    date: z.date(),
    location: z.enum(["albertParkLake"]),
    participants: z.array(
      z.object({
        bib: z.string(),
        name: z.object({ value: z.string(), label: z.string() }),
        distance: z.string(),
      })
    ),
  })
  .refine(
    (schema) => {
      const bibArr = schema.participants.map((elem) => elem.bib);
      return !hasDuplicates(bibArr);
    },
    {
      path: ["participants"],
      message: "You cannot have duplicate bib numbers.",
    }
  );

export function NewRun() {
  const [users, setUsers] = useState<User[]>([]);
  const { pb } = usePocket();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      date: new Date(),
      location: "albertParkLake",
      // Workaround to enable null initial value
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      participants: [{ bib: "1", name: null, distance: "5" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  useEffect(() => {
    async function fetchUsers() {
      const res = (await pb.collection("users").getFullList()) as User[];
      setUsers(res);
    }
    fetchUsers();
  }, [pb]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { id: groupRunId } = await pb
      .collection("group_runs")
      .create({ date: data.date, location: data.location });

    Promise.all(
      data.participants.map(async (participant) => {
        const data = {
          group_run_id: groupRunId,
          user_id:
            participant.name.value == participant.name.label
              ? null
              : participant.name.value,
          name: participant.name.label,
          distance: Number(participant.distance),
          bib: Number(participant.bib),
        };
        await pb
          .collection("participant_runs")
          .create(data, { requestKey: null });
      })
    );

    toast({
      title: "Run Created",
      description: "The run was successfully created.",
    });
  }

  const participants = form.getValues("participants");
  const participantsLength = participants.length;
  const newBibNumber = Number(participants[participantsLength - 1].bib) + 1;

  function addParticipant() {
    append(
      {
        bib: String(newBibNumber),
        // Workaround to enable null initial value
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        name: null,
        distance: "5",
      },
      {
        focusName: `participants.${participantsLength}.name`,
      }
    );
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
                    <Input
                      type="number"
                      {...form.register(`participants.${index}.bib`)}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`participants.${index}.name`}
                      render={({ field }) => (
                        <CreatableSelect
                          {...field}
                          className="custom-react-select-container"
                          classNamePrefix="custom-react-select"
                          placeholder="Select..."
                          options={users.map((user) => {
                            return {
                              label: user.name,
                              value: user.id,
                            };
                          })}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      step={0.5}
                      type="number"
                      {...form.register(`participants.${index}.distance`)}
                    />
                  </TableCell>
                  <TableCell>
                    {index !== 0 && (
                      <Button
                        onClick={() => remove(index)}
                        variant="destructive"
                        size="icon"
                      >
                        <Trash />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="font-bold text-destructive">
                  {form.formState.errors.participants?.root && (
                    <p>{form.formState.errors.participants.root.message}</p>
                  )}
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addParticipant}
                  >
                    <Plus />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex justify-center">
            <Button type="submit" className="w-48">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
