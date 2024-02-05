import { useCallback } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
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
  email: z.string().email(),
  password: z.string(),
});

export const Login = () => {
  const { OAuthLogin, login, user } = usePocket();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleOAuthLogin = async (provider: string) => {
    await OAuthLogin(provider);
    navigate("/");
  };

  const onSubmit = useCallback(
    async (data: z.infer<typeof FormSchema>) => {
      try {
        await login(data.email, data.password);
        navigate("/");
      } catch (error) {
        const message = getErrorMessage(error);
        toast({
          title: "Login Failed",
          variant: "destructive",
          duration: 3000,
          description: message,
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
      <section className="flex w-full sm:w-1/2 flex-col gap-4 rounded-md p-8">
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
            <Link
              to="/resetpassword"
              className={buttonVariants({ variant: "link" })}
            >
              Forgot your password?
            </Link>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              type="button"
              className="flex gap-1"
              onClick={() => handleOAuthLogin("google")}
            >
              <span>Google</span>
            </Button>
            <Button
              variant="outline"
              type="button"
              className="flex gap-1"
              onClick={() => handleOAuthLogin("facebook")}
            >
              <span>Facebook</span>
            </Button>
            <div className="flex justify-between mt-2">
              <Link
                to="/signup"
                className={buttonVariants({ variant: "secondary" })}
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
