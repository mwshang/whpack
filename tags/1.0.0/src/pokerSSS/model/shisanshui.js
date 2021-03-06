/**
 * Created by bruce.yang on 2017/3/19.
 */
var logger = console;
logger.debug = logger.log;
// wanFa://0 经典 1:加3张 2:减1色 3:全一色 4.加一色
var ShiSanShui = function (_area,_wanFa) {
  this.area="fj"; //nb //sx
  if(!!_area)
    this.area=_area;

  this.wanFa=0;   //玩法
  if(!!_wanFa)
    this.wanFa=_wanFa;
};
var proto = ShiSanShui.prototype;

//获取类型
proto.GetCardType = function(bCardsData) {
  var bCardsCount = bCardsData.length;

  //数据校验
  if(bCardsCount!=3 && bCardsCount!=5) {
    logger.error('牌张数不对',bCardsCount);
    return ShiSanShuiType.CT_INVALID;
  }

  this.SortCardList(bCardsData , 'Descend') ;
  var analyseData = new AnalyseDataSegment();
  this.AnalyseCardSegment(bCardsData, analyseData);

  //开始分析
  switch (bCardsCount)
  {
    case 3:	//三条类型
    {
      //单牌类型
      if(3==analyseData.bOneCount) return ShiSanShuiType.CT_SINGLE;

      //对带一张
      if(1==analyseData.bTwoCount && 1==analyseData.bOneCount)
        return ShiSanShuiType.CT_ONE_DOUBLE;

      //三张牌型
      if(1==analyseData.bThreeCount) return ShiSanShuiType.CT_THREE;

      //错误类型
      return ShiSanShuiType.CT_INVALID;
    }
    case 5:	//五张牌型
    {
      if (1 == analyseData.bFiveCount) return ShiSanShuiType.CT_FIVE_SAME; // 五同

      // 顺子
      var bFlushNoA	= false ,
          b5432A	= false ,
          bAKQJ10	= false ;

      // AKQJ10
      if(14==this.GetCardLogicValue(bCardsData[0]) && 10==this.GetCardLogicValue(bCardsData[4]))
        bAKQJ10 = true ;
      else
        bFlushNoA = true ;
      for(var i=0 ; i<4 ; ++i)
        if(1!=this.GetCardLogicValue(bCardsData[i])-this.GetCardLogicValue(bCardsData[i+1]))
        {
          bAKQJ10 = false ;
          bFlushNoA   = false ;
        }

      // 5432A
      if(false==bAKQJ10 && false==bFlushNoA && 14==this.GetCardLogicValue(bCardsData[0]))
      {
        b5432A = true ;
        for(var i=1 ; i<4 ; ++i)
          if(1!=this.GetCardLogicValue(bCardsData[i])-this.GetCardLogicValue(bCardsData[i+1]))
            b5432A = false ;
        if(2!=this.GetCardLogicValue(bCardsData[4]))
          b5432A = false ;
      }

      var rets=[];
      //同花五牌
      if(false==bAKQJ10 && false==bFlushNoA && false==b5432A)
      {
        if(true==analyseData.bStraight) {
          rets.push(ShiSanShuiType.CT_FIVE_FLUSH);
        }
      }
      else if(true==bFlushNoA)
      {
        //杂顺类型
        if(false==analyseData.bStraight)
          rets.push(ShiSanShuiType.CT_FIVE_MIXED_FLUSH_NO_A);
        //同花顺牌
        else
          rets.push(ShiSanShuiType.CT_FIVE_STRAIGHT_FLUSH_NO_A);
      }
      else if(true==bAKQJ10)
      {
        //杂顺类型
        if(false==analyseData.bStraight)
          rets.push(ShiSanShuiType.CT_FIVE_MIXED_FLUSH_FIRST_A);
        //同花顺牌
        else
          rets.push(ShiSanShuiType.CT_FIVE_STRAIGHT_FLUSH_FIRST_A);
      }
      else if(true==b5432A)
      {

          //杂顺类型
          if(false==analyseData.bStraight)
            rets.push(ShiSanShuiType.CT_FIVE_MIXED_FLUSH_BACK_A);
          //同花顺牌
          else
            rets.push(ShiSanShuiType.CT_FIVE_STRAIGHT_FLUSH_BACK_A);

      }

      //四带单张
      if(1==analyseData.bFourCount && 1==analyseData.bOneCount)
      {
        if(this.wanFa==3)
        {
          rets.push(13.5);
        }
        else
        {
          rets.push(ShiSanShuiType.CT_FIVE_FOUR_ONE);
        }
      }


      //三条一对
      if(1==analyseData.bThreeCount && 1==analyseData.bTwoCount)
        rets.push(ShiSanShuiType.CT_FIVE_THREE_DOUBLE);

      //三条带单
      if(1==analyseData.bThreeCount && 2==analyseData.bOneCount)
        rets.push(ShiSanShuiType.CT_THREE);

      //两对牌型
      if(2==analyseData.bTwoCount && 1==analyseData.bOneCount)
        rets.push(ShiSanShuiType.CT_FIVE_TWO_DOUBLE);

      //只有一对
      if(1==analyseData.bTwoCount && 3==analyseData.bOneCount)
        rets.push(ShiSanShuiType.CT_ONE_DOUBLE);

      //单牌类型
      if(5==analyseData.bOneCount && false==analyseData.bStraight)
        rets.push(ShiSanShuiType.CT_SINGLE);

      //错误类型
      rets.push(ShiSanShuiType.CT_INVALID);

      rets.sort(function(x,y){ return y>x?1:-1 });
      //logger.debug("排序 类型",rets[0]);
      if(rets[0]==13.5)
      {
        rets[0]=ShiSanShuiType.CT_FIVE_FOUR_ONE;
      }
      return rets[0];
    }
  }

  return ShiSanShuiType.CT_INVALID;
};

//排列扑克
proto.SortCardList = function(bCardsData, sortCardType,isNoLogic) {
  if(bCardsData.length<1 || bCardsData.length>16) {
    logger.error('SortCardList', '牌数不对',bCardsData.length);
    return;
  }

  //转换数值
  var bLogicVolue = [];

  for (var i=0;i<bCardsData.length;i++)
      bLogicVolue[i] = {type:bCardsData[i].type, value:isNoLogic==undefined? this.GetCardLogicValue(bCardsData[i]):bCardsData[i].value};


  if(sortCardType == 'Descend')
  {
    //排序操作
    var bSorted=true;
    var bTempData,bLast=bCardsData.length-1;
    var bCardsCount=1;
    do
    {
      bSorted=true;
      for (var i=0;i<bLast;i++)
      {
        if ((bLogicVolue[i].value<bLogicVolue[i+1].value)||
          ((bLogicVolue[i].value==bLogicVolue[i+1].value)&&(bCardsData[i].value<bCardsData[i+1].value)))
        {
          //交换位置
          bTempData=bCardsData[i];
          bCardsData[i]=bCardsData[i+1];
          bCardsData[i+1]=bTempData;
          bTempData=bLogicVolue[i];
          bLogicVolue[i]=bLogicVolue[i+1];
          bLogicVolue[i+1]=bTempData;
          bSorted=false;
        }
      }
      bLast--;
    } while(bSorted==false);
  }
  else if(sortCardType == 'Ascend')
  {
    //排序操作
    var bSorted=true;
    var bTempData,bLast=bCardsData.length-1;
    var bCardsCount=1;
    do
    {
      bSorted=true;
      for (var i=0;i<bLast;i++)
      {
        if ((bLogicVolue[i].value>bLogicVolue[i+1].value)||
          ((bLogicVolue[i].value==bLogicVolue[i+1].value)&&(bCardsData[i].value>bCardsData[i+1].value)))
        {
          //交换位置
          bTempData=bCardsData[i];
          bCardsData[i]=bCardsData[i+1];
          bCardsData[i+1]=bTempData;
          bTempData=bLogicVolue[i];
          bLogicVolue[i]=bLogicVolue[i+1];
          bLogicVolue[i+1]=bTempData;
          bSorted=false;
        }
      }
      bLast--;
    } while(bSorted==false);
  }
  else if(sortCardType == 'Color')
  {
    //排序操作
    var bSorted=true;
    var bTempData,bLast=bCardsData.length-1;
    var bCardsCount=1;
    var bColor = [];
    for (var i=0;i<bCardsData.length;i++)
      bColor[i] = {type: bCardsData[i].type, value:bCardsData[i].value};
    do
    {
      bSorted=true;
      for (var i=0;i<bLast;i++)
      {
        if ((bColor[i].type<bColor[i+1].type)||
          ((bColor[i].type==bColor[i+1].type)&&(this.GetCardLogicValue(bCardsData[i])<this.GetCardLogicValue(bCardsData[i+1]))))
        {
          //交换位置
          bTempData=bCardsData[i];
          bCardsData[i]=bCardsData[i+1];
          bCardsData[i+1]=bTempData;
          bTempData=bColor[i];
          bColor[i]=bColor[i+1];
          bColor[i+1]=bTempData;
          bSorted=false;
        }
      }
      bLast--;
    } while(bSorted==false);
  }

//  logger.debug("排序",sortCardType);
//  logger.debug(bCardsData);
};

//删除扑克
proto.RemoveCard = function(bRemoveCards, bCardsData) {
  //检验数据
  if (bRemoveCards.length > bCardsData.length) {
    logger.error('RemoveCard', '待删除牌数错误');
  }

  var bDeleteCount = 0;
  for (var i=0;i<bRemoveCards.length;i++)
  {
    for (var j=0;j<bCardsData.length;j++)
    {
      if (bRemoveCards[i].type==bCardsData[j].type && bRemoveCards[i].value==bCardsData[j].value)
      {
        bCardsData.splice(j, 1);
        bDeleteCount++;
        break;
      }
    }
  }
  if (bDeleteCount!=bRemoveCards.length)
    return false;

  return true;
};

//逻辑数值
proto.GetCardLogicValue = function(bCardData) {
  return (bCardData.value==1)?(bCardData.value+13):bCardData.value;
};

//两张牌是否相同
proto.IsSameCard = function(bCardData1, bCardData2) {
  return (bCardData1.type == bCardData2.type && bCardData1.value == bCardData2.value);
};
//获取片段的属性名字根据 数量
proto.getAttrByCount = function(cnt)
{
  var temcnt=0;
  if(cnt<1)
  {
    temcnt=1;
  }
  else{
    temcnt=cnt;
  }
  var attrs=["","bOneFirst","bTwoFirst","bThreeFirst","bFourFirst","bFiveFirst"];
  return attrs[temcnt];
}
//对比扑克
/*
 返回值:
 *  异常 -1
 *	bNextList=bFirstList:0
 *	bNextList>bFirstList:1
 *	bNextList<bFirstList:2
 */
proto.CompareCard = function(bInFirstList, bInNextList, bComperWithOther, bCompareColor) {
  var FirstAnalyseData = new AnalyseDataSegment(), NextAnalyseData = new AnalyseDataSegment();

  //排列扑克
  var bFirstList = [], bNextList = [];
  bFirstList = bInFirstList.concat();
  bNextList = bInNextList.concat();
  this.SortCardList(bFirstList, 'Color');
  this.SortCardList(bNextList, 'Color');
  this.SortCardList(bFirstList, 'Descend');
  this.SortCardList(bNextList, 'Descend');

  if (3!=bFirstList.length && 5!=bFirstList.length && 3!=bNextList.length && 5!=bNextList.length) {
    logger.error('CompareCard', '牌数错误');
    return -1;
  }

  this.AnalyseCardSegment(bFirstList , FirstAnalyseData) ;
  this.AnalyseCardSegment(bNextList  , NextAnalyseData) ;
  //logger.debug("first111:",bFirstList);
  //logger.debug("first:",FirstAnalyseData);
  //logger.debug("next111:",bNextList);
  //logger.debug("next:",NextAnalyseData);

  if(bFirstList.length!=(FirstAnalyseData.bOneCount+FirstAnalyseData.bTwoCount*2+FirstAnalyseData.bThreeCount*3+FirstAnalyseData.bFourCount*4+FirstAnalyseData.bFiveCount*5))
  {
    logger.error('CompareCard', '牌数错误1');
    return -1 ;
  }
  if(bNextList.length != (NextAnalyseData.bOneCount + NextAnalyseData.bTwoCount*2 + NextAnalyseData.bThreeCount*3+NextAnalyseData.bFourCount*4+NextAnalyseData.bFiveCount*5))
  {
    logger.error('CompareCard', '牌数错误2');
    return -1 ;
  }

  //数据验证
  if(!(bFirstList.length==bNextList.length ||
    (bFirstList.length!=bNextList.length && (3==bFirstList.length && 5==bNextList.length || 5==bFirstList.length && 3==bNextList.length)))) {
    logger.error('CompareCard', '验证错误');
    return -1 ;
  }

  //获取类型
  var bNextType = this.GetCardType(bNextList);
  var bFirstType = this.GetCardType(bFirstList);

  if(bFirstType == -1 || bNextType == -1) {
    logger.error('CompareCard', '获取类型错误');
    return -1 ;
  }


  var compare = function (val1, val2) {
    if (val1 > val2)
      return 1;
    else if (val1 < val2)
      return 2;
    else
      return 0;
  };
  /*	bNextList=bFirstList:0
  *	bNextList>bFirstList:1
  *	bNextList<bFirstList:2
  */
  var SubCompareByAttr = function(self,FirstAnalyseData,NextAnalyseData,cnt)
  {
    var att = self.getAttrByCount(cnt);
    var len = FirstAnalyseData[att].length;
    if (NextAnalyseData[att].length > len)
      len = NextAnalyseData[att].length;

    var ret = compare(NextAnalyseData[att].length, FirstAnalyseData[att].length);

    if (ret != 0)
      return ret;

    //this.SortCardList(bNextList[NextAnalyseData[att][idx]],'Color')
    for (var idx = 0; idx < len; idx++) {
      if (FirstAnalyseData[att][idx] == undefined && NextAnalyseData[att] == undefined)
        return 0;
      else if (FirstAnalyseData[att][idx] == undefined)
        return 2;
      else if (NextAnalyseData[att][idx] == undefined)
        return 1;

      ret = compare(self.GetCardLogicValue(bNextList[NextAnalyseData[att][idx]]), self.GetCardLogicValue(bFirstList[FirstAnalyseData[att][idx]]));
      if (ret > 0) {
        return ret;
      }
    }

    return 0
  }
  /*	bNextList=bFirstList:0
   *	bNextList>bFirstList:1
   *	bNextList<bFirstList:2
   */
  var SubCompare =function(self,FirstAnalyseData,NextAnalyseData,startCnt)
  {
    for (var idx = startCnt; idx >= 1; idx--) {
      var ret = SubCompareByAttr(self, FirstAnalyseData, NextAnalyseData, idx);
      if (ret > 0)
        return ret;
    }

    return 0;
  }
  /*	bNextList=bFirstList:0
   *	bNextList>bFirstList:1
   *	bNextList<bFirstList:2
   */
  //比较单张牌花色
  var CompareSingle= function(firstDatas,NextDatas)
  {
    if(!firstDatas || !NextDatas)
    {
      logger.error("参数错误");
      return 0;
    }
    for (var idx = 0; idx < firstDatas.length; idx++) {
      var ret = compare(bNextList[NextDatas[idx]].type, bFirstList[firstDatas[idx]].type);
      if (ret > 0) {
        return ret
      }
    }

    return 0;
  }
  //头段比较
  if(bComperWithOther) // 和别人手上的同一段之间比
  {
    if(3==bFirstList.length)
    {
      //开始对比
      if(bNextType==bFirstType)
      {
        switch(bFirstType)
        {
          case ShiSanShuiType.CT_SINGLE:				//单牌类型
          {
            var bAllSame=true ;

            for(var i=0 ; i<3 ; ++i)
              if(this.GetCardLogicValue(bNextList[i]) != this.GetCardLogicValue(bFirstList[i]))
              {
                bAllSame = false ;
                break;
              }

            if(true==bAllSame) {
              if (bCompareColor) 			//比较花色
              {
                  var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
                  return ret;
              }
              else
                return 0;
            }
            else
            {
              for(var i=0 ; i<3 ; ++i) {
                var v = compare(this.GetCardLogicValue(bNextList[i]), this.GetCardLogicValue(bFirstList[i]));
                if (v != 0)
                  return v;
              }

              if (bCompareColor) 			//比较花色
              {
                var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
                return ret;
              }
              else
                return 0;
            }
          }
          case ShiSanShuiType.CT_ONE_DOUBLE:			//对带一张
          {
            var v = compare(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]]), this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]))
            if (v == 0)
            {
              var v = compare(this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]]), this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]));
              if (v != 0)
                return v;
              else {
                if (bCompareColor) 			//比较花色
                {
                  var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
                  return ret;
                }
                else
                  return 0;
              }
            }
            else
              return v;
          }
          case ShiSanShuiType.CT_THREE:				//三张牌型
          {
            var v = compare(this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]]), this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]));
            if (v != 0)
              return v;
            else {
              //if (bCompareColor) //比较花色
              //  return compare(bNextList[NextAnalyseData.bThreeFirst[0]].type, bFirstList[FirstAnalyseData.bThreeFirst[0]].type);
              //else
                return 0;
            }
          }
        }
      }
      else
        return compare(bNextType, bFirstType);
    }
    else
    {
      //开始对比
      if (bNextType==bFirstType)
      {
        switch(bFirstType)
        {
          case ShiSanShuiType.CT_SINGLE:				//单牌类型
          {
            var bAllSame=true ;

            for(var i=0 ; i<5 ; ++i)
              if(this.GetCardLogicValue(bNextList[i]) != this.GetCardLogicValue(bFirstList[i]))
              {
                bAllSame = false ;
                break;
              }

            if(true==bAllSame) {
              if (bCompareColor) 			//比较花色
              {
                var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
                return ret;
              }
              else
                return 0;
            }
            else
            {
              for(var i=0 ; i<5 ; ++i) {
                var v = compare(this.GetCardLogicValue(bNextList[i]), this.GetCardLogicValue(bFirstList[i]));
                if (v != 0)
                  return v;
              }

              if (bCompareColor) 			//比较花色
              {
                var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
                return ret;
              }
              else
                return 0;
            }
          }
          case ShiSanShuiType.CT_ONE_DOUBLE:			//对带一张
          {
            var v = compare(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]]), this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]));
            if (v == 0)
            {
              //对比单张
              for(var i=0; i<3; ++i)
              {
                v = compare(this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[i]]), this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[i]]))
                if (v != 0)
                  return v;
              }

              if (bCompareColor) 			//比较花色
              {
                var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
                return ret;
              }
              else
                return 0;
            }
            else
              return v; 	//比较数值
          }
          case ShiSanShuiType.CT_FIVE_TWO_DOUBLE:	//两对牌型
          {
            var v1 = compare(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]]), this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]));
            if (v1 == 0)
            {
              var v2 = compare(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[1]]), this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[1]]))
              if (v2 == 0)
              {
                var v3 = compare(this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]]), this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]))
                if (v3 != 0)
                  return v3;
                else {
                  if (bCompareColor) 			//比较花色
                  {
                    var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
                    return ret;
                  }
                  else
                    return 0;
                }
              }
              else
                return v2; 	//比较数值
            }
            else
              return v1; 	//比较数值
          }

          case ShiSanShuiType.CT_THREE:				//三张牌型
          {

            var v= SubCompare(this,FirstAnalyseData,NextAnalyseData,3);
            
            if(v!=0)
              return v;
            else
            {
              if (bCompareColor) 			//比较花色
              {
                var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
                return ret;
              }
              else
                return 0;
            }
          }

          case ShiSanShuiType.CT_FIVE_MIXED_FLUSH_FIRST_A:	//A在前顺子
          case ShiSanShuiType.CT_FIVE_MIXED_FLUSH_NO_A:			//没A杂顺
          case ShiSanShuiType.CT_FIVE_MIXED_FLUSH_BACK_A:		//A在后顺子
          {
            //数据验证
            // if(this.IsSameCard(bNextList[0], bFirstList[0]))
            //   return false ;

            var v = compare(this.GetCardLogicValue(bNextList[1]), this.GetCardLogicValue(bFirstList[1]));
            if (v == 0) {
              if (bCompareColor) 			//比较花色
              {
                var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
                return ret;
              }
              else
                return 0;
            }
            else
              return v;	//比较数值

          }

          case ShiSanShuiType.CT_FIVE_SAME: // 五张同牌
          {
            return compare(this.GetCardLogicValue(bNextList[0]), this.GetCardLogicValue(bFirstList[0]));
          }

          case ShiSanShuiType.CT_FIVE_FLUSH:				//同花五牌
          {
            switch(this.area)
            {
              case "fj"://福建
              {
                var v= SubCompare(this,FirstAnalyseData,NextAnalyseData,5);

                if(v!=0)
                  return v;

                break;
              }
              case "sx":  //绍兴
              case "nb":  //宁波
              case "nh":
              case "sz":
              default :
              {
                //比较数值
                for(var i=0; i<5; ++i) {
                  var v = compare(this.GetCardLogicValue(bNextList[i]), this.GetCardLogicValue(bFirstList[i]));
                  if (v != 0)
                    return v;
                }
                break;
              }
            }


            //比较花色
            if (bCompareColor) 			//比较花色
            {
              var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
              return ret;
            }
            else
              return 0;
          }

          case ShiSanShuiType.CT_FIVE_THREE_DOUBLE:			//三条一对
          {
            var v= SubCompare(this,FirstAnalyseData,NextAnalyseData,3);
            
            if(v!=0)
              return v;
            else
            {
              //if (bCompareColor)//比较花色
              //{
              //  v= compare(bNextList[NextAnalyseData.bThreeFirst[0]].type, bFirstList[FirstAnalyseData.bThreeFirst[0]].type);
              //  if(v!=0)
              //  {
              //    return v;
              //  }
              //  else
              //  {
              //    return compare(bNextList[NextAnalyseData.bTwoFirst[0]].type, bFirstList[FirstAnalyseData.bTwoFirst[0]].type);
              //  }
              //}
              //else
                return 0;
            }
          }

          case ShiSanShuiType.CT_FIVE_FOUR_ONE:			//四带一张
          {
            var v= SubCompare(this,FirstAnalyseData,NextAnalyseData,4);
            
            if(v!=0)
              return v;
            else
            {
              if (bCompareColor) 			//比较花色
              {
                var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
                return ret;
              }
              else
                return 0;
            }
          }

          case ShiSanShuiType.CT_FIVE_STRAIGHT_FLUSH_FIRST_A://A在前同花顺
          case ShiSanShuiType.CT_FIVE_STRAIGHT_FLUSH_NO_A:		//没A同花顺牌
          case ShiSanShuiType.CT_FIVE_STRAIGHT_FLUSH_BACK_A: //A在后同花顺牌
          {
            //比较数值
            var v = compare(this.GetCardLogicValue(bNextList[1]), this.GetCardLogicValue(bFirstList[1]));
            if (v == 0) {
              if (bCompareColor)
                return compare(bNextList[0].type, bFirstList[0].type);			//比较花色
              else
                return 0;
            }
            else
              return v;	//比较数值
          }

          default:
            logger.error("错误扑克类型！") ;
            return -1;
        }
      }
      else
      {
        if(this.wanFa==3)
        {
          if(bNextType==ShiSanShuiType.CT_FIVE_FOUR_ONE)
          {
            bNextType=13.1;
          }

          if(bFirstType==ShiSanShuiType.CT_FIVE_FOUR_ONE)
          {
            bFirstType=13.1;
          }
        }
        return compare(bNextType, bFirstType);
      }
    }
  }
  else  // 自己手上的某两段之间比
  {
    //开始对比
    if(bNextType==bFirstType)
    {
      switch(bFirstType)
      {
        case ShiSanShuiType.CT_SINGLE:				//单牌类型
        {
          var len  = bNextList.length > bFirstList.length ? bFirstList.length : bNextList.length;
          var bAllSame=true ;

          for(var i=0 ; i<len ; ++i)
            if(this.GetCardLogicValue(bNextList[i]) != this.GetCardLogicValue(bFirstList[i]))
            {
              bAllSame = false;
              break;
            }

          if(true==bAllSame) {
            if (bNextList.length != bFirstList.length)
              return compare(bNextList.length, bFirstList.length);

            if (bCompareColor) 			//比较花色
            {
              var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
              return ret;
            }
            else
              return 0;
          }
          else
          {
            for(var i=0 ; i<len ; ++i) {
              var v = compare(this.GetCardLogicValue(bNextList[i]), this.GetCardLogicValue(bFirstList[i]));
              if (v != 0)
                return v;
            }
          }

          return compare(bNextList.length, bFirstList.length);

        }
        case ShiSanShuiType.CT_ONE_DOUBLE:			//对带一张
        {
          var v = compare(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]]), this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]));
          if (v == 0)
          {
            v = compare(this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]]), this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]));
            if (v != 0)
              return v;

            if (bCompareColor) 			//比较花色
            {
              var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
              return ret;
            }
            else
              return 0;
          }
          else
            return v; 	//比较数值

          return compare(bNextList.length, bFirstList.length);
        }
        case ShiSanShuiType.CT_FIVE_TWO_DOUBLE:	//两对牌型
        {
          var v = compare(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[0]]), this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[0]]));
          if (v == 0)
          {
            var v1 = compare(this.GetCardLogicValue(bNextList[NextAnalyseData.bTwoFirst[1]]), this.GetCardLogicValue(bFirstList[FirstAnalyseData.bTwoFirst[1]]));
            if (v1 == 0) {
              //对比单牌
              var v2 = compare(this.GetCardLogicValue(bNextList[NextAnalyseData.bOneFirst[0]]), this.GetCardLogicValue(bFirstList[FirstAnalyseData.bOneFirst[0]]));
              if (v2 != 0)
                return v2;

              if (bCompareColor) 			//比较花色
              {
                var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
                return ret;
              }
              else
                return 0;
            }
            else
              return v1; 	//比较数值
          }
          else
            return v; 	//比较数值
        }

        case ShiSanShuiType.CT_THREE:	//三张牌型
        {
          var v= SubCompare(this,FirstAnalyseData,NextAnalyseData,3);
          
          if(v!=0)
            return v;
          else
          {
            if (bCompareColor) 			//比较花色
            {
              var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
              return ret;
            }
            else
              return 0;
          }
        }
        case ShiSanShuiType.CT_FIVE_MIXED_FLUSH_FIRST_A: //A在前顺子
        case ShiSanShuiType.CT_FIVE_MIXED_FLUSH_NO_A:			//没A杂顺
        case ShiSanShuiType.CT_FIVE_MIXED_FLUSH_BACK_A:		//A在后顺子
        {
          var v = compare(this.GetCardLogicValue(bNextList[1]), this.GetCardLogicValue(bFirstList[1]));
          if (v == 0) {
            if (bCompareColor) 			//比较花色
            {
              var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
              return ret;
            }
            else
              return 0;
          }
          else
            return v;	//比较数值
        }
        case ShiSanShuiType.CT_FIVE_SAME: // 五张同牌
        {
          return compare(this.GetCardLogicValue(bNextList[0]), this.GetCardLogicValue(bFirstList[0]));
        }
        case ShiSanShuiType.CT_FIVE_FLUSH:				//同花五牌
        {
          switch(this.area)
          {
            case "fj"://福建
            {
              var v= SubCompare(this,FirstAnalyseData,NextAnalyseData,5);

              if(v!=0)
                return v;

              break;
            }
            case "sx":  //绍兴
            case "nb":  //宁波
            case "nh":
            case "sz":
            default :
            {
              //比较数值
              for(var i=0; i<5; ++i) {
                var v = compare(this.GetCardLogicValue(bNextList[i]), this.GetCardLogicValue(bFirstList[i]));
                if (v != 0)
                  return v;
              }
              break;
            }
          }

          //比较花色
          if (bCompareColor) 			//比较花色
          {
            var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
            return ret;
          }
          else
            return 0;
        }

        case ShiSanShuiType.CT_FIVE_THREE_DOUBLE:			//三条一对
        {
          var v= SubCompare(this,FirstAnalyseData,NextAnalyseData,3);
         
          if(v!=0)
            return v;
          else
          {
            //if (bCompareColor)//比较花色
            //{
            //  v= compare(bNextList[NextAnalyseData.bThreeFirst[0]].type, bFirstList[FirstAnalyseData.bThreeFirst[0]].type);
            //  if(v!=0)
            //  {
            //    return v;
            //  }
            //  else
            //  {
            //    return compare(bNextList[NextAnalyseData.bTwoFirst[0]].type, bFirstList[FirstAnalyseData.bTwoFirst[0]].type);
            //  }
            //}
            //else
              return 0;
          }
//          var v = compare(this.GetCardLogicValue(bNextList[NextAnalyseData.bThreeFirst[0]]), this.GetCardLogicValue(bFirstList[FirstAnalyseData.bThreeFirst[0]]));
//          if (v == 0) {
//            if (bCompareColor)//比较花色
//              return compare(bNextList[NextAnalyseData.bThreeFirst[0]].type, bFirstList[FirstAnalyseData.bThreeFirst[0]].type);
//            else
//              return 0;
//          }
//          else
//            return v; 	//比较数值
        }

        case ShiSanShuiType.CT_FIVE_FOUR_ONE:			//四带一张
        {
          var v= SubCompare(this,FirstAnalyseData,NextAnalyseData,4);
          if(v!=0)
            return v;
          else
          {
            if (bCompareColor) 			//比较花色
            {
              var ret= CompareSingle(FirstAnalyseData.bOneFirst,NextAnalyseData.bOneFirst);
              return ret;
            }
            else
              return 0;
          }
//          var v = compare(this.GetCardLogicValue(bNextList[NextAnalyseData.bFourFirst[0]]), this.GetCardLogicValue(bFirstList[FirstAnalyseData.bFourFirst[0]]));
//          if (v == 0) {
//            if (bCompareColor)
//              return compare(bNextList[NextAnalyseData.bFourFirst[0]].type, bFirstList[FirstAnalyseData.bFourFirst[0]].type);			//比较花色
//            else
//              return 0;
//          }
//          else
//            return v;	//比较数值

        }

        case ShiSanShuiType.CT_FIVE_STRAIGHT_FLUSH_FIRST_A://A在前同花顺
        case ShiSanShuiType.CT_FIVE_STRAIGHT_FLUSH_NO_A:		//没A同花顺牌
        case ShiSanShuiType.CT_FIVE_STRAIGHT_FLUSH_BACK_A:		//A在后同花顺牌
        {
          var v = compare(this.GetCardLogicValue(bNextList[1]), this.GetCardLogicValue(bFirstList[1]));
          if (v == 0) {
            if (bCompareColor)
              return compare(bNextList[0].type, bFirstList[0].type);			//比较花色
            else
              return 0;
          }
          else
            return v;	//比较数值
        }

        default:
          logger.error('错误扑克类型！');
          return -1;
      }
    }
    else
    {
      if(this.wanFa==3)
      {
        if(bNextType==ShiSanShuiType.CT_FIVE_FOUR_ONE)
        {
          bNextType=13.1;
        }

        if(bFirstType==ShiSanShuiType.CT_FIVE_FOUR_ONE)
        {
          bFirstType=13.1;
        }
      }
      return compare(bNextType, bFirstType);
    }
  }

  return -1;
};

//分析某段扑克
proto.AnalyseCardSegment = function(_bCardsData, analyseData) {
  var bCardsData = _bCardsData.concat();

  //变量定义
  var bSameCount = 1,
    bCardValueTemp = 0,
    bSameColorCount = 1,
    bFirstCardIndex = 0;	//记录下标

  var bLogicValue = this.GetCardLogicValue(bCardsData[0]);
  var bCardColor = bCardsData[0].type;

  //扑克分析
  for (var i=1;i<bCardsData.length;i++)
  {
    //获取扑克
    bCardValueTemp=this.GetCardLogicValue(bCardsData[i]);
    if (bCardValueTemp==bLogicValue) bSameCount++;

    //保存结果
    if ((bCardValueTemp!=bLogicValue)||(i==(bCardsData.length-1)))
    {
      switch (bSameCount)
      {
        case 1:		//一张
          break;
        case 2:		//两张
        {
          analyseData.bTwoFirst[analyseData.bTwoCount]	 = bFirstCardIndex ;
          analyseData.bTwoCount++ ;
          break;
        }
        case 3:		//三张
        {
          analyseData.bThreeFirst[analyseData.bThreeCount] = bFirstCardIndex ;
          analyseData.bThreeCount++ ;
          break;
        }
        case 4:		//四张
        {
          analyseData.bFourFirst[analyseData.bFourCount]   = bFirstCardIndex ;
          analyseData.bFourCount++ ;
          break;
        }
        case 5:  //五张
        {
          analyseData.bFiveFirst[analyseData.bFiveCount]   = bFirstCardIndex ;
          analyseData.bFiveCount++ ;
          break;
        }
        default:
          logger.error('AnalyseCardSegment', '错误扑克', bSameCount);
          break;
      }
    }

    //设置变量
    if (bCardValueTemp!=bLogicValue)
    {
      if(bSameCount==1)
      {
        if(i!=bCardsData.length-1)
        {
          analyseData.bOneFirst[analyseData.bOneCount]	= bFirstCardIndex ;
          analyseData.bOneCount++ ;
        }
        else
        {
          analyseData.bOneFirst[analyseData.bOneCount]	= bFirstCardIndex ;
          analyseData.bOneCount++ ;
          analyseData.bOneFirst[analyseData.bOneCount]	= i ;
          analyseData.bOneCount++ ;
        }
      }
      else
      {
        if(i==bCardsData.length-1)
        {
          analyseData.bOneFirst[analyseData.bOneCount]	= i ;
          analyseData.bOneCount++ ;
        }
      }
      bSameCount=1;
      bLogicValue=bCardValueTemp;
      bFirstCardIndex = i ;
    }
    if(bCardsData[i].type!=bCardColor)
      bSameColorCount = 1 ;
    else
      ++bSameColorCount ;
  }

  //是否同花
  analyseData.bStraight = (5==bSameColorCount) ? true : false;
};

//分析扑克手牌
proto.AnalyseCardAll = function(_bCardsData, analyseData) {
  this.CT_FIVE_SAME_REQ = 0;
  this.CT_FIVE_STRAIGHT_FLUSH_REQ = 0;
  this.CT_FIVE_FOUR_ONE_REQ = 0;
  this.CT_FIVE_THREE_DOUBLE_REQ = 0;
  this.CT_FIVE_FLUSH_REQ = 0;
  this.CT_FIVE_MIXED_FLUSH_REQ = 0;
  this.CT_THREE_REQ = 0;
  this.CT_FIVE_TWO_DOUBLE_REQ = 0;
  this.CT_FIVE_TWO_DOUBLE_REQ1 = 0;
  this.CT_ONE_DOUBLE_REQ = 0;

  var bCardsData = [];
  bCardsData = _bCardsData.concat();
  var cbCardCount = bCardsData.length;

  // 1, 先按顺序降序排列
  this.SortCardList(bCardsData, 'Descend');


  for (var i=0;i<cbCardCount;i++)  
  {
    //变量定义
    var cbSameCount=1;
    var cbLogicValue=this.GetCardLogicValue(bCardsData[i]);

    //搜索顺子
    var cbFlushCount = 1, cbPrevIndex = i;
    var tmpFlush = [bCardsData[cbPrevIndex]];
    for (var j = i + 1; j < cbCardCount; j++) {
      if (this.GetCardLogicValue(bCardsData[cbPrevIndex]) == this.GetCardLogicValue(bCardsData[j])) // 遇到重牌继续往后
        continue;

      if (this.GetCardLogicValue(bCardsData[cbPrevIndex]) - this.GetCardLogicValue(bCardsData[j]) == 1) {
        cbFlushCount++;
        tmpFlush.push(bCardsData[j]);
        if (cbFlushCount == 4 && this.GetCardLogicValue(bCardsData[j]) == 2 && this.GetCardLogicValue(bCardsData[0]) == 14) { // 5432A 特殊情况A为1
          tmpFlush.push(bCardsData[0]); //A
          var cbIndex = analyseData.bFiveMixedFlushCount++;

          if (cbIndex == 0)
            analyseData.bFiveMixedFlushData[cbIndex] = tmpFlush.concat();
          else {
            if (analyseData.bFiveMixedFlushData[0][0].value == 1) {
              analyseData.bFiveMixedFlushData.splice(1, 0, tmpFlush);
            } else {
              analyseData.bFiveMixedFlushData.splice(0, 0, tmpFlush);
            }
          }

          //logger.debug('A作顺子小牌');
          break;
        } else if (cbFlushCount == 5) {
          var cbIndex = analyseData.bFiveMixedFlushCount++;
          analyseData.bFiveMixedFlushData[cbIndex] = tmpFlush.concat();
          break;
        }
      } else {
        break;
      }

      cbPrevIndex = j; // 指向前一个不同大小的牌
    }

    //搜索同牌
    for (var j=i+1;j<cbCardCount;j++)
    {
      //获取扑克
      if (this.GetCardLogicValue(bCardsData[j])!=cbLogicValue) break;

      //设置变量
      cbSameCount++;
    }

    //设置结果
    switch (cbSameCount)
    {
      case 16:		//16张
      case 15:		//15张
      case 14:		//14张
      case 13:		//13张
      case 12:		//12张
      case 11:		//11张
      case 10:		//10张
      case 9:		//9张
      case 8:		//8张
      case 7:		//7张
      case 6:		//6张
     {
        var cbIndex=analyseData.bSixCount++;
        analyseData.bSixData[cbIndex] = [];
        analyseData.bSixData[cbIndex][0]=bCardsData[i];
        analyseData.bSixData[cbIndex][1]=bCardsData[i+1];
        analyseData.bSixData[cbIndex][2]=bCardsData[i+2];
        analyseData.bSixData[cbIndex][3]=bCardsData[i+3];
        analyseData.bSixData[cbIndex][4]=bCardsData[i+4];
        analyseData.bSixData[cbIndex][5]=bCardsData[i+5];
      }
      case 5:		//五张
      {
        var cbIndex=analyseData.bFiveCount++;
        analyseData.bFiveData[cbIndex] = [];
        analyseData.bFiveData[cbIndex][0]=bCardsData[i];
        analyseData.bFiveData[cbIndex][1]=bCardsData[i+1];
        analyseData.bFiveData[cbIndex][2]=bCardsData[i+2];
        analyseData.bFiveData[cbIndex][3]=bCardsData[i+3];
        analyseData.bFiveData[cbIndex][4]=bCardsData[i+4];
      }
      case 4:		//四张
      {
        var cbIndex=analyseData.bFourCount++;
        analyseData.bFourData[cbIndex] = [];
        analyseData.bFourData[cbIndex][0]=bCardsData[i];
        analyseData.bFourData[cbIndex][1]=bCardsData[i+1];
        analyseData.bFourData[cbIndex][2]=bCardsData[i+2];
        analyseData.bFourData[cbIndex][3]=bCardsData[i+3];
      }
      case 3:		//三张
      {
        var cbIndex=analyseData.bThreeCount++;
        analyseData.bThreeData[cbIndex] = [];
        analyseData.bThreeData[cbIndex][0]=bCardsData[i];
        analyseData.bThreeData[cbIndex][1]=bCardsData[i+1];
        analyseData.bThreeData[cbIndex][2]=bCardsData[i+2];
      }
      case 2:		//两张
      {
        var cbIndex=analyseData.bTwoCount++;
        analyseData.bTwoData[cbIndex] = [];
        analyseData.bTwoData[cbIndex][0]=bCardsData[i];
        analyseData.bTwoData[cbIndex][1]=bCardsData[i+1];
        break;
      }
      case 1:		//单张
      {
        var cbIndex=analyseData.bOneCount++;
        analyseData.bOneData[cbIndex*cbSameCount]=bCardsData[i];
        break;
      }
    }


    var temPais=[];
    for(var idx=0;idx<cbSameCount;idx++)
    {
      temPais.push(bCardsData[i+idx]);
    }
    if(!analyseData.fPaiData[cbSameCount])
    {
      analyseData.fPaiData[cbSameCount]=[];
    }
    analyseData.fPaiData[cbSameCount].push(temPais);
    analyseData.fPaiCount[cbSameCount]=analyseData.fPaiData[cbSameCount].length;

    //设置索引
    i+=cbSameCount-1;
  }

  // 2, 再按颜色排列
  this.SortCardList(bCardsData, 'Color');

  for (var i=0;i<cbCardCount;i++) {
    var cbSameColorCount = 1;

    for (var j=i+1; j<cbCardCount; j++) {
      if (bCardsData[i].type != bCardsData[j].type) {
        if (cbSameColorCount >= 5) {
          var bStraightData = [];
          for (var k=0; k<cbSameColorCount; k++)
            bStraightData[k]=bCardsData[i+k];

          this.SortCardList(bStraightData, 'Descend');

          for (var k=0; k<cbSameColorCount; k++) {
            if (k <= cbSameColorCount-5) {
              var index = analyseData.bFiveFlushCount++; // 同花
              analyseData.bFiveFlushData[index] = bStraightData.slice(k, k+5);
            }

            //搜索顺子 分析同花顺
            var cbFlushCount = 1;
            var tmpFlush = [bStraightData[k]];
            for (var l = k + 1; l < cbSameColorCount; l++) {
              if (this.GetCardLogicValue(bStraightData[l-1]) == this.GetCardLogicValue(bStraightData[l])) // 遇到重牌继续往后
                continue;

              if (this.GetCardLogicValue(bStraightData[l-1]) - this.GetCardLogicValue(bStraightData[l]) == 1) {
                cbFlushCount++;
                tmpFlush.push(bStraightData[l]);
                if (cbFlushCount == 4 && this.GetCardLogicValue(bStraightData[l]) == 2 && this.GetCardLogicValue(bStraightData[0]) == 14) { // 5432A 特殊情况A为1
                  var cbIndex = analyseData.bFiveStraightFlushCount++;
                  tmpFlush.push(bStraightData[0]);//A

                  if (cbIndex == 0)
                    analyseData.bFiveStraightFlushData[cbIndex] = tmpFlush.concat();
                  else {
                    if (analyseData.bFiveStraightFlushData[0][0].value == 1) {
                      analyseData.bFiveStraightFlushData.splice(1, 0, tmpFlush);
                    } else {
                      analyseData.bFiveStraightFlushData.splice(0, 0, tmpFlush);
                    }
                  }
                  //logger.debug('A作同花顺小牌');
                  break;
                } else if (cbFlushCount == 5) {
                  var cbIndex = analyseData.bFiveStraightFlushCount++;
                  analyseData.bFiveStraightFlushData[cbIndex] = tmpFlush.concat();
                  break;
                }
              } else {
                break;
              }
            }
          }
        }

        break;
      }
      else {
        cbSameColorCount++;
        if (j == cbCardCount - 1 && cbSameColorCount >= 5) {
          var bStraightData = [];
          for (var k=0; k<cbSameColorCount; k++)
            bStraightData[k]=bCardsData[i+k];

          this.SortCardList(bStraightData, 'Descend');

          for (var k=0; k<cbSameColorCount; k++) {
            if (k <= cbSameColorCount-5) {
              var index = analyseData.bFiveFlushCount++; // 同花
              analyseData.bFiveFlushData[index] = bStraightData.slice(k, k+5);
            }

            //搜索顺子  分析同花顺
            var cbFlushCount = 1;
            var tmpFlush = [bStraightData[k]];
            for (var l = k + 1; l < cbSameColorCount; l++) {
              if (this.GetCardLogicValue(bStraightData[l-1]) == this.GetCardLogicValue(bStraightData[l])) // 遇到重牌继续往后
                continue;

              if (this.GetCardLogicValue(bStraightData[l-1]) - this.GetCardLogicValue(bStraightData[l]) == 1) {
                cbFlushCount++;
                tmpFlush.push(bStraightData[l]);
                if (cbFlushCount == 4 && this.GetCardLogicValue(bStraightData[l]) == 2 && this.GetCardLogicValue(bStraightData[0]) == 14) { // 5432A 特殊情况A为1
                  var cbIndex = analyseData.bFiveStraightFlushCount++;
                  tmpFlush.push(bStraightData[0]);//A
                  if (cbIndex == 0)
                    analyseData.bFiveStraightFlushData[cbIndex] = tmpFlush.concat();
                  else {
                    if (analyseData.bFiveStraightFlushData[0][0].value == 1) {
                      analyseData.bFiveStraightFlushData.splice(1, 0, tmpFlush);
                    } else {
                      analyseData.bFiveStraightFlushData.splice(0, 0, tmpFlush);
                    }
                  }
                  break;
                } else if (cbFlushCount == 5) {
                  var cbIndex = analyseData.bFiveStraightFlushCount++;
                  analyseData.bFiveStraightFlushData[cbIndex] = tmpFlush.concat();
                  break;
                }
              } else {
                break;
              }
            }
          }
        }
      }
    }

    //设置索引
    i+=cbSameColorCount-1;
  }
};

//查找所有类型的配型的数组
proto.FindAllTypeCards = function (_bCardsData, _analyseData) {
  var extTypes = [14, 11, 10, 4, 9, 8, 5, 3, 2, 1];//需要抓取的类型
  var extFiled = ["bFiveData", "bFiveStraightFlushData", "bFourData", "bThreeData"
    , "bThreeData", "bFiveFlushData", "bFiveMixedFlushData", "bTwoData", "bTwoData", "bOneData"];

  var analyseData = _analyseData;
  if (!analyseData)
    analyseData = new AnalyseData();

  this.AnalyseCardAll(_bCardsData, analyseData);
  //logger.debug("分析牌型:",analyseData);
  var lastRets = [];
  for (var tIdx = 0; tIdx < extTypes.length; tIdx++) {
    var _data = analyseData[extFiled[tIdx]];
    if (_data == undefined) {
      logger.error("字段", extFiled[tIdx], tIdx);
    }
    if (_data.length > 0) {
      for (var temIdx = 0; temIdx < _data.length; temIdx++) {
        var cards = this._getCards(_bCardsData, analyseData, extTypes[tIdx]);
        if (cards == null || cards.length != 5) break;
        var type = this.GetCardType(cards, analyseData);
        var extend = 0;
        if (type >= 10) {
          extend += 100;
        }

        var tem = {
          cards: cards,
          type: type,
          extend: extend
        }
        lastRets.push(tem);
      }
    }
  }
  lastRets.sort(function (a, b) {
    return b.type - a.type;
  });
  //logger.debug("FindAllTypeCards:", _bCardsData);
 // logger.debug("FindAllTypeCards 排序:", lastRets);

  return lastRets;
}

//查找头道所有类型的配型的数组
proto.FindThreeTypeCards = function (_bCardsData) {
  if (!_bCardsData || _bCardsData.length < 3) {
    logger.error("参数错误");
    return [];
  }

  var bCardsData = _bCardsData.concat();
  var extTypes = [4, 2, 1];//需要抓取的类型
  var extFiled = ["bThreeData", "bTwoData", "bOneData"];
  var lastRets = [];
  if (bCardsData.length == 3) {
    var type = this.GetCardType(bCardsData);
    var extend = 0;
    if (type == 4) {
      extend += 100;
    }
    var tem = {
      cards: bCardsData,
      type: type,
      extend: extend
    }
    lastRets.push(tem);

    return lastRets;
  }
  var analyseData = new AnalyseData();

  this.AnalyseCardAll(bCardsData, analyseData);
  //logger.debug("3分析牌型:",analyseData);

  for (var tIdx = 0; tIdx < extTypes.length; tIdx++) {
    var _data = analyseData[extFiled[tIdx]];
    if (_data == undefined) {
      logger.error("字段", extFiled[tIdx], tIdx);
    }
    if (_data.length > 0) {
      for (var temIdx = 0; temIdx < _data.length; temIdx++) {
        var cards = this._getThreeCards(bCardsData, analyseData, extTypes[tIdx]);
        if (cards == null || cards.length != 3) break;
        var type = this.GetCardType(cards);
        var extend = 0;
        if (type == 4) {
          extend += 100;
        }

        var tem = {
          cards: cards,
          type: type,
          extend: extend
        }
        lastRets.push(tem);
      }
    }
  }
  lastRets.sort(function (a, b) {
    return b.type - a.type;
  });
  //logger.debug("FindThreeTypeCards:", _bCardsData);
  //logger.debug("FindThreeTypeCards 排序:", lastRets);


  return lastRets;
}
//找出最大的6组牌型
proto.AutomaticOutCard2 = function (_bCardsData, num) {
  var analyseData = new AnalyseData();
  var lastRets = this.FindAllTypeCards(_bCardsData, analyseData);

  var Segment = {};
  var temNum=num;
  if(temNum<10)
    temNum=10;
  for (var rIdx = 0; rIdx < lastRets.length; rIdx++) {
    logger.debug("last111:",lastRets[rIdx],rIdx);
    var _bLeftCardsData = this._getLeftCard(_bCardsData, lastRets[rIdx].cards, 0);

    var midRets = this.FindAllTypeCards(_bLeftCardsData);

    for (var tmIdx = 0; tmIdx < midRets.length; tmIdx++) {
    //  logger.debug("mid111:",midRets[tmIdx],tmIdx);
      var front = this._getLeftCard(_bLeftCardsData, midRets[tmIdx].cards, 0);
      if (front.length != 3 && front.length != 6) {
        logger.debug("front牌", front);
        logger.debug("mid牌", midRets[tmIdx]);
        logger.debug("last牌", lastRets[rIdx]);
        logger.debug("_bLeftCardsData", _bLeftCardsData);
      }
      var frontRets = this.FindThreeTypeCards(front);
      for (var fIdx = 0; fIdx < frontRets.length; fIdx++) {
        if (this.CompareCard(midRets[tmIdx].cards, lastRets[rIdx].cards, false) == 1 && this.CompareCard(frontRets[fIdx].cards, midRets[tmIdx].cards, false) == 1) {
          //var frontType = this.GetCardType(front);
          //if (frontType == ShiSanShuiType.CT_THREE) {
          //  frontType += 100;
          //}
          var info = {
            front: frontRets[fIdx].cards,
            mid: midRets[tmIdx].cards,
            last: lastRets[rIdx].cards,
            types: [frontRets[fIdx].type, midRets[tmIdx].type, lastRets[rIdx].type],
            extends: [frontRets[fIdx].extend, midRets[tmIdx].extend, lastRets[rIdx].extend],
          }
          var typesum = info.types[0]*10000 + info.types[1]*100 + info.types[2];
          if (Segment[typesum] == undefined) {
            Segment[typesum] = info;
          }

          if (Object.keys(Segment).length == temNum)
            break;
        }
      }
      if (Object.keys(Segment).length == temNum)
        break;

    }

    if (Object.keys(Segment).length == temNum)
      break;
  }

  //logger.debug(":", segs);
  //if (analyseData.bThreeCount > 0) {
  logger.debug("头道 附加分判断");
  var frontRets = this.FindThreeTypeCards(_bCardsData);


  var treeSegment = {};
  for (var fIdx = 0; fIdx < frontRets.length; fIdx++) {
    var _bLeftCardsData = this._getLeftCard(_bCardsData, frontRets[fIdx].cards, 0);
    var lastRets = this.FindAllTypeCards(_bLeftCardsData);

    for (var lIdx = 0; lIdx < lastRets.length; lIdx++) {
      var midCards = this._getLeftCard(_bLeftCardsData, lastRets[lIdx].cards, 0);
      var midRets = this.FindAllTypeCards(midCards);
      for (var mIdx = 0; mIdx < midRets.length; mIdx++) {
        if (this.CompareCard(midRets[mIdx].cards, lastRets[lIdx].cards, false) == 1 && this.CompareCard(frontRets[fIdx].cards, midRets[mIdx].cards, false) == 1) {

          var info = {
            front: frontRets[fIdx].cards,
            mid: midRets[mIdx].cards,
            last: lastRets[lIdx].cards,
            types: [frontRets[fIdx].type, midRets[mIdx].type, lastRets[lIdx].type],
            extends: [frontRets[fIdx].extend, midRets[mIdx].extend, lastRets[lIdx].extend]
          }
          var typesum = info.types[0]*10000 + info.types[1]*100 + info.types[2];
          if (treeSegment[typesum] == undefined) {
            treeSegment[typesum] = info;

          }

          if (Object.keys(treeSegment).length == temNum)
            break;
        }
      }
      if (Object.keys(treeSegment).length == temNum)
        break;
    }
    if (Object.keys(treeSegment).length == temNum)
      break;
  }


  //}
  var segs = [];
  for (var tem in Segment) {
    segs.push(Segment[tem]);
  }

  segs.sort(function (a, b) {
    return (b.types[0] + b.types[1] + b.types[2] + b.extends[0] + b.extends[1] + b.extends[2]) - (a.types[0] + a.types[1] + a.types[2] + a.extends[0] + a.extends[1] + a.extends[2])
  });

  logger.debug("五张牌的", segs);
  var treesegs = [];
  for (var tem in treeSegment) {
    treesegs.push(treeSegment[tem]);
  }
  treesegs.sort(function (a, b) {
    return (b.types[0] + b.types[1] + b.types[2] + b.extends[0] + b.extends[1] + b.extends[2]) - (a.types[0] + a.types[1] + a.types[2] + a.extends[0] + a.extends[1] + a.extends[2])
  });
  logger.debug("三张牌的", treesegs);

  var temSegs = {};
  var rets = [];
  var threeIdx = 0;
  var segIdx = 0;
  var segEnd = false;  //已经查找完了
  var threeEnd = false;
  for (var idx = 0; idx < num; idx++) {
    if ((idx % 2 == 0 && !segEnd) || threeEnd) {
      var isAdd = false;
      while (!isAdd) {
        if (!segs[segIdx]) {
          segEnd = true;
          break;
        }
        var typesum = segs[segIdx].types[0]*10000 + segs[segIdx].types[1]*100 + segs[segIdx].types[2];
        if (temSegs[typesum] == undefined) {

          isAdd = true;
          temSegs[typesum] = segs[segIdx];
          rets.push(segs[segIdx]);
          //logger.debug("添加11：",segs[segIdx],segEnd)
          segIdx++;
        }
        else {
          segIdx++;
        }
      }
    }
    else if (!threeEnd) {
      var isAdd = false;
      while (!isAdd && !threeEnd) {
        if (!treesegs[threeIdx]) {
          threeEnd = true;
          break;
        }
        var typesum = treesegs[threeIdx].types[0]*10000 + treesegs[threeIdx].types[1]*100 + treesegs[threeIdx].types[2];
        if (temSegs[typesum] == undefined) {

          isAdd = true;
          temSegs[typesum] = treesegs[threeIdx];
          rets.push(treesegs[threeIdx]);
          //logger.debug("添加22：",treesegs[threeIdx],threeEnd)
          threeIdx++;
        }
        else {
          threeIdx++;
        }

      }

      //if(threeEnd)
      //{
      //    num++;
      //}
    }


  }
  rets.sort(function (a, b) {
    return (b.types[0] + b.types[1] + b.types[2] + b.extends[0] + b.extends[1] + b.extends[2]) - (a.types[0] + a.types[1] + a.types[2] + a.extends[0] + a.extends[1] + a.extends[2])
  });
  logger.debug("类型:", rets);

  // rets.splice(num, rets.length - num);
  return rets;
}

// 自动组牌,给出十种正确方案并按权重排序,用于机器人或者离线玩家
proto.AutomaticOutCard = function (_bCardsData) {
  var bCardsData = [];
  bCardsData = _bCardsData.concat();

  var SEARCHE_COUNT = 10 ; // 组牌方案数
  if(bCardsData.length<13 || bCardsData.length>16) {
    logger.error('AutomaticOutCard', '牌数错误', bCardsData.length);
    return null;
  }

  var bAllSegmentCardIndex = [
    [[0,0,0],[0,0,0,0,0],[0,0,0,0,0], [0,0,0]],  // 前三个数组是三段牌的下标, 最后一个数组是每段牌的权重
    [[0,0,0],[0,0,0,0,0],[0,0,0,0,0], [0,0,0]],
    [[0,0,0],[0,0,0,0,0],[0,0,0,0,0], [0,0,0]],
    [[0,0,0],[0,0,0,0,0],[0,0,0,0,0], [0,0,0]],
    [[0,0,0],[0,0,0,0,0],[0,0,0,0,0], [0,0,0]],
    [[0,0,0],[0,0,0,0,0],[0,0,0,0,0], [0,0,0]],
    [[0,0,0],[0,0,0,0,0],[0,0,0,0,0], [0,0,0]],
    [[0,0,0],[0,0,0,0,0],[0,0,0,0,0], [0,0,0]],
    [[0,0,0],[0,0,0,0,0],[0,0,0,0,0], [0,0,0]],
    [[0,0,0],[0,0,0,0,0],[0,0,0,0,0], [0,0,0]]
  ];			//分段扑克
  var bCardDataIndex = [0,1,2,3,4,5,6,7,8,9,10,11,12] ;	//扑克下标
  var bFrontCardType ,										//前墩类型
      bMidCardType,											//中墩类型
      bBackCardType;											//后墩类型
  var bFrontCardsData = [] ;
  var bMidCardsData = [] ;
  var bBackCardsData = [] ;

  var random = function (min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };


  var rand = function () {
    return random(0, 10000);
  };

  var  bSegCount=0 ;
  var bSearchCount = 0 ;
  var bStop = false ;
  while(false==bStop)
  {
    ++bSearchCount ;
    var bCardIndex=0 ;										//扑克下标
    //前墩扑克
    for(var bFrontCard=0 ; bFrontCard<3 ; ++bFrontCard)
    {
      bCardIndex = rand()%(13-bFrontCard) ;
      bAllSegmentCardIndex[bSegCount][0][bFrontCard] = bCardDataIndex[bCardIndex] ;
      bFrontCardsData[bFrontCard] = bCardsData[bCardDataIndex[bCardIndex]] ;
      bCardDataIndex[bCardIndex] = bCardDataIndex[13-bFrontCard-1] ;
    }

    this.SortCardList(bFrontCardsData, 'Descend') ;
    bFrontCardType = this.GetCardType(bFrontCardsData) ;

    //中墩扑克
    for(var bMidCard=0 ; bMidCard<5 ; ++bMidCard)
    {
      bCardIndex = rand()%(10-bMidCard) ;
      bAllSegmentCardIndex[bSegCount][1][bMidCard] = bCardDataIndex[bCardIndex] ;
      bMidCardsData[bMidCard] = bCardsData[bCardDataIndex[bCardIndex]] ;
      bCardDataIndex[bCardIndex] = bCardDataIndex[10-bMidCard-1] ;
    }

    this.SortCardList(bMidCardsData, 'Descend') ;
    bMidCardType = this.GetCardType(bMidCardsData) ;

    //后墩扑克
    for(var bBackCard=0 ; bBackCard<5 ; ++bBackCard)
    {
      bAllSegmentCardIndex[bSegCount][2][bBackCard] = bCardDataIndex[bBackCard] ;
      bBackCardsData[bBackCard] = bCardsData[bCardDataIndex[bBackCard]] ;
    }
    this.SortCardList(bBackCardsData , 'Descend') ;
    bBackCardType = this.GetCardType(bBackCardsData) ;

    if(this.CompareCard(bMidCardsData,bBackCardsData,false)==1 &&this.CompareCard(bFrontCardsData,bMidCardsData,false)==1)
    {
      bAllSegmentCardIndex[bSegCount][3][0] = bFrontCardType;
      bAllSegmentCardIndex[bSegCount][3][1] = bMidCardType;
      bAllSegmentCardIndex[bSegCount][3][2] = bBackCardType;
      bSegCount++;
    }

    //恢复数据
    for(var i=0 ; i<13 ; ++i)
      bCardDataIndex[i] = i ;

    //停止搜索
    if(bSegCount>=SEARCHE_COUNT || bSearchCount>=10000)
      bStop = true ;
    //搜到一个
    if(true==bStop && 0==bSegCount)
      bStop = false ;

    //搜索不到
    if(bSearchCount>=100000)
    {
      var bIndex=0 ;
      for(var i=0 ; i<3 ; ++i)
        for(var j=0 ; j<5 ; ++j)
        {
          if(i==0 && j==2) break;
          bAllSegmentCardIndex[0][i][j]=bIndex++ ;
        }
      bStop = true ;
      break;
    }
  }
  logger.debug("bSearchCount:"+bSearchCount);
  //去掉相同牌型
  var _bAllSegmentCardIndex = [];
  var tmp = {};
  for (var i=0; i<bAllSegmentCardIndex.length; i++) {
    if (tmp[bAllSegmentCardIndex[i][3][0] + '' + bAllSegmentCardIndex[i][3][1] + '' + bAllSegmentCardIndex[i][3][2]] == undefined) {
      tmp[bAllSegmentCardIndex[i][3][0] + '' + bAllSegmentCardIndex[i][3][1] + '' + bAllSegmentCardIndex[i][3][2]] = bAllSegmentCardIndex[i];
      _bAllSegmentCardIndex.push(bAllSegmentCardIndex[i]);
    }
  }

  //按牌型权重牌型
  _bAllSegmentCardIndex.sort(function (b, a) {
    return (a[3][0]+a[3][1]+a[3][2]) - (b[3][0]+b[3][1]+b[3][2]);
  });

  //for (var i=0; i<_bAllSegmentCardIndex.length; i++) {
  //  logger.debug('前段:')
  //  for (var j=0; j<3; j++)
  //    logger.debug(_bCardsData[_bAllSegmentCardIndex[i][0][j]]);
  //  logger.debug('牌型', _bAllSegmentCardIndex[i][3][0]);
  //  logger.debug('中段:')
  //  for (var j=0; j<5; j++)
  //    logger.debug(_bCardsData[_bAllSegmentCardIndex[i][1][j]]);
  //  logger.debug('牌型', _bAllSegmentCardIndex[i][3][1]);
  //  logger.debug('后段:')
  //  for (var j=0; j<5; j++)
  //    logger.debug(_bCardsData[_bAllSegmentCardIndex[i][2][j]]);
  //  logger.debug('牌型', _bAllSegmentCardIndex[i][3][2]);
  //}

  return _bAllSegmentCardIndex;
};
//转换 自动配牌
proto.transfomAuto = function(_bAllSegmentCardIndex,_bCardsData)
{
  if(!_bAllSegmentCardIndex || !_bCardsData){logger.error("数据为空，转换失败");return null;}
  var trans=[];
  for (var i=0; i<_bAllSegmentCardIndex.length; i++) {
    var info={
      front:[],
      mid:[],
      last:[],
      types:[]
    }
    for (var j=0; j<3; j++)
      info.front.push(_bCardsData[_bAllSegmentCardIndex[i][0][j]]);


    for (var j=0; j<5; j++)
      info.mid.push(_bCardsData[_bAllSegmentCardIndex[i][1][j]]);


    for (var j=0; j<5; j++)
      info.last.push(_bCardsData[_bAllSegmentCardIndex[i][2][j]]);

    for (var j=0; j<3; j++)
      info.types.push(_bAllSegmentCardIndex[i][3][j]);

    trans.push(info);
  }


  return trans;
}


proto.CT_FIVE_SAME_REQ = 0;
proto.CT_FIVE_STRAIGHT_FLUSH_REQ = 0;
proto.CT_FIVE_FOUR_ONE_REQ = 0;
proto.CT_FIVE_THREE_DOUBLE_REQ = 0;
proto.CT_FIVE_FLUSH_REQ = 0;
proto.CT_FIVE_MIXED_FLUSH_REQ = 0;
proto.CT_THREE_REQ = 0;
proto.CT_FIVE_TWO_DOUBLE_REQ = 0;
proto.CT_FIVE_TWO_DOUBLE_REQ1 = 0;
proto.CT_ONE_DOUBLE_REQ = 0;

// 从牌堆里面排除指定牌后剩下的牌
proto._getLeftCard = function (bCardsData, discardCards) {
  var _bCardsData = bCardsData.concat();
  this.SortCardList(_bCardsData, 'Ascend');

  for (var i=0; i<discardCards.length; i++) {
    for (var j=0; j<_bCardsData.length; j++) {
      if (discardCards[i].type == _bCardsData[j].type && discardCards[i].value == _bCardsData[j].value) {
        _bCardsData.splice(j, 1);
        break;
      }
    }
  }

  var cards = []; // 放单牌 排前面
  var tmp = []; // 放同牌 排后面
  for (var i=0; i<_bCardsData.length-1; i++) {
    if (tmp.length > 0 && _bCardsData[i].value == tmp[tmp.length-1].value) {
      tmp.push(_bCardsData[i]);
    } else if (_bCardsData[i].value != _bCardsData[i+1].value) {
      cards.push(_bCardsData[i]);
    } else {
      tmp.push(_bCardsData[i]);
    }
  }

  if (tmp.length > 0 && _bCardsData[_bCardsData.length-1].value == tmp[tmp.length-1].value)
    tmp.push(_bCardsData[_bCardsData.length-1]);
  else
    cards.push(_bCardsData[_bCardsData.length-1]);

  _bCardsData = cards.concat(tmp);
  return _bCardsData;
};

// 获取指定牌型的牌 type 要的牌型 内部方法
proto._getCards = function (bCardsData, analyseData, type) {
  switch (type) {
    case ShiSanShuiType.CT_FIVE_SAME:
    {
      this.CT_FIVE_SAME_REQ++;
      if (analyseData.bFiveCount > 0)
        return analyseData.bFiveData[(this.CT_FIVE_SAME_REQ-1)%analyseData.bFiveCount];
      else
        return null;
    }

    case ShiSanShuiType.CT_FIVE_STRAIGHT_FLUSH:
    {
      this.CT_FIVE_STRAIGHT_FLUSH_REQ++;
      if (analyseData.bFiveStraightFlushCount > 0)
        return analyseData.bFiveStraightFlushData[(this.CT_FIVE_STRAIGHT_FLUSH_REQ-1)%analyseData.bFiveStraightFlushCount];
      else
        return null;
    }

    case ShiSanShuiType.CT_FIVE_FOUR_ONE:
    {
      this.CT_FIVE_FOUR_ONE_REQ++;
      if (analyseData.bFourCount > 0) {
        var cards = [];

        cards = analyseData.bFourData[(this.CT_FIVE_FOUR_ONE_REQ-1) % analyseData.bFourCount].concat();
        var lefts = this._getLeftCard(bCardsData, cards, 1);
        cards.push(lefts[0]);
        return cards;
      } else
        return null;
    }

    case ShiSanShuiType.CT_FIVE_THREE_DOUBLE:
    {
      this.CT_FIVE_THREE_DOUBLE_REQ++;
      var cards = [];

      if (analyseData.bThreeCount > 0 && analyseData.bTwoCount > 0) {
        cards = analyseData.bThreeData[(this.CT_FIVE_THREE_DOUBLE_REQ-1)%analyseData.bThreeCount].concat();
        for (var i=analyseData.bTwoCount-1; i>=0; i--) {
          if (cards[0].value == analyseData.bTwoData[i][0].value) {
            i--;
            if (i>=0) {
              cards.push(analyseData.bTwoData[i][0]);
              cards.push(analyseData.bTwoData[i][1]);
            } else
              return null;
          } else {
            cards.push(analyseData.bTwoData[i][0]);
            cards.push(analyseData.bTwoData[i][1]);
          }
          break;
        }
        return cards;
      } else
        return null;
    }

    case ShiSanShuiType.CT_FIVE_FLUSH:
    {
      this.CT_FIVE_FLUSH_REQ++;
      if (analyseData.bFiveFlushCount > 0)
        return analyseData.bFiveFlushData[(this.CT_FIVE_FLUSH_REQ-1) % analyseData.bFiveFlushCount];
      else
        return null;
    }

    case ShiSanShuiType.CT_FIVE_MIXED_FLUSH:
    {
      this.CT_FIVE_MIXED_FLUSH_REQ++;
      if (analyseData.bFiveMixedFlushCount > 0)
        return analyseData.bFiveMixedFlushData[(this.CT_FIVE_MIXED_FLUSH_REQ-1) % analyseData.bFiveMixedFlushCount];
      else
        return null;
    }

    case ShiSanShuiType.CT_THREE:
    {
      this.CT_THREE_REQ++;
      if (analyseData.bThreeCount > 0) {
        var cards = [];
        cards = analyseData.bThreeData[(this.CT_THREE_REQ-1)%analyseData.bThreeCount].concat();
        var lefts = this._getLeftCard(bCardsData, cards, 2);
        cards.push(lefts[0]);
        cards.push(lefts[1]);
        return cards;
      } else
        return null;
    }

    case ShiSanShuiType.CT_FIVE_TWO_DOUBLE:
    {
      this.CT_FIVE_TWO_DOUBLE_REQ1++;
      if (this.CT_FIVE_TWO_DOUBLE_REQ1 >= analyseData.bTwoCount) {
        this.CT_FIVE_TWO_DOUBLE_REQ++;
        this.CT_FIVE_TWO_DOUBLE_REQ1 = this.CT_FIVE_TWO_DOUBLE_REQ+1;
      }
      if (this.CT_FIVE_TWO_DOUBLE_REQ1 == 0 || this.CT_FIVE_TWO_DOUBLE_REQ >= analyseData.bTwoCount-1) {
        this.CT_FIVE_TWO_DOUBLE_REQ = 0;
        this.CT_FIVE_TWO_DOUBLE_REQ1 = this.CT_FIVE_TWO_DOUBLE_REQ+1;
      }

      var cards = [];

      if (analyseData.bTwoCount > 1) {
        var i=this.CT_FIVE_TWO_DOUBLE_REQ;
        if (i<analyseData.bTwoCount) {
          var j=this.CT_FIVE_TWO_DOUBLE_REQ1;
          if (j<analyseData.bTwoCount) {
            cards.push(analyseData.bTwoData[i][0]);
            cards.push(analyseData.bTwoData[i][1]);
            cards.push(analyseData.bTwoData[j][0]);
            cards.push(analyseData.bTwoData[j][1]);

            var lefts = this._getLeftCard(bCardsData, cards, 1);
            cards.push(lefts[0]);
            return cards;
          }
        } else
          return null;
      } else
        return null;
    }

    case ShiSanShuiType.CT_ONE_DOUBLE:
    {
      this.CT_ONE_DOUBLE_REQ++;

      if (analyseData.bTwoCount > 0) {
        var cards = [];
        cards = analyseData.bTwoData[(this.CT_ONE_DOUBLE_REQ-1)%analyseData.bTwoCount].concat();
        if(bCardsData.length>=5)
        {
          var lefts = this._getLeftCard(bCardsData, cards, 3);
          cards.push(lefts[0]);
          cards.push(lefts[1]);
          cards.push(lefts[2]);
          return cards;
        }
        else if(bCardsData.length==3)
        {
          var lefts = this._getLeftCard(bCardsData, cards, 1);
          cards.push(lefts[0]);
          return cards;
        }
      } else
        return null;
    }

    case ShiSanShuiType.CT_SINGLE:
    {
      return analyseData.bOneData.slice(0, 5);
    }
  }
};


// 获取指定牌型的牌 type 要的牌型
proto.getCards = function (bCardsData, analyseData, type) {
  var result = {};
  result.popup = this._getCards(bCardsData, analyseData, type);
  if (result.popup == null)
    return null;


  result.all = bCardsData.concat();
  this.SortCardList(result.all, 'Descend');

  for (var j=0; j<result.all.length; j++)
    result.all[j].popup = false;

  for (var i=0; i<result.popup.length; i++) {
    var paiPop = result.popup[i];
    for (var j=0; j<result.all.length; j++) {
      var paiAll = result.all[j];

      if (paiPop.type == paiAll.type && paiPop.value == paiAll.value && !paiAll.popup) {
        paiAll.popup = true;
        break;
      }
    }
  }

  //logger.debug('获取牌:', type, result);

  return result;
};

// 获取指定牌型的牌 type 要的牌型 内部方法
proto._getThreeCards = function (bCardsData, analyseData, type) {
  switch (type) {
    case ShiSanShuiType.CT_THREE:
    {
      this.CT_THREE_REQ++;
      if (analyseData.bThreeCount > 0) {
        var cards = [];
        cards = analyseData.bThreeData[(this.CT_THREE_REQ-1)%analyseData.bThreeCount].concat();

        return cards;
      } else
        return null;
    }
    case ShiSanShuiType.CT_ONE_DOUBLE:
    {
      this.CT_ONE_DOUBLE_REQ++;

      if (analyseData.bTwoCount > 0) {
        var cards = [];
        cards = analyseData.bTwoData[(this.CT_ONE_DOUBLE_REQ-1)%analyseData.bTwoCount].concat();

        var lefts = this._getLeftCard(bCardsData, cards, 1);
        cards.push(lefts[0]);
        return cards;

      } else
        return null;
    }

    case ShiSanShuiType.CT_SINGLE:
    {
      return analyseData.bOneData.slice(0, 3);
    }
  }
};
//填充十三张牌
proto.fillShiSanCards = function(bCardsData,analyseData)
{
    var shiSanCards=analyseData.shiSanCards;
    //logger.debug(shiSanCards);
    if(bCardsData.length==13)
    {
        analyseData.shiSanCards=bCardsData;
        return;
    }

    if(shiSanCards.length<13)
    {
        var find=false;
        for(var idx in bCardsData)
        {
            find=false;
            for(var idx2 in shiSanCards)
            {
                //logger.debug("idx2："+idx2);
                if(bCardsData[idx].type==shiSanCards[idx2].type
                    && bCardsData[idx].value==shiSanCards[idx2].value)
                {
                    find=true;
                    break;
                }
            }

            if(find==false)
            {
                shiSanCards.push(bCardsData[idx]);
                if(shiSanCards.length==13)
                {
                    return;
                }
            }

        }

        if(shiSanCards.length<13)
        {
            logger.debug(bCardsData);
            logger.debug(shiSanCards);
            logger.error("运气这么好，这都能碰到");
            for(var idx=0;idx<13- shiSanCards.length;idx++)
            {
                shiSanCards.push(bCardsData[idx]);
            }
        }
    }



}

// 判断是否三顺子函数 不区分同花顺和普通顺
proto._check3ShunZi = function (bCardsData, tmps1, tmps2, isTont) {
  if(tmps1.length!=5 || tmps2.length!=5) return false;
  var bCardsData2 = bCardsData.concat();
  var found1 = false, found2 = false;

  for (var i = 0; i < tmps1.length; i++) {
    for (var j = 0; j < bCardsData2.length; j++) {
      if ((tmps1[i].type == bCardsData2[j].type || !isTont) && tmps1[i].value == bCardsData2[j].value) {
        bCardsData2.splice(j, 1);
        found1 = true;
        break;
      }
    }

    if (!found1)
      return false;
  }

  for (var i = 0; i < tmps2.length; i++) {
    for (var j = 0; j < bCardsData2.length; j++) {
      if ((tmps2[i].type == bCardsData2[j].type || !isTont) && tmps2[i].value == bCardsData2[j].value) {
        bCardsData2.splice(j, 1);
        found2 = true;
        break;
      }
    }

    if (!found1 || !found2)
      return false;
  }
  if (bCardsData.length - 10 == bCardsData2.length) {
//        logger.debug("顺子");
//        logger.debug(tmps1);
//        logger.debug(tmps2);
//        logger.debug(bCardsData2);

    this.SortCardList(bCardsData2, 'Descend');

    var sunCnt = 0;
    var isSame = 0;
    for (var idx = 1; idx < bCardsData2.length; idx++) {
      if (this.GetCardLogicValue(bCardsData2[idx - 1]) - this.GetCardLogicValue(bCardsData2[idx]) == 1) {
        sunCnt++;
        if (bCardsData2[idx - 1].type == bCardsData2[idx].type) {
          isSame++;
        }

      }
    }
    if (sunCnt >= 2) {
      if (!!isTont && isSame >= 2) {
        return true;
      }
      else if (!!isTont) {
        return false;
      }
      else
        return true;
    }

    if (bCardsData2[0].value == 1) {
      this.SortCardList(bCardsData2, 'Descend', "noLogic");
      sunCnt = 0;
      isSame = 0;
      for (var idx = 1; idx < bCardsData2.length; idx++) {
        if (bCardsData2[idx - 1].value - bCardsData2[idx].value == 1) {
          sunCnt++;
          if (bCardsData2[idx - 1].type == bCardsData2[idx].type) {
            isSame++;
          }
        }
      }
      if (sunCnt >= 2) {
        if (!!isTont && isSame >= 2) {
          return true;
        }
        else if (!!isTont) {
          return false;
        }
        else
          return true;
      }

    }
  }


  return false;
};
proto.CheckSpecial = function (_bCardsData, analyseData,wanFa) {

  if(_bCardsData.length<13) return ShiSanShuiType.CT_INVALID;

  logger.debug("当前玩法：%d",this.wanFa);
  var bCardsData = _bCardsData.concat();
  this.SortCardList(bCardsData, 'Descend');

  var ret = 0;

  // 是否全同花
  var allSameColor = false;
  var k = 1;
  for (k = 1; k < bCardsData.length; k++) {
    if (bCardsData[k].type != bCardsData[0].type)
      break;
  }

  if (k == bCardsData.length)
    allSameColor = true;

  // 判断一条龙
  for (k = 1; k < bCardsData.length; k++) {
    if (this.GetCardLogicValue(bCardsData[k - 1]) - this.GetCardLogicValue(bCardsData[k]) != 1)
      break;
  }
  if (k == bCardsData.length) {
    return allSameColor ? ShiSanShuiType.CT_SPECIAL_QINGLONG : ShiSanShuiType.CT_SPECIAL_YITIAOLONG;
  }


  // 判断四套三条、五刻两对
  // var left = [];
  // var flush3Count = 0;
  // var beginIndex = 0;
  // var _i = 0;
  // for (_i=1; _i<bCardsData.length; _i++) {
  //   if (this.GetCardLogicValue(bCardsData[_i]) != this.GetCardLogicValue(bCardsData[beginIndex])) {
  //     if (_i - beginIndex >= 3) {
  //       flush3Count++;
  //       beginIndex = _i;
  //     } else {
  //       left.push(bCardsData[beginIndex]);
  //       left.push(bCardsData[beginIndex+1]);
  //       beginIndex = _i;
  //     }
  //   } else if (_i == bCardsData.length - 1) {
  //     if (_i - beginIndex == 2) {
  //       flush3Count++;
  //     } else if (_i - beginIndex == 1) {
  //       left.push(bCardsData[beginIndex]);
  //       left.push(bCardsData[beginIndex+1]);
  //     }
  //   }
  // }
  //
  // if (flush3Count == 4)
  //   ret = ShiSanShuiType.CT_SPECIAL_SITAOSAN;
  // else if (flush3Count == 3) {
  //   if (left[0].value == left[1].value && left[2].value == left[3].value)
  //     ret = ShiSanShuiType.CT_SPECIAL_SANKELIANGDUI;
  // }
  var _getSameCount= function(cnt)
  {
    var count=0;
    for(var idx in analyseData.fPaiCount)
    {
      if(!analyseData.fPaiCount[idx] || idx<cnt) continue;
      var tem =Math.floor(idx/cnt);
      count+=tem*analyseData.fPaiCount[idx];
    }

    return count;
  }

  var totalTreeCount=_getSameCount(3);
  // 判断四套三条
  if (totalTreeCount >= 4)
    return ShiSanShuiType.CT_SPECIAL_SITAOSAN;



  if(this.wanFa!=3)  //全一色 没有的特殊牌
  {
    var totalFourCount=_getSameCount(4);

    // 判断三分天下
    if (totalFourCount >= 3)
      return ShiSanShuiType.CT_SPECIAL_SANFENTIANXIA;


    var totalFiveCount=_getSameCount(5);
    // 判断三皇五帝
    if (totalFiveCount >= 2) {
      var bCardsData1 = bCardsData.concat();

      for(var idx in analyseData.fPaiCount)
      {
        if(analyseData.fPaiCount[idx]<=0) continue;
        var tem =Math.floor(idx/5);
        if(tem==0) continue;

        for(var j=0;j<analyseData.fPaiData[idx].length;j++)
        {
          for (k = 0; k < bCardsData1.length; k++) {
            if (this.GetCardLogicValue(bCardsData1[k]) == this.GetCardLogicValue(analyseData.fPaiData[idx][j][0])) {
              bCardsData1.splice(k, 5*tem);
              break;
            }
          }
        }
      }

      if(bCardsData1.length!=3)
      {
        logger.error("三皇五帝，去掉五帝后应该只有三张牌了，数量不对");
      }
      if (this.GetCardLogicValue(bCardsData1[0]) == this.GetCardLogicValue(bCardsData1[1]) &&
        this.GetCardLogicValue(bCardsData1[1]) == this.GetCardLogicValue(bCardsData1[2]))
        return ShiSanShuiType.CT_SPECIAL_SANHUANGWUDI;
    }

    // 判断十二皇族
    var above10Num = 0;
    for (k = 0; k < bCardsData.length; k++) {
      if (this.GetCardLogicValue(bCardsData[k]) > 10)
        above10Num++;
    }
    if (above10Num >= 12) {
      return ShiSanShuiType.CT_SPECIAL_SHIERHUANGZU;
    }

    // 判断三同花顺
    if (analyseData.bFiveStraightFlushCount > 0) {
      for (var i = 0; i < analyseData.bFiveStraightFlushCount; i++) {
        for (var j = analyseData.bFiveStraightFlushCount - 1; j >= 0; j--) {
          if (this._check3ShunZi(bCardsData, analyseData.bFiveStraightFlushData[i], analyseData.bFiveStraightFlushData[j], "isTong")) {
            var tmp = analyseData.bFiveStraightFlushData[0];
            analyseData.bFiveStraightFlushData[0] = analyseData.bFiveStraightFlushData[i];
            analyseData.bFiveStraightFlushData[i] = tmp;
            tmp = analyseData.bFiveStraightFlushData[1];
            analyseData.bFiveStraightFlushData[1] = analyseData.bFiveStraightFlushData[j];
            analyseData.bFiveStraightFlushData[j] = tmp;

            return ShiSanShuiType.CT_SPECIAL_SANTONGHUASHUN;
          }
        }
      }
    }
  }



  // 判断全大
  var above7Num = 0;
  for (k = 0; k < bCardsData.length; k++) {
    if (this.GetCardLogicValue(bCardsData[k]) > 7)
      above7Num++;
  }
  if (above7Num == 13) {
    return ShiSanShuiType.CT_SPECIAL_ALLBIG;
  }

  // 判断全小
  var below9Num = 0;
  for (k = 0; k < bCardsData.length; k++) {
    if (this.GetCardLogicValue(bCardsData[k]) < 9)
      below9Num++;
  }
  if (below9Num == 13) {
    return ShiSanShuiType.CT_SPECIAL_ALLSMALL;
  }

  if(this.wanFa!=3)
  {
    // 是否凑一色
    var redColorNum = 0;
    var blackColorNum = 0;
    for (k = 0; k < bCardsData.length; k++) {
      var t1 = parseInt(bCardsData[k].type) % 2;
      if (t1 == 1)
        blackColorNum++;
      else if (t1 == 0)
        redColorNum++;
    }

    if (blackColorNum == 13 || redColorNum == 13) {
      if (ShiSanShuiType.CT_SPECIAL_REDBLACK > ret)
        return ShiSanShuiType.CT_SPECIAL_REDBLACK;
    } else if (redColorNum == 12 || blackColorNum == 12) {
      if (ShiSanShuiType.CT_SPECIAL_REDBLACKONE > ret)
        return ShiSanShuiType.CT_SPECIAL_REDBLACKONE;
    }

  }

  // 判断三刻两对
  if (totalTreeCount >= 3) {
    var bCardsData1 = bCardsData.concat();

    for(var idx in analyseData.fPaiCount)
    {
      if(analyseData.fPaiCount[idx]<=0) continue;
      var tem =Math.floor(idx/3);
      if(tem==0) continue;

      for(var j=0;j<analyseData.fPaiData[idx].length;j++)
      {
        for (k = 0; k < bCardsData1.length; k++) {
          if (this.GetCardLogicValue(bCardsData1[k]) == this.GetCardLogicValue(analyseData.fPaiData[idx][j][0])) {
            bCardsData1.splice(k, 3*tem);
            break;
          }
        }
      }

    }

    if(bCardsData1.length!=4)
    {
      logger.error("去掉牌后 判断三刻两对 牌的数量不对: ",bCardsData1);
    }
    if (this.GetCardLogicValue(bCardsData1[0]) == this.GetCardLogicValue(bCardsData1[1]) &&
        this.GetCardLogicValue(bCardsData1[2]) == this.GetCardLogicValue(bCardsData1[3]))
      return ShiSanShuiType.CT_SPECIAL_SANKELIANGDUI;
  }

  // 判断五对三条或六对半
  var doubleCount = 0;
  var beginIndex = 0;
  var singlePai = -1;
  _i = 1;
  for (_i = 1; _i < bCardsData.length; _i++) {
    if (this.GetCardLogicValue(bCardsData[_i]) == this.GetCardLogicValue(bCardsData[beginIndex])) {
      doubleCount++;
      _i++;
      beginIndex = _i;
    } else {
      singlePai = beginIndex;
      beginIndex = _i;
    }
  }
  if (doubleCount == 6) {
    if (beginIndex == 12)
      singlePai = 12;

    if(this.wanFa!=3)
    {
      if (singlePai >= 0) {
        for (_i = 2; _i < bCardsData.length; _i++) {
          if (this.GetCardLogicValue(bCardsData[_i]) == this.GetCardLogicValue(bCardsData[singlePai])
            && this.GetCardLogicValue(bCardsData[_i - 1]) == this.GetCardLogicValue(bCardsData[singlePai])
            && this.GetCardLogicValue(bCardsData[_i - 2]) == this.GetCardLogicValue(bCardsData[singlePai])) {
            return ShiSanShuiType.CT_SPECIAL_WUDUISAN;
          }
        }
      }
    }
    return ShiSanShuiType.CT_SPECIAL_LIUDUIBAN;
  }

  if(this.wanFa!=3)
  {
    // 判断三顺子
    if (analyseData.bFiveMixedFlushCount > 0) {
      for (var i = 0; i < analyseData.bFiveMixedFlushData.length; i++) {
        for (var j = analyseData.bFiveMixedFlushData.length - 1; j >= 0; j--) {
          if (this._check3ShunZi(bCardsData, analyseData.bFiveMixedFlushData[i], analyseData.bFiveMixedFlushData[j])) {
            var tmp = analyseData.bFiveMixedFlushData[0];
            analyseData.bFiveMixedFlushData[0] = analyseData.bFiveMixedFlushData[i];
            analyseData.bFiveMixedFlushData[i] = tmp;
            tmp = analyseData.bFiveMixedFlushData[1];
            analyseData.bFiveMixedFlushData[1] = analyseData.bFiveMixedFlushData[j];
            analyseData.bFiveMixedFlushData[j] = tmp;

            return ShiSanShuiType.CT_SPECIAL_SANSHUNZI;
          }
        }
      }
    }

    // 判断是否三同花
    var bCardsData2 = _bCardsData.concat();
    this.SortCardList(bCardsData2, 'Color');

    var colorCount = 1;
    var segCount = [];
    var beginIndex = 0;
    var n = 1;
    for (var i = 1; i < bCardsData2.length; i++) {
      if (bCardsData2[i].type != bCardsData2[beginIndex].type) {
        colorCount++;
        beginIndex = i;
        n = 1;
      } else {
        n++;
        segCount[colorCount - 1] = n;
      }
    }
    //if (colorCount == 3) {
    var ok = true;
    for (var i = 0; i < colorCount; i++) {
      if (segCount[i] != 3 && segCount[i] != 5 && segCount[i] != 8 && segCount[i] != 10 && segCount[i] != 13) // 有一个花色大于5张 其他花色牌数肯定不够5张或3张
        ok = false;

//            else if (segCount[i] < 3)
//                ok = false;
//            else if (segCount[i] == 4)
//                ok = false;
    }
    if (ok)
      return ShiSanShuiType.CT_SPECIAL_SANTONGHUA;
    //}
  }

  return ShiSanShuiType.CT_INVALID;
};


// 获取特殊牌型牌组
proto.GetSpecialCards = function (_bCardsData, analyseData, type) {

  var front = [];
  var mid = [];
  var end = [];

  var bCardsData = _bCardsData.concat();

  if (_bCardsData.length < 13) {
    logger.error("牌型错误:", _bCardsData);
    this.SortCardList(bCardsData, 'Ascend');
    return {'front': bCardsData.slice(0, 3), 'mid': bCardsData.slice(3, 8), 'end': bCardsData.slice(8, 13)};
  }
  if (!!analyseData.shiSanCards && analyseData.shiSanCards.length >= 13) {
    bCardsData = analyseData.shiSanCards.concat();
  }
  switch (type) {
    case ShiSanShuiType.CT_SPECIAL_SANTONGHUA:
      this.SortCardList(bCardsData, 'Color');
      if (bCardsData[2].type != bCardsData[3].type) { // 同色三张在最前面
        front = bCardsData.splice(0, 3);
        this.SortCardList(front, 'Descend');
        mid = bCardsData.splice(0, 5);
        this.SortCardList(mid, 'Descend');
        end = bCardsData.splice(0, 5);
        this.SortCardList(end, 'Descend');
      } else if (bCardsData[7].type != bCardsData[8].type) { // 同色三张在中间
        mid = bCardsData.splice(0, 5);
        this.SortCardList(mid, 'Descend');
        front = bCardsData.splice(0, 3);
        this.SortCardList(front, 'Descend');
        end = bCardsData.splice(0, 5);
        this.SortCardList(end, 'Descend');
      } else { // 同色三张在末尾
        mid = bCardsData.splice(0, 5);
        this.SortCardList(mid, 'Descend');
        end = bCardsData.splice(0, 5);
        this.SortCardList(end, 'Descend');
        front = bCardsData.splice(0, 3);
        this.SortCardList(front, 'Descend');
      }

      if (mid[0].value <= end[0].value)
        return {'front': front, 'mid': mid, 'end': end};
      else
        return {'front': front, 'mid': end, 'end': mid};

    case ShiSanShuiType.CT_SPECIAL_SANSHUNZI:
      for (var temI = 0; temI < analyseData.bFiveMixedFlushData.length; temI++) {
        var tembCardsData = bCardsData.concat();
        var temMid = analyseData.bFiveMixedFlushData[temI];
        mid = [];

        for (var i = 0; i < temMid.length; i++) {
          for (var j = 0; j < tembCardsData.length; j++) {
            if (temMid[i].value == tembCardsData[j].value) {
              mid.push(tembCardsData[j]);
              tembCardsData.splice(j, 1);
              break;
            }
          }
        }
        for (var tem = 0; tem < analyseData.bFiveMixedFlushData.length; tem++) {
          var temEnd = analyseData.bFiveMixedFlushData[tem];
          end = [];
          for (var i = 0; i < temEnd.length; i++) {

            for (var j = 0; j < tembCardsData.length; j++) {
              if (temEnd[i].value == tembCardsData[j].value) {

                end.push(tembCardsData[j]);
                tembCardsData.splice(j, 1);
                break;
              }
            }

          }
          if (end.length == 5) {
            break;
          }
        }

        if (end.length < 5) {
          logger.debug("找不到第二顺子");

          continue;
        }

        front[0] = tembCardsData[0];
        front[1] = tembCardsData[1];
        front[2] = tembCardsData[2];
        break;
      }
      if (front.length != 3 || mid.length != 5 || end.length != 5) {
        logger.error("没有找到三顺子");
        this.SortCardList(bCardsData, 'Ascend');
        return {'front': bCardsData.slice(0, 3), 'mid': bCardsData.slice(3, 8), 'end': bCardsData.slice(8, 13)};
      }

      if (mid[0].value <= end[0].value)
        return {'front': front, 'mid': mid, 'end': end};
      else
        return {'front': front, 'mid': end, 'end': mid};

    case ShiSanShuiType.CT_SPECIAL_SANTONGHUASHUN:

      for (var temI = 0; temI < analyseData.bFiveStraightFlushData.length; temI++) {
        var tembCardsData = bCardsData.concat();
        var temMid = analyseData.bFiveStraightFlushData[temI];

        mid = [];
        for (var i = 0; i < temMid.length; i++) {
          for (var j = 0; j < tembCardsData.length; j++) {
            if (this.IsSameCard(temMid[i], tembCardsData[j])) {
              mid.push(tembCardsData[j]);
              tembCardsData.splice(j, 1);
              break;
            }
          }
        }

        for (var tem = temI + 1; tem < analyseData.bFiveStraightFlushData.length; tem++) {

          var temEnd = analyseData.bFiveStraightFlushData[tem];
          end = [];
          for (var i = 0; i < temEnd.length; i++) {

            for (var j = 0; j < tembCardsData.length; j++) {
              if (this.IsSameCard(temEnd[i], tembCardsData[j])) {

                end.push(tembCardsData[j]);
                tembCardsData.splice(j, 1);
                break;
              }
            }

          }
          if (end.length == 5) {
            break;
          }
        }

        if (end.length < 5) {
          logger.debug("找不到第二顺子");
          continue;
        }

        front[0] = tembCardsData[0];
        front[1] = tembCardsData[1];
        front[2] = tembCardsData[2];
        break;
      }
      if (front.length != 3 || mid.length != 5 || end.length != 5) {
        logger.error("没有找到三顺子");
        this.SortCardList(bCardsData, 'Ascend');
        return {'front': bCardsData.slice(0, 3), 'mid': bCardsData.slice(3, 8), 'end': bCardsData.slice(8, 13)};
      }

      if (mid[0].value <= end[0].value)
        return {'front': front, 'mid': mid, 'end': end};
      else
        return {'front': front, 'mid': end, 'end': mid};
    //case ShiSanShuiType.CT_SPECIAL_SANHUANGWUDI:
    //{
    //  var mid = analyseData.bFiveData[0];
    //  var end = analyseData.bFiveData[1];
    //  var tembCardsData = bCardsData.concat();
    //  tembCardsData = this._getLeftCard(tembCardsData, mid);
    //  tembCardsData = this._getLeftCard(tembCardsData, end);
    //  if (tembCardsData.length != 3) {
    //    return {'front': bCardsData.slice(0, 3), 'mid': bCardsData.slice(3, 8), 'end': bCardsData.slice(8, 13)};
    //  }
    //  if (mid[0].value <= end[0].value)
    //    return {'front': tembCardsData, 'mid': mid, 'end': end};
    //  else
    //    return {'front': tembCardsData, 'mid': end, 'end': mid};
    //}
    default:
      this.SortCardList(bCardsData, 'Ascend');

      return {'front': bCardsData.slice(0, 3), 'mid': bCardsData.slice(3, 8), 'end': bCardsData.slice(8, 13)};
  }
};



// 特殊牌型比较
/*
 返回值:
 *  异常 -1
 *	bNextList=bFirstList:0
 *	bNextList>bFirstList:1
 *	bNextList<bFirstList:2
 */
proto.CompareSpecialCard = function(bInFirstList, analyseDataFirst, bInNextList, analyseDataNext) {
  var FirstAnalyseData = this.CheckSpecial(bInFirstList, analyseDataFirst);
  FirstAnalyseData = Math.floor(FirstAnalyseData/10);
  var NextAnalyseData = this.CheckSpecial(bInNextList, analyseDataNext);
  NextAnalyseData = Math.floor(NextAnalyseData/10);

  if (FirstAnalyseData == NextAnalyseData)
    return 0;
  else if (FirstAnalyseData < NextAnalyseData)
    return 1;
  else if (FirstAnalyseData > NextAnalyseData)
    return 2;
};
//排序玩家的手牌
proto.SortPlayerCards = function(_handPais)
{
  var hands=[];
  for(var idx=0;idx<_handPais.length;idx++)
  {
    logger.debug("原始牌：",_handPais[idx]);
    var rets=this.AutomaticOutCard2(_handPais[idx],3);
    rets[0].handPais=_handPais[idx];
    hands.push(rets[0]);
  }

  hands.sort(function(a,b){
    return (b.types[0] + b.types[1] + b.types[2] + b.extends[0] + b.extends[1] + b.extends[2]) - (a.types[0] + a.types[1] + a.types[2] + a.extends[0] + a.extends[1] + a.extends[2]);
  });
  logger.debug("排序结果",hands);
  var retHands=[];

  for(var idx=0;idx<hands.length;idx++)
  {
    retHands.push(hands[idx].handPais);
  }

  return retHands;
}