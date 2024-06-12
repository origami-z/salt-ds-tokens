#! /usr/bin/env node

/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import tokenDiff from "./index.js";
import chalk from "chalk";
import inquirer from "inquirer";
import fileImport from "./file-import.js";

import { Command } from "commander";
const program = new Command();

program
  .name("diff")
  .description("CLI to a Spectrum token diff generator")
  .version("0.1.0");

program
  .command("report")
  .description("Generates a diff report for two inputted schema")
  .argument("<original>", "original tokens")
  .argument("<updated>", "updated tokens") // idk what options there would be yet
  .action(async (original, updated) => {
    const [originalFile, updatedFile] = await Promise.all([
      fileImport(original),
      fileImport(updated),
    ]);
    const report = tokenDiff(originalFile, updatedFile);
    cliCheck(report);
  });

program.parse(process.argv);

// Questions:
// 1) How do I run this?
// 2) To automate testing, would I make an ava test File, import cli.js as a module, but then what?
// 3) How do you compare the output of the terminal (is it just text?)?

function indent(text, amount) {
  return `${"  ".repeat(amount)}${text}`;
}

function cliCheck(original, result) {
  const log = console.log;
  log(
    chalk.white(
      emoji.emojify(
        `:alarmclock: Newly "Un-deprecated" (${Object.keys(result.reverted).length})`,
      ),
    ),
  );
  Object.keys(result.reverted).forEach((token) => {
    log(indent(chalk.yellow(`"${token}"`), 0));
  });
  log(
    chalk.white(
      "\n-------------------------------------------------------------------------------------------",
    ),
  );
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "confirmation",
        message:
          "Are you sure this token is supposed to lose its `deprecated` status (y/n)?",
        default: false,
      },
    ])
    .then((response) => {
      if (response.confirmation) {
        console.clear();
        return printReport(original, result);
      } else {
        return 1;
      }
    });
}

function printReport(original, result) {
  const totalTokens =
    Object.keys(result.renamed).length +
    Object.keys(result.deprecated).length +
    Object.keys(result.reverted).length +
    Object.keys(result.added).length +
    Object.keys(result.deleted).length +
    Object.keys(result.updated).length;
  log(chalk.white("**Tokens Changed (" + totalTokens + ")**"));
  log(
    chalk.white(
      "\n-------------------------------------------------------------------------------------------",
    ),
  );
  log(
    chalk.white(
      emoji.emojify(`:memo: Renamed (${Object.keys(result.renamed).length})`),
    ),
  );
  Object.keys(result.renamed).forEach((token) => {
    log(
      indent(
        chalk.white(`"${token["old-name"]}" -> `) +
          chalk.yellow(`"${token}"`, 0),
      ),
    );
  });
  log(
    chalk.white(
      emoji.emojify(
        `:threeoclock: Newly Deprecated (${Object.keys(result.deprecated).length})`,
      ),
    ),
  );
  Object.keys(result.deprecated).forEach((token) => {
    log(
      indent(
        chalk.yellow(`"${token}"`) +
          chalk.white(": ") +
          chalk.yellow(`"${token["deprecated_comment"]}"`),
        0,
      ),
    );
  });
  log(
    chalk.white(
      emoji.emojify(
        `:alarmclock: Newly "Un-deprecated" (${Object.keys(result.reverted).length})`,
      ),
    ),
  );
  Object.keys(result.reverted).forEach((token) => {
    log(indent(chalk.yellow(`"${token}"`), 0));
  });
  log(
    chalk.white(
      emoji.emojify(`:uptick: Added (${Object.keys(result.added).length})`),
    ),
  );
  Object.keys(result.added).forEach((token) => {
    log(indent(chalk.green(`"${token}"`), 0));
  });
  log(
    chalk.white(
      emoji.emojify(
        `:downtick: Deleted (${Object.keys(result.deleted).length})`,
      ),
    ),
  );
  Object.keys(result.deleted).forEach((token) => {
    log(indent(chalk.red(`"${token}"`), 0));
  });
  log(
    chalk.white(
      emoji.emojify(`:new: Updated (${Object.keys(result.updated).length})`),
    ),
  );
  Object.keys(result.updated).forEach((token) => {
    const originalToken =
      original[token] === undefined
        ? original[renamed[token]["old-name"]]
        : original[token]; // if the token was renamed and updated, need to look in renamed to get token's old name
    log(indent(chalk.yellow(`"${token}"`), 0));
    Object.keys(result.updated[token]).forEach((key) => {
      if (Object.keys(key).length > 0) {
        const properties = getNestedKeys(result.updated[token], "");
        log(indent(chalk.yellow(properties), 1));
        log(
          indent(
            chalk.white(`"${originalToken.properties}" -> `) +
              chalk.yellow(`"${result.updated[token][key]}"`, 2),
          ),
        );
      } else {
        log(indent(chalk.yellow(key), 1));
        log(
          indent(
            chalk.white(`"${originalToken[key]}" -> `) +
              chalk.yellow(`"${result.updated[token][key]}"`, 2),
          ),
        );
      }
    });
  });
  return 0;
}

function getNestedKeys(token, properties) {
  if (Object.keys(token).length == 0) {
    return properties;
  }
  Object.keys(token).forEach((property) => {
    properties += property;
    return getNestedKeys(token[property], properties);
  });
}
