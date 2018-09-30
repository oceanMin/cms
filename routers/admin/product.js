var express = require('express');

var router = express.Router();

const multiparty = require('multiparty');/*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/

var DB = require('../../modules/db.js');

var fs = require('fs');

router.get('/',function(req,res){
    DB.find('product',{},function(err,data){
        // console.log(data);
        res.render('admin/product/index',{
            list: data
        });
    })
})

//新增商品
router.get('/add',function(req,res){
    // res.send('新增商品');
    res.render('admin/product/add');
})

//获取表单提交的数据 以及post过来的图片
router.post('/doAdd',function(req,res){
    //获取表单的数据 以及post传过来的图片
    var form = new multiparty.Form();
    // console.log(222,form);

    form.uploadDir = 'upload';  //上传图片保存的地址  目录必须存在

    form.parse(req, function(err,fields,files){
        //获取提交的数据以及图片上传成功返回的图片信息
        
        // console.log(fields);  /*获取表单的数据*/
        // console.log(files);  /*图片上传成功返回的信息*/
        
        var title = fields.title[0];
        var pic = files.pic[0].path;
        var price = fields.price[0];
        var fee = fields.fee[0];
        var description = fields.description[0];

        DB.insert('product',{
            title: title,
            price: price,
            pic,
            fee,
            description
        },function(error,data){
            if(!error){
                res.redirect('/admin/product');   //上传成功跳转到列表页
            }
        })
    })
})

// 修改商品
router.get('/edit',function(req,res){
    //获取get传值 id
    var id = req.query.id;
    DB.find('product',{"_id":new DB.ObjectID(id)},function(error,data){

        // console.log(data);
        res.render('admin/product/edit',{
            list: data[0]
        });        
    })  
})

//执行修改的路由
router.post('/doEdit',function(req,res){
    var form = new multiparty.Form();
    form.uploadDir = 'upload';  //上传图片保存的地址

    form.parse(req,function(err,fields,files){
        // console.log('111111111',files.pic[0]);

        var _id = fields._id[0];
        var title = fields.title[0];
        var price = fields.price[0];
        var fee = fields.fee[0];
        var description = fields.description[0];
        
        var originalFilename = files.pic[0].originalFilename;  //修改了图片
        var pic = files.pic[0].path;

        if(originalFilename){
            var setData={
                title,
                price,
                fee,
                description,
                pic
            };
        }else{
            var setData={
                title,
                price,
                fee,
                description,
            };
            fs.unlink(pic); //删除生成的临时文件
        }
        DB.update('product',{"_id":new DB.ObjectID(_id)},setData,function(err,data){
            if(!err){
                res.redirect('/admin/product');
            }
        })
    })
})


// 删除商品
router.get('/delete',function(req,res){
    // res.send('删除商品');
    //获取get传值 id
    var id = req.query.id;
    DB.delete('product',{"_id":new DB.ObjectID(id)},function(error,data){
        if(!error){
            res.redirect('/admin/product');
        }        
    }) 
})

module.exports = router;