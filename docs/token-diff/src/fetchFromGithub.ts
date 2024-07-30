import { githubAPIKey } from '../github-api-key.js';

export async function fetchBranchTagOptions(type: string) {
  const url =
    type === 'branch'
      ? 'https://api.github.com/repos/adobe/spectrum-tokens/branches'
      : 'https://api.github.com/repos/adobe/spectrum-tokens/releases';
  return await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `token ${githubAPIKey}`,
    },
  }).then(async response => {
    const arr: any[] | PromiseLike<any[]> = [];
    const obj = await response.json();
    Object.values(obj).forEach((value: any) => {
      arr.push(value.name);
    });
    return arr;
  });
}

export async function fetchSchemaOptions(
  branchOrTagKey: string,
  branchOrTag: string,
) {
  let schemaOptions = [];
  const source = 'https://raw.githubusercontent.com/adobe/spectrum-tokens/';
  let branchOrTagArr = branchOrTag.split('@');
  const url =
    branchOrTagKey !== 'branch'
      ? source +
        '%40adobe/spectrum-tokens%40' +
        branchOrTagArr[branchOrTagArr.length - 1]
      : source + branchOrTag;
  schemaOptions = await fetchTokens('manifest.json', url);
  schemaOptions.unshift('all');
  return schemaOptions;
}

async function fetchTokens(tokenName: string, url: string) {
  return (await fetch(`${url}/packages/tokens/${tokenName}`)).json();
}
