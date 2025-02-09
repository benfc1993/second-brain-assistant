import { describe } from "node:test";
import { queryRouter } from "./queryRouter";
import { execSync } from "child_process";

describe("router", () => {
  afterEach(() => {
    execSync(`ollama stop ${process.env.AI_MODEL}`);
  });
  it.each`
    query                                                  | expected
    ${"how many sides on a dice"}                          | ${"information request"}
    ${"put out the bins"}                                  | ${"chore"}
    ${"attend Adam's birthday on the 24th of April"}       | ${"calendar"}
    ${"cancel Netflix subscription on the 28th of August"} | ${"calendar"}
    ${"cancel Netflix subscription by the 28th of August"} | ${"chore"}
    ${"what are my notes on the DX talk"}                  | ${"information request"}
  `(
    "returns $expected route when $query provided",
    async ({ query, expected }) => {
      const response = await queryRouter(query);
      expect(response.category).toBe(expected);
    },
  );
});
