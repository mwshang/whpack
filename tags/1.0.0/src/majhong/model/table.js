var MajhongTable = cc.Class.extend({
    SEAT_TOTAL: 4, // 总座位数
    playSeats : [], // 玩家座位
    play:"onPlay",//是否在玩
    tableId:null,
    tableModel:0,
    seatArray:null,
    selfPos:0,
    selfInfo:null,
    inited:false,
    bankerId : 0, // 庄家UID
    //********quanzhou*********
    //手牌数量14||17
    MajhongNumber:14,
    //耗子ID
    JinPaiId:null,
    KaiPaiId:null,
    //---------quanzhou-----------
    tableInfo:null,
    isOffline:false,
    offLineInfo:{},
    chairArr:[],
    report:null,
    roundTotal:0,
    roomId:0,
    diScore :1,
    playInfo:0,
    aaGem:0,
    isHuaScore:0,
    op1:0,
    op2:0,
    op3:0,
    op4:0,
    op5:0,
    op6:0,
    op7:0,
    op8:0,
    op9:0,
    op10:0,
    op11:0,
    person:0,
    currRound:0,
    allRound:0,
    isRePrivateTable:0,
    isSBL:null,
    ctor: function () {
        JJLog.print("majhong.Table ctor");
        this.seatArray = new Array(4);
        this.registerAllEvents();
    },

    registerAllEvents: function () {
        qp.event.listen(this, 'mjTableStatus', this.onTableStatus);
        qp.event.listen(this, 'mjThrowStatus', this.onThrowStatus);
        qp.event.listen(this, 'mjPlayerEnter', this.onPlayerEnter);
        qp.event.listen(this, 'mjBankerResult', this.onBankerResult);
        qp.event.listen(this, 'mjSendHandCards', this.onSendHandCards);
        qp.event.listen(this, 'mjNotifyDelCards', this.onNotifyDelCards);
        qp.event.listen(this, 'mjLocalPosition', this.hallLocalPosition);

    },

    removeAllEvents: function () {
        qp.event.stop(this, 'mjTableStatus');
        qp.event.stop(this, 'mjThrowStatus');
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
        this.isArena = false;
    },

    initSeatInfo: function (data) {
        var playerDataArray = data["tableStatus"]["players"];
        MajhongInfo.MajhongNumber =data["tableStatus"]["mjNumber"];
        this.tableInfo = data["tableStatus"]["players"];
        this.tableModel = data["tableType"];
        this.person = data["tableStatus"]['person'];
        this.isRePrivateTable = data["tableStatus"]['isRePrivateTable'];
        for(var i = 0;i<playerDataArray.length;i++){
            var info = playerDataArray[i]["player"];
            info['isOffLine'] = playerDataArray[i]['isOffLine'];
            info['coinNum'] = playerDataArray[i]['coinNum'];
            if(GAMENAME == 'wuhan')
            {
                info['gdGangBuPai'] = playerDataArray[i]['gdGangBuPai'];
            }
            var id = info["uid"];
            var pos = info["position"];
            this.seatArray[pos] = info;
            if(id == hall.user.uid)
            {
                this.selfPos = pos;
                this.selfInfo = this.seatArray[pos];
            }
        }
        this.inited = true;
    },

    getTableDes:function () {

    },

    getCardByPlayer: function (uid) {
        for(var i = 0;i<this.tableInfo.length;i++){
            if(this.tableInfo[i]['uid'] == uid)
            {
                var info = this.tableInfo[i];
                return info;
            }
        }

        return null;
    },

    seatPosInfo: function (pos) {
        if(this.seatArray[pos] == undefined)
        {
            return null;
        }
        return this.seatArray[pos];
    },

    setSeatPosInfo: function (data) {
        this.seatArray[data["position"]] = data;
    },

    uidofPos:function(uid)
    {
        var posArray = [0,1,2,3];

        for(var p in this.seatArray){
            if(uid == this.seatArray[p]['uid']) {
                var position= this.seatArray[p]['position'];
                if(position < this.selfPos)
                {
                    return posArray[posArray.length-this.selfPos + position];
                }else
                {
                    return posArray[position-this.selfPos];
                }
            }
        }
        return null;

    },
    uidOfInfo: function (uid) {
        for(var p in this.seatArray){
            if(uid == this.seatArray[p]['uid']) {
                return this.seatArray[p];
            }
        }
        return null;
    },

    selfSeatInfo: function () {
        return this.selfInfo;
    },

    rightSeatInfo: function () {
        var pos =  this.selfPos < 3 ? this.selfPos+1 : 0;
        if(this.person == 2)
        {
            return null;
        }
        return this.seatPosInfo(pos);
    },

    upSeatInfo: function () {
        var pos =  this.selfPos < 2 ? this.selfPos+2 : this.selfPos -2;
        if(this.person == 2)
        {
            pos =  this.selfPos == 0 ? 1 : 0;
        }
        if(this.seatPosInfo(pos))
        return this.seatPosInfo(pos);
    },

    leftSeatInfo: function () {
        var pos =  this.selfPos  > 0 ? this.selfPos -1 : 3;
        if(this.person == 2)
        {
            return null;
        }
        return this.seatPosInfo(pos);
    },

    onPlayerEnter:function(data){
        JJLog.print(data);
    },

    onBankerResult:function(data){
        JJLog.print(data);

    },

    onSendHandCards:function(data){
        JJLog.print(data);
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
                if(info != null && info != undefined)
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

    initSeat: function(cb) {
        hall.getPlayingGame().net.init(cb);
    },

    ready: function(cb) {
        JJLog.print("ready:");
        hall.getPlayingGame().net.ready(1, cb);
    },

    throw: function(objectId, cb) {
        JJLog.print("throw:");
        hall.getPlayingGame().net.throw(objectId, cb);
    },

    // 解析table data
    onTableStatus: function (jtable) {
        JJLog.print("onTableStatus:");
    },

    onThrowStatus: function(data) {
        JJLog.print(data);
    },

});

//需要更改 -- 配置地方麻将信息
var MajhongQuanZhouTable = MajhongTable.extend({
    initSeatInfo: function (data) {
        this.roomId = data["tableStatus"]['tableId'];
        this.roundTotal = data["tableStatus"]['roundsTotal'];
        this.aaGem = data["tableStatus"]['aaGem'];
        this.op1 = data["tableStatus"]['paoOne'];
        this.op2 = data["tableStatus"]['jinTwo'];
        this.op3 = data["tableStatus"]['jinThree'];
        this.op4 = data["tableStatus"]['oneKe'];
        this.op5 = data["tableStatus"]['youJin'];
        this.op6 = data["tableStatus"]['person'];
        this._super(data);
    },
    getTableDes:function () {
        var desc = '';
        if(this.op4 > 0)
        {
            desc = '1课 ';
        }else
        {
            desc = this.roundTotal +'局 ';
        }
        desc += this.op6+"人";

        desc += " 游金X"+this.op5;

        if (this.op2 == 1)
            desc += ' 双金不平胡';
        return desc;
    },
    getTablePerson:function () {
        return this.op6;
    },
});

