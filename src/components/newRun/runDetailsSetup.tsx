import { Dispatch, SetStateAction, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePocket } from "@/contexts";
import { GroupRun } from "@/lib/types";

// Components
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import { IntroMessageDialog } from "./introMessageDialog";
import { WEATHER_URL } from "@/lib/constants";
import { toast } from "../ui/use-toast";
import { getWeatherString } from "@/lib/utils";
import { ListResult, RecordModel } from "pocketbase";

const FormSchema = z.object({
  date: z.date(),
  location: z.enum([
    "albertParkLake",
    "portMelbBeach",
    "southMelbBeach",
    "tanGardens",
  ]),
});

const initialDate = new Date();
initialDate.setHours(0, 0, 0, 0);

export function RunDetailsSetup({
  setGroupRun,
  setStep,
}: {
  setGroupRun: Dispatch<SetStateAction<GroupRun | undefined>>;
  setStep: Dispatch<SetStateAction<number>>;
}) {
  const { pb } = usePocket();

  const [isIntroModalOpen, setIsIntroModalOpen] = useState(true);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      date: initialDate,
      location: "albertParkLake",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let weatherStr: string | null = null;

    try {
      // In future need to fetch weather based on date input when submitting
      const res = await fetch(WEATHER_URL);
      const { current } = await res.json();
      weatherStr = getWeatherString(current);
    } catch (e) {
      toast({
        title: "Weather Failed",
        variant: "destructive",
        duration: 5000,
        description:
          "Failed to fetch the weather. Please report this to the committee.",
      });
    }

    const existingRun: ListResult<RecordModel> = await pb
      .collection("group_runs")
      .getList(1, 1, {
        filter: pb.filter("date = {:date}", { date: data.date }),
      });

    if (existingRun.items.length > 0) {
      toast({
        title: "Existing Run",
        variant: "destructive",
        duration: 5000,
        description:
          "There is already a run setup for this day. Please refresh and continue the run that appears.",
      });
      return;
    }

    const groupRun: GroupRun = await pb.collection("group_runs").create({
      date: data.date,
      location: data.location,
      isComplete: false,
      conditions: weatherStr,
    });
    setGroupRun(groupRun);
    setStep(1);
  }

  return (
    <>
      <IntroMessageDialog
        isIntroModalOpen={isIntroModalOpen}
        setIsIntroModalOpen={setIsIntroModalOpen}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <h1 className="text-3xl md:text-5xl text-center md:text-left font-bold">
            Run Details
          </h1>
          <div className="space-y-2">
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <ShadSelect
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
                      <SelectItem value="portMelbBeach">
                        Port Melbourne Beach
                      </SelectItem>
                      <SelectItem value="southMelbBeach">
                        South Melbourne Beach
                      </SelectItem>
                      <SelectItem value="tanGardens">
                        Botanical Gardens
                      </SelectItem>
                    </SelectContent>
                  </ShadSelect>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-center">
            <Button type="submit" className="w-48">
              Create Run
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
