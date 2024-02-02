import { useEffect, useState } from "react";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {Box,Container,Heading,TextFieldInput,Text,Button,} from "@radix-ui/themes";
import { toast } from "react-toastify";
import { PACKAGE_ID } from "../../constants";
import { SuiTransactionBlockResponse } from "@mysten/sui.js/client";


// import { HouseDataContext } from "../House/HouseDataContext";

const UserObjectId = "0x4fdc1a64317deffb0fbc08a0168b9a361fdf17b01be58a8397b2815998438a4f";

export function PlayerCreateGame() {

  
  const { mutate: execCreateGame, isLoading } =
    useSignAndExecuteTransactionBlock();

  // const [guess, setGuess] = useState("");
  // const [stake, setStake] = useState(0);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [price, setPrice] = useState(0);
  const [user,setUser] = useState("");
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('User name');
    console.log(storedUsername)
    setUser(storedUsername!);
  }, []);
  // const [houseDataId] = useContext(HouseDataContext);

  return (
    <Container mb={"4"}>
      <Heading size="3" mb="2">
        Mint NFT HERE
      </Heading>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          // Create new transaction block
          const txb = new TransactionBlock();
          let name = localStorage.getItem("User name");
          if (name!=null){
           setUser(name);
            }
          console.log(name);
          // Player stake
          // const [stakeCoin] = txb.splitCoins(txb.gas, [
          //   MIST_PER_SUI * BigInt(stake),
          // ]);

          // Create the game with CounterNFT
          txb.moveCall({
            target: `${PACKAGE_ID}::nft_market::mint_nft`,
            arguments: [
              txb.pure.string(title),
              // txb.object(counterNFTData[0].data?.objectId!),
              txb.pure.string(url),
              // txb.object(houseDataId),
              txb.pure.u64(price),
              
              txb.object(UserObjectId),
              txb.pure.string(user),
            ],
          });

          execCreateGame(
            {
              transactionBlock: txb,
            },
            {
              onError: (err) => {
                toast.error(err.message);
              },
              onSuccess: (result: SuiTransactionBlockResponse) => {
                toast.success(`Digest: ${result.digest}`);
                window.location.reload();
              },
            },
          );
        }}
      >
        <Box mb="3">
          <Text>NFT Title</Text>
          <TextFieldInput
            required
            placeholder="Title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </Box>

        <Box mb="3">
          <Text>Url</Text>
          <TextFieldInput
            required
            placeholder="Url"
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
        </Box>

        <Box mb="3">
          <Text>Price</Text>
          <TextFieldInput
            required
            placeholder="price"
            onChange={(e) => {
              setPrice(Number(e.target.value));
            }}
          />
        </Box>

        <Button
          disabled={isLoading}
          type="submit"
         
        >
          Mint Your NFT
        </Button>
      </form>
    </Container>
  );
}


