var CARD_WIDTH = 97;
var CARD_HEIGHT = 135;
var CARD_HEIGHT_OTHER = 101.25;
var CARD_WIDTH_OTHER = 72.75;
var CARD_SCALE = 0.65;
var CARD_PADDING = 22.75;
var HEAD_PADDING = 10;

var TABID_NULL = -1;
var TABID_SELF = 0;
var TABID_2 = 1;
var TABID_3 = 2;
var TABID_4 = 3;
var TABID_5 = 4;
var TABID_6 = 5;
var TABID_7 = 6;
var TABID_8 = 7;


//servers = {
//    'web' : 'http://dev1.xhgame.cc:5001',
//    'ports' : [5010,5011],
//    'connector' : 'dev1.xhgame.cc', //prodcs dev2.lekoy.com`
//    'share' : 'http://a.mlinks.cc/Aa6S?roomId=0'

//roomData['area'] = 'fj';
//roomData['tableName'] ='fj';
//roomData['rounds'] = this.item_ops.round;        //局数
//roomData['person'] = this.item_ops.person;         //人数
//roomData['person'] = 8;
//roomData['banker'] = 0;
//roomData['mode'] = this.item_ops.moshi;                          //模式
//roomData['aaGem'] = this.item_ops.fufei;
//roomData['isMa'] = this.item_ops.ma;                          //带马
//if(this.item_ops.ma == 1)
//    roomData['maPai'] = this.maPai;
//
//hall.createPrivate(Niuniu.appId,roomData,function(data){
//    if(data["code"]== 200)
//    {
//        hall.enter(Niuniu.appId);
//    }else
//    {
//        var dialog = new JJConfirmDialog();
//        dialog.setDes(data['error']);
//        dialog.showDialog();
//    }
//}.bind(this));

//var panel_game5 = ccui.helper.seekWidgetByName(root,"panel_game5");
//this.gameShowPanels.push(panel_game5);

var Room = cc.Scene.extend({
    TABID_SELF:0,
    TABID_2:1,
    TABID_3:2,
    TABID_4:3,
    TABID_5:4,
    TABID_6:5,
    TABID_7:6,
    TABID_8:7,
    panel_root:null,
    panel_info:null,
    text_room_id:null,
    text_room_type:null,
    text_room_base:null,
    text_room_round:null,
    text_time:null,

    panel_menu:null,
    btn_setup:null,
    btn_exit:null,
    btn_chat:null,
    btn_speak:null,
    btn_help:null,
    btn_trust:null,
    btn_wechat:null,
    btn_hall:null,//返回大厅
    btn_dissolve:null,//解散房间

    panel_player:null,
    panel_seats:[],
    img_heads:[],
    img_defaults:[],
    text_scores:[],
    text_names:[],
    img_offlines:[],
    img_bankers:[],
    img_speakers:[],
    img_msgs:[],
    text_msgs:[],
    img_emojis:[],
    img_readys:[],
    img_trusts:[],
    img_news:[],
    panel_rap:null,
    img_raps:[],//抢庄
    btn_beis:[],


    panel_desk:null,
    img_heap:null,
    img_type:null,
    panel_cards:[],

    panel_op:null,
    btn_cuopai:null,
    btn_check:null,
    btn_reminder:null,
    btn_show:null,

    panel_chip:null,
    img_coin_frames:[],
    img_coins:[],
    btn_chips:[],

    panel_tip:null,
    img_tip_frame:null,
    text_tip:null,
    _card_index:0,
    _seatIndex:0,

    panel_done:null,
    btn_done:null,


    btn_start:null,
    panel_anim:null,


    btn_ready:null,
    text_add_score:null,
    text_sub_score:null,

    panel_trust:null,
    btn_trust_cancel:null,

    panel_rub:null,

    _touchListener:null,
    _touchRubListener:null,

    _rubCardLayer:null,//搓牌层
    _rubCardTable:[], //玩家可搓牌的数组
    _selectRubCardIndex:-1,
    _BigRubCardSprite:null,//单张搓牌是的底牌
    _bInRubingAction:false,//是否处于搓牌过程中
    _bRubCard:false,//是否可以搓牌
    _imgCards:[],

    _totalPlayerCount:8, //总共玩家数
    _players:[],//玩家数组
    _playingUids:[],
    _playingSeats:[],
    _ownerUid:0,//房主
    _tableId:0,
    _roundTotal:0,
    _roundNow:0,
    _chairArr:[],
    _seatRelativeIds:[],
    _myTabIndex:0,
    _cards:[],
    _niuCards:[],
    _niuType:0,
    _tableStatus:0,
    _isInit:false,
    _wanFa:1,//2牛牛上庄
    _diFen:1,
    _banker_id :0,
    _trust_status:false,//托管
    _dissolveTag:1999,
    _fanBei:0,
    _spePai:0,
    _aaGem:0,
    _maxBei:4,
    _tipStr:"",
    _clockDt:0,
    _allChipIn:0,

    _readyTime:5,//等待时间
    _gamblingTime:5,//抢庄时间
    _chipingTime:10,//下注时间
    _showCardTime:10,//亮牌时间


    _Listener : null,
    ctor:function(){
        this._super();
        var root = ccs.load(NiuniuJson.Room).node;
        this.addChild(root);

        this.panel_root = ccui.helper.seekWidgetByName(root,"panel_root");

        this.panel_info = ccui.helper.seekWidgetByName(root,"panel_info");
        this.text_room_id = ccui.helper.seekWidgetByName(this.panel_info,"text_room_id");
        this.text_room_type = ccui.helper.seekWidgetByName(this.panel_info,"text_room_type");
        this.text_room_base = ccui.helper.seekWidgetByName(this.panel_info,"text_room_base");
        this.text_room_round = ccui.helper.seekWidgetByName(this.panel_info,"text_room_round");
        this.text_time = ccui.helper.seekWidgetByName(this.panel_info,"text_time");

        this.panel_menu = ccui.helper.seekWidgetByName(root,"panel_menu");
        this.btn_setup = ccui.helper.seekWidgetByName(this.panel_menu,"btn_setup");
        this.btn_setup.addClickEventListener(this.onClickSetup.bind(this));
        this.btn_exit = ccui.helper.seekWidgetByName(this.panel_menu,"btn_exit");
        this.btn_wechat = ccui.helper.seekWidgetByName(this.panel_menu,"btn_wechat");
        this.btn_dissolve = ccui.helper.seekWidgetByName(this.panel_menu,"btn_dissolve");
        this.btn_hall = ccui.helper.seekWidgetByName(this.panel_menu,"btn_hall");
        this.btn_dissolve.setVisible(false);
        this.btn_hall.setVisible(false);
        this.btn_wechat.setVisible(false);

        this.btn_exit.addClickEventListener(this.onClickExit.bind(this));
        this.btn_wechat.addClickEventListener(this.onInviteWeChat.bind(this));
        this.btn_dissolve.addClickEventListener(this.onClickDissolve.bind(this));
        this.btn_hall.addClickEventListener(this.onClickHall.bind(this));

        this.btn_chat = ccui.helper.seekWidgetByName(this.panel_menu,"btn_chat");
        this.btn_chat.addClickEventListener(this.onClickChat.bind(this));
        this.btn_speak = ccui.helper.seekWidgetByName(this.panel_menu,"btn_speak");
        this.btn_speak.addTouchEventListener(this.touchEvent, this);
        this.btn_help = ccui.helper.seekWidgetByName(this.panel_menu,"btn_help");
        this.btn_help.addClickEventListener(this.onClickHelp.bind(this));

        this.panel_player = ccui.helper.seekWidgetByName(root,"panel_player");

        var img_new = ccui.helper.seekWidgetByName(this.panel_root,"img_new");
        img_new.setVisible(false);
        for(var i = 1;i < 9;i++)
        {
            var seatIndex = i - 1;
            this.panel_seats[seatIndex] = ccui.helper.seekWidgetByName(this.panel_player,"panel_"+i);
            this.panel_seats[seatIndex].setVisible(false);
            this.panel_seats[seatIndex].addClickEventListener(function (sender) {
                var uid = sender.getTag();
                var info = this.getPlayerInfo(uid);
                var head = new NiuniuHead(info);
                head.showDialog();

            }.bind(this));
            this.img_heads[seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[seatIndex],"img_head");
            this.img_defaults[seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[seatIndex],"img_default");
            this.text_scores[seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[seatIndex],"text_score");
            this.text_names[seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[seatIndex],"text_name");
            this.img_offlines[seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[seatIndex],"img_offline");
            this.img_bankers[seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[seatIndex],"img_banker");
            this.img_speakers[seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[seatIndex],"img_speaker");
            this.img_msgs[seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[seatIndex],"img_msg");
            this.text_msgs[seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[seatIndex],"text_msg");
            this.img_emojis[seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[seatIndex],"img_emoji");
            this.img_readys[seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[seatIndex],"img_ready");
            this.img_trusts[seatIndex] =  new ccui.ImageView("whnn_robit_sp.png", ccui.Widget.PLIST_TEXTURE);
            this.img_news[seatIndex] =  img_new.clone();
            this.img_news[seatIndex].setVisible(false);
            this.panel_seats[seatIndex].addChild(this.img_news[seatIndex]);
            this.img_news[seatIndex].setPosition(82,50);
            this.img_news[seatIndex].setScale(0.5);

            this.panel_seats[seatIndex].addChild(this.img_trusts[seatIndex]);
            this.img_trusts[seatIndex].setPosition(51,75);
            this.img_trusts[seatIndex].setScale(0.5);

            this.img_heads[seatIndex].setVisible(false);
            this.text_scores[seatIndex].setVisible(false);
            this.text_names[seatIndex].setVisible(false);
            this.img_defaults[seatIndex].setVisible(false);

            this.img_offlines[seatIndex].setVisible(false);
            this.img_bankers[seatIndex].setVisible(false);
            this.img_speakers[seatIndex].setVisible(false);
            this.img_msgs[seatIndex].setVisible(false);
            this.img_emojis[seatIndex].setVisible(false);
            this.img_readys[seatIndex].setVisible(false);
            this.img_trusts[seatIndex].setVisible(false);
        }

        this.panel_desk = ccui.helper.seekWidgetByName(root,"panel_desk");
        this.img_type = ccui.helper.seekWidgetByName( this.panel_desk,"img_type");
        this.img_type.ignoreContentAdaptWithSize(false);
        this.img_heap = ccui.helper.seekWidgetByName( this.panel_desk,"img_heap");
        this.img_heap.setVisible(false);
        this.img_type.setVisible(false);

        for(var i = 1;i < 9;i++)
        {
            this.panel_cards[i-1] = ccui.helper.seekWidgetByName(this.panel_desk,"panel_"+i);
            this.panel_cards[i-1].setVisible(false);
        }

        this.panel_op = ccui.helper.seekWidgetByName(root,"panel_op");
        this.btn_cuopai = ccui.helper.seekWidgetByName(root,"btn_cuopai");
        this.btn_check = ccui.helper.seekWidgetByName(root,"btn_fanpai");
        this.btn_reminder = ccui.helper.seekWidgetByName(root,"btn_reminder");
        this.btn_show = ccui.helper.seekWidgetByName(root,"btn_show");
        this.panel_op.setVisible(false);
        this.btn_cuopai.setVisible(false);
        this.btn_reminder.setVisible(false);
        this.btn_check.setVisible(false);
        this.btn_show.setVisible(false);
        this.btn_cuopai.addClickEventListener(this.onClickRub.bind(this));
        this.btn_check.addClickEventListener(this.onClickCheck.bind(this));
        this.btn_reminder.addClickEventListener(this.onClickReminder.bind(this));
        this.btn_show.addClickEventListener(this.onClickShow.bind(this));

        this.panel_done = ccui.helper.seekWidgetByName(root,"panel_done");
        this.btn_start = ccui.helper.seekWidgetByName(this.panel_done,"btn_start");
        this.btn_start.addClickEventListener(this.onClickStart.bind(this));
        this.btn_ready = ccui.helper.seekWidgetByName(this.panel_done,"btn_ready");
        this.btn_ready.addClickEventListener(this.onClickReady.bind(this));
        this.btn_ready.setVisible(false);

        this.panel_tip = ccui.helper.seekWidgetByName(root,"panel_tip");
        this.img_tip_frame = ccui.helper.seekWidgetByName(root,"img_tip_frame");
        this.text_tip = ccui.helper.seekWidgetByName(root,"text_tip");
        //this.img_tip.ignoreContentAdaptWithSize(false);
        this.img_tip_frame.setVisible(false);

        this.panel_anim = ccui.helper.seekWidgetByName(root,"panel_anim");
        this.text_add_score = ccui.helper.seekWidgetByName(root,"text_add");
        this.text_sub_score = ccui.helper.seekWidgetByName(root,"text_sub");

        this.panel_chip = ccui.helper.seekWidgetByName(root,"panel_chip");
        this.panel_chip.setVisible(true);
        for(var i = 1 ;i < 9;i++){
            this.img_coin_frames[i-1] = ccui.helper.seekWidgetByName(this.panel_chip,"img_coin_frame_"+i);
            this.img_coin_frames[i-1].setVisible(false);
            this.img_coin_frames[i-1].setScale(0.8);
            this.img_coins[i-1] = ccui.helper.seekWidgetByName(this.img_coin_frames[i-1],"img_coin");
        }

        for(var i =0;i<2;i++){
            var k = i+1;
            this.btn_chips[i] = ccui.helper.seekWidgetByName(this.panel_chip,"btn_"+k);
            this.btn_chips[i].setVisible(false);
            this.btn_chips[i].addClickEventListener(this.onClickChipIt.bind(this));
        }


        this.panel_rap = ccui.helper.seekWidgetByName(root,"panel_rap");
        for(var i=0;i<5;i++){
            this.btn_beis[i] = ccui.helper.seekWidgetByName(this.panel_rap,"btn_bei"+i);
            this.btn_beis[i].addClickEventListener(this.onClickBei.bind(this));
            this.btn_beis[i].setVisible(false);
            this.btn_beis[i].setTag(i);
        }

        for(var i=0;i<8;i++){
            this.img_raps[i] = ccui.helper.seekWidgetByName(this.panel_rap,"img_rap"+(i+1));
            this.img_raps[i].ignoreContentAdaptWithSize(false);
            this.img_raps[i].setVisible(false);
        }


        this.btn_add = ccui.helper.seekWidgetByName(this.panel_menu,"btn_add");
        this.btn_trust = ccui.helper.seekWidgetByName(this.panel_menu,"btn_trust");

        this.panel_trust = ccui.helper.seekWidgetByName(root,"panel_trust");
        this.btn_trust_cancel = ccui.helper.seekWidgetByName(this.panel_trust,"btn_trust");
        this.panel_trust.setVisible(false);
        this.btn_trust_cancel.addClickEventListener(this.onCancelTrust.bind(this));

        this.panel_rub = ccui.helper.seekWidgetByName(root,"panel_rub");
        this.panel_rub.setVisible(false);


        this.btn_trust.addClickEventListener(function(data){
            console.log("click addAuto");
            var valueStatus = 1;
            if(this._trust_status){
                valueStatus = 0;
            }
            Niuniu.net.addAuto(valueStatus, function (data) {
                console.log("addAuto resResponse ");
            });
        }.bind(this));


        if (!cc.sys.isNative){
            this.btn_add.addClickEventListener(function(data){
                Niuniu.net.addRobot(1, function (data) {
                    console.log("addrobot");
                });
            }.bind(this));
        }else{
            this.btn_add.setVisible(false);
        }

        for(var i=0;i<8;i++){
            this._seatRelativeIds[i] = -1;
        }


        //this.panel_control = ccui.helper.seekWidgetByName(root,"panel_control");
        //this.panel_control.setVisible(false);
        //this.btn_open = ccui.helper.seekWidgetByName(root,"btn_open");
        //this.btn_show = ccui.helper.seekWidgetByName(root,"btn_show");
        //this.btn_open.addClickEventListener(this.onClickOpen.bind(this));
        //this.btn_show.addClickEventListener(this.onClickShow.bind(this));
        //for(var j = 0;j<8;j++)
        //{
        //    for(var i = 0;i<5;i++)
        //    {
        //        if(j == TABID_SELF)
        //        {
        //            var card = this.backOfCardNormal();
        //            card.setPosition(this.posOfCardIndex(j,i));
        //            this.panel_desk.addChild(card);
        //        }else
        //        {
        //            var card = this.backOfCard();
        //            card.setPosition(this.posOfCardIndex(j,i));
        //            this.panel_desk.addChild(card);
        //        }
        //
        //    }
        //}

        this.initUI();
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
            Niuniu.net.send();
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
                    Niuniu.net.talk("","","");
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
                    Niuniu.net.send();
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
                    Niuniu.net.send();
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
        var data = [] ;
        data["wanfa"] = this._wanFa;
        data["aaGem"] = this._aaGem;
        data["fanBei"] = this._fanBei;
        data["spePai"] = this._spePai;
        data["difen"] = this._diFen;
        var desc='';
        if(this._wanFa == 1){
            desc = "通比牛牛 "
        }else if(this._wanFa == 2){
            desc = "赢家上庄 "
        }else if(this._wanFa == 3){
            desc = "明牌抢庄 "
        }
        desc+= this._roundTotal + '局 ';
        desc += '底分:'+this._diFen +' ';

        if(this._aaGem == 0){
            desc +="房主付费 ";
        }else if(this._aaGem == 1){
            desc +="AA付费 ";
        }else if(this._aaGem == 2){
            desc +="赢家付费 ";
        }
        if(this._fanBei == 1){
            desc+="牛牛x3 牛九x2 牛八x2 ";
        }else if(this._fanBei == 2){
            desc+="牛牛x4 牛九x3 牛八x2 牛七x2 ";
        }

        if(this._spePai  > 0)
        {
            desc+="特殊牌型翻倍";
        }else if(this._spePai  == 0)
        {
            desc+="特殊牌型不翻倍";
        }

        JJLog.print('click invite wechat' + desc );
        hall.wxEnterRoom = this._tableId;
        hall.net.wxShareURL('牛牛'+',房号:'+ this._tableId , desc, 0);
    },


    initUI:function()
    {
        this.updateTime(0);
        this.schedule(this.updateTime,1);

    },

    initSeat: function () {

        var sizeWin = cc.director.getWinSize();
        var size_head = this.panel_seats[TABID_SELF].getContentSize();

        var resetSeat = function(_seatIndex,_targetIndex){

            this.panel_seats[_seatIndex] = ccui.helper.seekWidgetByName(this.panel_player,"panel_"+(_targetIndex+1));
            this.panel_seats[_seatIndex].setVisible(true);
            this.img_heads[_seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[_seatIndex],"img_head");
            this.img_defaults[_seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[_seatIndex],"img_default");
            this.text_scores[_seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[_seatIndex],"text_score");
            this.text_names[_seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[_seatIndex],"text_name");
            this.img_offlines[_seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[_seatIndex],"img_offline");
            this.img_bankers[_seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[_seatIndex],"img_banker");
            this.img_speakers[_seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[_seatIndex],"img_speaker");
            this.img_msgs[_seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[_seatIndex],"img_msg");
            this.text_msgs[_seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[_seatIndex],"text_msg");
            this.img_emojis[_seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[_seatIndex],"img_emoji");
            this.img_readys[_seatIndex] = ccui.helper.seekWidgetByName(this.panel_seats[_seatIndex],"img_ready");
            this.img_coin_frames[_seatIndex] = ccui.helper.seekWidgetByName(this.panel_chip,"img_coin_frame_"+(_seatIndex+1));

            this.img_coins[_seatIndex] = ccui.helper.seekWidgetByName(this.img_coin_frames[_seatIndex],"img_coin");


            this.img_heads[_seatIndex].setVisible(false);
            this.text_scores[_seatIndex].setVisible(false);
            this.text_names[_seatIndex].setVisible(false);
            this.img_defaults[_seatIndex].setVisible(true);

            this.img_offlines[_seatIndex].setVisible(false);
            this.img_bankers[_seatIndex].setVisible(false);
            this.img_speakers[_seatIndex].setVisible(false);
            this.img_msgs[_seatIndex].setVisible(false);
            this.img_emojis[_seatIndex].setVisible(false);
            this.img_readys[_seatIndex].setVisible(false);
            this.img_coin_frames[_seatIndex].setVisible(false);

            this.panel_cards[_seatIndex] = ccui.helper.seekWidgetByName(this.panel_desk,"panel_"+(_targetIndex+1));
        }.bind(this);

        var setSeatInvisible = function(){
            for(var i = 1;i<8;i++)
            {
                var seatIdx = i;
                this.panel_seats[seatIdx].setVisible(false);
                this.img_heads[seatIdx].setVisible(false);
                this.text_scores[seatIdx].setVisible(false);
                this.text_names[seatIdx].setVisible(false);
                this.img_defaults[seatIdx].setVisible(false);

                this.img_offlines[seatIdx].setVisible(false);
                this.img_bankers[seatIdx].setVisible(false);
                this.img_speakers[seatIdx].setVisible(false);
                this.img_msgs[seatIdx].setVisible(false);
                this.img_emojis[seatIdx].setVisible(false);
            }
        }.bind(this);


        var setHeadPos = function (_seatIndex,_dir) {
            var pos1 = this.panel_cards[_seatIndex].getPosition();
            var sizePanel = this.panel_cards[_seatIndex].getContentSize();
            var pos = this.panel_cards[_seatIndex].getPosition();
            if(_dir == 0){  //left
                var pos2 = cc.p(pos1.x - sizePanel.width*0.5 - size_head.width*0.5 - HEAD_PADDING,pos1.y);
                this.panel_seats[_seatIndex].setPosition(pos2);
            }else {
                var pos2 = cc.p(pos1.x + sizePanel.width * 0.5 + size_head.width * 0.5 + HEAD_PADDING, pos1.y);
                this.panel_seats[_seatIndex].setPosition(pos2);
            }

            if(_seatIndex != 0)
            {
                var pos2 = cc.p(pos.x,pos.y - sizePanel.height*0.5 - 20);
                this.img_coin_frames[_seatIndex].setPosition(pos2);
            }



        }.bind(this);

        //seat1
        var pos = this.panel_cards[TABID_SELF].getPosition();
        var size1 = this.panel_cards[TABID_SELF].getContentSize();
        if(this._totalPlayerCount != 8)
        {
            this.panel_cards[TABID_SELF].setPosition(cc.p(sizeWin.width*0.5,pos.y));
            setHeadPos(TABID_SELF,0);
            setSeatInvisible();
        }

        switch (this._totalPlayerCount){
            case 2:
            {
                //seat2
                resetSeat(TABID_2,TABID_6);
                var pos3 = this.panel_cards[TABID_2].getPosition();
                size1 = this.panel_cards[TABID_2].getContentSize();
                this.panel_cards[TABID_2].setPosition(cc.p(sizeWin.width*0.5,pos3.y));
                setHeadPos(TABID_2,0);
            }
                break;
            case 3:
            {
                //seat2
                resetSeat(TABID_2,TABID_4);
                setHeadPos(TABID_2,1);

                //seat3
                resetSeat(TABID_3,TABID_7);
                setHeadPos(TABID_3,0);

            }break;

            case 4:
            {
                //seat2
                resetSeat(TABID_2,TABID_4);
                setHeadPos(TABID_2,1);

                //seat3
                resetSeat(TABID_3,TABID_6);
                var pos3 = this.panel_cards[TABID_3].getPosition();
                this.panel_cards[TABID_3].setPosition(cc.p(sizeWin.width*0.5,pos3.y));
                setHeadPos(TABID_3,0);

                //seat4
                resetSeat(TABID_4,TABID_7);
                setHeadPos(TABID_4,0);

            }break;

            case 5:
            {
                //seat2
                resetSeat(TABID_2,TABID_4);

                setHeadPos(TABID_2,1);

                //seat3
                resetSeat(TABID_3,TABID_5);
                setHeadPos(TABID_3,1);

                //seat4
                resetSeat(TABID_4,TABID_6);
                setHeadPos(TABID_4,0);

                //seat5
                resetSeat(TABID_5,TABID_7);
                setHeadPos(TABID_5,0);

            }break;

            case 6:
            {
                //seat2
                resetSeat(TABID_2,TABID_3);
                setHeadPos(TABID_2,1);

                //seat3
                resetSeat(TABID_3,TABID_4);
                setHeadPos(TABID_3,1);

                //seat4
                resetSeat(TABID_4,TABID_6);
                pos3 = this.panel_cards[TABID_4].getPosition();
                this.panel_cards[TABID_4].setPosition(cc.p(sizeWin.width*0.5,pos3.y));
                setHeadPos(TABID_4,0);

                //seat5
                resetSeat(TABID_5,TABID_7);
                setHeadPos(TABID_5,0);

                //seat6
                resetSeat(TABID_6,TABID_8);
                setHeadPos(TABID_6,0);

            }break;

            case 7:
        {
            //seat2
            resetSeat(TABID_2,TABID_3);
            setHeadPos(TABID_2,1);

            //seat3
            resetSeat(TABID_3,TABID_4);
            setHeadPos(TABID_3,1);

            //seat4
            resetSeat(TABID_4,TABID_5);
            setHeadPos(TABID_4,1);

            //seat5
            resetSeat(TABID_5,TABID_6);
            setHeadPos(TABID_5,0);

            //seat6
            resetSeat(TABID_6,TABID_7);
            setHeadPos(TABID_6,0);

            //seat7
            resetSeat(TABID_7,TABID_8);
            setHeadPos(TABID_7,0);

        }break;

            case 8:
            {


            }break;
        }
    },

    onEnter: function () {
        this._super();

        this._touchListener = cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this),
            onTouchCancelled: this.onTouchCancelled.bind(this),
        }, this);

        var _this = this;
        var ls = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "DOUNIU_INIT",
            callback: function(event){
                console.log("DOUNIU_INIT init");
                _this.initTable();
            }
        });
        this._Listener = cc.eventManager.addListener(ls,this);

        this.registerAllEvents();
        this.initTable();
        sound.playNiuniuMusic();



        //this._eventDispatcher.addEventListenerWithSceneGraphPriority(eventListener, this);

    },



    onExit:function(){
        this.removeAllEvents();
        cc.eventManager.removeListener(this._touchListener);
        if(this._touchRubListener){
            cc.eventManager.removeListener(this._touchRubListener);
        }
        cc.eventManager.removeListener(this._Listener);
        this._super();
    },


    onTouchBegan:function (touch, event) {
        console.log("ontouchBegan=====");
        if((this._rubCardLayer != null && this._rubCardLayer.isVisible()) || this._bInRubingAction ){
            this._selectRubCardIndex = -1;
            if(this._bRubCard){
                //可以搓牌
                var touchPoint = this.convertTouchToNodeSpace(touch);
                if(this._wanFa == WAN_FA.MINGPAIQIANGZHAUNG){
                    for(var i=0;i<this._rubCardTable.length;i++){
                        if(this._rubCardTable[i]._bMoved == false){
                            var cardRect = this._rubCardTable[i].getBoundingBox();
                            if(cc.rectContainsPoint(cardRect,touchPoint)){
                                this._selectRubCardIndex = i;
                                return true;
                            }
                            break;
                        }
                    }
                }else{
                        // 遍历牌，从5倒序
                        for(var i = (this._rubCardTable.length-1);i>=1;i--){
                            if(this._rubCardTable[i]._bMoved == false){
                                var cardRect = this._rubCardTable[i].getBoundingBox();
                                if(cc.rectContainsPoint(cardRect,touchPoint)){
                                    this._selectRubCardIndex = i;
                                    this._rubCardTable[i]._bMoved = true;
                                    return true;
                                }
                            }
                        }
                }
            }
        }

        return false;
    },

    onTouchMoved:function (touch, event) {
        if(this._selectRubCardIndex >= 0 && this._selectRubCardIndex < 5){
            // 设置牌的新坐标
            var disPoint = touch.getDelta();
            var newPoint = cc.p(this._rubCardTable[this._selectRubCardIndex].getPositionX()+disPoint.x,
                this._rubCardTable[this._selectRubCardIndex].getPositionY()+disPoint.y);
            this._rubCardTable[this._selectRubCardIndex].setPosition(newPoint);
        }

    },

    onTouchEnded:function (touch, event) {
        this.touchEndOrCancelFunc(touch);

    },

    onTouchCancelled:function (touch, event) {
        this.touchEndOrCancelFunc(touch);

    },


    touchEndOrCancelFunc: function (touch) {
        console.log("touchEndOrCancelFunc");
        if(this._selectRubCardIndex >= 1 && this._selectRubCardIndex < 5){
            if(this._wanFa == WAN_FA.MINGPAIQIANGZHAUNG){
                var backCard = this._rubCardTable[this._selectRubCardIndex];
                if(this._BigRubCardSprite == null ||backCard == null){
                    return;
                }

                var offY = Math.abs(backCard.getPositionY() - this._BigRubCardSprite.getPositionY());
                var offX = Math.abs(backCard.getPositionX() - this._BigRubCardSprite.getPositionX());
                if(offY >= this._BigRubCardSprite.getBoundingBox().height / 2 || offX >= this._BigRubCardSprite.getBoundingBox().width / 2){
                    //触摸结束
                    var currCardIndex = this._selectRubCardIndex;
                    this._rubCardTable[this._selectRubCardIndex]._bMoved = true;
                    this._bRubCard = false;
                    this._selectRubCardIndex = -1;

                    // 盖牌移走时间
                    var moveTime = 0.45;
                    // 底牌的动作时间
                    var rotateTime = 0.25;
                    var delTime = 0.45;
                    // 移动前等待时间
                    var moveOutTime = 0.25;
                    // 移除屏幕外时间
                    // 盖牌动作

                    var gaiEndPoint = cc.p(backCard.getPositionX(), 940);
                    var tempPoint = this.posOfCardIndex(TABID_SELF,currCardIndex);
                    var gaiShowPoint = cc.p(tempPoint.x, 610);

                    // 需要赋值
                    this._rubCardTable[currCardIndex].runAction(cc.sequence(cc.moveTo(moveTime, gaiEndPoint),
                        cc.callFunc(function(){
                            backCard.resetCardData(this._cards[currCardIndex]);
                            backCard.setPositionX(gaiShowPoint.x);
                            backCard.setLocalZOrder(currCardIndex);
                            backCard.setScale(1.0);
                            backCard.setRotation(0);
                        }.bind(this)),

                    cc.delayTime(rotateTime + delTime + moveOutTime),
                        cc.moveTo(moveTime, gaiShowPoint),
                        // 显示牌
                        cc.callFunc(
                            function(){
                                this.rubOneCard(currCardIndex + 1);
                            }.bind(this))
                    // 执行下一张牌
                ));
                    //-- 底牌显示牌值
                    var rotateScaleAction = cc.spawn(cc.rotateTo(rotateTime, 0),
                        cc.scaleTo(rotateTime, 0.6),
                        cc.callFunc( function() {
                            this._BigRubCardSprite.setCardWordShow(true, rotateTime);
                            }.bind(this)
                        ));

                    this._BigRubCardSprite.runAction(cc.sequence(
                                cc.delayTime(moveTime),
                                rotateScaleAction,
                                cc.delayTime(delTime),
                                cc.moveTo(moveOutTime, cc.p(-200, this._BigRubCardSprite.getPositionY()))
                            //-- 移出屏幕外
                         ));
                }


            }else{
                //-- 其余搓牌模式
                this._rubCardTable[this._selectRubCardIndex]._bMoved = true;
                //-- 最后一张牌触摸结束
                if (this._selectRubCardIndex == 1 ){
                    this._bRubCard = false;
                //-- 执行搓牌结束的动画
                    var endPoint = cc.p(640, -80);
                    var time1 = 0.4;
                    var time2 = 0.2;
                    var time3 = 0.4;
                    for (var i = 0;i< this._rubCardTable.length;i++){
                        var endRotate = -30 +(i - 1) * 15;
                    //-- 牌执行动作（移动并且旋转）
                        var action1 = cc.spawn(cc.moveTo(time1, endPoint), cc.rotateTo(time1, endRotate));
                        this._rubCardTable[i].runAction(cc.sequence(action1, cc.delayTime(time2), cc.rotateTo(time2, 0), cc.delayTime(time2), cc.moveTo(time3, cc.p(640, -570))));
                    }
                //-- 牌移动结束后显示牌
                    var imgCards = this.getMyImgCards();
                    imgCards[0].runAction(cc.sequence(
                                cc.delayTime(time1 + time2 * 3 + time3),
                                cc.callFunc( function(){
                                    this.endRubCardAction(false);
                                }.bind(this))));
                }
                this._selectRubCardIndex = -1;
            }

        }

    },

    rubOneCard:function(cardIndex){
        console.log("rubOneCard_cardIndex:",cardIndex);
        if(cardIndex > 4){ //4 会飞出去  5 正常
            console.log("cardIndexINNNNN:",cardIndex);
            //-- 搓牌全部结束
            //-- 设置状态不能搓牌
            this._bRubCard = false;
            this._selectRubCardIndex = -1;

            // 牌移回原始位置
            var waitTime = 0.1;
            // 先等待时间，在再移动
            var moveDownTime = 0.25;
            // 下移的时间

            for(var i=0;i<this._rubCardTable.length;i++){
                var endPoint = this.posOfCardIndex(TABID_SELF,i);
                this._rubCardTable[i].runAction(cc.sequence(
                    cc.delayTime(waitTime),
                    cc.moveTo(moveDownTime,endPoint)
                ));
            }

            // 停止搓牌动作
            var card = this.panel_desk.getChildByTag(this.getCardTag(TABID_SELF,0));
            card.runAction(cc.sequence(
                    cc.delayTime(waitTime+moveDownTime),
                    cc.callFunc(function(){
                        this.endOpenCardRubAction(false);
                    }.bind(this))
                ));
            return;
        }

        var actionCard = this._rubCardTable[cardIndex];
        actionCard.setLocalZOrder(5);


        // 创建动作
        var moveRotateTime = 0.3;
        // 未翻牌的移动旋转时间
        var endPoint = cc.p(640, 300);
        // 创建移动旋转动作
        var moveRotateAction = cc.spawn(cc.scaleTo(moveRotateTime,4.35),
            //cc.rotateTo(moveRotateTime, -90),
            cc.moveTo(moveRotateTime, endPoint));

        //-- 旋转移动后，设置可以触摸且出现底牌
        actionCard.runAction(cc.sequence(cc.delayTime(0.25),
            cc.callFunc(
                function() {
                        actionCard.resetToMoveCard();
                    if(this._wanFa == WAN_FA.MINGPAIQIANGZHAUNG){
                        //391 583
                        //97 135
                        //4.05 4.32
                        actionCard.setScaleX(4.05);
                        actionCard.setScaleY(4.32);

                    }
                }.bind(this)),
             //-- 切换为搓牌的移动牌
            moveRotateAction,
            cc.callFunc( function() {
                actionCard._bMoved = false;
                //-- 设置牌为可移动状态
                this.setBigRubCardShow(this._cards[cardIndex], endPoint);
                //-- 显示被盖住的底牌
                 this._bRubCard = true;
            }.bind(this))));
    },

    endOpenCardRubAction: function (isForce) {
        console.log("endOpenCardRubAction");
        // 移除搓牌层
        this._rubCardLayer.setVisible(false);
        this.cleanRubCardLayer();

        var imgCards = this.getMyImgCards();
        for(var i=0;i<5;i++){
            imgCards[i].setVisible(true);
        }

        this.checkMyHandCards(this._cards,4);

        this.showOutOp();

        if(isForce){

            // 搓牌过程结束

        }else{

        }

        this._bInRubingAction = false;
    },


    endRubCardAction: function (isForce) {
        // 移除搓牌层
        this._rubCardLayer.setVisible(false);
        this.cleanRubCardLayer();

        //设置状态不能搓牌
        this._bRubCard = false;
        this._selectRubCardIndex = -1;

        var imgCards = this.getMyImgCards();

        var cardsData = {};
        cardsData["paiQi"] = this._cards;
        cardsData["paiNiu"] = this._niuCards;
        cardsData["paiType"] = this._niuType;



        if(isForce){
            // 搓牌过程结束
            imgCards[0].stopAllActions();
            this.checkMyHandCards(this._cards,0);
        }else{
            imgCards[0].stopAllActions();
            this.checkMyHandCards(this._cards,0);
        }

        this.showOutOp();
        this._bInRubingAction = false;

    },

    getMyImgCards: function () {
        var imgCards = [];
        for(var i=0;i<5;i++){
            var card = this.panel_desk.getChildByTag(this.getCardTag(TABID_SELF,i));
            if(card != null && card != undefined){
                imgCards[i] = card;
            }
        }
        return imgCards;
    },

    showSeatIndexCard: function (seatIndex,cardIndex) {
        var card = this.panel_desk.getChildByTag(this.getCardTag(seatIndex,cardIndex));
        if(card == null || card == undefined){
          card = new ccui.ImageView();
        }

        var cardId = getCardId(this._cards[cardIndex]);
        card.loadTexture(CardPath[cardId], ccui.Widget.PLIST_TEXTURE);
    },




//-----------------------------------------------------------------
//    --------------------------动画效果-------------------------------
//    -----------------------------------------------------------------
//        -- 显示单张搓牌的底牌
     setBigRubCardShow:function(cardData, showPoint){
        //-- 验证牌存在
        if (this._BigRubCardSprite == null){
            return;
        }


        //-- 显示牌
        this._BigRubCardSprite.resetCardData(cardData);
        //this._BigRubCardSprite.setCardWordShow(false, 0);
        this._BigRubCardSprite.setPosition(showPoint);
        this._BigRubCardSprite.setScale(1.0);
        //this._BigRubCardSprite.setRotation(-90);
        this._BigRubCardSprite.setVisible(true);
     },


    playRubCardAction:function(){
        //设置搓牌效果所在层存在
        this.createRubCardLayer(true);
        //使用大牌
        this._rubCardLayer.setVisible(true);
        //-- 设置搓牌的动作
        this._selectRubCardIndex = -1;
        for(var i=0;i<this._rubCardTable.length;i++){
            var cardSprite = this._rubCardTable[i];
            //-- 设置牌的初始状态
            cardSprite.setPosition(640, -590);
            cardSprite.setRotation(0);
            cardSprite.setScale(1.0);
            cardSprite.setAnchorPoint(cc.p(0.5, 0));
            cardSprite.setVisible(true);

            cardSprite.resetCardData(this._cards[i]);


            cardSprite._bMoved = false;
            //-- 计算
            var endRotate = -4 +(i - 1) * 2;
            //-- 牌执行动作（先上移，展开角度）
            cardSprite.runAction(cc.sequence(cc.moveTo(0.3, cc.p(640, -80)),
                cc.rotateTo(0.2, endRotate)));
        }

        //-- 设置是否可以触摸牌
        var imgCards = this.getMyImgCards();
        imgCards[0].runAction(cc.sequence(cc.delayTime(0.7),
                        cc.callFunc( function()
                                    {
                                        this._bRubCard = true;
                                    }.bind(this))));

    },


    playOpenCardRubAction: function (openCardCount){
        //-- 设置搓牌效果所在层存在
        this.createRubCardLayer(false);
        this._rubCardLayer.setVisible(true);

        //-- 设置搓牌的动作
        var moveUpTime = 0.30;
        //-- 上移的时间
        for(var i =0;i<5;i++){
            var cardSprite = this._rubCardTable[i];
            //-- 设置坐标
            var beginPoint = this.posOfCardIndex(TABID_SELF,i);
            cardSprite.setPosition(beginPoint);
            //-- 设置牌值
            if(i != 4){
                cardSprite.resetCardData(this._cards[i]);
            }

            //-- 设置牌的缩放度
            cardSprite.setScale(1.0);
            //-- 设置牌的属性
            cardSprite.setRotation(0);
            cardSprite.setAnchorPoint(cc.p(0.5, 0.5));
            cardSprite.setVisible(true);
            cardSprite._bMoved = true;

            //-- 牌执行动作(牌上移)
            cardSprite.runAction(cc.moveTo(moveUpTime, cc.p(beginPoint.x, 610)));
        }

        //-- 执行动作
        this._rubCardLayer.runAction(cc.sequence(cc.delayTime(moveUpTime),
                                    cc.callFunc(function(){
                                        this.rubOneCard(openCardCount);
                                    }.bind(this))
        ));

        //-- 隐藏当前玩家的手牌
        var imgCards = this.getMyImgCards();
        for(var i=0;i<imgCards.length;i++){
           imgCards[i].setVisible(false);
        }

    },

    initTable:function(){
        var _this = this;
        Niuniu.net.init(function(data){
            JJLog.print("init table response");
            JJLog.print(JSON.stringify(data));
            _this.onMessage(MSG_TYPE.INIT,data);
        });
    },

    onClickSetup: function () {
        sound.playBtnSound();
        var set = new SetupDialog(1);
        set.showDialog();
    },

    onClickExit:function(){
        sound.playBtnSound();
        if(this._tableStatus == TABLE_STATUS.UN_GAME){
            Niuniu.net.leavePrivateTable(1,function (data) {
                JJLog.print('End report leave table resp');
                var majHall = new MajhongHall();
                majHall.showHall();
            });
        }else{
            Niuniu.net.dissolveSeat(1,function (data) {
                JJLog.print('dissolveSeat table resp');

            });
        }
    },

    onClickWechat:function(){
      console.log("onclick wechat btn");
    },

    onClickDissolve:function(){
        console.log("onclick onClickDissolve btn");
        Niuniu.net.leavePrivateTable(1,function (data) {
            JJLog.print('End report leave table resp');

        });
    },

    onClickHall: function () {
        console.log("onclick onClickDissolve btn");
        Niuniu.net.leavePrivateTable(1,function (data) {
            JJLog.print('End report leave table resp');

        });
    },


    onClickChat: function () {
        sound.playBtnSound();
        var  chatView = new NiuniuChatView();
        this.addChild(chatView);
    },

    onClickHelp: function () {
        sound.playBtnSound();
        var data = [] ;
        data["wanfa"] = this._wanFa;
        data["aaGem"] = this._aaGem;
        data["fanBei"] = this._fanBei;
        data["spePai"] = this._spePai;
        data["difen"] = this._diFen;

        var info = new NiuniuInfoView(data);
        this.addChild(info);
    },

    onClickSpeak: function () {
        sound.playBtnSound();
    },

    onClickStart:function(){
        console.log("click start");
        sound.playBtnSound();
        Niuniu.net.lessPersonStart(function(data){
            console.log("start response");
            console.log(data);
        });
    },

    onClickSeatDown:function(){
        sound.playBtnSound();
        var _this = this;
        Niuniu.net.ready(1, function (data) {
            console.log("ready:");
            console.log(data);


        });

    },

    onClickReady:function(){
        var _this = this;
        sound.playBtnSound();
        Niuniu.net.ready(1, function (data) {

            _this.btn_ready.setVisible(false);

        });
    },

    onClickCheck:function(){
        console.log("onclick check");
        var _this = this;

        if(this._wanFa == WAN_FA.MINGPAIQIANGZHAUNG){
            this.checkMyHandCards(this._cards,4);
        }else{
            this.checkMyHandCards(this._cards,0);
        }

        this.showOutOp();

    },

    onClickRub:function(){
        sound.playBtnSound();

        console.log("onclick onClickRub");


        if(this._wanFa == WAN_FA.MINGPAIQIANGZHAUNG){
            this.playOpenCardRubAction(4);
        }else{
            this.playRubCardAction();
        }


    },

    onClickReminder:function(){
        sound.playBtnSound();
        console.log("onclick reminder");
        this.upMyNiuCards();
        this.setBtnEnable(this.btn_reminder,false);
    },

    onClickShow:function(){
        sound.playBtnSound();
        var _this = this;
        Niuniu.net.updatePlayerDelCard(function (data) {
            if (data["code"] == 200) {
                _this.hideOp();
            }else
            {

            }
            JJLog.print("show out card resp");
            JJLog.print(JSON.stringify(data));
        }.bind(this))
    },

    onClickChipIt: function (sender) {
        sound.playBtnSound();
        var tag = sender.getTag();
        Niuniu.net.ChipInStatus(tag,function (data) {
            if (data["code"] == 200) {
                this.hideChipBtn();
            }else
            {

            }

        }.bind(this))
    },

    onClickBei: function (sender) {
        sound.playBtnSound();
        var tag = sender.getTag();
        Niuniu.net.hog(tag,function (data) {
            if (data["code"] == 200) {
                this.hideRapBtn();
            }else
            {

            }

        }.bind(this))
    },
    onCancelTrust: function (sender) {
        sound.playBtnSound();
        var valueStatus = 1;
        if(this._trust_status){
            valueStatus = 0;
        }
        Niuniu.net.addAuto(valueStatus, function (data) {
            console.log("addAuto resResponse ");
        });
    },

    checkMsg: function (data) {

        if(data["code"] == NetErr.OK )
        {
            return true;
        }
        return false;
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

    runGame: function () {
        //cc.director.getRunningScene().addChild(this);
        if(cc.sys.isNative)
        {

            cc.director.replaceScene(this);
        }else
        {
            cc.director.runScene(this);
        }


    },

    showMySelf: function () {


    },


    //玩家显示
    showPlayer:function(_seatIndex,_data){
        this.panel_seats[_seatIndex].setVisible(true);
        this.panel_seats[_seatIndex].setTag(_data["uid"]);
        this.img_heads[_seatIndex].setVisible(true);
        this.img_defaults[_seatIndex].setVisible(true);
        this.text_scores[_seatIndex].setVisible(true);
        this.text_names[_seatIndex].setVisible(true);
        this.img_offlines[_seatIndex].setVisible(false);
        this.img_bankers[_seatIndex].setVisible(false);
        this.img_speakers[_seatIndex].setVisible(false);
        this.img_msgs[_seatIndex].setVisible(false);
        this.text_msgs[_seatIndex].setVisible(false);
        this.img_emojis[_seatIndex].setVisible(false);
        this.text_scores[_seatIndex].setString(_data["coinNum"]);
        var str = base64.decode(_data["nickName"]);
        if(str.length > 15)
        {
            str = str.slice(0,15);
        }

        this.text_names[_seatIndex].setString(str);
        this.img_readys[_seatIndex].setVisible(false);
        this.img_coin_frames[_seatIndex].setVisible(false);
        this.img_trusts[_seatIndex].setVisible(false);
        this.img_news[_seatIndex].setVisible(false);

        var _this = this;
        if (_data.headUrl != undefined && _data.headUrl.length > 0) {

            if(_data.headUrl.substring(_data.headUrl.length-1,_data.headUrl.length) == "0")
            {
                _data.headUrl = _data.headUrl.substring(0,_data.headUrl.length-1)+"96";
            }

            if (this.uid != hall.user.uid) {
                cc.loader.loadImg(_data.headUrl,
                    function (err, tex) {
                        JJLog.print(err, tex);
                        JJLog.print('load head img');
                        if (err == null && tex != null) {
                            var size = _this.img_heads[_seatIndex].getContentSize();
                            var sprite = new cc.Sprite(tex);
                            var size_sp = sprite.getContentSize();
                            sprite.setScaleX(size.width/size_sp.width);
                            sprite.setScaleY(size.height/size_sp.height);
                            sprite.setAnchorPoint(cc.p(0, 0));
                            _this.img_heads[_seatIndex].addChild(sprite);

                            util.cacheImage(_data.headUrl, tex);

                            JJLog.print('loaded head img and cached');
                        } else {
                            cc.loader.loadImg(_data.headUrl,
                                function (err, tex) {
                                    JJLog.print(err, tex);
                                    JJLog.print('load head img1');
                                    if (err == null && tex != null) {
                                        var size = _this.img_heads[_seatIndex].getContentSize();
                                        var sprite = new cc.Sprite(tex);
                                        var size_sp = sprite.getContentSize();
                                        sprite.setScaleX(size.width/size_sp.width);
                                        sprite.setScaleY(size.height/size_sp.height);
                                        sprite.setAnchorPoint(cc.p(0, 0));
                                        _this.img_heads[_seatIndex].addChild(sprite);

                                        util.cacheImage(_data.headUrl, tex);

                                        JJLog.print('loaded head img and cached1');
                                    } else {

                                    }
                                }.bind(this));
                        }
                    }.bind(this));
            } else {
                var tex = util.getTextureForKey(_data.headUrl);
                if (tex != null && tex != undefined) {
                    JJLog.print('use cached head image');

                    var size = _this.img_heads[_seatIndex].getContentSize();
                    var sprite = new cc.Sprite(tex);
                    var size_sp = sprite.getContentSize();
                    sprite.setScaleX(size.width/size_sp.width);
                    sprite.setScaleY(size.height/size_sp.height);
                    sprite.setAnchorPoint(cc.p(0, 0));
                    _this.img_heads[_seatIndex].addChild(sprite);
                }else{
                    JJLog.print('cached head image load failed, and load again');

                    cc.loader.loadImg(_data.headUrl,
                        function (err, tex) {
                            JJLog.print(err);
                            if (!!tex) {
                                var size = _this.img_heads[_seatIndex].getContentSize();
                                var sprite = new cc.Sprite(tex);
                                var size_sp = sprite.getContentSize();
                                sprite.setScaleX(size.width/size_sp.width);
                                sprite.setScaleY(size.height/size_sp.height);
                                sprite.setAnchorPoint(cc.p(0, 0));
                                _this.img_heads[_seatIndex].addChild(sprite);

                                util.cacheImage(_data.headUrl, tex);
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

        if(_data["isOffLine"] == 1){
            this.img_offlines[_seatIndex].setVisible(true);
        }

        if(_data["isReady"] == 1)
        {
            this.img_readys[_seatIndex].setVisible(true);
        }

        this.updateStartBtn();
        //if(_data["uid"] == hall.user.uid){
        //    if(_data["isReady"] != 1)
        //    {
        //        this.showReadyBtn();
        //    }
        //}

        if(_data["playedTime"] <= 50){
           // this.img_news[_seatIndex].setVisible(true);
        }

        //SEATING:0,
        //    WATING:1,
        //    READY: 2,           //准备阶段 1秒进入下一阶段
        //    INITTABLE: 3,       //初始化牌桌阶段 包括 初始化玩家信息、数据信息、庄家判断、牌的初始化、洗牌、发牌
        //    PLAYING:4,          //游戏中状态
        //    GAMERESULT:5,        //游戏结果阶段 5秒给客户端展示阶段
        //    GAMEOVER:6

        switch (this._tableStatus){
            case TABLE_STATUS.UN_GAME:{
                this.img_readys[_seatIndex].setVisible(_data["isReady"] == 1);
                if(_data["uid"] == hall.user.uid){
                    this.btn_ready.setVisible(_data["isReady"] == 0);
                }

            }
                break;
            case TABLE_STATUS.SLEEP:{
                this.img_readys[_seatIndex].setVisible(_data["isReady"] == 1);
                if(_data["uid"] == hall.user.uid){
                    this.btn_ready.setVisible(_data["isReady"] == 0);
                }
            }
                break;
            case TABLE_STATUS.READY:{
                this.img_readys[_seatIndex].setVisible(_data["isReady"] == 1);
                if(_data["uid"] == hall.user.uid){
                    this.btn_ready.setVisible(_data["isReady"] == 0);
                }
            }
                break;
            case TABLE_STATUS.GAMBLING:
            {
                this.clearReadyMark();
                this.btn_ready.setVisible(false);
                if(this._wanFa == WAN_FA.MINGPAIQIANGZHAUNG){

                    if(_data["isGambled"] == -1){ //未抢庄
                        this.showTip("请操作抢庄...",5);
                        this.showRapBtn();
                    }else{
                        this.showTip("请等待其他玩家操作抢庄...");
                        this.showPlayerRapResult(_data["uid"],_data["isGambled"]);
                    }


                    if(hall.user.uid == _data["uid"])
                    {
                        this._cards = _data["paiQi"];
                        this._niuCards = _data["paiNiu"];
                        this._niuType = _data["paiType"];

                        var cardsData = {};
                        cardsData["paiQi"] = _data["paiQi"];
                        cardsData["paiNiu"] = _data["paiNiu"];
                        cardsData["paiType"] = _data["paiType"];

                        this.resumeFront4Cards(_data["uid"],cardsData);
                    }else{
                        this.resumeBackCards(_data["uid"],4)
                    }
                }
            }
                break;

            case TABLE_STATUS.CHIP_IN:
            {
                this.clearReadyMark();
                this.btn_ready.setVisible(false);
                if(this._wanFa == WAN_FA.MINGPAIQIANGZHAUNG){
                    if(this._banker_id != _data["uid"]){
                        if(_data["isChipIn"] != 0){
                            this.showTip("请等待其他玩家下注...",-1);
                            this.resumeSeatChip(_seatIndex,_data["diFen"]);
                        }else{
                            var chipArr = this._diFen.split("|");
                            console.log("chipArr:");
                            console.log(chipArr);
                            this.showTip("请选择下注分数...",5);
                            this.showChipBtn(chipArr);
                        }
                    }else{
                        this.showTip("请等待其他玩家下注...",-1);
                        this.showPlayerRapResult(this._banker_id,_data["isGambled"]);
                    }

                    if(hall.user.uid == _data["uid"])
                    {
                        this._cards = _data["paiQi"];
                        this._niuCards = _data["paiNiu"];
                        this._niuType = _data["paiType"];

                        var cardsData = {};
                        cardsData["paiQi"] = _data["paiQi"];
                        cardsData["paiNiu"] = _data["paiNiu"];
                        cardsData["paiType"] = _data["paiType"];

                        this.resumeFront4Cards(_data["uid"],cardsData);
                    }else{
                        this.resumeBackCards(_data["uid"],4)
                    }
                }else if(this._wanFa == WAN_FA.NIUNIUSHANGZHUANG){
                    if(hall.user.uid == _data["uid"])
                    {
                        if(this._banker_id == _data["uid"]){
                            this.showTip("请等待闲家下注...",5);
                        }else{
                            if(_data["isChipIn"] != 0){
                                this.showTip("请等待其他玩家下注...",-1);
                                this.resumeSeatChip(_seatIndex,_data["diFen"]);
                            }else{
                                var chipArr = this._diFen.split("|");
                                console.log("chipArr:");
                                console.log(chipArr);
                                this.showTip("请选择下注分数...",5);
                                this.showChipBtn(chipArr);
                            }
                        }
                    }else{
                        if(_data["isChipIn"] != 0){
                            this.resumeSeatChip(_seatIndex,_data["diFen"]);
                        }
                    }
                }


                if(this._wanFa == WAN_FA.MINGPAIQIANGZHAUNG || this._wanFa == WAN_FA.NIUNIUSHANGZHUANG){
                    if(this._banker_id == _data["uid"]){
                        this.img_bankers[_seatIndex].setVisible(true);
                    }
                }

            }
                break;
            case TABLE_STATUS.GAMING:{
                this.btn_ready.setVisible(false);
                this.clearReadyMark();

                if(this._wanFa == WAN_FA.MINGPAIQIANGZHAUNG){


                    if(this._banker_id == _data["uid"]){
                        this.showBankerRapResult(_data["uid"],_data["isGambled"]);
                    }else{
                        this.resumeSeatChip(_seatIndex,_data["diFen"]);
                    }

                    if(hall.user.uid == _data["uid"])
                    {
                        this._cards = _data["paiQi"];
                        this._niuCards = _data["paiNiu"];
                        this._niuType = _data["paiType"];

                        var cardsData = {};
                        cardsData["paiQi"] = _data["paiQi"];
                        cardsData["paiNiu"] = _data["paiNiu"];
                        cardsData["paiType"] = _data["paiType"];
                        if(_data["isPutCard"] == 0){

                            this.resumeFront4Cards(_data["uid"],cardsData);
                            this.resumeBackIndexCard(_data["uid"],4);
                            this.showCheckOp();
                        }else{
                            this.resumeFrontCards(_data["uid"],cardsData);
                        }

                    }else{

                        if(_data["isPutCard"] == 0){
                            this.resumeBackCards(_data["uid"]);
                        }else{
                            var cardsData = {};
                            cardsData["paiQi"] = _data["paiQi"];
                            cardsData["paiNiu"] = _data["paiNiu"];
                            cardsData["paiType"] = _data["paiType"];

                            this.resumeFrontCards(_data["uid"],cardsData);
                        }

                    }

                }else if(this._wanFa == WAN_FA.TONGBI){
                    if(_data["uid"] == hall.user.uid){
                        this._cards = _data["paiQi"];
                        this._niuCards = _data["paiNiu"];
                        this._niuType = _data["paiType"];
                    }

                    this.resumeSeatChip(_seatIndex,_data["diFen"]);
                    if(_data["isPutCard"] == 0){
                        this.resumeBackCards(_data["uid"]);
                        if(_data["uid"] == hall.user.uid){
                            this.showTip("请亮牌",-1);
                            this.showCheckOp();
                        }

                    }else{
                        var cardsData = {};
                        cardsData["paiQi"] = _data["paiQi"];
                        cardsData["paiNiu"] = _data["paiNiu"];
                        cardsData["paiType"] = _data["paiType"];

                        this.resumeFrontCards(_data["uid"],cardsData);
                    }
                }else if(this._wanFa == WAN_FA.NIUNIUSHANGZHUANG){
                    if(_data["uid"] == hall.user.uid){
                        this._cards = _data["paiQi"];
                        this._niuCards = _data["paiNiu"];
                        this._niuType = _data["paiType"];
                    }
                    if(this._banker_id != _data["uid"]){
                        this.resumeSeatChip(_seatIndex,_data["diFen"]);
                    }

                    if(_data["isPutCard"] == 0){
                        this.resumeBackCards(_data["uid"]);
                        if(_data["uid"] == hall.user.uid){
                            this.showTip("请亮牌",-1);
                            this.showCheckOp();
                        }
                    }else{
                        var cardsData = {};
                        cardsData["paiQi"] = _data["paiQi"];
                        cardsData["paiNiu"] = _data["paiNiu"];
                        cardsData["paiType"] = _data["paiType"];

                        this.resumeFrontCards(_data["uid"],cardsData);
                    }

                }




                if(this._wanFa == WAN_FA.MINGPAIQIANGZHAUNG || this._wanFa == WAN_FA.NIUNIUSHANGZHUANG){
                    if(this._banker_id == _data["uid"]){
                        this.img_bankers[_seatIndex].setVisible(true);
                    }
                }

            }
                break;
            case TABLE_STATUS.GAME_RESULT:{
                this.btn_ready.setVisible(_data["isReady"] == 0);
            }
                break;
            case TABLE_STATUS.GAME_OVER:{

            }
                break;


        }

    },

    showPlayerTrust: function (_uid) {
        var seatIndex = this.getSeatIdByUid(_uid);
        this.img_trusts[seatIndex].setVisible(true);
    },

    hidePlayerTrust:function(_uid){
        var seatIndex = this.getSeatIdByUid(_uid);
        this.img_trusts[seatIndex].setVisible(false);
    },

    clearPlayerTrust:function(){
        for(var i = 0 ;i<8;i++){
            var seatIndex = i;
            this.img_trusts[seatIndex].setVisible(true);
        }
    },

    showPlayerOffline: function (_uid) {
        var seatIndex = this.getSeatIdByUid(_uid);
        this.img_offlines[seatIndex].setVisible(true);
    },

    hidePlayerOffline:function(_uid){
        var seatIndex = this.getSeatIdByUid(_uid);
        this.img_offlines[seatIndex].setVisible(false);
    },

    clearPlayerOffline:function(){
        for(var i = 0 ;i<8;i++){
            var seatIndex = i;
            this.img_offlines[seatIndex].setVisible(true);
        }
    },

    clearReadyMark:function(){
        for(var i = 0 ;i < 8;i++){
            this.showReadyMark(i,0);
        }

    },

    clearBankerMark:function(){
        for(var i = 0 ;i < 8;i++){
            this.img_bankers[i].setVisible(false);
        }

    },


    getNowPlayerCount: function () {

        return this._players.length;
    },


    showReadyMark: function (_seatIndex,_ready) {
      this.img_readys[_seatIndex].setVisible(_ready == 1);
    },

    removePlayer:function(_seatIndex){
        this.panel_seats[_seatIndex].setVisible(false);
        this.img_defaults[_seatIndex].setVisible(false);
        this.img_heads[_seatIndex].setVisible(false);
        this.img_defaults[_seatIndex].setVisible(true);
        this.text_scores[_seatIndex].setVisible(false);
        this.text_names[_seatIndex].setVisible(false);
        this.img_offlines[_seatIndex].setVisible(false);
        this.img_bankers[_seatIndex].setVisible(false);
        this.img_speakers[_seatIndex].setVisible(false);
        this.img_msgs[_seatIndex].setVisible(false);
        this.text_msgs[_seatIndex].setVisible(false);
        this.img_emojis[_seatIndex].setVisible(false);
        this.img_news[_seatIndex].setVisible(false);
        this.img_readys[_seatIndex].setVisible(false);
        this.img_trusts[_seatIndex].setVisible(false);
    },



    //卡牌接口
    backOfCard:function() {
        var img_back = new ccui.ImageView("nn_paibei.png", ccui.Widget.PLIST_TEXTURE);
        img_back.setScale(0.75,0.75);
        return img_back;
    },

    backOfCardNormal: function () {
        var img_back = new ccui.ImageView("nn_paibei.png", ccui.Widget.PLIST_TEXTURE);
        //img_back.setScale(0.75,0.75);
        return img_back;
    },

    frontOfCard: function (_cardId) {
        var img_name = CardPath[_cardId];

        //console.log("img_name:"+img_name);
        var img_front = new ccui.ImageView(img_name, ccui.Widget.PLIST_TEXTURE);

        img_front.tid = _cardId;
        return img_front;
    },

    frontOtherOfCard: function (_cardId) {
        var img_name = CardPath[_cardId];

        //console.log("img_name:"+img_name);
        var img_front = new ccui.ImageView(img_name, ccui.Widget.PLIST_TEXTURE);
        img_front.setScale(CARD_SCALE);
        img_front.tid = _cardId;
        return img_front;
    },

    posOfCardIndex:function(_seatIndex,_cardIndex){
        if (_seatIndex >= 0 && _cardIndex >= 0){
            if(_seatIndex == this.TABID_SELF)
            {
                var size = this.panel_cards[this.TABID_SELF].getContentSize();
                var pos = this.panel_cards[this.TABID_SELF].convertToWorldSpace(cc.p(CARD_WIDTH*0.5+CARD_WIDTH*_cardIndex,CARD_HEIGHT*0.5));
                return pos;

            }else{
                //console.log("card _seatIndex:",_seatIndex);

                var size = this.panel_cards[_seatIndex].getContentSize();

                var pos = this.panel_cards[_seatIndex].convertToWorldSpace(cc.p(CARD_WIDTH_OTHER*0.5+CARD_PADDING*_cardIndex,CARD_HEIGHT_OTHER*0.5));
                return pos;
            }
        }else{

        }
    },

    posOfMyCardIndex:function(_cardIndex){
        if (_cardIndex >= 0){
            var size = this.panel_cards[this.TABID_SELF].getContentSize();
            var padding = CARD_PADDING*2;
            var tmpX = size.width*0.5 + (_cardIndex-2)*padding;
            var pos = this.panel_cards[this.TABID_SELF].convertToWorldSpace(cc.p(tmpX,CARD_HEIGHT*0.5));
            //var pos = this.panel_cards[this.TABID_SELF].convertToWorldSpace(cc.p(CARD_WIDTH*0.5+CARD_PADDING*_cardIndex*1.25,CARD_HEIGHT*0.5));
            return pos;
        }
    },



    setCardTag:function(_img_card,_seatIndex,_cardIndex){
        _img_card.setTag(this.getCardTag(_seatIndex,_cardIndex));
    },

    getCardTag:function(_seatIndex,_cardIndex){
        return 1000*(8-_seatIndex)+_cardIndex;
    },

    getCardTypeTag:function(_seatIndex){
      return   1000*(8-_seatIndex)+ 10;
    },


    cleanSeatCards:function(_seatIndex){
        for(var j = 0 ; j < 5;j++)
        {
            var card = this.panel_desk.getChildByTag(this.getCardTag(_seatIndex,j));
            if(card != null)
            {
                card.stopAllActions();
                //card.removeFromParent();
                this.panel_desk.removeChildByTag(this.getCardTag(_seatIndex,j));
            }
        }

        if(this.panel_desk.getChildByTag(this.getCardTypeTag(_seatIndex)))
        {
            this.panel_desk.removeChildByTag(this.getCardTypeTag(_seatIndex));
        }
    },

    cleanDeskCards: function () {
          for(var i = 0;i < 8;i++)
          {
              for(var j = 0 ; j < 5;j++)
              {
                  if(this.panel_desk.getChildByTag(this.getCardTag(i,j)))
                  {
                      this.panel_desk.removeChildByTag(this.getCardTag(i,j));
                  }
              }

              if(this.panel_desk.getChildByTag(this.getCardTypeTag(i)))
              {
                  this.panel_desk.removeChildByTag(this.getCardTypeTag(i));
              }
          }
    },

    removePlayerCards:function(_seatIndex){
        for(var i = 0;i<5;i++) {
            this.panel_desk.removeChildByTag(this.getCardTag(_seatIndex,i));
        }
    },

    //licensingAllPlayers:function(){
    //    this._card_index = 0;
    //    this.img_heap.setVisible(false);
    //    if(this._seatIndex < 8)
    //    {
    //        this.licensingOnePlayer();
    //        this._seatIndex = this._seatIndex + 1;
    //    }
    //    else{
    //        this.img_heap.setVisible(false);
    //    }
    //},

    beginLicensing4Cards:function(){
        for(var i = 0; i <this._playingSeats.length;i++){
            this.licensingOnePlayer4Cards(this._playingSeats[i],0.25*i);
        }

        this.panel_rap.stopAllActions();
        this.panel_rap.runAction(cc.sequence(cc.delayTime(0.2*i),cc.callFunc(this.showRapBtn.bind(this))));
    },

    licensingOnePlayer4Cards: function (_seatIndex,_delayTime) {
        for(var i = 0;i < 4;i++)
        {
            var posDest = this.posOfCardIndex(_seatIndex,i);
            var img_card = null;
            if(_seatIndex == TABID_SELF){
                var cardNum = this.getCardId(this._cards[i]);
                img_card = this.frontOfCard(cardNum);
            }else{
                img_card = this.img_heap.clone();
            }

            var tag = this.getCardTag(_seatIndex,i);
            img_card.setTag(tag);
            img_card.setVisible(true);
            this.panel_desk.addChild(img_card,tag,tag);
            img_card.setPosition(this.img_heap.getPosition());

            var scale = CARD_SCALE;
            if(TABID_SELF == _seatIndex){
                scale = 1.0;
            }

            var dt = 0.1;
            var moveTo = cc.moveTo(dt,posDest);
            var scaleTo = cc.scaleTo(dt,scale);

            var callback = cc.callFunc(this.licensingCardEnd,this,[_seatIndex,i]);
            var soundBack = cc.callFunc(function () {
                sound.playSound(NiuniuSound.sendCard);
            });

            img_card.runAction(cc.sequence(cc.delayTime(_delayTime+0.02*i),soundBack,cc.spawn(moveTo,scaleTo),callback));
        }
    },

    beginLicensing5thCard:function(){
        for(var i = 0; i <this._playingSeats.length;i++){
            this.licensingOnePlayer5thCard(this._playingSeats[i],0.2*i);
        }

        this.panel_rap.stopAllActions();
        this.panel_rap.runAction(cc.sequence(cc.delayTime(0.2*i),cc.callFunc(this.showCheckOp.bind(this))));
    },

    licensingOnePlayer5thCard: function (_seatIndex,_delayTime) {
        var index = 4;
        var posDest = this.posOfCardIndex(_seatIndex,index);
        var img_card = this.img_heap.clone();
        var tag = this.getCardTag(_seatIndex,index);
        img_card.setTag(tag);
        img_card.setVisible(true);
        this.panel_desk.addChild(img_card,tag,tag);
        img_card.setPosition(this.img_heap.getPosition());

        var scale = CARD_SCALE;
        if(TABID_SELF == _seatIndex){
            scale = 1.0;
        }

        var dt = 0.1;
        var moveTo = cc.moveTo(dt,posDest);
        var scaleTo = cc.scaleTo(dt,scale);

        var callback = cc.callFunc(this.licensingCardEnd,this,[_seatIndex,index]);
        var soundBack = cc.callFunc(function () {
            sound.playSound(NiuniuSound.sendCard);
        });

        img_card.runAction(cc.sequence(cc.delayTime(_delayTime+0.02*index),soundBack,cc.spawn(moveTo,scaleTo),callback));

    },


    beginLicensingCards: function () {
      for(var i = 0; i <this._playingSeats.length;i++){
          this.licensingOnePlayerCards(this._playingSeats[i],0.25*i);
      }

        this.panel_op.stopAllActions();
        this.panel_op.runAction(cc.sequence(cc.delayTime(0.2*i),cc.callFunc(this.showCheckOp.bind(this))));
    },

    licensingOnePlayerCards: function (_seatIndex,_delayTime) {
        for(var i = 0;i < 5;i++)
        {
            var posDest = this.posOfCardIndex(_seatIndex,i);
            var img_card = this.img_heap.clone();
            var tag = this.getCardTag(_seatIndex,i);
            img_card.setTag(tag);
            img_card.setVisible(true);
            this.panel_desk.addChild(img_card,tag,tag);
            img_card.setPosition(this.img_heap.getPosition());

            var scale = CARD_SCALE;
            if(TABID_SELF == _seatIndex){
                scale = 1.0;
            }

            var dt = 0.1;
            var moveTo = cc.moveTo(dt,posDest);
            var scaleTo = cc.scaleTo(dt,scale);

            var callback = cc.callFunc(this.licensingCardEnd,this,[_seatIndex,i]);
            var soundBack = cc.callFunc(function () {
                sound.playSound(NiuniuSound.sendCard);
            });

            img_card.runAction(cc.sequence(cc.delayTime(_delayTime+0.02*i),soundBack,cc.spawn(moveTo,scaleTo),callback));
        }
    },

    licensingCardEnd:function(_target,_data)
    {
        var seatIndex = _data[0]+1;
        var cardIndex = _data[1];
        console.log("this.seatindex:"+this._card_index);
        console.log("seatIndex:"+_data[0]+",cardIndex:"+_data[1]);

        var lastSeatIndex= this._playingSeats[this._playingSeats.length - 1];
        if(seatIndex == lastSeatIndex)
        {
            console.log("ffff 发完牌啦");
        }
    },

    //licensingOnePlayer:function(){
    //    if(this._card_index  < 5)
    //    {
    //        var posTarget = this.posOfCardIndex(this._seatIndex,this._card_index);
    //        var posSource = this.img_heap.getPosition();
    //        this.licenseToCard(posSource,posTarget,this._seatIndex,this._card_index);
    //        this._card_index += 1;
    //    }else{
    //        this.licensingAllPlayers();
    //    }
    //
    //},
    //
    //
    //
    //licenseToCard:function(_posSource, _posDest, _seatIndex, _card_Index){
    //    var img_card = this.img_heap.clone();
    //    var tag = this.getCardTag(_seatIndex,_card_Index);
    //    img_card.setTag(tag);
    //    img_card.setVisible(true);
    //    this.panel_desk.addChild(img_card);
    //    img_card.setPosition(this.img_heap.getPosition());
    //    img_card.setLocalZOrder(tag);
    //    var scale = CARD_SCALE;
    //    if(TABID_SELF == _seatIndex){
    //        scale = 1.0;
    //    }
    //    var dt = 0.05;
    //    var moveTo = cc.moveTo(dt,_posDest);
    //    var scaleTo = cc.scaleTo(dt,scale);
    //    var callback = cc.callFunc(function(){
    //        this.licensingOnePlayer();
    //    }.bind(this));
    //    img_card.runAction(cc.sequence(cc.spawn(moveTo,scaleTo),callback));
    //},

    showCardType:function(_seatIndex,_cardType){
        var img_type = this.img_type.clone();
        img_type.setVisible(true);
        var size_img = img_type.getContentSize();
        var tag = this.getCardTypeTag(_seatIndex);
        this.panel_desk.removeChildByTag(tag);
        this.panel_desk.addChild(img_type,tag,tag);
        var size = this.panel_cards[_seatIndex].getContentSize();
        var pos = this.panel_cards[_seatIndex].convertToWorldSpace(cc.p(size.width*0.5,size_img.height*0.5));
        img_type.setPosition(pos);
    },

    getCardId:function(_card)
    {
        return _card["type"] + ""+_card["value"];
    },

    showNiuCardUp: function(_data) {
        if(this._niuType != NNCardType.NONE)
        {
            for(var j = 0 ; j < 5;j++){
                var tag = this.getCardTag(TABID_SELF,j);
                var img_card = this.panel_desk.getChildByTag(tag);
                if(img_card != null &&img_card != undefined ){
                    for(var i = 0;i<this._niuCards;i++){
                        var cardId = this.getCardId(this._niuCards[i])
                        if(img_card.tid == cardId){
                            img_card.runAction(cc.moveBy(0.15,cc.p(0,40)));
                            break;
                        }
                    }
                }

            }
        }
    },

    showNiuType:function(_seatIndex,_niuType)
    {
        if(_seatIndex == TABID_SELF)
        {
            var img_type = this.img_type.clone();
            img_type.ignoreContentAdaptWithSize(false);
            img_type.loadTexture("whnn_niu"+_niuType+".png",ccui.Widget.PLIST_TEXTURE);
            img_type.setScale(0.8);
            img_type.setVisible(true);
            var size_img = img_type.getContentSize();
            var tag = this.getCardTypeTag(_seatIndex);
            this.panel_desk.removeChildByTag(tag);
            this.panel_desk.addChild(img_type,tag,tag);
            var size = this.panel_cards[_seatIndex].getContentSize();
            var pos = this.panel_cards[_seatIndex].convertToWorldSpace(cc.p(size.width*0.47,size_img.height*0.47));
            img_type.setPosition(pos);
        }else
        {
            var img_type = this.img_type.clone();
            img_type.ignoreContentAdaptWithSize(false);
            img_type.loadTexture("whnn_niu"+_niuType+".png",ccui.Widget.PLIST_TEXTURE);
            img_type.setVisible(true);
            var size_img = img_type.getContentSize();
            var tag = this.getCardTypeTag(_seatIndex);
            this.panel_desk.removeChildByTag(tag);
            this.panel_desk.addChild(img_type,tag,tag);
            var size = this.panel_cards[_seatIndex].getContentSize();
            var pos = this.panel_cards[_seatIndex].convertToWorldSpace(cc.p(size.width*0.34,size_img.height*0.34));
            img_type.setPosition(pos);
        }
    },



    clearAllCardType: function () {
        for(var i = 0;i<8;i++)
        {
            this.removeCardType(i);
        }
    },

    removeCardType:function(_seatIndex){
        if(_seatIndex != undefined && _seatIndex != null){
            var tag = this.getCardTypeTag(_seatIndex);
            if(this.panel_desk.getChildByTag(tag)){
                this.panel_desk.removeChildByTag(tag);
            }
        }
    },


    checkMyHandCards:function(_cards,_cardIndex){
        var cards = _cards;

        var showEnd = function (_sender,_data) {
            var seatIndex = _data[0];
            var cardIndex = _data[1];
        }

        var endCallback = function(){

        }

        var scale_up = 1.2;
        var scale_b = 1.0;

        var scale = 1.0;
        var turnFront = function(_sender,_table){
            var seatIndex = _table[0];
            var cardIndex = _table[1];
            var cardValue = _table[2];
            var img_card = this.frontOfCard(cardValue);
            var tag = this.getCardTag(seatIndex,cardIndex);
            this.panel_desk.addChild(img_card,tag,tag);
            img_card.setVisible(false);
            img_card.setScaleX(0.01);
            img_card.setScaleY(scale_up);

            var pos = this.posOfCardIndex(seatIndex,cardIndex);
            img_card.setPosition(pos);
            var showIt = cc.show();

            var turnF = cc.scaleTo(0.1,scale_up*scale,1.0*scale);
            var turnF2 = cc.scaleTo(0.1,1.0*scale,1.0*scale);
            if(cardIndex == 4){
                img_card.runAction(cc.sequence(showIt,turnF,turnF2,cc.callFunc(showEnd.bind(this),this,[TABID_SELF,cardIndex])));
            }else
            {
                img_card.runAction(cc.sequence(showIt,turnF,turnF2));
            }
        }.bind(this);

        for(var i = _cardIndex;i<5;i++){
            var tag = this.getCardTag(TABID_SELF,i);
            var img_back = this.panel_desk.getChildByTag(tag);
            var cardNum = this.getCardId(cards[i]);
            console.log("cardNum:"+cardNum);
            if(img_back){
                var turnB = cc.scaleTo(0.15,0.01,scale_up*scale);
                var delay = cc.delayTime(0.2);
                //img_back.setTag(10000+i);
                img_back.runAction(cc.sequence(delay,turnB,cc.callFunc(turnFront,this,[TABID_SELF,i,cardNum]),cc.removeSelf()));
            }
        }
    },

    upMyNiuCards:function(){
        var cards = this._cards;
        var niuCards = this._niuCards;
        var otherCards = [];
        var niuType = this._niuType;
        var newCards = [];

        var niuCardIs = [];
        for(var i = 0;i<niuCards.length;i++){
            var tid = this.getCardId(niuCards[i]);
            for(var j = 0;j < 5;j++){
                var tag = this.getCardTag(TABID_SELF,j);
                var img_card = this.panel_desk.getChildByTag(tag);
                if(img_card != null){
                    if(img_card.tid == tid){
                        var pos = img_card.getPosition();
                        img_card.setPosition(pos.x,pos.y + 20);
                    }
                }else{
                    console.log("imgCard tid null");
                }


            }
        }

        this.showNiuType(TABID_SELF,niuType);
        sound.playSound(NiuniuSound.cardSelect);
    },

    playNiuSound: function (_uid,_niuType) {
        var info = this.getPlayerInfo(_uid);
        var sex = info["userSex"];
        if(sex == 1){
            sound.playSound(NiuniuSound.Males[_niuType]);
        }else
        {
            sound.playSound(NiuniuSound.Females[_niuType]);
        }
    },

    resumeBackIndexCard:function(_uid,index) {
        var _seatIndex = this.getSeatIdByUid(_uid);

        var img_card = this.img_heap.clone();
        var tag = this.getCardTag(_seatIndex,index);
        img_card.setTag(tag);
        img_card.setVisible(true);
        this.panel_desk.addChild(img_card,tag,tag);
        var posDest = this.posOfCardIndex(_seatIndex,index);
        img_card.setPosition(posDest);

        var scale = CARD_SCALE;
        if(TABID_SELF == _seatIndex){
            scale = 1.0;
        }
        img_card.setScale(scale);

    },

    resumeBackCards: function (_uid,num) {
        var _seatIndex = this.getSeatIdByUid(_uid);
        var count = 5;
        if(num != undefined && num != null){
            count = num;
        }
        for(var i = 0;i < count;i++){
            var img_card = this.img_heap.clone();
            var tag = this.getCardTag(_seatIndex,i);
            img_card.setTag(tag);
            img_card.setVisible(true);
            this.panel_desk.addChild(img_card,tag,tag);
            var posDest = this.posOfCardIndex(_seatIndex,i);
            img_card.setPosition(posDest);

            var scale = CARD_SCALE;
            if(TABID_SELF == _seatIndex){
                scale = 1.0;
            }
            img_card.setScale(scale);
        }
    },


    resumeFrontCards: function (_uid,_cardsData) {
        var _seatIndex = this.getSeatIdByUid(_uid);

        var cards = _cardsData["paiQi"];
        var niuCards = _cardsData["paiNiu"]
        var otherCards = [];
        var niuType = _cardsData["paiType"];


        var newCards = [];
        if(niuType != NNCardType.NONE && niuType != undefined && niuType != null)
        {
            otherCards = [];
            for(var i = 0;i<cards.length;i++){
                var contain = containValue(niuCards,cards[i]);
                if(!contain){
                    niuCards.push(cards[i])
                }
            }
            newCards = niuCards;
        }else{
            newCards = cards;
        }

        this.cleanSeatCards(_seatIndex);
        if(_seatIndex == TABID_SELF){

            for(var i = 0 ; i<newCards.length;i++){
                var tid = this.getCardId(newCards[i]);
                var tag = this.getCardTag(TABID_SELF,i);
                var img_card = this.frontOfCard(tid);
                this.panel_desk.addChild(img_card,tag,tag);
                var pos = this.posOfMyCardIndex(i);
                if(niuType == NNCardType.NONE && i < 3){
                    pos.x -= 20;
                }
                img_card.setPosition(pos);
            }
            this.showNiuType(_seatIndex,niuType);
        }else{
            for(var i = 0 ; i<newCards.length;i++){
                var tid = this.getCardId(newCards[i]);
                var tag = this.getCardTag(_seatIndex,i);
                var img_card = this.frontOtherOfCard(tid);
                this.panel_desk.addChild(img_card,tag,tag);
                var pos = this.posOfCardIndex(_seatIndex,i);
                if(niuType == NNCardType.NONE && i < 3){
                    pos.x -= 7;
                }

                img_card.setPosition(pos);
            }
            this.showNiuType(_seatIndex,niuType);
        }
    },

    resumeFront4Cards: function (_uid,_cardsData) {
        var _seatIndex = this.getSeatIdByUid(_uid);

        var cards = _cardsData["paiQi"];

        var newCards = cards;

        this.cleanSeatCards(_seatIndex);
        if(_seatIndex == TABID_SELF){

            for(var i = 0 ; i<4;i++){
                var tid = this.getCardId(newCards[i]);
                var tag = this.getCardTag(TABID_SELF,i);
                var img_card = this.frontOfCard(tid);
                this.panel_desk.addChild(img_card,tag,tag);
                var pos = this.posOfCardIndex(TABID_SELF,i);

                img_card.setPosition(pos);
            }
        }else{
            for(var i = 0 ; i<4;i++){
                var tid = this.getCardId(newCards[i]);
                var tag = this.getCardTag(_seatIndex,i);
                var img_card = this.frontOtherOfCard(tid);
                this.panel_desk.addChild(img_card,tag,tag);
                var pos = this.posOfCardIndex(_seatIndex,i);

                img_card.setPosition(pos);
            }
        }
    },

    openCards:function(_uid,_cardsData){
        var _seatIndex = this.getSeatIdByUid(_uid);
        this.cleanSeatCards(_seatIndex);
        var cards = _cardsData["paiQi"];
        var niuCards = _cardsData["paiNiu"]
        var otherCards = [];
        var niuType = _cardsData["paiType"];

        this.playNiuSound(_uid,niuType);
        var newCards = [];
        if(niuType != NNCardType.NONE)
        {
            otherCards = [];
            for(var i = 0;i<cards.length;i++){
                var contain = containValue(niuCards,cards[i]);
                if(!contain){
                    niuCards.push(cards[i])
                }
            }
            newCards = niuCards;
        }else{
            newCards = cards;
        }



        if(_seatIndex == TABID_SELF){
            this.cleanSeatCards(TABID_SELF);
            for(var i = 0 ; i<newCards.length;i++){
                var tid = this.getCardId(newCards[i]);
                var tag = this.getCardTag(TABID_SELF,i);
                var img_card = this.frontOfCard(tid);

                this.panel_desk.addChild(img_card,tag,tag);
                var pos = this.posOfMyCardIndex(i);
                if(niuType != NNCardType.NONE && i < 3){
                    pos.x -= 30;
                }

                img_card.setPosition(pos);
            }
            this.showNiuType(_seatIndex,niuType);
        }else{
            for(var i = 0 ; i<newCards.length;i++){
                var tid = this.getCardId(newCards[i]);
                var tag = this.getCardTag(_seatIndex,i);
                var img_card = this.frontOtherOfCard(tid);
                this.panel_desk.addChild(img_card,tag,tag);
                var pos = this.posOfCardIndex(_seatIndex,i);
                if(niuType == NNCardType.NONE && i < 3){
                    pos.x -= 7;
                }

                img_card.setPosition(pos);
            }
            this.showNiuType(_seatIndex,niuType);
        }
    },

    //openCards:function(_seatIndex,_cardsData){
    //    var cards = _cardsData["paiQi"];
    //    var niuCards = _cardsData["paiNiu"]
    //    var otherCards = [];
    //    var niuType = _cardsData["paiType"];
    //    var newCards = [];
    //    if(niuType != NNCardType.NONE)
    //    {
    //        otherCards = [];
    //        for(var i = 0;i<cards.length;i++){
    //            var contain = containValue(niuCards,cards[i]);
    //            if(!contain){
    //                niuCards.push(cards[i])
    //            }
    //        }
    //        newCards = niuCards;
    //    }else{
    //        newCards = cards;
    //    }
    //
    //
    //    var showEnd = function (_sender,_data) {
    //        var seatIndex = _data[0];
    //        var cardIndex = _data[1];
    //        this.showNiuType(seatIndex,niuType);
    //        if(niuType != NNCardType.NONE)
    //        {
    //            for(var i = 0;i<5;i++){
    //                var tag = this.getCardTag(seatIndex,i);
    //                var img_card = this.panel_desk.getChildByTag(tag);
    //                var pos = this.posOfCardIndex(seatIndex,i);
    //                var offset = (i-3)*10;
    //                img_card.setPosition(pos.x + offset,pos.y);
    //            }
    //        }
    //    }
    //
    //    var endCallback = function(){
    //
    //    }
    //
    //    var scale_up = 1.2;
    //    var scale_b = 1.0;
    //
    //    var scale = CARD_SCALE;
    //    if(_seatIndex == TABID_SELF)
    //    {
    //        scale = 1.0;
    //    }
    //
    //    var turnFront = function(_sender,_table){
    //        var seatIndex = _table[0];
    //        var cardIndex = _table[1];
    //        var cardValue = _table[2];
    //        var img_card = this.frontOfCard(cardValue);
    //        var tag = this.getCardTag(seatIndex,cardIndex);
    //        this.panel_desk.addChild(img_card,tag,tag);
    //        img_card.setVisible(false);
    //        img_card.setScaleX(0.01);
    //        img_card.setScaleY(scale_up);
    //
    //        var pos = this.posOfCardIndex(seatIndex,cardIndex);
    //        img_card.setPosition(pos);
    //        var showIt = cc.show();
    //
    //        var turnF = cc.scaleTo(0.1,scale_up*scale,1.0*scale);
    //        var turnF2 = cc.scaleTo(0.1,1.0*scale,1.0*scale);
    //        if(cardIndex == 4){
    //            img_card.runAction(cc.sequence(showIt,turnF,turnF2,cc.callFunc(showEnd.bind(this),this,[_seatIndex,cardIndex])));
    //            //img_card.runAction(cc.sequence(showIt,turnF,turnF2,cc.callFunc(endCallback.bind(this))));
    //        }else
    //        {
    //            img_card.runAction(cc.sequence(showIt,turnF,turnF2));
    //        }
    //    }.bind(this);
    //
    //    for(var i = 0;i<5;i++){
    //        var tag = this.getCardTag(_seatIndex,i);
    //        var img_back = this.panel_desk.getChildByTag(tag);
    //        var cardNum = this.getCardId(newCards[i]);
    //        console.log("cardNum:"+cardNum);
    //        if(img_back){
    //            var turnB = cc.scaleTo(0.15,0.01,scale_up*scale);
    //            var delay = cc.delayTime(0.2);
    //            img_back.setTag(10000+i);
    //            img_back.runAction(cc.sequence(delay,turnB,cc.callFunc(turnFront,this,[_seatIndex,i,cardNum]),cc.removeSelf()));
    //        }
    //    }
    //},


















    removePlayerData:function(_uid){
        var length = this._players.length -1;
        for(var i= 0;i < this._players.length;i++){
            var uid = this._players[i].uid;
            if(_uid == uid){
                this._players.splice(i,1);
                break;
            }
        }
    },


    showChipBtn: function (_data) {
        for(var i =0;i<_data.length;i++){
            this.btn_chips[i].setVisible(true);
            var text_num = ccui.helper.seekWidgetByName(this.btn_chips[i],"text_num");
            text_num.setString(_data[i]);
            this.btn_chips[i].setTag(parseInt(_data[i]));

        }
    },

    hideChipBtn: function () {
        for(var i =0;i<2;i++){
            this.btn_chips[i].setVisible(false);
            var text_num = ccui.helper.seekWidgetByName(this.btn_chips[i],"text_num");
        }
    },

    addSeatId:function(_playerData){
        if(_playerData.position > this._totalPlayerCount  || _playerData.position < 0){
            console.log("seat error");
            return;
        }

        if(_playerData["uid"] == hall.user.uid){
            this._seatRelativeIds[TABID_SELF] = _playerData.position;
            //this._seatRelativeIds[_playerData.position] = TABID_SELF;


        }else{
            var emptySeat = this.findValidSeat();
            if(emptySeat != -1){
                this._seatRelativeIds[emptySeat] = _playerData.position;
            }else{
                console.log("_playerData_uid:"+_playerData["uid"]);
                console.log(this._seatRelativeIds);
            }

            //if(_playerData.position > this._myTabIndex){
            //    this._seatRelativeIds[_playerData.position] = _playerData.position - this._myTabIndex ;
            //}else
            //{
            //    this._seatRelativeIds[_playerData.position] = this._totalPlayerCount + _playerData.position - this._myTabIndex ;
            //}
        }
    },

    findValidSeat: function () {
        for(var i=1;i<8;i++){
            if(this._seatRelativeIds[i] == -1){
                return i;
            }
        }

        return -1;
    },


    addPlayer: function (info) {
        var uid = info["uid"];

        this.removePlayerData(uid);
        this._players.push(info);
    },

    clearAllPlayer: function () {
        this._players = [];
        this.clearAllChip();
        this.hideRapBtn();
        this.hidePlayerRap();
        this.clearAllPlayerReadyStatus();
        this.cleanDeskCards();
        this.clearBankerMark();
        this.clearPlayerOffline();
        this.clearReadyMark();
        this.clearPlayerTrust();
        this.hideOp();


    },



    getPlayerInfo: function (_uid) {
      for(var i = 0;i<this._players.length;i++){
          if(_uid == this._players[i].uid){
              return this._players[i];
          }
      }
        return null;
    },

    getSeatIdByUid: function (_uid) {
        var absId = this.getAbsSeatIdByUid(_uid);
        var seatId = this.getSeatRelativeId(absId);
        return seatId;
    },

    getAbsSeatIdByUid:function(_uid){
        for(var i = 0; i < this._players.length;i++){
            var user = this._players[i];
            if(user.uid == _uid){
                return user.position;
            }
        }
        return TABID_NULL;
    },

    getSeatRelativeId: function (_absId) {
      if(_absId < 0 || _absId > this._totalPlayerCount){
          return TABID_NULL;
      }
        //if(this._seatRelativeIds[_absId] == undefined ||this._seatRelativeIds[_absId] == -1){
        //    return TABID_NULL;
        //}

        for(var i =0;i<this._seatRelativeIds.length;i++){
            if(_absId == this._seatRelativeIds[i]){
                return i;
            }
        }

        return TABID_NULL;
    },

    onMessage: function (_msgId,_data) {
        switch (_msgId){
            case MSG_TYPE.INIT:
            {
                if(this.checkMsg(_data))
                {
                    this.clearAllPlayer();
                    var info = _data["tableStatus"];
                    this.updateTableInfo(info);
                    //this.initSeat();

                    var playerDataArray = info["players"];

                    for(var i = 0;i<playerDataArray.length;i++){
                        var info = playerDataArray[i]["player"];
                        info['isOffLine'] = playerDataArray[i]['isOffLine'];
                        info['coinNum'] = playerDataArray[i]['coinNum'];
                        info["isReady"] = playerDataArray[i]["isReady"];
                        info["paiQi"] = playerDataArray[i]["paiQi"];
                        info["isChipIn"] = playerDataArray[i]["isChipIn"];
                        info["isPutCard"] = playerDataArray[i]["isPutCard"];
                        info["paiQi"] = playerDataArray[i]["paiQi"];
                        info["paiType"] = playerDataArray[i]["paiType"];
                        info["paiNiu"] = playerDataArray[i]["paiNiu"];
                        info["diFen"] = playerDataArray[i]["diFen"];
                        info["isGambled"] = playerDataArray[i]["isGambled"];

                        var id = info["uid"];
                        var pos = info["position"];
                        if(id == hall.user.uid){
                            this._myTabIndex = pos;
                            this.addSeatId(info);
                            if(this._tableStatus == TABLE_STATUS.UN_GAME){
                                this.showTip("请准备",-1);
                            }

                        }
                        this.addPlayer(info);
                    }


                    for(var i = 0;i<this._players.length;i++)
                    {
                        var info = this._players[i];
                        if(info["uid"] != hall.user.uid){
                            this.addSeatId(info);
                        }
                    }
                    console.log("11111111");
                    for(var i = 0;i<this._players.length;i++)
                    {
                        var info = this._players[i];
                        var seatId = this.getSeatIdByUid(info["uid"]);
                        this.showPlayer(seatId,info);
                    }

                    this._playingUids = [];
                    this._playingSeats = [];
                    this._playingUids = _data["tableStatus"]["chairArr"];
                    for(var i = 0 ; i < 8;i++){
                        for(var j = 0;j<this._playingUids.length;j++){
                            var seatIndex = this.getSeatIdByUid(this._playingUids[j]);
                            if(seatIndex == i){
                                this._playingSeats.push(seatIndex);
                                break;
                            }
                        }
                    }


                    this.showMenu();

                    this._isInit = true;
                }else
                {

                }

                //UN_GAME :0,//没有游戏状态,桌子还没开始过
                //    SLEEP:1,//休眠状态,没有开始 玩家数量不足
                //READY:2,//准备阶段,一秒进入下一阶段
                //CHIP_IN:3,//下注倍数阶段
                //GAMING:4,//游戏中状态
                //GAME_RESULT:5,//游戏结果状态  5秒给客户端展示
                //GAME_OVER:6,//整轮游戏结束
                //


            }break;
        }
    },

    updateStartBtn:function(){
        if( hall.user.uid == this._ownerUid && this._tableStatus == TABLE_STATUS.UN_GAME ){
            if(this.getNowPlayerCount() > 1 && this.getReadyCount() == this.getNowPlayerCount()){
                this.showStartBtn(true);
                console.log("=====11112");
                this.showTip("请开始游戏!",-1);
            }else{
                var player = this.getPlayerInfo(hall.user.uid);
                if(player != null ){
                    if(player["isReady"] != 1 ){
                        this.showReadyBtn();
                    }else{
                        this.showStartBtn(false);
                    }
                }
            }
        }else
        {
            this.hideStartBtn();
        }
    },

    showStartBtn:function(_enable){
        this.btn_start.setVisible(true);
        this.btn_ready.setVisible(false);
        this.btn_start.setTouchEnabled(_enable);
        this.btn_start.setBright(_enable);
    },

    hideStartBtn:function(){
        this.btn_start.setVisible(false);
    },

    showReadyBtn:function(){
        this.btn_start.setVisible(false);
        this.btn_ready.setVisible(true);
    },

    showTipReady:function(){
        this.panel_tip.setVisible(true);
        this.img_tip_frame.setVisible(true);
        var info = this.getPlayerInfo(hall.user.uid);
        var count = this._players.length;
        if(this._ownerUid == hall.user.uid && count == 1){
            if(info["isReady"] == 1){
                this.showTip("等待其他玩家加入...",-1);
            }else{
                this.showTip("请准备...",-1);
            }
        }else{
            if(info["isReady"] == 1){
                this.showTip("等待其他玩家加入...",-1);
            }else{
                this.showTip("请准备...",-1);
            }
        }
    },


    showTip: function (_msg,_dt) {
        this.unschedule(this.clockDown);
        this.panel_tip.setVisible(true);
        this.img_tip_frame.setVisible(true);
        //this.text_tip.setString(_msg+"    "+ddt);
        var ddt = 10;

        if(_dt == -1){
            this.text_tip.setString(_msg);
        }else if(_dt == -2){
            this._tipStr = _msg;
            this.text_tip.setString(this._tipStr+"    "+this._clockDt);
            this.schedule(this.clockDown,1);
        }
        else{
            if(_dt != undefined && _dt != null){
                ddt = _dt;
            }

            this._tipStr = _msg;
            this._clockDt = ddt;
            this.text_tip.setString(this._tipStr+"    "+this._clockDt);
            this.schedule(this.clockDown,1);

        }

    },


    clockDown: function (_dt) {
        this._clockDt--;
        if(this._clockDt>= 0){
            this.text_tip.setString(this._tipStr+"    "+this._clockDt);
        }else{
            this.text_tip.setString(this._tipStr+"    "+0);
            this.unschedule(this.clockDown);
        }

    },

    hideTip:function(){
        this.unschedule(this.clockDown);
        this.img_tip_frame.setVisible(false);
    },


    resetOpBtnPos: function (_btn) {
        var pos = this.panel_cards[TABID_SELF].getPosition();
        var pos2 = _btn.getPosition();
        var size = this.panel_cards[TABID_SELF].getContentSize();
        var size2 = _btn.getContentSize();
        var scale = _btn.getScale();
        pos = cc.p(pos.x + size.width*0.5+size2.width*0.5*scale + 70,pos2.y);
        _btn.setPosition(pos);
    },

    showCheckOp:function(){
        //this.resetOpBtnPos(this.btn_check);
        //this.resetOpBtnPos(this.btn_cuopai);
        //this.resetOpBtnPos(this.btn_show);
        //this.resetOpBtnPos(this.btn_reminder);

        this.showTip("请看牌...",this._showCardTime);
        this.panel_op.setVisible(true);
        this.btn_check.setVisible(true);
        this.btn_cuopai.setVisible(true);
        //this.setBtnEnable(this.btn_cuopai,false);
        this.btn_reminder.setVisible(false);
        this.btn_show.setVisible(false);
    },

    setBtnEnable:function(_btn,_enbale){
        _btn.setTouchEnabled(_enbale);
        _btn.setBright(_enbale);
    },



    showOutOp:function(){
        this.resetOpBtnPos(this.btn_check);
        this.resetOpBtnPos(this.btn_cuopai);
        this.resetOpBtnPos(this.btn_show);
        this.resetOpBtnPos(this.btn_reminder);
        this.panel_op.setVisible(true);
        this.btn_check.setVisible(false);
        this.btn_cuopai.setVisible(false);
        //this.setBtnEnable(this.btn_cuopai,false);
        this.btn_reminder.setVisible(true);
        this.setBtnEnable(this.btn_reminder,true);
        this.btn_show.setVisible(true);

        this.showTip("请亮牌...",-2);
    },

    hideOp: function () {
      this.panel_op.setVisible(false);
    },

    showSeatChip: function (_seatIndex,_amount) {
        this.img_coins[_seatIndex].setVisible(false);
        this.img_coin_frames[_seatIndex].setVisible(true);
        this.img_coin_frames[_seatIndex].setScale(0.8);
        var pos = cc.p(-100,22);
        var posTarget = cc.p(14,20);
        this.img_coins[_seatIndex].setPosition(pos);

        var text_coin = ccui.helper.seekWidgetByName(this.img_coin_frames[_seatIndex],"text_coin");
        text_coin.setVisible(false);

        var callback = cc.callFunc(function(){
            text_coin.setString(_amount);
            text_coin.setVisible(true);
        }.bind(this));

        var showIt = cc.show();
        var moveTo = cc.moveTo(0.25,posTarget);
        this.img_coins[_seatIndex].runAction(cc.sequence(showIt,moveTo,callback));
        sound.playSound(NiuniuSound.BET);
    },

    resumeSeatChip: function (_seatIndex,_amount) {
        this.img_coins[_seatIndex].setVisible(true);
        this.img_coin_frames[_seatIndex].setVisible(true);
        this.img_coin_frames[_seatIndex].setScale(0.8);

        var posTarget = cc.p(14,20);
        this.img_coins[_seatIndex].setPosition(posTarget);

        var text_coin = ccui.helper.seekWidgetByName(this.img_coin_frames[_seatIndex],"text_coin");

        text_coin.setString(_amount);
        text_coin.setVisible(true);
        text_coin.setVisible(true);

    },

    removePlayerChip:function(_seatIndex){
        this.img_coin_frames[_seatIndex].setVisible(false);
    },

    clearAllChip:function(){
        for(var i = 0 ; i < 8;i++)
        {
            this.img_coin_frames[i].setVisible(false);
        }
    },

    showRapBtn: function () {
        for(var i = 0;i <= this._maxBei;i++){
            this.btn_beis[i].setVisible(true);
        }
    },

    hideRapBtn: function () {
        for(var i = 0;i<= this._maxBei;i++){
            this.btn_beis[i].setVisible(false);
        }
    },

    showPlayerRapResult: function (_uid,_rapBei) {
        var seatIndex = this.getSeatIdByUid(_uid);
        if(_rapBei > 0){
            this.img_raps[seatIndex].loadTexture("whnn_sp_hog"+_rapBei+".png",ccui.Widget.PLIST_TEXTURE);
        }else
        {
            this.img_raps[seatIndex].loadTexture("whnn_sp_noHog.png",ccui.Widget.PLIST_TEXTURE);
        }
        this.img_raps[seatIndex].setContentSize(this.img_raps[seatIndex].getVirtualRendererSize());
        this.img_raps[seatIndex].setVisible(true);
    },

    hidePlayerRap: function () {
        for(var i =0;i < 8;i++){
            this.img_raps[i].setVisible(false);
        }
    },

    showBankerRapResult: function (_uid,_rapBei) {
        var seatIndex = this.getSeatIdByUid(_uid);
        if(_rapBei > 0){
            this.img_raps[seatIndex].loadTexture("hog_times_"+_rapBei+".png",ccui.Widget.PLIST_TEXTURE);
        }else
        {
            this.img_raps[seatIndex].loadTexture("whnn_sp_noHog.png",ccui.Widget.PLIST_TEXTURE);
        }
        this.img_raps[seatIndex].setContentSize(this.img_raps[seatIndex].getVirtualRendererSize());
        this.img_raps[seatIndex].setVisible(true);
    },


    updateTableStatus:function(_status)
    {
        this._tableStatus = _status;
    },

    updateTableRound: function () {
        this.text_room_round.setString("局数:"+this._roundNow+'/'+this._roundTotal);
    },

    updateTableInfo: function (_data) {
        var info = _data;
        this._tableId = info["tableId"];
        this._roundTotal = info["roundsTotal"];
        this._roundNow = info["currRounds"];
        this._tableId = info["tableId"];
        this._ownerUid = info["fangZhu"];
        this._chairArr = info["chairArr"];
        this._roundTotal = info["roundsTotal"];
        this._roundNow = info["currRounds"];
        this._tableStatus = info["tableStatus"];
        this._wanFa = info["wanFa"];
        this._diFen = info["diFen"];
        this._spePai = info["spePai"];
        this._fanBei = info["fanBei"];
        this._aaGem = info["aaGem"];
        this._banker_id = info["bankerId"];
        this._allChipIn = info["allChipIn"];

        this._readyTime = info["timeout"]["ready"];
        this._chipingTime = info["timeout"]["chipin"];
        this._gamblingTime = info["timeout"]["gambling"];
        this._showCardTime = info["timeout"]["show"];


        if(this._wanFa == 1){
            this.text_room_type.setString("玩法:通比牛牛");
        }else if(this._wanFa == 2){
            this.text_room_type.setString("玩法:赢家上庄");
        }else if(this._wanFa == 3){
            this.text_room_type.setString("玩法:明牌抢庄");
        }

        this.text_room_base.setString("低分:"+this._diFen);
        this.text_room_id.setString("房号:"+this._tableId);
        this.text_room_round.setString("局数:"+this._roundNow+'/'+this._roundTotal);

    },

    updatePlayerReadyStatus:function(_uid,_readyStatus){
        for(var i = 0;i<this._players.length;i++){
            if(_uid == this._players[i].uid){
                this._players[i].isReady = _readyStatus;
            }
        }
    },

    clearAllPlayerReadyStatus: function () {
        for(var i = 0;i<this._players.length;i++){
            this._players[i].isReady = 0;
        }
    },


    updatePlayerScore: function (_uid,_score) {
      var seatIndex = this.getSeatIdByUid(_uid);
        this.text_scores[seatIndex].setString(_score);
    },

    getReadyCount:function(){
        var count = 0 ;
        for(var i = 0;i < this._players.length;i++)
        {
            if(this._players[i].isReady == 1){
                count += 1;
            }
        }
        return count;
    },

    showPlayerBanker:function(_uid){
        for(var i = 0;i<this._players.length;i++){
            var seatIndex = this.getSeatIdByUid(this._players[i].uid);
            if(_uid == this._players[i].uid){
                this.img_bankers[seatIndex].setVisible(true);
                sound.playSound(NiuniuSound.selectBanker);

            }else{
                this.img_bankers[seatIndex].setVisible(false);
            }
        }
    },

    showScoreAnim: function (sender,_data) {

        return;
        //var text_score = new ccui.TextAtlas();
        //text_score.setProperty("0123456789", "Game/Niuniu/Image/game_add_score.png", 24, 31, '/');
        //this.panel_anim.addChild(text_score);
        //text_score.setPosition(400,500);
        var _seatIndex = _data[0];
        var score = _data[1];
        var text_score = null;
        if(score >= 0){
            text_score = this.text_add_score.clone();
            text_score.setString("/"+score);
            //text_score.setTextColor(cc.color(255,165,0));
        }else
        {
            text_score = this.text_sub_score.clone();
            text_score.setString("/"+Math.abs(score));
            //text_score.setTextColor(cc.color(49,216,49));
        }

        text_score.setPosition(51,70);
        this.panel_seats[_seatIndex].addChild(text_score);
        var moveBy = cc.moveBy(2.5,cc.p(0,80));
        var fadeOut = cc.fadeOut(1.2);
        text_score.runAction(cc.sequence(moveBy,fadeOut,cc.removeSelf()));
    },

    showScore: function (_seatIndex,score,_dt) {
        //var text_score = new ccui.TextAtlas();
        //text_score.setProperty("0123456789", "Game/Niuniu/Image/game_add_score.png", 24, 31, '/');
        //this.panel_anim.addChild(text_score);
        //text_score.setPosition(400,500);

        var text_score = null;
        if(score >= 0){
            text_score = this.text_add_score.clone();
            text_score.setString("/"+Math.abs(score));
        }else
        {
            text_score = this.text_sub_score.clone();
            text_score.setString("/"+Math.abs(score));
        }

        text_score.setPosition(51,70);
        this.panel_seats[_seatIndex].addChild(text_score);
        var moveBy = cc.moveBy(2.5,cc.p(0,80));
        var fadeOut = cc.fadeOut(1.2);
        text_score.setVisible(false);
        text_score.runAction(cc.sequence(cc.delayTime(_dt),cc.show(),moveBy,fadeOut,cc.removeSelf()));
    },

    collectCoinTo:function(_fromSeat,_toSeat,_score,_ddt){

        var pos1 = this.img_heads[_fromSeat].getPosition();
        var posSource = this.img_heads[_fromSeat].getParent().convertToWorldSpace(pos1);

        var pos2 = this.img_heads[_toSeat].getPosition();
        var posTarget = this.img_heads[_toSeat].getParent().convertToWorldSpace(pos2);

        var allTime = 0;
        for(var i = 0;i<5;i++){
            var coin = this.img_coins[1].clone();
            coin.setVisible(false);
            coin.setPosition(posSource);

            var x = Math.floor(Math.random()*30);
            var y = Math.floor(Math.random()*30);
            (x%2 == 1) ? x = (x*-1): x = (x*1) ;
            (y%2 == 1) ? y = (x*-1): y = (x*1) ;
            var pos3 = cc.p(posTarget.x + x,posTarget.y + y);

            this.panel_anim.addChild(coin);
            var dt = i*0.08+0.1;
            var delay = cc.delayTime(dt+_ddt);
            var length = cc.pDistance(posSource,pos3);
            //console.log("length:"+length);
            var tt = length/1200;
            //console.log("tt:"+tt);
            var moveTo = cc.moveTo(tt,pos3);
            var fadeOut = cc.fadeOut(0.2);
            allTime = 0.5 + tt + 0.3 + 0.2;


            var callSound = cc.callFunc(function () {
                sound.playSound(NiuniuSound.coinMove);
            });
            if(i == 4){
                var callbackFrom = cc.callFunc(this.showScoreAnim.bind(this),this,[_fromSeat,-_score]);
                var callbackTo = cc.callFunc(this.showScoreAnim.bind(this),this,[_toSeat,_score]);



                coin.runAction(cc.sequence(delay,callbackFrom,callSound,cc.show(),moveTo,cc.delayTime(0.3),callbackTo,fadeOut,cc.removeSelf()));
            }else{
                coin.runAction(cc.sequence(delay,callSound,cc.show(),moveTo,cc.delayTime(0.3),fadeOut,cc.removeSelf()));
            }

        }

        return allTime;
    },

    showMenu: function () {
      switch (this._tableStatus){
          case TABLE_STATUS.UN_GAME:
          {
              this.btn_hall.setVisible(hall.user.uid != this._ownerUid);
              this.btn_dissolve.setVisible(hall.user.uid == this._ownerUid);
              this.btn_wechat.setVisible(true);
              this.btn_setup.setVisible(false);
              this.btn_exit.setVisible(false);
              this.btn_chat.setVisible(true);
              this.btn_speak.setVisible(true);
              this.btn_help.setVisible(true);
          }
              break;
          case TABLE_STATUS.SLEEP:
          {

          }
              break;
          case TABLE_STATUS.READY:
          {

          }
              break;
          case TABLE_STATUS.GAMBLING:
          {

          }
              break;
          case TABLE_STATUS.CHIP_IN:
          {

          }
              break;

          case TABLE_STATUS.GAMING:
          {
              this.btn_hall.setVisible(false);
              this.btn_dissolve.setVisible(false);
              this.btn_wechat.setVisible(false);
              this.btn_setup.setVisible(true);
              this.btn_exit.setVisible(true);
              this.btn_chat.setVisible(true);
              this.btn_speak.setVisible(true);
              this.btn_help.setVisible(true);
          }
              break;
          case TABLE_STATUS.GAME_RESULT:
          {

          }
              break;
          case TABLE_STATUS.GAME_OVER:
          {

          }
              break;

      }
    },


    showChatMsg: function (uid,index,content) {
        var str = null;
        var seatIndex = this.getSeatIdByUid(uid);
        if(seatIndex == null || seatIndex == undefined)
        {
            return;
        }

        if(content)
        {
            str = content;
        }
        else
        {
            if(NIUNIU_MSG[index])
            {
                str = NIUNIU_MSG[index];

                var info = this.getPlayerInfo(uid);
                if(parseInt(info["userSex"]) == 1){
                    sound.playSound(NiuniuSound["Chat_Male"][index]);
                }else{
                    sound.playSound(NiuniuSound["Chat_Female"][index]);
                }

            }
        }
        if(str)
        {
            this.text_msgs[seatIndex].setString(str);

            this.text_msgs[seatIndex].stopAllActions();
            this.text_msgs[seatIndex].setVisible(true);
            this.text_msgs[seatIndex].setOpacity(255);
            //this.text_msg.runAction(cc.sequence(cc.delayTime(4),cc.fadeOut(0.5)));
            var size = this.text_msgs[seatIndex].getAutoRenderSize().width < this.text_msgs[seatIndex].getContentSize().width ? this.text_msgs[seatIndex].getAutoRenderSize().width+55:this.text_msgs[seatIndex].getContentSize().width+45;
            // this.text_msg.ignoreContentAdaptWithSize(true);
            this.img_msgs[seatIndex].setContentSize(cc.size(size,this.img_msgs[seatIndex].getContentSize().height));
            this.img_msgs[seatIndex].stopAllActions();
            this.img_msgs[seatIndex].setVisible(false);
            this.img_msgs[seatIndex].setOpacity(255);
            this.img_msgs[seatIndex].setScale(1.0);
            this.img_msgs[seatIndex].runAction(cc.sequence(cc.show(),cc.delayTime(3),cc.fadeOut(0.5),cc.hide()));
        }
    },

    showChatFace: function (uid,index) {
        var seatIndex = this.getSeatIdByUid(uid);
        if(seatIndex == null || seatIndex == undefined)
        {
            return;
        }

        if(index>0 && index < 64)
        {
            //img_emoji
            this.img_emojis[seatIndex].loadTexture("im"+index+".png",ccui.Widget.PLIST_TEXTURE);
            this.img_emojis[seatIndex].stopAllActions();
            this.img_emojis[seatIndex].setVisible(false);
            this.img_emojis[seatIndex].setOpacity(255);
            this.img_emojis[seatIndex].setScale(1.0);

            this.img_emojis[seatIndex].runAction(cc.sequence(cc.show(),
                cc.scaleTo(0.15,1.3),cc.scaleTo(0.1,1.1),cc.scaleTo(0.15,1.2),cc.scaleTo(0.1,1.0),
                cc.delayTime(2),cc.fadeOut(0.5)
                ,cc.hide()
            ));

        }
    },


    touchCardEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            {
                if((this._rubCardLayer != null && this._rubCardLayer.isVisible()) || this._bInRubingAction ){
                    this._selectRubCardIndex = -1;
                    if(this._bRubCard){
                        //可以搓牌
                        var touchPoint = this.convertTouchToNodeSpace(touch);
                        if(this._wanFa == WAN_FA.MINGPAIQIANGZHAUNG){
                            for(var i=0;i<this._rubCardTable.length;i++){
                                if(this._rubCardTable[i]._bMoved == false){
                                    var cardRect = this._rubCardTable[i].getBoundingBox();
                                    if(cc.rectContainsPoint(cardRect,touchPoint)){
                                        this._selectRubCardIndex = i;
                                        return true;
                                    }
                                    break;
                                }
                            }
                        }else{
                            // 遍历牌，从5倒序
                            for(var i = (this._rubCardTable.length-1);i>=1;i--){
                                if(this._rubCardTable[i]._bMoved == false){
                                    var cardRect = this._rubCardTable[i].getBoundingBox();
                                    if(cc.rectContainsPoint(cardRect,touchPoint)){
                                        this._selectRubCardIndex = i;
                                        this._rubCardTable[i]._bMoved = true;
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }

                return false;

                break;
            }
            case ccui.Widget.TOUCH_MOVED:
            {
                if(this._selectRubCardIndex >= 0 && this._selectRubCardIndex < 5){
                    // 设置牌的新坐标
                    var disPoint = touch.getDelta();
                    var newPoint = cc.p(this._rubCardTable[this._selectRubCardIndex].getPositionX()+disPoint.x,
                        this._rubCardTable[this._selectRubCardIndex].getPositionY()+disPoint.y);
                    this._rubCardTable[this._selectRubCardIndex].setPosition(newPoint);
                }
            }
                break;

            case ccui.Widget.TOUCH_ENDED:
            {
                this.touchEndOrCancelFunc(touch);
            }
                break;

            case ccui.Widget.TOUCH_CANCELED:
            {
                this.touchEndOrCancelFunc(touch);
            }
                break;
            default:
                break;
        }
    },

    //==================== 创建搓牌层 ========================
    createRubCardLayer: function (isBigCard) {
        console.log("createRubCardLayer");
        this.cleanRubCardLayer();

        // 创建搓牌层
        //this._rubCardLayer = new cc.LayerColor(cc.color(0, 0, 0, 150)); //cc.LayerColor:create(cc.c4b(0, 0, 0, 150));
        this._rubCardLayer = this.panel_rub.clone();
        this._rubCardLayer.setTouchEnabled(true);
        // 触摸事件不向下传递
        this.addChild(this._rubCardLayer);
        this._rubCardLayer.setVisible(false);



        this._touchRubListener = cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this),
            onTouchCancelled: this.onTouchCancelled.bind(this),
        }, this._rubCardLayer);

        //close button


        //
        if(isBigCard){
            for(var i =0;i<5;i++){
                var cardSprite = new BigPkCardSprite(0);
                cardSprite.setCardShowInfo(640,0,i);
                cardSprite.showCardInNode(this._rubCardLayer);
                cardSprite.setVisible(false);
                this._rubCardTable[i] = cardSprite;
            }
        }else{

            for(var i =0;i<5;i++){
                var cardSprite = new PkCardSprite(0);

                cardSprite.setCardShowInfo(640,0,i);
                cardSprite.showCardInNode(this._rubCardLayer);
                cardSprite.setVisible(false);
                this._rubCardTable[i] = cardSprite;
            }

            // 创建一张大牌
            this._BigRubCardSprite = new BigPkCardSprite(0);
            this._BigRubCardSprite.setPosition(-200, 300);
            this._rubCardLayer.addChild(this._BigRubCardSprite,3);
        }

    },

    cleanRubCardLayer:function(){
        if(this._rubCardLayer != null){
            this._rubCardLayer.removeFromParent();
            this._rubCardLayer = null;
        }

        this._BigRubCardSprite = null;
        this._rubCardTable = [];
        this._selectRubCardIndex = -1;
    },










    //===================message======================
    registerAllEvents: function () {
        qp.event.listen(this, 'mjPlayerEnter', this.onPlayerEnter);
        qp.event.listen(this, 'mjPlayerLeave', this.onPlayerLeave);
        qp.event.listen(this, 'mjReadyStatus', this.onReadyStatus);
        qp.event.listen(this, 'mjGameStart', this.onGameStart);
        qp.event.listen(this, 'mjBankerResult', this.onBankerResult);
        qp.event.listen(this, 'mjChipInStart', this.onChipInStart);
        qp.event.listen(this, 'pkChipInStart', this.onPKChipInStart);
        qp.event.listen(this, 'pkChipInStatus', this.onChipIn);
        qp.event.listen(this, 'mjSendHandCards', this.onSendHandCards);
        qp.event.listen(this, 'mjSyncDelCards', this.onSyncDelCards);
        qp.event.listen(this, 'mjGameOver', this.onGameOver);
        qp.event.listen(this, 'mjGameResult', this.onGameResult);

        qp.event.listen(this, 'mjSyncAutoState', this.onTrustMsg);
        qp.event.listen(this, 'mjPlayerOffLine', this.onPlayerOffLine);
        qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);
        qp.event.listen(this, 'mjChatStatus', this.onReciveChat);

        qp.event.listen(this, 'pkGamblingStart', this.onPkGamblingStart);
        qp.event.listen(this, 'pkGamblingResult', this.onPkGamblingResult);
        qp.event.listen(this, 'pkChipInResult', this.onSend5thCard);//第五张牌
        qp.event.listen(this, 'pkGamblingStatus', this.onPkGamblingStatus);//第五张牌
        qp.event.listen(this, 'imPlayVoice', this.onPlaySpeak.bind(this));
    //mjChatStatus
    },

    removeAllEvents: function () {
        qp.event.stop(this, 'mjGameOver');
        qp.event.stop(this, 'mjPlayerLeave');
        qp.event.stop(this, 'mjSyncDelCards');
        qp.event.stop(this, 'mjPlayerEnter');
        qp.event.stop(this, 'mjGameStart');
        qp.event.stop(this, 'mjReadyStatus');
        qp.event.stop(this, 'mjChipInStart');
        qp.event.stop(this, 'pkChipInStatus');
        qp.event.stop(this, 'mjSendHandCards');
        qp.event.stop(this, 'mjGameResult');
        qp.event.stop(this, 'mjBankerResult');
        qp.event.stop(this, 'mjSyncAutoState');
        qp.event.stop(this, 'mjDissolutionTable');
        qp.event.stop(this, 'mjChatStatus');
        qp.event.stop(this, 'pkGamblingStart');
        qp.event.stop(this, 'pkGamblingResult');
        qp.event.stop(this, 'pkChipInResult');
        qp.event.stop(this, 'pkGamblingStatus');
        qp.event.stop(this, 'pkChipInStart');
        qp.event.stop(this, 'mjPlayerOffLine');
        qp.event.stop(this, 'imPlayVoice');

    },

    onPlaySpeak: function (data) {
        JJLog.print('on play speak imPlayVoice');//{speaker: xxx, state: 0} 0: start 1: end -1: error
        JJLog.print(JSON.stringify(data));

        if (0 == data['state']){
            for(var i = 0;i<this._players.length;i++){
                var uid = this._players[i].uid;
                var seatId = this.getSeatIdByUid(uid);
                if( data['speaker'] == GAMENAME+uid){

                    this.img_speakers[seatId].setVisible(true);
                }else{
                    this.img_speakers[seatId].setVisible(false);
                }
            }
        }else{
            for(var i = 0;i<this._players.length;i++){
                var uid = this._players[i].uid;
                var seatId = this.getSeatIdByUid(uid);
                this.img_speakers[seatId].setVisible(false);

            }
        }

    },

    onPlayerEnter:function(_data){
        if(!this._isInit){
            return;
        }

        sound.playPlayerEnter();
        var player = _data["user"];
        console.log("userss:"+JSON.stringify(player));
        //this._players.push(player);
        this.addPlayer(player);
        this.addSeatId(player);
        var seatId = this.getSeatIdByUid(player.uid);
        this.showPlayer(seatId,player);
    },

    onPlayerLeave:function(_data){
        if(!this._isInit){
            console.log("onplayerleave not init");
            return;
        }


        var uid = _data["uid"];
        var seatIndex = this.getSeatIdByUid(uid);

        this.removePlayer(seatIndex);
        this.removePlayerData(uid);
        this.removePlayerCards(seatIndex);
        this.removeCardType(seatIndex);
        this.removePlayerChip(seatIndex);
        this.updateStartBtn();

        if((this._tableStatus == TABLE_STATUS.UN_GAME || this._tableStatus == TABLE_STATUS.SLEEP && this._roundNow == 1 )
             && uid == this._ownerUid ){
                var hall2 = new MajhongHall();
                hall2.showHall();
        }

        if((this._tableStatus == TABLE_STATUS.UN_GAME || this._tableStatus == TABLE_STATUS.SLEEP && this._roundNow == 1 )
            && uid == hall.user.uid ){
            var hall2 = new MajhongHall();
            hall2.showHall();
        }

        //if((SSSPoker.table.status == GameStatus.SEATING || (SSSPoker.table.status == GameStatus.WATING && SSSPoker.table.currentRound == 1)) && data['uid'] == data['fangZhu'] && SSSPoker.table.isRePrivateTable != 1 )
        //{
        //    var hall2 = new MajhongHall();
        //    hall2.showHall();
        //}

    },

    onReadyStatus:function(_data){
        var status = _data['readyStatus'];//0,1
        var uid = _data['uid'];
        var seatId = this.getSeatIdByUid(uid);
        this.updatePlayerReadyStatus(uid,status);
        this.showReadyMark(seatId,status);
        this.updateStartBtn();
        if(uid == hall.user.uid){
            this.btn_ready.setVisible(false);
            this.cleanDeskCards();
        }

        if(this.getNowPlayerCount() == 1){
            if(this._tableStatus == TABLE_STATUS.UN_GAME)
            {
                this.showTip("请等待其他玩家加入...",-1);
            }
        }else{

            if(this._tableStatus == TABLE_STATUS.UN_GAME)
            {
                if(this._ownerUid != hall.user.uid){
                    this.showTip("请等待房主开始游戏...",-1);
                }
            }else{
                if(uid == hall.user.uid){
                    this.cleanDeskCards();
                    this.clearAllChip();
                    this.clearAllCardType();
                    this.hideRapBtn();
                    this.hidePlayerRap();
                    this.hideChipBtn();

                    this.showTip("请等待其他玩家准备...",-1);

                }
            }

        }
    },



    onGameStart:function(_data){
        console.log("game start");
        this.updateTableStatus(TABLE_STATUS.GAMING);
        //this.btn_dissolve.setVisible(false);
        //this.btn_hall.setVisible(false);
        this._roundNow = _data["currRounds"];
        this.showMenu();
        this.clearReadyMark();
        this.cleanDeskCards();
        this.clearAllChip();
        this.clearAllCardType();
        this.updateTableRound();
        this.hideRapBtn();
        this.hidePlayerRap();
        this.hideChipBtn();
        this.clearBankerMark();
        this.cleanRubCardLayer();
        this.btn_ready.setVisible(false);
        this.btn_start.setVisible(false);



        if(this._wanFa == WAN_FA.NIUNIUSHANGZHUANG){
            this._banker_id = _data["banker"];
            this.showPlayerBanker(this._banker_id);
        }
        sound.playSound(NiuniuSound.gameBegin);
        this._playingUids = [];
        this._playingSeats = [];
        this._playingUids = _data["chairArr"];
        for(var i = 0 ; i < 8;i++){
            for(var j = 0;j<this._playingUids.length;j++){
                var seatIndex = this.getSeatIdByUid(this._playingUids[j]);
                if(seatIndex == i){
                    this._playingSeats.push(seatIndex);
                    break;
                }
            }
        }

        this.btn_wechat.setVisible(false);

    },

    onBankerResult: function (_data) {
        console.log("onBankerResult===");
        console.log(_data);
    },

    //明牌抢庄
    onPkGamblingStart:function(_data){
        this.showTip("请操作抢庄...",this._gamblingTime);
        this.updateTableStatus(TABLE_STATUS.GAMBLING);


    },

    //抢庄结果
    onPkGamblingResult:function(_data){
        console.log("onPkGamblingResult");
        var date = new Date();
        console.log("time:",date.getTime());

        this.hideRapBtn();
        this._banker_id = _data["bankerUid"];

        console.log("onPkGamblingResult_bankerID :"+this._banker_id);
        this.showPlayerBanker(this._banker_id);
        this.hidePlayerRap();
        this.showBankerRapResult(this._banker_id,_data["bei"]);




    },

    onPkGamblingStatus:function(_data){
        console.log("onPkGamblingStatus-----------");
        var uid = _data["uid"];
        var bei = _data["bei"];
        this.showPlayerRapResult(uid,bei);

        if(uid == hall.user.uid){
            this.showTip("请等待其他玩家抢庄...",-1);
            this.hideRapBtn();
        }
    },

    onSend5thCard: function (_data) {
        console.log("onSend5thCard-----------");
        this.hideChipBtn();
        this.beginLicensing5thCard();

        this.showTip("发牌...",-1);

    },

    onChipInStart:function(_data){
        if(hall.user.uid == this._banker_id){
            this.showTip("请等待闲家下注...",this._chipingTime);
        }else{
            this.showTip("请下注...",this._chipingTime);
        }

        //this.updateTableStatus(TABLE_STATUS.CHIP_IN);
    },

    onPKChipInStart:function(_data){
        //this.updateTableStatus(TABLE_STATUS.CHIP_IN);
        console.log("onPKChipInStart log");
        var date = new Date();
        console.log("time:",date.getTime());

        var bers = _data["bei"];

        console.log("onPKChipInStart_bankerID :"+this._banker_id);
        console.log("hall.user.uid:",hall.user.uid);

        if(this._wanFa == WAN_FA.NIUNIUSHANGZHUANG || this._wanFa == WAN_FA.MINGPAIQIANGZHAUNG )
        {
            if(this._banker_id == hall.user.uid){
                this.showTip("请等待闲家选择下注分数...",this._chipingTime);
            }else
            {
                this.showTip("请选择下注分数...",this._chipingTime);
                this.showChipBtn(bers);
            }
        }else if(this._wanFa == WAN_FA.TONGBI){

        }

        if(this._wanFa == WAN_FA.MINGPAIQIANGZHAUNG ) {
            this.hideRapBtn();
        }
    },



    onChipIn:function(_data){
        var seatIndex = this.getSeatIdByUid(_data["uid"]);
        var coin = _data["bei"];
        var uid = _data["uid"];
        console.log("uid:"+_data["uid"]+",onChipIn:"+seatIndex);

        if(_data["uid"] == hall.user.uid){
            this.hideChipBtn();
        }

        this.showSeatChip(seatIndex,coin);

        if(uid == hall.user.uid){
            this.showTip("请等待其他玩家下注...",-1);
        }
    },

    onSendHandCards: function (_data) {
        console.log("onSendHandCards++++++++++=");
        this.cleanDeskCards();
        this._cards = _data["paiQi"];
        this._niuCards = _data["paiNiu"];
        this._niuType = _data["paiType"];
        this.updateTableStatus(TABLE_STATUS.GAMBLING);
        if(this._wanFa == WAN_FA.MINGPAIQIANGZHAUNG){
            this.beginLicensing4Cards();
        }else{
            this.beginLicensingCards();
        }

        this.btn_ready.setVisible(false);


        this.showTip("开始发牌...");
    },


    onSyncDelCards:function(_data){
        console.log("onSyncDelCards++++++++++=");
        console.log(_data);
        console.log("onSyncDelCards============");
        var uid = _data["uid"];
        if(uid == hall.user.uid){
            this.hideOp();

            this.showTip("请等待其他玩家亮牌...",-1);
        }
        this.openCards(uid,_data);
    },


    onGameOver:function(_data){
        console.log("onGameOver");
        this._tableStatus = TABLE_STATUS.GAME_OVER;
        if(this.removeChildByTag(this._dissolveTag) != null){
            this.removeChildByTag(this._dissolveTag)
        }

        _data["wanFa"] = this._wanFa;
        _data["roomId"] = this._tableId;
        _data["round"] = this._roundTotal;
        _data["diFen"] = this._diFen;
        var overView = new OverView(_data);
        overView.setVisible(false);
        this.panel_root.addChild(overView);
        overView.runAction(cc.sequence(cc.delayTime(3.0),cc.show()));
    },

    onGameResult: function (_data) {
        console.log("onGameResult");
        this._tableStatus = TABLE_STATUS.GAME_RESULT;
        this.clearAllPlayerReadyStatus();
        this.clearAllChip();
        this.cleanRubCardLayer();
        this.hideOp();

        if(this._wanFa == WAN_FA.NIUNIUSHANGZHUANG || this._wanFa == WAN_FA.MINGPAIQIANGZHAUNG){
            var bankerSeat = this.getSeatIdByUid(this._banker_id);
            var delayT = 0.01
            for(var i =0;i<_data["players"].length;i++){
                var info = _data["players"][i];
                var winScore = info["winScore"];
                if(this._banker_id != info["uid"]){
                    if(winScore >= 0){
                        var winSeat = this.getSeatIdByUid(info["uid"]);
                        var dl = this.collectCoinTo(bankerSeat,winSeat,Math.abs(winScore),0.01);


                        delayT = delayT < dl ? dl:delayT;

                        this.showScore(winSeat,winScore,  0.3*i);
                        this.showScore(bankerSeat,-winScore, 0.3*i);
                    }
                }
            }

            delayT += 0.3;
            for(var i =0;i<_data["players"].length;i++){
                var info = _data["players"][i];
                var lostScore = info["winScore"];
                if(this._banker_id != info["uid"]){
                    if(lostScore < 0){
                        var winSeat = this.getSeatIdByUid(info["uid"]);
                        delayT = this.collectCoinTo(winSeat,bankerSeat,Math.abs(lostScore),delayT);

                        this.showScore(winSeat,lostScore,delayT+0.3*i);
                        this.showScore(bankerSeat,Math.abs(lostScore),delayT+0.3*i);
                    }

                }
            }
        }else if(this._wanFa == WAN_FA.TONGBI) {
            var winSeat = 0;
            for(var i =0;i<_data["players"].length;i++){
                var info = _data["players"][i];
                var winScore = info["winScore"];
                if(winScore > 0){
                    winSeat = this.getSeatIdByUid(info["uid"]);
                    break;
                }
            }

            var dtt2 = 0;
            for(var i =0;i<_data["players"].length;i++){
                var info = _data["players"][i];
                var winScore = info["winScore"];
                var seat = this.getSeatIdByUid(info["uid"]);
                //this.showScore(seat,winScore);
                if(winScore < 0){
                    var dt = this.collectCoinTo(seat,winSeat,winScore,0.01);
                    this.showScore(seat,winScore,0.25*i);
                    this.showScore(winSeat,Math.abs(winScore),0.35*i);
                }
            }
        }


        for(var i =0;i<_data["players"].length;i++){
            var info = _data["players"][i];
            var score = info["coinNum"];
            this.updatePlayerScore(info["uid"],score);
        }

        this.showTip("开始比牌...",-1);
        if(_data["isOver"] == 0 ){
            this.panel_anim.stopAllActions();
            this.panel_anim.runAction(cc.sequence(cc.delayTime(1.8),cc.callFunc(this.showNextReady.bind(this))));
        }

        this._banker_id = -1;

    },



    showNextReady:function(){
        var info = this.getPlayerInfo(hall.user.uid);
        if(info != undefined && info != null && info["isReady"] == 0){
            this.showReadyBtn();
            this.showTip("请准备...",this._readyTime);
        }
    },


    onTrustMsg: function(_data) {

        console.log("mjSyncAutoState");
        console.log(_data);
        var uid = _data["uid"];
        var status = _data["isRobot"];
        if(uid == hall.user.uid){
            this._trust_status = status;

            if(this._trust_status){
                this.panel_trust.setVisible(true);
            }else{
                this.panel_trust.setVisible(false);
            }
        }

        if(status){
            this.showPlayerTrust(uid);

        }else{
            this.hidePlayerTrust(uid);
        }
    },

    onPlayerOffLine:function(_data){
        console.log(_data);
        var uid = _data["uid"];
        var status = _data["status"];
        if(uid == hall.user.uid){
            return;
        }

        if(status == 1){
            this.showPlayerOffline(uid);
        }else{
            this.hidePlayerOffline(uid);
        }
    },

    onDissolutionTable:function(data){
        console.log("onDissolutionTable");
        console.log(data);


        if(data['result'] == 0)//0拒绝解散
        {
            var info = this.getPlayerInfo(data["uid"]);
            var tip = new JJConfirmDialog();
            var nickName = base64.decode(info["nickName"]);
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
                    //var data2 = {};
                    data["room"] = this;
                    var result = new NNDissloveResultDialog(data);
                    result.showDialog();
                }else
                {
                    data["room"] = this;
                    var option = new NNDissloveOptionDialog(data);
                    option.showDialog();
                }
            }
        }



        //JJLog.print("onDissolutionTable" + JSON.stringify(_data));
        //_data["room"] = this;
        //var view = this.getChildByTag(this._dissolveTag);
        //if(view == null || view == undefined){
        //    var view = new DissloveView(_data);
        //    view.setTag(this._dissolveTag);
        //    this.addChild(view);
        //}
        //
        //if(_data["result"] == 1){ //解散成功
        //
        //}
    },

    onReciveChat: function (data) {
        var uid = data['uid'];
        var type = data['data']['type'];
        var index = data['data']['index'];
        var content = data['data']['content'];

        if(uid != null || uid != undefined){

            if(type == CHAT_TYPE.Usual)
            {
                this.showChatMsg(uid,index,content);
            }else
            {
                this.showChatFace(uid,index);
            }
        }




        //for(var i = 0 ; i < this.deskArray.length;i++)
        //{
        //    if(this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
        //    if(uid == this.deskArray[i].uid)
        //    {
        //        if(type == CHAT_TYPE.Usual)
        //        {
        //            this.showChatMsg(index,content);
        //        }else
        //        {
        //            this.showChatFace(index);
        //        }
        //        break;
        //    }
        //}
    },

});