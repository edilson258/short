"use client";
import { LinkContext } from "@/contexts/LinkContext";
import { LongLinkInput } from "@/components/link-input";
import { ShortLinkOutput } from "../link-output";
import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { CustomLoadingPlaceholder } from "../loading-placeholder";
import { ShowError } from "./error";
import { TStoreLinkRequestStates } from "./types";
import { storeLinkRequest, IStoreLinkProps } from "./storeLinkRequest";
import Link from "@/entities/Link";
import { Container } from "../container";

export default function Home() {
  const { data: session } = useSession();

  const [shortLink, setShortLink] = useState<string | null>(null);
  const [longLink, setLongLink] = useState<string>("");
  const [canGenerateQRCode, setCanGenerateQRCode] = useState(false);

  const [error, setError] = useState({ isError: false, errorMessage: "" });
  const [isValidLongLink, setIsValidLongLink] = useState(true);

  const [storeLinkRequestState, setStoreLinkRequestState] =
    useState<TStoreLinkRequestStates>("IDLE");

  const handleLongLinkFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (longLink.length < 10) {
      setIsValidLongLink(() => false);
      return;
    }

    let parsedLink: URL;

    try {
      parsedLink = new URL(longLink);
    } catch (error) {
      setIsValidLongLink(() => false);
      return;
    }

    const userID = session?.user._id;
    if (!userID) {
      setError({
        isError: true,
        errorMessage: "Invalid user data, Please try to sign in again",
      });
      return;
    }

    const response = await handleStoreLink({
      userID: userID,
      longLink: parsedLink.href,
    });

    if (!response) {
      setError({
        isError: true,
        errorMessage: "Unknown Error Occured, try again",
      });
      return;
    }

    const link = response.link as Link;

    setShortLink(() => link.longLinkHash);
    setStoreLinkRequestState("DONE");
  };

  const handleStoreLink = async (linkData: IStoreLinkProps) => {
    setStoreLinkRequestState("STORING");
    const response = await storeLinkRequest({
      ...linkData,
    });
    switch (response.status) {
      case 201:
        setStoreLinkRequestState("DONE");
        return await response.json();
      case 500:
        setStoreLinkRequestState("ERROR");
        setError({
          isError: true,
          errorMessage: "Internal Server Error, try again",
        });
        return null;
      default:
        setStoreLinkRequestState("ERROR");
        setError({
          isError: true,
          errorMessage: "Unknown Error Occured, try again",
        });
        return null;
    }
  };

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
      <Container>
        <h1 className="mb-12 text-slate-700 text-3xl text-center font-bold drop-shadow-xl">
          Make it shorter
        </h1>
        <div
          className={
            storeLinkRequestState === "IDLE"
              ? "w-full"
              : "w-full md:flex justify-between gap-8"
          }
        >
          <div className="flex-1 max-w-md mx-auto">
            <LongLinkInput
              longLink={longLink}
              setLongLink={setLongLink}
              isStoringLink={storeLinkRequestState === "STORING"}
              isValidLongLink={isValidLongLink}
              setIsValidLongLink={setIsValidLongLink}
              handleLongLinkFormSubmit={handleLongLinkFormSubmit}
            />
          </div>
          <div className="flex-1">
            {storeLinkRequestState === "DONE" && <ShortLinkOutput />}
            {storeLinkRequestState === "STORING" && (
              <div className="mt-8 md:mt-0">
                <CustomLoadingPlaceholder heightInPixels={40} />
                {canGenerateQRCode && (
                  <div className="mt-4">
                    <CustomLoadingPlaceholder heightInPixels={256} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {storeLinkRequestState === "ERROR" && (
          <ShowError errorMessage={error.errorMessage} />
        )}
      </Container>
    </LinkContext.Provider>
  );
}
