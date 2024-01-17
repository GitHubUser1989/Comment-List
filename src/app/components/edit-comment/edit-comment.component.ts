import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrl: './edit-comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCommentComponent implements OnInit {
  @Input()
  readonly comment: Comment;
  @Output()
  readonly cancel = new EventEmitter<number>();

  selectedTags: string[] = [];
  editCommentForm: FormGroup;

  tags$: Observable<String[]>;

  get isFormValid(): boolean {
    return this.editCommentForm.valid && !!this.selectedTags.length;
  }
  
  constructor(
    private readonly commentService: CommentService,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.editCommentForm = this.fb.group({
      title: [this.comment.title, Validators.required],
      text: [this.comment.text, Validators.required],
      input: [''],
    });

    this.selectedTags = this.comment.tags;
    this.tags$ = this.commentService.getAllTags();
  }

  addTag(): void {
    const input = this.editCommentForm.controls['input'].value;

    if (input && !this.selectedTags.includes(input)) {
      this.selectedTags.push(input.trim());
      this.editCommentForm.controls['input'].setValue('');
    }
  }

  removeTag(tagToRemove: string): void {
    this.selectedTags = this.selectedTags.filter((tag) => tag !== tagToRemove);
  }

  saveEdit(): void {
    if (!this.isFormValid) {
      return;
    }

    const editedComment: Comment = {
      id: this.comment.id,
      title: this.editCommentForm.value.title,
      text: this.editCommentForm.value.text,
      tags: this.selectedTags,
    };

    this.commentService.updateComment(editedComment);
    this.cdr.detectChanges();
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.cancel.emit();
  }
}
