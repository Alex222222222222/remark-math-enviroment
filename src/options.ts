/**
 * @property {Map<string, TheoremOptions>} [theoremEnvs]
 *   List of theorem environments to number.
 * @property {string} [defaultClassName]
 *   Default class name to use for the custom divs.
 * @property {string} [startMarker]
 *   Start marker for the custom environment.
 * @property {string} [endMarker]
 *   End marker for the custom environment.
 * @property {GeneralEnvOptions} [proofOptions]
 *   Options for the proof environment.
 */
export interface Options {
  readonly theoremEnvs?: Map<string, TheoremOptions>;
  readonly defaultClassName?: string;
  readonly startMarker?: string;
  readonly endMarker?: string;
  readonly proofOptions?: GeneralEnvOptions;
}

/**
 * The options for a theorem environment.
 * @property {string} startText
 *   The label to use in the output (e.g., "Theorem").
 * @property {string} counterLabel
 *   The label to use in the numbering (e.g., "theorem"),
 *   defaults to lowercase of startText.
 * @property {boolean} addNumbering
 *   Whether to output the numbering.
 *   Defaults to true.
 */
export interface TheoremOptions {
  envStartText: string;
  counterLabel: string;
  addNumbering: boolean;
}

/**
 * The options for a general environment.
 * @property {string} endText
 *   The label to use in the output (e.g., "■").
 */
export interface GeneralEnvOptions extends TheoremOptions {
  envEndText: string;
}

/**
 * Create default theorem options.
 * @param {string} label
 *   The label for the theorem environment.
 * @returns {TheoremOptions}
 *   The default options.
 */
export function defaultTheoremOptions(label: string): TheoremOptions {
  return {
    // Capitalized label
    envStartText: label.charAt(0).toUpperCase() + label.slice(1),
    counterLabel: label.toLowerCase(),
    addNumbering: true,
  };
}

/**
 * Default options for the proof environment.
 * @type {GeneralEnvOptions}
 */
const defaultProofOptions: GeneralEnvOptions = {
  envStartText: "Proof:",
  counterLabel: "proof",
  addNumbering: false,
  envEndText: "■",
};

/**
 * Default options.
 * @type {Options}
 */
export const defaultOptions: Options = {
  theoremEnvs: new Map([
    ["theorem", defaultTheoremOptions("theorem")],
    ["lemma", defaultTheoremOptions("lemma")],
    ["corollary", defaultTheoremOptions("corollary")],
    ["proposition", defaultTheoremOptions("proposition")],
    ["definition", defaultTheoremOptions("definition")],
    ["example", defaultTheoremOptions("example")],
  ]),
  defaultClassName: "custom-div",
  startMarker: "::math-env-start",
  endMarker: "::math-env-end",
  proofOptions: defaultProofOptions,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fillDefaults<T extends Record<string, any>>(defaults: T, obj: Partial<T>): T {
  const result: T = { ...defaults }; // Start with defaults
  for (const key in obj) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value: any | undefined = obj[key];
    if (value !== undefined && 
      !(Array.isArray(value) && value.length === 0) || // Empty array
      !(value instanceof Map && value.size === 0) // Empty map
    ) {
      result[key] = obj[key] as T[typeof key]; // Ensure correct type assignment
    }
  }
  return result;
}

/**
 * Fill undefined options with default values.
 * @param {Options} options
 *   The options to fill.
 * @returns {Options}
 *   The filled options.
 */
export function fillUndefinedOptionsWithDefault(options: &Options): Options {
  const newOptions = fillDefaults(defaultOptions, options);
  return newOptions;
}

