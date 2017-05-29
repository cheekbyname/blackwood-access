import { Component } from '@angular/core';

@Component({
    selector: 'app-modal',
    template: require('./modal.component.html'),
    styles: [require('./modal.component.css')]
})
export class ModalComponent {
    public visisble = false;
    private visibleAnimate = false;

    constructor() {}

    public show(): void {
        this.visisble = true;
        setTimeout(() => this.visibleAnimate = true, 100);
    }

    public hide(): void {
        this.visibleAnimate = false;
        setTimeout(() => this.visisble = false, 300);
    }

    public onContainerClicked(event: MouseEvent): void {
        if ((<HTMLElement>event.target).classList.contains('modal')) {
            this.hide();
        }
    }
}