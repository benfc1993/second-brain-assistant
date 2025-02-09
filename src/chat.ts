import { ChatRequest } from "ollama";
import { execSync } from "child_process";
import ollama from "ollama";

export async function chat(
  systemPrompt: string,
  input: string,
  options?: ChatRequest["options"] & {
    format?: ChatRequest["format"];
    model?: string;
  },
) {
  const model = options?.model ?? "llama3.2:3b";

  const response = await ollama.chat({
    model,
    ...(options?.format && { format: options?.format }),
    options: { temperature: 0, ...options },
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: input,
      },
    ],
  });

  execSync(`ollama stop ${model}`);

  return response;
}
