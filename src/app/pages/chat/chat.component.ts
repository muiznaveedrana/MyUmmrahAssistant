import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold mb-6">AI Chat Assistant</h2>
        
        <div class="h-96 border rounded-lg p-4 mb-4 overflow-y-auto bg-gray-50">
          <ng-container *ngIf="chatHistory.length > 0; else emptyChat">
            <div *ngFor="let chat of chatHistory" class="mb-4">
              <div class="flex flex-col">
                <p class="bg-blue-100 p-2 rounded-lg mb-2 self-end max-w-[80%]">
                  {{ chat.message }}
                </p>
                <p class="bg-gray-100 p-2 rounded-lg self-start max-w-[80%]">
                  {{ chat.response }}
                </p>
              </div>
            </div>
          </ng-container>
          <ng-template #emptyChat>
            <p class="text-gray-500 italic text-center">
              Start a conversation with our AI assistant
            </p>
          </ng-template>
        </div>

        <div class="flex gap-4">
          <input
            type="text"
            [(ngModel)]="message"
            (keyup.enter)="sendMessage()"
            placeholder="Type your message..."
            class="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            (click)="sendMessage()"
            [disabled]="!message.trim()"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  `
})
export class ChatComponent implements OnInit {
  message = '';
  chatHistory: ChatMessage[] = [];

  constructor(
    private chatService: ChatService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadChatHistory();
  }

  loadChatHistory() {
    this.chatService.getChatHistory().subscribe({
      next: (history) => {
        this.chatHistory = history;
      },
      error: (error) => {
        console.error('Error loading chat history:', error);
      }
    });
  }

  sendMessage() {
    if (!this.message.trim()) return;

    const messageText = this.message;
    this.message = '';

    this.chatService.sendMessage(messageText).subscribe({
      next: (response) => {
        this.chatHistory.unshift({
          id: Date.now().toString(),
          userId: this.auth.getCurrentUser()?.id || '',
          message: messageText,
          response: response.response,
          createdAt: new Date().toISOString()
        });
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.message = messageText; // Restore message on error
      }
    });
  }
}