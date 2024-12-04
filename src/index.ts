import { Root, RootContent } from "mdast";
import { BlockStartInfo, parseStartMarker } from "./parseStartMarker";
import { parseEndMarker } from "./parseEndMarker";
import { parseEnv } from "./mathEnv/parseEnv";
import { fillUndefinedOptionsWithDefault, Options } from "./options";
import { parseParams } from "./params";


/**
 * Add `auto-numbering` to headings in Markdown.
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export function remarkMathEnv(options: Options) {
  return (tree: Root): Root | undefined => {
    const newOptions = fillUndefinedOptionsWithDefault(options);

    const theorem_env_counters = new Map<string, number>();
    for (const [, theoremOptions] of newOptions.theoremEnvs!) {
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
        node.children?.[0]?.value.startsWith(newOptions.startMarker!)
      ) {
        const info = parseStartMarker(
          node,
          newOptions.startMarker!,
          newOptions,
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
        node.children?.[0]?.value.trim().startsWith(newOptions.endMarker!)
      ) {
        parseEndMarker(
          node,
          newOptions.endMarker!,
          newOptions,
          blocksInfo,
          buffer
        );
        // parse the optional parameters and overwrite the default options
        let lastBlockInfo = blocksInfo.pop();
        if (!lastBlockInfo) {
          throw new Error("Parsing error: Incorrect nesting of environments");
        }
        if (newOptions.theoremEnvs?.has(lastBlockInfo.envName)) {
          const theoremOptions = newOptions.theoremEnvs.get(
            lastBlockInfo.envName
          );
          if (theoremOptions) {
            lastBlockInfo = { ...lastBlockInfo, ...theoremOptions };
          }
        } else if (lastBlockInfo.envName === "proof") {
          lastBlockInfo = { ...lastBlockInfo, ...newOptions.proofOptions! };
        }
        const params = parseParams(
          lastBlockInfo.params!,
          lastBlockInfo.startLine!
        );
        lastBlockInfo = { ...lastBlockInfo, ...params };

        // feed the buffer to custom environment parser and return the new content
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
