/**
 * Created by atom on 2016/9/11.
 */
var SSSSelfSeat = SSSDeskSeat.extend({
    panel_cardInTouch: null,
    panel_control: null,
    panel_guo: null,
    btn_guo: null,
    panel_controlCell: null,
    gangMode: false,
    gap_panel: 0,
    gap_cardStand: 62, //62
    delCard: null,
    qihu_tip: false,//弃胡提示
    isAction: false,
    opArray: null,
    outArray: null,
    testNum: 1,
    isdahu: 0,
    huDate: null,
    //罗松
    ShiSanShui: null,
    panel_pokercontrol: null,               //选牌界面
    paiQi: null,                             //手牌
    paiLast: null,                          //剩下的牌
    paiChoice: null,
    panelpokerIn: null,
    pokerInArrys: null,
    choiceArrys: null,
    btn_chupai: null,                       //出牌按钮
    btn_allcancel: null,                     //取消所有牌
    btn_duizi: null,                        //对子按钮
    btn_liangdui: null,                     //两对按钮
    btn_santiao: null,                       //三条按钮
    btn_shunzi: null,                        //顺子按钮
    btn_tonghua: null,                       //同花按钮
    btn_hulu: null,                          //葫芦按钮
    btn_tiezhi: null,                        //铁枝按钮
    btn_tonghuashun: null,                   //同花顺按钮
    btn_wutong: null,                        //五同按钮
    panel_pokertou: null,                   //头道牌
    panel_pokerzhong: null,                 //中道牌
    panel_pokerwei: null,                   //尾道牌
    btn_touchoose: null,                    //放上头道牌按钮
    btn_zhongchoose: null,                  //放上中道牌按钮
    btn_weichoose: null,                    //放上尾道牌按钮
    btn_toucancel: null,                   //取消头道牌按钮
    btn_zhongcancel: null,                  //取消中道牌按钮
    btn_weicancel: null,                   //取消尾道牌按钮
    touchoiceArray: null,                    //头道牌数组
    zhongchoiceArray: null,                  //中道牌数组
    weichoiceArray: null,                   //尾道牌数组
    img_wulongtip: null,                     //乌龙提示

    text_clock: null,                        //倒计时

    img_ontoutype: null,
    img_onzhongtype: null,
    img_onweitype: null,

    panel_btnchupai: null,
    panel_touch: null,
    data2: null,
    paisShow: null,
    iswulong: false,                        //是否乌龙

    pokerpanel_bg: null,                    //点击空白取消选牌

    paiQi2: null,                             //第二套手牌

    ctor: function (data) {
        this._super(data, 'selfseat');
        this.root = ccs.load(SSSPokerJson.PlayerPanel).node;
        this.addChild(this.root);
        this.opArray = new Array();
        this.outArray = new Array();
        this.gap_stand = 38;
        this.deskType = DeskType.Player;

        if (SSSPoker.table.wang > 0) {
            this.ShiSanShui = new ShiSanShuiLaiZi(SSSPoker.table.area, SSSPoker.table.wanfa);
        } else {
            this.ShiSanShui = new ShiSanShui(SSSPoker.table.area, SSSPoker.table.wanfa);
        }
    },
    onEnter: function () {
        this._super();
        this.initSelfUI();
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.registerSelfEvent();
            this.checkOffline();
        } else if (MajhongInfo.GameMode == GameMode.RECORD) {

        }

    },

    onExit: function () {
        this.removeSelfEvent();
        this.stopClock();
        this._super();
    },

    registerSelfEvent: function () {
        qp.event.listen(this, 'mjNotifyPlayerOP', this.onNotifyPlayerOP.bind(this));

        //********quanzhou*********

        var ls3 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEventAction.PLAYEROP_EVT,
            callback: this.opEvent.bind(this)
        });
        cc.eventManager.addListener(ls3, this);


        //---------quanzhou-----------
    },

    removeSelfEvent: function () {
        qp.event.stop(this, 'mjNotifyPlayerOP');
    },


    initSelfUI: function () {
        this.panel_cardInTouch = ccui.helper.seekWidgetByName(this.root, "panel_cardInTouch");

        //罗松
        this.panel_pokercontrol = ccui.helper.seekWidgetByName(this.root, "panel_pokercontrol");
        this.panel_pokercontrol.setVisible(false);

        this.panel_touch = ccui.helper.seekWidgetByName(this.root, "panel_touch");
        this.panel_touch.setTouchEnabled(false);

        this.text_clock = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "text_clock");

        this.panelpokerIn = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "panel_pokerIn");

        this.pokerInArrys = new Array();
        this.choiceArrys = new Array();

        this.btn_chupai = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_chupai");
        this.btn_chupai.addClickEventListener(function () {
            this.onClickchupai();

        }.bind(this));
        this.btn_allcancel = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_allcancle");
        this.btn_allcancel.addClickEventListener(function () {
            this.onclickAllcancel();

        }.bind(this));

        this.btn_duizi = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_type2");
        this.btn_duizi.addClickEventListener(function () {
            this.onClickBntChoose(ShuiType.ONE_DOUBLE);

        }.bind(this));
        this.btn_liangdui = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_type3");
        this.btn_liangdui.addClickEventListener(function () {
            this.onClickBntChoose(ShuiType.TWO_DOUBLE);

        }.bind(this));
        this.btn_santiao = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_type4");
        this.btn_santiao.addClickEventListener(function () {
            this.onClickBntChoose(ShuiType.THREE);

        }.bind(this));
        this.btn_shunzi = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_type5");
        this.btn_shunzi.addClickEventListener(function () {
            this.onClickBntChoose(ShuiType.MIXED_FLUSH);

        }.bind(this));
        this.btn_tonghua = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_type6");
        this.btn_tonghua.addClickEventListener(function () {
            this.onClickBntChoose(ShuiType.FIVE_FLUSH);

        }.bind(this));
        this.btn_hulu = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_type7");
        this.btn_hulu.addClickEventListener(function () {
            this.onClickBntChoose(ShuiType.THREE_DOUBLE);

        }.bind(this));
        this.btn_tiezhi = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_type8");
        this.btn_tiezhi.addClickEventListener(function () {
            this.onClickBntChoose(ShuiType.FOUR_ONE);

        }.bind(this));
        this.btn_tonghuashun = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_type9");
        this.btn_tonghuashun.addClickEventListener(function () {
            this.onClickBntChoose(ShuiType.STRAIGHT_FLUSH);

        }.bind(this));
        this.btn_wutong = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_type10");
        this.btn_wutong.addClickEventListener(function () {
            this.onClickBntChoose(ShuiType.FIVE_SAME);

        }.bind(this));

        this.btn_touchoose = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_touchoose");
        this.btn_touchoose.setTouchEnabled(true);
        this.btn_touchoose.addClickEventListener(function () {
            this.onchooseTouPoker();

        }.bind(this));
        this.btn_zhongchoose = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_zhongchoose");
        this.btn_zhongchoose.setTouchEnabled(true);
        this.btn_zhongchoose.addClickEventListener(function () {
            this.onchooseZhongPoker();

        }.bind(this));

        this.btn_weichoose = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_weichoose");
        this.btn_weichoose.setTouchEnabled(true);
        this.btn_weichoose.addClickEventListener(function () {
            this.onchooseWeiPoker();

        }.bind(this));
        this.btn_toucancel = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_toucancel");
        this.btn_toucancel.addClickEventListener(function () {
            this.onTouPokercancel();

        }.bind(this));

        this.btn_zhongcancel = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_zhongcancel");
        this.btn_zhongcancel.addClickEventListener(function () {
            this.onZhongPokercancel();

        }.bind(this));
        this.btn_weicancel = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_weicancel");
        this.btn_weicancel.addClickEventListener(function () {
            this.onWeiPokercancel();

        }.bind(this));

        this.panel_pokertou = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "panel_pokertou");
        this.panel_pokerzhong = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "panel_pokertzhong");
        this.panel_pokerwei = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "panel_pokerwei");


        this.img_wulongtip = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "img_wulongtip");
        this.img_wulongtip.setVisible(false);

        this.panel_btnchupai = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "panel_btnchupai");
        this.panel_btnchupai.setVisible(false);

        this.img_ontoutype = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "img_ontoutype");
        this.img_ontoutype.setVisible(false);
        this.img_onzhongtype = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "img_onzhongtype");
        this.img_onzhongtype.setVisible(false);
        this.img_onweitype = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "img_onweitype");
        this.img_onweitype.setVisible(false);

        this.pokerpanel_bg = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "pokerbg");

        this.pokerpanel_bg.addClickEventListener(function () {
            this.onclickbgCancel();

        }.bind(this));


        this.touchoiceArray = new Array();
        this.zhongchoiceArray = new Array();
        this.weichoiceArray = new Array();

        this.paiLast = new Array();

        if ((SSSPoker.table.SEAT_TOTAL < 7 && SSSPoker.table.shuangJiang == 0) || (SSSPoker.table.SEAT_TOTAL < 4 && SSSPoker.table.shuangJiang == 1)) {
            var node = ccui.helper.seekWidgetByName(this.root, "node_player");
            node.setPositionX(200);
        }

    },

    setCardInTouchEnable: function (enable) {
        this.panel_cardInTouch.setVisible(!enable);
    },


    setHandCards: function (data) {

        if (this.paiQi2 == null && data.uid != hall.user.uid) {
            this.paiQi2 = data;
            return;
        }

        var index = 0;
        this.panel_cardIn.removeAllChildren();
        this.paiQi = data['paiQi'];
        for (var p in this.paiQi) {
            var card = new SSSPokerShowUp(this.paiQi[p]);
            var size = card.getContentSize();
            card.setPosition(cc.p(size.width * index - this.gap_cardStand * index, 0));
            card.SetBackside();
            card.setVisible(false);
            //card.runAction(cc.moveTo(5,cc.p(size.width * index - this.gap_cardStand * index,0)));
            this.cardInArray.push(card);
            this.panel_cardIn.addChild(card, index);
            // this.panel_cardIn.reorderChild(card ,50-index);
            index++;
        }

        //this.cardInArray = this.cardInArray.sort(this.sortCardList);


        //var layout = new ccui.Layout();
        //layout.setContentSize(this.getContentSize());
        //this.addChild(layout);

        console.log("#############@@@@@@@@@@@@@@@@@");
        sound.playSound('res/audio/effect/audio_start.mp3');

        ccs.armatureDataManager.addArmatureFileInfo('res/PokerSSS/Resoures/effect/NewAnimation.ExportJson');

        var Animation = new ccs.Armature('NewAnimation');

        Animation.getAnimation().setSpeedScale(0.8);

        Animation.setPosition(cc.p(640, 360));
        Animation.getAnimation().play('kaishi');

        this.addChild(Animation);

        var delay = 0;
        var _this = this;


        //for (var i = 0 ; i <  6  ; i++) {
        //  var card = new PokerShowUp(this.paiQi[i]);
        //  var size = card.getContentSize();
        //  card.setPosition(70, 0);
        //  card.SetBackside();
        //  this.cardInArray.push(card);
        //  this.panel_cardIn.addChild(card);
        //  this.onPokermove(i,delay);
        //  delay += 0.1;
        //}
        //delay = 0;
        //
        //for (var i = 6 ; i <  13  ; i++) {
        //  var card = new PokerShowUp(this.paiQi[i]);
        //  var size = card.getContentSize();
        //  card.setPosition(70, 0);
        //  card.SetBackside();
        //  this.cardInArray.push(card);
        //  this.panel_cardIn.addChild(card);
        //  this.onPokermove(i,delay);
        //  delay += 0.1;
        //}
        delay = 0.4;
        for (var i = 5; i >= 0; i--) {

            this.onPokermove(i, delay);
            delay += 0.2;
        }
        delay = 0;
        for (var i = 6; i < 13; i++) {

            this.onPokermove(i, delay);
            delay += 0.2;
        }

        delay = 0.4;
        for (var i = 0; i < 13; i++) {

            _this.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function () {
                sound.playSound('res/audio/effect/audio_pokerdeal.mp3');

            }), cc.show()));
            delay += 0.1;
        }

        _this.runAction(cc.sequence(cc.delayTime(1.9), cc.callFunc(function () {

            _this.onNotifyDelCards(data);

        })));
    },

    setSecondHandCards: function (data) {
        this.paiQi = data['paiQi'];
        this.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function () {

            this.onNotifyDelCards(data);

        }.bind(this))));

    },

    onPokermove: function (index, delay) {
        // JJLog.print("位置== " + index + '延迟=' + delay );
        var _this = this;
        //_this.cardInArray[index].runAction(cc.sequence(cc.delayTime(delay),cc.moveTo(0.1,cc.p(_this.getIndexPosX(_this.cardInArray[index], index),0))));
        _this.cardInArray[index].runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function () {

        }), cc.show()));
    },
    getIndexPosX: function (card, index) {
        var size = card.getContentSize();
        return size.width * index - this.gap_cardStand * index;

    },

    onNotifyDelCards: function (data) {
        this._super();
        JJLog.print("onNotifyDelCards self");
        var _this = this;
        this.panel_touch.setTouchEnabled(true);
        this.panel_pokercontrol.y = 720;
        this.panel_pokercontrol.setVisible(true);
        this.panel_btnchupai.setVisible(false);
        this.img_ontoutype.setVisible(false);
        this.img_onzhongtype.setVisible(false);
        this.img_onweitype.setVisible(false);

        for (var i = 0; i < this.paiQi.length; i++) {
            var card = new SSSMyPokerCard(this, this.paiQi[i]);
            var size = card.getContentSize();
            var x = size.width * i - 50 * i;
            card.setPosition(x, 0);
            this.panelpokerIn.addChild(card);
            this.pokerInArrys.push(card);
            this.paiLast.push(card);
        }

        this.resetpokerInPanel();
        this.checkBtnState();
        this.checkSpecialType();
        this.panel_pokercontrol.runAction(cc.sequence(cc.moveBy(0.4, 0, -720), cc.callFunc(function () {
            _this.panel_touch.setTouchEnabled(false);
            _this.startClock(230);
        })));

    },
    onClickBntChoose: function (type) {
        var data = this.ShiSanShui.getCards(this.paisShow, this.data2, type);

        if (data != null && data.popup != null) {
            JJLog.print('选的牌=' + JSON.stringify(data));
            this.choiceArrys.splice(0, this.choiceArrys.length);
            for (var i = 0; i < this.pokerInArrys.length; i++) {
                this.pokerInArrys[i].playResetAnimation();
            }
            //for(var i=0; i < this.pokerInArrys.length; i++)
            //{
            //  var card = this.pokerInArrys[i];
            //  for(var y=0; y < data.popup.length; y++)
            //  {
            //    if(data.popup[y]['type']+""+ data.popup[y]['value'] == card.paiOfCard().keyOfPai() &&!card.isSelected())
            //    {
            //      card.playSelectedAnimation();
            //      this.choiceArrys.push(card);
            //    }
            //  }
            //}

            for (var i = 0; i < data.popup.length; i++) {
                for (var y = 0; y < this.pokerInArrys.length; y++) {
                    var card = this.pokerInArrys[y];
                    if (data.popup[i]['type'] + "" + data.popup[i]['value'] == card.paiOfCard().keyOfPai() && !card.isSelected()) {
                        card.playSelectedAnimation();
                        this.choiceArrys.push(card);
                        break;
                    }
                }
            }

            JJLog.print('选的牌长度=' + this.choiceArrys.length);
        }
    },

    checkSpecialType: function () {
        var btn_special = ccui.helper.seekWidgetByName(this.panel_pokercontrol, "btn_special");
        var text_score = ccui.helper.seekWidgetByName(btn_special, "text_score");
        text_score.setVisible(false);
        if (this.paiQi.length > 13) {
            btn_special.setVisible(false);
            return;
        }

        if (SSSPoker.table.wang > 0) {
            var isHaveWang = false;
            for (var i = 0; i < this.paiQi.length; i++) {
                if (this.paiQi[i]['value'] == 15) {
                    isHaveWang = true;
                    break;
                }
            }
            if (isHaveWang) {
                btn_special.setVisible(false);
                return;
            }
        }

        var type = this.ShiSanShui.CheckSpecial(this.paiQi, this.data2);

        JJLog.print('特殊牌型=' + type);

        if (type != 0) {
            btn_special.setVisible(true);
            var imgSpecail = ccui.helper.seekWidgetByName(btn_special, "img_specialtype");
            imgSpecail.loadTexture(ShuiTypeWord[type], ccui.Widget.PLIST_TEXTURE);
            imgSpecail.ignoreContentAdaptWithSize(true);

            btn_special.addClickEventListener(function () {
                this.onClickBtnSpecial(type);

            }.bind(this));

            if (SSSPoker.table.area == 'fj') {
                if (SSSPoker.table.wanfa == 2 && type == 20)  // 减一色的 三同花去掉
                {
                    btn_special.setVisible(false);
                }
                if (SSSPoker.table.wanfa == 3)  // 全一色的
                {
                    if (type == ShiSanShuiType.CT_SPECIAL_ALLSMALL || type == ShiSanShuiType.CT_SPECIAL_ALLBIG
                        || type == ShiSanShuiType.CT_SPECIAL_SANKELIANGDUI || type == ShiSanShuiType.CT_SPECIAL_LIUDUIBAN
                        || type == ShiSanShuiType.CT_SPECIAL_SITAOSAN || type == ShiSanShuiType.CT_SPECIAL_QINGLONG) {

                    } else {
                        btn_special.setVisible(false);
                    }
                }
                text_score.setString("/" + this.speTypeScore(type));
            } else if (SSSPoker.table.area == 'sx') {
                if (type == ShiSanShuiType.CT_SPECIAL_QINGLONG || type == ShiSanShuiType.CT_SPECIAL_REDBLACK || type == ShiSanShuiType.CT_SPECIAL_YITIAOLONG
                    || type == ShiSanShuiType.CT_SPECIAL_REDBLACKONE || type == ShiSanShuiType.CT_SPECIAL_WUDUISAN || type == ShiSanShuiType.CT_SPECIAL_LIUDUIBAN
                    || type == ShiSanShuiType.CT_SPECIAL_ALLBIG || type == ShiSanShuiType.CT_SPECIAL_ALLSMALL || type == ShiSanShuiType.CT_SPECIAL_SANSHUNZI
                    || type == ShiSanShuiType.CT_SPECIAL_SANTONGHUA
                ) {
                    btn_special.setVisible(true);
                } else {
                    btn_special.setVisible(false);
                }
                text_score.setString("/" + this.speTypeScore(type));
            }
            else {
                text_score.setString("/" + this.speTypeScoreNingbo(type));
                btn_special.setTouchEnabled(false);
            }

            text_score.setContentSize(text_score.getVirtualRendererSize());
            text_score.setVisible(true);

        } else {
            btn_special.setVisible(false);
        }

        if (btn_special.isVisible()) {
            this.onClickBtnSpecial(type);
        }

    },

    //特殊牌的特殊分
    speTypeScore: function (type) {
        if (SSSPoker.table.wanfa == 3)  // 全一色的
        {
            switch (type) {
                case ShiSanShuiType.CT_SPECIAL_ALLSMALL:
                case ShiSanShuiType.CT_SPECIAL_ALLBIG: {
                    return 24;
                }
                case ShiSanShuiType.CT_SPECIAL_SANKELIANGDUI:
                case ShiSanShuiType.CT_SPECIAL_LIUDUIBAN: {
                    return 6;
                }
                case ShiSanShuiType.CT_SPECIAL_SITAOSAN: {
                    return 8;
                }
                case ShiSanShuiType.CT_SPECIAL_QINGLONG: {
                    return 54;
                }
            }
        }

        switch (type) {
            case ShiSanShuiType.CT_SPECIAL_SANTONGHUA: {
                if (SSSPoker.table.area == "sx") {
                    return 3;
                }
                return (SSSPoker.table.mode == 1 ? 4 : 6);
            }
            case ShiSanShuiType.CT_SPECIAL_LIUDUIBAN: {
                if (SSSPoker.table.area == "sx") {
                    return 6;
                }
                return (SSSPoker.table.mode == 1 ? 4 : 6);
            }
            case ShiSanShuiType.CT_SPECIAL_WUDUISAN: {
                if (SSSPoker.table.area == "sx") {
                    return 9;
                }
                return (SSSPoker.table.mode == 1 ? 4 : 6);
            }
            case ShiSanShuiType.CT_SPECIAL_SANSHUNZI: {
                if (SSSPoker.table.area == "sx") {
                    return 3;
                }
                return (SSSPoker.table.mode == 1 ? 4 : 6);
            }
            case ShiSanShuiType.CT_SPECIAL_SITAOSAN: {
                if (SSSPoker.table.area == "sx") {
                    return 6;
                }
                return (SSSPoker.table.mode == 1 ? 6 : 8);
            }
            case ShiSanShuiType.CT_SPECIAL_SANKELIANGDUI: {
                if (SSSPoker.table.area == "sx") {
                    return 6;
                }
                return (SSSPoker.table.mode == 1 ? 6 : 8);
            }
            case ShiSanShuiType.CT_SPECIAL_REDBLACKONE: {
                if (SSSPoker.table.area == "sx") {
                    return 13;
                }
                return (SSSPoker.table.mode == 1 ? 6 : 8);
            }
            case ShiSanShuiType.CT_SPECIAL_REDBLACK: {
                if (SSSPoker.table.area == "sx") {
                    return 26;
                }
                if (SSSPoker.table.ishavebanker == 1) {
                    return 8;
                } else {
                    return (SSSPoker.table.mode == 1 ? 12 : 24);
                }
            }
            case ShiSanShuiType.CT_SPECIAL_ALLSMALL: {
                if (SSSPoker.table.area == "sx") {
                    return 6;
                }
                if (SSSPoker.table.ishavebanker == 1) {
                    return 8;
                } else {
                    return (SSSPoker.table.mode == 1 ? 12 : 24);
                }
            }

            case ShiSanShuiType.CT_SPECIAL_ALLBIG: {
                if (SSSPoker.table.area == "sx") {
                    return 6;
                }

                if (SSSPoker.table.ishavebanker == 1) {
                    return 8;
                } else {
                    return (SSSPoker.table.mode == 1 ? 12 : 24);
                }
            }

            case ShiSanShuiType.CT_SPECIAL_LIULIUDASHUN: {
                if (SSSPoker.table.area == "sx") {
                    return 6;
                }

                if (SSSPoker.table.ishavebanker == 1) {
                    return 8;
                } else {
                    return (SSSPoker.table.mode == 1 ? 12 : 24);
                }
            }

            case ShiSanShuiType.CT_SPECIAL_SANFENTIANXIA: {
                if (SSSPoker.table.area == "sx") {
                    return 13;
                }

                if (SSSPoker.table.ishavebanker == 1) {
                    return 8;
                } else {
                    return (SSSPoker.table.mode == 1 ? 24 : 48);
                }
            }
            case ShiSanShuiType.CT_SPECIAL_SANTONGHUASHUN: {
                if (SSSPoker.table.area == "sx") {
                    return 13;
                }

                if (SSSPoker.table.ishavebanker == 1) {
                    return 8;
                } else {
                    return (SSSPoker.table.mode == 1 ? 24 : 48);
                }
            }
            case ShiSanShuiType.CT_SPECIAL_SANHUANGWUDI: {
                if (SSSPoker.table.area == "sx") {
                    return 13;
                }

                if (SSSPoker.table.ishavebanker == 1) {
                    return 8;
                } else {
                    return (SSSPoker.table.mode == 1 ? 26 : 52);
                }
            }
            case ShiSanShuiType.CT_SPECIAL_SHIERHUANGZU: {
                if (SSSPoker.table.area == "sx") {
                    return 13;
                }

                if (SSSPoker.table.ishavebanker == 1) {
                    return 8;
                } else {
                    return (SSSPoker.table.mode == 1 ? 26 : 52);
                }
            }
            case ShiSanShuiType.CT_SPECIAL_YITIAOLONG: {
                if (SSSPoker.table.area == "sx") {
                    return 13;
                }

                if (SSSPoker.table.ishavebanker == 1) {
                    return 8;
                } else {
                    return (SSSPoker.table.mode == 1 ? 27 : 54);
                }
            }
            case ShiSanShuiType.CT_SPECIAL_QINGLONG: {
                if (SSSPoker.table.area == "sx") {
                    return 52;
                }

                if (SSSPoker.table.ishavebanker == 1) {
                    return 8;
                } else {
                    return (SSSPoker.table.mode == 1 ? 54 : 108);
                }
            }
            default:
                return 0;
        }
    },

//特殊牌的特殊分
    speTypeScoreNingbo: function (type) {
        switch (type) {
            case ShiSanShuiType.CT_SPECIAL_SANTONGHUA:
                return 3;
            case ShiSanShuiType.CT_SPECIAL_LIUDUIBAN:
                return 6;
            case ShiSanShuiType.CT_SPECIAL_WUDUISAN:
                return 7;
            case ShiSanShuiType.CT_SPECIAL_SANSHUNZI:
                return 3;
            case ShiSanShuiType.CT_SPECIAL_ALLSMALL:
                return 7;
            case ShiSanShuiType.CT_SPECIAL_ALLBIG:
                return 7;
            case ShiSanShuiType.CT_SPECIAL_LIULIUDASHUN:
                return 13;

            case ShiSanShuiType.CT_SPECIAL_SANKELIANGDUI:
                return 10;
            case ShiSanShuiType.CT_SPECIAL_REDBLACKONE:
                return 13;
            case ShiSanShuiType.CT_SPECIAL_SANTONGHUASHUN:
                return 26;
            case ShiSanShuiType.CT_SPECIAL_REDBLACK:
                return 26;
            case ShiSanShuiType.CT_SPECIAL_YITIAOLONG:
                return 26;
            case ShiSanShuiType.CT_SPECIAL_QINGLONG:
                return 52;

            case ShiSanShuiType.CT_SPECIAL_SITAOSAN: {
                return 6;
            }
            case ShiSanShuiType.CT_SPECIAL_SANFENTIANXIA: {
                return 26;
            }
            case ShiSanShuiType.CT_SPECIAL_SANHUANGWUDI: {
                return 26;
            }
            case ShiSanShuiType.CT_SPECIAL_SHIERHUANGZU: {
                return 26;
            }
            default:
                return 0;
        }
    },

    checkBtnState: function () {
        var paiArry = [];

        for (var i = 0; i < this.paiLast.length; i++) {
            var pais = {};
            pais['type'] = this.paiLast[i].paiOfCard().objectOfPai()['type'];
            pais['value'] = this.paiLast[i].paiOfCard().objectOfPai()['value'];
            // var pais = this.paiLast[i].paiOfCard();
            paiArry[i] = pais;
        }

        this.paisShow = paiArry;

        JJLog.print('当前牌=' + JSON.stringify(paiArry));

        this.ShiSanShui.SortCardList(paiArry, 'Descend');

        this.data2 = new AnalyseData();
        this.ShiSanShui.AnalyseCardAll(paiArry, this.data2);

        JJLog.print('组合类型=' + JSON.stringify(this.data2));
        //对子
        if (this.data2['bTwoCount'] >= 1) {
            this.btn_duizi.setBright(true);
        } else {
            this.btn_duizi.setBright(false);
        }
        //两对
        var noLaiZiTwoCount = 0;
        if (this.data2['bTwoCount'] >= 2) {
            if (this.data2.bLaiZiCount > 0) {
                for (var i = 0; i < this.data2.bTwoData.length; i++) {
                    var cards = this.data2.bTwoData[i];
                    if (cards[1].value != 15) {
                        noLaiZiTwoCount++;
                    }
                }
            }
            if (this.data2.bLaiZiCount == 1) {
                if (noLaiZiTwoCount > 0) {
                    this.btn_liangdui.setBright(true);
                } else {
                    this.btn_liangdui.setBright(false);
                }
            } else {
                this.btn_liangdui.setBright(true);
            }
        } else {
            this.btn_liangdui.setBright(false);
        }
        //三条
        if (this.data2['bThreeCount'] >= 1) {
            this.btn_santiao.setBright(true);
        } else {
            this.btn_santiao.setBright(false);
        }
        //顺子
        if (this.data2['bFiveMixedFlushCount'] >= 1) {
            this.btn_shunzi.setBright(true);
        } else {
            this.btn_shunzi.setBright(false);
        }
        //同花
        if (this.data2['bFiveFlushCount'] >= 1) {
            this.btn_tonghua.setBright(true);
        } else {
            this.btn_tonghua.setBright(false);
        }
        //葫芦
        if (this.data2['bTwoCount'] >= 1 && this.data2['bThreeCount'] >= 1) {
            if (this.data2['bTwoCount'] == 1) {
                this.btn_hulu.setBright(false);
            } else {
                if (this.data2.bLaiZiCount == 0) {
                    this.btn_hulu.setBright(true);
                } else {
                    var noLaiZiThreeCount = 0;
                    for (var i = 0; i < this.data2.bThreeData.length; i++) {
                        var cards = this.data2.bThreeData[i];
                        if (cards[2].value != 15) {
                            noLaiZiThreeCount++;
                        }
                    }
                    if (noLaiZiThreeCount > 0) {
                        this.btn_hulu.setBright(true);
                    } else {
                        if ((this.data2.bLaiZiCount == 1 && noLaiZiTwoCount > 1) || (this.data2.bLaiZiCount == 2 && noLaiZiTwoCount > 0) || this.data2.bLaiZiCount > 2) {
                            this.btn_hulu.setBright(true);
                        } else {
                            this.btn_hulu.setBright(false);
                        }
                    }
                }
            }
        } else {
            this.btn_hulu.setBright(false);
        }
        //铁枝
        if (this.data2['bFourCount'] >= 1) {
            this.btn_tiezhi.setBright(true);
        } else {
            this.btn_tiezhi.setBright(false);
        }
        //同花顺
        if (this.data2['bFiveStraightFlushCount'] >= 1) {
            this.btn_tonghuashun.setBright(true);
        } else {
            this.btn_tonghuashun.setBright(false);
        }
        //五同
        if (this.data2['bFiveCount'] >= 1) {
            this.btn_wutong.setBright(true);
        } else {
            this.btn_wutong.setBright(false);
        }

    },

    checkSelpoker: function (beganPoint, endPoint, isBegan) {

        if (isBegan) {
            for (var i = this.pokerInArrys.length - 1; i >= 0; i--) {
                var card = this.pokerInArrys[i];
                if (cc.rectContainsPoint(card.getBoundingBox(), beganPoint)) {
                    card.setTag(1);
                    return;
                }

            }

        } else {
            var x = Math.min(beganPoint.x, endPoint.x);
            var y = Math.min(beganPoint.y, endPoint.y);
            var w = Math.max(1, Math.abs(beganPoint.x - endPoint.x));
            var h = Math.max(1, Math.abs(beganPoint.y - endPoint.y));
            var recttmp = cc.rect(x, y, w, h);


            JJLog.print("touch==" + recttmp.x + "++++++++" + recttmp.y
                + "====" + recttmp.width + "===" + recttmp.height);

            for (var i = this.pokerInArrys.length - 1; i >= 0; i--) {
                var card = this.pokerInArrys[i];
                JJLog.print("++++++++++++++++++++" + card.getBoundingBox().x + "++++++++" + card.getBoundingBox().y
                    + "====" + card.getBoundingBox().width + "===" + card.getBoundingBox().height);
                if (cc.rectIntersectsRect(card.getBoundingBox(), recttmp)) {
                    card.setTag(1);
                    card.showGray();
                    return;
                }
            }
        }
    },

    checkSelCardEnd: function (touchEnd) {
        for (var i = this.pokerInArrys.length - 1; i >= 0; i--) {
            var card = this.pokerInArrys[i];

            JJLog.print("card y==" + card.getPosition().y + "tag=" + card.getTag());

            if (!card.isSelected() && card.getTag() == 1) {
                card.playSelectedAnimation();
                this.choiceArrys.push(card);
            }
            else if (card.isSelected() && card.getTag() == 1) {
                for (var y = this.choiceArrys.length - 1; y >= 0; y--) {
                    if (this.choiceArrys[y].paiOfCard().keyOfPai() == card.paiOfCard().keyOfPai()) {
                        this.choiceArrys.splice(y, 1);
                    }
                }
                card.playResetAnimation();
            }

            card.setTag(0);
            card.showWhite();
        }
//        for (var i = 0; i < this.choiceArrys.length; i++) {
//            JJLog.print("选择的牌==" + this.choiceArrys[i].paiOfCard().keyOfPai());
//        }
    },

    onClickchupai: function () {
        var _this = this;
        var data = {};
        var pais = this.paiQi;

        data['front'] = [];
        data['mid'] = [];
        data['last'] = [];

        if (this.iswulong == true) {
            JJLog.print("乌龙不让出牌");
            return;
        }

        for (var i = 0; i < this.touchoiceArray.length; i++) {
            var card = this.touchoiceArray[i];
            for (var y = 0; y < this.paiQi.length; y++) {
                if (this.paiQi[y]['type'] + "" + this.paiQi[y]['value'] == card.paiOfCard().keyOfPai()) {
                    data['front'][i] = this.paiQi[y];
                }
            }

        }

        for (var i = 0; i < this.zhongchoiceArray.length; i++) {
            var card = this.zhongchoiceArray[i];
            for (var y = 0; y < this.paiQi.length; y++) {
                if (this.paiQi[y]['type'] + "" + this.paiQi[y]['value'] == card.paiOfCard().keyOfPai()) {
                    data['mid'][i] = this.paiQi[y];
                }
            }

        }
        for (var i = 0; i < this.weichoiceArray.length; i++) {
            var card = this.weichoiceArray[i];
            for (var y = 0; y < this.paiQi.length; y++) {
                if (this.paiQi[y]['type'] + "" + this.paiQi[y]['value'] == card.paiOfCard().keyOfPai()) {
                    data['last'][i] = this.paiQi[y];
                }
            }

        }

        if (this.touchoiceArray.length != 3 || this.zhongchoiceArray.length != 5 || this.weichoiceArray.length != 5) {
            return;
        }

        JJLog.print("出牌=" + JSON.stringify(data));

        this.btn_chupai.setTouchEnabled(false);

        var cdata = {'pai': data};
        cdata["uid"] = hall.user.uid;
        if (SSSPoker.table.shuangJiang == 1 && this.paiQi2 == null) {
            cdata.uid += "00";
        }

        SSSPoker.table.updatePlayerDelCard(cdata, function (data) {
            this.btn_chupai.setTouchEnabled(true);
            if (data["code"] == 200) {

            } else {

            }
            JJLog.print("put out card resp");
            JJLog.print(JSON.stringify(data));
        }.bind(this))

    },

    clearAllCards: function () {

        this.cardInArray.splice(0, this.cardInArray.length);
        this.panel_cardIn.removeAllChildren();

        for (var i = 0; i < this.touchoiceArray.length; i++) {
            var card = this.touchoiceArray[i];
            card.removeFromParent();
        }

        for (var i = 0; i < this.zhongchoiceArray.length; i++) {
            var card = this.zhongchoiceArray[i];
            card.removeFromParent();
        }

        for (var i = 0; i < this.weichoiceArray.length; i++) {
            var card = this.weichoiceArray[i];
            card.removeFromParent();
        }
        this.touchoiceArray.splice(0, this.touchoiceArray.length);
        this.zhongchoiceArray.splice(0, this.zhongchoiceArray.length);
        this.weichoiceArray.splice(0, this.weichoiceArray.length);

        this.pokerInArrys.splice(0, this.pokerInArrys.length);
        this.paiQi = null;
    },

    onclickbgCancel: function () {
        for (var i = this.pokerInArrys.length - 1; i >= 0; i--) {
            var card = this.pokerInArrys[i];
            if (card.isSelected()) {
                card.playResetAnimation();
            }
        }

        this.choiceArrys.splice(0, this.choiceArrys.length);
    },
    onclickAllcancel: function () {
        this.onTouPokercancel();
        this.onZhongPokercancel();
        this.onWeiPokercancel();
    },
    onClickBtnSpecial: function (type) {
        var data = {"pai": {'spe': this.paiQi}};
        data['uid'] = hall.user.uid;
        if (SSSPoker.table.shuangJiang == 1 && this.paiQi2 == null) {
            data['uid'] += "00";
        }
        var dialog = new JJMajhongDecideDialog();
        dialog.setDes('是否摆出' + ShiSanShuiTypeWord[type] + '牌型？');
        dialog.setCallback(function () {
            SSSPoker.table.updatePlayerDelCard(data, function (data) {
                JJLog.print("put out card resp");
                JJLog.print(JSON.stringify(data));
            }.bind(this))
        });
        dialog.showDialog();

        var  shisanshui2 = new  ShiSanShui();
        shisanshui2.SortCardList(this.paiQi, 'Descend');
        var data3= new AnalyseData();
        shisanshui2.AnalyseCardAll(this.paiQi, data3);

        this.ShiSanShui.SortCardList(this.paiQi, 'Descend');

        this.data2 = new AnalyseData();
        this.ShiSanShui.AnalyseCardAll(this.paiQi, this.data2);

        JJLog.print("特殊牌型取牌组合"+JSON.stringify(this.data2) );
        var spelCards = this.ShiSanShui.GetSpecialCards(this.paiQi,this.data2,type);
        var arrry  = new Array();
        if(spelCards != null)
        {
         for(var i=0;i<spelCards['front'].length;i++)
         {
           arrry.push(spelCards['front'][i]) ;
         }
         for(var i=0;i<spelCards['mid'].length;i++)
         {
           arrry.push(spelCards['mid'][i]) ;
         }
         for(var i=0;i<spelCards['end'].length;i++)
         {
           arrry.push(spelCards['end'][i]) ;
         }
         data['spe'] = arrry;
         JJLog.print("特殊牌型取牌"+JSON.stringify(spelCards));
        }
    },

    onNotifyPlayerOP: function (data) {
        JJLog.print("onNotifyPlayerOP");
        if (data["uid"] != hall.user.uid) return;
        JJLog.print(JSON.stringify(data));
        this.opArray.push(data);
        //this.showControlPanel(data);
    },
    synPlayerOp: function (data) {
        this._super(data);
    },

    onSyncDelCards: function (data) {
        JJLog.print('sync self del card');
        if (data['uid'] == this.uid || (SSSPoker.table.shuangJiang == 1 && data['uid'] == this.uid + "00")) {
            this.panel_pokercontrol.setVisible(false);
            this.image_pokertip.setVisible(true);
            this.image_pokertip.loadTexture('sssShowComplete.png', ccui.Widget.PLIST_TEXTURE);
            this.image_pokertip.ignoreContentAdaptWithSize(true);

            this.clearAllCards();

            if (SSSPoker.table.shuangJiang == 1 && this.paiQi2 != null) {
                this.setSecondHandCards(this.paiQi2);
                this.paiQi2 = null;
            }
            //for(var i=0; i < this.touchoiceArray.length; i ++)
            //{
            //  var card = new PokerShowUp(this.touchoiceArray[i].paiOfCard().objectOfPai());
            //  var size = card.getContentSize();
            //  card.setPosition(size.width * i - 50 * i + 30, 60);
            //  card.SetBackside();
            //  this.cardInArray.push(card);
            //  this.panel_cardIn.addChild(card);
            //
            //}
            //
            //for(var i=0; i < this.zhongchoiceArray.length; i ++)
            //{
            //  var card = new PokerShowUp(this.zhongchoiceArray[i].paiOfCard().objectOfPai());
            //  var size = card.getContentSize();
            //  card.setPosition(size.width * i - 50 * i, 0);
            //  card.SetBackside();
            //  this.cardInArray.push(card);
            //  this.panel_cardIn.addChild(card);
            //
            //}
            //
            //for(var i=0; i < this.weichoiceArray.length; i ++)
            //{
            //  var card = new PokerShowUp(this.weichoiceArray[i].paiOfCard().objectOfPai());
            //  var size = card.getContentSize();
            //  card.setPosition(size.width * i - 50 * i, -60);
            //  card.SetBackside();
            //  this.cardInArray.push(card);
            //  this.panel_cardIn.addChild(card);
            //
            //}

        }


    },

    onchooseTouPoker: function () {
        JJLog.print('上头道111==' + this.choiceArrys.length + ' wwww ' + this.touchoiceArray.length);
        if (this.choiceArrys.length > (3 - this.touchoiceArray.length))  return;
        JJLog.print('上头道=' + this.pokerInArrys.length);
        for (var i = 0; i < this.choiceArrys.length; i++) {
            var card = new SSSMyPokerCard(this, this.choiceArrys[i].paiOfCard().objectOfPai(),true);
            var size = card.getContentSize();
            card.setPosition(size.width * this.touchoiceArray.length - 51 * this.touchoiceArray.length, 0);
            this.panel_pokertou.addChild(card);
            this.touchoiceArray.push(card);
            this.removeChoicePoker(card);
        }
        this.resetpokerInPanel();
        this.choiceArrys.splice(0, this.choiceArrys.length);
        this.checkBtnState();

        if (this.touchoiceArray.length == 3) {
            var data = {};
            data['front'] = [];
            for (var i = 0; i < this.touchoiceArray.length; i++) {
                var card = this.touchoiceArray[i];
                for (var y = 0; y < this.paiQi.length; y++) {
                    if (this.paiQi[y]['type'] + "" + this.paiQi[y]['value'] == card.paiOfCard().keyOfPai()) {
                        data['front'][i] = this.paiQi[y];
                    }
                }

            }
            var type = this.ShiSanShui.GetCardType(data['front']);
            this.img_ontoutype.setVisible(true);
            this.img_ontoutype.loadTexture(ShuiTypeWord[type], ccui.Widget.PLIST_TEXTURE);
            this.checkLastPai();
        }

    },

    onchooseZhongPoker: function () {
                                     console.log(this.choiceArrys.length+"##########"+this.zhongchoiceArray.length);
        if (this.choiceArrys.length > (5 - this.zhongchoiceArray.length))  return;
        for (var i = 0; i < this.choiceArrys.length; i++) {
            var card = new SSSMyPokerCard(this, this.choiceArrys[i].paiOfCard().objectOfPai(),true);
            var size = card.getContentSize();
            card.setPosition(size.width * this.zhongchoiceArray.length - 53 * this.zhongchoiceArray.length, 0);
            this.panel_pokerzhong.addChild(card);
            this.zhongchoiceArray.push(card);
            this.removeChoicePoker(card);
        }
        this.resetpokerInPanel();
        this.choiceArrys.splice(0, this.choiceArrys.length);
        this.checkBtnState();

        if (this.zhongchoiceArray.length == 5) {
            var data = {};
            data['mid'] = [];
            for (var i = 0; i < this.zhongchoiceArray.length; i++) {
                var card = this.zhongchoiceArray[i];
                for (var y = 0; y < this.paiQi.length; y++) {
                    if (this.paiQi[y]['type'] + "" + this.paiQi[y]['value'] == card.paiOfCard().keyOfPai()) {
                        data['mid'][i] = this.paiQi[y];
                    }
                }

            }
            var type = this.ShiSanShui.GetCardType(data['mid']);
            this.img_onzhongtype.setVisible(true);
            this.img_onzhongtype.loadTexture(ShuiTypeWord[type], ccui.Widget.PLIST_TEXTURE);
            this.checkLastPai();
        }
    },
    onchooseWeiPoker: function () {
        if (this.choiceArrys.length > (5 - this.weichoiceArray.length))  return;

        // this.btn_weichoose.setTouchEnabled(false);
        JJLog.print('上尾道=' + this.choiceArrys.length);
        for (var i = 0; i < this.choiceArrys.length; i++) {
            var card = new SSSMyPokerCard(this, this.choiceArrys[i].paiOfCard().objectOfPai(),true);
            var size = card.getContentSize();
            card.setPosition(size.width * this.weichoiceArray.length - 32 * this.weichoiceArray.length, 0);
            // card.setTouchEnabled(true);
            // card.addClickEventListener(function(sender, type){
            //     sender.removeFromParent();
            // });
            // card.setTouchEnabled(true);
            this.panel_pokerwei.addChild(card);
            this.weichoiceArray.push(card);
            this.removeChoicePoker(card);
        }

        this.resetpokerInPanel();
        this.choiceArrys.splice(0, this.choiceArrys.length);
        this.checkBtnState();

        if (this.weichoiceArray.length == 5) {
            var data = {};
            data['last'] = [];
            for (var i = 0; i < this.weichoiceArray.length; i++) {
                var card = this.weichoiceArray[i];
                for (var y = 0; y < this.paiQi.length; y++) {
                    if (this.paiQi[y]['type'] + "" + this.paiQi[y]['value'] == card.paiOfCard().keyOfPai()) {
                        data['last'][i] = this.paiQi[y];
                    }
                }

            }
            var type = this.ShiSanShui.GetCardType(data['last']);
            this.img_onweitype.setVisible(true);
            this.img_onweitype.loadTexture(ShuiTypeWord[type], ccui.Widget.PLIST_TEXTURE);

            this.checkLastPai();
        }

    },

    onTouPokercancel: function () {
        if (this.touchoiceArray.length <= 0) return;
        for (var i = 0; i < this.touchoiceArray.length; i++) {
            var card = new SSSMyPokerCard(this, this.touchoiceArray[i].paiOfCard().objectOfPai());
            var size = card.getContentSize();
            card.setPosition(size.width * i - 22 * i, 0);
            this.panelpokerIn.addChild(card);
            this.pokerInArrys.push(card);
        }

        for (var i = 0; i < this.touchoiceArray.length; i++) {
            var tmpCard = this.touchoiceArray[i];
            tmpCard.removeFromParent();
        }
        this.touchoiceArray.splice(0, this.touchoiceArray.length);
        this.choiceArrys.splice(0, this.choiceArrys.length);
        this.resetpokerInPanel();
        this.checkBtnState();

        this.img_wulongtip.setVisible(false);
        this.iswulong = false;
        this.panel_btnchupai.setVisible(false);
        this.img_ontoutype.setVisible(false);
    },
    onZhongPokercancel: function () {
        if (this.zhongchoiceArray.length <= 0) return;
        for (var i = 0; i < this.zhongchoiceArray.length; i++) {
            var card = new SSSMyPokerCard(this, this.zhongchoiceArray[i].paiOfCard().objectOfPai());
            var size = card.getContentSize();
            card.setPosition(size.width * i - 22 * i, 0);
            this.panelpokerIn.addChild(card);
            this.pokerInArrys.push(card);
        }
        JJLog.print('下中道=' + this.zhongchoiceArray.length);
        for (var i = 0; i < this.zhongchoiceArray.length; i++) {
            var tmpCard = this.zhongchoiceArray[i];
            tmpCard.removeFromParent();
        }

        this.zhongchoiceArray.splice(0, this.zhongchoiceArray.length);
        this.choiceArrys.splice(0, this.choiceArrys.length);
        this.resetpokerInPanel();
        this.checkBtnState();
        this.img_wulongtip.setVisible(false);
        this.iswulong = false;
        this.panel_btnchupai.setVisible(false);
        this.img_onzhongtype.setVisible(false);

    },
    onWeiPokercancel: function () {
        if (this.weichoiceArray.length <= 0) return;
        for (var i = 0; i < this.weichoiceArray.length; i++) {
            var card = new SSSMyPokerCard(this, this.weichoiceArray[i].paiOfCard().objectOfPai());
            var size = card.getContentSize();
            card.setPosition(size.width * i - 22 * i, 0);
            this.panelpokerIn.addChild(card);
            this.pokerInArrys.push(card);
        }

        for (var i = 0; i < this.weichoiceArray.length; i++) {
            var tmpCard = this.weichoiceArray[i];
            tmpCard.removeFromParent();
        }

        this.weichoiceArray.splice(0, this.weichoiceArray.length);
        this.choiceArrys.splice(0, this.choiceArrys.length);

        this.resetpokerInPanel();
        this.checkBtnState();

        this.img_wulongtip.setVisible(false);
        this.iswulong = false;
        this.panel_btnchupai.setVisible(false);
        this.img_onweitype.setVisible(false);
    },
    //放上去的牌删掉
    removeChoicePoker: function (card) {
        var index = 0;
        for (var y = this.pokerInArrys.length - 1; y >= 0; y--) {
            var tmpCard = this.pokerInArrys[y];
            JJLog.print('选中状态=' + tmpCard.isSelected());
            if (tmpCard.paiOfCard().keyOfPai() == card.paiOfCard().keyOfPai()) {
                this.pokerInArrys.splice(y, 1);
                break;
            }
        }

    },
    //重新排序
    resetpokerInPanel: function () {
        var data = [];
        for (var i = 0; i < this.pokerInArrys.length; i++) {
            var card = this.pokerInArrys[i];
            for (var y = 0; y < this.paiQi.length; y++) {
                if (this.paiQi[y]['type'] + "" + this.paiQi[y]['value'] == card.paiOfCard().keyOfPai()) {
                    data[i] = this.paiQi[y];
                }
            }
        }

        this.ShiSanShui.SortCardList(data, 'Descend');

        this.paiLast.splice(0, this.paiLast.length);
        this.panelpokerIn.removeAllChildren();
        this.pokerInArrys.splice(0, this.pokerInArrys.length);

        JJLog.print('重新排序 牌=' + JSON.stringify(data));

        var length = 13 - data.length;

        this.panelpokerIn.getContentSize();

        for (var i = 0; i < data.length; i++) {
            var card = new SSSMyPokerCard(this, data[i]);
            var size = card.getContentSize();
            var x = (size.width * length - 65 * length) / 2 + size.width * i - 65 * i;
            card.setPosition(x, 0);
            this.panelpokerIn.addChild(card);
            this.pokerInArrys.push(card);
            this.paiLast.push(card);
        }
    },

    checkLastPai: function () {
        JJLog.print('检查自动上牌=' + this.touchoiceArray.length + "=" + this.zhongchoiceArray.length + '=' + this.weichoiceArray.length);

        if (this.touchoiceArray.length == 3 && this.zhongchoiceArray.length == 5 && this.weichoiceArray.length < 5 && SSSPoker.table.wanfa != 1) {
            this.choiceArrys.splice(0, this.choiceArrys.length);
            for (var i = 0; i < this.paiLast.length; i++) {
                var card = this.paiLast[i];
                this.choiceArrys.push(card);
            }
            this.onchooseWeiPoker();

        } else if (this.touchoiceArray.length == 3 && this.weichoiceArray.length == 5 && this.zhongchoiceArray.length < 5 && SSSPoker.table.wanfa != 1) {
            this.choiceArrys.splice(0, this.choiceArrys.length);
            for (var i = 0; i < this.paiLast.length; i++) {
                var card = this.paiLast[i];
                this.choiceArrys.push(card);
            }
            this.onchooseZhongPoker();

        } else if (this.zhongchoiceArray.length == 5 && this.weichoiceArray.length == 5 && this.touchoiceArray.length < 3 && SSSPoker.table.wanfa != 1) {
            this.choiceArrys.splice(0, this.choiceArrys.length);
            for (var i = 0; i < this.paiLast.length; i++) {
                var card = this.paiLast[i];
                this.choiceArrys.push(card);
            }
            this.onchooseTouPoker();
        } else if (this.zhongchoiceArray.length == 5 && this.weichoiceArray.length == 5 && this.touchoiceArray.length == 3) {
            this.panel_btnchupai.setVisible(true);

            var data = {};
            data['front'] = [];
            data['mid'] = [];
            data['last'] = [];

            for (var i = 0; i < this.touchoiceArray.length; i++) {
                var card = this.touchoiceArray[i];
                for (var y = 0; y < this.paiQi.length; y++) {
                    if (this.paiQi[y]['type'] + "" + this.paiQi[y]['value'] == card.paiOfCard().keyOfPai()) {
                        data['front'][i] = this.paiQi[y];
                    }
                }

            }

            for (var i = 0; i < this.zhongchoiceArray.length; i++) {
                var card = this.zhongchoiceArray[i];
                for (var y = 0; y < this.paiQi.length; y++) {
                    if (this.paiQi[y]['type'] + "" + this.paiQi[y]['value'] == card.paiOfCard().keyOfPai()) {
                        data['mid'][i] = this.paiQi[y];
                    }
                }

            }
            for (var i = 0; i < this.weichoiceArray.length; i++) {
                var card = this.weichoiceArray[i];
                for (var y = 0; y < this.paiQi.length; y++) {
                    if (this.paiQi[y]['type'] + "" + this.paiQi[y]['value'] == card.paiOfCard().keyOfPai()) {
                        data['last'][i] = this.paiQi[y];
                    }
                }

            }
            var wulong1 = this.ShiSanShui.CompareCard(data['front'], data['mid'], false, false);
            var wulong2 = this.ShiSanShui.CompareCard(data['mid'], data['last'], false, false);
            if (wulong1 == 2) {
                this.iswulong = true;
                this.img_wulongtip.loadTexture('res/PokerSSS/Resoures/large/poker_errTip2.png', ccui.Widget.LOCAL_TEXTURE);
                this.img_wulongtip.setVisible(true);
            } else if (wulong2 == 2) {
                this.iswulong = true;
                this.img_wulongtip.loadTexture('res/PokerSSS/Resoures/large/poker_errTip1.png', ccui.Widget.LOCAL_TEXTURE);
                this.img_wulongtip.setVisible(true);
            }
        }

    },
    initLastCards: function () {
        this._super();

        var info = SSSPoker.table.getCardByPlayer(this.uid);

        if (SSSPoker.table.offLineInfo != null && SSSPoker.table.offLineInfo['mjGameResult'] != null) {
            return;
        }

        if (SSSPoker.table.shuangJiang == 1) {
            if (info['isPutCard'] > 0) {
                info = SSSPoker.table.getCardByPlayer(this.uid + "00");
            } else {
                this.paiQi2 = SSSPoker.table.getCardByPlayer(this.uid + "00");
            }
        }

        if (info['isPutCard'] > 0) {
            this.panel_pokercontrol.setVisible(false);

        } else {

            this.paiQi = info['paiQi'];

            this.panel_pokercontrol.setVisible(true);
            this.startClock(230);
            for (var i = 0; i < this.paiQi.length; i++) {
                var card = new SSSMyPokerCard(this, this.paiQi[i]);
                var size = card.getContentSize();
                var x = size.width * i - 65 * i;
                card.setPosition(x, 0);
                this.panelpokerIn.addChild(card);
                this.pokerInArrys.push(card);
                this.paiLast.push(card);
            }

            this.resetpokerInPanel();
            this.checkBtnState();
            this.checkSpecialType();
        }

    },


    addCardIn: function (cardObj) {
        var card = new SSSPokerShowUp(cardObj);
        card.SetBackside();
        //if(SSSPoker.table.JinPaiId == card.paiOfCard().keyOfPai()){
        //  card.setJin();
        //}
        this.cardInArray.push(card);
        this.panel_cardIn.addChild(card);
    },

    startClock: function (sec) {
        this.text_clock.setString(sec);
        this.text_clock.setContentSize(this.text_clock.getVirtualRendererSize());
        this.schedule(this.countDown, 1);
    },


    countDown: function (dt) {
        var sec = parseInt(this.text_clock.getString());
        if (sec >= 1) {
            sec--;
        }
        else {
            sec = '0';
        }

        this.text_clock.setString(sec);
    },

    stopClock: function () {
        this.unschedule(this.countDown);
    },

    opEvent: function (event) {

    },

    //---------quanzhou-----------


    removeHandInTargetCard: function (card) {
        JJLog.print('card ');
        JJLog.print(card);
        var cardValue = card["type"] + card["value"];
        for (var i = this.cardInArray.length - 1; i >= 0; i--) {
            var card = this.cardInArray[i];
            if (cardValue == card.paiOfCard().keyOfPai()) {
                this.cardInArray.splice(i, 1);
                card.removeFromParent();
                break;
            }
        }
    },

    removeHandInCard: function (card) {
        var cardValue = card["type"] + card["value"];
        for (var i = this.cardInArray.length - 1; i >= 0; i--) {
            var card = this.cardInArray[i];
            if (cardValue == card.paiOfCard().keyOfPai()) {
                this.cardInArray.splice(i, 1);
                card.removeFromParent();
                break;
            }
        }
    },

    resetPanelInChild: function () {

        var info = SSSPoker.table.getCardByPlayer(this.uid);

        if (info['isPutCard'] > 0)   //理完牌了
        {
            for (var i = 0; i < this.cardInArray.length; i++) {
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
            }

        } else {
            for (var i = 0; i < this.cardInArray.length; i++) {
                var card = this.cardInArray[i];
                var cardSize = card.getContentSize();
                card.x = cardSize.width * i - this.gap_cardStand * i;
                card.y = 0;
            }
        }

        //this.cardInArray = this.cardInArray.sort(this.sortCardList);

    },


});
