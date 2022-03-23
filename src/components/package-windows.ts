import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { windowsEndpoint } from "../endpoints";
import { getManifestUrl } from "../extensionHelpers";
import { WindowsOptions } from "../interfaces/windowsOptions";
import { fetchManifest } from "../utils/manifest";

@customElement("package-windows")
export class PackageWindows extends LitElement {
  @state() currentManiUrl: string | undefined = undefined;
  @state() windowsOptions: WindowsOptions | undefined = undefined;
  @state() currentUrl: string = "";

  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  public async firstUpdated() {
    this.currentManiUrl = await getManifestUrl();

    if (this.currentManiUrl) {
      const manifest = await fetchManifest(this.currentManiUrl);

      // get current url
      let url = await chrome.tabs.query({ active: true, currentWindow: true });
      if (url.length > 0) {
        this.currentUrl = url[0].url || "";
      }

      if (manifest) {
        // set options we can find in manifest
        this.setUpOptions(
          this.currentUrl,
          manifest.name || manifest.short_name || "My App",
          "",
          "",
          "",
          true,
          "",
          ""
        );
      }
    }
  }

  private async packageForWindows(options: any): Promise<Response | undefined> {
    let response: Response | undefined;

    try {
      response = await fetch(windowsEndpoint, {
        method: "POST",
        body: options,
        headers: new Headers({ "content-type": "application/json" }),
      });
    } catch (err) {
      console.error(err);
    }

    return response;
  }

  private setUpOptions(
    url: string,
    name: string,
    packageId: string,
    version: string,
    classicVersion: string,
    allowSigning: boolean = true,
    publisherDisplayName: string,
    publisherCommonName: string
  ): WindowsOptions {
    this.windowsOptions = {
      url,
      name,
      packageId,
      version,
      allowSigning,
      classicPackage: {
        generate: true,
        version: classicVersion,
      },
      publisher: {
        displayName: publisherDisplayName,
        commonName: publisherCommonName,
      },
    };

    return this.windowsOptions;
  }

  async handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (event.target) {
      let data = new FormData(event.target as HTMLFormElement);

      if (this.windowsOptions) {
        for (var pair of data.entries()) {
          switch (pair[0]) {
            case "packageId":
              this.windowsOptions.packageId = pair[1].toString();

              break;
            case "version":
              this.windowsOptions.version = pair[1].toString();

              break;
            case "classicVersion":
              this.windowsOptions.classicPackage.version = pair[1].toString();

              break;
            case "publisherDisplayName":
              this.windowsOptions.publisher.displayName = pair[1].toString();

              break;
            case "publisherCommonName":
              this.windowsOptions.publisher.commonName = pair[1].toString();

              break;

            default:
              break;
          }
        }

        // we now have all options, lets try to generate a package
        const response = await this.packageForWindows(this.windowsOptions);
        if (response) {
          const data = await response.blob();
          const url = URL.createObjectURL(data);

          // var blob = new Blob(["text" + "file"], {type: "application/octet-stream"});
          // var url = URL.createObjectURL(blob);

          // download the package
          await chrome.downloads.download({
            url,
            filename: `${this.windowsOptions.packageId}.zip`,
            saveAs: true,
          });
        }

      }
    }
  }

  render() {
    return html`
      <h1>Package for The Microsoft Store</h1>

      <form @submit="${($event: SubmitEvent) => this.handleSubmit($event)}">
        <!-- label for packageId input -->
        <label for="packageId">Package Id</label>
        <input
          type="text"
          id="packageId"
          name="packageId"
          placeholder="Package Id"
        />

        <!-- label for version input -->
        <label for="version">Version</label>
        <input type="text" id="version" name="version" placeholder="Version" />

        <!-- label for classicVersion input -->
        <label for="classicVersion">Classic Version</label>
        <input
          type="text"
          id="classicVersion"
          name="classicVersion"
          placeholder="Classic Version"
        />

        <!-- label for publisherDisplayName input -->
        <label for="publisherDisplayName">Publisher Display Name</label>
        <input
          type="text"
          id="publisherDisplayName"
          name="publisherDisplayName"
          placeholder="Publisher Display Name"
        />

        <!-- label for publisherCommonName input -->
        <label for="publisherCommonName">Publisher Common Name</label>
        <input
          type="text"
          id="publisherCommonName"
          name="publisherCommonName"
          placeholder="Publisher Common Name"
        />

        <!-- submit button -->
        <input type="submit" value="Send" />
      </form>
    `;
  }
}
