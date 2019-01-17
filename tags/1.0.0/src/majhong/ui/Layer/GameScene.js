/**
 * Created by atom on 2016/7/25.
 */
var gameSceneId = 0;

var GameScene = cc.Scene.extend({
  _id : 0,
  panel_head:null,
    seatHeads:[],
    seat_left:null,
    seat_right:null,
    seat_up:null,
    seat_self:null,

  panel_status:null,
    image_dirc:null,
    turnImgArr:[],
    text_clock:null,
    text_remain:null,
    text_round:null,

  panel_player:null,

  panel_ready:null,
    btn_ready:null,
    imgReadyArray:null,

  panel_desk:null,

  btn_add:null,

  panel_cover:null,

  panel_option_waiting:null,
    btn_invite_wechat:null,
    btn_back_hall:null,
    btn_dissolve:null,

  panel_option_playing:null,
    btn_setting:null,
    btn_msg:null,
    bird:null,

  panel_infomation:null,
    text_room_id:null,
    text_time:null,
    btn_speak:null,
    text_room_name:null,
    text_msg:null,

  //
  direRotation:0,
  rotateTime:0,
  deskArray:null,
  idArray:null,
  bankerDesk:null,
  selfDesk:null,
  rightDesk:null,
  upDesk:null,
  leftDesk:null,
  bankerIndex:0,
  text_count:null,
  imgReadyArray:[],

  speakTip:null,
  totalIndex:0,
  nowIndex:0,
  _Listeners:[],
  niaoPosArray:[],
  resultData:null,
  totalRound:0,
  autoSendRecord:false,
  intervalTouchSpeak:0,
  beginSpeak:false,
  talkRecordTime:0,
  gameMode:GameMode.PLAY,
  turnUid:0,//谁出牌
  //********quanzhou*********
  panel_huapai:null,
  img_kaijin:null,
  imgHuaPaiArray:[],
  textHuaPaiArray:[],
  listviewHuapaiArray:[],
  image_huapaiclone:null,
  imgHuaArray:[],
  actionsHuaPai:null,
  actionsJinPai:null,
  jinpaiPos:null,
  jinpaiCard:null,
  img_jinIcon:null,
  isDoHuaPaiAction:false,
  isDoKaiJinAction:false,
  oneKe : 0,   //一课
  youjin:3,
  jintow:1,

  panel_youjinAct :null,
  node_youzi:null,
  node_youjin:null,
  image_Bg :null,
  //---------quanzhou-----------
  ctor: function () {
        this._super();
        var root = ccs.load("res/MajhongBase/MajhongRoom.json").node;
        this.addChild(root);
        var _this = this;
        gameSceneId++;
        this._id = gameSceneId;
        JJLog.print('new gameScene' + this._id);

    this.image_Bg = ccui.helper.seekWidgetByName(root,"image_bg");

    this.panel_head =  ccui.helper.seekWidgetByName(root,"panel_head");
    this.seat_left =  ccui.helper.seekWidgetByName(this.panel_head,"seat_left");
    this.seat_right =  ccui.helper.seekWidgetByName(this.panel_head,"seat_right");
    this.seat_up =  ccui.helper.seekWidgetByName(this.panel_head,"seat_up");
    this.seat_self =  ccui.helper.seekWidgetByName(this.panel_head,"seat_self");
    this.seatHeads[0] = this.seat_self;
    this.seatHeads[1] = this.seat_right;
    this.seatHeads[2] = this.seat_up;
    this.seatHeads[3] = this.seat_left;



    this.panel_status =  ccui.helper.seekWidgetByName(root,"panel_status");
    this.image_dirc =  ccui.helper.seekWidgetByName(this.panel_status,"image_dirc");

    //指示灯
    this.turnImgArr[0] =  ccui.helper.seekWidgetByName(this.image_dirc,"image_east");
    this.turnImgArr[1] =  ccui.helper.seekWidgetByName(this.image_dirc,"image_south");
    this.turnImgArr[2] =  ccui.helper.seekWidgetByName(this.image_dirc,"image_west");
    this.turnImgArr[3] =  ccui.helper.seekWidgetByName(this.image_dirc,"image_north");
    //this.image_dirc.setVisible(true);
    this.setTurnLightOff();
    this.text_clock = ccui.helper.seekWidgetByName(this.panel_status,"text_clock");
    this.text_remain = ccui.helper.seekWidgetByName(this.panel_status,"text_remain");
    this.text_round = ccui.helper.seekWidgetByName(this.panel_status,"text_round");
    this.text_count = ccui.helper.seekWidgetByName(this.panel_status,"text_count");
    this.text_count.setString('-');
    this.panel_status.setVisible(false);

    this.panel_player =  ccui.helper.seekWidgetByName(root,"panel_player");

    this.panel_ready =  ccui.helper.seekWidgetByName(root,"panel_ready");
    this.btn_ready = ccui.helper.seekWidgetByName(this.panel_ready,"btn_ready");
    this.imgReadyArray[0] = ccui.helper.seekWidgetByName(this.panel_ready,"img_ready_self");
    this.imgReadyArray[1] = ccui.helper.seekWidgetByName(this.panel_ready,"img_ready_right");
    this.imgReadyArray[2] = ccui.helper.seekWidgetByName(this.panel_ready,"img_ready_up");
    this.imgReadyArray[3] = ccui.helper.seekWidgetByName(this.panel_ready,"img_ready_left");
    this.imgReadyArray[0].setVisible(false);
    this.imgReadyArray[1].setVisible(false);
    this.imgReadyArray[2].setVisible(false);
    this.imgReadyArray[3].setVisible(false);
    this.btn_ready.addClickEventListener(function (data) {
      sound.playBtnSound();
      majhong.table.ready( function (data) {
        _this.btn_ready.setVisible(false);
      });
    });
    this.panel_ready.setVisible(false);

    this.panel_desk =  ccui.helper.seekWidgetByName(root,"panel_desk");

    this.panel_cover =  ccui.helper.seekWidgetByName(root,"panel_cover");
    this.panel_cover.setVisible(false);

    this.panel_option_waiting =  ccui.helper.seekWidgetByName(root,"panel_option_waiting");
    this.btn_invite_wechat = ccui.helper.seekWidgetByName(this.panel_option_waiting,"btn_invite_wechat");
    this.btn_back_hall = ccui.helper.seekWidgetByName(this.panel_option_waiting,"btn_back_hall");
    this.btn_dissolve = ccui.helper.seekWidgetByName(this.panel_option_waiting,"btn_dissolve");
    this.btn_dissolve.addClickEventListener(function () {
      sound.playBtnSound();
      this.showDissolveTip();
      //majhong.net.leavePrivateTable(0,function (data) {
      //  JJLog.print('leave table resp');
      //  //cc.director.runScene(new SangongHallScene());
      //  var hall2 = new MajhongHall();
      //  hall2.showHall();
      //});
    }.bind(this));


    //btn_dissolve
    this.btn_invite_wechat.addClickEventListener(this.onInviteWeChat);
    this.btn_back_hall.addClickEventListener(function () {
      sound.playBtnSound();

      majhong.leavePrivateTable(0,function (data) {
        console.log(data);
        if(data['code'] == 200)
        {
          var hall2 = new MajhongHall();
          hall2.showHall();
          hall.inRoom = false;
        }else
        {
          if(data['err'] != undefined && data['err'] != null)
          {
            var dialog = new JJConfirmDialog();
            dialog.setDes(data['err']);
            dialog.showDialog();
          }

        }

      });
    });
    this.panel_option_waiting.setVisible(false);


    this.panel_option_playing =  ccui.helper.seekWidgetByName(root,"panel_option_playing");
    this.btn_setting = ccui.helper.seekWidgetByName(root,"btn_setting");
    this.btn_msg = ccui.helper.seekWidgetByName(this.panel_option_playing,"btn_msg");
    this.bird = ccui.helper.seekWidgetByName(root,"image_bird");
    this.btn_setting.addClickEventListener(this.onSetting.bind(this));
    this.btn_msg.addClickEventListener(this.sendMsg.bind(this));
    this.panel_option_playing.setVisible(false);

    this.panel_infomation =  ccui.helper.seekWidgetByName(root,"panel_infomation");
    this.btn_speak = ccui.helper.seekWidgetByName(this.panel_infomation,"btn_speak");
    this.text_room_name =  ccui.helper.seekWidgetByName(this.panel_infomation,"text_room_name");
    this.text_room_id =  ccui.helper.seekWidgetByName(this.panel_infomation,"text_room_id");
    this.text_msg =  ccui.helper.seekWidgetByName(this.panel_infomation,"text_msg");
    this.text_time = ccui.helper.seekWidgetByName(this.panel_infomation,"text_time");
    this.text_time.setString("");
    this.schedule(this.updateTime,1);
    this.schedule(this.updateBuhua,0.3);
    this.text_room_id.setString('');
    this.text_msg.setVisible(false);

    this.btn_speak.addTouchEventListener(this.touchEvent, this);



    this.deskArray = new Array();
    this.idArray = new Array();

    this.btn_add = ccui.helper.seekWidgetByName(root,"btn_add");
    if (!cc.sys.isNative){
        this.btn_add.addClickEventListener(function () {
            majhong.net.addRobot(1, function (data) {
                JJLog.print('add rebot resp');
            });
        });
    }else{
        this.btn_add.setVisible(false);
    }
    
    //********quanzhou*********
    //花牌 显示数量UI 动画UI
    this.panel_huapai = ccui.helper.seekWidgetByName(root,"panel_huapai");
    this.imgHuaPaiArray[0] = ccui.helper.seekWidgetByName(this.panel_huapai,"img_buhua_self");
    this.imgHuaPaiArray[1] = ccui.helper.seekWidgetByName(this.panel_huapai,"img_buhua_right");
    this.imgHuaPaiArray[2] = ccui.helper.seekWidgetByName(this.panel_huapai,"img_buhua_up");
    this.imgHuaPaiArray[3] = ccui.helper.seekWidgetByName(this.panel_huapai,"img_buhua_left");


    this.textHuaPaiArray[0] = ccui.helper.seekWidgetByName(this.panel_head,"text_huapai_self");
    this.textHuaPaiArray[1] = ccui.helper.seekWidgetByName(this.panel_head,"text_huapai_right");
    this.textHuaPaiArray[2] = ccui.helper.seekWidgetByName(this.panel_head,"text_huapai_up");
    this.textHuaPaiArray[3] = ccui.helper.seekWidgetByName(this.panel_head,"text_huapai_left");

    this.listviewHuapaiArray[0] = ccui.helper.seekWidgetByName(this.panel_head,"listview_huapai_self");
    this.listviewHuapaiArray[1] = ccui.helper.seekWidgetByName(this.panel_head,"listview_huapai_right");
    this.listviewHuapaiArray[2] = ccui.helper.seekWidgetByName(this.panel_head,"listview_huapai_up");
    this.listviewHuapaiArray[3] = ccui.helper.seekWidgetByName(this.panel_head,"listview_huapai_left");

    this.image_huapaiclone = ccui.helper.seekWidgetByName(this.panel_head,"image_huapaiclone");

    this.imgHuaArray[0] = ccui.helper.seekWidgetByName(this.panel_head,"img_huapai_self");
    this.imgHuaArray[1] = ccui.helper.seekWidgetByName(this.panel_head,"img_huapai_right");
    this.imgHuaArray[2] = ccui.helper.seekWidgetByName(this.panel_head,"img_huapai_up");
    this.imgHuaArray[3] = ccui.helper.seekWidgetByName(this.panel_head,"img_huapai_left");

    this.img_kaijin = ccui.helper.seekWidgetByName(this.panel_huapai,"img_kaijin");
    this.jinpaiPos = ccui.helper.seekWidgetByName(this.panel_huapai,"jinpaiPos");
    this.img_jinIcon = ccui.helper.seekWidgetByName(this.panel_huapai,"img_jinIcon");
    this.actionsHuaPai = new Array();
    this.actionsJinPai = new Array();

    //---------quanzhou-----------

    this.panel_youjinAct = ccui.helper.seekWidgetByName(root,"panel_youjinAct");
    this.panel_youjinAct.setVisible(false);

    this.node_youzi = ccui.helper.seekWidgetByName(this.panel_youjinAct,"node_youzi");
    this.node_youjin = ccui.helper.seekWidgetByName(this.panel_youjinAct,"node_youjin");

  },

  showDissolveTip:function()
  {
    var dialog = new JJMajhongDecideDialog();
    if(hall.songshen == 1)
    {
        dialog.setDes('您未开始一局游戏,是否解散?');
    }else
    {
        dialog.setDes('您未开始一局游戏,解散房间不扣钻石,是否解散?');
    }
    dialog.showDialog();
    dialog.setCallback(function () {
      majhong.leavePrivateTable(0,function (data) {
        if(data['code'] == 200)
        {
          var hall2 = new MajhongHall();
          hall2.showHall();
        }else
        {
          if(data['err'] != undefined && data['err'] != null)
          {
            var dialog = new JJConfirmDialog();
            dialog.setDes(data['err']);
            dialog.showDialog();
          }
        }

      });
    });

  },

  startRecordSpeaker: function () {
    this.schedule(this.recordTime,1);
  },

  stopRecordSpeaker: function () {
    this.unschedule(this.recordTime);
  },

  resetRecordTime: function () {
      this.talkRecordTime = 0;
      this.beginSpeak = false;
      this.stopRecordSpeaker();
       JJLog.print('resetRecordTime ======' + this.speakTip != null);
      if(this.speakTip || !!this.speakTip || this.speakTip != null)
      {
          this.speakTip.dismiss();
          this.speakTip = null;
      }
  },

  recordTime: function (dt) {
    this.talkRecordTime++;
    if(this.talkRecordTime > 10)
    {
      this.autoSendRecord = true;
      this.resetRecordTime();
      majhong.net.send();
    }
  },

  touchEvent: function (sender, type) {
    switch (type) {
      case ccui.Widget.TOUCH_BEGAN:
      {
        JJLog.print('SPEAKER TOUCH_BEGAN 1======' + this.talkRecordTime);
        if(sender == this.btn_speak)
        {
//          this.intervalTouchSpeak = curTime;
          this.autoSendRecord = false;
          this.beginSpeak = true;
          JJLog.print('SPEAKER TOUCH_BEGAN 2======' + this.talkRecordTime);
          this.startRecordSpeaker();
          this.speakTip = new SpeakTip();
          this.speakTip.showTip();
          majhong.net.talk("","","");
        }
        break;
      }
      case ccui.Widget.TOUCH_MOVED:
      {
        //JJLog.print('SPAEKER TOUCH_MOVED ======');
      }
        break;

      case ccui.Widget.TOUCH_ENDED:
      {
        JJLog.print('SPEAKER TOUCH_ENDED   1=========' + this.talkRecordTime);
        if(sender == this.btn_speak && !this.autoSendRecord)
        {
          this.autoSendRecord = false;
          JJLog.print('SPEAKER TOUCH_ENDED   2=========' + this.talkRecordTime);
          majhong.net.send();
          this.resetRecordTime();
        }
      }
        break;

      case ccui.Widget.TOUCH_CANCELED:
      {
        JJLog.print('SPAEKER TOUCH_CANCELED   1=========' + this.talkRecordTime);
        if(sender == this.btn_speak && !this.autoSendRecord)
        {
          // JJLog.print('SPAEKER TOUCH_CANCELED   2=========' + this.talkRecordTime);
          majhong.net.send();
          this.resetRecordTime();
        }
      }
        break;

      default:
        break;
    }
  },

    //微信邀请
    onInviteWeChat: function () {
      sound.playBtnSound();
      var desc = majhong.table.getTableDes();
      hall.wxEnterRoom = majhong.table.tableId;
      hall.net.wxShareURL('泉州麻将,房号:'+ majhong.table.tableId , desc, 0);
    },


    setWaitMode: function () {
      this.panel_ready.setVisible(true);
      this.btn_ready.setVisible(false);
      this.resetImageReady();
      this.panel_desk.removeAllChildren();
    },

    resetImageReady: function () {
      for(var i = 0 ; i < this.imgReadyArray.length;i++)
      {
        this.imgReadyArray[i].setVisible(false);
      }
    },

    setTurnLightOff: function () {
      for(var i = 0;i<this.turnImgArr.length;i++)
      {
        this.turnImgArr[i].setOpacity(255);
        this.turnImgArr[i].setVisible(false);
        this.turnImgArr[i].stopAllActions();
      }
    },

    speaking: function () {

    },

    onSetting: function () {
      sound.playBtnSound();
      var set = new SetupDialog(1);
      set.showDialog();
    },

    updateBuhua: function (dt) {
      //********quanzhou*********
      if(!this.isDoHuaPaiAction && this.actionsHuaPai.length>0)
      {
        this.onBuHuaAction();
      }else if (!this.isDoHuaPaiAction && !this.isDoKaiJinAction && this.actionsHuaPai.length == 0 && this.actionsJinPai.length > 0)
      {
        this.isDoKaiJinAction = true;
        var data = this.actionsJinPai.shift();
        for(var j = 0; j < this.deskArray.length;j++)
        {
          if(this.deskArray[j] == undefined || this.deskArray[j] == null) continue;
          if(hall.user.uid== this.deskArray[j].uid)
          {
            this.img_kaijin.runAction(cc.sequence(cc.show(),cc.delayTime(0.3),cc.fadeOut(0.4),cc.callFunc(
                function(sender){
                  sender.setVisible(false);
                  sender.setOpacity(255);
                  this.isDoKaiJinAction = false;
                  if(!! this.jinpaiCard)
                  {
                    this.jinpaiCard.removeFromParent();
                  }
                  this.jinpaiCard = new CardShowUp(data);
                  this.jinpaiCard.setScale(CommonParam.JinPaiScale);
                  this.jinpaiCard.setPosition(cc.pAdd(this.img_kaijin.getPosition(),cc.p(-45,-72)));
                  this.panel_huapai.addChild(this.jinpaiCard);
                  this.jinpaiCard.runAction(cc.sequence(cc.delayTime(0.5),cc.moveTo(0.2,this.jinpaiPos.getPosition()),cc.callFunc(
                      function(){
                        this.img_jinIcon.setVisible(true);
                      },this)));
                  majhong.table.JinPaiId = data.type+data.value;
                  var event = new cc.EventCustom(CommonEventAction.KAIJIN_EVT);
                  event.setUserData(data);
                  cc.eventManager.dispatchEvent(event);

                  var event = new cc.EventCustom(CommonEventAction.PLAYEROP_EVT);
                  event.setUserData(false);
                  cc.eventManager.dispatchEvent(event);
                },this)));
            break;
          }
        }
      }
      //---------quanzhou-----------
    },

    updateTime: function (dt) {
      var date = new Date();
      var hour = date.getHours();
      var timeStr = '';
      if(hour < 10)
      {
        timeStr = '0'+hour+':';
      }else
      {
        timeStr = hour+':';
      }

      var minute = date.getMinutes();
      if(minute < 10)
      {
        timeStr = timeStr + '0'+minute+':';
      }else
      {
        timeStr = timeStr +minute+':';
      }

      var sec = date.getSeconds();

      if(sec < 10)
      {
        timeStr = timeStr + '0'+sec;
      }else
      {
        timeStr = timeStr +sec;
      }
      this.text_time.setString(timeStr);
    },


    onEnter: function () {
      JJLog.print('gamescene enter' + this._id);
        this._super();
       if (hall.songshen != 1) {
         var notice = new MajhongNotice(true);
         notice.setVisible(false);
         this.addChild(notice,100);
       }
       if(MajhongInfo.GameMode == GameMode.PLAY)
       {
         this.registerAllEvents();
         this.initTable();
         this.registerCustomEvt();
         hall.wxEnterRoom = 0;
       }else if(MajhongInfo.GameMode  == GameMode.RECORD)
       {
         this.panel_ready.setVisible(false);
         this.panel_option_waiting.setVisible(false);
         this.panel_option_playing.setVisible(false);
         this.btn_speak.setVisible(false);
         this.panel_cover.setVisible(false);
         this.panel_option_waiting.setVisible(false);

         var recordPanel = new RecordControll();
         this.addChild(recordPanel);
         recordPanel.x = 0;
         recordPanel.y = 0;

         this.initRecordInfo();


         var _this = this;
         var ls4 = cc.EventListener.create({
           event: cc.EventListener.CUSTOM,
           eventName: CommonEvent.EVT_RECORD,
           callback: function (event) {
             var userData = event.getUserData();
             if(userData == null) return;
             var evtId = userData['type'];
             if(evtId == RecordType.BUHUA)
             {
               var hua = userData['hua'];
               hua["uid"] = userData["uid"];
               _this.actionsHuaPai.push(hua);
               _this.onBuHuaAction();
             }
           }
         });
         var listener = cc.eventManager.addListener(ls4, this);
         this._Listeners.push(listener);
       }
    },

    onExit:function(){
      JJLog.print('gamescene exit' + this._id);
        if(MajhongInfo.GameMode == GameMode.PLAY)
        {
          this.removeAllEvents();
          majhong.table.deinit();
          this.removeCustomEvt();
        }else if(MajhongInfo.GameMode == GameMode.PLAY){

        }
      this.seatHeads.splice(0,4);
      this.seatHeads = null;
      majhong.record = null;
      this._super();

    },

    checkMsg: function (data) {
        if(data["code"] == NetErr.OK )
        {
            return true;
        }
        return false;
    },

    readyStatus: function () {
      var _this = this;
      majhong.table.ready( function (data) {
        _this.btn_ready.setVisible(false);
      });
    },

    initTable:function(){
        var _this = this;
        this.btn_ready.setVisible(false);
        majhong.table.initSeat(function(data){
          JJLog.print("init table response");
          JJLog.print(JSON.stringify(data));
              if(_this.checkMsg(data)){
                  majhong.table.initSeatInfo(data);
                  majhong.net.updateLocalPosition();
                  _this.showTableInfo(data['tableStatus']);
                  _this.showPanelPlayer(data['tableStatus']);
                  _this.checkGameStatus(data);
                 var infoPlayers = data['tableStatus']['players'];
                for(var i = 0 ; i < infoPlayers.length;i++)
                {
                  var ready = infoPlayers[i]['isReady'];
                  var uid =  infoPlayers[i]['uid'];
                  if(uid == hall.user.uid)
                  {
                    if (ready == 0)
                    {
                      majhong.table.ready( function (data) {
                      });
                    }
                    break;
                  }
                }
              }
        });
    },

    sendMsg:function()
    {
        sound.playBtnSound();
        var chat = new PDKChat();
        chat.showPanel();
    },

    addExistCard:function(data)
    {
      JJLog.print("game start" + this._id);
      JJLog.print(JSON.stringify(data));
      this.resetReady();
      var bankerId = data["banker"];
      for(var i = 0;i < this.deskArray.length;i++)
      {
        if(bankerId == this.deskArray[i].uid)
        {
          this.bankerIndex = i;
          break;
        }
      }

      majhong.table.bankerId = data["banker"];
      this.panel_desk.removeAllChildren();
      var desk = new GameDesk();
      this.panel_desk.addChild(desk);

      this.idArray = data['chairArr'];
      this.btn_add.setVisible(false);
    },

    registerAllEvents: function () {
        qp.event.listen(this, 'mjReadyStatus', this.onReadyStatus.bind(this));
        qp.event.listen(this, 'mjReadyStart', this.onReadyStart.bind(this));
        qp.event.listen(this, 'mjGameStart', this.onGameStart.bind(this));
        qp.event.listen(this, 'mjPlayerEnter', this.onPlayerEnter.bind(this));
        qp.event.listen(this, 'mjTableStatus', this.onTableStatus);
        qp.event.listen(this, 'mjNiaoPai', this.onNiaoPai);
        qp.event.listen(this, 'mjGameResult', this.onGameResult);
        qp.event.listen(this, 'mjSyncParams', this.onSyncParams);
        qp.event.listen(this, 'mjSyncPlayerMocards', this.onSyncPlayerMocards.bind(this));
        qp.event.listen(this, 'mjNotifyDelCards', this.onNotifyDelCards.bind(this));
        qp.event.listen(this, 'mjSyncDelCards', this.onSyncDelCards.bind(this));
        qp.event.listen(this, 'mjSyncPlayerOP', this.onSyncPlayerOP.bind(this));
        qp.event.listen(this, 'mjHaiDiPai', this.onHaiDiLao);
        qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);
        qp.event.listen(this, 'mjChatStatus', this.onReciveChat);

        qp.event.listen(this, 'mjGameOver', this.onGameOver);
        qp.event.listen(this, 'mjPlayerLeave', this.onPlayerLeave);
      //********quanzhou*********
        qp.event.listen(this, 'mjHuaPai', this.onHuaPai);
        qp.event.listen(this, 'mjSyncHuaPai', this.onSynHuaPai);
        qp.event.listen(this, 'mjJinPai', this.onJinPai);
        qp.event.listen(this, 'mjNotifyDaHu', this.onNotifyDaHu);
      //---------quanzhou-----------
      //synPlayerOp
      //mjPlayerLeave
      //mjGameOver
    },

    removeAllEvents: function () {
        qp.event.stop(this, 'mjReadyStatus');
        qp.event.stop(this, 'mjReadyStart');
        qp.event.stop(this, 'mjGameStart');
        qp.event.stop(this, 'mjPlayerEnter');
        qp.event.stop(this, 'mjTableStatus');
        qp.event.stop(this, 'mjNiaoPai');
        qp.event.stop(this, 'mjGameResult');
        qp.event.stop(this, 'mjSyncParams');
        qp.event.stop(this, 'mjSyncPlayerMocards');
        qp.event.stop(this, 'mjNotifyDelCards');
        qp.event.stop(this, 'mjSyncDelCards');
        qp.event.stop(this, 'mjSyncPlayerOP');
        qp.event.stop(this, 'mjHaiDiPai');
        qp.event.stop(this, 'mjDissolutionTable');
        qp.event.stop(this, 'mjChatStatus');
        qp.event.stop(this, 'mjGameOver');
        qp.event.stop(this, 'mjPlayerLeave');
      //********quanzhou*********
        qp.event.stop(this, 'mjHuaPai');
        qp.event.stop(this, 'mjSyncHuaPai');
        qp.event.stop(this, 'mjJinPai');
        qp.event.stop(this, 'mjNotifyDaHu');
      //---------quanzhou-----------
    },
  //********quanzhou*********
  onHuaPai:function (data) {
    if (data["uid"] == undefined || !data["uid"])
    {
      data.uid = hall.user.uid;
    }
    var event = new cc.EventCustom(CommonEventAction.PLAYEROP_EVT);
    event.setUserData(true);
    cc.eventManager.dispatchEvent(event);
    this.actionsHuaPai.push(data);
  },

  onSynHuaPai:function (data) {
    console.log(JSON.stringify(data));
    if (!!data.uid && data.uid != hall.user.uid)
    {
      this.actionsHuaPai.push(data);
    }
  },

  onJinPai:function (data) {
    var event = new cc.EventCustom(CommonEventAction.PLAYEROP_EVT);
    event.setUserData(true);
    cc.eventManager.dispatchEvent(event);
    this.actionsJinPai.push(data);
  },
  onNotifyDaHu:function (data) {
      // data.huType 1游金 2双游 3 三游 4三金倒  data.uid
      var huType = data['huType'];
      var uid = data['uid'];
      if(majhong.table.getTablePerson() == 2)
      {
        this.seatHeads[0] = this.seat_self;
        this.seatHeads[1] = this.seat_up;
      }else
      {
        this.seatHeads[0] = this.seat_self;
        this.seatHeads[1] = this.seat_right;
        this.seatHeads[2] = this.seat_up;
        this.seatHeads[3] = this.seat_left;
      }

      for(var i = 0 ; i < this.deskArray.length;i++)
      {
          if(this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
          if(uid == this.deskArray[i].uid)
          {
              var img = ccui.helper.seekWidgetByName(this.seatHeads[i],"image_tip");
              if(img && huType < 4)
              {
                  img.stopAllActions();
                  img.loadTexture("roving"+huType+".png",ccui.Widget.PLIST_TEXTURE)
                  img.setVisible(true);
                  img.setOpacity(0);
                  var fadeIn0 = cc.fadeIn(1);
                  var fadeOut0 = cc.fadeOut(1);
                  img.runAction(cc.repeatForever(cc.sequence(fadeIn0,fadeOut0)));
              }
              break;
          }
      }

      var imgStr ='';
      if(huType == 2)
      {
        imgStr = 'QZMJ_sy_txt_2.png';
      }else if (huType == 3)
      {
        imgStr = 'QZMJ_sy_txt_3.png';
      }
    var _this = this;
    _this.panel_youjinAct.setVisible(true);

    var img1 = new ccui.ImageView(imgStr, ccui.Widget.PLIST_TEXTURE);
    img1.setScale(5);
    var scale1 = cc.scaleTo(0.1, 1);
    var fadeIn1 = cc.fadeIn(0.1);
    img1.runAction(cc.sequence(
        cc.spawn(scale1, fadeIn1),
        cc.delayTime(0.1),
        cc.callFunc(function ()
        {
          var img2 = new ccui.ImageView('QZMJ_sy_txt_you.png', ccui.Widget.PLIST_TEXTURE);
          img2.setScale(5);
          var scale2 = cc.scaleTo(0.1, 1);
          var fadeIn2 = cc.fadeIn(0.1);
          img2.runAction(cc.sequence(
              cc.spawn(scale2, fadeIn2),
              cc.delayTime(1),
              cc.callFunc(function ()
              {
                _this.panel_youjinAct.setVisible(false);
              }),
              cc.removeSelf()
          ));
          _this.node_youzi.addChild(img2,200);
        }),
        cc.delayTime(2),
        cc.removeSelf()
    ));

    _this.node_youjin.addChild(img1,200);

  },

  onBuHuaAction:function() {
    this.isDoHuaPaiAction = true;
    var data = this.actionsHuaPai.shift();
    for(var j = 0; j < this.deskArray.length;j++)
    {
      if(data.uid== this.deskArray[j].uid)
      {
        this.textHuaPaiArray[j].setString(data.huaNum);
        var huapais = data['huaPai'];
        var json = ccs.load("res/MajhongBase/Buhua.json");
        var buhuaAction = json.action;
        var buhuaRoot = json.node;
        var listviewHuapai = this.listviewHuapaiArray[j];
        this.imgHuaPaiArray[j].addChild(buhuaRoot);
        buhuaRoot.runAction(buhuaAction);
        buhuaAction.play('action',false);
        buhuaAction.setLastFrameCallFunc(function () {
          buhuaRoot.removeFromParent();
          this.isDoHuaPaiAction = false;
          if(huapais != null && huapais.length>0)
          {
            for(var i =0;i<huapais.length;i++)
            {
              var huapai = this.image_huapaiclone.clone();
              huapai.loadTexture("QZMJ_BuhuaStatus_"+ (huapais[i]['value']-1)+".png",ccui.Widget.PLIST_TEXTURE);
              var layout = new ccui.Layout();
              layout.setContentSize(huapai.getContentSize());
              huapai.x= 0;
              huapai.y = 0;
              layout.addChild(huapai);
              this.listviewHuapaiArray[j].pushBackCustomItem(layout);
            }

          }

          if(data.uid == hall.user.uid && MajhongInfo.GameMode == GameMode.PLAY) {
            var event = new cc.EventCustom(CommonEventAction.BUHUA_EVT);
            event.setUserData(data);
            cc.eventManager.dispatchEvent(event);
            if (this.actionsHuaPai.length == 0 && !!majhong.table.JinPaiId) {
              var event = new cc.EventCustom(CommonEventAction.PLAYEROP_EVT);
              event.setUserData(false);
              cc.eventManager.dispatchEvent(event);
            }
          }
        }.bind(this));
        break;
      }
    }
  },

  resetBuhua: function () {
    this.img_jinIcon.setVisible(false);
    this.isDoHuaPaiAction = false;
    this.isDoKaiJinAction = false;
    if(!!this.jinpaiCard)
    {
      this.jinpaiCard.removeFromParent();
      this.jinpaiCard = null;
    }
    for(var i = 0 ; i < this.imgHuaArray.length;i++) {
      this.imgHuaArray[i].setVisible(false);
    }
    for(var i = 0 ; i < this.listviewHuapaiArray.length;i++) {
      this.listviewHuapaiArray[i].removeAllChildren();
    }

  },

  showBuhuaPanel: function () {
    for(var i = 0 ; i < this.textHuaPaiArray.length;i++) {
      this.textHuaPaiArray[i].setString("0");
    }

    for(var i = 0 ; i < this.imgHuaArray.length;i++) {
      this.imgHuaArray[i].setVisible(false);
    }

    for(var i = 0 ; i < this.listviewHuapaiArray.length;i++) {
      this.listviewHuapaiArray[i].removeAllChildren();
    }
    this.img_kaijin.setVisible(false);
    this.img_kaijin.setOpacity(255);
  },

  //---------quanzhou-----------

    showTableInfo:function(data)
    {
      JJLog.print("桌子="+JSON.stringify(data));
      majhong.table.tableId = data['tableId'];
      this.text_room_id.setString(data['tableId']);
      majhong.table.status = data['tableStatus'];
      majhong.table.chairArr = data['chairArr'];
      this.idArray = data['chairArr'];
      if(majhong.table.getTablePerson() == 2)
      {
        this.listviewHuapaiArray[0] = ccui.helper.seekWidgetByName(this.panel_head,"listview_huapai_self");
        this.listviewHuapaiArray[1] = ccui.helper.seekWidgetByName(this.panel_head,"listview_huapai_up");

        this.imgHuaPaiArray[0] = ccui.helper.seekWidgetByName(this.panel_huapai,"img_buhua_self");
        this.imgHuaPaiArray[1] = ccui.helper.seekWidgetByName(this.panel_huapai,"img_buhua_up");

        this.turnImgArr[0] =  ccui.helper.seekWidgetByName(this.image_dirc,"image_east");
        this.turnImgArr[1] =  ccui.helper.seekWidgetByName(this.image_dirc,"image_west");

        this.seatHeads[0] = this.seat_self;
        this.seatHeads[1] = this.seat_up;

        this.imgReadyArray[0] = ccui.helper.seekWidgetByName(this.panel_ready,"img_ready_self");
        this.imgReadyArray[1] = ccui.helper.seekWidgetByName(this.panel_ready,"img_ready_up");
      }else if(majhong.table.getTablePerson() == 3)
      {
        this.listviewHuapaiArray[0] = ccui.helper.seekWidgetByName(this.panel_head,"listview_huapai_self");
        this.listviewHuapaiArray[1] = ccui.helper.seekWidgetByName(this.panel_head,"listview_huapai_right");
        this.listviewHuapaiArray[2] = ccui.helper.seekWidgetByName(this.panel_head,"listview_huapai_left");

        this.imgHuaPaiArray[0] = ccui.helper.seekWidgetByName(this.panel_huapai,"img_buhua_self");
        this.imgHuaPaiArray[1] = ccui.helper.seekWidgetByName(this.panel_huapai,"img_buhua_right");
        this.imgHuaPaiArray[2] = ccui.helper.seekWidgetByName(this.panel_huapai,"img_buhua_left");

        this.turnImgArr[0] =  ccui.helper.seekWidgetByName(this.image_dirc,"image_east");
        this.turnImgArr[1] =  ccui.helper.seekWidgetByName(this.image_dirc,"image_south");
        this.turnImgArr[2] =  ccui.helper.seekWidgetByName(this.image_dirc,"image_north");

        this.seatHeads[0] = this.seat_self;
        this.seatHeads[1] = this.seat_right;
        this.seatHeads[2] = this.seat_left;

        this.imgReadyArray[0] = ccui.helper.seekWidgetByName(this.panel_ready,"img_ready_self");
        this.imgReadyArray[1] = ccui.helper.seekWidgetByName(this.panel_ready,"img_ready_right");
        this.imgReadyArray[2] = ccui.helper.seekWidgetByName(this.panel_ready,"img_ready_left");
      }

      this.setDirectionIndicator();
      this.showPanelReady(data);
      this.showPanelHead(data);
      this.showPanelInfomation(data);
      this.showPanelPlaying(data);
      this.showPanelStatus(data);
      this.showPanelWaiting(data);
    },

    showPanelWaiting: function (data) {

        switch(majhong.table.status)
        {
          case GameStatus.SEATING:
          {
            this.panel_option_waiting.setVisible(true);
            this.btn_invite_wechat.setVisible(true);
            if(hall.songshen == 1)
            {
              this.btn_invite_wechat.setVisible(false);
            }
            if(data['isRePrivateTable'] !=null && data['isRePrivateTable'] !=undefined && data['isRePrivateTable'] == 1)  //代开房间
            {
              this.btn_dissolve.setVisible(false);
              this.btn_back_hall.setVisible(true);
            }else
            {
              this.btn_dissolve.setVisible(data['fangZhu'] == hall.user.uid);
              this.btn_back_hall.setVisible(data['fangZhu'] != hall.user.uid);
            }
          }
            break;
          case GameStatus.WATING:
          {
            this.panel_option_waiting.setVisible(false);
          }
            break;
          case GameStatus.PLAYING:
          {
            this.panel_option_waiting.setVisible(false);
          }
            break;
        }
    },

    showPanelPlaying: function (data) {

      switch(majhong.table.status)
      {
        case GameStatus.SEATING:
        {
          this.panel_option_playing.setVisible(false);
        }
          break;
        case GameStatus.WATING:
        {
            this.panel_option_playing.setVisible(true);
            this.btn_setting.setVisible(false);
            this.btn_msg.setVisible(false);
        }
          break;
        case GameStatus.PLAYING:
        {
          this.panel_option_playing.setVisible(true);
          this.btn_setting.setVisible(true);
          this.btn_msg.setVisible(true);
        }
          break;
      }
    },

    showPanelInfomation: function (data) {
      this.panel_infomation.setVisible(true);
      this.btn_speak.setVisible(true);

      this.text_room_id.setString(data['tableId']);
      this.totalRound = data['roundsTotal'];
       var desc = majhong.table.getTableDes();
      this.text_msg.setString(desc);
      this.text_msg.setVisible(true);
    },

    showPanelStatus: function (data) {
      switch(majhong.table.status)
      {
        case GameStatus.SEATING:
        {
          this.panel_status.setVisible(false);
        }
          break;
        case GameStatus.WATING:
        {
          this.panel_status.setVisible(false);
        }
          break;
        case GameStatus.PLAYING:
        {
          this.panel_status.setVisible(true);
          this.text_clock.setString('20');
	  if(data['havePai'] != undefined)
          {
            this.text_count.setString(''+data['havePai']);
          }

          if(data['isOffline'] == 1)
          {
            if(this.oneKe > 0 )
            {
              this.text_round.setString(data['currRounds']);
            }
            else
            {
              this.text_round.setString(data['currRounds']+'/'+data['roundsTotal']);
            }
          }else
          {
            if(this.oneKe > 0 )
            {
              this.text_round.setString(data['currRounds']);
            }
            else
            {
              this.text_round.setString(data['currRounds']+'/'+this.totalRound);
            }
          }
        }
          break;
      }
    },

    showPanelReady: function (data) {
      switch(majhong.table.status)
      {
        case GameStatus.SEATING:
        {
          this.panel_ready.setVisible(true);
          this.btn_ready.setVisible(false);
          this.resetImageReady();
        }
          break;
        case GameStatus.WATING:
        {
          this.panel_ready.setVisible(true);
          this.btn_ready.setVisible(false);
          this.resetImageReady();

        }
          break;
        case GameStatus.PLAYING:
        {
          this.panel_ready.setVisible(false);
          this.btn_ready.setVisible(true);
          this.resetImageReady();
          //********quanzhou*********
          this.showBuhuaPanel();
          //---------quanzhou-----------
        }
          break;
      }
    },

    showPanelHead: function (data) {
      this.panel_head.setVisible(true);
    },

    showPanelPlayer: function (data) {
      this.addSelfDesk();
      this.addRightDesk();
      this.addUpDesk();
      this.addLeftDesk();

      if(majhong.table.status == GameStatus.WATING || majhong.table.status == GameStatus.SEATING)
      {
        var infoPlayers = data['players'];
        for(var i = 0 ; i < infoPlayers.length;i++)
        {
          var ready = infoPlayers[i]['isReady'];
          var uid =  infoPlayers[i]['uid'];

          for(var j = 0; j < this.deskArray.length;j++)
          {
            if(this.deskArray[j] && uid == this.deskArray[j].uid)
            {
              if(ready == 1)
              {
                this.imgReadyArray[j].setVisible(true);
              }else
              {
                this.imgReadyArray[j].setVisible(false);
                if(hall.user.uid == uid)
                {
                  this.imgReadyArray[j].setVisible(true);
                  //this.btn_ready.setVisible(true);
                }
              }
              break;
            }
          }
        }
      }

    },

    addSelfDesk: function () {
      this.deskArray[0] = new DeskHead(majhong.table.selfSeatInfo());
      this.seat_self.addChild(this.deskArray[0],1,1);
      var frame = ccui.helper.seekWidgetByName(this.seat_self, "image_frame");
      frame.setVisible(false);
    },

    addRightDesk:function(){
      var info = majhong.table.rightSeatInfo();
      if(info != null)
      {
        JJLog.print('add right' + this._id);
        this.seat_right.removeChildByTag(1,true);
        this.deskArray[1] = new DeskHead(info);
        this.seat_right.addChild(this.deskArray[1],1,1);

        var frame = ccui.helper.seekWidgetByName(this.seat_right, "image_frame");
        frame.setVisible(false);
      }
    },

    addUpDesk: function () {
      var info = majhong.table.upSeatInfo();
      if(info != null)
      {
        JJLog.print('add up' + this._id);
        this.upDesk = null;
        this.seat_up.removeChildByTag(1,true);
        if(majhong.table.getTablePerson() == 2)
        {
          this.deskArray[1] = new DeskHead(info);
          this.seat_up.addChild(this.deskArray[1],1,1);
        }else
        {
          this.deskArray[2] = new DeskHead(info);
          this.seat_up.addChild(this.deskArray[2],1,1);
        }

        var frame = ccui.helper.seekWidgetByName(this.seat_up, "image_frame");
        frame.setVisible(false);
      }
    },

    addLeftDesk: function () {
      var info = majhong.table.leftSeatInfo();
      if(info != null)
      {
        this.leftDesk = null;
        this.seat_left.removeChildByTag(1,true);
        this.deskArray[3] = new DeskHead(info);
        this.seat_left.addChild(this.deskArray[3],1,1);
        var frame = ccui.helper.seekWidgetByName(this.seat_left, "image_frame");
        frame.setVisible(false);
      }
    },

  checkGameStatus: function (data) {
    if(data['tableStatus']['isOffline'] == 1)
    {
      JJLog.print("断线重连="+JSON.stringify(data));
      sound.playBgSound();
      majhong.table.isOffline = true;
      majhong.table.offLineInfo['currOp'] =  data["tableStatus"]['currOp'];
      majhong.table.offLineInfo['nextChuPai'] = data["tableStatus"]['nextChuPai'];
      this.panel_desk.removeAllChildren();
      var players = data["tableStatus"]['players'];
      this.btn_setting.setVisible(players.length == majhong.table.getTablePerson());
      this.panel_option_playing.setVisible(players.length == majhong.table.getTablePerson());
      if(data['tableStatus']['tableStatus'] == GameStatus.PLAYING)
      {
        if(!!data["tableStatus"]["jin"] && !!data["tableStatus"]["jin"]["type"]) {
          if (!!this.jinpaiCard) {
            this.jinpaiCard.removeFromParent();
          }
          this.jinpaiCard = new CardShowUp(data["tableStatus"]["jin"]);
          this.jinpaiCard.setScale(CommonParam.JinPaiScale);
          this.jinpaiCard.setPosition(this.jinpaiPos.getPosition());
          this.panel_huapai.addChild(this.jinpaiCard);
          this.img_jinIcon.setVisible(true);
          majhong.table.JinPaiId = data["tableStatus"]["jin"].type + data["tableStatus"]["jin"].value;
        }

        this.btn_add.setVisible(false);
        var desk = new GameDesk();
        this.panel_desk.addChild(desk);
        for(var i = 0 ; i < this.textHuaPaiArray.length;i++) {
          this.textHuaPaiArray[i].setString("0");
        }

        for(var i = 0 ; i < this.listviewHuapaiArray.length;i++) {
          this.listviewHuapaiArray[i].removeAllChildren();
        }

        for(var j = 0; j < this.deskArray.length;j++)
        {
           for (var i = 0;i<players.length;i++)
           {
             var player = players[i];
             if(player.uid== this.deskArray[j].uid)
             {
               var huType = player['huType'];
               var huapais = player['huaPai'];
              if(!!huType && huType > 1 && huType < 4)
              {
                  var img = ccui.helper.seekWidgetByName(this.seatHeads[j],"image_tip");
                  img.loadTexture("roving"+huType+".png",ccui.Widget.PLIST_TEXTURE)
                  img.setVisible(true);
                  img.setOpacity(0);
                  var fadeIn0 = cc.fadeIn(1);
                  var fadeOut0 = cc.fadeOut(1);
                  img.runAction(cc.repeatForever(cc.sequence(fadeIn0,fadeOut0)));
               }
               if(huapais != null && huapais.length>0)
               {
                 for(var i =0;i<huapais.length;i++)
                 {
                   var huapai = this.image_huapaiclone.clone();
                   huapai.loadTexture("QZMJ_BuhuaStatus_"+ (huapais[i]['value']-1)+".png",ccui.Widget.PLIST_TEXTURE);
                   var layout = new ccui.Layout();
                   layout.setContentSize(huapai.getContentSize());
                   layout.addChild(huapai);
                   huapai.x = 0;
                   huapai.y = 0;
                   this.listviewHuapaiArray[j].pushBackCustomItem(layout);
                 }

               }
               this.textHuaPaiArray[j].setString(player.huaNum);
               break
             }
           }
        }
      }
      //
      this.reLoadDirectionIndicator(data['tableStatus']);
      this.setBankerId(data['tableStatus']);

      //海底捞 弹出框
      if(data['tableStatus']['haidiUid'] == hall.user.uid)
      {
        var haidilao = new HaidiLaoDialog(0);
        haidilao.showDialog();
      }

      //解散房间
      if(data['tableStatus']['dissolutionTable'] != -1 && data['tableStatus']['dissolutionTable']['result'] != 1)
      {
        var disarr = data['tableStatus']['dissolutionTable']['disArr'];
        var isDisarr = true;
        var disUid = {};
        for(var k = 0 ; k < disarr.length;k++)
        {
          if(k == 0)
          {
            disUid['uid'] = disarr[k];
          }
          if(hall.user.uid == disarr[k])
          {
            isDisarr = false;
          }
        }

        if(isDisarr)
        {
          var option = new DissloveOptionDialog(disUid);
          option.showDialog();
        }else
        {
          var option = new DissloveResultDialog(disarr,data['tableStatus']['dissolutionTable']['time']);
          option.showDialog();
        }
      }
    }
  },

  setBankerId: function (data) {
    var bankerId = data['banker'];
    majhong.table.bankerId = bankerId;
    for(var i = 0 ; i < this.deskArray.length;i++)
    {
      if(this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
      this.deskArray[i].setBanker(this.deskArray[i].uid == bankerId);
      this.deskArray[i].setBankerCount(data);
    }
  },

  onPlayerLeave: function (data) {
    JJLog.print('mjPlayerLeave' + this._id);
    JJLog.print(JSON.stringify(data));
    for(var i = 0 ; i < this.deskArray.length ;i++)
    {
      if(this.deskArray[i] == undefined || this.deskArray[i] == null) continue;

      if(data['uid'] == this.deskArray[i].uid)
      {

        var parentPanel = this.deskArray[i].getParent();
        var frame = ccui.helper.seekWidgetByName(parentPanel, "image_frame");
        frame.setVisible(true);
        this.deskArray[i].removeFromParent();
        this.deskArray[i] = null;
        this.imgReadyArray[i].setVisible(false);
      }
    }

    if(majhong.table.status == GameStatus.SEATING && data['uid'] == data['fangZhu']&& majhong.table.isRePrivateTable != 1)
    {
      majhong.net.imRoomId = -1;
      if (cc.sys.isNative)
      {
        GameLink.onUserLeaveRoom();
      }
      var hall2 = new MajhongHall();
      hall2.showHall();
    }

    if(majhong.table.status == GameStatus.SEATING && data['uid'] == hall.user.uid && majhong.table.isRePrivateTable == 1)
    {
      majhong.net.imRoomId = -1;
      if (cc.sys.isNative)
      {
        GameLink.onUserLeaveRoom();
      }
      var hall2 = new MajhongHall();
      hall2.showHall();
    }
  },
    //游戏状态
    onGameStart:function(data)
    {
      JJLog.print("game start id =" + this._id);
      JJLog.print("start info=" + JSON.stringify(data));
      majhong.table.status = GameStatus.PLAYING;
      majhong.table.JinPaiId = null;
      majhong.table.isOffline = false;
      majhong.table.offLineInfo = {};
      majhong.table.chairArr = data['chairArr'];
      this.idArray = data['chairArr'];
      majhong.table.bankerId = data["banker"];
      var bankerId = data["banker"];

      for(var i = 0;i < this.deskArray.length;i++)
      {
        if(bankerId == this.deskArray[i].uid)
        {
          this.bankerIndex = i;
        }
      }

      this.resetReady();
      this.showPanelPlaying(data);
      this.showPanelWaiting(data);
      this.showPanelStatus(data);
      this.showPanelReady(data);

      this.panel_desk.removeAllChildren();
      var desk = new GameDesk();
      this.panel_desk.addChild(desk);

      this.btn_add.setVisible(false);

      this.resultData = null;
      this.totalIndex = 0;
      this.nowIndex = 0;
      this.niaoPosArray = [];

      sound.playBgSound();

      this.turnUid = bankerId;
      this.startClock(Times.OPERATETIME);
      this.setTurnLightOff();
      this.turnImgArr[this.bankerIndex].setVisible(true);
      this.turnImgArr[this.bankerIndex].runAction(cc.repeatForever(
          cc.sequence(
              cc.fadeTo(1.0,100),
              cc.fadeTo(0.8,255)
          )));

    },



    onReadyStart: function (data) {

    },

    onReadyStatus: function (data) {
      var status = data['readyStatus'];//0,1
      var uid = data['uid'];
      for(var i = 0 ; i < this.deskArray.length;i++)
      {
        if(this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
        if(uid == this.deskArray[i].uid)
        {
          if(status == 1)
          {
            this.imgReadyArray[i].setVisible(true);
          }else
          {
            this.imgReadyArray[i].setVisible(false);
          }
          break;
        }
      }
    },

    onSyncPlayerMocards: function (data) {
      JJLog.print('onSyncPlayerMocards');
      JJLog.print(data);
      this.turnUid = data['uid'];
      this.startClock(Times.OPERATETIME);
      var  uid = data['uid'];
      var  pos = 0;
      for(var i = 0;i <this.deskArray.length;i++)
      {
        if(this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
        if(this.deskArray[i].uid == uid)
        {
          pos = i;
          break;
        }
      }

      this.setTurnLightOff();
      this.turnImgArr[pos].setVisible(true);
      this.turnImgArr[pos].runAction(cc.repeatForever(
          cc.sequence(
              cc.fadeTo(1.0,100),
              cc.fadeTo(0.8,255)
          )));

    },

    onNotifyDelCards:function(data)
    {
      var  uid = data['uid'];
      if(this.turnUid == uid) return;
      this.startClock(Times.OPERATETIME);
      this.turnUid = uid
      var  pos = 0;
      for(var i = 0;i <this.deskArray.length;i++)
      {
        if(this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
        if(this.deskArray[i].uid == uid)
        {
          pos = i;
          break;
        }
      }

      this.setTurnLightOff();
      this.turnImgArr[pos].setVisible(true);
      this.turnImgArr[pos].runAction(cc.repeatForever(
                    cc.sequence(
                        cc.fadeTo(1.0,100),
                        cc.fadeTo(0.8,255)
                        )));
    },

    onSyncDelCards: function (data) {
      this.stopClock();
    },

    onReciveChat:function (data) {
        JJLog.print(JSON.stringify(data));
        var uid = data['uid'];
        var type = data['data']['type'];
        var index = data['data']['index'];
        var content = data['data']['content'];
        for(var i = 0 ; i < this.deskArray.length;i++)
        {
            if(uid == this.deskArray[i].uid)
            {
                if(type == CHAT_TYPE.Usual)
                {
                    this.deskArray[i].showMsg(index,content);
                }else
                {
                    this.deskArray[i].showFace(index);
                }
                break;
            }
        }
    },

  onGameResult: function (data) {
    this.resetDeskMode();
    this.resultData = data;
    JJLog.print("结束通知="+ JSON.stringify(data));
    if(data['roundResult'] == 0)
    {
      var result = new RoundResult(data,this);
      result.showResult();
    }
    //********quanzhou*********
    this.resetBuhua();
    //---------quanzhou-----------

  },

    onGameOver: function (data) {
      JJLog.print('GameOver Response -- -- -- -- ' + JSON.stringify(data));
      majhong.table.report = data;
      if(this.resultData && this.resultData["isOver"] == 1)
      {
        return;
      }
      var tip = new JJConfirmDialog();
      var str = '经玩家 ';
      for(var i = 0 ; i <data['players'].length;i++)
      {
        str += ('【'+ base64.decode(data['players'][i]['nickName'])+'】');
      }
      str += ('同意,房间解散成功!');
      tip.setDes(str);
      tip.setCallback(function () {
        JJLog.print('this is test callback');
        var endReport = new MajhongEndResult();
        endReport.showGameResult();
      });
      tip.showDialog();
    },

    registerCustomEvt: function ()
    {
      var _this = this;

      var ls = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: CommonEvent.EVT_DESK_MODE,
        callback: this.updateDeskMode.bind(this)
      });
      var listener = cc.eventManager.addListener(ls,this);
      this._Listeners.push(listener);

      var ls2 = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: CommonEvent.EVT_DESK_RESULT_INDEX,
        callback: this.indexCallback.bind(this)
      });
      listener = cc.eventManager.addListener(ls2,this);
      this._Listeners.push(listener);

      var ls3 = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: CommonEvent.EVT_GAMING,
        callback: function(data)
        {
          console.log(data);
          var dialog = new JJConfirmDialog();
          dialog.setCallback(function () {
            var hall2 = new MajhongHall();
            hall2.showHall();
          });
          dialog.setDes('房间已经解散了！');
          dialog.showDialog();
        }
      });
      listener = cc.eventManager.addListener(ls3,this);
      this._Listeners.push(listener);
      //切换桌面背景事件
      var ls5 = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: CommonEvent.ChangeGameSceneBg,
        callback: function (event) {
          var background_bg = util.getCacheItem('background_bg');
          if(background_bg == 2)
          {
            _this.image_Bg.loadTexture('res/background/mahjong_tabl_1.png',ccui.Widget.LOCAL_TEXTURE);
          }else
          {
            _this.image_Bg.loadTexture('res/background/mahjong_tabl_0.png',ccui.Widget.LOCAL_TEXTURE);
          }
        }
      });
      var listener2 = cc.eventManager.addListener(ls5, this);
      this._Listeners.push(listener2);
    },

    removeCustomEvt: function ()
    {
      for(var i=0;i< this._Listeners.length;i++)
      {
        cc.eventManager.removeListener(this._Listeners[i]);
      }
      this._Listeners.splice(0,this._Listeners.length);
    },

    indexCallback: function (event) {
      JJLog.print('index call back');
      JJLog.print(event);
      this.nowIndex++;
      JJLog.print('nowIndex = '+this.nowIndex+ ' allIndex = '+this.totalIndex );

      if(this.nowIndex+1 == this.totalIndex)
      {
        var niao = new JJZhuaNiaoAnim(this.niaoPosArray);
        cc.director.getRunningScene().addChild(niao);
      }

      if(this.nowIndex == this.totalIndex && this.resultData['roundResult'] == 1)
      {
          var result  = new RoundResult(this.resultData,this);
          result.showResult();
      }
    },

    onSyncParams: function (data) {
        JJLog.print('mySyncParams');
        JJLog.print(JSON.stringify(data));
        var num = data['havePai'];
      if(num != undefined)
      {
        this.text_count.setString(num);
      }

    },
  onHaiDiLao: function (data) {
    JJLog.print('onHaiDiLao');
    JJLog.print(JSON.stringify(data));
    if(1 ==  data['type'])
    {
      this.totalIndex++;
      var haidilao = new HaidiLaoDialog(1,data['pai']);
      haidilao.showDialog();
    }

    if(data['uid'] == hall.user.uid)
    {
      if(0 == data['type'])
      {
        var haidilao = new HaidiLaoDialog(0);
        haidilao.showDialog();
      }
    }


  },

  onDissolutionTable: function (data) {
    JJLog.print('onDissolutionTable ');
    JJLog.print(JSON.stringify(data));

    if(data['result'] == 0)//0拒绝解散
    {
      var tip = new JJConfirmDialog();
      var nickName = base64.decode(majhong.table.uidOfInfo(data['uid'])["nickName"]);
      tip.setDes('玩家'+'【'+ nickName +'】' + '拒绝解散房间,解散房间失败！');
      tip.setCallback(function () {
        JJLog.print('this is test callback');
      });
      tip.showDialog();
    }else if(data['result'] == 1)//1解散成功
    {

    }else if(data['result'] == -1)
    {
      if(data['status'] == 1)
      {
        if(data['uid'] == hall.user.uid)
        {
          var result = new DissloveResultDialog();
          result.showDialog();
        }else
        {
          var option = new DissloveOptionDialog(data);
          option.showDialog();
        }
      }
    }
  },

    resetReady: function () {
        this.totalIndex = 0;
        this.nowIndex = 0;
        this.panel_ready.setVisible(false);
        for(var i = 0 ; i < this.imgReadyArray.length;i++) {
          this.imgReadyArray[i].setVisible(false);
        }
        this.btn_ready.setVisible(false);
    },

    showReady: function () {
      this.panel_desk.removeAllChildren();
      this.btn_setting.setVisible(true);
      this.panel_ready.setVisible(true);
      this.btn_ready.setVisible(true);
      this.readyStatus();

    },

    checkResp: function (data) {
        if(data["code"] == 200)
        {
            return true;
        }
        return false;
    },


    onTableStatus: function (data) {
        JJLog.print(" gamescene ontablestatus");
        JJLog.print(JSON.stringify(data));
    },

    onSyncPlayerOP: function (data) {
      var msg = data["msg"];
      var opType = msg["opType"];
      var  uid = data['uid'];
      if(opType == OPERATIONNAME.HU)
      {
        var cards = data['msg']['cards'];
        for(var i =0 ; i< cards.length;i++){
          this.totalIndex++;
          JJLog.print('onSyncPlayerOP total index = '+ this.totalIndex);
        }
      }

      if(this.turnUid == -1 ||this.turnUid == uid || opType == OPERATIONNAME.HU ) return;
      this.startClock(Times.OPERATETIME);
      this.turnUid = uid
      var  pos = 0;
      for(var i = 0;i <this.deskArray.length;i++)
      {
        if(this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
        if(this.deskArray[i].uid == uid)
        {
          pos = i;
          break;
        }
      }
      this.setTurnLightOff();
      this.turnImgArr[pos].setVisible(true);
      this.turnImgArr[pos].runAction(cc.repeatForever(
          cc.sequence(
              cc.fadeTo(1.0,100),
              cc.fadeTo(0.8,255)
          )));

    },

    onNiaoPai: function (data) {
      JJLog.print("niao pai resp total index = "+this.totalIndex);
      JJLog.print(JSON.stringify(data));
        var niaoArr = data['niao'];
        if (niaoArr.length>0)
        {
          this.totalIndex++;
        }
        var posArray = new Array();
        for(var i = 0; i < niaoArr.length;i++)
        {
            var value = niaoArr[i]['value'];
            var pos = value%4;
            switch (pos)
            {
                case 0: posArray[i] = this.bankerIndex == 0?3:this.bankerIndex -1 ;
                    break;
                case 1: posArray[i] = this.bankerIndex;
                    break;
                case 2: posArray[i] = this.bankerIndex == 3?0 : this.bankerIndex + 1;
                    break;
                case 3: posArray[i] = this.bankerIndex < 2 ? this.bankerIndex+2 : this.bankerIndex -2;
                    break;
            }
        }

        var niaoPosArray = new Array();
        var lastIndex = 0;
        for(var i = 0;i < posArray.length;i++)
        {
            var delayT = 0;
            var index = posArray[i];

            lastIndex = index;
            if(this.deskArray[index] != null && this.deskArray[index] != undefined)
            {
              var parentNode = this.deskArray[index].getParent();
              var size = this.deskArray[index];
              niaoPosArray[i] = cc.p(parentNode.getPosition().x + size.width/2,parentNode.getPosition().y + size.height/2);
              JJLog.print(niaoPosArray[i]);

            }else
            {
                JJLog.print(" parent null");
            }
        }

      this.niaoPosArray = niaoPosArray;
    },

    onPlayerEnter: function (data) {
        JJLog.print("gamescene player enter" + this._id);
        //this.setDirectionIndicator(data);

        if(!majhong.table.inited) return;

        var userData = data["user"];
        var pos = userData["position"];
        majhong.table.setSeatPosInfo(userData);
      console.log(majhong.table.getTablePerson()+"@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      if(majhong.table.getTablePerson() == 2)
      {
        this.addUpDesk();
      }else if(majhong.table.getTablePerson() == 3)
      {


      }else
      {
        var selfp = majhong.table.selfPos;
        if(pos > majhong.table.selfPos)
        {
          var a = pos - selfp;
          switch (a)
          {
            case 1: this.addRightDesk(); break;
            case 2: this.addUpDesk(); break;
            case 3: this.addLeftDesk(); break;
            default : break;
          }
        }else
        {
          var a = selfp -pos;
          switch (a)
          {
            case 3: this.addRightDesk(); break;
            case 2: this.addUpDesk(); break;
            case 1: this.addLeftDesk(); break;
            default : break;
          }
        }
      }
      var isshow = true;
      for(var i = 0; i < 4;i++)
      {
        if(this.deskArray[i] == undefined || this.deskArray[i] == null)
        {
          isshow = false;
          break;
        }
      }
      this.btn_setting.setVisible(isshow);
    },


    reLoadDirectionIndicator: function (data) {
      var nextChupaiId = data['nextChuPai'];
      var chuPaiPos = 0;
      for(var i = 0;i <this.deskArray.length;i++)
      {
        if(this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
        if(this.deskArray[i].uid == nextChupaiId)
        {
          chuPaiPos = i;
          break;
        }
      }
      this.turnUid = nextChupaiId;
      this.setTurnLightOff();
      if(nextChupaiId == -1) return;
      this.turnImgArr[chuPaiPos].setVisible(true);
      this.turnImgArr[chuPaiPos].runAction(cc.repeatForever(
        cc.sequence(
          cc.fadeTo(1.0,100),
          cc.fadeTo(0.8,255)
        )));
    },

    setDirectionIndicator:function(){
      var pos = 0;
      for ( var i = 0;i < this.idArray.length;i++)
      {
        if(this.idArray[i] == hall.user.uid) {
          pos = i;
          break;
        }
      }
      //东 南 西 北
      var rotation = [[0,1,2,3],[1,2,3,0],[2,3,0,1],[3,0,1,2]];
      for(var i = 0;i<4;i++)
      {
          var rot = rotation[pos][i];
          this.image_dirc.getChildByName("image_"+i).loadTexture("mahjong_play_table_info_"+rot+"_2.png",ccui.Widget.PLIST_TEXTURE);
      }
      //setDirectionIndicator:function(data){
        // if(data["user"]["uid"] == hall.user.uid){
        //     var pos = data["user"]["position"];
        //     switch (pos){
        //         case 0://东
        //             this.direRotation = 0;
        //             this.rotateTime = 0;
        //             break;
        //         case 1://南
        //             this.direRotation = 90;
        //             this.rotateTime = 1;
        //             break;
        //         case 2://西
        //             this.direRotation = 180;
        //             this.rotateTime = 2;
        //             break;
        //         case 3://北
        //             this.direRotation = 270 ;
        //             this.rotateTime = 3;
        //             break;
        //     }
        //     this.image_dirc.runAction(cc.rotateBy(0.05,this.direRotation));
        //     this.image_dirc.setVisible(true);
        // }
        // }
      // this.image_dirc.runAction(cc.rotateTo(0.05,pos*90));
      this.image_dirc.setVisible(true);
    },
  
    updateDeskMode: function (event) {
      var evt = event.getUserData();
      if(evt == CommonEventAction.GANG_EVT)
      {
        //var color = {r:90, g:90, b:90};
        //this.image_bg.setColor(color);
        this.panel_cover.setVisible(true);
      }
    },

    resetDeskMode: function () {
      //var color = {r:255, g:255, b:255};
      //this.image_bg.setColor(color);
      for(var i = 0; i<this.seatHeads.length;i++ )
      {
          var img = ccui.helper.seekWidgetByName(this.seatHeads[i],"image_tip");
          img.setVisible(false);
      }
      this.panel_cover.setVisible(false);
      majhong.table.isOffline = false;
      majhong.table.offLineInfo = null;
      this.setTurnLightOff();
      this.stopClock();
    },

    startClock: function (sec) {
      this.text_clock.setString(sec);
      this.schedule(this.countDown,1);
    },

    countDown: function (dt) {
      var sec = parseInt(this.text_clock.getString());
      if(sec == 6 && this.turnUid == hall.user.uid)
      {
        sound.playTimeUpAlarm();
      }

      if(sec >= 1)
      {
        sec--;
        if(sec <10)sec = '0'+sec;
      }
      else
      {
        sec = '00';
      }

      this.text_clock.setString(sec);
    },

    stopClock: function () {
      this.unschedule(this.countDown);
      this.turnUid = 0;
      sound.stopTimeUpAlarm();
    },

    runGame: function () {
      if(cc.sys.isNative)
      {
        cc.director.replaceScene(this);
      }else
      {
        cc.director.runScene(this);
      }
    },

    runToRecord:function(record)
    {
      majhong.record = new majhong.Record(record);
      MajhongInfo.GameMode = GameMode.RECORD;
      this.runGame();
    },

    runToPlay:function()
    {
      MajhongInfo.GameMode = GameMode.PLAY;
      this.runGame();
    },

//============================ record history function ===============================================================
    initRecordInfo:function()
    {
      this.initRecordHead();
      this.initRecordDesk();
    },

    initRecordHead:function()
    {
      for(var i = 0;i <majhong.record.playerInfoArr.length;i++)
      {
        var data = majhong.record.playerInfoArr[i];
        if(data != undefined && data != null)
        {
          this.deskArray[i] = new DeskHead(data);
          this.seatHeads[i].addChild(this.deskArray[i],1,1);
          var frame = ccui.helper.seekWidgetByName(this.seatHeads[i], "image_frame");
          frame.setVisible(false);
        }
      }
    },

    initRecordDesk: function () {
      this.jinpaiCard = new CardShowUp(majhong.record.JinPaiId);
      this.jinpaiCard.setScale(CommonParam.JinPaiScale);
      this.jinpaiCard.setPosition(this.jinpaiPos.getPosition());
      this.panel_huapai.addChild(this.jinpaiCard);
      this.img_jinIcon.setVisible(true);
      if(majhong.record.person == 2)
      {
        this.listviewHuapaiArray[0] = ccui.helper.seekWidgetByName(this.panel_head,"listview_huapai_self");
        this.listviewHuapaiArray[1] = ccui.helper.seekWidgetByName(this.panel_head,"listview_huapai_up");

        this.imgHuaPaiArray[0] = ccui.helper.seekWidgetByName(this.panel_huapai,"img_buhua_self");
        this.imgHuaPaiArray[1] = ccui.helper.seekWidgetByName(this.panel_huapai,"img_buhua_up");

      }
       var desc = majhong.record.getTableDes();
      this.text_room_id.setString(majhong.record.roomId);
      this.text_msg.setString(desc);
      this.text_msg.setVisible(true);

      this.showBuhuaPanel();
      var desk = new GameDesk();
      this.panel_desk.addChild(desk);
    },
});



