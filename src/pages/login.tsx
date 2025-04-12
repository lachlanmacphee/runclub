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
import Facebook from "@/components/icons/Facebook";
import Google from "@/components/icons/Google";

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
      <section className="flex w-full md:w-1/2 max-w-xl flex-col gap-4 rounded-md p-8">
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
                    <Input
                      placeholder="Email"
                      type="email"
                      autoComplete="email"
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
            <div className="flex justify-between">
              <Link
                to="/signup"
                className={buttonVariants({ variant: "link" })}
              >
                Need an account?
              </Link>
              <Link
                to="/resetpassword"
                className={buttonVariants({ variant: "link" })}
              >
                Forgot password?
              </Link>
            </div>
            <Button type="submit">Login</Button>
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
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuthLogin("google")}
              >
                <Google className="w-6 h-6 dark:fill-white" />
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuthLogin("facebook")}
              >
                <Facebook className="w-6 h-6 dark:fill-white" />
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
};
