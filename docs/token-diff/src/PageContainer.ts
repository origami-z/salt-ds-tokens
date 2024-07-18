import { html, css, LitElement, TemplateResult } from 'lit';
import { Router } from '@vaadin/router';
import './token-diff.js';
import './getting-started.js';
import '@spectrum-web-components/icons-workflow/icons/sp-icon-show-menu.js';
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/overlay/sp-overlay.js';
import '@spectrum-web-components/dialog/sp-dialog-wrapper.js';
import '@spectrum-web-components/underlay/sp-underlay.js';

export class PageContainer extends LitElement {
  static styles = css`
    .page {
      display: flex;
      min-height: 100vh;
      width: 100vw;
      /* overflow-y: hidden; */
    }
    #outlet {
      width: 100vw;
      height: 100vh;
      overflow-y: scroll;
      background-color: white;
    }
    .navigation {
      padding-left: 12px;
      padding-top: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--spectrum-gray-200);
      width: 100vw;
    }
    .header {
      display: none;
      background-color: white;
    }
    .nav-bar {
      width: fit-content;
      display: none;
    }
    sp-underlay:not([open]) + sp-dialog {
      display: none;
    }
    @media only screen and (max-width: 1100px) {
      .header {
        display: inline-block;
      }
      .nav-bar {
        display: none;
      }
    }
    @media only screen and (min-width: 1100px) {
      .header {
        display: none;
      }
      .nav-bar {
        display: inline-block;
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
      <div class="page">
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
                  onclick=${() => {
                    $('.navigation').hide();
                    $('.nav-bar').show();
                  }}
                >
                  <sp-icon-show-menu slot="icon"></sp-icon-show-menu>
                </sp-action-button>
              </div>
            </sp-theme>
          </header>
          <div class="page">
            <nav-bar class="nav-bar"></nav-bar>
            <div id="outlet"></div>
          </div>
        </div>
      </div>
    `;
  }
}
