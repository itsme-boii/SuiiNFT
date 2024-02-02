import { Box, Text } from "@radix-ui/themes";
import { useSuiClient } from '@mysten/dapp-kit';
import { normalizeSuiAddress } from '@mysten/sui.js/utils'
import { useState,useEffect } from "react";

export function MarketNftsContainer() {
         
  const [vectorsId,setVectorsId] = useState([""]);
  const [namesArray,setNamesArray]=useState([""]);
  const client = useSuiClient();
  const [isLoading, setIsLoading] = useState(true);
const [accumulatedFields, setAccumulatedFields] = useState([{}]);

useEffect(() => {
const fetchData = async () => {
try {
const response = await client.getDynamicFields({
parentId: normalizeSuiAddress("0x4fdc1a64317deffb0fbc08a0168b9a361fdf17b01be58a8397b2815998438a4f"),
limit: 1000,
});

const newData = response.data;

if (Array.isArray(newData)) {
const namesArray = [];
for (const item of newData) {
  const fields = item.objectId;
  namesArray.push(fields);
}
setVectorsId(namesArray);
}
} catch (error) {
console.error('Error fetching data:', error);
} finally {
setIsLoading(false);
}
};

fetchData();
}, []);

useEffect(() => {
const fetchVector = async () => {
try {
setIsLoading(true);

// Use Promise.all to wait for all asynchronous calls to complete
const fieldsArray = await Promise.all(
vectorsId.map(async (str) => {
  try {
    const response = await client.getObject({
      id: str,
      options: {
        showContent: true,
        showOwner: true,
      },
    });

    const doota = response.data?.content;

    if (response.data !== null && response.data !== undefined) {
      if (doota !== null && doota !== undefined) {
        for (const key of Object.entries(doota)) {
          if (key[0] === "fields") {
            return Object.values(Object.values(key[1].store));
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching data for string:', str, error);
  }
})
);

// Flatten the array of arrays into a single-level array
const flattenedFields = fieldsArray.flat();

setAccumulatedFields([flattenedFields]);
console.log("All processing completed");
} catch (error) {
console.error('Error fetching data:', error);
} finally {
setIsLoading(false);
}
};

if (vectorsId.length > 0) {
fetchVector();
}
}, [vectorsId]);


console.log("fields are ", accumulatedFields[0]);


useEffect(() => {
if (Array.isArray(accumulatedFields) && accumulatedFields.length > 0) {
const namesArray = [];

for (const obj of accumulatedFields) {
if (obj && typeof obj === 'object') {
for (const [key, value] of Object.entries(obj)) {
  if (value && typeof value === 'object') {
    let val = Object.entries(value)[1][1];
    ;
    if (val && typeof val === 'object') {
      // console.log("val is", Object.values(val)[1]);
      let val2=Object.values(val)[1] as string;
      // console.log(val2);
      namesArray.push(val2 as string);
    }
  }
}
}
}

setNamesArray(namesArray);
console.log("namesarray",namesArray);
} else {
console.error("accumulatedFields is not an array or is empty");
}
}, [accumulatedFields]);
// useEffect(() => {
//   if (Array.isArray(accumulatedFields)) {
//     const namesArray = [];
//     for (const item of accumulatedFields) {
//       console.log
//       const fields = item;
//       namesArray.push(Object.values(fields)[1] as string);
//     }
//     setNameArray(namesArray);
//     console.log("name array is", nameArray);
//   } else {
//     console.error("arrayofnft is not an array or is undefined/null");
//   }
// }, [arrayofnft]);

// useEffect(() => {
//   console.log("name array is", nameArray);
//   // Do something with nameArray, e.g., use it in another context
// }, [nameArray]);


  return (
    <Box
mb="4"
>
<Box
p="3"
>
<Text as="div" weight="bold">
  Market NFTs
</Text>
<ul>
{namesArray.map((name, index) => (
  <li key={index}>
    {name}
    <br />
  </li>
))}
</ul>
</Box>
</Box>
);
}
