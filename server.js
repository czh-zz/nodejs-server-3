var http = require('http')
var fs = require('fs')
var url = require('url')
const { text } = require('stream/consumers')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号\n 例:node server.js 8888')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method

    /******** 从这里开始看，上面不要看 ************/

    console.log('有新的请求发过来啦！路径（带查询参数）为：' + pathWithQuery)

    response.statusCode = 200
    //默认首页
    const filePath = path === '/' ? '/index.html' : path
    const index = filePath.lastIndexOf('.')
    //suffix是后缀
    const suffix = filePath.substring(index)
    const fileTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg'
    }
    let content
    try {
        content = fs.readFileSync(`./public${filePath}`)
    } catch (error) {
        request.statusCode = 404
        content = '你访问的页面不存在'
    }
    response.setHeader('Content-Type', `${fileTypes[suffix] || 'text/html'};charset=utf-8`)
    response.write(content)
    response.end()

    /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用Ctrl+鼠标左键点击打开 http://localhost:' + port)