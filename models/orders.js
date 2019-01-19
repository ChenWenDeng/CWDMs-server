var mongoose = require('mongoose');
var orderSchema = new mongoose.Schema({
    "orderId"    : String,
    "userName"   : String,
    "phone"      : String,
    'orderStatus': String,
    'createDate' : String,
    'totalPrice' : Number,
    'addressInfo':{
    	'addressId': Number,
    	'cityName' : String,
    	'userName' : String,
    	'streeName': String,
    	'postCode' : String,
    	'tel'      : Number,
    	'isDefault': Boolean
    },
    'goodsList':[
    	{
    		"productId"      : Number,
    		"productName"    : String,
    		"salePrice"      : Number,
    		"num"            : Number,
    		"smImg"          : Array,
    		"detailsImagebag": Array,
    		"isMode"         : Boolean,
    		"checked"        : String,
    		
    	}
    ]
})

module.exports = mongoose.model('order',orderSchema)