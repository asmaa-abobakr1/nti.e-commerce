import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/interfaces';

@Component({
  selector: 'app-message-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold mb-0">Customer Messages</h3>
      <span class="badge bg-primary rounded-pill px-3">{{ messages.length }} Total</span>
    </div>

    <div class="row g-4">
      <div class="col-12" *ngFor="let msg of messages">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden" [class.border-start]="!msg.isRead" [style.border-left]="!msg.isRead ? '5px solid #6366f1' : ''">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 class="fw-bold mb-1">{{ msg.subject }}</h5>
                <div class="d-flex align-items-center gap-2">
                  <span class="fw-bold small text-primary">{{ msg.name }}</span>
                  <span class="text-gray small">•</span>
                  <span class="text-gray small">{{ msg.email }}</span>
                </div>
              </div>
              <div class="text-end">
                <span class="text-gray small d-block mb-2">{{ msg.createdAt | date:'medium' }}</span>
                <span class="badge rounded-pill" [ngClass]="msg.isRead ? 'bg-light text-dark border' : 'bg-primary'">
                  {{ msg.isRead ? 'Read' : 'New' }}
                </span>
              </div>
            </div>
            
            <p class="text-dark mb-4" style="white-space: pre-wrap;">{{ msg.content }}</p>
            
            <div class="d-flex gap-2">
              <button *ngIf="!msg.isRead" class="btn btn-sm btn-primary rounded-pill px-3" (click)="markAsRead(msg)">
                <i class="fas fa-check me-1"></i> Mark as Read
              </button>
              <button class="btn btn-sm btn-light text-danger rounded-pill px-3" (click)="deleteMessage(msg._id)">
                <i class="fas fa-trash-alt me-1"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 text-center py-5" *ngIf="messages.length === 0">
        <i class="fas fa-inbox fa-3x text-gray opacity-20 mb-3"></i>
        <h5 class="text-gray">No messages yet.</h5>
      </div>
    </div>
  `
})
export class MessageManagementComponent implements OnInit {
  private messageService = inject(MessageService);
  messages: Message[] = [];

  ngOnInit() {
    this.load();
  }

  load() {
    this.messageService.getMessages().subscribe(res => {
      this.messages = res.data.messages;
    });
  }

  markAsRead(msg: Message) {
    this.messageService.markAsRead(msg._id).subscribe(() => {
      msg.isRead = true;
    });
  }

  deleteMessage(id: string) {
    if (confirm('Are you sure you want to delete this message?')) {
      this.messageService.deleteMessage(id).subscribe(() => {
        this.messages = this.messages.filter(m => m._id !== id);
      });
    }
  }
}
