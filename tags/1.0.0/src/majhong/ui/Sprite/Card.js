
/**
 * Created by atom on 2016/7/24.
 */
var Card = cc.Layer.extend({
  image_card: null,
  image_cardBG: null,
  pai: null,
  _Listener: null,
  _Listener2: null,
  type: null,
  jinType: CARD_JIN.NO,
  image_jin: null,
  key: null,
  tip_ting: null,
  text_count: null,
  canTouch: true,
  issetback: false,
  isNeedBlue: false,
  ctor: function (data) {
    this._super();
    if (data != undefined) {
      this.pai = new majhong.Pai(data);
      this.key = this.pai.key;
    }
  },
  removeFromParent: function () {
    JJLog.print('card removeFromParent');
    this.pai = null;
    this.image_card = null;

    this._super();
  },

  reloadCardIndex: function (cardIndex)
  {

  },
  showYellow: function () {
    if (this.type == CARD_SITE.HAND_IN) return;
    var color = {r: 255, g: 255, b: 0};
    if (this.image_card != null)
      this.image_card.setColor(color);
    if (this.image_cardBG != null)
      this.image_cardBG.setColor(color);
  },

  showBlue: function () {
    var color = {r:176, g:236, b:243};
    this.isNeedBlue = true;
    if (this.image_card != null)
      this.image_card.setColor(color);
    if (this.image_cardBG != null)
      this.image_cardBG.setColor(color);
  },

  showRed: function () {
      var color = {r:214, g:165, b:165};
      this.isNeedRed  = true;
      if (this.image_card != null)
          this.image_card.setColor(color);
      if (this.image_cardBG != null)
          this.image_cardBG.setColor(color);
  },

  showNormal: function () {
    if (this.isNeedBlue) this.showBlue();
    if(this.type == CARD_SITE.HAND_IN || this.isNeedBlue) return;
    this.canTouch = true;
    var color = {r:255, g:255, b:255};
    if (this.image_card != null)
      this.image_card.setColor(color);
    if (this.image_cardBG != null)
      this.image_cardBG.setColor(color);
    if (this.tip_ting != null)
      this.tip_ting.setVisible(false);
  },

  showWhite:function () {
    this.canTouch = true;
    if (this.isNeedBlue)
    {
      this.showBlue();
      return;
    }
    var color = {r:255, g:255, b:255};
    if (this.image_card != null)
      this.image_card.setColor(color);
    if (this.image_cardBG != null)
      this.image_cardBG.setColor(color);
    if (this.tip_ting != null)
      this.tip_ting.setVisible(false);
  },

  showTingTip:function (hutype) {
    if (this.tip_ting != null)
    {
      this.tip_ting.setVisible(true);
      this.tip_ting.loadTexture(QuanZhouHuTips[hutype],ccui.Widget.PLIST_TEXTURE);
      this.tip_ting.ignoreContentAdaptWithSize(true);
    }
  },

  showGray:function () {
    this.canTouch = false;
    var color = {r:100, g:100, b:100};
    if (this.image_card != null)
      this.image_card.setColor(color);
    if (this.image_cardBG != null)
      this.image_cardBG.setColor(color);
  },

  xuezhanShowGray:function () {
    var color = {r:100, g:100, b:100};
    if (this.image_card != null)
      this.image_card.setColor(color);
    if (this.image_cardBG != null)
      this.image_cardBG.setColor(color);
  },

  paiOfCard:function(){
    return this.pai;
  },
  //********quanzhou*********
  setJin:function(){
    this.jinType = CARD_JIN.YES;
    //显示金标志
    if(!!this.image_jin)
    {
      this.image_jin.setVisible(true)
    }
  },

  getCardJin:function(){
    return this.jinType;
  },
  //---------quanzhou-----------

  postTipEvt: function () {
    var event = new cc.EventCustom(CommonEvent.TipEvent);
    event.setUserData(this.pai.key);
    cc.eventManager.dispatchEvent(event);
  },

  postCancelEvt:function()
  {
    var event = new cc.EventCustom(CommonEvent.TipEvent);
    event.setUserData(CommonEventAction.TipCancel);
    cc.eventManager.dispatchEvent(event);
  },

  onEnter: function () {
    this._super();
    var _this = this;
    var ls = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      eventName: CommonEvent.TipEvent,
      callback: function(event){

        if(_this.pai != null)
        {
          var eventStr = event.getUserData();
          if(eventStr == CommonEventAction.TipCancel)
          {
            _this.showNormal();
            return ;
          }

          var  key = event.getUserData();
          if(key == _this.pai.key)
          {
            _this.showYellow();
          }else
          {
            _this.showNormal();
          }
        }

      }
    });
    this._Listener = cc.eventManager.addListener(ls,this);

    var ls2 = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      eventName: CommonEvent.ChangeCardBg,
      callback: function(event)
      {
       // _this.changeCardBg();
      }
    });
    this._Listener2 = cc.eventManager.addListener(ls2,this);
  },
  changeCardBg:function () {

  },
  onExit: function() {
    this._super();
    this.pai = null;
    this.image_card = null;
  },
  //********quanzhou*********
  resetcontentSize:function(root,scale)
  {
    var panel_card = ccui.helper.seekWidgetByName(root, "panel_card");
    panel_card.setScale(scale);
    var size = cc.size(root.getContentSize().width*scale,root.getContentSize().height*scale);
    root.setPosition(cc.p(0,0));
    this.setContentSize(size);
  },
  //---------quanzhou-----------
});

var OpenCard = Card.extend({
  image_indicator:null,
  text_cardCount:null,
  cardCount:1,
  cardIndex:0,
  ctor:function(data)
  {
    this._super(data);
  },
  removeFromParent: function() {
    this.image_indicator = null;
    this._super();
  },
  runIndicator: function () {
    if(this.image_indicator == null) return;

    this.postStopLastIndic();

    this.image_indicator.setVisible(true);
    var act1 = cc.moveBy(0.5, cc.p(0, 10));
    var act2 = act1.reverse();
    var act3 = cc.sequence(act1, act2);
    var act4 = act3.repeatForever();
    //this.image_indicator.runAction(cc.sequence(cc.delayTime(0.2),cc.fadeTo(0.2,200)));
    this.image_indicator.runAction(act4);
  },

  stopIndicator: function () {
    if(this.image_indicator == null) return;

    this.image_indicator.setVisible(false);
    this.image_indicator.stopAllActions();
  },

  postStopLastIndic:function()
  {
    var event = new cc.EventCustom(CommonEvent.Indicator);
    event.setUserData(CommonEventAction.Indicator_Stop);
    cc.eventManager.dispatchEvent(event);
  },

  addCardNum: function () {
    this.cardCount+= 1;
    this.text_cardCount.setString('0'+this.cardCount);
    this.text_cardCount.setVisible(true);
  },

  setCardNum:function(num)
  {
     this.cardCount = num;
     if(this.cardCount>1)
     {
       this.text_cardCount.setString('0'+this.cardCount);
       this.text_cardCount.setVisible(true);
     }
  },

  onEnter: function () {
    this._super();
    var _this = this;
    var ls = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      eventName: CommonEvent.Indicator,
      callback: function(event){
        //JJLog.print(event.getUserData());
        if(event.getUserData == CommonEventAction.Indicator_Start)
        {
          _this.runIndicator();
        }else if(event.getUserData() == CommonEventAction.Indicator_Stop)
        {
          _this.stopIndicator();
        }

      }
    });
    this._Listener = cc.eventManager.addListener(ls,this);
  },

  onExit: function() {
    this.image_indicator = null;
    this._super();
  },

  SetBack:function() {

  },
});

var MyCard = Card.extend({
  panel_card: null,
  selected: false,
  pos: null,
  valueNum: 0,
  playerPanel:null,
  mData:null,
  _rect:null,
  size:null,
  _touchListener:null,
  _mZOrder:null,
  _yLine:null,
  _localPos:null,
  touchBeginPos:null,
  canTouch:true,
  text_all:null,
  ctor: function (jPlayerPanel,data,disTouch) {
    this._super(data);
    var root = ccs.load("res/MajhongBase/MajhongCardDownStand.json").node;
    this.addChild(root);
    //this.mType = data["type"] + data["value"];
    this.mData = data;

    this.valueNum = majhong.PaiFace[this.key];
    this.panel_card = ccui.helper.seekWidgetByName(root, "panel_card");
    this.tip_ting = ccui.helper.seekWidgetByName(root, "image_tip");
    this.text_count = ccui.helper.seekWidgetByName(root, "text_count");
    this.text_all = ccui.helper.seekWidgetByName(root, "text_all");
    var scale = 1 ;
    if(MajhongInfo.MajhongNumber > 14)
    {
      scale = CommonParam.My17CardStandScale;
    }

    this.size = cc.size(root.getContentSize().width*scale,root.getContentSize().height*scale);
    root.setPosition(cc.p(0,0));
    this.playerPanel = jPlayerPanel;

    this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
    this.image_card.loadTexture(this.pai.frameImgStandOfPai(),ccui.Widget.PLIST_TEXTURE);
    this.image_card.ignoreContentAdaptWithSize(true);
    this.panel_card.setContentSize(this.size);
    this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
    this.panel_card.setScale(scale);
    this.setContentSize(this.size);
    this._rect = cc.rect(0, 0, this.size.width, this.size.height);
    this._yLine = this.size.height;
    this.pos = cc.p(this.size.width/2,this.size.height/2);
    this.panel_card.setPosition(this.pos);
    this.type = CARD_SITE.HAND_IN;
    //********quanzhou*********
    //显示金标志
    this.image_jin = ccui.helper.seekWidgetByName(root, "image_jin");
    if((MajhongInfo.GameMode == GameMode.PLAY && hall.getPlayingGame().table.JinPaiId == this.key) || (MajhongInfo.GameMode == GameMode.RECORD && hall.getPlayingGame().record.JinPaiId == this.key))
    {
      this.setJin();
    }
    if(disTouch == true)
    {
      this.canTouch = false;
    }
    //---------quanzhou-----------
  },
  changeCardBg:function () {

    this.image_cardBG.loadTexture('tileBase_me_'+CommonParam.PAICARDBACK+'.png',ccui.Widget.PLIST_TEXTURE);
  },
  setCardCount:function(count)
  {
    if(count > 4)
    {
      this.text_all.setVisible(true);
      this.image_card.setVisible(false);
      this.image_jin.setVisible(false);
    }else
    {
      if (this.text_count != null)
        this.text_count.setString(count+'张');
      this.text_count.setVisible(true);
    }

  },
  removeFromParent: function() {
    this.panel_card = null;
    this.image_card = null;

    this._super();
  },

  isOut: function (pos) {
    if(pos.y > this._yLine)
    {
      return true;
    }
    return false;
  },
  posOfPanel:function(){
    var pos  = this.getPosition();
    var size = this.getContentSize();
    return cc.p(pos.x + size.width*0.85,pos.y + size.height*0.5 - CommonParam.ShowUpCardHeight);
  },

  isSelected: function () {
    return this.selected;
  },

  playSelectedAnimation: function (ting) {
    var moveUp = cc.moveTo(CommonParam.MoveUpTime, cc.p(this.pos.x,
        this.pos.y+ CommonParam.ShowUpCardHeight));
    this.panel_card.runAction(moveUp);
    this.selected = true;
    if(ting == undefined)
    {
      this.postTipEvt();
    }
  },

  playResetAnimation:function(){
    var moveUp = cc.moveTo(CommonParam.MoveDownTime, this.pos);
    this.panel_card.runAction(moveUp);
    this.selected = false;
  },

  playInsertAnimation:function(){
    this.panel_card.setVisible(false);
    this.panel_card.setPosition(this.pos.x,this.pos.y + CommonParam.ShowUpCardHeight-10);
    var moveUp = cc.moveTo(CommonParam.MoveDownTime, this.pos);
    this.panel_card.runAction(cc.sequence(cc.delayTime(0.2),cc.show(),moveUp));
  },

  playEnterInAnimation:function(){
    this.panel_card.setVisible(false);
    this.panel_card.setOpacity(50);
    this.panel_card.setCascadeOpacityEnabled(true);
    this.panel_card.setPosition(this.pos.x,this.pos.y);
    //var moveUp = cc.moveTo(CommonParam.MoveDownTime, this.pos);
    var fadein = cc.fadeIn(CommonParam.MoveDownTime);
    this.panel_card.runAction(cc.sequence(cc.delayTime(0.2),cc.show(),fadein));

  },

  sendOneCard:function(){
    //this.playerPanel.clearLastSelectedCard();
    JJLog.print('点击');
    if(hall.getPlayingGame().table.JinPaiId == this.key)
    {
      if(hall.inTableId == 'com.qp.hall.majhongBD')      //暂时先用
      {
        var dialog = new JJMajhongDecideDialog2();
        dialog.setDes('确定打出百佬？');
        dialog.setCallback(function () {
          this.playerPanel.putOutGeBaiDa(this);
        }.bind(this));
        dialog.setCallback2(function () {
          this.playerPanel.putOutCardStart(this);
        }.bind(this));
        dialog.setCancelCal(function () {
          this.resetCard();
        }.bind(this));
        dialog.showDialog();

      }else
      {
        var dialog = new JJMajhongDecideDialog();
        dialog.setDes('确定打出金牌？');
        dialog.setCallback(function () {
          this.playerPanel.putOutCardStart(this);
        }.bind(this));
        dialog.setCancelCal(function () {
          this.resetCard();
        }.bind(this));
        dialog.showDialog();
      }

    }else
    {
        if(this.playerPanel.mCanPutCard)
        {
            this.playerPanel.putOutCardStart(this);
        }
        else
        {
            this.resetCard();
        }
    }
    this.postCancelEvt();
  },

  containsTouchLocation:function (touch) {
    var getPoint = touch.getLocation();
    var pos = this.convertToNodeSpace(getPoint);

    var myRect = this.rect();

    var result = cc.rectContainsPoint(myRect, pos);
    return result;
  },

  rect:function () {
    return cc.rect(0, 0, this.size.width, this.size.height);

  },

  onTouchBegan:function (touch, event) {

    console.log("ontouchBegan=====");
    var target = event.getCurrentTarget();
    if (!target.containsTouchLocation(touch) || !target.canTouch) return false;

    var touchPoint = touch.getLocation();
    var pos = target.convertToNodeSpace(touchPoint);
    target.touchBeginPos = pos;

    target.topOrder();
    if(target.isSelected())
    {

    }else
    {
      sound.playSelectCard();
      target.resetAllCard();
    }

    return true;
  },

  onTouchMoved:function (touch, event) {

    var target = event.getCurrentTarget();
    var touchPoint = touch.getLocation();
    var pos = target.convertToNodeSpace(touchPoint);
    var pos_f = target.pos;
    var panel = target.panel_card;

    if(GAMENAME == "qidong") {
        if ((Math.abs(pos.x - target.touchBeginPos.x) >= target.panel_card.width/3
                || Math.abs(pos.y - target.touchBeginPos.y) >= target.panel_card.width/3) )
        {
            var pos_f = target.pos;
            var panel = target.panel_card.__MOVECARD__;
            if(!panel)
            {
                panel = target.panel_card.clone();
                target.panel_card.parent.addChild(panel);
                target.panel_card.__MOVECARD__ = panel;
            }
            if(pos.y > target.pos.y)
            {
                panel.setPosition(pos);
            }else{
                panel.setPosition(pos_f.x,pos_f.y);
            }
        }
    } else {
        if(pos.y > target.pos.y)
        {
            panel.setPosition(pos);
        }else
        {
            panel.setPosition(pos_f.x,pos_f.y);
        }
    }
  },
  onTouchEnded:function (touch, event) {

    var target = event.getCurrentTarget();
   // var pos = target.touchBeginPos;
    var touchPoint = touch.getLocation();
    var pos = target.convertToNodeSpace(touchPoint);
    target.resetOrder();

    if(target.isSelected())
    {
      if(target.containsTouchBeginRect(pos))
      {
        target.sendOneCard();
      }else if(target.isOut(pos))
      {
        target.sendOneCard();
      }else
      {
        target.resetCard();
      }
    }else
    {
      if(target.containsTouchBeginRect(pos))
      {
        target.playSelectedAnimation();
      }else if(target.isOut(pos))
      {
        target.sendOneCard();
      }else
      {
        target.resetCard();
      }
    }
    if(GAMENAME == "qidong")
    {
        target.clearMoveCard();
    }
  },

  containsTouchBeginRect: function (endPos) {
    var f = 30;

    var recttmp = cc.rect(this.touchBeginPos.x-f, this.touchBeginPos.y-f,f, f);
    var result = cc.rectContainsPoint(recttmp, endPos);
    return  result;
  },

  resetCard: function () {
    if (this.panel_card != null)
      this.panel_card.setPosition(this.pos);
    this.selected = false;
  },

    /**
     * 清理上层拖动的copy的牌
     */
    clearMoveCard: function () {
        if(this.panel_card && this.panel_card.__MOVECARD__){
            this.panel_card.__MOVECARD__.removeFromParent();
            this.panel_card.__MOVECARD__ = null;
        }
    },

  resetAllCard: function () {
    //this.playerPanel.resetAllCard();
    var event = new cc.EventCustom(CommonEvent.ResetCardState);
    event.setUserData(this.pai);
    cc.eventManager.dispatchEvent(event);
  },

  topOrder: function () {
    this.getParent().reorderChild(this,100);
  },

  resetOrder: function () {
    this.getParent().reorderChild(this,this._mZOrder);
  },

  onEnter: function() {
    this._super();
    var _this = this;
    this._touchListener = cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: this.onTouchBegan,
      onTouchMoved: this.onTouchMoved,
      onTouchEnded: this.onTouchEnded
    }, this);
    this._mZOrder = this.getLocalZOrder();
    //this._localPos = this.panel_card.getPosition();


    var ls = cc.EventListener.create({
      event: cc.EventListener.CUSTOM,
      eventName: CommonEvent.ResetCardState,
      callback: function(event){
        var eventStr = event.getUserData();
        _this.resetCard();

      }
    });
    this._Listener = cc.eventManager.addListener(ls,this);
  },

  onExit: function() {
    cc.eventManager.removeListener(this._touchListener);
    this.panel_card = null;
    this.image_card = null;
    this._super();
  },

});

var CardRightStand = Card.extend({
  ctor: function (panel) {
    this._super();
    var root = ccs.load("res/MajhongBase/MajhongCardRightStand.json").node;
    this.addChild(root);
    this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
    //this.image_card.loadTexture('tileBack_right_'+CommonParam.PAICARDBACK+'.png',ccui.Widget.PLIST_TEXTURE);
    this.type = CARD_SITE.HAND_IN;
    if(MajhongInfo.MajhongNumber > 14)
    {
      this.resetcontentSize(root,CommonParam.Other17CardStandScale);
    }else
    {
      var size = root.getContentSize();
      this.setContentSize(size);
    }
  },

  changeCardBg:function () {

    //this.image_card.loadTexture('tileBack_right_'+CommonParam.PAICARDBACK+'.png',ccui.Widget.PLIST_TEXTURE);
  },

  posOfPanel:function(){
    var pos  = this.getPosition();
    var size = this.getContentSize();
    return pos;
  },

  removeFromParent: function() {
    this.image_card = null;
    this._super();
  },

  onExit: function() {
    this.image_card = null;
    this._super();
  },
});

var CardUpStand = Card.extend({
  ctor: function () {
    this._super();
    var root = ccs.load("res/MajhongBase/MajhongCardUpStand.json").node;
    this.addChild(root);
    this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
    this.type =  CARD_SITE.HAND_IN;
    if(MajhongInfo.MajhongNumber > 14)
    {
      this.resetcontentSize(root,CommonParam.UP17CardStandScale);
    }else
    {
      var size = root.getContentSize();
      this.setContentSize(size);
    }
  },
  changeCardBg:function () {

    //this.image_card.loadTexture('tileBack_up_'+CommonParam.PAICARDBACK+'.png',ccui.Widget.PLIST_TEXTURE);
  },
  posOfPanel:function(){
    var pos  = this.getPosition();
    var size = this.getContentSize();
    return pos;
    //return cc.p(pos.x + size.width*0.85,pos.y + size.height*0.5 - CommonParam.ShowUpCardHeight);
  },

  removeFromParent: function() {
    this.image_card = null;
    this._super();
  },

  onExit: function() {
    this.image_card = null;
    this._super();
  },
});

var CardLeftStand = Card.extend({
  ctor: function () {
    this._super();
    var root = ccs.load("res/MajhongBase/MajhongCardLeftStand.json").node;
    this.addChild(root);
    this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
    //this.image_card.loadTexture('tileBack_left_'+CommonParam.PAICARDBACK+'.png',ccui.Widget.PLIST_TEXTURE);
    this.type = CARD_SITE.HAND_IN;
    if(MajhongInfo.MajhongNumber > 14)
    {
      this.resetcontentSize(root,CommonParam.Other17CardStandScale);
    }else
    {
      var size = root.getContentSize();
      this.setContentSize(size);
    }
  },
  changeCardBg:function () {

    this.image_card.loadTexture('tileBack_left_'+CommonParam.PAICARDBACK+'.png',ccui.Widget.PLIST_TEXTURE);
  },
  posOfPanel:function(){
    var pos  = this.getPosition();
    var size = this.getContentSize();
    return pos;
    //return cc.p(pos.x + size.width*0.85,pos.y + size.height*0.5 - CommonParam.ShowUpCardHeight);
  },

  removeFromParent: function() {
    this.image_card = null;
    this._super();
  },

  onExit: function() {
    this.image_card = null;
    this._super();
  },
});

var CardShowUp = OpenCard.extend({
  ctor:function(data,type){
    this._super(data);
    var root = ccs.load("res/MajhongBase/MajhongCardDownShow.json").node;
    this.setCascadeOpacityEnabled(true);
    this.addChild(root);

    this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
    this.image_card.loadTexture(this.pai.frameImgDownOfPai(),ccui.Widget.PLIST_TEXTURE);
    this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
    var size = root.getContentSize();
    this.setContentSize(size);

    this.text_cardCount = ccui.helper.seekWidgetByName(root, "text_count");
    if(typeof(data) == 'object' && !!data['num'] && data['num']!= undefined)
    {
      this.setCardNum(data.num);
    }

    if(type != undefined && type != null)
      this.type = type;
    //显示金标志
    this.image_jin = ccui.helper.seekWidgetByName(root, "image_jin");
    if((MajhongInfo.GameMode == GameMode.PLAY && hall.getPlayingGame().table.JinPaiId == this.key) || (MajhongInfo.GameMode == GameMode.RECORD && hall.getPlayingGame().record.JinPaiId == this.key))
    {
      this.setJin();
    }
  },

  changeCardBg:function () {
    this.image_cardBG.loadTexture('tileBaseFinish_me_'+CommonParam.PAICARDBACK+'.png',ccui.Widget.PLIST_TEXTURE);
    if(this.issetback == true)
    {
      this.SetBack();
    }
  },
  SetBack:function() {
    if(this.image_cardBG)
    {
      this.issetback = true;
      this.image_cardBG.loadTexture(this.pai.frameImgDownBackOfPai(),ccui.Widget.PLIST_TEXTURE);
      this.image_card.setVisible(false);
    }

    if(!!this.image_jin)
    {
      this.image_jin.setVisible(false)
    }
  },

  posOfPanel:function(){
    var pos  = this.getPosition();
    var size = this.getContentSize();
    return pos;
  },

  removeFromParent: function() {
    this.image_card = null;

    this._super();
  },

  onExit: function() {
    this.image_card = null;
    this._super();
  },
});

var CardRightShow = OpenCard.extend({
  ctor: function (data,type) {
    this._super(data);
    var root = ccs.load("res/MajhongBase/MajhongCardRightShow.json").node;
    this.addChild(root);
    this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
    this.image_card.loadTexture(this.pai.frameImgRightShowOfPai(),ccui.Widget.PLIST_TEXTURE);
    this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
    var size = root.getContentSize();
    this.setContentSize(size);
    //显示金标志
    this.image_jin = ccui.helper.seekWidgetByName(root, "image_jin");
    if((MajhongInfo.GameMode == GameMode.PLAY && hall.getPlayingGame().table.JinPaiId == this.key) || (MajhongInfo.GameMode == GameMode.RECORD && hall.getPlayingGame().record.JinPaiId == this.key))
    {
      this.setJin();
    }
    this.text_cardCount = ccui.helper.seekWidgetByName(root, "text_count");
    if(typeof(data) == 'object' && !!data['num']&& data['num']!= undefined)
    {
      this.setCardNum(data.num);
    }
    var size = root.getContentSize();
    this.setContentSize(size);
    if(type != undefined && type != null)
    {
      this.type = type;
      if (MajhongInfo.MajhongNumber > 14 && type == CARD_SITE.RECORD) {
        this.resetcontentSize(root,CommonParam.Other17CardRecordScale);
      }
    }
  },

  changeCardBg:function () {
    this.image_cardBG.loadTexture('tileBase_leftRight_'+CommonParam.PAICARDBACK+'.png',ccui.Widget.PLIST_TEXTURE);
    if(this.issetback == true)
    {
      this.SetBack();
    }
  },
  SetBack:function() {
    if(this.image_cardBG)
    {
      this.issetback = true;
      this.image_cardBG.loadTexture(this.pai.frameImgRightBackOfPai(),ccui.Widget.PLIST_TEXTURE);
      this.image_card.setVisible(false);
    }
    if(!!this.image_jin)
    {
      this.image_jin.setVisible(false)
    }
  },

  removeFromParent: function() {
    this.image_card = null;
    this._super();
  },

  onExit: function() {
    this.image_card = null;
    this._super();
  },
});

var CardUpShow = OpenCard.extend({
  ctor: function (data,cardIndex,type) {
    this._super(data);
    var root = ccs.load("res/MajhongBase/MajhongCardUpShow.json").node;
    this.addChild(root);
    if(cardIndex>=card_indexs.length) cardIndex = card_indexs.length-1;
    this.cardIndex = card_indexs[GetCardDifferentIndex(cardIndex)];
    this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
    this.image_card.loadTexture(this.pai.frameImgUpShowOfPai(),ccui.Widget.PLIST_TEXTURE);
    this.image_card.ignoreContentAdaptWithSize(true);
    this.image_card.setRotationX(card_showSkewX[GetCardDifferentIndex(cardIndex)]);
    this.image_card.setPositionX(card_showPosX[GetCardDifferentIndex(cardIndex)]+2);

    this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
    this.image_cardBG.loadTexture("up"+this.cardIndex+".png",ccui.Widget.PLIST_TEXTURE);
    if(cardIndex > (MajhongInfo.MajhongNumber-2)/2) this.image_cardBG.setFlippedX(true);
    var size = root.getContentSize();
    this.setContentSize(size);
    //显示金标志
    this.image_jin = ccui.helper.seekWidgetByName(root, "image_jin");
    if((MajhongInfo.GameMode == GameMode.PLAY && hall.getPlayingGame().table.JinPaiId == this.key) || (MajhongInfo.GameMode == GameMode.RECORD && hall.getPlayingGame().record.JinPaiId == this.key))
    {
      this.setJin();
    }
    this.text_cardCount = ccui.helper.seekWidgetByName(root, "text_count");
    if(typeof(data) == 'object'&& !!data['num']&& data['num']!= undefined)
    {
      this.setCardNum(data.num);
    }
    if(type != undefined && type != null)
    {
      this.type = type;
      if (MajhongInfo.MajhongNumber > 14 && type == CARD_SITE.RECORD) {
        this.resetcontentSize(root,CommonParam.UP17CardRecordScale);
      }
    }
  },
  changeCardBg:function () {
    this.image_cardBG.loadTexture('tileBase_meUp_'+CommonParam.PAICARDBACK+'.png',ccui.Widget.PLIST_TEXTURE);
    if(this.issetback == true)
    {
      this.SetBack();
    }
  },

  SetBack:function(cardIndex) {
    if(this.image_cardBG)
    {
      this.issetback = true;
      this.image_cardBG.loadTexture(this.pai.frameImgUpBackOfPai(this.cardIndex),ccui.Widget.PLIST_TEXTURE);
      this.image_card.setVisible(false);
      if (cardIndex != undefined && cardIndex > (MajhongInfo.MajhongNumber-2)/2)this.image_cardBG.setFlippedX(true);
    }
  },

  reloadCardIndex:function(cardIndex)
  {
    if(cardIndex>=card_indexs.length) cardIndex = card_indexs.length-1;
    this.cardIndex = card_indexs[GetCardDifferentIndex(cardIndex)];
    if (this.issetback)
    {
      this.SetBack(cardIndex);
    }else
    {
      this.image_cardBG.loadTexture("up"+this.cardIndex+".png",ccui.Widget.PLIST_TEXTURE);
      this.image_card.setRotationX(card_showSkewX[GetCardDifferentIndex(cardIndex)]);
      this.image_card.setPositionX(card_showPosX[GetCardDifferentIndex(cardIndex)]+2);
      if(cardIndex > (MajhongInfo.MajhongNumber-2)/2)
        this.image_cardBG.setFlippedX(true);
      else
        this.image_cardBG.setFlippedX(false);
    }
  },

  removeFromParent: function() {
    this.image_card = null;

    this._super();
  },

  onExit: function() {
    this.image_card = null;
    this._super();
  },
});

var CardLeftShow = OpenCard.extend({
  ctor: function (data,type) {
    this._super(data);
    var root = ccs.load("res/MajhongBase/MajhongCardLeftShow.json").node;
    this.addChild(root);
    this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
    this.image_card.loadTexture(this.pai.frameImgLeftShowOfPai(),ccui.Widget.PLIST_TEXTURE);
    this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
    var size = root.getContentSize();
    this.setContentSize(size);
    
    //显示金标志
    this.image_jin = ccui.helper.seekWidgetByName(root, "image_jin");
    if((MajhongInfo.GameMode == GameMode.PLAY && hall.getPlayingGame().table.JinPaiId == this.key) || (MajhongInfo.GameMode == GameMode.RECORD && hall.getPlayingGame().record.JinPaiId == this.key))
    {
      this.setJin();
    }
    this.text_cardCount = ccui.helper.seekWidgetByName(root, "text_count");
    if(typeof(data) == 'object'&& !!data['num']&& data['num']!= undefined)
    {
      this.setCardNum(data.num);
    }
    if(type != undefined && type != null)
    {
      this.type = type;
      if (MajhongInfo.MajhongNumber > 14 && type == CARD_SITE.RECORD) {
        this.resetcontentSize(root,CommonParam.Other17CardRecordScale);
      }
    }
  },
  changeCardBg:function () {
    this.image_cardBG.loadTexture('tileBase_leftRight_'+CommonParam.PAICARDBACK+'.png',ccui.Widget.PLIST_TEXTURE);
    if(this.issetback == true)
    {
      this.SetBack();
    }
  },
  SetBack:function() {
    if(this.image_cardBG)
    {
      this.issetback = true;
      this.image_cardBG.loadTexture(this.pai.frameImgLeftBackOfPai(),ccui.Widget.PLIST_TEXTURE);
      this.image_card.setVisible(false);
    }
    if(!!this.image_jin)
    {
      this.image_jin.setVisible(false)
    }
  },

  removeFromParent: function() {
    this.image_card = null;
    this._super();
  },

  onExit: function() {
    this.image_card = null;
    this._super();
  },
});

var CardDownDesk = OpenCard.extend({
  ctor:function(data,cardIndex){
    this._super(data);
    if(cardIndex == null || cardIndex == undefined)
      cardIndex = 0;
    var ori = cardIndex;
    var root = ccs.load("res/MajhongBase/MajhongCardDownDesk.json").node;
    this.setCascadeOpacityEnabled(true);
    this.addChild(root);
    this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
    this.image_card.loadTexture(this.pai.frameImgDownDesk(),ccui.Widget.PLIST_TEXTURE);
    this.image_card.ignoreContentAdaptWithSize(true);
    if(cardIndex > 4)
    {
      ori = 9-cardIndex;
    }
    this.image_card.setRotationX(card_deskSkewX[cardIndex]);
    this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
    this.image_cardBG.loadTexture("down"+ori+".png",ccui.Widget.PLIST_TEXTURE);
    this.image_cardBG.ignoreContentAdaptWithSize(true);
    if(cardIndex > 4)
    {
      this.image_cardBG.setFlippedX(true);
    }
    var size = root.getContentSize();
    this.setContentSize(size);
    this.image_indicator = ccui.helper.seekWidgetByName(root, "image_indicator");
    this.image_indicator.setPositionX(indicator_Posx[cardIndex]);
    this.image_indicator.setVisible(false);

    if(typeof(data) == 'object' && !!data['num'] && data['num']!= undefined)
    {
      this.setCardNum(data.num);
    }

    //显示金标志
    this.image_jin = ccui.helper.seekWidgetByName(root, "image_jin");
    if(cardIndex >= 4)
    {
      if(!!this.image_jin)         //BG翻转以后金的位置就不对了  得调一下
      {
        this.image_jin.setPositionX(this.image_jin.getPositionX()-12);
        this.image_jin.setRotationX(-5);

      }
    }
    if((MajhongInfo.GameMode == GameMode.PLAY && hall.getPlayingGame().table.JinPaiId == this.key) || (MajhongInfo.GameMode == GameMode.RECORD && hall.getPlayingGame().record.JinPaiId == this.key))
    {
      this.setJin();
    }
  },

  changeCardBg:function () {
    this.image_cardBG.loadTexture('tileBaseFinish_me_'+CommonParam.PAICARDBACK+'.png',ccui.Widget.PLIST_TEXTURE);
    if(this.issetback == true)
    {
      this.SetBack();
    }
  },

  posOfPanel:function(){
    var pos  = this.getPosition();
    var size = this.getContentSize();
    return pos;
  },

  removeFromParent: function() {
    this.image_indicator = null;
    this.image_card = null;

    this._super();
  },

  onExit: function() {
    this.image_indicator = null;
    this.image_card = null;
    this._super();
  },
});

var CardRightDesk = OpenCard.extend({
  ctor:function(data,panelIndex){
    this._super(data);
    var root = ccs.load("res/MajhongBase/MajhongCardRightDesk.json").node;
    this.addChild(root);
    this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
    this.image_card.loadTexture(this.pai.frameImgRightShowOfPai(),ccui.Widget.PLIST_TEXTURE);
    this.image_card.ignoreContentAdaptWithSize(true);

    this.image_indicator = ccui.helper.seekWidgetByName(root, "image_indicator");
    this.image_indicator.setVisible(false);
    this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
    if(panelIndex == 1)
    {
      this.image_cardBG.loadTexture("left1.png",ccui.Widget.PLIST_TEXTURE);
      this.image_cardBG.ignoreContentAdaptWithSize(true);
    }

    var size = root.getContentSize();
    this.setContentSize(size);
    //显示金标志
    this.image_jin = ccui.helper.seekWidgetByName(root, "image_jin");
    if((MajhongInfo.GameMode == GameMode.PLAY && hall.getPlayingGame().table.JinPaiId == this.key) || (MajhongInfo.GameMode == GameMode.RECORD && hall.getPlayingGame().record.JinPaiId == this.key))
    {
      this.setJin();
    }
    this.text_cardCount = ccui.helper.seekWidgetByName(root, "text_count");
    if(typeof(data) == 'object' && !!data['num']&& data['num']!= undefined)
    {
      this.setCardNum(data.num);
    }
    var size = root.getContentSize();
    this.setContentSize(size);
  },

  changeCardBg:function () {
    this.image_cardBG.loadTexture('tileBase_leftRight_'+CommonParam.PAICARDBACK+'.png',ccui.Widget.PLIST_TEXTURE);
    if(this.issetback == true)
    {
      this.SetBack();
    }
  },
  SetBack:function() {
    if(this.image_cardBG)
    {
      this.issetback = true;
      this.image_cardBG.loadTexture(this.pai.frameImgRightBackOfPai(),ccui.Widget.PLIST_TEXTURE);
      this.image_card.setVisible(false);
    }
  },

  removeFromParent: function() {
    this.image_indicator = null;
    this.image_card = null;
    this._super();
  },

  onExit: function() {
    this.image_indicator = null;
    this.image_card = null;
    this._super();
  },
});

var CardUpDesk = OpenCard.extend({
  ctor:function(data,cardIndex){
    this._super(data);
    if(cardIndex == null || cardIndex == undefined)
      cardIndex = 0;
    var ori = cardIndex;
    var root = ccs.load("res/MajhongBase/MajhongCardUpDesk.json").node;
    this.addChild(root);
    this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
    this.image_card.loadTexture(this.pai.frameImgDownDesk(),ccui.Widget.PLIST_TEXTURE);
    this.image_card.ignoreContentAdaptWithSize(true);
    if(cardIndex > 4)
          ori = 9-cardIndex;
    this.image_card.setRotationX(card_deskSkewX[9-cardIndex]);
    this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
    this.image_cardBG.loadTexture("down"+ori+".png",ccui.Widget.PLIST_TEXTURE);
    this.image_cardBG.ignoreContentAdaptWithSize(true);
    if(cardIndex > 4) this.image_cardBG.setFlippedX(false);
    var size = root.getContentSize();
    this.setContentSize(size);
    this.image_indicator = ccui.helper.seekWidgetByName(root, "image_indicator");
    this.image_indicator.setPositionX(indicator_UpPosx[cardIndex]);
    this.image_indicator.setVisible(false);
    //显示金标志
    this.image_jin = ccui.helper.seekWidgetByName(root, "image_jin");
    if(cardIndex > 4)
    {
      if(!!this.image_jin)         //BG翻转以后金的位置就不对了  得调一下
      {
        this.image_jin.setPositionX(this.image_jin.getPositionX()+12);
        this.image_jin.setRotationX(-5);

      }
    }
    if((MajhongInfo.GameMode == GameMode.PLAY && hall.getPlayingGame().table.JinPaiId == this.key) || (MajhongInfo.GameMode == GameMode.RECORD && hall.getPlayingGame().record.JinPaiId == this.key))
    {
      this.setJin();
    }
    this.text_cardCount = ccui.helper.seekWidgetByName(root, "text_count");
    if(typeof(data) == 'object'&& !!data['num']&& data['num']!= undefined)
    {
      this.setCardNum(data.num);

    }
  },
  changeCardBg:function () {
    this.image_cardBG.loadTexture('tileBase_meUp_'+CommonParam.PAICARDBACK+'.png',ccui.Widget.PLIST_TEXTURE);
    if(this.issetback == true)
    {
      this.SetBack();
    }
  },

  removeFromParent: function() {
    this.image_indicator = null;
    this.image_card = null;

    this._super();
  },

  onExit: function() {
    this.image_indicator = null;
    this.image_card = null;
    this._super();
  },
});

var CardLeftDesk = OpenCard.extend({
  ctor:function(data,panelIndex){
    this._super(data);
    var root = ccs.load("res/MajhongBase/MajhongCardLeftDesk.json").node;
    this.addChild(root);
    this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
    this.image_card.loadTexture(this.pai.frameImgLeftShowOfPai(),ccui.Widget.PLIST_TEXTURE);
    this.image_card.ignoreContentAdaptWithSize(true);
    this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
    if(panelIndex == 1)
    {
      this.image_cardBG.loadTexture("left1.png",ccui.Widget.PLIST_TEXTURE);
      this.image_cardBG.ignoreContentAdaptWithSize(true);
    }
    var size = root.getContentSize();
    this.setContentSize(size);
    this.image_indicator = ccui.helper.seekWidgetByName(root, "image_indicator");
    this.image_indicator.setVisible(false);
    //显示金标志
    this.image_jin = ccui.helper.seekWidgetByName(root, "image_jin");
    if((MajhongInfo.GameMode == GameMode.PLAY && hall.getPlayingGame().table.JinPaiId == this.key) || (MajhongInfo.GameMode == GameMode.RECORD && hall.getPlayingGame().record.JinPaiId == this.key))
    {
      this.setJin();
    }
    this.text_cardCount = ccui.helper.seekWidgetByName(root, "text_count");
    if(typeof(data) == 'object'&& !!data['num']&& data['num']!= undefined)
    {
      this.setCardNum(data.num);
    }
  },
  changeCardBg:function () {
    this.image_cardBG.loadTexture('tileBase_leftRight_'+CommonParam.PAICARDBACK+'.png',ccui.Widget.PLIST_TEXTURE);
    if(this.issetback == true)
    {
      this.SetBack();
    }
  },
  SetBack:function() {
    if(this.image_cardBG)
    {
      this.issetback = true;
      this.image_cardBG.loadTexture(this.pai.frameImgLeftBackOfPai(),ccui.Widget.PLIST_TEXTURE);
      this.image_card.setVisible(false);
    }
  },

  removeFromParent: function() {
    this.image_indicator = null;
    this.image_card = null;
    this._super();
  },

  onExit: function() {
    this.image_indicator = null;
    this.image_card = null;
    this._super();
  },
});

var CardTip = OpenCard.extend({
  ctor:function(data){
    this._super(data);
    var root = ccs.load("res/MajhongBase/MajhongCardTip.json").node;
    this.setCascadeOpacityEnabled(true);
    this.addChild(root);

    this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
    this.image_card.loadTexture(this.pai.frameImgDownOfPai(),ccui.Widget.PLIST_TEXTURE);
    this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
    var size = root.getContentSize();
    this.setContentSize(size);

    this.text_cardCount = ccui.helper.seekWidgetByName(root, "text_count");
    if(typeof(data) == 'object' && !!data['num'] && data['num']!= undefined)
    {
      this.setCardNum(data.num);
    }

    //显示金标志
    this.image_jin = ccui.helper.seekWidgetByName(root, "image_jin");
    if((MajhongInfo.GameMode == GameMode.PLAY && hall.getPlayingGame().table.JinPaiId == this.key) || (MajhongInfo.GameMode == GameMode.RECORD && hall.getPlayingGame().record.JinPaiId == this.key))
    {
      this.setJin();
    }
  },

  SetBack:function() {
    if(this.image_cardBG)
    {
      this.image_cardBG.loadTexture(this.pai.frameImgDownBackOfPai(),ccui.Widget.PLIST_TEXTURE);
      this.image_card.setVisible(false);
    }
  },

  removeFromParent: function() {
    this.image_card = null;
    this._super();
  },

  onExit: function() {
    this.image_card = null;
    this._super();
  },
});


