## 删除商品数据

在`app.js`页面添加如下代码：

```js
//删除商品
app.get('/productdelete',function(req,res){

    //获取id
    var  id=req.query.id;
    DB.deleteOne('product',{"_id":new DB.ObjectID(id)},function(err){
        if(!err){

            res.redirect('/product');
        }
    })
    //res.send('productdelete');
})
```

商品列表页修改如下：

**views/product.ejs**

```ejs
<tbody>
    <% for(var i=0;i<list.length;i++){%>
    <tr>
        <td><%=i+1%></td>
        <td><img width="100" src="<%=list[i].pic%>" alt=""/></td>
        <td><%=list[i].title%></td>
        <td><%=list[i].price%></td>
        <td><%=list[i].fee%></td>

        <td class="text-center">
            <a href="/productedit?id=<%=list[i]._id%>" class="btn btn-success">修改</a>
            <a href="/productdelete?id=<%=list[i]._id%>" class="btn btn-danger">删除</a>
       </td>
    </tr>
    <%}%>
</tbody>
```
