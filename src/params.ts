/**
 * The parameters for an environment output.
 * Will override the global options.
 * Parameters are in the format: `key="value"` and separated by spaces.
 *
 * Output will be in the format:
 * ```md
 * envStartText Numbering
 * ...
 * envEndText
 * ```
 *
 * @property {string} envStartText
 *   The text to add at the start of the block.
 * @property {string} envEndText
 *   The text to add at the end of the block.
 * @property {number} numbering
 *   Manually set the numbering for the environment.
 * @property {boolean} addNumbering
 *   Whether to add numbering to the environment.
 */
export interface Params {
  envStartText?: string;
  envEndText?: string;
  numbering?: number;
  addNumbering?: boolean;
}

/**
 * Parse the optional parameters for an environment.
 * Will throw an error if the parameters are invalid.
 *
 * @param params
 */
export function parseParams(params: string, line: number): Params {
  // use regex to parse the parameters
  const match = params.match(/(\w+)="([^"]*)"/g);
  if (!match) {
    return {};
  }

  const parsedParams: Params = {};
  match.forEach((param) => {
    // find the first `=` and split the string
    const equalIndex = param.indexOf("=");
    const key = param.substring(0, equalIndex);
    const value = param.substring(equalIndex + 2, param.length - 1);

    switch (key) {
      case "envStartText":
        parsedParams.envStartText = value;
        break;
      case "envEndText":
        parsedParams.envEndText = value;
        break;
      case "numbering":
        parsedParams.numbering = parseInt(value);
        break;
      case "addNumbering":
        parsedParams.addNumbering = value === "true";
        break;
      default:
        throw new Error(
          `Parsing error: Unknown parameter "${key}" at line ${line}`
        );
    }
  });

  return parsedParams;
}
