"use client";
import { Session } from "next-auth";
import { FiEdit3 } from "react-icons/fi";
import Navbar from "./navbar";
import { ExpandableContent } from "./expandable";

interface IProfilePageProps {
  session: Session;
}

type TURL = {
  shortURL: string;
  longURL: string;
};

const urls: TURL[] = [
  {
    shortURL: "https://bit.ly/gOshk",
    longURL: "https://www.google.com/q=how+to+write+html+code+correctly",
  },
  {
    shortURL: "https://bit.ly/txW0f",
    longURL: "https://www.google.com/q=how+to+write+html+code+correctly",
  },
  {
    shortURL: "https://bit.ly/l5Bo0",
    longURL: "https://www.google.com/q=how+to+write+html+code+correctly",
  },
  {
    shortURL: "https://bit.ly/gOshk",
    longURL: "https://www.google.com/q=how+to+write+html+code+correctly",
  },
  {
    shortURL: "https://bit.ly/txW0f",
    longURL: "https://www.google.com/q=how+to+write+html+code+correctly",
  },
  {
    shortURL: "https://bit.ly/l5Bo0",
    longURL: "https://www.google.com/q=how+to+write+html+code+correctly",
  },
];

export function UserProfile({ session }: IProfilePageProps) {
  return (
    <>
      <Navbar />
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

          <div className="relative w-fit mx-auto mt-32">
            <h1 className="text-slate-700 font-bold text-2xl">
              {session.user?.name}
            </h1>
            <FiEdit3 className="absolute -right-5 top-0" />
          </div>
          <h1 className="mt-3 text-slate-500 text-sm">{session.user?.email}</h1>

          <div className="my-4 border-t border-slate-200 border-1 w-11/12 mx-auto" />

          <div className="px-2">
            <h1 className="text-left font-bold text-slate-700 text-lg">
              Shortned Links ({urls.length})
            </h1>
            <div className="py-2 mt-2 px-1 max-h-64 overflow-y-auto">
              {urls.map((url) => (
                <ExpandableContent
                  mainInfo={url.shortURL}
                  extraInfo={url.longURL}
                  key={url.shortURL}
                />
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
