import { ReactNode } from "react";

const ModalService = {
    on(event: any, callback: (detail: any) => void) {
        document.addEventListener(event, (e) => callback(e.detail));
    },
    open(component: ReactNode, props = {}) {
        document.dispatchEvent(new CustomEvent('open', { detail: { component, props } }));
    },
};

export default ModalService;