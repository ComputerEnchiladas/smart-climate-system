import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AppSocketService } from "../../app/socket.service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public temp;
  constructor(public navCtrl: NavController, private app: AppSocketService) {
    app.on().subscribe((val) => {
      switch( val.event ) {
        case 'read:temp':
          this.temp = val.data;
      }
    });
  }

}
