import { Box, Button } from "@chakra-ui/react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useState } from "react";
import { GiFoxTail, GiWallet } from "react-icons/gi";
import { injected } from "../connectors";
import { useWalletErrors, WalletErrorsType } from "../hooks/error";
import useENSName from "../hooks/useENSName";
import useMetaMaskOnboarding from "../hooks/useMetaMaskOnboarding";

type AccountProps = {
  triedToEagerConnect: boolean;
};

const Account = ({ triedToEagerConnect }: AccountProps) => {
  const { active, error, activate, chainId, account } = useWeb3React();

  const walletErrors = useWalletErrors();

  const {
    isMetaMaskInstalled,
    isWeb3Available,
    startOnboarding,
    stopOnboarding,
  } = useMetaMaskOnboarding();

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      stopOnboarding();
    }
  }, [active, error, stopOnboarding]);

  // const ENSName = useENSName(account);

  if (error) {
    return null;
  }

  if (!triedToEagerConnect) {
    return null;
  }

  const resolveButton = () => {
    if (isMetaMaskInstalled) {
      return (
        <Box display={"flex"} minW={"80px"} justifyContent={"space-between"}>
          <p>Connect</p>
          <GiFoxTail />
        </Box>
      );
    } else {
      return (
        <Box display={"flex"} minW={"80px"} justifyContent={"space-between"}>
          <p>Connect</p>
          <GiWallet />
        </Box>
      );
    }
  };

  if (typeof account !== "string") {
    return (
      <div>
        {isWeb3Available ? (
          <Button
            disabled={connecting}
            borderRadius={"full"}
            onClick={() => {
              setConnecting(true);
              activate(injected, undefined, true).catch((error) => {
                // ignore the error if it's a user rejected request
                if (error instanceof UserRejectedRequestError) {
                  walletErrors(
                    WalletErrorsType.USER_REJECTED,
                    error.toString()
                  );
                } else if (error instanceof UnsupportedChainIdError) {
                  walletErrors(
                    WalletErrorsType.UNSUPPORTED_CHAIN,
                    "Switch to Polygon Testnet Mumbai network to use application." ||
                      error.toString()
                  );
                } else {
                  walletErrors(WalletErrorsType.OTHER, error.toString());
                }
                setConnecting(false);
              });
            }}
          >
            {resolveButton()}
          </Button>
        ) : (
          <Button onClick={startOnboarding}>Install Metamask</Button>
        )}
      </div>
    );
  }
};

export default Account;
