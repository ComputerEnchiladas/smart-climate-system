import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppSocketService } from "../../app/socket.service";
import { Http } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public temp;
  public setTemp;
  public setDelta;
  private host = 'http://10.10.47.140:7573/temp';
  constructor(public navCtrl: NavController, private app: AppSocketService, private http: Http) {
    this.app.on().subscribe((val) => {
      switch( val['event'] ) {
        case 'read:temp':
          this.temp = val['data'];
      }
    });
  }
  onTempChanged(){
    this.http.post(this.host, {temp: this.setTemp})
      .toPromise()
      .then( function(){

      })
  }
  onDeltaChanged(){
    this.http.post(this.host, {delta: this.setDelta})
      .toPromise()
      .then( function(){

      })
  }
}
