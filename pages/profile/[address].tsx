import { Box, Heading, Text, useAccordion, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import AllowanceToken from "../../components/AllowanceToken";
import BuyToken from "../../components/BuyToken";
import TokenBalance from "../../components/TokenBalance";

import { networkContract } from "../../constants";

const USDC_TOKEN_ADDRESS = networkContract["maticmum"].TOKEN_ADDRESS;
const CONTRACT_ADDRESS = networkContract["maticmum"].CAMPAIGNS_ADDRESS;

const Profile = () => {
  const { query } = useRouter();
  const router = useRouter();
  const toast = useToast();

  const { address, isConnected} = useAccount();

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
        <TokenBalance symbol="USDC" tokenAddress={USDC_TOKEN_ADDRESS as `0x${string}`} />
        {isConnected ? (
          <>
            <br />
            <BuyToken tokenAddress={USDC_TOKEN_ADDRESS} />
            <br />
            <AllowanceToken
              tokenAddress={USDC_TOKEN_ADDRESS}
              address={address}
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
