(function () {
    let c = {};
    c.sleep = function (numberMillis) {
        let now = new Date();
        let exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return;
        }
    };

    c.getRoute = function (hash) {
        hash = hash || window.location.hash;
        let rep = /(\/[0-9a-zA-Z\u4e00-\u9fa5]+)/g;
        return decodeURI(hash).match(rep);
    };

    c.loadData = function (url) {
        $.ajax({
            type: 'get',
            url: url,
            cache: true,
            dataType: 'json',
            success: function (json) {
                $("title").html(function () {
                    return json['title'];
                });

                $('header ul.nav').html(function () {
                        let ret = "";
                        for (let i = 0; i < json['head'].length; i++) {
                            let j = json['head'][i];
                            switch (j['type']) {
                                case "active":
                                    ret += '<li class="active"><a href="' + j['link'] + '">' + j['title'] + '</a></li>';
                                    break;
                                case "normal":
                                    ret += '<li><a href="' + j['link'] + '">' + j['title'] + '</a></li>';
                                    break;
                                case "return":
                                    ret += '<li><a href="/">' + j['title'] + '</a></li>';
                                    break;
                            }
                        }
                        return ret;
                    }
                );


                $('section#intro div.intro').html(function () {
                        return json['intro'];
                    }
                );

                $('main#main div.container').html(function () {
                        let ret = "";
                        for (let i = 0; i < json['main'].length; i++) {
                            let j = json['main'][i];
                            ret += '<div class="offset-md-2 col-md-8 animate-box">' + j + '</div>';
                        }
                        return ret;
                    }
                );

                $('section#services div.row').html(function () {
                        let ret = "";
                        for (let i = 0; i < json['services'].length; i++) {
                            let j = json['services'][i];
                            ret += '<div class="col-md-4 animate-box">';
                            ret += '<div class="service">';
                            ret += '<div class="service-icon">';
                            ret += '<i class="' + j['icon'] + '"></i>';
                            ret += '</div>';
                            ret += '<h2>' + j['title'] + '</h2>';
                            ret += '<p>' + j['content'] + '</p>';
                            ret += '</div>';
                            ret += '</div>';
                        }
                        return ret;
                    }
                );

                $('footer#footer p.pull-left small').html(function () {
                        return json['footer']['left'];
                    }
                );

                $('footer#footer p.pull-right small').html(function () {
                        return json['footer']['right'];
                    }
                );
                $('ul.nav a').on('click',c.navOnClick);

                $(function () {
                    let i = 0;
                    $('.animate-box').waypoint(function (direction) {
                        if (direction === 'down' && !$(this.element).hasClass('animated')) {
                            i++;
                            $(this.element).addClass('item-animate');
                            setTimeout(function () {

                                $('body .animate-box.item-animate').each(function (k) {
                                    let el = $(this);
                                    setTimeout(function () {
                                        el.addClass('fadeInUp animated');
                                        el.removeClass('item-animate');
                                    }, k * 200, 'easeInOutExpo');
                                });
                            }, 100);
                        }
                    }, {offset: '85%'});
                });
            },
            error: function (data) {
                console.log(data.status + ' ' + data.statusText);
                c.Modal_show(data.status + ' ' + data.statusText, data.responseText);
            }
        });
    };

    c.getLang = function () {
        return navigator.language;//获取浏览器配置语言，支持非IE浏览器
    };

    c.route = function (route) {
        c.loadData(
            '/data' + route[0] + '_' + c.getLang() + '.json'
        );
    };
    c.Modal_show = function (title, body) {
        title = title || '';
        body = body || '';
        $('h5#ModalLabel').html(title);
        $('div.modal-body').html(body);

        $('div#Modal').modal('show');
    };

    c.navOnClick = function(){
        $('ul.nav li').removeClass('active');
        $(this).parent().addClass('active');

        c.route(c.getRoute($(this).attr('href')));
    };

    let r = c.getRoute();
    console.log(r);
    if (r != null)
        c.route(r);

    window.app = c;
})();
