import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/Providers/Services/api.service';
import { MenuController, AlertController, ModalController } from '@ionic/angular';
import { BasicApiService } from 'src/Providers/Basic/basic-api.service';
import { LocalApiService } from 'src/Providers/Local/local-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import * as $ from 'jquery';
import { CartApiService } from 'src/Providers/Cart/cart-api.service';
import { ItemdetailsPage } from '../itemdetails/itemdetails.page';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
imgpath: any;
  allProducts: any = [];
  postdata: any = {};
  title: any;
  pgtype: any;
  logedUser: any;
  frstdis: any = {};
  frsord: any = {};
  carttotal: any;
  ftrbtnms: any;
  active: any;
  isOffer: any = true;
  winsr: any;
  nownrs: any = true;
  isseeoffer: any = true;
  getappsetng: any;
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
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.getappsetng = this.localApi.getappseting();
    this.ftrbtnms = [
      {name:'Offers', active:false, clas: 'leftsidehalf'},
      {name:'Winners', active:false, clas: 'rightsidehlf'}
    ];
    this.active = 'Offers';
    this.carttotal = this.cart.getTotalCart();
    this.allProducts = [];
    this.logedUser = this.localApi.getuser();
    console.log('USR', this.logedUser);
    if(this.logedUser){
      this.basic.presentLoading();
      this.apiService.postdata('getspecialcoupon', this.logedUser.id).subscribe((resp: any) => {
        console.log('asd', resp);

        if(resp.data.order==''){
          this.frsord = {
            description: 'Welcome to '+environment.appname+'. Enjoy a 10% OFF on your first order with us.',
            heading: '10% off. First Order Discount',
            id: '',
            image: 'firsttimeoff_statick.jpg',
            min_order_amount: '1.00',
            off_type: 'Percent',
            off_value: '10',
            offer_code: 'FIRST10'
          }
          this.allProducts.push(this.frsord);
        }
        console.log('CHKSPD', resp.data.discount);
        if(resp.data.discount){
          this.frstdis = {
            description: 'This discount is specially for you, you wont see this discount on other users apps. Coz you are Special.',
            heading: resp.data.discount+'% off. Special Discount (Only For You)',
            id: '',
            image: 'specialoffer_statick.jpg',
            min_order_amount: '1.00',
            off_type: 'Percent',
            off_value: resp.data.discount,
            offer_code: 'SPECIAL10'
          }
          this.allProducts.push(this.frstdis);
        }

        setTimeout(()=>{
          this.basic.dismissloader();
          this.getallProducts();
        },1000)
      }, (err: any) => {
      return false;
      });
    } else {

      this.frsord = {
        description: 'Welcome to Rapchik. Enjoy a 10% OFF on your first order with us.',
        heading: '10% off. First Order Discount',
        id: '',
        image: 'firsttimeoff_statick.jpg',
        min_order_amount: '1.00',
        off_type: 'Percent',
        off_value: '10',
        offer_code: 'RPCNWOFF'
      }
      this.allProducts.push(this.frsord);




      this.getallProducts();
    }
    






    this.imgpath = environment.imagepath;
    this.pgtype = this.activatedRoute.snapshot.paramMap.get('pgtype');
    if(this.pgtype == 'noapply'){
      this.title = 'Offers';
      this.isseeoffer = true;
    } else {
      this.title = 'Apply Coupon';
      this.isseeoffer = false;
    }
  	
  }

  doRefresh(event) {
    console.log('Begin async operation');
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 2000);
  }


  getallProducts(){
    this.basic.presentLoading();
    this.apiService.postdata('getoffer', this.postdata).subscribe((resp: any) => {
    // this.allProducts = resp.data;
    let newdata = resp.data;
    for(let i=0; i < newdata.length; i++){
      this.allProducts.push(newdata[i]);
    }

    // this.allProducts.push(resp.data);
      console.log(this.allProducts);
      setTimeout(()=>{
        this.basic.dismissloader();
      },1000)
    }, (err: any) => {
    return false;
    });


    
  }

  appltythis(val){
    var carttotal = parseFloat(this.carttotal);
    var min_order_amount = parseFloat(val.min_order_amount);
    if(carttotal < min_order_amount){
      var morePr = parseFloat(val.min_order_amount) - parseFloat(this.carttotal);
      this.basic.alert('Info:', 'Minimum amount required to redeem this offer is '+this.getappsetng.currency_symbol+val.min_order_amount+', please add another '+this.getappsetng.currency_symbol+morePr.toFixed(2)+' to your order');
    } else {
      this.localApi.setapplyedofr(val);
      this.location.back();
    }
  }


  toggleClass(item){
    this.active = item.name;
    if(item.name=='Offers'){
      this.isOffer = true;
    } else {
      this.isOffer = false;
    }
  }



}
