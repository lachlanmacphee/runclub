import { useCallback } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePocket } from "@/contexts";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AccountDetailsSchema } from "@/lib/schemas";
import { User } from "@/lib/types";

export const AccountDetails = () => {
  const pocket = usePocket();
  const pb = pocket.pb;
  const user = pocket.user as User;

  const { toast } = useToast();

  const form = useForm<z.infer<typeof AccountDetailsSchema>>({
    resolver: zodResolver(AccountDetailsSchema),
    reValidateMode: "onBlur",
    defaultValues: {
      name: user.name,
      alias: user.alias,
    },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof AccountDetailsSchema>) => {
      try {
        await pb.collection("users").update(user.id, data);
        toast({
          title: "User Updated",
          duration: 5000,
          description: "Your details have been updated.",
        });
      } catch {
        toast({
          title: "User Update Failed.",
          variant: "destructive",
          duration: 5000,
          description: "We failed to update your details.",
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pb, toast]
  );

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 grow max-w-3xl">
        <h1 className="text-5xl font-bold">Account Details</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Your Alias (optional - please use this only if you have to)
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
