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
import updatedToken from "./test-schemas/basic-updated-token.json" with { type: "json" };
import updatedSeveralProperties from "./test-schemas/basic-multiple-updated-token.json" with { type: "json" };
import tokenWithSet from "./test-schemas/basic-token-set.json" with { type: "json" };
import tokenWithUpdatedSet from "./test-schemas/basic-token-updated-set.json" with { type: "json" };

const expected = {
  "swatch-border-color": {
    value: "{blue-200}",
  },
};

const expectedUpdatedSeveralProperties = {
  "swatch-border-color": {
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/color.json",
    value: "{blue-200}",
  },
};

const expectedUpdatedSet = {
  "overlay-opacity": {
    sets: {
      light: {
        $schema:
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/color.json",
        value: "0.4",
        uuid: "26b9803c-577f-4a29-badd-dfc459e8b73e",
      },
      dark: {
        $schema:
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/opacity.json",
        value: "0.5",
        uuid: "df41eb51-872f-458d-9439-910064f74b7b",
      },
      darkest: {
        $schema:
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/opacity.json",
        value: "0.8",
        uuid: "31d5b502-6266-4309-8f8a-3892e6e158da",
      },
      wireframe: {
        $schema:
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/wireframe.json",
        value: "0",
        uuid: "93b904da-5d1f-4fd9-aa26-5aabe19df108",
      },
    },
  },
};

const expectedAddedDeprecated = {
  "i-like-mochi": {
    deprecated: true,
    deprecated_comment: "insert random deprecated comment",
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/alias.json",
    value: "{blue-800}",
    uuid: "4567",
  },
  "i-like-burgers": {
    deprecated: true,
    deprecated_comment: "insert random deprecated comment",
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/alias.json",
    value: "{blue-800}",
    uuid: "1234",
  },
};

test.skip("basic test to check if updated token is detected", (t) => {
  t.deepEqual(tokenDiff(original, updatedToken), expected);
});

test.skip("updated more than one property of a token", (t) => {
  t.deepEqual(
    tokenDiff(original, updatedSeveralProperties),
    expectedUpdatedSeveralProperties,
  );
});

test.skip("testing token with updates to its set property", (t) => {
  t.deepEqual(tokenDiff(tokenWithSet, tokenWithUpdatedSet), expectedUpdatedSet);
});
