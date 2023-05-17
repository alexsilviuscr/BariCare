import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { motion } from "framer-motion";

export default function AppLayout({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [cookies] = useCookies(["access_token"]);
  const router = useRouter();

  //check if user access token is available, if not redirects to /login ; skips /register page
  useEffect(() => {
    if (!cookies.access_token && router.pathname !== "/register") {
      router.push("/login");
    } else {
      setLoggedIn(true);
    }
  }, [cookies.access_token, router.pathname]);

  return loggedIn ?
  <>
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  </> : null;
}