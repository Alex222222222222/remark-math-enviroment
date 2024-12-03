import { Root, RootContent } from "mdast";
import { BlockStartInfo, parseStartMarker } from "./parseStartMarker";
import { parseEndMarker } from "./parseEndMarker";
import { parseEnv } from "./mathEnv/parseEnv";
import { fillUndefinedOptionsWithDefault, Options } from "./options";

/**
 * Add `auto-numbering` to headings in Markdown.
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export function remarkMathEnv(passOptions: Options) {
  return (tree: Root): Root | undefined => {
    const options = fillUndefinedOptionsWithDefault(passOptions);

    const theorem_env_counters = new Map<string, number>();
    for (const [, theoremOptions] of options.theoremEnvs!) {
      theorem_env_counters.set(theoremOptions.counterLabel, 0);
    }

    const newChildren: RootContent[] = [];
    const blocksInfo: BlockStartInfo[] = [];
    const buffer: RootContent[][] = [];

    tree.children.forEach((node) => {
      // this is a start of a new math environment block
      if (
        node.type === "paragraph" &&
        node.children?.[0]?.type === "text" &&
        node.children?.[0]?.value.trim().startsWith(options.startMarker!)
      ) {
        const info = parseStartMarker(
          node,
          options.startMarker!,
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
        node.children?.[0]?.value.trim().startsWith(options.endMarker!)
      ) {
        parseEndMarker(node, options.endMarker!, options, blocksInfo, buffer);
        // TODO parse the optional parameters and overwrite the default options

        // feed the buffer to custom environment parser and return the new content
        const lastBlockInfo = blocksInfo.pop();
        const lastBuffer = buffer.pop();
        const newContent = parseEnv(lastBlockInfo!, lastBuffer!);
        newChildren.push(...newContent);
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

    return { ...tree, children: newChildren };
  };
}
