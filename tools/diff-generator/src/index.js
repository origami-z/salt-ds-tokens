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

/**
 * @param {object} original - token data to compare against
 * @param {object} updated - updated token data
 * @return {object} new tokens, newly deprecated tokens, deleted tokens, updated values, renamed, updated type.
 */
export default function tokenDiff(original, updated) {
  const changes = detailedDiff(original, updated);
  const renamed = checkIfRenamed(original, changes.added); // don't need to check deleted since added will include all renamed schema
  const newTokens = detectNewTokens(renamed, changes.added);
  const deprecatedTokens = detectDeprecatedTokens(changes.added);
  const deletedTokens = detectDeletedTokens(renamed, changes.deleted);
  // formatResult(changes, newTokens, renamed);
  // probably make a json object with renamed, newTokens, etc. and return that?
  return deprecatedTokens;
}

/**
 * Check if a change is a rename by comparing the tokens' UUIDs
 * @param {object} original - the original token data
 * @param {object} changes - the changed token data
 * @returns {object} renamed - an array containing the renamed tokens
 */
function checkIfRenamed(original, changes) {
  const renamed = [];

  const func = (renamed, originalToken, change) => {
    renamed.push({
      oldname: originalToken,
      newname: change,
    });
  };

  return loopThrough(original, changes, renamed, func); // CLI Output For 1 Token: "oldname" -> "newname"
}

/**
 * Check if the added token's uuid exists in renamed and added
 * @param {object} renamed - the token data that were renamed
 * @param {object} changes - the changed token data
 * @returns {object} addedTokens - a JSON object containing the added tokens
 */
function detectNewTokens(renamed, changes) {
  const addedTokens = changes;
  if (renamed.length > 0) {
    Object.keys(changes).forEach((token) => {
      renamed.forEach((item) => {
        if (item["newname"] == token) {
          delete addedTokens[token];
        }
      });
    });
  }

  return addedTokens;
}

/**
 * Detects deleted tokens
 * @param {object} renamed - the renamed tokens (can be none)
 * @param {object} changes - the deleted tokens detected by deep-boject-diff
 * @returns {object} deletedTokens - the tokens that were deleted, but not renamed
 */
function detectDeletedTokens(renamed, changes) {
  const deletedTokens = changes;

  if (renamed.length > 0) {
    Object.keys(changes).forEach((token) => {
      renamed.forEach((item) => {
        if (item["oldname"] === token) {
          delete deletedTokens[token];
        }
      });
    });
  }

  return deletedTokens;
}

/**
 * Detects newly deprecated tokens in the diff
 * @param {object} changes - the changed token data
 * @returns {object} deprecatedTokens - a JSON object containing the newly deprecated tokens
 */
function detectDeprecatedTokens(changes) {
  const deprecatedTokens = changes;

  Object.keys(deprecatedTokens).forEach((token) => {
    if (token !== undefined) {
      if (!deprecatedTokens[token].deprecated) {
        delete deprecatedTokens[token];
      }
    }
  });

  return deprecatedTokens;
}

// how to check updated values and type?

/**
 * Helper function for looping through due to repetitiveness
 * @param {object} original - the original token data
 * @param {object} changes - the changed token data
 * @param {object} list - the list that will contain the resulting tokens of whichever category
 * @param {object} func - the function that determines which category of tokens is returned
 * @returns list - the list that will contain the resulting tokens of whichever category
 */
function loopThrough(original, changes, list, func) {
  Object.keys(changes).forEach((change) => {
    Object.keys(original).forEach((originalToken) => {
      if (original[originalToken].uuid === changes[change].uuid) {
        func(list, originalToken, change);
      }
    });
  });
  return list;
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
