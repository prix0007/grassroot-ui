import {
  Box,
  Button,
  CircularProgress,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import React, { useState } from "react";
import { useContractRead, useSigner } from "wagmi";
import useTokenContract from "../hooks/useTokenContract";

type IBuyToken = {
  tokenAddress: string;
};
const BuyToken: React.FC<IBuyToken> = ({ tokenAddress }) => {
  const [amount, setAmount] = useState("");

  const { data: signer } = useSigner();
  const contract = useTokenContract(tokenAddress, signer);

  const [isLoading, setLoading] = useState(false);

  const toast = useToast();

  const buyToken = async () => {
    if (amount && amount.trim()) {
      setLoading(true);
      const finalAmount = ethers.utils.parseUnits(amount, 18);
      try {
        const tx = await contract.buy({ value: finalAmount.toString() });
        await tx.wait();
        toast({
          title:
            "Transaction sent successfully. Balance should be reflected soon",
          duration: 5000,
          isClosable: true,
          status: "success",
        });
        setAmount("");
      } catch (e) {
        console.log(e);
        toast({
          title: "Something Went Wrong.",
          duration: 3000,
          isClosable: true,
          status: "error",
        });
      }
      setLoading(false);
    }
  };

  return (
    <Box>
      <Input
        placeholder="Enter an amount to buy."
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
      ></Input>
      <Stack
        display={"flex"}
        flexDirection={"column"}
        alignContent={"center"}
        justifyContent={"center"}
      >
        <Text m={2} textAlign={"center"}>
          {/* 1 MATIC = {data?.ratio} USDC */}
        </Text>
        <Button colorScheme={"green"} onClick={buyToken} disabled={isLoading}>
          {isLoading ? (
            <CircularProgress isIndeterminate color="green.300" size={5} />
          ) : (
            "Buy"
          )}
        </Button>
      </Stack>
    </Box>
  );
};

export default BuyToken;
