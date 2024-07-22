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
import { Router } from '@vaadin/router';
import './token-diff.js';
import './getting-started.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-show-menu.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/overlay/sp-overlay.js';
import '@spectrum-web-components/popover/sp-popover.js';

export class PageContainer extends LitElement {
  static styles = css`
    .page {
      display: flex;
      min-height: 100vh;
      width: 100vw;
      overflow-y: hidden;
    }
    #outlet {
      width: 100vw;
      height: 100vh;
      overflow-y: scroll;
      background-color: white;
    }
    .navigation {
      padding: 12px;
      border-bottom: 1px solid var(--spectrum-gray-200);
      background-color: white;
      display: none;
      background-color: white;
      overflow: hidden;
      position: fixed;
      width: 100%;
      z-index: 9999;
    }
    .mobile-nav-bar {
      height: 100vh;
      overflow-y: hidden;
      border-style: none;
    }
    @media only screen and (max-width: 1100px) {
      .navigation {
        display: inline-block;
        background-color: white;
      }
      .nav-bar {
        display: none;
      }
    }
    @media only screen and (min-width: 1100px) {
      .navigation {
        display: none;
        background-color: white;
      }
      .nav-bar {
        display: block;
      }
    }
  `;

  firstUpdated() {
    const router = new Router(this.shadowRoot!.querySelector('#outlet'));

    router.setRoutes([
      { path: '/demo', component: 'token-diff' },
      { path: '/getting-started', component: 'getting-started' },
    ]);
  }

  protected override render(): TemplateResult {
    return html`
      <div>
        <header>
          <sp-theme
            class="header"
            theme="spectrum"
            color="light"
            scale="medium"
          >
            <div class="navigation">
              <sp-action-button
                quiet
                id="trigger"
              >
                <sp-icon-show-menu slot="icon"></sp-icon-show-menu>
              </sp-action-button>
            </div>
          </sp-theme>
        </header>
        </div>
        <sp-theme
            theme="spectrum"
            color="light"
            scale="medium"
          >
          <div class="page">
          <nav-bar class="nav-bar"></nav-bar>
          <sp-overlay trigger="trigger@click" type="modal">
            <sp-popover class="mobile-nav-bar" placement="left" open>
                <nav-bar></nav-bar>
            </sp-popover>
          </sp-overlay>
          <div id="outlet"></div>
          </div>
          </sp-theme>
      </div>
    `;
  }
}
