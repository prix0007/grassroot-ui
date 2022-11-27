import ERC20_ABI from "../contracts/SampleToken.json";
import type { SampleToken } from "../contracts/types/SampleToken";
import useContract from "./useContract";

export default function useTokenContract(tokenAddress?: string) {
  return useContract<SampleToken>(tokenAddress, ERC20_ABI);
}
