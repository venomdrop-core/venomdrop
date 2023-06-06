import { useState, useEffect } from "react";
import { useCollectionContract } from "./useCollectionContract";

export const usePreRevealInfo = (slug?: string) => {
  const collection = useCollectionContract(slug);
  const [name, setName] = useState<string | undefined>();
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  useEffect(() => {
    if (collection) {
      collection.methods
        .getInitialMintJson()
        .call()
        .then(({ initialMintJson }) => {
          const metadata = JSON.parse(initialMintJson);
          setName(metadata.name);
          setImageSrc(metadata.preview.source);
        });
    }
  }, [collection]);

  return {
    name,
    imageSrc
  }
}
