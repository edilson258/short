"use client";
import { LinkContext } from "@/contexts/LinkContext";
import { hashLongLink } from "@/lib/hashLongLink";
import { LongLinkInput } from "@/components/long-url-input";
import { ShortLinkOutput } from "../short-url-output";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TLinkData } from "@/entities/Link";
import { CustomLoadingPlaceholder } from "../loading-placeholder";
import { ShowError } from "./error";
import { TStoreLinkRequestStates } from "./types";
import { storeLinkRequest } from "./storeLinkRequest";

export function Home() {
  const { data: session } = useSession();

  const [shortLink, setShortLink] = useState<string | null>(null);
  const [longLink, setLongLink] = useState<string>("");
  const [canGenerateQRCode, setCanGenerateQRCode] = useState(false);

  const [error, setError] = useState({ errorTitle: "", errorMessage: "" });
  const [storeLinkRequestState, setStoreLinkRequestState] =
    useState<TStoreLinkRequestStates>("IDLE");

  useEffect(() => {
    /* @ts-ignore: _id field is set in next-auth config but the Session class type doesn't recognize it */
    const userID = session?.user._id;

    if (!shortLink || shortLink.length < 10) return;
    const linkData: TLinkData = {
      userID: userID,
      longLink,
      longLinkHash: hashLongLink(longLink),
    };
    storeLinkRequest({ linkData, setStoreLinkRequestState, setError });
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
      <main className="max-w-xs md:max-w-xl mx-auto pt-[20%] md:pt-[10%] pb-16 min-h-screen text-center text-slate-500">
        <h1 className="mb-12 text-slate-700 text-3xl text-center font-bold drop-shadow-xl">
          Make it shorter
        </h1>
        <div className={storeLinkRequestState === "IDLE" ? "w-full" : "md:flex justify-between gap-4"}>
          <div className="flex-1 max-w-md mx-auto">
            <LongLinkInput />
          </div>
          <div className="flex-1">
            {storeLinkRequestState === "DONE" && <ShortLinkOutput />}
            {storeLinkRequestState === "STORING" && (
              <>
                <CustomLoadingPlaceholder heightInPixels={40} />
                {canGenerateQRCode && (
                  <CustomLoadingPlaceholder heightInPixels={256} />
                )}
              </>
            )}
          </div>
        </div>
        {storeLinkRequestState === "ERROR" && <ShowError {...error} />}
      </main>
    </LinkContext.Provider>
  );
}
