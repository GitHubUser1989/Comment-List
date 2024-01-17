import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, firstValueFrom, map, Observable } from 'rxjs';
import { Comment } from '../models/comment.interface';
import { ApiService } from './api.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CommentService {
  private readonly comments$ = new BehaviorSubject<Comment[]>(undefined);
  private readonly tags$ = new BehaviorSubject<string[]>(undefined);
  private readonly filter$ = new BehaviorSubject<string[]>([]);

  constructor(private readonly apiService: ApiService) {}

  getComments(): Observable<Comment[]> {
    return combineLatest([
      this.comments$.pipe(filter(Boolean)),
      this.filter$,
    ])
      .pipe(
        map(([comments, filter]: [Comment[], string[]]) => {
          if (!filter.length) {
            return comments;
          }

          return comments.filter((comment) => comment.tags.some((tag) => filter.includes(tag)));
        }),
      );
  }

  getAllTags(): Observable<string[]> {
    return this.tags$
      .pipe(
        filter(Boolean),
        distinctUntilChanged((previous: string[], current: string[]) => {
          return JSON.stringify(previous) === JSON.stringify(current);
        }),
      );
  }

  async initComments(): Promise<void> {
    const comments = await firstValueFrom(this.apiService.getComments());

    this.setData(comments);
  }

  async updateComment(changes: Comment): Promise<void> {
    await firstValueFrom(this.apiService.updateComment(changes));

    const comments = [...this.comments$.value];
    const updatedIndex = comments.findIndex(({ id }: Comment) => id === changes.id);
    comments[updatedIndex] = changes;

    this.setData(comments);
  }

  async removeComment(id: string): Promise<void> {
    await firstValueFrom(this.apiService.deleteCommentById(id));

    const comments = this.comments$.value.filter((comment: Comment) => comment.id !== id);
    this.setData(comments);
  }

  async addComment(comment: Partial<Comment>): Promise<void> {
    const newComment = await firstValueFrom(
      this.apiService.addComment({
        id: uuidv4(),
        ...comment,
      } as Comment),
    );

    this.setData([...this.comments$.value, newComment]);
  };

  filterComments(tags: string[]): void {
    this.filter$.next(tags);
  }

  private reduceTags(commentList: Comment[]): string[] {
    const tags = commentList.reduce((result: string[], comment: Comment) => {
      return [...result, ...comment.tags];
    }, []);

    return [...new Set(tags)].sort((a, b) => a.localeCompare(b));
  }

  private setData(comments: Comment[]): void {
    const tags = this.reduceTags(comments);

    this.comments$.next(comments);
    this.tags$.next(tags);
    this.filter$.next(this.filter$.value.filter((tag: string) => tags.includes(tag)));
  }
}
