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

/**
 * Returns file with given file name as a JSON object (took this from diff.js)
 * @param {object} fileName - the name of the target file
 * @returns {object} the target file as a JSON object
 */
export default async function fileImport(fileName) {
  try {
    await access(fileName);
    return JSON.parse(await readFile(fileName, { encoding: "utf8" }));
  } catch {
    throw new Error(`Invalid file name "${fileName}"`);
  }
}
