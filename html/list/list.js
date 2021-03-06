function closeWin() {
    summer.closeWin()
}

function nofind(_this, type) {
    src = "../../img/default_img.png"
    _this.src = src
    _this.onerror = null;
}

function cloneObjectFn(obj) { // 对象复制
    return JSON.parse(JSON.stringify(obj))
}
var firstFlag = true;
summerready = function () {
    $summer.fixStatusBar($summer.byId('header'));
    var platform = $summer.os;
    window.ip = summer.getStorage("ip");
    var thirdMenu = summer.pageParam.thirdMenu ? summer.pageParam.thirdMenu : [];
    window.pageSize = 1;
    window.myScroll = undefined;
    var initParams = cloneObjectFn(summer.pageParam);

    var viewModel = {
        listArr: ko.observableArray([]),
        cgnBName: ko.observableArray([]),
        cgnFName: ko.observableArray([]),
        cgnMApplyModelName: ko.observableArray([]),
        cgnMApplyPositionName: ko.observableArray([]),
        cgnMBrandName: ko.observableArray([]),
        cgnMFieldsName: ko.observableArray([]),
        cgnMProductName: ko.observableArray([]),
        isZeroF:ko.observable(false),
        mgCName: ko.observableArray([]),
        cgnSuName: ko.observableArray([]),
        cgnFNameItem: ko.observable(''),
        totalPage: ko.observable(''),
        thirdMenu: ko.observableArray(thirdMenu),
        isDBVisible:ko.observable(true),
        isCGVisible:ko.observable(false),
        openWin: function (options, data) {
            summer.openWin({
                "id": "detail",
                "url": "html/detail/detail.html",
                "pageParam": {
                    options: options
                }
            });
        },
        openSearch: function () {
            summer.openWin({
                "id": "search",
                "url": "html/search/search.html"
            });
        },
        refresh:function(){
            //alert(viewModel.isZeroF());
            setTimeout(function(){
                queryPage(1);
            },200)
            return true;
        },

        filterSearch: function () {
            queryPage(1);
            $('.filter-wp').hide();
            $('.drop').hide();
        },
        toggleF: function () {
            $('.filter-wp').toggle();
            $('.drop').toggle();

        },
        clearChoosen: function () {
            summer.pageParam = cloneObjectFn(initParams);
            $('.filter-wp li').removeClass('on');
        },
        changeFilters: function (data, obj, event) {
            for (i in data) {
                summer.pageParam.options[i] = data[i];
            }
            if ($(event.target).hasClass('on')) {
                summer.pageParam.options[i] = '';
                $(event.target).removeClass('on');
                return;
            }
            $(event.target).addClass('on').siblings('li').removeClass('on');
        }
    }
    window.viewModel = viewModel;
    $('.pull_icon').addClass('loading');
    $('.more span').text('加载中...');
    $('.drop').on('click', function () {
        var $this = $(this);
        $this.next().removeClass('limith');
    })
    ko.applyBindings(viewModel);
    window.mycall = function () {
        window.myScroll = new JRoll('#swrapper', {
            preventDefault: false,
            mouseWheel: true,
            momentum: true,
            fadeScrollbars: true,
            useTransform: true,
            useTransition: true,
            click: true,
            tap: true
        })
        myScroll.on('scrollStart', function () {
            console.log('scrollStart');
        })
        myScroll.on('scroll', function () {
            console.log('scroll');
            if (this.y < (this.maxScrollY)) {
                $('.pull_icon').addClass('flip');
                $('.pull_icon').removeClass('loading');
                $('.more span').text('释放加载...');
            } else {
                $('.pull_icon').removeClass('flip loading');
                $('.more span').text('上拉加载...')
            }
        })
        myScroll.on('scrollEnd', function () {
            console.log('scrollEnd');
            if (pageSize >= viewModel.totalPage()) {
                $('.more i').hide();
                $('.more span').text('没有更多了');
                return;
            }
            if ($('.pull_icon').hasClass('flip')) {
                $('.pull_icon').addClass('loading');
                $('.more span').text('加载中...');
                console.log('pullupA')
                pullUpAction();
            }
        })
        myScroll.on('refresh', function () {
            if ($('.scroller').height() < $('#swrapper').height()) {
                $('.more').hide();
            }
            $('.more').removeClass('flip loading');
            $('.more span').text('上拉加载...');
        })

        function pullUpAction() {
            console.log('请求')
            pageSize++;
            if (pageSize <= viewModel.totalPage()) {
                queryPage(pageSize);
            } else {

            }
        }

        if ($('.scroller').height() < $('#swrapper').height()) {
            $('.more').hide();
        }
    }
    $('.pull_icon').addClass('flip').addClass('loading');
    $('.more span').text('加载中...');

    //window.updateFilter = true;
    function queryPage(pageSize, category) {
        if (pageSize) {
            window.pageSize = pageSize;
        }
        if(pageSize==1&&myScroll){
        	myScroll.scrollTo(0, 0, 200, 'easing');
        }
        if (category) {
            summer.pageParam.options['mgCName'] = category.mgCName;
        }
		viewModel.cgnFNameItem(summer.pageParam.options['mgCName']);
        var callback = 'getcgnmaterial';
        var url = '/ieop_base_mobile/mfrontmallcgnsolr/getcgnmaterial';
        if(viewModel.isZeroF()){
            summer.pageParam.options['isCgnStockStatus'] = '1';
        }else {
            delete summer.pageParam.options['isCgnStockStatus']
        }

        var enc_conditions = p_page_params_con_dataj_enc(summer.pageParam.options, {
            "pageIndex": pageSize,
            "pageSize": 12
        }, {});
        p_async_post(ip + url, enc_conditions, callback );

    }

    queryPage(pageSize, thirdMenu[0]);
    $('#changeView').on('click', function () {
        $('#smallPic').toggle();
        $('#bigPic').toggle();
        mycall();
        myScroll.scrollTo(0, 0, 200, 'easing');

    })
    $('#thirdMenu').on('click', '.item', function () {
        var $this = $(this);
        queryPage(1, {mgCName: $this.text()});
        myScroll.scrollTo(0, 0, 200, true);
        //$this.addClass('on').siblings().removeClass('on');
    })
    $('.drop').on('click', function () {
        $('.filter-wp').hide();
        $('.drop').hide();
    })
    $('.filter-item .fr').on('click', function () {
        var $this = $(this);
        $this.find('i').toggleClass('rotate-180');
        $this.parent().next().toggleClass('limith');
    })
}
var myScrollMenu;

function getcgnmaterial(responseJSON) {
    window.data = responseJSON.retData.data;
    if(firstFlag){
    	var navigation = responseJSON.retData.navigation;
    	var tmpArr = [];
	    for (var i = 0, len = navigation.mgCName.length; i < len; i++) {
	        if (navigation.mgCName[i] != '') {
	        	navigation.mgCName[i] =  $.trim(navigation.mgCName[i]);
	            tmpArr.push({mgCName: $.trim(navigation.mgCName[i])});
	        }
	    }
	    viewModel.thirdMenu(tmpArr);
    	function notNull(item){
	    	return item != '';
	    }
	    viewModel.cgnBName(navigation.cgnBName.filter(notNull));
	    viewModel.cgnFName(navigation.cgnFName.filter(notNull));
	    viewModel.cgnMApplyModelName(navigation.cgnMApplyModelName.filter(notNull));
	    viewModel.cgnMApplyPositionName(navigation.cgnMApplyPositionName.filter(notNull));
	    viewModel.cgnMBrandName(navigation.cgnMBrandName.filter(notNull));
	    viewModel.cgnMFieldsName(navigation.cgnMFieldsName.filter(notNull));
	    viewModel.cgnMProductName(navigation.cgnMProductName.filter(notNull));
	    viewModel.mgCName(navigation.mgCName.filter(notNull));
	    viewModel.cgnSuName(navigation.cgnSuName.filter(notNull));
	    firstFlag = false;
    }
    if (!myScrollMenu) {
        myScrollMenu = new JRoll('#menu', {
            scrollX: true,
            click: true
        });
    } else {
        //myScrollMenu.refresh();
        $('#thirdMenu').css('transform', 'translate(0, 0)')
    }
    //window.updateFilter = false;
    viewModel.totalPage(responseJSON.pageParams.totalCount);
    var cgnMCodes = "";
    var cgnFCodes = "";
    var mCodeM = {};
    var fCodeM = {};
    for (var i = 0; i < data.length; i++) {
        mCodeM[data[i].cgnMCode] = data[i].cgnMCode;
        fCodeM[data[i].cgnFCode] = data[i].cgnFCode;
        // codes = codes + data[i].cgnMCode +"#";
    }
    for (var i in mCodeM) {
        cgnMCodes = cgnMCodes + i + "#";
    }
    for (var i in fCodeM) {
        cgnFCodes = cgnFCodes + i + "#";
    }
    var p_conditions = {"fCodes": cgnFCodes.substring(0, cgnFCodes.length - 1)};
    p_conditions["mCodes"] = cgnMCodes.substring(0, cgnMCodes.length - 1);

    var page_params = {"pageIndex": 1, "pageSize": 20};  //分页
    var sortItem = {};
    var data1 = p_page_params_con_dataj_enc(p_conditions, page_params, sortItem);
    var ret = p_async_post(ip + '/ieop_base_mobile/mfrontmalltransferorder/getpriceandstock', data1, 'getpriceandstock');

}


function getsumaterial(responseJSON) {
    window.data = responseJSON.retData.data;
    var navigation = responseJSON.retData.navigation;
    viewModel.cgnFName(navigation.mgCName);
    viewModel.cgnMApplyModelName(navigation.suMApplyModelName);
    viewModel.cgnMApplyPositionName(navigation.suMApplyPositionName);
    viewModel.cgnMBrandName(navigation.suMBrandName);
    viewModel.cgnMFieldsName(navigation.suMFieldsName);
    viewModel.cgnMProductName(navigation.suMProductName);
    viewModel.mgCName(navigation.mgCName);
    var tmpArr = [];
    for (var i = 0, len = navigation.mgCName.length; i < len; i++) {
        if (navigation.mgCName[i] != '') {
            tmpArr.push({mgCName: navigation.mgCName[i]});
        }
    }
    viewModel.thirdMenu(tmpArr);
    viewModel.cgnSuName(navigation.mgCName);
    if (!myScrollMenu) {
        myScrollMenu = new JRoll('#menu', {
            scrollX: true,
            click: true
        });
    } else {
        //myScrollMenu.refresh();
        $('#thirdMenu').css('transform', 'translate(0, 0)')
    }
    //window.updateFilter = false;
    viewModel.totalPage(responseJSON.pageParams.pageCount);
    var cgnMCodes = "";
    var cgnFCodes = "";
    var mCodeM = {};
    var fCodeM = {};
    for (var i = 0; i < data.length; i++) {
        mCodeM[data[i].cgnMCode] = data[i].cgnMCode;
        fCodeM[data[i].cgnFCode] = data[i].cgnFCode;
        // codes = codes + data[i].cgnMCode +"#";
    }
    for (var i in mCodeM) {
        cgnMCodes = cgnMCodes + i + "#";
    }
    for (var i in fCodeM) {
        cgnFCodes = cgnFCodes + i + "#";
    }
    var p_conditions = {"fCodes": cgnFCodes.substring(0, cgnFCodes.length - 1)};
    p_conditions["mCodes"] = cgnMCodes.substring(0, cgnMCodes.length - 1);

    var page_params = {"pageIndex": 1, "pageSize": 20};  //分页
    var sortItem = {};
    var data1 = p_page_params_con_dataj_enc(p_conditions, page_params, sortItem);
    var ret = p_async_post(ip + '/ieop_base_mobile/mfrontmalltransferorder/getpriceandstock', data1, 'getpriceandstock');

}



function getpriceandstock(ret) {
    var retData = ret.retData.ents;
    var mlen = retData.length;
    var mds = {};
    var key = "";
    for (var i = 0; i < mlen; i++) {
        key = retData[i].cgnFCode + ',' + retData[i].cgnMCode;
        mds[key] = retData[i];
    }
    for (var i = 0, len = data.length; i < len; i++) {
        var stock = 0;
        var key = data[i].cgnFCode + ',' + data[i].cgnMCode;
        if (null != mds[key] && mds[key] != undefined) {
            md = mds[key];
            stock = parseInt(md.labst);
        }
        data[i]['stock'] = stock;
        if (data[i]['cgnMIcon']) {
            data[i]['cgnMIcon'] = summer.getStorage("imgBaseUrl") + data[i]['cgnMIcon'];
        }
    }
    if (!myScroll) {
        mycall();
    }
    if (pageSize == 1) {
        viewModel.listArr(data);
        if (myScroll) {
            myScroll.refresh();
        }
        if (data.length <= 0) {
        	$('.more').hide();
            summer.toast({
                "msg": "暂无内容"
            })
        }

        $('#smallPic').removeClass('noshow');
        if(pageSize==viewModel.totalPage()){  
        	$('.more i').hide();
            $('.more span').text('没有更多了');//显示没有更多了
        }

    } else {
        viewModel.listArr(viewModel.listArr().concat(data));
        myScroll.refresh();
    }
}