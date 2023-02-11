import DAOS_ABI from "../contracts/DAOS.json";
import type { DAOS } from "../contracts/types/DAOS";
import { useContract } from "wagmi";
import { Signer } from "ethers";

export default function useDAOSContract(
  contractAddress?: string,
  signer?: Signer
) {
  return useContract({
    address: contractAddress,
    abi: DAOS_ABI,
    signerOrProvider: signer,
  });
}
