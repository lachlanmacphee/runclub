import { useCallback, useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";

import { usePocket } from "@/contexts";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { register, user } = usePocket();
  const navigate = useNavigate();

  const handleOnSubmit = useCallback(async () => {
    await register(email, password, passwordConfirm);
    navigate("/");
    return;
  }, [register, email, password, passwordConfirm, navigate]);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen flex-col justify-center items-center">
      <section className="flex text-white w-1/2 flex-col gap-4 bg-slate-600 rounded-md p-8">
        <h1 className="text-center text-3xl font-extrabold">Gunn Runners</h1>
        <form
          onSubmit={handleOnSubmit}
          className="flex flex-col gap-4 text-center"
        >
          <h2 className="text-xl">Sign Up</h2>
          <input
            placeholder="Email"
            type="email"
            className="input input-bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            className="input input-bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            placeholder="Confirm Password"
            type="password"
            className="input input-bordered"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <div className="flex justify-between mt-2">
            <Link to="/" className="btn btn-secondary">
              Go to Login
            </Link>
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
