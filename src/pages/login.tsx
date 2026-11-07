import { useCallback, useState } from "react";
import { ClientResponseError } from "pocketbase";
import { useLocation, Link, Redirect } from "wouter";
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
  email: z.email(),
  password: z.string(),
});

export const Login = () => {
  const { OAuthLogin, login, resendVerification, user } = usePocket();
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

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
      setUnverifiedEmail(null);
      try {
        await login(data.email, data.password);
        navigate("/");
      } catch (error) {
        if (error instanceof ClientResponseError && error.status === 403) {
          setUnverifiedEmail(data.email);
        }
        const message = getErrorMessage(error);
        toast({
          title: "Login Failed",
          variant: "destructive",
          duration: 3000,
          description: message,
        });
      }
    },
    [login, navigate, toast],
  );

  const handleResend = useCallback(async () => {
    if (!unverifiedEmail) return;
    try {
      await resendVerification(unverifiedEmail);
      toast({
        title: "Verification email sent",
        duration: 5000,
        description: "Check your inbox (and spam folder) for the link.",
      });
    } catch (error) {
      toast({
        title: "Couldn't send verification email",
        variant: "destructive",
        duration: 5000,
        description: getErrorMessage(error),
      });
    }
  }, [resendVerification, toast, unverifiedEmail]);

  if (user) {
    return <Redirect to="/" replace />;
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
                href="/signup"
                className={buttonVariants({ variant: "link" })}
              >
                Need an account?
              </Link>
              <Link
                href="/resetpassword"
                className={buttonVariants({ variant: "link" })}
              >
                Forgot password?
              </Link>
            </div>
            {unverifiedEmail && (
              <div className="flex flex-col gap-2 rounded-md border p-4 text-sm">
                <p>Your email address hasn't been verified yet.</p>
                <Button type="button" variant="secondary" onClick={handleResend}>
                  Resend verification email
                </Button>
              </div>
            )}
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
