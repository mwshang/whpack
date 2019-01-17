/**
 * Created by atom on 2016/8/1.
 */
var SSSDeskHead  = cc.Layer.extend({
    playerData:null,
    text_name:null,
    text_score:null,
    panel_root:null,
    sprite_face:null,
    text_msg_left:null,
    text_msg_right:null,
    uid:null,
    sprite_banker:null,
    img_offline:null,
    sprite_speaker:null,
    isRight:false,
    text_msg:null,
    sprite_head:null,
    sprite_msg_right:null,
    sprite_msg_left:null,
    sprite_msg:null,
    sprite_bankerCount :null,
    text_bankerCount : null,
    btn_throw:null,
    img_chipin:null,
    text_chipin:null,
    isPutout:false,
    ctor:function(data){
        this._super();
        this.playerData = data;
        this.uid = data["uid"];
        var root = ccs.load(SSSPokerJson.Head).node;
        this.addChild(root);

        this.panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
        if(MajhongInfo.GameMode == GameMode.PLAY)
          this.panel_root.setTouchEnabled(true);
        this.panel_root.addClickEventListener(function () {
          var dialog = new SSSPlayerInfoDialog(data);
          dialog.showDialog();
        }.bind(this));
        this.setContentSize(this.panel_root.getContentSize());
        this.text_score = ccui.helper.seekWidgetByName(root,"text_score");
        this.img_offline = ccui.helper.seekWidgetByName(root,"img_offline");
        this.sprite_speaker = ccui.helper.seekWidgetByName(root,"sprite_speaker");
        this.sprite_speaker.setVisible(false);
        var status = data['isOffLine'];
        this.img_offline.setVisible(status == 1);
        this.text_score.setString(this.playerData["coinNum"]);
        this.text_name = ccui.helper.seekWidgetByName(root,"text_name");
        var str = base64.decode(this.playerData["nickName"]);
        if(str.length > 15)
        {
          str = str.slice(0,15);
        }

        this.text_name.setString(base64.decode(this.playerData["nickName"]));
        this.sprite_head = ccui.helper.seekWidgetByName(root,"sprite_head");

        var image_new = ccui.helper.seekWidgetByName(root,"image_new");
        if(data['playedTime'] < 50)
        {
            image_new.setVisible(true);
            image_new.runAction(cc.sequence(cc.scaleTo(0.3,0.7),cc.scaleTo(0.3,0.9)).repeatForever());
        }

        var _this = this;
        if (this.playerData.headUrl != undefined && this.playerData.headUrl.length > 0) {
            if(this.playerData.headUrl.substring(this.playerData.headUrl.length-1,this.playerData.headUrl.length) == "0")
            {
                this.playerData.headUrl = this.playerData.headUrl.substring(0,this.playerData.headUrl.length-1)+"96";
            }

            /*
            if (this.uid != hall.user.uid) {
                cc.loader.loadImg(this.playerData.headUrl,
                    function (err, tex) {
                        JJLog.print(err, tex);
                        JJLog.print('load head img');
                        if (err == null && tex != null) {
                            var size = _this.sprite_head.getContentSize();
                            var sprite = new cc.Sprite(tex);
                            var size_sp = sprite.getContentSize();
                            sprite.setScaleX(size.width/size_sp.width);
                            sprite.setScaleY(size.height/size_sp.height);
                            sprite.setAnchorPoint(cc.p(0, 0));
                            _this.sprite_head.addChild(sprite);

                            util.cacheImage(this.playerData.headUrl, tex);

                            JJLog.print('loaded head img and cached');
                        } else {
                            cc.loader.loadImg(this.playerData.headUrl,
                                function (err, tex) {
                                    JJLog.print(err, tex);
                                    JJLog.print('load head img1');
                                    if (err == null && tex != null) {
                                        var size = _this.sprite_head.getContentSize();
                                        var sprite = new cc.Sprite(tex);
                                        var size_sp = sprite.getContentSize();
                                        sprite.setScaleX(size.width/size_sp.width);
                                        sprite.setScaleY(size.height/size_sp.height);
                                        sprite.setAnchorPoint(cc.p(0, 0));
                                        _this.sprite_head.addChild(sprite);

                                        util.cacheImage(this.playerData.headUrl, tex);

                                        JJLog.print('loaded head img and cached1');
                                    } else {

                                    }
                                }.bind(this));
                        }
                    }.bind(this));
            } else {
                var tex = util.getTextureForKey(this.playerData.headUrl);
                if (tex != null && tex != undefined) {
                    JJLog.print('use cached head image');

                    var size = _this.sprite_head.getContentSize();
                    var sprite = new cc.Sprite(tex);
                    var size_sp = sprite.getContentSize();
                    sprite.setScaleX(size.width/size_sp.width);
                    sprite.setScaleY(size.height/size_sp.height);
                    sprite.setAnchorPoint(cc.p(0, 0));
                    _this.sprite_head.addChild(sprite);
                }else{
                    JJLog.print('cached head image load failed, and load again');

                    cc.loader.loadImg(this.playerData.headUrl,
                        function (err, tex) {
                            JJLog.print(err);
                            if (!!tex) {
                                var size = _this.sprite_head.getContentSize();
                                var sprite = new cc.Sprite(tex);
                                var size_sp = sprite.getContentSize();
                                sprite.setScaleX(size.width/size_sp.width);
                                sprite.setScaleY(size.height/size_sp.height);
                                sprite.setAnchorPoint(cc.p(0, 0));
                                _this.sprite_head.addChild(sprite);

                                util.cacheImage(this.playerData.headUrl, tex);
                                JJLog.print('cache head image');
                            }
                        }.bind(this));
                }
            }
            */
            util.LoadHead(_this.sprite_head ,this.playerData.headUrl);
        } else {
            //if(this.playerData["userSex"] == 2){//男
            //    this.image_head.setSpriteFrame(new cc.Sprite("#head_img_male.png").getSpriteFrame());
            //} else
            //{
            //    this.sprite_head.setSpriteFrame(new cc.Sprite("#head_img_female.png").getSpriteFrame());
            //}
        }
                                

        this.sprite_banker = ccui.helper.seekWidgetByName(root,"sprite_banker");
        this.sprite_banker.setVisible(false);
        this.sprite_face = ccui.helper.seekWidgetByName(root,"sprite_face");
        this.sprite_face.setVisible(false);
        this.text_msg_left = ccui.helper.seekWidgetByName(root,"text_msg_left");
        this.text_msg_right = ccui.helper.seekWidgetByName(root,"text_msg_right");
        this.sprite_msg_left = ccui.helper.seekWidgetByName(root,"sprite_msg_left");
        this.sprite_msg_right = ccui.helper.seekWidgetByName(root,"sprite_msg_right");

        this.sprite_msg_left.setVisible(false);
        this.sprite_msg_right.setVisible(false);
        this.text_msg_right.setVisible(false);
        this.text_msg_left.setVisible(false);
        this.text_msg = this.text_msg_left;
        this.sprite_msg = this.sprite_msg_left;

        this.btn_throw = ccui.helper.seekWidgetByName(root,"btn_throw");
        this.btn_throw.setVisible(false);
        this.btn_throw.addClickEventListener(function () {
            SSSPoker.net.throw({"uid":this.uid,type:0}, function(data) {
                if(data['code'] == 200)
                {
                    console.log('发送震动成功');
                }
            });
        }.bind(this));

        this.img_chipin = ccui.helper.seekWidgetByName(root,"img_chipin");
        this.text_chipin = ccui.helper.seekWidgetByName(root,"text_chipin");
        this.img_chipin.setVisible(false);

        if(this.uid > 999999 && SSSPoker.table.shuangJiang == 1)
            this.panel_root.setTouchEnabled(false);
    },

    onEnter: function () {
        this._super();
        this.registerAllEvents();

        var pos = this.panel_root.convertToWorldSpace(this.sprite_speaker.getPosition());

        var size = cc.director.getWinSize();
        if(pos.x < size.width*0.5)
        {
          size = this.panel_root.getContentSize();
          this.sprite_speaker.x = size.width + this.sprite_speaker.getContentSize().width*0.5 - 15;
          this.sprite_speaker.setFlippedX(true);
          this.sprite_head.setFlippedX(true);

          this.sprite_banker.x = size.width - 15;
          this.btn_throw.x = size.width + 43;
          this.img_offline.x = 30;
          this.isRight = true;
          this.text_msg = this.text_msg_right;
          this.sprite_face.x = size.width + 34;
          this.sprite_msg = this.sprite_msg_right;

        }
        //this.sprite_speaker.setVisible(true);
    },

    onExit:function(){
      this.removeAllEvents();
      this.releaseAllItem();
        this._super();

    },



    registerAllEvents: function () {
        //qp.event.listen(this, 'mjBankerResult', this.onBankerResult);
        qp.event.listen(this, 'mjGameStart', this.onGameStart.bind(this));
         qp.event.listen(this, 'mjGameResult', this.onGameResult.bind(this));
      qp.event.listen(this, 'mjPlayerOffLine', this.onLine.bind(this));
      qp.event.listen(this, 'imPlayVoice', this.onPlaySpeak.bind(this));
        qp.event.listen(this, 'mjThrowStatus', this.onGamethorw.bind(this));
        qp.event.listen(this, 'pkChipInStatus', this.onPkChipInStatus.bind(this));   //同步每个人下注信息
      //mjPlayerOffLine
    },

    onLine: function (data) {
      if(data['uid'] == this.uid)
      {
        JJLog.print(JSON.stringify(data));
        var status = data['status'];
        this.img_offline.setVisible(status == 1);
      }

    },

    onPlaySpeak: function (data) {
      JJLog.print('on play speak imPlayVoice');//{speaker: xxx, state: 0} 0: start 1: end -1: error
      JJLog.print(JSON.stringify(data));
      if (!this.sprite_speaker || this.sprite_speaker == undefined || this.sprite_speaker == null){
          //console.error("onPlaySpeak this.sprite_speaker = null??");
          return;
      }
      if (0 == data['state']){
        if (!!data['speaker'] && data['speaker'] == GAMENAME+this.uid){
          this.sprite_speaker.setVisible(true);
        }else
        {
          this.sprite_speaker.setVisible(false);
        }
      }else{
        this.sprite_speaker.setVisible(false);
      }

    },

    removeAllEvents: function () {
        //qp.event.stop(this, 'mjBankerResult');
        qp.event.stop(this, 'mjGameStart');
      qp.event.stop(this, 'mjGameResult');
      qp.event.stop(this, 'mjPlayerOffLine');
        qp.event.stop(this, 'imPlayVoice');
        qp.event.stop(this, 'mjThrowStatus');
        qp.event.stop(this, 'pkChipInStatus');
    },

    onGameStart:function(data)
    {
        JJLog.print(JSON.stringify(data));
        this.onBankerResult(data);
    },

  onGameResult: function (data) {
    var players = data['players'];
      this.isPutout = false;
      var delay = 5.5;

      for(var i = 0; i < players.length;i++)
      {
          var specail =players[i]['paiPut']['spe'];
          if(specail != undefined && specail !=null)
          {
              delay = 5.5;
              break;
          }
      }

      this.runAction(cc.sequence(
          cc.delayTime(delay),
          cc.callFunc(function ()
          {
              for(var i = 0; i < players.length;i++)
              {

                  var info = players[i];
                  if(this.uid == info['uid'])
                  {
                      this.text_score.setString(info["coinNum"]);
                      break;
                  }
              }

          }.bind(this))));



  },
    onGamethorw: function (data)
    {
        if(data['targetUid'] == this.uid)
        {
            var throwType = data['throwType'];
            if(throwType == 0)
            {
                if(this.uid ==hall.user.uid)
                {
                    if (cc.sys.isNative)
                    {
                        cc.Device.vibrate(0.4);
                    }
                }
            }
        }
    },
    onPkChipInStatus: function (data)
    {
        JJLog.print('通知每个人下注信息='+ JSON.stringify(data));
        if(data['uid'] == this.uid)
        {
            this.img_chipin.setVisible(true);
            this.text_chipin.setString(data['bei']);
        }
    },

    showPkChipInStatus:function(isshow)
    {
        this.img_chipin.setVisible(isshow);
    },

  setBanker: function (isBanker) {
    this.sprite_banker.setVisible(isBanker);
  },

    setBankerCount: function (data)
    {
        //var count = data["bankerCount"];
        //if(count > 1)
        //{
        //    this.sprite_bankerCount.setVisible(this.uid == data['banker']);
        //    this.text_bankerCount.setString(count);
        //}
    },

    setchipinCount:function(count)
    {
        if(count > 0)
        {
            this.img_chipin.setVisible(true);
            this.text_chipin.setString(count);
        }
    },
    setOffline: function (isOffline) {
    this.img_offline.setVisible(isOffline);
  },

    onBankerResult: function (data) {
        if(data["banker"] == this.uid)
        {
            this.sprite_banker.setVisible(true);
        }else
        {
            this.sprite_banker.setVisible(false);
        }
    },

    showFace:function(index)
    {
        if(index>0 && index < 64)
        {
            this.sprite_face.loadTexture("im"+index+".png",ccui.Widget.PLIST_TEXTURE);
            this.sprite_face.stopAllActions();
            this.sprite_face.setVisible(false);
            this.sprite_face.setOpacity(255);
            this.sprite_face.setScale(1.0);

            var face = this.sprite_face.clone();

            face.setVisible(true);
            var posText = this.sprite_face.getParent().convertToWorldSpace(this.sprite_face.getPosition());
            var scene = cc.director.getRunningScene();
            face.setPosition(posText);
            if(scene.getChildByTag(1003) != null) scene.removeChildByTag(1003,true);
            if(scene.getChildByTag(998) != null) scene.removeChildByTag(998,true);

            scene.addChild(face,1002,1003);

            face.stopAllActions();

            face.setOpacity(255);
            face.setScale(1.0);
            face.runAction(cc.sequence(
                cc.scaleTo(0.15,1.3),cc.scaleTo(0.1,1.1),cc.scaleTo(0.15,1.2),cc.scaleTo(0.1,1.0),
                cc.delayTime(2),cc.fadeOut(0.5)
                ,cc.removeSelf()
            ));

        }
    },

    showMsg:function(index,content)
    {
        var str = null;
        if(content)
        {
            str = content;
        }
        else
        {
            if(hall.getPlayingGame().CHAT_USUALMSG[index])
            {
                str = hall.getPlayingGame().CHAT_USUALMSG[index];
                var soundData = {};
                if(this.playerData.userSex != 2)
                {
                    this.playerData.userSex = 1;
                }
                soundData['userSex'] = this.playerData.userSex;
                soundData['index'] = index + 1;
                sound.playSSSPokerMsg(soundData);
            }
        }
        if(str)
        {

            this.text_msg.setString(str);
            this.text_msg.stopAllActions();
            this.text_msg.setVisible(false);
            this.text_msg.setOpacity(255);
            //this.text_msg.runAction(cc.sequence(cc.delayTime(4),cc.fadeOut(0.5)));
            var size = this.text_msg.getAutoRenderSize().width < this.text_msg.getContentSize().width ? this.text_msg.getAutoRenderSize().width+55:this.text_msg.getContentSize().width+45;
            // this.text_msg.ignoreContentAdaptWithSize(true);
            this.sprite_msg.setContentSize(cc.size(size,this.sprite_msg.getContentSize().height));
            this.sprite_msg.stopAllActions();
            this.sprite_msg.setVisible(false);
            this.sprite_msg.setOpacity(255);
            this.sprite_msg.setScale(1.0);
            //this.sprite_msg.runAction(cc.sequence(cc.delayTime(4),cc.fadeOut(0.5)));


            var text = this.text_msg.clone();
            text.setVisible(true);
            var posText = this.text_msg.getParent().convertToWorldSpace(this.text_msg);
            var image_msg = this.sprite_msg.clone();
            image_msg.setVisible(true);
            var posImage = this.sprite_msg.getParent().convertToWorldSpace(this.sprite_msg);
            var scene = cc.director.getRunningScene();

            if(scene.getChildByTag(1003) != null) scene.removeChildByTag(1003,true);
            if(scene.getChildByTag(998) != null) scene.removeChildByTag(998,true);

            scene.addChild(text,1002,1003);
            text.setPosition(posText);
            scene.addChild(image_msg,999,998);
            image_msg.setPosition(posImage);


            text.setString(str);
            text.stopAllActions();
            text.setVisible(true);
            text.setOpacity(255);
            text.runAction(cc.sequence(cc.delayTime(4),cc.fadeOut(0.5),cc.removeSelf()));
            var size = text.getAutoRenderSize().width < this.text_msg.getContentSize().width ? this.text_msg.getAutoRenderSize().width+55:this.text_msg.getContentSize().width+45;
            // this.text_msg.ignoreContentAdaptWithSize(true);
            image_msg.setContentSize(cc.size(size,this.sprite_msg.getContentSize().height));
            image_msg.stopAllActions();
            image_msg.setVisible(true);
            image_msg.setOpacity(255);
            image_msg.setScale(1.0);
            image_msg.runAction(cc.sequence(cc.delayTime(4),cc.fadeOut(0.5),cc.removeSelf()));



        }

    },
    showThrow:function(state)
    {
        this.btn_throw.setVisible(state);
    },
    releaseAllItem:function()
    {
      this.playerData = null;
      this.text_name = null;
      this.text_score = null;
      this.panel_root = null;
      this.text_msg_left = null;
      this.text_msg_right = null;
      this.uid = null;
      this.sprite_banker = null;
      this.img_offline = null;
      this.sprite_head = null;
      this.sprite_msg_right = null;
      this.sprite_msg_left = null;
      this.sprite_msg = null;
      this.text_msg = null;
      this.sprite_face = null;
      this.playerData = null;
      this.playerData = null;
      this.playerData = null;
      this.playerData = null;
    },

});

var SSSPlayerInfoDialog = JJDialog.extend({
    sprite_head:null,
    playerData:null,
    ctor: function (data) {
        this._super();
        this.playerData = data;
        var root = ccs.load(SSSPokerJson.PlayerInfo).node;
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
        var text_times = ccui.helper.seekWidgetByName(panel_root,"text_times");
        var image_new = ccui.helper.seekWidgetByName(panel_root,"image_new");
        image_new.setVisible(false);
        var id = data['uid'];

        if(hall.getPlayingGame().table.uidOfInfo(data["uid"]) != null)
        {
            var name = base64.decode(data['nickName']);

            if(data['playedTime'] < 50)
                image_new.setVisible(true);

            if(data['playedTime'] > 2000)
                text_times.setString("2000+");
            else
                text_times.setString(data['playedTime']);
            text_name.setString(name);
            text_id.setString('ID:'+id);
            var ip = data['ip'];
            text_ip.setString('IP:'+ip);
            if(data['userSex'] != 2 && data['userSex']  != 1)
            {
                data['userSex'] = 1;
            }
            var headStr = SexInfo[data['userSex']];
            image_sex_icon.loadTexture(headStr['icon'],ccui.Widget.PLIST_TEXTURE);
        }

        if(hall.getPlayingGame().table.seatArray != null)
        {
            var nav = null;
            for(var i = 0;i<hall.getPlayingGame().table.seatArray.length;i++)
            {
                var info = hall.getPlayingGame().table.seatArray[i];
                if(info == null || info == undefined) continue;
                var uid = info["uid"];
                if(uid > 999999 && SSSPoker.table.shuangJiang == 1) continue;
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
                    if(uid > 999999 && SSSPoker.table.shuangJiang == 1) continue;
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
        for(var i=1;i<5;i++)
        {
            var btn_throw = ccui.helper.seekWidgetByName(panel_root,"btn_"+i);
            btn_throw.addClickEventListener(function (sender) {
                var index = sender.name.substring(4);
                SSSPoker.net.throw({"uid":data['uid']
                    ,type:index}, function(data) {
                });
                this.removeFromParent();
            }.bind(this));
            if(data['uid'] == hall.user.uid)
            {
                btn_throw.setVisible(false);
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
            // var tex = util.getTextureForKey(this.playerData.headUrl);
            // if (tex != null && tex != undefined) {
            //     var size = this.sprite_head.getContentSize();
            //     var sprite = new cc.Sprite(tex);
            //     var size_sp = sprite.getContentSize();
            //     sprite.setScaleX(size.width/size_sp.width);
            //     sprite.setScaleY(size.height/size_sp.height);
            //     sprite.setAnchorPoint(cc.p(0, 0));
            //     this.sprite_head.addChild(sprite);
            // } else {
            //     cc.loader.loadImg(this.playerData.headUrl,{isCrossOrigin : true },
            //         function (err, tex) {
            //             JJLog.print(err, tex);
            //             if (err == null) {
            //                 var size = this.sprite_head.getContentSize();
            //                 var sprite = new cc.Sprite(tex);
            //                 var size_sp = sprite.getContentSize();
            //                 sprite.setScaleX(size.width/size_sp.width);
            //                 sprite.setScaleY(size.height/size_sp.height);
            //                 sprite.setAnchorPoint(cc.p(0, 0));
            //                 this.sprite_head.addChild(sprite);
            //             }
            //         }.bind(this));
            // }
            util.LoadHead(this.sprite_head ,this.playerData.headUrl);
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
