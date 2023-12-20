// import { useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { toast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";

const FormSchema = z.object({
  name: z.string(),
});

export function ClubNameForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "Gunn Runners",
    },
  });

  // const onSubmit = useCallback(async (data: z.infer<typeof FormSchema>) => {
  //   try {
  //     console.log(data)
  //   } catch {
  //     toast({
  //       title: "Update Failed",
  //       variant: "destructive",
  //       duration: 3000,
  //       description: "We couldn't change the team name...",
  //     });
  //   }
  // }, []);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold text-2xl">Club Name</h2>
      <Form {...form}>
        {/* onSubmit={form.handleSubmit(onSubmit)} */}
        <form className="flex gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update</Button>
        </form>
      </Form>
    </div>
  );
}
