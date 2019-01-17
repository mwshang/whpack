/**
 * Created by chenhua on 2017/11/9.
 */
var BigPkCardSprite = ccui.ImageView.extend({

    ctor: function (data) {
        this._super();
        this._cardData = -1;  //扑克数据
        this._cardValue = 0; //  --扑克牌值
        this._cardColor = 0;//    --扑克颜色，
        this._cardWord1 = null;//   --牌的数字1
        this._cardWord2 = null;//   --牌的数字2
        this._cardPoint = cc.p(0,0);//牌需要显示的位置坐标
        this._bAddInNode = false;//--是否添加在了桌面上
        this._bMoved = false;//--是否被搓牌移动过
        this._bMoved = false;//扑克牌的层次
        this._nZOrder = 0;
        this.resetCardData(data);
    },

    resetCardData: function (cardData) {
        if (getCardId(cardData) == getCardId(this._cardData)) {
            return;
        }

        this._cardData = cardData;
        this._cardValue = cardData["value"];
        this._cardColor = cardData["type"];

        var cardDiFileName = "";
        var cardWordFileName = "";
        var pathRoot = "res/PokerNiuNiu/Resoures/BigCard_res/";


        cardDiFileName = pathRoot + BigCardOfValue(this._cardData);
        cardWordFileName =  BigCardWordOfValue(this._cardData);
        this.loadTexture(cardDiFileName, ccui.Widget.LOCAL_TEXTURE);
        //LOCAL_TEXTURE PLIST_TEXTURE

        var posArr = [
            cc.p(8, 570),
            //cc.p(304, 140)
            //cc.p(380, 12)
            cc.p(342, 76)
        ];



        if (this._cardWord1 == null) {
            this._cardWord1 = new ccui.ImageView(cardWordFileName, ccui.Widget.PLIST_TEXTURE);
            this._cardWord1.setAnchorPoint(cc.p(0, 1));
            this._cardWord1.setPosition(posArr[0]);
            this.addChild(this._cardWord1);

        } else {
            this._cardWord1.loadTexture(cardWordFileName, ccui.Widget.PLIST_TEXTURE);
        }

        if (this._cardWord2 == null) {
            this._cardWord2 = new ccui.ImageView(cardWordFileName, ccui.Widget.PLIST_TEXTURE);

            //this._cardWord2.setAnchorPoint(cc.p(0, 1));
            this._cardWord2.setPosition(posArr[1]);
            this.addChild(this._cardWord2);

            this._cardWord2.setRotation(180);

        } else {
            this._cardWord2.loadTexture(cardWordFileName, ccui.Widget.PLIST_TEXTURE);
        }

    },

    getCardRect: function () {
        var cardRect = this.getBoundingBox();
    },

    setCardWordShow: function (isShow, appearTime) {
        if (isShow) {
            if (this._cardWord1 != null) {
                this._cardWord1.stopAllActions();
                this._cardWord1.setVisible(true);

                //if (appearTime != undefined && appearTime > 0) {
                //    this._cardWord1.setOpacity(0);
                //    this._cardWord1.runAction(cc.fadeIn(appearTime));
                //}
            }

            if (this._cardWord2 != null) {
                this._cardWord2.stopAllActions();
                this._cardWord2.setVisible(true);

                //if (appearTime != undefined && appearTime > 0) {
                //    this._cardWord2.setOpacity(0);
                //    this._cardWord2.runAction(cc.fadeIn(appearTime));
                //}
            }

        } else {
            //if (this._cardWord1 != null) {
            //    this._cardWord1.stopAllActions();
            //    this._cardWord1.setVisible(false);
            //}
            //
            //if (this._cardWord2 != null) {
            //    this._cardWord2.stopAllActions();
            //    this._cardWord2.setVisible(false);
            //}
        }


    },

    setCardShowInfo: function (pointX, pointY, zOrder){
        this._cardPoint.x = pointX;
        this._cardPoint.y = pointY;
        this._nZOrder = zOrder;
        this.setVisible(true);
    },

    showCardInNode:function(cardNode) {
        //添加牌到节点上
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