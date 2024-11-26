import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { remarkMathEnv } from "../src/index";

describe("remarkMathEnv", () => {
  it("should not modify a single heading", async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkAutoNumberHeadings)
      .use(remarkStringify)
      .process("# Hi, Saturn!");

    expect(String(file)).toBe("# 1 Hi, Saturn!\n");
  });
});
