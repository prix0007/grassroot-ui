import { useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
import useDAOSContract from "./useDAOContract";

const useDaosQueries = () => {
  const daosContract = useDAOSContract(process.env.NEXT_PUBLIC_DAOS_ADDRESS);
  const daosQueries = useQueries({
    queries: [0, 1].map((index) => {
      return {
        queryKey: ["daosContract", index],
        queryFn: async () => {
          const data = await daosContract?.daos(index);
          const { data: metadata } = await axios.get(data?.metadata);
          const daoData = {
            daoId: index,
            admin: data.admin,
            name: data.name,
            metadata: {
              ...metadata,
            },
          };
          return daoData;
        },
        staleTime: 2000,
        refetchInterval: 3000,
        cacheTime: 60 * 60 * 60 * 1000, // 1 hr.
      };
    }),
  });
  return daosQueries;
};

const useDaoQuery = (id: number) => {
  const daosContract = useDAOSContract(process.env.NEXT_PUBLIC_DAOS_ADDRESS);
  console.log(!!daosContract, !!id, process.env.NEXT_PUBLIC_DAOS_ADDRESS);
  const queryDao = useQuery({
    queryKey: ["daoContract", id],
    queryFn: async () => {
      const data = await daosContract?.daos(id);
      const { data: metadata } = await axios.get(data?.metadata);
      const daoData = {
        daoId: id,
        admin: data.admin,
        name: data.name,
        metadata: {
          ...metadata,
        },
      };
      return daoData;
    },
    staleTime: 2000,
    refetchInterval: 30000,
    cacheTime: 60 * 60 * 60 * 1000, // 1 hr.
    enabled: (!!id || id === 0) && !!daosContract,
  });
  return queryDao;
};

export { useDaosQueries, useDaoQuery };
