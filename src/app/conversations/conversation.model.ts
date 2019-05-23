import { Message } from './message.model';

export interface Conversation {
  id: string;
  userIds: [string];
  users: [{ name: string; imagePath: string }];
  messages: [Message];
}
