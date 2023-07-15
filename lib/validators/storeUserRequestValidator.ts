import { z } from "zod"

export const storeUserRequestVaidator = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string()
})
