var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import RoCrateSingleton from './roCrateSingleton.js';
export class RoCrateBrowserComponent extends HTMLElement {
    static get observedAttributes() {
        return ['crate-url', 'use-button-variant'];
    }
    constructor() {
        super();
        this.cratePreview = '';
        this.iframeElement = null;
        this.modalOverlay = null;
        this.attachShadow({ mode: 'open' });
        console.log('WEB COMPONENT INITIALISED');
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'crate-url') {
                this.crateUrl = newValue;
                console.log('Updated crateUrl:', this.crateUrl);
            }
            if (name === 'use-button-variant') {
                this.useButtonVariant = newValue !== null;
            }
            // Re-render or update UI if needed
            this.render();
        }
    }
    connectedCallback() {
        console.log('Connected callback: crateUrl:', this.crateUrl);
        this.render();
        this.addEventListeners();
    }
    disconnectedCallback() {
        this.removeEventListeners();
    }
    render() {
        if (!this.shadowRoot)
            return;
        const buttonClass = this.useButtonVariant
            ? 'vf-button--sm vf-button--secondary'
            : 'vf-button--link mg-button-as-link';
        console.log('Render crateUrl:', this.crateUrl);
        const template = `
            <style>
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
    addEventListeners() {
        var _a, _b;
        const button = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('.ro-crate-browser-component-button');
        const closeButton = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.querySelector('.modal-close-button');
        button === null || button === void 0 ? void 0 : button.addEventListener('click', this.handleButtonClick.bind(this));
        closeButton === null || closeButton === void 0 ? void 0 : closeButton.addEventListener('click', this.closeModal.bind(this));
        window.addEventListener('message', this.handleIframeMessage.bind(this));
    }
    removeEventListeners() {
        window.removeEventListener('message', this.handleIframeMessage.bind(this));
    }
    handleButtonClick() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.crateUrl) {
                console.error('Crate URL is not defined');
                return;
            }
            const previewHtml = yield RoCrateSingleton.getHtmlContent('ro-crate-preview.html', this.crateUrl);
            this.cratePreview = previewHtml;
            this.openModal();
        });
    }
    handleIframeMessage(event) {
        if (typeof event.data !== 'string') {
            return;
        }
        if (!event.data.includes('multiqc') &&
            !event.data.includes('krona') &&
            !event.data.includes('ro-crate-preview')) {
            return;
        }
        RoCrateSingleton.getHtmlContent(event.data, this.crateUrl).then((htmlContent) => {
            if (this.iframeElement) {
                this.iframeElement.srcdoc = htmlContent;
            }
        });
    }
    openModal() {
        if (this.modalOverlay) {
            this.modalOverlay.style.display = 'block';
            if (this.iframeElement) {
                this.iframeElement.srcdoc = this.cratePreview;
            }
        }
    }
    closeModal() {
        if (this.modalOverlay) {
            this.modalOverlay.style.display = 'none';
        }
    }
}
customElements.define('ro-crate-browser-component', RoCrateBrowserComponent);
