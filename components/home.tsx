"use client";
import z from "zod";
import axios from "axios";
import { TURLData } from "@/types/URLData";
import { URLContext } from "@/contexts/URLContext";
import { makeURLShort } from "@/utils/makeURLShort";
import { LongURLInput } from "@/components/long-url-input";
import LoadingPlaceholder from "react-placeholder-loading";
import { ShortURLOutput } from "@/components/short-url-output";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { storeURLRequestVaidator } from "@/lib/validators/storeURLRequestValidator";

/*
 * TODO:
 *     :: personlize errors to make them.more infomarive
 *     :: show error to user according to what happened wrong
 *
 */

type storeURLRequestStates = "IDLE" | "STORING" | "ERROR" | "DONE";

interface IStoreURLProps {
  url: TURLData;
  setStoreURLRequestState: Dispatch<SetStateAction<storeURLRequestStates>>;
}

async function storeURL({ url, setStoreURLRequestState }: IStoreURLProps) {
  setStoreURLRequestState("STORING");

  type TStoreURLRequestPayload = z.infer<typeof storeURLRequestVaidator>;
  const storeURLRequestPayload: TStoreURLRequestPayload = {
    longURL: url.longURL,
    longURLHash: url.longURLHash,
  };

  try {
    const response = await axios.post("/api/storeURL", storeURLRequestPayload);
    switch (response.status) {
      case 500:
        setStoreURLRequestState("ERROR");
      case 200:
        setStoreURLRequestState("DONE");
    }
  } catch (err) {
    setStoreURLRequestState("ERROR");
  }
}

export function Home() {
  const [shortURL, setShortURL] = useState<string | null>(null);
  const [longURL, setLongURL] = useState<string>("");
  const [canGenerateQRCode, setCanGenerateQRCode] = useState(false);
  const [storeURLRequestState, setStoreURLRequestState] =
    useState<storeURLRequestStates>("IDLE");

  useEffect(() => {
    if (!shortURL || shortURL.length < 10) return;
    const url: TURLData = {
      longURL,
      longURLHash: makeURLShort(longURL),
    };
    storeURL({ url, setStoreURLRequestState });
  }, [shortURL]);

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
      <main className="pt-[20%] md:pt-[10%] pb-16 max-w-xs mx-auto md:max-w-ms min-h-screen text-center text-slate-500">
        <h1 className="mb-12 text-slate-700 text-3xl text-center font-bold drop-shadow-xl">
          Make it shorter
        </h1>
        <LongURLInput />
        {storeURLRequestState === "DONE" && <ShortURLOutput />}
        {storeURLRequestState === "STORING" && (
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
        {storeURLRequestState === "ERROR" && (
          <div className="w-full text-center text-red-600 mt-8 rounded shadow p-2">
            <p className="mb-2">Internal Server Error</p>
            <p className="text-xs">
              Please try again or contact the website owner if this problem
              persists.
            </p>
          </div>
        )}
      </main>
    </URLContext.Provider>
  );
}
