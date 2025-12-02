//1 hectare = 10,000 square meters
// Convert area m² → hectares
export const convertToHectares=(fieldAreaInSqMeters:number)=>{
  console.log("Field area in hectares:", fieldAreaInSqMeters);
  const fieldAreaInHectares = fieldAreaInSqMeters / 10000;
  return Number((fieldAreaInSqMeters / 10000).toFixed(2));
}

// 1 acre = 4,046.8564224 square meters
// Convert area m² → acres
export const convertToAcres = (fieldAreaInSqMeters: number) => {
  console.log("Field area in acres:", fieldAreaInSqMeters);
  const fieldAreaInAcres = fieldAreaInSqMeters / 4046.8564224;
  return Number(fieldAreaInAcres.toFixed(2));
};
