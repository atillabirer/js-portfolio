
export function getUnique(arr: any, comp:any) {

    // store the comparison  values in array
    const unique = arr.map((e: any) => e[comp])
  
      // store the indexes of the unique objects
      .map((e:any, i:any, final:any) => final.indexOf(e) === i && i)
  
      // eliminate the false indexes & return unique objects
      .filter((e: any) => arr[e]).map((e: any) => arr[e]);
   console.log(unique)
    return unique;
  }

