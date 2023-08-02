import { z } from "zod";
import { storeLinkRequestVaidator } from "@/lib/validators/storeLinkRequestValidator";

export interface IStoreLinkProps {
  userID: string;
  longLink: string;
}

export async function storeLinkRequest({
  userID,
  longLink,
}: IStoreLinkProps): Promise<Response> {
  type TStoreLinkRequestPayload = z.infer<typeof storeLinkRequestVaidator>;
  const storeLinkRequestPayload: TStoreLinkRequestPayload = {
    userID,
    longLink,
  };

  return await fetch("/api/store-link", {
    method: "POST",
    body: JSON.stringify(storeLinkRequestPayload),
  });
}
