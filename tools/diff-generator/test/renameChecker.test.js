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

const macro = test.macro((t, original, updated, expected) => {
  t.is(eval(original, updated), expected);
});

const original = {
  "swatch-border-color": {
    component: "swatch",
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/alias.json",
    value: "{gray-900}",
    uuid: "7da5157d-7f25-405b-8de0-f3669565fb48",
  },
};
const updated = {
  "hello-world": {
    component: "swatch",
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/alias.json",
    value: "{gray-900}",
    uuid: "7da5157d-7f25-405b-8de0-f3669565fb48",
  },
};
const expected = {
  oldname: "swatch-border-color",
  newname: "hello-world",
};

test(
  "basic test to see if diff catches rename",
  macro,
  original,
  updated,
  expected,
);
// I want to test it with the most basic diff, but I'm not sure how to run these inputs into index.js
// Checked the documentation and this seems to be how you do it? https://github.com/avajs/ava/blob/main/docs/01-writing-tests.md
