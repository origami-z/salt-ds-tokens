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
import * as emoji from "node-emoji";

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
    try {
      const [originalFile, updatedFile] = await Promise.all([
        fileImport(original),
        fileImport(updated),
      ]);
      const result = tokenDiff(originalFile, updatedFile);
      cliCheck(originalFile, result);
    } catch (e) {
      console.error(chalk.red("\n" + e + "\n"));
    }
  });

program.parse(process.argv);

/**
 * Formatting helper function for indentation
 * @param {object} text - the string that needs to be indented
 * @param {object} amount - the amount of indents (x3 spaces each indent)
 * @returns {object} indented string
 */
function indent(text, amount) {
  const str = `\n${"   ".repeat(amount)}${text}`;
  return str.replace(/{|}/g, "");
}

/**
 * Checks for previously deprecated tokens whose deprecated status is removed and asks
 * the user if that is intended
 * @param {object} originalFile - the original token
 * @param {object} result - the updated token report
 */
async function cliCheck(originalFile, result) {
  const log = console.log;
  if (Object.keys(result.reverted).length > 0) {
    log("\n");
    log(
      chalk.white(
        emoji.emojify(
          `:alarm_clock: Newly "Un-deprecated" (${Object.keys(result.reverted).length})`,
        ),
      ),
    );
    Object.keys(result.reverted).forEach((token) => {
      log(indent(chalk.yellow(`"${token}"`), 1));
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
          return printReport(originalFile, result, log);
        } else {
          log(
            chalk.yellow(
              emoji.emojify(
                "\n:+1: Cool, closing diff generator CLI, see you next time!\n",
              ),
            ),
          );
          return 1;
        }
      });
  } else {
    return printReport(originalFile, result, log);
  }
}

/**
 * Formats and prints the report
 * @param {object} original - the original token
 * @param {object} result - the updated token report
 * @param {object} log - console.log object used in previous function (don't really need this, but decided to continue using same variable)
 * @returns {int} exit code
 */
function printReport(original, result, log) {
  try {
    const totalTokens =
      Object.keys(result.renamed).length +
      Object.keys(result.deprecated).length +
      Object.keys(result.reverted).length +
      Object.keys(result.added).length +
      Object.keys(result.deleted).length +
      Object.keys(result.updated).length;
    log(chalk.white("\n**Tokens Changed (" + totalTokens + ")**"));
    log(
      chalk.white(
        "-------------------------------------------------------------------------------------------",
      ),
    );
    log("\n");
    log(
      chalk.white(
        emoji.emojify(`:memo: Renamed (${Object.keys(result.renamed).length})`),
      ),
    );
    Object.keys(result.renamed).forEach((token) => {
      const str =
        chalk.white(`"${result.renamed[token]["old-name"]}" -> `) +
        chalk.yellow(`"${token}"`);
      log(indent(str, 1));
    });
    log("\n");
    log(
      chalk.white(
        emoji.emojify(
          `:clock3: Newly Deprecated (${Object.keys(result.deprecated).length})`,
        ),
      ),
    );
    Object.keys(result.deprecated).forEach((token) => {
      log(
        indent(
          chalk.yellow(`"${token}"`) +
            chalk.white(": ") +
            chalk.yellow(`"${result.deprecated[token]["deprecated_comment"]}"`),
          1,
        ),
      );
    });
    log("\n");
    log(
      chalk.white(
        emoji.emojify(
          `:alarm_clock: Newly "Un-deprecated" (${Object.keys(result.reverted).length})`,
        ),
      ),
    );
    Object.keys(result.reverted).forEach((token) => {
      log(indent(chalk.yellow(`"${token}"`), 1));
    });
    log("\n");
    log(
      chalk.white(
        emoji.emojify(
          `:arrow_up_small: Added (${Object.keys(result.added).length})`,
        ),
      ),
    );
    Object.keys(result.added).forEach((token) => {
      log(indent(chalk.green(`"${token}"`), 1));
    });
    log("\n");
    log(
      chalk.white(
        emoji.emojify(
          `:arrow_down_small: Deleted (${Object.keys(result.deleted).length})`,
        ),
      ),
    );
    Object.keys(result.deleted).forEach((token) => {
      log(indent(chalk.red(`"${token}"`), 1));
    });
    log("\n");
    log(
      chalk.white(
        emoji.emojify(`:new: Updated (${Object.keys(result.updated).length})`),
      ),
    );
    Object.keys(result.updated).forEach((token) => {
      const originalToken =
        original[token] === undefined
          ? original[renamed[token]["old-name"]] // if the token was renamed and updated, need to look in renamed to get token's old name
          : original[token];
      log(indent(chalk.yellow(`"${token}"`), 1));
      printNestedChanges(result.updated[token], "", originalToken, log);
    });
    log("\n"); // adding a space at the very end of report to make it look nicer
  } catch {
    return console.error(
      chalk.red(
        new Error(
          `either could not format and print the result or failed along the way\n`,
        ),
      ),
    );
  }
  return 0;
}

/**
 * Traverse through the updated token's keys and prints a simple changelog
 * @param {object} token - the updated token
 * @param {object} properties - a string containing the keys traversed through until intended value, separated by periods (i.e. sets.light.value)
 * @param {object} originalToken - the original token
 * @param {object} log - the console.log object used
 */
function printNestedChanges(token, properties, originalToken, log) {
  if (typeof token !== "object" || token === null) {
    log(indent(chalk.yellow(properties.substring(1)), 2));
    if (properties.substring(1) === "$schema") {
      const newValue = token.split("/");
      const str =
        indent(chalk.white(`"${originalToken}" -> \n`), 3) +
        indent(
          chalk.white(
            `"${token.substring(0, token.length - newValue[newValue.length - 1].length)}`,
          ) +
            chalk.yellow(
              `${newValue[newValue.length - 1].split(".")[0]}` +
                chalk.white(`.${newValue[newValue.length - 1].split(".")[1]}"`),
            ),
          3,
        );
      log(str);
    } else {
      log(
        indent(
          chalk.white(`"${originalToken}" -> `) + chalk.yellow(`"${token}"`),
          3,
        ),
      );
    }
    return;
  }
  Object.keys(token).forEach((property) => {
    const nextProperties = properties + "." + property;
    printNestedChanges(
      token[property],
      nextProperties,
      originalToken[property],
      log,
    );
  });
}
