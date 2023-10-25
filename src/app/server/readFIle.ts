import fs from "fs";
import pdf from "pdf-parse";

export const readFile = async () => {
  const data = fs.readFileSync("/Users/peterparikka/Documents/projects/PG-vector-poc/src/app/server/assets/Azuredoc.pdf")


  return data;
  // try {

  //   const pdfData = await pdf(data)
  //   return pdfData

  // } catch (error) {
  //   console.log("error", error);
  // }

}