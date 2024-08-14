import Navbar from "@/components/Navbar";
import { UserContext } from "@/lib/context";
import { auth } from "@/lib/firebase";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { AuthStateHook, useAuthState } from "react-firebase-hooks/auth";

export default function App({ Component, pageProps }: AppProps) {
  const [user]: AuthStateHook = useAuthState(auth);

  return (
    <UserContext.Provider value={{ user }}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}
