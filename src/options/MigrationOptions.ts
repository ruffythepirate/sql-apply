export interface MigrationOptions {
    /**
     * The schema where the migration table is located. Default value is public.
     */
    migrationTableSchema?: string;
    /**
     * The name of the migration table. Default value is migrations.
     */
    migrationTable?: string;
    /**
     * The name of the database where the migration table is located. Default value is postgres.
     */
    databaseName?: string;
    /**
     * The timeout in seconds for the migration table lock. Default value is 60.
     */
    timeoutInSeconds?: number;
}
