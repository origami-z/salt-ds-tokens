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
import tokenDiff from "../src/index.js";
import original from "./test-schemas/basic-original-token.json" with { type: "json" };
import updated from "./test-schemas/new-token.json" with { type: "json" };
import renamedBasic from "./test-schemas/basic-renamed-token.json" with { type: "json" };
import originalSeveral from "./test-schemas/several-original-tokens.json" with { type: "json" };
import updatedSeveral from "./test-schemas/several-added-tokens.json" with { type: "json" };
import originalEntireSchema from "./test-schemas/entire-schema.json" with { type: "json" };
import addedRenamedTokens from "./test-schemas/added-renamed-tokens.json" with { type: "json" };

const expected = {
  "swatch-border-opacity": undefined,
};

const expected1 = {};

test("basic test to see if token was deleted", (t) => {
  t.deepEqual(tokenDiff(updated, original), expected);
});

test("checking if renamed tokens are mistakenly marked as deleted", (t) => {
  t.deepEqual(tokenDiff(renamedBasic, original), expected1);
});

test("checking if renamed tokens are mistakenly marked as deleted (same as above but swapped schema)", (t) => {
  t.deepEqual(tokenDiff(original, renamedBasic), expected1);
});
