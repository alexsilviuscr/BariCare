import SignUp from "@/components/Auth/SignUp";
import Head from "next/head";

export default function registerPage() {
  
  return (
    <>
      <Head>
        <title>BariCare - Register</title>
      </Head>
      <SignUp />
    </>
  )
}