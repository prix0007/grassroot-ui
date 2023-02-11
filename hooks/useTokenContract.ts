import ERC20_ABI from "../contracts/SampleToken.json";
import { useContract } from "wagmi";
import { Signer } from "ethers";

export default function useTokenContract(
  tokenAddress?: string,
  signer?: Signer
) {
  return useContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    signerOrProvider: signer,
  });
}
