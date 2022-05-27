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
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  logmobile: any;
  postdata: any = {};
  tknsvdata: any = {};
  isnewUser: any = false;
  regt: any = {};
  logedpass: any;
  isPassrd: any = false;
  mytoken: any;
  logedUser: any;
  isTouchidDevice: any = false;
  isdeviceuser: any;
  isshowfldsnup: any = true;
  isTncdesc: any = false;
  ispvcdesc: any = false;
  allProducts: any;
  adnmregdata: any;
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
    this.isdeviceuser = this.localApi.getuserdevice();
    this.touchId.isAvailable().then(res => {
      if(this.isdeviceuser){
        this.openTouchid();
      }
    },err => {
      console.error('TouchID is not available', err)
    });
  }

  gotncpg(val){
    this.postdata.pgtype = val;
    this.basic.presentLoading();
    this.apiService.postdata('getallcms', this.postdata).subscribe((resp: any) => {
    this.allProducts = resp.data;
      console.log(this.allProducts);
      setTimeout(()=>{
        this.basic.dismissloader();
        this.isshowfldsnup = false;
        this.isTncdesc = true;
      },1000)
    }, (err: any) => {
    return false;
    });
  }

  closetncpvc(){
    this.isshowfldsnup = true;
    this.isTncdesc = false;
  }

  openTouchid(){
    this.touchId.verifyFingerprint('Scan your fingerprint please').then(res => {
      this.isdeviceuser = this.localApi.getuserdevice();
      console.log('Ok', res);
      this.localApi.setuser(this.isdeviceuser);
      this.setUserTokens();
      this.dismissmodal();
    },err => {
      console.error('Error', err);
    });
  }





  checkMobile(){
    this.adnmregdata = '';
    var str = this.logmobile;
    var res = str.substring(0, 2);
  	if(!this.logmobile){
  		this.basic.alert('Error:', 'Enter your registered mobile number');
  	} else if(this.logmobile.length < 10){
      this.basic.alert('Error:', 'Please enter a valid mobile number');
    } else {
  		this.basic.presentLoading();
	  	this.postdata.mobile = this.logmobile;
	  	this.apiService.postdata('checllogin', this.postdata).subscribe((resp: any) => {
        console.log(resp);
			if(resp.data==false){
				this.isnewUser = true;
			} else {
        if(resp.data.device=='ADMIN'){
          this.adnmregdata = resp.data;
          // this.regt.fullname = resp.data.name;
          this.isnewUser = true;
        } else {
          this.isPassrd = true;
        }
			}
	      setTimeout(()=>{
	        this.basic.dismissloader();
	      },1000)
		}, (err: any) => {
		return false;
		});
  	}
  }

  loginnow(){
    if(!this.logedpass){
      this.basic.alert('Error:', 'Enter your password');
    } else {
      this.basic.presentLoading();
      this.postdata.mobile = this.logmobile;
      this.postdata.password = this.logedpass;
      this.apiService.postdata('login', this.postdata).subscribe((resp: any) => {
      if(resp.data==false){
        this.basic.alert('Error:', 'Password did not match!');
      } else {
        this.localApi.setuser(resp.data);
        // this.appcmp.callog();
        this.setUserTokens();
        this.dismissmodal();
      }
        setTimeout(()=>{
          this.basic.dismissloader();
        },1000)
      }, (err: any) => {
      return false;
      });
    }
  	
  }


  setUserTokens(){
    this.mytoken = localStorage.getItem('userdevicetoken');
    this.logedUser = this.localApi.getuser();
    this.tknsvdata.token = this.mytoken;
    this.tknsvdata.device = 'Mobile';
    this.tknsvdata.device_type = this.device.platform;
    this.tknsvdata.user = 'Customer';
    this.tknsvdata.user_id = this.logedUser.id;
    this.apiService.postdata('setusertokens', this.tknsvdata).subscribe((resp: any) => {
      console.log('Set Token', resp)
    }, (err: any) => {
    return false;
    });
  }


  signupnow(){
    this.mytoken = localStorage.getItem('userdevicetoken');
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  	if(!this.regt.fullname){
  		this.basic.alert('Error:', 'Enter your full name');
  	} else if(!this.regt.email){
      this.basic.alert('Error:', 'Enter your email address (for recover your password)');
    } else if(!re.test(this.regt.email)){
      this.basic.alert('Error:', 'Please enter a valid email');
    } else if(!this.regt.password){
  		this.basic.alert('Error:', 'Enter a password');
  	} else {
  		this.postdata.mobile = this.logmobile;
  		this.postdata.otherdetails = this.regt;
  		this.basic.presentLoading();
	  	this.postdata.mobile = this.logmobile;

      this.postdata.token = this.mytoken;
      this.postdata.device = 'Mobile';
      this.postdata.device_type = this.device.platform;

      this.postdata.adnmregdata = this.adnmregdata;
      if(this.adnmregdata){
        this.postdata.isupd = 'OLD';
      } else {
        this.postdata.isupd = 'NEW';
      }
      // this.adnmregdata

	  	this.apiService.postdata('signup', this.postdata).subscribe((resp: any) => {
			console.log('User', resp);
			if(resp.data==false){
				this.basic.alert('Error:', 'Something went wrong. Please try again');
			} else {
				this.localApi.setuser(resp.data);
        this.setUserTokens();
				this.dismissmodal();
			}
	      setTimeout(()=>{
	        this.basic.dismissloader();
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


  forgotpassword(){
    console.log(this.logmobile);
    this.basic.presentLoading();
    this.apiService.postdata('forgotpassword', this.logmobile).subscribe((resp: any) => {
      console.log('Return', resp);
        this.basic.alert('Info:', 'We have emailed you a link to help you reset your password.');
        setTimeout(()=>{
          this.basic.dismissloader();
        },1000)
    }, (err: any) => {
    return false;
    });
  }





}
