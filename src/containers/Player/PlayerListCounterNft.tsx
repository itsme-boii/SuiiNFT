import { Box, Text } from "@radix-ui/themes";
import { useSuiClient } from '@mysten/dapp-kit';
import { normalizeSuiAddress } from '@mysten/sui.js/utils'
import { useState,useEffect } from "react";


export  function PlayerListCounterNft() {


  const [owner,setOwner]=useState("");
  const [arrayofnft,setArrayofnft]=useState({});
  const [nameArray,setNameArray]=useState([""]);
  let vectorid = localStorage.getItem("Storage Object Id");
  console.log(vectorid);
  const client = useSuiClient();


  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await client.getDynamicFields({
            parentId: normalizeSuiAddress("0x4fdc1a64317deffb0fbc08a0168b9a361fdf17b01be58a8397b2815998438a4f"),
            limit: 1000,
          });
  
          const newData = response.data;
  
          if (Array.isArray(newData) && newData.length > 0) {
            const foundItem = newData.find((item) => item.objectId === vectorid);
            if (foundItem) {
              const ownerName = foundItem.name?.value as string;
              console.log(ownerName);
              setOwner(ownerName );
            } else {
              console.warn(`No item found with objectId: ${vectorid}`);
            }
          } else {
            console.warn('Fetched data is null or empty array.');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }, [vectorid]); 
  

  const fetchVector = async () => {
    try {
      const response = await client.getObject({
				id: vectorid!,
				options: {
          showContent:true,
          showOwner: true,
        }
			});

      if (response.data !== null && response.data !== undefined) {
        const doota = response.data.content;
        if (doota !== null && doota !== undefined) {
          for (const key of Object.entries(doota)) {
            if(key[0]=="fields"){
              setArrayofnft(Object.values(Object.values(key[1].store)));
            }
          }
        }
      }
      }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchVector();
  }, [vectorid]);


useEffect(() => {
  // console.log("array of nft is",arrayofnft)
  if (Array.isArray(arrayofnft)) {
    const namesArray = [];
    for (const item of arrayofnft) {
      const fields = item.fields;
      namesArray.push(Object.values(fields)[1] as string);
    }
    setNameArray(namesArray);
    console.log("old  names array",namesArray);
  } else {
    console.error("arrayofnft is not an array or is undefined/null");
  }
}, [arrayofnft]);
  return (
    <Box mb="4">
      <Box>
        <Text as="div" weight="bold">
          Owner = {owner}
        </Text>
        <Text as="div">{/* Additional content */}</Text>
        <Text as="div" weight="bold">
          Object Id = {vectorid}
        </Text>
        <Text as="div">{/* Additional content */}</Text>
      </Box>
  
      <ul>
        {nameArray.map((name, index) => (
          <li key={index}>
            {name}
            <br />
          </li>
        ))}
      </ul>
    </Box>
   
    
  );
        }
