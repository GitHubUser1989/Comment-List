import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Comment } from '../../models/comment.interface';
import { CommentService } from '../../services/comment.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-list-comments',
  templateUrl: './list-comments.component.html',
  styleUrl: './list-comments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListCommentsComponent implements OnInit {
  comments$: Observable<Comment[]>;
  tags$: Observable<string[]>;
  selectedTags: Record<string, boolean> = {};

  constructor(private readonly commentService: CommentService) {}

  ngOnInit(): void {
    this.commentService.initComments();

    this.comments$ = this.commentService.getComments();

    this.tags$ = this.commentService.getAllTags()
      .pipe(
        tap((tags) => {
          tags.forEach((tag) => this.selectedTags[tag] = this.selectedTags[tag] || false);
        }),
      );
  }

  filteredComments(tag: string): void {
    this.selectedTags[tag] = !this.selectedTags[tag];

    const tags = Object.keys(this.selectedTags)
      .filter((tag: string) => this.selectedTags[tag]);

    this.commentService.filterComments(tags);
  }

  removeComment(id: string): void {
    this.commentService.removeComment(id);
  }
}
