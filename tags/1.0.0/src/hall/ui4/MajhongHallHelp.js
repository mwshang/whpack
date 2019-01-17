var MajhongCardsHelp = cc.Layer.extend({
    panel_players:null,
    checkBox_players:null,
    player_cards:null,
    player_select:0,
    cardsCount:{},
    ctor:function()
    {
        this._super();
        var root = ccs.load(QZMajhongJson.MajhongHelp).node;
        this.addChild(root);
        this.panel_players = new Array();
        this.player_cards = new Array();
        this.checkBox_players = new Array();
        for(var i=1;i<10;i++)
        {
            var cardW = ccui.helper.seekWidgetByName(root,"W"+i);
            cardW.addClickEventListener(this.onAddCard.bind(this));
            var cardT = ccui.helper.seekWidgetByName(root,"T"+i);
            cardT.addClickEventListener(this.onAddCard.bind(this));
            var cardB = ccui.helper.seekWidgetByName(root,"B"+i);
            cardB.addClickEventListener(this.onAddCard.bind(this));
            this.cardsCount["W"+i] = 4;
            this.cardsCount["B"+i] = 4;
            this.cardsCount["T"+i] = 4;
            if(i<4)
            {
                var cardH = ccui.helper.seekWidgetByName(root,"J"+i);
                cardH.addClickEventListener(this.onAddCard.bind(this));
                this.cardsCount["J"+i] = 4;
            }
            if(i<5)
            {
                var cardF = ccui.helper.seekWidgetByName(root,"F"+i);
                cardF.addClickEventListener(this.onAddCard.bind(this));
                this.cardsCount["F"+i] = 4;
            }
        }

        for(var i=0;i<4;i++)
        {
            var cards = new Array();
            this.player_cards.push(cards);
            var panel_player = ccui.helper.seekWidgetByName(root,"player"+i);
            this.panel_players.push(panel_player);
            var checkBox = ccui.helper.seekWidgetByName(root,"checkBox_"+i);
            checkBox._index = i;
            checkBox.addClickEventListener(this.onSwitchPlayer.bind(this));
            this.checkBox_players.push(checkBox);
            var btn_cancel = ccui.helper.seekWidgetByName(root,"btn_cancel"+i);
            btn_cancel._index = i;
            btn_cancel.addClickEventListener(this.onCancelPlayer.bind(this));
        }
        var btn_ok = ccui.helper.seekWidgetByName(root,"btn_ok");
        btn_ok.addClickEventListener(this.onConfirm.bind(this));
    },

    onConfirm:function () {
        var str = "4fp ";
        for(var i = 0;i<this.player_cards.length;i++)
        {
            str += this.player_cards[i].toString();

            if(i <this.player_cards.length -1)
                str += "|";
        }
        hall.getPlayingGame().net.gmOp(str);
        this.removeFromParent();
    },

    onSwitchPlayer:function (sender) {

        for(var i = 0;i<this.checkBox_players.length;i++)
        {
            if(i != sender._index)
                this.checkBox_players[i].setSelected(false);
        }
        if(!sender.isSelected())
            this.player_select = sender._index;
        else
            this.player_select = -1;

    },

    onCancelPlayer:function (sender) {
        this.panel_players[sender._index].removeAllChildren();
        for(var i =0;i < this.player_cards[sender._index].length;i++)
        {
            var card = this.player_cards[sender._index][i];
            this.cardsCount[card]++;
        }
        this.player_cards[sender._index] = [];
    },

    onAddCard:function (sender) {
        if(this.player_select > -1 && this.cardsCount[sender.name] > 0)
        {
            if((this.player_select == 0 && this.player_cards[this.player_select].length  == 14) || (this.player_select > 0 && this.player_cards[this.player_select].length ==13))
                return;
            this.cardsCount[sender.name]--;
            var key = majhong.PaiFace[sender.name];
            var png = majhong.PaiFace[key]["show_other"];
            var image = new ccui.ImageView(png,ccui.Widget.PLIST_TEXTURE);
            image.setAnchorPoint(cc.p(0,0));
            image.setPosition(42*this.player_cards[this.player_select].length,0);
            this.panel_players[this.player_select].addChild(image);
            this.player_cards[this.player_select].push(sender.name);
        }

    },

    showHelp:function()
    {
        cc.director.getRunningScene().addChild(this);
    },

});

if(GAMENAME.indexOf("shisanshui") != -1)
{
    var MajhongHallHelp = cc.Layer.extend({
        panel_sss:null,
        btns_sss:null,
        ctor:function()
        {
            this._super();
            var root = ccs.load(SSSPokerJson.Help).node;
            this.addChild(root);

            var btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
            btn_back.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this));


            //十三水
            var panel_game3 = ccui.helper.seekWidgetByName(root,"node_game3");
            panel_game3.setVisible(true);
            this.panel_sss = new Array();
            for(var i = 0;i<3;i++)
            {
                var msg_view = ccui.helper.seekWidgetByName(panel_game3,"msg_view"+i);
                this.panel_sss.push(msg_view);
                var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
                msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
                img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            }

            this.btns_sss = new Array();
            var btn_1 = ccui.helper.seekWidgetByName(panel_game3,"Button_0");
            btn_1.addClickEventListener(this.showSSSMsg.bind(this));
            var btn_2 = ccui.helper.seekWidgetByName(panel_game3,"Button_1");
            btn_2.addClickEventListener(this.showSSSMsg.bind(this));
            var btn_3 = ccui.helper.seekWidgetByName(panel_game3,"Button_2");
            btn_3.addClickEventListener(this.showSSSMsg.bind(this));
            this.btns_sss.push(btn_1);
            this.btns_sss.push(btn_2);
            this.btns_sss.push(btn_3);
            this.showSSSMsg(btn_1);

            var btn = ccui.helper.seekWidgetByName(root,"btn_game3");
            btn.addClickEventListener(this.onSwitchGame.bind(this));
            btn.setBright(false);
            btn.setTouchEnabled(false);

        },

        onSwitchGame:function (sender) {
            this.gameIndex = sender.name == "btn_game0" ?0:1;
            for(var i=0;i<this.btn_gamesArray.length;i++)
            {
                var btn = this.btn_gamesArray[i];
                btn.setBright(btn.name != sender.name);
                btn.setTouchEnabled(btn.name != sender.name);
                this.panel_gamesArray[i].setVisible(btn.name == sender.name);
            }
        },

        onEnter: function () {
            this._super();
        },

        showHallPdkMsg:function(sender){
            sender.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            this.btn_pdkArray.forEach(function(element) {
                if(element.name != sender.name)
                {
                    element.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                }
            });
            this.msg_view15.setVisible(sender.name == "Button_0");
            this.msg_view16.setVisible(sender.name == "Button_1");
        },

        showSSSMsg:function(sender){
            sender.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            this.btns_sss.forEach(function(element) {
                if(element.name != sender.name)
                {
                    element.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                }
            });

            for(var i = 0;i<this.btns_sss.length;i++)
            {
                this.panel_sss[i].setVisible(sender.name == "Button_"+i);
            }
        },

        showHelp:function()
        {
            cc.director.getRunningScene().addChild(this);
        },

    });
}else if(GAMENAME.indexOf("qidong") != -1)
{
    var MajhongHallHelp = cc.Layer.extend({
        image_list:null,
        msg_view15:null,
        msg_view16:null,
        btn_pdkArray:null,
        btn_gamesArray:null,
        panel_gamesArray:null,
        panel_sss:null,
        btns_sss:null,
        ctor:function()
        {
            this._super();
            var root = ccs.load(QDMajhongJson.Help).node;
            this.addChild(root);

            var btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
            btn_back.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this));

            this.panel_gamesArray = new Array();
            //泉州
            var panel_game0 = ccui.helper.seekWidgetByName(root,"node_game0");
            var msg_view = ccui.helper.seekWidgetByName(panel_game0,"msg_view");
            var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
            msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
            img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            panel_game0.setVisible(false);
            this.panel_gamesArray.push(panel_game0);

            //跑得快
            var panel_game1 = ccui.helper.seekWidgetByName(root,"node_game1");
            panel_game1.setVisible(false);
            this.panel_gamesArray.push(panel_game1);
            this.msg_view15 = ccui.helper.seekWidgetByName(panel_game1,"msg_view0");
            this.msg_view16 = ccui.helper.seekWidgetByName(panel_game1,"msg_view1");
            var img_content15 = ccui.helper.seekWidgetByName(this.msg_view15,"Image_content");
            var img_content16 = ccui.helper.seekWidgetByName(this.msg_view16,"Image_content");
            this.msg_view15.setInnerContainerSize(cc.size(img_content15.getContentSize().width,img_content15.getContentSize().height));
            img_content15.setPosition(cc.p(img_content15.getPositionX(),img_content15.getContentSize().height));
            this.msg_view16.setInnerContainerSize(cc.size(img_content16.getContentSize().width,img_content16.getContentSize().height));
            img_content16.setPosition(cc.p(img_content16.getPositionX(),img_content16.getContentSize().height));

            //永春
            var panel_game2 = ccui.helper.seekWidgetByName(root,"node_game2");
            panel_game2.setVisible(false);
            var msg_view = ccui.helper.seekWidgetByName(panel_game2,"msg_view");
            var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
            msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
            img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            this.panel_gamesArray.push(panel_game2);

            this.btn_pdkArray = new Array();
            var btn_1 = ccui.helper.seekWidgetByName(panel_game1,"Button_0");
            btn_1.addClickEventListener(this.showHallPdkMsg.bind(this));
            var btn_2 = ccui.helper.seekWidgetByName(panel_game1,"Button_1");
            btn_2.addClickEventListener(this.showHallPdkMsg.bind(this));
            this.btn_pdkArray.push(btn_1);
            this.btn_pdkArray.push(btn_2);
            this.showHallPdkMsg(btn_1);


            //十三水
            var panel_game3 = ccui.helper.seekWidgetByName(root,"node_game3");
            panel_game3.setVisible(false);
            this.panel_gamesArray.push(panel_game3);
            this.panel_sss = new Array();
            for(var i = 0;i<3;i++)
            {
                var msg_view = ccui.helper.seekWidgetByName(panel_game3,"msg_view"+i);
                this.panel_sss.push(msg_view);
                var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
                msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
                img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            }

            this.btns_sss = new Array();
            var btn_1 = ccui.helper.seekWidgetByName(panel_game3,"Button_0");
            btn_1.addClickEventListener(this.showSSSMsg.bind(this));
            var btn_2 = ccui.helper.seekWidgetByName(panel_game3,"Button_1");
            btn_2.addClickEventListener(this.showSSSMsg.bind(this));
            var btn_3 = ccui.helper.seekWidgetByName(panel_game3,"Button_2");
            btn_3.addClickEventListener(this.showSSSMsg.bind(this));
            this.btns_sss.push(btn_1);
            this.btns_sss.push(btn_2);
            this.btns_sss.push(btn_3);
            this.showSSSMsg(btn_1);

            this.btn_gamesArray = new Array();
            for(var i = 0; i< 6;i++)
            {
                var btn = ccui.helper.seekWidgetByName(root,"btn_game"+i);
                btn.addClickEventListener(this.onSwitchGame.bind(this));
                if(i == 4)
                {
                    btn.setBright(false);
                    btn.setTouchEnabled(false);
                }
                this.btn_gamesArray.push(btn);
            }


            //启东敲麻
            var panel_game4 = ccui.helper.seekWidgetByName(root,"node_game4");
            panel_game4.setVisible(true);
            var msg_view = ccui.helper.seekWidgetByName(panel_game4,"msg_view");
            var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
            msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
            img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            this.panel_gamesArray.push(panel_game4);

            //启东百搭
            var panel_game5 = ccui.helper.seekWidgetByName(root,"node_game5");
            panel_game5.setVisible(false);
            var msg_view = ccui.helper.seekWidgetByName(panel_game5,"msg_view");
            var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
            msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
            img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            this.panel_gamesArray.push(panel_game5);

        },

        onSwitchGame:function (sender) {
            for(var i=0;i<this.btn_gamesArray.length;i++)
            {
                var btn = this.btn_gamesArray[i];
                btn.setBright(btn.name != sender.name);
                btn.setTouchEnabled(btn.name != sender.name);
                this.panel_gamesArray[i].setVisible(btn.name == sender.name);
            }
        },

        onEnter: function () {
            this._super();
        },

        showHallPdkMsg:function(sender){
            sender.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            this.btn_pdkArray.forEach(function(element) {
                if(element.name != sender.name)
                {
                    element.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                }
            });
            this.msg_view15.setVisible(sender.name == "Button_0");
            this.msg_view16.setVisible(sender.name == "Button_1");
        },

        showSSSMsg:function(sender){
            sender.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            this.btns_sss.forEach(function(element) {
                if(element.name != sender.name)
                {
                    element.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                }
            });

            for(var i = 0;i<this.btns_sss.length;i++)
            {
                this.panel_sss[i].setVisible(sender.name == "Button_"+i);
            }
        },

        showHelp:function()
        {
            cc.director.getRunningScene().addChild(this);
        },

    });

}else if(GAMENAME.indexOf("yongchun") != -1)
{
    var MajhongHallHelp = cc.Layer.extend({
        image_list:null,
        msg_view15:null,
        msg_view16:null,
        btn_pdkArray:null,
        btn_gamesArray:null,
        panel_gamesArray:null,
        panel_sss:null,
        btns_sss:null,
        ctor:function()
        {
            this._super();
            var root = ccs.load(YCMajhongJson.Help).node;
            this.addChild(root);

            var btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
            btn_back.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this));

            this.panel_gamesArray = new Array();
            //泉州
            var panel_game0 = ccui.helper.seekWidgetByName(root,"node_game0");
            var msg_view = ccui.helper.seekWidgetByName(panel_game0,"msg_view");
            var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
            msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
            img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            panel_game0.setVisible(false);
            this.panel_gamesArray.push(panel_game0);

            //跑得快
            var panel_game1 = ccui.helper.seekWidgetByName(root,"node_game1");
            panel_game1.setVisible(false);
            this.panel_gamesArray.push(panel_game1);
            this.msg_view15 = ccui.helper.seekWidgetByName(panel_game1,"msg_view0");
            this.msg_view16 = ccui.helper.seekWidgetByName(panel_game1,"msg_view1");
            var img_content15 = ccui.helper.seekWidgetByName(this.msg_view15,"Image_content");
            var img_content16 = ccui.helper.seekWidgetByName(this.msg_view16,"Image_content");
            this.msg_view15.setInnerContainerSize(cc.size(img_content15.getContentSize().width,img_content15.getContentSize().height));
            img_content15.setPosition(cc.p(img_content15.getPositionX(),img_content15.getContentSize().height));
            this.msg_view16.setInnerContainerSize(cc.size(img_content16.getContentSize().width,img_content16.getContentSize().height));
            img_content16.setPosition(cc.p(img_content16.getPositionX(),img_content16.getContentSize().height));

            //永春
            var panel_game2 = ccui.helper.seekWidgetByName(root,"node_game2");
            panel_game2.setVisible(true);
            var msg_view = ccui.helper.seekWidgetByName(panel_game2,"msg_view");
            var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
            msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
            img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            this.panel_gamesArray.push(panel_game2);

            this.btn_pdkArray = new Array();
            var btn_1 = ccui.helper.seekWidgetByName(panel_game1,"Button_0");
            btn_1.addClickEventListener(this.showHallPdkMsg.bind(this));
            var btn_2 = ccui.helper.seekWidgetByName(panel_game1,"Button_1");
            btn_2.addClickEventListener(this.showHallPdkMsg.bind(this));
            this.btn_pdkArray.push(btn_1);
            this.btn_pdkArray.push(btn_2);
            this.showHallPdkMsg(btn_1);


            //十三水
            var panel_game3 = ccui.helper.seekWidgetByName(root,"node_game3");
            panel_game3.setVisible(false);
            this.panel_gamesArray.push(panel_game3);
            this.panel_sss = new Array();
            for(var i = 0;i<3;i++)
            {
                var msg_view = ccui.helper.seekWidgetByName(panel_game3,"msg_view"+i);
                this.panel_sss.push(msg_view);
                var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
                msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
                img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            }

            this.btns_sss = new Array();
            var btn_1 = ccui.helper.seekWidgetByName(panel_game3,"Button_0");
            btn_1.addClickEventListener(this.showSSSMsg.bind(this));
            var btn_2 = ccui.helper.seekWidgetByName(panel_game3,"Button_1");
            btn_2.addClickEventListener(this.showSSSMsg.bind(this));
            var btn_3 = ccui.helper.seekWidgetByName(panel_game3,"Button_2");
            btn_3.addClickEventListener(this.showSSSMsg.bind(this));
            this.btns_sss.push(btn_1);
            this.btns_sss.push(btn_2);
            this.btns_sss.push(btn_3);
            this.showSSSMsg(btn_1);

            this.btn_gamesArray = new Array();
            for(var i = 0; i< 6;i++)
            {
                var btn = ccui.helper.seekWidgetByName(root,"btn_game"+i);
                btn.addClickEventListener(this.onSwitchGame.bind(this));
                if(i == 2)
                {
                    btn.setBright(false);
                    btn.setTouchEnabled(false);
                }
                this.btn_gamesArray.push(btn);
            }


            //启东敲麻
            var panel_game4 = ccui.helper.seekWidgetByName(root,"node_game4");
            panel_game4.setVisible(false);
            var msg_view = ccui.helper.seekWidgetByName(panel_game4,"msg_view");
            var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
            msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
            img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            this.panel_gamesArray.push(panel_game4);

            //启东百搭
            var panel_game5 = ccui.helper.seekWidgetByName(root,"node_game5");
            panel_game5.setVisible(false);
            var msg_view = ccui.helper.seekWidgetByName(panel_game5,"msg_view");
            var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
            msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
            img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            this.panel_gamesArray.push(panel_game5);

        },

        onSwitchGame:function (sender) {
            for(var i=0;i<this.btn_gamesArray.length;i++)
            {
                var btn = this.btn_gamesArray[i];
                btn.setBright(btn.name != sender.name);
                btn.setTouchEnabled(btn.name != sender.name);
                this.panel_gamesArray[i].setVisible(btn.name == sender.name);
            }
        },

        onEnter: function () {
            this._super();
        },

        showHallPdkMsg:function(sender){
            sender.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            this.btn_pdkArray.forEach(function(element) {
                if(element.name != sender.name)
                {
                    element.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                }
            });
            this.msg_view15.setVisible(sender.name == "Button_0");
            this.msg_view16.setVisible(sender.name == "Button_1");
        },

        showSSSMsg:function(sender){
            sender.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            this.btns_sss.forEach(function(element) {
                if(element.name != sender.name)
                {
                    element.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                }
            });

            for(var i = 0;i<this.btns_sss.length;i++)
            {
                this.panel_sss[i].setVisible(sender.name == "Button_"+i);
            }
        },

        showHelp:function()
        {
            cc.director.getRunningScene().addChild(this);
        },

    });
}else if(GAMENAME.indexOf("wuhan") != -1)
{
    var MajhongHallHelp = cc.Layer.extend({
        image_list:null,
        msg_view15:null,
        msg_view16:null,
        btn_pdkArray:null,
        btn_gamesArray:null,
        panel_gamesArray:null,
        panel_sss:null,
        btns_sss:null,
        ctor:function()
        {
            this._super();
            var root = ccs.load(WHMajhongJson.Help).node;
            this.addChild(root);

            var btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
            btn_back.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this));

            this.panel_gamesArray = new Array();
            //泉州
            var panel_game0 = ccui.helper.seekWidgetByName(root,"node_game0");
            var msg_view = ccui.helper.seekWidgetByName(panel_game0,"msg_view");
            var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
            msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
            img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            this.panel_gamesArray.push(panel_game0);

            this.btn_gamesArray = new Array();
            for(var i = 0; i< 1;i++)
            {
                var btn = ccui.helper.seekWidgetByName(root,"btn_game"+i);
                if(i == 0)
                {
                    btn.setBright(false);
                    btn.setTouchEnabled(false);
                }
                this.btn_gamesArray.push(btn);
            }

        },

        onSwitchGame:function (sender) {
            for(var i=0;i<this.btn_gamesArray.length;i++)
            {
                var btn = this.btn_gamesArray[i];
                btn.setBright(btn.name != sender.name);
                btn.setTouchEnabled(btn.name != sender.name);
                this.panel_gamesArray[i].setVisible(btn.name == sender.name);
            }
        },

        onEnter: function () {
            this._super();
        },


        showHelp:function()
        {
            cc.director.getRunningScene().addChild(this);
        },

    });

}else if(GAMENAME == "xuezhan")
{
    var MajhongHallHelp = cc.Layer.extend({
        ctor:function()
        {
            this._super();
            var root = ccs.load(XueZhanMajhongJson.HallHelp).node;
            this.addChild(root);

            var btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
            btn_back.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this));

            var msg_view = ccui.helper.seekWidgetByName(root,"msg_view");
            var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
            var height = img_content.getContentSize().height*3+724;
            msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,height));
            img_content.setPosition(cc.p(img_content.getPositionX(),height));
        },

        onEnter: function () {
            this._super();
        },

        showHelp:function()
        {
            cc.director.getRunningScene().addChild(this);
        },

    });

}else
{
    var MajhongHallHelp = cc.Layer.extend({
        image_list:null,
        msg_view15:null,
        msg_view16:null,
        btn_pdkArray:null,
        btn_gamesArray:null,
        panel_gamesArray:null,
        panel_sss:null,
        btns_sss:null,
        ctor:function()
        {
            this._super();
            var root = ccs.load(GameHallJson.Help).node;
            this.addChild(root);

            var btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
            btn_back.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this));

            this.panel_gamesArray = new Array();
            //泉州
            var panel_game0 = ccui.helper.seekWidgetByName(root,"node_game0");
            var msg_view = ccui.helper.seekWidgetByName(panel_game0,"msg_view");
            var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
            msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
            img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            panel_game0.setVisible(true);
            this.panel_gamesArray.push(panel_game0);

            //跑得快
            var panel_game1 = ccui.helper.seekWidgetByName(root,"node_game1");
            panel_game1.setVisible(false);
            this.panel_gamesArray.push(panel_game1);
            this.msg_view15 = ccui.helper.seekWidgetByName(panel_game1,"msg_view0");
            this.msg_view16 = ccui.helper.seekWidgetByName(panel_game1,"msg_view1");
            var img_content15 = ccui.helper.seekWidgetByName(this.msg_view15,"Image_content");
            var img_content16 = ccui.helper.seekWidgetByName(this.msg_view16,"Image_content");
            this.msg_view15.setInnerContainerSize(cc.size(img_content15.getContentSize().width,img_content15.getContentSize().height));
            img_content15.setPosition(cc.p(img_content15.getPositionX(),img_content15.getContentSize().height));
            this.msg_view16.setInnerContainerSize(cc.size(img_content16.getContentSize().width,img_content16.getContentSize().height));
            img_content16.setPosition(cc.p(img_content16.getPositionX(),img_content16.getContentSize().height));

            //永春
            var panel_game2 = ccui.helper.seekWidgetByName(root,"node_game2");
            panel_game2.setVisible(false);
            var msg_view = ccui.helper.seekWidgetByName(panel_game2,"msg_view");
            var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
            msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
            img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            panel_game0.setVisible(true);
            this.panel_gamesArray.push(panel_game2);

            this.btn_pdkArray = new Array();
            var btn_1 = ccui.helper.seekWidgetByName(panel_game1,"Button_0");
            btn_1.addClickEventListener(this.showHallPdkMsg.bind(this));
            var btn_2 = ccui.helper.seekWidgetByName(panel_game1,"Button_1");
            btn_2.addClickEventListener(this.showHallPdkMsg.bind(this));
            this.btn_pdkArray.push(btn_1);
            this.btn_pdkArray.push(btn_2);
            this.showHallPdkMsg(btn_1);


            //十三水
            var panel_game3 = ccui.helper.seekWidgetByName(root,"node_game3");
            panel_game3.setVisible(false);
            this.panel_gamesArray.push(panel_game3);
            this.panel_sss = new Array();
            for(var i = 0;i<3;i++)
            {
                var msg_view = ccui.helper.seekWidgetByName(panel_game3,"msg_view"+i);
                this.panel_sss.push(msg_view);
                var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
                msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
                img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            }

            this.btns_sss = new Array();
            var btn_1 = ccui.helper.seekWidgetByName(panel_game3,"Button_0");
            btn_1.addClickEventListener(this.showSSSMsg.bind(this));
            var btn_2 = ccui.helper.seekWidgetByName(panel_game3,"Button_1");
            btn_2.addClickEventListener(this.showSSSMsg.bind(this));
            var btn_3 = ccui.helper.seekWidgetByName(panel_game3,"Button_2");
            btn_3.addClickEventListener(this.showSSSMsg.bind(this));
            this.btns_sss.push(btn_1);
            this.btns_sss.push(btn_2);
            this.btns_sss.push(btn_3);
            this.showSSSMsg(btn_1);

            this.btn_gamesArray = new Array();
            for(var i = 0; i< 6;i++)
            {
                var btn = ccui.helper.seekWidgetByName(root,"btn_game"+i);
                btn.addClickEventListener(this.onSwitchGame.bind(this));
                if(i == 0)
                {
                    btn.setBright(false);
                    btn.setTouchEnabled(false);
                }
                this.btn_gamesArray.push(btn);
            }


            //启东敲麻
            var panel_game4 = ccui.helper.seekWidgetByName(root,"node_game4");
            panel_game4.setVisible(false);
            var msg_view = ccui.helper.seekWidgetByName(panel_game4,"msg_view");
            var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
            msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
            img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            panel_game0.setVisible(true);
            this.panel_gamesArray.push(panel_game4);

            //启东敲麻
            var panel_game5 = ccui.helper.seekWidgetByName(root,"node_game5");
            panel_game5.setVisible(false);
            var msg_view = ccui.helper.seekWidgetByName(panel_game5,"msg_view");
            var img_content = ccui.helper.seekWidgetByName(msg_view,"Image_content");
            msg_view.setInnerContainerSize(cc.size(img_content.getContentSize().width,img_content.getContentSize().height));
            img_content.setPosition(cc.p(img_content.getPositionX(),img_content.getContentSize().height));
            panel_game0.setVisible(true);
            this.panel_gamesArray.push(panel_game5);

        },

        onSwitchGame:function (sender) {
            this.gameIndex = sender.name == "btn_game0" ?0:1;
            for(var i=0;i<this.btn_gamesArray.length;i++)
            {
                var btn = this.btn_gamesArray[i];
                btn.setBright(btn.name != sender.name);
                btn.setTouchEnabled(btn.name != sender.name);
                this.panel_gamesArray[i].setVisible(btn.name == sender.name);
            }
        },

        onEnter: function () {
            this._super();
        },

        showHallPdkMsg:function(sender){
            sender.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            this.btn_pdkArray.forEach(function(element) {
                if(element.name != sender.name)
                {
                    element.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                }
            });
            this.msg_view15.setVisible(sender.name == "Button_0");
            this.msg_view16.setVisible(sender.name == "Button_1");
        },

        showSSSMsg:function(sender){
            sender.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
            this.btns_sss.forEach(function(element) {
                if(element.name != sender.name)
                {
                    element.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
                }
            });

            for(var i = 0;i<this.btns_sss.length;i++)
            {
                this.panel_sss[i].setVisible(sender.name == "Button_"+i);
            }
        },

        showHelp:function()
        {
            cc.director.getRunningScene().addChild(this);
        },

    });
}
