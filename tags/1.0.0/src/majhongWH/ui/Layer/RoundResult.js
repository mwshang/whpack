/**
 * Created by atom on 2016/8/21.
 */
var WHMJRoundResult = cc.Layer.extend({

    listview_result:null,
    btn_start:null,
    panel_cell:null,
    room:null,
    panel_bird:null,
    btn_end_report:null,
    btn_share:null,
    text_bird :null,
    ctor: function (data,jRoom) {
        this._super();
        this.room = jRoom;
        var root = ccs.load("res/MajhongWH/WuHanRoundResult.json").node;
        this.addChild(root);
        this.listview_result = ccui.helper.seekWidgetByName(root,"listview_result");
        //----------------
        //wmshang
        this.listview_result.setTouchEnabled(false)
        //
        this.panel_cell = ccui.helper.seekWidgetByName(root,"panel_cell");
        this.panel_cell.setVisible(false);
        this.btn_start = ccui.helper.seekWidgetByName(root,"btn_start");
        this.panel_bird = ccui.helper.seekWidgetByName(root,"panel_bird");
        this.btn_share = ccui.helper.seekWidgetByName(root,"btn_share");
        this.btn_share.addClickEventListener(function () {
             JJLog.print('share round report !');
            hall.net.wxShareScreen(0);
        }.bind(this));

        this.btn_start.addClickEventListener(function () {
            this.room.showReady();
            this.removeFromParent();
        }.bind(this));

        this.btn_end_report = ccui.helper.seekWidgetByName(root,"btn_end_report");
        this.btn_end_report.addClickEventListener(function () {
          this.removeFromParent();
          var endReport = new WHMJEndResult();
          var scene = new cc.Scene();
          scene.addChild(endReport);
          if(cc.sys.isNative)
          {
            cc.director.replaceScene(scene);
          }else
          {
            cc.director.runScene(scene);
          }

        }.bind(this));


        if(data['isOver'] == 0){
          this.btn_start.setVisible(true);
          this.btn_end_report.setVisible(false);
        }else if(data['isOver'] == 1)
        {
          this.btn_start.setVisible(false);
          this.btn_end_report.setVisible(true);
        }
        this.initList(data);

      if(data['roundResult'] == 0)
      {

          sound.playMusic('res/audio/effect/audio_liuju.mp3');
      }

      this.text_bird = ccui.helper.seekWidgetByName(root,"text_bird");
      var desc = whmajhong.table.getTableDes();

      desc = desc + " " + basecashdata.curBaseCashDesc;

      this.text_bird.setString(desc);
    },

    initList: function (data) {
        JJLog.print("结算="+JSON.stringify(data));
        var bankerId = data['banker'];
        var players = data['players'];
        var baseCash = parseFloat(data['baseScore']);//底金

        var huDiSocre = 1;//底分,平胡1,大胡10

        for(var i = 0; i < players.length;i++){
          if (players[i]['isHu'] > 0) {
            huDiSocre = parseInt(players[i]['huDiSocre']);
            break;
          }
        }

        for(var i = 0; i < players.length;i++)
        {
            var info = players[i];
            if(hall.user.uid == info['uid'])
            {
                if(info['isHu'] > 0)
                {
                  sound.playMusic('res/audio/effect/audio_win.mp3');
                }else
                {
                  sound.playMusic('res/audio/effect/audio_lose.mp3');
                }
            }



            var cell = this.panel_cell.clone();
            var layout = new ccui.Layout();
            layout.setContentSize(cell.getContentSize());


            var image_bank = ccui.helper.seekWidgetByName(cell,"image_bank");
            var sprite_bankerCount = ccui.helper.seekWidgetByName(cell,"sprite_bankerCount");
            var text_bankerCount  = ccui.helper.seekWidgetByName(cell,"text_bankerCount");
            if(info['uid'] == bankerId)
            {
                image_bank.setVisible(true);
                var bankerCount =data['bankerCount'];
                if(bankerCount > 1)
                {
                    sprite_bankerCount.setVisible(true);
                    text_bankerCount.setString(data['bankerCount']);
                }else
                {
                    sprite_bankerCount.setVisible(false);
                    text_bankerCount.setString("");
                }
            }else
            {
                image_bank.setVisible(false);
            }
            var text_name = ccui.helper.seekWidgetByName(cell,"text_name");
            var name = base64.decode(info['nickName']);
            if(name.length > 4)
            {
              name = name.slice(0,4);
                name += '..';
            }
            cell.x = 0;
            cell.y = 0;
            text_name.setString(name);

            var ScrollView_1 = ccui.helper.seekWidgetByName(cell,"ScrollView_1");
            var panel_card = ccui.helper.seekWidgetByName(cell,"panel_card");
            //var text_fan = ccui.helper.seekWidgetByName(cell,"text_fan");
            var panel_f = ccui.helper.seekWidgetByName(cell,"panel_peng");
            panel_f.setVisible(false);

            var svSize = ScrollView_1.getContentSize()            
            svSize.width = 0;
            
            var winScore = parseInt(info['winScore']);//总积分            
            // var winCash = baseCash * huDiSocre * winScore;
            var winCash = baseCash * winScore;
            var symbom = 1;

            if (winCash != 0) {
              symbom = winCash/Math.abs(winCash);
            }
            winCash = Math.abs(winCash) * symbom;
            winCash = winCash.toFixed(1);
            // console.log("symbom:" + symbom);
            // console.log("--->" + (diScore==0?1:diScore));
            // var finalScore = symbom * Math.floor(Math.abs(winScore)/(diScore==0?1:diScore)) * baseCash;

            var text_score = ccui.helper.seekWidgetByName(cell,"text_score");
            text_score.setString(winCash); // 增加底分显示逻辑 mwshang 2018.12.20
            text_score.setVisible(true);

            //var text_gangscore = ccui.helper.seekWidgetByName(cell,"text_gangscore");
            //text_gangscore.setString(info['gangScore']);

            var image_hu = ccui.helper.seekWidgetByName(cell,"image_hu");
            image_hu.setVisible(false);

            var text_win_type = ccui.helper.seekWidgetByName(cell,"text_win_type");
            text_win_type.setString("");
            if(info['isHu'] > 0)
            {
              image_hu.setVisible(true);
            }
            else
            {
               // text_win_type.setVisible(false);
            }

            var posNextX = 0;
            //origin  1暗杠  2 别人打的杠 3明杠 4固定杠 5赖子杠 pai为null表示自己摸牌
            //吃碰杠
            var funcArr = info['paiDest'];
            for(var k = 0 ; k < funcArr.length ; k++)
            {
                var funcInfo = funcArr[k];
                var funcType = funcInfo['type'];

                var panelC = panel_f.clone();
                panelC.setVisible(true);
                switch (funcType)
                {
                  case OPERATIONNAME.GANG:
                  {
                      if(true || funcInfo['origin'] < 4)
                      {
                          var cardObj = funcInfo['pai'];
                          for(var a = 0;a < 4;a++){
                              var card = new WHCardTip(cardObj);
                              var width = card.getContentSize().width;
                              card.x = (width-3)*a;
                              if(a == 3)
                              {
                                  card.x = (width-3)*1;
                                  card.y = 12;
                              }else
                              {
                                  if(funcInfo.origin ==  OPER_GANG_TYPE.GANG_AN) card.SetBack();
                                  card.x = (width-3)*a;
                                  card.y = 0;
                              }
                              panelC.addChild(card,a);  

                              if (card["jinType"] == CARD_JIN.YES) {
                                card.x = card.y = 0;
                                panelC.setContentSize(cc.size(width,panelC.getContentSize().height))
                                break;
                              }                            
                          }

                          panelC.setScale(WHCommonParam.ResultCardScale);
                          panelC.x = posNextX;
                          panelC.y = 0;
                          panel_card.addChild(panelC,0);
                          posNextX =  posNextX + panelC.getContentSize().width*WHCommonParam.ResultCardScale;
                      }
                  }
                    break;
                  case OPERATIONNAME.BUZHANG:
                  {
                      if(funcInfo['origin'] < 4)
                      {
                          var cardObj = funcInfo['pai'];
                          for(var a = 0;a < 4;a++){
                              var card = new WHCardTip(cardObj);
                              var width = card.getContentSize().width;
                              card.x = (width-3)*a;
                              if(a == 3)
                              {
                                  card.x = (width-3)*1;
                                  card.y = 22;
                              }else
                              {
                                  card.x = (width-3)*a;
                                  card.y = 0;
                              }
                              panelC.addChild(card,a);
                          }

                          panelC.setScale(WHCommonParam.ResultCardScale);
                          panelC.x = posNextX;
                          panelC.y = 0;
                          panel_card.addChild(panelC,0);
                          posNextX =  posNextX + panelC.getContentSize().width*WHCommonParam.ResultCardScale;
                      }

                  }
                    break;
                  case OPERATIONNAME.PENG:
                  {
                    var cardObj = funcInfo['pai'];
                    for(var a = 0;a < 3;a++){
                      var card = new WHCardTip(cardObj);
                      var width = card.getContentSize().width;
                      card.x = (width-3)*a;
                      card.y = 0;
                      panelC.addChild(card,a);
                    }
                      panelC.setScale(WHCommonParam.ResultCardScale);
                      panelC.x = posNextX;
                      panelC.y = 0;
                      panel_card.addChild(panelC,0);
                      posNextX =  posNextX + panelC.getContentSize().width*WHCommonParam.ResultCardScale;
                  }
                    break;
                  case OPERATIONNAME.CHI:
                  {
                    var cardArr = funcInfo['pai'];
                    for(var a = 0;a < cardArr.length;a++){
                      var card = new WHCardTip(cardArr[a]);
                      var width = card.getContentSize().width;
                      card.x = (width-3)*a;
                      card.y = 0;
                      panelC.addChild(card,a);
                    }
                      panelC.setScale(WHCommonParam.ResultCardScale);
                      panelC.x = posNextX;
                      panelC.y = 0;
                      panel_card.addChild(panelC,0);
                      posNextX =  posNextX + panelC.getContentSize().width*WHCommonParam.ResultCardScale;
                  }
                    break;
                }

            }

            var index = 0;
            //手牌
            for(var typeTag in info['qiPai'])
            {
                var arr = info['qiPai'][typeTag];
                for(var j = 0 ; j < arr.length;j++)
                {
                    var obj = arr[j];
                    var cardShow = new WHCardTip(obj);
                    cardShow.setScale(WHCommonParam.ResultCardScale);
                    cardShow.setAnchorPoint(0,0);
                    var width = cardShow.getContentSize().width;
                    cardShow.setPosition(posNextX,0);
                    posNextX = width*WHCommonParam.ResultCardScale + posNextX;
                    panel_card.addChild(cardShow,index);
                    index++;
                }
            }

            //胡牌
          posNextX += 10;

          var huStr = "";

          if(info["isHu"] > 0)
          {
              var huArr = new Array();
              if(info['huType'].length > 0)
              {
                  for(var b = 0; b < info['huType'].length ;b++)
                  {
                    huStr += (WuHanHuWord[info['huType'][b]['type']])+" ";

                    var paiInfoB = info['huType'][b]['pais'];
                    for(var c = 0; c < paiInfoB.length ;c++)
                    {
                      var added = false;
                      for(var d = 0 ; d < huArr.length;d++)
                      {
                        var parS = paiInfoB[c];
                        var strS = parS['type']+parS['value'];

                        var parT = huArr[d];
                        var strT = parT['type']+parT['value'];
                        if(strS == strT)
                        {
                          added = true;
                          break;
                        }
                      }
                      if(added) continue;

                      huArr.push(paiInfoB[c]);
                      var cardShow = new WHCardTip(paiInfoB[c]);
                      cardShow.setScale(WHCommonParam.ResultCardScale);
                      cardShow.setAnchorPoint(0,0);
                      var width = cardShow.getContentSize().width;
                      cardShow.setPosition(posNextX,0);
                      panel_card.addChild(cardShow,index);
                      posNextX = width*WHCommonParam.ResultCardScale + posNextX;
                      var size3 = cardShow.getContentSize();
                      var huImg = new ccui.ImageView('hudejiaobiao1.png',ccui.Widget.PLIST_TEXTURE);
                      cardShow.addChild(huImg);
                      huImg.setPosition(size3.width - huImg.getContentSize().width*0.5,
                        size3.height - huImg.getContentSize().height*0.5);

                        var niao = data['niao'];
                        if(niao != undefined && niao != null && niao.length > 0)
                        {
                            for(var x=0; x <niao.length ; x++)
                            {
                                var cardNiao = new WHCardTip(niao[x]);
                                cardNiao.setScale(WHCommonParam.ResultCardScale);
                                cardNiao.setAnchorPoint(0,0);
                                cardNiao.setPosition( posNextX + 20,0);
                                panel_card.addChild(cardNiao,index);
                            }
                        }

                        index++;
                    }
                  }
              }

              if(huStr.length > 0)
              {
                  if(info['isZimo'] == 1)
                  {
                      huStr+=' 自摸'
                  }

                  if(info['huDiSocre'] > 0)
                  {
                      huStr+=' 底分:'+info['huDiSocre']
                  }
                  if(info['fanShu'] >= 0)
                  {
                      huStr+=' 番分:'+info['fanShu']
                  }
                  if(info['isYingHu'] > 0)
                  {
                      huStr+=' 硬胡'
                  }
                  if(info['isYuanLai'] > 0)
                  {
                      huStr+=' 原赖番'
                  }
                  if(info['isFengLai'] > 0)
                  {
                      huStr+=' 风赖番'
                  }
                  if(info['isYiJiuLai'] > 0)
                  {
                      huStr+=' 一九赖番'
                  }
                  if(info['isLianJin'] > 0)
                  {
                      huStr+=' 连金'
                  }
                  if(info['isJinDing'] > 0)
                  {
                      huStr+=' 金顶'
                  }
                  text_win_type.setString(huStr);
                  text_win_type.setVisible(true);
              }
          }else
          {
              var str = "";
              if(info['fanShu'] >= 0)
              {
                  huStr+='番分:'+info['fanShu']
              }
              if(info['isKaiKou'] == 1)
              {
                  huStr+=' 开口'
              }else if (info['isKaiKou'] == 0)
              {
                  huStr+=' 不开口'
              }
              if(info['isFangPao'] > 0)
              {
                  huStr += str.length>0?'   放炮':' 放炮';
              }
              text_win_type.setString(huStr);
              text_win_type.setVisible(true);
          }

            panel_card.setScale(0.92);
            svSize.width = posNextX * 0.95;
            ScrollView_1.setInnerContainerSize(svSize);
            layout.addChild(cell);
            cell.setVisible(true);
            if(info["isHu"] > 0)
            {
                this.listview_result.insertCustomItem(layout,0);

            }else
            {
                this.listview_result.pushBackCustomItem(layout);
            }
        }
    },

    showResult: function () {
        this.setVisible(false);
        cc.director.getRunningScene().addChild(this,900);
       this.runAction(cc.sequence(cc.delayTime(1.0),cc.show()));
    },


});
