/**
 * Created by atom on 2016/8/21.
 */
var WHMJLeftSeat = WHMJDeskSeat.extend({
    ctor: function (data) {
        this._super(data, 'leftseat');
        this.root = ccs.load("res/MajhongWH/WuHanLefterPanel.json").node;
        this.addChild(this.root);

        this.gap_stand = 30;
        this.startScale = 0.64;
        this.showOffScale = 0.05;
	    if(MajhongInfo.MajhongNumber > 14)
        {
            if(MajhongInfo.GameMode == GameMode.RECORD)
            {
                this.gap_stand = this.gap_stand*WHCommonParam.Othter17CardRecordScale+1;
            }else
            {
                this.gap_stand = this.gap_stand*WHCommonParam.Other17CardStandScale;
            }
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
    var card = new WHCardLeftStand();
    var length = this.cardInArray.length;
    this.cardInArray.push(card);
    this.panel_cardIn.addChild(card,length);
  },

  addCardOut:function(cardObj)
  {
      var length = this.cardOutArray.length;
      var index = length%WHCommonParam.DeskOneNum;
      var floor = Math.floor(length/WHCommonParam.DeskOneNum);
      var card = new WHCardLeftDesk(cardObj,floor);
      var height = card.getContentSize().height;
      var off = 0;
      if(floor == 0 || floor == 2)
      {
          var y = -(index*0.776+index*(index-1)/2*0.028)*height*0.55;
          var x = y/2.5;
          card.setScale(0.776+0.028*index);
          if (floor == 2)
          {
              off = 1;
              card.x = x-22;
              card.y = y+26;
          }else
          {
              card.x = x-20;
              card.y = y+5;
          }
      }else
      {
          var y = -(index*0.776+index*(index-1)/2*0.028)*height*0.55;
          var x = y/2.2;
          card.setScale(0.776+0.028*index);
          card.x = x-50-20;
          card.y = y+5;
      }
      var ting = cardObj['ting'];
      if(ting != undefined && ting != null)
      {
          if(ting == 1)
          {
              card.showBlue();
          }
      }
    this.panel_cardOut.addChild(card,(1-floor)*20+index + off*40);
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
                var h = 26;
                var paisHeight = h * len;


                var panel = this.panel_tianhu.clone();
                panel.setVisible(false);

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

                var panelHeight = panel_card.getContentSize().height;
                var startPos = paisHeight + (panelHeight - paisHeight) / 2;
                for (var j = 0; j < pais.length; j++) {
                    var card = new WHCardLeftShow(pais[j]);
                    card.y = startPos - h * j;
                    card.x = 0;
                    panel_card.addChild(card, j);
                }
                image_word.setScale(2.0);

                var soundData = {};
                soundData['sexType'] = this.sexType;
                soundData['huType'] = type;

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
        this.panel_cardIn.removeAllChildren();
        for(var i = 0 ; i < MajhongInfo.MajhongNumber - 1;i++){
            var card = new WHCardLeftStand();
            this.panel_cardIn.addChild(card,i);
            this.cardInArray.push(card);
        }
        this.resetPanelInChild();
        if(whmajhong.table.bankerId == this.uid)
        {
            this.addMoCard();
        }


    },

    setHandCardsBack :function()
    {
        var panelLength = this.getShowPanelCount();
        var length = this.cardInArray.length;
        for (var i =0;i<  this.cardInArray.length;i++)
        {
            this.cardInArray[i].removeFromParent();
        }
        this.cardInArray.splice(0,this.cardInArray.length);

        for (var i =0;i<length;i++)
        {
            var card;
            if(panelLength*3 + i + 1 == MajhongInfo.MajhongNumber)
            {
                card = new WHCardLeftStand();
            }else
            {
                var Date={};
                Date['type'] ='H';
                Date['value'] = 1;
                card = new WHCardLeftShow(Date);
                card.setRotationX(-5);
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
        var outCard = new WHMyCard(this,data["msg"],true);
        outCard.setScale(1.1);
        this.panel_cardOut.addChild(outCard,200);
        outCard.setPosition(this.posCenterCardOut);
        var soundData = {};
        soundData['cardType'] = this.cardOfString(data["msg"]);
        soundData['userSex'] = this.sexType;
        sound.playCard(soundData);
        var card = this.addCardOut(data["msg"]);
        card.setVisible(false);
        outCard.runAction(cc.sequence(cc.delayTime(WHCommonParam.ShowDelayTime),
            cc.callFunc(function () {sound.playCardDown();}),
            cc.delayTime(0.1),
            cc.callFunc(function () {
                _this.panel_cardOut.getParent().reorderChild(_this.panel_cardOut,-1);
                this.removeFromParent();
                card.setVisible(true);
                card.runIndicator();
            }.bind(outCard))));
        return;
        var outCard = new WHMyCard(this,data["msg"],true);
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

        var order = this.panel_cardOut.getLocalZOrder();
        var order2 = this.panel_cardIn.getLocalZOrder();
        this.panel_cardOut.getParent().reorderChild(this.panel_cardOut,order+10);
        this.panel_cardOut.runAction(cc.sequence(
          cc.delayTime(1.0),
          cc.callFunc(function () {
            this.panel_cardOut.getParent().reorderChild(this.panel_cardOut,-1);
          }.bind(this))
        ));
        var spawnShow = cc.sequence(cc.hide(),cc.moveTo(WHCommonParam.PutOut1stTime,this.posCenterCardOut),
            cc.scaleTo(WHCommonParam.PutOut1stTime,WHCommonParam.PutOutScale),cc.show()
          //,cc.rotateBy(WHCommonParam.PutOut1stTime,360)
        );
        outCard.runAction(cc.sequence(spawnShow,cc.delayTime(WHCommonParam.ShowDelayTime),//cc.removeSelf()
          cc.callFunc(function () {
            sound.playCardDown();
            this.removeFromParent();
              card.runIndicator();
          }.bind(outCard))));
    },

    posIndexOfOutCard: function () {
        this._super();
        var num = this.cardOutArray.length;
        var width = 0;
        var height = 0;
        if(num > 0)
        {
            var card = this.cardOutArray[0];
            width = card.getContentSize().width*card.getScale()*WHCommonParam.LeftCardWidthGap;
            height = card.getContentSize().height*card.getScale()*WHCommonParam.LeftCardGap;
        }

        var num = this.cardOutArray.length;
        var size = this.panel_cardOut.getContentSize();
        if(MajhongInfo.MajhongNumber > 14)
        {
            var index = num%9;
            var floor = Math.floor(num/9);
            return cc.p(floor*width+2, size.height - 41 - height*index-55);
        }
        else
        {
            var index = num% 10;
            var floor = Math.floor(num/10);
            return cc.p(floor*width+2, size.height - 41 - height*index-55);
        }
    },

    addMoCard: function () {
        this._super();
        var length = this.cardInArray.length;
        var card = new WHCardLeftStand();
        card.setScale(this.cardInArray[length-1].getScale()+0.05);
        this.moCard = card;
        card.setPosition(this.posMoOfPanel());
        this.panel_cardIn.addChild(card,length);
    },

    addGangCards: function (data) {
      this._super();
      var cards = data['msg']['cards'];
      for(var i = 0; i < cards.length;i++)
      {
        var key = cards[i];
        var outCard = new WHCardLeftShow(key);
        var pos = this.posIndexOfOutCard();
        outCard.setPosition(pos);
        this.panel_cardOut.addChild(outCard);
        this.cardOutArray.push(outCard);
        outCard.showYellow();
      }
    },

    addBuzhangCardsPanel: function (cardObj,gang_type,sourceChair) {
        if(gang_type > 3)
        {
            return;
        }
        var numPanel =  this._super(cardObj);
        var panelCell = this.pengPanel.clone();
        var scale = 1-(MajhongInfo.MajhongNumber-2)/3*this.showOffScale + (numPanel+1)*this.showOffScale;
        panelCell.setScale(scale*panelCell.getScale());
        for(var i = 3 ; i >= 0; i--)
        {
            var card = new WHCardLeftShow(cardObj);
            if(i == 3)
            {
                card.setScale(1-0.03);
                panelCell.addChild(card,10,i);
                if(gang_type == OPER_GANG_TYPE.GANG_OTHER && sourceChair == 1)
                {
                    card.showBlue();
                }
                if (gang_type == OPER_GANG_TYPE.GANG_AN)
                {
                    card.SetBack();
                }
            }else
            {
                card.setScale(1-(2-i)*0.03);
                panelCell.addChild(card,i,i);
                if (gang_type == OPER_GANG_TYPE.GANG_AN)
                {
                    card.SetBack();
                }
                if(gang_type == OPER_GANG_TYPE.GANG_OTHER )
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
            card.setPosition(this.pengPanel.getChildByName("node"+i).getPosition());
        }
        panelCell.index = numPanel;
        panelCell.setVisible(true);
        this.buzhangArray.push(cardObj);
        this.buzhangPanelArray.push(panelCell);
        this.panel_cardIn.addChild(panelCell,numPanel-10);
    },

    addGDGangCardsPanel:function(cardObj,gang_type)
    {
        if(gang_type> 3)
        {
            var length = this.cardGDGangArry.length;
            var index = length%WHCommonParam.DeskOneNum;
            var floor = Math.floor(length/WHCommonParam.DeskOneNum);
            var card = new WHCardLeftDesk(cardObj,floor);
            var height = card.getContentSize().height;
            var off = 0;
            var y = -(length*0.8+length*(length-1)/2*0.015)*height*0.55;
            var x = y/2.5;
            card.setScale(0.8+0.015*length);
            card.x = x-20;
            card.y = y+5;
            this.cardGdGangPanel.addChild(card,(floor)*20+index + off*40);
            this.cardGdGangPanel.setScale(0.5);
            this.cardGDGangArry.push(card);
            return card;


        }
    },


    addChiCardsPanel: function (cards) {
        var panelCell = this.pengPanel.clone();
        var numPanel = this.getShowPanelCount();
        var scale = 1-(MajhongInfo.MajhongNumber-2)/3*this.showOffScale + (numPanel+1)*this.showOffScale;
        panelCell.setScale(scale*panelCell.getScale());
        for(var i = 2 ; i >= 0 ; i--)
        {
            var card = new WHCardLeftShow(cards[i]);
            card.setScale(1-(2-i)*0.03);
            card.setPosition(this.pengPanel.getChildByName("node"+i).getPosition());
            if(i == 1)
            {
                card.showBlue();
            }
            panelCell.addChild(card,i,i);
        }
        panelCell.index = numPanel;
        panelCell.setVisible(true);
        this.chiPanelArray.push(panelCell);
        this.panel_cardIn.addChild(panelCell,numPanel-10);
    },

    addPengCardsPanel: function (cardObj,sourceChair) {
        var panelCell = this.pengPanel.clone();
        var numPanel = this.getShowPanelCount();
        var scale = 1-(MajhongInfo.MajhongNumber-2)/3*this.showOffScale + (numPanel+1)*this.showOffScale;
        panelCell.setScale(scale*panelCell.getScale());
        for(var i = 2 ; i >= 0;i--)
        {
            var card = new WHCardLeftShow(cardObj);
            card.setScale(1-(2-i)*0.03);
            card.setPosition(this.pengPanel.getChildByName("node"+i).getPosition());
            panelCell.addChild(card,i,i);
            if(sourceChair　!= undefined && sourceChair != null && sourceChair== i )
            {
                card.showBlue();
            }
        }
        panelCell.setVisible(true);
        panelCell.index = numPanel;
        this.pengPanelArray.push(panelCell);
        this.pengArray.push(cardObj);
        this.panel_cardIn.addChild(panelCell,numPanel-10);
    },

    initUI:function()
    {
        this._super();
        if(MajhongInfo.MajhongNumber > 14) {
            this.pengPanel.setScale(WHCommonParam.Othter17ShowScale);
        }else
        {
            this.pengPanel.setScale(WHCommonParam.Othter14ShowScale);
        }
    },

    resetPanelInChild: function () {
        var panelLength = this.getShowPanelCount();
        var panelHeight = this.pengPanel.getContentSize().height*this.pengPanel.getScale()*1.04;
        var firstScale = 1-((MajhongInfo.MajhongNumber-2)/3-1)*this.showOffScale;
        var offy = firstScale*panelHeight*0.6;
        var kk = Math.tan(65*Math.PI/180);
        var k = Math.tan(58*Math.PI/180);
        var panelOff = -40
        //碰框位置
        for(var i = 0 ; i < this.buzhangPanelArray.length;i++)
        {
            var panel = this.buzhangPanelArray[i];
            panel.y = -panelHeight*this.getFinal(firstScale,panel.index,this.showOffScale)-offy;
            panel.x =  panel.y/k+panelOff;
        }

        //碰框位置
        for(var i = 0 ; i < this.pengPanelArray.length;i++)
        {
            var panel = this.pengPanelArray[i];
            panel.y = -panelHeight*this.getFinal(firstScale,panel.index,this.showOffScale)-offy;
            panel.x =  panel.y/k+panelOff;
        }

        for(var i = 0 ; i < this.chiPanelArray.length;i++)
        {
            var panel = this.chiPanelArray[i];
            panel.y = -panelHeight*this.getFinal(firstScale,panel.index,this.showOffScale)-offy;
            panel.x =  panel.y/k+panelOff;
        }

      if(MajhongInfo.GameMode  == GameMode.RECORD)
      {
        this.cardInArray = this.cardInArray.sort(this.sortCardList);
      }

        var handPosY = -panelHeight*this.getFinal(1,panelLength,-this.showOffScale)/2;
        for(var i = 0;i < this.cardInArray.length ; i++)
        {
            var handPosX = handPosY/kk;
            var card = this.cardInArray[i];
            card.setScale(1-(1-this.startScale)/MajhongInfo.MajhongNumber*(this.cardInArray.length-1-i)-panelLength*0.02);
            card.y = handPosY+5;
            if(MajhongInfo.GameMode  == GameMode.RECORD)
            {
                card.x = handPosX-i*1.5 + 10;
            }else
            {
                if(this.isAlreadyTing > 0)
                {
                    card.x = handPosX-i*1.5 + 10;
                }else
                {
                    card.x = handPosX-i*1.5 + 35;
                }
                if(panelLength*3 + i + 1 == MajhongInfo.MajhongNumber)
                {
                    card.setScale(this.cardInArray[this.cardInArray.length-2].getScale()+0.05);
                    card.setPosition(this.posMoOfPanel())
                }
            }
            handPosX -= 16*card.getScale()*0.95;
            handPosY = handPosX*kk ;
            this.panel_cardIn.reorderChild(card,i);
        }
        if(!!this.moCard)
        {
            this.moCard.setPosition(this.posMoOfPanel());
        }

    },

    //摸牌位置
    posMoOfPanel:function(){
        if(this.getCardCount()+1 == MajhongInfo.MajhongNumber)
        {

                var card = this.cardInArray[this.cardInArray.length-1];
        }else if(this.getCardCount() == MajhongInfo.MajhongNumber)
        {

                var card = this.cardInArray[this.cardInArray.length-2];
        }
        return cc.p(card.x-card.getContentSize().width*card.getScaleX()*0.4,card.y-card.getContentSize().height*card.getScaleY()*0.6);
    },

    posHandCard: function () {
        var height = this.panel_cardIn.getContentSize().height;
        var posYNext = height;
        //碰框位置
        for(var i = 0 ; i < this.buzhangPanelArray.length;i++)
        {
            var panel = this.buzhangPanelArray[i];
            var panelHeight = panel.getContentSize().height*panel.getScale();
            panel.x =  0;
            panel.y = posYNext - panelHeight;
            posYNext =  panel.y;
        }

        //碰框位置
        for(var i = 0 ; i < this.pengPanelArray.length;i++)
        {
            var panel = this.pengPanelArray[i];
            var panelHeight = panel.getContentSize().height*panel.getScale();
            panel.x =  0;
            panel.y = posYNext - panelHeight;
            posYNext =  panel.y;
        }

        for(var i = 0 ; i < this.chiPanelArray.length;i++)
        {

            var panel = this.chiPanelArray[i];
            var panelHeight = panel.getContentSize().height*panel.getScale();
            panel.x =  0;
            panel.y = posYNext - panelHeight;
            posYNext =  panel.y;
        }

        return posYNext;
    },


    showHandInCards: function () {
        this._super();
        var posHandCard = this.posHandCard();
        for(var i = 0 ; i < this.cardInList.length;i++)
        {
            var card = new WHCardLeftShow(this.cardInList[i]);
            card.x  = 0;
            card.y = posHandCard - card.getContentSize().height - 28*i;
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
      this.isAlreadyTing = 1;

      for (var i =0;i<  this.cardInArray.length;i++)
      {
          this.cardInArray[i].removeFromParent();
      }
      this.cardInArray.splice(0,this.cardInArray.length);

      var handCards = this.getHandCards(msg);
      var huHands = this.getHuCards(msg);

      for(var i=0;i<handCards.length;i++)
      {
        var cardShow = new WHCardLeftShow(handCards[i],CARD_SITE.HAND_HU);
        this.panel_cardIn.addChild(cardShow);
        this.cardInArray.push(cardShow);
      }
      this.cardInArray = this.cardInArray.sort(this.sortCardList);
      this.resetPanelInChild();
      for(var i=0;i<huHands.length;i++)
      {
        var cardShow = new WHCardLeftShow(huHands[i],CARD_SITE.HAND_HU);
        var length = this.cardInArray.length;
        cardShow.setScale(this.cardInArray[length-1].getScale()+0.05);
        cardShow.setRotationX(-5);
        cardShow.setPosition(this.recordMoCardPos());
        this.panel_cardIn.addChild(cardShow,i+20);
        this.cardInArray.push(cardShow);
      }
    },

  // 记录=====================
  playRecordMoCard: function (data) {
    var card = new  WHCardLeftShow(data);
    var length = this.cardInArray.length;
    card.setScale(this.cardInArray[length-1].getScale()-0.05);
    card.setPosition(this.recordMoCardPos());
    this.panel_cardIn.addChild(card,20);
    this.cardInArray.push(card);
    card.x = card.x + 30;
    card.runAction(cc.sequence(cc.moveTo(0.15,cc.p(card.x -30,card.y))
      ,cc.callFunc(this.postNextStep.bind(this))
    ));
  },

    recordMoCardPos:function(){
        var card = this.cardInArray[this.cardInArray.length-1];
        return cc.p(card.x-card.getContentSize().width*card.getScaleX()*0.2,card.y-card.getContentSize().height*card.getScaleY()*0.6);
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
    card.runAction(cc.sequence(cc.moveBy(0.15,cc.p(30,0)),cc.callFunc(this.removeOutHandCard.bind(this),card)
      ,cc.callFunc(this.resetPanelInChild.bind(this))
    ));

    var outCard = new WHMyCard(this,cardObj,true);
    var pos = this.posOfPanel();
    var outPos = this.panel_cardOut.convertToNodeSpace(pos);
    this.panel_cardOut.addChild(outCard , 500);
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
    this.panel_cardOut.getParent().reorderChild(this.panel_cardOut,order+10);
    this.panel_cardOut.runAction(cc.sequence(
      cc.delayTime(1.0),
      cc.callFunc(function () {
        this.panel_cardOut.getParent().reorderChild(this.panel_cardOut,-1);
      }.bind(this))
    ));
    var spawnShow = cc.spawn(cc.moveTo(WHCommonParam.PutOut1stTime,this.posCenterCardOut),
      cc.scaleTo(WHCommonParam.PutOut1stTime,WHCommonParam.PutOutScale)
    );

    outCard.runAction(cc.sequence(spawnShow,cc.delayTime(WHCommonParam.ShowDelayTime),//cc.removeSelf()
      cc.callFunc(function () {
        this.removeFromParent();
      }.bind(outCard))));

    var delay = cc.delayTime(WHCommonParam.PutOut1stTime+WHCommonParam.ShowDelayTime);
    var spawnOut = cc.spawn(
      cc.moveTo(WHCommonParam.PutOut2ndTime,posTarget));
    outCardRight.runAction(cc.sequence(delay,
        cc.callFunc(function () {sound.playCardDown();}),
        cc.delayTime(0.1),cc.show(),spawnOut,
      cc.callFunc(function () {
        this.runIndicator();
      }.bind(outCardRight)),
      cc.callFunc(this.postNextStep.bind(this))
    ));
  },

    runRecordBuhuaOpAction: function (data) {
        var huapai = data["pai"];
        for (var i = 0; i < huapai.length; i++) {
            for (var j = this.cardInArray.length - 1; j >= 0; j--) {
                var card = this.cardInArray[j];
                if (card.paiOfCard().isQiDongHuaPai()) {
                    this.cardInArray.splice(j, 1);
                    card.removeFromParent();
                    break
                }
            }
        }
        var hua = null;
        if (this.moCard != null && this.moCard.paiOfCard().isQiDongHuaPai()) {
            hua = huapai.shift();
            this.moCard.removeFromParent();
            this.moCard = null;
        }
        for (var i = 0; i < huapai.length; i++) {
            var card = new WHCardLeftShow(huapai[i]);
            if(MajhongInfo.MajhongNumber > 14)
            {
                card.setScale(WHCommonParam.Othter17CardRecordScale);
            }else
            {
                card.setScale(WHCommonParam.Othter17CardRecordScale);
            }
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
    var cards = whmajhong.record.leftHandCards;
    this.panel_cardIn.removeAllChildren();
      var allCards = new Array();
      for (var p in cards) {
          var arr = cards[p];
          for (var i = 0; i < arr.length; i++) {
              var card = new WHCardLeftShow(arr[i]);
              if (whmajhong.record.JinPaiId == card.paiOfCard().keyOfPai())
              {
                  card.setJin();
              }
              if (whmajhong.record.PiziId1 == card.paiOfCard().keyOfPai() || whmajhong.record.PiziId2 == card.paiOfCard().keyOfPai() || whmajhong.record.PiziId3 == card.paiOfCard().keyOfPai())
              {
                  card.setPi();
              }
              allCards.push(card);
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
    for(var i = 0 ; i < 4;i++)
    {
      var card = new WHCardLeftShow(cardObj);
      card.x  = 0;
      card.y = height- card.getContentSize().height - 26*i;
      panelCell.addChild(card,i,i);
      if(i == 3)
      {
        card.y = height- card.getContentSize().height - 26*2 +35;
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
      var outCard = new WHCardLeftShow(key);
      var pos = this.posIndexOfOutCard();
      outCard.setPosition(pos);
      this.panel_cardOut.addChild(outCard);
      this.cardOutArray.push(outCard);
      outCard.showYellow();
    }
  },

});
