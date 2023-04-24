import type { NextPage } from "next";
import Head from "next/head";

import HomePage from "./homepage";
import Footer from "~/components/layouts/Footer";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Fruition AI</title>
        <meta name="description" content="AI workflows that run based on time and other triggers." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomePage />
      <Footer />
    </>
  );
};

export default Home;
