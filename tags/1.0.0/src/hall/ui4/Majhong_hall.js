/**
 * Created by atom on 2016/10/4.
 */

if(GAMENAME.indexOf("shisanshui") != -1)
{
  var MajhongHall = cc.Layer.extend({
    text_name:null,
    text_id:null,
    text_fangka:null,
    image_head:null,
    panel_fangka:null,
    image_msg_red:null,
    btn_help:null,
    btn_setup:null,
    btn_zhanji:null,
    btn_share:null,
    sprite_head:null,
    image_frame:null,
    btn_realname:null,
    btn_otherRoom:null,
    btn_bindCode:null,
    ctor: function () {
      this._super();
      var res = SSSPokerJson.GameHall;
      if(GAMENAME == "xyshisanshui")
        res = SSSXYPokerJson.GameHall;
      var jsonres = ccs.load(res);
      var root = jsonres.node;
      this.addChild(root);
      if(GAMENAME == "shisanshui")
      {
        var bgAct = jsonres.action;
        root.runAction(bgAct);
        bgAct.setTimeSpeed(0.25);
        bgAct.play('bgAnimation',true);

        var img_arrow = ccui.helper.seekWidgetByName(root,"image_arrow");
        img_arrow.setVisible(false);
        // if(hall.user['agentCode'] == '0' || hall.user['agentCode']== null ||hall.user['agentCode']== undefined ||
        //     hall.user['agentCode']=='')
        // {
        //   img_arrow.runAction(cc.sequence(cc.moveBy(0.6,cc.p(30,0)), cc.moveBy(0.7,cc.p(-30,0))).repeatForever());
        //   var star0 = ccui.helper.seekWidgetByName(img_arrow,"star0");
        //   var star1 = ccui.helper.seekWidgetByName(img_arrow,"star1");
        //   star0.runAction(cc.sequence(cc.fadeIn(0.6), cc.fadeOut(0.7)).repeatForever());
        //   star1.runAction(cc.sequence(cc.fadeIn(0.7), cc.fadeOut(0.6)).repeatForever());
        // }else
        // {
        //   img_arrow.setVisible(false);
        // }

      }



      this.text_name = ccui.helper.seekWidgetByName(root,"text_name");
      this.text_id = ccui.helper.seekWidgetByName(root,"text_id");
      this.text_fangka = ccui.helper.seekWidgetByName(root,"text_fangka");
      this.text_fangka.setString(hall.user.gemNum);

      this.image_frame = ccui.helper.seekWidgetByName(root,"image_frame");
      this.image_frame.setTouchEnabled(true);
      this.image_frame.addClickEventListener(this.onPlayerInfo.bind(this));
      this.sprite_head = ccui.helper.seekWidgetByName(root,"sprite_head");

      this.panel_fangka = ccui.helper.seekWidgetByName(root,"panel_fangka");
      this.panel_fangka.addClickEventListener(this.onAddFangka.bind(this));
      this.image_msg_red = ccui.helper.seekWidgetByName(root,"image_msg_red");

      this.btn_help = ccui.helper.seekWidgetByName(root,"btn_help");
      this.btn_help.addClickEventListener(this.onHelp.bind(this));

      this.btn_setup = ccui.helper.seekWidgetByName(root,"btn_setup");
      this.btn_setup.addClickEventListener(this.onSetup.bind(this));

      this.btn_zhanji = ccui.helper.seekWidgetByName(root,"btn_zhanji");
      this.btn_zhanji.addClickEventListener(this.onZhanji.bind(this));

      this.btn_share = ccui.helper.seekWidgetByName(root,"btn_share");
      this.btn_share.addClickEventListener(this.onShare.bind(this));
      this.btn_msg = ccui.helper.seekWidgetByName(root,"btn_msg");
      this.btn_msg.addClickEventListener(this.onMsg.bind(this));

      //this.btn_bindCode = ccui.helper.seekWidgetByName(root,"btn_bindcode");
      //this.btn_bindCode.addClickEventListener(this.onBindCode.bind(this));

      var img_shareaward = ccui.helper.seekWidgetByName(root,"img_shareaward");
      var act1 = cc.scaleTo(0.8,0.9);
      var act2 = cc.scaleTo(0.8,1);
      var act3 = cc.sequence(act1, act2);
      var act4 = act3.repeatForever();
      img_shareaward.runAction(act4);

      var btn_create = ccui.helper.seekWidgetByName(root,"btn_create");
      btn_create.addClickEventListener(this.onCreateGame.bind(this));

      var btn_join = ccui.helper.seekWidgetByName(root,"btn_join");
      btn_join.addClickEventListener(this.onJoinGame.bind(this));

      if(GAMENAME != "xyshisanshui")
      {
        var btn_daikai  = ccui.helper.seekWidgetByName(root,"btn_daikai");
        btn_daikai.addClickEventListener(this.onDaikaiGame.bind(this));
      }else
      {
        var btn_daili = ccui.helper.seekWidgetByName(root,"btn_daili");
        btn_daili.addClickEventListener(function(){
          var layer = new SSSAgentLayer();
          layer.showPanel();
        }.bind(this));

        var btn_activity = ccui.helper.seekWidgetByName(root,"btn_activity");
        btn_activity.addClickEventListener(function(){
          var layer = new SSSActivityLayer();
          layer.showPanel();
        }.bind(this));
      }
      var btn_kefu = ccui.helper.seekWidgetByName(root,"btn_kefu");
      btn_kefu.addClickEventListener(this.onAddFangka.bind(this));

      this.btn_otherRoom = ccui.helper.seekWidgetByName(root,"btn_otherroom");
      this.btn_otherRoom.addClickEventListener(this.onotherRoom.bind(this));

      this.btn_realname = ccui.helper.seekWidgetByName(root,"btn_realname");
      this.btn_realname.addClickEventListener(this.onRealName.bind(this));

      //if(hall.user['agentCode'] == '0' || hall.user['agentCode']== null ||hall.user['agentCode']== undefined ||
      //    hall.user['agentCode']=='')
      //{
      //}else
      //{
      //  this.btn_bindCode.setVisible(false);
      //}
      //var panel_center = ccui.helper.seekWidgetByName(root,"panel_center");
      //panel_center.setVisible(hall.songshen == 0);
      //var panel_songshen = ccui.helper.seekWidgetByName(root,"panel_songshen");
      //panel_songshen.setVisible(hall.songshen == 1);
      //for(var i = 0;i<3;i++)
      //{
      //  var btn = ccui.helper.seekWidgetByName(panel_songshen,"btn_"+i);
      //  btn.addClickEventListener(function(){
      //
      //    var roomData = {};
      //    roomData['area'] = "fj";
      //    roomData['tableName'] = "fj";
      //    roomData['uid'] = hall.user.uid;
      //    roomData['rounds'] = 10;        //局数
      //    roomData['person'] = 4;         //人数
      //    roomData['banker'] = 0;
      //    roomData['isMa'] = 0;                          //带马
      //    roomData['mode'] = 1;                          //模式
      //    roomData['aaGem'] = 0;
      //
      //    hall.createPrivate(SSSPoker.appId,roomData,function(data){
      //      if(data["code"]== 200)
      //      {
      //        hall.enter(SSSPoker.appId);
      //      }else
      //      {
      //        var dialog = new JJConfirmDialog();
      //        dialog.setDes(data['error']);
      //        dialog.showDialog();
      //      }
      //    }.bind(this));
      //
      //  }.bind(this));
      //}
    },

    onEnter: function () {
      this._super();
      sound.playBgSound();
      sound.stopEffect();

      this.updateInfo();
      this.registerAllEvents();

      if (hall.songshen != 1) {
        var notice = new MajhongNotice();
        notice.setVisible(false);
        notice.setPosition(cc.p(200,40));
        this.addChild(notice);
      }else
      {
        this.btn_share.setVisible(false);
        this.btn_realname.setVisible(false);
        this.btn_zhanji.setVisible(false);
        this.btn_msg.setVisible(false);
      };

      if (hall.mustUpdate) {
        MajhongLoading.dismiss();
        var dialog = new JJConfirmDialog();
        dialog.setDes('发现新版本，前去下载更新！');
        dialog.setCallback(function () {
          cc.sys.openURL(hall.updateUrl);
        });
        this.addChild(dialog,100);
      }else
      {
        //hall.net.parseCopyLabel(SSSPoker.appId);
                                
                                    if(hall.wxEnterRoom >0 && GAMENAME == "shisanshui")
                                    {
                        
                                    hall.joinPrivate(SSSPoker.appId,hall.wxEnterRoom,function(data){
                                                     if(data["code"]== 200)
                                                     {
                                                     hall.enter(SSSPoker.appId);
                                                     }
                                                     else
                                                     {
                                                     var dialog = new JJConfirmDialog();
                                                     dialog.setDes(data['error']);
                                                     dialog.showDialog();
                                                     }
                                                     });
                                    }
                                
      }

      if(GAMENAME != "xyshisanshui") {
        cc.spriteFrameCache.addSpriteFrames(SSSPokerPlist.Bomb);
        var animFrames = [];
        var str = "";
        for (var i = 1; i < 6; i++) {
          str = "sss_bomb" + i + ".png";
          var frame = cc.spriteFrameCache.getSpriteFrame(str);
          animFrames.push(frame);
        }
        var pos = [cc.p(180, 200), cc.p(550, 200), cc.p(500, 500), cc.p(200, 500)];
        var delayTime = [0.5, 0, 0.9, 0.3];
        var animation = new cc.Animation(animFrames, 0.2);
        for (var i = 0; i < 4; i++) {
          var spNode = new cc.Sprite();
          spNode.setPosition(pos[i]);
          spNode.setVisible(false);
          this.addChild(spNode, 100);
          spNode.runAction(cc.sequence(cc.delayTime(delayTime[i] + Math.random()), cc.show(), cc.animate(animation.clone()), cc.hide()).repeatForever());
          // sp.runAction(cc.animate(animation.clone()).repeatForever());
        }
      }
    },

    onExit: function () {
      this._super();
      this.removeAllEvents();
      this.releaseAllItem();
    },

    releaseAllItem: function () {
      this.text_name = null;
      this.text_id = null;
      this.text_fangka = null;
      this.panel_fangka = null;
      this.image_msg_red = null;
      this.btn_help = null;
      this.btn_setup = null;
      this.btn_share = null;
      this.sprite_head = null;
      this.image_frame = null;
      this.text_name = null;
      this.btn_realname = null;
    },

    registerAllEvents: function () {
      qp.event.listen(this, 'hallUpdatePlayerAttr', this.onUpdatePlayerAttr.bind(this));
      qp.event.listen(this, 'getCopyLabel', this.getCopyLabel.bind(this));
    },
    removeAllEvents: function () {
      qp.event.stop(this, 'hallUpdatePlayerAttr');
      qp.event.stop(this, 'getCopyLabel');
    },

    getCopyLabel:function(content){

    },
    onUpdatePlayerAttr: function (data) {
      JJLog.print('hall onUpdatePlayerAttr');
      JJLog.print(data);

      if(data['gemNum'] != null || data['gemNum']  != undefined)
      {
        this.text_fangka.setString(data['gemNum']);
      }

    },

    onBindCode: function () {
      sound.playBtnSound();
      var bindCodePanel = new MajhongBindCode(this);
      bindCodePanel.showBindCode();
    },

    onHideBindCode:function () {
      this.btn_bindCode.setVisible(false);
    },

    showHall: function () {
      hall.inRoom = false;
      var scene = new cc.Scene();
      scene.addChild(this);
      if(cc.sys.isNative)
      {
        cc.director.replaceScene(scene);
      }else
      {
        cc.director.runScene(scene);
      }

    },

    updateInfo: function () {
      this.updateHead();
      this.updateName();
    },

    updateName: function () {
      if(hall.user["nickName"].length > 0)
      {
        if(cc.sys.isNative)
        {
          var nickName = base64.decode(hall.user["nickName"]);
          this.text_name.setString(nickName);
        }else
        {
          this.text_name.setString(base64.decode(hall.user["nickName"]));
        }

//          this.text_name.setString("状状 😘 😌");
//;
//        var name = '一个大宝剑峡';
//        this.text_name.setString(sliceName(name));


      }else
      {
        this.text_name.setString(hall.user["nickName"]);
      }

      this.text_id.setString('ID: '+hall.user['uid']);

    },


    updateHead: function () {
      var _this = this;
      if (hall.user.headUrl != undefined && hall.user.headUrl.length > 0) {
        if(hall.user.headUrl.substring(hall.user.headUrl.length-1,hall.user.headUrl.length) == "0")
        {
          hall.user.headUrl = hall.user.headUrl.substring(0,hall.user.headUrl.length-1)+"96";
        }
        cc.loader.loadImg(hall.user.headUrl,
            function (err, tex) {
              JJLog.print(err);
              if (err == null && _this.sprite_head != null) {
                var size = _this.sprite_head.getContentSize();
                var sprite = new cc.Sprite(tex);
                var size_sp = sprite.getContentSize();
                sprite.setScaleX(size.width/size_sp.width);
                sprite.setScaleY(size.height/size_sp.height);
                sprite.setAnchorPoint(cc.p(0, 0));
                _this.sprite_head.addChild(sprite);

                util.cacheImage(hall.user.headUrl, tex);
              }
            }.bind(this));
      } else {
        //if(hall.user['userSex'] == 2)
        //{
        //  this.image_head.loadTexture(CommonRes.FEMALE,ccui.Widget.PLIST_TEXTURE);
        //
        //}else
        //{
        //  this.image_head.loadTexture(CommonRes.FEMALE,ccui.Widget.PLIST_TEXTURE);
        //}
      }
    },

    onPlayerInfo: function () {
      var dialog = new PlayerInfoDialog(hall.user);
      dialog.showDialog();
    },

    onCreateGame: function () {
      sound.playBtnSound();
      var panel = new SSSCreateRoom(1);
      panel.showPanel();
    },

    onJoinGame: function () {
      sound.playBtnSound();
      var panel = new InputRoomPanel();
      panel.showPanel();
    },

    onDaikaiGame: function () {
      sound.playBtnSound();
      var panel = new SSSCreateRoom(2);
      panel.showPanel();
    },

    onFeedBack: function () {

    },

    onFangka:function()
    {
      var dialog = new JJGiveRoomCard();
      dialog.showDialog();
    },

    onAddFangka:function()
    {
                                    sound.playBtnSound();
      if(hall.songshen == 1)
      {
                                    
                                    var recharge = new GameSongShenRecharge();
                                    recharge.showPanel();
                                    
                                    }else
                                    {
                                    if(hall.user['agentCode'] == '0' || hall.user['agentCode']== null ||hall.user['agentCode']== undefined ||
                                       hall.user['agentCode']=='')
                                    {
                                    var bindCodePanel = new MajhongBindCode(this);
                                    bindCodePanel.showBindCode();
                                    }else
                                    {
                                    hall.net.getShopConfig(function(data){
                                                           if(data.code == 200)
                                                           {
                                                           
                                                           var recharge = new MajhongRecharge(data["data"]);
                                                           recharge.showPanel();
                                                           }else
                                                           {
                                                           var dialog = new JJConfirmDialog();
                                                           dialog.setDes(data['msg']);
                                                           dialog.showDialog();
                                                           }
                                                           });
                                    }
                                    }
    },

    onRealName:function()
    {
      var dialog = new JJRealName();
      dialog.showDialog();
    },
    onotherRoom:function()
    {
      var dialog = new MajhongOtherRoomPanel();
      dialog.showPanel();
    },
    onHelp: function () {
      var msg = new MajhongHallHelp();
      msg.showHelp();
    },

    onSetup: function () {
      var set = new SetupDialog(0);
      set.showDialog();
    },

    onMsg: function () {
      var msg = new MajhongHallMessage();
      msg.showMsg();
    },

    onZhanji: function () {
      var history = new MajhongHistory();
      history.showHistory();
    },

    onShare: function () {
      var dialog = new JJShareDialog();
      dialog.showDialog();
    },


  });
} else if(GAMENAME == "qidong")
{
  var MajhongHall = cc.Layer.extend({
    text_name:null,
    text_id:null,
    text_fangka:null,
    image_head:null,
    panel_fangka:null,

    image_msg_red:null,
    btn_help:null,
    btn_setup:null,
    btn_zhanji:null,
    btn_share:null,
    sprite_head:null,
    image_frame:null,
    btn_realname:null,
    btn_otherRoom:null,
    pageview:null,
    img_test1:null,
    img_test2:null,
    btn_wanfa:null,
    btn_bindCode:null,
    img_yanjing:null,
    img_person:null,
    text_weChatId:null,

    ctor: function () {
      this._super();
      var root = ccs.load(QDMajhongJson.Hall).node;
      this.addChild(root);
      this.text_name = ccui.helper.seekWidgetByName(root,"text_name");
      this.text_id = ccui.helper.seekWidgetByName(root,"text_id");
      this.text_fangka = ccui.helper.seekWidgetByName(root,"text_fangka");
      this.text_fangka.setString(hall.user.gemNum);

      this.image_frame = ccui.helper.seekWidgetByName(root,"image_frame");
      this.image_frame.setTouchEnabled(true);
      this.image_frame.addClickEventListener(this.onPlayerInfo.bind(this));
      this.sprite_head = ccui.helper.seekWidgetByName(root,"sprite_head");

      this.panel_fangka = ccui.helper.seekWidgetByName(root,"panel_fangka");
      this.panel_fangka.addClickEventListener(this.onAddFangka.bind(this));
      this.image_msg_red = ccui.helper.seekWidgetByName(root,"image_msg_red");

      this.btn_help = ccui.helper.seekWidgetByName(root,"btn_help");
      this.btn_help.addClickEventListener(this.onHelp.bind(this));

        var btn_huodong = ccui.helper.seekWidgetByName(root,"btn_huodong");
        btn_huodong.addClickEventListener(this.onHuodong.bind(this));


      this.btn_setup = ccui.helper.seekWidgetByName(root,"btn_setup");
      this.btn_setup.addClickEventListener(this.onSetup.bind(this));

      this.btn_zhanji = ccui.helper.seekWidgetByName(root,"btn_zhanji");
      this.btn_zhanji.addClickEventListener(this.onZhanji.bind(this));

      this.btn_share = ccui.helper.seekWidgetByName(root,"btn_share");
      this.btn_share.addClickEventListener(this.onShare.bind(this));
      this.btn_msg = ccui.helper.seekWidgetByName(root,"btn_msg");
      this.btn_msg.addClickEventListener(this.onMsg.bind(this));

      this.btn_wanfa = ccui.helper.seekWidgetByName(root,"btn_wanfa");
      this.btn_wanfa.addClickEventListener(this.onwanfa.bind(this));

      this.btn_bindCode = ccui.helper.seekWidgetByName(root,"btn_bindcode");
      this.btn_bindCode.addClickEventListener(this.onBindCode.bind(this));

      var img_shareaward = ccui.helper.seekWidgetByName(root,"img_shareaward");
      var act1 = cc.scaleTo(0.8,0.9);
      var act2 = cc.scaleTo(0.8,1);
      var act3 = cc.sequence(act1, act2);
      var act4 = act3.repeatForever();
      img_shareaward.runAction(act4);
      var btn_create = ccui.helper.seekWidgetByName(root,"btn_create");
      btn_create.addClickEventListener(this.onCreateGame.bind(this));

      var btn_join = ccui.helper.seekWidgetByName(root,"btn_join");
      btn_join.addClickEventListener(this.onJoinGame.bind(this));


      var btn_kefu = ccui.helper.seekWidgetByName(root,"btn_kefu");
      btn_kefu.addClickEventListener(this.onAddFangka.bind(this));

      this.btn_realname = ccui.helper.seekWidgetByName(root,"btn_realname");
      this.btn_realname.addClickEventListener(this.onRealName.bind(this));

      this.btn_otherRoom = ccui.helper.seekWidgetByName(root,"btn_otherroom");
      this.btn_otherRoom.addClickEventListener(this.onotherRoom.bind(this));
      this.pageview = ccui.helper.seekWidgetByName(root,"pageview");
      this.pageview.setTouchEnabled(true);
      this.img_test1 = ccui.helper.seekWidgetByName(root,"img_test1");
      this.img_test2 = ccui.helper.seekWidgetByName(root,"img_test2");
      var img1 = this.img_test1.clone();
      var img2 = this.img_test2.clone();
      var layout =new ccui.Layout();
      layout.setContentSize(img1.getContentSize());
      layout.addChild(img1);
      var layout2 = new ccui.Layout();
      layout2.setContentSize(img2.getContentSize());
      layout2.addChild(img2);
      img1.x = 0;
      img1.y= 0;
      img2.x = 0;
      img2.y= 0;
      this.pageview.addPage(layout);
      this.pageview.scrollToPage(0);
      //this.schedule(this.updateImg,8)

      this.img_yanjing = ccui.helper.seekWidgetByName(root,"img_yanjing");
      this.schedule(this.updateZhaYan,3);
      this.img_person = ccui.helper.seekWidgetByName(root,"img_persion");
      this.img_person.addClickEventListener(this.onClickpersonSound.bind(this));

      this.text_weChatId = ccui.helper.seekWidgetByName(root,"wechatId");   //

      for(var i = 0;i<3;i++)
      {
        var btn = ccui.helper.seekWidgetByName(root,"btn_"+i);
        btn.setVisible(hall.songshen == 1);
        btn.addClickEventListener(function () {
          var roomData = {};
          roomData["uid"] = hall.user.uid;
          roomData['rounds'] = 8;
          roomData['niao'] = 0;
          roomData['aaGem'] = 0;
          roomData['diScore'] = 1;
          roomData['jia'] = 0;
          roomData['isQiDui'] = 0;
          roomData['tableName'] = 'QDMajhong';
          hall.createPrivate(qdmajhong.appId,roomData,function(data){
            if(data["code"]== 200)
            {
              hall.enter(qdmajhong.appId);
            }else
            {
              var dialog = new JJConfirmDialog();
              dialog.setDes(data['error']);
              dialog.showDialog();
            }
          });

        });
      }

      if(hall.songshen == 1)
      {
        this.btn_otherRoom.setVisible(false);
        btn_create.setVisible(false);
        btn_join.setVisible(false);
        this.btn_help.setVisible(false);
        ccui.helper.seekWidgetByName(root,"btn_huodong").setVisible(false);
        ccui.helper.seekWidgetByName(root,"image_tip").setVisible(false);
        this.btn_bindCode.setVisible(false);
        this.btn_zhanji.setVisible(false);
        this.btn_share.setVisible(false);
        this.btn_wanfa.setPosition(this.btn_bindCode.getPosition());
      }

    },
    onClickpersonSound:function()
    {
      sound.stopEffect();
      var bgStr = 'res/MajhongQD/Resoures/audio/effect/audio_girl.mp3';
      CCaudioEngine.playEffect(bgStr,false);
    },
    updateZhaYan:function()
    {
      var _this = this;
      _this.runAction(cc.sequence(cc.callFunc(function ()
      {
        _this.img_yanjing.setVisible(true);

      }.bind(_this)), cc.delayTime(0.1),cc.callFunc(function ()
      {
        _this.img_yanjing.setVisible(false);

      }.bind(_this))));
    },
    updateImg:function()
    {
      var index = this.pageview.getCurPageIndex();
      index++;
      if(index > 1)
      {
        index = 0;
      }
      this.pageview.scrollToPage(index);
    },

    onEnter: function () {
      this._super();
      sound.playBgSound();
      sound.stopEffect();

      this.updateInfo();
      this.registerAllEvents();

      qdmajhong.net.getWeChatId(function (data) {
        if(data.code == 200)
        {
            if(hall.agentWeChat == null)
            {
                hall.agentWeChat = [];
                hall.agentWeChat = data.data;
                PackageURLPORT.qidong = '30010';
            }
            for(var i in data.data)
            {
                if(data.data[i].key == "kfWeChat")
                {
                    this.text_weChatId.setString(data.data[i].value);
                }
            }
        }
        else
        {

        }
      }.bind(this));

      if (hall.songshen != 1) {
        var notice = new MajhongNotice();
        notice.setVisible(false);
        this.addChild(notice);
      }else
      {
        if(cc.sys.os == cc.sys.OS_ANDROID)
        {
          this.panel_fangka.setVisible(false);
        }
        this.btn_share.setVisible(false);
        this.btn_realname.setVisible(false);
        this.btn_zhanji.setVisible(false);
        this.btn_msg.setVisible(false);
      };

      if (hall.mustUpdate) {
        MajhongLoading.dismiss();
        var dialog = new JJConfirmDialog();
        dialog.setDes('发现新版本，前去下载更新！');
        dialog.setCallback(function () {
          cc.sys.openURL(hall.updateUrl);
        });
        this.addChild(dialog,100);
      }
      else
      {
          console.log("---------111111",hall.wxEnterRoom);
          if(hall.wxEnterRoom >0 && GAMENAME.indexOf("qidong") != -1)
          {
              if( parseInt(hall.wxEnterRoom) < 500000)
              {
                  hall.joinPrivate(qdmajhong.appId,hall.wxEnterRoom,function(data){
                      if(data["code"]== 200)
                      {
                          hall.wxEnterRoom = 0;
                          hall.enter(qdmajhong.appId);
                      }
                      else
                      {
                          var dialog = new JJConfirmDialog();
                          dialog.setDes(data['error']);
                          dialog.showDialog();
                      }
                  });
              }
              else
              {
                  hall.joinPrivate(bdmajhong.appId,hall.wxEnterRoom,function(data){
                      if(data["code"]== 200)
                      {
                          hall.wxEnterRoom = 0;
                          hall.enter(bdmajhong.appId);
                      }
                      else
                      {
                          var dialog = new JJConfirmDialog();
                          dialog.setDes(data['error']);
                          dialog.showDialog();
                      }
                  });
              }
          }

      }
    },

    onExit: function () {
      this._super();
      this.removeAllEvents();
      this.releaseAllItem();
    },

    releaseAllItem: function () {
      this.text_name = null;
      this.text_id = null;
      this.text_fangka = null;
      this.panel_fangka = null;
      this.image_msg_red = null;
      this.btn_help = null;
      this.btn_setup = null;
      this.btn_share = null;
      this.sprite_head = null;
      this.image_frame = null;
      this.text_name = null;
      this.btn_realname = null;


    },

    registerAllEvents: function () {
      qp.event.listen(this, 'hallUpdatePlayerAttr', this.onUpdatePlayerAttr.bind(this));
    },
    removeAllEvents: function () {
      qp.event.stop(this, 'hallUpdatePlayerAttr');
      // qp.event.stop(this, 'disconnected');
    },
    onUpdatePlayerAttr: function (data) {
      JJLog.print('hall onUpdatePlayerAttr');
      JJLog.print(data);

      if(data['gemNum'] != null || data['gemNum']  != undefined)
      {
        this.text_fangka.setString(data['gemNum']);
      }

    },

    showHall: function () {
      hall.inRoom = false;
      var scene = new cc.Scene();
      scene.addChild(this);
      if(cc.sys.isNative)
      {
        cc.director.replaceScene(scene);
      }else
      {
        cc.director.runScene(scene);
      }

    },

    updateInfo: function () {
      this.updateHead();
      this.updateName();
    },

    updateName: function () {
      if(hall.user["nickName"].length > 0)
      {
        if(cc.sys.isNative)
        {
          var nickName = base64.decode(hall.user["nickName"]);
          this.text_name.setString(nickName);
        }else
        {
          this.text_name.setString(base64.decode(hall.user["nickName"]));
        }

//          this.text_name.setString("状状 😘 😌");
//;
//        var name = '一个大宝剑峡';
//        this.text_name.setString(sliceName(name));


      }else
      {
        this.text_name.setString(hall.user["nickName"]);
      }

      this.text_id.setString('ID: '+hall.user['uid']);

    },


    updateHead: function () {
      var _this = this;
      if (hall.user.headUrl != undefined && hall.user.headUrl.length > 0) {
        if(hall.user.headUrl.substring(hall.user.headUrl.length-1,hall.user.headUrl.length) == "0")
        {
          hall.user.headUrl = hall.user.headUrl.substring(0,hall.user.headUrl.length-1)+"96";
        }
        cc.loader.loadImg(hall.user.headUrl,{isCrossOrigin : true },
            function (err, tex) {
              JJLog.print(err);
              if (err == null && _this.sprite_head != null) {
                var size = _this.sprite_head.getContentSize();
                var sprite = new cc.Sprite(tex);
                var size_sp = sprite.getContentSize();
                sprite.setScaleX(size.width/size_sp.width);
                sprite.setScaleY(size.height/size_sp.height);
                sprite.setAnchorPoint(cc.p(0, 0));
                _this.sprite_head.addChild(sprite);

                util.cacheImage(hall.user.headUrl, tex);
              }
            }.bind(this));
      } else {
        //if(hall.user['userSex'] == 2)
        //{
        //  this.image_head.loadTexture(CommonRes.FEMALE,ccui.Widget.PLIST_TEXTURE);
        //
        //}else
        //{
        //  this.image_head.loadTexture(CommonRes.FEMALE,ccui.Widget.PLIST_TEXTURE);
        //}
      }
    },

    onPlayerInfo: function () {
      var dialog = new PlayerInfoDialog(hall.user);
      dialog.showDialog();
    },

    onCreateGame: function () {
      sound.playBtnSound();
      var panel = new QiDongCreateRoom();
      panel.showPanel();
    },

    onJoinGame: function () {
      sound.playBtnSound();
      var panel = new QiDongInputRoomPanel();
      panel.showPanel();
    },



    onFeedBack: function () {

    },

    onFangka:function()
    {
      var dialog = new JJGiveRoomCard();
      dialog.showDialog();
    },

    onAddFangka:function()
    {
      if(hall.songshen == 1)
      {
        var recharge = new MajhongRecharge();
        recharge.showPanel();
      }else
      {
        var uid = hall.user.uid;
        var Url = "http://mall.yiqigame.me/mall.html?a=1&token=ad34324davdsa&i=" + uid + PackageURLTYPE[GAMENAME];
        JJLog.print('商店地址111=' + Url);
        cc.sys.openURL(Url);
      }
    },

    onRealName:function()
    {
      sound.playBtnSound();
      var dialog = new JJRealName();
      dialog.showDialog();
    },

    onotherRoom:function()
    {
      sound.playBtnSound();
      var dialog = new MajhongOtherRoomPanel();
      dialog.showPanel();
    },

    onwanfa:function()
    {
      var dialog = new AddFKDialog();
      dialog.showDialog();
    },

      onHuodong:function () {
         var dialog = new HuoDongDialog();
         dialog.showDialog();
     },

    onHelp: function () {
      sound.playBtnSound();
      var msg = new MajhongHallHelp();
      msg.showHelp();
    },

    onBindCode: function () {
      sound.playBtnSound();
      var bindCodePanel = new MajhongBindCode();
      bindCodePanel.showBindCode();
    },


    onSetup: function () {
      sound.playBtnSound();
      var set = new SetupDialog(0);
      set.showDialog();
    },

    onMsg: function () {
      sound.playBtnSound();
      var msg = new MajhongHallMessage();
      msg.showMsg();
    },

    onZhanji: function () {
      sound.playBtnSound();
      var history = new MajhongHistory();
      history.showHistory();
    },

    onShare: function () {
      sound.playBtnSound();
      this.btn_share.setTouchEnabled(false);
      hall.net.getPlayerInfo(function (data) {
        this.btn_share.setTouchEnabled(true);
        var dialog = new JJShareDialog(data);
        dialog.showDialog();
      }.bind(this));
    },


  });

} else if(GAMENAME == ("yongchun"))
{
  var MajhongHall = cc.Layer.extend({
    text_name:null,
    text_id:null,
    text_fangka:null,
    image_head:null,
    panel_fangka:null,

    image_msg_red:null,
    btn_help:null,
    btn_setup:null,
    btn_zhanji:null,
    btn_share:null,
    btn_fangka:null,
    sprite_head:null,
    image_frame:null,
    btn_realname:null,
    btn_otherRoom:null,


    ctor: function () {JJLog.print("进入永春大厅");
      this._super();
      var root = ccs.load(GameHallJson.Hall).node;
      this.addChild(root);
      this.text_name = ccui.helper.seekWidgetByName(root,"text_name");
      this.text_id = ccui.helper.seekWidgetByName(root,"text_id");
      this.text_fangka = ccui.helper.seekWidgetByName(root,"text_fangka");
      this.text_fangka.setString(hall.user.gemNum);

      this.image_frame = ccui.helper.seekWidgetByName(root,"image_frame");
      this.image_frame.setTouchEnabled(true);
      this.image_frame.addClickEventListener(this.onPlayerInfo.bind(this));
      this.sprite_head = ccui.helper.seekWidgetByName(root,"sprite_head");

      this.panel_fangka = ccui.helper.seekWidgetByName(root,"panel_fangka");
      this.panel_fangka.addClickEventListener(this.onAddFangka.bind(this));
      this.image_msg_red = ccui.helper.seekWidgetByName(root,"image_msg_red");

      this.btn_help = ccui.helper.seekWidgetByName(root,"btn_help");
      this.btn_help.addClickEventListener(this.onAddFangka.bind(this));

      this.btn_setup = ccui.helper.seekWidgetByName(root,"btn_setup");
      this.btn_setup.addClickEventListener(this.onSetup.bind(this));

      this.btn_zhanji = ccui.helper.seekWidgetByName(root,"btn_zhanji");
      this.btn_zhanji.addClickEventListener(this.onZhanji.bind(this));

      this.btn_share = ccui.helper.seekWidgetByName(root,"btn_share");
      this.btn_share.addClickEventListener(this.onShare.bind(this));
      this.btn_msg = ccui.helper.seekWidgetByName(root,"btn_msg");
      this.btn_msg.addClickEventListener(this.onMsg.bind(this));

      var img_shareaward = ccui.helper.seekWidgetByName(root,"img_shareaward");
      var act1 = cc.scaleTo(0.8,0.9);
      var act2 = cc.scaleTo(0.8,1);
      var act3 = cc.sequence(act1, act2);
      var act4 = act3.repeatForever();
      img_shareaward.runAction(act4);
      var btn_create = ccui.helper.seekWidgetByName(root,"btn_create");
      btn_create.addClickEventListener(this.onCreateGame.bind(this));

      var btn_join = ccui.helper.seekWidgetByName(root,"btn_join");
      btn_join.addClickEventListener(this.onJoinGame.bind(this));

      this.btn_fangka = ccui.helper.seekWidgetByName(root,"btn_fangka");
      this.btn_fangka.addClickEventListener(this.onFangka.bind(this));
      var btn_kefu = ccui.helper.seekWidgetByName(root,"btn_kefu");
      btn_kefu.addClickEventListener(this.onAddFangka.bind(this));
      if (hall.user.vipLevel < 10)
        this.btn_fangka.setVisible(false);
      this.btn_realname = ccui.helper.seekWidgetByName(root,"btn_realname");
      this.btn_realname.addClickEventListener(this.onRealName.bind(this));

      this.btn_otherRoom = ccui.helper.seekWidgetByName(root,"btn_otherroom");
      this.btn_otherRoom.addClickEventListener(this.onotherRoom.bind(this));

    },

    onEnter: function () {
      this._super();
      //sound.stopBgSound();
      sound.playBgSound();
      sound.stopEffect();

      this.updateInfo();
      this.registerAllEvents();

      if (hall.songshen != 1) {
        var notice = new MajhongNotice();
        notice.setVisible(false);
        this.addChild(notice);
      }else
      {
        if(cc.sys.os == cc.sys.OS_ANDROID)
        {
          this.panel_fangka.setVisible(false);
        }
        this.btn_share.setVisible(false);
        this.btn_realname.setVisible(false);
        this.btn_zhanji.setVisible(false);
        this.btn_msg.setVisible(false);
      };

      if (hall.mustUpdate) {
        MajhongLoading.dismiss();
        var dialog = new JJConfirmDialog();
        dialog.setDes('发现新版本，前去下载更新！');
        dialog.setCallback(function () {
          cc.sys.openURL(hall.updateUrl);
        });
        this.addChild(dialog,100);
      }
    },

    onExit: function () {
      this._super();
      this.removeAllEvents();
      this.releaseAllItem();
    },

    releaseAllItem: function () {
      this.text_name = null;
      this.text_id = null;
      this.text_fangka = null;
      this.panel_fangka = null;
      this.image_msg_red = null;
      this.btn_help = null;
      this.btn_setup = null;
      this.btn_share = null;
      this.sprite_head = null;
      this.image_frame = null;
      this.text_name = null;
      this.btn_realname = null;


    },

    registerAllEvents: function () {
      qp.event.listen(this, 'hallUpdatePlayerAttr', this.onUpdatePlayerAttr.bind(this));
    },
    removeAllEvents: function () {
      qp.event.stop(this, 'hallUpdatePlayerAttr');
      // qp.event.stop(this, 'disconnected');
    },
    onUpdatePlayerAttr: function (data) {
      JJLog.print('hall onUpdatePlayerAttr');
      JJLog.print(data);

      if(data['gemNum'] != null || data['gemNum']  != undefined)
      {
        this.text_fangka.setString(data['gemNum']);
      }

    },

    showHall: function () {
      hall.inRoom = false;
      var scene = new cc.Scene();
      scene.addChild(this);
      if(cc.sys.isNative)
      {
        cc.director.replaceScene(scene);
      }else
      {
        cc.director.runScene(scene);
      }

    },

    updateInfo: function () {
      this.updateHead();
      this.updateName();
    },

    updateName: function () {
      if(hall.user["nickName"].length > 0)
      {
        if(cc.sys.isNative)
        {
          var nickName = base64.decode(hall.user["nickName"]);
          this.text_name.setString(nickName);
        }else
        {
          this.text_name.setString(base64.decode(hall.user["nickName"]));
        }

//          this.text_name.setString("状状 😘 😌");
//;
//        var name = '一个大宝剑峡';
//        this.text_name.setString(sliceName(name));


      }else
      {
        this.text_name.setString(hall.user["nickName"]);
      }

      this.text_id.setString('ID: '+hall.user['uid']);

    },


    updateHead: function () {
      var _this = this;
      if (hall.user.headUrl != undefined && hall.user.headUrl.length > 0) {
        hall.user.headUrl = hall.user.headUrl.replace('/0', '/96');
        cc.loader.loadImg(hall.user.headUrl,{isCrossOrigin : true },
            function (err, tex) {
              JJLog.print(err);
              if (err == null && _this.sprite_head != null) {
                var size = _this.sprite_head.getContentSize();
                var sprite = new cc.Sprite(tex);
                var size_sp = sprite.getContentSize();
                sprite.setScaleX(size.width/size_sp.width);
                sprite.setScaleY(size.height/size_sp.height);
                sprite.setAnchorPoint(cc.p(0, 0));
                _this.sprite_head.addChild(sprite);

                util.cacheImage(hall.user.headUrl, tex);
              }
            }.bind(this));
      } else {
        //if(hall.user['userSex'] == 2)
        //{
        //  this.image_head.loadTexture(CommonRes.FEMALE,ccui.Widget.PLIST_TEXTURE);
        //
        //}else
        //{
        //  this.image_head.loadTexture(CommonRes.FEMALE,ccui.Widget.PLIST_TEXTURE);
        //}
      }
    },

    onPlayerInfo: function () {
      var dialog = new PlayerInfoDialog(hall.user);
      dialog.showDialog();
    },

    onCreateGame: function () {
      sound.playBtnSound();
      var panel = new YCCreateRoom();
      panel.showPanel();
    },

    onJoinGame: function () {
      sound.playBtnSound();
      var panel = new InputRoomPanel();
      panel.showPanel();
    },



    onFeedBack: function () {

    },

    onFangka:function()
    {
      var dialog = new JJGiveRoomCard();
      dialog.showDialog();
    },

    onAddFangka:function()
    {
      if(hall.songshen == 1)
      {
        sound.playBtnSound();
        var recharge = new MajhongRecharge();
        recharge.showPanel();
      }else
      {
        var dialog = new AddFKDialog();
        dialog.showDialog();
      }
    },

    onRealName:function()
    {
      sound.playBtnSound();
      var dialog = new JJRealName();
      dialog.showDialog();
    },

    onotherRoom:function()
    {
      sound.playBtnSound();
      var dialog = new MajhongOtherRoomPanel();
      dialog.showPanel();
    },

    onHelp: function () {
      sound.playBtnSound();
      var msg = new MajhongHallHelp();
      msg.showHelp();
    },

    onSetup: function () {
      sound.playBtnSound();
      var set = new SetupDialog(0);
      set.showDialog();
    },

    onMsg: function () {
      sound.playBtnSound();
      var msg = new MajhongHallMessage();
      msg.showMsg();
    },

    onZhanji: function () {
      sound.playBtnSound();
      var history = new MajhongHistory();
      history.showHistory();
    },

    onShare: function () {
      sound.playBtnSound();
      var dialog = new JJShareDialog();
      dialog.showDialog();
    },


  });
}else if(GAMENAME == "wuhan")
{
  var MajhongHall = cc.Layer.extend({
    text_name:null,
    text_id:null,
    text_fangka:null,
    image_head:null,
    panel_fangka:null,
    image_msg_red:null,
    btn_help:null,
    btn_setup:null,
    btn_zhanji:null,
    btn_share:null,
    btn_fangka:null,
    sprite_head:null,
    image_frame:null,
    btn_realname:null,
    btn_otherRoom:null,
    btn_wanfa:null,
    btn_bindcode:null,
    btn_myq:null,
    ctor: function () {
      this._super();
      var root = ccs.load(WHMajhongJson.Hall).node;
      this.addChild(root);
      JJLog.print('进入武汉大厅');
        JJLog.print('进入武汉大厅确认');JJLog.print('进入武汉大厅确认');
      this.text_name = ccui.helper.seekWidgetByName(root,"text_name");
      this.text_id = ccui.helper.seekWidgetByName(root,"text_id");
      this.text_fangka = ccui.helper.seekWidgetByName(root,"text_fangka");
      this.text_fangka.setString(hall.user.gemNum);


      //反馈按钮隐藏
      this.btn_houdong = ccui.helper.seekWidgetByName(root,"btn_houdong");
      this.btn_houdong.setVisible(false);


      this.image_frame = ccui.helper.seekWidgetByName(root,"image_frame");
      this.image_frame.setTouchEnabled(true);
      this.image_frame.addClickEventListener(this.onPlayerInfo.bind(this));
      this.sprite_head = ccui.helper.seekWidgetByName(root,"sprite_head");

      this.panel_fangka = ccui.helper.seekWidgetByName(root,"panel_fangka");
      this.panel_fangka.addClickEventListener(this.onAddFangka1.bind(this));
	  
      this.image_msg_red = ccui.helper.seekWidgetByName(root,"image_msg_red");

      // 联系客服
      this.btn_help = ccui.helper.seekWidgetByName(root,"btn_help");
      this.btn_help.addClickEventListener(this.onAddFangka.bind(this));


      // 玩法
      this.btn_wanfa = ccui.helper.seekWidgetByName(root,"btn_wanfa");
      this.btn_wanfa.addClickEventListener(this.onHelp.bind(this));


      this.btn_setup = ccui.helper.seekWidgetByName(root,"btn_setup");
      this.btn_setup.addClickEventListener(this.onSetup.bind(this));

      this.btn_zhanji = ccui.helper.seekWidgetByName(root,"btn_zhanji");
      this.btn_zhanji.addClickEventListener(this.onZhanji.bind(this));

      this.btn_share = ccui.helper.seekWidgetByName(root,"btn_share");
      this.btn_share.addClickEventListener(this.onShare.bind(this));
      this.btn_msg = ccui.helper.seekWidgetByName(root,"btn_msg");
      this.btn_msg.addClickEventListener(this.onMsg.bind(this));

     this.btn_bindCode = ccui.helper.seekWidgetByName(root,"btn_bindcode");
     this.btn_bindCode.addClickEventListener(this.onBindCode.bind(this));

     this.btn_myq = ccui.helper.seekWidgetByName(root,"btn_myq");
     this.btn_myq.addClickEventListener(this.onPlayerUnion.bind(this));


        var img_shareaward = ccui.helper.seekWidgetByName(root,"img_shareaward");
      var act1 = cc.scaleTo(0.8,0.9);
      var act2 = cc.scaleTo(0.8,1);
      var act3 = cc.sequence(act1, act2);
      var act4 = act3.repeatForever();
      img_shareaward.runAction(act4);
      var btn_create = ccui.helper.seekWidgetByName(root,"btn_create");
      btn_create.addClickEventListener(this.onCreateGame.bind(this));

      var btn_join = ccui.helper.seekWidgetByName(root,"btn_join");
      btn_join.addClickEventListener(this.onJoinGame.bind(this));

      this.btn_fangka = ccui.helper.seekWidgetByName(root,"btn_fangka");
      this.btn_fangka.addClickEventListener(this.onFangka.bind(this));

      //加号按钮
      var btn_kefu = ccui.helper.seekWidgetByName(root,"btn_kefu");
      btn_kefu.addClickEventListener(this.onChongzhi.bind(this));

      if (hall.user.vipLevel < 10)
        this.btn_fangka.setVisible(false);
      this.btn_realname = ccui.helper.seekWidgetByName(root,"btn_realname");
      this.btn_realname.addClickEventListener(this.onRealName.bind(this));

      this.btn_otherRoom = ccui.helper.seekWidgetByName(root,"btn_otherroom");
      this.btn_otherRoom.addClickEventListener(this.onotherRoom.bind(this));


      var panel_center = ccui.helper.seekWidgetByName(root,"panel_center");
      panel_center.setVisible(hall.songshen == 0);
      var panel_songshen = ccui.helper.seekWidgetByName(root,"panel_songshen");
      panel_songshen.setVisible(hall.songshen == 1);
      for(var i = 0;i<3;i++)
      {
        var btn = ccui.helper.seekWidgetByName(panel_songshen,"btn_"+i);
        btn.addClickEventListener(function(){

          var roomData = {};
          roomData['uid'] = hall.user.uid;
          roomData['rounds'] = 8;
          roomData['aaGem'] = 0;
          roomData['yuanLaiFan'] = 0;
          roomData['fengLaiFan'] = 0;
          roomData['yiJiuLaiFan'] = 0;
          roomData['lianJinFan'] = 0;
          roomData['tableName'] = 'WHMajhong';

          hall.createPrivate(whmajhong.appId,roomData,function(data){
            if(data["code"]== 200)
            {
              hall.enter(whmajhong.appId);
            }else
            {
              var dialog = new JJConfirmDialog();
              dialog.setDes(data['error']);
              dialog.showDialog();
            }
          });

        }.bind(this));


      }

    },

    onEnter: function () {
      this._super();
      //sound.stopBgSound();
      sound.playBgSound();
      sound.stopEffect();

      this.updateInfo();
      this.registerAllEvents();

      if (hall.songshen != 1) {
        var notice = new MajhongNotice();
        notice.setVisible(false);
        this.addChild(notice);
      }else
      {
        if(cc.sys.os == cc.sys.OS_ANDROID)
        {
          this.panel_fangka.setVisible(false);
        }
        this.btn_share.setVisible(false);
        this.btn_realname.setVisible(false);
        this.btn_zhanji.setVisible(false);
        this.btn_msg.setVisible(false);
      };

      if (hall.mustUpdate) {
        MajhongLoading.dismiss();
        var dialog = new JJConfirmDialog();
        dialog.setDes('发现新版本，前去下载更新！');
        dialog.setCallback(function () {
          cc.sys.openURL(hall.updateUrl);
        });
        this.addChild(dialog,100);
      }
    },

    onExit: function () {
      this._super();
      this.removeAllEvents();
      this.releaseAllItem();
    },

    releaseAllItem: function () {
      this.text_name = null;
      this.text_id = null;
      this.text_fangka = null;
      this.panel_fangka = null;
      this.image_msg_red = null;
      this.btn_help = null;
      this.btn_setup = null;
      this.btn_share = null;
      this.sprite_head = null;
      this.image_frame = null;
      this.text_name = null;
      this.btn_realname = null;


    },

    registerAllEvents: function () {
      qp.event.listen(this, 'hallUpdatePlayerAttr', this.onUpdatePlayerAttr.bind(this));
    },
    removeAllEvents: function () {
      qp.event.stop(this, 'hallUpdatePlayerAttr');
      // qp.event.stop(this, 'disconnected');
    },
    onUpdatePlayerAttr: function (data) {
      JJLog.print('hall onUpdatePlayerAttr');
      JJLog.print(data);

      if(data['gemNum'] != null || data['gemNum']  != undefined)
      {
        this.text_fangka.setString(data['gemNum']);
      }

    },

    showHall: function () {
      hall.inRoom = false;
      var scene = new cc.Scene();
      scene.addChild(this);
      if(cc.sys.isNative)
      {
        cc.director.replaceScene(scene);
      }else
      {
        cc.director.runScene(scene);
      }

    },

    updateInfo: function () {
      this.updateHead();
      this.updateName();
    },

    updateName: function () {
      if(hall.user["nickName"].length > 0)
      {
        if(cc.sys.isNative)
        {
          var nickName = base64.decode(hall.user["nickName"]);
          this.text_name.setString(nickName);
        }else
        {
          this.text_name.setString(base64.decode(hall.user["nickName"]));
        }

//          this.text_name.setString("状状 😘 😌");
//;
//        var name = '一个大宝剑峡';
//        this.text_name.setString(sliceName(name));


      }else
      {
        this.text_name.setString(hall.user["nickName"]);
      }

      this.text_id.setString('ID: '+hall.user['uid']);

    },


    updateHead: function () {
      var _this = this;
      if (hall.user.headUrl != undefined && hall.user.headUrl.length > 0) {
        if(hall.user.headUrl.substring(hall.user.headUrl.length-1,hall.user.headUrl.length) == "0")
        {
          hall.user.headUrl = hall.user.headUrl.substring(0,hall.user.headUrl.length-1)+"96";
        }
        cc.loader.loadImg(hall.user.headUrl,{isCrossOrigin : true },
            function (err, tex) {
              JJLog.print(err);
              if (err == null && _this.sprite_head != null) {
                var size = _this.sprite_head.getContentSize();
                var sprite = new cc.Sprite(tex);
                var size_sp = sprite.getContentSize();
                sprite.setScaleX(size.width/size_sp.width);
                sprite.setScaleY(size.height/size_sp.height);
                sprite.setAnchorPoint(cc.p(0, 0));
                _this.sprite_head.addChild(sprite);

                util.cacheImage(hall.user.headUrl, tex);
              }
            }.bind(this));
      } else {
        //if(hall.user['userSex'] == 2)
        //{
        //  this.image_head.loadTexture(CommonRes.FEMALE,ccui.Widget.PLIST_TEXTURE);
        //
        //}else
        //{
        //  this.image_head.loadTexture(CommonRes.FEMALE,ccui.Widget.PLIST_TEXTURE);
        //}
      }
    },

    onPlayerInfo: function () {
      var dialog = new PlayerInfoDialog(hall.user);
      dialog.showDialog();
    },

    onCreateGame: function () {
      sound.playBtnSound();
      var panel = new WuHanCreateRoom();
      panel.showPanel();
    },

    onJoinGame: function () {
      sound.playBtnSound();
      var panel = new InputRoomPanel();
      panel.showPanel();
    },



    onFeedBack: function () {

    },

    onFangka:function()
    {
      var dialog = new JJGiveRoomCard();
      dialog.showDialog();
    },
	
	 //btn_help() 客服绑定温馨提示
    onAddFangka:function()
    {
      if(hall.songshen == 1)
      {
        sound.playBtnSound();
        var recharge = new MajhongRecharge();
        recharge.showPanel();
      }else
      {
        var dialog = new AddFKDialog();
        dialog.showDialog();
      }
    },

      //加号按钮绑定充值界面
      onChongzhi:function()
      {
        var chongzhilog =new Chongzhi();
        this.addChild(chongzhilog);
      },

	//btn_fangka绑定邀请码
    onAddFangka1:function()
    {
      if(hall.songshen == 1)
      {
        sound.playBtnSound();
        var recharge = new MajhongRecharge();
        recharge.showPanel();
      }else
      {

        // var dialog = new AddFKDialog();
          //         // dialog.showDialog();
          //增加绑定邀请接口
        if(hall.user['agentCode'] == '0' || hall.user['agentCode']== null ||hall.user['agentCode']== undefined ||
            hall.user['agentCode']=='')
        {
            var bindCodePanel = new MajhongBindCode(this);
            bindCodePanel.showBindCode();
        }else
        {
            var Url = "http://mall.luminositygame.com/mall.html?a=1&token=ad34324davdsa&i=" + hall.user.uid + "&t=wh&s=wh";
            JJLog.print('商店地址=' + Url);
            cc.sys.openURL(Url);
        }
      }
    },

    onRealName:function()
    {
      sound.playBtnSound();
      var dialog = new JJRealName();
      dialog.showDialog();
    },

    onotherRoom:function()
    {
      sound.playBtnSound();
      var dialog = new MajhongOtherRoomPanel();
      dialog.showPanel();
    },

    onHelp: function () {
      sound.playBtnSound();
      var msg = new MajhongHallHelp();
      msg.showHelp();
    },

    onBindCode: function () {
        sound.playBtnSound();
        var bindCodePanel = new MajhongBindCode();
        bindCodePanel.showBindCode();
    },
    onPlayerUnion: function () {
        sound.playBtnSound();
        hall.club.enter();
    },

    onSetup: function () {
      sound.playBtnSound();
      var set = new SetupDialog(0);
      set.showDialog();
    },

    onMsg: function () {
      sound.playBtnSound();
      var msg = new MajhongHallMessage();
      msg.showMsg();
    },

    onZhanji: function () {
      sound.playBtnSound();
      var history = new MajhongHistory();
      history.showHistory();
    },

    onShare: function () {
      sound.playBtnSound();
      var dialog = new JJShareDialog();
      dialog.showDialog();
    },


  });
} else if(GAMENAME == "xuezhan")
{
  var MajhongHall = cc.Layer.extend({
    text_name:null,
    text_id:null,
    text_fangka:null,
    image_head:null,
    panel_fangka:null,
    btn_help:null,
    btn_setup:null,
    btn_zhanji:null,
    btn_share:null,
    sprite_head:null,
    image_frame:null,
    btn_otherRoom:null,
    ctor: function () {
      this._super();
      var root = ccs.load(XueZhanMajhongJson.Hall).node;
      this.addChild(root);
      this.text_name = ccui.helper.seekWidgetByName(root,"text_name");
      this.text_id = ccui.helper.seekWidgetByName(root,"text_id");
      this.text_fangka = ccui.helper.seekWidgetByName(root,"text_fangka");
      this.text_fangka.setString(hall.user.gemNum);

      this.image_frame = ccui.helper.seekWidgetByName(root,"image_frame");
      this.image_frame.setTouchEnabled(true);
      this.image_frame.addClickEventListener(this.onPlayerInfo.bind(this));
      this.sprite_head = ccui.helper.seekWidgetByName(root,"sprite_head");

      this.panel_fangka = ccui.helper.seekWidgetByName(root,"panel_fangka");
      this.panel_fangka.addClickEventListener(this.onAddFangka.bind(this));

      this.btn_help = ccui.helper.seekWidgetByName(root,"btn_help");
      this.btn_help.addClickEventListener(this.onHelp.bind(this));

      this.btn_setup = ccui.helper.seekWidgetByName(root,"btn_setup");
      this.btn_setup.addClickEventListener(this.onSetup.bind(this));

      this.btn_zhanji = ccui.helper.seekWidgetByName(root,"btn_zhanji");
      this.btn_zhanji.addClickEventListener(this.onZhanji.bind(this));

      this.btn_share = ccui.helper.seekWidgetByName(root,"btn_share");
      this.btn_share.addClickEventListener(this.onShare.bind(this));

      // var img_shareaward = ccui.helper.seekWidgetByName(root,"img_shareaward");
      // var act1 = cc.scaleTo(0.8,0.9);
      // var act2 = cc.scaleTo(0.8,1);
      // var act3 = cc.sequence(act1, act2);
      // var act4 = act3.repeatForever();
      // img_shareaward.runAction(act4);

      var btn_create = ccui.helper.seekWidgetByName(root,"btn_create");
      btn_create.addClickEventListener(this.onCreateGame.bind(this));
      var btn_join = ccui.helper.seekWidgetByName(root,"btn_join");
      btn_join.addClickEventListener(this.onJoinGame.bind(this));

      if (cc.sys.isNative) {
        var spineGirl = new sp.SkeletonAnimation(XueZhanMajhongJson.Girl2Json, XueZhanMajhongJson.Girl2Atlas);
        spineGirl.setPosition(cc.p(btn_create.getContentSize().width/2,btn_create.getContentSize().height/2));
        spineGirl.setAnimation(0, 'animation', true);
        btn_create.addChild(spineGirl);

        var spineGirl = new sp.SkeletonAnimation(XueZhanMajhongJson.Girl1Json, XueZhanMajhongJson.Girl1Atlas);
        spineGirl.setPosition(cc.p(btn_join.getContentSize().width/2,btn_join.getContentSize().height/2));
        spineGirl.setAnimation(0, 'animation', true);
        btn_join.addChild(spineGirl);
      }

      var btn_activity = ccui.helper.seekWidgetByName(root,"btn_activity");
      btn_activity.addClickEventListener(function(){
        var layer = new XueZhanActivityLayer();
        layer.showPanel();
      }.bind(this));

      var btn_kefu = ccui.helper.seekWidgetByName(root,"btn_kefu");
      btn_kefu.addClickEventListener(this.onAddFangka1.bind(this));


      cc.spriteFrameCache.addSpriteFrames(XueZhanMajhongJson.HallQuanPlist);
      var animFrames = [];
      var str = "";
      for (var i = 1; i < 6; i++) {
        str = "hall_quan" + i + ".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        animFrames.push(frame);
      }
      var animation = new cc.Animation(animFrames, 0.1);
      var spNode = new cc.Sprite();
      spNode.setPosition(cc.p(btn_kefu.getContentSize().width/2-1,2+btn_kefu.getContentSize().height/2));
      btn_kefu.addChild(spNode, 100);
      spNode.runAction(cc.animate(animation).repeatForever());

      this.btn_otherRoom = ccui.helper.seekWidgetByName(root,"btn_otherroom");
      this.btn_otherRoom.addClickEventListener(this.onotherRoom.bind(this));

    },

    onEnter: function () {
      this._super();
      sound.playBgSound();
      sound.stopEffect();

      this.updateInfo();
      this.registerAllEvents();

      if (hall.songshen != 1) {
        var notice = new XueZhanMajhongNotice();
        notice.setVisible(false);
        this.addChild(notice);
      }else
      {
        this.panel_fangka.setVisible(false);
        this.btn_share.setVisible(false);
        this.btn_zhanji.setVisible(false);
      };

      if (hall.mustUpdate) {
        MajhongLoading.dismiss();
        var dialog = new JJConfirmDialog();
        dialog.setDes('发现新版本，前去下载更新！');
        dialog.setCallback(function () {
          cc.sys.openURL(hall.updateUrl);
        });
        this.addChild(dialog,100);
      }
    },

    onExit: function () {
      this._super();
      this.removeAllEvents();
      this.releaseAllItem();
    },

    releaseAllItem: function () {
      this.text_name = null;
      this.text_id = null;
      this.text_fangka = null;
      this.panel_fangka = null;
      this.btn_help = null;
      this.btn_setup = null;
      this.btn_share = null;
      this.sprite_head = null;
      this.image_frame = null;
      this.text_name = null;
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
        this.text_fangka.setString(data['gemNum']);
      }

    },

    showHall: function () {
      hall.inRoom = false;
      var scene = new cc.Scene();
      scene.addChild(this);
      if(cc.sys.isNative)
      {
        cc.director.replaceScene(scene);
      }else
      {
        cc.director.runScene(scene);
      }

    },

    updateInfo: function () {
      this.updateHead();
      this.updateName();
    },

    updateName: function () {
      if(hall.user["nickName"].length > 0)
      {
        if(cc.sys.isNative)
        {
          var nickName = base64.decode(hall.user["nickName"]);
          this.text_name.setString(nickName);
        }else
        {
          this.text_name.setString(base64.decode(hall.user["nickName"]));
        }

//          this.text_name.setString("状状 😘 😌");
//;
//        var name = '一个大宝剑峡';
//        this.text_name.setString(sliceName(name));


      }else
      {
        this.text_name.setString(hall.user["nickName"]);
      }

      this.text_id.setString('ID: '+hall.user['uid']);

    },


    updateHead: function () {
      var _this = this;
      if (hall.user.headUrl != undefined && hall.user.headUrl.length > 0) {
        if(hall.user.headUrl.substring(hall.user.headUrl.length-1,hall.user.headUrl.length) == "0")
        {
          hall.user.headUrl = hall.user.headUrl.substring(0,hall.user.headUrl.length-1)+"96";
        }
        cc.loader.loadImg(hall.user.headUrl,
            function (err, tex) {
              JJLog.print(err);
              if (err == null && _this.sprite_head != null) {
                var size = _this.sprite_head.getContentSize();
                var sprite = new cc.Sprite(tex);
                var size_sp = sprite.getContentSize();
                sprite.setScaleX(size.width/size_sp.width);
                sprite.setScaleY(size.height/size_sp.height);
                sprite.setAnchorPoint(cc.p(0, 0));
                _this.sprite_head.addChild(sprite);

                util.cacheImage(hall.user.headUrl, tex);
              }
            }.bind(this));
      }
    },

    onPlayerInfo: function () {
      var dialog = new PlayerInfoDialog(hall.user);
      dialog.showDialog();
    },

    onCreateGame: function () {
      sound.playBtnSound();
      var panel = new XueZhanCreateRoom();
      panel.showPanel();
    },

    onJoinGame: function () {
      sound.playBtnSound();
      var panel = new XueZhanInputRoomPanel();
      panel.showPanel();
    },

    onDaikaiGame: function () {
      sound.playBtnSound();
      var panel = new SSSCreateRoom(2);
      panel.showPanel();
    },

    onFeedBack: function () {

    },

    onFangka:function()
    {
      var dialog = new JJGiveRoomCard();
      dialog.showDialog();
    },

    onAddFangka:function()
    {
      // if(hall.user['agentCode'] == '0' || hall.user['agentCode']== null ||hall.user['agentCode']== undefined ||
      //     hall.user['agentCode']=='')
      // {
      //   var uid = hall.user.uid;
      //   var Url = "http://mall.yiqigame.me/bind.html?a=1&token=ad34324davdsa&i=" + uid + PackageURLTYPE[GAMENAME];
      //   JJLog.print('绑定地址=' + Url);
      //   cc.sys.openURL(Url);
      // }else
      // {
      //   var uid = hall.user.uid;
      //   var Url = "http://mall.yiqigame.me/mall.html?a=1&token=ad34324davdsa&i=" + uid + PackageURLTYPE[GAMENAME];
      //   JJLog.print('商店地址=' + Url);
      //   cc.sys.openURL(Url);
      // }

      var payT =  new SyNetMgr();
      //case 充值
      // payT.fetchMethod("com.interact.game.alaxzmj.10.10",3);
      //case 公告
      payT.notice();


      // var dialog = new AddFKDialog();
      // dialog.showDialog();
    },

    onRealName:function()
    {
      var dialog = new JJRealName();
      dialog.showDialog();
    },
    onotherRoom:function()
    {
      var dialog = new XueZhanOtherRoomPanel();
      dialog.showPanel();
    },
    onHelp: function () {
      var msg = new MajhongHallHelp();
      msg.showHelp();
    },

    onSetup: function () {
      var set = new SetupDialog(0);
      set.showDialog();
    },

    onMsg: function () {
      var msg = new MajhongHallMessage();
      msg.showMsg();
    },

    onZhanji: function () {
      var history = new XueZhanMajhongHistory();
      history.showHistory();
    },

    onShare: function () {
      var dialog = new XueZhanShareDialog();
      dialog.showDialog();
    },


  });

  var XueZhanShareDialog = JJDialog.extend({
    _Listeners:[],
    sharetype :1,              //1是群  2是朋友圈
    ctor: function () {
      this._super();
      var root = ccs.load(XueZhanMajhongJson.GameShare).node;
      this.addChild(root);
      var panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
      var _this = this;
      panel_root.addClickEventListener(function () {
        _this.dismissDialog();
      });
      var btn_friendgrounps = ccui.helper.seekWidgetByName(root,"btn_friendgrounps");
      btn_friendgrounps.addClickEventListener(this.onShareGroup.bind(this));
      var btn_friendmoments = ccui.helper.seekWidgetByName(root,"btn_friendmoments");
      btn_friendmoments.addClickEventListener(this.onShareMoments.bind(this));

      // var img_award = ccui.helper.seekWidgetByName(root,"img_award1");
      // var act1 = cc.scaleTo(0.8,0.9);
      // var act2 = cc.scaleTo(0.8,1);
      // var act3 = cc.sequence(act1, act2);
      // var act4 = act3.repeatForever();
      // img_award.runAction(act4);
    },
    onEnter: function ()
    {
      this._super();
      var ls = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: CommonEvent.EVT_ShareCallback,
        callback: this.onShareRultCallback.bind(this)
      });
      var listener = cc.eventManager.addListener(ls,this);
      this._Listeners.push(listener);
    },
    onExit:function()
    {
      for(var i=0;i< this._Listeners.length;i++)
      {
        cc.eventManager.removeListener(this._Listeners[i]);
      }
      this._Listeners.splice(0,this._Listeners.length);

      this._super();
    },
    onShareGroup: function () {
      JJLog.print('分享到 朋友/群');
      this.sharetype = 1;
      hall.net.wxShareURL("下载《阿拉血战麻将》，即领最高百元话费，百分百中奖，天天领！", "", 0);
    },

    onShareMoments: function () {
      JJLog.print('分享到 朋友圈.');
      this.sharetype = 2;
      hall.net.wxShareURL("下载《阿拉血战麻将》，即领最高百元话费，百分百中奖，天天领！","最好玩的阿拉血战麻将，快邀请你的好友一起来玩吧！", 1);
    },

    onShareRultCallback:function(event)
    {
      var evt = event.getUserData();
      if(this.sharetype == 2)
      {
        if(evt ==  0 )
        {
          JJLog.print(" 发送服务器加房卡");
          hall.net.addShareAward(
              function(data)
              {
                JJLog.print("加房卡回调="+ JSON.stringify(data));
                if(data['code'] == 200)
                {
                  var dialog = new JJConfirmDialog();
                  dialog.setDes("获得钻石成功！");
                  dialog.showDialog();
                }else{

                }
              });
        }
      }

    }

  });

  var XueZhanMajhongNotice = cc.Layer.extend({
    panel_msg:null,
    textArray:null,
    rollSpeed:30,
    fontSize:24,
    scrollTimes:0,
    msgArr:[],
    msgIndex:0,
    exitFlag: false,
    lastedIndex:0,
    isGaming:false,
    ctor: function (isInGame) {
      this._super();
      var root = ccs.load(XueZhanMajhongJson.GameNotice).node;
      this.addChild(root);
      this.panel_msg = ccui.helper.seekWidgetByName(root,"panel_msg");
      this.textArray = new Array();

      this.msgArr[0] = '测试的第一句话,不是那么长的一句话！';
      this.msgArr[1] = '测试的第二句话,有点短的一句话';
      this.msgArr[2] = '我们祖国我们爱你';
      this.msgArr[3] = '今天整理图片，晚上出个一张图大预览吧';
      this.msgArr[4] = '金雕CR500察打一体无人直升机，是中国兵器集团北方工业公司研制的最新型无人攻击直升机。';
      if(isInGame == true)
      {
        this.isGaming = true;
      }
    },

    onEnter:function()
    {
      this._super();
      if(this.isGaming)
      {
        var _this = this;
        qp.event.listen(this, 'hallTempNotify', function(data) {
          _this.setVisible(true);
          _this.scrollTimes = 0;
          var msg = data['hallTempNotify']['contents'];
          this.addMsg(msg);
        });
        this.scheduleOnce(this.rescrollMsg,2);

        qp.event.listen(this, 'hallMessageNotify', function(data) {
          var text = data['hallMessageNotify']['contents'];
          var msg  = {};
          msg['userName'] = '系统通知';
          msg['record'] = text;
          NoticeMsg.addMsg(msg);
        });

      }else
      {
        qp.event.listen(this, 'hallMessageNotify', function(data) {
          JJLog.print("hallMessageNotify");
          JJLog.print(data);
          var msg = data['hallMessageNotify']['contents'];
          this.addMsg(msg);
        });
        this.scheduleOnce(this.rescrollMsg,2);
      }
    },

    onExit:function()
    {
      if(this.isGaming)
      {
        qp.event.stop(this, 'hallTempNotify');
        qp.event.stop(this, 'hallMessageNotify');
      }
      else
      {
        qp.event.stop(this, 'hallMessageNotify');
      }
      this.scrollTimes = 0;
      this._super();
      this.exitFlag = true;
    },

    addMsg: function (text) {
      var msg  = {};
      msg['userName'] = '系统通知';
      msg['record'] = text;
      this.pushMsg(msg);

      this.msgIndex++;
      if(this.msgIndex >= this.msgArr.length)
      {
        this.msgIndex = 0;
      }
    },

    pushMsg:function(jMsg)
    {
      if(this.isGaming)
      {
        NoticeMsg.addBoard(jMsg);
      }else
      {
        NoticeMsg.addMsg(jMsg);
      }


      if (this.exitFlag)
        return;

      if(this.textArray.length > 0)
      {
        this.runNextMaquee(jMsg);
      }else
      {
        this.setVisible(true);
        var pannelSize = this.panel_msg.getContentSize();
        this.runMarquee(jMsg,cc.p(pannelSize.width,0));
      }

    },

    runNextMaquee:function(msg)
    {
      var text = this.textArray[this.textArray.length -1];
      var textSize = text.getContentSize();
      var pos = text.getPosition();
      var pannelSize = this.panel_msg.getContentSize();

      if(pos.x + textSize.width < pannelSize.width) //在中间显示完全
      {
        this.runMarquee(msg,cc.p(pannelSize.width,0));
      }else if(pos.x + textSize.width >= pannelSize.width)//未显示完全
      {
        this.runMarquee(msg,cc.p(pos.x + textSize.width,0));
      }
    },

    runMarquee:function(msg,pos)
    {
      var _this = this;
      var name = new ccui.Text(msg["userName"]+":","Arial",24);
      name.setColor(cc.color.YELLOW);
      name.setTouchScaleChangeEnabled(true);
      name.setTouchEnabled(true);
      name.addClickEventListener(this.showPlayer);
      var bMsg = new ccui.Text(msg["record"],"Arial",24);
      bMsg.setColor(cc.color.WHITE);


      var textSize = cc.size(name.getContentSize().width+bMsg.getContentSize().width,name.getContentSize().height);
      var layout = new cc.Node();
      //layout.setContentSize(cc.size(name.getContentSize().width+bMsg.getContentSize().width,name.getContentSize().height));
      //layout.setAnchorPoint(0,0);
      layout.setPosition(pos);
      layout.addChild(name);
      layout.addChild(bMsg);
      name.setPosition(cc.p(name.getContentSize().width*0.5,name.getContentSize().height*0.5));
      bMsg.setPosition(cc.p(name.getContentSize().width+bMsg.getContentSize().width*0.5,name.getContentSize().height*0.5));

      // var textSize = layout.getContentSize();
      this.panel_msg.addChild(layout,12);


      var pannelSize = this.panel_msg.getContentSize();
      var between = pos.x - pannelSize.width;
      var time1 = (between + textSize.width+pannelSize.width)/this.rollSpeed;

      var move1 = cc.moveTo(time1,cc.p(-textSize.width,pos.y));
      var clearAction = cc.callFunc(this.clearText,this);
      var removeSelf = cc.removeSelf(true);
      var seq = cc.sequence(move1,clearAction,removeSelf);
      //var seq = cc.sequence(move1,removeSelf);
      layout.runAction(seq);
      this.textArray.push(layout);

    },

    clearText:function()
    {
      if(this.textArray.length > 0)
      {
        this.textArray.splice(0,1);
        if(this.textArray.length == 0)
        {
          if(this.isGaming)
          {
            this.scrollTimes++;
            if(this.scrollTimes > 2)
            {
              this.scrollTimes = 0;
              this.setVisible(false);
            }else
            {
              this.scheduleOnce(this.rescrollMsg,2);
            }
          }else
          {
            this.scheduleOnce(this.rescrollMsg,2);
          }
        }else
        {
          JJLog.print("text wait next");
        }
      }
    },

    rescrollMsg:function(dt)
    {
      if(this.isGaming)
      {
        if(NoticeMsg.board.length <= 0 ) return;
        if(this.lastedIndex >= NoticeMsg.board ||this.lastedIndex >= NoticeMsg.size)
        {
          this.lastedIndex = 0;
        }
        this.pushMsg(NoticeMsg.getBoard(this.lastedIndex));
        this.lastedIndex++;
      }else
      {
        if(NoticeMsg.list.length <= 0 ) return;
        if(this.lastedIndex >= NoticeMsg.list ||this.lastedIndex >= NoticeMsg.size)
        {
          this.lastedIndex = 0;
        }
        this.pushMsg(NoticeMsg.getMsg(this.lastedIndex));
        this.lastedIndex++;
      }

    },


    setRollSpeed:function(jSpeed)
    {
      this.rollSpeed = jSpeed;
    },

    showPlayer:function()
    {
      JJLog.print("show name = "+this.getString());
    },






  });

  var XueZhanMajhongHistory = cc.Layer.extend({
    listview_session:null,
    listview_round:null,
    btn_back:null,
    btn_view_others:null,
    panel_session_cell:null,
    panel_round_cell:null,
    panel_list:null,
    panel_round:null,
    loaded:false,
    text_gotoplay:null,
    ctor:function()
    {
      this._super();
      var root = ccs.load(XueZhanMajhongJson.History).node;
      this.addChild(root);
      this.panel_list = ccui.helper.seekWidgetByName(root,"panel_list");
      this.panel_list.setVisible(true);
      this.panel_round = ccui.helper.seekWidgetByName(root,"panel_round");
      this.panel_round.setVisible(false);
      this.listview_session = ccui.helper.seekWidgetByName(root,"listview_session");
      this.listview_round = ccui.helper.seekWidgetByName(root,"listview_round");
      this.listview_round.setVisible(false);
      this.btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
      this.btn_back.addClickEventListener(function () {
        if(this.listview_round.isVisible())
        {
          this.showListSession();
        }else
        {
          this.removeFromParent();
        }


      }.bind(this));
      this.btn_view_others = ccui.helper.seekWidgetByName(root,"btn_view_others");
      this.btn_view_others.addClickEventListener(function () {
        var dialog = new XueZhanCheckRecord();
        dialog.showDialog();
      }.bind(this));


      this.panel_session_cell = ccui.helper.seekWidgetByName(root,"panel_session_cell");
      this.panel_round_cell = ccui.helper.seekWidgetByName(root,"panel_round_cell");
      this.text_gotoplay = ccui.helper.seekWidgetByName(root,"text_gotoplay");
      this.text_gotoplay.setVisible(false);
      this.panel_round_cell.setVisible(false);
      this.panel_session_cell.setVisible(false);

      var text_tip = ccui.helper.seekWidgetByName(root,"text_tip");
      text_tip.setString('提醒:保存最近三天的录像');

    },

    onEnter: function () {
      this._super();

      this.showListSession();
    },


    showListRound: function (roundData) {
      this.panel_list.setVisible(false);
      this.panel_round.setVisible(true);
      this.listview_round.removeAllChildren();
      this.listview_round.setVisible(true);
      this.listview_session.setVisible(false);
      var resultList = roundData['data'];
      var serverType = roundData['serverType'];
      JJLog.print("单个回放="+ JSON.stringify(roundData));
      for(var i = 0;i<resultList.length;i++)
      {
        var result = resultList[i];
        var cell  = this.panel_round_cell.clone();
        var btn_view =  ccui.helper.seekWidgetByName(cell,"btn_view");
        var btn_share =  ccui.helper.seekWidgetByName(cell,"btn_share");
        var info = {};
        info['recordId'] = result['num'];
        btn_share.addClickEventListener(function () {
          var recordId = this['recordId'];
          hall.net.wxShareURL(GAMENAMES[serverType],'玩家['+base64.decode(hall.user.nickName) + ']分享了一个回访码:'+recordId+'在大厅点击进入战绩页面然后点击查看他人回放输入回访码.', 0);

        }.bind(info));
        btn_view.addClickEventListener(function () {

          MajhongLoading.show('加载中...');
          var recordId = this['recordId'];
          hall.net.getHuiFangInfo(recordId,
              function(data)
              {
                JJLog.print("回放数据="+ JSON.stringify(data));
                if(data['code'] == 200)
                {
                  hall.enterRecord(GAMETYPES[data['serverType']],data['record']); //GAMETYPES[data['serverType']]
                }else{
                  MajhongLoading.dismiss();
                  var dialog = new JJConfirmDialog();
                  dialog.setDes(data['err']);
                  dialog.showDialog();
                }

              });

        }.bind(info));
        var layout = new ccui.Layout();
        layout.setContentSize(cell.getContentSize());
        layout.addChild(cell);

        var text_id =  ccui.helper.seekWidgetByName(cell,"text_order");
        text_id.setString(i+1);
        var text_time =  ccui.helper.seekWidgetByName(cell,"text_room_time");
        var _time = result['time'];
        _time = result['time'].match(/\d{1,2}\:\d{1,2}\:\d{1,2}/);
        text_time.setString(_time);


        var values = result['result'];
        for(var j = 0;j < values.length;j++)
        {
          var text_players = ccui.helper.seekWidgetByName(this.panel_round,"text_player"+j);
          text_players.setString(base64.decode(values[j]['userName']));
          text_players.setVisible(true);
          var score = ccui.helper.seekWidgetByName(cell,"text_score"+j);
          score.setString(values[j]['winScore']);
          score.setVisible(true);
          var img_scores =  ccui.helper.seekWidgetByName(cell,"img_scores"+j);
          if(img_scores != null)
          {
            img_scores.setVisible(true);
          }
        }

        cell.x = 0;
        cell.y = 0;
        cell.setVisible(true);

        this.listview_round.pushBackCustomItem(layout);
      }

    },

    showListSession: function () {
      this.panel_list.setVisible(true);
      this.panel_round.setVisible(false);
      this.listview_round.setVisible(false);
      this.listview_session.setVisible(true);
      var _this = this;
      if(this.loaded) return;
      hall.net.getHuiFangList(function(data) {
        JJLog.print('get record!');
        var recordList = data['record'];
        JJLog.print("回放="+ JSON.stringify(data));
        _this.text_gotoplay.setVisible(recordList.length == 0);
        for(var i = 0 ; i < recordList.length;i++)
        {
          var cellData = recordList[i];
          var fanghao = cellData['fangHao'];
          var id = cellData['id'];

          var resultArr = cellData['lastResult'];
          var cell = _this.panel_session_cell.clone();
          cell.setTouchEnabled(true);
          var childData ={};
          childData['data'] = cellData['record'];
          childData['serverType'] = cellData['serverType'];
          cell.addClickEventListener(function () {
            _this.showListRound(this);
          }.bind(childData));

          var layout = new ccui.Layout();
          layout.setContentSize(cell.getContentSize());
          layout.addChild(cell);
          // var text_order = ccui.helper.seekWidgetByName(cell,"text_order");
          // text_order.setString(i+1);
          var text_room_id = ccui.helper.seekWidgetByName(cell,"text_room_id");
          text_room_id.setString(fanghao+'号房间');
          var text_gameName = ccui.helper.seekWidgetByName(cell,"text_gameName");
          text_gameName.setString(GAMENAMES[cellData["serverType"]]);
          var text_room_time = ccui.helper.seekWidgetByName(cell,"text_room_time");
          text_room_time.setString(cellData['recordTime']);

          for(var j = 0; j < resultArr.length;j++)
          {
            var text_player = ccui.helper.seekWidgetByName(cell,"text_player"+j);
            var text_score = ccui.helper.seekWidgetByName(cell,"text_score"+j);
            var img_scores =  ccui.helper.seekWidgetByName(cell,"img_scores"+j);
            if(img_scores != null)
            {
              img_scores.setVisible(true);
            }
            text_player.setString(base64.decode(resultArr[j]['nickName']));
            text_score.setString(resultArr[j]['coinNum']);
            text_score.setVisible(true);
            text_player.setVisible(true);
          }

          cell.x = 0;
          cell.y = 0;
          cell.setVisible(true);

          _this.listview_session.pushBackCustomItem(layout);
        }
        _this.loaded = true;
      });
    },

    showHistory:function()
    {
      cc.director.getRunningScene().addChild(this);
    },
  });

  var XueZhanCheckRecord = JJDialog.extend({
    panel_root:null,
    textfield_input:null,
    btn_confirm:null,
    btn_cancel:null,
    ctor:function(){
      this._super();
      var root = ccs.load(XueZhanMajhongJson.GameCheckRecord).node;
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

  var XueZhanInputRoomPanel = cc.Layer.extend({
    btn_del:null,
    btn_reset:null,
    textArray:null,
    btnArray:null,
    ctor:function(){
      this._super();

      var root = ccs.load(XueZhanMajhongJson.JoinRoom).node;
      this.addChild(root);
      this.btnArray = new Array();
      for(var i = 0;i < 10;i++)
      {
        var str = "btn_"+i;
        var btn = ccui.helper.seekWidgetByName(root,str);
        btn.setTag(i);
        var data = {};
        data['root'] = this;
        data['tag'] = i;
        btn.addClickEventListener(this.onNum.bind(data));
        this.btnArray.push(btn);
      }

      this.textArray = new Array();
      for(var i = 0 ;i<6;i++)
      {
        var str = "text"+i;
        var text = ccui.helper.seekWidgetByName(root,str);
        text.setString('');
        this.textArray.push(text);
      }

      this.btn_del = ccui.helper.seekWidgetByName(root,"btn_del");
      this.btn_del.addClickEventListener(this.onDel.bind(this));
      this.btn_reset = ccui.helper.seekWidgetByName(root,"btn_reset");
      this.btn_reset.addClickEventListener(this.onRest.bind(this));

      this.btn_close = ccui.helper.seekWidgetByName(root,"btn_close");

      this.btn_close.addClickEventListener(function(){
        this.removeFromParent();
      }.bind(this));

    },

    onNum:function()
    {

      var root = this['root'];
      if ( root.textArray[root.textArray.length-1].length > 0)
        return;
      var num = this['tag'];
      for(var i = 0 ;  i < root.textArray.length;i++)
      {
        var text = root.textArray[i];
        if(text.getString().length  <= 0)
        {
          text.setString(num);
          break;
        }
      }

      var roomId = '';
      for(var i = 0 ;  i < root.textArray.length;i++)
      {
        var text = root.textArray[i];
        roomId += text.getString();
        if(text.getString().length  <= 0)
        {
          return;
        }
      }
      var _r = root;

      if(GAMENAME.indexOf("shisanshui") != -1)
      {
        hall.joinPrivate(SSSPoker.appId,roomId,function(data){
          if(data["code"]== 200)
          {
            hall.enter(SSSPoker.appId);
          }else
          {
            _r.showErr(data);
          }
        });
      }else if(GAMENAME.indexOf("qidong") != -1)
      {
        if(parseInt(roomId) < 500000)
        {
          hall.joinPrivate(qdmajhong.appId,roomId,function(data){
            if(data["code"]== 200)
            {
              hall.enter(qdmajhong.appId);
            }else
            {
              _r.showErr(data);
            }
          });

        }else if(parseInt(roomId) < 700000)
        {
          hall.joinPrivate(bdmajhong.appId,roomId,function(data){
            if(data["code"]== 200)
            {
              hall.enter(bdmajhong.appId);
            }else
            {
              _r.showErr(data);
            }
          });
        }
        else if(parseInt(roomId) < 900000)   //老韭菜
        {
            hall.joinPrivate(ljcmajhong.appId,roomId,function(data){
                if(data["code"]== 200)
                {
                    hall.enter(ljcmajhong.appId);
                }else
                {
                    _r.showErr(data);
                }
            });
        }
        else if(parseInt(roomId) < 1000000)  //十三水
        {
            hall.joinPrivate(SSSPoker.appId,roomId,function(data){
                if(data["code"]== 200)
                {
                    hall.enter(SSSPoker.appId);
                }else
                {
                    _r.showErr(data);
                }
            });

        }

      } else if(GAMENAME.indexOf("xuezhan") != -1)
      {
        hall.joinPrivate(XueZhanMajhong.appId,roomId,function(data){
          if(data["code"]== 200)
          {
            hall.enter(XueZhanMajhong.appId);
          }else
          {
            _r.showErr(data);
          }
        });
      }
      else
      {
        if(parseInt(roomId) < 300000)
        {
          hall.joinPrivate(majhong.appId,roomId,function(data){
            if(data["code"]== 200)
            {
              hall.enter(majhong.appId);
            }else
            {
              _r.showErr(data);
            }
          });
        }else if(parseInt(roomId) < 500000)
        {
          hall.joinPrivate(poker.appId,roomId,function(data){
            if(data["code"]== 200)
            {
              hall.enter(poker.appId);
            }else
            {
              _r.showErr(data);
            }
          });
        }else if(parseInt(roomId) < 700000)
        {
          hall.joinPrivate(SSSPoker.appId,roomId,function(data){
            if(data["code"]== 200)
            {
              hall.enter(SSSPoker.appId);
            }else
            {
              _r.showErr(data);
            }
          });
        }
        else
        {
          hall.joinPrivate(ycmajhong.appId,roomId,function(data){
            if(data["code"]== 200)
            {
              hall.enter(ycmajhong.appId);
            }else
            {
              _r.showErr(data);
            }
          });
        }
      }

    },


    showErr: function (data) {
      this.onRest();
      var dialog = new JJConfirmDialog();
      dialog.setDes(data['error']);
      dialog.showDialog();
    },



    onRest: function () {
      for(var i = 0; i < this.textArray.length;i++)
      {
        var text = this.textArray[i];
        text.setString('');

      }
    },

    onDel: function () {

      for(var i = this.textArray.length;i>0;i--)
      {
        var text = this.textArray[i-1];
        if(text.getString().length > 0)
        {
          text.setString('');
          break;
        }
      }
    },

    onEnter: function(){
      this._super();

    },

    showPanel:function()
    {
      cc.director.getRunningScene().addChild(this);
    }

  });

  var XueZhanCreateRoom = cc.Layer.extend({
    btn_create:null,
    btn_createOther:null,
    btn_Array:null,
    gameIndex:0,
    panel_rounds:null,
    itme_ops:null,
    difenArray:null,
    text_score:null,
    score:0,
    ctor: function (enterType) {
      this._super();
      var root = ccs.load(XueZhanMajhongJson.CreateRoom).node;
      this.addChild(root);

      this.difenArray =[1,2,5,10,20,30,50,100,200];
      this.item_ops = {round:10,fufei:0,paiChuTime:-1,fengDing:2,wanFa1:0,wanFa2:0,huanSan:0,one9:0,tianDi:0,menQing:0,score:1,isSameIp:0,dianPao:0,duiHu:0};
      this.btn_Array = new Array();

      var btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
      btn_back.addClickEventListener(function () {
        this.removeFromParent();
      }.bind(this));

      //游戏标签
      for(var i = 0;i<1;i++)
      {
        var btn_game = ccui.helper.seekWidgetByName(root,"btn_game"+i);
        if(i == 0)
        {
          btn_game.setBright(false);
          btn_game.setTouchEnabled(false);
        }
        var clickData = {};
        clickData['this'] = this;
        clickData['index'] = i;
        btn_game.addClickEventListener(this.onSwitchGame.bind(clickData));
        this.btn_Array.push(btn_game);
      }

      var panel_common = ccui.helper.seekWidgetByName(root,"panel_common");

      var btn_add = ccui.helper.seekWidgetByName(panel_common,"btn_score1");
      var btn_earse = ccui.helper.seekWidgetByName(panel_common,"btn_score0");
      btn_add.addClickEventListener(this.addScore.bind(this));
      btn_earse.addClickEventListener(this.earseScore.bind(this));
      this.text_score = ccui.helper.seekWidgetByName(panel_common,"text_score");
      var saveOp = util.getCacheItem('config_score') || 1;
      if(saveOp!=null && saveOp != undefined)
        this.item_ops["score"] = saveOp;

      this.text_score.setString(this.item_ops["score"]);

      var panel_xuezhan = ccui.helper.seekWidgetByName(root,"panel_xuezhan");
      var panel_fufei = new Array();
      for(var i = 0;i<2;i++)
      {
        var panel = ccui.helper.seekWidgetByName(panel_xuezhan,"panel_fufei"+i);
        var checkbox = ccui.helper.seekWidgetByName(panel_xuezhan,"checkbox_fufei"+i);
        checkbox.setTouchEnabled(false);
        panel._checkBox = checkbox;
        var saveOp = util.getCacheItem('config_fufei');
        if(saveOp == 0)
        {
          this.item_ops["fufei"] = saveOp;
        }
        var bl = this.item_ops["fufei"] == i;
        checkbox.setSelected(bl);
        panel.setTouchEnabled(!bl);
        panel_fufei.push(panel);

        var clickData = {};
        clickData['this'] = this;
        clickData['itemValue'] = i;
        clickData['index'] = i;
        clickData['array'] = panel_fufei;
        clickData['itemKey'] = "fufei";
        panel.addClickEventListener(this.onToggle.bind(clickData));
      }

      //处理选择不同步类型开局，所消耗的房卡标示不相同
      var ffTitleCfg = {
        0 : ["AA支付(1房卡)","房主支付(4房卡)"],
        1 : ["AA支付(2房卡)","房主支付(8房卡)"]
      };
      var _refreshFFTitleFunc = function (select){
        var textAA = ccui.helper.seekWidgetByName(panel_xuezhan,"text_aa");
        var textBanker = ccui.helper.seekWidgetByName(panel_xuezhan,"text_banker");

        if(textAA){
          textAA.string = ffTitleCfg[select][0];
          textBanker.string = ffTitleCfg[select][1];
        }
      }



      this.panel_rounds = new Array();
      for(var i = 0;i<2;i++)
      {
        var panel = ccui.helper.seekWidgetByName(panel_common,"panel_"+i);
        var checkbox = ccui.helper.seekWidgetByName(panel_common,"checkbox_"+i);
        checkbox.setTouchEnabled(false);
        var img = ccui.helper.seekWidgetByName(panel_common,"img_"+i);
        var num = ccui.helper.seekWidgetByName(img,"num");
        panel._checkBox = checkbox;
        panel._labelNum = num;
        var saveOp = util.getCacheItem('config_round');
        if(saveOp == 10 || saveOp == 20 )
        {
          this.item_ops["round"] = saveOp;
        }
        var bl = this.item_ops["round"] == (i+1)*10;
        checkbox.setSelected(bl);
        panel.setTouchEnabled(!bl);

        if(bl) _refreshFFTitleFunc(i);

        this.panel_rounds.push(panel);
        var clickData = {};
        clickData['this'] = this;
        clickData['itemValue'] = (i+1)*10;
        clickData['index'] = i;
        clickData['array'] = this.panel_rounds;
        clickData['itemKey'] = "round";
        clickData['callBack'] = _refreshFFTitleFunc;
        panel.addClickEventListener(this.onToggle.bind(clickData));
      }


      var panel_out = new Array();
      var outTime = [30,60,-1];
      for(var i = 0;i<3;i++)
      {
        var panel = ccui.helper.seekWidgetByName(panel_xuezhan,"panel_out"+i);
        var checkbox = ccui.helper.seekWidgetByName(panel_xuezhan,"checkbox_out"+i);
        checkbox.setTouchEnabled(false);
        panel._checkBox = checkbox;
        var saveOp = util.getCacheItem('config_paiChuTime');
        if(saveOp == -1 || saveOp == 30 || saveOp == 60)
        {
          this.item_ops["paiChuTime"] = saveOp;
        }
        var bl = this.item_ops["paiChuTime"] == outTime[i];
        checkbox.setSelected(bl);
        panel.setTouchEnabled(!bl);
        panel_out.push(panel);

        var clickData = {};
        clickData['this'] = this;
        clickData['itemValue'] = outTime[i];
        clickData['index'] = i;
        clickData['array'] = panel_out;
        clickData['itemKey'] = "paiChuTime";
        panel.addClickEventListener(this.onToggle.bind(clickData));
      }

      var panel_ding = new Array();
      for(var i = 0;i<3;i++)
      {
        var panel = ccui.helper.seekWidgetByName(panel_xuezhan,"panel_ding"+i);
        var checkbox = ccui.helper.seekWidgetByName(panel_xuezhan,"checkbox_ding"+i);
        checkbox.setTouchEnabled(false);
        panel._checkBox = checkbox;
        var saveOp = util.getCacheItem('config_fengDing');
        if(saveOp == 2 || saveOp == 3 || saveOp == 4 )
        {
          this.item_ops["fengDing"] = saveOp;
        }
        var bl = this.item_ops["fengDing"] == (i+2);
        checkbox.setSelected(bl);
        panel.setTouchEnabled(!bl);
        panel_ding.push(panel);

        var clickData = {};
        clickData['this'] = this;
        clickData['itemValue'] = i+2;
        clickData['index'] = i;
        clickData['array'] = panel_ding;
        clickData['itemKey'] = "fengDing";
        panel.addClickEventListener(this.onToggle.bind(clickData));
      }


      var panel_wanFa1 = new Array();
      for(var i = 0;i<2;i++)
      {
        var panel = ccui.helper.seekWidgetByName(panel_xuezhan,"panel_wanfa1"+i);
        var checkbox = ccui.helper.seekWidgetByName(panel_xuezhan,"checkbox_wanfa1"+i);
        checkbox.setTouchEnabled(false);
        panel._checkBox = checkbox;
        var saveOp = util.getCacheItem('config_wanFa1');
        if(saveOp == 0 || saveOp == 1 )
        {
          this.item_ops["wanFa1"] = saveOp;
        }
        var bl = this.item_ops["wanFa1"] == i;
        checkbox.setSelected(bl);
        panel.setTouchEnabled(!bl);
        panel_wanFa1.push(panel);

        var clickData = {};
        clickData['this'] = this;
        clickData['itemValue'] = i;
        clickData['index'] = i;
        clickData['array'] = panel_wanFa1;
        clickData['itemKey'] = "wanFa1";
        panel.addClickEventListener(this.onToggle.bind(clickData));
      }


      var panel_wanFa2 = new Array();
      for(var i = 0;i<2;i++)
      {
        var panel = ccui.helper.seekWidgetByName(panel_xuezhan,"panel_wanfa2"+i);
        var checkbox = ccui.helper.seekWidgetByName(panel_xuezhan,"checkbox_wanfa2"+i);
        checkbox.setTouchEnabled(false);
        panel._checkBox = checkbox;
        var saveOp = util.getCacheItem('config_wanFa2');
        if(saveOp == 0 || saveOp == 1 )
        {
          this.item_ops["wanFa2"] = saveOp;
        }
        var bl = this.item_ops["wanFa2"] == i;
        checkbox.setSelected(bl);
        panel.setTouchEnabled(!bl);
        panel_wanFa2.push(panel);

        var clickData = {};
        clickData['this'] = this;
        clickData['itemValue'] = i;
        clickData['index'] = i;
        clickData['array'] = panel_wanFa2;
        clickData['itemKey'] = "wanFa2";
        panel.addClickEventListener(this.onToggle.bind(clickData));
      }

      var opKeys = ["huanSan","one9","tianDi","menQing","dianPao","duiHu","isSameIp"];
      for(var i = 0;i<opKeys.length;i++)
      {
        var panel = ccui.helper.seekWidgetByName(panel_xuezhan,"panel_op"+i);
        var checkbox = ccui.helper.seekWidgetByName(panel_xuezhan,"checkbox_op"+i);
        checkbox.setTouchEnabled(false);
        var saveOp = util.getCacheItem('config_'+opKeys[i]);
        if(saveOp == 1)
        {
          this.item_ops[opKeys[i]] = saveOp;
        }
        var bl = this.item_ops[opKeys[i]] == 1;
        checkbox.setSelected(bl);
        var clickData = {};
        clickData['this'] = this;
        clickData['checkBox'] = checkbox;
        clickData['itemKey'] = opKeys[i];
        panel.addClickEventListener(this.onSwitchSelect.bind(clickData));
      }

      this.btn_create = ccui.helper.seekWidgetByName(root,"btn_create");
      this.btn_create.addClickEventListener(this.onCreateRoom.bind(this));
      this.btn_createOther = ccui.helper.seekWidgetByName(root,"btn_createother");
      this.btn_createOther.addClickEventListener(this.onCreateOtherRoom.bind(this));

      var index =util.getCacheItem('config_gameindex');
      if(index ==null || index== undefined || index == "")
      {
        index = 0;
      }
      // var clickData = {};
      // clickData['this'] = this;
      // clickData['index'] = index;
      // this.onSwitchGame.bind(clickData)();
    },

    onSwitchGame:function () {
      var index = this['index'];
      var _this = this['this'];

      _this.gameIndex = index;

      if(index == 1)
      {
        var cost = {"2": 13, "3": 18, "4": 25, "5": 32, "6": 40}
        for(var i = 0;i<_this.panel_rounds.length;i++)
        {
          _this.panel_rounds[i]._labelNum.setString(cost[_this.item_ops.person]*(i+1));
          _this.panel_rounds[i]._labelNum.setContentSize(_this.panel_rounds[i]._labelNum.getVirtualRendererSize());
        }
      }else
      {
        var cost = {"2": 13, "3": 18, "4": 25, "5": 32, "6": 40}
        var aa = 8;
        for(var i = 0;i<_this.panel_rounds.length;i++)
        {
          if(_this.item_ops.fufei == 1)
          {
            _this.panel_rounds[i]._labelNum.setString(aa*(i+1));
          }else
          {
            _this.panel_rounds[i]._labelNum.setString(cost[_this.item_ops.person]*(i+1));
          }
          _this.panel_rounds[i]._labelNum.setContentSize(_this.panel_rounds[i]._labelNum.getVirtualRendererSize());
        }
      }

      for(var i=0; i< _this.btn_Array.length ;i++)
      {
        if(i == index)
        {
          _this.btn_Array[i].setBright(false);
          _this.btn_Array[i].setTouchEnabled(false);
        }else
        {
          _this.btn_Array[i].setBright(true);
          _this.btn_Array[i].setTouchEnabled(true);
        }
      }
    },

    addScore:function () {
      this.score++;
      if(this.score >= this.difenArray.length) this.score = this.difenArray.length-1;
      this.text_score.setString(this.difenArray[this.score]);
      this.item_ops['score'] = this.difenArray[this.score];
    },

    earseScore:function () {
      this.score--;
      if(this.score <0) this.score = 0;
      this.text_score.setString(this.difenArray[this.score]);
      this.item_ops['score'] = this.difenArray[this.score];
    },

    onToggle:function () {
      var index = this['index'];
      var _this = this['this'];
      var array = this['array'];
      var key = this['itemKey'];
      var value = this['itemValue'];
      var callBack = this['callBack'];

      _this.item_ops[key] = value;
      for(var i=0; i< array.length ;i++)
      {
        array[i].setTouchEnabled(i != index);
        array[i]._checkBox.setSelected(i == index);
      }
      if(callBack) callBack(index);
    },

    onSwitch:function () {
      var index = this['index'];
      var _this = this['this'];
      var array = this['array'];
      var key = this['itemKey'];
      var value = this['itemValue'];
      for(var i=0; i< array.length ;i++)
      {
        if(i == index)
        {
          array[i]._checkBox.setSelected(!array[i]._checkBox.isSelected());
          _this.item_ops[key] = array[i]._checkBox.isSelected()?value:0;
        }else
        {
          array[i]._checkBox.setSelected(false);
        }
      }
      if(key == "fufei") {
        var cost = {"2": 13, "3": 18, "4": 25, "5": 32, "6": 40}
        var aa = 8;
        for(var i = 0;i<_this.panel_rounds.length;i++)
        {
          if(_this.item_ops.fufei == 1 )
          {
            _this.panel_rounds[i]._labelNum.setString(aa*(i+1));
          }else
          {
            _this.panel_rounds[i]._labelNum.setString(cost[_this.item_ops.person]*(i+1));
          }
          _this.panel_rounds[i]._labelNum.setContentSize(_this.panel_rounds[i]._labelNum.getVirtualRendererSize());
        }
      }
    },

    onSwitchSelect:function () {
      var _this = this['this'];
      var checkBox = this['checkBox'];
      var key = this['itemKey'];
      checkBox.setSelected(!checkBox.isSelected());
      _this.item_ops[key] = checkBox.isSelected()?1:0;
    },

    showPanel:function()
    {
      cc.director.getRunningScene().addChild(this);
    },

    recordNewConfig: function () {
      for(var key in this.item_ops)
      {
        util.setCacheItem('config_'+key, this.item_ops[key]);
      }
      util.setCacheItem('config_gameindex', this.gameIndex);
    },

    onCreateRoom:function()
    {
      this.btn_create.setTouchEnabled(false);
      var roomData = {};
      roomData['tableName'] = "xueZhan";
      roomData['uid'] = hall.user.uid;
      roomData['rounds'] = this.item_ops.round;
      roomData['aaGem'] = this.item_ops.fufei;
      roomData['person'] = 4;
      roomData['diScore'] = this.item_ops['score'];
      if(this.gameIndex == 0)
      {
        roomData['paiChuTime'] = this.item_ops.paiChuTime;
        roomData['fengDing'] = this.item_ops.fengDing;
        roomData['wanFa1'] = this.item_ops.wanFa1;
        roomData['wanFa2'] = this.item_ops.wanFa2;
        roomData['huanSan'] = this.item_ops.huanSan;
        roomData['tianDi'] = this.item_ops.tianDi;
        roomData['one9'] = this.item_ops.one9;
        roomData['menQing'] = this.item_ops.menQing;
        roomData['dianPao'] = this.item_ops.dianPao;
        roomData['duiHu'] = this.item_ops.duiHu;
      }

      JJLog.print('创建='+JSON.stringify(roomData));

      this.recordNewConfig();
      hall.createPrivate(XueZhanMajhong.appId,roomData,function(data){
        this.btn_create.setTouchEnabled(true);
        if(data["code"]== 200)
        {
          hall.enter(XueZhanMajhong.appId);
        }else
        {
          var dialog = new JJConfirmDialog();
          dialog.setDes(data['error']);
          dialog.showDialog();
        }
      }.bind(this));

    },


    onCreateOtherRoom:function()
    {
      this.btn_createOther.setTouchEnabled(false);

      var roomData = {};
      roomData['tableName'] = "xueZhan";
      roomData['uid'] = hall.user.uid;
      roomData['rounds'] = this.item_ops.round;
      roomData['aaGem'] = this.item_ops.fufei;
      roomData['person'] = 4;
      roomData['diScore'] = this.item_ops['score'];
      if(this.gameIndex == 0)
      {
        roomData['paiChuTime'] = this.item_ops.paiChuTime;
        roomData['fengDing'] = this.item_ops.fengDing;
        roomData['wanFa1'] = this.item_ops.wanFa1;
        roomData['wanFa2'] = this.item_ops.wanFa2;
        roomData['huanSan'] = this.item_ops.huanSan;
        roomData['tianDi'] = this.item_ops.tianDi;
        roomData['one9'] = this.item_ops.one9;
        roomData['menQing'] = this.item_ops.menQing;
        roomData['dianPao'] = this.item_ops.dianPao;
        roomData['duiHu'] = this.item_ops.duiHu;
      }


      JJLog.print('创建='+JSON.stringify(roomData));

      this.recordNewConfig();
      hall.reCreatePrivate(XueZhanMajhong.appId,roomData,function(data){
        this.btn_createOther.setTouchEnabled(true);
        if(data["code"]== 200)
        {
          this.removeFromParent();
          var dialog = new  XueZhanOtherRoomPanel();
          dialog.showPanel();
        }else
        {
          var dialog = new JJConfirmDialog();
          dialog.setDes(data['error']);
          dialog.showDialog();
        }
      }.bind(this));
    }

  });

  var XueZhanActivityLayer = JJDialog.extend({
    ctor: function () {
      this._super();
      var root = ccs.load(XueZhanMajhongJson.Activity).node;
      this.addChild(root);
      var btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
      btn_back.addClickEventListener(function () {
        this.removeFromParent();
      }.bind(this));
      var btn_agent = ccui.helper.seekWidgetByName(root,"btn_agent");
      btn_agent.addClickEventListener(this.onActivity.bind(this));
      btn_agent.setVisible(true);
      if (hall.user.vipLevel >= 20)
        btn_agent.setVisible(true);
    },
    onActivity: function () {
      var uid = hall.user.uid;
      var Url = "http://mall.yiqigame.me/applyagent.html?a=1&token=ad34324davdsa&i=" + uid + PackageURLTYPE[GAMENAME];
      cc.sys.openURL(Url);
    },

    showPanel:function()
    {
      cc.director.getRunningScene().addChild(this);
    },

  });

  var XueZhanOtherRoomPanel = cc.Layer.extend({
    listview_session:null,
    btn_back:null,
    panel_session_cell:null,
    text_gotoplay:null,
    listArry:null,

    ctor:function()
    {
      this._super();
      var root = ccs.load(XueZhanMajhongJson.OtherRoom).node;
      this.addChild(root);

      this.listArry = new Array();

      this.listview_session = ccui.helper.seekWidgetByName(root,"listview_session");
      this.btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
      this.btn_back.addClickEventListener(function () {
        this.removeFromParent();
      }.bind(this));

      this.panel_session_cell = ccui.helper.seekWidgetByName(root,"panel_session_cell");
      this.text_gotoplay = ccui.helper.seekWidgetByName(root,"text_gotoplay");
      this.text_gotoplay.setVisible(false);
      this.panel_session_cell.setVisible(false);

      var btn_history= ccui.helper.seekWidgetByName(root,"btn_history");
      btn_history.addClickEventListener(function () {
        var history = new XueZhanOtherRoomHistory();
        history.showHistory();
        this.removeFromParent();
      }.bind(this));
    },

    onEnter: function () {
      this._super();

      this.showListSession();
    },

    showListSession: function () {

      this.listview_session.setVisible(true);
      var _this = this;

      hall.net.reCreateTables({'uid':hall.user.uid},function(data) {
        JJLog.print('获取代开房间列表!=' + JSON.stringify(data));
        if(data['code'] == 200)
        {
          _this.listArry.splice(0, _this.listArry.length);
          // JJLog.print(JSON.stringify(data));
          var roomList = data['reTables'];
          _this.text_gotoplay.setVisible(roomList.length == 0);
          for(var i = 0 ; i < roomList.length;i++)
          {
            var cellData = roomList[i];
            var fanghao = cellData['tableId'];
            var person = cellData['playerCount'];
            var wanfa = cellData['tableType'];
            if(wanfa.indexOf("qidong") != -1)
            {
              cellData['person']= 4;
            }

            var cell = _this.panel_session_cell.clone();
            cell.setTouchEnabled(true);

            var layout = new ccui.Layout();
            layout.setContentSize(cell.getContentSize());
            layout.addChild(cell);

            layout.roomid = cellData['tableId'];

            var text_room_id = ccui.helper.seekWidgetByName(cell,"text_room_id");
            text_room_id.setString(fanghao);
            var text_room_person = ccui.helper.seekWidgetByName(cell,"text_room_person");
            text_room_person.setString(person +"/" + cellData['person']);
            var text_room_wanfa = ccui.helper.seekWidgetByName(cell,"text_room_wanfa");

            var text_room_other = ccui.helper.seekWidgetByName(cell,"text_room_other");

            text_room_wanfa.setString(GAMENAMES[wanfa]);
            var desc = "";
            if(wanfa == "quanzhou")
            {
              desc = _this.getTableDes(cellData);
            }else if(wanfa == "yongchun")
            {
              desc = _this.getYCTableDes(cellData);
            }
            else if(wanfa == "shisanshui")
            {
              desc = _this.getSSSTableDes(cellData);
              if(GAMENAME == "xyshisanshui")
              {
                text_room_wanfa.setString(_this.getXYSSSTableTitle(cellData));
              }else
              {
                text_room_wanfa.setString(_this.getSSSTableTitle(cellData));
                cellData["gameName"] =_this.getSSSTableTitle(cellData);
              }

            }else if(wanfa == "qidongbd")
            {
              desc = _this.getBDTableDes(cellData);

            }else if(wanfa == "qidong")
            {
              desc = _this.getQDTableDes(cellData);

            }
            text_room_other.setString(desc);

            var btn_inwaite = ccui.helper.seekWidgetByName(cell,"btn_inwaite");

            var inviteData =cellData;
            btn_inwaite.addClickEventListener(function () {
              JJLog.print('click it');
              var tmpData = this;
              if(tmpData["tableType"]=="quanzhou")
              {
                _this.onInvite(tmpData);
              }else if(tmpData["tableType"]=="yongchun")
              {
                _this.onYCInvite(tmpData);
              }
              else if(tmpData["tableType"]=="shisanshui")
              {
                _this.onSSSInvite(tmpData);
              }
              else if(tmpData["tableType"]=="qidongbd")
              {
                _this.onBDInvite(tmpData);
              }
              else if(tmpData["tableType"]=="qidong")
              {
                _this.onQDInvite(tmpData);
              }
            }.bind(inviteData));

            var btn_dissolve = ccui.helper.seekWidgetByName(cell,"btn_dissolve");

            var deledeData =cellData;
            btn_dissolve.addClickEventListener(function () {
              var tmpData = this;
              _this.ondeleteRoom(tmpData);
            }.bind(deledeData));

            if(!cc.sys.isNative) {
              var color = {r: 135, g: 82, b: 54};
              text_room_id.setTextColor(color);
              text_room_person.setTextColor(color);
              text_room_other.setTextColor(color);
              text_room_wanfa.setTextColor(color);
            }
            cell.x = 0;
            cell.y = 0;
            cell.setVisible(true);

            _this.listArry.push(layout);
            _this.listview_session.pushBackCustomItem(layout);
          }
        }

      });
    },




    ondeleteRoom: function (data) {

      var _this =this;

      var temp = {};
      temp['tableId'] =data['tableId'];

      hall.deleteRePrivate(GAMETYPES[data["tableType"]],temp,function(data){
        JJLog.print('删除房间回调!=' + JSON.stringify(data));
        if(data["code"]== 200)
        {
          _this.removefromlist(temp['tableId']);
        }else
        {
          var dialog = new JJConfirmDialog();
          dialog.setDes(data['error']);
          dialog.showDialog();
        }
      });

    },

    onInvite: function (data) {
      var desc =this.getTableDes(data) ;
      JJLog.print('邀请房号=' + data['tableId']  +'描述=' + desc);
      hall.net.wxShareURL('泉州麻将,房号:'+ data['tableId'] , desc, 0);
    },


    onYCInvite: function (data) {
      var desc = this.getYCTableDes(data) ;
      hall.net.wxShareURL('永春麻将,房号:'+ data['tableId'] , desc, 0);
    },

    onSSSInvite: function (data) {
      var desc = this.getSSSTableDes(data) ;
      if(data["gameName"]!= null && data["gameName"]!= undefined)
        desc ="代开:"+data["gameName"]+" "+desc;
      hall.net.wxShareURL(PackageNames[GAMENAME]+',房号:'+ data['tableId'] , desc, 0);
    },
    onBDInvite: function (data) {
      var desc = this.getBDTableDes(data) ;
      hall.net.wxShareURL('启东百搭'+',房号:'+ data['tableId'] , desc, 0);
    },
    onQDInvite: function (data) {
      var desc = this.getBDTableDes(data) ;
      hall.net.wxShareURL('启东敲麻'+',房号:'+ data['tableId'] , desc, 0);
    },
    removefromlist:function(roomid)
    {
      for(var i=0;i< this.listArry.length;i++)
      {
        if(roomid == this.listArry[i].roomid)
        {
          this.listArry[i].removeFromParent();
          this.listArry.splice(i, 1);
          break;
        }
      }
    },


    getTableDes:function (data) {
      var str = '';
      if(data['oneKe'] > 0 )
      {
        str = '1课 ';

      }else
      {
        str = data['rounds']+'局(4倍积分) ';
      }

      str += data['person']+"人 ";


      str +='游金X'+ data['youJin'];


      if(data['jinTwo']> 0)
      {
        str +=' 双金不平胡';
      }

      return str;
    },

    getYCTableDes:function (data) {
      var str = data['rounds']+'局 ';
      str += data['person']+"人 ";
      if(data['isPlayType'] == 1)
      {
        str +='三游场';
      }else
      {
        str +='五游场';
      }
      return str;
    },

    getXYSSSTableTitle:function(data){
      var str = '';
      var ishavebanker =data['banker'];
      var area = data['area'];
      if(area == "sx")
      {
        str = "罗松十三道";
      }else if(area == "nb")
      {
        str = "宁波十三道";
      }else
      {
        if(ishavebanker == 1)
        {
          str = "坐庄十三水";
        }else
        {
          str = "经典十三水";
        }
      }
      return str;
    },

    getSSSTableTitle:function(data)
    {

      var str = '';

      var person = data['person'];
      var duose = data['duose'];
      var ishavebanker =data['banker'];
      var aaGem  = data['aaGem'];
      var mode = data['mode'];
      var  wanfa = data['wanFa'];

      if(duose==0 )
      {
        str = "经典十三水";

      }else if(duose == 3)
      {
        str = "加一色十三水";
      }else if(duose== 1 )
      {
        if(person == 5)
        {
          str = "经典十三水";
        }else
        {
          str = "加一色十三水";
        }

      }
      else if(duose== 2 )
      {
        if(person == 6)
        {
          str = "经典十三水";
        }else
        {
          str = "加一色十三水";
        }
      }
      if (ishavebanker > 0)
      {
        str = '坐庄十三水';
      }

      if(wanfa == 1)
      {
        str = '加三张十三水';
      }else if(wanfa == 2)
      {
        str = '减一色十三水';
      }

      return str;

    },
    getSSSTableDes:function (data) {
      var str = '';

      var person = data['person'];
      var duose = data['duose'];
      var aaGem  = data['aaGem'];
      var mode = data['mode'];
      var isMa = data['isMa'];
      var ishavebanker =data['banker'];
      var bei = data['bei'];
      var wanfa = data['wanFa'];
      var chongSan = data['chongSan'];

      str += data['person']+"人 ";

      str += data['rounds']+'局 ';

      if(isMa > 0 )
      {
        str += '带马 ';
      }

      if (ishavebanker > 0)
      {
        if(wanfa == 1)
        {
          str = ' 加三张 ';
        }else if(wanfa == 2)
        {
          str = ' 减一色 ';
        }else if(duose>0)
        {
          str = ' 加一色 ';
        }

        if(bei > 0)
        {
          str +=  bei +'倍';
        }
      }

      if(mode == 1)
      {
        str += ' 普通模式';
      }else if(mode == 2)
      {
        str += ' 高分模式';
      }

      if(chongSan == 1)
        str += " 冲三";

      return str;
    },

    getQDTableDes:function (data) {
      var str = data['rounds']+'局 ';
      if(data['jia'] == 1)
      {
        str +='胡卡 ';
      }
      if(data['diScore'] == 1)
      {
        str +='底花X1 ';
      }
      if(data['niao'] == 1)
      {
        str +='飞苍蝇X1 ';
      }
      if(data['aaGem'] == 1)
      {
        str +='AA支付';
      }else
      {
        str +='房主支付';
      }
      return str;
    },

    getBDTableDes:function (data) {
      var str = data['rounds']+'局 ';
      str += (data['laZi']+1)+"番 ";
      if(data['isSBL'] == 1)
      {
        str +='双百佬 ';
      }else
      {
        str +='单百佬 ';
      }
      if(data['isMaiZhuang"'] == 1)
      {
        str +='买庄 ';
      }
      if(data['isHuangDaoDi'] == 1)
      {
        str +='一荒到底 ';
      }
      if(data['isQiDui'] == 1)
      {
        str +='七对胡 ';
      }
      if(data['aaGem'] == 1)
      {
        str +='AA支付';
      }else
      {
        str +='房主支付';
      }
      return str;
    },

    showPanel:function()
    {
      cc.director.getRunningScene().addChild(this,1000);
    }


  });

  var XueZhanOtherRoomHistory = cc.Layer.extend({
    listview_session:null,
    listview_round:null,
    btn_back:null,
    panel_session_cell:null,
    panel_round_cell:null,
    panel_list:null,
    panel_round:null,
    loaded:false,
    text_gotoplay:null,
    ctor:function()
    {
      this._super();
      var root = ccs.load(XueZhanMajhongJson.OtherRoomHistory).node;
      this.addChild(root);
      this.panel_list = ccui.helper.seekWidgetByName(root,"panel_list");
      this.panel_list.setVisible(true);
      this.panel_round = ccui.helper.seekWidgetByName(root,"panel_round");
      this.panel_round.setVisible(false);
      this.listview_session = ccui.helper.seekWidgetByName(root,"listview_session");
      this.listview_round = ccui.helper.seekWidgetByName(root,"listview_round");
      this.listview_round.setVisible(false);
      this.btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
      this.btn_back.addClickEventListener(function () {
        if(this.listview_round.isVisible())
        {
          this.showListSession();
        }else
        {
          this.removeFromParent();
        }
      }.bind(this));

      this.panel_session_cell = ccui.helper.seekWidgetByName(root,"panel_session_cell");
      this.panel_round_cell = ccui.helper.seekWidgetByName(root,"panel_round_cell");
      this.text_gotoplay = ccui.helper.seekWidgetByName(root,"text_gotoplay");
      this.text_gotoplay.setVisible(false);
      this.panel_round_cell.setVisible(false);
      this.panel_session_cell.setVisible(false);
    },

    onEnter: function () {
      this._super();

      this.showListSession();
    },


    showListRound: function (roundData) {
      this.panel_list.setVisible(false);
      this.panel_round.setVisible(true);
      this.listview_round.removeAllChildren();
      this.listview_round.setVisible(true);
      this.listview_session.setVisible(false);
      var resultList = roundData['data'];
      var serverType = roundData['serverType'];
      for(var i = 0;i<resultList.length;i++)
      {
        var result = resultList[i];
        var cell = this.panel_round_cell.clone();
        var btn_view =  ccui.helper.seekWidgetByName(cell,"btn_view");
        var btn_share =  ccui.helper.seekWidgetByName(cell,"btn_share");
        var info = {};
        info['recordId'] = result['num'];
        btn_share.addClickEventListener(function () {
          var recordId = this['recordId'];
          hall.net.wxShareURL(GAMENAMES[serverType],'玩家['+base64.decode(hall.user.nickName) + ']分享了一个回访码:'+recordId+'在大厅点击进入战绩页面然后点击查看他人回放输入回访码.', 0);

        }.bind(info));
        btn_view.addClickEventListener(function () {

          MajhongLoading.show('加载中...');
          var recordId = this['recordId'];
          hall.net.getHuiFangInfo(recordId,
              function(data)
              {
                JJLog.print("回放数据="+ JSON.stringify(data));
                if(data['code'] == 200)
                {
                  hall.enterRecord(GAMETYPES[data['serverType']],data['record']);
                }else{
                  MajhongLoading.dismiss();
                  var dialog = new JJConfirmDialog();
                  dialog.setDes(data['err']);
                  dialog.showDialog();
                }

              });

        }.bind(info));
        var layout = new ccui.Layout();
        layout.setContentSize(cell.getContentSize());
        layout.addChild(cell);

        var text_id =  ccui.helper.seekWidgetByName(cell,"text_order");
        text_id.setString(i+1);
        var text_time =  ccui.helper.seekWidgetByName(cell,"text_room_time");
        var _time = result['time'];
        _time = result['time'].match(/\d{1,2}\:\d{1,2}\:\d{1,2}/);
        text_time.setString(_time);

        var values = result['result'];
        for(var j = 0;j < values.length;j++)
        {
          var text_players = ccui.helper.seekWidgetByName(cell,"text_player"+j);
          text_players.setString(base64.decode(values[j]['userName']));
          text_players.setVisible(true);
          var score = ccui.helper.seekWidgetByName(cell,"text_score"+j);
          score.setString(values[j]['winScore']);
          score.setVisible(true);
          var img_scores =  ccui.helper.seekWidgetByName(cell,"img_scores"+j);
          if(img_scores != null)
          {
            img_scores.setVisible(true);
          }
        }

        cell.x = 0;
        cell.y = 0;
        cell.setVisible(true);

        this.listview_round.pushBackCustomItem(layout);
      }

    },

    showListSession: function () {
      this.panel_list.setVisible(true);
      this.panel_round.setVisible(false);
      this.listview_round.setVisible(false);
      this.listview_session.setVisible(true);
      var _this = this;
      if(this.loaded) return;
      hall.net.reCreateTables({'uid':hall.user.uid,type:2},function (data) {
        JJLog.print('get record!' + JSON.stringify(data));
        var recordList = data['record'];
        _this.text_gotoplay.setVisible(recordList.length == 0);
        for(var i = 0 ; i < recordList.length;i++)
        {
          var cellData = recordList[i];
          var fanghao = cellData['fangHao'];
          var id = cellData['id'];

          var resultArr = cellData['lastResult'];
          var cell = _this.panel_session_cell.clone();
          cell.setTouchEnabled(true);
          var childData ={};
          childData['data'] = cellData['record'];
          childData['serverType'] = cellData['serverType'];
          cell.addClickEventListener(function () {
            _this.showListRound(this);
          }.bind(childData));

          var layout = new ccui.Layout();
          layout.setContentSize(cell.getContentSize());
          layout.addChild(cell);
          var text_order = ccui.helper.seekWidgetByName(cell,"text_order");
          text_order.setString(i+1);
          var text_room_id = ccui.helper.seekWidgetByName(cell,"text_room_id");
          text_room_id.setString(fanghao+'号房间');
          var text_gameName = ccui.helper.seekWidgetByName(cell,"text_gameName");
          text_gameName.setString(GAMENAMES[cellData["serverType"]]);
          var text_room_time = ccui.helper.seekWidgetByName(cell,"text_room_time");
          text_room_time.setString(cellData['recordTime']);

          for(var j = 0; j < resultArr.length;j++)
          {
            var text_player = ccui.helper.seekWidgetByName(cell,"text_player"+j);
            var text_score = ccui.helper.seekWidgetByName(cell,"text_score"+j);
            var img_scores =  ccui.helper.seekWidgetByName(cell,"img_scores"+j);
            if(img_scores != null)
            {
              img_scores.setVisible(true);
            }
            text_player.setString(base64.decode(resultArr[j]['nickName']));
            text_score.setString(resultArr[j]['coinNum']);
            text_score.setVisible(true);
            text_player.setVisible(true);
          }

          cell.x = 0;
          cell.y = 0;
          cell.setVisible(true);

          _this.listview_session.pushBackCustomItem(layout);
        }
        _this.loaded = true;
      });
    },

    showHistory:function()
    {
      cc.director.getRunningScene().addChild(this,1000);
    },
  });

} else
{
  var MajhongHall = cc.Layer.extend({
    text_name:null,
    text_id:null,
    text_fangka:null,
    image_head:null,
    panel_fangka:null,

    image_msg_red:null,
    btn_help:null,
    btn_setup:null,
    btn_zhanji:null,
    btn_share:null,
    btn_fangka:null,
    sprite_head:null,
    image_frame:null,
    btn_realname:null,
    btn_otherRoom:null,
    ctor: function () {JJLog.print("进入泉州大厅" +GAMENAME);
      this._super();
      var root = ccs.load(GameHallJson.Hall).node;
      this.addChild(root);
      this.text_name = ccui.helper.seekWidgetByName(root,"text_name");
      this.text_id = ccui.helper.seekWidgetByName(root,"text_id");
      this.text_fangka = ccui.helper.seekWidgetByName(root,"text_fangka");
      this.text_fangka.setString(hall.user.gemNum);

      this.image_frame = ccui.helper.seekWidgetByName(root,"image_frame");
      this.image_frame.setTouchEnabled(true);
      this.image_frame.addClickEventListener(this.onPlayerInfo.bind(this));
      this.sprite_head = ccui.helper.seekWidgetByName(root,"sprite_head");

      this.panel_fangka = ccui.helper.seekWidgetByName(root,"panel_fangka");
      this.panel_fangka.addClickEventListener(this.onAddFangka.bind(this));
      this.image_msg_red = ccui.helper.seekWidgetByName(root,"image_msg_red");

      this.btn_help = ccui.helper.seekWidgetByName(root,"btn_help");
      this.btn_help.addClickEventListener(this.onHelp.bind(this));

      this.btn_setup = ccui.helper.seekWidgetByName(root,"btn_setup");
      this.btn_setup.addClickEventListener(this.onSetup.bind(this));

      this.btn_zhanji = ccui.helper.seekWidgetByName(root,"btn_zhanji");
      this.btn_zhanji.addClickEventListener(this.onZhanji.bind(this));

      this.btn_share = ccui.helper.seekWidgetByName(root,"btn_share");
      this.btn_share.addClickEventListener(this.onShare.bind(this));
      this.btn_msg = ccui.helper.seekWidgetByName(root,"btn_msg");
      this.btn_msg.addClickEventListener(this.onMsg.bind(this));

      var img_shareaward = ccui.helper.seekWidgetByName(root,"img_shareaward");
      var act1 = cc.scaleTo(0.8,0.9);
      var act2 = cc.scaleTo(0.8,1);
      var act3 = cc.sequence(act1, act2);
      var act4 = act3.repeatForever();
      img_shareaward.runAction(act4);
      var btn_create = ccui.helper.seekWidgetByName(root,"btn_create");
      btn_create.addClickEventListener(this.onCreateGame.bind(this));

      var btn_join = ccui.helper.seekWidgetByName(root,"btn_join");
      btn_join.addClickEventListener(this.onJoinGame.bind(this));

      this.btn_fangka = ccui.helper.seekWidgetByName(root,"btn_fangka");
      this.btn_fangka.addClickEventListener(this.onFangka.bind(this));
      var btn_kefu = ccui.helper.seekWidgetByName(root,"btn_kefu");
      btn_kefu.addClickEventListener(this.onAddFangka.bind(this));
      if (hall.user.vipLevel < 10)
        this.btn_fangka.setVisible(false);
      this.btn_realname = ccui.helper.seekWidgetByName(root,"btn_realname");
      this.btn_realname.addClickEventListener(this.onRealName.bind(this));

      this.btn_otherRoom = ccui.helper.seekWidgetByName(root,"btn_otherroom");
      this.btn_otherRoom.addClickEventListener(this.onotherRoom.bind(this));

    },

    onEnter: function () {
      this._super();
      //sound.stopBgSound();
      sound.playBgSound();
      sound.stopEffect();

      this.updateInfo();
      this.registerAllEvents();

      if (hall.songshen != 1) {
        var notice = new MajhongNotice();
        notice.setVisible(false);
        this.addChild(notice);
      }else
      {
        if(cc.sys.os == cc.sys.OS_ANDROID)
        {
          this.panel_fangka.setVisible(false);
        }
        this.btn_share.setVisible(false);
        this.btn_realname.setVisible(false);
        this.btn_zhanji.setVisible(false);
        this.btn_msg.setVisible(false);
      };

      if (hall.mustUpdate) {
        MajhongLoading.dismiss();
        var dialog = new JJConfirmDialog();
        dialog.setDes('发现新版本，前去下载更新！');
        dialog.setCallback(function () {
          cc.sys.openURL(hall.updateUrl);
        });
        this.addChild(dialog,100);
      }
    },

    onExit: function () {
      this._super();
      this.removeAllEvents();
      this.releaseAllItem();
    },

    releaseAllItem: function () {
      this.text_name = null;
      this.text_id = null;
      this.text_fangka = null;
      this.panel_fangka = null;
      this.image_msg_red = null;
      this.btn_help = null;
      this.btn_setup = null;
      this.btn_share = null;
      this.sprite_head = null;
      this.image_frame = null;
      this.text_name = null;
      this.btn_realname = null;


    },

    registerAllEvents: function () {
      qp.event.listen(this, 'hallUpdatePlayerAttr', this.onUpdatePlayerAttr.bind(this));
    },
    removeAllEvents: function () {
      qp.event.stop(this, 'hallUpdatePlayerAttr');
      // qp.event.stop(this, 'disconnected');
    },
    onUpdatePlayerAttr: function (data) {
      JJLog.print('hall onUpdatePlayerAttr');
      JJLog.print(data);

      if(data['gemNum'] != null || data['gemNum']  != undefined)
      {
        this.text_fangka.setString(data['gemNum']);
      }

    },

    showHall: function () {
      hall.inRoom = false;
      var scene = new cc.Scene();
      scene.addChild(this);
      if(cc.sys.isNative)
      {
        cc.director.replaceScene(scene);
      }else
      {
        cc.director.runScene(scene);
      }

    },

    updateInfo: function () {
      this.updateHead();
      this.updateName();
    },

    updateName: function () {
      if(hall.user["nickName"].length > 0)
      {
        if(cc.sys.isNative)
        {
          var nickName = base64.decode(hall.user["nickName"]);
          this.text_name.setString(nickName);
        }else
        {
          this.text_name.setString(base64.decode(hall.user["nickName"]));
        }

//          this.text_name.setString("状状 😘 😌");
//;
//        var name = '一个大宝剑峡';
//        this.text_name.setString(sliceName(name));


      }else
      {
        this.text_name.setString(hall.user["nickName"]);
      }

      this.text_id.setString('ID: '+hall.user['uid']);

    },


    updateHead: function () {
      var _this = this;
      if (hall.user.headUrl != undefined && hall.user.headUrl.length > 0) {
        if(hall.user.headUrl.substring(hall.user.headUrl.length-1,hall.user.headUrl.length) == "0")
        {
          hall.user.headUrl = hall.user.headUrl.substring(0,hall.user.headUrl.length-1)+"96";
        }
        cc.loader.loadImg(hall.user.headUrl,{isCrossOrigin : true },
            function (err, tex) {
              JJLog.print(err);
              if (err == null && _this.sprite_head != null) {
                var size = _this.sprite_head.getContentSize();
                var sprite = new cc.Sprite(tex);
                var size_sp = sprite.getContentSize();
                sprite.setScaleX(size.width/size_sp.width);
                sprite.setScaleY(size.height/size_sp.height);
                sprite.setAnchorPoint(cc.p(0, 0));
                _this.sprite_head.addChild(sprite);

                util.cacheImage(hall.user.headUrl, tex);
              }
            }.bind(this));
      } else {
        //if(hall.user['userSex'] == 2)
        //{
        //  this.image_head.loadTexture(CommonRes.FEMALE,ccui.Widget.PLIST_TEXTURE);
        //
        //}else
        //{
        //  this.image_head.loadTexture(CommonRes.FEMALE,ccui.Widget.PLIST_TEXTURE);
        //}
      }
    },

    onPlayerInfo: function () {
      var dialog = new PlayerInfoDialog(hall.user);
      dialog.showDialog();
    },

    onCreateGame: function () {
      sound.playBtnSound();
      var panel = new CreateRoom();
      panel.showPanel();
    },

    onJoinGame: function () {
      sound.playBtnSound();
      var panel = new InputRoomPanel();
      panel.showPanel();
    },

    onFeedBack: function () {

    },

    onFangka:function()
    {
      var dialog = new JJGiveRoomCard();
      dialog.showDialog();
    },

    onAddFangka:function()
    {
      if(hall.songshen == 1)
      {
        sound.playBtnSound();
        var recharge = new MajhongRecharge();
        recharge.showPanel();
      }else
      {
        var dialog = new AddFKDialog();
        dialog.showDialog();
      }
    },

    onRealName:function()
    {
      sound.playBtnSound();
      var dialog = new JJRealName();
      dialog.showDialog();
    },

    onotherRoom:function()
    {
      sound.playBtnSound();
      var dialog = new MajhongOtherRoomPanel();
      dialog.showPanel();
    },

    onHelp: function () {
      sound.playBtnSound();
      var msg = new MajhongHallHelp();
      msg.showHelp();
    },

    onSetup: function () {
      sound.playBtnSound();
      var set = new SetupDialog(0);
      set.showDialog();
    },

    onMsg: function () {
      sound.playBtnSound();
      var msg = new MajhongHallMessage();
      msg.showMsg();
    },

    onZhanji: function () {
      sound.playBtnSound();
      var history = new MajhongHistory();
      history.showHistory();
    },

    onShare: function () {
      sound.playBtnSound();
      var dialog = new JJShareDialog();
      dialog.showDialog();
    },


  });
}

var JJShareDialog = JJDialog.extend({
  _Listeners:[],
  sharetype :1,              //1是群  2是朋友圈
  agentCode:0,
  ctor: function (data) {
    this._super();
    var Json = GameHallJson.Share;
    if(GAMENAME.indexOf("qidong") != -1)
    {
      Json = QDMajhongJson.Share;
      if(data.code == 200)
        this.agentCode =  data['agentId'];
    }

    var root = ccs.load(Json).node;
    this.addChild(root);
    var panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
    var _this = this;
    panel_root.addClickEventListener(function () {
      _this.dismissDialog();
    });
    var btn_friendgrounps = ccui.helper.seekWidgetByName(root,"btn_friendgrounps");
    btn_friendgrounps.addClickEventListener(this.onShareGroup.bind(this));
    var btn_friendmoments = ccui.helper.seekWidgetByName(root,"btn_friendmoments");
    btn_friendmoments.addClickEventListener(this.onShareMoments.bind(this));

    if(GAMENAME.indexOf("qidong") != -1)
    {
        var btn_close = ccui.helper.seekWidgetByName(root,"btn_close");
        btn_close.addClickEventListener(function () {
          this.dismissDialog();
        }.bind(this));
    }


    var img_award = ccui.helper.seekWidgetByName(root,"img_award1");
    var act1 = cc.scaleTo(0.8,0.9);
    var act2 = cc.scaleTo(0.8,1);
    var act3 = cc.sequence(act1, act2);
    var act4 = act3.repeatForever();
    img_award.runAction(act4);
  },
  onEnter: function ()
  {
    this._super();
    var ls = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      eventName: CommonEvent.EVT_ShareCallback,
      callback: this.onShareRultCallback.bind(this)
    });
    var listener = cc.eventManager.addListener(ls,this);
    this._Listeners.push(listener);
  },
  onExit:function()
  {
    for(var i=0;i< this._Listeners.length;i++)
    {
      cc.eventManager.removeListener(this._Listeners[i]);
    }
    this._Listeners.splice(0,this._Listeners.length);

    this._super();
  },
  onShareGroup: function () {
    JJLog.print('分享到 朋友/群');
    this.sharetype = 1;
    if(this.agentCode > 0)
    {
      hall.net.wxShareURLWithAgentId("邀请码:"+this.agentCode, PackageAgentShare[GAMENAME],this.agentCode, 0);
    }else
    {
      hall.net.wxShareURL(PackageNames[GAMENAME], PackageShare[GAMENAME], 0);
    }
  },

  onShareMoments: function () {
    JJLog.print('分享到 朋友圈.');
    this.sharetype = 2;
    if(this.agentCode > 0)
    {
      hall.net.wxShareURLWithAgentId("邀请码:"+this.agentCode, PackageAgentShare[GAMENAME],this.agentCode, 1);
    }else
    {
      hall.net.wxShareURL(PackageShare[GAMENAME],PackageShare[GAMENAME], 1);
    }
  },

  onShareRultCallback:function(event)
  {
    var evt = event.getUserData();
    if(this.sharetype == 2)
    {
      if(evt ==  0 )
      {
        JJLog.print(" 发送服务器加房卡");
        hall.net.addShareAward(
            function(data)
            {
              JJLog.print("加房卡回调="+ JSON.stringify(data));
              if(data['code'] == 200)
              {
                var dialog = new JJConfirmDialog();
                dialog.setDes("获得钻石成功！");
                dialog.showDialog();
                this.dismissDialog();
              }else{

              }
            }.bind(this));
      }
    }

  }

});

var SSSAgentLayer = JJDialog.extend({
  ctor: function () {
    this._super();
    var root = ccs.load(SSSXYPokerJson.Agent).node;
    this.addChild(root);
    var btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
    btn_back.addClickEventListener(function () {
      this.removeFromParent();
    }.bind(this));
    var btn_agent = ccui.helper.seekWidgetByName(root,"btn_agent");
    btn_agent.addClickEventListener(this.onAgent.bind(this));
    btn_agent.setVisible(false);
    if(hall.user['agentCode'] == '0' || hall.user['agentCode']== null ||hall.user['agentCode']== undefined ||
        hall.user['agentCode']=='')
    {
      btn_agent.setVisible(true);
    }

  },

  onAgent: function () {
    var uid = hall.user.uid;
    var Url = "http://mall.yiqigame.me/applyagent.html?a=1&token=ad34324davdsa&i=" + uid + PackageURLTYPE[GAMENAME];
    JJLog.print('绑定地址=' + Url);
    cc.sys.openURL(Url);
  },

  showPanel:function()
  {
    cc.director.getRunningScene().addChild(this);
  },

});


var QDTipBar = cc.Layer.extend({

    _text:null,
    _tipBar:null,
    _time:0,
    _tip_y:null,
    ctor: function () {
        this._super();
        var root = ccs.load(QDMajhongJson.TipBarNotice).node;
        this.addChild(root);
        this._tipBar = ccui.helper.seekWidgetByName(root,"tipBar");
        this._text = ccui.helper.seekWidgetByName(root,"text_des");
    },

    onEnter: function () {
        this._super();
    },

    show:function (text,time) {
        cc.director.getRunningScene().addChild(this);
        if (this._time > 0) return;
        this._text.setString(text);
        var action = cc.moveTo(time, 640, 500);
        var callfunc = cc.callFunc(this.hideTime, this);
        var seq = cc.sequence(action, callfunc);
        this._tipBar.runAction(seq);
        this._time = time;

    },

    hideTime: function () {
        var self = this;
        this.scheduleOnce(function () {
            this.removeFromParent();
            self._time = 0;
        }, 0.2)
    }


});

var SSSActivityLayer = JJDialog.extend({
  ctor: function () {
    this._super();
    var root = ccs.load(SSSXYPokerJson.Activity).node;
    this.addChild(root);
    var btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
    btn_back.addClickEventListener(function () {
      this.removeFromParent();
    }.bind(this));
    var btn_agent = ccui.helper.seekWidgetByName(root,"btn_agent");
    btn_agent.addClickEventListener(this.onActivity.bind(this));
    btn_agent.setVisible(true);
    if (hall.user.vipLevel >= 20)
      btn_agent.setVisible(true);
  },
  onActivity: function () {
    var uid = hall.user.uid;
    var Url = "http://mall.yiqigame.me/applyagent.html?a=1&token=ad34324davdsa&i=" + uid + PackageURLTYPE[GAMENAME];
    cc.sys.openURL(Url);
  },

  showPanel:function()
  {
    cc.director.getRunningScene().addChild(this);
  },

});


