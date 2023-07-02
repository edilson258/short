import { Dispatch, SetStateAction, createContext } from "react";

interface IQRCodeContext {
  canGenerateQRCode: boolean;
  setCanGenerateQRCode: Dispatch<SetStateAction<boolean>>;
  longURL: string;
  setLongURL: Dispatch<SetStateAction<string>>;
  shortURL: string | null;
  setShortURL: Dispatch<SetStateAction<string | null>>;
}

export const QRCodeContext = createContext<IQRCodeContext | null>(null);
