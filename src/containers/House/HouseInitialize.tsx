import { useContext, useState } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Box,Button,Container,Text,Heading,TextFieldInput,Callout,} from "@radix-ui/themes";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { toast } from "react-toastify";
import { PACKAGE_ID } from "../../constants";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";


const UserObjectId = "0x4fdc1a64317deffb0fbc08a0168b9a361fdf17b01be58a8397b2815998438a4f";

export function HouseInitialize() {
  const [name, setName] = useState("");
  const [VectorId, setVectorId] = useState("");
  const { mutate: execInitializeHouse,isLoading } =
    useSignAndExecuteTransactionBlock();
    
  return (
    <Container mb={"4"}>
      <Heading size="3" mb="2">
        Create User
      </Heading>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const txb = new TransactionBlock();
          txb.moveCall({
            target: `${PACKAGE_ID}::nft_market::create_user`,
            arguments: [
              txb.object(UserObjectId),
              txb.pure.string(name)
            ],
          });

          execInitializeHouse(
            {
              transactionBlock: txb,
              options: {
                showObjectChanges: true,
                showEffects:true,
              },
            },
            {
              onError: (err) => {
                toast.error(err.message);
              },
              onSuccess: (result: SuiTransactionBlockResponse) => {
                let vectorObjId;
                result.objectChanges?.some((objCh) => {
                  if (
                    objCh.type === "created" &&
                    objCh.objectType === `${PACKAGE_ID}::nft_market::Vector`
                  ) {
                    vectorObjId=objCh.objectId;
                    return true;
                  }
                });
                console.log(vectorObjId);
                setVectorId(vectorObjId!);
                localStorage.setItem("Storage Object Id",vectorObjId!);
                localStorage.setItem("User name",name!);

                 
                toast.success(`Digest: ${result.digest}`);
              },
            },
          );
        }}
        
      >
        <Box mb="3">
          <Text>Enter Name</Text>
          <TextFieldInput
            placeholder="Your Name"
            required
            onChange={(e) => {
              setName(String(e.target.value));
            }}
          />
        </Box>

        <Button disabled={isLoading} type="submit">
          Initialize
        </Button>

        {VectorId && (
          <>
            <Box mb="2">
              <Text as="div">User Id: </Text>
              <Text as="div">{VectorId}</Text>
            </Box>

            <Callout.Root mb="2">
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>
                You should save User Id somewhere because it will be lost
                when refresh the page
              </Callout.Text>
            </Callout.Root>
          </>
        )}
      </form>
    </Container>
  );
}
