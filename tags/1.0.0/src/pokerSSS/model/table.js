
SSSPoker.Table = cc.Class.extend({
    SEAT_TOTAL: 5, // 总座位数

    playSeats : [], // 玩家座位
    play:"onPlay",//是否在玩
    tableId:null,

    seatArray:null,
    selfPos:0,
    selfInfo:null,
    inited:false,
    bankerId : 0, // 庄家UID
    //********quanzhou*********
    //手牌数量14||17
    MajhongNumber:14,
    //---------quanzhou-----------
    tableInfo:null,
    isOffline:false,
    offLineInfo:{},
    chairArr:[],
    report:null,
    roundTotal:0,
    paoOne:0,
    jinTwo:0,
    jinThree:0,
    roomId:0,
    person:0,
    ishavebanker:0,
    duose:0,
    mode:0,
    AAgem:0,
    area:null,                 //地区 nb 是宁波  普通 fj
    wanfa:0,
    bei:1,
    isMa:0,
    chongSan:0,
    wang:0,
    maPaiId:null,
    maPai: {},
    isRePrivateTable:null,
    currentRound:0,
    shuangJiang: 0,
    costGem: 0,
    ctor: function (tableId) {
        this.tableId = tableId;
        this.seatArray = new Array(8);
        this.registerAllEvents();
    },

  registerAllEvents: function () {
      qp.event.listen(this, 'mjTableStatus', this.onTableStatus);
      qp.event.listen(this, 'mjThrowStatus', this.onThrowStatus);
      qp.event.listen(this, 'mjChatStatus', this.onChatMsg);
      qp.event.listen(this, 'mjPlayerEnter', this.onPlayerEnter);
      qp.event.listen(this, 'mjBankerResult', this.onBankerResult);
      qp.event.listen(this, 'mjSendHandCards', this.onSendHandCards);
      qp.event.listen(this, 'mjNotifyDelCards', this.onNotifyDelCards);
      qp.event.listen(this, 'mjLocalPosition', this.hallLocalPosition);

  },

  removeAllEvents: function () {
      qp.event.stop(this, 'mjTableStatus');
      qp.event.stop(this, 'mjThrowStatus');
      qp.event.stop(this, 'mjChatStatus');
      qp.event.stop(this, 'mjSendHandCards');
      qp.event.stop(this, 'mjBankerResult');
      qp.event.stop(this, 'mjPlayerEnter');
      qp.event.stop(this, 'mjNotifyDelCards');
      qp.event.stop(this, 'mjLocalPosition');
  },

  init: function() {
      this.inited = true;
   },

  deinit: function() {
    this.removeAllEvents();
    this.inited = false;
    this.maPaiID = null;
  },

    initSeatInfo: function (data) {
        var playerDataArray = data["tableStatus"]["players"];
        this.SEAT_TOTAL = parseInt(data["tableStatus"]['person']);
        this.roomId = data["tableStatus"]['tableId'];
        this.roundTotal = data["tableStatus"]['roundsTotal'];
        this.person = data["tableStatus"]['person'];
        this.ishavebanker = data["tableStatus"]['isHaveBanker'];
        this.duose = data["tableStatus"]['duose'];
        this.mode = data["tableStatus"]['mode'];
        this.AAgem =  data["tableStatus"]['aaGem'];
        this.area =  data["tableStatus"]['area'];
        this.wanfa = data["tableStatus"]['wanFa'];
        this.bei = data["tableStatus"]['bei'];
        this.bankerId = data["tableStatus"]['fangZhu'];
        this.isMa =  data["tableStatus"]['isMa'];
        this.isRePrivateTable = data["tableStatus"]['isRePrivateTable'];
        this.chongSan = data["tableStatus"]['chongSan'];
        this.wang = data["tableStatus"]['wang'];
        this.shuangJiang = data["tableStatus"]['wanFaType'];
        if (this.isMa > 0 && data["tableStatus"]['maPai'] != null && data["tableStatus"]['maPai'].type != null) {
            this.maPaiId = data["tableStatus"]['maPai'].type + "" + data["tableStatus"]['maPai'].value;
            this.maPai = data["tableStatus"]['maPai'];
        }


        if (this.ishavebanker > 0) {
            var cost = {"2": 13, "3": 18, "4": 25, "5": 32, "6": 40, "7": 58, "8": 72};
            this.costGem = cost[this.person] * this.roundTotal / 10;
        } else {
            var cost = {"2": 13, "3": 18, "4": 25, "5": 32, "6": 40, "7": 58, "8": 72};
            var aa = 8;
            if (this.person > 6)
                aa = 10;
            var opt = 1;
            if (this.shuangJiang == 1) {
                if (this.person > 3)
                    aa = 10;
                opt = 2;
            }

            var option = 1;
            if (this.mode == 3)
                option = 1.5;

            if (this.AAgem == 1) {
                this.costGem = opt * Math.floor(aa * this.roundTotal / 10 * option)
            } else {
                this.costGem = Math.floor(cost[opt * this.person] * this.roundTotal / 10 * option);
            }
        }

        this.tableInfo = data["tableStatus"]["players"];
        for(var i = 0;i<playerDataArray.length;i++){
            var info = playerDataArray[i]["player"];
            info['isOffLine'] = playerDataArray[i]['isOffLine'];
            info['coinNum'] = playerDataArray[i]['coinNum'];
            var id = info["uid"];
            var pos = info["position"];
            if(id == hall.user.uid)
            {
                this.selfInfo = info;
                this.selfPos = pos;
            }
            this.seatArray[pos] = info;
        }
        this.inited = true;
    }
    ,

    reBegin: function (cb) {
        var roomData = {};
        roomData['area'] = this.area;
        roomData['tableName'] = this.area;
        roomData['uid'] = hall.user.uid;
        roomData['rounds'] = this.roundTotal;        //局数
        roomData['person'] = this.person;         //人数

        roomData['isMa'] = this.isMa;                          //带马
        roomData['isQiangZhi'] = 1;
        if (this.isMa == 1)
            roomData['maPai'] = this.maPai;
        roomData['banker'] = this.ishavebanker;
        roomData['mode'] = this.mode;                          //模式
        roomData['aaGem'] = this.AAgem;
        roomData['wanFa'] = this.wanfa;
        roomData['bei'] = this.bei;
        roomData['wang'] = this.wang;
        roomData['wanFaType'] = this.shuangJiang;
        roomData["xu"] = 1;
        roomData["uids"] = [];

        for (var p in this.seatArray) {
            if (this.seatArray[p] != null && hall.user.uid != this.seatArray[p]['uid']) {
                roomData["uids"].push([this.seatArray[p]['uid'], this.seatArray[p]['serverId']]);
            }
        }
        JJLog.print('创建=' + JSON.stringify(roomData));

        hall.createPrivate(SSSPoker.appId, roomData, function (data) {
            if (cb != null)
                cb();
            if (data["code"] == 200) {
                hall.enter(SSSPoker.appId);
            } else {
                var dialog = new JJConfirmDialog();
                dialog.setDes(data['error']);
                dialog.showDialog();
            }
        }.bind(this));
    }
    ,

    getCardByPlayer: function (uid) {
        for (var i = 0; i < this.tableInfo.length; i++) {
            if (this.tableInfo[i]['uid'] == uid) {
                var info = this.tableInfo[i];
                return info;
            }
        }

        return null;
    }
    ,

    seatPosInfo: function (pos) {
        for (var p in this.seatArray) {
            if (this.seatArray[p] != null && pos == this.seatArray[p]['position']) {
                return this.seatArray[p];
            }
        }
        return null;
    }
    ,

    setSeatPosInfo: function (data) {
     this.seatArray[data["position"]] = data;
    },
    // 玩家退出游戏
    onPlayerExit: function (data) {
        for (var j = 0; j < this.seatArray.length; j++) {
            if (this.seatArray[j] != null && this.seatArray[j]['uid'] == data['uid']) {
                this.seatArray[j] = null;
                break;
            }
        }
    }
    ,
    uidofPos: function (uid) {
        var personTotal = parseInt(this.SEAT_TOTAL);
        if (this.shuangJiang == 1)
            personTotal += personTotal;
        var posArray = SSSDESKPOSITIONS[personTotal];
        for (var i = 0; i < this.seatArray.length; i++) {
            if (this.seatArray[i] != null) {
                if (uid == this.seatArray[i]['uid']) {
                    var position = this.seatArray[i]['position'];
                    if (position < this.selfPos) {
                        return posArray[posArray.length - this.selfPos + position];
                    } else {
                        return posArray[position - this.selfPos];
                    }
                }
            }
        }
        return 0;
    }
    ,
    uidOfInfo: function (uid) {
        for (var p in this.seatArray) {
            if (this.seatArray[p] != null && uid == this.seatArray[p]['uid']) {
                return this.seatArray[p];
            }
        }
        return null;
    }
    ,

    selfSeatInfo: function () {
        return this.selfInfo;
    },

    onPlayerEnter:function(data){
        JJLog.print(data);
    },

    onBankerResult:function(data){
        JJLog.print(data);

    },

    onSendHandCards:function(data){
        JJLog.print(JSON.stringify(data));


    },

    onNotifyDelCards:function(data){
        JJLog.print(data);
    },

    hallLocalPosition:function(data){
        JJLog.print(data);
        if(this.seatArray != null)
        {
            for(var i = 0;i<this.seatArray.length;i++){
                var info = this.seatArray[i];
                if(info !=null && info != undefined)
                {
                    var id = info["uid"];
                    if(id == data.uid)
                    {
                        this.seatArray[i]["nav"] = data["nav"];
                        break;
                    }
                }
            }
        }
    },

//====================
    updatePlayerDelCard:function(card,cb){
        SSSPoker.net.updatePlayerDelCard(card,cb);
    },

    updatePlayerOp:function(data,cb){
        SSSPoker.net.updatePlayerOp(data,cb);
    },

//====================
  addRobot:function(jadd)
  {
     SSSPoker.net.addRobot(jadd,function(data){
         JJLog.print(data);
     });
  },

  opHaidilao:function(isHaidi)
  {
    SSSPoker.net.opHaidilao(isHaidi,function(data){
      JJLog.print(data);
    });
  },

  initSeat: function(cb) {
    SSSPoker.net.init(cb);
  },

  ready: function(cb) {
    SSSPoker.net.ready(1, cb);
  },

  chat: function(msg, isEmoj, cb) {
    JJLog.print("chat:");
    SSSPoker.net.chat(msg, isEmoj, cb);
  },

  throw: function(objectId, cb) {
    JJLog.print("throw:");
    SSSPoker.net.throw(objectId, cb);
  },


    onChatMsg:function(jChat){
        //Object {uid: 100003, msg: "ad", isEmoj: false}
        for(var i = 0; i < this.playSeats.length;i++)
        {
            JJLog.print("this.playSeats[i].user111111111= " + this.playSeats[i] );
            if(this.playSeats[i].user != null && jChat.uid == this.playSeats[i].user.uid)
            {
                JJLog.print("this.playSeats[i].user2222222222= " + this.playSeats[i].user );
                this.room.onRecMsg(i,jChat.msg);
                break;
            }
        }


    },
  // 解析table data
  onTableStatus: function (jtable) {
    JJLog.print("onTableStatus:");
      var _this = this;

  },

  onThrowStatus: function(data) {
    JJLog.print(data);
  },


  checkOffline: function () {
    if(this.isOffline == 1) return true;

    return false;
  },



});

