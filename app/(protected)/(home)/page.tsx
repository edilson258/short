import Home from "@/components/home"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

export default async function Main() {
  const session = await getServerSession()
  if(session && session.user) return <Home />
  return redirect("signin/")
}
