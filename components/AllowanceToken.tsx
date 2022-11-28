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
import useTokenAllowance from "../hooks/useTokenAllowance";
import useTokenContract from "../hooks/useTokenContract";

type IAllowanceToken = {
  tokenAddress: string;
  address: string;
  spenderAddress: string;
};
const AllowanceToken: React.FC<IAllowanceToken> = ({
  tokenAddress,
  address,
  spenderAddress,
}) => {
  const [amount, setAmount] = useState("");

  const { data } = useTokenAllowance(
    address,
    tokenAddress,
    spenderAddress
  );

  const contract = useTokenContract(tokenAddress);

  const [isLoading, setLoading] = useState(false);

  const toast = useToast();

  const giveAllowance = async () => {
    if (amount && amount.trim()) {
      setLoading(true);
      const finalAmount = ethers.utils.parseUnits(amount, 18);
      try {
        const tx = await contract.approve(spenderAddress, finalAmount);
        await tx.wait();
        toast({
          title:
            "Transaction sent successfully. Allowance should be reflected soon",
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
        placeholder="Enter an allowance to give."
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
          Current Allowance: {ethers.utils.formatUnits(data?.toString() || "0", 18)} USDC
        </Text>
        <Button colorScheme={"green"} onClick={giveAllowance} disabled={isLoading}>
          {isLoading ? (
            <CircularProgress isIndeterminate color="green.300" size={5} />
          ) : (
            "Give Allowance"
          )}
        </Button>
      </Stack>
    </Box>
  );
};

export default AllowanceToken;
