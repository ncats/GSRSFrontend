/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  createFakeEvent,
  createKeyboardEvent,
  createMouseEvent,
  createTouchEvent
} from './event-objects';
import { TestGestureConfig } from './test-gesture-config';

/** Utility to dispatch any event on a Node. */
export function dispatchEvent(node: Node | Window, event: Event): Event {
  node.dispatchEvent(event);
  return event;
}

/** Shorthand to dispatch a fake event on a specified node. */
export function dispatchFakeEvent(node: Node | Window, type: string, canBubble?: boolean): Event {
  return dispatchEvent(node, createFakeEvent(type, canBubble));
}

/** Shorthand to dispatch a keyboard event with a specified key code. */
export function dispatchKeyboardEvent(node: Node, type: string, keyCode: number, target?: Element):
    KeyboardEvent {
  return dispatchEvent(node, createKeyboardEvent(type, keyCode, target)) as KeyboardEvent;
}

/** Shorthand to dispatch a mouse event on the specified coordinates. */
export function dispatchMouseEvent(node: Node, type: string, x = 0, y = 0,
  event = createMouseEvent(type, x, y)): MouseEvent {
  return dispatchEvent(node, event) as MouseEvent;
}

/** Shorthand to dispatch a touch event on the specified coordinates. */
export function dispatchTouchEvent(node: Node, type: string, x = 0, y = 0) {
  return dispatchEvent(node, createTouchEvent(type, x, y));
}

export function dispatchMouseenterEvent(element: HTMLElement): void {
  const dimensions = element.getBoundingClientRect();
  const y = dimensions.top;
  const x = dimensions.left;

  dispatchMouseEvent(element, 'mouseenter', x, y);
}

export function dispatchSlideEvent(sliderElement: HTMLElement, percent: number,
  gestureConfig: TestGestureConfig): void {
  const trackElement = sliderElement.querySelector('.mat-slider-wrapper');
  const dimensions = trackElement.getBoundingClientRect();
  const x = dimensions.left + (dimensions.width * percent);
  const y = dimensions.top + (dimensions.height * percent);

  gestureConfig.emitEventForElement('slide', sliderElement, {
    center: { x: x, y: y },
    srcEvent: { preventDefault: jasmine.createSpy('preventDefault') }
  });
}
