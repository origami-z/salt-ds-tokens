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

/**
 * Detects newly deprecated tokens in the diff
 * @param {object} changes - the changed token data
 * @returns {object} deprecatedTokens - a JSON object containing the newly deprecated tokens
 */
export default function detectDeprecatedTokens(renamed, changes) {
  const result = {
    deprecated: {},
    reverted: {},
  };
  const deprecatedTokens = changes.added;
  const possibleMistakenRevert = changes.deleted;
  Object.keys(deprecatedTokens).forEach((token) => {
    if (token !== undefined && !deprecatedTokens[token].deprecated) {
      delete deprecatedTokens[token];
    }
  });
  Object.keys(possibleMistakenRevert).forEach((token) => {
    if (possibleMistakenRevert[token] === undefined) {
      delete possibleMistakenRevert[token];
    }
  });
  renamed.forEach((name) => {
    Object.keys(deprecatedTokens).forEach((token) => {
      if (name["newname"] === token) {
        delete deprecatedTokens[token];
      }
    });
  });
  Object.keys(deprecatedTokens).forEach((token) => {
    result.deprecated[token] = deprecatedTokens[token];
  });
  Object.keys(possibleMistakenRevert).forEach((token) => {
    result.reverted[token] = possibleMistakenRevert[token];
  });
  return result;
}
