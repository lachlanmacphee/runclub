import { useCallback, useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";

import { usePocket } from "@/contexts";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { register, user } = usePocket();
  const navigate = useNavigate();

  const handleSignUp = useCallback(async () => {
    await register(email, password, passwordConfirm);
    navigate("/");
    return;
  }, [register, email, password, passwordConfirm, navigate]);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen flex-col justify-center items-center">
      <section className="flex w-1/2 flex-col gap-4 rounded-md p-8">
        <h1 className="text-center text-3xl font-extrabold">Gunn Runners</h1>
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-xl">Sign Up</h2>
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
          <Input
            placeholder="Confirm Password"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <div className="flex justify-between mt-2">
            <Link to="/" className={buttonVariants({ variant: "default" })}>
              Go to Login
            </Link>
            <Button onClick={handleSignUp}>Sign Up</Button>
          </div>
        </div>
      </section>
    </div>
  );
};
