import { readFileSync } from "node:fs";
import path from "node:path";
import { chat } from "./chat";

export async function queryRouter(input: string) {
  const response = await chat(
    readFileSync(
      path.resolve(__dirname, `../prompts/router_prompt.md`),
    ).toString(),
    input,
    {
      format: "json",
    },
  );

  return JSON.parse(response.message.content) as unknown as {
    category: "chore" | "calendar" | "information request";
    explanation: string;
  };
}
