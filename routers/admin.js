
var express = require('express');

var router = express.Router();/*可使用 express.Router 类创建模块化、可挂载的路由句柄*/

var login = require('./admin/login.js');
var product = require('./admin/product.js');
var user = require('./admin/user.js');

//自定义中间件，判断登录状态
router.use(function(req,res,next){
    if(req.url === '/login' || req.url === '/login/doLogin'){ /**判断有没有登录 */
        next();
    }else{
        if(req.session.userinfo&&req.session.userinfo.username !== ''){
            req.app.locals['userinfo'] = req.session.userinfo;  /**配置全局变量，可以在任何模板中使用 */
            next();
        }else{
            res.redirect('/admin/login')
        }
    }
})

router.use('/login',login);
router.use('/product',product);
router.use('/user',user);

module.exports = router;