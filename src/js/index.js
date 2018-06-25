import '../index.html';
import '../css/index.scss';

$(document).ready(() => {
    const RANGE_BOTTOM = 100;
    const clientWidth = $(window).width(),
        clientHeight = $(window).height();

    let slideHeight = $('.slide').outerHeight() - $(window).height(),
        start = null,
        last_distance = 0;

    const iframe = $('#detailIframe');
    let iframeHtml = null; //富文本片段

    $('.pageA').on('touchstart', e => {
        start = e.changedTouches[0].pageY;
    });

    $('.pageA').on('touchmove', e => {
        const cur_move = e.changedTouches[0].pageY - start;
        const move_distance = last_distance + cur_move;

        $('.wrapper').css({
            'transform': `translateY(${move_distance}px)`,
            'transition-duration': '0ms'
        });

        if (move_distance < -slideHeight && move_distance > -(slideHeight + RANGE_BOTTOM)) {
            $('.pageA .foot-text').html('继续上拉查看商品详情');
        } else if (move_distance <= -(slideHeight + RANGE_BOTTOM)) {
            $('.pageA .foot-text').html('释放查看商品详情');
        }
    });

    $('.pageA').on('touchend', e => {
        const cur_move = e.changedTouches[0].pageY - start;
        last_distance += cur_move;

        if (last_distance > 0) {
            $('.wrapper').css({
                'transform': 'translateY(0)',
                'transition-duration': '400ms'
            });
            last_distance = 0;
        } else if (last_distance < -slideHeight && last_distance > -(slideHeight + RANGE_BOTTOM)) {
            $('.wrapper').css({
                'transform': `translateY(${-slideHeight}px)`,
                'transition-duration': '400ms'
            });
            last_distance = -slideHeight;
        } else if (last_distance <= -(slideHeight + RANGE_BOTTOM)) {
            //切换到下一个页面
            $('.pageA').hide();
            $('.pageB').show();
            $('.wrapper').css({
                'transform': 'translateY(0)',
                'transition-duration': '0ms'
            });

            //获取富文本内容，如果有直接显示，否则显示loading，再异步获取
            if (!iframeHtml) {
                $('.loading').show();
                $.ajax({
                    url: '/learning/api/v1/iframe/111',
                    type: 'get',
                    success: function(result) {
                        const newHtml = result.content.replace(/<img.*?\/>/g, match => {
                            return match.replace('src', 'src="./images/iframe/loading.gif" data-src');
                        });
                        iframeHtml = `
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset="utf-8" />
                                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                <title>Detail Page</title>
                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                <link rel="stylesheet" href="./css/iframe.css">
                                <style>
                                    body {height: ${clientHeight}px;}        
                                    img {max-width: ${clientWidth}px;}
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <div class="wrapper">
                                        <div class="slide">
                                            <div class="head-more">
                                                <p class="head-text">下拉，返回商品基本信息</p>
                                            </div>
                                            <div class="main">
                                                ${newHtml}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </body>
                            <script type="text/javascript" src="./lib/jquery.min.js"></script>
                            <script type="text/javascript" src="./js/iframe.js"></script>
                            </html>
                            `;
                        iframe.height(clientHeight);
                        iframe.attr('srcdoc', iframeHtml);
                        $('.loading').hide();
                        $('.iframe-info').show();
                    }
                });
            }
        }
    });

    $(window).resize(() => {
        slideHeight = $('.slide').outerHeight() - $(window).height();
    });

    window.addEventListener('message', rs => {
        if (rs.data === 'prev') {
            $('.pageB').hide();
            $('.pageA').show();
            $('.pageA .foot-text').html('继续上拉查看商品详情');

            slideHeight = $('.slide').outerHeight() - $(window).height();
            last_distance = -slideHeight;

            $('.wrapper').css({
                'transform': `translateY(${-slideHeight}px)`,
                'transition-duration': '0ms'
            });
        }
    });
});