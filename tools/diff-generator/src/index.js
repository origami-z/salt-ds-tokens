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
  const newTokens = detectNewTokens(original, changes.added);
  return renamed;
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

  // renamed.forEach(schema => {
  //   console.log(schema);
  // });
  return loopThrough(original, changes, renamed, func); // CLI Output For 1 Token: "oldname" -> "newname"
}

/**
 * Check if the added token's uuid exists in the original schema
 * @param {object} original - the original token data
 * @param {object} changes - the changed token data
 * @returns {object} addedTokens - an array containing the added tokens
 */
function detectNewTokens(original, changes) {
  // new tokens are tokens whose uuids don't exist in the original schema
  const addedTokens = [];
  Object.keys(changes).forEach((change) => {
    addedTokens.push(change);
  });

  const func = (addedTokens, change) => {
    return addedTokens.filter((token) => {
      return token !== change;
    });
  };

  return loopThrough(original, changes, addedTokens, func);
}

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
