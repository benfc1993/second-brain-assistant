import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { chat } from "./chat";

export async function createCalendarEvent(input: string) {
  const response = await chat(
    readFileSync(
      path.resolve(__dirname, "../prompts/calendar_prompt.md"),
    ).toString(),
    `${input}

    The current date is ${new Date().toString()}`,
    { model: "gemma2:2b" },
  );

  writeFileSync("out.ics", response.message.content);
}
