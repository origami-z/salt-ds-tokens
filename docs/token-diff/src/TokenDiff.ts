import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/card/sp-card.js';
import './compare-card.js';

export class TokenDiff extends LitElement {
  static styles = css`
    :host {
      display: flex;
      padding: 25px;
      color: var(--token-diff-text-color, #000);
      background-color: white;
      float: right;
    }
    .title {
      color: #000;
      font-family: 'Adobe Clean Serif';
      font-size: 58px;
      font-style: normal;
      font-weight: 900;
      line-height: 66.7px; /* 115% */
    }
    .text {
      color: #222;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 27px; /* 150% */
    }
  `;

  @property({ type: String }) header = 'Hey there';

  @property({ type: Number }) counter = 5;

  __increment() {
    this.counter += 1;
  }

  render() {
    return html`
      <div>
        <sp-theme theme="spectrum" color="light" scale="medium">
          <div class="title spectrum-Typography spectrum-Heading--sizeXXL">
            Token diff generator
          </div>
        </sp-theme>
        <div class="text">
          WARNING: Will either be inaccurate or will throw an error if used for
          releases or branches that use tokens from before
          @adobe/spectrum-tokens@12.26.0!
        </div>
        <compare-card></compare-card>
      </div>
    `;
  }
}
