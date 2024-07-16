import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-compare.js';
import './compare-card.js';
import './code-panel.js';
import '@spectrum-web-components/table/sp-table.js';
import '@spectrum-web-components/table/sp-table-body.js';
import '@spectrum-web-components/table/sp-table-cell.js';
import '@spectrum-web-components/table/sp-table-head.js';
import '@spectrum-web-components/table/sp-table-head-cell.js';
import '@spectrum-web-components/table/sp-table-row.js';

export class GettingStarted extends LitElement {
  static styles = css`
    :host {
      display: flex;
      padding: 25px;
      color: var(--token-diff-text-color, #000);
      background-color: white;
      flex: auto;
      top: 0;
      overflow-x: auto;
      margin-left: 100px;
    }
    .title {
      color: #000;
      font-family: 'Adobe Clean Serif';
      font-size: 58px;
      font-style: normal;
      font-weight: 900;
      line-height: 66.7px; /* 115% */
      margin-left: 100px;
      margin-top: 15px;
    }
    .subtitle {
      color: #000;
      font-family: 'Adobe Clean Serif';
      font-size: 40px;
      font-style: normal;
      font-weight: 900;
      line-height: 66.7px; /* 115% */
      margin-left: 100px;
      margin-top: 15px;
    }
    .text {
      color: #222;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 27px; /* 150% */
      margin-left: 100px;
      margin-right: 100px;
      margin-bottom: 10px;
    }
    .page {
      display: flex;
      justify-content: center;
    }
    .compare-button {
      margin-top: 40px;
    }
  `;

  protected override render(): TemplateResult {
    return html`
      <div class="page">
        <sp-theme theme="spectrum" color="light" scale="medium">
          <div
            class="title spectrum-Typography spectrum-Heading--sizeXXL spectrum-Heading--serif"
          >
            Getting started
          </div>
          <p class="text spectrum-Typography spectrum-Heading--sizeXXL">
            Other than the web version of the token diff generator, there is
            also a npm package containing the CLI and standalone Javascript
            library that you can use in your development environment. Both the
            CLI and the standalone Javascript library are located in the
            Spectrum Tokens monorepo.
          </p>
          <div
            class="subtitle spectrum-Typography spectrum-Heading--sizeXXL spectrum-Heading--serif"
          >
            Installation
          </div>
          <p class="text spectrum-Typography spectrum-Heading--sizeXXL">
            Installing the package is done preferably with pnpm, but npm or yarn
            will also work.
          </p>
          <code-panel
            codeSnippet="pnpm i @adobe/token-diff-generator"
          ></code-panel>
          <div
            class="subtitle spectrum-Typography spectrum-Heading--sizeXXL spectrum-Heading--serif"
          >
            Imports
          </div>
          <p class="text spectrum-Typography spectrum-Heading--sizeXXL">
            Import the token diff generator as a module per ES6 standards.
          </p>
          <code-panel
            codeSnippet="import tokenDiff from '@adobe/token-diff-generator';"
          ></code-panel>
          <div
            class="subtitle spectrum-Typography spectrum-Heading--sizeXXL spectrum-Heading--serif"
          >
            Token diff generator library
          </div>
          <p class="text spectrum-Typography spectrum-Heading--sizeXXL">
            The token diff generator library holds the functions used to
            generate diffs between two compilations of design tokens. It uses
            the deep-object-diff open-source library to extract a JSON object
            containing the changes, and then runs that JSON object through
            various functions to tailor the result specifically for design
            tokens. <br /><br />
            An example of tailoring involves detecting when tokens are renamed.
            The deep-object-diff library is unable to tell whether or not a
            token has been renamed due to it being designed for general JSON
            objects. Instead, it will mark the new name as a new token being
            added to the schema and the old name as a deleted token. This is
            where the token diff generator comes in. It goes through the changes
            detected by deep-object-diff and checks if a token is renamed via
            its uuid. <br /><br />
            Since the token diff generator relies on all tokens having their own
            uuid, the library—including the CLI and web version—will not work
            for versions of spectrum-tokens before the
            @adobe/spectrum-tokens@12.26.0 release.
          </p>
          <div
            class="subtitle spectrum-Typography spectrum-Heading--sizeXXL spectrum-Heading--serif"
          >
            Usage examples
          </div>
          <p class="text spectrum-Typography spectrum-Heading--sizeXXL">
            The most basic usage case is calling tokenDiff with two JSON
            objects, one for the original token(s) and the other for the updated
            token(s).
          </p>
          <code-panel
            codeSnippet="import tokenDiff from “@adobe/token-diff-generator”;
          
          const report = tokenDiff(originalSchema, updatedSchema);"
          ></code-panel>
          <p class="text spectrum-Typography spectrum-Heading--sizeXXL">
            If you are interested in comparing tokens locally between different
            versions or branches, you can use the following code snippet.
          </p>
          <code-panel
            codeSnippet="import tokenDiff from “@adobe/token-diff-generator”;
import fileImport from “@adobe/token-diff-generator”;

const [originalSchema, updatedSchema] = await Promise.all([
              fileImport(tokenNames, originalVersion, originalBranch),
              fileImport(tokenNames, updatedVersion, updatedBranch),
            ]);

const report = tokenDiff(originalSchema, updatedSchema);"
          ></code-panel>
          <p class="text spectrum-Typography spectrum-Heading--sizeXXL">
            Both of these examples output a JSON object containing the changes
            made between the two schema.
          </p>
          <div
            class="subtitle spectrum-Typography spectrum-Heading--sizeXXL spectrum-Heading--serif"
          >
            Token diff cli
          </div>
          <p class="text spectrum-Typography spectrum-Heading--sizeXXL">
            The token diff cli is a command line interface tool used to generate
            reports in the terminal with data from the token diff generator. It
            is included in the same package as the standalone Javascript library
            and uses the commander open-source library.
          </p>
          <div
            class="subtitle spectrum-Typography spectrum-Heading--sizeXXL spectrum-Heading--serif"
          >
            Commands
          </div>
          <p class="text spectrum-Typography spectrum-Heading--sizeXXL">
            There currently is only one command to run in the CLI. It generates
            a diff report for two inputted schema.
          </p>
          <code-panel codeSnippet="tdiff report"></code-panel>
          <div
            class="subtitle spectrum-Typography spectrum-Heading--sizeXXL spectrum-Heading--serif"
          >
            Options
          </div>
          <sp-table>
            <sp-table-head>
              <sp-table-head-cell>Column Title</sp-table-head-cell>
              <sp-table-head-cell>Column Title</sp-table-head-cell>
              <sp-table-head-cell>Column Title</sp-table-head-cell>
            </sp-table-head>
            <sp-table-body>
              <sp-table-row>
                <sp-table-cell>Row Item Alpha</sp-table-cell>
                <sp-table-cell>Row Item Alpha</sp-table-cell>
                <sp-table-cell>Row Item Alpha</sp-table-cell>
              </sp-table-row>
              <sp-table-row>
                <sp-table-cell>Row Item Bravo</sp-table-cell>
                <sp-table-cell>Row Item Bravo</sp-table-cell>
                <sp-table-cell>Row Item Bravo</sp-table-cell>
              </sp-table-row>
              <sp-table-row>
                <sp-table-cell>Row Item Charlie</sp-table-cell>
                <sp-table-cell>Row Item Charlie</sp-table-cell>
                <sp-table-cell>Row Item Charlie</sp-table-cell>
              </sp-table-row>
              <sp-table-row>
                <sp-table-cell>Row Item Delta</sp-table-cell>
                <sp-table-cell>Row Item Delta</sp-table-cell>
                <sp-table-cell>Row Item Delta</sp-table-cell>
              </sp-table-row>
              <sp-table-row>
                <sp-table-cell>Row Item Echo</sp-table-cell>
                <sp-table-cell>Row Item Echo</sp-table-cell>
                <sp-table-cell>Row Item Echo</sp-table-cell>
              </sp-table-row>
            </sp-table-body>
          </sp-table>
        </sp-theme>
      </div>
    `;
  }
}
