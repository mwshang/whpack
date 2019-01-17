if(GAMENAME == "xyshisanshui")
{
  var SSSPokerCard = cc.Layer.extend({
    image_cardBG:null,
    image_point:null,
    image_color_b:null,
    image_color_s:null,
    image_jacker_point:null,
    image_jacker_color:null,
    pai:null,
    type:null,
    value:null,
    key:null,
    text_count:null,
    image_cardBGback :null,
    image_ma:null,
    ctor: function (data) {
      this._super();
      if(data != undefined)
      {
        this.pai = new SSSPoker.PokerPai(data);
        this.key = this.pai.key;
      }
    },
    removeFromParent: function() {
      JJLog.print('card removeFromParent');
      this.pai = null;
      this._super();
    },
    showYellow: function () {
      if(this.type == CARD_SITE.HAND_IN) return;
      var color = {r:255, g:255, b:0};
      if (this.image_cardBG != null)
        this.image_cardBG.setColor(color);

    },

    showNormal: function () {
      if(this.type == CARD_SITE.HAND_IN) return;
      var color = {r:255, g:255, b:255};
      if (this.panel_card != null)
        this.panel_card.setColor(color);
    },

    showWhite:function () {
      var color = {r:255, g:255, b:255};
      if (this.panel_card != null)
        this.panel_card.setColor(color);
    },

    showGray:function () {
      var color = {r:100, g:100, b:100};
      if (this.panel_card != null)
        this.panel_card.setColor(color);
    },

    paiOfCard:function(){
      return this.pai;
    },

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
    setMa:function(){
      //显示马标志
      if(!!this.image_ma)
      {
        this.image_ma.setVisible(true)
      }
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
    },

    onExit: function() {
      this._super();
      this.pai = null;
      this.image_card = null;
    }

  });

  var SSSMyPokerCard = SSSPokerCard.extend({
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
      var root = ccs.load(SSSXYPokerJson.PokerCard).node;
      this.addChild(root);
      this.mData = data;

      //this.valueNum = SSSPoker.PaiFace[this.key];
      this.panel_card = ccui.helper.seekWidgetByName(root, "panel_card");
      var scale = 1 ;

      scale = SSSCommonParam.My17CardStandScale;

      this.size = cc.size(root.getContentSize().width*scale,root.getContentSize().height*scale);
      root.setPosition(cc.p(0,0));
      this.playerPanel = jPlayerPanel;

      this.panel_card.setContentSize(this.size);
      this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");

      var size = root.getContentSize();
      this.setContentSize(this.size);
      this._rect = cc.rect(0, 0, this.size.width, this.size.height);
      this._yLine = this.size.height;
      this.pos = this.panel_card.getPosition();
      this.type = CARD_SITE.HAND_IN;

      this.image_ma = ccui.helper.seekWidgetByName(root, "image_ma");
      JJLog.print("牌key=" + JSON.stringify(this.key));
      if(MajhongInfo.GameMode == GameMode.PLAY && SSSPoker.table.maPaiId == this.key)
      {
        this.setMa();
      }

      this.image_point = ccui.helper.seekWidgetByName(root,"image_point");
      this.image_point.loadTexture(this.pai.pointImageOfPai(),ccui.Widget.PLIST_TEXTURE);
      this.image_color_b = ccui.helper.seekWidgetByName(root,"image_color_b");
      this.image_color_b.loadTexture(this.pai.colorImageOfPai(),ccui.Widget.PLIST_TEXTURE);
      this.image_color_s = ccui.helper.seekWidgetByName(root,"image_color_s");
      this.image_color_s.loadTexture(this.pai.colorImageOfPai(),ccui.Widget.PLIST_TEXTURE);
      this.image_cardBGback = ccui.helper.seekWidgetByName(root,"image_cardBG_back");
      this.image_cardBGback.setVisible(false);
    },

    SetBackside:function() {

      if(this.image_cardBGback)
      {
        this.image_cardBGback.setVisible(true);
      }
    },
    SetUpside:function() {
      if(this.image_cardBGback)
      {
        this.image_cardBGback.setVisible(false);
      }
    },
    removeFromParent: function() {
      this.panel_card = null;
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
      return cc.p(pos.x + size.width*0.85,pos.y + size.height*0.5 - SSSCommonParam.ShowUpCardHeight);
    },

    isSelected: function () {
      return this.selected;
    },

    playSelectedAnimation: function () {
      this.panel_card.stopAllActions();
      var moveUp = cc.moveTo(SSSCommonParam.MoveUpTime, cc.p(this.pos.x,
          this.pos.y+ SSSCommonParam.ShowUpCardHeight));
      this.panel_card.runAction(moveUp);
      this.selected = true;
      sound.playSound('res/audio/effect/audio_card_click.mp3');
    },

    playResetAnimation:function(){
      this.panel_card.stopAllActions();
      var moveUp = cc.moveTo(SSSCommonParam.MoveDownTime, this.pos);
      this.panel_card.runAction(moveUp);
      this.selected = false;
      // this.playerPanel.delPai(this);
    },

    playInsertAnimation:function(){
      this.panel_card.setVisible(false);
      this.panel_card.setPosition(this.pos.x,this.pos.y + SSSCommonParam.ShowUpCardHeight-10);
      var moveUp = cc.moveTo(SSSCommonParam.MoveDownTime, this.pos);
      this.panel_card.runAction(cc.sequence(cc.delayTime(0.2),cc.show(),moveUp));
    },

    playEnterInAnimation:function(){
      this.panel_card.setVisible(false);
      this.panel_card.setOpacity(50);
      this.panel_card.setCascadeOpacityEnabled(true);
      this.panel_card.setPosition(this.pos.x,this.pos.y);
      //var moveUp = cc.moveTo(SSSCommonParam.MoveDownTime, this.pos);
      var fadein = cc.fadeIn(SSSCommonParam.MoveDownTime);
      this.panel_card.runAction(cc.sequence(cc.delayTime(0.2),cc.show(),fadein));

    },

    sendOneCard:function(){
      //this.playerPanel.clearLastSelectedCard();
      if(SSSPoker.table.JinPaiId == this.key)
      {
        var dialog = new JJMajhongDecideDialog();
        dialog.setDes('确定打出金牌？');
        // dialog.setTitle('提示');
        dialog.setCallback(function () {
          this.playerPanel.putOutCardStart(this);
        }.bind(this));
        dialog.setCancelCal(function () {
          this.resetCard();
        }.bind(this));
        dialog.showDialog();
      }else
      {
        this.playerPanel.putOutCardStart(this);
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
      var target = event.getCurrentTarget();
      if (!target.containsTouchLocation(touch) || !target.canTouch) return false;
      var panel_pokerIn = ccui.helper.seekWidgetByName(target.playerPanel, "panel_pokerIn");
      var touchPoint = touch.getLocation();
      var pos = panel_pokerIn.convertToNodeSpace(touchPoint);
      target.touchBeginPos = pos;

      target.topOrder();
      if(target.isSelected())
      {
        //target.playResetAnimation();
      }else
      {
        // target.playSelectedAnimation();
      }
      target.onsetcolorgray(pos ,true);
      return true;
    },

    onTouchMoved:function (touch, event) {

      var target = event.getCurrentTarget();
      var touchPoint = touch.getLocation();
      var panel_pokerIn = ccui.helper.seekWidgetByName(target.playerPanel, "panel_pokerIn");
      var pos = panel_pokerIn.convertToNodeSpace(touchPoint);

      //JJLog.print("位置="+ pos.x + "       " +pos.y);
      //for(var i=0;i < 1280/13;i++)
      //{
      //  var recttmp = cc.rect(i, 0,(i*1280/13), 200);
      //  var result = cc.rectContainsPoint(recttmp, touchPoint);
      //  JJLog.print("===="+ result);
      //}
      //JJLog.print("===="+ target);
      //if(target.isSelected())
      //{
      //
      //}else
      //{
      //  target.playSelectedAnimation();
      //}
      //if(touchPoint.x >1180 && touchPoint.x < 1280)
      //{
      //  JJLog.print("===="+ 1);
      //
      //  if(target.isSelected())
      //  {
      //
      //  }else
      //  {
      //    target.onsetcolorgray(touchPoint);
      //  }
      //}

      target.onsetcolorgray(pos,false);

    },
    onsetcolorgray:function(move , isBegan )
    {
      this.playerPanel.checkSelpoker(move,move,isBegan);
    },

    onTouchEnded:function (touch, event) {

      var target = event.getCurrentTarget();
      var pos = target.touchBeginPos;
      var touchPoint = touch.getLocation();
      var panel_pokerIn = ccui.helper.seekWidgetByName(target.playerPanel, "panel_pokerIn");
      var pos = panel_pokerIn.convertToNodeSpace(touchPoint);
      target.resetOrder();

      //if(target.isSelected())
      //{
      //  if(target.containsTouchBeginRect(pos))
      //  {
      //    target.playResetAnimation();
      //  }
      //}else
      //{
      //  if(target.containsTouchBeginRect(pos))
      //  {
      //    target.playSelectedAnimation();
      //  }
      //}
      target.awadw(pos);
    },

    awadw:function(touchEnd)
    {
      this.playerPanel.checkSelCardEnd(touchEnd)
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

    resetAllCard: function () {
      //this.playerPanel.resetAllCard();
      // var event = new cc.EventCustom(CommonEvent.ResetCardState);
      // event.setUserData(this.pai);
      // cc.eventManager.dispatchEvent(event);
    },

    topOrder: function () {
      // this.getParent().reorderChild(this,100);
    },

    resetOrder: function () {
      //this.getParent().reorderChild(this,this._mZOrder);
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

  var SSSPokerShowUp = SSSPokerCard.extend({
    ctor:function(data,type){
      this._super(data);
      var root = ccs.load(SSSXYPokerJson.PokerShowUp).node;
      this.setCascadeOpacityEnabled(true);
      this.addChild(root);

      this.image_point = ccui.helper.seekWidgetByName(root,"image_point");
      this.image_point.loadTexture(this.pai.pointImageOfPai(),ccui.Widget.PLIST_TEXTURE);
      this.image_color_b = ccui.helper.seekWidgetByName(root,"image_color_b");
      this.image_color_b.loadTexture(this.pai.colorImageOfPai(),ccui.Widget.PLIST_TEXTURE);
      this.image_color_s = ccui.helper.seekWidgetByName(root,"image_color_s");
      this.image_color_s.loadTexture(this.pai.colorImageOfPai(),ccui.Widget.PLIST_TEXTURE);
      this.image_cardBGback = ccui.helper.seekWidgetByName(root,"image_cardBG_back");
      this.image_cardBGback.setVisible(false);

      this.image_ma = ccui.helper.seekWidgetByName(root, "image_ma");
      if(MajhongInfo.GameMode == GameMode.PLAY && SSSPoker.table.maPaiId == this.key)
      {
        this.setMa();
      }

      var size = root.getContentSize();
      this.setContentSize(size);

      if(type != undefined && type != null)
        this.type = type;

    },

    SetBackside:function() {

      if(this.image_cardBGback)
      {
        this.image_cardBGback.setVisible(true);
      }
    },
    SetUpside:function() {
      if(this.image_cardBGback)
      {
        this.image_cardBGback.setVisible(false);
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

  var SSSPokerStand = SSSPokerCard.extend({
    ctor: function (panel) {
      this._super();
      var root = ccs.load(SSSXYPokerJson.PokerStand).node;
      this.addChild(root);
      this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
      var size = root.getContentSize();
      this.setContentSize(size);
      this.type = CARD_SITE.HAND_IN;
    },

    changeCardBg:function () {

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
}else
{
  var SSSPokerCard = cc.Layer.extend({
    image_cardBG:null,
    pai:null,
    type:null,
    value:null,
    key:null,
    image_cardBGback :null,
    image_ma:null,
    ctor: function (data) {
      this._super();
      if(data != undefined)
      {
        this.pai = new SSSPoker.PokerPai(data);
        this.key = this.pai.key;
      }
    },
    removeFromParent: function() {
      JJLog.print('card removeFromParent');
      this.pai = null;
      this._super();
    },
    showYellow: function () {
      if(this.type == CARD_SITE.HAND_IN) return;
      var color = {r:255, g:255, b:0};
      if (this.image_cardBG != null)
        this.image_cardBG.setColor(color);
    },

    showNormal: function () {
      if(this.type == CARD_SITE.HAND_IN) return;
      var color = {r:255, g:255, b:255};
      if (this.panel_card != null)
        this.panel_card.setColor(color);
    },

    showWhite:function () {
      var color = {r:255, g:255, b:255};
      if (this.panel_card != null)
        this.panel_card.setColor(color);
    },

    showGray:function () {
      var color = {r:100, g:100, b:100};
      if (this.panel_card != null)
        this.panel_card.setColor(color);
    },

    paiOfCard:function(){
      return this.pai;
    },

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
    setMa:function(){
      //显示马标志
      if(!!this.image_ma)
      {
        this.image_ma.setVisible(true)
      }
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
    },

  });

  var SSSMyPokerCard = SSSPokerCard.extend({
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
      var root = ccs.load(SSSPokerJson.PokerCard).node;
      this.addChild(root);
      this.mData = data;
      this.panel_card = ccui.helper.seekWidgetByName(root, "panel_card");

      this.size = cc.size(root.getContentSize().width,root.getContentSize().height);
      root.setPosition(cc.p(0,0));
      this.playerPanel = jPlayerPanel;

      this.panel_card.setContentSize(this.size);
      this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
      this.image_cardBG.loadTexture(this.pai.imageOfPai(),ccui.Widget.PLIST_TEXTURE);
      this.setContentSize(this.size);
      this._rect = cc.rect(0, 0, this.size.width, this.size.height);
      this._yLine = this.size.height;
      this.pos = this.panel_card.getPosition();
      this.type = CARD_SITE.HAND_IN;

      this.image_ma = ccui.helper.seekWidgetByName(root, "image_ma");
      JJLog.print("牌key=" + JSON.stringify(this.key));
      if(MajhongInfo.GameMode == GameMode.PLAY && SSSPoker.table.maPaiId == this.key)
      {
        this.setMa();
      }

      this.image_cardBGback = ccui.helper.seekWidgetByName(root,"image_cardBG_back");
      this.image_cardBGback.setVisible(false);
                                             if(disTouch == true) this.canTouch = false;
    },

    SetBackside:function() {

      if(this.image_cardBGback)
      {
        this.image_cardBGback.setVisible(true);
      }
    },
    SetUpside:function() {
      if(this.image_cardBGback)
      {
        this.image_cardBGback.setVisible(false);
      }
    },
    removeFromParent: function() {
      this.panel_card = null;
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
      return cc.p(pos.x + size.width*0.85,pos.y + size.height*0.5 - SSSCommonParam.ShowUpCardHeight);
    },

    isSelected: function () {
      return this.selected;
    },

    playSelectedAnimation: function () {
      this.panel_card.stopAllActions();
      var moveUp = cc.moveTo(SSSCommonParam.MoveUpTime, cc.p(this.pos.x,
          this.pos.y+ SSSCommonParam.ShowUpCardHeight));
      this.panel_card.runAction(moveUp);
      this.selected = true;
      sound.playSound('res/audio/effect/audio_card_click.mp3');
    },

    playResetAnimation:function(){
      this.panel_card.stopAllActions();
      var moveUp = cc.moveTo(SSSCommonParam.MoveDownTime, this.pos);
      this.panel_card.runAction(moveUp);
      this.selected = false;
      // this.playerPanel.delPai(this);
    },

    playInsertAnimation:function(){
      this.panel_card.setVisible(false);
      this.panel_card.setPosition(this.pos.x,this.pos.y + SSSCommonParam.ShowUpCardHeight-10);
      var moveUp = cc.moveTo(SSSCommonParam.MoveDownTime, this.pos);
      this.panel_card.runAction(cc.sequence(cc.delayTime(0.2),cc.show(),moveUp));
    },

    playEnterInAnimation:function(){
      this.panel_card.setVisible(false);
      this.panel_card.setOpacity(50);
      this.panel_card.setCascadeOpacityEnabled(true);
      this.panel_card.setPosition(this.pos.x,this.pos.y);
      //var moveUp = cc.moveTo(SSSCommonParam.MoveDownTime, this.pos);
      var fadein = cc.fadeIn(SSSCommonParam.MoveDownTime);
      this.panel_card.runAction(cc.sequence(cc.delayTime(0.2),cc.show(),fadein));

    },

    sendOneCard:function(){
      //this.playerPanel.clearLastSelectedCard();
      if(SSSPoker.table.JinPaiId == this.key)
      {
        var dialog = new JJMajhongDecideDialog();
        dialog.setDes('确定打出金牌？');
        // dialog.setTitle('提示');
        dialog.setCallback(function () {
          this.playerPanel.putOutCardStart(this);
        }.bind(this));
        dialog.setCancelCal(function () {
          this.resetCard();
        }.bind(this));
        dialog.showDialog();
      }else
      {
        this.playerPanel.putOutCardStart(this);
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
      var target = event.getCurrentTarget();
      if (!target.containsTouchLocation(touch) || !target.canTouch) return false;
      var panel_pokerIn = ccui.helper.seekWidgetByName(target.playerPanel, "panel_pokerIn");
      var touchPoint = touch.getLocation();
      var pos = panel_pokerIn.convertToNodeSpace(touchPoint);
      target.touchBeginPos = pos;

      target.topOrder();
      if(target.isSelected())
      {
        //target.playResetAnimation();
      }else
      {
        // target.playSelectedAnimation();
      }
      target.onsetcolorgray(pos ,true);
      return true;
    },

    onTouchMoved:function (touch, event) {

      var target = event.getCurrentTarget();
      var touchPoint = touch.getLocation();
      var panel_pokerIn = ccui.helper.seekWidgetByName(target.playerPanel, "panel_pokerIn");
      var pos = panel_pokerIn.convertToNodeSpace(touchPoint);
      target.onsetcolorgray(pos,false);

    },
    onsetcolorgray:function(move , isBegan )
    {
      this.playerPanel.checkSelpoker(move,move,isBegan);
    },

    onTouchEnded:function (touch, event) {

      var target = event.getCurrentTarget();
      var pos = target.touchBeginPos;
      var touchPoint = touch.getLocation();
      var panel_pokerIn = ccui.helper.seekWidgetByName(target.playerPanel, "panel_pokerIn");
      var pos = panel_pokerIn.convertToNodeSpace(touchPoint);
      target.resetOrder();
      target.awadw(pos);
    },

    awadw:function(touchEnd)
    {
      this.playerPanel.checkSelCardEnd(touchEnd)
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

    resetAllCard: function () {
    },

    topOrder: function () {
    },

    resetOrder: function () {
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

  var SSSPokerShowUp = SSSPokerCard.extend({
    ctor:function(data,type){
      this._super(data);
      var root = ccs.load(SSSPokerJson.PokerShowUp).node;
      this.setCascadeOpacityEnabled(true);
      this.addChild(root);

      this.image_cardBG = ccui.helper.seekWidgetByName(root, "image_cardBG");
      this.image_cardBG.loadTexture(this.pai.imageOfPai(),ccui.Widget.PLIST_TEXTURE);

      this.image_cardBGback = ccui.helper.seekWidgetByName(root,"image_cardBG_back");
      this.image_cardBGback.setVisible(false);

      this.image_ma = ccui.helper.seekWidgetByName(root, "image_ma");
      if(MajhongInfo.GameMode == GameMode.PLAY && SSSPoker.table.maPaiId == this.key)
      {
        this.setMa();
      }

      var size = root.getContentSize();
      this.setContentSize(size);

      if(type != undefined && type != null)
        this.type = type;

    },

    SetBackside:function() {

      if(this.image_cardBGback)
      {
        this.image_cardBGback.setVisible(true);
      }
    },
    SetUpside:function() {
      if(this.image_cardBGback)
      {
        this.image_cardBGback.setVisible(false);
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

  var SSSPokerStand = SSSPokerCard.extend({
    ctor: function (panel) {
      this._super();
      var root = ccs.load(SSSPokerJson.PokerStand).node;
      this.addChild(root);
      this.image_card = ccui.helper.seekWidgetByName(root, "image_card");
      var size = root.getContentSize();
      this.setContentSize(size);
      this.type = CARD_SITE.HAND_IN;
    },

    changeCardBg:function () {

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
}
