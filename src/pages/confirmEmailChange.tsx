import { useCallback } from "react";
import { Link, useLocation, useParams } from "wouter";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePocket } from "@/contexts";

// Components
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
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
  password: z.string().min(1, "Password is required"),
});

export const ConfirmEmailChange = () => {
  const { token } = useParams<{ token: string }>();
  const { confirmEmailChange } = usePocket();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      try {
        await confirmEmailChange(token, data.password);
        toast({
          title: "Email updated",
          duration: 5000,
          description: "Log in again using your new email address.",
        });
        navigate("/login");
      } catch (error) {
        toast({
          title: "Email change failed",
          variant: "destructive",
          duration: 5000,
          description: `${getErrorMessage(error)} Check your password, or request a new link from your account page if this one has expired.`,
        });
      }
    },
    [confirmEmailChange, navigate, toast, token],
  );

  return (
    <div className="flex h-screen flex-col justify-center items-center">
      <section className="flex w-full sm:w-1/2 flex-col gap-4 rounded-md p-8">
        <h1 className="text-center text-3xl font-extrabold">Gunn Runners</h1>
        <h2 className="text-xl text-center">Confirm Email Change</h2>
        <p className="text-center text-muted-foreground">
          Enter your current password to confirm your new email address.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between mt-2">
              <Link
                href="/login"
                className={buttonVariants({ variant: "secondary" })}
              >
                Back to Login
              </Link>
              <Button type="submit">Confirm</Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
};
