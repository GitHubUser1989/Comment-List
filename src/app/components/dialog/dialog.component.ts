import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  @Input()
  readonly title: string;
  @Input()
  readonly message: string;

  @Output()
  readonly cancel = new EventEmitter<boolean>();
  @Output()
  readonly confirm = new EventEmitter<boolean>();

  handleCanceling(): void {
    this.cancel.emit(false);
  }

  handleConfirming(): void {
    this.confirm.emit(true);
  }
}
