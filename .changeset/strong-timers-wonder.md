---
"@adobe/token-diff-generator": minor
---

Format and output command line options added.

```
Options:
  -otv, --old-token-version <oldVersion>  indicates which github tag to pull old tokens from
  -ntv, --new-token-version <newVersion>  indicates which github tag to pull new tokens from
  -otb, --old-token-branch <oldBranch>    indicates which branch to fetch old token data from
  -ntb, --new-token-branch <newBranch>    indicates which branch to fetch updated token data from
  -tn, --token-names <tokens...>          indicates specific tokens to compare
  -l, --local <path>                      indicates to compare to local data
  -r, --repo <name>                       github repository to target
  -gak, --githubAPIKey <key>              github api key to use
  -f, --format <format>                   cli (default) or markdown
  -o, --output <path>                     file path to store diff output
  -d, --debug <path>                      file path to store diff json
  -h, --help                              display help for command
```
