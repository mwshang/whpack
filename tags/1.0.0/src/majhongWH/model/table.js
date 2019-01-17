//需要更改 -- 配置地方麻将信息
var MajhongWuHanTable = MajhongTable.extend({
    PiziId1:null,
    PiziId2:null,
    PiziId3:null,
    initSeatInfo: function (data) {
        this.roomId = data["tableStatus"]['tableId'];
        this.roundTotal = data["tableStatus"]['roundsTotal'];
        this.aaGem = data["tableStatus"]['aaGem'];
        this.op1 = data["tableStatus"]['yuanLaiFan'];
        this.op2 = data["tableStatus"]['fengLaiFan'];
        this.op3 = data["tableStatus"]['yiJiuLaiFan'];
        this.op4 = data["tableStatus"]['lianJinFan'];
        this.op6 = data["tableStatus"]['person'];
        this._super(data);
    },
    getTableDes:function () {
        var desc = this.roundTotal  +'局';
        if(this.op1 > 0 )
        {
            desc += ' 原赖翻番';

        }
        if(this.op2 > 0)
        {
            desc += ' 风赖翻番';
        }
        if(this.op3 > 0)
        {
            desc += ' 一九赖翻番';
        }
        if(this.op4 > 0)
        {
            desc += ' 连金翻番';
        }
        if(this.aaGem > 0)
        {
            desc += ' AA支付';
        }else
        {
            desc += ' 房主支付';
        }
        return desc;
    },
    getTablePerson:function () {
        return 4;
},
});