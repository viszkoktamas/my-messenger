import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConversationPreview } from './conversation-preview.model';
import { Conversation } from './conversation.model';

const BACKEND_URL = environment.apiUrl + '/conversation/';

@Injectable({ providedIn: 'root' })
export class ConversationsService {
  private conversations: ConversationPreview[] = [];
  private conversationsUpdated = new Subject<{
    conversations: ConversationPreview[];
    conversationCount: number;
  }>();

  private conversation: Conversation;
  private conversationUpdated = new Subject<{
    message: string;
    conversation: Conversation;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  startConversation(toId: string) {
    return this.http
      .post<{ message: string; conversation: Conversation }>(BACKEND_URL, { toId })
      .subscribe(
        ({ conversation }) => {
          this.router.navigate(['/conversation', conversation.id]);
        },
        error => console.log(error)
      );
  }

  sendMessage(toId: string, msg: string) {
    return this.http
      .put<{ message: string; conversation: Conversation }>(BACKEND_URL, { toId, message: msg })
      .subscribe(({ message, conversation }) => {
        this.conversation = conversation;
        this.conversationUpdated.next({
          message,
          conversation: { ...this.conversation },
        });
      });
  }

  getConversations(ConversationPerPage: number, currentPage: number) {
    const queryParams = `?page_size=${ConversationPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; conversations: ConversationPreview[]; maxConversations: number }>(
        BACKEND_URL + queryParams
      )
      .subscribe(({ conversations, maxConversations }) => {
        this.conversations = conversations;
        this.conversationsUpdated.next({
          conversations: [...this.conversations],
          conversationCount: maxConversations,
        });
      });
  }

  getConversation(id: string) {
    return this.http.get<Conversation>(BACKEND_URL + id);
  }

  getConversationsUpdateListener() {
    return this.conversationsUpdated.asObservable();
  }

  getConversationUpdateListener() {
    return this.conversationUpdated.asObservable();
  }

  deletePost(conversationId: string) {
    return this.http.delete(BACKEND_URL + conversationId);
  }
}
