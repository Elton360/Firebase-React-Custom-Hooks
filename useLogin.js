import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { projectAuth } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      // login
      const res = await signInWithEmailAndPassword(
        projectAuth,
        email,
        password
      );

      // dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });

      if (!isCancelled) setError(null);
    } catch (err) {
      if (!isCancelled) setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { login, isPending, error };
};
