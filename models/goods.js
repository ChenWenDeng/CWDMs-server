var mongoose = require('mongoose')
var Schema = mongoose.Schema

var productSchema = new Schema({
    "productId":Number,
	"productName":String,
	"salePrice":Number,
    "productImage":String,
    "direction":String,
	"createDate":String,
    "typeName": Array,
    "details":[
        {
            "productId":Number,
            "productName":String,
            "salePrice":Number,
            "num":Number,
            "smImg":Array,
            "detailsImagebag":Array,
            "isMode":Boolean,
            "checked":String,
			"colours":Array,
			"sizes":Array
        }
    ]
})

module.exports = mongoose.model('goods',productSchema)