import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/Providers/Services/api.service';
import { MenuController, AlertController, ModalController } from '@ionic/angular';
import { BasicApiService } from 'src/Providers/Basic/basic-api.service';
import { LocalApiService } from 'src/Providers/Local/local-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import * as $ from 'jquery';
import { CartApiService } from 'src/Providers/Cart/cart-api.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-addaddress',
  templateUrl: './addaddress.page.html',
  styleUrls: ['./addaddress.page.scss'],
})
export class AddaddressPage implements OnInit {
  data: any = {};
  postdata: any = {};
  logedUser: any;
  @Input() exist: any;
  dtattp: any;
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
    this.logedUser = this.localApi.getuser();
    if(this.exist){
      this.data = this.exist;
      this.dtattp = 'Update';
    } else {
      this.dtattp = 'New';
    }
  }



  addnewaddress(){
  	if(!this.data.address_type){
  		this.basic.alert('Error:', 'Enter address type');
  	} else if(!this.data.address_line_one){
  		this.basic.alert('Error:', 'Enter address line 1');
  	} else if(!this.data.address_line_two){
  		this.basic.alert('Error:', 'Enter address line 2');
  	} else if(!this.data.postcode){
  		this.basic.alert('Error:', 'Enter your postcode');
  	} else {
  		this.postdata.userid = this.logedUser.id;
  		this.postdata.otherdetails = this.data;
      this.postdata.dtattp = this.dtattp;
  		this.basic.presentLoading();
	  	this.apiService.postdata('addnewaddress', this.postdata).subscribe((resp: any) => {
			if(resp.data){
				this.dismissmodal();
			} else {
				this.basic.alert('Error:', 'Something went wrong');
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

}
