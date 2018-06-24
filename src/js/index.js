import '../index.html';
import '../scss/index.scss';

$(document).ready(() => {
    const RANGE_BOTTOM = 100,
        RANGE_TOP = 100;
    const clientWidth = $(window).width();

    let slideHeight = $('.slide').outerHeight() - $(window).height(),
        start = null,
        last_distance = 0;

    const iframe = $('#detailIframe');
    let iframeHtml = null; //富文本片段

    //iframe 高度自适应
    const getIframeHeight = iframeEl => {
        const iframeWin = iframeEl.contentWindow || iframeEl.contentDocument.parentWindow;
        if (iframeWin.document.body) {
            return iframeWin.document.body.scrollHeight || iframeWin.document.documentElement.scrollHeight;
        }
    };

    //显示iframe
    const showIframe = () => {
        iframe.attr('srcdoc', iframeHtml);
        iframe.on('load', () => {
            $('.loading').hide();
            $('.iframe-info').show();
            iframe.height(getIframeHeight(iframe[0]));
            slideHeight = $('.slide').outerHeight() - $(window).height();
            last_distance = 0;
        });
    };

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
            $('.pageB .head-text').html('下拉，返回商品基本信息');
            //获取富文本内容，如果有直接显示，否则显示loading，再异步获取
            if (iframeHtml) {
                showIframe();
            } else {
                $.ajax({
                    url: '/learning/api/v1/iframe/111',
                    type: 'get',
                    success: function(result) {
                        iframeHtml = `
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset="utf-8" />
                                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                <title>Detail Page</title>
                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                <style>
                                    * {margin: 0;padding: 0;}
                                    body {background-color: #fff;}        
                                    img {max-width: ${clientWidth}px;}
                                </style>
                            </head>
                            <body>${result.content}</body>
                            <script type="text/javascript" src="http://localhost:8088/dist/lib/jquery.min.js"></script>
                            <script type="text/javascript" src="./src/js/iframe.js"></script>
                            </html>
                            `;
                        showIframe();
                    }
                });
            }

            $('.wrapper').css({
                'transform': 'translateY(0)',
                'transition-duration': '0ms'
            });
        }
    });

    $('.pageB').on('touchstart', e => {
        start = e.changedTouches[0].pageY;
    });

    $('.pageB').on('touchmove', e => {
        const cur_move = e.changedTouches[0].pageY - start;
        const move_distance = last_distance + cur_move;

        $('.wrapper').css({
            'transform': `translateY(${move_distance}px)`,
            'transition-duration': '0ms'
        });

        if (move_distance > 0 && move_distance < RANGE_TOP) {
            $('.pageB .head-text').html('下拉，返回商品基本信息');
        } else if (move_distance >= RANGE_TOP) {
            $('.pageB .head-text').html('释放，查看商品基本信息');
        }
    });

    $('.pageB').on('touchend', e => {
        const cur_move = e.changedTouches[0].pageY - start;
        last_distance += cur_move;

        if (last_distance <= -slideHeight) {
            $('.wrapper').css({
                'transform': `translateY(${-slideHeight}px)`,
                'transition-duration': '400ms'
            });
            last_distance = -slideHeight;
        } else if (last_distance > 0 && last_distance < RANGE_TOP) {
            $('.wrapper').css({
                'transform': 'translateY(0)',
                'transition-duration': '400ms'
            });
            last_distance = 0;
        } else if (last_distance >= RANGE_TOP) {
            //切换到上一个页面
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

    $(window).resize(() => {
        slideHeight = $('.slide').outerHeight() - $(window).height();
    });
});

// if (module.hot) {
//     module.hot.accept();
// }