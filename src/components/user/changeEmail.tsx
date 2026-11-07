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
import { getErrorMessage } from "@/lib/utils";

const FormSchema = z.object({
  newEmail: z.email(),
});

export const ChangeEmail = () => {
  const { user, requestEmailChange } = usePocket();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { newEmail: "" },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      if (data.newEmail.toLowerCase() === user?.email.toLowerCase()) {
        form.setError("newEmail", {
          message: "This is already your email address",
        });
        return;
      }
      try {
        await requestEmailChange(data.newEmail);
        toast({
          title: "Check your new inbox",
          duration: 10000,
          description:
            "We've sent a confirmation link to your new email address. Your email won't change until you click it.",
        });
        form.reset();
      } catch (error) {
        toast({
          title: "Email Change Failed",
          variant: "destructive",
          duration: 5000,
          description: getErrorMessage(error),
        });
      }
    },
    [form, requestEmailChange, toast, user?.email],
  );

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4 grow max-w-3xl">
        <h1 className="text-5xl font-bold">Email Address</h1>
        <p className="text-muted-foreground">
          Your current email is <span className="font-medium">{user?.email}</span>
          . To change it, enter a new address and confirm it using the link we
          send there. You'll be logged out afterwards and will need to log in
          again.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <FormField
              control={form.control}
              name="newEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="new.email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Change Email</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
