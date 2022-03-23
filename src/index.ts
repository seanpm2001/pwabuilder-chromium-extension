import { LitElement, html } from "lit";
import {customElement} from 'lit/decorators.js';
import './components/scanner';
import './components/package-windows';

import {
  provideFluentDesignSystem,
  fluentTabs,
  fluentTab,
  fluentTabPanel
} from "@fluentui/web-components";

provideFluentDesignSystem().register(
  fluentTabs(),
  fluentTab(),
  fluentTabPanel()
);


@customElement("pwa-extension")
export class PwaExtension extends LitElement {

  render() {
    return html`
<<<<<<< HEAD
    <fluent-tabs>
      <fluent-tab id="validate">Validate</fluent-tab>
      <fluent-tab id="manifest">Manifest</fluent-tab>
      <fluent-tab id="package">Package</fluent-tab>

      <fluent-tab-panel id="validatePanel">
        <pwa-scanner></pwa-scanner>
      </fluent-tab-panel>

      <fluent-tab-panel id="validatePanel">
        Manifest Editor
      </fluent-tab-panel>

      <fluent-tab-panel id="validatePanel">
        Package
      </fluent-tab-panel>
    </fluent-tabs>
=======
      <h1>PWA Builder Extension</h1>
      <pwa-scanner></pwa-scanner>

      <package-windows></package-windows>
>>>>>>> package-windows
    `
    ;
  }

}