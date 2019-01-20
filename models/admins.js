var mongoose = require('mongoose');
var adminSchema = new mongoose.Schema({
    "adminId"    : Number,
    "adminName"  : String,
	"adminPwd"   : String,
	"confirmPwd" : String,
	"eliam"      : String,
    "phone"      : String,
    'createDate' : String,
})

module.exports = mongoose.model('admin',adminSchema)