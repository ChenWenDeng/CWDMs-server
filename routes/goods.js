var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var goods = require('../models/goods');

require('./../util/util');

//连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/eend');

mongoose.connection.on("connected",function(){
    console.log("后台管理系统连接数据库成功");
})

mongoose.connection.on("error",function(){
    console.log("后台管理系统连接数据库失败");
})

mongoose.connection.on("disconnected",function(){
    console.log("后台管理系统与数据库断开连接");
})


//商品列表接口
router.post('/',function(req,res,next){
	let page = req.body.page;
	let pageSize = req.body.pageSize;
	let skip = (page-1) * pageSize;
	let sort = -1 ;
	let params = {};
	
	let tatolCount = 0; //商品列表总数量
	goods.find({},function(err1,doc1){
		if(err1){
			res.json({
				status: '1',
				msg: err1.message
			})
		}else{
			tatolCount=doc1.length
		}
	})
	
	let goodsModel = goods.find(params).skip(skip).limit(pageSize).sort({'createDate':sort});
	goodsModel.exec(function(err,doc){
		if(err){
			res.json({
				status: '1',
				msg: err.message
			})
		}else{
			res.json({
				status: '0',
				msg: '',
				tatolCount:tatolCount,
				count: doc.length,
				list:doc,
			})
		}
	})
})


router.get('/goodsCount',function(req,res,next){
	let goodsCont = 0;
	goods.find({},function(err,doc){
		if(err){
			res.json({
				status: '1',
				msg: err.message
			})
		}else{
			res.json({
				status: '0',
				msg: '',
				goodsCont: doc.length,
			})
		}
	})
})


// //商品列表接口
// router.post('/',function(req,res,next){
// 	let page = req.body.page;
// 	let pageSize = req.body.pageSize;
// 	let skip = (page-1) * pageSize;
// 	let params = {};
// 	
// 	let tatolCount = 0; //商品列表总数量
// 	goods.find({},function(err1,doc1){
// 		if(err1){
// 			res.json({
// 				status: '1',
// 				msg: err1.message
// 			})
// 		}else{
// 			tatolCount=doc1.length
// 		}
// 	})
// 	
// 	let goodsModel = goods.find(params).skip(skip).limit(pageSize);
// 	goodsModel.exec(function(err,doc){
// 		if(err){
// 			res.json({
// 				status: '1',
// 				msg: err.message
// 			})
// 		}else{
// 			res.json({
// 				status: '0',
// 				msg: '',
// 				tatolCount:tatolCount,
// 				count: doc.length,
// 				list:doc,
// 			})
// 		}
// 	})
// })

//删除商品接口
router.post("/delGoods",function(req,res,next){
	let productId = req.body.productId;
	console.log('productId==='+productId)
	goods.remove({productId:productId},function(err,doc){
		if (err) {
			res.json({
				status: '1',
				msg: err.massage,
				result: ''
			})
		} else {
			res.json({
				status: '0',
				msg: '',
				result: 'suc'
			})
		}
	})
})

//搜索商品接口
router.post("/searchGoods",function(req,res,next){
	let productName = req.body.productName;
	let page        = req.body.page;
	let pageSize    = req.body.pageSize;
	let skip        = (page-1) * pageSize;
	let searchCount=0;//搜索商品总数
	console.log(productName);
	console.log(page);
	console.log(pageSize);
	const reg = new RegExp(productName, 'i')
	
	let searchGoods = goods.find({
		$or:[
			{productName : {$regex : reg}},
			// {typeName : {$regex : reg}},
		],
	},function(err,doc){
		if(err){
			res.json({
				status: '1',
				msg: err.message
			})
		}else{
			searchCount = doc.length;
			console.log('searchCount==='+searchCount)
			if(doc){
				searchGoods.skip(skip).limit(pageSize).exec(function(err1,doc1){
					if(err1){
						res.json({
							status: '1',
							msg: err1.message
						})
					}else{
						res.json({
							status: '0',
							msg: '',
							searchCount:searchCount,
							count: doc1.length,
							list:doc1,
						})
					}
				})
			}
		}
	})
	
})


//添加商品
router.post("/test",function(req,res,next){
	res.json({
		status: '0',
		msg: '',
		result:'scu'
	})
})


//添加商品
router.post("/addGoods",function(req,res,next){
	if(req.body.productName){
		let productName = req.body.productName
		let salePrice = req.body.salePrice
		let direction = req.body.direction
		
		let coloursStr = req.body.colours
		let sizesStr = req.body.sizes
		let searchTextStr = req.body.searchText
		
		var fileList1 = req.body.fileList1
		var fileList2 = req.body.fileList2
		var fileList3 = req.body.fileList3
// 		console.log('productName==='+productName)
// 		console.log('salePrice==='+salePrice)
// 		console.log('direction==='+direction)
// 		console.log(fileList1)
// 		console.log(fileList2)
// 		console.log(fileList3)
		
		var platform = '588';
		var r1 = Math.floor(Math.random()*10)
		var r2 = Math.floor(Math.random()*10)
		
		var sysDate = new Date().Format('yyyyMMddhhmmss');
		var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
		var productId = platform + r1 + sysDate + r2;
		
		var smImg=[];
		
		let detailsImagebag=[];
		
		let colours = [];
		let sizes   = [];
		let typeName= [];
		
		colours  = coloursStr.split("，");
		sizes 	 = sizesStr.split(",");
		typeName = searchTextStr.split("，");
		 

		for(var i=0; i<fileList2.length;i++){
			smImg.push(fileList2[i].url)
		}
		for(var i=0; i<fileList3.length;i++){
			detailsImagebag.push(fileList3[i].url)
		}
		
		let object = {
			productId : productId,
			productName : productName,
			salePrice : salePrice,
			num : 1,
			smImg:smImg,
			detailsImagebag:detailsImagebag,
			colours:colours,
			sizes:sizes
		}

		let details=[];

		details.push(object)

		let obj = {
			productId : productId,
			productName : productName,
			salePrice : salePrice,
			direction : direction,
			productImage:fileList1[0].url,
			createDate : createDate,
			details:details,
			typeName:typeName
		}
		console.log(obj)
		
		goods.create(obj)
		res.json({
			status: '0',
			msg: '',
			result:'suc'
		})
	}
})



// //添加商品
// router.post("/addGoods",function(req,res,next){
// 	if(req.body.productName){
// 		let productName = req.body.productName
// 		let salePrice = req.body.salePrice
// 		let direction = req.body.direction
// 		
// 		let coloursStr = req.body.colours
// 		let sizesStr = req.body.sizes
// 		
// 		var fileList1 = req.body.fileList1
// 		var fileList2 = req.body.fileList2
// 		var fileList3 = req.body.fileList3
// // 		console.log('productName==='+productName)
// // 		console.log('salePrice==='+salePrice)
// // 		console.log('direction==='+direction)
// // 		console.log(fileList1)
// // 		console.log(fileList2)
// // 		console.log(fileList3)
// 		
// 		var platform = '588';
// 		var r1 = Math.floor(Math.random()*10)
// 		var r2 = Math.floor(Math.random()*10)
// 		
// 		var sysDate = new Date().Format('yyyyMMddhhmmss');
// 		var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
// 		var productId = platform + r1 + sysDate + r2;
// 		
// 		var smImg=[];
// 		
// 		let detailsImagebag=[];
// 		
// 		let colours=[];
// 		let sizes=[];
// 		
// 		colours = coloursStr.split(",");
// 		sizes = sizesStr.split(",");
// 		 
// 
// 		for(var i=0; i<fileList2.length;i++){
// 			smImg.push(fileList2[i].url)
// 		}
// 		for(var i=0; i<fileList3.length;i++){
// 			detailsImagebag.push(fileList3[i].url)
// 		}
// 		
// 		let object = {
// 			productId : productId,
// 			productName : productName,
// 			salePrice : salePrice,
// 			num : 1,
// 			smImg:smImg,
// 			detailsImagebag:detailsImagebag,
// 			colours:colours,
// 			sizes:sizes
// 		}
// 
// 		let details=[];
// 
// 		details.push(object)
// 
// 		let obj = {
// 			productId : productId,
// 			productName : productName,
// 			salePrice : salePrice,
// 			direction : direction,
// 			productImage:fileList1[0].url,
// 			createDate : createDate,
// 			details:details
// 		}
// 		console.log(obj)
// 		
// 		goods.create(obj)
// 		res.json({
// 			status: '0',
// 			msg: '',
// 			result:'suc'
// 		})
// 	}
// })

module.exports = router;