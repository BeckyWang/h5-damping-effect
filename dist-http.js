const PORT = 8087;

const http = require('http');
const url = require('url');
const fs = require('fs');
const mine = require('./mine').types;
const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const xmlParser = require('koa-xml-body');
const Router = require('koa-router');

const app = new Koa();

const router = new Router({
    prefix: '/learning/api/v1'
});

router
    .get('/iframe/:iframeID', async ctx => {
        ctx.body = {
            id: ctx.params.iframeID,
            content: `<p><span style="color: rgb(43, 43, 43); font-family: simsun, arial, helvetica, clean, sans-serif; font-size: 14px; text-align: justify; text-indent: 28px; background-color: rgb(255, 255, 255);">据微博@中国国际航空消息，6月7日，国航香港-北京CA110航班，起飞后不久因舱内出现异味，机组决定返航，飞机于20:53顺利降落在香港机场。经地面机务人员系统检查，确认为空调组件故障，不影响飞行安全。6月8日1:53，航班再次起飞，于4:27平安降落在首都机场。此次故障造成了航班长时间延误，给旅客带来不愉快的感受，国航深表歉意！并对广大旅客的支持和理解，表示衷心感谢！</span></p>
            <p><span style="color: rgb(43, 43, 43); font-family: simsun, arial, helvetica, clean, sans-serif; font-size: 14px; text-align: justify; text-indent: 28px; background-color: rgb(255, 255, 255);"></span></p>
            <p><img src="../images/iframe/19.jpg" /></p>
            <p style="text-align: center;">
                <span style="font-size: 22.0px;background-color: #ffffff;color: #ff0000;">S码 建议【90斤以下】</span><br>
                <span style="font-size: 22.0px;background-color: #ffffff;color: #ff0000;">M码 建议【90-100斤】</span><br>
                <span style="font-size: 22.0px;background-color: #ffffff;color: #ff0000;">L码 建议【100-110斤】</span><br>
                <span style="font-size: 22.0px;background-color: #ffffff;color: #ff0000;">XL码建议【110-120斤】</span><br>
                <span style="font-size: 22.0px;background-color: #ffffff;color: #ff0000;">2XL码建议【120-130斤】</span><br>
                <span style="font-size: 22.0px;background-color: #ffffff;color: #ff0000;">本店所有商品一件起批！！！【拍一件请联系客服】</span>
            </p>
            <p style="margin-top: 16px; margin-bottom: 14px; white-space: normal; box-sizing: inherit; line-height: 28px; color: rgb(61, 70, 77); font-family: Pingfang SC, STHeiti, Lantinghei SC, Open Sans, Arial, Hiragino Sans GB, Microsoft YaHei, WenQuanYi Micro Hei, SimSun, sans-serif; background-color: rgb(255, 255, 255);">
                <span style="font-size: 18px; color: rgb(0, 176, 240);"><strong>网页中频繁更改的内容，应该从后台动态获取，对内容较多的请求通常采用富文本编辑器来编辑内容，从而自带了样式。因此同一份内容若需要在pc和移动端同时展示，有许多差异：</strong></span>
            </p>
            <p>
                <img src="../images/iframe/3.jpg" />
                <span>这是描述</span>
                <img src="../images/iframe/6.jpg" style="float: right;" />
            </p>
            <p><img src="../images/iframe/24.jpg" /></p>
            <p><img src="../images/iframe/2.jpg" /></p>
            <p class="test"><img src="../images/iframe/8.jpg" /></p>
            <p>
                <img src="http://img.baidu.com/hi/jx2/j_0015.gif" />
                <img src="http://img.baidu.com/hi/jx2/j_0074.gif" width="64" height="53" />
            </p>`
        };
    });

app
    .use(async(ctx, next) => {
        try {
            await next();
        } catch (err) {
            // will only respond with JSON
            console.log(err);
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                message: err.message
            };
        }
    })
    .use(xmlParser({
        encoding: 'utf8'
    }))
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

http.createServer(function(request, response) {
    if (/api/.test(request.url)) {
        app.callback()(request, response);
    } else {
        const pathname = url.parse(request.url).pathname;
    if (path.normalize(decodeURI(pathname)) !== decodeURI(pathname)) {
        response.statusCode = 403;
        response.end();
        return;
    }
        const realPath = path.join('dist', pathname);
        let ext = path.extname(realPath);
        ext = ext ? ext.slice(1) : 'unknown';
        fs.exists(realPath, function(exists) {
            if (!exists) {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });

                response.write('This request URL ' + pathname + ' was not found on this server.');
                response.end();
            } else {
                fs.readFile(realPath, 'binary', function(err, file) {
                    if (err) {
                        response.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        response.end(err);
                    } else {
                        let contentType = mine[ext] || 'text/plain';
                        response.writeHead(200, {
                            'Content-Type': contentType
                        });
                        response.write(file, 'binary');
                        response.end();
                    }
                });
            }
        });
    }
}).listen(PORT);

console.log('Server running at port: ' + PORT + '.');