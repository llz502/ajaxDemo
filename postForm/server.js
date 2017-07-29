var http = require('http')
var fs = require('fs')
var url = require('url')
// 依赖http，fs，url模块
var checkedUserName = 'llz'
var checkedPassword = '123123'
// 设置用户名和密码
var port = process.env.PORT || 8888;
// 返回当前shell的环境变量的PORT端口
var server = http.createServer(function(request,response){
// 创建Web服务器
    var temp = url.parse(request.url,true)
    // 取出请求的URL
    var path = temp.pathname
    // 取出URL的请求路径
    var query = temp.query
    // 取出URL的查询字符串
    var method = request.method
    // 取出请求的方式

    // 路由处理请求方式
    if(method === 'GET'){
    // 请求方式GET
        if(path === '/'){
            var string = fs.readFileSync('./index.html')
            response.setHeader('Content-Type','text/html;charset=utf-8')
            response.end(string) 
            // 如果路径是默认路径，则打开Index.html文档内容，
            // 则响应头是text/html，响应体则是文档内容
        }else if(path === '/style.css'){
            var string = fs.readFileSync('./style.css')
            response.setHeader('Content-Type','text/css')
            response.end(string)
            // 如果路径是/style.css，则打开style.css文档内容，
            // 则响应头是text/css，响应体则是文档内容
        }else{
            response.statusCode = 404
            response.setHeader('Content-Type','text/html;charset=utf-8')
            response.end('找不到对应路径，你需要自行修改 server.js')
            // 如果路径不是指定路径，
            // 则响应行状态码是404，表示用户不存在,响应体返回提示内容
        }

    }else if(method === 'POST'){
    // 请求方式POST
        if(path === '/login'){
        response.setHeader('Content-Type','text/html;charser=utf-8')
        // 请求路径为/login，响应头是html
        readBody(request,function(body){
            // 传入的body参数是用'&'分隔符分隔传输字段的字符串
            let parts = body.split('&')
            let username = parts[0].split('=')[1]
            let password = parts[1].split('=')[1]
            let errors = {}
            // 用字符串用'&'分割成数组，成员是字段字符串
            // 将字段字符串用'='分割成数组
            // 取出用户名和密码的值
            // 声明一个错误对象
            if(username.trim() === ''){
                errors['username'] = '用户名不能为空'
            }else if(username === checkedUserName){
                        if(password !== checkedPassword){
                        errors['password'] = '密码错误'
                        }
                    }else{
                    errors['username'] = '用户不存在'
                    } 
            if(password === ''){
                errors['password'] = '密码不能为空'
            }
            // 用户名为空字符串，则发出错误提示
            // 如果用户名正确
                // 则验证密码，密码错误，则发出错误提示
                // 如果用户名错误，则发出错误提示
            // 密码为空字符串，则发出错误提示

            // 上面代码将错误信息放入errors对象键值对里

            // 信息验证以及错误信息提示
            if(Object.keys(errors).length > 0){
                response.statusCode = 412
                var string = JSON.stringify({errors:errors})
                response.end(string)
                // 如果错误对象键值对不为0时,即存在错误信息
                // 给出响应状态码412，表示验证失败
                // 将封装了错误信息的键值对javascript对象转为JSON对象，将值转为字符串
                // 将JSON字符串作为相应体返回  
            }else{
                response.statusCode = 200
                response.end(JSON.stringify({userId:'林立镇'}))
                // 如果错误对象键值对为0时,即不存在错误信息
                // 给出响应状态码200，表示请求成功，相应体返回
                // 相应体返回JSON字符串格式的对象，键值对为userId的信息
            }

        })

        }
        // readBody验证提交信息，失败则提示错误信息，成功则返回用户信息
        console.log(method + ' ' + request.url)
    }
})
        // 创建Web服务器，对POST和GET请求方式，进行处理
        server.listen(port)
        // 服务器监听端口
        console.log('监听' + port + ' 成功，可以打开 http://localhost:' + port)
        // 打印出域名

        function readBody(request,callback){
        // 声明readBody函数，将请求字段字符串处理
            let body = []
            request.on('error',(err) => {
            console.error(err)
            }).on('data',(chunk) => {
            body.push(chunk)
            }).on('end',() => {
            body = Buffer.concat(body).toString()
            callback(body)
            })
            // 当请求触发error事件时，打印错误信息
            // 当请求触发data事件时，数据按字段传输，按队列推进到body数组里
            // 当请求触发end事件时，
                // 将body数组合并成一个字符串,缓存到Buffer缓存区，
                // 从缓存区使用'UTF-8'编码，输出字符串
                // 将body数组作为参数传入回调函数
        }
