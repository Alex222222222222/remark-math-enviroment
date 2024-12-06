import { BlockStartInfo } from "../parseStartMarker";
import { RootContent } from "mdast";

/**
 * Parse the environment block.
 * @param info - Information about the block start.
 * @param buffer - The content of the block.
 * @returns The modified content of the block.
 */

export function parseEnv(
  info: BlockStartInfo,
  buffer: RootContent[]
): RootContent[] {
  // TODO change "proof" in all the error messages
  // wrap the buffer in a div with the class "proof"
  // which should start with bold "Proof:" text and end with a black square

  // throw an error if addNumbering is true but numbering is undefined
  if (info.addNumbering && !info.numbering) {
    throw new Error(
      "Numbering is undefined for proof block at line " + info.startLine
    );
  }

  // throw an error if the buffer is empty
  if (buffer.length === 0) {
    throw new Error("Proof block is empty at line " + info.startLine);
  }

  // add envStartText text to the start of the buffer
  let startText = info.addNumbering
    ? `${info.envStartText} ${info.numbering}`
    : `${info.envStartText}`;
  startText = info.name ? `${startText} (${info.name})` : startText;
  startText = info.envName === "proof" ? `${startText} ` : `${startText}. `;
  if (buffer[0].type === "paragraph") {
    // add the bold startText text to the start of the buffer
    buffer[0].children?.unshift({
      type: "strong",
      children: [
        {
          type: "text",
          value: startText,
        },
      ],
    });
  } else if (
    buffer[0].type === "text" ||
    buffer[0].type === "emphasis" ||
    buffer[0].type === "strong"
  ) {
    // wrap the text in a paragraph, then add the bold startText text
    buffer[0] = {
      type: "paragraph",
      children: [
        {
          type: "strong",
          children: [
            {
              type: "text",
              value: startText,
            },
          ],
        },
        buffer[0],
      ],
    };
  } else {
    // add the bold startText text to the start of the buffer
    buffer.unshift({
      type: "paragraph",
      children: [
        {
          type: "strong",
          children: [
            {
              type: "text",
              value: startText,
            },
          ],
        },
      ],
    });
  }

  // add a end marker to the end of the buffer if the end marker is not empty
  if (!info.envEndText || info.envEndText.length === 0) {
    return buffer;
  }
  let end = buffer[buffer.length - 1];
  if (
    end.type === "paragraph" ||
    end.type === "emphasis" ||
    end.type === "strong"
  ) {
    // add the end marker to the end of the buffer
    end.children?.push({
      type: "text",
      value: info.envEndText,
    });
  } else if (end.type === "text") {
    // wrap the text in a paragraph, then add the end marker
    end = {
      type: "paragraph",
      children: [
        end,
        {
          type: "text",
          value: info.envEndText,
        },
      ],
    };
  } else {
    // add the end marker to the end of the buffer
    end = {
      type: "paragraph",
      children: [
        {
          type: "text",
          value: info.envEndText,
        },
      ],
    };

    buffer.push(end);
  }
  buffer[buffer.length - 1] = end;

  return buffer;
}
