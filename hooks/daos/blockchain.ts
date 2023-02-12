import { useQuery } from "@tanstack/react-query";
import useDAOSContract from "../useDAOContract";

const DAOS_CONTRACT = process.env.NEXT_PUBLIC_DAOS_ADDRESS;

const useIsAddressMember = (id: number, address: string) => {
  const daosContract = useDAOSContract(DAOS_CONTRACT);

  return useQuery({
    queryKey: ["isAddressMemeber", address],
    queryFn: async () => {
        const data: boolean = await daosContract.memberships(id, address);
        return data;
    },
    enabled: !!id && !!address && !!daosContract,
  });
};

export { useIsAddressMember };
