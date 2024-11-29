import {parseProof} from "../../src/mathEnv/proof";
import {RootContent} from "mdast";
import { BlockStartInfo } from "../../src/parseStartMarker";

describe("parseProof", () => {
  it("throw error if buffer is empty", async () => {
    // random line number
    const line = Math.floor(Math.random() * 1000);
    const buffer: RootContent[] = [] as RootContent[];
    const info: BlockStartInfo = {
      envName: "proof",
      line: line,
    };

    expect(() => {
      parseProof(info, buffer);
    }).toThrow("Proof block is empty at line " + line);
  });

  it("throw error if envName is not proof", async () => {
    // random line number
    const line = Math.floor(Math.random() * 1000);
    const buffer: RootContent[] = [] as RootContent[];
    const info: BlockStartInfo = {
      envName: "theorem",
      line: line,
    };

    expect(() => {
      parseProof(info, buffer);
    }).toThrow("parseProof called with envName theorem at line " + line);
  });

  it("should add Proof: and square if the type is paragraph", async () => {
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
      line: 1,
    };

    const result: RootContent[] = parseProof(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: "Proof: ",
              },
            ],
          },
          {
            type: "text",
            value: "This is a proof.",
          },
          {
            type: "text",
            value: "■",
          }
        ],
      },
    ]);
  });

  it("should add Proof: and square if the type is text", async () => {
    const buffer: RootContent[] = [
      {
        type: "text",
        value: "This is a proof.",
      },
    ];
    const info: BlockStartInfo = {
      envName: "proof",
      line: 1,
    };

    const result: RootContent[] = parseProof(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: "Proof: ",
              },
            ],
          },
          {
            type: "text",
            value: "This is a proof.",
          },
          {
            type: "text",
            value: "■",
          }
        ],
      },
    ]);
  });

  it("should add Proof: and square if the type is emphasis", async () => {
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
      line: 1,
    };

    const result: RootContent[] = parseProof(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: "Proof: ",
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
            value: "■",
          }
        ],
      },
    ]);
  });

  it("should add Proof: and square if the type is strong", async () => {
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
      line: 1,
    };

    const result: RootContent[] = parseProof(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: "Proof: ",
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
            value: "■",
          }
        ],
      },
    ]);
  });

  it("should add Proof: and square if the type is not paragraph, text, emphasis, or strong", async () => {
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
      line: 1,
    };

    const result: RootContent[] = parseProof(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: "Proof: ",
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
            value: "■",
          },
        ],
      },
    ]);
  });

  it("should add proof for buffer with multiple elements", async () => {
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
        type: "paragraph",
        children: [
          {
            type: "text",
            value: "This is another proof.",
          },
        ],
      },
    ];
    const info: BlockStartInfo = {
      envName: "proof",
      line: 1,
    };

    const result: RootContent[] = parseProof(info, buffer);

    expect(result).toEqual([
      {
        type: "paragraph",
        children: [
          {
            type: "strong",
            children: [
              {
                type: "text",
                value: "Proof: ",
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
            value: "■",
          }
        ],
      },
    ]);
  });
});
