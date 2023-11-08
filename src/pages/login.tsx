import { useCallback } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { usePocket } from "@/contexts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  password: z.string(),
});

export const Login = () => {
  const { login, user } = usePocket();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      try {
        await login(data.email, data.password);
        navigate("/");
      } catch {
        toast({
          title: "Login Failed",
          variant: "destructive",
          duration: 3000,
          description: "The server might be down.",
        });
      }
    },
    [login, navigate, toast]
  );

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen flex-col justify-center items-center">
      <section className="flex w-1/2 flex-col gap-4 rounded-md p-8">
        <h1 className="text-center text-3xl font-extrabold">Gunn Runners</h1>
        <h2 className="text-xl text-center">Login</h2>
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
            <div className="flex justify-between mt-2">
              <Link
                to="/signup"
                className={buttonVariants({ variant: "default" })}
              >
                Go to Sign Up
              </Link>
              <Button type="submit">Login</Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
};
