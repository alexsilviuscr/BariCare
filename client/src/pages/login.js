import Login from "@/components/Auth/Login";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

export default function loginPage () {
  
  const [cookies] = useCookies(["access_token"]);
  const router = useRouter();

  // if the user is logged in, push "/" otherwise do nothing
  useEffect(() => {
    cookies.access_token ? router.push("/") : null;
  }, [cookies.access_token]);
  
  return (
    <>
      <Head>
        <title>BariCare - Login</title>
      </Head>
      <Login />
    </>
  )
}