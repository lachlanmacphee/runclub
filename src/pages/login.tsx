import { useCallback, useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";

import { usePocket } from "@/contexts";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = usePocket();
  const navigate = useNavigate();

  const handleOnSubmit = useCallback(async () => {
    await login(email, password);
    navigate("/dashboard");
  }, [email, login, navigate, password]);

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
          <h2 className="text-xl">Login</h2>
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
          <div className="flex justify-between mt-2">
            <Link to="/signup" className="btn btn-secondary">
              Go to Sign Up
            </Link>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
