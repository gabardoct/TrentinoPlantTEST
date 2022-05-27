import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/Providers/Services/api.service';
import { MenuController, AlertController, ModalController, NavController } from '@ionic/angular';
import { BasicApiService } from 'src/Providers/Basic/basic-api.service';
import { LocalApiService } from 'src/Providers/Local/local-api.service';

import { Router } from '@angular/router';
import { Location } from "@angular/common";
import * as $ from 'jquery'
import { CartApiService } from 'src/Providers/Cart/cart-api.service';
import { ItemdetailsPage } from '../itemdetails/itemdetails.page';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Device } from '@ionic-native/device/ngx';
import { environment } from '../../environments/environment';
import { VariationPage } from '../variation/variation.page';
import { ItmoptionsPage } from '../itmoptions/itmoptions.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
	slideOpts = {
		initialSlide: 0,
		autoplay: true,
		loop: true,
		speed: 1000,
		effect: 'fade'
	};
	
	  slideOptsmenu = {
	    initialSlide: 0,
	    autoplay: false,
	    loop: false,
	    speed: 2000,
	    effect: 'fade',
	    spaceBetween: 10,
	    slidesPerView: 2.2,
	    slidesPerColumn: 1,
	    pagination: false,
      // pager: true,
      // autoHeight: true
	  };
	category: any;
	imgpath: any;
	mycart: any;
	cartcount: any;
	nowqty:any;
	nowval: any;
  carttotal: any;
  banners: any;
  postdata: any = {};
  getappsetng: any;
  isShopclose: any = false;
  closetxt: any;
  restrictns_lbl: any;
  restrictns_txt: any;
  isRestricktn: any = false;
  logedUser: any;
  nowapversion: string;
  ipbroptions: any = {};
  sesinlefct: any = false;
  appstngs: any;
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
    public nav: NavController,
    private appVersion: AppVersion,
    private iab: InAppBrowser,
    private device: Device
  ) {

    
  	
  }

  ngOnInit() {

	  this.imgpath = environment.imagepath;
    this.gethomecat();
    

    this.apiService.getdata('getappsetings', '').subscribe((resp: any) => {
      this.localApi.setappseting(resp.data);
      this.appstngs = resp.data;
      if(this.appstngs.pop_head){
        this.pophomepalrt();
      }
      console.log('ssss', resp.data);
      if(resp.data.opentime.toDayShop=='CLOSE'){
        this.isShopclose = true;
        this.closetxt = resp.data.opentime;
      }
      if(resp.data.restrictions_label){
        this.restrictns_lbl = resp.data.restrictions_label;
        this.restrictns_txt = resp.data.restrictions_text;
        this.isRestricktn = true;
      }
      var self = this;
      this.appVersion.getVersionNumber().then(function (data) {
        console.log('versionNow', data);
        console.log('AndroidApi', resp.data.iosversion);
        console.log('iOSApi', resp.data.androidversion);

        if(self.device.platform=='Android'){
          if(resp.data.androidversion > data){
            self.appupdatesandroid();
          }
        } else {
          if(resp.data.iosversion > data){
            self.appupdatesios();
          }
        }
        
      });

    }, (err: any) => {
    return false;
    });
    
  }


  async pophomepalrt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      // header: 'Alert',
      subHeader: this.appstngs.pop_head,
      message: this.appstngs.pop_desc,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async appupdatesandroid() {  
    const alert = await this.alertController.create({
      header: 'Update Available!',
      cssClass: 'my-custom-class',
      message: 'Please update the app to get the latest features, offers and discounts.',
      buttons: [
        {
          text: 'Not Now',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'OK',
          handler: () => {
            const browser = this.iab.create(environment.playstore, '_system');
          }
        }
      ]
    });
    await alert.present();
  }



  async appupdatesios() {  
    const alert = await this.alertController.create({
      header: 'Update Available!',
      cssClass: 'my-custom-class',
      message: 'Please update the app to get the latest features, offers and discounts.',
      buttons: [
        {
          text: 'Not Now',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'OK',
          handler: () => {
            const browser = this.iab.create(environment.appstore, '_system');
          }
        }
      ]
    });
    await alert.present();
  }


  

  noshopping(){
    this.isShopclose = false;
    if(this.restrictns_lbl){
      this.isRestricktn = true;
    }
  }

  alrestclose(){
    this.isRestricktn = false;
  }

  ionViewWillEnter(){
    this.mycart = this.cart.getcart();
    this.carttotal = this.cart.getTotalCart();
    this.cartcount = this.mycart.length;
    this.getappsetng = this.localApi.getappseting();
    this.localApi.removedeltime();
    let views = localStorage.getItem('bktohome');
    if(views){
      this.gethomecat();
    }

    this.basic.getObservable().subscribe((data) => {
        this.totlaofcart();
    });

  }


  viewsearpg(){
    this.route.navigate(['/itemsearch']);
  }

  
  totlaofcart(){
    this.mycart = this.cart.getcart();
    this.carttotal = this.cart.getTotalCart();
    this.cartcount = this.mycart.length;
  }

  gethomecat(){
    localStorage.removeItem("bktohome");
  	this.totlaofcart();
    this.basic.presentLoading();
	  this.apiService.getdata('gethomecategory', '').subscribe((resp: any) => {
		this.category = resp.data;
    console.log(this.category);
    
		for(let i=0; i < this.category.length; i++){
			let prd = this.category[i].prd;
	        for(let j=0; j < prd.length; j++){
	        	let single = prd[j];
		        let qty = this.cart.getSingleQty(single.id);
		        this.category[i].prd[j].qty = qty;
            if(this.category[i].prd[j].variation.length > 0){
              this.category[i].prd[j].crtbtn = 'Select';
            } else if(this.category[i].prd[j].options.length > 0) {
              this.category[i].prd[j].crtbtn = 'Select';
            } else {
              this.category[i].prd[j].crtbtn = 'Add to cart';
            }
            let chly = [];
            for(let c=0; c < single.chilly; c++){
              chly.push(1);
            }
            this.category[i].prd[j].chilli = chly;
            if(this.category[i].prd[j].contain[0] != ''){
              this.category[i].prd[j].alrgy = 'OK';
            } else {
              this.category[i].prd[j].alrgy = '';
            }
	    	}
	    }
      setTimeout(()=>{
        this.sesinlefct = true;
        console.log(this.basic.isLoading);
        // this.route.navigate(['/nonetwork']);
        if(this.basic.isLoading){
          this.basic.dismissloader();
        }
      },5000)
      
	}, (err: any) => {
    this.basic.dismissloader();
	return false;
	});

    this.apiService.postdata('getbanner', this.postdata).subscribe((resp: any) => {
      this.banners = resp.data;
      console.log('BNR', this.banners);
    }, (err: any) => {
    return false;
    });
    
  }

  doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      this.gethomecat();
      event.target.complete();
    }, 2000);
  }

  async openvariations(itmid, itm){
    const modal = await this.modalController.create({
      component: VariationPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'itmid': itmid,
        'item': itm,
     },
     backdropDismiss: true
    });
    modal.onDidDismiss().then((data) => {
      console.log('Variation', itm);
      if(data.data){
        // this.totlaofcart();
      }
    });
    return await modal.present();
  }



  async openoptions(itmid, itm){
    const modal = await this.modalController.create({
      component: ItmoptionsPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'itmid': itmid,
        'item': itm,
     },
     backdropDismiss: true
    });
    modal.onDidDismiss().then((data) => {
      console.log('Options', itm);
      if(data.data){
        // this.totlaofcart();
      }
    });
    return await modal.present();
  }

  addtoCart(itm, itmid){
    
    if(itm.variation.length > 0){
      this.openvariations(itmid, itm);
    } else if(itm.options.length > 0) {
      this.openoptions(itmid, itm);
    } else {
      $('#addcartbtn_'+itmid+'_'+itm.id).hide();
      $('#qtycartbtn_'+itmid+'_'+itm.id).show();
      $('#itmqty_'+itmid+'_'+itm.id).html('1');
      this.cart.addcart(itm,'','');
    }
  	
  	// // this.gethomecat();
    this.totlaofcart();
  }

  minusqty(itm, itmid){
  	this.nowqty = '';
  	this.nowval = '';
  	this.nowqty = $('#itmqty_'+itmid+'_'+itm.id).html();
  	if(this.nowqty == 1){
  		$('#addcartbtn_'+itmid+'_'+itm.id).show();
		$('#qtycartbtn_'+itmid+'_'+itm.id).hide();
  	}
  	this.nowval = parseInt(this.nowqty)-1;
  	$('#itmqty_'+itmid+'_'+itm.id).html(this.nowval);
  	this.cart.minusqntyfrmprod(itm);
    this.totlaofcart();
    
  }
  addqty(itm, itmid){
  	this.nowqty = '';
  	this.nowval = '';
  	this.nowqty = $('#itmqty_'+itmid+'_'+itm.id).html();
  	this.nowval = parseInt(this.nowqty)+1;
  	$('#itmqty_'+itmid+'_'+itm.id).html(this.nowval);
    $('#itmqty_'+itmid+'_'+itm.id).delay(1500).animate({text:this.nowval},5000);
  	this.cart.plusqnty(itm);
    this.totlaofcart();
  	// this.gethomecat();
  }

  async openDetailsItem(itm) {
    const modal = await this.modalController.create({
      component: ItemdetailsPage,
      cssClass: 'my-custom-class',
      componentProps: {
	      'item': itm,
	   },
	   backdropDismiss: true
    });
    return await modal.present();
  }

  seeall(item){
    if(item.issubcategory){
      this.route.navigate(['/subcategory/'+item.id+'/'+item.name]);
    } else {
      this.route.navigate(['/products/'+item.id+'/0/'+item.name]);
    }
  }
  gocategory(item){
    console.log(item);
    if(item.type){
      if(item.type == 'category'){
        this.route.navigate(['/products/'+item.category.id+'/0/'+item.category.name]);
      } else if(item.type == 'contact'){
        this.route.navigate(['/contactus']);
      } else {
        this.route.navigate(['/offers/noapply']);
      }
    }
  }

  viewmycart(){
    this.route.navigate(['/mycart']);
    // this.route.navigate(['/orderdetails/'+resp.data+'/New']);
  }

  openAlergyInfo(val){
    if(val.allergy_info){
      this.basic.alert('Allergy Info:', val.allergy_info);
    }
  }

}
