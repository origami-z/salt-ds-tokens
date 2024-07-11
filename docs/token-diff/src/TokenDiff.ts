import { html, css, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/card/sp-card.js';
import '@spectrum-web-components/button/sp-button.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-compare.js';
import './compare-card.js';

export class TokenDiff extends LitElement {
  static styles = css`
    :host {
      display: flex;
      padding: 25px;
      color: var(--token-diff-text-color, #000);
      background-color: white;
      flex: auto;
      top: 0;
      overflow-x: auto;
    }
    .title {
      color: #000;
      font-family: 'Adobe Clean Serif';
      font-size: 58px;
      font-style: normal;
      font-weight: 900;
      line-height: 66.7px; /* 115% */
      margin-left: 52px;
      margin-top: 15px;
    }
    .warning-text {
      color: #222;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 27px; /* 150% */
      margin-left: 52px;
      margin-bottom: 40px;
    }
    .page {
      display: flex;
      justify-content: center;
    }
    .compare-button {
      margin-top: 40px;
    }
  `;

  @property({ type: String }) header = 'Hey there';

  @property({ type: Number }) counter = 5;

  protected override render(): TemplateResult {
    return html`
      <div class="page">
        <sp-theme theme="spectrum" color="light" scale="medium">
          <div class="title spectrum-Typography spectrum-Heading--sizeXXL">
            Token diff generator
          </div>
          <div class="warning-text">
            WARNING: Will either be inaccurate or will throw an error if used
            for releases or branches that use tokens from before
            @adobe/spectrum-tokens@12.26.0!
          </div>
          <div class="page">
            <compare-card heading="Version A"></compare-card>
            <compare-card heading="Version B"></compare-card>
          </div>
          <div class="page compare-button">
            <sp-button variant="accent" size="m">
              <sp-icon-compare slot="icon"></sp-icon-compare>
              Compare
            </sp-button>
          </div>
        </sp-theme>
      </div>
    `;
  }
}
