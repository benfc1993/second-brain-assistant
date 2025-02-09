#!/usr/bin/env node
import ollama from "ollama";
import readline from "node:readline/promises";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { queryRouter } from "./queryRouter";
import { createCalendarEvent } from "./createCalendarEvent";

async function main() {
  await Promise.all([
    ollama.pull({ model: "llama3.2:3b" }),
    ollama.pull({ model: "gemma2:2b" }),
  ]);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const query = await rl.question("what is your query?\n");
  rl.close();

  const route = await queryRouter(query);
  switch (route.category) {
    case "chore":
      console.log("Create a todo: ", query);
      break;
    case "calendar":
      createCalendarEvent(query);
      break;
    case "information request":
      queryLogseq();
      break;
    default:
      console.log("invalid route returned, reason: ", route.explanation);
      break;
  }
}

// async function processQuery(serverQuery: string, query: string) {
//   const response = await ollama.chat({
//     model,
//     options: { temperature: 0 },
//     messages: [
//       { role: "system", content: serverQuery },
//       {
//         role: "user",
//         content: query,
//       },
//     ],
//   });
//
//   console.log(response.message.content);
//   writeFileSync("test.md", response.message.content);
//   main();
// }
//
type LogseqResponse = {
  properties: {};
  parent: { id: number };
  id: number;
  pathRefs: [{ id: number }, { id: number }];
  uuid: string;
  content: string;
  page: {
    journalDay: number;
    name: string;
    originalName: string;
    id: number;
  };
  left: { id: number };
  format: "markdown";
};

// async function userInput() {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   const query = await rl.question("what is your query?\n");
//   rl.close();
//   const bash = query.slice(query.indexOf('"') + 1, query.lastIndexOf('"'));
//   const output = execSync(bash);
//   const plainText = query.split('"');
//   // processQuery(`${plainText[0]} ${output.toString()} ${plainText[2]}`);
// }

async function queryLogseq() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const query = await rl.question("what is your query?\n");

  rl.close();

  fetch("http://localhost:12315/api", {
    method: "POST",
    headers: {
      Authorization: "testing1234",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ method: "logseq.db.q", args: [`[[${query}]]`] }),
  })
    .then((res) => res.json())
    .then((data: LogseqResponse[]) => {
      console.log(data);

      return data.reduce((contents, entry) => {
        if (entry.content !== `[[${query}]]`) contents += `${entry.content}\n`;
        return contents;
      }, "");
    })
    .then((toSend) => {
      console.log(toSend);

      // processQuery(
      //   readFileSync("./prompts/summary_prompt.md").toString(),
      //   toSend,
      // );
    });
}
main();
