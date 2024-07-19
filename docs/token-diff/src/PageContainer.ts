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
import { property } from 'lit/decorators.js';

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
    /* header {
      display: none;
      background-color: white;
      overflow: hidden;
      position: fixed;
      width: 100%;
      z-index: 9999;
    } */
    .show {
      display: inline-block !important;
    }
    .hide {
      display: none !important;
    }
    .remove-brightness {
      filter: brightness(75%);
    }
    .restore-brightness {
      filter: brightness(100%);
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

  __toggleNav() {
    // console.log('hello?');
    // const navBar = this.shadowRoot?.querySelector('nav-bar');
    // const header = this.shadowRoot?.querySelector('.navigation');
    // const outlet = this.shadowRoot?.querySelector('#outlet');
    // if (
    //   header && navBar && outlet
    // ) {
    //   header.classList.toggle('hide');
    //   navBar.classList.toggle('show');
    //   outlet.classList.toggle('remove-brightness');
    // }
  }

  __toggleOutlet() {
    // const navBar = this.shadowRoot?.querySelector('nav-bar');
    // const header = this.shadowRoot?.querySelector('.navigation');
    // const outlet = this.shadowRoot?.querySelector('#outlet');
    // if (
    //   header && navBar && outlet &&
    //   window.matchMedia('(max-width: 1100px)').matches
    // ) {
    //   navBar.classList.toggle('hide');
    //   header.classList.remove('hide');
    //   header.classList.toggle('show');
    //   outlet.classList.toggle('restore-brightness');
    // }
  }

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
                @click="${this.__toggleNav}"
              >
                <sp-icon-show-menu slot="icon"></sp-icon-show-menu>
              </sp-action-button>
            </div>
          </sp-theme>
        </header>
        </div>
        <div class="page">
          <nav-bar class="nav-bar"></nav-bar>
          <div id="outlet" @click="${this.__toggleOutlet}"></div>
        </div>
      </div>
    `;
  }
}
