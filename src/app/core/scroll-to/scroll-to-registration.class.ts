import { Subject, Observable } from 'rxjs';

export class ScrollToRegistration {
    triggerElement: HTMLAnchorElement | HTMLButtonElement | HTMLElement;
    targetElement?: HTMLElement;

    private registrationTerminatedSubject = new Subject();
    registrationTerminated = this.registrationTerminatedSubject.asObservable();

    constructor(
        triggerElement: HTMLAnchorElement | HTMLButtonElement | HTMLElement,
        private vAlign: 'start' | 'center' | 'end' | 'nearest',
        targetElement?: HTMLElement) {
        this.triggerElement = triggerElement;
        if (targetElement != null) {
            this.registerEventHandler(targetElement);
        }
    }

    registerEventHandler(targetElement?: HTMLElement): void {
        this.targetElement = targetElement;
        this.triggerElement.addEventListener('click', this.scrollToEventHandler);
    }

    private scrollToEventHandler = () => {
        if (this.targetElement != null) {
            this.targetElement.scrollIntoView({behavior: 'smooth', block: this.vAlign});
            setTimeout(() => {
                this.targetElement.classList.add('blink_me');
                setTimeout(() => {
                    this.targetElement.classList.remove('blink_me');
                }, 400);
            }, 500);
        }
    }

    unregister(): void {
        this.triggerElement.removeEventListener('click', this.scrollToEventHandler);
        this.registrationTerminatedSubject.next();
    }

    inactivateRegistration(): void {
        this.triggerElement.removeEventListener('click', this.scrollToEventHandler);
    }
}
