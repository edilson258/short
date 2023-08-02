import { z } from "zod";

export const storeLinkRequestVaidator = z.object({
  userID: z.string(),
  longLink: z.string(),
});
