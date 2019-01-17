/**
 * Created by chenhua on 2017/11/12.
 */

var PkCardSprite_Color_Type=  {
    kBlackCard:1,
    kRedCard:2,
}

var PkCardSprite = ccui.ImageView.extend({
    //创建变量
    _cardData: -1,   //扑克数据
    _cardValue : 0,    //扑克牌值
    _cardColor :0,    //扑克颜色，1方块，2梅花，3红桃，4黑桃
    _colorType : PkCardSprite_Color_Type.kBlackCard,   //扑克颜色类型

    _CardSelectSprite : null, //选择的盖面

    _cardPoint :cc.p(0,0),  //麻将牌需要显示的位置坐标
    _bAddInNode :false, //是否添加在了桌面上
    _bMoved :false, //是否被搓牌移动过
    _bSelected : false, //是否被选择
    _nZOrder : 0,  //扑克牌的层次
    ctor:function(cardData){
        this._super();
        this.initCard(cardData);


    },
    
    initCard: function (cardData) {
        //this._cardData = 0;
        //this._cardColor = 0;
        //this._colorType = PkCardSprite_Color_Type.kBlackCard;
        //this._CardSelectSprite = null;
        //
        //this._cardPoint = cc.p(0,0);
        //this._bAddInNode = false;
        //this._bMoved = false;
        //this._nZOrder = 0;

        //设置牌面
        //this._cardData = -1;
        this.loadTexture("0x4F.png",ccui.Widget.PLIST_TEXTURE);
        this.resetCardData(cardData);

        //添加选中的牌面
        //var selectPicName = "card_selected.png";
        //this._CardSelectSprite = new ccui.ImageView(selectPicName,ccui.Widget.PLIST_TEXTURE);
        //this._CardSelectSprite.setAnchorPoint(cc.p(0,0));
        //this._CardSelectSprite.setPosition(cc.p(0,0));
        //this._CardSelectSprite.setVisible(false);
        //this.addChild(this._CardSelectSprite,1);
    },

    resetCardData:function(cardData) {
        //验证是否有必要重置
        //if (getCardId(cardData) == getCardId(this._cardData)) {
        //    return;
        //}

        //设置变量
        this._cardData = cardData;
        this._cardValue = cardData["value"];
        var cardType = cardData["type"];

        //扑克颜色类型
        this._colorType = PkCardSprite_Color_Type.kBlackCard;
        if(cardType == 1 || cardType == 3){
            this._colorType = PkCardSprite_Color_Type.kRedCard;
        }

        //设置牌面
        if(cardData == 0){
            this.loadTexture("nn_paibei.png",ccui.Widget.PLIST_TEXTURE);
        }else{
            this.loadTexture(SmallCardOfValue(cardData),ccui.Widget.PLIST_TEXTURE);
        }
    },

    resetToMoveCard: function () {
        //设置变量
        this._cardData = -1;
        this._cardValue = 0;
        this._cardColor = 0;

        //设置牌面
        //显示移动牌的背面
        this.loadTexture("nn_paibei.png",ccui.Widget.PLIST_TEXTURE);
    },
    
    getCardRect: function () {
        var cardRect = this.getBoundingBox();
        return cardRect;
    },

    //设置牌的显示信息
     setCardShowInfo: function (pointX, pointY, zOrder){
        this._cardPoint.x = pointX;
        this._cardPoint.y = pointY;
        this._nZOrder = zOrder;

        this.setVisible(true);
    },

    setCardSelectShow: function (isShow) {
        if(this._CardSelectSprite != null){
            this._CardSelectSprite.setVisible(false);
        }
    },

    showCardInNode:function(cardNode){
        // 添加牌到节点上
        if (this._bAddInNode == false) {
            cardNode.addChild(this);
            this._bAddInNode = true;
        }

        //设置牌显示
        this.setVisible(true);

        //设置牌的坐标和层次
        this.setPosition(this._cardPoint);
        this.setLocalZOrder(this._nZOrder);
    }
});