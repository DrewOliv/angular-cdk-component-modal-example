import {
  GlobalPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

export const MODAL_DEFAULT_OPTIONS: OverlayConfig = {
  positionStrategy: new GlobalPositionStrategy()
    .centerHorizontally()
    .centerVertically(),
  hasBackdrop: true,
  panelClass: 'modal-panel',
  minWidth: '524px',
};

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: true,
  imports: [],
})
export class ModalComponent implements OnInit {
  @ViewChild('modalTemplate') modalTemplate: TemplateRef<any>;

  private overlayRef: OverlayRef;

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private overlay: Overlay
  ) {}

  ngOnInit() {}

  public open() {
    console.log('aaa');

    this.overlayRef = this.overlay.create({
      ...MODAL_DEFAULT_OPTIONS,
    });

    const containerModal = new TemplatePortal(
      this.modalTemplate,
      this._viewContainerRef
    );

    this.overlayRef.attach(containerModal);

    return this.overlayRef;
  }

  public close() {
    this.overlayRef.dispose();
  }
}
