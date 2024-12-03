import { parseParams } from "../src/params";

describe("params", () => {
    it("should parse the parameters correctly", () => {
        const params = "envStartText=\"start\" envEndText=\"end\" numbering=\"1\" addNumbering=\"true\"";
        const parsedParams = parseParams(params, 1);

        expect(parsedParams.envStartText).toBe("start");
        expect(parsedParams.envEndText).toBe("end");
        expect(parsedParams.numbering).toBe(1);
        expect(parsedParams.addNumbering).toBe(true);
    });

    it("should throw error for invalid params", () => {
        const params = "invalid=\"value\"";
        expect(() => parseParams(params, 1)).toThrow(
            "Parsing error: Unknown parameter \"invalid\" at line 1"
        );
    });
});