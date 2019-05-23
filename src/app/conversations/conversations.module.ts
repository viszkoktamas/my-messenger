import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.module';
import { ConversationListComponent } from './conversation-list/conversation-list.component';
import { ConversationComponent } from './conversation/conversation.component';

@NgModule({
  declarations: [ConversationListComponent, ConversationComponent],
  imports: [CommonModule, FormsModule, AngularMaterialModule, RouterModule],
})
export class ConversationsModule {}
