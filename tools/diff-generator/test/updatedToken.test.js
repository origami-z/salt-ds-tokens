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
import detectUpdatedTokens from "../src/lib/updated-token-detection.js";
import detectRenamedTokens from "../src/lib/renamed-token-detection.js";
import detectNewTokens from "../src/lib/added-token-detection.js";
import detectDeprecatedTokens from "../src/lib/deprecated-token-detection.js";
import detectDeletedTokens from "../src/lib/deleted-token-detection.js";
import { detailedDiff } from "deep-object-diff";
import original from "./test-schemas/basic-original-token.json" with { type: "json" };
import updatedToken from "./test-schemas/basic-updated-token.json" with { type: "json" };
import updatedSeveralProperties from "./test-schemas/basic-multiple-updated-token.json" with { type: "json" };
import tokenWithSet from "./test-schemas/basic-set-token.json" with { type: "json" };
import tokenWithUpdatedSet from "./test-schemas/basic-updated-set-token.json" with { type: "json" };
import severalSetTokens from "./test-schemas/several-set-tokens.json" with { type: "json" };
import severalUpdatedSetTokens from "./test-schemas/several-updated-set-tokens.json" with { type: "json" };
import severalRenamedUpdatedSetTokens from "./test-schemas/several-renamed-updated-set-tokens.json" with { type: "json" };
import basicSetTokenProperty from "./test-schemas/basic-set-token-property.json" with { type: "json" };
import addedPropertySetToken from "./test-schemas/added-property-set-token.json" with { type: "json" };

const expected = {
  "swatch-border-color": { value: "{blue-200}" },
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
      darkest: {
        value: "0.8",
      },
      light: {
        $schema:
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/color.json",
      },
      wireframe: {
        $schema:
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/wireframe.json",
        value: "0",
      },
    },
  },
};

const expectedSeveralUpdatedSet = {
  "help-text-top-to-workflow-icon-medium": {
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/token-set.json",
    sets: {
      desktop: {
        $schema:
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/changing-two-schemas.json",
      },
      mobile: {
        value: "9px",
      },
    },
  },
  "status-light-top-to-dot-large": {
    sets: {
      desktop: {
        value: "20px",
      },
    },
  },
};

const expectedUpdatedSetWithRename = {
  "help-text-top-to-workflow-icon-medium": {
    sets: {
      desktop: {
        value: "7px",
      },
    },
  },
  "i-like-fish-tacos": {
    $schema:
      "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/scaly-fish.json",
    sets: {
      mobile: {
        value: "15px",
      },
    },
  },
};

const expectedAddedProperty = {
  "celery-background-color-default": {
    sets: {
      "random-property": {
        $schema:
          "https://opensource.adobe.com/spectrum-tokens/schemas/token-types/alias.json",
        value: "{spinach-100}",
        uuid: "1234",
      },
    },
  },
};

const expectedDeletedProperty = {
  "celery-background-color-default": {
    sets: {
      "random-property": undefined,
    },
  },
};

test("basic test to check if updated token is detected", (t) => {
  const diff = detailedDiff(original, updatedToken);
  const renamed = detectRenamedTokens(original, updatedToken);
  const deprecated = detectDeprecatedTokens(renamed, diff);
  const added = detectNewTokens(renamed, deprecated, diff.added, original);
  const deleted = detectDeletedTokens(renamed, diff.deleted);

  t.deepEqual(
    detectUpdatedTokens(renamed, original, diff, added, deleted),
    expected,
  );
});

test("updated more than one property of a token", (t) => {
  const diff = detailedDiff(original, updatedSeveralProperties);
  const renamed = detectRenamedTokens(original, updatedSeveralProperties);
  const deprecated = detectDeprecatedTokens(renamed, diff);
  const added = detectNewTokens(renamed, deprecated, diff.added, original);
  const deleted = detectDeletedTokens(renamed, diff.deleted);

  t.deepEqual(
    detectUpdatedTokens(renamed, original, diff, added, deleted),
    expectedUpdatedSeveralProperties,
  );
});

test("testing basic token with updates to its set property", (t) => {
  const diff = detailedDiff(tokenWithSet, tokenWithUpdatedSet);
  const renamed = detectRenamedTokens(tokenWithSet, tokenWithUpdatedSet);
  const deprecated = detectDeprecatedTokens(renamed, diff);
  const added = detectNewTokens(renamed, deprecated, diff.added, tokenWithSet);
  const deleted = detectDeletedTokens(renamed, diff.deleted);

  t.deepEqual(
    detectUpdatedTokens(renamed, tokenWithSet, diff, added, deleted),
    expectedUpdatedSet,
  );
});

test("testing several tokens with updates to its set property", (t) => {
  const diff = detailedDiff(severalSetTokens, severalUpdatedSetTokens);
  const renamed = detectRenamedTokens(
    severalSetTokens,
    severalUpdatedSetTokens,
  );
  const deprecated = detectDeprecatedTokens(renamed, diff);
  const added = detectNewTokens(
    renamed,
    deprecated,
    diff.added,
    severalSetTokens,
  );
  const deleted = detectDeletedTokens(renamed, diff.deleted);

  t.deepEqual(
    detectUpdatedTokens(renamed, severalSetTokens, diff, added, deleted),
    expectedSeveralUpdatedSet,
  );
});

test("testing several tokens with updates to its set property and renames", (t) => {
  const diff = detailedDiff(severalSetTokens, severalRenamedUpdatedSetTokens);
  const renamed = detectRenamedTokens(
    severalSetTokens,
    severalRenamedUpdatedSetTokens,
  );
  const deprecated = detectDeprecatedTokens(renamed, diff);
  const added = detectNewTokens(
    renamed,
    deprecated,
    diff.added,
    severalSetTokens,
  );
  const deleted = detectDeletedTokens(renamed, diff.deleted);

  t.deepEqual(
    detectUpdatedTokens(renamed, severalSetTokens, diff, added, deleted),
    expectedUpdatedSetWithRename,
  );
});

test("testing adding a property to a token with sets", (t) => {
  const diff = detailedDiff(basicSetTokenProperty, addedPropertySetToken);
  const renamed = detectRenamedTokens(
    basicSetTokenProperty,
    addedPropertySetToken,
  );
  const deprecated = detectDeprecatedTokens(renamed, diff);
  const added = detectNewTokens(
    renamed,
    deprecated,
    diff.added,
    basicSetTokenProperty,
  );
  const deleted = detectDeletedTokens(renamed, diff.deleted);

  t.deepEqual(
    detectUpdatedTokens(renamed, basicSetTokenProperty, diff, added, deleted),
    expectedAddedProperty,
  );
});

test("testing deleting a property to a token with sets", (t) => {
  const diff = detailedDiff(addedPropertySetToken, basicSetTokenProperty);
  const renamed = detectRenamedTokens(
    addedPropertySetToken,
    basicSetTokenProperty,
  );
  const deprecated = detectDeprecatedTokens(renamed, diff);
  const added = detectNewTokens(
    renamed,
    deprecated,
    diff.added,
    addedPropertySetToken,
  );
  const deleted = detectDeletedTokens(renamed, diff.deleted);
  t.deepEqual(
    detectUpdatedTokens(renamed, addedPropertySetToken, diff, added, deleted),
    expectedDeletedProperty,
  );
});
