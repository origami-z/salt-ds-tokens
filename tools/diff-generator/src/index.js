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

  Object.keys(changes).forEach((change) => {
    Object.keys(original).forEach((originalToken) => {
      if (original[originalToken].uuid === changes[change].uuid) {
        renamed.push({
          oldname: originalToken,
          newname: change,
        });
      }
    });
  });

  // renamed.forEach(schema => {
  //   console.log(schema);
  // });
  return renamed; // CLI Output For 1 Token: "oldname" -> "newname"
}
