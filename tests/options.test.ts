import { Options, fillUndefinedOptionsWithDefault } from "../src/options";

describe("options", () => {
    it("should fill undefined options with default values", () => {
        const options: Options = {};
        const filledOptions = fillUndefinedOptionsWithDefault(options);

        for (const key in filledOptions) {
            expect(filledOptions[key]).toBeDefined();
        }
    });

    it("should not fill defined options with default values", () => {
        const options: Options = {
            defaultClassName: "1",
            startMarker: "2",
            endMarker: "",
        };
        const filledOptions = fillUndefinedOptionsWithDefault(options);

        expect(filledOptions.defaultClassName).toBe("1");
        expect(filledOptions.startMarker).toBe("2");
        expect(filledOptions.endMarker).toBe("");
    });
});