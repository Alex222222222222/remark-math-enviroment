import { RootContent } from "mdast";
import { BlockStartInfo } from "./parseStartMarker";
import { Options } from "./options";

/**
 * Parse the end block marker, test if the node marker is an valid end block marker.
 * The marker is in the format: endMarker{env_name}.
 * Throw an error if the marker is not in the correct format or the environment name is unknown,
 * or the nesting of environments is incorrect.
 *
 * @param node - The node to parse.
 * @param endMarker - The end block marker.
 * @param options - The options for the parser.
 * @param blocksInfo - The information of the blocks.
 * @param buffer - The buffer for the block content.
 * @returns The content of the block.
 */
export function parseEndMarker(
  node: RootContent,
  endMarker: string,
  options: Options,
  blocksInfo: BlockStartInfo[],
  buffer: RootContent[][]
) {
  if (
    node.type !== "paragraph" ||
    node.children?.[0]?.type !== "text" ||
    !node.children?.[0]?.value.trim().startsWith(endMarker)
  ) {
    return;
  }

  // parse the end block marker and get the name of the environment using regex
  // endMarker{env_name}
  const value: string = node.children?.[0]?.value;
  const match = value.match(new RegExp(`${endMarker}{(.*)}`));

  // if the end block marker is not in the correct format, raise an parsing error with line number
  if (!match) {
    throw new Error(
      `Parsing error: Incorrect format for the end block marker at line ${node.position?.start.line}`
    );
  }

  // get the name of the environment
  const envName: string = match[1];
  // test if the environment name is valid
  if (!options.theoremEnvs?.has(envName) && envName !== "proof") {
    throw new Error(
      `Parsing error: Unknown environment name "${envName}" at line ${node.position?.start.line}`
    );
  }

  // throw an error if blocksInfo is empty
  if (blocksInfo.length === 0) {
    throw new Error(
      `Parsing error: Incorrect nesting of environments with "${envName}" end at line ${node.position?.start.line}`
    );
  }

  // test if the environment name is the same as the current block depth
  if (blocksInfo[blocksInfo.length - 1].envName !== envName) {
    throw new Error(
      `Parsing error: Incorrect nesting of environments with "${
        blocksInfo[blocksInfo.length - 1].envName
      }" start at line ${
        blocksInfo[blocksInfo.length - 1].startLine
      } and "${envName}" end at line ${node.position?.start.line}`
    );
  }

  // test if the buffer is empty
  if (buffer[buffer.length - 1].length === 0) {
    throw new Error(
      `Parsing error: Empty environment block at line ${
        blocksInfo[blocksInfo.length - 1].startLine
      }-${node.position?.start.line}`
    );
  }

  // add the endline number to the block info
  blocksInfo[blocksInfo.length - 1].endLine = node.position?.start.line;
}
