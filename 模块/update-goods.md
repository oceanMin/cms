## 修改商品

在app.js页面中添加如下代码：

```js
//执行修改的路由
app.post('/doProductEdit',function(req,res){
    var form = new multiparty.Form();

    form.uploadDir='upload'  // 上传图片保存的地址

    form.parse(req, function(err, fields, files) {
        //获取提交的数据以及图片上传成功返回的图片信息
        var _id=fields._id[0];   /*修改的条件*/
        var title=fields.title[0];
        var price=fields.price[0];
        var fee=fields.fee[0];
        var description=fields.description[0];

        var originalFilename=files.pic[0].originalFilename;
        var pic=files.pic[0].path;

        if(originalFilename){  /*修改了图片*/
            var setData={
                    title,
                    price,
                    fee,
                    description,
                    pic
            };
        }else{ /*没有修改图片*/
            var setData={
                title,
                price,
                fee,
                description
            };
            //删除生成的临时文件
            fs.unlink(pic);
        }
        DB.update('product',{"_id":new DB.ObjectID(_id)},setData,function(err,data){
              if(!err){
                  res.redirect('/product');
              }
        })
    });
```

编辑商品页面如下：

**views/productedit.ejs**

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
                  编辑商品
                </div>
                <div class="panel-body">
                    <div class="table-responsive input-form">
                        <form action="/doProductEdit" method="post" enctype="multipart/form-data">
                            <ul>
                                <li>  商品名称: <input type="text" name="title" value="<%=list.title%>"/></li>

                                <li>  商品图片: <input type="file" name="pic"/>
                                    <br/> <br/>
                                   　　　　 <img src="<%=list.pic%>" width="100"/>
                                    <br/> <br/>
                                </li>
                                <li>  商品价格: <input type="text" name="price" value="<%=list.price%>"/></li>
                                <li>  商品邮费: <input type="text" name="fee"  value="<%=list.fee%>"/></li>
                                <li>
                                    商品描述:
                                    <textarea name="description" id="" cols="60" rows="8"><%=list.description%></textarea>
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

>注意：新增和修改页面`<form>`标签需要加上这段代码 ` enctype="multipart/form-data"`，才能实现图片上传。
