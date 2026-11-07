import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { usePocket } from "@/contexts";
import { buttonVariants } from "@/components/ui/button";

export const ConfirmVerification = () => {
  const { token } = useParams<{ token: string }>();
  const { confirmVerification } = usePocket();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    confirmVerification(token)
      .then(() => !cancelled && setStatus("success"))
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [confirmVerification, token]);

  return (
    <div className="flex h-screen flex-col justify-center items-center">
      <section className="flex w-full md:w-1/2 max-w-xl flex-col gap-4 rounded-md p-8 text-center">
        <h1 className="text-3xl font-extrabold">Gunn Runners</h1>
        <h2 className="text-xl">Email Verification</h2>
        {status === "loading" && <p>Verifying your email...</p>}
        {status === "success" && (
          <>
            <p>Your email has been verified. You can now log in.</p>
            <Link href="/login" className={buttonVariants()}>
              Go to Login
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <p>
              This verification link is invalid or has expired. Try logging in
              to request a new one.
            </p>
            <Link href="/login" className={buttonVariants()}>
              Go to Login
            </Link>
          </>
        )}
      </section>
    </div>
  );
};
