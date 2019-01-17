club.common = {
    getWanfaDesc: function (config) {
        JJLog.print("get wanfa desc" + JSON.stringify(config));
        var wanfa = "";
        if (config.tableName == "paodekuai") {
            wanfa = this.getPDKTableDes.bind(config)();
        }else if (config.serverType == "changsha") {
            wanfa = this.getNXTableDes(config)
        }else if (config.serverType == "douniu") {
            wanfa = this.getNiuniuTableDes(config)
        }
        else if (config.tableName == "shisanshui") {
            wanfa = this.getSSSTableDes(config)
        } else if (config.tableName == "qidong") {
            wanfa = this.getMajhongQDTableDes(config);
        } else if (config.tableName == "qidongbd") {
            wanfa = this.getMajhongBDTableDes(config);
        } else if (config.tableName == "qidongljc") {
            wanfa = this.getLJCTableDes(config);
        } else if (config.serverType == "wuhan") {
            wanfa = this.getWuHanTableDes(config);
        }
        return wanfa;
    },
    getPDKTableDes:function () {
        // var desc = this.mode+'张,'+this.person+"人场,";
        var desc = this.mode+'张,'+this.person+"人场,";
        if(this.aaGem == 1) desc+= "AA制收费,";
        if(this.firstMode == 1)
        {
            desc+= "赢家先出,";
        }
        else
        {
            desc+= "黑桃3先出,";
            if(this.mustContain == 1) desc+= "第一手牌必须包含黑桃3,";
        }

        if(this.showNum == 1)
            desc+= "显示剩余手牌张数,";
        else
            desc+= "不显示剩余手牌张数,";

        if(this.isSameIp == 1) desc+= "防作弊."
        return desc;
    },
    getNXTableDes:function (data) {
        var desc = data['rounds']  +'局';
        if(data['niaoNum'] > 0 )
        {
            desc += ' 抓'+data['niaoNum']+'鸟';

        }else
        {
            desc += ' 不抓鸟';
        }
        if(data['isLaiZi'] > 0)
        {
            desc += ' 带王';
        }
        if(data['isSanTong'] > 0)
        {
            desc += ' 三同';
        }
        if(data['isBuBuGao'] > 0)
        {
            desc += ' 步步高';
        }
        if(data['menQing'] > 0)
        {
            desc += ' 门清';
        }
        if(data['isYiZhiHua'] > 0)
        {
            desc += ' 一枝花';
        }
        if(data['isJinTongYuNv'] > 0)
        {
            desc += ' 金童玉女';
        }
        if(data['isLiuLiuShun'] > 0)
        {
            desc += ' 六六顺';
        }
        if(data['isQueYiSe'] > 0)
        {
            desc += ' 缺一色';
        }
        if(data['isBanBanHu'] > 0)
        {
            desc += ' 板板胡';
        }
        if(data['isDaSiXi'] > 0)
        {
            desc += ' 大四喜';
        }
        if(data['isZhongTuSiXi'] > 0)
        {
            desc += ' 中途四喜';
        }
        if(data['isZhuangXian'] > 0)
        {
            desc += ' 庄闲';
        }
        if(data['isPiaoFen'] > 0)
        {
            desc += ' 飘分';
        }
        return desc;
    },
    getNiuniuTableDes:function (data) {
        JJLog.print('####'+JSON.stringify(data));
        var desc = data['rounds']+"局" + data['person'] +'人';
        desc += ' 底分x'+data["diFen"];

        if(data["wanFa"] == WAN_FA.TONGBI){
            desc += ' 通比牛牛';
        }else if(data["wanFa"] == WAN_FA.NIUNIUSHANGZHUANG){
            desc += ' 赢家上庄';
        }else if(data["wanFa"] == WAN_FA.MINGPAIQIANGZHAUNG){
            desc += ' 明牌抢庄';
        }
        if(data["fanBei"] == 1){
            desc += ' 牛牛x3 牛九x2 牛八x2';
        }else if(data["fanBei"] == 2){
            desc += ' 牛牛x4 牛九x3 牛八x2 牛七x2';
        }
        if(data["spePai"]  > 0)
        {
            desc+=" 特殊牌型翻倍 ";
        }else if(data["spePai"]  == 0)
        {
            desc+=" 特殊牌型不翻倍";
        }

        return desc;
    },
    getSSSTableDesOld: function (data) {
        var person = data['person'];
        var mode = data['mode'];
        var ishavebanker = data['banker'];
        var AAgem = data['aaGem'];
        var area = data['area'];
        var wanfa = data['wanFa'];
        var wang = data['wang'];
        var isMa = data['isMa'];
        var desc = '';

        if (area == 'nb') {
            desc = "宁波十三道";
        } else {
            if (ishavebanker > 0) {
                desc = '坐庄十三水';
            } else {
                if (wanfa == 0)
                    desc = "经典十三水";
                else if (wanfa == 4) {
                    desc = "加一色十三水";
                }
                else if (wanfa == 1) {
                    desc = "加三张十三水";
                }
                else if (wanfa == 2) {
                    desc = "减一色十三水";
                } else {
                    desc = "全一色十三水";
                }
                if (wang > 0) {
                    desc = "百变十三水, " + wang + "张王";
                }
            }
        }
        desc = desc + "," + person + "人场, "
        var fufei = ["房主付费", "平摊付费", "大赢家付费"];
        if (AAgem > -1 && AAgem < 3) {
            desc = desc + fufei[AAgem];
        }
        var modeArr = ["", ",打枪加一", ",打枪2倍", ",打枪3倍"];
        if (mode > 0 && mode < 4) {
            desc = desc + modeArr[mode];
        }
        desc = desc + ".";
        return desc;
    },
    getMajhongQDTableDes:function (data) {
        this.roomId = data['tableId'];
        this.roundTotal = data['rounds'];
        this.aaGem = data['aaGem'];
        this.op1 = data['jia'];
        this.op2 = data['diScore'];
        this.op3 = data['niao'];
        this.op4 = data['isQiDui'];
        this.op6 = data['person'];
        this.laZi = data['laZi'];
        var desc = this.roundTotal  +'局';

        if(this.laZi > 0)
        {
            desc += (this.laZi+'分');
        }

        if(this.op1 > 0 )
        {
            desc += ' 嵌张';
        }
        if(this.op2 > 0)
        {
            desc += ' 底花X1';
        }
        if(this.op3 > 0)
        {
            desc += ' 飞苍蝇X1';
        }
        if(this.op4 > 0)
        {
            desc += ' 七对胡';
        }
        if(this.aaGem > 0)
        {
            desc += ' AA支付';
        }
        else
        {
            desc += ' 房主支付';
        }
        return desc;
    },
    getMajhongBDTableDes: function (data) {
        this.roomId = data['tableId'];
        this.roundTotal = data['rounds'];
        this.aaGem = data['aaGem'];
        this.op1 = data['isSBL'];
        this.op2 = data['laZi'];
        this.op3 = data['isMaiZhuang'];
        this.op4 = data['isHuangDaoDi'];
        this.op5 = data['isQiDui'];
        this.op6 = data['person'];
        this.isSBL = data['isSBL'];
        this.isHuaScore = data["isHuaScore"];

        var desc = this.roundTotal  +'局 ';

        if(this.op2 > 0)
        {
            desc += (this.op2+'番');
        }

        if(this.op1 == 1 )
        {
            desc += ' 双百佬';

        }else if(this.op1 == 0 )
        {
            desc += ' 单百佬';
        }

        if(this.isHuaScore == 0)
        {
            desc += " 花不算分";
        }
        else if(this.isHuaScore == 1)
        {
            desc += " 一花1分";
        }
        if(this.op3 > 0)
        {
            desc += ' 买庄';
        }
        if(this.op4 > 0)
        {
            desc += ' 一荒到底';
        }
        if(this.op5 > 0)
        {
            desc += ' 七对胡';
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
    getLJCTableDes: function (data) {
        data["tableStatus"] = data;
        this.roomId = data["tableStatus"]['tableId'];
        this.roundTotal = data["tableStatus"]['rounds'];
        this.aaGem = data["tableStatus"]['aaGem'];
        this.op1 = data["tableStatus"]['isLaiZi'];
        this.op2 = data["tableStatus"]['laZi'];               //辣子
        this.op3 = data["tableStatus"]['isMaiZhuang'];
        this.op4 = data["tableStatus"]['isHuangDaoDi'];
        this.op5 = data["tableStatus"]['isQiDui'];
        this.op6 = data["tableStatus"]['person'];
        //this.isSBL = data["tableStatus"]['isSBL'];          //带百佬
        this.isHuaScore = data["tableStatus"]["isHuaScore"];


        this.dianPaoSanjia = data['tableStatus']['isDianPaoSanJia'];           //点炮赢3家
        this.isPengGangMenQing = data['tableStatus']['isPengGangMenQing'];     //二次杠算门清
        // 喜钱的四个可选项
        this.xiQian = data['tableStatus']['xiQian'];                                      //喜钱
        this.isYiTiaoLong = data['tableStatus']['isYiTiaoLong'];               //一条龙
        this.isQueMen = data['tableStatus']['isQueMen'];                       //缺门
        this.isYiLuanWu = data['tableStatus']['isYiLuanWu'];                   //一乱无
        this.isQuanXiao =  data['tableStatus']['isQuanXiao'];                  //全小
        this.isQingYiSe = data['tableStatus']['isQingYiSe'] ;                  //清一色

        this.isZuiJiang = data['tableStatus']['isZuiJiang'];                   //追将算坎钱  默认带
        this.isGuo = data['tableStatus']['isGuo'];                            //掴百搭 可选项，选择带百搭时才可选，默认带。若不带百搭则没有

        this.isYiPaoDuoXiang = data['tableStatus']['isYiPaoDuoXiang'];                      //一炮多响
        this.isBaiDaZiMo = data['tableStatus']['isBaiDaZiMo'];                  // 百搭自摸
        this.daDiaoChe = data['tableStatus']['daDiaoChe'];                       //大吊车算3番

        var desc = "";
        if(this.aaGem > 0)
        {
            desc += 'AA支付';
        }else
        {
            desc += '房主支付';
        }

        desc += this.roundTotal  +'局 ';

        if(this.op2 > 0)
        {
            desc += (this.op2+'番');
        }

        //喜钱
        if(this.xiQian > 0)
        {
            if(this.isYiTiaoLong == 1) {
                desc += ' 一条龙';
            }
            if(this.isQueMen == 1) {
                desc += ' 缺门';
            }
            if(this.isYiLuanWu){
                desc += ' 一乱无';
            }
            if(this.isQuanXiao == 1){
                desc += ' 全小' ;
            }
            if(this.isQingYiSe == 1){
                desc += ' 清一色' ;
            }
        }

        //可选玩法
        if(this.op3 > 0)
        {
            desc += ' 买庄';
        }

        if(this.op1 == 1 )
        {
            desc += ' 带百搭';
            if(this.isGuo)
            {
                desc += ' 掴百搭';
            }

        }else if(this.op1 == 0 )
        {
            // desc += ' 单百佬';
            // if(this.isGuo)
            // {
            //     desc += ' 掴百搭';
            // }
        }

        if(this.isZuiJiang == 1)
        {
            desc += ' 追将算坎钱';
        }

        if(this.dianPaoSanjia == 1)
        {
            desc += ' 点炮三家出';
        }

        if(this.isPengGangMenQing)
        {
            desc += ' 二次杠算门清';
        }
        if(this.isYiPaoDuoXiang == 1)
        {
            desc += ' 一炮多响';
        }
        if(this.isBaiDaZiMo ==1)
        {
            desc += ' 百搭自摸';
        }
        if(this.daDiaoChe == 1)
        {
            desc += ' 大吊车3番';
        }

        if(this.op5 > 0)
        {
            desc += ' 七小对';
        }

        return desc;
    },
    getSSSTableDes: function (data) {
        data["tableStatus"] = data;
        console.log("data", data);
        this.roomId = data["tableStatus"]['tableId'];
        this.roundTotal = data["tableStatus"]['rounds'];
        this.person = data["tableStatus"]['person'];
        this.ishavebanker = data["tableStatus"]['banker'];
        this.duose = data["tableStatus"]['duose'];
        this.mode = data["tableStatus"]['mode'];
        this.AAgem =  data["tableStatus"]['aaGem'];
        this.area =  data["tableStatus"]['area'];
        this.wanfa = data["tableStatus"]['wanFa'];
        this.wanFaType = data["tableStatus"]['wanFaType'];
        this.bei = data["tableStatus"]['bei'];
        this.bankerId = data["tableStatus"]['fangZhu'];
        this.isMa =  data["tableStatus"]['isMa'];
        this.isRePrivateTable = data["tableStatus"]['isRePrivateTable'];
        this.chongSan = data["tableStatus"]['chongSan'];
        this.wang = data["tableStatus"]['wang'];
        if(this.isMa > 0 && data["tableStatus"]['maPai'] != null && data["tableStatus"]['maPai'].type != null) {
            this.maPaiId = data["tableStatus"]['maPai'].type+""+data["tableStatus"]['maPai'].value;
        }
        this.tableInfo = data["tableStatus"]["players"];

        var juNum = this.roundTotal;
        var person = this.person;
        var duose = this.duose;
        var mode = this.mode;
        var ishavebanker = this.ishavebanker;
        var aaGem  = this.AAgem;
        var area  = this.area;
        var wanfa = this.wanfa;
        var chongSan = this.chongSan;
        var wang = this.wang;
        var shuangJiang = this.wanFaType;
        var mapaiId = this.maPaiId;
        var desc = '';

        if(area == 'nb')
        {
            desc = "宁波十三道";
        }else
        {
            if (ishavebanker > 0)
            {
                desc = '坐庄十三水';
            }else
            {
                if(wanfa == 0)
                    desc = "经典十三水";
                else if(wanfa == 4)
                {
                    desc = "加一色十三水";
                }
                else if(wanfa == 1)
                {
                    desc = "加三张十三水";
                }
                else if(wanfa == 2)
                {
                    desc = "减一色十三水";
                }else if(wanfa == 3)
                {
                    desc = "全一色十三水";
                }
                if(wang > 0 )
                    desc = "百变十三水";

                if (shuangJiang == 1)
                    desc = "双将十三水";
            }
        }

        desc += " "+ person +"人";
        desc +='('+ juNum +'局)';

        if(wang > 0)
            desc += ' 百变'+ wang +"张";
        if (ishavebanker > 0 || wang > 0 || shuangJiang == 1)
        {
            if(wanfa == 1)
            {
                desc += ' 加三张';
            }else if(wanfa == 2)
            {
                desc += ' 减一色';
            }else if(wanfa == 4)
            {
                desc += ' 加一色';
            }
        }

        if(mode == 1)
        {
            desc += ' 打枪加一';
        }else
        {
            desc += ' 打枪'+mode+"倍";
        }

        if(this.isMa == 1)
        {
            desc += ' 马牌('+SSSPoker.PokerPaiImage.paiName[mapaiId]+')';
        }
        if (aaGem == 0)
        {
            desc += ' 房主付费';
        }
        else if (aaGem == 1)
        {
            desc += ' 平摊付费';
        }else if(aaGem == 2)
        {

            desc += ' 大赢家付费';
        }

        if(chongSan == 1)
            desc += " 冲三";

        return desc;
    },
    getWuHanTableDes:function (data) {
        var desc = data['rounds']  +'局';
        if(data['yuanLaiFan'] > 0 )
        {
            desc += ' 原赖翻番';

        }
        if(data['fengLaiFan'] > 0)
        {
            desc += ' 风赖翻番';
        }
        if(data['yiJiuLaiFan'] > 0)
        {
            desc += ' 一九赖翻番';
        }
        if(data['lianJinFan'] > 0)
        {
            desc += ' 连金翻番';
        }
        if(data['aaGem'] > 0)
        {
            desc += ' AA支付';
        }else
        {
            desc += ' 房主支付';
        }
        return desc;
    },
};