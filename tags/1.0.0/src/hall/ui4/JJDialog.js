/**
 * Created by atom on 2016/9/19.
 */

var JJDialog = cc.Layer.extend({
    btn_close:null,
    ctor: function () {
      this._super();
    },

    initUI: function () {
      this.btn_close = ccui.helper.seekWidgetByName(this.root,"btn_close");
      if(this.btn_close != null && this.btn_close != undefined)
      {
        this.btn_close.addClickEventListener(this.dismissDialog.bind(this));
        this.btn_close.setVisible(true);
      }

    },
    onEnter: function () {
      this._super();
    },
    showDialog: function () {
      cc.director.getRunningScene().addChild(this);
    },

    dismissDialog: function () {
      this.removeFromParent();
    },


});

var JJConfirmDialog = JJDialog.extend({
  text_des:null,
  text_title:null,
  btn_confirm:null,
  confirmCb:null,
  ctor: function () {
    this._super();
    var JsonRes = GameHallJson.Comfirm;
    if(GAMENAME =='qidong')
    {
      JsonRes = QDMajhongJson.Comfirm
    }
    this.root = ccs.load(JsonRes).node;
    this.addChild(this.root);

    this.text_title = ccui.helper.seekWidgetByName(this.root,"text_title");
    this.text_des = ccui.helper.seekWidgetByName(this.root,"text_des");
    this.btn_confirm = ccui.helper.seekWidgetByName(this.root,"btn_confirm");
    var _this = this;
    this.btn_confirm.addClickEventListener(function () {
      _this.removeFromParent();
      if (_this.confirmCb != null)
        _this.confirmCb();
    });
  },

  setCallback: function (confirmCb) {
    this.confirmCb = confirmCb;
  },

  setDes: function (text) {
    this.text_des.setString(text);
  }

});

var JJMajhongDecideDialog = JJDialog.extend({
  text_des:null,
  btn_confirm:null,
  btn_cancel:null,
  confirmCb:null,
  cancelCb:null,
  ctor: function () {
    this._super();
    var JsonRes = GameHallJson.Decide;
    if(GAMENAME =='qidong')
    {
      JsonRes = QDMajhongJson.Decide
    }
    var root = ccs.load(JsonRes).node;
    this.addChild(root);
    this.text_des = ccui.helper.seekWidgetByName(root,"text_des");
    this.btn_confirm = ccui.helper.seekWidgetByName(root,"btn_confirm");
    this.btn_cancel = ccui.helper.seekWidgetByName(root,"btn_cancel");
    this.btn_cancel.addClickEventListener(this.dismissDialog.bind(this));
    var _this = this;
    this.btn_confirm.addClickEventListener(function () {
      _this.removeFromParent();
      if (_this.confirmCb != null)
        _this.confirmCb();
    });
  },

  dismissDialog: function () {
    this._super();
    if (this.cancelCb != null)
      this.cancelCb();
  },

  setCancelCal:function (cb) {
    this.cancelCb = cb;
  },

  setCallback: function (confirmCb) {
    this.confirmCb = confirmCb;
  },

  setDes: function (text) {
    this.text_des.setString(text);
  },

});
/// 百搭用 打出百搭牌的时候提示
var JJMajhongDecideDialog2 = JJDialog.extend({
  text_des:null,
  btn_baida:null,
  btn_da:null,
  btn_cancel:null,
  confirmCb:null,
  cancelCb:null,
  daCb:null,
  ctor: function () {
    this._super();
    var root = ccs.load(BDMajhongJson.Decide).node;
    this.addChild(root);
    this.text_des = ccui.helper.seekWidgetByName(root,"text_des");
    this.btn_baida = ccui.helper.seekWidgetByName(root,"btn_baida");
    this.btn_da = ccui.helper.seekWidgetByName(root,"btn_da");
    this.btn_cancel = ccui.helper.seekWidgetByName(root,"btn_cancel");
    this.btn_cancel.addClickEventListener(this.dismissDialog.bind(this));
    var _this = this;
    this.btn_baida.addClickEventListener(function () {
      _this.removeFromParent();
      if (_this.confirmCb != null)
        _this.confirmCb();
    });

    this.btn_da.addClickEventListener(function () {
      _this.removeFromParent();
      if (_this.daCb != null)
        _this.daCb();
    });
  },

  dismissDialog: function () {
    this._super();
    if (this.cancelCb != null)
      this.cancelCb();
  },

  setCancelCal:function (cb) {
    this.cancelCb = cb;
  },

  setCallback: function (confirmCb) {
    this.confirmCb = confirmCb;
  },

  setCallback2: function (daCb) {
    this.daCb = daCb;
  },

  setDes: function (text) {
    this.text_des.setString(text);
  },

});

var PlayerInfoDialog = JJDialog.extend({
  sprite_head:null,
  playerData:null,
  ctor: function (data) {
    this._super();
    this.playerData = data;
    var JsonRes = GameHallJson.PlayerInfoDialog;
    if(GAMENAME =='qidong')
    {
      JsonRes = QDMajhongJson.PlayerInfoDialog
    }
    var root = ccs.load(JsonRes).node;
    this.addChild(root);
    var panel = ccui.helper.seekWidgetByName(root,"panel");
    var panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
    panel.addClickEventListener(function () {
      this.dismissDialog();
    }.bind(this));

    panel_root.addClickEventListener(function () {
      this.dismissDialog();
    }.bind(this));

    this.sprite_head = ccui.helper.seekWidgetByName(panel_root,"sprite_head");
    var image_sex_icon = ccui.helper.seekWidgetByName(panel_root,"image_sex_icon");
    var text_name = ccui.helper.seekWidgetByName(panel_root,"text_name");
    var text_id = ccui.helper.seekWidgetByName(panel_root,"text_id");
    var text_ip = ccui.helper.seekWidgetByName(panel_root,"text_ip");
    var id = data['uid'];
    if(id == hall.user.uid)
    {
      //text_name.setString(sliceName(base64.decode(hall.user["nickName"])));
      text_name.setString(base64.decode(hall.user["nickName"]));
      text_id.setString('ID: '+hall.user['uid']);

        //ip过滤：ip.replace(/::ffff:/, '')
      text_ip.setString('IP:'+hall.user['ip'].replace(/::ffff:/, ''));
      JJLog.print("userSex:" + hall.user['userSex']);
      if (hall.user['userSex'] == undefined || hall.user['userSex'] == 0){
          hall.user['userSex'] = 1;
      }
      image_sex_icon.loadTexture(SexInfo[hall.user['userSex']]['icon'],ccui.Widget.PLIST_TEXTURE);
    }else
    {
      if(hall.getPlayingGame().table.uidOfInfo(data["uid"]) != null)
      {
        var name = base64.decode(data['nickName']);
        // if(name.length > 15)
        // {
        //   name = name.slice(0,15);
        // }
        text_name.setString(name);
        text_id.setString('ID:'+id);
        var ip = data['ip'];

          //ip过滤：ip.replace(/::ffff:/, '')
        text_ip.setString('IP:'+ip.replace(/::ffff:/, ''));
        if(data['userSex'] != 2 && data['userSex']  != 1)
        {
          data['userSex'] = 1;
        }
        var headStr = SexInfo[data['userSex']];
        image_sex_icon.loadTexture(headStr['icon'],ccui.Widget.PLIST_TEXTURE);
      }
    }
    this.loadHead();
  },


  onEnter:function()
  {
    this._super();
  },

  loadHead:function()
  {

    if (this.playerData != null && this.playerData.headUrl != undefined && this.playerData.headUrl.length > 0) {
      if(this.playerData.headUrl.substring(this.playerData.headUrl.length-1,this.playerData.headUrl.length) == "0")
      {
        this.playerData.headUrl = this.playerData.headUrl.substring(0,this.playerData.headUrl.length-1)+"96";
      }
      var tex = util.getTextureForKey(this.playerData.headUrl);
      if (tex != null && tex != undefined) {
        var size = this.sprite_head.getContentSize();
        var sprite = new cc.Sprite(tex);
        var size_sp = sprite.getContentSize();
        sprite.setScaleX(size.width/size_sp.width);
        sprite.setScaleY(size.height/size_sp.height);
        sprite.setAnchorPoint(cc.p(0, 0));
        this.sprite_head.addChild(sprite);
      } else {
        cc.loader.loadImg(this.playerData.headUrl,{isCrossOrigin : true },
            function (err, tex) {
              JJLog.print(err, tex);
              if (err == null) {
                var size = this.sprite_head.getContentSize();
                var sprite = new cc.Sprite(tex);
                var size_sp = sprite.getContentSize();
                sprite.setScaleX(size.width/size_sp.width);
                sprite.setScaleY(size.height/size_sp.height);
                sprite.setAnchorPoint(cc.p(0, 0));
                this.sprite_head.addChild(sprite);
              }
            }.bind(this));
      }
    }
  },

  onExit:function()
  {
    this._super();
    this.releaseAllItem();
  },

  releaseAllItem: function () {
    this.sprite_head = null;
  },

});

var GamePlayerInfoDialog = JJDialog.extend({
  sprite_head:null,
  playerData:null,
  ctor: function (data) {
    this._super();
    this.playerData = data;
    var JsonRes = GameHallJson.PlayerInfo;
    if(GAMENAME =='qidong')
    {
      JsonRes = QDMajhongJson.PlayerInfo
    }
    var root = ccs.load(JsonRes).node;
    this.addChild(root);
    var panel = ccui.helper.seekWidgetByName(root,"panel");
    var panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
    panel.addClickEventListener(function () {
      this.dismissDialog();
    }.bind(this));

    panel_root.addClickEventListener(function () {
      this.dismissDialog();
    }.bind(this));

    this.sprite_head = ccui.helper.seekWidgetByName(panel_root,"sprite_head");
    var image_sex_icon = ccui.helper.seekWidgetByName(panel_root,"image_sex_icon");
    var text_name = ccui.helper.seekWidgetByName(panel_root,"text_name");
    var text_id = ccui.helper.seekWidgetByName(panel_root,"text_id");
    var text_ip = ccui.helper.seekWidgetByName(panel_root,"text_ip");
    var id = data['uid'];
    if(id == hall.user.uid)
    {
      text_name.setString(base64.decode(hall.user["nickName"]));
      text_id.setString('ID: '+hall.user['uid']);

        //ip过滤：ip.replace(/::ffff:/, '')
      text_ip.setString('IP:'+hall.user['ip'].replace(/::ffff:/, ''));
      JJLog.print("userSex:" + hall.user['userSex']);
      if (hall.user['userSex'] == undefined || hall.user['userSex'] == 0){
        hall.user['userSex'] = 1;
      }
      image_sex_icon.loadTexture(SexInfo[hall.user['userSex']]['icon'],ccui.Widget.PLIST_TEXTURE);
    }else
    {
      if(hall.getPlayingGame().table.uidOfInfo(data["uid"]) != null)
      {
        var name = base64.decode(data['nickName']);
        // if(name.length > 15)
        // {
        //   name = name.slice(0,15);
        // }
        text_name.setString(name);
        text_id.setString('ID:'+id);
        var ip = data['ip'];

          //ip过滤：ip.replace(/::ffff:/, '')
        text_ip.setString('IP:'+ip.replace(/::ffff:/, ''));
        if(data['userSex'] != 2 && data['userSex']  != 1)
        {
          data['userSex'] = 1;
        }
        var headStr = SexInfo[data['userSex']];
        image_sex_icon.loadTexture(headStr['icon'],ccui.Widget.PLIST_TEXTURE);
      }
    }

    if(hall.getPlayingGame().table.seatArray != null)
    {
      var nav = null;
      for(var i = 0;i<hall.getPlayingGame().table.seatArray.length;i++)
      {
        var info = hall.getPlayingGame().table.seatArray[i];
        if(info == null || info == undefined) continue;
        var uid = info["uid"];
        if(id == uid && info["nav"] != null)
        {
          nav = info["nav"];
          break;
        }
      }
      if (nav == null)
      {
        ccui.helper.seekWidgetByName(panel_root,"text_player0").setString("该玩家没有开启定位");
      }
      else
      {
        var index = 0;
        for(var i = 0;i<hall.getPlayingGame().table.seatArray.length;i++){
          var info = hall.getPlayingGame().table.seatArray[i];
          if(info == null || info == undefined) continue;
          var uid = info["uid"];
          if(id != uid && info["nav"] != null)
          {
            var dis = util.getDistance(nav.longitude,nav.latitude,info["nav"].longitude,info["nav"].latitude);
            var str = "与【";
            str += uid==hall.user.uid?"您":sliceName(base64.decode(info['nickName']));
            str += "】相距"+dis+"米";
            ccui.helper.seekWidgetByName(panel_root,"text_player"+index.toString()).setString(str);
            index++;
          }
        }
      }
    }
  },


  onEnter:function()
  {
    this._super();
    this.loadHead();

  },

  loadHead:function()
  {

    if (this.playerData != null && this.playerData.headUrl != undefined && this.playerData.headUrl.length > 0) {
      if(this.playerData.headUrl.substring(this.playerData.headUrl.length-1,this.playerData.headUrl.length) == "0")
      {
        this.playerData.headUrl = this.playerData.headUrl.substring(0,this.playerData.headUrl.length-1)+"96";
      }
      var tex = util.getTextureForKey(this.playerData.headUrl);
      if (tex != null && tex != undefined) {
        var size = this.sprite_head.getContentSize();
        var sprite = new cc.Sprite(tex);
        var size_sp = sprite.getContentSize();
        sprite.setScaleX(size.width/size_sp.width);
        sprite.setScaleY(size.height/size_sp.height);
        sprite.setAnchorPoint(cc.p(0, 0));
        this.sprite_head.addChild(sprite);
      } else {
        cc.loader.loadImg(this.playerData.headUrl,{isCrossOrigin : true },
            function (err, tex) {
              JJLog.print(err, tex);
              if (err == null) {
                var size = this.sprite_head.getContentSize();
                var sprite = new cc.Sprite(tex);
                var size_sp = sprite.getContentSize();
                sprite.setScaleX(size.width/size_sp.width);
                sprite.setScaleY(size.height/size_sp.height);
                sprite.setAnchorPoint(cc.p(0, 0));
                this.sprite_head.addChild(sprite);
              }
            }.bind(this));
      }
    }
  },

  onExit:function()
  {
    this._super();
    this.releaseAllItem();
  },

  releaseAllItem: function () {
    this.sprite_head = null;
  },

});

var SetupDialog = cc.Layer.extend({
  btn_close:null,
  slider_effect:null,
  slider_music:null,
  checkbox_effect:null,
  checkbox_music:null,
  panel_music1:null,
  panel_music2:null,
  panel_music3:null,
  panel_music4:null,
  panel_pt:null,
  panel_fy:null,
  panel_normal:null,
  panel_fast:null,
  panel_show:null,
  panel_notshow:null,
  ctor: function (type) {
    this._super();
    var jsonRes =GameHallJson.DeskSetup;
    if(GAMENAME == "shisanshui")
      jsonRes = SSSPokerJson.DeskSetup;
    if(GAMENAME == "qidong")
      jsonRes = QDMajhongJson.DeskSetup;
    var root = ccs.load(jsonRes).node;
    this.addChild(root);

    var panel_root =  ccui.helper.seekWidgetByName(root,"panel_root");
    this.slider_effect =  ccui.helper.seekWidgetByName(root,"slider_effect");
    this.slider_effect.addEventListener(this.sliderEvent, this);
    this.slider_music =  ccui.helper.seekWidgetByName(root,"slider_music");
    this.slider_music.addEventListener(this.sliderEvent, this);

    this.checkbox_effect = ccui.helper.seekWidgetByName(root,"checkbox_effect");
    this.checkbox_effect.addEventListener(this.selectedStateEvent,this);
    this.checkbox_music = ccui.helper.seekWidgetByName(root,"checkbox_music");
    this.checkbox_music.addEventListener(this.selectedStateEvent,this);
    this.btn_close = ccui.helper.seekWidgetByName(root,"btn_close");
    this.btn_close.addClickEventListener(function () {
      this.removeFromParent();
    }.bind(this));
    var btn_exit = ccui.helper.seekWidgetByName(root,"btn_exit");
    var btn_jiesan = ccui.helper.seekWidgetByName(root,"btn_jiesan");
    btn_jiesan.setVisible(false);
    btn_exit.setVisible(false);
    btn_exit.addClickEventListener(this.onLoginOut.bind(this));
    btn_jiesan.addClickEventListener(this.onDissolve.bind(this));
    if(1 == type)//结算
    {
      btn_jiesan.setVisible(true);
    }else
    {
      btn_exit.setVisible(true);
    }

    var checkbox_music1 =  ccui.helper.seekWidgetByName(root,"checkbox_music0");
    var checkbox_music2 =  ccui.helper.seekWidgetByName(root,"checkbox_music1");
    checkbox_music1.setTouchEnabled(false);
    checkbox_music2.setTouchEnabled(false);
    this.panel_music1 =  ccui.helper.seekWidgetByName(root,"panel_music0");
    this.panel_music1._checkBox = checkbox_music1;
    this.panel_music2 =  ccui.helper.seekWidgetByName(root,"panel_music1");
    this.panel_music2._checkBox = checkbox_music2;
    this.panel_music1.addClickEventListener(this.onClicMusickEvent.bind(this));
    this.panel_music2.addClickEventListener(this.onClicMusickEvent.bind(this));

    var checkbox_pt =  ccui.helper.seekWidgetByName(root,"checkbox_pt");
    checkbox_pt.setTouchEnabled(false);
    var checkbox_fy =  ccui.helper.seekWidgetByName(root,"checkbox_fy");
    checkbox_fy.setTouchEnabled(false);
    this.panel_pt = ccui.helper.seekWidgetByName(root,"panel_pt");
    this.panel_pt._checkBox = checkbox_pt;
    this.panel_fy = ccui.helper.seekWidgetByName(root,"panel_fy");
    this.panel_fy._checkBox = checkbox_fy;
    this.panel_pt.addClickEventListener(this.onClicMusickEvent.bind(this));
    this.panel_fy.addClickEventListener(this.onClicMusickEvent.bind(this));
    if(GAMENAME.indexOf("shisanshui") != -1)
    {
      var panel_yy = ccui.helper.seekWidgetByName(root,"panel_yy");
      panel_yy.setVisible(false);
    }
    if(GAMENAME == "shisanshui")
    {
      var panel_model = ccui.helper.seekWidgetByName(root,"panel_model");
      var checkbox_normal =  ccui.helper.seekWidgetByName(root,"checkbox_normal");
      checkbox_normal.setTouchEnabled(false);
      var checkbox_fast =  ccui.helper.seekWidgetByName(root,"checkbox_fast");
      checkbox_fast.setTouchEnabled(false);

      var config = util.getCacheItem('sss_model');
      checkbox_fast.setSelected(config == 2);
      checkbox_normal.setSelected(config != 2);

      this.panel_normal = ccui.helper.seekWidgetByName(panel_model,"panel_normal");
      this.panel_normal._checkBox = checkbox_normal;
      this.panel_fast = ccui.helper.seekWidgetByName(panel_model,"panel_fast");
      this.panel_fast._checkBox = checkbox_fast;
      this.panel_normal.addClickEventListener(this.onClicModelEvent.bind(this));
      this.panel_fast.addClickEventListener(this.onClicModelEvent.bind(this));

      var panel_score = ccui.helper.seekWidgetByName(root,"panel_score");
      var checkbox_show =  ccui.helper.seekWidgetByName(panel_score,"checkbox_show");
      checkbox_show.setTouchEnabled(false);
      var checkbox_notshow =  ccui.helper.seekWidgetByName(panel_score,"checkbox_notshow");
      checkbox_notshow.setTouchEnabled(false);

      var config2 = util.getCacheItem('sss_showscore');
      checkbox_notshow.setSelected(config2 == 2);
      checkbox_show.setSelected(config2 != 2);
      this.panel_show = ccui.helper.seekWidgetByName(panel_score,"panel_show");
      this.panel_show._checkBox = checkbox_show;
      this.panel_notshow = ccui.helper.seekWidgetByName(panel_score,"panel_notshow");
      this.panel_notshow._checkBox = checkbox_notshow;
      this.panel_show.addClickEventListener(this.onClicShowScoreEvent.bind(this));
      this.panel_notshow.addClickEventListener(this.onClicShowScoreEvent.bind(this));

      var checkbox_music3 =  ccui.helper.seekWidgetByName(root,"checkbox_music2");
      var checkbox_music4 =  ccui.helper.seekWidgetByName(root,"checkbox_music3");
      checkbox_music3.setTouchEnabled(false);
      checkbox_music4.setTouchEnabled(false);
      this.panel_music3 =  ccui.helper.seekWidgetByName(root,"panel_music2");
      this.panel_music3._checkBox = checkbox_music3;
      this.panel_music4 =  ccui.helper.seekWidgetByName(root,"panel_music3");
      this.panel_music4._checkBox = checkbox_music4;
      this.panel_music3.addClickEventListener(this.onClicMusickEvent.bind(this));
      this.panel_music4.addClickEventListener(this.onClicMusickEvent.bind(this));

      var bg = util.getCacheItem('backgroundmusic');
      if(bg == null || bg == undefined)
      {
        checkbox_music4.setSelected(false);
        checkbox_music3.setSelected(false);
      }else
      {
        checkbox_music4.setSelected(bg == 4);
        checkbox_music3.setSelected(bg == 3);
      }

    }

    var bg = util.getCacheItem('backgroundmusic');
    if(bg == null || bg == undefined || bg == "")
    {
      checkbox_music2.setSelected(false);
      checkbox_music1.setSelected(true);
    }else
    {
      checkbox_music2.setSelected(bg == 2);
      checkbox_music1.setSelected(bg == 1);
    }

    var location = util.getCacheItem('location');
    checkbox_fy.setSelected(location == 2);
    checkbox_pt.setSelected(location != 2);

    var btn_openNav = ccui.helper.seekWidgetByName(root,"btn_openNav");
    if(hall.songshen == 1) btn_openNav.setVisible(false);
    btn_openNav.addClickEventListener(this.onOpenNav.bind(this));
  },

  onClicMusickEvent:function (sender) {
    switch (sender)
    {
      case this.panel_music1:
        util.setCacheItem('backgroundmusic',1);
        this.panel_music1._checkBox.setSelected(true);
        this.panel_music2._checkBox.setSelected(false);
        if(GAMENAME == "shisanshui")
        {
          this.panel_music3._checkBox.setSelected(false);
          this.panel_music4._checkBox.setSelected(false);
        }
        sound.playBgSound();
        break;
      case this.panel_music2:
        util.setCacheItem('backgroundmusic',2);
        this.panel_music2._checkBox.setSelected(true);
        this.panel_music1._checkBox.setSelected(false);
        if(GAMENAME == "shisanshui")
        {
          this.panel_music3._checkBox.setSelected(false);
          this.panel_music4._checkBox.setSelected(false);
        }
        sound.playBgSound();
        break;
      case this.panel_music3:
        util.setCacheItem('backgroundmusic',3);
        this.panel_music2._checkBox.setSelected(false);
        this.panel_music1._checkBox.setSelected(false);
        if(GAMENAME == "shisanshui")
        {
          this.panel_music3._checkBox.setSelected(true);
          this.panel_music4._checkBox.setSelected(false);
        }
        sound.playBgSound();
        break;
      case this.panel_music4:
        util.setCacheItem('backgroundmusic',4);
        this.panel_music2._checkBox.setSelected(false);
        this.panel_music1._checkBox.setSelected(false);
        if(GAMENAME == "shisanshui")
        {
          this.panel_music3._checkBox.setSelected(false);
          this.panel_music4._checkBox.setSelected(true);
        }
        sound.playBgSound();
        break;
      case this.panel_pt:
        util.setCacheItem('location',1);
        this.panel_pt._checkBox.setSelected(true);
        this.panel_fy._checkBox.setSelected(false);
        break;
      case this.panel_fy:
        util.setCacheItem('location',2);
        this.panel_fy._checkBox.setSelected(true);
        this.panel_pt._checkBox.setSelected(false);
        break;
    }
  },


  onClicModelEvent:function (sender) {
    switch (sender)
    {
      case this.panel_fast:
        util.setCacheItem('sss_model',2);
        this.panel_fast._checkBox.setSelected(true);
        this.panel_normal._checkBox.setSelected(false);
        break;
      case this.panel_normal:
        util.setCacheItem('sss_model',1);
        this.panel_normal._checkBox.setSelected(true);
        this.panel_fast._checkBox.setSelected(false);
        break;
    }
  },

  onClicShowScoreEvent:function (sender) {
    switch (sender)
    {
      case this.panel_notshow:
        util.setCacheItem('sss_showscore',2);
        this.panel_notshow._checkBox.setSelected(true);
        this.panel_show._checkBox.setSelected(false);
        break;
      case this.panel_show:
        util.setCacheItem('sss_showscore',1);
        this.panel_show._checkBox.setSelected(true);
        this.panel_notshow._checkBox.setSelected(false);
        break;
    }
  },

  onEnter:function()
  {
    this._super();
    var bgOn = util.getCacheItem('background_music');
    if(bgOn == 0)
    {
      this.checkbox_music.setSelected(true);
    }else
    {
      this.checkbox_music.setSelected(false);
    }

    var musicOn = util.getCacheItem('background_music');
    if(musicOn == 0)
    {
      this.checkbox_music.setSelected(true);
    }else
    {
      this.checkbox_music.setSelected(false);
    }

    var effectOn = util.getCacheItem('sound_effect');
    if(effectOn == 0)
    {
      this.checkbox_effect.setSelected(true);
    }else
    {
      this.checkbox_effect.setSelected(false);
    }


    var effectVolume =  util.getCacheItem('effect_volume');//audioEngine.getMusicVolume();
    if(effectVolume == null)
    {
      this.slider_effect.setPercent(100);
    }else
    {
      this.slider_effect.setPercent(effectVolume*100);
    }

    var soundVolume = util.getCacheItem('music_volume');
    if(soundVolume == null)
    {
      this.slider_music.setPercent(100);
    }else
    {
      this.slider_music.setPercent(soundVolume*100);
    }

  },

  sliderEvent: function (sender, type) {
    switch (type) {
      case ccui.Slider.EVENT_PERCENT_CHANGED:
      {
        var percent = Math.ceil(sender.getPercent());
        var volume = percent/100;
        if(sender == this.slider_effect)
        {
          cc.audioEngine.setEffectsVolume(volume);
          this.slider_effect.setPercent(percent);
          util.setCacheItem('effect_volume',volume);
        }else if(sender == this.slider_music)
        {
          cc.audioEngine.setMusicVolume(volume);
          this.slider_music.setPercent(percent);
          util.setCacheItem('music_volume',volume);
        }
        //var num = Math.floor(this.getMaxCoinChip() * percent/100);

      }
        break;
      default:
        break;
    }
  },



  onDissolve: function () {
    hall.getPlayingGame().net.dissolveSeat(1, function (data) {
      this.removeFromParent();
    }.bind(this));
  },

  onLoginOut: function () {
    JJLog.print('登出！');
    util.removeCacheItem('wxUser');
    //cc.director.runScene(new SangongLoginScene());
    //cc.director.end();
    qp.exit();
  },

  onOpenNav: function () {
    hall.net.openLocationSetting();
  },

  showDialog: function () {
    cc.director.getRunningScene().addChild(this);
  },

  selectedStateEvent: function (sender, type) {
    switch (type) {
      case ccui.CheckBox.EVENT_SELECTED:
      {
        if(sender == this.checkbox_effect)
        {
          this.slider_effect.setEnabled(false);
          util.setCacheItem('sound_effect',0);
          sound.stopEffect();

        }else if(sender == this.checkbox_music)
        {
          this.slider_music.setEnabled(false);
          util.setCacheItem('background_music',0);
          sound.stopBgSound();

        }
      }

        break;
      case ccui.CheckBox.EVENT_UNSELECTED:
      {
        if(sender == this.checkbox_effect)
        {
          this.slider_effect.setEnabled(true);
          util.setCacheItem('sound_effect',1);
        }else if(sender == this.checkbox_music)
        {
          this.slider_music.setEnabled(true);
          util.setCacheItem('background_music',1);
          sound.playBgSound();
        }
      }
        break;
      default:
        break;
    }
  },
});

var ClubPlayerInfoDialog = JJDialog.extend({
    sprite_head: null,
    playerData: null,
    pack_info: null,
    ctor: function (data, pack_info) {
        this._super();
        this.playerData = data;
        var JsonRes = ClubJson.ClubSelfInfo;
        var root = ccs.load(JsonRes).node;
        this.addChild(root);
        var panel = ccui.helper.seekWidgetByName(root, "panel");
        var panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        panel.addClickEventListener(function () {
            this.dismissDialog();
        }.bind(this));

        panel_root.addClickEventListener(function () {
            this.dismissDialog();
        }.bind(this));

        this.pack_info = pack_info;
        this.sprite_head = ccui.helper.seekWidgetByName(panel_root, "sprite_head");
        var image_sex_icon = ccui.helper.seekWidgetByName(panel_root, "image_sex_icon");
        image_sex_icon.setVisible(false);
        var text_name = ccui.helper.seekWidgetByName(panel_root, "text_name");
        var text_id = ccui.helper.seekWidgetByName(panel_root, "text_id");
        var text_note = ccui.helper.seekWidgetByName(panel_root, "text_note");
        var input_note = ccui.helper.seekWidgetByName(panel_root, "input_note");
        // var text_ip = ccui.helper.seekWidgetByName(panel_root,"text_ip");
        var btn_back = ccui.helper.seekWidgetByName(panel_root, "btn_back");
        btn_back.addClickEventListener(function () {
            club.quitPack(this.pack_info);
            this.dismissDialog();
        }.bind(this));
        var btn_change = ccui.helper.seekWidgetByName(panel_root, "btn_change");
        btn_change.addClickEventListener(function () {
            console.log("this.pack_info", this.pack_info, input_note.getString());
            club.updateMemberNote(this.pack_info.pid, input_note.getString());
            this.dismissDialog();
        }.bind(this));
        var id = data['uid'];
        text_name.setString(data["userName"]);
        text_id.setString('ID: ' + data['uid']);
        btn_change.setVisible(false);
        btn_back.setVisible(false);
        text_note.setVisible(false);
        input_note.setVisible(false);
        if (id == hall.user.uid) {
            btn_change.setVisible(true);
            btn_back.setVisible(true);
            input_note.setVisible(true);
            input_note.setString(data.notice);
        } else {
            text_note.setVisible(true);
            text_note.setString(data.notice || "该玩家暂未填写个人信息哦!");
        }
        this.loadHead();
    },


    onEnter: function () {
        this._super();
    },

    loadHead: function () {

        if (this.playerData != null && this.playerData.headUrl != undefined && this.playerData.headUrl.length > 0) {
            if (this.playerData.headUrl.substring(this.playerData.headUrl.length - 1, this.playerData.headUrl.length) == "0") {
                this.playerData.headUrl = this.playerData.headUrl.substring(0, this.playerData.headUrl.length - 1) + "96";
            }
            var tex = util.getTextureForKey(this.playerData.headUrl);
            if (tex != null && tex != undefined) {
                var size = this.sprite_head.getContentSize();
                var sprite = new cc.Sprite(tex);
                var size_sp = sprite.getContentSize();
                sprite.setScaleX(size.width / size_sp.width);
                sprite.setScaleY(size.height / size_sp.height);
                sprite.setAnchorPoint(cc.p(0, 0));
                this.sprite_head.addChild(sprite);
            } else {
                cc.loader.loadImg(this.playerData.headUrl, {isCrossOrigin: true},
                    function (err, tex) {
                        JJLog.print(err, tex);
                        if (err == null) {
                            var size = this.sprite_head.getContentSize();
                            var sprite = new cc.Sprite(tex);
                            var size_sp = sprite.getContentSize();
                            sprite.setScaleX(size.width / size_sp.width);
                            sprite.setScaleY(size.height / size_sp.height);
                            sprite.setAnchorPoint(cc.p(0, 0));
                            this.sprite_head.addChild(sprite);
                        }
                    }.bind(this));
            }
        }
    },

    onExit: function () {
        this._super();
        this.releaseAllItem();
    },

    releaseAllItem: function () {
        this.sprite_head = null;
    },

});
//加号按钮点击打开充值界面
var Chongzhi = JJDialog.extend({

    ctor: function () {

        this._super();
        var JsonRes = GameHallJson.Chongzhi;

        var root = ccs.load(JsonRes).node;
        this.addChild(root);
        var panel = ccui.helper.seekWidgetByName(root,"panel");
        var panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
        panel.addClickEventListener(function () {
            this.dismissDialog();
        }.bind(this));
        panel_root.addClickEventListener(function () {
            this.dismissDialog();
        }.bind(this));

        var text_tip0 = ccui.helper.seekWidgetByName(root,"text_tip0");
        var text_tip2 = ccui.helper.seekWidgetByName(root,"text_tip2");

    },



});

var AddFKDialog = JJDialog.extend({
    btn_kfWechat:null,
    btn_dlWechat:null,
    btn_tsWechat:null,

    weChat01:null,
    weChat02:null,
    weChat03:null,

  ctor: function () {

    this._super();
    var JsonRes = GameHallJson.AddFK;

    if(GAMENAME =='qidong')
    {
      JsonRes = QDMajhongJson.AddFK
    }
    var root = ccs.load(JsonRes).node;
    this.addChild(root);
    var panel = ccui.helper.seekWidgetByName(root,"panel");
    var panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
      panel.addClickEventListener(function () {
          this.dismissDialog();
      }.bind(this));

      if(GAMENAME =='qidong')
      {
          var btn_close = ccui.helper.seekWidgetByName(root,"btn_close");
          btn_close.addClickEventListener(function () {
              this.dismissDialog();
          }.bind(this));
      }

    panel_root.addClickEventListener(function () {
      this.dismissDialog();
    }.bind(this));

    var text_tip0 = ccui.helper.seekWidgetByName(root,"text_tip0");
    var text_tip1 = ccui.helper.seekWidgetByName(root,"text_tip1");
    var text_tip2 = ccui.helper.seekWidgetByName(root,"text_tip2");

    if(GAMENAME == "qidong")
    {
        this.btn_kfWechat = ccui.helper.seekWidgetByName(root,"copy_Button_1");
        this.btn_kfWechat.addClickEventListener(this.onCopyLabel.bind(this));
        this.btn_dlWechat = ccui.helper.seekWidgetByName(root,"copy_Button_2");
        this.btn_dlWechat.addClickEventListener(this.onCopyLabel.bind(this));
        this.btn_tsWechat = ccui.helper.seekWidgetByName(root,"copy_Button_3");
        this.btn_tsWechat.addClickEventListener(this.onCopyLabel.bind(this));

        this.weChat01 = ccui.helper.seekWidgetByName(root,"wechat01");
        this.weChat02 = ccui.helper.seekWidgetByName(root,"wechat02");
        this.weChat03 = ccui.helper.seekWidgetByName(root,"wechat03");

        this.updateWechat();
    }

    // if(GAMENAME == "qidong")
    // {
    //   text_tip0.setString(' 充值咨询: yjqd808【微信号】');
    //   text_tip1.setString(' 代理招募: yjqd808【微信号】');
    //   text_tip2.setString(' 投诉举报: yjqd808【微信号】');
    // }

  },

    updateWechat:function()
    {
      for(var i in hall.agentWeChat)
      {
        if(hall.agentWeChat[i].key == "kfWeChat")
        {

          this.weChat01.setString(hall.agentWeChat[i].value)
        }else if(hall.agentWeChat[i].key == "dlWeChat")
        {
            this.weChat02.setString(hall.agentWeChat[i].value)
        }
        else if(hall.agentWeChat[i].key == "tsWeChat")
        {
            this.weChat03.setString(hall.agentWeChat[i].value)
        }
      }

    },

    onCopyLabel: function (sender) {
      var weChatId = null;
        switch (sender) {
            case this.btn_kfWechat:
                weChatId = this.weChat01.getString();
                break;
            case this.btn_dlWechat:
                weChatId = this.weChat02.getString();
                break;
            case this.btn_tsWechat:
                weChatId = this.weChat02.getString();
                break;
            default:
                break;
        }
        util.copyLabel(weChatId);
        var bar = new QDTipBar()
        bar.show("复制成功！",1);
    },
});

//  活动弹框
var HuoDongDialog = JJDialog.extend({

    wechat:null,
    ctor: function () {
        this._super();
        var JsonRes = QDMajhongJson.HallActivety
        var root = ccs.load(JsonRes).node;
        this.addChild(root);
        var panel = ccui.helper.seekWidgetByName(root,"panel");
        panel.addClickEventListener(function () {
            this.onclickBtnClose();
        }.bind(this));

        this.btn_close =  ccui.helper.seekWidgetByName(root,"btn_close");
        this.btn_close.addClickEventListener(this.onclickBtnClose.bind(this));

        this.btn_close =  ccui.helper.seekWidgetByName(root,"btn_copy");
        this.btn_close.addClickEventListener(this.onCopyWeChat.bind(this));
        this.wechat = ccui.helper.seekWidgetByName(root,"wechat");
    },
    onEnter:function()
    {
        this._super();
        this.setWechat();
    },

    setWechat:function()
    {
      for(var i in hall.agentWeChat)
      {
          if(hall.agentWeChat[i].key == "kfWeChat")
          {
              this.wechat.setString(hall.agentWeChat[i].value);
              break;
          }
      }
    },

    onclickBtnClose:function()
    {
        this.removeFromParent();
    },

    onCopyWeChat: function () {
        var strLaber = null;
        for(var i in hall.agentWeChat)
        {
            if(hall.agentWeChat[i].key == "kfWeChat")
            {
                strLaber = hall.agentWeChat[i].value;
                break;
            }
        }
        util.copyLabel(strLaber);
        var bar = new QDTipBar()
        bar.show("复制成功！",1);
    },

});


var JJGiveRoomCard = JJDialog.extend({
    panel_root:null,
  text_id:null,
  text_amount:null,
  textfield_id:null,
  textfield_amount:null,
  btn_give:null,
  btn_cancel:null,
  text_tip:null,
    ctor:function(){
      this._super();
      var root = ccs.load(GameHallJson.SendRoomCard).node;
      this.addChild(root);

      this.panel_root =  ccui.helper.seekWidgetByName(root,"panel_root");
      this.text_tip =  ccui.helper.seekWidgetByName(root,"text_tip");
      this.text_tip.setVisible(false);
      this.text_id =  ccui.helper.seekWidgetByName(root,"text_id");
      this.text_amount =  ccui.helper.seekWidgetByName(root,"text_amount");
      this.textfield_id =  ccui.helper.seekWidgetByName(root,"textfield_id");
      this.textfield_id.setPlaceHolderColor(cc.color.GRAY);
      this.textfield_id.setTextColor(cc.color.BLACK);

      this.textfield_amount =  ccui.helper.seekWidgetByName(root,"textfield_amount");
      this.textfield_amount.setPlaceHolderColor(cc.color.GRAY);
      this.textfield_amount.setTextColor(cc.color.BLACK);
      this.btn_give =  ccui.helper.seekWidgetByName(root,"btn_give");
      this.btn_give.addClickEventListener(this.onGive.bind(this));
      this.btn_cancel =  ccui.helper.seekWidgetByName(root,"btn_cancel");
      this.btn_cancel.addClickEventListener(this.dismissDialog.bind(this));




    },

    onEnter: function () {
      this._super();
      this.updateInfo();
      this.registerAllEvents();
    },


  onExit: function () {
    this._super();
    this.removeAllEvents();
  },

  registerAllEvents: function () {
    qp.event.listen(this, 'hallUpdatePlayerAttr', this.onUpdatePlayerAttr.bind(this));
  },
  removeAllEvents: function () {
    qp.event.stop(this, 'hallUpdatePlayerAttr');

  },
  onUpdatePlayerAttr: function (data) {
    JJLog.print('hall onUpdatePlayerAttr');
    JJLog.print(data);

    if(data['gemNum'] != null || data['gemNum']  != undefined)
    {
      //this.text_amount.setString(data['gemNum']);
      this.text_amount.setString('钻石：'+data['gemNum']);
    }

  },

    resetInput: function () {
      this.textfield_amount.setString('');
      this.textfield_id.setString('');
    },

    updateInfo: function () {
      this.text_id.setString('ID：'+hall.user.uid);
      this.text_amount.setString('钻石：'+hall.user.gemNum);
    },

    onGive:function()
    {
      if(this.checkInput() || 1)
      {
        JJLog.print('赠送给:'+this.textfield_id.getString()+' 赠送数量：'+this.textfield_amount.getString());
        var data = {};
        data['type'] = 1;
        data['gemNum'] = this.textfield_amount.getString();
        data['giveUid'] = this.textfield_id.getString();
        var str = '';
        str = '赠送ID:'+data['giveUid']+','+data['gemNum']+'钻石?';
        var dialog = new JJMajhongDecideDialog();
        dialog.setDes(str);
        dialog.setCallback(this.giveRoomCard.bind(this));
        dialog.showDialog();

      }

    },

    giveRoomCard:function()
    {
      JJLog.print('resp 赠送:'+this.textfield_id.getString()+' 赠送数量：'+this.textfield_amount.getString());
      var data2 = {};
      data2['type'] = 1;
      data2['gemNum'] = this.textfield_amount.getString();
      data2['giveUid'] = this.textfield_id.getString();

      var tipStr = '赠送给玩家ID:'+this.textfield_id.getString()+','+this.textfield_amount.getString()+'钻石成功!';
      majhong.net.giveRoomCard(data2,function(data){
        JJLog.print(data);
        if(data['code'] == 200)
        {
          var dialog = new JJConfirmDialog();
          dialog.setDes(tipStr);
          dialog.showDialog();
        }else if(data['code'] == 500)
        {
          var dialog = new JJConfirmDialog();
          dialog.setDes(data['err']);
          dialog.showDialog();
        }

      });
    },

  checkInput:function()
  {
    this.text_tip.setVisible(false);

    var stdId = this.textfield_id.getString();
    if(stdId.length <= 0)
    {
      this.text_tip.setString("赠送ID不能为空!");
      this.text_tip.setVisible(true);
      return false;
    }

    var amount = this.textfield_amount.getString();

    if(amount.length <= 0)
    {
      this.text_tip.setString("赠送数量不能为空!");
      this.text_tip.setVisible(true);
      return false;
    }



    var re = /^[1-9]+[0-9]*]*$/;

    if(!re.test(stdId))
    {
      this.text_tip.setString("赠送ID必须为数字!");
      this.text_tip.setVisible(true);
      return false;
    }


    if(!re.test(amount))
    {
      this.text_tip.setString("赠送数量必须为整数!");
      this.text_tip.setVisible(true);
      return false;
    }

    if(amount > hall.user.gemNum)
    {
      this.text_tip.setString("赠送钻石数量超过当前账户数量!");
      this.text_tip.setVisible(true);
      return false;
    }



    return true;

  },



});

var JJRealName = JJDialog.extend({
  text_name:null,
  text_amount:null,
  textfield_name:null,
  textfield_amount:null,
  btn_ok:null,
  btn_cancel:null,
  text_tip:null,
  ctor:function(){
    this._super();
    var root = ccs.load(GameHallJson.RealName).node;
    this.addChild(root);
    this.text_tip =  ccui.helper.seekWidgetByName(root,"text_tip");
    this.text_tip.setVisible(false);

    this.textfield_name =  ccui.helper.seekWidgetByName(root,"textfield_name");
    this.textfield_name.setPlaceHolderColor(cc.color.GRAY);
    this.textfield_name.setTextColor(cc.color.BLACK);

    this.textfield_amount =  ccui.helper.seekWidgetByName(root,"textfield_amount");
    this.textfield_amount.setPlaceHolderColor(cc.color.GRAY);
    this.textfield_amount.setTextColor(cc.color.BLACK);

    this.btn_ok =  ccui.helper.seekWidgetByName(root,"btn_ok");
    this.btn_ok.addClickEventListener(this.onOk.bind(this));

    this.btn_cancel =  ccui.helper.seekWidgetByName(root,"btn_close");
    this.btn_cancel.addClickEventListener(this.dismissDialog.bind(this));

  },

  onOk:function()
  {
    if(this.checkInput() )
    {
      this.text_tip.setString("发送验证成功");
      this.text_tip.setVisible(true);
    }

  },
  checkInput:function()
  {
    this.text_tip.setVisible(false);

    var stdId = this.textfield_name.getString();
    if(stdId.length <= 0)
    {
      this.text_tip.setString("姓名不能为空!");
      this.text_tip.setVisible(true);
      return false;
    }

    var amount = this.textfield_amount.getString();

    if(amount.length <= 0)
    {
      this.text_tip.setString("身份证号不能为空!");
      this.text_tip.setVisible(true);
      return false;
    }



   // var re = /^[1-9]+[0-9]*]*$/;
    var re =/^[\u4e00-\u9fa5]{2,5}$/;

    if(!re.test(stdId))
    {
      this.text_tip.setString("姓名填写不正确!");
      this.text_tip.setVisible(true);
      return false;
    }

    var  re2 = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(!re2.test(amount))
    {
      this.text_tip.setString("身份证输入不合法!");
      this.text_tip.setVisible(true);
      return false;
    }


    return true;

  },

  onEnter: function () {
    this._super();

  },

  onExit: function () {
    this._super();

  },

});

var JJCheckRecord = JJDialog.extend({
  panel_root:null,
  textfield_input:null,
  btn_confirm:null,
  btn_cancel:null,
  ctor:function(){
    this._super();
    var JsonRes = GameHallJson.CheckRecord;
    if(GAMENAME =='qidong')
    {
      JsonRes = QDMajhongJson.CheckRecord
    }
    var root = ccs.load(JsonRes).node;
    this.addChild(root);

    this.panel_root =  ccui.helper.seekWidgetByName(root,"panel_root");
    this.textfield_input =  ccui.helper.seekWidgetByName(root,"textfield_input");
    this.textfield_input.setPlaceHolderColor(cc.color.GRAY);
    this.textfield_input.setTextColor(cc.color.BLACK);


    this.btn_confirm =  ccui.helper.seekWidgetByName(root,"btn_confirm");
    this.btn_confirm.addClickEventListener(this.onCheckRecord.bind(this));
    this.btn_cancel =  ccui.helper.seekWidgetByName(root,"btn_cancel");
    this.btn_cancel.addClickEventListener(this.dismissDialog.bind(this));


  },

  onEnter: function () {
    this._super();
  },


  onExit: function () {
    this._super();
  },


  onCheckRecord:function()
  {
    if(this.checkInput())
    {
      var recordId = this.textfield_input.getString();
      MajhongLoading.show('加载中...');
      hall.net.getHuiFangInfo(recordId, function(data) {
          if(data['code'] == 200)
          {
            hall.enterRecord(GAMETYPES[data['serverType']],data['record']);
          }else if(data['code'] == 500)
          {
            MajhongLoading.dismiss();
            var dialog = new JJConfirmDialog();
            dialog.setDes(data['err']);
            dialog.showDialog();
          }
        });
    }

  },

  checkInput:function()
  {
    var stdId = this.textfield_input.getString();
    if(stdId.length < 6)
    {
      var dialog = new JJConfirmDialog();
      dialog.setDes('录像ID长度少于6');
      dialog.showDialog();
      return false;
    }

    var re = /^[1-9]+[0-9]*]*$/;

    if(!re.test(stdId))
    {
      this.text_tip.setString("录像ID必须为数字!");
      this.text_tip.setVisible(true);
      return false;
    }


    if(!re.test(stdId))
    {
      this.text_tip.setString("录像ID必须为整数!");
      this.text_tip.setVisible(true);
      return false;
    }
    return true;
  },



});

var DissloveOptionDialog = JJDialog.extend({
  btn_pass:null,
  btn_agree:null,
  text_name:null,
  ctor: function (data) {
    this._super();
    var JsonRes = GameHallJson.Dissolve;
    if(GAMENAME =='qidong')
    {
      JsonRes = QDMajhongJson.Dissolve
    }
    var root = ccs.load(JsonRes).node;
    this.addChild(root);

    this.btn_pass = ccui.helper.seekWidgetByName(root,"btn_pass");
    this.btn_pass.addClickEventListener(function () {
      hall.getPlayingGame().net.dissolveSeat(3, function (data) {
        this.dismissDialog();
      }.bind(this));
    }.bind(this));
    this.btn_agree = ccui.helper.seekWidgetByName(root,"btn_agree");
    this.btn_agree.addClickEventListener(function () {
      hall.getPlayingGame().net.dissolveSeat(2, function (data) {
        this.dismissDialog();
      }.bind(this));
    }.bind(this));
    this.text_name = ccui.helper.seekWidgetByName(root,"text_name");
    var info = hall.getPlayingGame().table.uidOfInfo(data['uid']);
    this.text_name.setString(sliceName(base64.decode(info['nickName'])));
  },

  onEnter: function () {
    this._super();
    qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);
    qp.event.listen(this, 'mjGameOver', this.onGameOver);
  },

  onExit: function () {
    qp.event.stop(this, 'mjDissolutionTable');
    qp.event.stop(this, 'mjGameOver');
    this._super();
  },

  onGameOver:function (data) {
    this.removeFromParent();
  },

  onDissolutionTable: function (data) {
    if(data['result'] == 0)//0拒绝解散
    {
      this.removeFromParent();
    }else if(data['result'] == 1)//1 解散成功
    {
      this.removeFromParent();
    }else
    {

    }
  }


});

var DissloveResultDialog = JJDialog.extend({
  text_dissolve:null,
  text_dissolve_1:null,
  text_dissolve_2:null,
  text_dissolve_3:null,
  text_clock:null,
  panel_root:null,
  ctor: function (data,time) {
    this._super();
    var JsonRes = GameHallJson.DissolveResult;
    if(GAMENAME =='qidong')
    {
      JsonRes = QDMajhongJson.DissolveResult
    }
    var root = ccs.load(JsonRes).node;
    this.addChild(root);
    this.panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
    this.text_dissolve = ccui.helper.seekWidgetByName(root,"text_dissolve");
    this.text_dissolve.setString('玩家['+sliceName(base64.decode(hall.user.nickName)) +']申请解散房间,请等待其他玩家选择.(超过五分钟未选择,默认同意)');
    this.text_dissolve_1 = ccui.helper.seekWidgetByName(root,"text_dissolve_1");
    var info = hall.getPlayingGame().table.rightSeatInfo();
    if(info != null)
    {
      this.text_dissolve_1.setTag(info['uid']);
      this.text_dissolve_1.setString('['+sliceName(base64.decode(info['nickName']))+']'+ '  等待选择');
    }else
    {
      this.text_dissolve_1.setString('');
    }

    this.text_dissolve_2 = ccui.helper.seekWidgetByName(root,"text_dissolve_2");
    info = hall.getPlayingGame().table.upSeatInfo();
    if(info != null)
    {
      this.text_dissolve_2.setTag(info['uid']);
      this.text_dissolve_2.setString('['+sliceName(base64.decode(info['nickName']))+']'+ '  等待选择');
    }else
    {
      this.text_dissolve_2.setString('');
    }

    this.text_dissolve_3 = ccui.helper.seekWidgetByName(root,"text_dissolve_3");
    info = hall.getPlayingGame().table.leftSeatInfo();
    if(info != null)
    {
      this.text_dissolve_3.setVisible(true);
      this.text_dissolve_3.setTag(info['uid']);
      this.text_dissolve_3.setString('['+sliceName(base64.decode(info['nickName']))+']'+ '  等待选择');
    }else
    {
      this.text_dissolve_3.setString('');
    }


    var btn_agree = ccui.helper.seekWidgetByName(root,"btn_agree");
    var btn_refuse = ccui.helper.seekWidgetByName(root,"btn_refuse");
    btn_agree.setVisible(false);
    btn_refuse.setVisible(false);
    this.text_clock = ccui.helper.seekWidgetByName(root,"text_clock");
    if(!!data)
    {
      this.startClock(time);
      for(var i=0;i<data.length;i++)
      {
        if(this.text_dissolve_1.getTag() == data[i])
        {
          if( i == 0)
          {
            this.text_dissolve.setString('玩家['+sliceName(base64.decode(hall.getPlayingGame().table.rightSeatInfo()['nickName'])) +']申请解散房间,请等待其他玩家选择.(超过五分钟未选择,默认同意)');
          }
          this.text_dissolve_1.setString('['+sliceName(base64.decode(hall.getPlayingGame().table.rightSeatInfo()['nickName']))+']'+ '  同意');
        }
        if(this.text_dissolve_2.getTag() == data[i])
        {
          if( i == 0)
          {
            this.text_dissolve.setString('玩家['+sliceName(base64.decode(hall.getPlayingGame().table.upSeatInfo()['nickName'])) +']申请解散房间,请等待其他玩家选择.(超过五分钟未选择,默认同意)');
          }
          this.text_dissolve_2.setString('['+sliceName(base64.decode(hall.getPlayingGame().table.upSeatInfo()['nickName']))+']'+ '  同意');
        }

        if(this.text_dissolve_3.getTag() == data[i])
        {
          if( i == 0)
          {
            this.text_dissolve.setString('玩家['+sliceName(base64.decode(hall.getPlayingGame().table.leftSeatInfo()['nickName'])) +']申请解散房间,请等待其他玩家选择.(超过五分钟未选择,默认同意)');
          }
          this.text_dissolve_3.setString('['+sliceName(base64.decode(hall.getPlayingGame().table.leftSeatInfo()['nickName']))+']'+ '  同意');
        }

      }
    }
  },

  onEnter: function () {
    this._super();
    qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);
    qp.event.listen(this, 'mjGameOver', this.onGameOver);
    //this.startClock(300);

  },

  startClock: function (sec) {
    this.text_clock.setString(sec);

    this.schedule(this.countDown,1);
  },

  onGameOver:function (data) {
    this.removeFromParent();
  },

  countDown: function (dt) {
    var sec = parseInt(this.text_clock.getString());
    if(sec >= 1)
    {
      sec--;
    }
    else
    {
      sec = '0';
    }

    this.text_clock.setString(sec);
  },

  stopClock: function () {
    this.unschedule(this.countDown);
  },


  onDissolutionTable: function (data) {

    if(data['result'] == 0)//0拒绝解散
    {
      this.removeFromParent();
    }else if(data['result'] == 1)//1 解散成功
    {
      //cc.director.runScene(new GameScene());
      this.removeFromParent();
    }else
    {
      if(data['status'] == 1)
      {
        if(data['uid'] == hall.user.uid)
        {
          var secondTime = data['time'];
          var minute = secondTime/60;
          this.text_dissolve.setString('玩家['+sliceName(base64.decode(hall.user.nickName)) +']申请解散房间,请等待其他玩家选择.(超过 '+secondTime+' 秒钟未选择,默认同意)');
          this.startClock(secondTime);
        }else
        {
          var text = this.panel_root.getChildByTag(data['uid']);
          if(text != null)
          {
            var msg = '拒绝';
            if(data['status'] == 2)
            {
              msg = '同意';
            }
            var info =  hall.getPlayingGame().table.uidOfInfo(data['uid']);
            text.setString(sliceName(base64.decode(info['nickName']))+ ' '+msg);
          }
        }

      }else
      {
        var text = this.panel_root.getChildByTag(data['uid']);
        if(text != null)
        {
          var msg = '拒绝';
          if(data['status'] == 2)
          {
            msg = '同意';
          }
          var info =  hall.getPlayingGame().table.uidOfInfo(data['uid']);
          text.setString('['+sliceName(base64.decode(info['nickName']))+']'+ ' '+msg);

        }
      }
    }



  },

  onExit: function () {
    qp.event.stop(this, 'mjDissolutionTable');
    qp.event.stop(this, 'mjGameOver');
    this._super();
  },



});

var SpeakTip = cc.Layer.extend({
  panel_root:null,
  sprite_op:null,
  action:null,
  root:null,
  ctor: function () {
    this._super();
    var json = ccs.load(GameHallJson.Speak);
    this.root = json.node;
    this.action = json.action;
    this.addChild(this.root);
  },

  onEnter: function () {
    this._super();
    this.root.runAction(this.action);
    this.action.play('speak',true);
  },

  showTip: function () {
    if(cc.director.getRunningScene().getChildByTag(GameTag.TAG_SPEAKER))
    {
      cc.director.getRunningScene().removeChildByTag(GameTag.TAG_SPEAKER);
    }
    cc.director.getRunningScene().addChild(this,GameTag.TAG_SPEAKER,GameTag.TAG_SPEAKER);
  },

  dismiss: function () {
    this.removeFromParent(true);
  },
});

if(GAMENAME == "xuezhan")
{
  var SetupDialog = cc.Layer.extend({
    btn_close:null,
    slider_effect:null,
    slider_music:null,
    checkbox_effect:null,
    checkbox_music:null,
    // panel_music1:null,
    // panel_music2:null,
    // panel_pt:null,
    // panel_fy:null,
    // panel_normal:null,
    // panel_fast:null,
    ctor: function (type) {
      this._super();
      var root = ccs.load(XueZhanMajhongJson.DeskSetup).node;
      this.addChild(root);

      var panel_root =  ccui.helper.seekWidgetByName(root,"panel_root");
      this.slider_effect =  ccui.helper.seekWidgetByName(root,"slider_effect");
      this.slider_effect.addEventListener(this.sliderEvent, this);
      this.slider_music =  ccui.helper.seekWidgetByName(root,"slider_music");
      this.slider_music.addEventListener(this.sliderEvent, this);

      this.checkbox_effect = ccui.helper.seekWidgetByName(root,"checkbox_effect");
      this.checkbox_effect.addEventListener(this.selectedStateEvent,this);
      this.checkbox_music = ccui.helper.seekWidgetByName(root,"checkbox_music");
      this.checkbox_music.addEventListener(this.selectedStateEvent,this);
      this.btn_close = ccui.helper.seekWidgetByName(root,"btn_close");
      this.btn_close.addClickEventListener(function () {
        this.removeFromParent();
      }.bind(this));
      var btn_exit = ccui.helper.seekWidgetByName(root,"btn_exit");
      var btn_jiesan = ccui.helper.seekWidgetByName(root,"btn_jiesan");
      btn_jiesan.setVisible(false);
      btn_exit.setVisible(false);
      btn_exit.addClickEventListener(this.onLoginOut.bind(this));
      btn_jiesan.addClickEventListener(this.onDissolve.bind(this));
      if(1 == type)//结算
      {
        btn_jiesan.setVisible(true);
      }else
      {
        btn_exit.setVisible(true);
      }

      // var checkbox_music1 =  ccui.helper.seekWidgetByName(root,"checkbox_music0");
      // var checkbox_music2 =  ccui.helper.seekWidgetByName(root,"checkbox_music1");
      // checkbox_music1.setTouchEnabled(false);
      // checkbox_music2.setTouchEnabled(false);
      // this.panel_music1 =  ccui.helper.seekWidgetByName(root,"panel_music0");
      // this.panel_music1._checkBox = checkbox_music1;
      // this.panel_music2 =  ccui.helper.seekWidgetByName(root,"panel_music1");
      // this.panel_music2._checkBox = checkbox_music2;
      // this.panel_music1.addClickEventListener(this.onClicMusickEvent.bind(this));
      // this.panel_music2.addClickEventListener(this.onClicMusickEvent.bind(this));

      // var checkbox_pt =  ccui.helper.seekWidgetByName(root,"checkbox_pt");
      // checkbox_pt.setTouchEnabled(false);
      // var checkbox_fy =  ccui.helper.seekWidgetByName(root,"checkbox_fy");
      // checkbox_fy.setTouchEnabled(false);
      // this.panel_pt = ccui.helper.seekWidgetByName(root,"panel_pt");
      // this.panel_pt._checkBox = checkbox_pt;
      // this.panel_fy = ccui.helper.seekWidgetByName(root,"panel_fy");
      // this.panel_fy._checkBox = checkbox_fy;
      // this.panel_pt.addClickEventListener(this.onClicMusickEvent.bind(this));
      // this.panel_fy.addClickEventListener(this.onClicMusickEvent.bind(this));


      // var bg = util.getCacheItem('backgroundmusic');
      // checkbox_music2.setSelected(bg == 2);
      // checkbox_music1.setSelected(bg != 2);
      //
      // var location = util.getCacheItem('location');
      // checkbox_fy.setSelected(location == 2);
      // checkbox_pt.setSelected(location != 2);

      var btn_openNav = ccui.helper.seekWidgetByName(root,"btn_openNav");
      if(hall.songshen == 1) btn_openNav.setVisible(false);
      btn_openNav.addClickEventListener(this.onOpenNav.bind(this));
    },

    onClicMusickEvent:function (sender) {
      switch (sender)
      {
        case this.panel_music1:
          util.setCacheItem('backgroundmusic',1);
          this.panel_music1._checkBox.setSelected(true);
          this.panel_music2._checkBox.setSelected(false);
          sound.playBgSound();
          break;
        case this.panel_music2:
          util.setCacheItem('backgroundmusic',2);
          this.panel_music2._checkBox.setSelected(true);
          this.panel_music1._checkBox.setSelected(false);
          sound.playBgSound();
          break;
        case this.panel_pt:
          util.setCacheItem('location',1);
          this.panel_pt._checkBox.setSelected(true);
          this.panel_fy._checkBox.setSelected(false);
          break;
        case this.panel_fy:
          util.setCacheItem('location',2);
          this.panel_fy._checkBox.setSelected(true);
          this.panel_pt._checkBox.setSelected(false);
          break;
      }
    },


    onClicModelEvent:function (sender) {
      switch (sender)
      {
        case this.panel_fast:
          util.setCacheItem('sss_model',2);
          this.panel_fast._checkBox.setSelected(true);
          this.panel_normal._checkBox.setSelected(false);
          break;
        case this.panel_normal:
          util.setCacheItem('sss_model',1);
          this.panel_normal._checkBox.setSelected(true);
          this.panel_fast._checkBox.setSelected(false);
          break;
      }
    },

    onEnter:function()
    {
      this._super();
      var bgOn = util.getCacheItem('background_music');
      if(bgOn == 0)
      {
        this.checkbox_music.setSelected(true);
      }else
      {
        this.checkbox_music.setSelected(false);
      }

      var musicOn = util.getCacheItem('background_music');
      if(musicOn == 0)
      {
        this.checkbox_music.setSelected(true);
      }else
      {
        this.checkbox_music.setSelected(false);
      }

      var effectOn = util.getCacheItem('sound_effect');
      if(effectOn == 0)
      {
        this.checkbox_effect.setSelected(true);
      }else
      {
        this.checkbox_effect.setSelected(false);
      }


      var effectVolume =  util.getCacheItem('effect_volume');//audioEngine.getMusicVolume();
      if(effectVolume == null)
      {
        this.slider_effect.setPercent(100);
      }else
      {
        this.slider_effect.setPercent(effectVolume*100);
      }

      var soundVolume = util.getCacheItem('music_volume');
      if(soundVolume == null)
      {
        this.slider_music.setPercent(100);
      }else
      {
        this.slider_music.setPercent(soundVolume*100);
      }

    },

    sliderEvent: function (sender, type) {
      switch (type) {
        case ccui.Slider.EVENT_PERCENT_CHANGED:
        {
          var percent = Math.ceil(sender.getPercent());
          var volume = percent/100;
          if(sender == this.slider_effect)
          {
            cc.audioEngine.setEffectsVolume(volume);
            this.slider_effect.setPercent(percent);
            util.setCacheItem('effect_volume',volume);
          }else if(sender == this.slider_music)
          {
            cc.audioEngine.setMusicVolume(volume);
            this.slider_music.setPercent(percent);
            util.setCacheItem('music_volume',volume);
          }
          //var num = Math.floor(this.getMaxCoinChip() * percent/100);

        }
          break;
        default:
          break;
      }
    },



    onDissolve: function () {
      hall.getPlayingGame().net.dissolveSeat(1, function (data) {
        this.removeFromParent();
      }.bind(this));
    },

    onLoginOut: function () {
      JJLog.print('登出！');
      util.removeCacheItem('wxUser');
      //cc.director.runScene(new SangongLoginScene());
      //cc.director.end();
      qp.exit();
    },

    onOpenNav: function () {
      hall.net.openLocationSetting();
    },

    showDialog: function () {
      cc.director.getRunningScene().addChild(this);
    },

    selectedStateEvent: function (sender, type) {
      switch (type) {
        case ccui.CheckBox.EVENT_SELECTED:
        {
          if(sender == this.checkbox_effect)
          {
            this.slider_effect.setEnabled(false);
            util.setCacheItem('sound_effect',0);
            sound.stopEffect();

          }else if(sender == this.checkbox_music)
          {
            this.slider_music.setEnabled(false);
            util.setCacheItem('background_music',0);
            sound.stopBgSound();

          }
        }

          break;
        case ccui.CheckBox.EVENT_UNSELECTED:
        {
          if(sender == this.checkbox_effect)
          {
            this.slider_effect.setEnabled(true);
            util.setCacheItem('sound_effect',1);
          }else if(sender == this.checkbox_music)
          {
            this.slider_music.setEnabled(true);
            util.setCacheItem('background_music',1);
            sound.playBgSound();
          }
        }
          break;
        default:
          break;
      }
    },
  });

  var PlayerInfoDialog = JJDialog.extend({
    sprite_head:null,
    playerData:null,
    ctor: function (data) {
      this._super();
      this.playerData = data;
      var root = ccs.load(XueZhanMajhongJson.PlayerInfoDialog).node;
      this.addChild(root);
      var panel = ccui.helper.seekWidgetByName(root,"panel");
      var panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
      panel.addClickEventListener(function () {
        this.dismissDialog();
      }.bind(this));

      panel_root.addClickEventListener(function () {
        this.dismissDialog();
      }.bind(this));

      this.sprite_head = ccui.helper.seekWidgetByName(panel_root,"sprite_head");
      var image_sex_icon = ccui.helper.seekWidgetByName(panel_root,"image_sex_icon");
      var text_name = ccui.helper.seekWidgetByName(panel_root,"text_name");
      var text_id = ccui.helper.seekWidgetByName(panel_root,"text_id");
      var text_ip = ccui.helper.seekWidgetByName(panel_root,"text_ip");
      var id = data['uid'];
      if(id == hall.user.uid)
      {
        //text_name.setString(sliceName(base64.decode(hall.user["nickName"])));
        text_name.setString(base64.decode(hall.user["nickName"]));
        text_id.setString(/*'ID: '+*/hall.user['uid']);

        text_ip.setString(/*'IP:'+*/hall.user['ip']);
        JJLog.print("userSex:" + hall.user['userSex']);
        if (hall.user['userSex'] == undefined || hall.user['userSex'] == 0){
          hall.user['userSex'] = 1;
        }
        image_sex_icon.loadTexture(XueZhanSexInfo[hall.user['userSex']]['icon'],ccui.Widget.LOCAL_TEXTURE);
      }else
      {
        if(hall.getPlayingGame().table.uidOfInfo(data["uid"]) != null)
        {
          var name = base64.decode(data['nickName']);
          // if(name.length > 15)
          // {
          //   name = name.slice(0,15);
          // }
          text_name.setString(name);
          text_id.setString('ID:'+id);
          var ip = data['ip'];
          text_ip.setString('IP:'+ip);
          if(data['userSex'] != 2 && data['userSex']  != 1)
          {
            data['userSex'] = 1;
          }
          var headStr = XueZhanSexInfo[data['userSex']];
          image_sex_icon.loadTexture(headStr['icon'],ccui.Widget.LOCAL_TEXTURE);
        }
      }
      this.loadHead();
    },


    onEnter:function()
    {
      this._super();
    },

    loadHead:function()
    {

      if (this.playerData != null && this.playerData.headUrl != undefined && this.playerData.headUrl.length > 0) {
        if(this.playerData.headUrl.substring(this.playerData.headUrl.length-1,this.playerData.headUrl.length) == "0")
        {
          this.playerData.headUrl = this.playerData.headUrl.substring(0,this.playerData.headUrl.length-1)+"96";
        }
        var tex = util.getTextureForKey(this.playerData.headUrl);
        if (tex != null && tex != undefined) {
          var size = this.sprite_head.getContentSize();
          var sprite = new cc.Sprite(tex);
          var size_sp = sprite.getContentSize();
          sprite.setScaleX(size.width/size_sp.width);
          sprite.setScaleY(size.height/size_sp.height);
          sprite.setAnchorPoint(cc.p(0, 0));
          this.sprite_head.addChild(sprite);
        } else {
          cc.loader.loadImg(this.playerData.headUrl,{isCrossOrigin : true },
              function (err, tex) {
                JJLog.print(err, tex);
                if (err == null) {
                  var size = this.sprite_head.getContentSize();
                  var sprite = new cc.Sprite(tex);
                  var size_sp = sprite.getContentSize();
                  sprite.setScaleX(size.width/size_sp.width);
                  sprite.setScaleY(size.height/size_sp.height);
                  sprite.setAnchorPoint(cc.p(0, 0));
                  this.sprite_head.addChild(sprite);
                }
              }.bind(this));
        }
      }
    },

    onExit:function()
    {
      this._super();
      this.releaseAllItem();
    },

    releaseAllItem: function () {
      this.sprite_head = null;
    },

  });

  var GamePlayerInfoDialog = JJDialog.extend({
    sprite_head:null,
    playerData:null,
    ctor: function (data) {
      this._super();
      this.playerData = data;
      var root = ccs.load(XueZhanMajhongJson.GamePlayerInfo).node;
      this.addChild(root);
      var panel = ccui.helper.seekWidgetByName(root,"panel");
      var panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
      panel.addClickEventListener(function () {
        this.dismissDialog();
      }.bind(this));

      panel_root.addClickEventListener(function () {
        this.dismissDialog();
      }.bind(this));

      this.sprite_head = ccui.helper.seekWidgetByName(panel_root,"sprite_head");
      var image_sex_icon = ccui.helper.seekWidgetByName(panel_root,"image_sex_icon");
      var text_name = ccui.helper.seekWidgetByName(panel_root,"text_name");
      var text_id = ccui.helper.seekWidgetByName(panel_root,"text_id");
      var text_ip = ccui.helper.seekWidgetByName(panel_root,"text_ip");
      var id = data['uid'];
      if(id == hall.user.uid)
      {
        text_name.setString(base64.decode(hall.user["nickName"]));
        text_id.setString('ID: '+hall.user['uid']);

        text_ip.setString('IP:'+hall.user['ip']);
        JJLog.print("userSex:" + hall.user['userSex']);
        if (hall.user['userSex'] == undefined || hall.user['userSex'] == 0){
          hall.user['userSex'] = 1;
        }
        image_sex_icon.loadTexture(XueZhanSexInfo[hall.user['userSex']]['icon'],ccui.Widget.LOCAL_TEXTURE);
      }else
      {
        if(hall.getPlayingGame().table.uidOfInfo(data["uid"]) != null)
        {
          var name = base64.decode(data['nickName']);
          // if(name.length > 15)
          // {
          //   name = name.slice(0,15);
          // }
          text_name.setString(name);
          text_id.setString('ID:'+id);
          var ip = data['ip'];
          text_ip.setString('IP:'+ip);
          if(data['userSex'] != 2 && data['userSex']  != 1)
          {
            data['userSex'] = 1;
          }
          var headStr = XueZhanSexInfo[data['userSex']];
          image_sex_icon.loadTexture(headStr['icon'],ccui.Widget.LOCAL_TEXTURE);
        }
      }

      if(hall.getPlayingGame().table.seatArray != null)
      {
        var nav = null;
        for(var i = 0;i<hall.getPlayingGame().table.seatArray.length;i++)
        {
          var info = hall.getPlayingGame().table.seatArray[i];
          if(info == null || info == undefined) continue;
          var uid = info["uid"];
          if(id == uid && info["nav"] != null)
          {
            nav = info["nav"];
            break;
          }
        }
        if (nav == null)
        {
          ccui.helper.seekWidgetByName(panel_root,"text_player0").setString("该玩家没有开启定位");
        }
        else
        {
          var index = 0;
          for(var i = 0;i<hall.getPlayingGame().table.seatArray.length;i++){
            var info = hall.getPlayingGame().table.seatArray[i];
            if(info == null || info == undefined) continue;
            var uid = info["uid"];
            if(id != uid && info["nav"] != null)
            {
              var dis = util.getDistance(nav.longitude,nav.latitude,info["nav"].longitude,info["nav"].latitude);
              var str = "与【";
              str += uid==hall.user.uid?"您":sliceName(base64.decode(info['nickName']));
              str += "】相距"+dis+"米";
              ccui.helper.seekWidgetByName(panel_root,"text_player"+index.toString()).setString(str);
              index++;
            }
          }
        }
      }
    },


    onEnter:function()
    {
      this._super();
      this.loadHead();

    },

    loadHead:function()
    {

      if (this.playerData != null && this.playerData.headUrl != undefined && this.playerData.headUrl.length > 0) {
        if(this.playerData.headUrl.substring(this.playerData.headUrl.length-1,this.playerData.headUrl.length) == "0")
        {
          this.playerData.headUrl = this.playerData.headUrl.substring(0,this.playerData.headUrl.length-1)+"96";
        }
        var tex = util.getTextureForKey(this.playerData.headUrl);
        if (tex != null && tex != undefined) {
          var size = this.sprite_head.getContentSize();
          var sprite = new cc.Sprite(tex);
          var size_sp = sprite.getContentSize();
          sprite.setScaleX(size.width/size_sp.width);
          sprite.setScaleY(size.height/size_sp.height);
          sprite.setAnchorPoint(cc.p(0, 0));
          this.sprite_head.addChild(sprite);
        } else {
          cc.loader.loadImg(this.playerData.headUrl,{isCrossOrigin : true },
              function (err, tex) {
                JJLog.print(err, tex);
                if (err == null) {
                  var size = this.sprite_head.getContentSize();
                  var sprite = new cc.Sprite(tex);
                  var size_sp = sprite.getContentSize();
                  sprite.setScaleX(size.width/size_sp.width);
                  sprite.setScaleY(size.height/size_sp.height);
                  sprite.setAnchorPoint(cc.p(0, 0));
                  this.sprite_head.addChild(sprite);
                }
              }.bind(this));
        }
      }
    },

    onExit:function()
    {
      this._super();
      this.releaseAllItem();
    },

    releaseAllItem: function () {
      this.sprite_head = null;
    },

  });

  var JJConfirmDialog = JJDialog.extend({
    text_des:null,
    text_title:null,
    btn_confirm:null,
    confirmCb:null,
    ctor: function () {
      this._super();
      this.root = ccs.load(XueZhanMajhongJson.Confirm).node;
      this.addChild(this.root);

      this.text_title = ccui.helper.seekWidgetByName(this.root,"text_title");
      this.text_des = ccui.helper.seekWidgetByName(this.root,"text_des");
      this.btn_confirm = ccui.helper.seekWidgetByName(this.root,"btn_confirm");
      var _this = this;
      this.btn_confirm.addClickEventListener(function () {
        _this.removeFromParent();
        if (_this.confirmCb != null)
          _this.confirmCb();
      });
    },

    setCallback: function (confirmCb) {
      this.confirmCb = confirmCb;
    },

    setDes: function (text) {
      this.text_des.setString(text);
    }

  });

  var JJMajhongDecideDialog = JJDialog.extend({
    text_des:null,
    btn_confirm:null,
    btn_cancel:null,
    confirmCb:null,
    cancelCb:null,
    ctor: function () {
      this._super();
      var root = ccs.load(XueZhanMajhongJson.Decide).node;
      this.addChild(root);
      this.text_des = ccui.helper.seekWidgetByName(root,"text_des");
      this.btn_confirm = ccui.helper.seekWidgetByName(root,"btn_confirm");
      this.btn_cancel = ccui.helper.seekWidgetByName(root,"btn_cancel");
      this.btn_cancel.addClickEventListener(this.dismissDialog.bind(this));
      var _this = this;
      this.btn_confirm.addClickEventListener(function () {
        _this.removeFromParent();
        if (_this.confirmCb != null)
          _this.confirmCb();
      });
    },

    dismissDialog: function () {
      this._super();
      if (this.cancelCb != null)
        this.cancelCb();
    },

    setCancelCal:function (cb) {
      this.cancelCb = cb;
    },

    setCallback: function (confirmCb) {
      this.confirmCb = confirmCb;
    },

    setDes: function (text) {
      this.text_des.setString(text);
    },

  });

  var DissloveOptionDialog = JJDialog.extend({
    btn_pass:null,
    btn_agree:null,
    text_name:null,
    ctor: function (data) {
      this._super();
      var root = ccs.load(XueZhanMajhongJson.DissolveDialog).node;
      this.addChild(root);

      this.btn_pass = ccui.helper.seekWidgetByName(root,"btn_pass");
      this.btn_pass.addClickEventListener(function () {
        hall.getPlayingGame().net.dissolveSeat(3, function (data) {
          this.dismissDialog();
        }.bind(this));
      }.bind(this));
      this.btn_agree = ccui.helper.seekWidgetByName(root,"btn_agree");
      this.btn_agree.addClickEventListener(function () {
        hall.getPlayingGame().net.dissolveSeat(2, function (data) {
          this.dismissDialog();
        }.bind(this));
      }.bind(this));
      this.text_name = ccui.helper.seekWidgetByName(root,"text_name");
      var info = hall.getPlayingGame().table.uidOfInfo(data['uid']);
      this.text_name.setString(sliceName(base64.decode(info['nickName'])));
    },

    onEnter: function () {
      this._super();
      qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);
      qp.event.listen(this, 'mjGameOver', this.onGameOver);
    },

    onExit: function () {
      qp.event.stop(this, 'mjDissolutionTable');
      qp.event.stop(this, 'mjGameOver');
      this._super();
    },

    onGameOver:function (data) {
      this.removeFromParent();
    },

    onDissolutionTable: function (data) {
      if(data['result'] == 0)//0拒绝解散
      {
        this.removeFromParent();
      }else if(data['result'] == 1)//1 解散成功
      {
        this.removeFromParent();
      }else
      {

      }
    }


  });

  var DissloveResultDialog = JJDialog.extend({
    text_dissolve:null,
    text_dissolve_1:null,
    text_dissolve_2:null,
    text_dissolve_3:null,
    text_clock:null,
    panel_root:null,
    ctor: function (data,time) {
      this._super();
      var root = ccs.load(XueZhanMajhongJson.DissolveResult).node;
      this.addChild(root);
      this.panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
      this.text_dissolve = ccui.helper.seekWidgetByName(root,"text_dissolve");
      this.text_dissolve.setString('玩家['+sliceName(base64.decode(hall.user.nickName)) +']申请解散房间,请等待其他玩家选择.(超过五分钟未选择,默认同意)');
      this.text_dissolve_1 = ccui.helper.seekWidgetByName(root,"text_dissolve_1");
      var info = hall.getPlayingGame().table.rightSeatInfo();
      if(info != null)
      {
        this.text_dissolve_1.setTag(info['uid']);
        this.text_dissolve_1.setString('['+sliceName(base64.decode(info['nickName']))+']'+ '  等待选择');
      }else
      {
        this.text_dissolve_1.setString('');
      }

      this.text_dissolve_2 = ccui.helper.seekWidgetByName(root,"text_dissolve_2");
      info = hall.getPlayingGame().table.upSeatInfo();
      if(info != null)
      {
        this.text_dissolve_2.setTag(info['uid']);
        this.text_dissolve_2.setString('['+sliceName(base64.decode(info['nickName']))+']'+ '  等待选择');
      }else
      {
        this.text_dissolve_2.setString('');
      }

      this.text_dissolve_3 = ccui.helper.seekWidgetByName(root,"text_dissolve_3");
      info = hall.getPlayingGame().table.leftSeatInfo();
      if(info != null)
      {
        this.text_dissolve_3.setVisible(true);
        this.text_dissolve_3.setTag(info['uid']);
        this.text_dissolve_3.setString('['+sliceName(base64.decode(info['nickName']))+']'+ '  等待选择');
      }else
      {
        this.text_dissolve_3.setString('');
      }


      var btn_agree = ccui.helper.seekWidgetByName(root,"btn_agree");
      var btn_refuse = ccui.helper.seekWidgetByName(root,"btn_refuse");
      btn_agree.setVisible(false);
      btn_refuse.setVisible(false);
      this.text_clock = ccui.helper.seekWidgetByName(root,"text_clock");
      if(!!data)
      {
        this.startClock(time);
        for(var i=0;i<data.length;i++)
        {
          if(this.text_dissolve_1.getTag() == data[i])
          {
            if( i == 0)
            {
              this.text_dissolve.setString('玩家['+sliceName(base64.decode(hall.getPlayingGame().table.rightSeatInfo()['nickName'])) +']申请解散房间,请等待其他玩家选择.(超过五分钟未选择,默认同意)');
            }
            this.text_dissolve_1.setString('['+sliceName(base64.decode(hall.getPlayingGame().table.rightSeatInfo()['nickName']))+']'+ '  同意');
          }
          if(this.text_dissolve_2.getTag() == data[i])
          {
            if( i == 0)
            {
              this.text_dissolve.setString('玩家['+sliceName(base64.decode(hall.getPlayingGame().table.upSeatInfo()['nickName'])) +']申请解散房间,请等待其他玩家选择.(超过五分钟未选择,默认同意)');
            }
            this.text_dissolve_2.setString('['+sliceName(base64.decode(hall.getPlayingGame().table.upSeatInfo()['nickName']))+']'+ '  同意');
          }

          if(this.text_dissolve_3.getTag() == data[i])
          {
            if( i == 0)
            {
              this.text_dissolve.setString('玩家['+sliceName(base64.decode(hall.getPlayingGame().table.leftSeatInfo()['nickName'])) +']申请解散房间,请等待其他玩家选择.(超过五分钟未选择,默认同意)');
            }
            this.text_dissolve_3.setString('['+sliceName(base64.decode(hall.getPlayingGame().table.leftSeatInfo()['nickName']))+']'+ '  同意');
          }

        }
      }
    },

    onEnter: function () {
      this._super();
      qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);
      qp.event.listen(this, 'mjGameOver', this.onGameOver);
      //this.startClock(300);

    },

    startClock: function (sec) {
      this.text_clock.setString(sec);

      this.schedule(this.countDown,1);
    },

    onGameOver:function (data) {
      this.removeFromParent();
    },

    countDown: function (dt) {
      var sec = parseInt(this.text_clock.getString());
      if(sec >= 1)
      {
        sec--;
      }
      else
      {
        sec = '0';
      }

      this.text_clock.setString(sec);
    },

    stopClock: function () {
      this.unschedule(this.countDown);
    },


    onDissolutionTable: function (data) {

      if(data['result'] == 0)//0拒绝解散
      {
        this.removeFromParent();
      }else if(data['result'] == 1)//1 解散成功
      {
        //cc.director.runScene(new GameScene());
        this.removeFromParent();
      }else
      {
        if(data['status'] == 1)
        {
          if(data['uid'] == hall.user.uid)
          {
            var secondTime = data['time'];
            var minute = secondTime/60;
            this.text_dissolve.setString('玩家['+sliceName(base64.decode(hall.user.nickName)) +']申请解散房间,请等待其他玩家选择.(超过 '+secondTime+' 秒钟未选择,默认同意)');
            this.startClock(secondTime);
          }else
          {
            var text = this.panel_root.getChildByTag(data['uid']);
            if(text != null)
            {
              var msg = '拒绝';
              if(data['status'] == 2)
              {
                msg = '同意';
              }
              var info =  hall.getPlayingGame().table.uidOfInfo(data['uid']);
              text.setString(sliceName(base64.decode(info['nickName']))+ ' '+msg);
            }
          }

        }else
        {
          var text = this.panel_root.getChildByTag(data['uid']);
          if(text != null)
          {
            var msg = '拒绝';
            if(data['status'] == 2)
            {
              msg = '同意';
            }
            var info =  hall.getPlayingGame().table.uidOfInfo(data['uid']);
            text.setString('['+sliceName(base64.decode(info['nickName']))+']'+ ' '+msg);

          }
        }
      }



    },

    onExit: function () {
      qp.event.stop(this, 'mjDissolutionTable');
      qp.event.stop(this, 'mjGameOver');
      this._super();
    },



  });
}
