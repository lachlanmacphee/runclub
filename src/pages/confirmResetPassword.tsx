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

const FormSchema = z
  .object({
    password: z
      .string()
      .min(10, "Password must be at least 10 characters long"),
    passwordConfirm: z
      .string()
      .min(10, "Password must be at least 10 characters long"),
  })
  .refine((schema) => schema.password === schema.passwordConfirm, {
    error: "Passwords must match",
    path: ["passwordConfirm"],
  });

export const ConfirmResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const { confirmResetPassword } = usePocket();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { password: "", passwordConfirm: "" },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      try {
        await confirmResetPassword(token, data.password, data.passwordConfirm);
        toast({
          title: "Password updated",
          duration: 5000,
          description: "You can now log in with your new password.",
        });
        navigate("/login");
      } catch (error) {
        toast({
          title: "Password reset failed",
          variant: "destructive",
          duration: 5000,
          description: `${getErrorMessage(error)} The link may be invalid or expired; request a new one from the login page.`,
        });
      }
    },
    [confirmResetPassword, navigate, toast, token],
  );

  return (
    <div className="flex h-screen flex-col justify-center items-center">
      <section className="flex w-full sm:w-1/2 flex-col gap-4 rounded-md p-8">
        <h1 className="text-center text-3xl font-extrabold">Gunn Runners</h1>
        <h2 className="text-xl text-center">Choose a New Password</h2>
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
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
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
              <Button type="submit">Update password</Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
};
