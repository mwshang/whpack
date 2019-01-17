/**
 * Created by atom on 2016/8/21.
 */
var RightSeat = DeskSeat.extend({
    ctor: function (data) {
      this._super(data, 'rightseat');
      this.root = ccs.load("res/MajhongBase/MajhongRighterPanel.json").node;
      this.addChild(this.root);
      this.startScale = 0.64;
      this.showOffScale = 0.05;

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
    var card = new CardRightStand();
    var length = this.cardInArray.length;
    this.cardInArray.push(card);
    this.panel_cardIn.addChild(card,20-length);
  },

  addCardOut:function(cardObj)
  {
      var length = this.cardOutArray.length;
      var index = length%CommonParam.DeskOneNum;
      var floor = Math.floor(length/CommonParam.DeskOneNum);
      var card = new CardRightDesk(cardObj,floor);
      var height = card.getContentSize().height;
      var off = 0;
      if(floor == 0 || floor == 2)
      {
          var y = (index-index*(index-1)/2*0.028)*height*0.55;
          var x = y/-2.5;
          card.setScale(1-0.028*index);
          if (floor == 2)
          {
              card.x = x+18;
              card.y = y+35;
              off = 1;
          }else
          {
              card.x = x+15;
              card.y = y+10;
          }
      }else
      {
          var y = (index-index*(index-1)/2*0.028)*height*0.55;
          var x = y/-2.2;
          card.setScale(1-0.028*index);
          card.x = x+65+15;
          card.y = y+10;
      }
      var ting = cardObj['ting'];
      if(ting != undefined && ting != null)
      {
          if(ting == 1)
          {
              card.showBlue();
          }
      }
    this.panel_cardOut.addChild(card,40-length+off*50);
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
                //image_word.loadTexture(DaHuRes[type],ccui.Widget.PLIST_TEXTURE);
                panel.setPosition(this.panel_tianhu.getPosition());
                this.panel_root.addChild(panel);

                var panelHeight = panel_card.getContentSize().height;
                var startPos =  (panelHeight - paisHeight) / 2;
                for (var j = 0; j < pais.length; j++) {
                    var card = new CardRightShow(pais[j]);
                    card.y = startPos + h * j;
                    card.x = 0;
                    panel_card.addChild(card, 20-j);
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
        this.panel_cardIn.removeAllChildren();
        for(var i = 0 ; i < MajhongInfo.MajhongNumber - 1;i++){
            var card = new CardRightStand();
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
        var panelLength = this.getShowPanelCount();
        var length = this.cardInArray.length;
        for (var i =0;i< this.cardInArray.length;i++)
        {
            this.cardInArray[i].removeFromParent();
        }
        this.cardInArray.splice(0,this.cardInArray.length);

        for (var i =0;i<length;i++)
        {
            var card;
            if(panelLength*3 + i + 1 == MajhongInfo.MajhongNumber)
            {
                card = new CardRightStand();
            }else
            {
                var Date={};
                Date['type'] ='H';
                Date['value'] = 1;
                card = new CardRightShow(Date);
                card.setRotationX(5);
                card.SetBack();
            }
            this.panel_cardIn.addChild(card,i);
            this.cardInArray.push(card);
        }
    },
    putOutCard:function(data)
    {
        this._super();
        var order = this.panel_cardOut.getLocalZOrder();
        this.panel_cardOut.getParent().reorderChild(this.panel_cardOut,order+10);
        var outCard = new MyCard(this,data["msg"],true);
        outCard.setScale(1.1);
        this.panel_cardOut.addChild(outCard,200);
        outCard.setPosition(this.posCenterCardOut);
        var soundData = {};
        soundData['cardType'] = this.cardOfString(data["msg"]);
        soundData['userSex'] = this.sexType;
        sound.playCard(soundData);
        var card = this.addCardOut(data["msg"]);
        card.setVisible(false);
        var _this = this;
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
        var spawnShow = cc.sequence(cc.hide(),cc.moveTo(CommonParam.PutOut1stTime,this.posCenterCardOut),
            cc.scaleTo(CommonParam.PutOut1stTime,CommonParam.PutOutScale),cc.show()
        );

        var order = this.panel_cardOut.getLocalZOrder();
        var order2 = this.panel_cardIn.getLocalZOrder();
        this.panel_cardOut.getParent().reorderChild(this.panel_cardOut,order+10);
        this.panel_cardOut.runAction(cc.sequence(
          cc.delayTime(1.0),
          cc.callFunc(function () {
            this.panel_cardOut.getParent().reorderChild(this.panel_cardOut,-1);
          }.bind(this))
        ));
        outCard.runAction(cc.sequence(spawnShow,cc.delayTime(CommonParam.ShowDelayTime),//cc.removeSelf()
          cc.callFunc(function () {
            sound.playCardDown();
            this.removeFromParent();
              card.runIndicator();
             // var bg = card.image_cardBG;
             // var value = card.image_card;
             // if(bg != undefined && bg != null && value != undefined && value != null )
             // {
             //     bg.setOpacity(0);
             //     value.setOpacity(0);
             //     bg.runAction(cc.fadeIn(0.2));
             //     value.runAction(cc.fadeIn(0.2));
             // }
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
            width = card.getContentSize().width*card.getScale()*CommonParam.LeftCardWidthGap;
            height = card.getContentSize().height*card.getScale()*CommonParam.LeftCardGap;
        }

        var num = this.cardOutArray.length;

        if(MajhongInfo.MajhongNumber > 14)
        {
            var index = num%9;
            var floor = Math.floor(num/9);
            return cc.p(40-floor*width, height*index+6);
        }
        else
        {
            var index = num%10;
            var floor = Math.floor(num/10);
            return cc.p(40-floor*width, height*index+6);
        }
    },

    addMoCard: function () {
        this._super();
        var length = this.cardInArray.length;
        var card = new CardRightStand(this);
        card.setScale(this.cardInArray[length-1].getScale()-0.05);
        this.moCard = card;
        card.setPosition(this.posMoOfPanel());
        this.panel_cardIn.addChild(card,20-length);
    },

    addGangCards: function (data) {
      this._super();
      var cards = data['msg']['cards'];
      for(var i = 0; i < cards.length;i++)
      {
        var key = cards[i];
        var outCard = new CardRightShow(key);
        var pos = this.posIndexOfOutCard();
        outCard.setPosition(pos);
        var num = this.cardOutArray.length;
        this.panel_cardOut.addChild(outCard,20-num);

        this.cardOutArray.push(outCard);
        outCard.showYellow();
      }
    },

    addBuzhangCardsPanel: function (cardObj,gang_type,sourceChair) {
        var numPanel =  this._super(cardObj);
        var zOrder = 20 - numPanel;
        var panelCell = this.pengPanel.clone();
        var scale = 1-numPanel*this.showOffScale;
        panelCell.setScale(scale*panelCell.getScale());
        for(var i = 0 ; i < 4;i++)
        {
            var card = new CardRightShow(cardObj);
            if(i == 3)
            {
                card.setScale(1-1*0.03);
                panelCell.addChild(card,10,i);
                if(gang_type == OPER_GANG_TYPE.GANG_OTHER && sourceChair == 1)
                {
                    card.showBlue();
                }
            }else
            {
                card.setScale(1-i*0.03);
                panelCell.addChild(card,10-i,i);
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
        this.panel_cardIn.addChild(panelCell,zOrder);
    },

    addChiCardsPanel: function (cards) {
        var panelCell = this.pengPanel.clone();
        var numPanel = this.getShowPanelCount();
        var zOrder = 20 - numPanel;
        var scale = 1-numPanel*this.showOffScale;
        panelCell.setScale(scale*panelCell.getScale());
        for(var i = 0 ; i < cards.length;i++)
        {
            var card = new CardRightShow(cards[i]);
            card.setScale(1-i*0.03);
            card.setPosition(this.pengPanel.getChildByName("node"+i).getPosition());
            if(i == 1)
            {
                card.showBlue();
            }
            panelCell.addChild(card,10-i,i);
        }
        panelCell.index = numPanel;
        panelCell.setVisible(true);
        this.chiPanelArray.push(panelCell);
        this.panel_cardIn.addChild(panelCell,zOrder);
    },

    addPengCardsPanel: function (cardObj,sourceChair) {
        var panelCell = this.pengPanel.clone();
        var numPanel = this.getShowPanelCount();
        var zOrder = 20 - numPanel;
        var scale = 1-numPanel*this.showOffScale;
        panelCell.setScale(scale*panelCell.getScale());
        for(var i = 0 ; i < 3;i++)
        {
            var card = new CardRightShow(cardObj);
            card.setScale(1-i*0.03);
            card.setPosition(this.pengPanel.getChildByName("node"+i).getPosition());
            panelCell.addChild(card,10-i,i);
            if(sourceChair　!= undefined && sourceChair != null && sourceChair== i )
            {
                card.showBlue();
            }
        }

        panelCell.setVisible(true);
        panelCell.index = numPanel;
        this.pengPanelArray.push(panelCell);
        this.pengArray.push(cardObj);
        this.panel_cardIn.addChild(panelCell,zOrder);
    },

    initUI:function()
    {
        this._super();
        if(MajhongInfo.MajhongNumber > 14) {
            this.pengPanel.setScale(CommonParam.Other17ShowScale);
        }
    },
    resetPanelInChild: function () {
        //杠位置
        var panelLength = this.getShowPanelCount();
        var panelHeight = this.pengPanel.getContentSize().height*this.pengPanel.getScale()*0.98;
        var handPosY = panelHeight*this.getFinal(1,panelLength,-this.showOffScale)/2;
        var kk = -Math.tan(65*Math.PI/180);
        var k = -Math.tan(61*Math.PI/180);
        var offy = 20;
        var panelOff = 60;
        for(var i = 0 ; i < this.buzhangPanelArray.length;i++)
        {
            var panel = this.buzhangPanelArray[i];
            panel.y = panelHeight*this.getFinal(1,panel.index,-this.showOffScale) + offy;
            panel.x =  panel.y/k+panelOff;
        }

        //碰框位置
        for(var i = 0 ; i < this.pengPanelArray.length;i++)
        {
            var panel = this.pengPanelArray[i];
            panel.y = panelHeight*this.getFinal(1,panel.index,-this.showOffScale) + offy;
            panel.x =  panel.y/k+panelOff;
        }

        for(var i = 0 ; i < this.chiPanelArray.length;i++)
        {
            var panel = this.chiPanelArray[i];
            panel.y = panelHeight*this.getFinal(1,panel.index,-this.showOffScale) + offy;
            panel.x =  panel.y/k+panelOff;
        }
        var add = 1;
        var offwidth = 16;
        if(MajhongInfo.MajhongNumber >14)
        {
            offwidth = 16*CommonParam.Other17CardStandScale;
        }
        if(MajhongInfo.GameMode  == GameMode.RECORD)
        {
            this.cardInArray = this.cardInArray.sort(this.sortCardList);
            if (this.cardInArray.length == MajhongInfo.MajhongNumber) add = 0;
        }
        for(var i = 0;i < this.cardInArray.length ; i++)
        {
            var handPosX = handPosY/kk;
            var card = this.cardInArray[i];
            card.setScale(this.startScale+panelLength*0.02+(this.cardInArray.length-i+add)*(1-this.startScale)/MajhongInfo.MajhongNumber);
            card.y = handPosY-20;
            if(MajhongInfo.GameMode  == GameMode.RECORD)
            {
                card.x = handPosX-i*1.5;
                handPosX -= offwidth*card.getScale()*0.9;
            }else
            {
                if(this.isAlreadyTing > 0)
                {
                    card.x = handPosX-i*1.5 - 5;
                }else
                {
                    card.x = handPosX-i*1.5;
                }
                handPosX -= offwidth*card.getScale()*0.95;
                if(panelLength*3 + i + 1 == MajhongInfo.MajhongNumber)
                {
                    card.setScale(this.cardInArray[this.cardInArray.length - 2].getScale()-0.05);
                    card.setPosition(this.posMoOfPanel())
                }
            }
            handPosY = handPosX*kk ;
            this.panel_cardIn.reorderChild(card,40-i);
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
        if (this.isAlreadyTing > 0)
        {
            return cc.p(card.x-card.getContentSize().width*card.getScaleX()*0.15,card.y+card.getContentSize().height*card.getScaleY()*0.5);
        }else
        {
            return cc.p(card.x-card.getContentSize().width*card.getScaleX()*0.36,card.y+card.getContentSize().height*card.getScaleY()*0.5);
        }
    },

    posHandCard: function () {
        var posYNext = 0;
        var panelHeight = panel.getContentSize().height*panel.getScale();
        //杠位置
        for(var i = 0 ; i < this.buzhangPanelArray.length;i++)
        {
            var panel = this.buzhangPanelArray[i];
            panel.x =  0;
            panel.y = posYNext;
            posYNext =  posYNext + panelHeight;
        }

        //碰框位置
        for(var i = 0 ; i < this.pengPanelArray.length;i++)
        {
            var panel = this.pengPanelArray[i];
            panel.x =  0;
            panel.y = posYNext;
            posYNext =  posYNext + panelHeight;
        }

        for(var i = 0 ; i < this.chiPanelArray.length;i++)
        {
            var panel = this.chiPanelArray[i];
            panel.x =  0;
            panel.y = posYNext;
            posYNext =  posYNext+panelHeight;
        }

        return posYNext;
    },

    showHandInCards: function () {
        this._super();
        var posHandCard = this.posHandCard();
        for(var i = 0 ; i < this.cardInList.length;i++)
        {
            var card = new CardRightShow(this.cardInList[i]);
            card.x  = 0;
            card.y = posHandCard + 5 + 26*i;

            this.panel_cardIn.addChild(card,100-i);
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
        var cardShow = new CardRightShow(handCards[i],CARD_SITE.RECORD);
        this.panel_cardIn.addChild(cardShow);
        this.cardInArray.push(cardShow);
      }
      this.cardInArray = this.cardInArray.sort(this.sortCardList);
      this.resetPanelInChild();
      for(var i=0;i<huHands.length;i++)
      {
        var cardShow = new CardRightShow(huHands[i],CARD_SITE.RECORD);
        var length = this.cardInArray.length;
        cardShow.setRotationX(5);
        cardShow.setScale(this.cardInArray[length-1].getScale()-0.05);
        cardShow.setPosition(this.recordMoCardPos());
        this.panel_cardIn.addChild(cardShow,40-handCards.length-i);
        this.cardInArray.push(cardShow);
      }
    },

    runRecordBuhuaOpAction: function (data) {
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
            var card = new CardRightShow(huapai[i],CARD_SITE.RECORD);
            if(MajhongInfo.MajhongNumber > 14)
            {
                card.setScale(CommonParam.Other17CardRecordScale);
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
      var cards = hall.getPlayingGame().record.rightHandCards;
      this.panel_cardIn.removeAllChildren();
        var allCards = new Array();
        for (var p in cards) {
            var arr = cards[p];
            for (var i = 0; i < arr.length; i++) {
                var card = new CardRightShow(arr[i],CARD_SITE.RECORD);
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

   playRecordSend:function(data)
   {
      JJLog.print('right play record send card');
      JJLog.print(data);
      var str = this.cardOfString(data);
      var putCard = null;
      if(str == this.moCard.paiOfCard().keyOfPai())
      {
        putCard = this.moCard;
      }

      if(putCard == null)
      {
        for(var i=0;i<this.cardInArray.length;i++)
        {
          if(str == this.cardInArray[i].paiOfCard().keyOfPai())
          {
            putCard = this.cardInArray[i];
            break;
          }
        }
      }

   },

  playRecordMoCard: function (data) {
    var card = new CardRightShow(data,CARD_SITE.RECORD);
    var length = this.cardInArray.length;
    card.setScale(this.cardInArray[length-1].getScale()-0.05);
    card.setPosition(this.recordMoCardPos());
    this.panel_cardIn.addChild(card);
    this.cardInArray.push(card);
    card.x = card.x - 30;
    card.runAction(cc.sequence(cc.moveTo(0.15,cc.p(card.x +30,card.y))
      ,cc.callFunc(this.postNextStep.bind(this))
    ));
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
    card.runAction(cc.sequence(cc.moveBy(0.15,cc.p(30,0.15)),cc.callFunc(this.removeOutHandCard.bind(this),card)
        ,cc.callFunc(this.resetPanelInChild.bind(this))
      ));

    var outCard = new MyCard(this,cardObj,true);
    var pos = this.posOfPanel();
    var outPos = this.panel_cardOut.convertToNodeSpace(pos);
    this.panel_cardOut.addChild(outCard ,500);
    outCard.setPosition(outPos);
    var soundData = {};
    soundData['cardType'] = this.cardOfString(cardObj);
    soundData['userSex'] = this.sexType;
    sound.playCard(soundData);

    var outCardRight = this.addCardOut(cardObj);
    var posTarget = outCardRight.getPosition();
    outCardRight.setPosition(this.posCenterCardOut);

    var spawnShow = cc.spawn(cc.moveTo(CommonParam.PutOut1stTime,this.posCenterCardOut),
      cc.scaleTo(CommonParam.PutOut1stTime,CommonParam.PutOutScale)
    );

    var order = this.panel_cardOut.getLocalZOrder();
    var order2 = this.panel_cardIn.getLocalZOrder();
    this.panel_cardOut.getParent().reorderChild(this.panel_cardOut,order+10);
    this.panel_cardOut.runAction(cc.sequence(
      cc.delayTime(1.0),
      cc.callFunc(function () {
        this.panel_cardOut.getParent().reorderChild(this.panel_cardOut,-1);
      }.bind(this))
    ));
    outCard.runAction(cc.sequence(
      spawnShow,cc.delayTime(CommonParam.ShowDelayTime),
      cc.callFunc(function () {
        this.removeFromParent();
      }.bind(outCard))));

    var delay = cc.delayTime(CommonParam.PutOut1stTime+CommonParam.ShowDelayTime);
    var spawnOut = cc.spawn(
      cc.moveTo(CommonParam.PutOut2ndTime,posTarget));

    outCardRight.runAction(cc.sequence(
      delay,cc.callFunc(function () {sound.playCardDown();}),
        cc.delayTime(0.1),
        cc.show(),spawnOut,
      cc.callFunc(function () {
        this.runIndicator();
      }.bind(outCardRight)),
      cc.callFunc(this.postNextStep.bind(this))
    ));
  },

    recordMoCardPos:function(){
      var card = this.cardInArray[this.cardInArray.length-1];
      return cc.p(card.x-card.getContentSize().width*card.getScaleX()*0.22,card.y+card.getContentSize().height*card.getScaleY()*0.6);
  },



  //新====================================
    recordAddGangPanel: function (cardObj) {
      var panelCell = this.pengPanel.clone();
      var height = panelCell.getContentSize().height;
      for(var i = 0 ; i < 4;i++)
      {
        var card = new CardRightShow(cardObj);
        card.x  = 0;
        card.y = 26*i;
        if(i == 3)
        {
          card.y = card.getContentSize().height - 2;
          panelCell.addChild(card,10,i);
        }else
        {
          panelCell.addChild(card,10-i,i);
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
        var outCard = new CardRightShow(key);
        var pos = this.posIndexOfOutCard();
        outCard.setPosition(pos);
        var num = this.cardOutArray.length;
        this.panel_cardOut.addChild(outCard,20-num);

        this.cardOutArray.push(outCard);
        outCard.showYellow();
      }
    },

  });
