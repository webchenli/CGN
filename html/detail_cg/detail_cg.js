function closeWin (){
	if(summer.pageParam.fromPage=='attention_cg'){
		var initPage = 'initPage()';
		summer.execScript({
		    winId: 'attention_cg',
		    script: initPage
		});
	}
	summer.closeWin()
}
function keyBack(){
	closeWin();
}
function nofind(_this,type){  
    src = "../../img/default_img.png"
    _this.src = src
    _this.onerror=null;
}
function openWin1 (winId){
    //var statusBarStyle = winId=='attention'||winId=='cart'||winId=='my'?'light':'dark';
    var statusBarStyle = 'dark';
    summer.openWin({
        "id" :winId+new Date().getTime(),
        "url" : "html/"+winId+"/"+winId+".html",
        "pageParam" : {
            "count" : 1
        },
        "animation":{
            type:"none", //动画类型（详见动画类型常量）
            subType:"from_right", //动画子类型（详见动画子类型常量）
            duration:0 //动画过渡时间，默认300毫秒
        },
        isKeep:false,
        statusBarStyle:statusBarStyle,
        "addBackListener":"true"
    });
}
summerready = function(){
	$summer.fixStatusBar($summer.byId('header'));
	window.params = summer.pageParam.options;
	window.fromPage = params.fromPage;
	var ufn = summer.getStorage("ufn");
	window.ip = summer.getStorage("ip");
	var platform = $summer.os;
	if(platform == "android"){
		$('.um-border-bottom').css({'border-width':'0 0 1px 0','border-style':'solid'});
		$('.um-border-top').css({'border-width':'1px 0 1px 0','border-style':'solid'});
		$('.um-border-left').css({'border-width':'0 0 0 1px','border-style':'solid'});
		$('.um-border-right').css({'border-width':'0 1px 0 0','border-style':'solid'});
	} else if(platform == "ios"){
		$('.um-border-top.um-border-bottom').css({'border-width':'1px 0 1px 0'});
	} else if(platform == "pc"){
				      // 执行pc特殊代码
	}	
	var viewModel = {
		ufn:ko.observable(ufn),
		mId:ko.observable(),
		stock:ko.observable(),
		suPrice:ko.observable(),
		cgnFName:ko.observable(),
		cgnFCodes:ko.observable(),
		cgnMName:ko.observable(),
		type:ko.observable(),
		cgnMCode:ko.observable(),
		cgnBrandName:ko.observable(),
		materialFSta:ko.observable(summer.getStorage("materiaFSta")),
		picArr:ko.observableArray(),
		ieopEnterpriseName:ko.observable(),
		suStoreName:ko.observable(),
		suCode:ko.observable(),
		suMRefCode:ko.observable(),
		chooseItem:ko.observableArray(),
		goodCommentL:ko.observable(0),
		commentArr:ko.observableArray(),
		defaultOrg:ko.observable(summer.getStorage("ufn")),
		organizationArr:ko.observableArray(),
        cartNum:ko.observable(0),
		addToCart:function(index,type){
            summer.setStorage("cartType",index)
			$(".detail-to-cart").slideToggle();
			var p_conditions = {};
		    p_conditions['suStoreCode'] = params.suStoreCode;
		    p_conditions['ieopEnterpriseCode'] = params.ieopEnterpriseCode;
		    p_conditions['materialCode'] = params.suMCode;
		    if(type!="yy"){
		        p_conditions['buyStoreSwitch'] = '0';
		        if(Number(viewModel.stock())==0){
		        	summer.toast({
                         "msg" : "库存不足，请选择加入预约库！" 
                    })
		            return false
		        }
		    }else{
		        p_conditions['buyStoreSwitch'] = '1';
		    }
		    viewModel.type(type);
		    p_conditions['addAmount'] = '1';
		    var enc_conditions = p_page_params_con_dataj_enc(p_conditions,{},{});
		    p_async_post(ip+'/ieop_base_mobile/mfrontsumallusercarts/save', enc_conditions,'addToCarts');
		    
		},
		toggleAttention:function(){
			
				//关注
				var info = {};
				var userInfo = summer.getStorage('userInfo');
				info['materialId'] = viewModel.mId();
				info['materialCode'] = viewModel.cgnMCode();
				info['materialName'] = viewModel.cgnMName();
				info['materialImgUrl'] = viewModel.picArr()[0];
				info['ieopEnterpriseCode'] = params.ieopEnterpriseCode;
				info['ieopEnterpriseName'] = viewModel.ieopEnterpriseName();
				info['userId'] = JSON.parse(userInfo).id;
				info['suStoreCode'] = params.suStoreCode;
				info['suStoreName'] = viewModel.suStoreName();
		
				info['brandName'] = viewModel.cgnBrandName();
				info['materialFSta'] =1;
				var bb = p_params_dataj_ent_enc(info);
				p_async_post(ip+'/ieop_base_mobile/mfrontsumallmaterialfavorites/save', bb,'favoritesSave1');
				
		},
		chooseOrg:function(item){
    		var p_conditions = {
                fcode:item.cgnFCode
            };
            var page_params={"pageIndex":1,"pageSize":100};  //分页
            var sortItem = {};
            var paramData = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
            viewModel.chooseItem([item]);
            p_async_post(ip+'/ieop_base_mobile/mfrontmallcgnfactory/setuserfactory', paramData,'setuserfactory');
    		
    	},
	}
	window.viewModel = viewModel;
	ko.applyBindings(viewModel);
	//初始化页面
	var p_conditions = {};
    p_conditions['ieopEnterpriseCode'] = params.ieopEnterpriseCode;
    p_conditions['materialCode'] = params.suMCode;
    p_conditions['suStoreCode'] = params.suStoreCode;
    var page_params={"pageIndex":1,"pageSize":20};
    var sortItem = {};
    var data1 = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
    p_async_post(ip+'/ieop_base_mobile/mfrontsumaterial/queryaggmdetial', data1,'querysingle');
    
	$('#changeOrgBtn').on('click',function(){
          var $this = $(this);
          if(viewModel.organizationArr().length<=0){
          	  var enc_conditions = p_page_params_con_dataj_enc({},{"pageIndex":1,"pageSize":100},{});
        	  p_async_post(ip+'/ieop_base_mobile/mfrontmallcgnfactory/queryuserfactories', enc_conditions,'queryuserfactories');
              
          }
          $('.org-list').slideToggle();
          $('.drop').fadeToggle();
    }) 
    var $drop = $('.drop');
    $drop.on('click',function(){
        $('.org-list').slideToggle();
        $drop.fadeToggle();
    })
}
function querysingle (ret){
	var params = summer.pageParam.options;
	if(ret.status==0){
        summer.toast({
             "msg" : storeRet.msg 
        });
        return;
    }
 	if(ret.retData.aggEnt==null){
 		summer.toast({
             "msg" : "物料已下架！" 
        })
    }
    var retData = ret.retData.aggEnt.mainEnt;
    var materialTds = ret.retData.materialTds;
    var materialReplaceables = ret.retData.materialReplaceables;
    viewModel.mId(retData.id);
    viewModel.cgnMName(retData.suMName);
    viewModel.cgnBrandName(retData.suMBrandName);
    viewModel.cgnMCode(retData.suMCode);
    viewModel.ieopEnterpriseName(retData.ieopEnterpriseName);
    var cgnMUnit = retData.suMUnit;
    var cgnMDesc = retData.suMDesc;
    //var matnr = retData.matnr;
    var mgCName = retData.mgCName;
    var dataid = retData.id;
    var cgnMFieldsName = retData.suMFieldsName;
    if(cgnMFieldsName!=null){
        cgnMFieldsName = retData.suMFieldsName.replace(/#/g," ");
    }else{
        cgnMFieldsName = "";
    }
    //var matkl = retData.matkl;
    //var bismt = retData.matnr;
    var cgnMCodes = retData.cgnMCode;
    viewModel.cgnFName(params.cgnFName);
    var cgnMId = retData.id;
    var cgnFCodes = params.cgnFCode;
    viewModel.cgnFCodes(cgnFCodes);
    //返回图片为空设为默认图片
    if(retData.suMSmallimgs==null || retData.suMSmallimgs==""){
        retData.suMSmallimgs = "../../img/default_img.png";
    }
    var picArr = retData.suMSmallimgs.split("#");
    viewModel.picArr(picArr);
    //tupian
    var list = [
	   
	];
	for(var i=0;i<picArr.length;i++){
		picArr[i] = summer.getStorage("imgBaseUrl")+picArr[i];
		list.push({content:picArr[i]});
	}

	var islider = new iSlider({
	    type: 'pic',
	    data: list,
	    dom: document.getElementById("iSlider-wrapper"),
	    isLooping: true,
	    animateType: 'default',
	    isAutoplay: true,
	    animateTime: 800,
	    fixPage:false
	});
	islider.addDot();
	setTimeout(function(){
		//添加图片预览功能
		var $_ = {};
	    /**
	     * get multiple elements
	     * @public
	     */
	    $_.all = function(selector, contextElement) {
	      var nodeList,
	        list = [];
	      if (contextElement) {
	        nodeList = contextElement.querySelectorAll(selector);
	      } else {
	        nodeList = document.querySelectorAll(selector);
	      }
	      if (nodeList && nodeList.length > 0) {
	        list = Array.prototype.slice.call(nodeList);
	      }
	      return list;
	    }
	    /**
	     * delegate an event to a parent element
	     * @public
	     * @param  array     $el        parent element
	     * @param  string    eventType  name of the event
	     * @param  string    selector   target's selector
	     * @param  function  fn
	     */
	    $_.delegate = function($el, eventType, selector, fn) {
	      if (!$el) { return; }
	      $el.addEventListener(eventType, function(e) {
	        var targets = $_.all(selector, $el);
	        if (!targets) {
	          return;
	        }
	        // findTarget:
	        for (var i=0; i<targets.length; i++) {
	          var $node = e.target;
	          while ($node) {
	            if ($node == targets[i]) {
	              fn.call($node, e);
	              break; //findTarget;
	            }
	            $node = $node.parentNode;
	            if ($node == $el) {
	              break;
	            }
	          }
	        }
	      }, false);
	    };
	    var urls = [];
	    var imgs = $_.all('img',$_.all('#iSlider-wrapper')[0]);
	    imgs.forEach(function(v,i){
	        urls.push(v.src);
	    })
	    
	    $_.delegate(document.querySelector('#iSlider-wrapper'), 'click','img',function(){
	        var current = this.src;
	        var obj = {
	            urls : urls,
	            current : current
	        };
	        previewImage.start(obj);
	    });
	},800)
    //获取库存和价格   价格暂时去掉
    var p_conditions = {"suMCode":params.suMCode,"suStoreCode":params.suStoreCode,"ieopEnterpriseCode":params.ieopEnterpriseCode};
    set_context_info("p_material_factory_info",{'fcode':cgnFCodes,'mcode':cgnMCodes});
    var page_params={"pageIndex":1,"pageSize":20};
    var sortItem = {};
    var storeData = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
    p_async_post(ip+'/ieop_base_mobile/mfrontsustorematerial/querybymescode', storeData,'getsinglepriceandstock');
    //获取关注
    var p_conditions = {"sCodes":params.suStoreCode};  //条件
    p_conditions["mCodes"] = params.suMCodes;
    var page_params={"pageIndex":1,"pageSize":20};  //分页
    var sortItem = {};
    var data1 = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
    p_async_post(ip+'/ieop_base_mobile/mfrontsumallmaterialfavorites/querymutiple', data1,'materialFavorites');
    //评论
    var p_conditions = {
       sCode:params.suStoreCode,
       mCode:params.suMCode,
       ieopEnterpriseCode:params.ieopEnterpriseCode
    }
    var page_params={"pageIndex":1,"pageSize":20};  //分页
    var sortItem = {};
    var paramData = p_page_params_con_dataj_enc(p_conditions,page_params,sortItem);
    p_async_post(ip+'/ieop_base_mobile/mfrontsumaterialevaluation/querymaevallist', paramData,'querymalevallist');
}
function getsinglepriceandstock(storeRet){
	if(storeRet.status==0){
        summer.toast({
             "msg" : storeRet.msg 
        });
        return;
    }
    var storeRetData = storeRet.retData.ents;
    var stock;
    if(storeRetData.length!=0){
        var storeInfo = storeRetData[0];
        $(".secure_stock .info .secure_num span").html(parseInt(storeInfo.suMarStock));
        viewModel.suStoreName(storeInfo.suStoreName);
	    viewModel.suMRefCode(storeInfo.suMRefCode);
        viewModel.suPrice(Number(storeInfo.suPrice).toFixed(3));
        if(parseInt(storeInfo.suMarStock)){
        	viewModel.stock(parseInt(storeInfo.suMarStock));
        }else{
        	viewModel.stock('-'); 
        }
    }
}
function materialFavorites(retFavorites){
	var retFData = retFavorites.retData.ents;
    var flen = retFData.length;
    var fds = {};
    var key = "";
    for(var i = 0; i < flen ;i++){
		key = retFData[i].ieopEnterpriseCode+','+retFData[i].materialCode;
		fds[key] = retFData[i];
    }
    var key = params.ieopEnterpriseCode+','+params.suMCode
    viewModel.materialFSta(fds[key]?fds[key].materialFSta:0);
}
function querymalevallist (commentList){
	if(commentList.status==0){
		summer.toast({
             "msg" : commentList.msg
        })
        return;
	}
	var commentArr = commentList.retData.ents;
	var goodComment = 0;
	for(i=0;i<commentArr.length;i++){
		if(commentArr[i].evaluationLv>=4){
			goodComment++;
		}
	}
	if(commentArr.length!=0){
		viewModel.goodCommentL((goodComment/commentArr.length).toFixed(4)*100);
	}
	
	viewModel.commentArr(commentArr);
}
function favoritesSave(data){
	if(data.status ==1){
	   viewModel.materialFSta(0);
	}else {
	    summer.toast({
           "msg" : "网络错误" 
        })
	}
}
function favoritesSave1 (data){
	if(data.status==1){
		viewModel.materialFSta(viewModel.materialFSta()==1?0:1);
	}else{
		summer.toast({
           "msg" : "网络错误" 
        })
	}
}
function addToCarts (data){
	if(data.status==1){
		if(viewModel.type()=="gotocg"){ //区分立即采购和加入购物车
		   openWin1('cart_cg');
		}else if(viewModel.type()=="yy"){
		   summer.toast({
                "msg" : '添加预约库成功'
           })
		}else{
			summer.toast({
                "msg" : '添加采购库成功'
           })
		}
	}else{
		summer.toast({
            "msg" : data.msg
        })
	}
}
function queryuserfactories (res){
	var factories = res;
    if(factories.status==1){
        var organizationArr = factories.retData.ents;
           viewModel.organizationArr(organizationArr);
    }else{
        summer.toast({
            "msg" : '查询失败'
        })
    }
}
function setuserfactory (result){
	if(result.status==1){
    	summer.setStorage("ufn", viewModel.chooseItem()[0].cgnFName);
    	viewModel.defaultOrg(viewModel.chooseItem()[0].cgnFName);
    }else{
    	summer.toast({
            "msg" : result.msg
        })
    }
    $('.org-list').slideUp();
    $('.drop').hide();
}
