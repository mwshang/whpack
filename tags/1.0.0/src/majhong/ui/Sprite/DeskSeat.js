/**
 * Created by atom on 2016/8/21.
 */
var DeskSeat = cc.Layer.extend({
  root: null,
  panel_root: null,
  panel_cardIn: null,
  panel_cardOut: null,
  panel_tip: null,
  pengPanel: null,
  node_show: null,

  gap_stand: 0,
  posXHandInCard: 0,
  posCenterCardOut: cc.p(0, 0),

  chiArray: null,
  chiPanelArray: null,
  pengPanelArray: null,
  pengArray: null,
  buzhangPanelArray: null,
  buzhangArray: null,

  uid: 0,
  moCard: null,
  cardInArray: null,
  cardOutArray: null,

  cardInList: null,//xianshi
  node_tip: null,
  panel_tianhu: null,
  deskType: DeskType.Other,
  info: '',
  sexType: 2,

  //replay
  panel_replay: null,
  isAlreadyTing: 0,
  gap_card: 0,
  ctor: function (data, info) {
    this._super();
    this.info = info;
    this.uid = data["uid"];
    if (MajhongInfo.GameMode == GameMode.PLAY) {

      this.sexType = data['userSex'];
    } else if (MajhongInfo.GameMode == GameMode.RECORD) {
      this.sexType = 1;
    }


    this.chiArray = new Array();
    this.chiPanelArray = new Array();
    this.pengPanelArray = new Array();
    this.pengArray = new Array();
    this.buzhangPanelArray = new Array();
    this.buzhangArray = new Array();
    this.cardOutArray = new Array();
    this.cardInArray = new Array();
    this.cardInList = new Array();
  },

  initUI: function () {
    //this.root = ccs.load("res/MajhongRighterPanel.json").node;
    //this.addChild(root);
    this.panel_root = ccui.helper.seekWidgetByName(this.root, "panel_root");
    this.pengPanel = ccui.helper.seekWidgetByName(this.panel_root, "panel_peng");
    this.panel_cardIn = ccui.helper.seekWidgetByName(this.panel_root, "panel_cardIn");
    this.panel_cardOut = ccui.helper.seekWidgetByName(this.panel_root, "panel_cardOut");
    this.node_show = ccui.helper.seekWidgetByName(this.panel_root, "node_show");
    this.node_tip = ccui.helper.seekWidgetByName(this.panel_root, "node_tip");
    this.node_tip.setLocalZOrder(20);
    this.posCenterCardOut = this.node_show.getPosition();

    this.panel_tianhu = ccui.helper.seekWidgetByName(this.panel_root, "panel_tianhu");
    if (this.panel_tianhu != undefined && this.panel_tianhu != null)
      this.panel_tianhu.setVisible(false);

    this.panel_replay = ccui.helper.seekWidgetByName(this.panel_root, "panel_replay");
    this.panel_replay.setVisible(false);
    this.panel_replay.getParent().reorderChild(this.panel_replay, 1000 + 10);
    if (MajhongInfo.GameMode == GameMode.RECORD) {
      var btn_chi = ccui.helper.seekWidgetByName(this.panel_replay, "btn_chi");
      btn_chi.setTag(OPERATIONTYPE.CHI);
      var btn_gang = ccui.helper.seekWidgetByName(this.panel_replay, "btn_gang");
      btn_gang.setTag(OPERATIONTYPE.GANG);
      var btn_peng = ccui.helper.seekWidgetByName(this.panel_replay, "btn_peng");
      btn_peng.setTag(OPERATIONTYPE.PENG);
      var btn_bu = ccui.helper.seekWidgetByName(this.panel_replay, "btn_bu");
      btn_bu.setTag(OPERATIONTYPE.BUZHANG);
      var btn_guo = ccui.helper.seekWidgetByName(this.panel_replay, "btn_guo");
      btn_guo.setTag(OPERATIONTYPE.GUO);
      var btn_hu = ccui.helper.seekWidgetByName(this.panel_replay, "btn_hu");
      btn_hu.setTag(OPERATIONTYPE.HU);

      var image_finger = ccui.helper.seekWidgetByName(this.panel_replay, "image_finger");
      image_finger.setTag(101);
      image_finger.setVisible(false);
    }
  },

  onEnter: function () {
    this._super();
    this.initUI();
    if (MajhongInfo.GameMode == GameMode.PLAY) {
      this.registerAllEvents();
    } else if (MajhongInfo.GameMode == GameMode.RECORD) {
      this.initRecordHandCards();
      this.registerRecordEvent();
    }


  },

  onExit: function () {
    this._super();
    this.isAlreadyTing = 0;
    if (MajhongInfo.GameMode == GameMode.PLAY) {
      this.removeAllEvents();
    } else if (MajhongInfo.GameMode == GameMode.RECORD) {
      this.removeRecordEvent();
      this.removeAllParam();
    }
  },

  removeAllParam: function () {
    this.cardInArray.splice(0,this.cardInArray.length);
    this.cardInArray = null;
    this.cardOutArray.splice(0,this.cardOutArray.length );
    this.cardOutArray = null;
    this.pengArray.splice(0,this.pengArray.length);
    this.pengArray = null;
    this.chiArray.splice(0,this.chiArray.length);
    this.chiArray = null;
    this.buzhangArray.splice(0,this.buzhangArray.length);
    this.buzhangArray = null;
    this.moCard = null;

    //this.chiArray = new Array();
    //this.chiPanelArray = new Array();
    //this.pengPanelArray = new Array();
    //this.pengArray = new Array();
    //this.buzhangPanelArray = new Array();
    //this.buzhangArray = new Array();
    //this.cardOutArray = new Array();
    //this.cardInArray = new Array();
    //this.cardInList = new Array();
  },

  registerAllEvents: function () {
    qp.event.listen(this, 'mjSendHandCards', this.onSendHandCards.bind(this));
    qp.event.listen(this, 'mjSyncPlayerMocards', this.onSyncPlayerMocards.bind(this));
    qp.event.listen(this, 'mjNotifyDelCards', this.onNotifyDelCards.bind(this));
    qp.event.listen(this, 'mjSyncDelCards', this.onSyncDelCards.bind(this));
    qp.event.listen(this, 'mjSyncPlayerOP', this.onSyncPlayerOP.bind(this));
    qp.event.listen(this, 'mjNiaoPai', this.onNiaoPai);
    qp.event.listen(this, 'mjSyncPlayerTianHu', this.onSyncPlayerTianHu);
  },

  removeAllEvents: function () {
    qp.event.stop(this, 'mjSendHandCards');
    qp.event.stop(this, 'mjNotifyDelCards');
    qp.event.stop(this, 'mjSyncPlayerMocards');
    qp.event.stop(this, 'mjSyncDelCards');
    qp.event.stop(this, 'mjSyncPlayerOP');
    qp.event.stop(this, 'mjNiaoPai');
    qp.event.stop(this, 'mjSyncPlayerTianHu');
  },

  onSyncPlayerTianHu: function (data) {
    //todo
  },

  playTianhuSound: function () {
    JJLog.print('playTianhuSound');
    JJLog.print(this);
    sound.playTianhu(this);
  },

  checkMsg: function (data) {
    if (data["uid"] == this.uid) {
      return true;
    }
    return false;
  },

  onNiaoPai: function (data) {
    if (data['lastUid'] == this.uid) {
      this.putInBirdCards(data);
    }
  },

  putInBirdCards: function (data) {

  },

  onSendHandCards: function (data) {
    this.setHandCards(data);
  },

  setHandCards: function (data) {
    // todo
  },

  setHandCardsBack:function()
  {

  },
  onNotifyDelCards: function (data) {
    JJLog.print("DeskSeat onNotifyDelCards");
  },


  onSyncDelCards: function (data) {
    // JJLog.print("DeskSeat onSyncDelCards");
    // JJLog.print(this.panel_cardIn.getContentSize().height, 'panel_cardIn');
    // JJLog.print(this.pengPanel.getContentSize().height, 'pengPanel');

    if (this.checkMsg(data)) {
      this.putOutCard(data);
      if (this.moCard != null) {
        this.moCard.removeFromParent();
        this.moCard = null;
      } else {
        this.removePutOutCard(data['msg']);
        this.resetPanelInChild();
      }
    }

    // JJLog.print(this.panel_cardIn.getContentSize().height, 'panel_cardIn1');
    // JJLog.print(this.pengPanel.getContentSize().height, 'pengPanel1');
  },

  onSyncPlayerOP: function (data) {
    JJLog.print("DeskSeat onSyncPlayerOP");
    this.synPlayerOp(data);
  },

  synPlayerOp: function (data) {
    var msg = data["msg"];
    var opType = msg["opType"];
    var opCard = msg["opCard"];


    if (data["uid"] == this.uid) {

      //播放 胡 碰 杠 声音
      var soundData = {};
      soundData['userSex'] = this.sexType;
      soundData['optionType'] = opType;
      sound.playOption(soundData);
      this.playTipAnimation(opType);

      switch (opType) {
        case OPERATIONNAME.CHI:
        {
          var cards = msg["cards"];

          for (var i = cards.length - 1; i >= 0; i--) {
            var opCardKey = opCard['type'] + opCard['value'];
            var cardKey = cards[i]['type'] + cards[i]['value'];
            if (opCardKey == cardKey)
            {
              cards.splice(i, 1);
              break;
            }
          }
          cards.splice(1, 0, opCard);
          this.removeChiCards(data);
          this.addChiCardsPanel(cards);
          this.resetPanelInChild();
        }
          break;
        case OPERATIONNAME.PENG:
        {
          var cards = msg["cards"];
          this.removePengCards(data);
          var sourceChair = msg["sourceChair"];
          this.addPengCardsPanel(opCard,sourceChair);
          this.resetPanelInChild();
        }
          break;
        case OPERATIONNAME.BUZHANG:
        {
          var cards = msg["cards"];
          this.removeBuzhangCards(data);
          var sourceChair = msg["sourceChair"];
          this.addBuzhangCardsPanel(opCard,msg["origin"],sourceChair);
          this.resetPanelInChild();
        }
          break;
        case OPERATIONNAME.GANG:
        {
          var cards = msg["cards"];

          this.removeGangCards(data);
          var sourceChair = msg["sourceChair"];
          this.addBuzhangCardsPanel(opCard,msg["origin"],sourceChair);
          this.resetPanelInChild();

          this.addGangCards(data);
        }
          break;
        case OPERATIONNAME.TING:
        {
          var cards = msg["cards"];
          this.isAlreadyTing = 1;
          this.setHandCardsBack();
          this.resetPanelInChild();
        }
          break;
        case OPERATIONNAME.HU:
        {
          var cards = msg["cards"];
          if (this.moCard) {
            this.moCard.removeFromParent();
            this.moCard = null;
          }
          //this.initCardList(data);
          //this.showHandInCards();
          this.addHu(msg);
          console.log(msg);
          data['userSex'] = this.sexType;
          this.playHuAniamtion(data);//播放胡牌动画和声音
        }
          break;

      }
    } else if (data["msg"]["sourceUid"] == this.uid) {
        if (opType != OPERATIONNAME.HU)
        {
          this.removeOutCard(data["msg"]["opCard"]);
        }
    }
  },

  getCardCount:function () {
    var numPanel = this.pengPanelArray.length + this.chiPanelArray.length + this.buzhangPanelArray.length;
    return numPanel*3 + this.cardInArray.length;
  },

  getShowPanelCount:function () {
    return this.pengPanelArray.length + this.chiPanelArray.length + this.buzhangPanelArray.length;
  },

  forceDisconnect:function () {
    cc.setTimeout(function() {
      var pomelo = window.pomelo;
      if (pomelo.connectState != 'disconnected') {
        pomelo.disconnect();
      }
    }, 100);
  },


  getFinal:function (a1,n,d) {
      return a1*n + n*(n-1)*d/2;
  },

  playTipAnimation: function (type) {
    //var tip = new OpTip(type);
    //this.node_tip.addChild(tip);
    //tip.setPosition(200,0);

    if (type == OPERATIONNAME.HU) return;
    cc.spriteFrameCache.addSpriteFrames(QZMajhongPlist.Word);

    var img1 = new ccui.ImageView(TipRes[type][1], ccui.Widget.PLIST_TEXTURE);
    img1.setScale(1.2);
    img1.setOpacity(50);
    var scale1 = cc.scaleTo(0.15, 0.8);
    var fadeIn1 = cc.fadeIn(0.2);
    img1.runAction(cc.sequence(
      cc.spawn(scale1, fadeIn1),
      cc.delayTime(0.1),
      cc.fadeOut(0.2),
      cc.removeSelf()
    ));

    // for (var i = 0; i < 2; i++) {
    //   var img2 = new ccui.ImageView(TipRes[type][1], ccui.Widget.PLIST_TEXTURE);
    //   img2.setVisible(false);
    //   img2.setScale(0.8);
    //   img2.setOpacity(100 + 155 * i);
    //   var scale2 = cc.scaleTo(0.8 - 0.5 * i, 1.2 + i * 0.1);
    //   var fadeOut2 = cc.fadeOut(0.8 - 0.5 * i);
    //   img2.runAction(cc.sequence(
    //     cc.delayTime(0.15),
    //     cc.show(),
    //     cc.delayTime(0.8 * i + 0.2),
    //     cc.spawn(scale2, fadeOut2),
    //     cc.removeSelf()
    //   ));
    //   this.node_tip.addChild(img2, i - 1);
    // }

    this.node_tip.addChild(img1, 10);


  },

  playHuAniamtion: function (data, test) {

    var cards = data['msg']['cards'];
    var delay = 0.5;
    var type = 1;
    var sexType = data['userSex'];

    var ziMo = false;
    if(data['msg']['sourceUid'] == data['uid'])
    {
      ziMo = true;
    }
    for (var i = 0; i < cards.length; i++) {
      //JJLog.print("胡牌信息="+JSON.stringify(data));
      type = cards[i]['type'];
      var huData = {};
      huData['huType'] = type;
      huData['userSex'] = sexType;
      huData['ziMo'] = ziMo;
      var hu = new QZDahuAnim(huData);
      this.node_tip.addChild(hu, 10);
      var size = hu.getContentSize();
      hu.setPosition(-size.width * 0.5, -size.height * 0.5);
      //hu.setVisible(false);
      //hu.runAction(cc.sequence(cc.delayTime(3.0),cc.removeSelf()));
      hu.runHuAnimation(delay);
      delay += MjTime.HU_SHOW_TIME;
    }


  },


  addGangCards: function (data) {

  },

  initCardList: function (data) {
    var cards = data['msg']['selfPaiQi'];
    for (var cardTag in cards) {
      var cardArray = cards[cardTag];
      for (var i = 0; i < cardArray.length; i++) {
        var key = cardArray[i];
        this.cardInList.push(key);
      }
    }

    var opCard = data['msg']['opCard'];
    this.cardInList.push(opCard);
  },

  showHandInCards: function () {
    for (var i = 0; i < this.cardInArray.length; i++) {
      var card = this.cardInArray[i];
      card.removeFromParent();
    }
    this.cardInArray.splice(0, this.cardInArray.length);

  },

  addHu: function (opCard) {

  },

  removeOutCard: function (msg) {
    var cardValue = msg["type"] + msg["value"];
    for (var i = this.cardOutArray.length - 1; i >= 0; i--) {
      var tmpCard = this.cardOutArray[i];
      if (cardValue == tmpCard.paiOfCard().keyOfPai()) {
        this.cardOutArray.splice(i, 1);
        tmpCard.removeFromParent();
        break;
      }
    }
  },

  posOfPanel: function () {
    var pos = cc.p(0, 0);
    if (this.moCard == null) {
      pos = this.panel_cardIn.convertToWorldSpace(this.firstCard().getPosition());
    }
    else {
      pos = this.panel_cardIn.convertToWorldSpace(this.moCard.getPosition());
    }
    return pos;
  },

  firstCard: function () {
    var card = this.cardInArray[this.cardInArray.length - 1];
    return card;
  },

  putOutCard: function (data) {
    //todo

  },

  posIndexOfOutCard: function () {
    //todo
  },

  onSyncPlayerMocards: function (data) {
    if (this.checkMsg(data)) {
      this.addMoCard();
    }
  },

  addMoCard: function () {

    if (this.moCard != null) {
      this.cardInArray.push(this.moCard);
      this.moCard = null;
      this.resetPanelInChild();
    }
  },

  removeChiCards: function () {
    this.removeHandInCard(2);

  },

  removePengCards: function () {
    this.removeHandInCard(2);
  },

  addBuzhangCardsPanel: function (cardObj) {
    var numPanel = this.getShowPanelCount();
    var key = cardObj['type'] + cardObj['value'];
    for (var i = 0; i < this.pengArray.length; i++) {
      var tmpKey = this.pengArray[i]['type'] + this.pengArray[i]['value'];
      if (key == tmpKey) {
        var panel = this.pengPanelArray[i];
        this.pengPanelArray.splice(i, 1);
          numPanel = panel.index;
        panel.removeFromParent();
        this.pengArray.splice(i, 1);
        break;
      }
    }
    return numPanel;
    //todo
  },

  removeGangCards: function (data) {

    if (this.moCard != null) {
      this.cardInArray.push(this.moCard);
      this.moCard = null;
    }

    var msg = data["msg"];
    var gang_type = msg["origin"];
    switch (gang_type) {
      case OPER_GANG_TYPE.GANG_AN: {
        this.removeHandInCard(4);
      }
        break;
      case OPER_GANG_TYPE.GANG_OTHER: {
        this.removeHandInCard(3);
      }
        break;
      case OPER_GANG_TYPE.GANG_MING: {
        this.removeHandInCard(1);
      }
    }
  },

  //add buzhang
  removeBuzhangCards: function (data) {

    if (this.moCard != null) {
      this.cardInArray.push(this.moCard);
      this.moCard = null;
    }

    var msg = data['msg'];
    var gang_type = 0;
    var opCard = msg['opCard'];
    var key = opCard['type'] + opCard['value'];
    for (var i = 0; i < msg['cards'].length; i++) {
      var tmpKey = msg['cards'][i]['pai']['type'] + msg['cards'][i]['pai']['value'];
      if (key == tmpKey) {
        gang_type = msg['cards'][i]['origin'];
        break;
      }
    }

    switch (gang_type) {
      case OPER_GANG_TYPE.GANG_AN:
      {
        this.removeHandInCard(4);
      }
        break;
      case OPER_GANG_TYPE.GANG_OTHER:
      {
        this.removeHandInCard(3);
      }
        break;
      case OPER_GANG_TYPE.GANG_MING:
      {
        this.removeHandInCard(1);
        for (var i = 0; i < this.pengArray.length; i++) {
          var tmpCard = this.pengArray[i];
          var tmpKey = tmpCard['type'] + tmpCard['value'];
          if (key == tmpCard) {
            this.pengArray.splice(i, 1);
            var panel = this.pengPanelArray[i];
            panel.removeFromParent();
            this.pengPanelArray.splice(i, 1);
            break;
          }
        }
      }
        break;
    }
  },


  removePutOutCard: function (card) {
    JJLog.print(this.panel_cardIn.getContentSize().height, 'panel_cardIn');
    JJLog.print(this.pengPanel.getContentSize().height, 'pengPanel');

    var last = this.cardInArray.length - 1;
    var card = this.cardInArray[last];
    if (card != null && card != undefined) {
      this.cardInArray.splice(last, 1);
      card.removeFromParent();
    }

    JJLog.print(this.panel_cardIn.getContentSize().height, 'panel_cardIn6');
    JJLog.print(this.pengPanel.getContentSize().height, 'pengPanel6');
  },

  removeHandInTargetCard: function (card) {
    var last = this.cardInArray.length - 1;
    var card = this.cardInArray[last];
    if (card != null && card != undefined) {
      this.cardInArray.splice(last, 1);
      card.removeFromParent();
    }
  },

  removeHandInCard: function (num) {
    var ori = this.cardInArray.length;
    for (var i = 0; i < num; i++) {
      var last = this.cardInArray.length - 1;
      var card = this.cardInArray[last];
      if (card != null && card != undefined) {
        this.cardInArray.splice(last, 1);
        card.removeFromParent();
      }
    }
    //JJLog.print("splice num：："+num+"ori:"+ori+"now"+this.cardInArray.length);
  },

  addChiCardsPanel: function (cards) {
    //todo
  },

  addPengCardsPanel: function (cardObj ,sourceChair) {
    //todo
  },

  resetPanelInChild: function () {
    //todo
  },

  posHandCard: function () {

  },

  posMoOfPanel: function () {
    //todo


  },

  sortCardList: function (cardA, cardB) {
    //********quanzhou*********
    if (cardA.getCardJin() != cardB.getCardJin())
    {
      return  cardB.getCardJin() - cardA.getCardJin();
    }
    else
    {
      return cardA.paiOfCard().numOfPai() - cardB.paiOfCard().numOfPai();
    }
    //---------quanzhou-----------
  },

  //
  getCardsFromData: function (data) {
    var pais = data['paiQi'];
    var arr = new Array();
    if (this.deskType == DeskType.Other) {
      for (var i = 0; i < data['paiQi']['num']; i++) {
        arr.push('0');
      }
      return arr;
    } else {

      for (var tag in pais) {
        var infoArray = pais[tag];
        for (var i = 0; i < infoArray.length; i++) {
          arr.push(infoArray[i]);
        }
      }
      return arr;
    }
  },

  checkOffline: function () {
    if (hall.getPlayingGame().table.isOffline) {
      this.initLastCards();
    }
  },

  initLastCards: function () {
    var info = hall.getPlayingGame().table.getCardByPlayer(this.uid);
    var cardOuts = info['paiChu'];
    var length = cardOuts.length > 3 ? 3 : cardOuts.length;
    for (var i = 0; i < cardOuts.length; i++) {
      this.addCardOut(cardOuts[i]);
    }

    var funcArr = info['paiDest']
    for (var k = 0; k < funcArr.length; k++) {
      var funcInfo = funcArr[k];
      var funcType = funcInfo['type'];

      switch (funcType) {
        case OPERATIONNAME.GANG:
        {
          var cardObj = funcInfo['pai'];
          this.addBuzhangCardsPanel(cardObj,funcInfo["origin"],funcInfo['sourceChair']);
        }
          break;
        case OPERATIONNAME.BUZHANG:
        {
          var cardObj = funcInfo['pai'];
          this.addBuzhangCardsPanel(cardObj,funcInfo["origin"],funcInfo['sourceChair']);
        }
          break;
        case OPERATIONNAME.PENG:
        {
          var cardObj = funcInfo['pai'];
          this.addPengCardsPanel(cardObj ,funcInfo['sourceChair']);
        }
          break;
        case OPERATIONNAME.CHI:
        {
          var cardArr = funcInfo['pai'];
          this.addChiCardsPanel(cardArr);
        }
          break;
      }
    }

    var cardArray = this.getCardsFromData(info);
    for (var i = 0; i < cardArray.length; i++) {
      this.addCardIn(cardArray[i]);
    }

    this.resetPanelInChild();
  },

  addCardIn: function (cardObj) {

  },

  addCardOut: function (cardObj) {

  },

  cardOfString: function (cardObj) {
    return cardObj['type'] + cardObj['value'];
  },

  getHuCards:function(msg)
  {
    var cards = new Array();
    for(var i=0;i<msg['cards'].length;i++)
    {
        var data = msg['cards'][i];
        var data2 = data['pais'];
        for(var j=0;j< data2.length;j++)
        {
          var obj = data2[j];
          var isContains = false;
          for (var k = 0; k < cards.length;k++)
          {
            if (this.cardOfString(obj) == this.cardOfString(cards[k]))
            {
              isContains = true;
              break;
            }
          }
          if(!isContains)
          {
            cards.push(obj);
          }
        }
    }
    return cards;
  },

  getHandCards:function(msg)
  {
    var info = msg['selfPaiQi'];
    var huCards = this.getHuCards(msg);

    var cards = new Array();
    for(var typeTag in info)
    {
      var data = info[typeTag];
      for(var i=0;i<data.length;i++)
      {
        var cardObj = data[i];
        var cardStr = this.cardOfString(data[i]);
        var isAdd = true;
        //for(var j=huCards.length-1;j>=0;j--)
        //{
        //  var cardStr2 = this.cardOfString(huCards[j]);
        //  if(cardStr2 == cardStr)
        //  {
        //    isAdd = false;
        //    huCards.splice(j,1);
        //    break;
        //  }
        //}

        if(isAdd) cards.push(cardObj);
      }
    }

    return cards;
  },


  recordOfHandCard: function () {
    return null;
  },

  //记录=======================


  playRecordSend: function (cardObj) {
    //todo
  },

  showRecordControlPanel: function (data) {
    for (var j = 1; j < 7; j++) {
      if (this.panel_replay.getChildByTag(j) != null) {
        this.panel_replay.getChildByTag(j).setEnabled(true);
        this.panel_replay.getChildByTag(j).setBright(true);
      }
    }

    var info = data;
    this.panel_replay.getChildByTag(OPERATIONTYPE.CHI).setEnabled(info['chi'].length > 0 ? true : false);
    this.panel_replay.getChildByTag(OPERATIONTYPE.CHI).setBright(info['chi'].length > 0 ? true : false);

    this.panel_replay.getChildByTag(OPERATIONTYPE.PENG).setEnabled(info['peng'] > 0 ? true : false);
    this.panel_replay.getChildByTag(OPERATIONTYPE.PENG).setBright(info['peng'] > 0 ? true : false);

    this.panel_replay.getChildByTag(OPERATIONTYPE.GANG).setEnabled(info['gang'].length > 0 ? true : false);
    this.panel_replay.getChildByTag(OPERATIONTYPE.GANG).setBright(info['gang'].length > 0 ? true : false);

    this.panel_replay.getChildByTag(OPERATIONTYPE.BUZHANG).setEnabled(info['bu'].length > 0 ? true : false);
    this.panel_replay.getChildByTag(OPERATIONTYPE.BUZHANG).setBright(info['bu'].length > 0 ? true : false);

    this.panel_replay.getChildByTag(OPERATIONTYPE.HU).setEnabled(info['hu'] > 0 ? true : false);
    this.panel_replay.getChildByTag(OPERATIONTYPE.HU).setBright(info['hu'] > 0 ? true : false);

    this.panel_replay.getChildByTag(OPERATIONTYPE.GUO).setEnabled(info['guo'] > 0 ? true : false);
    this.panel_replay.getChildByTag(OPERATIONTYPE.GUO).setBright(info['guo'] > 0 ? true : false);

    this.panel_replay.setVisible(true);
    if (data['end'] != undefined) {
      this.postNextStep();
    }
  },

  runRecordBuhuaOpAction: function (data) {

  },

  runRecordOpAction: function (data) {
    var opType = data['opType'];
    var tPos = cc.p(0, 0);
    var btn = null;
    switch (opType) {
      case OPERATIONNAME.GUO:
        btn = this.panel_replay.getChildByTag(OPERATIONTYPE.GUO);
        break;
      case OPERATIONNAME.GANG:
        btn = this.panel_replay.getChildByTag(OPERATIONTYPE.GANG);
        break;
      case OPERATIONNAME.PENG:
        btn = this.panel_replay.getChildByTag(OPERATIONTYPE.PENG);
        break;
      case OPERATIONNAME.CHI:
        btn = this.panel_replay.getChildByTag(OPERATIONTYPE.CHI);
        break;
      case OPERATIONNAME.BUZHANG:
        btn = this.panel_replay.getChildByTag(OPERATIONTYPE.BUZHANG);
        break;
      case OPERATIONNAME.HU:
        btn = this.panel_replay.getChildByTag(OPERATIONTYPE.HU);
        break;
      default :
        break;
    }
    tPos = btn.getPosition();
    btn.setScale(1.0);
    var image_finger = ccui.helper.seekWidgetByName(this.panel_replay, "image_finger");
    image_finger.setVisible(true);
    image_finger.setOpacity(255);
    image_finger.setPosition(tPos);
    image_finger.setScale(1.2);
    image_finger.runAction(cc.sequence(
      cc.scaleTo(0.1, 1.0),
      cc.delayTime(0.3),
      cc.fadeOut(0.1)));
//    var seqArr = new Array();
//    seqArr.push(cc.delayTime(0.2));
//    seqArr.push(cc.scaleTo(0.15, 0.8));
//    seqArr.push(cc.scaleTo(0.15, 1.0));
//    seqArr.push(cc.delayTime(0.3));
//    if (data['end'] != undefined) {
//      seqArr.push(cc.callFunc(this.postNextStep.bind(this)));
//    }

//    seqArr.push(cc.callFunc(this.disMissRecordControl.bind(this)));
//    var seq = new cc.sequence(seqArr);
//    btn.runAction(seq);

    if (data['end'] != undefined) {
        btn.runAction(cc.sequence(cc.delayTime(0.2),
            cc.scaleTo(0.15, 0.8),cc.scaleTo(0.15, 1.0),
            cc.delayTime(0.3),
            cc.callFunc(this.postNextStep.bind(this)),
            cc.callFunc(this.disMissRecordControl.bind(this))));
    }else{
        btn.runAction(cc.sequence(cc.delayTime(0.2),
            cc.scaleTo(0.15, 0.8),cc.scaleTo(0.15, 1.0),
            cc.delayTime(0.3),
            cc.callFunc(this.disMissRecordControl.bind(this))));
    }
  },

  runRecordOpResultAction: function (data) {
    var opType = data['opType'];
    switch (opType) {
      case OPERATIONNAME.GUO:
      {
        if (data['uid'] == this.uid) this.postNextStep();
      }
        break;
      case OPERATIONNAME.PENG:
      {
        if (data['uid'] == this.uid) {
          var soundData = {};
          soundData['userSex'] = this.sexType;
          soundData['optionType'] = opType;
          sound.playOption(soundData);
          this.playTipAnimation(opType);

          this.recordPengResp(data);
        }

        if (data['sourceUid'] == this.uid) {
          this.recordPengedResp(data);
        }

      }
        break;
      case OPERATIONNAME.CHI:
      {
        if (data['uid'] == this.uid) {
          var soundData = {};
          soundData['userSex'] = this.sexType;
          soundData['optionType'] = opType;
          sound.playOption(soundData);
          this.playTipAnimation(opType);

          this.recordChiResp(data);
        }

        if (data['sourceUid'] == this.uid) {
          this.recordChiedResp(data);
        }
      }
        break;
      case OPERATIONNAME.BUZHANG:
      {
        if (data['uid'] == this.uid) {
          var soundData = {};
          soundData['userSex'] = this.sexType;
          soundData['optionType'] = opType;
          sound.playOption(soundData);
          this.playTipAnimation(opType);

          this.recordBuzhangResp(data);
        }

        if (data['sourceUid'] == this.uid) {
          this.recordBuzhangedResp(data);
        }
      }
        break;
      case OPERATIONNAME.GANG:
      {
        if (data['uid'] == this.uid) {
          var soundData = {};
          soundData['userSex'] = this.sexType;
          soundData['optionType'] = opType;
          sound.playOption(soundData);
          this.playTipAnimation(opType);

          this.recordGangResp(data);
        }

        if (data['sourceUid'] == this.uid) {
          this.recordGangedResp(data);
        }
      }
        break;
      case OPERATIONNAME.HU:
      {
        if (data['uid'] == this.uid) {
          var soundData = {};
          soundData['userSex'] = this.sexType;
          soundData['optionType'] = opType;
          sound.playOption(soundData);
          this.playTipAnimation(opType);
          this.recordHu(data);
        }
      }
        break;
      default :
        break;
    }


  },


  disMissRecordControl: function () {
    this.panel_replay.setVisible(false);
  },
  postNextStep: function (dt) {
    var dtime = 0.1;
    if (dt != undefined) dtime = dt;
    this.schedule(this.delayStep, dtime);
  },

  delayStep: function (dt) {
    this.unschedule(this.delayStep);
    hall.getPlayingGame().record.postNextStep();
  },

  playRecordMoCard: function (data) {


  },

  createCard: function (obj) {

  },


  recordMoCardPos: function () {


  },

  recordMoCard: function (data) {


  },

  recordPutOutCard: function (data) {


  },

  //吃碰的
  recordPengResp: function (data) {
    JJLog.print('recordPengResp');
    JJLog.print(data);
    var opCard = data['opCard'];
    var opCardStr = this.cardOfString(opCard);
    var index = 0;

    for (var k = this.cardInArray.length - 1; k >= 0; k--) {
      var tmpCard2 = this.cardInArray[k].key;
      if (opCardStr == tmpCard2) {
        this.cardInArray[k].removeFromParent();
        this.cardInArray.splice(k, 1);
        index++;
        if (index >= 2) {
          break;
        }
      }
    }

    this.addPengCardsPanel(opCard ,data['sourceChair']);
    this.postNextStep(0.2);

    this.resetPanelInChild();
  },

  //被碰的
  recordPengedResp: function (data) {
    JJLog.print('recordPengedResp');
    JJLog.print(data);
    var opCardStr = this.cardOfString(data['opCard']);
    this.recordRemoveOutCard(opCardStr)

  },


  //吃吃的
  recordChiResp: function (data) {
    JJLog.print('recordChiResp');
    var cards = data['cards'];
    var opCard = data['opCard'];
    var opCardStr = this.cardOfString(opCard);

    var tmpCards = data['cards'];

    var index = 0;
    for (var i = 0; i < cards.length; i++) {
      var tmpCard = this.cardOfString(cards[i]);
      if (opCardStr == tmpCard) {
        continue;
      }
      for (var k = this.cardInArray.length - 1; k >= 0; k--) {
        var tmpCard2 = this.cardInArray[k].key;
        if (tmpCard == tmpCard2) {
          this.cardInArray[k].removeFromParent();
          this.cardInArray.splice(k, 1);
          break;
          //index++;
          //if (index >= 2) {
          //  break;
          //}
        }
      }
    }

    this.addChiCardsPanel(cards);
    this.resetPanelInChild();
    this.postNextStep();
  },

  //被吃的
  recordChiedResp: function (data) {
    JJLog.print('recordChiedResp');
    var opCardStr = this.cardOfString(data['opCard']);
    this.recordRemoveOutCard(opCardStr)
  },

  recordRemoveOutCard: function (cardStr) {
    if(cardStr['type'] != undefined) cardStr = this.cardOfString(cardStr);
    for (var i = this.cardOutArray.length-1; i >= 0; i++) {
      var card = this.cardOutArray[i];
      if (cardStr == card.key) {
        card.removeFromParent();
        this.cardOutArray.splice(i, 1);
        break;
      }
    }
  },

  recordRemoveHandCard: function (cardObj,removeAll) {
    if (this.moCard != null) {
      this.cardInArray.push(this.moCard);
      this.moCard = null;
    }
    var cardStr = this.cardOfString(cardObj);
    for (var i = this.cardInArray.length - 1; i >= 0; i--) {
      var card = this.cardInArray[i];
      var tmpCard = card.key;
      if (tmpCard == cardStr) {
        this.cardInArray.splice(i, 1);
        card.removeFromParent();
        if(removeAll == undefined || removeAll == false)
          break;
      }
    }
  },

  recordRemovePengCard:function(cardObj)
  {
    var key = this.cardOfString(cardObj);
    for (var i = 0; i < this.pengArray.length; i++) {
      var tmpCard = this.pengArray[i];
      var tmpKey = tmpCard['type'] + tmpCard['value'];
      if (key == tmpCard) {
        this.pengArray.splice(i, 1);
        var panel = this.pengPanelArray[i];
        panel.removeFromParent();
        this.pengPanelArray.splice(i, 1);
        break;
      }
    }
  },

  removeOutHandCard: function (card) {
    for (var i = 0; i < this.cardInArray.length; i++) {
      var tmpCard = this.cardInArray[i];
      if (tmpCard == card) {
        this.cardInArray.splice(i, 1);
        card.removeFromParent();
        break;
      }
    }
  },

  recordGangResp:function(data)
  {
    var opCard = data['opCard'];
    this.recordRemoveHandCard(opCard,true);
    this.recordRemovePengCard(opCard);

    this.recordAddGangPanel(opCard);
    this.recordGangYellowCards(data['cards']);
    this.resetPanelInChild();
    this.postNextStep();
  },

  recordAddGangPanel:function(cardObj)
  {
    //child to do

  },

  recordGangYellowCards: function (cardObj) {
    //child to do;
  },



  recordGangedResp:function(data)
  {
    this.recordRemoveOutCard(data['opCard']);
  },

  recordRemoveHandGangCards:function(data)
  {
      this.recordRemoveOutCard(data['opCard']);
  },




  recordBuzhangResp: function (data) {
    var opCard = data['opCard'];
    this.addBuzhangCardsPanel(opCard);
    this.recordRemoveHandinBuzhangCards(data);
    this.resetPanelInChild();
    this.postNextStep();
  },

  recordBuzhangedResp: function (data) {
    //var opCard = data['opCard'];
    //var msg = {};
    //msg['msg'] = data;
    this.recordRemoveHandinBuzhangCards(data);
    this.resetPanelInChild();
  },

  recordRemoveHandinBuzhangCards:function(data)
  {
    var gang_type = 0;
    var msg = data;
    var opCard = msg['opCard'];
    var key = opCard['type'] + opCard['value'];
    for (var i = 0; i < msg['cards'].length; i++) {
      var tmpKey = msg['cards'][i]['pai']['type'] + msg['cards'][i]['pai']['value'];
      if (key == tmpKey) {
        gang_type = msg['cards'][i]['origin'];
        break;
      }
    }

    switch (gang_type) {
      case OPER_GANG_TYPE.GANG_AN:
      {
        this.recordRemoveHandCard(opCard,true);
      }
        break;
      case OPER_GANG_TYPE.GANG_OTHER:
      {
        this.recordRemoveHandCard(opCard,true);
        this.recordRemovePengCard(opCard);
      }
        break;
      case OPER_GANG_TYPE.GANG_MING:
      {
        this.recordRemoveHandCard(opCard,true);
        this.recordRemovePengCard(opCard);
      }
        break;
    }
  },

  recordHu: function (data) {
    this.postNextStep();

  },

  recordNiao:function(data)
  {
    this.putInBirdCards(data);
  },

  registerRecordEvent: function () {
    var _this = this;
    var ls = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      eventName: CommonEvent.EVT_RECORD,
      callback: function (event) {
        var userData = event.getUserData();
        if(userData == null ) return;
        var evtId = userData['type'];
        switch (evtId) {
          case RecordType.SEND:
          {
            var uid = userData['uid'];
            if (_this.uid == uid) {
              _this.playRecordSend(userData['pai']);
            }
          }
            break;
          case RecordType.MO:
          {
            var uid = userData['uid'];
            if (_this.uid == uid) {
              _this.playRecordMoCard(userData['pai']);
            }
          }
            break;
          case RecordType.NOTIFY_OP:
          {
            var typeData = userData['notifyOP'];
            for (var i = 0; i < typeData.length; i++) {
              if (i == typeData.length - 1) {
                typeData[i]['end'] = 1;
              }
              var uid = typeData[i]['uid'];
              if (_this.uid == uid) {
                _this.showRecordControlPanel(typeData[i]);
              }
            }
          }
            break;
          case RecordType.SYSC_OP:
          {
            var typeData = userData['syncOP'];
            for (var i = 0; i < typeData.length; i++) {
              if (i == typeData.length - 1) {
                typeData[i]['end'] = 1;
              }
              var uid = typeData[i]['uid'];
              if (_this.uid == uid) {
                _this.runRecordOpAction(typeData[i]);
              }
            }
          }
            break;
          case RecordType.SYSC_OP_RESULT:
          {
            _this.disMissRecordControl();
            var typeData = userData['opResult'];
            _this.runRecordOpResultAction(typeData);
          }
            break;
          case RecordType.BIRD_CARDS:
          {
            var typeData = userData['niao'];
            var lastUid = typeData['lastUid'];
            if(_this.uid == lastUid)
            {
              _this.recordNiao(typeData);
            }
          }
            break;
          case RecordType.BUHUA:
          {
            var uid = userData['uid'];
            if (_this.uid == uid) {
              _this.runRecordBuhuaOpAction(userData['hua']);
            }
          }
            break;
        }
      }
    });
    _this._Listener = cc.eventManager.addListener(ls, this);
  },

  removeRecordEvent: function () {
    cc.eventManager.removeListener(this._Listener);
  },


});