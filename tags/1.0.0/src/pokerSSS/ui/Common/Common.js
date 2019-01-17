var THROWTHINGTYPE =
    {
        1: 'mahjong_magic_emotion_rose',
        2: 'mahjong_magic_emotion_bomb',
        3: 'mahjong_magic_emotion_egg',
        4: 'mahjong_magic_emotion_brick',
    }

var THROWTHINGPNGLEGTH =
    {
        1: 32,
        2: 35,
        3: 26,
        4: 27
    }


var SSSDESKPOSITIONS =
    {
        1: [0],
        2: [0, 4],
        3: [0, 3, 6],
        4: [0, 3, 4, 6],
        5: [0, 2, 3, 6, 7],
        6: [0, 2, 3, 4, 6, 7],
        7: [0, 1, 2, 3, 4, 5, 6],
        8: [0, 1, 2, 3, 4, 5, 6, 7],
    }

var SSSHEADOFFPOSITIONS =
    {
        2: {0: cc.p(150, 0), 4: cc.p(-150, 0)},
        3: {0: cc.p(150, 0), 3: cc.p(-50, 0), 6: cc.p(50, 0)},
        4: {0: cc.p(150, 0), 3: cc.p(-50, -100), 4: cc.p(-150, 0), 6: cc.p(50, -100)},
        5: {0: cc.p(150, 0), 2: cc.p(-100, 50), 3: cc.p(-100, 100), 6: cc.p(100, 100), 7: cc.p(100, 50)},
        6: {0: cc.p(170, 0), 2: cc.p(0, 0), 3: cc.p(0, 0), 4: cc.p(-170, 0), 6: cc.p(0, 0), 7: cc.p(0, 0)},
        7: {0: cc.p(0, 0), 1: cc.p(0, 0), 2: cc.p(0, 0), 3: cc.p(0, 0), 4: cc.p(0, 0), 5: cc.p(0, 0), 6: cc.p(0, -100)},
    }

var SSSDESKOFFPOSITIONS =
    {
        2: {0: cc.p(150, 0), 4: cc.p(-200, 0)},
        3: {0: cc.p(150, 0), 3: cc.p(-100, 0), 6: cc.p(100, 0)},
        4: {0: cc.p(150, 0), 3: cc.p(-100, -100), 4: cc.p(-200, 0), 6: cc.p(100, -100)},
        5: {0: cc.p(150, 0), 2: cc.p(-150, 50), 3: cc.p(-150, 100), 6: cc.p(150, 100), 7: cc.p(150, 50)},
        6: {0: cc.p(150, 0), 2: cc.p(-30, 0), 3: cc.p(-30, 0), 4: cc.p(-200, 0), 6: cc.p(30, 0), 7: cc.p(30, 0)},
        7: {0: cc.p(0, 0), 1: cc.p(0, 0), 2: cc.p(0, 0), 3: cc.p(0, 0), 4: cc.p(0, 0), 5: cc.p(0, 0), 6: cc.p(0, -100)},
    }


var SSSCommonParam = {
    'PAICARDBACK': (util.getCacheItem('majiang_bg') != undefined && util.getCacheItem('majiang_bg') != null) ? util.getCacheItem('majiang_bg') : 8,
    'ShowUpCardHeight': 30,
    'MoveUpTime': 0.03,
    'MoveDownTime': 0.03,
    'PutOut1stTime': 0.1,
    'PutOutScale': 1.2,
    'PutOutDelay': 0.6,
    'PutOut2ndTime': 0.2,
    'PutOutScaleBack': 0.7,
    'ShowDelayTime': 0.6,
    'PutOutScaleReset': 1.0,
    'ChatFadeOut': 4.0,
    'BuhuaDelay': 2.0,
    'JinpaiDelay': 2.0,
    'JinPaiScale': 0.8,
    'My17CardStandScale': 1,
    'My17CardShowScale': 0.8,
    'Other17CardStandScale': 0.77,
    'Othter17CardShowScale': 1.2,
    'Othter17CardRecordScale': 1.,
    'Othter17PengScale': 0.96,
    'LeftCardGap': 0.67,
    'LeftCardWidthGap': 0.96,
    'UpCardGap': 0.96,
    'UpCardHeightGap': 0.72,
    'POKERSHOWDELAY': 1.5,
    'SPECPOKERSHOWDELAY': 0.5,
    'STARTCOMPAREDELAY': 1.5,
    'YJPOKERSHOWDELAY': 0.8,
}

var ShuiTypeWord = {
    0: "",
    1: "ssspoker_type1.png",        //乌龙
    2: "ssspoker_type2.png",        //对子
    3: "ssspoker_type3.png",        // 两对
    4: "ssspoker_type4.png",        //三条
    5: "ssspoker_type5.png",        //顺子
    6: "ssspoker_type5.png",        //顺子
    7: "ssspoker_type5.png",        //顺子
    8: "ssspoker_type8.png",        //同花
    9: "ssspoker_type9.png",        //葫芦
    10: "ssspoker_type10.png",      //铁枝
    11: "ssspoker_type12.png",      //同花顺
    12: "ssspoker_type12.png",      //同花顺
    13: "ssspoker_type12.png",      //同花顺
    14: "ssspoker_type13.png",      //五同

    20: "ssspoker_type20.png",      //三同花：中尾头都是同花
    21: "ssspoker_type21.png",      //三顺子
    22: "ssspoker_type22.png",      //六对半
    23: "ssspoker_type23.png",      //五对三条：5个对子+一个三条
    24: "ssspoker_type24.png",      //三刻两对
    25: "ssspoker_type25.png",      //12红1黑 或12黑1红
    26: "ssspoker_type26.png",      //13红或13黑
    27: "ssspoker_type27.png",      //全小
    28: "ssspoker_type28.png",      //全大

    30: "ssspoker_type30.png",      //六六大顺

    40: "ssspoker_type40.png",      //三同花顺
    41: "ssspoker_type41.png",      //十二皇族
    42: "ssspoker_type42.png",      //三皇五帝

    50: "ssspoker_type50.png",      //三分天下 3组铁支
    51: "ssspoker_type51.png",      //四套三条
    52: "ssspoker_type52.png",      //一条龙

    60: "ssspoker_type60.png",      //至尊清龙

    80: "ssspoker_type80.png",       //冲三
    90: "ssspoker_type90.png",       //中墩葫芦
}

var YylTypeWord = {
    0: "",
    1: "img_paixin_00.png",        //乌龙
    2: "img_paixin_01.png",        //对子
    3: "img_paixin_02.png",        // 两对
    4: "img_paixin_03.png",        //三条
    5: "img_paixin_04.png",        //顺子
    6: "img_paixin_04.png",        //顺子
    7: "img_paixin_04.png",        //顺子
    8: "img_paixin_05.png",        //同花
    9: "img_paixin_06.png",        //葫芦
    10: "img_paixin_07.png",      //四同
    11: "img_paixin_08.png",      //同花顺
    13: "img_paixin_09.png",      //皇家同花
};
var YylZhongjiang = {
    0: "",
    1: "img_paixin_00.png",        //乌龙
    2: "img_paixin_01.png",        //对子
    3: "img_paixin_02.png",        // 两对
    4: "img_paixin_03.png",        //三条
    5: "img_paixin_04.png",        //顺子
    6: "img_paixin_04.png",        //顺子
    7: "img_paixin_04.png",        //顺子
    8: "img_zjiang_01.png",        //同花
    9: "img_zjiang_02.png",        //葫芦
    10: "img_zjiang_03.png",      //四同
    11: "img_zjiang_04.png",      //同花顺
    13: "img_zjiang_05.png",      //皇家同花
};

var YylZhongjiangWord = {
    0: "",
    1: "乌龙",        //乌龙
    2: "对子",        //对子
    3: "两对",        // 两对
    4: "三条",        //三条
    5: "顺子",        //顺子
    8: "同花",        //同花
    9: "葫芦",        //葫芦
    10: "四条",      //四同
    11: "同花顺",      //同花顺
    13: "皇家同花顺",      //皇家同花
};


var ShiSanShuiTypeWord = {
    //特殊牌型
    20: "三同花",
    21: "三顺子",
    22: "六对半",
    23: "五对三条",
    24: "三刻两对",
    25: "中原一点红",
    26: "全一色",
    27: "全小",
    28: "全大",
    30: "六六大顺",
    40: "三同花顺",
    41: "十二皇族",
    42: "三皇五帝",
    50: "三分天下",
    51: "四套三条",
    52: "一条龙",
    60: "至尊清龙",
};

var ShuiType = {
    ONE_DOUBLE: 2,   //对子
    TWO_DOUBLE: 3,   //两对
    THREE: 4,        //三条
    MIXED_FLUSH: 5,  //顺子
    FIVE_FLUSH: 8,   //同花
    THREE_DOUBLE: 9, //葫芦
    FOUR_ONE: 10,    //铁枝
    STRAIGHT_FLUSH: 11, //同花顺
    FIVE_SAME: 14,      //五同
    CHONGSAN: 80,        //冲三
    ZHONG_THREE_DOUBLE: 90,  //中墩葫芦
}

