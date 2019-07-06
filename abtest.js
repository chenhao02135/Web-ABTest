;(function ($){
	/*!
	 * ABTest v1.0.0
	 *
	 * 依赖  1,jquery.js 1.8版或以上;
	 *		2,jquery.cookie.min.js
	 *
	 * Copyright lisc
	 *
	 * Date: 2018-11-11
	 *
 	 * 说明: chrome使用文件路径测试时,可能会出现不支持cookie的情况,可以尽量使用其他浏览器进行文件路径测试; 域名测试不受影响;
	 */

	 /*
	options = {
		grpName:"groupName-01",	//分组名
		userId:"",				//当前登录的用户ID
		//测试用例列表; 支持多个测试示例;
		caseList:{		
			caseA:{	//A场景
				"url":"http://url_001",	//跳转地址
				"pct":10,	//百分比,0-100;
				"uid":""	//特定UID设置(如果设置了UID,则uid测量优先,如1,2,3等)
			},
			caseB:{//B场景
				"url":"http://url_002",	
				"pct":90,	
				"uid":""	
			}
		}
	}
	 */
	$.fn.abTest = function (options) {
	 	return new _abTest(this,options).init();
    };

    var _abTest = function(elem,options){
    	this.elem = elem;
    	this.$elem = $(elem);
    	this.options = options;
    };
    _abTest.prototype={
		defaults: {},
		init:function(){
			var that=this, $elem=this.$elem;
			//扩展属性集合;
			this.config = $.extend({}, this.defaults, this.options);
			return this.doTest();
		},
		doTest:function(){
			var that=this;
			var res = this._abtVerStrategy(this.options);
			if(res && res.url && res.url.length>0){
				return res;
			}
			res = this._userIdStrategy(this.options);
			if(res && res.url && res.url.length>0){
				return res;
			}
			res = this._randStrategy(this.options);
			if(res && res.url && res.url.length>0){
				return res;
			}

			return res;
		},
		cookieName:{
			//对一个用户,记录给其分配的测试用例,避免每次被重新分配;
			"abtVer":"abtest-ver"	
		},
		//按之前的分配策略进行分配;
		_abtVerStrategy:function(param){
			var res=null; //{'strategy':'abtVer','url':''};
			var abtVer = cookieMng.get(param.grpName);
			if(abtVer && abtVer.length>0){
				res = param.caseList[abtVer];
				if(!res && !res.caseName){ res.caseName=abtVer; }
			}
			if(res!=null) res.strategy="abtVerStrategy";
			return res;
		},
		//按设定的流量百分比分配策略
		_randStrategy:function(param){
			var rand=Math.floor(Math.random()*100);
			var matchVal={"min":0.0,"max":0.0};
			var res=null;
			for(var key in param.caseList){
				var item= parseFloat( param.caseList[key].pct);
				matchVal.max += item;
				if(rand>= matchVal.min && rand<=matchVal.max){
					//res.url = param[key].url;
					res = param.caseList[key];
					if(!res.caseName){ res.caseName=key; }
					cookieMng.add(param.grpName,key);
					break;
				}
				matchVal.min += item;
			}
			
			if(res!=null) res.strategy="randStrategy";
			return res;
		},
		//用户ID分配策略
		_userIdStrategy:function(param){
			var res=null;
			var userId = param.userId;
			if(userId&&userId.length>0){
				for(var key in param.caseList){
					var uids= param.caseList[key].uid ;
					if(!uids || $.trim(uids).length==0){
						continue;
					}
					if(!uids.startsWith(",")) uids=','+uids;
                	if(!uids.endsWith(",")) uids += ',';
                	if(uids.indexOf(','+userId+',')>-1){
                		res = param.caseList[key];
                		if(!res.caseName){ res.caseName=key; }
						cookieMng.add(param.grpName,key);
						break;
                	}
				}
			
			}

			if(res!=null) res.strategy="userIdStrategy";
			return res;
		}

    };

	//
	var cookieMng={
		domain:"abtest_system",
		init:function(domain){
			this.domain=domain;
		},
		get:function(cookieName){
			return $.cookie(cookieName);
		},
		add:function(cookieName,val){
			$.cookie(cookieName, val);
			//document.cookie = cookieName + "="+ escape (val);
		},
		remove:function(cookieName){
			$.removeCookie(this.cookieName);//,{domain:this.domain}
		}
	}


	 
})(jQuery);