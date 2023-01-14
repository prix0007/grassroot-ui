import { Box, Heading, Text, useToast } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import AllowanceToken from "../../components/AllowanceToken";
import BuyToken from "../../components/BuyToken";
import TokenBalance from "../../components/TokenBalance";

const USDC_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const Profile = () => {
  const { query } = useRouter();
  const router = useRouter();
  const toast = useToast();

  const { account, library } = useWeb3React();
  const isConnected = typeof account === "string" && !!library;
  //   useEffect(() => {
  //     if(!query.address) {
  //         toast({
  //             title: "No address, Redirecting to home",
  //             duration: 3000,
  //             isClosable: true,
  //             status: "info"
  //         })
  //         router.push("/");
  //     }
  //   }, [])
  return (
    <Box p={4}>
      <Heading textAlign={"center"}>Profile</Heading>
      <Heading size={"md"} textAlign={"center"}>
        {query.address}
      </Heading>

      <Box maxW={"400px"}>
        <Heading variant={"h3"} color="brand.700">
          USDC Balances
        </Heading>
        <br />
        <TokenBalance symbol="USDC" tokenAddress={USDC_TOKEN_ADDRESS} />
        {isConnected ? (
          <>
            <br />
            <BuyToken tokenAddress={USDC_TOKEN_ADDRESS} />
            <br />
            <AllowanceToken
              tokenAddress={USDC_TOKEN_ADDRESS}
              address={account}
              spenderAddress={CONTRACT_ADDRESS}
            />
          </>
        ) : (
          <Text>Connect you wallet to view more options.</Text>
        )}
      </Box>
    </Box>
  );
};

export default Profile;
