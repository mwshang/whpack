var WuHanHuSound = {
    0:'xiaohu',
    1:'zimo1',
    2:'zimo2',
    3:'hu2',
    4:'hu1',
    5:'zimo1',
    6:'zimo1',
    7:'zimo2',
}

var WuHanHuRes = {
    0:'wh_dahu_xiaohu.png', //平胡
    1:'wh_dahu_qingyise.png',  //清一色
    2:'wh_dahu_pengpenghu.png', //碰碰胡
    7:'wh_dahu_quanqiuren.png',     //全求人
    8:'wh_dahu_jiangyise.png',     //将将胡
    9:'wh_dahu_gangkai.png',     //杠开
    10:'wh_dahu_qiangganghu.png',     //抢杠胡
    12:'wh_dahu_haidilao.png',     //海底捞月
    17:'wh_dahu_fenyise.png',     //风一色

    20:'wh_dahu_zimo.png',     //自摸

}

var WuHanHuWord = {
    0: "平胡",
    1: "清一色",
    2: "碰碰胡",
    7: "全求人",
    8: "将将胡",
    9: "杠上开花",
    10: "抢杠胡",
    12: "海底捞月",
    17: "风一色",
    20: "自摸",

}
var WHCommonParam = {
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
    'JinPaiScale':0.8,
    'My17CardStandScale':1,
    'My17CardShowScale':0.8,
    'My14CardShowScale':0.8,
    'Other17CardStandScale':0.77,
    'Othter17CardShowScale':1,
    'Othter17ShowScale':0.96,
    'Othter14ShowScale':1,
    'Othter17CardRecordScale':1,
    'Othter14CardRecordScale':1,
    'LeftCardGap':0.67,
    'LeftCardWidthGap':0.96,
    'UpCardGap':0.96,
    'UpCardHeightGap':0.72,
    'DownCardGap':0.66,
    'DownCardHeightGap':0.72,
    'DeskOneNum':10,
    'ResultCardScale':1,
    //---------quanzhou-----------
}