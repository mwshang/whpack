/**
 * Created by Administrator on 2017/9/7 0007.
 */
var ShiSanShuiType = {
  CT_INVALID:0,         							 //错误类型
  CT_SINGLE:1,                         //单牌类型 3
  CT_ONE_DOUBLE:2,                     //只有一对 33
  CT_FIVE_TWO_DOUBLE:3,                //两对牌型 33 55
  CT_THREE:4,                          //三张牌型 333
  CT_FIVE_MIXED_FLUSH:5,    	         //顺子
  CT_FIVE_MIXED_FLUSH_NO_A:5,					 //没A杂顺
  CT_FIVE_MIXED_FLUSH_BACK_A:6,				 //A在后顺子  5432A
  CT_FIVE_MIXED_FLUSH_FIRST_A:7,    	 //A在前顺子  AKQJ10
  CT_FIVE_FLUSH:8,                     //同花五牌
  CT_FIVE_THREE_DOUBLE:9,              //三条一对葫芦 333 44
  CT_FIVE_FOUR_ONE:10,                 //四带一张铁支 4444 1
  CT_FIVE_STRAIGHT_FLUSH:11,					 //同花顺牌
  CT_FIVE_STRAIGHT_FLUSH_NO_A:11,			 //没有A同花顺牌
  CT_FIVE_STRAIGHT_FLUSH_BACK_A:12,    //A在后同花顺  5432A
  CT_FIVE_STRAIGHT_FLUSH_FIRST_A:13,   //A在前同花顺  AKQJ10
  CT_FIVE_SAME: 14,                    //五同牌 55555

  //特殊牌型
  CT_SPECIAL_SANTONGHUA:20,                   //三同花：中尾头都是同花
  CT_SPECIAL_SANSHUNZI:21,                    //三顺子
  CT_SPECIAL_LIUDUIBAN:22,                    //六对半：
  CT_SPECIAL_WUDUISAN:23,                     //五对三条：5个对子加一个三条
  CT_SPECIAL_SANKELIANGDUI:24,                //三刻两对
  CT_SPECIAL_REDBLACKONE:25,                  //中原一点红: 12红1黑 或12黑1红
  CT_SPECIAL_REDBLACK:26,                     //凑一色: 13红或13黑
  CT_SPECIAL_ALLSMALL:27,                     //全小: 全是2-8
  CT_SPECIAL_ALLBIG:28,                       //全大: 全是8-A
  CT_SPECIAL_LIULIUDASHUN:30,                 //六六大顺 出现6张相同牌
  CT_SPECIAL_SANTONGHUASHUN:40,               //三同花顺
  CT_SPECIAL_SHIERHUANGZU:41,                 //十二皇族  12张都是10以上的牌
  CT_SPECIAL_SANHUANGWUDI:42,                 //三皇五帝  2组5同加一个三条
  CT_SPECIAL_SANFENTIANXIA:50,                //三分天下 四个炸弹带一张单牌
  CT_SPECIAL_SITAOSAN:51,                     //四套三条：四套3条的牌型
  CT_SPECIAL_YITIAOLONG:52,                   //一条龙
  CT_SPECIAL_QINGLONG:60,                     //至尊清龙

};

var AnalyseDataSegment = function () {
  this.bOneCount = 0;								//单张数目
  this.bTwoCount = 0;								//两张数目
  this.bThreeCount = 0;							//三张数目
  this.bFourCount = 0;							//四张数目
  this.bFiveCount = 0;							//五张数目
  this.bLaiZiCount = 0;                         //癞子牌数量
  this.nLaiZiPos = 0;                           //癞子被用来替代那个张数的牌
  this.bOneFirst = [];							//单牌位置
  this.bTwoFirst = [];							//对牌位置
  this.bThreeFirst = [];						//三条位置
  this.bFourFirst = [];							//四张位置
  this.bFiveFirst = [];							//五张位置
  this.bStraight = false;					  //是否同花
  this.bLaiZiData =[];   //癞子牌
  this.shunZi=[];     //顺子
};

var AnalyseData = function () {
  this.bOneCount = 0;								//单张数目
  this.bTwoCount = 0;								//两张数目
  this.bThreeCount = 0;							//三张数目
  this.bFourCount = 0;							//四张数目
  this.bFiveCount = 0;							//五张数目
  this.bSixCount = 0;                       //六张数目
  this.bFiveMixedFlushCount = 0;		//仅顺子数目
  this.bFiveFlushCount = 0;			    //仅同花数目
  this.bFiveStraightFlushCount = 0;	//同花顺数目
  this.bLaiZiCount = 0;    //癞子数量
  this.bOneData = [];							  //单牌
  this.bTwoData = [];							  //对牌
  this.bThreeData = [];						  //三条
  this.bFourData = [];							//四张
  this.bFiveData = [];							//五张
  this.bSixData = [];                   //六张
  this.bFiveMixedFlushData = [];		//仅顺子
  this.bFiveFlushData = [];				  //仅同花
  this.bFiveStraightFlushData = [];	//同花顺
  this.bLaiZiData =[];
  this.fPaiCount={};
  this.fPaiData={};  //牌的数量
};