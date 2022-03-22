import { LitElement, html } from "lit";
import {customElement} from 'lit/decorators.js';
import './components/scanner';

@customElement("pwa-extension")
export class PwaExtension extends LitElement {

  render() {
    return html`
        <h1>PWA Builder Extension</h1>
        <pwa-scanner></pwa-scanner>`;
  }

}