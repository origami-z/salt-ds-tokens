import { html, css, LitElement } from 'lit';

export class TokenDiff extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--token-diff-text-color, #000);
    }
  `;

  static properties = {
    header: { type: String },
    counter: { type: Number },
  };

  constructor() {
    super();
  }

  render() {
    return html`
      <div>hi</div>
    `;
  }
}
