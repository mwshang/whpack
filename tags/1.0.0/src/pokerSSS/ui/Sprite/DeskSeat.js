/**
 * Created by atom on 2016/8/21.
 */
var SSSDeskSeat = cc.Layer.extend({
  root: null,
  panel_root: null,
  panel_cardIn: null,
  pengPanel: null,
  node_show: null,

  gap_stand: 0,
  posXHandInCard: 0,
  posCenterCardOut: cc.p(0, 0),
  uid: 0,
  cardInArray: null,
  deskType: DeskType.Other,
  info: '',
  sexType: 2,
  gap_card: 0,
  //罗松
  actDelaytime:0.5,
  image_pokertip:null,
  image_toutype :null,
  image_zhongtype :null,
  image_weitype :null,
  image_specailtype:null,
  text_winscoretou:null,
  text_losescoretou:null,
  text_winscorezhong:null,
  text_losescorezhong:null,
  text_winscorewei:null,
  text_losescorewei:null,

  ctor: function (data, info) {
    this._super();
    this.info = info;
    this.uid = data["uid"];
    if (MajhongInfo.GameMode == GameMode.PLAY) {
      this.sexType = data['userSex'];
    }

    this.cardInArray = new Array();
  },

  initUI: function () {
    //this.root = ccs.load("res/MajhongRighterPanel.json").node;
    //this.addChild(root);
    this.panel_root = ccui.helper.seekWidgetByName(this.root, "panel_root");
    this.pengPanel = ccui.helper.seekWidgetByName(this.panel_root, "panel_peng");
    this.panel_cardIn = ccui.helper.seekWidgetByName(this.panel_root, "panel_cardIn");
    this.node_show = ccui.helper.seekWidgetByName(this.panel_root, "node_show");

    this.image_pokertip = ccui.helper.seekWidgetByName(this.panel_root, "image_tip");
    this.image_pokertip.setVisible(false);
    this.image_toutype = ccui.helper.seekWidgetByName(this.panel_root, "image_toutype");
    this.image_toutype.setVisible(false);
    this.image_zhongtype = ccui.helper.seekWidgetByName(this.panel_root, "image_zhongtype");
    this.image_zhongtype.setVisible(false);
    this.image_weitype = ccui.helper.seekWidgetByName(this.panel_root, "image_weitype");
    this.image_weitype.setVisible(false);
    this.image_specailtype = ccui.helper.seekWidgetByName(this.panel_root, "image_specailtype");
    this.image_specailtype.setVisible(false);

    this.text_winscoretou = ccui.helper.seekWidgetByName(this.panel_root, "text_winscoretou");
    this.text_winscoretou.setVisible(false);
    this.text_losescoretou = ccui.helper.seekWidgetByName(this.panel_root, "text_losescoretou");
    this.text_losescoretou.setVisible(false);
    this.text_winscorezhong = ccui.helper.seekWidgetByName(this.panel_root, "text_winscorezhong");
    this.text_winscorezhong.setVisible(false);
    this.text_losescorezhong = ccui.helper.seekWidgetByName(this.panel_root, "text_losescorezhong");
    this.text_losescorezhong.setVisible(false);
    this.text_winscorewei = ccui.helper.seekWidgetByName(this.panel_root, "text_winscorewei");
    this.text_winscorewei.setVisible(false);
    this.text_losescorewei = ccui.helper.seekWidgetByName(this.panel_root, "text_losescorewei");
    this.text_losescorewei.setVisible(false);
  },

  onEnter: function () {
    this._super();
    this.initUI();
    this.registerAllEvents();
  },

  onExit: function () {
    this._super();
    this.removeAllEvents();
  },

  removeAllParam: function () {
    this.cardInArray.splice(0,this.cardInArray.length);
    this.cardInArray = null;
  },

  registerAllEvents: function () {
    qp.event.listen(this, 'mjSendHandCards', this.onSendHandCards.bind(this));
    qp.event.listen(this, 'mjSyncDelCards', this.onSyncDelCards.bind(this));
    qp.event.listen(this, 'mjGameResult', this.onSyncPlayerOP.bind(this));
    qp.event.listen(this, 'mjSyncPlayerTianHu', this.onSyncPlayerTianHu);
  },

  removeAllEvents: function () {
    qp.event.stop(this, 'mjSendHandCards');
    qp.event.stop(this, 'mjSyncDelCards');
    qp.event.stop(this, 'mjGameResult');
    qp.event.stop(this, 'mjSyncPlayerTianHu');
  },

  onSyncPlayerTianHu: function (data) {
    //todo
  },


  checkMsg: function (data) {
    if (data["uid"] == this.uid) {
      return true;
    }
    return false;
  },


  onSendHandCards: function (data) {
    this.setHandCards(data);
  },

  setHandCards: function (data) {
        qp.event.stop(this, 'mjSendHandCards');
    // todo

    var _this = this;

    _this.runAction(cc.sequence(cc.delayTime(1.9),cc.callFunc(function ()
    {

      _this.onNotifyDelCards();

    })));
  },

  onNotifyDelCards: function (data) {
    JJLog.print("DeskSeat onNotifyDelCards");

    this.image_pokertip.setVisible(true);
    this.image_pokertip.loadTexture('sssShowCardZ.png',ccui.Widget.PLIST_TEXTURE);
    this.image_pokertip.ignoreContentAdaptWithSize(true);
    this.cardInArray.splice(0, this.cardInArray.length);
    this.panel_cardIn.removeAllChildren();
  },


  onSyncDelCards: function (data) {
     JJLog.print("通知理牌完成" + JSON.stringify(data) + "===" + this.uid);

    if(data['uid'] == this.uid)
    {
      this.image_pokertip.setVisible(true);
      this.image_pokertip.loadTexture('sssShowComplete.png',ccui.Widget.PLIST_TEXTURE);
      this.image_pokertip.ignoreContentAdaptWithSize(true);
      this.cardInArray.splice(0, this.cardInArray.length);
      this.panel_cardIn.removeAllChildren();
    }
  },

  onSyncPlayerOP: function (data) {
    JJLog.print("DeskSeat onSyncPlayerOP");
    this.synPlayerOp(data);
  },

  synPlayerOp: function (data) {

    this.image_pokertip.setVisible(false);
    var players = data['players'];

    var specail = false;
    var specailLength = 0;
    var normalIndex = 0;
    var normalPlayers = [];
    var specialPlayers = [];

    for(var i=0;i<players.length;i++)
    {
      players[i]['isHaveSpe'] = false;
      if(players[i]['paiPut']['spe'] != undefined && players[i]['paiPut']['spe'] !=null)
      {
        players[i]['isHaveSpe'] = true;
        specail = true;
        specailLength++;
        specialPlayers.push(players[i]);
      }else
      {
        var player = players[i];
        var frontScore = player['frontScore'] +  player['frontExtScore'];
        var midScore = player['midScore'] +  player['midExtScore'];
        var lastScore = player['lastScore'] +  player['lastExtScore'];
        normalPlayers.push({"uid":player.uid,"front":frontScore,'mid':midScore,'last':lastScore});
      }
    }

    if(GAMENAME == "shisanshui")
    {
      var config = util.getCacheItem('sss_model');
      if(config == 1)
      {
        specialPlayers.sort(function(A,B){
          return A.speScore - B.speScore;
        });
        for (var i = 0;i<specialPlayers.length;i++)
        {
          var player = specialPlayers[i];
          for(var j=0;j<players.length;j++)
          {
            if(players[j]["uid"] == player.uid)
              players[j]["specialIndex"] = i;
          }
        }

        normalPlayers.sort(function(A,B){
          return A.front - B.front;
        });
        for (var i = 0;i<normalPlayers.length;i++)
        {
          var player = normalPlayers[i];
          for(var j=0;j<players.length;j++)
          {
            if(players[j]["uid"] == player.uid)
              players[j]["frontIndex"] = i;
          }
        }

        normalPlayers.sort(function(A,B){
          return A.mid - B.mid;
        });
        for (var i = 0;i<normalPlayers.length;i++)
        {
          var player = normalPlayers[i];
          for(var j=0;j<players.length;j++)
          {
            if(players[j]["uid"] == player.uid)
              players[j]["midIndex"] = i;
          }
        }

        normalPlayers.sort(function(A,B){
          return A.last - B.last;
        });
        for (var i = 0;i<normalPlayers.length;i++)
        {
          var player = normalPlayers[i];
          for(var j=0;j<players.length;j++)
          {
            if(players[j]["uid"] == player.uid)
              players[j]["lastIndex"] = i;
          }
        }

        for(var i=0;i<players.length;i++)
        {
          if(players[i]['uid'] == this.uid)
          {
            if(players[i].isHaveSpe == false)
            {
              this.playYJComAniamtion(players[i],players.length-specailLength,specailLength,specail)
            }
            else
            {
              this.playYJSpecailAnimation(players[i],players.length-specailLength,specailLength)
            }
          }
          if(players[i].isHaveSpe == false)
            normalIndex++;
        }
      }else
      {
        for(var i=0;i<players.length;i++)
        {
          if(players[i]['uid'] == this.uid)
          {
            if(players[i].isHaveSpe == false)
            {
              this.playComAniamtion(players[i],normalIndex,players.length-specailLength,specail)
            }
            else
            {
              this.playSpecailAnimation(players[i],players.length-specailLength)
            }
          }
          if(players[i].isHaveSpe == false)
            normalIndex++;
        }
      }
    }else
    {
      for(var i=0;i<players.length;i++)
      {
        if(players[i]['uid'] == this.uid)
        {
          if(players[i].isHaveSpe == false)
          {
            this.playComAniamtion(players[i],normalIndex,players.length-specailLength,specail)
          }
          else
          {
            this.playSpecailAnimation(players[i],players.length-specailLength)
          }
        }
        if(players[i].isHaveSpe == false)
          normalIndex++;
      }
    }
  },

  forceDisconnect:function () {
    cc.setTimeout(function() {
      var pomelo = window.pomelo;
      if (pomelo.connectState != 'disconnected') {
        pomelo.disconnect();
      }
    }, 100);
  },

  //特殊牌型比牌
  playSpecailAnimation:function(data,length)
  {
    var delay = SSSCommonParam.POKERSHOWDELAY*1*3+SSSCommonParam.STARTCOMPAREDELAY;
    for (var i = 0; i < this.cardInArray.length; i++) {
      var card = this.cardInArray[i];
      card.removeFromParent();
    }
    this.cardInArray.splice(0, this.cardInArray.length);
    var players =  data;
    var specail =players['paiPut']['spe'];
    var paitou = players['paiPut']['front'];
    var paizhong = players['paiPut']['mid'];
    var paiwei = players['paiPut']['last'];
    var paitype = data['paiPut']['paiType'];

    this.runAction(cc.sequence(
        cc.delayTime(delay),
        cc.callFunc(function ()
        {
          var soundData = {};
          soundData['Type'] = paitype[0];
          soundData['userSex'] = this.sexType;
          sound.playSSSCardType(soundData);

          for(var i=0;i<3;i++)
          {
            var card = new SSSPokerShowUp( specail[i]);
            var size = card.getContentSize();
            var x = size.width * i - 35 * i + 40;
            var y = 50;
            card.setPosition(x, y);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
          }
          for(var i=0;i<5;i++)
          {
            var card = new SSSPokerShowUp(specail[i+3]);
            var size = card.getContentSize();
            var x = size.width * i - 35 * i ;
            var y = 0;
            card.setPosition(x, y);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
          }
          for(var i=0;i<5;i++)
          {
            var card = new SSSPokerShowUp(specail[i+8]);
            var size = card.getContentSize();
            var x = size.width * i - 35 * i ;
            var y = -50;
            card.setPosition(x, y);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
          }
          this.image_toutype.setVisible(false);
          this.image_zhongtype.setVisible(false);
          this.image_weitype.setVisible(false);
          if(paitype[0] != null && paitype[0] != 0)
          {
            this.image_specailtype.setVisible(true);
            this.image_specailtype.loadTexture(ShuiTypeWord[paitype[0]],ccui.Widget.PLIST_TEXTURE);
            this.image_specailtype.ignoreContentAdaptWithSize(true);
          }

        }.bind(this))));

    if(data['uid'] == hall.user.uid)
    {
      delay += SSSCommonParam.SPECPOKERSHOWDELAY;
      this.runAction(cc.sequence(
          cc.delayTime(delay),
          cc.callFunc(function ()
          {
            this.postResultIndex();

          }.bind(this))));

    }

  },
  //普通牌型比牌动画
  playComAniamtion: function (data, index,length,ishaveSpe) {
    var delay = SSSCommonParam.STARTCOMPAREDELAY+SSSCommonParam.POKERSHOWDELAY *0;

    JJLog.print("结束通知 Seat ="+ JSON.stringify(data)+"Uid==" + data['uid']);
    for (var i = 0; i < this.cardInArray.length; i++) {
      var card = this.cardInArray[i];
      card.removeFromParent();
    }
    this.cardInArray.splice(0, this.cardInArray.length);
    // this.setScale(0.9);
    ///比牌头道
    var players =  data;
    var paitype = data['paiPut']['paiType'];

    var NBspecailtype =data['speTypeNb'];           //宁波特殊牌型 显示一下

    var isShowCore = util.getCacheItem('sss_showscore');  //是否显示分数

    this.runAction(cc.sequence(
        cc.delayTime(delay),
        cc.callFunc(function ()
        {
          if(data['uid'] == hall.user.uid)
          {
            var soundData = {};
            soundData['Type'] = paitype[0];
            soundData['userSex'] = this.sexType;
            sound.playSSSCardType(soundData);

          }
          var pais1 = players['paiPut']['front'];
          for(var i=0;i<pais1.length;i++)
          {

            var card = new SSSPokerShowUp( pais1[i]);
            var size = card.getContentSize();
            var x = size.width * i - 35 * i +40;
            var y = 50;
            card.setPosition(x, y);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);


          }

          this.image_toutype.setVisible(true);
          if(paitype[0] == ShuiType.THREE)
          {
            this.image_toutype.loadTexture(ShuiTypeWord[ShuiType.CHONGSAN],ccui.Widget.PLIST_TEXTURE)
          }else
          {
            this.image_toutype.loadTexture(ShuiTypeWord[paitype[0]],ccui.Widget.PLIST_TEXTURE)
          }
          this.image_toutype.ignoreContentAdaptWithSize(true);
          this.image_toutype.runAction(cc.sequence(cc.scaleTo(0.1,1),cc.scaleTo(0.1,0.8),cc.callFunc(function ()
          {


          }.bind(this))));

          if(isShowCore != 2)
          {
            var score = data['frontScore'] +  data['frontExtScore'];
             if(score >= 0)
             {
               this.text_winscoretou.setVisible(true);
               this.text_winscoretou.setString('/'+score);
               this.text_winscoretou.runAction(cc.sequence(cc.scaleTo(0.1,0.8),cc.scaleTo(0.1,0.6)));
             }else
             {
               this.text_losescoretou.setVisible(true);
               this.text_losescoretou.setString('/'+score);
               this.text_losescoretou.runAction(cc.sequence(cc.scaleTo(0.1,0.8),cc.scaleTo(0.1,0.6)));
             }
          }

          if(ishaveSpe == false)
          {
          }

        }.bind(this))));

    delay += SSSCommonParam.POKERSHOWDELAY*1;

    ///比牌中道

    this.runAction(cc.sequence(
        cc.delayTime(delay),
        cc.callFunc(function ()
        {
          if(data['uid'] == hall.user.uid)
          {
            var soundData = {};
            soundData['Type'] = paitype[1];
            soundData['userSex'] = this.sexType;
            sound.playSSSCardType(soundData);
          }

          var pais2 = players['paiPut']['mid'];;

          for(var i=0;i<pais2.length;i++)
          {
            var card = new SSSPokerShowUp(pais2[i]);
            var size = card.getContentSize();
            var x = size.width * i - 35 * i ;
            var y = 0;
            card.setPosition(x, y);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
          }
          this.image_zhongtype.setVisible(true);
          if(paitype[1] == ShuiType.THREE_DOUBLE)
          {
            this.image_zhongtype.loadTexture(ShuiTypeWord[ShuiType.ZHONG_THREE_DOUBLE],ccui.Widget.PLIST_TEXTURE)
          }else
          {
            this.image_zhongtype.loadTexture(ShuiTypeWord[paitype[1]],ccui.Widget.PLIST_TEXTURE)
          }
          this.image_zhongtype.ignoreContentAdaptWithSize(true);
          this.image_zhongtype.runAction(cc.sequence(cc.scaleTo(0.1,1),cc.scaleTo(0.1,0.8),cc.callFunc(function ()
          {


          }.bind(this))));

          if(isShowCore != 2)
          {
            var score = data['midScore'] +  data['midExtScore'];
             if(score >= 0)
             {
               this.text_winscorezhong.setVisible(true);
               this.text_winscorezhong.setString('/'+score);
               this.text_winscorezhong.runAction(cc.sequence(cc.scaleTo(0.1,0.8),cc.scaleTo(0.1,0.6)));

             }else
             {
               this.text_losescorezhong.setVisible(true);
               this.text_losescorezhong.setString('/'+score);
               this.text_losescorezhong.runAction(cc.sequence(cc.scaleTo(0.1,0.8),cc.scaleTo(0.1,0.6)));
             }
          }

          if(ishaveSpe == false)
          {
          }

        }.bind(this))));



    delay += SSSCommonParam.POKERSHOWDELAY*1;
    ///比牌尾道

    this.runAction(cc.sequence(
        cc.delayTime(delay),
        cc.callFunc(function ()
        {
          if(data['uid'] == hall.user.uid)
          {
            var soundData = {};
            soundData['Type'] = paitype[2];
            soundData['userSex'] = this.sexType;
            sound.playSSSCardType(soundData);
          }

          var pais3 = players['paiPut']['last'];
          for(var i=0;i<pais3.length;i++)
          {

            var card = new SSSPokerShowUp(pais3[i]);
            var size = card.getContentSize();
            var x = size.width * i - 35 * i;
            var y = -50;
            card.setPosition(x, y);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
          }

          this.image_weitype.setVisible(true);
          this.image_weitype.loadTexture(ShuiTypeWord[paitype[2]],ccui.Widget.PLIST_TEXTURE);
          this.image_weitype.ignoreContentAdaptWithSize(true);
          this.image_weitype.runAction(cc.sequence(cc.scaleTo(0.1,1),cc.scaleTo(0.1,0.8),cc.callFunc(function ()
          {

          }.bind(this))));


          if(isShowCore != 2)
          {
            var score = data['lastScore'] +  data['lastExtScore'];
             if(score >= 0)
             {
               this.text_winscorewei.setVisible(true);
               this.text_winscorewei.setString('/'+score);
               this.text_winscorewei.runAction(cc.sequence(cc.scaleTo(0.1,0.8),cc.scaleTo(0.1,0.6)));
             }else
             {
               this.text_losescorewei.setVisible(true);
               this.text_losescorewei.setString('/'+score);
               this.text_losescorewei.runAction(cc.sequence(cc.scaleTo(0.1,0.8),cc.scaleTo(0.1,0.6)));
             }
          }
          if(ishaveSpe == false)
          {
          }

        }.bind(this))));

    if(NBspecailtype > 0)
    {
      delay += SSSCommonParam.POKERSHOWDELAY*1;
      this.runAction(cc.sequence(
          cc.delayTime(delay),
          cc.callFunc(function ()
          {
            var soundData = {};
            soundData['Type'] = NBspecailtype;
            soundData['userSex'] = this.sexType;
            sound.playSSSCardType(soundData);

            if(NBspecailtype != null && NBspecailtype != 0)
            {
              this.image_specailtype.setVisible(true);
              this.image_specailtype.loadTexture(ShuiTypeWord[NBspecailtype],ccui.Widget.PLIST_TEXTURE);
              this.image_specailtype.ignoreContentAdaptWithSize(true);
            }

          }.bind(this))));
    }

    if(data['uid'] == hall.user.uid)
    {
      var allDelay = SSSCommonParam.POKERSHOWDELAY*1*3+SSSCommonParam.STARTCOMPAREDELAY;
      if(ishaveSpe == true) allDelay+= SSSCommonParam.SPECPOKERSHOWDELAY;
      this.runAction(cc.sequence(
          cc.delayTime(allDelay),
          cc.callFunc(function ()
          {
            this.postResultIndex();
          }.bind(this))));
    }
  },

  //特殊牌型比牌
  playYJSpecailAnimation:function(data,length,specailLength)
  {
    var delay = SSSCommonParam.YJPOKERSHOWDELAY*length*3+SSSCommonParam.STARTCOMPAREDELAY+SSSCommonParam.YJPOKERSHOWDELAY *data['specialIndex'];
    for (var i = 0; i < this.cardInArray.length; i++) {
      var card = this.cardInArray[i];
      card.removeFromParent();
    }
    this.cardInArray.splice(0, this.cardInArray.length);
    var players =  data;
    var specail =players['paiPut']['spe'];
    var paitou = players['paiPut']['front'];
    var paizhong = players['paiPut']['mid'];
    var paiwei = players['paiPut']['last'];
    var paitype = data['paiPut']['paiType'];

    this.runAction(cc.sequence(
        cc.delayTime(delay),
        cc.callFunc(function ()
        {
          var soundData = {};
          soundData['Type'] = paitype[0];
          soundData['userSex'] = this.sexType;
          sound.playSSSCardType(soundData);

          for(var i=0;i<3;i++)
          {
            var card = new SSSPokerShowUp( specail[i]);
            var size = card.getContentSize();
            var x = size.width * i - 35 * i + 40;
            var y = 50;
            card.setPosition(x, y);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
          }
          for(var i=0;i<5;i++)
          {
            var card = new SSSPokerShowUp(specail[i+3]);
            var size = card.getContentSize();
            var x = size.width * i - 35 * i ;
            var y = 0;
            card.setPosition(x, y);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
          }
          for(var i=0;i<5;i++)
          {
            var card = new SSSPokerShowUp(specail[i+8]);
            var size = card.getContentSize();
            var x = size.width * i - 35 * i ;
            var y = -50;
            card.setPosition(x, y);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
          }
          this.image_toutype.setVisible(false);
          this.image_zhongtype.setVisible(false);
          this.image_weitype.setVisible(false);
          if(paitype[0] != null && paitype[0] != 0)
          {
            this.image_specailtype.setVisible(true);
            this.image_specailtype.loadTexture(ShuiTypeWord[paitype[0]],ccui.Widget.PLIST_TEXTURE);
            this.image_specailtype.ignoreContentAdaptWithSize(true);
          }

        }.bind(this))));

    if(data['uid'] == hall.user.uid)
    {
      delay += SSSCommonParam.SPECPOKERSHOWDELAY+SSSCommonParam.YJPOKERSHOWDELAY*specailLength;
      this.runAction(cc.sequence(
          cc.delayTime(delay),
          cc.callFunc(function ()
          {
            this.postResultIndex();

          }.bind(this))));

    }

  },
  //普通牌型比牌动画
  playYJComAniamtion: function (data,length,specailLength,ishaveSpe) {
    var frontDelay = SSSCommonParam.STARTCOMPAREDELAY+SSSCommonParam.YJPOKERSHOWDELAY *data['frontIndex'];
    console.log(this.uid+"@@@@@@@@@@@@@@@front"+frontDelay+"index"+data['frontIndex']);
    for (var i = 0; i < this.cardInArray.length; i++) {
      var card = this.cardInArray[i];
      card.removeFromParent();
    }
    this.cardInArray.splice(0, this.cardInArray.length);
    ///比牌头道
    var players =  data;
    var paitype = data['paiPut']['paiType'];

    var NBspecailtype =data['speTypeNb'];           //宁波特殊牌型 显示一下

    var isShowCore = util.getCacheItem('sss_showscore');  //是否显示分数

    this.runAction(cc.sequence(
        cc.delayTime(frontDelay),
        cc.callFunc(function ()
        {
            var soundData = {};
            soundData['Type'] = paitype[0];
            soundData['userSex'] = this.sexType;
            sound.playSSSCardType(soundData);
          var pais1 = players['paiPut']['front'];
          for(var i=0;i<pais1.length;i++)
          {

            var card = new SSSPokerShowUp( pais1[i]);
            var size = card.getContentSize();
            var x = size.width * i - 35 * i +40;
            var y = 50;
            card.setPosition(x, y);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);


          }

          this.image_toutype.setVisible(true);
          if(paitype[0] == ShuiType.THREE)
          {
            this.image_toutype.loadTexture(ShuiTypeWord[ShuiType.CHONGSAN],ccui.Widget.PLIST_TEXTURE)
          }else
          {
            this.image_toutype.loadTexture(ShuiTypeWord[paitype[0]],ccui.Widget.PLIST_TEXTURE)
          }
          this.image_toutype.ignoreContentAdaptWithSize(true);
          this.image_toutype.runAction(cc.sequence(cc.scaleTo(0.1,1),cc.scaleTo(0.1,0.8),cc.callFunc(function ()
          {


          }.bind(this))));
          if(isShowCore != 2)
          {
            var score = data['frontScore'] +  data['frontExtScore'];
             if(score >= 0)
             {
               this.text_winscoretou.setVisible(true);
               this.text_winscoretou.setString('/'+score);
               this.text_winscoretou.runAction(cc.sequence(cc.scaleTo(0.1,0.8),cc.scaleTo(0.1,0.6)));
             }else
             {
               this.text_losescoretou.setVisible(true);
               this.text_losescoretou.setString('/'+score);
               this.text_losescoretou.runAction(cc.sequence(cc.scaleTo(0.1,0.8),cc.scaleTo(0.1,0.6)));
             }
          }
          if(ishaveSpe == false)
          {
          }

        }.bind(this))));

    var midDelay =SSSCommonParam.STARTCOMPAREDELAY +SSSCommonParam.YJPOKERSHOWDELAY*length + SSSCommonParam.YJPOKERSHOWDELAY *data['midIndex'];
    console.log(this.uid+"@@@@@@@@@@@@@@@mid"+midDelay+"index"+data['midIndex']);
    ///比牌中道

    this.runAction(cc.sequence(
        cc.delayTime(midDelay),
        cc.callFunc(function ()
        {
            var soundData = {};
            soundData['Type'] = paitype[1];
            soundData['userSex'] = this.sexType;
            sound.playSSSCardType(soundData);

          var pais2 = players['paiPut']['mid'];;

          for(var i=0;i<pais2.length;i++)
          {
            var card = new SSSPokerShowUp(pais2[i]);
            var size = card.getContentSize();
            var x = size.width * i - 35 * i ;
            var y = 0;
            card.setPosition(x, y);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
          }
          this.image_zhongtype.setVisible(true);
          if(paitype[1] == ShuiType.THREE_DOUBLE)
          {
            this.image_zhongtype.loadTexture(ShuiTypeWord[ShuiType.ZHONG_THREE_DOUBLE],ccui.Widget.PLIST_TEXTURE)
          }else
          {
            this.image_zhongtype.loadTexture(ShuiTypeWord[paitype[1]],ccui.Widget.PLIST_TEXTURE)
          }
          this.image_zhongtype.ignoreContentAdaptWithSize(true);
          this.image_zhongtype.runAction(cc.sequence(cc.scaleTo(0.1,1),cc.scaleTo(0.1,0.8),cc.callFunc(function ()
          {


          }.bind(this))));

          if(isShowCore != 2)
          {
            var score = data['midScore'] +  data['midExtScore'];

             if(score >= 0)
             {
               this.text_winscorezhong.setVisible(true);
               this.text_winscorezhong.setString('/'+score);
               this.text_winscorezhong.runAction(cc.sequence(cc.scaleTo(0.1,0.8),cc.scaleTo(0.1,0.6)));

             }else
             {
               this.text_losescorezhong.setVisible(true);
               this.text_losescorezhong.setString('/'+score);
               this.text_losescorezhong.runAction(cc.sequence(cc.scaleTo(0.1,0.8),cc.scaleTo(0.1,0.6)));
             }
          }
          if(ishaveSpe == false)
          {
          }

        }.bind(this))));



    var lastDelay =SSSCommonParam.STARTCOMPAREDELAY + SSSCommonParam.YJPOKERSHOWDELAY*length*2+ SSSCommonParam.YJPOKERSHOWDELAY *data['lastIndex'];
    console.log(this.uid+"@@@@@@@@@@@@@@@last"+lastDelay+"index"+data['lastIndex']);
    ///比牌尾道

    this.runAction(cc.sequence(
        cc.delayTime(lastDelay),
        cc.callFunc(function ()
        {
            var soundData = {};
            soundData['Type'] = paitype[2];
            soundData['userSex'] = this.sexType;
            sound.playSSSCardType(soundData);

          var pais3 = players['paiPut']['last'];
          for(var i=0;i<pais3.length;i++)
          {

            var card = new SSSPokerShowUp(pais3[i]);
            var size = card.getContentSize();
            var x = size.width * i - 35 * i;
            var y = -50;
            card.setPosition(x, y);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
          }

          this.image_weitype.setVisible(true);
          this.image_weitype.loadTexture(ShuiTypeWord[paitype[2]],ccui.Widget.PLIST_TEXTURE);
          this.image_weitype.ignoreContentAdaptWithSize(true);
          this.image_weitype.runAction(cc.sequence(cc.scaleTo(0.1,1),cc.scaleTo(0.1,0.8),cc.callFunc(function ()
          {

          }.bind(this))));


          if(isShowCore != 2)
          {
            var score = data['lastScore'] +  data['lastExtScore'];
             if(score >= 0)
             {
               this.text_winscorewei.setVisible(true);
               this.text_winscorewei.setString('/'+score);
               this.text_winscorewei.runAction(cc.sequence(cc.scaleTo(0.1,0.8),cc.scaleTo(0.1,0.6)));
             }else
             {
               this.text_losescorewei.setVisible(true);
               this.text_losescorewei.setString('/'+score);
               this.text_losescorewei.runAction(cc.sequence(cc.scaleTo(0.1,0.8),cc.scaleTo(0.1,0.6)));
             }
          }
          if(ishaveSpe == false)
          {
          }

        }.bind(this))));

    if(NBspecailtype > 0)
    {
      lastDelay += SSSCommonParam.YJPOKERSHOWDELAY*length;
      this.runAction(cc.sequence(
          cc.delayTime(lastDelay),
          cc.callFunc(function ()
          {
            var soundData = {};
            soundData['Type'] = NBspecailtype;
            soundData['userSex'] = this.sexType;
            sound.playSSSCardType(soundData);

            if(NBspecailtype != null && NBspecailtype != 0)
            {
              this.image_specailtype.setVisible(true);
              this.image_specailtype.loadTexture(ShuiTypeWord[NBspecailtype],ccui.Widget.PLIST_TEXTURE);
              this.image_specailtype.ignoreContentAdaptWithSize(true);
            }

          }.bind(this))));
    }

    if(data['uid'] == hall.user.uid)
    {
      var allDelay = SSSCommonParam.YJPOKERSHOWDELAY*length*3+SSSCommonParam.STARTCOMPAREDELAY;
      if(ishaveSpe == true) allDelay+= SSSCommonParam.SPECPOKERSHOWDELAY+SSSCommonParam.YJPOKERSHOWDELAY*specailLength;
      this.runAction(cc.sequence(
          cc.delayTime(allDelay),
          cc.callFunc(function ()
          {
            this.postResultIndex();
          }.bind(this))));
    }
  },

  postResultIndex: function () {
    var event = new cc.EventCustom(CommonEvent.EVT_DESK_RESULT_INDEX);
    event.setUserData(ResultTag.DAHU);
    cc.eventManager.dispatchEvent(event);
  },

  showHandInCards: function () {
    for (var i = 0; i < this.cardInArray.length; i++) {
      var card = this.cardInArray[i];
      card.removeFromParent();
    }
    this.cardInArray.splice(0, this.cardInArray.length);

  },


  posIndexOfOutCard: function () {
    //todo
  },

  getCardsFromData: function (data) {
    var pais = data['paiQi'];
    var arr = new Array();
    if (this.deskType == DeskType.Other) {
      for (var i = 0; i < data['paiQi']; i++) {
        arr.push('0');
      }
      return arr;
    } else {

      for (var tag in pais) {
        var infoArray = pais[tag];
        arr.push(infoArray);
      }
      return arr;
    }
  },

  checkOffline: function () {
    if (SSSPoker.table.isOffline) {
      this.initLastCards();
    }
  },

  initLastCards: function () {
    var info = SSSPoker.table.getCardByPlayer(this.uid);


    if (SSSPoker.table.offLineInfo != null && SSSPoker.table.offLineInfo['mjGameResult'] != null)
    {
      this.onSyncPlayerOP(SSSPoker.table.offLineInfo['mjGameResult']);

      return;
    }

    if(info['isPutCard'] > 0)
    {
      this.image_pokertip.setVisible(true);

      this.image_pokertip.loadTexture('sssShowComplete.png',ccui.Widget.PLIST_TEXTURE);
      this.image_pokertip.ignoreContentAdaptWithSize(true);

    }else
    {
      this.image_pokertip.setVisible(true);

      this.image_pokertip.loadTexture('sssShowCardZ.png',ccui.Widget.PLIST_TEXTURE);
      this.image_pokertip.ignoreContentAdaptWithSize(true);
      //JJLog.print("==="+this.uid);
      //JJLog.print(JSON.stringify(info));
      //var cardArray = this.getCardsFromData(info);
      //JJLog.print("==="+cardArray.length);
      //for (var i = 0; i < cardArray.length; i++) {
      //  this.addCardIn(cardArray[i]);
      //  JJLog.print("==="+cardArray[i]);
      //}
    }


    this.resetPanelInChild();

  },

  addCardIn: function (cardObj) {

  },

  cardOfString: function (cardObj) {
    return cardObj['type'] + cardObj['value'];
  },


  getHandCards:function(msg)
  {
    var info = msg['selfPaiQi'];

    var cards = new Array();
    for(var typeTag in info)
    {
      var data = info[typeTag];
      for(var i=0;i<data.length;i++)
      {
        var cardObj = data[i];
        var cardStr = this.cardOfString(data[i]);
        var isAdd = true;
        if(isAdd) cards.push(cardObj);
      }
    }

    return cards;
  },

});