const PORT = 8088;

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
        let pathname = url.parse(request.url).pathname;
        let realPath = path.join('dist', pathname);
        console.log(realPath);
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