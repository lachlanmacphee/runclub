import { useCallback, useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";

import { usePocket } from "@/contexts";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = usePocket();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        await login(email, password);
        navigate("/latestrun");
      } catch {
        toast({
          title: "Login Failed",
          variant: "destructive",
          duration: 3000,
          description: "The server might be down.",
        });
      }
    },
    [email, login, navigate, password, toast]
  );

  if (user) {
    return <Navigate to="/latestrun" replace />;
  }

  return (
    <div className="flex h-screen flex-col justify-center items-center">
      <section className="flex w-1/2 flex-col gap-4 rounded-md p-8">
        <h1 className="text-center text-3xl font-extrabold">Gunn Runners</h1>
        <form
          onSubmit={(e) => handleLogin(e)}
          className="flex flex-col gap-4 text-center"
        >
          <h2 className="text-xl">Login</h2>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      </section>
    </div>
  );
};
