import { useToast } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { title } from "process";
import { useEffect, useState } from "react";
import { injected } from "../connectors";

export default function useEagerConnect() {
  const { activate, active } = useWeb3React();
  const toast = useToast();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch((e) => {
          toast({
            title: "Error",
            status: "error",
            duration: 5000,
            description: e.toString(),
            isClosable: true
          });
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, [activate]);

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}
