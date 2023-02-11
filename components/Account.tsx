import { Box, Button, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GiFoxTail, GiWallet } from "react-icons/gi";
import { useWalletErrors, WalletErrorsType } from "../hooks/error";

import {
  useAccount,
  useConnect,
  useNetwork,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const Account = () => {
  const toast = useToast();

  const { address, isConnected } = useAccount({
    onConnect({ address, connector }) {
      // toast({
      //   title: `Connected to Wallet`,
      //   description: `Address connected: ${address} \n Wallet Name: ${connector.name}`,
      //   isClosable: true,
      //   duration: 3000,
      //   status: "success",
      // });
    },
  });
  
  const { connect, isError, error, isLoading } = useConnect({
    connector: new InjectedConnector(),
  });

  const { chain, chains } = useNetwork();

  const walletErrors = useWalletErrors();

  useEffect(() => {
    if (isError) {
      walletErrors(
        WalletErrorsType.OTHER,
        error.message,
        "Wallet connection errored!!"
      );
    }
  }, [isError]);

  useEffect(() => {
    if(chain && chain?.id !== 80001) {
      walletErrors(
        WalletErrorsType.UNSUPPORTED_CHAIN,
        "Please change network to mumbai testnet"
      );
    }
  }, [chain])

  return (
    !isConnected && (
      <div>
        <Button
          disabled={isLoading}
          borderRadius={"full"}
          onClick={() => {
            connect();
          }}
        >
          <Box display={"flex"} minW={"80px"} justifyContent={"space-between"}>
            <p>Connect</p>
            <GiFoxTail />
          </Box>
        </Button>
      </div>
    )
  );
};

export default Account;
