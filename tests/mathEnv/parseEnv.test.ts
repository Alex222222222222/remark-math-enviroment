import { parseEnv } from "../../src/mathEnv/parseEnv";
import { RootContent } from "mdast";
import { BlockStartInfo } from "../../src/parseStartMarker";

// generate random string  for test
function randomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

describe("parseEnv", () => {
  it("throw error if buffer is empty", async () => {
    // random line number
    const line = Math.floor(Math.random() * 1000);
    const buffer: RootContent[] = [] as RootContent[];
    const info: BlockStartInfo = {
      envName: "proof",
      startLine: line,
    };

    expect(() => {
      parseEnv(info, buffer);
    }).toThrow("Proof block is empty at line " + line);
  });

  it("throw error if addNumbering is true but numbering is undefined", async () => {
    // random line number
    const line = Math.floor(Math.random() * 1000);
    const buffer: RootContent[] = [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "This is a proof.",
          },
        ],
      },
    ];
    const info: BlockStartInfo = {
      envName: "proof",
      startLine: line,
      addNumbering: true,
    };

    expect(() => {
      parseEnv(info, buffer);
    }).toThrow("Numbering is undefined for proof block at line " + line);
  });

  it("should add startText and endText without numbering if the type is paragraph", async () => {
    // random line number
    const line = Math.floor(Math.random() * 1000);
    // random startText and endText
    const startText = randomString(10);
    const endText = randomString(10);
    const buffer: RootContent[] = [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "This is a proof.",
          },
        ],
      },
    ];
    const info: BlockStartInfo = {
      envName: "proof",
      startLine: line,
      envStartText: startText,
      envEndText: endText,
      addNumbering: false,
    };

    const result: RootContent[] = parseEnv(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: `${startText} `,
              },
            ],
          },
          {
            type: "text",
            value: "This is a proof.",
          },
          {
            type: "text",
            value: endText,
          },
        ],
      },
    ]);
  });

  it("should add startText and endText with numbering if the type is paragraph", async () => {
    // random line number
    const line = Math.floor(Math.random() * 1000);
    // random startText and endText
    const startText = randomString(10);
    const endText = randomString(10);
    // random numbering for the proof
    const numbering = Math.floor(Math.random() * 1000);
    const buffer: RootContent[] = [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "This is a proof.",
          },
        ],
      },
    ];
    const info: BlockStartInfo = {
      envName: "proof",
      startLine: line,
      envStartText: startText,
      envEndText: endText,
      numbering: numbering,
      addNumbering: true,
    };

    const result: RootContent[] = parseEnv(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: `${startText} ${numbering} `,
              },
            ],
          },
          {
            type: "text",
            value: "This is a proof.",
          },
          {
            type: "text",
            value: endText,
          },
        ],
      },
    ]);
  });

  it("should add startText and endText without numbering if the type is text", async () => {
    // random line number
    const line = Math.floor(Math.random() * 1000);
    // random startText and endText
    const startText = randomString(10);
    const endText = randomString(10);
    const buffer: RootContent[] = [
      {
        type: "text",
        value: "This is a proof.",
      },
    ];
    const info: BlockStartInfo = {
      envName: "proof",
      startLine: line,
      envStartText: startText,
      envEndText: endText,
      addNumbering: false,
    };

    const result: RootContent[] = parseEnv(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: `${startText} `,
              },
            ],
          },
          {
            type: "text",
            value: "This is a proof.",
          },
          {
            type: "text",
            value: endText,
          },
        ],
      },
    ]);
  });

  it("should add startText and endText with numbering if the type is text", async () => {
    // random line number
    const line = Math.floor(Math.random() * 1000);
    // random startText and endText
    const startText = randomString(10);
    const endText = randomString(10);
    // random numbering for the proof
    const numbering = Math.floor(Math.random() * 1000);
    const buffer: RootContent[] = [
      {
        type: "text",
        value: "This is a proof.",
      },
    ];
    const info: BlockStartInfo = {
      envName: "proof",
      startLine: line,
      envStartText: startText,
      envEndText: endText,
      numbering: numbering,
      addNumbering: true,
    };

    const result: RootContent[] = parseEnv(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: `${startText} ${numbering} `,
              },
            ],
          },
          {
            type: "text",
            value: "This is a proof.",
          },
          {
            type: "text",
            value: endText,
          },
        ],
      },
    ]);
  });

  it("should add startText and endText without numbering if the type is emphasis", async () => {
    // random line number
    const line = Math.floor(Math.random() * 1000);
    // random startText and endText
    const startText = randomString(10);
    const endText = randomString(10);
    const buffer: RootContent[] = [
      {
        type: "emphasis",
        children: [
          {
            type: "text",
            value: "This is a proof.",
          },
        ],
      },
    ];
    const info: BlockStartInfo = {
      envName: "proof",
      startLine: line,
      envStartText: startText,
      envEndText: endText,
      addNumbering: false,
    };

    const result: RootContent[] = parseEnv(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: `${startText} `,
              },
            ],
          },
          {
            type: "emphasis",
            children: [
              {
                type: "text",
                value: "This is a proof.",
              },
            ],
          },
          {
            type: "text",
            value: endText,
          },
        ],
      },
    ]);
  });

  it("should add startText and endText with numbering if the type is emphasis", async () => {
    // random line number
    const line = Math.floor(Math.random() * 1000);
    // random startText and endText
    const startText = randomString(10);
    const endText = randomString(10);
    // random numbering for the proof
    const numbering = Math.floor(Math.random() * 1000);
    const buffer: RootContent[] = [
      {
        type: "emphasis",
        children: [
          {
            type: "text",
            value: "This is a proof.",
          },
        ],
      },
    ];
    const info: BlockStartInfo = {
      envName: "proof",
      startLine: line,
      envStartText: startText,
      envEndText: endText,
      numbering: numbering,
      addNumbering: true,
    };

    const result: RootContent[] = parseEnv(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: `${startText} ${numbering} `,
              },
            ],
          },
          {
            type: "emphasis",
            children: [
              {
                type: "text",
                value: "This is a proof.",
              },
            ],
          },
          {
            type: "text",
            value: endText,
          },
        ],
      },
    ]);
  });

  it("should add startText and endText without numbering if the type is strong", async () => {
    // random line number
    const line = Math.floor(Math.random() * 1000);
    // random startText and endText
    const startText = randomString(10);
    const endText = randomString(10);
    const buffer: RootContent[] = [
      {
        type: "strong",
        children: [
          {
            type: "text",
            value: "This is a proof.",
          },
        ],
      },
    ];
    const info: BlockStartInfo = {
      envName: "proof",
      startLine: line,
      envStartText: startText,
      envEndText: endText,
      addNumbering: false,
    };

    const result: RootContent[] = parseEnv(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: `${startText} `,
              },
            ],
          },
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: "This is a proof.",
              },
            ],
          },
          {
            type: "text",
            value: endText,
          },
        ],
      },
    ]);
  });

  it("should add startText and endText with numbering if the type is strong", async () => {
    // random line number
    const line = Math.floor(Math.random() * 1000);
    // random startText and endText
    const startText = randomString(10);
    const endText = randomString(10);
    // random numbering for the proof
    const numbering = Math.floor(Math.random() * 1000);
    const buffer: RootContent[] = [
      {
        type: "strong",
        children: [
          {
            type: "text",
            value: "This is a proof.",
          },
        ],
      },
    ];
    const info: BlockStartInfo = {
      envName: "proof",
      startLine: line,
      envStartText: startText,
      envEndText: endText,
      numbering: numbering,
      addNumbering: true,
    };

    const result: RootContent[] = parseEnv(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: `${startText} ${numbering} `,
              },
            ],
          },
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: "This is a proof.",
              },
            ],
          },
          {
            type: "text",
            value: endText,
          },
        ],
      },
    ]);
  });

  it("should add startText and endText without numbering if the type is not paragraph, text, emphasis, or strong", async () => {
    // random line number
    const line = Math.floor(Math.random() * 1000);
    // random startText and endText
    const startText = randomString(10);
    const endText = randomString(10);
    const buffer: RootContent[] = [
      {
        type: "heading",
        depth: 1,
        children: [
          {
            type: "text",
            value: "This is a proof.",
          },
        ],
      },
    ];
    const info: BlockStartInfo = {
      envName: "proof",
      startLine: line,
      envStartText: startText,
      envEndText: endText,
      addNumbering: false,
    };

    const result: RootContent[] = parseEnv(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: `${startText} `,
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        depth: 1,
        children: [
          {
            type: "text",
            value: "This is a proof.",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: endText,
          },
        ],
      },
    ]);
  });

  it("should add startText and endText with numbering if the type is not paragraph, text, emphasis, or strong", async () => {
    // random line number
    const line = Math.floor(Math.random() * 1000);
    // random startText and endText
    const startText = randomString(10);
    const endText = randomString(10);
    // random numbering for the proof
    const numbering = Math.floor(Math.random() * 1000);
    const buffer: RootContent[] = [
      {
        type: "heading",
        depth: 1,
        children: [
          {
            type: "text",
            value: "This is a proof.",
          },
        ],
      },
    ];
    const info: BlockStartInfo = {
      envName: "proof",
      startLine: line,
      envStartText: startText,
      envEndText: endText,
      numbering: numbering,
      addNumbering: true,
    };

    const result: RootContent[] = parseEnv(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: `${startText} ${numbering} `,
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        depth: 1,
        children: [
          {
            type: "text",
            value: "This is a proof.",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: endText,
          },
        ],
      },
    ]);
  });

  it("should add startText and endText without numbering for buffer with multiple elements", async () => {
    // random line number
    const line = Math.floor(Math.random() * 1000);
    // random startText and endText
    const startText = randomString(10);
    const endText = randomString(10);
    const buffer: RootContent[] = [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "This is a proof.",
          },
        ],
      },
      {
        type: "text",
        value: "This is another proof.",
      },
    ];
    const info: BlockStartInfo = {
      envName: "proof",
      startLine: line,
      envStartText: startText,
      envEndText: endText,
      addNumbering: false,
    };

    const result: RootContent[] = parseEnv(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: `${startText} `,
              },
            ],
          },
          {
            type: "text",
            value: "This is a proof.",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "This is another proof.",
          },
          {
            type: "text",
            value: endText,
          },
        ],
      },
    ]);
  });

  it("should add startText and endText with numbering for buffer with multiple elements", async () => {
    // random line number
    const line = Math.floor(Math.random() * 1000);
    // random startText and endText
    const startText = randomString(10);
    const endText = randomString(10);
    // random numbering for the proof
    const numbering = Math.floor(Math.random() * 1000);
    const buffer: RootContent[] = [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "This is a proof.",
          },
        ],
      },
      {
        type: "text",
        value: "This is another proof.",
      },
    ];
    const info: BlockStartInfo = {
      envName: "proof",
      startLine: line,
      envStartText: startText,
      envEndText: endText,
      numbering: numbering,
      addNumbering: true,
    };

    const result: RootContent[] = parseEnv(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: `${startText} ${numbering} `,
              },
            ],
          },
          {
            type: "text",
            value: "This is a proof.",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "This is another proof.",
          },
          {
            type: "text",
            value: endText,
          },
        ],
      },
    ]);
  });
});
