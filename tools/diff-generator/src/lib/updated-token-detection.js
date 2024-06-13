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
 * Detects updates made to tokens
 * @param {object} renamed - a list containing tokens that were renamed
 * @param {object} original - the original token data
 * @param {object} changes - the changed token data
 * @returns {object} updatedTokens - a JSON object containing the updated tokens (with new name, if renamed)
 */
export default function detectUpdatedTokens(
  renamed,
  original,
  changes,
  newTokens,
  deletedTokens,
) {
  const updatedTokens = { ...changes.updated };
  Object.keys(changes.added).forEach((token) => {
    if (renamed[token] !== undefined) {
      const tokenDiff = detailedDiff(
        original[renamed[token]["old-name"]],
        changes.added[token],
      ).updated;
      if (Object.keys(tokenDiff).length !== 0) {
        updatedTokens[token] = tokenDiff;
      }
    } else if (
      newTokens[token] !== undefined &&
      original[token] !== undefined
    ) {
      console.log(newTokens[token]);
      updatedTokens[token] = newTokens[token];
    }
  });
  Object.keys(deletedTokens).forEach((token) => {
    if (deletedTokens[token] !== undefined) {
      updatedTokens[token] = deletedTokens[token];
    }
  });
  return updatedTokens;
}
