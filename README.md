# flyway

This project aims at doing what the already existing [flyway](https://flywaydb.org/documentation/) project is doing in the JVM world. It allows you to define one or multiple directories where you can create SQL files. Upon applying these files the library will check if the files have already been applied before (by looking into a migrations table in the DB). If they have not yet been applied they will be executed sequantially.

There are already other libraries available for Node that helps you with performing DB migrations, why create a new one? Because I want a library that exists that allows you to write the migration scripts in pure SQL (no need for every function / feature in SQL to get a corresponding translation written in JS). I also want the migrations to be executable from code. This way it's very low effort to making sure that all environments (local / staging / prod) are all being kept up to date.

Is this difficult? I don't know, perhaps it is. We'll find out. At least I'll start and see where I land.

## Limitations

This project currently uses `IF NOT EXISTS` syntax which means it's only compatible with Postgres 9.1 and upward.

## Features

These features are not yet implemented, but the aim is to:

* Allow project to bootstrap a migrations table on first run.
* Allow one or multiple target folders to be used for migration scripts
* Ensuring that scripts are applied in an ordered manner according to naming convention.
* Migrations scripts will be written in SQL.

## Conventions

The project aims at staying true to the original flyway project. For this the name convention consists of:

* Prefix: Defaults to V.
* Version: Dots or underscores separated in as many parts as one likes.
* Separator: Defaults to __ (two underscores) and separates the version from the description.
* Description: A text with words separated by underscores or spaces.
* Suffix: Defaults to .sql.

For example, the following are all valid Flyway scripts:

* V1__some_description.sql 
* V15.003__some_other_script.sql

The library will enforce that versions are monotonically increasing starting at 1.

## Requirements

* Node and npm
* Postgres

## Usage

If you don't already have Postgres running locally:
* run `docker-compose up` in the root folder.

Then run:
* npm run start:dev

## License

[MIT](./LICENSE)
