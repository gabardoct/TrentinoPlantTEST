import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/Providers/Services/api.service';
import { MenuController, AlertController, ModalController } from '@ionic/angular';
import { BasicApiService } from 'src/Providers/Basic/basic-api.service';
import { LocalApiService } from 'src/Providers/Local/local-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import * as $ from 'jquery';
import { CartApiService } from 'src/Providers/Cart/cart-api.service';
import { Device } from '@ionic-native/device/ngx';
import { TouchID } from '@ionic-native/touch-id/ngx';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profileupdate',
  templateUrl: './profileupdate.page.html',
  styleUrls: ['./profileupdate.page.scss'],
})
export class ProfileupdatePage implements OnInit {

  
  logineduser: any = {};
  passwrd: any = {};
  logedUser: any;
  constructor(
      public menuCtrl: MenuController,
      public apiService: ApiService,
      public basic: BasicApiService,
      public localApi: LocalApiService,
      public cart: CartApiService,
      public route: Router,
      public alertController: AlertController,
      public location: Location,
      public modalController: ModalController,
      private activatedRoute: ActivatedRoute,
      private device: Device,
      private touchId: TouchID
    ) { }

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.logineduser = this.localApi.getuser();
  }


  updateprofile(){
  	if(!this.logineduser.name){
  		this.basic.alert('Error:', 'Enter your full name');
  	} else if(!this.logineduser.email){
  		this.basic.alert('Error:', 'Enter your email');
  	} else if(!this.logineduser.address_line_one){
  		this.basic.alert('Error:', 'Enter address line 1');
  	} else if(!this.logineduser.address_line_two){
  		this.basic.alert('Error:', 'Enter address line 2');
  	} else if(!this.logineduser.postcode){
  		this.basic.alert('Error:', 'Enter postcode');
  	} else {
  		this.basic.presentLoading();
	  	this.apiService.postdata('updateprofile', this.logineduser).subscribe((resp: any) => {
			if(resp.data==false){
				this.basic.alert('Error:', 'Something went wrong. Please try again');
			} else {
				this.localApi.setuser(resp.data);
			}
	      setTimeout(()=>{
	        this.basic.dismissloader();
	        this.dismissmodal();
	      },1000)
		}, (err: any) => {
		return false;
		});
  	}
  }



  dismissmodal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
