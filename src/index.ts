import { Root, RootContent } from "mdast";
import { BlockStartInfo, parseStartMarker } from "./parseStartMarker";
import { parseEndMarker } from "./parseEndMarker";

/**
 * @property {Map<string, [string, string]>} [theorem_envs]
 *   List of theorem environments to number.
 *   Each entry is a map with key as the name of the environment and value as an array with two elements:
 *   - The label to use in the output (e.g., "Theorem").
 *   - The label to use in the numbering (e.g., "theorem"). If two environments have the same numbering label, they will share the same counter.
 * @property {string} [defaultClassName]
 *   Default class name to use for the custom divs.
 * @property {string} [startMarker]
 *   Start marker for the custom environment.
 * @property {string} [endMarker]
 *   End marker for the custom environment.
 */
export interface Options {
  theorem_envs?: Map<string, [string, string]>;
  defaultClassName?: string;
  startMarker?: string;
  endMarker?: string;
}

const defaultOptions: Options = {
  theorem_envs: new Map([
    ["theorem", ["Theorem", "theorem"]],
    ["lemma", ["Lemma", "lemma"]],
    ["corollary", ["Corollary", "corollary"]],
    ["proposition", ["Proposition", "proposition"]],
    ["definition", ["Definition", "definition"]],
    ["example", ["Example", "example"]],
  ]),
  defaultClassName: "custom-div",
  startMarker: "::math-env-start",
  endMarker: "::math-env-end",
};

/**
 * Add `auto-numbering` to headings in Markdown.
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export function remarkMathEnv(options: Options = defaultOptions) {
  return (tree: Root): undefined => {
    const startMarker: string =
      options.startMarker ?? defaultOptions.startMarker!;
    const endMarker: string = options.endMarker ?? defaultOptions.endMarker!;

    const theorem_env_counters = new Map<string, number>();
    for (const [, [, counter]] of options.theorem_envs!) {
      theorem_env_counters.set(counter, 0);
    }

    const newChildren: RootContent[] = [];
    const blocksInfo: BlockStartInfo[] = [];
    const buffer: RootContent[][] = [];

    tree.children.forEach((node) => {
      // this is a start of a new math environment block
      if (
        node.type === "paragraph" &&
        node.children?.[0]?.type === "text" &&
        node.children?.[0]?.value.trim().startsWith(startMarker)
      ) {
        const info = parseStartMarker(
          node,
          startMarker,
          options,
          theorem_env_counters
        );
        if (info) {
          blocksInfo.push(info);
          buffer.push([]);
        }
      }
      // this is the end of a math environment block
      else if (
        node.type === "paragraph" &&
        node.children?.[0]?.type === "text" &&
        node.children?.[0]?.value.trim().startsWith(endMarker)
      ) {
        const newContent: RootContent[] | undefined = parseEndMarker(
          node,
          endMarker,
          options,
          blocksInfo,
          buffer
        );
        if (newContent) {
          newChildren.push(...newContent);

          // pop the last block info and buffer
          blocksInfo.pop();
          buffer.pop();
        }
      }
      // this is a node within a math environment block or a regular node
      else {
        // regular node
        if (blocksInfo.length === 0) {
          newChildren.push(node);
        }
        // within a math environment block
        else {
          buffer[-1].push(node);
        }
      }
    });

    return undefined;
  };
}
