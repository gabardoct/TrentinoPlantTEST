import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Location } from "@angular/common";
import { BasicApiService } from 'src/Providers/Basic/basic-api.service';
import { MenuController, AlertController, ModalController } from '@ionic/angular';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-nonetwork',
  templateUrl: './nonetwork.page.html',
  styleUrls: ['./nonetwork.page.scss'],
})
export class NonetworkPage implements OnInit {
isOnline: any = false;
  constructor(
  	private network: Network,
  	public location: Location,
  	public basic: BasicApiService,
  	public menuCtrl: MenuController
  	) { }

  ngOnInit() {
  	this.menuCtrl.enable(false);
  	if(this.basic.isLoading){
  		this.basic.dismissloader();
  	}
  	// watch network for a connection
	let connectSubscription = this.network.onConnect().subscribe(() => {
		this.isOnline = true;
	  console.log('network connected!');
	  // We just got a connection but we need to wait briefly
	   // before we determine the connection type. Might need to wait.
	  // prior to doing any api requests as well.
	  setTimeout(() => {
	    this.location.back();
	  }, 3000);
	});
  }


}
