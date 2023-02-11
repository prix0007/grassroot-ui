import type { Web3Provider } from "@ethersproject/providers";
import { useBalance } from "wagmi";
import { parseBalance } from "../util";

type IETHBalance = {
  address?: `0x${string}`;
};

const ETHBalance: React.FC<IETHBalance> = ({ address }) => {
  const { data, isError, isLoading } = useBalance({
    address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <p>
      Balance: {data?.formatted} {data?.symbol}
    </p>
  );
};

export default ETHBalance;
