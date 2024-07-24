/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-compare.js';
import './compare-card.js';

interface TokenDiffJSON {
  renamed: any;
  deprecated: any;
  reverted: any;
  added: any;
  deleted: any;
  updated: {
    added: any;
    deleted: any;
    updated: any;
    renamed: any;
  };
}

export class DiffReport extends LitElement {
  static styles = css`
    :host {
      display: flex;
      color: var(--token-diff-text-color, #000);
      flex: auto;
      top: 0;
      overflow-x: hidden;
      min-height: 100vh;
      flex-wrap: wrap;
    }
    .title {
      color: #000;
      font-family: 'Adobe Clean Serif';
      font-size: 58px;
      font-style: normal;
      font-weight: 900;
      line-height: 66.7px; /* 115% */
      margin-top: 15px;
    }
    h2 {
      color: #000;
      font-size: 20px;
      font-style: normal;
      font-weight: 600;
      line-height: 66.7px;
      margin-top: 15px;
    }
    h3 {
      color: #000;
      font-size: 20px;
      font-style: normal;
      font-weight: 600;
      line-height: 66.7px;
      padding-left: 20px;
    }
    .warning-text {
      color: #222;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 27px; /* 150% */
      margin-bottom: 40px;
    }
    .page {
      display: flex;
      flex-wrap: wrap;
      background-color: #f8f8f8;
      width: auto;
      padding-top: 25px;
      padding-bottom: 25px;
      padding-left: 75px;
      padding-right: 75px;
      border-radius: 10px;
      width: 100%;
    }
    @media only screen and (max-width: 600px) {
      .page {
        padding-left: 25px;
        padding-right: 25px;
      }
      h2 {
        font-size: 18px;
      }
      h3 {
        font-size: 16px;
      }
    }
  `;

  constructor(
    tokenDiffJSON: TokenDiffJSON,
    originalBranchOrTag: string,
    originalSchema: string,
    updatedBranchOrTag: string,
    updatedSchema: string,
  ) {
    super();
    this.tokenDiffJSON = tokenDiffJSON;
    this.originalBranchOrTag = originalBranchOrTag;
    this.originalSchema = originalSchema;
    this.updatedBranchOrTag = updatedBranchOrTag;
    this.updatedSchema = updatedSchema;
  }

  firstUpdated() {
    this.totalTokens =
      Object.keys(this.tokenDiffJSON.renamed).length +
      Object.keys(this.tokenDiffJSON.deprecated).length +
      Object.keys(this.tokenDiffJSON.reverted).length +
      Object.keys(this.tokenDiffJSON.added).length +
      Object.keys(this.tokenDiffJSON.deleted).length +
      Object.keys(this.tokenDiffJSON.updated.added).length +
      Object.keys(this.tokenDiffJSON.updated.deleted).length +
      Object.keys(this.tokenDiffJSON.updated.updated).length +
      Object.keys(this.tokenDiffJSON.updated.renamed).length;
  }

  @property({ type: Object }) tokenDiffJSON: TokenDiffJSON = {
    renamed: {},
    deprecated: {},
    reverted: {},
    added: {},
    deleted: {},
    updated: {
      added: {},
      deleted: {},
      updated: {},
      renamed: {},
    },
  };
  @property({ type: Number }) totalTokens = 0;
  @property({ type: String }) originalBranchOrTag = '';
  @property({ type: String }) originalSchema = '';
  @property({ type: String }) updatedBranchOrTag = '';
  @property({ type: String }) updatedSchema = '';

  __createArrowItems(original: string, updated: string) {
    return html` <p>${original} -> ${updated}</p> `;
  }

  __createItemsWithDescription(token: string, description: string) {
    return html` <p>${token}: ${description}</p> `;
  }

  __createItems(token: string) {
    return html` <p>${token}</p> `;
  }

  __createEmbeddedItems(token: any) {
    return html`
      <p>${token}</p>
      ${this.__printNestedChanges(token)}
    `;
  }

  __printNestedChanges(token: any) {
    if (token['path'] !== undefined) {
      return html`
        <p>${token['path']}</p>
        <p>
          ${() => {
            if (token['original-value'] === undefined) {
              return this.__createItems(
                token['path'].includes('$schema')
                  ? `"${token['new-value']}"`
                  : token['new-value'],
              );
            } else if (token['path'].includes('$schema')) {
              const newValue = token['new-value'].split('/');
              const str =
                `"${token['original-value']}" -> \n` +
                `"${token['new-value'].substring(0, token['new-value'].length - newValue[newValue.length - 1].length)}` +
                `${newValue[newValue.length - 1].split('.')[0]}` +
                `.${newValue[newValue.length - 1].split('.')[1]}"`;
              return this.__createItems(str);
            } else {
              return this.__createArrowItems(
                token['original-value'],
                token['new-value'],
              );
            }
          }}
        </p>
      `;
    }
    Object.keys(token).forEach(property => {
      console.log(property);
      this.__printNestedChanges(token[property]);
    });
  }

  protected override render(): TemplateResult {
    return html`
      <div class="page">
        <sp-theme theme="spectrum" color="light" scale="medium">
          <h1>Tokens Changed (${this.totalTokens})</h1>
          <p>${this.originalBranchOrTag} | ${this.updatedBranchOrTag}</p>
          <p>${this.originalSchema} | ${this.updatedSchema}</p>
          <h2>
            📝 Renamed (${Object.keys(this.tokenDiffJSON.renamed).length})
          </h2>
          <div>
            ${Object.keys(this.tokenDiffJSON.renamed).map((token: any) => {
              return this.__createArrowItems(
                this.tokenDiffJSON.renamed[token]['old-name'],
                token,
              );
            })}
          </div>
          <h2>
            🕒 Newly Deprecated
            (${Object.keys(this.tokenDiffJSON.deprecated).length})
          </h2>
          <div>
            ${Object.keys(this.tokenDiffJSON.deprecated).map((token: any) => {
              return this.__createItemsWithDescription(
                token,
                this.tokenDiffJSON.deprecated[token]['deprecated_comment'],
              );
            })}
          </div>
          <h2>
            ⏰ Newly "Un-deprecated"
            (${Object.keys(this.tokenDiffJSON.reverted).length})
          </h2>
          <div>
            ${Object.keys(this.tokenDiffJSON.reverted).map((token: any) => {
              return this.__createItems(token);
            })}
          </div>
          <h2>🔼 Added (${Object.keys(this.tokenDiffJSON.added).length})</h2>
          <div>
            ${Object.keys(this.tokenDiffJSON.added).map((token: any) => {
              return this.__createItems(token);
            })}
          </div>
          <h2>
            🔽 Deleted (${Object.keys(this.tokenDiffJSON.deleted).length})
          </h2>
          <div>
            ${Object.keys(this.tokenDiffJSON.deleted).map((token: any) => {
              return this.__createItems(token);
            })}
          </div>
          <h2>
            🆕 Updated
            (${Object.keys(this.tokenDiffJSON.updated.added).length +
            Object.keys(this.tokenDiffJSON.updated.deleted).length +
            Object.keys(this.tokenDiffJSON.updated.updated).length +
            Object.keys(this.tokenDiffJSON.updated.renamed).length})
          </h2>
          <h3>
            🆕 Renamed Properties
            (${Object.keys(this.tokenDiffJSON.updated.renamed).length})
          </h3>
          <div>
            ${Object.keys(this.tokenDiffJSON.updated.renamed).map(
              (token: any) => {
                return this.__createEmbeddedItems(token);
              },
            )}
          </div>
          <h3>
            🆕 Added Properties
            (${Object.keys(this.tokenDiffJSON.updated.added).length})
          </h3>
          <div>
            ${Object.keys(this.tokenDiffJSON.updated.added).map(
              (token: any) => {
                return this.__createEmbeddedItems(token);
              },
            )}
          </div>
          <h3>
            🆕 Deleted Properties
            (${Object.keys(this.tokenDiffJSON.updated.deleted).length})
          </h3>
          <div>
            ${Object.keys(this.tokenDiffJSON.updated.deleted).map(
              (token: any) => {
                return this.__createEmbeddedItems(token);
              },
            )}
          </div>
          <h3>
            🆕 Updated Properties
            (${Object.keys(this.tokenDiffJSON.updated.updated).length})
          </h3>
          <div>
            ${this.__createEmbeddedItems(this.tokenDiffJSON.updated.updated)}
          </div>
        </sp-theme>
      </div>
    `;
  }
}
