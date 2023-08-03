import { ExpandableContent } from "../expandable";
import Link from "@/entities/Link";
import { postgresLinkRepository } from "@/repositories/implementations/postgres/link-repository";

export async function UserLinkList({ userID }: { userID: string }) {
  const userLinks: Link[] = await postgresLinkRepository.listLinksByUserID(userID)


  return (
    <div className="py-2 mt-2 px-1 max-h-64 overflow-y-auto">
      {userLinks.length < 1 ? (
        <>
          <h1>Haven't short links</h1>
          <a href="/" className="mt-2 font-medium text-blue-500 italic underline underline-offset-1">
            short link
          </a>
        </>
      ) : (
        userLinks.map((link) => (
          <ExpandableContent
            mainInfo={"http://127.0.0.1/" + link.longLinkHash}
            extraInfo={link.longLink}
            key={link.longLinkHash}
          />
        ))
      )}
    </div>
  );
}
