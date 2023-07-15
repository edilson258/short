import {z} from "zod"

export const storeURLRequestVaidator = z.object({
  longURL: z.string(),
  longURLHash: z.string()
})
