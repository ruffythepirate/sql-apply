export function isNameValid(filename: string): boolean {
    return /^V\d+([._]\d+)?__.*\.sql$/.test(filename);
}