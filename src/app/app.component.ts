import { Component } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Angular OpenVidu Demo';

  // Join form
  sessionId: string;
  participantId: string;
  wsUrl: string;

  showOpenvidu = false;
  sessionClosed = false;

  constructor(public snackBarService: MatSnackBar) {
    // Generate fake participant info
    this.generateParticipantInfo();
  }

  private generateParticipantInfo(): void {
    this.sessionId = 'SessionA';
    this.participantId = 'Participant' + Math.floor(Math.random() * 100);
    this.wsUrl = 'wss://127.0.0.1:8443/';
  }

  sendForm(): void {
    // Setup AngularIpenVidu
    this.showOpenvidu = true;
    this.sessionClosed = false;
  }

  goBack(): void {
    this.showOpenvidu = false;
    this.sessionClosed = false;
  }

  onRoomConnected(): void {
    this.snackBarService.open('Connected to room', null, {
      duration: 2000
    });
  }

  onErrorRoom(): void {
    this.showOpenvidu = false;
    this.snackBarService.open('Room error', null, {
      duration: 2000
    });
  }

  onRoomClosed(): void {
    this.snackBarService.open('Room closed', null, {
      duration: 2000
    });
  }

  onLostConnection(): void {
    this.snackBarService.open('Lost connection', null, {
      duration: 2000
    });
  }

  onParticipantJoined(participantEvent: any): void {
    if (participantEvent.participantId != null) {
      this.snackBarService.open('Participant id: ' + participantEvent.participantId + ' has entered', null, {
        duration: 2000
      });
    }
  }

  onParticipantLeft(participantEvent: any): void {
    if (participantEvent.participantId !== null) {
      this.snackBarService.open('Participant id: ' + participantEvent.participantId + ' has left', null, {
        duration: 2000
      });
    }
  }

  onErrorMedia(): void {
    this.snackBarService.open('There was a media error', null, {
      duration: 2000
    });
  }

  onLeaveRoom(): void {
    this.sessionClosed = true;
    this.snackBarService.open('Left room', null, {
      duration: 2000
    });
  }

  onNewMessage(messageEvent: any): void {
    console.log(messageEvent);
    if (messageEvent.message !== null && messageEvent.participant.getId() !== this.participantId) {
      this.snackBarService.open('Message received: ' + messageEvent.message, null, {
        duration: 2000
      });
    }
  }

  onCustomNotification(onb: any): void {
    this.snackBarService.open('Custom notification received', null, {
      duration: 2000
    });
  }
}

