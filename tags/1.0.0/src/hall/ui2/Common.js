/**
 * Created by atom on 2016/7/24.
 */

//游戏记录
MajhongInfo = {
    GameMode:0, //游戏运行模式记录
    MajhongNumber:17,//手牌最大数量
}

var card_deskSkewX = [15,13,10,6,2,-2,-4,-8,-12,-15];
var card_showPosX = [14,14,14,14,14,14,14,14,14,12,12,12,12,12,12,12,12,12];
var card_showSkewX = [-16,-16,-16,-15,-14,-11,-8,-6,-2,2,6,8,11,14,15,16,16,16];
var card_indexs = [0,0,0,1,2,3,4,5,6,6,5,4,3,2,1,0,0,0];

var GetCardDifferentIndex = function(index)
{
    var real =index;
    if (MajhongInfo.MajhongNumber<17)
        real += 2;
    return real;
}

var indicator_Posx = [47,46,45,44,43,38,37,36,35,34];
var indicator_UpPosx = [33,35,36,37,38,43,44,46,47,48];

var ResultTag = {
    HAIDILAO:'haidilao',
    BIRD:'bird',
    DAHU:'dahu',
}

var GameMode = {
    RECORD:2,
    PLAY:1,
}

var MjTime = {
  HU_SHOW_TIME:2,
}


var GameTag = {
    TAG_SPEAKER:3001,
}

var GameStatus = {
    SEATING:0,
    WATING:1,
    READY: 2,           //准备阶段 1秒进入下一阶段
    INITTABLE: 3,       //初始化牌桌阶段 包括 初始化玩家信息、数据信息、庄家判断、牌的初始化、洗牌、发牌
    PLAYING:4,          //游戏中状态
    GAMERESULT:5,        //游戏结果阶段 5秒给客户端展示阶段
    GAMEOVER:6           //游戏结束 桌子解散
}

var DeskType = {
    'Player':0,
    'Other':1,
}

var Times = {
    'OPERATETIME' : 20,
}


var CommonEvent = {
    TipEvent:'tip_event',
    Indicator:'Indicator_event',
    ResetCardState:'reset_card_state',
    EVT_DESK_MODE:'EVT_DESK_MODE',
    EVT_DESK_RESULT_INDEX:'evt_desk_result_index',
    EVT_RECORD:'evt_record',
    EVT_RECORD_NEXT_STEP:'evt_record_next_step',
    EVT_GAMING:'evt_gaming',
    EVT_ShareCallback:'evt_sharecallback',
    ChangeCardBg:'evt_changecardBg',
    ChangeGameSceneBg:'evt_changeGameSceneBg'
}

var RecordType = {
    READY:0,
    SEND:1,
    MO:2,
    NOTIFY_OP:3,
    SYSC_OP:4,
    SYSC_OP_RESULT:5,
    BIRD_CARDS:6,
    HAIDI:7,
    BUHUA:8,
    GeBaiLao:10,
    Zhen7Jia8:11,
    MaiZhuang:12,
    HengGang:13,
}

var RecordStatus = {
    PLAY:1,
    PAUSE:0,

}

var CommonEventAction = {
    'TipCancel':'tip_cancel',
    'Indicator_Start':'Indicator_Start',
    'Indicator_Stop':'Indicator_Stop',
    'GANG_EVT':'GANG_EVT',
    //********quanzhou*********
    'BUHUA_EVT':'BUHUA_EVT',
    'KAIJIN_EVT':'KAIJIN_EVT',
    'PLAYEROP_EVT':'PLAYEROP_EVT',
    'KAIPIZI_EVT':'KAIPIZI_EVT',         //武汉用 皮子
    'CARDREVERSAL_EVT':'CARDREVERSAL_EVT',   //老韭菜 翻转
    "CARDSWITCHNORMAL_EVT":'CARDSWITCHNORMAL_EVT', //老韭菜 翻转
    //---------quanzhou-----------
}

var CommonParam = {
    'PAICARDBACK':(util.getCacheItem('majiang_bg')!=undefined && util.getCacheItem('majiang_bg') != null)?util.getCacheItem('majiang_bg'):8,
    'ShowUpCardHeight':30,
    'MoveUpTime':0.03,
    'MoveDownTime':0.2,
    'PutOut1stTime':0.05,
    'PutOutScale':1.2,
    'PutOut2ndTime':0.1,
    'PutOutScaleBack':0.7,
    'ShowDelayTime':0.3,
    'PutOutScaleReset':1.0,
    'ChatFadeOut':4.0,
    //********quanzhou*********
    'BuhuaDelay':2.0,
    'JinpaiDelay':2.0,
    'JinPaiScale':0.7,
    'My17CardStandScale':0.8,
    'My17CardShowScale':0.75,
    'My14CardShowScale':0.8,
    'Other17CardStandScale':0.77,
    'Other17ShowScale':0.8,
    'Other17CardRecordScale':0.8,
    'UP17CardStandScale':0.85,
    'UP17ShowScale':0.95,
    'UP17CardRecordScale':0.95,
    'LeftCardGap':0.67,
    'LeftCardWidthGap':0.96,
    'UpCardGap':0.96,
    'UpCardHeightGap':0.72,
    'DownCardGap':0.66,
    'DownCardHeightGap':0.72,
    'DeskOneNum':10,
    'ResultCardScale':0.9,
    //---------quanzhou-----------
    //pdk
    'pokerGap':70
}
//********quanzhou*********
var CARD_JIN ={
    'NO':0,
    'YES':1,
}
//---------quanzhou-----------

var NetErr = {
    'OK':200,
    'ERR':500
}


var ResCard = {
    "chi":"#word_chi1.png",
    "peng":"#word_peng1.png",
    "gang":"#word_gang1.png",
    "buzhang":"#word_buzhang.png",
    "hu":"#word_hu.png"


}

var TABLEDIRECTION = {
    'EAST':0,
    'SOUTH':1,
    'WEST':2,
    'NORTH':3
}

var OPERATIONTYPE = {
    'TIANHU':0,
    'CHI':1,
    'PENG':2,
    'GANG':3,
    'BUZHANG':4,
    'HU':5,
    'GUO':6,
    'TING':7,
    }

var OPERATIONNAME = {
    'CHI':"chi",
    'PENG':"peng",
    'GANG':"gang",
    'BUZHANG':"bu",
    'HU':"hu",
    'GUO':"guo",
    'TING':"ting",
    'Gebailao':"gebailao",
    'CHIJIANG':"chiJiang",
}

var OPER_GANG_TYPE = {
    'GANG_AN':1,
    'GANG_OTHER':2,
    'GANG_MING':3,
    'Gang_Pizi':4,
    'Gang_Laizi':5,
}

var CARD_SITE = {
    'HAND_IN':0,
    'HAND_OUT':1,
    'HAND_CHI':2,
    'HAND_PENG':3,
    'HAND_GANG':4,
    'HAND_HU':5,
    'RECORD':6,
}

var TipRes = {
  'chi':['btn_chi.png','word_chi.png'],
  'peng':['btn_peng.png','word_peng.png'],
  'gang':['btn_gang.png','word_gang.png'],
    'bu':['btn_gang.png','word_gang.png'],
  'hu':['btn_hu.png','word_hu.png'],
  'guo':['btn_guo_gray.png','btn_guo_gray.png'],
   'ting':['btn_ting.png','word_ting.png'],
   'gebailao':['btn_ting.png','word_guo.png'],
}

var DaHuRes = {
  0:'dahu_queyise_no.png',//缺一色
  1:'dahu_banbanhu_no.png',//板板胡
  2:'dahu_sixi_no.png',//起手有杠  大四喜
  3:'dahu_liuliushun_no.png',//六六顺  起手有两组三张一样的
}

var DaHuSound = {
  0 : 'queyise',
  1: 'banbanhu',
  2: 'dasixi',
  3:'liuliushun',
}

var TianHuWord = {
  0:'缺一色',//缺一色
  1:'板板胡',//板板胡
  2:'大四喜',//起手有杠  大四喜
  3:'六六顺 ',//六六顺  起手有两组三张一样的
}

  ChangShaHuType = {
      PingHu:0,//普通胡
      QingYiSe:1,//全部是一种花色 例如全部是万
      PengPengHu:2,//都是碰 的牌 没有吃的
      QiXiaoDui:3,//七小对  11 22 33 44 55 66 77
      QiXiaoDui1:4,//豪华七小对 就是有四个一样的例如11 11 22 33 44 55 66
      QiXiaoDui2:5,//双豪华  11 11 22 22 33 44 55
      QiXiaoDui3:6,//3豪华  11 11 22 22 33 33 44
      QuanQiuRen:7,//全球人 顾名思义手上只剩下一个牌就是全球人 全部靠别人打下去只剩下一个牌了
      JiangJiangHu:8,//将将胡 手上全部都是2 5 8
      GangKaiHua:9,//杠牌 杠出自己胡的牌
      QiangGangHu:10,//A选择杠  B正好胡A的杠 那么抢杠胡 暗杠不能抢
      GangShangPao:11,//A杠 杠出别人胡的牌 别人胡了
      HaiDiLaoYue:12,//海底牌 最后一张
      HaiDiPao:13,// 海底炮
      MenQing:14//门清 谁也不靠并且自摸
  }

ChangShaHuSound = {
  0:'xiaohu',//普通胡
  1:'qingyise',//全部是一种花色 例如全部是万
  2:'pengpenghu',//都是碰 的牌 没有吃的
  3:'qixiaodui',//七小对  11 22 33 44 55 66 77
  4:'haohuaqixiaodui',//豪华七小对 就是有四个一样的例如11 11 22 33 44 55 66
  5:'haohuaqixiaodui',//双豪华  11 11 22 22 33 44 55
  6:'haohuaqixiaodui',//3豪华  11 11 22 22 33 33 44
  7:'quanqiuren',//全球人 顾名思义手上只剩下一个牌就是全球人 全部靠别人打下去只剩下一个牌了
  8:'jiangjianghu',//将将胡 手上全部都是2 5 8
  9:'gangshangkaihua',//杠牌 杠出自己胡的牌
  10:'qiangganghu',//A选择杠  B正好胡A的杠 那么抢杠胡 暗杠不能抢
  11:'gangshangpao',//A杠 杠出别人胡的牌 别人胡了
  12:'haidilaoyue',//海底牌 最后一张
  13:'haidipao',// 海底炮
  14:'zimo2'//门清 谁也不靠并且自摸
}


  ChangShaHuRes = {
    0:'dahu_xiaohu.png',//普通胡
    1:'dahu_qingyise.png',//全部是一种花色 例如全部是万
    2:'dahu_pengpenghu.png',//都是碰 的牌 没有吃的
    3:'dahu_qixiaodui.png',//七小对  11 22 33 44 55 66 77
    4:'dahu_haohuaqixiaodui.png',//豪华七小对 就是有四个一样的例如11 11 22 33 44 55 66
    5:'dahu_chaohaohuaqixiaodui.png',//双豪华  11 11 22 22 33 44 55
    6:'dahu_chaohaohuaqixiaodui.png',//3豪华  11 11 22 22 33 33 44
    7:'dahu_quanqiuren.png',//全球人 顾名思义手上只剩下一个牌就是全球人 全部靠别人打下去只剩下一个牌了
    8:'dahu_jiangjianghu.png',//将将胡 手上全部都是2 5 8
    9:'dahu_gangshangkaihua.png',//杠牌 杠出自己胡的牌
    10:'dahu_qiangganghu.png',//A选择杠  B正好胡A的杠 那么抢杠胡 暗杠不能抢
    11:'dahu_gangshanghua.png',//A杠 杠出别人胡的牌 别人胡了
    12:'dahu_haidilaoyue.png',//海底牌 最后一张
    13:'dahu_haidipao.png',// 海底炮
    14:'dahu_xiaohu.png',//门清 谁也不靠并且自摸
  }

  ChangShaHuWord = {
        0: "普通胡",
        1: "清一色",
        2: "碰碰胡",
        3: "七小对",
        4: "豪华七小对",
        5: "双豪华七小对",
        6: "3豪华七小对",
        7: "全球人",
        8: "将将胡",
        9: "杠上开花",
        10: "抢杠胡",
        11: "杠上炮",
        12: "海底牌",
        13: "海底炮",
        14: "门清",
      //QingYiSe:1,//全部是一种花色 例如全部是万
      //PengPengHu:2,//都是碰 的牌 没有吃的
      //QiXiaoDui:3,//七小对  11 22 33 44 55 66 77
      //QiXiaoDui1:4,//豪华七小对 就是有四个一样的例如11 11 22 33 44 55 66
      //QiXiaoDui2:5,//双豪华  11 11 22 22 33 44 55
      //QiXiaoDui3:6,//3豪华  11 11 22 22 33 33 44
      //QuanQiuRen:7,//全球人 顾名思义手上只剩下一个牌就是全球人 全部靠别人打下去只剩下一个牌了
      //JiangJiangHu:8,//将将胡 手上全部都是2 5 8
      //GangKaiHua:9,//杠牌 杠出自己胡的牌
      //QiangGangHu:10,//A选择杠  B正好胡A的杠 那么抢杠胡 暗杠不能抢
      //GangShangPao:11//A杠 杠出别人胡的牌 别人胡了
    //HaiDiLaoYue:12,//海底牌 最后一张
    //HaiDiPao:13,// 海底炮
    //MenQing:14//门清 谁也不靠并且自摸
  }

var QuanZhouHuType = {
    PuTong:0,//普通户
    YouJin:1,//游金
    ShuangYou:2,//双游
    SanYou:3,//三游
    SanJinDao:4//三金倒
}

QuanZhouHuSound = {
    0:'xiaohu',
    1:'zimo1',
    2:'zimo2',
    3:'hu2',
    4:'hu1',
    5:'zimo1',
}

var QuanZhouHuRes = {
    0:'dahu_xiaohu.png', //dahu_xiaohu.png
    1:'youjin.png',
    2:'shuangyou.png',
    3:'sanyou.png',
    4:'sanjindao.png',
    5:'dahu_zimo.png',
}

var QuanZhouHuWord = {
    0: "dahu_xiaohu.png",
    1: "youjin.png",
    2: "shuangyou.png",
    3: "sanyou.png",
    4: "sanjindao.png",

}
var QuanZhouHuTips = {
    0: "tip_ting.png",
    1: "tip_youjin.png",
    2: "tip_shuangyou.png",
    3: "tip_sanyou.png",
}
var CHAT_TYPE =
{
    'Usual':0,
    'Exp':1,
}

var CHAT_EMOJI = [
    'E40A.png',
    'E40B.png',
    'E40C.png',
    'E40D.png',
    'E40F.png',
    'E056.png',
    'E057.png',
    'E058.png',
    'E105.png',
    'E106.png',
    'E107.png',
    'E108.png',
    'E403.png',
    'E404.png',
    'E405.png',
    'E406.png',
    'E407.png',
    'E408.png',
    'E410.png',
    'E411.png',
    'E412.png',
    'E40E.png',
    'E414.png',
    'E415.png',
    'E416.png',
    'E417.png',
    'E418.png',
    'E421.png',
]

var SexInfo = {
    '1':{'head':'male.png','icon':'sex_male.png'},//男
    '2':{'head':'female.png','icon':'sex_female.png'},//女
}

var PuKeType = {
    CT_ERROR:0,                         //错误类型
    CT_SINGLE:1,                        //单牌类型 3
    CT_DOUBLE:2,                        //对牌类型 33
    CT_THREE:3,                         //三同类型 333
    CT_SINGLE_LINE:4,                   //顺子类型 34567
    CT_DOUBLE_LINE:5,                   //对连类型 3344
    CT_THREE_LINE_TAKE_ONE:6,           //三带一类型 3334
    CT_THREE_LINE_TAKE_TWO:7,           //三带二类型 33344
    CT_FORE_LINE_TAKE_THREE:8,          //四带三类型 3333456
    CT_SIX_LINE_TAKE_FORE:9,            //飞机类型 3334445678
    CT_BOMB:10                          //炸弹类型   33333
}

var gReportError = function(errorStr)
{
    JJLog.log2cloud(errorStr);
}
var sliceName = function(name)
{
  if(name.length > 10)
  {
    name = name.slice(0,10);
  }

  return name;
}

var isEmojiCharacter = function(substring) {
    for ( var i = 0; i < substring.length; i++) {
        var hs = substring.charCodeAt(i);
        if (0xd800 <= hs && hs <= 0xdbff) {
            if (substring.length > 1) {
                var ls = substring.charCodeAt(i + 1);
                var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                if (0x1d000 <= uc && uc <= 0x1f77f) {
                    return true;
                }
            }
        } else if (substring.length > 1) {
            var ls = substring.charCodeAt(i + 1);
            if (ls == 0x20e3) {
                return true;
            }
        } else {
            if (0x2100 <= hs && hs <= 0x27ff) {
                return true;
            } else if (0x2B05 <= hs && hs <= 0x2b07) {
                return true;
            } else if (0x2934 <= hs && hs <= 0x2935) {
                return true;
            } else if (0x3297 <= hs && hs <= 0x3299) {
                return true;
            } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                || hs == 0x2b50) {
                return true;
            }
        }
    }
}

var cutStringLenght = function (subString) {
    var _length = 0;
    var _name = subString;
    var length = subString.length;
    for(var i = 0; i < length; i++) {
        var charCode = subString.charCodeAt(i);
        if (charCode >0 && charCode <=128) {
            _length++;
            if (_length > 10) {
                _name = subString.substr(0, i-2) + "...";
                return _name;
            }
        } else {
            _length += 2;
            if (_length > 10) {
                _name = subString.substr(0, i-1) + "...";
                return _name;
            }
        }
    }
    console.log("_name", _name);
    return _name;

}

var NoticeMsg = {
  list:[],
  board:[],
  size:5,
  addMsg:function(msg)
  {
    if(this.list.length >= this.size)
    {
      this.list.splice(0,1);
    }
    this.list.push(msg);
  },
  getMsg: function (index) {
    if(index < this.list.length)
    {
      return this.list[index];
    }

    return ' ';
  },

    addBoard:function(msg)
    {
        if(this.board.length >= this.size)
        {
            this.board.splice(0,1);
        }
        this.board.push(msg);
    },
    getBoard: function (index) {
        if(index < this.board.length)
        {
            return this.board[index];
        }

        return ' ';
    },


};

// var ani = new ShaiziAnimation(4,6);
// ani.setPosition(cc.p(640,360));
// this.addChild(ani,1000);
// ani.runAnimation(function(){
//     console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
// })

var ShaiziAnimation = cc.Node.extend({
    shaizi1:null,
    shaizi2:null,
    ctor: function (point1,point2) {
        this._super();
        cc.spriteFrameCache.addSpriteFrames('res/Animation/shaizi.plist');
        this.shaizi1 = new ccui.ImageView("shaizi"+point1+".png", ccui.Widget.PLIST_TEXTURE);
        this.shaizi2 = new ccui.ImageView("shaizi"+point2+".png", ccui.Widget.PLIST_TEXTURE);
        this.shaizi1.setPosition(cc.p(-50,-20));
        this.shaizi2.setPosition(cc.p(50,-14));
        this.shaizi1.setVisible(false);
        this.shaizi2.setVisible(false);
        this.addChild(this.shaizi1);
        this.addChild(this.shaizi2);
        this.setVisible(false);
    },

    runAnimation: function (cb) {
        this.runAction(cc.sequence(cc.show(),cc.callFunc(function(){
                var sp_ani1 = new cc.Sprite('#'+'shaizi_anmi1.png');
                this.addChild(sp_ani1);
                sp_ani1.setPosition(cc.p(0,0));

                var animFrames = [];
                var str = "";
                var frame;
                for (var i = 1; i < 12; i++) {
                    str = "shaizi_anmi" + i + ".png";
                    frame = cc.spriteFrameCache.getSpriteFrame(str);
                    animFrames.push(frame);
                }
                var anim = new cc.Animation(animFrames, 0.1);
                sp_ani1.runAction(cc.sequence(cc.animate(anim),cc.callFunc(function(){
                    sp_ani1.setVisible(false);
                    this.shaizi1.setVisible(true);
                    this.shaizi2.setVisible(true);
                }.bind(this))));
            }.bind(this)),cc.delayTime(2),cc.callFunc(function(){
                cb();
        }),cc.removeSelf()));
    }

});
