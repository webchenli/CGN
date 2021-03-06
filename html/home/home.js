var turn = 0;
var systemList =[{name: "去调拨", code: 0}, {name: "去采购", code: 1}];

function keyBack() {
    turn++;
    if (turn == 2) {
        clearInterval(intervalID);
        summer.exitApp()
    } else {
        summer.toast({"msg": "再按一次返回键退出!"});
    }
    var intervalID = setInterval(function () {
        clearInterval(intervalID);
        turn = 0;
    }, 3000);
}

function openWin(winId, options) {
    var flag = window.viewModel.systemFlag() ;
    if(flag === 0 ){
        winId = 'list_cg'
    }
    summer.openWin({
        "id": winId,
        "url": "html/" + winId + "/" + winId + ".html",
        "pageParam": {
            "count": 1,
            options: options,
            flag:flag
        },
        "animation": {
            type: "none", //动画类型（详见动画类型常量）
            subType: "from_right", //动画子类型（详见动画子类型常量）
            duration: 0 //动画过渡时间，默认300毫秒
        },
    });
}

function openWin1(winId) {
    //var statusBarStyle = winId=='attention'||winId=='cart'||winId=='my'?'light':'dark';
    var statusBarStyle = 'dark';
    if(viewModel.systemFlag()==0&&winId=='attention'){
		winId='attention_cg';
	}
	if(viewModel.systemFlag()==0&&winId=='cart'){
		winId='cart_cg';
	}
    if ($summer.os == 'ios') {
        summer.createWin({
            id: winId,
            url: "html/" + winId + "/" + winId + ".html",
            cache: 'false',
        });
    } else {
        summer.openWin({
            "id": winId,
            "url": "html/" + winId + "/" + winId + ".html",
            "pageParam": {
                "count": 1
            },
            "animation": {
                type: "none", //动画类型（详见动画类型常量）
                subType: "from_right", //动画子类型（详见动画子类型常量）
                duration: 0 //动画过渡时间，默认300毫秒
            },
            //show:$summer.os=='ios'?false:true,
            isKeep: false,
            statusBarStyle: statusBarStyle,
            "addBackListener": "true"
        });
    }
}

function scan() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +  //数据文本
                "Format: " + result.format + "\n" + //类型
                "Cancelled: " + result.cancelled); //是否取消扫描
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    );
}

summerready = function () {
	
    var platform = $summer.os,
        ip = summer.getStorage("ip");
	get_version(ip);
    if (platform == 'ios') {
        $('#iSlider-wrapper').css('height', '215px');
    }
    var stype = summer.getStorage("stype")?summer.getStorage("stype"):0;
    summer.setStorage('stype',stype);
    var stypeText = stype==1?'去采购':'去调拨';
    var viewModel = {
        organizationArr: ko.observableArray([]),
        defaultOrg: ko.observable(summer.getStorage("ufn")),
        isAndriod: ko.observable($summer.os == 'android'),
        systemType: ko.observable(stypeText),
        systemArr: ko.observableArray([]),
        systemFlag:ko.observable(stype),
        listType:ko.observable(stype==1?'list':'list_cg'),
        factoryParamType:ko.observable(stype==1?'cgnMBrandName':'ieopEnterpriseName'),
        chooseOrg: function (item) {
            var p_conditions = {
                ccode: item.cgnFCode
            };
            var page_params = {"pageIndex": 1, "pageSize": 100};  //分页
            var sortItem = {};
            var paramData = p_page_params_con_dataj_enc(p_conditions, page_params, sortItem);
            window.item = item;
            p_async_post(ip + '/ieop_base_mobile/mfrontmallcgnfactory/setuserfactory', paramData, 'logon_after_process');

            $('.org-list').slideUp();
            $('.drop').hide();
        },
        openWin:function(winId, options) {
		    var flag = summer.getStorage("stype");
		    if(flag === 0 ){
		        winId = 'list_cg'
		    }
		    summer.openWin({
		        "id": winId+new Date().getTime(),
		        "url": "html/" + winId + "/" + winId + ".html",
		        "pageParam": {
		            "count": 1,
		            options: options,
		            flag:flag
		        },
		        "animation": {
		            type: "none", //动画类型（详见动画类型常量）
		            subType: "from_right", //动画子类型（详见动画子类型常量）
		            duration: 0 //动画过渡时间，默认300毫秒
		        },
		    });
		},
        chooseSystemArr:function(item){
            viewModel.systemType(item.name);
            viewModel.systemFlag(item.code);
            summer.setStorage('stype',item.code);
            $('.system-list').slideUp();
            $('.drop2').hide();
        },
        openSearch:function () {
            summer.openWin({
                id: 'search'+new Date().getTime(),
                url: 'html/search/search.html',
                "pageParam":{
                    flag:viewModel.systemFlag()
                }
            })
        }
    }
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
    $summer.fixStatusBar($summer.byId('header'));
    $(".um-input-clear").click(function () {
        $(this).prev("input").val("");
    })
    var list = [{
        content: "../../img/banner.png"
    }, {
        content: "../../img/banner1.png"
    }];

	var islider = new iSlider({
     type : 'pic',
     data : list,
     dom : document.getElementById("iSlider-wrapper"),
     isLooping : true,
     animateType : 'default',
     isAutoplay : true,
     animateTime : 1000,
   });
   islider.addDot();

    var $drop = $('.drop') , $drop2 = $(".drop2");
    $('#moreBtn').on('click', function () {
        $('#allCategory').show();
    })
    $('#hideAll').on('click', function () {
        $('#allCategory').hide();
    })
    $('#searchBtn').on('click', function () {
        summer.openWin({
            id: 'search',
            url: 'html/search/search.html',
            "pageParam":{
                flag:window.viewModel.systemFlag()
            }
        })
    })
    $('#changeOrgBtn').on('click', function () {
        var $this = $(this);
        if (viewModel.organizationArr().length <= 0) {
            var enc_conditions = p_page_params_con_dataj_enc({}, {"pageIndex": 1, "pageSize": 100}, {});
            p_async_post(ip + '/ieop_base_mobile/mfrontmallcgnfactory/queryuserfactories', enc_conditions, 'queryuserfactories');

        }
        $this.siblings('.org-list').slideToggle();
        $drop.fadeToggle();
    })
    $drop.on('click', function () {
        $('.org-list').slideToggle();
        $drop.fadeToggle();
    })

    $("#chooseSystem").on('click', function () {
        viewModel.systemArr(systemList);
        var $this = $(this); 
        $this.siblings('.system-list').slideToggle();
        $drop2.fadeToggle();
        if($("#img1").hasClass("arrow-up"))
        	$("#img1").removeClass("arrow-up").addClass("arrow-down")
        else
       		$("#img1").removeClass("arrow-down").addClass("arrow-up")
       	
    })
    $drop2.on('click', function () {
        $('.system-list').slideToggle();
        $drop2.fadeToggle();
    })

}

function logon_after_process(result) {
    if (result.status == 1) {
        summer.setStorage("ufn", item.cgnFName);
        viewModel.defaultOrg(item.cgnFName);
    } else {
        summer.toast({
            "msg": result.msg
        })
    }
}

function queryuserfactories(res) {
    var factories = res;
    if (factories.status == 1) {
        var organizationArr = factories.retData.ents;
        viewModel.organizationArr(organizationArr);
    } else {
        summer.toast({
            "msg": '查询失败'
        })
    }
}
function get_version(ip) {
	var c_condition_info = {};
    var page_params={};
    page_params["pageIndex"]=1;
    page_params["pageSize"]=10000;
    var data = p_page_params_con_dataj_enc(c_condition_info,page_params);
    p_async_post(ip+'/ieop_base_mobile/mfrontmallieopversion/queryversion', data,'get_version_back');
}
function get_version_back(data){
	if(data.status==1){ 
		var ent = data.retData;
		var ieopVersionCode = ent.ents[0].ieopVersionCode;
		var appVersion = JSON.parse(summer.getAppVersion()).versionName;
		if(ieopVersionCode!=appVersion){
			UM.confirm({
			    title: '发现新版本',
			    text: '是否立即下载？',
			    btnText: ["取消", "确定"],
			    overlay: true,
			    ok: function () {
				    if($summer.os=='ios'){
				        summer.openWebView({
						    //url : "https://fir.im/w5d3"
						    url : "https://fir.im/n1le"
						});
				    }else{
				    	summer.openWebView({
						    //url : "https://fir.im/ysxv"
						    url : "https://fir.im/vul1"
						});
				    }
			    },
			    cancle: function () {
			    
			    }
			});
		}
	}
}