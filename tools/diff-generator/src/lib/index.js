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
import { detailedDiff } from "deep-object-diff";
import checkIfRenamed from "./renamed-token-detection.js";
import detectNewTokens from "./added-token-detection.js";
import detectDeletedTokens from "./deleted-token-detection.js";
import detectDeprecatedTokens from "./deprecated-token-detection.js";
import detectUpdatedTokens from "./updated-token-detection.js";

/**
 * Token diff generator
 * @param {object} original - token data to compare against
 * @param {object} updated - updated token data
 * @return {object} resultJSON - a JSON object containing the new tokens, newly deprecated tokens, deleted tokens, updated values, renamed, updated type
 */
export default function tokenDiff(original, updated) {
  const changes = detailedDiff(original, updated);
  const renamedTokens = checkIfRenamed(original, changes.added);
  const deprecatedTokens = detectDeprecatedTokens(renamedTokens, changes);
  const newTokens = detectNewTokens(
    renamedTokens,
    deprecatedTokens,
    changes.added,
  );
  const deletedTokens = detectDeletedTokens(renamedTokens, changes.deleted);
  const updatedTokens = detectUpdatedTokens(renamedTokens, original, changes);
  return formatResult(
    changes,
    renamedTokens,
    deprecatedTokens,
    newTokens,
    deletedTokens,
    updatedTokens,
  );
}

/**
 * Formats the results from all the different diff categories
 * @param {object} changes - the changed token data
 * @param {object} renamedTokens -
 * @param {object} deprecatedTokens
 * @param {object} newTokens
 * @param {object} deletedTokens
 * @param {object} updatedTokens
 * @returns {object} resultJSON - a JSON object containing the new tokens, newly deprecated tokens, deleted tokens, updated values, renamed, updated type
 */
function formatResult(
  changes,
  renamedTokens,
  deprecatedTokens,
  newTokens,
  deletedTokens,
  updatedTokens,
) {
  const resultJSON = {
    renamed: {},
    deprecated: {},
    reverted: {},
    added: {},
    deleted: {},
    updated: {},
  };
  Object.keys(renamedTokens).forEach((token) => {
    resultJSON.renamed[renamedTokens[token].newname] = {
      "old-name": renamedTokens[token].oldname,
    };
  });
  Object.keys(deprecatedTokens.deprecated).forEach((token) => {
    resultJSON.deprecated[token] = deprecatedTokens[token];
  });
  Object.keys(deprecatedTokens.reverted).forEach((token) => {
    resultJSON.reverted[token] = deprecatedTokens[token];
  });
  Object.keys(newTokens).forEach((token) => {
    resultJSON.added[token] = newTokens[token];
  });
  Object.keys(deletedTokens).forEach((token) => {
    resultJSON.deleted[token] = deletedTokens[token];
  });
  Object.keys(updatedTokens).forEach((token) => {
    resultJSON.updated = updatedTokens[token];
  });
  return resultJSON;
}
