import { Dispatch, SetStateAction, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePocket } from "@/contexts";
import { GroupRun } from "@/lib/types";

// Components
import { Button } from "@/components/ui/button";
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
import { LOCATION_OPTIONS, WEATHER_URL } from "@/lib/constants";
import { toast } from "../ui/use-toast";
import { getWeatherString } from "@/lib/utils";
import { ListResult, RecordModel } from "pocketbase";
import { Loader2 } from "lucide-react";

const FormSchema = z.object({
  location: z.enum([
    LOCATION_OPTIONS.AP_LAKE,
    LOCATION_OPTIONS.PM_BEACH,
    LOCATION_OPTIONS.SM_BEACH,
    LOCATION_OPTIONS.TAN,
  ]),
});

export function RunDetailsSetup({
  setGroupRun,
  setStep,
}: {
  setGroupRun: Dispatch<SetStateAction<GroupRun | undefined>>;
  setStep: Dispatch<SetStateAction<number>>;
}) {
  const { pb } = usePocket();

  const [isIntroModalOpen, setIsIntroModalOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      location: LOCATION_OPTIONS.AP_LAKE,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    let weatherStr: string = "Weather data not available for this run.";

    try {
      const res = await fetch(WEATHER_URL);
      const { current } = await res.json();
      weatherStr = getWeatherString(current);
    } catch (e) {
      setIsLoading(false);
      toast({
        title: "Weather Failed",
        variant: "destructive",
        duration: 5000,
        description:
          "Failed to fetch the weather. Please report this to the committee.",
      });
    }

    const dateNow = new Date();
    const dateToday = new Date();
    dateToday.setHours(0, 0, 0, 0);

    const existingRun: ListResult<RecordModel> = await pb
      .collection("group_runs")
      .getList(1, 1, {
        filter: pb.filter("date >= {:dateToday} && date <= {:dateNow}", {
          dateToday,
          dateNow,
        }),
      });

    if (existingRun.items.length > 0) {
      toast({
        title: "Existing Run",
        variant: "destructive",
        duration: 5000,
        description:
          "There is already a run setup for this day. If it's still in progress, please refresh and continue the run that appears.",
      });
      setIsLoading(false);
      return;
    }

    const groupRun: GroupRun = await pb.collection("group_runs").create({
      date: dateNow,
      location: data.location,
      isComplete: false,
      conditions: weatherStr,
    });
    setIsLoading(false);
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
          <div className="flex justify-center">
            <Button type="submit" className="w-48" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 md:h-8 md:w-8 animate-spin" />
              ) : (
                "Create Run"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
