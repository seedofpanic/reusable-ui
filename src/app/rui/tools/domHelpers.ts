import {ElementRef} from '@angular/core';

export function elementHasParent(element: ElementRef, parent: ElementRef): boolean {
    let elementParent = element.nativeElement.parentNode;
    while (elementParent) {
        if (parent.nativeElement === elementParent) {
            return true;
        }

        elementParent = elementParent.parentNode;
    }

    return false;
}