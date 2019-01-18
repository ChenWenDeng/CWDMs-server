var mongoose = require('mongoose')
var Schema = mongoose.Schema

var productSchema = new Schema({
    "productId":Number,
	"productName":String,
	"salePrice":Number,
    "productImage":String,
    "direction":String,
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
        }
    ]
})

module.exports = mongoose.model('goods',productSchema)