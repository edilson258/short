"use client";
import { FcGoogle } from "react-icons/fc";
import { CgSpinner } from "react-icons/cg";
import { FormEvent, useState } from "react";
import FormInput from "@/components/form/input";
import { createUserRequest } from "./storeUserRequest";
import { handleAutoSignin } from "./handleAutoSignin";
import { TRegisterStates } from "./types";
import { useRouter } from "next/navigation";
import { SignInWithGoogleButton } from "@/components/sign-with-google-btn";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const [registerState, setResgisterState] = useState<TRegisterStates>("IDLE");
  const [errorMessage, setErrorMessage] = useState("");

  const onFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setResgisterState(() => "CREATING");

    if (!username || !email || !password) {
      setResgisterState(() => "ERROR_CREATING_USER");
      setErrorMessage(() => "Please fill the form with valid informations.");
      return;
    }

    const { status: createUserResponseStatus } = await createUserRequest({
      username,
      email,
      password,
    });

    switch (createUserResponseStatus) {
      case 201:
        setResgisterState(() => "SIGNING");
        const { status: autoSignInStatus, msg } = await handleAutoSignin({
          email,
          password,
        });
        if (autoSignInStatus === 200) {
          setResgisterState(() => "DONE");
          router.replace("/");
        } else {
          setResgisterState(() => "ERROR_SIGNING_USER");
          setErrorMessage(() => msg || "Unknown Error Occured!");
        }
        return;
      case 409:
        setResgisterState(() => "ERROR_CREATING_USER");
        setErrorMessage(() => "Email address is already used");
        return;
      case 422:
        setResgisterState(() => "ERROR_CREATING_USER");
        setErrorMessage(() => "Provided user data is invalid");
        return;
      case 500:
        setResgisterState(() => "ERROR_CREATING_USER");
        setErrorMessage(() => "Internal Server Error");
        return;
      default:
        setResgisterState(() => "ERROR_CREATING_USER");
        setErrorMessage(() => "Unknown Error Occured");
        return;
    }
  };

  const isCreatingUser = registerState === "CREATING";
  const isCreatingUserError = registerState === "ERROR_CREATING_USER";
  const isSigningUser = registerState === "SIGNING";
  const isSigningUserError = registerState === "ERROR_SIGNING_USER";
  const isRegistrationIDLE = registerState === "IDLE";
  const isRegistrationDone = registerState === "DONE";

  const handleSignInWithGoogle = () => {
    signIn("google", {
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div className="pt-[20%] md:pt-[10%] pb-16 max-w-xs mx-auto md:max-w-ms min-h-screen text-center text-slate-500">
      <h1 className="text-3xl text-slate-700 font-bold">Welcome</h1>
      <p className="mt-2">Fill the form bellow to create an account</p>

      {(isCreatingUserError || isSigningUserError) && (
        <div className="bg-red-500 text-white mt-4 rounded p-2">
          <h1 className="text-lg">Some error occured</h1>
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={onFormSubmit} className="text-left my-8">
        <FormInput
          autoFocus
          hasLabel
          labelName="Username"
          labelClassName="block text-slate-600 font-bold mb-2"
          setValue={setUsername}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-slate-700"
          type="text"
          id="username"
          placeholder="your username"
          autoComplete="name"
          name="username"
        />

        <FormInput
          hasLabel
          labelName="Email"
          labelClassName="block text-slate-600 font-bold mb-2 mt-4"
          setValue={setEmail}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-slate-700"
          autoCorrect="off"
          autoComplete="email"
          autoCapitalize="none"
          type="email"
          id="email"
          name="email"
          placeholder="address@example.com"
        />

        <FormInput
          hasLabel
          labelName="Password"
          labelClassName="block text-slate-600 font-bold mb-2 mt-4"
          setValue={setPassword}
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
            href="/signin"
          >
            Already have an account? signin here
          </a>
        </div>

        <button
          disabled={isCreatingUser || isSigningUser || isRegistrationDone}
          type="submit"
          className="disabled:opacity-75 font-bold mt-8 w-full bg-slate-700 p-2 rounded text-white"
        >
          {isCreatingUser && (
            <div className="flex items-center justify-center gap-2">
              <CgSpinner className="w-5 h-auto animate-spin" />
              <span>Creating account...</span>
            </div>
          )}

          {isSigningUser && (
            <div className="flex items-center justify-center gap-2">
              <CgSpinner className="w-5 h-auto animate-spin" />
              <span>Signing into account...</span>
            </div>
          )}

          {(isRegistrationIDLE ||
            isCreatingUserError ||
            isSigningUserError) && <span>Register</span>}
          {isRegistrationDone && <span>Redirecting...</span>}
        </button>
      </form>

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
    </div>
  );
}
