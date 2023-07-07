"use client";
import {LongURLInput} from "@/components/LongURLInput";
import {ShortURLOutput} from "@/components/ShortURLOutput";
import {QRCodeContext} from "@/contexts/QRCodeContext";
import {TURLData} from "@/types/URLData";
import {makeURLShort} from "@/utils/makeURLShort";
import {storeURLRequestVaidator} from "@/validators/storeURLRequestValidator";
import axios from "axios";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import z from "zod";


/*
 * TODO:
 *     :: peesonlize errors to make them.more infomarive
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

  return (
    <QRCodeContext.Provider
      value={{
        shortURL,
        setShortURL,
        longURL,
        setLongURL,
        canGenerateQRCode,
        setCanGenerateQRCode,
      }}
    >
      <main className="text-center max-w-screen-sm container mx-auto mt-12 py-8 px-4">
        <h1 className="mb-8 text-3xl font-bold text-sky-500">URL Shorter</h1>
        <LongURLInput />
        {storeURLRequestState === storeURLRequestStates.DONE && (
          <ShortURLOutput />
        )}
        {storeURLRequestState === storeURLRequestStates.STORING && (
          <h1>STORING</h1>
        )}
        {storeURLRequestState === storeURLRequestStates.ERROR && (
          <h1 className="mt-4 text-red-500">Failed to store short URL</h1>
        )}
      </main>
    </QRCodeContext.Provider>
  );
}
