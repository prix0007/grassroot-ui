import { useToast } from "@chakra-ui/react";

export enum WalletErrorsType {
  USER_REJECTED,
  UNSUPPORTED_CHAIN,
  OTHER,
}

const useWalletErrors = () => {
  const toast = useToast();
  return (type: WalletErrorsType, e: String) => {
    switch (type) {
      case WalletErrorsType.USER_REJECTED:
        toast({
          title: "User Rejected Wallet Request!!",
          status: "error",
          description: e || "Some Error Occured!!",
          isClosable: true,
        });
        break;
      case WalletErrorsType.UNSUPPORTED_CHAIN:
        toast({
            title: "Change your Network in Wallet!!",
            status: "error",
            description: e || "Some Error Occured!!",
            isClosable: true,
          });
        break;
      case WalletErrorsType.OTHER:
        toast({
          title: "Some Error Occured!!",
          status: "error",
          description: e || "Some Error Occured!!",
          isClosable: true,
        });
        break;
    }
  };
};

export { useWalletErrors };
