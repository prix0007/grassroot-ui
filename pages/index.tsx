import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";

function Home() {
  const { account, library } = useWeb3React();

  return (
    <div>
      <Head>
        <title>Grassroot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}

export default Home;
