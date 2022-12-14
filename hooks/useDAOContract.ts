import DAOS_ABI from "../contracts/DAOS.json";
import type { DAOS } from "../contracts/types/DAOS";
import useContract from "./useContract";

export default function useDAOSContract(contractAddress?: string) {
  return useContract<DAOS>(contractAddress, DAOS_ABI);
}
