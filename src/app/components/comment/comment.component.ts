import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SecurityContext } from '@angular/core';
import { Comment } from '../../models/comment.interface'; 
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  @Input()
  readonly comment: Comment;
  @Output()
  readonly delete = new EventEmitter<string>();

  tags: string[] = [];
  isEditMode: boolean = false;
  isDialogOpen: boolean = false;

  get commentText(): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, this.comment.text);
  }
  
  constructor(private readonly sanitizer: DomSanitizer) {}

  toggleEditing(): void {
    this.isEditMode = !this.isEditMode;
  }

  openDialog(): void {
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
  }

  deleteComment(confirmed: boolean): void {
    this.closeDialog();
    
    if (confirmed) {
      this.delete.emit(this.comment.id);
    }
  }
}
