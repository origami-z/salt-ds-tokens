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
import updated from "./test-schemas/basic-renamed-token.json" with { type: "json" };
import originalTwoOrMore from "./test-schemas/several-original-tokens.json" with { type: "json" };
import updatedTwoOrMore from "./test-schemas/several-renamed-tokens.json" with { type: "json" };
import originalEntireSchema from "./test-schemas/entire-schema.json" with { type: "json" };
import updatedEntireSchema from "./test-schemas/entire-schema-renamed.json" with { type: "json" };

const expected = [
  {
    oldname: "swatch-border-color",
    newname: "hello-world",
  },
];

const expected1 = [
  {
    oldname: "swatch-border-color",
    newname: "swatch-color",
  },
  {
    oldname: "swatch-border-opacity",
    newname: "swatch-opacity",
  },
];

const expected2 = [
  {
    oldname: "swatch-border-opacity",
    newname: "swatch-opacity",
  },
  {
    oldname: "swatch-disabled-icon-border-color",
    newname: "swatch-disabled-border-color",
  },
  {
    oldname: "table-row-hover-color",
    newname: "table-col-hover-color",
  },
  {
    oldname: "table-row-hover-opacity",
    newname: "table-col-hover-opacity",
  },
  {
    oldname: "table-selected-row-background-opacity-non-emphasized",
    newname: "table-selected-row-background-opacity-definitely-emphasized",
  },
  {
    oldname: "table-selected-row-background-opacity-non-emphasized-hover",
    newname: "table-selected-row-background-opacity-ultra-emphasized-hover",
  },
];

test("basic test to see if diff catches rename", (t) => {
  t.deepEqual(tokenDiff(original, updated), expected);
});

test("several tokens in each schema test to see if diff catches rename", (t) => {
  t.deepEqual(tokenDiff(originalTwoOrMore, updatedTwoOrMore), expected1);
});

test("existing schema test to see if diff catches rename", (t) => {
  t.deepEqual(tokenDiff(originalEntireSchema, updatedEntireSchema), expected2);
});
