import { parseEndMarker } from "../src/parseEndMarker";
import { RootContent } from "mdast";

describe("parseEndMarker", () => {
  it("should return if the node is not a paragraph, and buffer and blocksInfo should not be changed", () => {
    const node: RootContent = {
      type: "heading",
      children: [{ type: "text", value: "endMarker{env_name}" }],
      depth: 1,
    };

    const blocksInfo = [{ envName: "env_name", startLine: 1 }];
    const buffer = [[node]];

    expect(
      parseEndMarker(node, "endMarker", {}, blocksInfo, buffer)
    ).toBeUndefined();
    expect(blocksInfo).toEqual([{ envName: "env_name", startLine: 1 }]);
    expect(buffer).toEqual([[node]]);
  });

  it("should return if the node is a paragraph but have length 0, and buffer and blocksInfo should not be changed", () => {
    const node: RootContent = {
      type: "paragraph",
      children: [],
    };

    const blocksInfo = [{ envName: "env_name", startLine: 1 }];
    const buffer = [[node]];

    expect(
      parseEndMarker(node, "endMarker", {}, blocksInfo, buffer)
    ).toBeUndefined();
    expect(blocksInfo).toEqual([{ envName: "env_name", startLine: 1 }]);
    expect(buffer).toEqual([[node]]);
  });

  it("should return if the node is a paragraph but the first child is not text, and buffer and blocksInfo should not be changed", () => {
    const node: RootContent = {
      type: "paragraph",
      children: [
        {
          type: "strong",
          children: [{ type: "text", value: "endMarker{env_name}" }],
        },
      ],
    };

    const blocksInfo = [{ envName: "env_name", startLine: 1 }];
    const buffer = [[node]];

    expect(
      parseEndMarker(node, "endMarker", {}, blocksInfo, buffer)
    ).toBeUndefined();
    expect(blocksInfo).toEqual([{ envName: "env_name", startLine: 1 }]);
    expect(buffer).toEqual([[node]]);
  });

  it("should return if the node is a paragraph but the text does not start with the startMarker, and buffer and blocksInfo should not be changed", () => {
    const node: RootContent = {
      type: "paragraph",
      children: [{ type: "text", value: "notEndMarker{env_name}" }],
    };

    const blocksInfo = [{ envName: "env_name", startLine: 1 }];
    const buffer = [[node]];

    expect(
      parseEndMarker(node, "endMarker", {}, blocksInfo, buffer)
    ).toBeUndefined();
    expect(blocksInfo).toEqual([{ envName: "env_name", startLine: 1 }]);
    expect(buffer).toEqual([[node]]);
  });

  it("should throw an error if the end block marker is not in the correct format", () => {
    const node: RootContent = {
      type: "paragraph",
      children: [{ type: "text", value: "endMarker(env_name}" }],
    };

    const blocksInfo = [{ envName: "env_name", startLine: 1 }];
    const buffer = [[node]];

    expect(() =>
      parseEndMarker(node, "endMarker", {}, blocksInfo, buffer)
    ).toThrow(
      `Parsing error: Incorrect format for the end block marker at line undefined`
    );
  });

  it("should throw an error if the environment name is unknown", () => {
    const node: RootContent = {
      type: "paragraph",
      children: [{ type: "text", value: "endMarker{unknown_env_name}" }],
    };

    const blocksInfo = [{ envName: "env_name", startLine: 1 }];
    const buffer = [[node]];

    expect(() =>
      parseEndMarker(node, "endMarker", {}, blocksInfo, buffer)
    ).toThrow(
      `Parsing error: Unknown environment name "unknown_env_name" at line undefined`
    );
  });

  it("should throw an error if blocksInfo is empty", () => {
    const node: RootContent = {
      type: "paragraph",
      children: [{ type: "text", value: "endMarker{env_name}" }],
    };

    const blocksInfo = [];
    const buffer = [[node]];

    expect(() =>
      parseEndMarker(
        node,
        "endMarker",
        {
          theoremEnvs: new Map(
            Object.entries({
              env_name: {
                counterLabel: "env_name",
                envStartText: "a",
                addNumbering: true,
              },
            })
          ),
        },
        blocksInfo,
        buffer
      )
    ).toThrow(
      `Parsing error: Incorrect nesting of environments with "env_name" end at line undefined`
    );
  });

  it("should throw an error if the environment name is not the same as the current block depth", () => {
    const node: RootContent = {
      type: "paragraph",
      children: [{ type: "text", value: "endMarker{env_name}" }],
    };

    const blocksInfo = [{ envName: "another_env_name", startLine: 1 }];
    const buffer = [[node]];

    expect(() =>
      parseEndMarker(
        node,
        "endMarker",
        {
          theoremEnvs: new Map(
            Object.entries({
              env_name: {
                counterLabel: "env_name",
                envStartText: "a",
                addNumbering: true,
              },
            })
          ),
        },
        blocksInfo,
        buffer
      )
    ).toThrow(
      `Parsing error: Incorrect nesting of environments with "another_env_name" start at line 1 and "env_name" end at line undefined`
    );
  });

  it("should throw an error if the buffer is empty", () => {
    const node: RootContent = {
      type: "paragraph",
      children: [{ type: "text", value: "endMarker{env_name}" }],
    };

    const blocksInfo = [{ envName: "env_name", startLine: 1 }];
    const buffer = [[]];

    expect(() =>
      parseEndMarker(
        node,
        "endMarker",
        {
          theoremEnvs: new Map(
            Object.entries({
              env_name: {
                counterLabel: "env_name",
                envStartText: "a",
                addNumbering: true,
              },
            })
          ),
        },
        blocksInfo,
        buffer
      )
    ).toThrow(`Parsing error: Empty environment block at line 1-undefined`);
  });

  it("should change the blocksInfo to the correct value and not remove the last element of the buffer", () => {
    const node: RootContent = {
      type: "paragraph",
      children: [{ type: "text", value: "endMarker{env_name}" }],
    };

    const blocksInfo = [{ envName: "env_name", startLine: 1 }];
    const buffer = [[node]];

    expect(
      parseEndMarker(
        node,
        "endMarker",
        {
          theoremEnvs: new Map(
            Object.entries({
              env_name: {
                counterLabel: "env_name",
                envStartText: "a",
                addNumbering: true,
              },
            })
          ),
        },
        blocksInfo,
        buffer
      )
    ).toBeUndefined();
    expect(blocksInfo).toEqual([
      { envName: "env_name", startLine: 1, endLine: undefined },
    ]);
    expect(buffer).toEqual([[node]]);
  });
});
