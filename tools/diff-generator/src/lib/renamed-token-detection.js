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
 * Check if a change is a rename by comparing the tokens' UUIDs
 * @param {object} original - the original token data
 * @param {object} changes - the changed token data
 * @returns {object} renamed - an array containing the renamed tokens
 */
export default function detectRenamedTokens(original, changesOriginal) {
  const renamed = [];
  const changes = { ...changesOriginal };
  const func = (renamed, originalToken, change) => {
    renamed.push({
      oldname: originalToken,
      newname: change,
    });
  };

  Object.keys(changes).forEach((change) => {
    Object.keys(original).forEach((originalToken) => {
      if (
        original[originalToken].uuid === changes[change].uuid &&
        originalToken !== change
      ) {
        func(renamed, originalToken, change);
      }
    });
  });
  return renamed;
}
