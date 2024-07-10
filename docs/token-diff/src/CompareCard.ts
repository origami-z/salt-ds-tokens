import { html, css, LitElement } from 'lit';
import '@spectrum-web-components/action-group/sp-action-group.js';
import '@spectrum-web-components/action-button/sp-action-button.js';
import '@spectrum-web-components/picker/sp-picker.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/icons/sp-icons-medium.js';
import '@spectrum-web-components/icon/sp-icon.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';

import { property } from 'lit/decorators.js';

interface Branch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export class CompareCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--token-diff-text-color, #000);
    }
    .card {
      display: flex;
      width: 391px;
      flex-direction: column;
      align-items: flex-start;
      border-radius: 4px;
      border: 1px solid var(--Palette-gray-200, #e6e6e6);
      background: var(--Alias-background-app-frame-layer-2, #fff);
    }
    .label {
      color: var(
        --Alias-content-typography-heading,
        var(--Alias-content-typography-heading, #000)
      );
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 18px; /* 128.571% */
    }
    .container {
      padding-left: 24px;
      padding-right: 24px;
      padding-top: 24px;
      padding-bottom: 24px;
    }
    .section {
      margin-bottom: 8px;
    }
  `;

  static properties = {
    version: { type: String },
    toggle: { type: String },
  };

  constructor() {
    super();
    this.__fetchSchemaOptions(this.toggle);
  }

  __setGithubBranchToggle() {
    this.toggle = 'Github branch';
    this.icon = '/src/assets/github_branch_icon.svg';
    this.__fetchSchemaOptions(this.toggle);
  }

  __setReleaseToggle() {
    this.toggle = 'Package release';
    this.icon = '/src/assets/release_icon.svg';
    this.__fetchSchemaOptions(this.toggle);
  }

  async __fetchSchemaOptions(type: string) {
    this.options = [];
    if (type === 'Github branch') {
      const url = 'https://api.github.com/repos/adobe/spectrum-tokens/branches';
      await fetch(url).then(async response => {
        const branches = await response.json();
        branches.forEach((branch: Branch) => {
          const { name } = branch;
          this.options.push(name);
        });
        console.log(this.options);
      });
    }
  }

  @property({ type: String }) version = 'A';

  @property({ type: String }) toggle = 'Github branch';

  @property({ type: String }) icon = '/src/assets/github_branch_icon.svg';

  @property({ type: Array }) options: string[] = [];

  render() {
    return html`
      <div class="card">
        <div class="container">
          <div class="label section">Version ${this.version}</div>
          <sp-theme scale="medium" color="light">
            <sp-action-group compact class="section">
              <sp-action-button
                toggles
                selected
                @click=${this.__setGithubBranchToggle}
              >
                Github branch
              </sp-action-button>
              <sp-action-button toggles @click=${this.__setReleaseToggle}>
                Package release
              </sp-action-button>
            </sp-action-group>
            <sp-picker label="What would you like to do?" value="item-2">
              ${this.options.map(
                option => html`
                  <sp-menu-item value=${option}>
                    <img src=${this.icon} alt="github branch icon" />
                    ${option}
                  </sp-menu-item>
                `,
              )}
            </sp-picker>
          </sp-theme>
        </div>
      </div>
    `;
  }
}
