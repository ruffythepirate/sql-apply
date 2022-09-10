
export function isNameValid(filename: string): boolean {
    return /^V\d+([._]\d+)?__.*\.sql$/.test(filename);
}

export function parseMigration(path: string): MigrationDefinition {
    throw "Not implemented";
}