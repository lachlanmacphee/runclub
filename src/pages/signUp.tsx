import { useCallback } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Checkbox } from "@/components/ui/checkbox";

const FormSchema = z
  .object({
    fullName: z.string().min(5),
    email: z.string().email(),
    password: z.string().min(10),
    passwordConfirm: z.string().min(10),
    requestVolunteer: z.boolean().default(false),
    alias: z
      .union([z.string().length(0), z.string().min(5)])
      .optional()
      .transform((e) => (e === "" ? undefined : e)),
  })
  .refine((schema) => schema.password === schema.passwordConfirm, {
    message: "Passwords must match",
    path: ["passwordConfirm"],
  });

export const SignUp = () => {
  const { register, login, user } = usePocket();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      passwordConfirm: "",
      requestVolunteer: false,
      alias: "",
    },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      try {
        await register(
          data.fullName,
          data.email,
          data.password,
          data.passwordConfirm,
          data.requestVolunteer,
          data.alias
        );
        await login(data.email, data.password);
        navigate("/");
      } catch (error) {
        const message = getErrorMessage(error);
        toast({
          title: "Account Creation Failed",
          variant: "destructive",
          duration: 3000,
          description: message,
        });
      }
    },
    [login, navigate, register, toast]
  );

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen flex-col justify-center items-center">
      <section className="flex w-full sm:w-3/4 md:w-1/2 flex-col gap-4 rounded-md p-8">
        <h1 className="text-center text-3xl font-extrabold">Gunn Runners</h1>
        <h2 className="text-xl text-center">Create an Account</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} />
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
                    Alias (optional - please use this only if you have to)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="John S" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john.smith@gmail.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requestVolunteer"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Request volunteering capabilities? Tick this if you plan
                      to volunteer in future.
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-between mt-2">
              <Link
                to="/login"
                className={buttonVariants({ variant: "secondary" })}
              >
                Go to Login
              </Link>
              <Button type="submit">Create Account</Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
};
