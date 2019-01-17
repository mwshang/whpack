/**
 * Created by atom on 2016/8/1.
 */
var DeskHead  = cc.Layer.extend({
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
    ctor:function(data){
        this._super();
        this.playerData = data;
        this.uid = data["uid"];
        var root = ccs.load("res/MajhongBase/MajhongHead.json").node;
        this.addChild(root);

        this.panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
        if(MajhongInfo.GameMode == GameMode.PLAY)
          this.panel_root.setTouchEnabled(true);
        this.panel_root.addClickEventListener(function () {
          var dialog = new GamePlayerInfoDialog(data);
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

        this.text_name.setString(base64.decode(this.playerData["nickName"]));
        this.sprite_head = ccui.helper.seekWidgetByName(root,"sprite_head");

        var _this = this;
        if (this.playerData.headUrl != undefined && this.playerData.headUrl.length > 0) {
            if(this.playerData.headUrl.substring(this.playerData.headUrl.length-1,this.playerData.headUrl.length) == "0")
            {
                this.playerData.headUrl = this.playerData.headUrl.substring(0,this.playerData.headUrl.length-1)+"96";
            }
            if (this.uid != hall.user.uid) {
                cc.loader.loadImg(this.playerData.headUrl,{isCrossOrigin : true },
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
                            cc.loader.loadImg(this.playerData.headUrl,{isCrossOrigin : true },
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

                    cc.loader.loadImg(this.playerData.headUrl,{isCrossOrigin : true },
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
        this.sprite_bankerCount = ccui.helper.seekWidgetByName(this.sprite_banker,"sprite_bankerCount");
        this.sprite_bankerCount.setVisible(false);
        this.text_bankerCount = ccui.helper.seekWidgetByName(this.sprite_bankerCount,"text_bankerCount");
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
          this.sprite_speaker.setFlippedY(true);
          this.sprite_head.setFlippedX(true);

          this.sprite_banker.x = size.width - 25;
          this.img_offline.x = 35;
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
      qp.event.listen(this, 'mjGameStart', this.onGameStart.bind(this));
      qp.event.listen(this, 'mjGameResult', this.onGameResult.bind(this));
      qp.event.listen(this, 'mjPlayerOffLine', this.onLine.bind(this));
      qp.event.listen(this, 'imPlayVoice', this.onPlaySpeak.bind(this));
      qp.event.listen(this, 'mjSyncParams', this.onUpdateScore.bind(this));
    },

    onUpdateScore:function (data) {
        JJLog.print("onUpdateScore"+JSON.stringify(data));
        if(data.coinNum != null && data.coinNum!= undefined)
        {
            for(var i = 0;i<data.coinNum.length;i++)
            {
                if(data.coinNum[i].uid == this.uid)
                {
                    this.text_score.setString(data.coinNum[i].coinNum);
                    break;
                }
            }
        }
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
      qp.event.stop(this, 'mjGameStart');
      qp.event.stop(this, 'mjGameResult');
      qp.event.stop(this, 'mjPlayerOffLine');
      qp.event.stop(this, 'imPlayVoice');
      qp.event.stop(this, 'mySyncParams');
    },

    onGameStart:function(data)
    {
        JJLog.print(JSON.stringify(data));
        this.onBankerResult(data);
    },

  onGameResult: function (data) {
    var players = data['players'];
    for(var i = 0; i < players.length;i++)
    {
       var info = players[i];
        if(this.uid == info['uid'])
        {
          this.text_score.setString(info["coinNum"]);
          break;
        }
    }
  },

  setBanker: function (isBanker) {
    this.sprite_banker.setVisible(isBanker);
  },

    setBankerCount: function (data)
    {
        var count = data["bankerCount"];
        if(count > 1)
        {
            this.sprite_bankerCount.setVisible(this.uid == data['banker']);
            this.text_bankerCount.setString(count);
        }
    },

    setOffline: function (isOffline) {
    this.img_offline.setVisible(isOffline);
  },

    onBankerResult: function (data) {
        if(data["banker"] == this.uid)
        {
            this.sprite_banker.setVisible(true);
            var count = data["bankerCount"];
            if(count > 1)
            {
                this.sprite_bankerCount.setVisible(true);
                this.text_bankerCount.setString(count);
            }
        }else
        {
            this.sprite_banker.setVisible(false);
            this.sprite_bankerCount.setVisible(false);
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
                sound.playMsg(soundData);
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
