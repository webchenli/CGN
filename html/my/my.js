var turn = 0;
var systemList =[{name: "去采购", code: 0}, {name: "去调拨", code: 1}];
function keyBack(){
    turn++;
    if(turn==2){
        clearInterval(intervalID);
        summer.exitApp()
    }else{
        summer.toast({"msg":"再按一次返回键退出!"});
    }
    var intervalID = setInterval(function() {
        clearInterval(intervalID);
        turn=0;
    }, 3000);
}
function openWin (winId,status){
	if(status===undefined){
	}else {
		var params = {
			status:status
		}
	}
    summer.openWin({
        "id" :winId,
        "url" : "html/"+winId+"/"+winId+".html",
        "animation":{
            type:"none", //动画类型（详见动画类型常量）
            subType:"from_right", //动画子类型（详见动画子类型常量）
            duration:0 //动画过渡时间，默认300毫秒
        },
        statusBarStyle:'dark',
        "addBackListener":"true",
        pageParam:params
    });
}
function openAddress (winId){
    summer.openWin({
        "id" :winId,
        "url" : "html/"+winId+"/"+winId+".html",
        "animation":{
            type:"none", //动画类型（详见动画类型常量）
            subType:"from_right", //动画子类型（详见动画子类型常量）
            duration:0 //动画过渡时间，默认300毫秒
        },
        statusBarStyle:'dark',
        "addBackListener":"true",
        pageParam:{
        	"fromPage":"my"
        }
    });
}
function openWin1 (winId){
    //var statusBarStyle = winId=='attention'||winId=='cart'||winId=='my'?'light':'dark';
    var statusBarStyle = 'dark';
    if(summer.getStorage("stype")==0&&winId=='attention'){
		winId='attention_cg';
	}
	if(summer.getStorage("stype")==0&&winId=='cart'){
		winId='cart_cg';
	}
    summer.openWin({
        "id" :winId,
        "url" : "html/"+winId+"/"+winId+".html",
        "pageParam" : {
            "count" : 1
        },
        "animation":{
            type:"none", //动画类型（详见动画类型常量）
            duration:0 //动画过渡时间，默认300毫秒
        },
        isKeep:false,
        statusBarStyle:statusBarStyle,
        "addBackListener":"true"
    });
}


var stype = summer.getStorage("stype")?summer.getStorage("stype"):0;
var stypeText = stype==1?'欢迎调拨':'欢迎采购';

summerready = function(){
	var platform = $summer.os,
        ip = summer.getStorage("ip");
	get_version(ip);
    $summer.fixStatusBar($summer.byId('header'));
    var userInfo = JSON.parse(summer.getStorage("userInfo"));
    var isSuppliers = summer.getStorage("isSupplier") == "01" ? false : true ;
    var viewModel = {
        userName:ko.observable(userInfo.username),
        ufn:ko.observable(summer.getStorage('ufn')),
        isAndriod:ko.observable($summer.os=='android'),
        systemType: ko.observable(stypeText),
        stype:ko.observable(summer.getStorage("stype")),
        systemArr: ko.observableArray(systemList),
        systemFlag:ko.observable(stype),
        isCG:ko.observable(true),    //采购
        isDB:ko.observable(false),  // 调拨
        isSupplier:ko.observable(isSuppliers), // 供应商
        openWin:function (winId,status){
			if(status===undefined){
			}else {
				var params = {
					status:status
				}
			}
		    summer.openWin({
		        "id" :winId,
		        "url" : "html/"+winId+"/"+winId+".html",
		        "animation":{
		            type:"none", //动画类型（详见动画类型常量）
		            subType:"from_right", //动画子类型（详见动画子类型常量）
		            duration:0 //动画过渡时间，默认300毫秒
		        },
		        statusBarStyle:'dark',
		        pageParam:params
		    });
		},
        openList:function(type,enter){
            summer.openWin({
                "id" :"order_list",
                "url" : "html/order_list/order_list.html",
                "pageParam" : {
                    type:type,
                    enter:enter
                },
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    subType:"from_right", //动画子类型（详见动画子类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                },
            })
        },
        openComment:function(winId,enter){
        	if(winId=='comment'){
        		summer.openWin({
	                "id" :"order_list",
	                "url" : "html/order_list/order_list.html",
	                "pageParam" : {
	                    type:winId,
	                    enter:enter
	                },
	                "animation":{
	                    type:"none", //动画类型（详见动画类型常量）
	                    subType:"from_right", //动画子类型（详见动画子类型常量）
	                    duration:0 //动画过渡时间，默认300毫秒
	                },
	            })
        		return;
        	}
            summer.openWin({
                "id" :winId,
                "url" : "html/"+winId+"/"+winId+".html"
            })
        },
        openList2:function(status){
            summer.openWin({
                "id" :"order_list",
                "url" : "html/order_list/order_list.html",
                "pageParam" : {
                    status:status
                },
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    subType:"from_right", //动画子类型（详见动画子类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                },
            })
        },
        openStore:function(){
            summer.openWin({
                "id" :"order_list",
                "url" : "html/my_store/my_store.html",
                "pageParam" : {
                    status:status
                },
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    subType:"from_right", //动画子类型（详见动画子类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                },
            })
        },
        openIframeCode:function(){
            summer.openWin({
                "id" : "iframeCode"+new Date().getTime(),
                "url" : "html/iframe_code/iframe_code.html",
                "animation":{
                	type:"none", //动画类型（详见动画类型常量）
                    subType:"from_right", //动画子类型（详见动画子类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
            	}
            });
        },
        toPersonInfo:function(){
            summer.openWin({
                "id" : "personInfo",
                "url" : "html/person_info/person_info.html",
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    subType:"from_right", //动画子类型（详见动画子类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                }
            });
        },
        openSupplier:function(status){
            summer.openWin({
                "id" : "supplier",
                "url" : "html/list_supplier/list_supplier.html",
                "animation":{
                    type:"none", //动画类型（详见动画类型常量）
                    subType:"from_right", //动画子类型（详见动画子类型常量）
                    duration:0 //动画过渡时间，默认300毫秒
                },
                "pageParam" : {
                    status:status
                },
            });
        },
        //chooseSystem:function(){
            //viewModel.systemArr(systemList);
           	//$('.system-list').fadeToggle();
        //},
        chooseSystemArr:function () {
        	var item = viewModel.systemFlag()==1?systemList[0]:systemList[1];
        	var chooseText = item.code==1?'欢迎调拨':'欢迎采购';
        	UM.confirm({
        		title: '',
			    text: '您的系统状态切换为'+(item.code==1?'调拨':'采购')+'状态,确认切换?',
			    btnText: ["关闭", "确认切换"],
			    overlay: true,
			    ok: function () {
			        viewModel.systemType(chooseText);
		            viewModel.systemFlag(item.code);
		            viewModel.stype(item.code);
		            summer.setStorage('stype',item.code);
		            $('.system-list').fadeOut();
		            if(item.code == 0){
		                viewModel.isCG(true);
		                viewModel.isDB(false);
		            }else{
		                viewModel.isCG(false);
		                viewModel.isDB(true);
		            }
			    },
			    cancle: function () {
			    }
        	})
            
            /*if($summer.os=='android'){
                $drop2.fadeToggle();
            }*/
        }


    }
    window.viewModel = viewModel;
    ko.applyBindings(viewModel);
    if(!isSuppliers){  //供应商
        viewModel.isCG(false);
        viewModel.isDB(false);
    }else{
        if(stype == 0){
            viewModel.isCG(true);
            viewModel.isDB(false);
        }else{
            viewModel.isCG(false);
            viewModel.isDB(true);
        }
    }


	
    //var  $drop2 = $(".drop2");
    //$drop2.on('click', function () {
        //$('.system-list').slideToggle();
        //$drop2.fadeToggle();
    //})
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