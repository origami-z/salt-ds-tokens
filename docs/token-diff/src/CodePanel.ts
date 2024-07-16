import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-compare.js';
import './compare-card.js';

export class CodePanel extends LitElement {
  static styles = css`
    :host {
      display: flex;
      color: var(--token-diff-text-color, #000);
      top: 0;
      overflow-x: auto;
      margin-left: 100px;
      margin-right: 100px;
    }
    .page {
      display: flex;
      justify-content: center;
      background-color: #f8f8f8;
      border-radius: 10px;
      padding: 10px 25px;
      width: 100%;
    }
    pre {
        margin: 0;
        height: fit-content;
        display: flex;
        justify-content: flex-start;
    }
    code {
        position: relative;
        left: 0;
        text-align: left;
        width: fit-content;
        align-content: flex-start;
    }
  `;

  constructor(codeSnippet: string) {
    super();
    this.codeSnippet = codeSnippet;
  }

  @property({ type: String }) codeSnippet = '';

  protected override render(): TemplateResult {
    return html`
      <div class="page">
        <pre>
        <code>
            ${this.codeSnippet}
        </code>
      </pre>
      </div>
    `;
  }
}
