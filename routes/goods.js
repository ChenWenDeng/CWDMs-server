var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var goods = require('../models/goods');

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
	
	let goodsModel = goods.find(params).skip(skip).limit(pageSize);
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

module.exports = router;