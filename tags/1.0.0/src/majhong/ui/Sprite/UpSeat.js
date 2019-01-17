/**
 * Created by atom on 2016/8/21.
 */
var UpSeat = DeskSeat.extend({

    ctor: function (data) {
        this._super(data);
        this.root = ccs.load("res/MajhongBase/MajhongUperPanel.json").node;
        this.addChild(this.root);
        this.moCardGap = 10;
        this.gap_stand = 35;
	    if(MajhongInfo.MajhongNumber > 14)
        {
            this.gap_stand = 35*CommonParam.UP17CardStandScale;
            if(MajhongInfo.GameMode == GameMode.RECORD)
            {
                this.gap_stand = 33*CommonParam.UP17CardRecordScale;
            }
        }else if(MajhongInfo.GameMode == GameMode.RECORD)
        {
            this.gap_stand = 33;
        }

    },

  onEnter: function () {
    this._super();
    if(MajhongInfo.GameMode == GameMode.PLAY)
    {
      this.checkOffline();
    }else if(MajhongInfo.GameMode == GameMode.RECORD)
    {

    }

  },

  addCardIn: function (cardObj) {
    var card = new CardUpStand();
    var length = this.cardInArray.length;
    this.cardInArray.push(card);
    this.panel_cardIn.addChild(card,20 - length);
  },

  addCardOut:function(cardObj)
  {
      var length = this.cardOutArray.length;
      var index = length%CommonParam.DeskOneNum;
      var floor = Math.floor(length/CommonParam.DeskOneNum);
      var card = new CardUpDesk(cardObj,index);

      if(floor%2 == 1)
      {
          card.setScale(0.69);
          var ceng = Math.floor(floor/2);
          card.y = 35 + 14*ceng;
          floor = 1;
          var offx = -(card.getContentSize().width*card.getScaleX()*CommonParam.DownCardGap*index+17*floor-1*floor*CommonParam.DownCardGap*index)-10;
          if(index > 4) offx += 2*CommonParam.DownCardGap;
          card.x = offx+floor*card.getContentSize().width*0.08;
      }else
      {
          card.setScaleX(0.72);
          card.setScaleY(0.76);
          var ceng = floor/2;
          floor = 0;
          card.y = -3+ceng*14;
          var off = ceng;
          var offx = -(card.getContentSize().width*card.getScaleX()*CommonParam.DownCardGap*index)-10;
          if(index > 4) offx += 2*CommonParam.DownCardGap;
          card.x = offx+floor*card.getContentSize().width*0.08+off;
      }

      var order = [0,1,2,3,9,8,7,6,5,4];

      var ting = cardObj['ting'];
      if(ting != undefined && ting != null)
      {
          if(ting == 1)
          {
              card.showBlue();
          }
      }
    this.panel_cardOut.addChild(card,order[index]+(1-floor)*10);
    this.cardOutArray.push(card);
      return card;
  },

    onSyncPlayerTianHu: function (data) {
        //todo
        var dt = 0;
        if(this.uid == data['uid']) {
            var cards = data['msg']['cards'];
            for (var i = 0; i < cards.length; i++) {

                var pais = cards[i]['pais'];
                var type = cards[i]['type'];
                var len = pais.length;
                var w = 35;
                var paisWidth = w * len;


                var panel = this.panel_tianhu.clone();
                panel.setVisible(false);

                //action.gotoFrameAndPlay(0, 160, false);

                var panel_card = ccui.helper.seekWidgetByName(panel, "panel_card");
                panel_card.setCascadeOpacityEnabled(true);
                var panel_image = ccui.helper.seekWidgetByName(panel, "panel_image");

                var image_word1 = ccui.helper.seekWidgetByName(panel, "image_word");
                image_word1.setVisible(false);
                var image_word = new cc.Sprite('#'+DaHuRes[type]);
                image_word.setPosition(image_word1.getPosition());
                image_word1.getParent().addChild(image_word);
                panel.setPosition(this.panel_tianhu.getPosition());
                this.panel_root.addChild(panel);

                var panelWidth = panel_card.getContentSize().width;
                var startPos =  panelWidth -(panelWidth - paisWidth) / 2;
                for (var j = 0; j < pais.length; j++) {
                    var card = new CardUpShow(pais[j],j);
                    card.x = startPos - w * j -w;
                    card.y = 0;
                    panel_card.addChild(card, j);
                }

                var soundData = {};
                soundData['sexType'] = this.sexType;
                soundData['huType'] = type;

                image_word.setScale(2.0);
                image_word.runAction(cc.sequence(cc.delayTime(dt), cc.show(),
                    cc.callFunc(this.playTianhuSound.bind(soundData)),
                    cc.scaleTo(0.05, 1.0), cc.scaleTo(0.1, 1.2)
                    , cc.scaleTo(0.05, 1.0), cc.scaleTo(0.05, 1.1), cc.scaleTo(0.05, 1.0)
                    ,cc.delayTime(0.5),cc.fadeOut(0.2)
                ));
                panel_card.runAction(cc.sequence(cc.delayTime(dt),
                    cc.show(), cc.fadeIn(0.35), cc.delayTime(2)
                    , cc.fadeOut(0.3)));
                panel.runAction(cc.sequence(cc.delayTime(dt), cc.show(), cc.delayTime(2.6), cc.removeSelf()));
                dt += 3;
            }
        }
    },


    setHandCards: function (data) {
        this._super();
        var index = 0;
        this.panel_cardIn.removeAllChildren();
        var cardInSize = this.panel_cardIn.getContentSize();
        for(var i = 0 ; i < MajhongInfo.MajhongNumber - 1;i++){
            var card = new CardUpStand();
            card.setPosition(cardInSize.width-card.getContentSize().width - this.gap_stand*i,
                0);
            this.panel_cardIn.addChild(card,20-i);
            this.cardInArray.push(card);
        }

        this.resetPanelInChild();

        if(hall.getPlayingGame().table.bankerId == this.uid)
        {
            this.addMoCard();
        }


    },
    setHandCardsBack :function()
    {
        this.gap_stand = 33;
        var panelLength = this.getShowPanelCount();
        var length = this.cardInArray.length;
        for (var i =0;i<  this.cardInArray.length;i++)
        {
            this.cardInArray[i].removeFromParent();
        }
        this.cardInArray.splice(0,this.cardInArray.length);

        for (var i =0;i< length;i++)
        {
            var card;
            var Date={};
            Date['type'] ='H';
            Date['value'] = 1;
            if(panelLength*3 + i + 1 == MajhongInfo.MajhongNumber)
            {
                card = new CardUpStand();
            }else
            {
                card = new CardUpShow(Date,0);
                card.SetBack();
            }
            this.panel_cardIn.addChild(card,i);
            this.cardInArray.push(card);
        }
    },
    putOutCard:function(data)
    {
        this._super();
        var _this = this;
        var order = this.panel_cardOut.getLocalZOrder();
        this.panel_cardOut.getParent().reorderChild(this.panel_cardOut,order+10);
        var outCard = new MyCard(this,data["msg"],true);
        outCard.setScale(1.1);
        this.panel_cardOut.addChild(outCard,200);
        var soundData = {};
        soundData['cardType'] = this.cardOfString(data["msg"]);
        soundData['userSex'] = this.sexType;
        sound.playCard(soundData);
        outCard.setPosition(this.posCenterCardOut);
        var card = this.addCardOut(data["msg"]);
        card.setVisible(false);
        outCard.runAction(cc.sequence(cc.delayTime(CommonParam.ShowDelayTime),
            cc.callFunc(function () {sound.playCardDown();}),
            cc.delayTime(0.1),
            cc.callFunc(function () {
                _this.panel_cardOut.getParent().reorderChild(_this.panel_cardOut,-1);
                this.removeFromParent();
                card.setVisible(true);
                card.runIndicator();
            }.bind(outCard))));
        return;

        var outCard = new MyCard(this,data["msg"],true);
        var pos = this.posOfPanel();
        var outPos = this.panel_cardOut.convertToNodeSpace(pos);
        this.panel_cardOut.addChild(outCard,200);
        outCard.setPosition(outPos);
        outCard.setVisible(false);

        var soundData = {};
        soundData['cardType'] = this.cardOfString(data["msg"]);
        soundData['userSex'] = this.sexType;
        sound.playCard(soundData);

        var card = this.addCardOut(data["msg"]);

        var bg = card.image_cardBG;
        var value = card.image_card;
        if(bg != undefined && bg != null && value != undefined && value != null )
        {
            bg.setOpacity(0);
            value.setOpacity(0);
            bg.runAction(cc.sequence(cc.delayTime(0.2),cc.fadeIn(0.2)));
            value.runAction(cc.sequence(cc.delayTime(0.2),cc.fadeIn(0.2)));
        }

        var order = this.panel_cardOut.getLocalZOrder();
        var order2 = this.panel_cardIn.getLocalZOrder();
        this.panel_cardOut.getParent().reorderChild(this.panel_cardOut,order+10);
        this.node_tip.getParent().reorderChild(this.node_tip,order+11);
        //this.panel_cardOut.runAction(cc.sequence(
        //  cc.delayTime(1.0),
        //  cc.callFunc(function () {
        //    this.panel_cardOut.getParent().reorderChild(this.panel_cardOut,-1);
        //  }.bind(this))
        //));

        var spawnShow = cc.sequence(cc.hide(),cc.moveTo(CommonParam.PutOut1stTime,this.posCenterCardOut),
            cc.scaleTo(CommonParam.PutOut1stTime,CommonParam.PutOutScale),cc.show()
          //,cc.rotateBy(CommonParam.PutOut1stTime,360)
        );

        outCard.runAction(cc.sequence(spawnShow,cc.delayTime(CommonParam.ShowDelayTime),//cc.removeSelf()
          cc.callFunc(function () {
              sound.playCardDown();
            this.removeFromParent();
              card.runIndicator();
              //var bg = card.image_cardBG;
              //var value = card.image_card;
              //if(bg != undefined && bg != null && value != undefined && value != null )
              //{
              //    bg.setOpacity(0);
              //    value.setOpacity(0);
              //    bg.runAction(cc.fadeIn(0.2));
              //    value.runAction(cc.fadeIn(0.2));
              //}
          }.bind(outCard))));

        // var posTarget = this.posIndexOfOutCard();
        // var num = this.cardOutArray.length;
        // var floor = Math.floor(num/10);
        // var delay = cc.delayTime(CommonParam.PutOut1stTime+CommonParam.ShowDelayTime);
        // var spawnOut = cc.spawn(
        //     cc.moveTo(CommonParam.PutOut2ndTime,posTarget),
        //
        //     cc.scaleTo(CommonParam.PutOut2ndTime,CommonParam.PutOutScaleReset));
        // var length = this.cardOutArray.length;
        // outCardRight.runAction(cc.sequence(delay,cc.show(),spawnOut,
        //     cc.callFunc(function () {
        //         this.getParent().reorderChild(this,20*floor+10-length);
        //       this.runIndicator();
        //     }.bind(outCardRight))
        // ));
        //
        // this.cardOutArray.push(outCardRight);

    },

    posIndexOfOutCard: function () {
        this._super();
        var num = this.cardOutArray.length;
        var width = 0;
        var height = 0;
        if(num > 0)
        {
            var card = this.cardOutArray[0];
            width = card.getContentSize().width*card.getScale()*CommonParam.UpCardGap;
            height = card.getContentSize().height*card.getScale()*CommonParam.UpCardHeightGap;
        }

        var num = this.cardOutArray.length;
        var size = this.panel_cardOut.getContentSize();
        if(MajhongInfo.MajhongNumber > 14)
        {
            var index = num%9;
            var floor = Math.floor(num/9);
            return cc.p(0-index*width+13, 0-height*floor);
        }
        else
        {
            var index = num% 10;
            var floor = Math.floor(num/ 10);
            return cc.p( -index*width, -height*floor);
        }
    },

    addMoCard: function () {
        this._super();
        var card = new CardUpStand();
        this.moCard = card;
        var length = this.cardInArray.length;
        card.setPosition(this.posMoOfPanel());
        this.panel_cardIn.addChild(card,20-length);
    },

    addGangCards: function (data) {
      this._super();
      var cards = data['msg']['cards'];
      for(var i = 0; i < cards.length;i++)
      {
        var key = cards[i];
        var outCard = new CardUpShow(key);
        var num = this.cardOutArray.length;
        var floor = Math.floor(num/10);
        var pos = this.posIndexOfOutCard();
        outCard.setPosition(pos);
        this.panel_cardOut.addChild(outCard,20*floor+10-num);
        this.cardOutArray.push(outCard);
        outCard.showYellow();
      }
    },

    addBuzhangCardsPanel: function (cardObj,gang_type,sourceChair) {
        var numPanel =  this._super(cardObj);
        var panelCell = this.pengPanel.clone();
        for(var i = 0 ; i < 4;i++)
        {
            var index = i;
            var order = 4-i;
            if(i == 3)
            {
                index = 1;
                order = 10;
            }
            var card = new CardUpShow(cardObj,numPanel*3+index);
            if (gang_type == OPER_GANG_TYPE.GANG_AN && i<3)
            {
                card.SetBack();
            }
            if(i == 3)
            {
                card.setRotationX(3);
            }
	    if (gang_type == OPER_GANG_TYPE.GANG_OTHER )
            {
                if( i == 3)
                {
                    if(sourceChair == 1)
                    {
                        card.showBlue();
                    }
                }else
                {
                    if(i==0 || i==2)
                    {
                        if(sourceChair == i)
                        {
                            card.showBlue();
                        }
                    }
                }
            }
            if(numPanel > 2)
            {
                panelCell.addChild(card,order,i);
            }else
            {
                panelCell.addChild(card,i,i);
            }
            card.setPosition(this.pengPanel.getChildByName("node"+i).getPosition());
        }
        panelCell.index = numPanel;
        panelCell.setVisible(true);
        this.buzhangArray.push(cardObj);
        this.buzhangPanelArray.push(panelCell);
        this.panel_cardIn.addChild(panelCell,-numPanel);
    },

    addChiCardsPanel: function (cards) {
        this._super();
        var panelCell = this.pengPanel.clone();
        var numPanel = this.getShowPanelCount();
        for(var i = 0 ; i < cards.length;i++)
        {
            var card = new CardUpShow(cards[i],numPanel*3+i);
            card.setPosition(this.pengPanel.getChildByName("node"+i).getPosition());
            if(numPanel > 2)
            {
                panelCell.addChild(card,2-i,i);
            }else
            {
                panelCell.addChild(card,i,i);
            }
            if(i == 1)
            {
                card.showBlue();
            }
        }
        panelCell.index = numPanel;
        panelCell.setVisible(true);
        this.chiPanelArray.push(panelCell);
        this.panel_cardIn.addChild(panelCell,-numPanel);
    },

    addPengCardsPanel: function (cardObj,sourceChair) {
        this._super();
        var numPanel = this.getShowPanelCount();
        var panelCell = this.pengPanel.clone();
        for(var i = 0 ; i < 3 ;i++)
        {
            var card = new CardUpShow(cardObj,numPanel*3+i);
            card.setPosition(this.pengPanel.getChildByName("node"+i).getPosition());
            if(numPanel > 2)
            {
                panelCell.addChild(card,2-i,i);
            }else
            {
                panelCell.addChild(card,i,i);
            }
            if(sourceChair　!= undefined && sourceChair != null && sourceChair== i )
            {
                card.showBlue();
            }
        }
        panelCell.index = numPanel;
        panelCell.setVisible(true);
        this.pengPanelArray.push(panelCell);
        this.pengArray.push(cardObj);
        this.panel_cardIn.addChild(panelCell,-numPanel);
    },

    initUI:function()
    {
        this._super();
        if(MajhongInfo.MajhongNumber > 14)
        {
            this.pengPanel.setScale(CommonParam.UP17ShowScale);
        }
    },
    resetPanelInChild: function () {
        this._super();
        var panelLength = this.getShowPanelCount();
        var panelWidth = this.pengPanel.getContentSize().width*this.pengPanel.getScale();
        var posXNext = -panelLength*panelWidth;
        var offy = 80;
        //if(MajhongInfo.MajhongNumber > 14) offy = 90;
        for(var i = 0 ; i < this.buzhangPanelArray.length;i++)
        {
            var panel = this.buzhangPanelArray[i];
            panel.y =  0;
            panel.x = -panel.index*panelWidth-offy;
        }

        //碰框位置
        for(var i = 0 ; i < this.pengPanelArray.length;i++)
        {
            var panel = this.pengPanelArray[i];
            panel.y =  0;
            panel.x = -panel.index*panelWidth-offy;
        }

        for(var i = 0 ; i < this.chiPanelArray.length;i++)
        {
            var panel = this.chiPanelArray[i];
            panel.y =  0;
            panel.x = -panel.index*panelWidth-offy;
        }

        if(MajhongInfo.GameMode  == GameMode.RECORD)
        {
        this.cardInArray = this.cardInArray.sort(this.sortCardList);
        }

        if(this.isAlreadyTing > 0 || MajhongInfo.GameMode  == GameMode.RECORD || MajhongInfo.MajhongNumber > 14) posXNext -= this.gap_stand*0.3;
        //手牌位置
        for(var i = 0;i < this.cardInArray.length ; i++)
        {
            var card = this.cardInArray[i];
            card.y = 0;
            card.x = posXNext - this.gap_stand*i ;
            this.panel_cardIn.reorderChild(card,card_indexs[GetCardDifferentIndex(panelLength*3+i)]);
            if(panelLength*3 + i + 1 == MajhongInfo.MajhongNumber)
            {
                card.x -= this.moCardGap;
            }

            if(this.isAlreadyTing > 0 || (MajhongInfo.GameMode  == GameMode.RECORD))
            {
                card.reloadCardIndex(panelLength*3+i);
            }
        }
        if(!!this.moCard)
        {
            this.moCard.setPosition(this.posMoOfPanel());
        }
    },

    //摸牌位置
    posMoOfPanel:function(){
        var card = this.cardInArray[this.cardInArray.length-1];
        return cc.p(card.x-this.gap_stand-this.moCardGap,card.y);
    },

    posHandCard: function () {
        this._super();

        var posYNext = 0;

        var width = this.panel_cardIn.getContentSize().width;
        var posXNext = width;

        for(var i = 0 ; i < this.buzhangPanelArray.length;i++)
        {
            var panel = this.buzhangPanelArray[i];
            var panelWidth = panel.getContentSize().width;
            panel.y =  0;
            panel.x = posXNext - panelWidth;
            posXNext =  panel.x;
        }


        //碰框位置
        for(var i = 0 ; i < this.pengPanelArray.length;i++)
        {
            var panel = this.pengPanelArray[i];
            var panelWidth = panel.getContentSize().width;
            panel.y =  0;
            panel.x = posXNext - panelWidth;
            posXNext =  panel.x;
        }

        for(var i = 0 ; i < this.chiPanelArray.length;i++)
        {

            var panel = this.chiPanelArray[i];
            var panelWidth = panel.getContentSize().width;
            panel.y =  0;
            panel.x = posXNext - panelWidth;
            posXNext =  panel.x;
        }

        return posXNext;
    },

    showHandInCards: function () {
        this._super();
        var posHandCard = this.posHandCard();
        for(var i = 0 ; i < this.cardInList.length;i++)
        {
            var card = new CardUpShow(this.cardInList[i],i);
            card.y  = 0;
            card.x = posHandCard -35 - 35*i;
            this.panel_cardIn.addChild(card,i);
        }
    },

    putInBirdCards: function (data) {
        this._super();
        var birdCards = data['msg']['niao'];
        if(birdCards!= undefined && birdCards != null && birdCards.length >0 )
        {
            for(var i = 0; i < birdCards.length;i++)
            {
                var key = birdCards[i];
                var outCard = this.addCardOut(key);
                outCard.showYellow();
            }
        }
    },

    addHu: function (msg) {
      if(MajhongInfo.MajhongNumber > 14)
      {
            this.gap_stand = 33*CommonParam.UP17ShowScale;
      }
      this.isAlreadyTing = 1;
      var panelLength = this.getShowPanelCount();
      for (var i =0;i<  this.cardInArray.length;i++)
      {
        this.cardInArray[i].removeFromParent();
      }
      this.cardInArray.splice(0,this.cardInArray.length);

      var handCards = this.getHandCards(msg);
      var huHands = this.getHuCards(msg);

      for(var i=0;i<handCards.length;i++)
      {
        var cardShow = new CardUpShow(handCards[i],panelLength*3+i,CARD_SITE.RECORD);
        this.panel_cardIn.addChild(cardShow);
        this.cardInArray.push(cardShow);
      }
      this.cardInArray = this.cardInArray.sort(this.sortCardList);
      this.resetPanelInChild();
      for(var i=0;i<huHands.length;i++)
      {
        var cardShow = new CardUpShow(huHands[i],panelLength*3+handCards.length+i,CARD_SITE.RECORD);
        cardShow.setPosition(this.recordMoCardPos());
        this.panel_cardIn.addChild(cardShow,card_indexs[GetCardDifferentIndex(panelLength*3+handCards.length+i)]);
        this.cardInArray.push(cardShow);
      }
    },

// 记录=====================

  playRecordMoCard: function (data) {
    var length = this.cardInArray.length;
    var panelLength = this.getShowPanelCount();
    var card = new CardUpShow(data,panelLength*3+length,CARD_SITE.RECORD);
    card.setPosition(this.recordMoCardPos());
    this.panel_cardIn.addChild(card,length);
    this.cardInArray.push(card);
    card.y = card.y - 30;
    card.runAction(cc.sequence(cc.moveTo(0.15,cc.p(card.x ,card.y+30))
      ,cc.callFunc(this.postNextStep.bind(this))
    ));
  },

  recordMoCardPos:function(){
      var card = this.cardInArray[this.cardInArray.length-1];
      return cc.p(card.x-this.gap_stand-this.moCardGap,card.y);
  },

  playRecordSend:function(cardObj)
  {
    var str = this.cardOfString(cardObj);
    var card = null;

    if(this.moCard != null && this.moCard.paiOfCard().keyOfPai() == str)
    {
      card = this.moCard;
    }

    if(card == null)
    {
      for(var i=0;i<this.cardInArray.length;i++)
      {
        var tmp = this.cardInArray[i];
        if(tmp.paiOfCard().keyOfPai() == str)
        {
          card = this.cardInArray[i];
          break;
        }
      }
    }

    if(card != null)
    {
      this.playRecordSendAction(card);
    }
  },

  playRecordSendAction:function(card)
  {
    var cardObj = card.paiOfCard().objectOfPai();
    card.runAction(cc.sequence(cc.moveBy(0.15,cc.p(0,-30)),cc.callFunc(this.removeOutHandCard.bind(this),card)
      ,cc.callFunc(this.resetPanelInChild.bind(this))
    ));

    var outCard = new MyCard(this,cardObj,true);
    var pos = this.posOfPanel();
    var outPos = this.panel_cardOut.convertToNodeSpace(pos);
    this.panel_cardOut.addChild(outCard,200);
    outCard.setPosition(outPos);

    var soundData = {};
    soundData['cardType'] = this.cardOfString(cardObj);
    soundData['userSex'] = this.sexType;
    sound.playCard(soundData);

    var outCardRight = this.addCardOut(cardObj);
    var posTarget = outCardRight.getPosition();
    outCardRight.setPosition(this.posCenterCardOut);
    outCardRight.setVisible(false);

    var order = this.panel_cardOut.getLocalZOrder();
    if(order < 20)
    {
      this.panel_cardOut.getParent().reorderChild(this.panel_cardOut,order+10);
    }

    this.node_tip.getParent().reorderChild(this.node_tip,order+11);
    var spawnShow = cc.spawn(cc.moveTo(CommonParam.PutOut1stTime,this.posCenterCardOut),
      cc.scaleTo(CommonParam.PutOut1stTime,CommonParam.PutOutScale)
    );

    outCard.runAction(cc.sequence(spawnShow,cc.delayTime(CommonParam.ShowDelayTime),//cc.removeSelf()
      cc.callFunc(function () {
        this.removeFromParent();
      }.bind(outCard))));

    var delay = cc.delayTime(CommonParam.PutOut1stTime+CommonParam.ShowDelayTime);
    var spawnOut = cc.spawn(
      cc.moveTo(CommonParam.PutOut2ndTime,posTarget));
    outCardRight.runAction(cc.sequence(delay,cc.callFunc(function () {sound.playCardDown();}),
        cc.delayTime(0.1),cc.show(),spawnOut,
      cc.callFunc(function () {
        this.runIndicator();
      }.bind(outCardRight)),
      cc.callFunc(this.postNextStep.bind(this))
    ));

  },
    runRecordBuhuaOpAction: function (data) {
        var panelLength = this.getShowPanelCount();
        var huapai = data["pai"];
        for (var i = 0; i < huapai.length; i++) {
            for (var j = this.cardInArray.length - 1; j >= 0; j--) {
                var card = this.cardInArray[j];
                if (card.paiOfCard().isHuaPai()) {
                    this.cardInArray.splice(j, 1);
                    card.removeFromParent();
                    break
                }
            }
        }
        var hua = null;
        if (this.moCard != null && this.moCard.paiOfCard().isHuaPai()) {
            hua = huapai.shift();
            this.moCard.removeFromParent();
            this.moCard = null;
        }
        for (var i = 0; i < huapai.length; i++) {
            var card = new CardUpShow(huapai[i],panelLength*3+i+this.cardInArray.length-1,CARD_SITE.RECORD);
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card);
        }
        this.cardInArray = this.cardInArray.sort(this.sortCardList);
        this.resetPanelInChild();
        if (hua != null) {
            this.playRecordMoCard(hua);
        }else
        {
            this.postNextStep(0.2);
        }
    },

  initRecordHandCards:function() {
    var cards = hall.getPlayingGame().record.upHandCards;
    this.panel_cardIn.removeAllChildren();
    var allCards = new Array();
    var index = 0;
    for (var p in cards) {
        var arr = cards[p];
        for (var i = 0; i < arr.length; i++) {
            var card = new CardUpShow(arr[i],index,CARD_SITE.RECORD);
            if (hall.getPlayingGame().record.JinPaiId == card.paiOfCard().keyOfPai())
            {
                card.setJin();
            }
            allCards.push(card);
            index++;
        }
    }
    allCards = allCards.sort(this.sortCardList);
    for (var i = 0 ; i < allCards.length;i++) {
        var card = allCards[i];
        var order = 20 - i;
        this.panel_cardIn.addChild(card, order);
        this.cardInArray.push(card);
    }
    this.resetPanelInChild();
  },

  recordAddGangPanel: function (cardObj) {
    var panelCell = this.pengPanel.clone();
    var height = panelCell.getContentSize().height;
    var width = panelCell.getContentSize().width;
    for(var i = 0 ; i < 4;i++)
    {
      var card = new CardUpShow(cardObj);

      card.x = width -35 - 35*i;
      panelCell.addChild(card,i,i);

      if(i == 3)
      {
        card.x = width -35 - 35*1;
        card.y  = 14;
      }
    }

    panelCell.setVisible(true);
    this.buzhangArray.push(cardObj);
    this.buzhangPanelArray.push(panelCell);
    this.panel_cardIn.addChild(panelCell);
  },

  recordGangYellowCards: function (cards) {
    for(var i = 0; i < cards.length;i++)
    {
      var key = cards[i];
      var outCard = new CardUpShow(key);
      var num = this.cardOutArray.length;
      var floor = Math.floor(num/10);
      var pos = this.posIndexOfOutCard();

      outCard.setPosition(pos);
      this.panel_cardOut.addChild(outCard,20*floor+10-length);
      this.cardOutArray.push(outCard);
      outCard.showYellow();
    }
  },


});
