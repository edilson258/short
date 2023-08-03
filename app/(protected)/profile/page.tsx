import { UserProfile } from "@/components/user-profile";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/nextAuthOptions";

export default async function UserProfilePage() {
  const session = await getServerSession(authOptions);
  if (session && session.user) return <UserProfile session={session} />;
  return redirect("/signin");
}
