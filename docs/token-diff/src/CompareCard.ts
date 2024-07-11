import { html, css, LitElement } from 'lit';
import '@spectrum-web-components/action-group/sp-action-group.js';
import '@spectrum-web-components/action-button/sp-action-button.js';
import '@spectrum-web-components/picker/sp-picker.js';
import '@spectrum-web-components/menu/sp-menu-item.js';
import '@spectrum-web-components/icons/sp-icons-medium.js';
import '@spectrum-web-components/icon/sp-icon.js';
import '@spectrum-web-components/field-label/sp-field-label.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-branch-circle.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-box.js';
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

interface Tag {
  commit: {
    sha: string;
    url: string;
  };
  name: string;
  node_id: string;
  tarball_url: string;
  zipball_url: string;
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
      margin-bottom: 15px;
    }
    .picker-item {
      display: flex;
      height: fit-content;
      margin: 0;
    }
    img {
      vertical-align: middle;
      margin-right: 5px;
    }
    .picker {
      width: 341px;
    }
  `;

  static properties = {
    heading: { type: String },
    toggle: { type: String },
    icon: { type: String },
    branchTagOptions: { type: Array },
    schemaOptions: { type: Array },
  };

  constructor(heading: string) {
    super();
    this.heading = heading;
    this.__fetchSchemaOptions(this.toggle);
  }

  __setGithubBranchToggle() {
    this.toggle = 'Github branch';
    this.__fetchSchemaOptions(this.toggle);
  }

  __setReleaseToggle() {
    this.toggle = 'Package release';
    this.__fetchSchemaOptions(this.toggle);
  }

  async __fetchSchemaOptions(type: string) {
    const oldOptions = this.branchTagOptions;
    this.branchTagOptions = [];
    if (type === 'Github branch') {
      const url = 'https://api.github.com/repos/adobe/spectrum-tokens/branches';
      await fetch(url).then(async response => {
        const branches = await response.json();
        this.__updateOptions(branches, oldOptions);
      });
      this.requestUpdate('options', oldOptions);
    } else {
      const url = 'https://api.github.com/repos/adobe/spectrum-tokens/tags';
      await fetch(url).then(async response => {
        const tags = await response.json();
        this.__updateOptions(tags, oldOptions);
      });
    }
  }

  __updateOptions(jsonObject: Branch | Tag, oldBranchTagOptions: string[]) {
    Object.values(jsonObject).forEach((entry: Branch | Tag) => {
      const { name } = entry; // ??? i thought i would need to call entry.name lol why does this work
      this.branchTagOptions.push(name);
    });
    this.requestUpdate('options', oldBranchTagOptions);
  }

  @property({ type: String }) heading = 'Version A';

  @property({ type: String }) toggle = 'Github branch';

  @property({ type: Array }) branchTagOptions: string[] = [];

  @property({ type: Array }) schemaOptions: string[] = []; // use fileImport function from token diff generator

  render() {
    return html`
      <div class="card">
        <div class="container">
          <div class="label section">${this.heading}</div>
          <sp-theme scale="medium" color="light">
            <sp-action-group compact selects="single" class="section">
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
            <sp-picker
              class="picker section"
              label=${this.branchTagOptions[0]}
              value=${this.branchTagOptions[0]}
            >
              ${this.branchTagOptions.map(option =>
                this.toggle === 'Github branch'
                  ? html`
                      <sp-menu-item value=${option}>
                        <sp-icon-branch-circle
                          slot="icon"
                        ></sp-icon-branch-circle>
                        ${option}
                      </sp-menu-item>
                    `
                  : html`
                      <sp-menu-item value=${option}>
                        <sp-icon-box slot="icon"></sp-icon-box>
                        ${option}
                      </sp-menu-item>
                    `,
              )}
            </sp-picker>
            <sp-field-label for="schemaSelection" size="m"
              >Schema</sp-field-label
            >
            <sp-picker
              class="picker"
              label=${this.branchTagOptions[0]}
              value=${this.branchTagOptions[0]}
            >
              ${this.branchTagOptions.map(option =>
                this.toggle === 'Github branch'
                  ? html`
                      <sp-menu-item value=${option}> ${option} </sp-menu-item>
                    `
                  : html`
                      <sp-menu-item value=${option}> ${option} </sp-menu-item>
                    `,
              )}
            </sp-picker>
          </sp-theme>
        </div>
      </div>
    `;
  }
}
