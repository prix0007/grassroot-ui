import { CircularProgress, Text } from "@chakra-ui/react";
import { useAccount, useProvider, useToken } from "wagmi";
import { parseBalance } from "../util";
import { useContractRead } from "wagmi";
import ERC20_ABI from "../contracts/SampleToken.json";
import { BigNumber } from "ethers";
import { useMemo } from "react";

type TokenBalanceProps = {
  tokenAddress: `0x${string}`;
  symbol: string;
};

const TokenBalance = ({ tokenAddress, symbol }: TokenBalanceProps) => {
  const { address } = useAccount();

  const { data, isError, isLoading } = useContractRead({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    chainId: 80001,
    cacheOnBlock: true,
    args: [address],
    enabled: !!address && !!tokenAddress,
  });

  const balance = useMemo(() => {
    if (!isError && !isLoading && data) {
      return BigNumber.from(data);
    } else {
      return BigNumber.from("0");
    }
  }, [data]);

  if (isLoading) return <CircularProgress size={"24px"} isIndeterminate />;
  if (isError) return <Text>Failed to get balance.</Text>;

  return (
    <Text textAlign={"left"}>
      Token: {parseBalance(balance)} {`${symbol}`}
    </Text>
  );
};

export default TokenBalance;
