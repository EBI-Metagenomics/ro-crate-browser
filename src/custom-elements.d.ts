// src/custom-elements.d.ts

import { RoCrateBrowserComponent } from './ro-crate-browser-component';
import React from "react";

declare global {
    interface HTMLElementTagNameMap {
        'ro-crate-browser-component': RoCrateBrowserComponent;
    }

    namespace JSX {
        interface IntrinsicElements {
            'ro-crate-browser-component': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                'crate-url'?: string;
                'use-button-variant'?: boolean;
            };
        }
    }
}
