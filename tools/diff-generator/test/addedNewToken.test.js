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
import originalSeveral from "./test-schemas/several-original-tokens.json" with { type: "json" };
import updatedSeveral from "./test-schemas/several-added-tokens.json" with { type: "json" };
import originalEntireSchema from "./test-schemas/entire-schema.json" with { type: "json" };
import addedRenamedTokens from "./test-schemas/added-renamed-tokens.json" with { type: "json" };

const expected = {
  "swatch-border-opacity": {
    component: "swatch",
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/alias.json",
    value: "{gray-900}",
    uuid: "0e397a80-cf33-44ed-8b7d-1abaf4426bf5",
  },
};

const expected1 = {
  "focus-indicator-color": {
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/alias.json",
    value: "{blue-800}",
    uuid: "fe914904-a368-414b-a4ac-21c0b0340d05",
  },
  "static-white-focus-indicator-color": {
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/alias.json",
    value: "{white}",
    uuid: "1dd6dc5b-47a2-41eb-80fc-f06293ae8e13",
  },
  "static-black-focus-indicator-color": {
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/alias.json",
    value: "{black}",
    uuid: "c6b8275b-f44e-43b4-b763-82dda94d963c",
  },
  "overlay-color": {
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/alias.json",
    value: "{black}",
    uuid: "af66daa6-9e52-4e68-a605-86d1de4ee971",
  },
};

const expected2 = {
  "i-like-pizza": {
    component: "table",
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/opacity.json",
    value: "0.07",
    uuid: "1234",
  },
  "hi-how-are-you": {
    component: "color-handle",
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/opacity.json",
    value: "0.42",
    uuid: "234",
  },
};

test.skip("basic test to see if new token was added", (t) => {
  t.deepEqual(tokenDiff(original, updated), expected);
});

test.skip("several tokens in each schema test to see if new token was added", (t) => {
  t.deepEqual(tokenDiff(originalSeveral, updatedSeveral), expected1);
});

test.skip("adding several new and renamed tokens test", (t) => {
  t.deepEqual(tokenDiff(originalEntireSchema, addedRenamedTokens), expected2);
});
