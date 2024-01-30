import { useCallback, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
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

const FormSchema = z.object({
  email: z.string().email(),
});

export const ResetPassword = () => {
  const { resetPassword, user } = usePocket();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.formState, form.reset]);

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      try {
        await resetPassword(data.email);
        toast({
          title: "Email sent!",
          duration: 5000,
          description:
            "You should receive a reset password email any moment now. If not, please check your spam folder. Once reset, head back to the login page.",
        });
      } catch {
        toast({
          title: "Reset password failed.",
          variant: "destructive",
          duration: 3000,
          description: "The server might be down...",
        });
      }
    },
    [resetPassword, toast]
  );

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen flex-col justify-center items-center">
      <section className="flex w-full sm:w-1/2 flex-col gap-4 rounded-md p-8">
        <h1 className="text-center text-3xl font-extrabold">Gunn Runners</h1>
        <h2 className="text-xl text-center">Password Reset</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between mt-2">
              <Link
                to="/login"
                className={buttonVariants({ variant: "secondary" })}
              >
                Go back to Login
              </Link>
              <Button type="submit">Send reset email</Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
};
