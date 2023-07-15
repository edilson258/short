"use client";
import { LongURLInput } from "@/components/long-url-input";
import { ShortURLOutput } from "@/components/short-url-output";
import { URLContext } from "@/contexts/URLContext";
import { TURLData } from "@/types/URLData";
import { makeURLShort } from "@/utils/makeURLShort";
import { storeURLRequestVaidator } from "@/lib/validators/storeURLRequestValidator";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import z from "zod";
import LoadingPlaceholder from "react-placeholder-loading";
import { useSession } from "next-auth/react";

/*
 * TODO:
 *     :: personlize errors to make them.more infomarive
 *     :: show error to user according to what happened wrong
 *
 */

enum storeURLRequestStates {
  STORING,
  DONE,
  ERROR,
}

interface IStoreURLProps {
  url: TURLData;
  setStoreURLRequestState: Dispatch<
    SetStateAction<storeURLRequestStates | null>
  >;
}

async function storeURL({ url, setStoreURLRequestState }: IStoreURLProps) {
  setStoreURLRequestState(storeURLRequestStates.STORING);

  type TStoreURLRequestPayload = z.infer<typeof storeURLRequestVaidator>;
  const storeURLRequestPayload: TStoreURLRequestPayload = {
    longURL: url.longURL,
    longURLHash: url.longURLHash,
  };

  try {
    const response = await axios.post("/api/storeURL", storeURLRequestPayload);
    switch (response.status) {
      case 500:
        setStoreURLRequestState(storeURLRequestStates.ERROR);
      case 200:
        setStoreURLRequestState(storeURLRequestStates.DONE);
    }
  } catch (err) {
    setStoreURLRequestState(storeURLRequestStates.ERROR);
  }
}

export default function Home() {
  const [shortURL, setShortURL] = useState<string | null>(null);
  const [longURL, setLongURL] = useState<string>("");
  const [canGenerateQRCode, setCanGenerateQRCode] = useState(false);
  const [storeURLRequestState, setStoreURLRequestState] =
    useState<storeURLRequestStates | null>(null);

  useEffect(() => {
    if (!shortURL || shortURL.length < 10) return;
    const url: TURLData = {
      longURL,
      longURLHash: makeURLShort(longURL),
    };
    storeURL({ url, setStoreURLRequestState });
  }, [shortURL]);

  const { data: session } = useSession()
  
  return (
    <URLContext.Provider
      value={{
        shortURL,
        setShortURL,
        longURL,
        setLongURL,
        canGenerateQRCode,
        setCanGenerateQRCode,
      }}
    >
      <main className="m-auto min-h-screen pt-[18%] mg:pt-[30%] pb-16 max-w-xs md:max-w-sm text-slate-500">
        <h1 className="mb-12 text-slate-700 text-3xl text-center font-bold drop-shadow-xl">
          Make it shorter
        </h1>
        <p>{ JSON.stringify(session, null, 2) }</p>
        <LongURLInput />
        {storeURLRequestState === storeURLRequestStates.DONE && (
          <ShortURLOutput />
        )}
        {storeURLRequestState === storeURLRequestStates.STORING && (
          <>
            <div className="shadow w-full mt-8 rounded overflow-hidden">
            <LoadingPlaceholder
              colorStart="white"
              colorEnd="#f1f5f9"
              width="100%"
              height="40px"
              shape="rect"
            />
            </div>
            {canGenerateQRCode && (
              <div className="shadow w-full mt-4 rounded overflow-hidden">
                <LoadingPlaceholder
                  colorStart="white"
                  colorEnd="#f1f5f9"
                  width="100%"
                  height="256px"
                  shape="rect"
                />
              </div>
            )}
          </>
        )}
        {storeURLRequestState === storeURLRequestStates.ERROR && (
          <div className="w-full text-center text-red-600 mt-8 rounded shadow p-2">
            <p className="mb-2">Internal Server Error</p>
            <p className="text-xs">
              Please try again or contact the website owner if this problem
              persists.{" "}
            </p>
          </div>
        )}
      </main>
    </URLContext.Provider>
  );
}
