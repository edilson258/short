import { z } from "zod";
import { TLinkData } from "@/entities/Link";
import { Dispatch, SetStateAction } from "react";
import { TError } from "./types";
import { TStoreLinkRequestStates } from "./types";
import { storeLinkRequestVaidator } from "@/lib/validators/storeLinkRequestValidator";

interface IStoreLinkProps {
  linkData: TLinkData;
  setStoreLinkRequestState: Dispatch<SetStateAction<TStoreLinkRequestStates>>;
  setError: Dispatch<SetStateAction<TError>>;
}

export async function storeLinkRequest({
  linkData,
  setStoreLinkRequestState,
  setError,
}: IStoreLinkProps) {
  setStoreLinkRequestState("STORING");

  type TStoreLinkRequestPayload = z.infer<typeof storeLinkRequestVaidator>;
  const storeLinkRequestPayload: TStoreLinkRequestPayload = linkData;

  try {
    const response = await fetch("/api/store-link", {
      method: "POST",
      body: JSON.stringify(storeLinkRequestPayload)
    })

    switch (response.status) {
      case 500:
        setStoreLinkRequestState("ERROR");
        setError({
          errorTitle: "Internal Server Error",
          errorMessage:
            "Please try again, if this error persists please contact the website owner",
        });
      case 200:
        setStoreLinkRequestState("DONE");
    }
  } catch (err) {
    setStoreLinkRequestState("ERROR");
    setError({
      errorTitle: "Unknown Error Occured",
      errorMessage:
        "Please try again, if this error persists please contact the website owner",
    });
  }
}
