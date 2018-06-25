$(document).ready(() => {
    const RANGE_TOP = 100;

    let start = null,
        last_distance = 0;

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
            $('.head-text').html('下拉，返回商品基本信息');
        } else if (move_distance >= RANGE_TOP) {
            $('.head-text').html('释放，查看商品基本信息');
        }
    });

    $('.pageB').on('touchend', e => {
        const cur_move = e.changedTouches[0].pageY - start;
        last_distance += cur_move;
        const slideHeight = $('.slide').outerHeight() - $(window).height();

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
            window.parent.postMessage('prev', '*');
            $('.head-text').html('下拉，返回商品基本信息');
            $('.wrapper').css({
                'transform': 'translateY(0)',
                'transition-duration': '0ms'
            });
        }
    });
});