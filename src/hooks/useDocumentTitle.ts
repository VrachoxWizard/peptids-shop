import { useEffect } from "react";

const BASE_TITLE = "PeptideLab";

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title
      ? `${title} | ${BASE_TITLE}`
      : `${BASE_TITLE} | Istraživački biokemijski spojevi`;
  }, [title]);
}
