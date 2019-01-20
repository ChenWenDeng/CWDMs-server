var express = require('express');
var router = express.Router();

// var users = require('../models/users');
var admins = require('../models/admins');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//后台管理员登录
router.post('/login',function(req,res,next){
	console.log('login')
	let param = {
		adminName  : req.body.adminName,
		adminPwd   : req.body.adminPwd,
		confirmPwd : req.body.confirmPwd
	}

	admins.findOne(param,function(err,doc){
		if(err){
			res.json({
				status: '1',
				msg: err.message
			})
		}else{
			if(!doc){
				res.json({
					status: '10002',
					msg: '',
					result:'用户或密码错误'
				})
			}
			if(doc){
				res.cookie("adminId",doc.adminId,{
					path:'/',
					maxAge:1000*60*60*12
				})
				res.cookie("adminName",doc.adminName,{
					path:'/',
					maxAge:1000*60*60*12
				})
				// req.session.admin = doc;
				res.json({
					status: '0',
					msg: '',
					result:{
						adminName : doc.adminName,
						adminId : doc.adminId
					}
				})
			}
		}
	})
})

//登录后拿到用户名和id
router.get("/checkLogin", function (req, res, next) {
  console.log('成功进入checkLogin')
  if (req.cookies.adminId) {
    console.log('成功进入checkLogin2')
    res.json({
      status: '0',
      msg: '',
      // result: req.cookies.userName,
      result:{
        adminId   : req.cookies.adminId,
        adminName : req.cookies.adminName
      }
    })
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
})

//管理员登出接口
router.post("/logout", function (req, res, next) {
  res.cookie("adminId", "", {
    path: "/",
    maxAge: -1
  })
  res.json({
    status: "0",
    masg: '',
    result: 'suc'
  })
})

module.exports = router;
