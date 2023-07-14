"use client"
import {FormEvent} from "react"
import { FcGoogle } from "react-icons/fc"

export default function RegisterPage() {

  const onFormSubmit = async (e: FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="pt-[20%] md:pt-[30%] max-w-xs mx-auto md:max-w-ms min-h-screen text-center text-slate-500">
      <h1 className="text-3xl text-slate-700 font-bold">Welcome</h1>
      <p className="mt-2">Fill the form bellow to create an account</p>
      <form onSubmit={onFormSubmit} className="text-left my-8">
        <label className="block text-slate-600 font-bold mb-2" htmlFor="username">Username</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-slate-700"
          type="text"
          id="username"
          placeholder="your username"
          autoComplete="name"
          name="username"
          autoFocus
        />
        <label className="block text-slate-600 font-bold mb-2 mt-4" htmlFor="email">Email</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-slate-700"
          autoCorrect="off"
          autoComplete="email"
          autoCapitalize="none"
          type="email"
          id="email"
          name="email"
          placeholder="address@example.com"
        />
        <label className="block text-slate-600 font-bold mb-2 mt-4" htmlFor="password">Password</label>
        <input
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
          <a className="italic text-blue-500 underline underline-offset-1" href="/signin">Already have an account? signin here</a>
        </div>

        <button
          type="submit"
          className="font-bold mt-8 w-full bg-slate-700 p-2 rounded text-white"
        >
          Register
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
  )
}
