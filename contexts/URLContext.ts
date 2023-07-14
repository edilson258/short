import { Dispatch, SetStateAction, createContext } from "react";

interface IURLContext {
  canGenerateQRCode: boolean;
  setCanGenerateQRCode: Dispatch<SetStateAction<boolean>>;
  longURL: string;
  setLongURL: Dispatch<SetStateAction<string>>;
  shortURL: string | null;
  setShortURL: Dispatch<SetStateAction<string | null>>;
}

export const URLContext = createContext<IURLContext | null>(null);
