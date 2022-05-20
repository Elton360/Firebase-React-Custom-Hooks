import { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { projectFirestore } from "../firebase/config";

export const useCollection = (collectionName) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ref = query(collection(projectFirestore, collectionName));
    const unsubscribe = onSnapshot(
      ref,
      (querySnapshot) => {
        const results = [];
        querySnapshot.forEach((doc, i) => {
          results.push({ ...doc.data(), id: doc.id });
        });
        //update state
        console.log(results);
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("Could Not Fetch The Data");
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [collectionName]);

  return { documents, error };
};
