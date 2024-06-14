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
import nixt from "nixt";
import fs from "fs";

const path =
  "/Users/shirleyli/Spectrum/spectrum-tokens/tools/diff-generator/test/";

// test("checking directory name", async (t) => {
//     nixt()
//     .run('pwd')
//     .expect((result) => {
//         console.log(result);
//     })
//     .end(t.end);
//     t.pass();
// });

test("cli should return correct version number", async (t) => {
  t.plan(1);
  return new Promise((resolve, reject) => {
    try {
      nixt()
        .expect((result) => {
          t.is(result.stdout, "0.1.0"); // TODO: fix this to read from package.json for assertion.
        })
        .run("pnpm tdiff --version")
        .end(resolve);
    } catch (error) {
      reject(error);
    }
  });
});

test("check cli output for simple diff", async (t) => {
  console.log("at top: ", `${path}test-schemas/entire-schema.json`);
  console.log(
    "at top: ",
    `${path}test-schemas/renamed-added-deleted-deprecated-updated-reverted-tokens.json`,
  );
  const value = await nixt()
    .expect((result) => {
      console.log(result);
      console.log(path);
      const expected = fs.readFileSync(
        `${path}test-cli-outputs/expected-all-tokens.txt`,
      );
      console.log(expected);
      t.is(result, expected);
    })
    .run(
      `tdiff report ${path}test-schemas/entire-schema.json ${path}test-schemas/renamed-added-deleted-deprecated-updated-reverted-tokens.json`,
    )
    .end(t.end);
  t.true(value);
});
