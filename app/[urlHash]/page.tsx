import {postgresURLRepository} from "@/repositories/implementations/postgres";
import {RedirectType} from "next/dist/client/components/redirect";
import {redirect} from "next/navigation";

interface IRedirectToLongURLProps {
  params: {
    urlHash: string;
  };
}

export default async function RedirectToLongURL({
  params,
}: IRedirectToLongURLProps) {
  const urlHash = params.urlHash;
  const url = await postgresURLRepository.queryURLByHash(urlHash);
  if (!url) return <h1>URL `{urlHash}` Not found!</h1>
  redirect(url.longURL, RedirectType.replace)
}
