/**
 * Created by atom on 2016/8/21.
 */
var RoundResult = cc.Layer.extend({

    listview_result:null,
    btn_start:null,
    panel_cell:null,
    room:null,
    panel_bird:null,
    img_result_title:null,
    label_result_count :null,
    btn_end_report:null,
    btn_share:null,
    pinghuPos:null,
    dahuPos:null,
    ctor: function (data,jRoom) {
        this._super();
        this.room = jRoom;
        var root = ccs.load("res/MajhongBase/MajhongRoundResult.json").node;
        this.addChild(root);
        this.img_result_title = ccui.helper.seekWidgetByName(root,"img_result_title");
        this.label_result_count = ccui.helper.seekWidgetByName(root,"label_result_count");
        this.label_result_count.setString("");
        this.pinghuPos = ccui.helper.seekWidgetByName(root,"pinghuPos");
        this.dahuPos = ccui.helper.seekWidgetByName(root,"dahuPos");
        this.listview_result = ccui.helper.seekWidgetByName(root,"listview_result");
        this.panel_cell = ccui.helper.seekWidgetByName(root,"panel_cell");
        this.panel_cell.setVisible(false);
        this.btn_start = ccui.helper.seekWidgetByName(root,"btn_start");
        this.panel_bird = ccui.helper.seekWidgetByName(root,"panel_bird");
        this.btn_share = ccui.helper.seekWidgetByName(root,"btn_share");
        this.btn_share.addClickEventListener(function () {
             JJLog.print('share round report !');
            hall.net.wxShareScreen(0);
        }.bind(this));

        var _this = this;
        this.btn_start.addClickEventListener(function () {
            this.room.showReady();
            this.removeFromParent();
        }.bind(this));

        this.btn_end_report = ccui.helper.seekWidgetByName(root,"btn_end_report");
        this.btn_end_report.addClickEventListener(function () {
          this.removeFromParent();

            var endReport = new MajhongEndResult();
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
        this.img_result_title.loadTexture('liuju_title.png',ccui.Widget.PLIST_TEXTURE);
          this.img_result_title.setVisible(true);
          this.img_result_title.setPosition(this.pinghuPos.getPosition());
          sound.playMusic('res/sound/common/audio_liuju.mp3');
      }

        var text_bird = ccui.helper.seekWidgetByName(root,"text_bird");
        var str = majhong.table.getTableDes();

        text_bird.setString(str);
    },

    initList: function (data) {
        JJLog.print("结算="+JSON.stringify(data));
        var bankerId = data['banker'];

        var players = data['players'];
        for(var i = 0; i < players.length;i++)
        {
            var info = players[i];
            if(hall.user.uid == info['uid'])
            {
                if(info['isHu'] > 0)
                {
                    this.img_result_title.setVisible(true);
                  sound.playMusic('res/audio/effect/audio_win.mp3');
                }else
                {
                  sound.playMusic('res/audio/effect/audio_lose.mp3');
                    this.img_result_title.setVisible(true);
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


            var panel_card = ccui.helper.seekWidgetByName(cell,"panel_card");
            panel_card.setScale(0.89);
            var text_fan = ccui.helper.seekWidgetByName(cell,"text_fan");
            var panel_f = ccui.helper.seekWidgetByName(cell,"panel_peng");
            panel_f.setVisible(false);

            var text_score = ccui.helper.seekWidgetByName(cell,"text_score");
            text_score.setString(info['winScore']);
            text_score.setVisible(true);
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

            //吃碰杠
            var funcArr = info['paiDest']
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
                    var cardObj = funcInfo['pai'];
                    for(var a = 0;a < 4;a++){
                      var card = new CardTip(cardObj);
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
                    }
                  }
                    break;
                  case OPERATIONNAME.BUZHANG:
                  {
                    var cardObj = funcInfo['pai'];
                    for(var a = 0;a < 4;a++){
                      var card = new CardTip(cardObj);
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
                  }
                    break;
                  case OPERATIONNAME.PENG:
                  {
                    var cardObj = funcInfo['pai'];
                    for(var a = 0;a < 3;a++){
                      var card = new CardTip(cardObj);
                      var width = card.getContentSize().width;
                      card.x = (width-3)*a;
                      card.y = 0;
                      panelC.addChild(card,a);
                    }
                  }
                    break;
                  case OPERATIONNAME.CHI:
                  {
                    var cardArr = funcInfo['pai'];
                    for(var a = 0;a < cardArr.length;a++){
                      var card = new CardTip(cardArr[a]);
                      var width = card.getContentSize().width;
                      card.x = (width-3)*a;
                      card.y = 0;
                      panelC.addChild(card,a);
                    }
                  }
                    break;
                }
                panelC.setScale(CommonParam.ResultCardScale);
                panelC.x = posNextX;
                panelC.y = 0;
                panel_card.addChild(panelC,0);
                posNextX =  posNextX + panelC.getContentSize().width*panel_card.getScale();
            }

            var index = 0;
            //手牌
            for(var typeTag in info['qiPai'])
            {
                var arr = info['qiPai'][typeTag];
                for(var j = 0 ; j < arr.length;j++)
                {
                    var obj = arr[j];
                    var cardShow = new CardTip(obj);
                    cardShow.setScale(CommonParam.ResultCardScale);
                    cardShow.setAnchorPoint(0,0);
                    var width = cardShow.getContentSize().width;
                    cardShow.setPosition(posNextX,0);
                    posNextX = width*CommonParam.ResultCardScale + posNextX;
                    panel_card.addChild(cardShow,index);
                    index++;
                }
            }


            //胡牌
          posNextX += 10;

          var huStr = "";
          var huCountStr ="";
          var youjin = this.room.youjin;

          if(info["isHu"] > 0)
          {
          var huArr = new Array();
          if(info['huType'].length > 0)
          {
              for(var b = 0; b < info['huType'].length ;b++)
              {
                huStr += (QuanZhouHuWord[info['huType'][b]['type']]);
                  if(info['huType'][b]['type'] == 0)
                  {
                      this.img_result_title.setPosition(this.pinghuPos.getPosition());
                      huCountStr="";
                      if(info['isZimo'] == 1)
                      {
                          this.img_result_title.setPosition(this.dahuPos.getPosition());
                          huStr ='dahu_zimo.png';
                          huCountStr = "/2";
                      }
                  }else if(info['huType'][b]['type'] == 1)
                  {
                      huCountStr = "/"+youjin;
                  }
                  else if(info['huType'][b]['type'] == 2)
                  {
                      huCountStr = "/"+youjin*2;
                  }
                  else if(info['huType'][b]['type'] == 3)
                  {
                      huCountStr = "/"+youjin*3;
                  }
                  else if(info['huType'][b]['type'] == 4)
                  {
                      huCountStr = "/"+youjin;
                  }
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
                  var cardShow = new CardTip(paiInfoB[c]);
                  cardShow.setScale(CommonParam.ResultCardScale);
                  cardShow.setAnchorPoint(0,0);
                  var width = cardShow.getContentSize().width;
                  cardShow.setPosition(posNextX,0);
                  panel_card.addChild(cardShow,index);
                  posNextX = width*CommonParam.ResultCardScale + posNextX;
                  var size3 = cardShow.getContentSize();
                  var huImg = new ccui.ImageView('hudejiaobiao1.png',ccui.Widget.PLIST_TEXTURE);
                  cardShow.addChild(huImg);
                  huImg.setPosition(size3.width - huImg.getContentSize().width*0.5,
                    size3.height - huImg.getContentSize().height*0.5);

                  index++;
                }
              }
          }

              if(huStr.length > 0)
              {
                  this.img_result_title.loadTexture(huStr,ccui.Widget.PLIST_TEXTURE);
                  this.img_result_title.ignoreContentAdaptWithSize(true);
                  this.label_result_count.setString(huCountStr);
              }
          }
            //盘数
            var pans = info['pan'];
            var panCount = info['panCount'];
            var panStr = "";
            if(pans['jin'] > 0){panStr +="金牌"+pans['jin'] +"盘 "}
            if(pans['hua'] > 0){panStr +="花牌"+pans['hua'] +"盘 "}
            if(pans['kezi'] > 0){panStr +="刻子"+pans['kezi'] +"盘 "}
            if(pans['zi'] > 0){panStr +="字牌"+pans['zi'] +"盘 "}
            if(pans['mingGang'] > 0){panStr +="明杠"+pans['mingGang'] +"盘 "}
            if(pans['anGang'] > 0){panStr +="暗杠"+pans['anGang'] +"盘"}

            //panStr +="金牌"+pans['jin'] +"盘 ";
            //panStr +="花牌"+pans['hua'] +"盘 ";
            //panStr +="刻子"+pans['kezi'] +"盘 ";
            //panStr +="字牌"+pans['zi'] +"盘 ";
            //panStr +="明杠"+minggang +"盘 ";
            //panStr +="暗杠"+pans['anGang'] +"盘";

            if(panStr.length <= 0)
            {
                panStr = "无";
            }

            text_win_type.setString(panStr);
            text_fan.setString(panCount + "盘");

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
