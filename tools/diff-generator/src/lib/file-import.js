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
import { existsSync } from "fs";
import path from "path";

const source = "https://raw.githubusercontent.com/adobe/spectrum-tokens/";

/**
 * Returns file with given file name as a JSON object (took this from diff.js)
 * @param {string} tokenName - the name of the target file
 * @param {string} version - the intended package version (full name)
 * @returns {object} the target file as a JSON object
 */
export default async function fileImport(
  givenTokenNames,
  givenVersion,
  givenLocation,
) {
  const version = givenVersion || "latest";
  const location = givenLocation || "main";
  const result = {};
  const tokenNames =
    givenTokenNames || (await fetchTokens("manifest.json", version, location));
  for (let i = 0; i < tokenNames.length; i++) {
    const tokens = await fetchTokens(tokenNames[i], version, location);
    Object.assign(result, tokens);
  }
  return result;
}

export async function loadLocalData(dirName, givenTokenNames) {
  try {
    const startDir = process.cwd();
    return loadData(dirName, startDir, givenTokenNames);
  } catch (e) {
    console.log(e);
  }
}

async function loadData(dirName, startDir, givenTokenNames) {
  const root = getRootPath(startDir, "pnpm-lock.yaml");
  // just say you have to have packages/tokens
  let path = root.substring(0, root.lastIndexOf("/")) + "/" + dirName;
  let tokenNames = givenTokenNames;
  if (!tokenNames) {
    tokenNames = (
      await readFile(path + "/manifest.json", { encoding: "utf8" })
    ).split("\n");
    tokenNames = tokenNames.slice(1, tokenNames.length - 2);
  }
  let result = {};
  for (let i = 0; i < tokenNames.length; i++) {
    const tokenPath =
      path + "/" + tokenNames[i].trim().replaceAll('"', "").replace(",", "");
    await access(tokenPath);
    const temp = JSON.parse(await readFile(tokenPath, { encoding: "utf8" }));
    Object.assign(result, temp);
  }
  return result;
}

function getRootPath(startDir, targetDir) {
  let curDir = startDir;
  while (existsSync(curDir)) {
    const curDirPath = path.join(curDir, targetDir);
    if (existsSync(curDirPath)) {
      return curDirPath;
    }
    const parentDir = path.dirname(curDir);
    if (parentDir === curDir) {
      return null;
    }
    curDir = parentDir;
  }
}

async function fetchTokens(tokenName, version, location) {
  const link =
    version !== "latest"
      ? source + version.replace("@", "%40")
      : source + location;
  return (await fetch(`${link}/packages/tokens/${tokenName}`))
    .json()
    .then((tokens) => {
      return tokens;
    })
    .catch((e) => {
      console.log(e);
    });
}
