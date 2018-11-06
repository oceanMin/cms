## 图片上传

图片上传插件的使用

 1.`  npm install multiparty`

 2.`  var multiparty = require('multiparty');`

 3.上传图片的地方

```js
     var form = new multiparty.Form();

     form.uploadDir='upload'   上传图片保存的地址

     form.parse(req, function(err, fields, files) {

       //获取提交的数据以及图片上传成功返回的图片信息

     });
```

 4.html页面form 表单要加入` enctype="multipart/form-data"`
 
 首先，在根目录新建`upload`文件夹，用来保存上传的图片

`app.js`修改代码如下：

```js

var multiparty = require('multiparty');  /*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/

//获取表单提交的数据 以及post过来的图片
app.post('/doProductAdd',function(req,res){

    //获取表单的数据 以及post过来的图片

    var form = new multiparty.Form();

    form.uploadDir='upload'   //上传图片保存的地址     目录必须存在

    form.parse(req, function(err, fields, files) {

        //获取提交的数据以及图片上传成功返回的图片信息
        
        //console.log(fields);  /*获取表单的数据*/
        
        //console.log(files);  /*图片上传成功返回的信息*/
        var title=fields.title[0];
        var price=fields.price[0];
        var fee=fields.fee[0];
        var description=fields.description[0];
        var pic=files.pic[0].path;
        //console.log(pic);

        DB.insert('product',{
            title:title,
            price:price,
            fee,
            description,
            pic

        },function(err,data){
            if(!err){
                res.redirect('/product'); /*上传成功跳转到首页*/
            }
        })
    });
})

```

新增商品页面如下：

**views/productadd.ejs**

```ejs
<%- include public/header.ejs%>

<div class="container-fluid">
    <div class="row">
        <div class="col-sm-2">
            <%- include public/aslideleft.ejs%>
        </div>
        <div class="col-sm-10">
            <ol class="breadcrumb">
                <li class="active">商品管理
                </li>
                <li class="active">商品列表
                </li>
            </ol>
            <div class="panel panel-default">
			    <div class="panel-heading">
                  增加商品
                </div>
                <div class="panel-body">
                    <div class="table-responsive input-form">
                        <form action="/doProductAdd" method="post" enctype="multipart/form-data">
                            <ul>
                                <li>  商品名称: <input type="text" name="title"/></li>
                                <li>  商品图片: <input type="file" name="pic"/></li>
                                <li>  商品价格: <input type="text" name="price"/></li>
                                <li>  商品邮费: <input type="text" name="fee"/></li>
                                <li>
                                    商品描述:
                                    <textarea name="description" id="" cols="60" rows="8"></textarea>
                                </li>
                                <li>
                                    <br/>
                                    <button type="submit" class="btn btn-default">提交</button>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
```
> 注意：新增商品页面 `<form>` 表单中需要加入这段代码 `enctype="multipart/form-data"`，否则无法上传图片。
点击[http://localhost:3000/productadd](http://localhost:3000/productadd)浏览效果。
