import { postgresLinkRepository } from "@/repositories/implementations/postgres/link-repository";
import { redirect } from "next/navigation";

interface IRedirectToLongLinkProps {
  params: {
    linkHash: string;
  };
}

export default async function RedirectToLongLink({
  params,
}: IRedirectToLongLinkProps) {
  const linkHash = params.linkHash;
  const link = await postgresLinkRepository.queryLinkByHash(linkHash) 
  if (!link) return <h1>URL `{linkHash}` Not found!</h1>;
  redirect(link.longLink);
}
