/**
 * db库封装
 */

 var MongoClient = require('mongodb').MongoClient;
 var DbUrl = 'mongodb://127.0.0.1:27017/productmanage'; //连接数据库

 var ObjectID = require('mongodb').ObjectID;

 function __connectDb(callback){

     MongoClient.connect(DbUrl, function(err,db){

         if(err){
             console.log(err);
             console.log('数据库连接失败');
             return;
         }
        callback(db);
     })
 }

 //暴露ObjectID
exports.ObjectID = ObjectID;

 /**
  * collectionname: 表名
  * json：查询条件
  * callback： 返回查询的数据
  */
//  查询数据
 exports.find = function(collectionname,json,callback){
     __connectDb(function(db){
         var result = db.collection(collectionname).find(json);

         result.toArray(function(error, data){
             db.close();    /**关闭数据库连接 */
             callback(error, data); /**拿到数据，执行回调函数 */
         })
     })
 }

//  新增数据
 exports.insert = function(collectionname,json,callback){
     __connectDb(function(db){
         db.collection(collectionname).insertOne(json,function(error,data){
             callback(error,data);
         })
     })
 }

//  修改数据
exports.update = function(collectionname,json1,json2,callback){
    __connectDb(function(db){
        db.collection(collectionname).updateOne(json1,{$set:json2},function(error,data){
            callback(error,data);
        })
    })
}

//  删除数据
exports.delete = function(collectionname,json,callback){
    __connectDb(function(db){
        db.collection(collectionname).deleteOne(json,function(error,data){
            callback(error,data);
        })
    })
}