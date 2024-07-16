import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-compare.js';
import '@spectrum-web-components/tabs/sp-tabs.js';
import '@spectrum-web-components/tabs/sp-tab.js';
import '@spectrum-web-components/tabs/sp-tab-panel.js';
import './compare-card.js';

export class CodePanel extends LitElement {
  static styles = css`
    :host {
      /* display: flex; */
      color: var(--token-diff-text-color, #000);
      top: 0;
      overflow-x: auto;
    }
    .page {
      /* display: flex; */
      background-color: #f8f8f8;
      border-radius: 10px;
      padding: 10px 25px;
      width: 100%;
      text-align: left;
    }
    pre {
      display: block;
      margin: 0;
      height: fit-content;
      display: flex;
    }
    code {
      display: block;
      left: 0;
      text-align: left;
      width: fit-content;
      /* align-content: flex-start; */
    }
  `;

  constructor(codeSnippet: string, tagOptions: string[]) {
    super();
    this.codeSnippet = codeSnippet;
    this.tagOptions = tagOptions;
  }

  @property({ type: String }) codeSnippet = '';
  @property({ type: Array }) tagOptions: string[] = [];

  firstUpdated() {
    console.log(this.codeSnippet);
    this.codeSnippet = this.codeSnippet.trim();
  }

  __addTabs() {
    return html`
      <sp-tabs selected=${this.tagOptions[0]} quiet>
        ${this.tagOptions.map(label => {
          return this.__newTab(label);
        })}
        ${this.tagOptions.map(label => {
          return this.__newPanel(label);
        })}
      </sp-tabs>
    `;
  }

  __newTab(label: string) {
    return html` <sp-tab label=${label} value=${label}></sp-tab> `;
  }

  __newPanel(label: string) {
    return html`
      <sp-tab-panel value=${label}>
        <pre>
              <code>
               ${`${label} ${this.codeSnippet}`}
              </code>
              </pre>
      </sp-tab-panel>
    `;
  }

  __regularCodeSnippetDisplay() {
    return html` <pre>
          <code>
            ${this.codeSnippet}
          </code>
        </pre>`;
  }

  protected override render(): TemplateResult {
    return html`
      <div class="page">
        ${this.tagOptions.length > 0
          ? this.__addTabs()
          : this.__regularCodeSnippetDisplay()}
      </div>
    `;
  }
}
