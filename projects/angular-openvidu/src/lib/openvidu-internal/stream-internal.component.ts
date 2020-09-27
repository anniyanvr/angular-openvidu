import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

// Sanitize URL
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

// Stream object
import { Stream } from 'openvidu-browser';

import { OpenViduDirective, StreamEvent } from '../openvidu.directive';

import { SafeUrlPipe } from '../utils/safe-url.pipe';

export abstract class StreamInternalComponent implements OnInit {

	@Output() sourceAdded: EventEmitter<void> = new EventEmitter<void>();

	// HTML elements
	abstract videoStream: ElementRef;

	// Video attributes
	videoSrc: SafeUrl;
	muted: boolean;

	// Protected variables
	protected stream: Stream;

	constructor(protected safeUrlPipe: SafeUrlPipe, protected renderer: Renderer2) {}

	@Input('stream')
	get stream(): Stream { return this.stream; }
	set stream(val: Stream) {
		if (val === null || val === undefined) {
			return;
		}

		this.stream = val;

		// Loop until you get a WrStream
		const int = setInterval(() => {
			if (this.stream.getWrStream()) {
				this.videoSrc = this.safeUrlPipe.transform(this.stream.getVideoSrc());
				console.log('Video tag src = ' + this.videoSrc);

				clearInterval(int);

				// Fix: manually call OnInit
				this.ngOnInit();
			}
		}, 1000);

		// If local, mute video
		this.muted = this.stream.isLocalMirrored();

		// If local, flip screen
		this.renderer.setElementClass(this.videoStream.nativeElement, 'flip-screen', this.stream.isLocalMirrored());

		this.setStreamCallback(val);

		// If local, show nice name
		// const dataObj: ParticipantData = JSON.parse(this.stream.getParticipant().data);
		// this.name.nativeElement.textContent = (this.stream.isLocalMirrored()) ? this._intl.you : dataObj.username;
	}

	ngOnInit(): void {
		this.videoStream.nativeElement.addEventListener('loadeddata', () => {
			// Emit event
			this.sourceAdded.emit();
		}, false);

		if (!this.stream) {
			return;
		}

		// Listen for changes in the src
		// For example, if the participants wants to change camera
		this.stream.addEventListener('src-added', () => {
			this.videoSrc = this.safeUrlPipe.transform(this.stream.getVideoSrc());
		});
	}

	protected abstract setStreamCallback(val: Stream): any;

}
