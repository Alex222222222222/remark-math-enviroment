import { parseStartMarker } from "../src/parseStartMarker";
import { RootContent } from "mdast";

describe("parseStartMarker", () => {
  it("should return undefined if the node is not a paragraph", () => {
    const node: RootContent = {
      type: "heading",
      children: [
        { type: "text", value: "startMarker{env_name}[optional_params]" },
      ],
      depth: 1,
    };

    expect(
      parseStartMarker(node, "startMarker", {}, new Map())
    ).toBeUndefined();
  });

  it("should return undefined if the node is a paragraph but have length 0", () => {
    const node: RootContent = {
      type: "paragraph",
      children: [],
    };

    expect(
      parseStartMarker(node, "startMarker", {}, new Map())
    ).toBeUndefined();
  });

  it("should return undefined if the node is a paragraph but the first child is not text", () => {
    const node: RootContent = {
      type: "paragraph",
      children: [
        { type: "strong", children: [{ type: "text", value: "startMarker" }] },
      ],
    };

    expect(
      parseStartMarker(node, "startMarker", {}, new Map())
    ).toBeUndefined();
  });

  it("should return undefined if the node is a paragraph but the text does not start with the startMarker", () => {
    const node: RootContent = {
      type: "paragraph",
      children: [
        { type: "text", value: "notStartMarker{env_name}[optional_params]" },
      ],
    };

    expect(
      parseStartMarker(node, "startMarker", {}, new Map())
    ).toBeUndefined();
  });

  it("should throw an error if the start block marker is not in the correct format", () => {
    const node: RootContent = {
      type: "paragraph",
      children: [{ type: "text", value: "startMarker(env_name}" }],
    };

    expect(() => parseStartMarker(node, "startMarker", {}, new Map())).toThrow(
      `Parsing error: Incorrect format for the start block marker at line undefined`
    );
  });

  it("should throw an error if the environment name is not valid", () => {
    const node: RootContent = {
      type: "paragraph",
      children: [
        { type: "text", value: "startMarker{env_name}[optional_params]" },
      ],
    };

    expect(() =>
      parseStartMarker(
        node,
        "startMarker",
        { theoremEnvs: new Map() },
        new Map()
      )
    ).toThrow(
      `Parsing error: Unknown environment name "env_name" at line undefined`
    );
  });

  it("should return the correct BlockStartInfo without params", () => {
    const node: RootContent = {
      type: "paragraph",
      children: [{ type: "text", value: "startMarker{env_name}" }],
    };

    // random start numbering
    const numbering = Math.floor(Math.random() * 1000);
    const theorem_env_counters = new Map(
      Object.entries({ env_name: numbering, a: 1 })
    );
    expect(
      parseStartMarker(
        node,
        "startMarker",
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
        theorem_env_counters
      )
    ).toStrictEqual({
      envName: "env_name",
      startLine: undefined,
      params: "",
      numbering: numbering + 1,
    });

    // values in theorem_env_counters should be updated
    expect(theorem_env_counters.get("env_name")).toBe(numbering + 1);
    expect(theorem_env_counters.get("a")).toBe(1);
  });

  it("should return the correct BlockStartInfo with params", () => {
    const node: RootContent = {
      type: "paragraph",
      children: [
        { type: "text", value: "startMarker{env_name}[optional_params]" },
      ],
    };

    // random start numbering
    const numbering = Math.floor(Math.random() * 1000);
    const theorem_env_counters = new Map(
      Object.entries({ env_name: numbering, a: 1 })
    );
    expect(
      parseStartMarker(
        node,
        "startMarker",
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
        theorem_env_counters
      )
    ).toStrictEqual({
      envName: "env_name",
      startLine: undefined,
      params: "[optional_params]",
      numbering: numbering + 1,
    });

    // values in theorem_env_counters should be updated
    expect(theorem_env_counters.get("env_name")).toBe(numbering + 1);
    expect(theorem_env_counters.get("a")).toBe(1);
  });
});
