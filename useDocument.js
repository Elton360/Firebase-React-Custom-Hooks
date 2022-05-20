import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { projectFirestore } from "../firebase/config";

export const useDocument = (documentPath) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ref = doc(projectFirestore, documentPath);

    const unsubscribe = onSnapshot(
      ref,
      (doc) => {
        //update state
        setDocument(doc.data());
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("could not fetch the data");
      }
    );
    setError(null);

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [documentPath]);

  return { document, error };
};
