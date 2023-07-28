import { UserProfile } from "@/components/user-profile/profile";
import { getServerSession } from "next-auth";
import {redirect} from "next/navigation";

export default async function UserProfilePage() {
  const session = await getServerSession();
  if (session && session.user) return <UserProfile session={session} />;
  return redirect("/signin")
}
