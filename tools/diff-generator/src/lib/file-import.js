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
import { access, readFile } from "fs/promises";
import tmp from "tmp-promise";
import { exec } from "node:child_process";
import { promisify } from "util";
import { x } from "tar";
import { join } from "path";

const execP = promisify(exec);

/**
 * Returns file with given file name as a JSON object (took this from diff.js)
 * @param {string} tokenName - the name of the target file
 * @param {string} version - the intended package version
 * @returns {object} the target file as a JSON object
 */
export default async function fileImport(tokenName, version, location) {
  try {
    return fetchTokens(tokenName, version, location);
  } catch {
    throw new Error(`Invalid file name "${tokenName}"`);
  }
}

export async function fetchTokens(tokenName, givenVersion, location) {
  // took a lot of code from what Garth wrote in diff.js
  const tmpDir = await tmp.dir();
  const version = givenVersion || "latest";
  let curTokenPath = tokenName;
  if (
    location === "npm" ||
    (location !== undefined && location.includes("@adobe/spectrum-tokens")) ||
    version === "latest"
  ) {
    // gets tokens from specified npm package or github tag
    // const { stdout, stderr } = await execP(
    //   `npm pack @adobe/spectrum-tokens@${version} --pack-destination ${tmpDir.path}`,
    // );
    // await x({
    //   cwd: tmpDir.path,
    //   file: join(tmpDir.path, stdout.trim()),
    // });
    // curTokenPath = join(tmpDir.path, "package", tokenName);
    await access(curTokenPath);
    return JSON.parse(await readFile(curTokenPath, { encoding: "utf8" }));
  } else {
    // gets tokens from specified branch (location)
    return (
      await fetch(
        `https://raw.githubusercontent.com/adobe/spectrum-tokens/${location}/packages/tokens/src/${tokenName}`,
      )
    )
      .json()
      .then((tokens) => {
        return tokens;
      })
      .catch((e) => {
        reject(e);
      });
  }
}

/**
 * I'm currently working on fetching tokens from npm (to take a break from writing tests lol) and was wondering how exactly do you get the pack destination?

I referenced your code in diff.js so I tried using tmpDir.path from const tmpDir = await tmp.dir(); but I end up getting Error: ENOENT: no such file or directory, access '/var/folders/qr/qc0343sn2w5br6rls58p23mw0000gq/T/tmp-29969-sJgVacTGH1F8/package/color-component.json'. Is this because this function's directory is within diff-generator, not packages/tokens?
 */
