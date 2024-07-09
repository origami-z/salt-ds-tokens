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

import '@spectrum-web-components/sidenav/sp-sidenav.js';
import '@spectrum-web-components/sidenav/sp-sidenav-item.js';
import { html, css, LitElement, TemplateResult } from 'lit';

export class NavBar extends LitElement {
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

    //   __increment() {
    //     this.counter += 1;
    //   }

    protected override render(): TemplateResult {
        return (
            html`
                <div>
                    <img src="../images/adobe_logo.png" /> 
                    <h2>Spectrum Tokens</h2>
                </div>
                <sp-sidenav defaultValue="Token diff generator" variant="multilevel">
                    <sp-sidenav-item value="Token diff generator" href="/components/TokenDiff"
                        label="Token diff generator"></sp-sidenav-item>
                    <sp-sidenav-item value="Getting started" href="/components/GettingStarted"
                        label="Getting started"></sp-sidenav-item>
                </sp-sidenav>
            `
        );
    }
}