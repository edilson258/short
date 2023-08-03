import { Session } from "next-auth";
import { FiEdit3 } from "react-icons/fi";
import { UserLinkList } from "./links";

export function UserProfile({ session }: { session: Session }) {
  return (
    <main className="z-10 min-h-screen max-w-xs md:max-w-md mx-auto text-center text-slate-500 pt-16 md:pt-[15%]">
      <div className="shadow-lg pb-4 border border-2 rounded-lg">
        <div className="relative">
          <img
            className="-top-8 right-0 left-0 mx-auto w-32 h-32 absolute rounded-full shadow-lg border border-2 border-slate-200"
            src={
              session.user?.image ??
              "https://raw.githubusercontent.com/edilson258/files/main/1309537.png"
            }
          />
        </div>

        <div className="w-fit mx-auto mt-32">
          <h1 className="inline text-slate-700 font-bold text-2xl">
            {session.user?.name}
            {" "}
          </h1>
          <FiEdit3 className="inline mb-4" />
        </div>
        <p className="mt-2 text-slate-500 text-sm">{session.user?.email}</p>

        <div className="my-4 border-t border-slate-200 border-1 w-11/12 mx-auto" />

        <div className="px-2">
          <h1 className="text-left indent-2 font-bold text-slate-700 text-lg">
            Shortned Links
          </h1>
          { /* @ts-ignore: Unsing an async component */ }
          { session.user?.email && <UserLinkList userID={session.user._id} />}
        </div>
      </div>
    </main>
  );
}
