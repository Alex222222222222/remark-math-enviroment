import { BlockStartInfo } from "../parseStartMarker";
import { RootContent } from "mdast";

export function parseProof(
  info: BlockStartInfo,
  buffer: RootContent[]
): RootContent[] {
  // wrap the buffer in a div with the class "proof"
  // which should start with bold "Proof:" text and end with a black square

  // throw an error if the envName is not "proof"
  if (info.envName !== "proof") {
    throw new Error(
      "parseProof called with envName " + info.envName + " at line " + info.line
    );
  }

  // throw an error if the buffer is empty
  if (buffer.length === 0) {
    throw new Error("Proof block is empty at line " + info.line);
  }

  // add Proof: text to the start of the buffer
  if (buffer[0].type === "paragraph") {
    // add the bold "Proof: " text to the start of the buffer
    buffer[0].children?.unshift({
      type: "strong",
      children: [
        {
          type: "text",
          value: "Proof: ",
        },
      ],
    });
  } else if (
    buffer[0].type === "text" ||
    buffer[0].type === "emphasis" ||
    buffer[0].type === "strong"
  ) {
    // wrap the text in a paragraph, then add the bold "Proof: " text
    buffer[0] = {
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
        buffer[0],
      ],
    };
  } else {
    // add the bold "Proof: " text to the start of the buffer
    buffer.unshift({
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
    });
  }

  // add a black square to the end of the buffer
  let end = buffer[buffer.length - 1];
  if (
    end.type === "paragraph" ||
    end.type === "emphasis" ||
    end.type === "strong"
  ) {
    // add the black square to the end of the buffer
    end.children?.push({
      type: "text",
      value: "■",
    });
  } else if (end.type === "text") {
    // wrap the text in a paragraph, then add the black square
    end = {
      type: "paragraph",
      children: [
        end,
        {
          type: "text",
          value: "■",
        },
      ],
    };
  } else {
    // add the black square to the end of the buffer
    end = {
      type: "paragraph",
      children: [
        {
          type: "text",
          value: "■",
        },
      ],
    };

    buffer.push(end);
  }
  buffer[buffer.length - 1] = end;

  return buffer;
}
