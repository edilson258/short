"use client"
import { useSearchParams } from "next/navigation"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <main className="pt-[30%] text-slate-500 min-h-screen max-w-xs mx-auto">
      <div className="border rounded-md shadow p-4 text-center">
        <h1 className="text-xl text-red-500 font-bold">Something went wrong</h1>
        <h2 className="mt-4">{ error }</h2>
        <div className="mt-4 italic underline underline-offset-1 text-blue-500">
          <a href="/signin">Back</a>
        </div>
      </div>
    </main>
  )
}
