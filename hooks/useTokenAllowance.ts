import useSWR from "swr";
import { SampleToken } from "../contracts/types/SampleToken";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useTokenContract from "./useTokenContract";

function getTokenAllowance(contract: SampleToken, spenderAddress: string) {
  return async (_: string, address: string) => {
    const allowance = await contract.allowance(address, spenderAddress);

    return allowance;
  };
}

export default function useTokenAllowance(
  address: string,
  tokenAddress: string,
  spenderAddress: string,
  suspense = false
) {
  const contract = useTokenContract(tokenAddress);

  const shouldFetch =
    typeof address === "string" &&
    typeof tokenAddress === "string" &&
    typeof spenderAddress === "string" &&
    !!contract;

  const result = useSWR(
    shouldFetch ? ["TokenAllowance", address, tokenAddress, spenderAddress] : null,
    getTokenAllowance(contract, spenderAddress),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
