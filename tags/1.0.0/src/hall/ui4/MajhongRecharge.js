if (GAMENAME == "shisanshui") {
  var MajhongRecharge = cc.Layer.extend({
    ctor: function (data) {
      this._super();
      var products = data['gemPrice'].split("|");
      var root = ccs.load(SSSPokerJson.GameRecharge).node;
      this.addChild(root);
      var listview = ccui.helper.seekWidgetByName(root, "listview_item");
      var panel_cell = ccui.helper.seekWidgetByName(root, "panel_cell");
      panel_cell.setVisible(false);

      var btn_close = ccui.helper.seekWidgetByName(root, "btn_close");
      btn_close.addClickEventListener(function () {
        this.removeFromParent();
      }.bind(this));

      var _this = this;
      for (var i = 0; i < Math.ceil(products.length/3); i++) {
        var cell = panel_cell.clone();
        for(var j=0;j<3;j++)
        {
          var ind = i*3+j;
          if(ind < products.length)
          {
            var product = products[ind].split(":");
            var imageBg = ccui.helper.seekWidgetByName(cell, "Image_bg"+j);
            imageBg.setVisible(true);
            var text_gem = ccui.helper.seekWidgetByName(imageBg, "text_gem");
            var text_rmb = ccui.helper.seekWidgetByName(imageBg, "text_rmb");
            var img_icon = ccui.helper.seekWidgetByName(imageBg, "img_icon");
            var btn_buy = ccui.helper.seekWidgetByName(imageBg, "btn_buy");
            text_gem.setString(product[0]);
            text_gem.setContentSize(text_gem.getVirtualRendererSize());
            text_rmb.setString(product[1]);
            if(ind>5)
              ind = 5;
            img_icon.loadTexture('res/PokerSSS/Resoures/large/sss_shop_'+ind+'.png',ccui.Widget.LOCAL_TEXTURE);
            btn_buy.addClickEventListener(function () {
              _this.onclickBuyitem(this);
            }.bind(product));
          }
        }
        var layout = new ccui.Layout();
        layout.setContentSize(cell.getContentSize());
        cell.x = 0;
        cell.y = 0;
        cell.setVisible(true);
        layout.addChild(cell);
        listview.pushBackCustomItem(layout);
      }
    },

    onclickBuyitem: function (product) {
      cc.sys.openURL("http://mall.yiqigame.me/wpay.html?a=1&token=ad34324davdsa&t=shisanshui&s=sss&i=" + hall.user.uid + "&p=product&n=" + product[0]);
    },


    showPanel: function () {
      cc.director.getRunningScene().addChild(this);
    }

  });
} else if (GAMENAME == "xuezhan") {
  var MajhongRecharge = cc.Layer.extend({
    ctor: function () {
      this._super();
      var root = ccs.load(GameHallJson.GameRecharge).node;
      this.addChild(root);

    },

    onEnter: function () {
      this._super();

      if (cc.sys.isNative)         //真机才走
      {
        // this.initPlugin();
        // this.getproductlist();
      }
    },
  });
} else {
  var MajhongRecharge = cc.Layer.extend({

    btn_close: null,
    listview: null,
    panel_cell: null,
    product: null,
    _serverMode: false,

    orderInfo: null,
    orderId: null,
    prodId: null,

    ctor: function () {
      this._super();
      var root = ccs.load(GameHallJson.GameRecharge).node;
      this.addChild(root);
      this.listview = ccui.helper.seekWidgetByName(root, "listview_item");
      this.panel_cell = ccui.helper.seekWidgetByName(root, "panel_cell");
      this.panel_cell.setVisible(false);

      //this.text_gem = ccui.helper.seekWidgetByName(root,"")

      this.btn_close = ccui.helper.seekWidgetByName(root, "btn_close");

      this.btn_close.addClickEventListener(function () {
        this.removeFromParent();
      }.bind(this));

      //var _this = this;
      //for (var i = 0; i < 3; i++) {
      //  var cell = this.panel_cell.clone();
      //  var text_gem =  ccui.helper.seekWidgetByName(cell,"text_gem");
      //  var text_rmb =  ccui.helper.seekWidgetByName(cell,"text_rmb");
      //  var img_icon =  ccui.helper.seekWidgetByName(cell,"img_icon");
      //  var btn_buy =  ccui.helper.seekWidgetByName(cell,"btn_buy");
      //  text_gem.setString(6*(i+1)+'钻石');
      //  text_rmb.setString('￥' +6*(i+1));
      //
      //  var product= {};
      //  product['name'] = 'ggggg='+i;
      //  product['id'] = 'id==' +i;
      //  btn_buy.addClickEventListener(function () {
      //
      //    _this.onclickBuyitem(this);
      //
      //  }.bind(product));
      //  var layout = new ccui.Layout();
      //  layout.setContentSize(cell.getContentSize());
      //  cell.x = 0;
      //  cell.y = 0;
      //  cell.setVisible(true);
      //  layout.addChild(cell);
      //  this.listview.pushBackCustomItem(layout);
      //}

    },



    onEnter: function () {
      this._super();

      if (cc.sys.isNative)         //真机才走
      {
        this.initPlugin();
        this.getproductlist();
      }
    },

    getproductlist: function () {

      var pidList = ["com.majiang.whmj01", "com.majiang.whmj02", "com.majiang.whmj03"];
      this.PluginIAP.callFuncWithParam("requestProducts", plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, pidList.toString()));
      MajhongLoading.show('获取商品中...');
    },
    initPlugin: function () {
      var pluginManager = plugin.PluginManager.getInstance();
      this.PluginIAP = pluginManager.loadPlugin("IOSIAP");
      this.PluginIAP.setListener(this);
    },
    //获取商品列表回调
    onRequestProductResult: function (ret, productInfo) {
      var _this = this;
      MajhongLoading.dismiss();
      if (ret == plugin.ProtocolIAP.RequestProductCode.RequestFail) {
        JJLog.print("request error ");
      } else if (ret == plugin.ProtocolIAP.RequestProductCode.RequestSuccess) {
        JJLog.print("request RequestSuccees " + JSON.stringify(productInfo));
        this.product = productInfo;

        for (var i = 0; i < productInfo.length; i++) {
          var product = productInfo[i];
          var cell = _this.panel_cell.clone();
          var text_gem = ccui.helper.seekWidgetByName(cell, "text_gem");
          var text_rmb = ccui.helper.seekWidgetByName(cell, "text_rmb");
          var img_icon = ccui.helper.seekWidgetByName(cell, "img_icon");
          var btn_buy = ccui.helper.seekWidgetByName(cell, "btn_buy");
          text_gem.setString(6*(i+1)+'个');
          text_gem.setContentSize(text_gem.getVirtualRendererSize());
          text_rmb.setString('￥' + product['productPrice']);
          //img_icon.loadTexture('shop_chongzhi' + i + '.png', ccui.Widget.PLIST_TEXTURE);
          btn_buy.addClickEventListener(function () {

            _this.onclickBuyitem(this);

          }.bind(product));
          var layout = new ccui.Layout();
          layout.setContentSize(cell.getContentSize());
          cell.x = 0;
          cell.y = 0;
          cell.setVisible(true);
          layout.addChild(cell);
          _this.listview.pushBackCustomItem(layout);
        }

        _this.PluginIAP.callFuncWithParam("setServerMode");
        _this._serverMode = true;

      }

    },
    //支付回调
    onPayResult: function (ret, msg, productInfo) {
      cc.log("onPayResult productInfo is " + JSON.stringify(productInfo));
      cc.log("onPayResult msg is " + JSON.stringify(msg));
      MajhongLoading.dismiss();
      var str = "";
      if (ret == plugin.ProtocolIAP.PayResultCode.PaySuccess) {
        str = "payment Success pid is " + productInfo.productId;
        //if you use server mode get the receive message and post to your server
        if (this._serverMode && msg) {
          str = "payment verify from server";
          cc.log(str);
          this.postServerData(msg);
        }
      } else if (ret == plugin.ProtocolIAP.PayResultCode.PayFail) {
        str = "payment fail";
      }
      cc.log("onPayResult ret is ==" + str)

    },


    onclickBuyitem: function (data) {
      var product = data;
      hall.net.getOrder(product['productId'],
        function (data) {
          JJLog.print("获取订单回调=" + JSON.stringify(data));
          if (data['code'] == 200) {
            this.orderInfo = data['orderInfo'];


            this.PluginIAP.payForProduct(product);
            MajhongLoading.show('下单中...');

          } else {

          }
        }.bind(this));
    },

    postServerData: function (data) {
      var _this = this;
      var orderinfo = this.orderInfo;
      hall.net.orderStatus(orderinfo,
        function (data) {
          JJLog.print("发服务器加钻石回调=" + JSON.stringify(data));
          if (data['code'] == 200) {
            _this.PluginIAP.callFuncWithParam("finishTransaction", new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, _this.orderInfo['prodId']));
            var dialog = new JJConfirmDialog();
            dialog.setDes("充值成功!");
            dialog.showDialog();
          } else {

          }
        });
    },

    showPanel: function () {
      cc.director.getRunningScene().addChild(this);
    }

  });
}



var GameSongShenRecharge = cc.Layer.extend({

  btn_close: null,
  listview: null,
  panel_cell: null,
  product: null,
  _serverMode: false,

  orderInfo: null,
  orderId: null,
  prodId: null,

  ctor: function () {
    this._super();
    var root = ccs.load(GameHallJson.GameRecharge).node;
    this.addChild(root);
    this.listview = ccui.helper.seekWidgetByName(root, "listview_item");
    this.panel_cell = ccui.helper.seekWidgetByName(root, "panel_cell");
    this.panel_cell.setVisible(false);

    this.btn_close = ccui.helper.seekWidgetByName(root, "btn_close");
    this.btn_close.addClickEventListener(function () {
      this.removeFromParent();
    }.bind(this));
  },



  onEnter: function () {
    this._super();

    if (cc.sys.isNative)         //真机才走
    {
      this.initPlugin();
      this.getproductlist();
    }
  },

  getproductlist: function () {
    MajhongLoading.show('获取商品列表中...');
    var pidList = ["IAP"+GAMENAME+"01", "IAP"+GAMENAME+"02", "IAP"+GAMENAME+"03"];
    this.PluginIAP.callFuncWithParam("requestProducts", plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, pidList.toString()));

  },
  initPlugin: function () {
    var pluginManager = plugin.PluginManager.getInstance();
    this.PluginIAP = pluginManager.loadPlugin("IOSIAP");
    this.PluginIAP.setListener(this);
  },
  //获取商品列表回调
  onRequestProductResult: function (ret, productInfo) {
    MajhongLoading.dismiss();
    var _this = this;
    if (ret == plugin.ProtocolIAP.RequestProductCode.RequestFail) {
      JJLog.print("request error ");
    } else if (ret == plugin.ProtocolIAP.RequestProductCode.RequestSuccess) {
      JJLog.print("request RequestSuccees " + JSON.stringify(productInfo));
      this.product = productInfo;

      for (var i = 0; i < productInfo.length; i++) {
        var product = productInfo[i];
        var cell = _this.panel_cell.clone();
        var text_gem = ccui.helper.seekWidgetByName(cell, "text_gem");
        var text_rmb = ccui.helper.seekWidgetByName(cell, "text_rmb");
        var img_icon = ccui.helper.seekWidgetByName(cell, "img_icon");
        var btn_buy = ccui.helper.seekWidgetByName(cell, "btn_buy");
        text_gem.setString(6*(i+1)+'个');
        text_gem.setContentSize(text_gem.getVirtualRendererSize());
        text_rmb.setString('￥' + product['productPrice']);
        img_icon.loadTexture('shop_chongzhi' + i + '.png', ccui.Widget.PLIST_TEXTURE);
        btn_buy.addClickEventListener(function () {

          _this.onclickBuyitem(this);

        }.bind(product));
        var layout = new ccui.Layout();
        layout.setContentSize(cell.getContentSize());
        cell.x = 0;
        cell.y = 0;
        cell.setVisible(true);
        layout.addChild(cell);
        _this.listview.pushBackCustomItem(layout);
      }

      _this.PluginIAP.callFuncWithParam("setServerMode");
      _this._serverMode = true;

    }

  },
  //支付回调
  onPayResult: function (ret, msg, productInfo) {
    MajhongLoading.dismiss();
    
    var str = "";
    if (ret == plugin.ProtocolIAP.PayResultCode.PaySuccess) {
      str = "payment Success pid is " + productInfo.productId;
      //if you use server mode get the receive message and post to your server
      if (this._serverMode && msg) {
        str = "payment verify from server";
        cc.log(str);
        this.postServerData(msg);
      }
    } else if (ret == plugin.ProtocolIAP.PayResultCode.PayFail) {
      str = "payment fail";
    }
    cc.log("onPayResult ret is ==" + str)

  },


  onclickBuyitem: function (data) {
                                           MajhongLoading.show('获取订单中...');
    var product = data;
    hall.net.getOrder(product['productId'],
        function (data) {
          MajhongLoading.dismiss();
          if (data['code'] == 200) {
            MajhongLoading.show('下单中...');
            this.orderInfo = data['orderInfo'];


            this.PluginIAP.payForProduct(product);

          } else {

          }
        }.bind(this));
  },

  postServerData: function (data) {
    var _this = this;
    var orderinfo = this.orderInfo;
    hall.net.orderStatus(orderinfo,
        function (data) {
          JJLog.print("发服务器加钻石回调=" + JSON.stringify(data));
          if (data['code'] == 200) {
            _this.PluginIAP.callFuncWithParam("finishTransaction", new plugin.PluginParam(plugin.PluginParam.ParamType.TypeString, _this.orderInfo['prodId']));
            var dialog = new JJConfirmDialog();
            dialog.setDes("充值成功!");
            dialog.showDialog();
          } else {

          }
        });
  },

  showPanel: function () {
    cc.director.getRunningScene().addChild(this);
  }

});
