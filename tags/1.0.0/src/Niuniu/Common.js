var Common = {


}

var NNCardType = {
    NONE:0,
    ONE : 1,
    TWO : 2,
    THREE:3,
    FOUR:4,
    FIVE:5,
    SIX:6,
    SEVEN:7,
    EIGHT:8,
    NINE:9,
    TEN:10,
    FLOWER:11,//五花牛
    BOOM:12,//炸弹牛
    SMALL:13,//五小牛
}

var containValue = function(arr,value){
    var cardId = getCardId(value);
    for(var i = 0;i<arr.length;i++){
        var cardId2 = getCardId(arr[i]);
        if(cardId2 == cardId){
            return true;
        }
    }
    return false;
}







var MSG_TYPE = {
    INIT:1, //初始化桌子

}

var TABLE_STATUS = {
    UN_GAME :0,//没有游戏状态,桌子还没开始过
    SLEEP:1,//休眠状态,没有开始 玩家数量不足
    READY:2,//准备阶段,一秒进入下一阶段
    GAMBLING:3,//抢庄状态
    CHIP_IN:4,//下注倍数阶段
    GAMING:5,//游戏中状态
    GAME_RESULT:6,//游戏结果状态  5秒给客户端展示
    GAME_OVER:7,//整轮游戏结束
}

var PLAYER_TONGBI_STATUS = {
    SEAT_UNREADY : 0,//进入牌桌未准备
    SEAT_READY:1,//进入牌桌准备
    SHOW_CARD:2,//亮牌
    ROUND_DONE:3,//回合结束
}

var PLAYER_NIUNIUSHANGZHUANG_STATUS = {
    SEAT_UNREADY : 0,//进入牌桌未准备
    SEAT_READY:1,//进入牌桌准备
    CHIP_WAIT:2,//等待下注
    CHIP_DONE:3,//等待其他玩家下注
    SHOW_CARD:4,//亮牌
    ROUND_DONE:5,//回合结束
}

var PLAYER_MINGPAIQIANGZHUANG_STATUS = {
    SEAT_UNREADY : 0,//进入牌桌未准备
    SEAT_READY:1,//进入牌桌准备
    RAP_WAIT:2,//抢庄
    RAP_DONE:3,
    CHIP_WAIT:4,//等待下注
    CHIP_DONE:5,//等待其他玩家下注
    SHOW_CARD:6,//亮牌
    ROUND_DONE:7,//回合结束
}

var TIP_TYPE = {
    READY : 1,//请准备
    BANK : 2,//请操作抢庄
    BET : 3,//请选择下注分数
    WAIT_OTHER_SHOW:4,//等待别的玩家亮牌,
    CHECK:5,//查看手牌
    NEXT_ROUND:6,//下一局开始
    WAIT_JOIN:7,//等待其他玩家加入
    WAIT_BANK:8,//请等待其他玩家选庄
    PLAYER_BANK:9,//等待闲家押注
    RANDOM_BANK:10,//无人抢庄,随机选庄
    COMPARE:11,//开始比牌
}

var TIP_MSG = {
    AUTO_START : "人数已满自动开始游戏",

}

var WAN_FA ={
    TONGBI :1,
    NIUNIUSHANGZHUANG:2,
    MINGPAIQIANGZHAUNG:3,
}


var BigCardPath ={
    "13" : 'big_card_di_1_3.png', // 方块3
    "23" : 'big_card_di_2_3.png', // 梅花3
    "33" : 'big_card_di_3_3.png', // 红桃3
    "43" : 'big_card_di_4_3.png', // 黑桃3
    "14" : 'big_card_di_1_4.png', // 方块4
    "24" : 'big_card_di_2_4.png', // 梅花4
    "34" : 'big_card_di_3_4.png', // 红桃4
    "44" : 'big_card_di_4_4.png', // 黑桃4
    "15" : 'big_card_di_1_5.png', // 方块5
    "25" : 'big_card_di_2_5.png', // 梅花5
    "35" : 'big_card_di_3_5.png', // 红桃5
    "45" : 'big_card_di_4_5.png', // 黑桃5
    "16" : 'big_card_di_1_6.png', // 方块6
    "26" : 'big_card_di_2_6.png', // 梅花6
    "36" : 'big_card_di_3_6.png', // 红桃6
    "46" : 'big_card_di_4_6.png', // 黑桃6
    "17" : 'big_card_di_1_7.png', // 方块7
    "27" : 'big_card_di_2_7.png', // 梅花7
    "37" : 'big_card_di_3_7.png', // 红桃7
    "47" : 'big_card_di_4_7.png', // 黑桃7
    "18" : 'big_card_di_1_8.png', // 方块8
    "28" : 'big_card_di_2_8.png', // 梅花8
    "38" : 'big_card_di_3_8.png', // 红桃8
    "48" : 'big_card_di_4_8.png', // 黑桃8
    "19" : 'big_card_di_1_9.png', // 方块9
    "29" : 'big_card_di_2_9.png', // 梅花9
    "39" : 'big_card_di_3_9.png', // 红桃9
    "49" : 'big_card_di_4_9.png', // 黑桃9
    "110" : 'big_card_di_1_10.png', // 方块10
    "210" : 'big_card_di_2_10.png', // 梅花10
    "310" : 'big_card_di_3_10.png', // 红桃10
    "410" : 'big_card_di_4_10.png', // 黑桃10
    "111" : 'big_card_di_1_11.png', // 方块J
    "211" : 'big_card_di_2_11.png', // 梅花J
    "311" : 'big_card_di_3_11.png', // 红桃J
    "411" : 'big_card_di_4_11.png', // 黑桃J
    "112" : 'big_card_di_1_12.png', // 方块Q
    "212" : 'big_card_di_2_12.png', // 梅花Q
    "312" : 'big_card_di_3_12.png', // 红桃Q
    "412" : 'big_card_di_4_12.png', // 黑桃Q
    "113" : 'big_card_di_1_13.png', // 方块K
    "213" : 'big_card_di_2_13.png', // 梅花K
    "313" : 'big_card_di_3_13.png', // 红桃K
    "413" : 'big_card_di_4_13.png', // 黑桃K
    "11" : 'big_card_di_1_1.png', // 方块A
    "21" : 'big_card_di_2_1.png', // 梅花A
    "31" : 'big_card_di_3_1.png', // 红桃A
    "41" : 'big_card_di_4_1.png', // 黑桃A
    "12" : 'big_card_di_1_2.png', // 方块2
    "22" : 'big_card_di_2_2.png', // 梅花2
    "32" : 'big_card_di_3_2.png', // 红桃2
    "42" : 'big_card_di_4_2.png', // 黑桃2
    "315" : 'big_card_di_1_1.png', //小王
    "415" : 'big_card_di_1_1.png'  // 大王
}


var BigCardWordPath ={
    "13" : 'big_card_word_1_3.png', // 方块3
    "23" : 'big_card_word_2_3.png', // 梅花3
    "33" : 'big_card_word_3_3.png', // 红桃3
    "43" : 'big_card_word_4_3.png', // 黑桃3
    "14" : 'big_card_word_1_4.png', // 方块4
    "24" : 'big_card_word_2_4.png', // 梅花4
    "34" : 'big_card_word_3_4.png', // 红桃4
    "44" : 'big_card_word_4_4.png', // 黑桃4
    "15" : 'big_card_word_1_5.png', // 方块5
    "25" : 'big_card_word_2_5.png', // 梅花5
    "35" : 'big_card_word_3_5.png', // 红桃5
    "45" : 'big_card_word_4_5.png', // 黑桃5
    "16" : 'big_card_word_1_6.png', // 方块6
    "26" : 'big_card_word_2_6.png', // 梅花6
    "36" : 'big_card_word_3_6.png', // 红桃6
    "46" : 'big_card_word_4_6.png', // 黑桃6
    "17" : 'big_card_word_1_7.png', // 方块7
    "27" : 'big_card_word_2_7.png', // 梅花7
    "37" : 'big_card_word_3_7.png', // 红桃7
    "47" : 'big_card_word_4_7.png', // 黑桃7
    "18" : 'big_card_word_1_8.png', // 方块8
    "28" : 'big_card_word_2_8.png', // 梅花8
    "38" : 'big_card_word_3_8.png', // 红桃8
    "48" : 'big_card_word_4_8.png', // 黑桃8
    "19" : 'big_card_word_1_9.png', // 方块9
    "29" : 'big_card_word_2_9.png', // 梅花9
    "39" : 'big_card_word_3_9.png', // 红桃9
    "49" : 'big_card_word_4_9.png', // 黑桃9
    "110" : 'big_card_word_1_10.png', // 方块10
    "210" : 'big_card_word_2_10.png', // 梅花10
    "310" : 'big_card_word_3_10.png', // 红桃10
    "410" : 'big_card_word_4_10.png', // 黑桃10
    "111" : 'big_card_word_1_11.png', // 方块J
    "211" : 'big_card_word_2_11.png', // 梅花J
    "311" : 'big_card_word_3_11.png', // 红桃J
    "411" : 'big_card_word_4_11.png', // 黑桃J
    "112" : 'big_card_word_1_12.png', // 方块Q
    "212" : 'big_card_word_2_12.png', // 梅花Q
    "312" : 'big_card_word_3_12.png', // 红桃Q
    "412" : 'big_card_word_4_12.png', // 黑桃Q
    "113" : 'big_card_word_1_13.png', // 方块K
    "213" : 'big_card_word_2_13.png', // 梅花K
    "313" : 'big_card_word_3_13.png', // 红桃K
    "413" : 'big_card_word_4_13.png', // 黑桃K
    "11" : 'big_card_word_1_1.png', // 方块A
    "21" : 'big_card_word_2_1.png', // 梅花A
    "31" : 'big_card_word_3_1.png', // 红桃A
    "41" : 'big_card_word_4_1.png', // 黑桃A
    "12" : 'big_card_word_1_2.png', // 方块2
    "22" : 'big_card_word_2_2.png', // 梅花2
    "32" : 'big_card_word_3_2.png', // 红桃2
    "42" : 'big_card_word_4_2.png', // 黑桃2
    "315" : 'big_card_word_1_1.png', //小王
    "415" : 'big_card_word_1_1.png'  // 大王
}

var SmallCardPath ={
    "13" : 'card_type_1_3.png', // 方块3
    "23" : 'card_type_2_3.png', // 梅花3
    "33" : 'card_type_3_3.png', // 红桃3
    "43" : 'card_type_4_3.png', // 黑桃3
    "14" : 'card_type_1_4.png', // 方块4
    "24" : 'card_type_2_4.png', // 梅花4
    "34" : 'card_type_3_4.png', // 红桃4
    "44" : 'card_type_4_4.png', // 黑桃4
    "15" : 'card_type_1_5.png', // 方块5
    "25" : 'card_type_2_5.png', // 梅花5
    "35" : 'card_type_3_5.png', // 红桃5
    "45" : 'card_type_4_5.png', // 黑桃5
    "16" : 'card_type_1_6.png', // 方块6
    "26" : 'card_type_2_6.png', // 梅花6
    "36" : 'card_type_3_6.png', // 红桃6
    "46" : 'card_type_4_6.png', // 黑桃6
    "17" : 'card_type_1_7.png', // 方块7
    "27" : 'card_type_2_7.png', // 梅花7
    "37" : 'card_type_3_7.png', // 红桃7
    "47" : 'card_type_4_7.png', // 黑桃7
    "18" : 'card_type_1_8.png', // 方块8
    "28" : 'card_type_2_8.png', // 梅花8
    "38" : 'card_type_3_8.png', // 红桃8
    "48" : 'card_type_4_8.png', // 黑桃8
    "19" : 'card_type_1_9.png', // 方块9
    "29" : 'card_type_2_9.png', // 梅花9
    "39" : 'card_type_3_9.png', // 红桃9
    "49" : 'card_type_4_9.png', // 黑桃9
    "110" : 'card_type_1_10.png', // 方块10
    "210" : 'card_type_2_10.png', // 梅花10
    "310" : 'card_type_3_10.png', // 红桃10
    "410" : 'card_type_4_10.png', // 黑桃10
    "111" : 'card_type_1_11.png', // 方块J
    "211" : 'card_type_2_11.png', // 梅花J
    "311" : 'card_type_3_11.png', // 红桃J
    "411" : 'card_type_4_11.png', // 黑桃J
    "112" : 'card_type_1_12.png', // 方块Q
    "212" : 'card_type_2_12.png', // 梅花Q
    "312" : 'card_type_3_12.png', // 红桃Q
    "412" : 'card_type_4_12.png', // 黑桃Q
    "113" : 'card_type_1_13.png', // 方块K
    "213" : 'card_type_2_13.png', // 梅花K
    "313" : 'card_type_3_13.png', // 红桃K
    "413" : 'card_type_4_13.png', // 黑桃K
    "11" : 'card_type_1_1.png', // 方块A
    "21" : 'card_type_2_1.png', // 梅花A
    "31" : 'card_type_3_1.png', // 红桃A
    "41" : 'card_type_4_1.png', // 黑桃A
    "12" : 'card_type_1_2.png', // 方块2
    "22" : 'card_type_2_2.png', // 梅花2
    "32" : 'card_type_3_2.png', // 红桃2
    "42" : 'card_type_4_2.png', // 黑桃2
    "315" : 'card_type_1_1.png', //小王
    "415" : 'card_type_1_1.png'  // 大王
}

var CardPath = {
    "13" : '0x02.png', // 方块3
    "23" : '0x12.png', // 梅花3
    "33" : '0x22.png', // 红桃3
    "43" : '0x32.png', // 黑桃3
    "14" : '0x03.png', // 方块4
    "24" : '0x13.png', // 梅花4
    "34" : '0x23.png', // 红桃4
    "44" : '0x33.png', // 黑桃4
    "15" : '0x04.png', // 方块5
    "25" : '0x14.png', // 梅花5
    "35" : '0x24.png', // 红桃5
    "45" : '0x34.png', // 黑桃5
    "16" : '0x05.png', // 方块6
    "26" : '0x15.png', // 梅花6
    "36" : '0x25.png', // 红桃6
    "46" : '0x35.png', // 黑桃6
    "17" : '0x06.png', // 方块7
    "27" : '0x16.png', // 梅花7
    "37" : '0x26.png', // 红桃7
    "47" : '0x36.png', // 黑桃7
    "18" : '0x07.png', // 方块8
    "28" : '0x17.png', // 梅花8
    "38" : '0x27.png', // 红桃8
    "48" : '0x37.png', // 黑桃8
    "19" : '0x08.png', // 方块9
    "29" : '0x18.png', // 梅花9
    "39" : '0x28.png', // 红桃9
    "49" : '0x38.png', // 黑桃9
    "110" : '0x09.png', // 方块10
    "210" : '0x19.png', // 梅花10
    "310" : '0x29.png', // 红桃10
    "410" : '0x39.png', // 黑桃10
    "111" : '0x0A.png', // 方块J
    "211" : '0x1A.png', // 梅花J
    "311" : '0x2A.png', // 红桃J
    "411" : '0x3A.png', // 黑桃J
    "112" : '0x0B.png', // 方块Q
    "212" : '0x1B.png', // 梅花Q
    "312" : '0x2B.png', // 红桃Q
    "412" : '0x3B.png', // 黑桃Q
    "113" : '0x0C.png', // 方块K
    "213" : '0x1C.png', // 梅花K
    "313" : '0x2C.png', // 红桃K
    "413" : '0x3C.png', // 黑桃K
    "11" : '0x0D.png', // 方块A
    "21" : '0x1D.png', // 梅花A
    "31" : '0x2D.png', // 红桃A
    "41" : '0x3D.png', // 黑桃A
    "12" : '0x01.png', // 方块2
    "22" : '0x11.png', // 梅花2
    "32" : '0x21.png', // 红桃2
    "42" : '0x31.png', // 黑桃2
    "315" : '0x41.png', //小王
    "415" : '0x42.png'  // 大王
}


var getCardId = function(_cardValue){
    return _cardValue["type"] + "" + _cardValue["value"];
}

var SmallCardOfValue = function(_cardValue){
    var cardId = getCardId(_cardValue);
    return CardPath[cardId];
}

var BigCardOfValue = function(_cardValue){
    var cardId = getCardId(_cardValue);
    return BigCardPath[cardId];
}

var BigCardWordOfValue = function(_cardValue){
    var cardId = getCardId(_cardValue);
    return BigCardWordPath[cardId];
}

var NiuniuWanFa = {
    1:"通比牛牛",
    2:"赢家上庄",
    3:"明牌抢庄",
}

var NiuniuSound = {
    BG:"res/PokerNiuNiu/Resoures/Sound/backGround.mp3",
    BET:"res/PokerNiuNiu/Resoures/Sound/betMusic.mp3",
    cardSelect:"res/PokerNiuNiu/Resoures/Sound/cardSelect.mp3",
    coinMove:"res/PokerNiuNiu/Resoures/Sound/coinMove.mp3",
    dingZhuang:"res/PokerNiuNiu/Resoures/Sound/dingZhuang.mp3",
    GAME_WARN:"res/PokerNiuNiu/Resoures/Sound/GAME_WARN.mp3",
    gameBegin:"res/PokerNiuNiu/Resoures/Sound/gameBegin.mp3",
    selectBanker:"res/PokerNiuNiu/Resoures/Sound/selectBanker.mp3",
    sendCard:"res/PokerNiuNiu/Resoures/Sound/sendCard.mp3",
    Females:[
        "res/PokerNiuNiu/Resoures/Sound/niu/female0.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/female1.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/female2.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/female3.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/female4.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/female5.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/female6.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/female7.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/female8.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/female9.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/female10.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/female11.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/female12.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/female13.mp3"],
    Males:[
        "res/PokerNiuNiu/Resoures/Sound/niu/male0.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/male1.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/male2.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/male3.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/male4.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/male5.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/male6.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/male7.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/male8.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/male9.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/male10.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/male11.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/male12.mp3",
    "res/PokerNiuNiu/Resoures/Sound/niu/male13.mp3",



],

    female_Hint:"res/PokerNiuNiu/Resoures/Sound/niu/female_Hint.mp3",
    female_noHint:"res/PokerNiuNiu/Resoures/Sound/niu/female_noHint.mp3",
    female0:"res/PokerNiuNiu/Resoures/Sound/niu/female0.mp3",
    female1:"res/PokerNiuNiu/Resoures/Sound/niu/female1.mp3",
    female2:"res/PokerNiuNiu/Resoures/Sound/niu/female2.mp3",
    female3:"res/PokerNiuNiu/Resoures/Sound/niu/female3.mp3",
    female4:"res/PokerNiuNiu/Resoures/Sound/niu/female4.mp3",
    female5:"res/PokerNiuNiu/Resoures/Sound/niu/female5.mp3",
    female6:"res/PokerNiuNiu/Resoures/Sound/niu/female6.mp3",
    female7:"res/PokerNiuNiu/Resoures/Sound/niu/female7.mp3",
    female8:"res/PokerNiuNiu/Resoures/Sound/niu/female8.mp3",
    female9:"res/PokerNiuNiu/Resoures/Sound/niu/female9.mp3",
    female10:"res/PokerNiuNiu/Resoures/Sound/niu/female10.mp3",
    female11:"res/PokerNiuNiu/Resoures/Sound/niu/female11.mp3",
    female12:"res/PokerNiuNiu/Resoures/Sound/niu/female12.mp3",
    female13:"res/PokerNiuNiu/Resoures/Sound/niu/female13.mp3",

    male_Hint:"res/PokerNiuNiu/Resoures/Sound/niu/male_Hint.mp3",
    male_noHint:"res/PokerNiuNiu/Resoures/Sound/niu/male_noHint.mp3",
    male0:"res/PokerNiuNiu/Resoures/Sound/niu/male0.mp3",
    male1:"res/PokerNiuNiu/Resoures/Sound/niu/male1.mp3",
    male2:"res/PokerNiuNiu/Resoures/Sound/niu/male2.mp3",
    male3:"res/PokerNiuNiu/Resoures/Sound/niu/male3.mp3",
    male4:"res/PokerNiuNiu/Resoures/Sound/niu/male4.mp3",
    male5:"res/PokerNiuNiu/Resoures/Sound/niu/male5.mp3",
    male6:"res/PokerNiuNiu/Resoures/Sound/niu/male6.mp3",
    male7:"res/PokerNiuNiu/Resoures/Sound/niu/male7.mp3",
    male8:"res/PokerNiuNiu/Resoures/Sound/niu/male8.mp3",
    male9:"res/PokerNiuNiu/Resoures/Sound/niu/male9.mp3",
    male10:"res/PokerNiuNiu/Resoures/Sound/niu/male10.mp3",
    male11:"res/PokerNiuNiu/Resoures/Sound/niu/male11.mp3",
    male12:"res/PokerNiuNiu/Resoures/Sound/niu/male12.mp3",
    male13:"res/PokerNiuNiu/Resoures/Sound/niu/male13.mp3",

    Chat_Male:[
        "res/PokerNiuNiu/Resoures/Sound/chat_man/1.wav",
        "res/PokerNiuNiu/Resoures/Sound/chat_man/2.wav",
        "res/PokerNiuNiu/Resoures/Sound/chat_man/3.wav",
        "res/PokerNiuNiu/Resoures/Sound/chat_man/4.wav",
        "res/PokerNiuNiu/Resoures/Sound/chat_man/5.wav",
        "res/PokerNiuNiu/Resoures/Sound/chat_man/6.wav",
        "res/PokerNiuNiu/Resoures/Sound/chat_man/7.wav",
        "res/PokerNiuNiu/Resoures/Sound/chat_man/8.wav",
    ],

    Chat_Female:[
        "res/PokerNiuNiu/Resoures/Sound/chat_woman/1.wav",
        "res/PokerNiuNiu/Resoures/Sound/chat_woman/2.wav",
        "res/PokerNiuNiu/Resoures/Sound/chat_woman/3.wav",
        "res/PokerNiuNiu/Resoures/Sound/chat_woman/4.wav",
        "res/PokerNiuNiu/Resoures/Sound/chat_woman/5.wav",
        "res/PokerNiuNiu/Resoures/Sound/chat_woman/6.wav",
        "res/PokerNiuNiu/Resoures/Sound/chat_woman/7.wav",
        "res/PokerNiuNiu/Resoures/Sound/chat_woman/8.wav",
    ],
}

var NIUNIU_MSG  = [
    '快点啊，我等到花儿都谢了',
    '大家好，很高兴见到各位',
    '又断线了，网络怎么这么差',
    '跟你合作真是太愉快了',
    '你是妹妹还是哥哥啊',
    '不要走，决战到天亮',
    '各位真不好意思，我要离开一会',
    '再见了，我会想念大家的',
]