import { RootContent } from "mdast";
import { Options } from "./options";

function getTextContent(node: RootContent): string {
  switch (node.type) {
    case "text":
      return node.value;
    case "inlineCode":
      return node.value;
    case "code":
      return node.value;
    case "strong":
      return node.children.map(getTextContent).join(" ");
    case "emphasis":
      return node.children.map(getTextContent).join(" ");
    case "delete":
      return node.children.map(getTextContent).join(" ");
    case "link":
      return node.children.map(getTextContent).join(" ");
    case "image":
      return node.title ? node.title : "";
    case "linkReference":
      return node.identifier;
    case "imageReference":
      return node.identifier;
    case "footnoteReference":
      return node.identifier;
    case "html":
      return node.value;
    case "paragraph":
      return node.children.map(getTextContent).join(" ");
    case "heading":
      return node.children.map(getTextContent).join(" ");
    case "thematicBreak":
      return "";
    case "blockquote":
      return node.children.map(getTextContent).join(" ");
    case "list":
      return node.children.map(getTextContent).join(" ");
    case "listItem":
      return node.children.map(getTextContent).join(" ");
    case "definition":
      return node.identifier;
    case "table":
      return node.children.map(getTextContent).join(" ");
    case "tableRow":
      return node.children.map(getTextContent).join(" ");
    case "tableCell":
      return node.children.map(getTextContent).join(" ");
    case "yaml":
      return node.value;
  }

  return "";
}

/**
 * Information about the start block marker.
 * The marker is in the format: startMarker{env_name}[optional_params]
 * @param envName - The name of the environment.
 * @param startLine - The line number where the block starts.
 * @param endLine - The line number where the block ends.
 * @param envStartText - The text to add at the start of the block.
 * @param envEndText - The text to add at the end of the block.
 * @param params - The optional parameters for the environment, will override the default parameters.
 * @param numbering - The numbering for the environment.
 * @param addNumbering - Whether to add numbering to the environment.
 */
export interface BlockStartInfo {
  envName: string;
  startLine?: number;
  endLine?: number;
  envStartText?: string;
  envEndText?: string;
  params?: string;
  numbering?: number;
  addNumbering?: boolean;
  name?: string;
}

/**
 * Parse the start block marker.
 * Return undefined if the node is not a start block marker.
 * The marker is in the format: startMarker{env_name}[optional_params].
 * Throw an error if the marker is not in the correct format or the environment name is unknown.
 *
 * @param node - The node to parse.
 * @param startMarker - The start block marker.
 * @param options - The options for the plugin.
 * @param theorem_env_counters - The counters for the theorem environments.
 * @returns The block start information if the node is a start block marker.
 */
export function parseStartMarker(
  node: RootContent,
  startMarker: string,
  options: Options,
  theorem_env_counters: Map<string, number>
): BlockStartInfo | undefined {
  if (
    node.type !== "paragraph" ||
    node.children?.length === 0 ||
    node.children?.[0]?.type !== "text" ||
    !node.children?.[0]?.value.trim().startsWith(startMarker)
  ) {
    return;
  }

  // The text content of the paragraph.
  const value = getTextContent(node);

  // use regex to get the name and params: startMarker{env_name}[optional_params]
  const match = value.match(new RegExp(`${startMarker}{(.*)}(\\[.*\\])?`));

  // if the start block marker is not in the correct format, raise an parsing error with line number
  if (!match) {
    throw new Error(
      `Parsing error: Incorrect format for the start block marker at line ${node.position?.start.line}`
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

  // get the optional params
  const params: string = match[2] ?? "";

  // increment the counter for the environment
  const counter_label = envName === "proof" ? options.proofOptions : options.theoremEnvs?.get(envName);
  if (!counter_label) {
    throw new Error(
      `Parsing error: Counter label not found for environment "${envName}" at line ${node.position?.start.line}`
    );
  }
  theorem_env_counters.set(
    counter_label.counterLabel,
    theorem_env_counters.get(counter_label.counterLabel)! + 1
  );

  return {
    envName,
    startLine: node.position?.start.line,
    params,
    numbering: theorem_env_counters.get(counter_label.counterLabel)!,
  };
}
