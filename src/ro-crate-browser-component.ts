import RoCrateSingleton from './roCrateSingleton.js'
export class RoCrateBrowserComponent extends HTMLElement {
    private crateUrl?: string;
    private useButtonVariant?: boolean;
    private cratePreview: string;
    private iframeElement: HTMLIFrameElement | null;
    private modalOverlay: HTMLDivElement | null;

    constructor() {
        super();
        this.crateUrl = this.getAttribute('crate-url') || undefined;
        this.useButtonVariant = this.hasAttribute('use-button-variant');
        this.cratePreview = '';
        this.iframeElement = null;
        this.modalOverlay = null;

        this.attachShadow({ mode: 'open' });
        console.log('WEB COMPONENT INITIAfoejfoejoejeoLISED')
        console.log('CONST CRATE URL ', this.crateUrl);
        console.log('ATTRS ', this.getAttributeNames());
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    private render() {
        if (!this.shadowRoot) return;

        const buttonClass = this.useButtonVariant
            ? 'vf-button--sm vf-button--secondary'
            : 'vf-button--link mg-button-as-link';

        const template = `
            <style>
                /* Basic styles for modal and button */
                .custom-modal-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                }
                .custom-modal {
                    background: #fff;
                    width: 80vw;
                    height: 80vh;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    overflow-y: auto;
                }
                .modal-close-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                }
            </style>
            <button class="ro-crate-browser-component-button vf-button ${buttonClass}">
                Browse the RO-Crate
            </button>
            <div class="custom-modal-overlay">
                <div class="custom-modal">
                    <button class="modal-close-button vf-button vf-button--link">
                        <i class="icon icon-common icon-times"></i>
                    </button>
                    <iframe title="RO-Crate Preview" width="100%" height="100%"></iframe>
                </div>
            </div>
        `;

        this.shadowRoot.innerHTML = template;
        this.iframeElement = this.shadowRoot.querySelector('iframe');
        this.modalOverlay = this.shadowRoot.querySelector('.custom-modal-overlay');
    }

    private addEventListeners() {
        const button = this.shadowRoot?.querySelector('.ro-crate-browser-component-button');
        const closeButton = this.shadowRoot?.querySelector('.modal-close-button');

        button?.addEventListener('click', this.handleButtonClick.bind(this));
        closeButton?.addEventListener('click', this.closeModal.bind(this));
        window.addEventListener('message', this.handleIframeMessage.bind(this));
    }

    private removeEventListeners() {
        window.removeEventListener('message', this.handleIframeMessage.bind(this));
    }

    private async handleButtonClick() {
        const previewHtml = await RoCrateSingleton.getHtmlContent('ro-crate-preview.html', this.crateUrl);
        this.cratePreview = previewHtml;
        this.openModal();
    }

    private handleIframeMessage(event: MessageEvent) {
        if (typeof event.data !== 'string') {
            return;
        }
        if (
            !event.data.includes('multiqc') &&
            !event.data.includes('krona') &&
            !event.data.includes('ro-crate-preview')
        ) {
            return;
        }
        RoCrateSingleton.getHtmlContent(event.data, this.crateUrl).then((htmlContent: string) => {
            if (this.iframeElement) {
                this.iframeElement.srcdoc = htmlContent;
            }
        });
    }

    private openModal() {
        if (this.modalOverlay) {
            this.modalOverlay.style.display = 'block';
            if (this.iframeElement) {
                this.iframeElement.srcdoc = this.cratePreview;
            }
        }
    }

    private closeModal() {
        if (this.modalOverlay) {
            this.modalOverlay.style.display = 'none';
        }
    }
}

// Register the custom element
customElements.define('ro-crate-browser-component', RoCrateBrowserComponent);

// export default RoCrateBrowserComponent;
