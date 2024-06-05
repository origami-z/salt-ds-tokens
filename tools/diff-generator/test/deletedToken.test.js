/*
Copyright {{ now() | date(format="%Y") }} Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import test from "ava";
import detectDeletedTokens from "../src/lib/deleted-token-detection.js";
import updated from "./test-schemas/basic-original-token.json" with { type: "json" };
import original from "./test-schemas/new-token.json" with { type: "json" };
import renamedBasic from "./test-schemas/basic-renamed-token.json" with { type: "json" };
import { detailedDiff } from "deep-object-diff";
import checkIfRenamed from "../src/lib/renamed-token-detection.js";

const expectedOneDeleted = {
  "swatch-border-opacity": undefined,
};

const expectedRenamedNotDeleted = {};

test("basic test to see if token was deleted", (t) => {
  t.deepEqual(
    detectDeletedTokens(
      checkIfRenamed(original, updated),
      detailedDiff(original, updated).deleted,
    ),
    expectedOneDeleted,
  );
});

test("checking if renamed tokens are mistakenly marked as deleted", (t) => {
  t.deepEqual(
    detectDeletedTokens(
      checkIfRenamed(renamedBasic, updated),
      detailedDiff(renamedBasic, updated).deleted,
    ),
    expectedRenamedNotDeleted,
  );
});

test("checking if renamed tokens are mistakenly marked as deleted (same as above but swapped schema)", (t) => {
  t.deepEqual(
    detectDeletedTokens(
      checkIfRenamed(updated, renamedBasic),
      detailedDiff(updated, renamedBasic).deleted,
    ),
    expectedRenamedNotDeleted,
  );
});
