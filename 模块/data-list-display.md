## 数据库商品列表显示

打开`app.js`文件，修改代码如下：

```js
app.get('/product',function(req,res){
    //连接数据库查询数据
    MongoClient.connect(DbUrl,function(err,db){
        if(err){
            console.log(err);
            console.log('数据库连接失败');
            return;
        }
        var result=db.collection('product').find();

        result.toArray(function(error,data){
            if(error){
                console.log(error);
                return;
            }
            db.close();

            //console.log(data);

            res.render('product',{

                list:data
            });

        })

    })

})

```

新建 views/product.ejs，添加如下代码：

**views/product.ejs**

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
                    搜索
                </div>
                <div class="panel-body">
                    <form role="form" class="form-inline">
                        <div class="form-group">
                            <label for="name">名称</label>
                            <input type="text" class="form-control" id="name" placeholder="请输入名称">
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-default">开始搜索</button>
                        </div>
                    </form>
                </div>
            </div>
            <!--
                列表展示
            -->
            <div class="table-responsive">
                <table class="table table-striped ">
                    <thead>
                    <tr>
                        <th>编号</th>
                        <th>图标</th>
                        <th>名称</th>
                        <th>价格</th>
                        <th>邮费</th>
                       
                        <th class="text-center">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                <% for(var i=0;i<list.length;i++){%>
					 <tr>
                        <td><%=i+1%></td>
                        <td>图标</td>
                        <td><%=list[i].title%></td>
                        <td><%=list[i].price%></td>
                         <td><%=list[i].fee%></td>

                        <td class="text-center">
                            <a href="#" class="btn btn-success">修改</a>
                            <a href="#" class="btn btn-danger">删除</a>
                       </td>
                    </tr>
                    <%}%>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

</body>
</html>
```
