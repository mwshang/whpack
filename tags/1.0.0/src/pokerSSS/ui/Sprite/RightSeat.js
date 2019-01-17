/**
 * Created by atom on 2016/8/21.
 */
var SSSRightSeat = SSSDeskSeat.extend({

    ctor: function (data) {
      this._super(data, 'rightseat');
      this.root = ccs.load(SSSPokerJson.RightPanel).node;
      this.addChild(this.root);

      this.gap_stand = 13;

    },

    onEnter: function () {
      this._super();

      this.checkOffline();
    },

  addCardIn: function (cardObj) {
    var card = new SSSPokerStand();
    var length = this.cardInArray.length;
    this.cardInArray.push(card);
    this.panel_cardIn.addChild(card,20-length);
  },


    setHandCards: function (data) {
        this._super();

        this.panel_cardIn.removeAllChildren();
        var cardInSize = this.panel_cardIn.getContentSize();
        for(var i = 0 ; i < 13;i++){
            var card = new SSSPokerStand();
            card.setPosition(this.gap_stand*i, 0);
            card.setVisible(false);
            this.panel_cardIn.addChild(card,20-i);
            this.cardInArray.push(card);
        }
        var delay = 0.2;
        for (var i= 5 ; i >=0   ; i--) {

            this.onPokermove(i,delay);
            delay += 0.2;
        }
        delay =0;
        for (var i = 6 ; i < 13 ; i++) {

            this.onPokermove(i,delay);
            delay += 0.2;
        }


    },

    onPokermove:function(index ,delay)
    {
        // JJLog.print("位置== " + index + '延迟=' + delay );
        var _this = this;
        //_this.cardInArray[index].runAction(cc.sequence(cc.delayTime(delay),cc.moveTo(0.1,cc.p(_this.getIndexPosX(_this.cardInArray[index], index),0))));
        _this.cardInArray[index].runAction(cc.sequence(cc.delayTime(delay),cc.callFunc(function ()
        {

        }),cc.show()));
    },
    initUI:function()
    {
        this._super();
    },
    resetPanelInChild: function () {

        var info = SSSPoker.table.getCardByPlayer(this.uid);

        if(info['isPutCard'] > 0)   //理完牌了
        {
            for (var i =0 ; i < this.cardInArray.length ; i++)
            {
                var card = this.cardInArray[i];
                var size = card.getContentSize();
                var x = 0;
                var y = 0;
                if (i < 3) {
                    x = size.width * i - 50 * i + 30;
                    y = 40;

                } else if (i >= 3 && i < 8) {
                    x = size.width * (i - 3) - 50 * (i - 3);
                    y = 0;

                } else {
                    x = size.width * (i - 8) - 50 * (i - 8);
                    y = -40;

                }
                card.setPosition(x, y);

                this.panel_cardIn.reorderChild(card,20+i);
            }
        }
        else
        {
            //手牌位置
            for(var i = 0;i < this.cardInArray.length ; i++)
            {
                var card = this.cardInArray[i];
                card.x = this.gap_stand*i;
                //card.y = posYNext/2 + this.gap_stand*i ;
                card.y = 0 ;
                this.panel_cardIn.reorderChild(card,20+i);
            }


        }



    },

  });
