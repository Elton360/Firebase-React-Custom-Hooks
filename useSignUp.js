import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName) => {
    setError(null);
    setIsPending(true);

    try {
      // signup
      const res = await createUserWithEmailAndPassword(
        projectAuth,
        email,
        password
      );

      if (!res) {
        throw new Error("Could not complete signup");
      }

      // add display name to user
      await updateProfile(res.user, { displayName });

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });
      if (!isCancelled) setError(null);
    } catch (err) {
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
      }
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => setIsCancelled(true), []);

  return { signup, error, isPending };
};
