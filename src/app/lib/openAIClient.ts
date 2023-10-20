import { OpenAI } from "openai";

export const openAiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: "org-1IL2lnD3oHo0rdMkbaw4c4g6",
});


