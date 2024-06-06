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
import checkIfRenamed from "./lib/renamed-token-detection.js";
import detectNewTokens from "./lib/added-token-detection.js";
import detectDeletedTokens from "./lib/deleted-token-detection.js";
import detectDeprecatedTokens from "./lib/deprecated-token-detection.js";
import detectUpdatedTokens from "./lib/updated-token-detection.js";

/**
 * @param {object} original - token data to compare against
 * @param {object} updated - updated token data
 * @return {object} new tokens, newly deprecated tokens, deleted tokens, updated values, renamed, updated type.
 */
export default function tokenDiff(original, updated) {
  const changes = detailedDiff(original, updated);
  const renamed = checkIfRenamed(original, changes.added); // don't need to check deleted since added will include all renamed schema
  const newTokens = detectNewTokens(renamed, changes.added);
  // console.log(changes);
  const deprecatedTokens = detectDeprecatedTokens(changes.added);
  const deletedTokens = detectDeletedTokens(renamed, changes.deleted);
  const updatedTokens = detectUpdatedTokens();
  // formatResult(changes, newTokens, renamed);
  // probably make a json object with renamed, newTokens, etc. and return that?
  return;
}

// function formatResult(changes, addedTokens, deprecatedTokens, deletedTokens, updatedValues, renamedTokens, updatedTypes) {
function formatResult(changes, addedTokens, renamedTokens) {
  // go through each of these and append the json tokens
  const resultJSON = {};
  resultJSON["added"] = addedTokens.forEach((token) => {
    console.log(token);
    resultJSON["added"][token] = token;
  });
  console.log(resultJSON);
  resultJSON["renamed"] = renamedTokens.forEach((token) => {
    resultJSON["renamed"][token] = changes[token];
  });
  return resultJSON;
}
