import { unified } from "unified";
import { remarkMathEnv } from "../src/index";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const he = require('he');

describe("remarkMathEnv", () => {
  it("should not modify a single heading", async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkMathEnv)
      .use(remarkStringify)
      .process("# Hi, Saturn!");

    expect(String(file)).toBe("# Hi, Saturn!\n");
  });

  it("should not modify a single paragraph", async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkMathEnv)
      .use(remarkStringify)
      .process("Hello, Saturn!");

    expect(String(file)).toBe("Hello, Saturn!\n");
  });

  it("should not modify a single code block", async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkMathEnv)
      .use(remarkStringify)
      .process("```\nHello, Saturn!\n```");

    expect(String(file)).toBe("```\nHello, Saturn!\n```\n");
  });

  it("should work with default options", async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkMathEnv)
      .use(remarkStringify).process(`
::math-env-start{proof}

something

::math-env-end{proof}
      `);

    expect(he.decode(String(file))).toBe("**Proof: **something■\n");
  });

  it("should work with custom options", async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkMathEnv, {
        startMarker: "::start",
        endMarker: "::end",
        proofOptions: {
          envStartText: "Start:",
          counterLabel: "start",
          addNumbering: false,
          envEndText: "End",
        },
      })
      .use(remarkStringify).process(`
::start{proof}

something

::end{proof}
      `);

    expect(he.decode(String(file))).toBe("**Start: **somethingEnd\n");
  });

  it("should work if start with space", async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkMathEnv)
      .use(remarkStringify).process(`
  ::math-env-start{proof}

  something

  ::math-env-end{proof}
      `);

    expect(he.decode(String(file))).toBe("**Proof: **something■\n");
  });

  it("should work with numbering" , async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkMathEnv)
      .use(remarkStringify).process(`
::math-env-start{theorem}

something

::math-env-end{theorem}
      `);

    expect(he.decode(String(file))).toBe("**Theorem 1. **something\n");
  });

  it("should work with numbering and custom options" , async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkMathEnv, {
        theoremEnvs: new Map([
          ["theorem", {
            envStartText: "Theorem",
            counterLabel: "theorem",
            addNumbering: true,
          }]
        ]),
      })
      .use(remarkStringify).process(`
::math-env-start{theorem}

something

::math-env-end{theorem}
      `);

    expect(he.decode(String(file))).toBe("**Theorem 1. **something\n");
  });

  it("should work with numbering and custom options and multiple blocks" , async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkMathEnv, {
        theoremEnvs: new Map([
          ["theorem", {
            envStartText: "Theorem",
            counterLabel: "theorem",
            addNumbering: true,
          }]
        ]),
      })
      .use(remarkStringify).process(`
::math-env-start{theorem}

something

::math-env-end{theorem}

::math-env-start{theorem}

something

aiuhui

::math-env-end{theorem}
      `);

    expect(he.decode(String(file))).toBe("**Theorem 1. **something\n\n**Theorem 2. **something\n\naiuhui\n");
  });

  it("should work with numbering and custom options and multiple blocks with different evn and custom numbering" , async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkMathEnv, {
        theoremEnvs: new Map([
          ["theorem", {
            envStartText: "Theorem",
            counterLabel: "theorem",
            addNumbering: true,
          }],
          ["lemma", {
            envStartText: "Lemma",
            counterLabel: "lemma",
            addNumbering: true,
          }]
        ]),
      })
      .use(remarkStringify).process(`
::math-env-start{theorem}

something

::math-env-end{theorem}

::math-env-start{lemma}

something

::math-env-end{lemma}
      `);

    expect(he.decode(String(file))).toBe("**Theorem 1. **something\n\n**Lemma 1. **something\n");
  });

  it("should work with multiple nested blocks" , async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkMathEnv, {
        theoremEnvs: new Map([
          ["theorem", {
            envStartText: "Theorem",
            counterLabel: "theorem",
            addNumbering: true,
          }]
        ]),
      })
      .use(remarkStringify).process(`
::math-env-start{theorem}

something

  ::math-env-start{theorem}

  something

  ::math-env-end{theorem}

::math-env-end{theorem}
      `);

    expect(he.decode(String(file))).toBe("**Theorem 1. **something\n\n**Theorem 2. **something\n");
  });
});
