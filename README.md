![Node.js CI](https://github.com/ruffythepirate/sql-apply/workflows/Node.js%20CI/badge.svg)
[![codecov](https://codecov.io/gh/ruffythepirate/sql-apply/branch/master/graph/badge.svg)](https://codecov.io/gh/ruffythepirate/sql-apply)


# SQL Apply

This project aims at doing what the already existing [flyway](https://flywaydb.org/documentation/) project is doing in the JVM world. It allows you to define one or multiple directories where you can create SQL files. Upon applying these files the library will check if the files have already been applied before (by looking into a migrations table in the DB). If they have not yet been applied they will be executed sequantially.

There are already other libraries available for Node that helps you with performing DB migrations, why create a new one? Because I want a library that exists that allows you to write the migration scripts in pure SQL (no need for every function / feature in SQL to get a corresponding translation written in JS). I also want the migrations to be executable from code. This way it's very low effort to making sure that all environments (local / staging / prod) are all being kept up to date.

Is this difficult? I don't know, perhaps it is. We'll find out. At least I'll start and see where I land. This is still a young project, so don't hesitate to report Issues if you find them or to come with suggestion on how this could be done better. As a first step it's expected to support postgres, in later stages there's no reason why functionality can't be extended to support other SQL databases.

## Limitations

This project currently uses `IF NOT EXISTS` syntax which means it's only compatible with Postgres 9.1 and upward.

## Features

These features are not yet implemented, but the aim is to:

* Allow project to bootstrap a migrations table on first run.
* Allow one or multiple target folders to be used for migration scripts
* Ensuring that scripts are applied in an ordered manner according to naming convention.
* Migrations scripts will be written in SQL.

For full information please refer to the [API Documentation](https://ruffythepirate.github.io/sql-apply/).

## Conventions

The project aims at staying true to the flyway project mentioned above. For this the name convention consists of:

* Prefix: Defaults to V.
* Version: Dots or underscores separated in as many parts as one likes.
* Separator: Defaults to __ (two underscores) and separates the version from the description.
* Description: A text with words separated by underscores or spaces.
* Suffix: Defaults to .sql.

For example, the following are all valid migration scripts:

* V1__some_description.sql 
* V15.003__some_other_script.sql

The library will enforce that versions are monotonically increasing starting at 1.

## Requirements

* Node 11 or higher
* npm
* Postgres

## License

[MIT](./LICENSE)
