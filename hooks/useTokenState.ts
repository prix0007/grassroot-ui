import useSWR from "swr";
import { SampleToken } from "../contracts/types/SampleToken";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useTokenContract from "./useTokenContract";

function getTokenState(contract: SampleToken) {
  return async (address: string) => {
    // const ratio = await contract.ration(address);
    const ratio = 50;
    return { ratio };
  };
}

export default function useTokenState(
  tokenAddress: string,
  suspense = false
) {
  const contract = useTokenContract(tokenAddress);

  const shouldFetch = typeof tokenAddress === "string" && !!contract;

  const result = useSWR(
    shouldFetch ? ["TokenState", tokenAddress] : null,
    getTokenState(contract),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}
