import { Dispatch, SetStateAction, createContext } from "react";

interface ILinkContext {
  canGenerateQRCode: boolean;
  setCanGenerateQRCode: Dispatch<SetStateAction<boolean>>;
  longLink: string;
  setLongLink: Dispatch<SetStateAction<string>>;
  shortLink: string | null;
  setShortLink: Dispatch<SetStateAction<string | null>>;
}

export const LinkContext = createContext<ILinkContext | null>(null);
