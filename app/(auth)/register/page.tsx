"use client";
import * as z from "zod";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { CgSpinner } from "react-icons/cg";
import { FormEvent, useRef, useState } from "react";
import { storeUserRequestVaidator } from "@/lib/validators/storeUserRequestValidator";

enum possibleSaveUserStatus {
  IDLE,
  SAVING,
  DONE,
  ERROR,
}

export default function RegisterPage() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [isInvalidFormData, setIsInvalidFormData] = useState(false);

  const [saveUserStatus, setSaveUserStatus] = useState<possibleSaveUserStatus>(
    possibleSaveUserStatus.IDLE
  );
  const [errorMessage, setErrorMessage] = useState("");

  const isSavingUser = saveUserStatus === possibleSaveUserStatus.SAVING;
  const isSavingUserError = saveUserStatus === possibleSaveUserStatus.ERROR;

  const onFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setSaveUserStatus(possibleSaveUserStatus.SAVING);

    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !email || !password) {
      setIsInvalidFormData(true);
      return;
    }

    type TStoreUserPayload = z.infer<typeof storeUserRequestVaidator>;
    const storeUserPayload: TStoreUserPayload = {
      username,
      email,
      password,
    };

    const response = await fetch("/api/storeUser", {
      method: "POST",
      body: JSON.stringify(storeUserPayload),
    });

    switch (response.status) {
      case 201:
        setSaveUserStatus(possibleSaveUserStatus.DONE);
        return
      case 409:
        setSaveUserStatus(possibleSaveUserStatus.ERROR);
        setErrorMessage("Email address already exists, try a different one.");
        return
      case 422:
        setSaveUserStatus(possibleSaveUserStatus.ERROR);
        setErrorMessage("Invalid user data.");
        return
      case 500:
        setSaveUserStatus(possibleSaveUserStatus.ERROR);
        setErrorMessage(
          "Internal Sever Error, please try agian. If this error persists contact the website owner"
        );
        return
      default:
        setSaveUserStatus(possibleSaveUserStatus.ERROR);
        setErrorMessage("Unknown error");
        return
    }
  };

  return (
    <div className="pt-[15%] md:pt-[30%] max-w-xs mx-auto md:max-w-ms min-h-screen text-center text-slate-500">
      <h1 className="text-3xl text-slate-700 font-bold">Welcome</h1>
      <p className="mt-2">Fill the form bellow to create an account</p>

      {isSavingUserError && (
        <div className="bg-red-500 text-white mt-4 rounded p-2">
          <h1 className="text-lg">Some error occured</h1>
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={onFormSubmit} className="text-left my-8">
        <label
          className="block text-slate-600 font-bold mb-2"
          htmlFor="username"
        >
          Username
        </label>
        <input
          ref={usernameRef}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-slate-700"
          type="text"
          id="username"
          placeholder="your username"
          autoComplete="name"
          name="username"
          autoFocus
        />
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
            href="/signin"
          >
            Already have an account? signin here
          </a>
        </div>

        <button
          disabled={isSavingUser}
          type="submit"
          className={
            isSavingUser
              ? "disabled:opacity-75 font-bold mt-8 w-full bg-slate-700 p-2 rounded text-white"
              : "disabled:opacity-75 font-bold mt-8 w-full bg-slate-700 p-2 rounded text-white"
          }
        >
          {isSavingUser ? (
            <div className="flex items-center justify-center gap-2">
              <CgSpinner className="w-5 h-auto animate-spin" />
              <span>Register</span>
            </div>
          ) : (
            <span>Register</span>
          )}
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

      <div className="mt-8">
        <button className="text-md flex items-center justify-center gap-2 w-full font-bold p-2 border border-slate-700 rounded">
          <FcGoogle className="text-lg" />
          Google
        </button>
      </div>
    </div>
  );
}
