import { html, css, LitElement, TemplateResult } from 'lit';
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
import { githubAPIKey } from '../github-api-key.js';

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
    this.__fetchBranchTagOptions('Github branch');
    this.__fetchBranchTagOptions('Package release');
  }

  __setGithubBranchToggle() {
    this.toggle = 'Github branch';
  }

  __setReleaseToggle() {
    this.toggle = 'Package release';
  }

  async __fetchBranchTagOptions(type: string) {
    let oldOptions = [];
    if (this.toggle === 'Github branch') {
      oldOptions = this.branchOptions;
      this.branchOptions = [];
    } else {
      oldOptions = this.tagOptions;
      this.tagOptions = [];
    }
    if (type === 'Github branch') {
      const url = 'https://api.github.com/repos/adobe/spectrum-tokens/branches';
      await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `token ${githubAPIKey}`,
        },
      }).then(async response => {
        const branches = await response.json();
        this.__updateOptions(branches, this.branchOptions, oldOptions);
      });
    } else {
      const url = 'https://api.github.com/repos/adobe/spectrum-tokens/tags';
      await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `token ${githubAPIKey}`,
        },
      }).then(async response => {
        const tags = await response.json();
        this.__updateOptions(tags, this.tagOptions, oldOptions);
      });
    }
  }

  __updateOptions(
    jsonObject: Branch | Tag,
    branchOrTagArr: string[],
    oldBranchTagOptions: string[],
  ) {
    Object.values(jsonObject).forEach((entry: Branch | Tag) => {
      const { name } = entry; // ??? i thought i would need to call entry.name lol why does this work
      branchOrTagArr.push(name);
    });
    this.requestUpdate('options', oldBranchTagOptions);
  }

  __createMenuItem(options: string[]) {
    return options.map(option =>
      this.toggle === 'Github branch'
        ? html`
            <sp-menu-item value=${option}>
              <sp-icon-branch-circle slot="icon"></sp-icon-branch-circle>
              ${option}
            </sp-menu-item>
          `
        : html`
            <sp-menu-item value=${option}>
              <sp-icon-box slot="icon"></sp-icon-box>
              ${option}
            </sp-menu-item>
          `,
    );
  }

  @property({ type: String }) heading = 'Version A';

  @property({ type: String }) toggle = 'Github branch';

  @property({ type: Array }) branchOptions: string[] = [];

  @property({ type: Array }) tagOptions: string[] = [];

  @property({ type: Array }) schemaOptions: string[] = []; // use fileImport function from token diff generator

  protected override render(): TemplateResult {
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
              label=${this.toggle === 'Github branch'
                ? this.branchOptions[0]
                : this.tagOptions[0]}
              value=${this.toggle === 'Github branch'
                ? this.branchOptions[0]
                : this.tagOptions[0]}
            >
              ${this.toggle === 'Github branch'
                ? this.__createMenuItem(this.branchOptions)
                : this.__createMenuItem(this.tagOptions)}
            </sp-picker>
            <sp-field-label for="schemaSelection" size="m"
              >Schema</sp-field-label
            >
            <sp-picker
              class="picker"
              label=${this.toggle === 'Github branch'
                ? this.branchOptions[0]
                : this.tagOptions[0]}
              value=${this.toggle === 'Github branch'
                ? this.branchOptions[0]
                : this.tagOptions[0]}
            >
              ${this.toggle === 'Github branch'
                ? this.__createMenuItem(this.branchOptions)
                : this.__createMenuItem(this.tagOptions)}
            </sp-picker>
          </sp-theme>
        </div>
      </div>
    `;
  }
}
