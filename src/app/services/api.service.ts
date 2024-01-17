import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.interface';

@Injectable()
export class ApiService {
  private readonly jsonUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  getComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.jsonUrl}/comments`);
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.jsonUrl}/comments`, comment);
  }

  deleteCommentById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.jsonUrl}/comments/${id}`);
  }
  
  updateComment(comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.jsonUrl}/comments/${comment.id}`, comment);
  }
}
