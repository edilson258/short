"use client";
import z from "zod";
import axios from "axios";
import { LinkContext } from "@/contexts/LinkContext";
import { hashLongLink } from "@/lib/hashLongLink";
import { LongURLInput } from "@/components/long-url-input";
import LoadingPlaceholder from "react-placeholder-loading";
import { ShortURLOutput } from "@/components/short-url-output";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { storeLinkRequestVaidator } from "@/lib/validators/storeLinkRequestValidator";
import { useSession } from "next-auth/react";
import { TLinkData } from "@/entities/Link";

/*
 * TODO:
 *     :: personlize errors to make them.more infomarive
 *     :: show error to user according to what happened wrong
 *
 */

type storeURLRequestStates = "IDLE" | "STORING" | "ERROR" | "DONE";

interface IStoreURLProps {
  linkData: TLinkData;
  setStoreURLRequestState: Dispatch<SetStateAction<storeURLRequestStates>>;
}

async function storeURL({ linkData, setStoreURLRequestState }: IStoreURLProps) {
  setStoreURLRequestState("STORING");

  type TStoreURLRequestPayload = z.infer<typeof storeLinkRequestVaidator>;
  const storeURLRequestPayload: TStoreURLRequestPayload = linkData;

  try {
    const response = await axios.post("/api/storeLink", storeURLRequestPayload);
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
  const [shortLink, setShortLink] = useState<string | null>(null);
  const [longLink, setLongLink] = useState<string>("");
  const [canGenerateQRCode, setCanGenerateQRCode] = useState(false);

  const [storeURLRequestState, setStoreURLRequestState] =
    useState<storeURLRequestStates>("IDLE");
  const { data: session } = useSession();

  useEffect(() => {
    /* @ts-ignore: _id field is set in next-auth config but the Session class type doesn't recognize it */
    const userID = session?.user._id;

    if (!shortLink || shortLink.length < 10) return;
    const linkData: TLinkData = {
      userID: userID,
      longLink,
      longLinkHash: hashLongLink(longLink),
    };
    storeURL({ linkData, setStoreURLRequestState });
  }, [shortLink]);

  return (
    <LinkContext.Provider
      value={{
        shortLink,
        setShortLink,
        longLink,
        setLongLink,
        canGenerateQRCode,
        setCanGenerateQRCode,
      }}
    >
      <main className="pt-[20%] md:pt-[10%] pb-16 max-w-xs mx-auto md:max-w-ms min-h-screen text-center text-slate-500">
        <h1 className="mb-12 text-slate-700 text-3xl text-center font-bold drop-shadow-xl">
          Make it shorter
        </h1>
        {JSON.stringify(session, null, 2)}
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
    </LinkContext.Provider>
  );
}
