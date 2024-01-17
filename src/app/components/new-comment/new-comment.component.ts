import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-comment',
  templateUrl: './new-comment.component.html',
  styleUrl: './new-comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCommentComponent implements OnInit {
  tags$: Observable<string[]>;
  selectedTags: string[] = [];
  newCommentForm: FormGroup;
  
  get isFormValid(): boolean {
    if (this.newCommentForm.valid && this.selectedTags.length) {
      return true;
    }

    return false;
  }

  constructor(
    private readonly commentService: CommentService,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.newCommentForm = this.fb.group({
      title: ['', Validators.required],
      text: ['', Validators.required],
      input: [''],
    });

    this.tags$ = this.commentService.getAllTags();
  }

  addTag(): void {
    const input = this.newCommentForm.controls['input'].value;

    if (input && !this.selectedTags.includes(input)) {
      this.selectedTags.push(input.trim());
      this.newCommentForm.controls['input'].setValue('');
    }
  }

  removeTag(tagToRemove: string): void {
    this.selectedTags = this.selectedTags.filter((tag) => tag !== tagToRemove);
  }

  createComment(): void {
    if (!this.isFormValid) {
      return;
    }

    const newComment: Partial<Comment> = {
      title: this.newCommentForm.value.title,
      text: this.newCommentForm.value.text,
      tags: this.selectedTags,
    };

    this.commentService.addComment(newComment);
    this.cdr.detectChanges();
    this.resetForm();
  }

  resetForm(): void {
    this.newCommentForm.reset();
    this.selectedTags = [];
  }
}
