"use client";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { CgSpinner } from "react-icons/cg";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { SignInWithGoogleButton } from "@/components/sign-with-google-btn";

type signinStates = "IDLE" | "SIGNING" | "ERROR" | "DONE";

export default function SigninPage() {
  const router = useRouter();

  const [isvalidFormData, setIsValidFormData] = useState(true);
  const [signinState, setSigninState] = useState<signinStates>("IDLE");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setSigninState("SIGNING");

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) {
      setIsValidFormData(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!signInResult) {
      setSigninState("ERROR");
      return;
    }

    if (!signInResult.error) {
      router.replace("/");
      setSigninState("DONE");
    } else {
      setSigninState("ERROR");
    }
  };

  const handleSignInWithGoogle = () => {
    signIn("google", {
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div className="pt-[20%] md:pt-[10%] pb-16 max-w-xs mx-auto md:max-w-ms min-h-screen text-center text-slate-500">
      <h1 className="text-3xl text-slate-700 font-bold">Welcome back</h1>
      <p className="mt-2">Fill the form bellow to sign in your account</p>

      {signinState === "ERROR" && (
        <div className="bg-red-500 text-white mt-4 rounded p-2">
          <h1 className="text-lg">Some error occured</h1>
          <p className="text-sm">Verify your credentials and try again</p>
        </div>
      )}

      <form onSubmit={onFormSubmit} className="text-left my-8">
        <label
          className="block text-slate-600 font-bold mb-2 mt-4"
          htmlFor="email"
        >
          Email
        </label>
        <input
          ref={emailRef}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-slate-700"
          autoCorrect="off"
          autoComplete="email"
          autoCapitalize="none"
          type="email"
          id="email"
          name="email"
          autoFocus
          placeholder="address@example.com"
        />
        <label
          className="block text-slate-600 font-bold mb-2 mt-4"
          htmlFor="password"
        >
          Password
        </label>
        <input
          ref={passwordRef}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-slate-700"
          autoCorrect="off"
          autoComplete="password"
          autoCapitalize="none"
          type="password"
          id="password"
          name="password"
          placeholder="********"
        />

        <div className="mt-4 text-center">
          <a
            className="italic text-blue-500 underline underline-offset-1"
            href="/register"
          >
            Don't have an account? signup here
          </a>
        </div>

        <button
          disabled={signinState === "SIGNING" || signinState === "DONE"}
          type="submit"
          className="disabled:opacity-75 font-bold my-8 w-full bg-slate-700 p-2 rounded text-white"
        >
          {signinState === "SIGNING" && (
            <div className="flex items-center justify-center gap-2">
              <CgSpinner className="w-5 h-auto animate-spin" />
              <span>Signing...</span>
            </div>
          )}
          {(signinState === "IDLE" || signinState === "ERROR") && (
            <span>Sign In</span>
          )}
          {signinState === "DONE" && <span>Redirecting...</span>}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <SignInWithGoogleButton
          handleSignInWithGoogle={handleSignInWithGoogle}
        />
      </form>
    </div>
  );
}
