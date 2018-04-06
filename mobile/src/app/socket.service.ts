import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AppSocketService {

  private _listener = new Subject();
  constructor() {
    let server = io.connect('127.0.0.1:7573');

    server.on('any:message', (val) => {
      this._listener.next( { event: 'any:message', data: val });
    });
    // Replace any:message with any message, default event:msg
    // Add more server.on( 'event:msg' ) as needed
    server.on('read:temp', (val) => {
      this._listener.next( { event: 'read:temp', data: val });
    });
  }

  on() { return this._listener.asObservable(); }

}
