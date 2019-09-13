import { Injectable } from '@angular/core';
import { ScrollToRegistration } from './scroll-to-registration.class';

@Injectable({
  providedIn: 'root'
})
export class ScrollToService {
  triggerElementsDictionary: { [targetElementId: string]: Array<ScrollToRegistration> } = {};
  targetElements: Array<HTMLElement> = [];

  constructor() { }

  registerTriggerElement(
    targetElementId: string,
    triggerElement: HTMLAnchorElement | HTMLButtonElement | HTMLElement,
    vAlign: 'start' | 'center' | 'end' | 'nearest' | 'start'): ScrollToRegistration {

    const targetElement = this.targetElements.find(elementItem => elementItem.id === targetElementId);

    const registration = new ScrollToRegistration(triggerElement, vAlign, targetElement);

    if (this.triggerElementsDictionary[targetElementId] == null) {
      this.triggerElementsDictionary[targetElementId] = [];
    }

    this.triggerElementsDictionary[targetElementId].push(registration);

    registration.registrationTerminated.subscribe(() => {
      const indexToRemove = this.triggerElementsDictionary[targetElementId].findIndex(registrationInstance => {
        return registrationInstance.triggerElement.isEqualNode(registration.triggerElement);
      });

      if (indexToRemove > -1) {
        this.triggerElementsDictionary[targetElementId].splice(indexToRemove, 1);
      }
    });

    return registration;
  }

  registerTargetElement(targetElement: HTMLElement): void {
    this.targetElements.push(targetElement);
    if (this.triggerElementsDictionary[targetElement.id] != null) {
      this.triggerElementsDictionary[targetElement.id].forEach((registration) => {
        registration.registerEventHandler(targetElement);
      });
    }
  }

  unregisterTargetElement(targetElement: HTMLElement): void {
    if (this.triggerElementsDictionary[targetElement.id] != null) {
      this.triggerElementsDictionary[targetElement.id].forEach((registration) => {
        registration.inactivateRegistration();
      });
    }
    const indexToRemove = this.targetElements.findIndex(element => element.id === targetElement.id);

    if (indexToRemove > -1) {
      this.targetElements.splice(indexToRemove, 1);
    }
  }

  scrollToElement(id: string, vAlign: 'start' | 'center' | 'end' | 'nearest' = 'start'): void {
    const targetElement = this.targetElements.find(element => element.id === id);
    if (targetElement != null) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: vAlign });
      setTimeout(() => {
        targetElement.classList.add('blink_me');
        setTimeout(() => {
          targetElement.classList.remove('blink_me');
        }, 400);
      }, 500);
    }
  }

}
