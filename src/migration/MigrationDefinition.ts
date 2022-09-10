

class MigrationDefinition {
    path: string;
    version: number;
    description: string;

    constructor(path: string, version: number, description: string) {
        this.path = path;
        this.version = version;
        this.description = description;
    }
}