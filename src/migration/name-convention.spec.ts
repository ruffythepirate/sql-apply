import {isNameValid} from "./name-convention";

const validFilenames = [
    "V1__Create_table.sql",
    "V2_01__Improve_table.sql",
    "V200.01__Improve_table.sql",
];
validFilenames.forEach(filename => {
    it(`should return true for valid filename ${filename}`, () => {
        expect(isNameValid(filename)).toBe(true);
    })
})

const invalidFilenames = [
    "F1__Create_table.sql",
    "V2_01X05__Improve_table.sql",
    "V2_Improve_table.sql",
];
invalidFilenames.forEach(filename => {
    it(`should return false for invalid filename ${filename}`, () => {
        expect(isNameValid(filename)).toBe(false);
    })
})
