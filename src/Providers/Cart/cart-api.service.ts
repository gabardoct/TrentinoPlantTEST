import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartApiService {
 locflw_cartlist: any;
 forcrtttl: any;
  constructor() {
    let mycrt = JSON.parse(localStorage.getItem(environment.storage_prefix+'cartlist'));
    if(!mycrt){
      localStorage.setItem(environment.storage_prefix+'cartlist', '[]');
    }
  }

removeCart(){
  localStorage.setItem(environment.storage_prefix+"cartlist", '[]');
}

  addcart(item,variation,selections){
    let slcTotal: any = 0;
    var productnames, prodcPrice, prdid, itemtotal, itmOnly, isvartn, isoptn;
    if (variation) {
      productnames = item.name+' - '+variation.name;
      prodcPrice = variation.price;
      itmOnly = variation.price;
      prdid = item.id+'_'+variation.id;
      isvartn = 'YES';

    } else if(selections) {
      productnames = item.name;
      prodcPrice = item.price;
      itmOnly = item.price;
      prdid = item.id+'_otpn';
      isvartn = '';
    } else {
      productnames = item.name;
      prodcPrice = item.price;
      itmOnly = item.price;
      prdid = item.id;
      isvartn = '';
    }

    if (selections) {
        var selecTTotal = 0.00;
        for(var i=0; i<selections.length; i++){
            var fil = parseFloat(selections[i].price);
            selecTTotal += fil;
        }
        var fnSlTotal = selecTTotal.toFixed(2);
        var slcTtl = parseFloat(fnSlTotal);
        slcTotal = slcTtl.toFixed(2);
        isoptn = 'YES';
        var withslpr = parseFloat(slcTotal)+parseFloat(prodcPrice);
    } else {
      isoptn = '';
      var withslpr = 0;
    }

    let item_sub_total: any = parseFloat(itmOnly) + parseFloat(slcTotal);
    console.log(slcTotal);
  	this.locflw_cartlist = JSON.parse(localStorage.getItem(environment.storage_prefix+'cartlist'));
  	if (this.locflw_cartlist.length > 0) {
            let existingCartProduct = [];
            existingCartProduct = this.filterCart(this.locflw_cartlist, item.id);
            if (existingCartProduct && existingCartProduct.length > 0 && !variation && !item.extras) {

                existingCartProduct[0].qty++;
                let prcFloat = existingCartProduct[0].qty * existingCartProduct[0].price;
                let totalpriceincr = (prcFloat).toFixed(2);
                existingCartProduct[0].total= totalpriceincr;
                
            } else {
                let totalforitem = parseFloat(prodcPrice);
                let productDetails = [{
                    'name': productnames,
                    'image': item.productImage,
                    'preorder': item.preorder,
                    'pre_time': item.preorder_text,
                    'price': prodcPrice,
                    'id': prdid,
                    'productDesc': item.description,
                    'selections': selections,
                    'productType': item.foodcategory,
                    'qty': 1,
                    'total': totalforitem *1,
                    'slcTotal': slcTotal,
                    'itemtotal': itmOnly *1,
                    'item_sub_total': item_sub_total.toFixed(2),
                    'itmOnly': itmOnly,
                    'xtras': item.extras,
                    'isvartn': isvartn,
                    'isoptn': isoptn,
                    'withslpr': withslpr
                }];
                this.locflw_cartlist.push(productDetails[0]);
            }
        } else {
            let totalforitem = parseFloat(prodcPrice);
            let productDetails = [{
                'name': productnames,
                'image': item.productImage,
                'preorder': item.preorder,
                'pre_time': item.preorder_text,
                'price': prodcPrice,
                'id': prdid,
                'productDesc': item.description,
                'selections': selections,
                'productType': item.foodcategory,
                'qty': 1,
                'total': totalforitem *1,
                'slcTotal': slcTotal,
                'itemtotal': itmOnly *1,
                'item_sub_total': item_sub_total.toFixed(2),
                'itmOnly': itmOnly,
                'xtras': item.extras,
                'isvartn': isvartn,
                'isoptn': isoptn,
                'withslpr': withslpr
            }];
            this.locflw_cartlist.push(productDetails[0]);
        }

  	localStorage.setItem(environment.storage_prefix+'cartlist', JSON.stringify(this.locflw_cartlist));
    return this.getcart();
  }
  getcart(){
  	return JSON.parse(localStorage.getItem(environment.storage_prefix+"cartlist"));
  }

  plusqnty(item){
    this.locflw_cartlist = JSON.parse(localStorage.getItem(environment.storage_prefix+'cartlist'));
    let existingCartProduct = [];
    existingCartProduct = this.filterCart(this.locflw_cartlist, item.id);
    existingCartProduct[0].qty++;
    var prcFloat = existingCartProduct[0].qty * existingCartProduct[0].price;
    let totalpriceincr = (prcFloat).toFixed(2);
    

    var itprcFloat = existingCartProduct[0].qty * existingCartProduct[0].itmOnly;
    let ittotalpriceincr = (itprcFloat).toFixed(2);
    existingCartProduct[0].itemtotal= ittotalpriceincr;

    
    var slcTotal: any  = 0;
    for (let i = 0; i < existingCartProduct[0].selections.length; i++) {
        var newsltrl = existingCartProduct[0].selections[i].price * existingCartProduct[0].qty;
        console.log(newsltrl);
        existingCartProduct[0].selections[i].total = newsltrl.toFixed(2);
        slcTotal = parseFloat(existingCartProduct[0].selections[i].total)+parseFloat(slcTotal);
    }
    existingCartProduct[0].slcTotal = slcTotal;
    let item_sub_total: any = parseFloat(totalpriceincr)+parseFloat(slcTotal);
    existingCartProduct[0].item_sub_total = item_sub_total.toFixed(2);
    
    localStorage.setItem(environment.storage_prefix+'cartlist', JSON.stringify(this.locflw_cartlist));
    return this.getcart();
  }

  minusqntyfrmprod(item){
    this.locflw_cartlist = JSON.parse(localStorage.getItem(environment.storage_prefix+'cartlist'));
    let existingCartProduct = [];
    existingCartProduct = this.filterCart(this.locflw_cartlist, item.id);
    if (existingCartProduct[0].qty > 1) {
      existingCartProduct[0].qty--;
      let prcFloat = existingCartProduct[0].qty * existingCartProduct[0].price;
      let totalpriceincr = (prcFloat).toFixed(2);
      existingCartProduct[0].total= totalpriceincr;


      let itprcFloat = existingCartProduct[0].qty * existingCartProduct[0].itmOnly;
      let ittotalpriceincr = (itprcFloat).toFixed(2);
      existingCartProduct[0].itemtotal= ittotalpriceincr;
      console.log(existingCartProduct[0].selections);
      var slcTotal: any = 0;
      for (let i = 0; i < existingCartProduct[0].selections.length; i++) {
          var newsltrl = existingCartProduct[0].selections[i].price * existingCartProduct[0].qty;
          existingCartProduct[0].selections[i].total = newsltrl.toFixed(2);
          slcTotal = parseFloat(existingCartProduct[0].selections[i].total)+parseFloat(slcTotal);
      }
      existingCartProduct[0].slcTotal = slcTotal;
      let item_sub_total: any = parseFloat(totalpriceincr)+parseFloat(slcTotal);
      existingCartProduct[0].item_sub_total = item_sub_total.toFixed(2);

    }else{
      for(let i=0; i < this.locflw_cartlist.length; i++){
        if(this.locflw_cartlist[i].id == item.id){
          this.deleteProduct(i);
          
        }
      }
    }
    
    localStorage.setItem(environment.storage_prefix+'cartlist', JSON.stringify(this.locflw_cartlist));
    return this.getcart();
  }

  deleteProduct(index) {
    this.locflw_cartlist = JSON.parse(localStorage.getItem(environment.storage_prefix+'cartlist'));
    (this.locflw_cartlist).splice(index, 1);
    localStorage.setItem(environment.storage_prefix+'cartlist', JSON.stringify(this.locflw_cartlist));
    return this.getcart();
  }

	filterCart(cartProducts, id) {
	    let returnArray = [];
	    for (let i = 0; i < cartProducts.length; i++) {
	        if (cartProducts[i].id == id) {
	            returnArray.push(cartProducts[i]);
	        }
	    }
	    return returnArray;
	}

	 getSingleQty(itm){
      let cart = this.getcart();
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id==itm) {
          return cart[i].qty;
        }
      }
    }


    getTotalCart(){
      let cart = this.getcart();
      this.forcrtttl = 0;
      for (let i = 0; i < cart.length; i++) {
        let total: any = parseFloat(cart[i].item_sub_total);
        this.forcrtttl = parseFloat(total)+parseFloat(this.forcrtttl);
      }
      return this.forcrtttl.toFixed(2);
    }

  
}
