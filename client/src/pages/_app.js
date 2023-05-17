import "@/styles/globals.scss";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Router from "next/router";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export default function App({ Component, pageProps, router }) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // used for page transition
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  const isLoginPage = router.pathname === "/login";
  const isRegisterPage = router.pathname === "/register";
  const shouldRenderNavbar = !isLoginPage && !isRegisterPage;

  return (
    <>
      {shouldRenderNavbar && <Navbar />}
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <Component {...pageProps} key={router.asPath} />
        {shouldRenderNavbar && <Footer />}
      </AnimatePresence>
    </>
  );
}
