import { setClerkGetToken } from "@/apollo/links/authLink";
import { useAuth as useClerkAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";

export function ClerkTokenBridge() {
  const { getToken } = useClerkAuth();

  useEffect(() => {
    setClerkGetToken(() => getToken());
  }, [getToken]);

  return null;
}
