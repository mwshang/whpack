/**
 * Created by chenhua on 2017/11/5.
 */
var NiuniuChatView = cc.Layer.extend({
    list_usual:null,
    list_expression:null,
    panel_usual:null,
    panel_expression:null,
    editbox_input:null,
    btn_send:null,
    bool_msg:true,
    btn_usual:null,
    btn_expression:null,
    isEmojiLoad:false,
    ctor:function(){
        this._super();
        var JsonRes = GameHallJson.Chat;
        var root = ccs.load(JsonRes).node;
        this.addChild(root);
        this.panel_usual = ccui.helper.seekWidgetByName(root,"Panel_Usual");
        this.panel_expression = ccui.helper.seekWidgetByName(root,"Panel_Expression");
        this.panel_usual.setVisible(this.bool_msg);
        this.panel_expression.setVisible(!this.bool_msg);
        this.list_usual = ccui.helper.seekWidgetByName(this.panel_usual,"ListView_Usual");
        this.list_usual .addEventListener(this.selectedItemEvent,this);
        this.list_expression = ccui.helper.seekWidgetByName(this.panel_expression,"ListView_Expression");
        this.editbox_input = ccui.helper.seekWidgetByName(root,"TextField_Input");
        if(!cc.sys.isNative)
        {
            this.editbox_input.setMaxLength(100);
        }
        this.btn_send = ccui.helper.seekWidgetByName(root,"Button_Send");
        this.btn_send.addClickEventListener(this.onSend.bind(this));

        this.btn_usual = ccui.helper.seekWidgetByName(root,"Button_Usual");
        this.btn_expression = ccui.helper.seekWidgetByName(root,"Button_Expression");
        this.btn_usual.addClickEventListener(this.onSwitchUsual.bind(this));
        this.btn_expression.addClickEventListener(this.onSwitchExp.bind(this));
        this.btn_usual.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);

        var close = ccui.helper.seekWidgetByName(root,"Panel");
        close.addClickEventListener(function(){ this.removeFromParent()});
        //常用语
        var JsonUsualItem = GameHallJson.ChatUsualItem;
        var usualRoot = ccs.load(JsonUsualItem).node;
        var usual_item = ccui.helper.seekWidgetByName(usualRoot, "Panel");
        usual_item.setTouchEnabled(true);
        this.list_usual.setItemModel(usual_item);
        for (var i = 0; i <  NIUNIU_MSG.length; ++i) {
            this.list_usual.pushBackDefaultItem();
            var item = this.list_usual.getItem(i);
            item.getChildByName("Text_Content").setString(NIUNIU_MSG[i]);
        }
    },

    selectedItemEvent: function (sender, type) {
        switch (type) {
            case ccui.ListView.ON_SELECTED_ITEM_END:
                var _this = this;
                hall.getPlayingGame().net.chat({'index':sender.getCurSelectedIndex(),'type':CHAT_TYPE.Usual}, function(data) {
                    if(data['code'] == 200)
                    {
                        _this.removeFromParent();
                    }else
                    {

                    }
                });
                break;
            default:
                break;
        }
    },

    selectExpression:function(sender)
    {
        var _this = this;
        hall.getPlayingGame().net.chat({'index':sender.getTag(),'type':CHAT_TYPE.Exp}, function(data) {
            if(data['code'] == 200)
            {
                _this.removeFromParent();
            }else
            {

            }
        });
    },

    onSwitchUsual:function()
    {
        //setBright
        this.btn_usual.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        this.btn_expression.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
        this.panel_usual.setVisible(true);
        this.panel_expression.setVisible(false);
    },

    onEnter:function()
    {
        this._super();
        this.scheduleOnce(this.loadEmoji,0.2);
    },



    loadEmoji: function (dt) {
        if(!this.isEmojiLoad)
        {
            //表情
            var expRoot = ccs.load(GameHallJson.ChatExpItem).node;
            var exp_item = ccui.helper.seekWidgetByName(expRoot, "Panel");
            var btn_emoji = exp_item.getChildByName('btn_emoji');
            btn_emoji.setVisible(false);
            this.list_expression.setItemModel(exp_item);
            for (var i = 0; i < 6; ++i) {
                var cell = exp_item.clone();
                var btn_emoji = cell.getChildByName('btn_emoji');
                var size = btn_emoji.getContentSize();
                for( var j = 0;j < 10; j++)
                {
                    var emoji = btn_emoji.clone();
                    var index = i*10+j+1;
                    emoji.loadTextureNormal("im"+index+".png",ccui.Widget.PLIST_TEXTURE);
                    emoji.setTag(index);
                    emoji.addClickEventListener(this.selectExpression.bind(this))
                    cell.addChild(emoji);
                    emoji.setVisible(true);
                    emoji.setPosition(size.width*0.5+j*size.width+14*j+14,35);
                }
                var layout = new ccui.Layout();
                layout.setContentSize(cell.getContentSize());
                layout.addChild(cell);
                this.list_expression.pushBackCustomItem(layout);
            }
            this.isEmojiLoad = true;
        }

    },

    onSwitchExp:function()
    {

        this.btn_expression.setBrightStyle(ccui.Widget.BRIGHT_STYLE_HIGH_LIGHT);
        this.btn_usual.setBrightStyle(ccui.Widget.BRIGHT_STYLE_NORMAL);
        this.panel_usual.setVisible(false);
        this.panel_expression.setVisible(true);
    },

    onSend:function()
    {
        var content = this.editbox_input.getString();
        if(content.length > 0)
        {
            if(content.indexOf("##") != -1)
            {
                content = content.substring(2);
                hall.getPlayingGame().net.gmCommand(content);
                this.removeFromParent();
                return;
            }else if(content.indexOf("fp") != -1 && GAMENAME == "shisanshui")
            {
                hall.getPlayingGame().net.gmOp(content);
                this.removeFromParent();
                return;
            }

            var _this = this;
            hall.getPlayingGame().net.chat({'content':content,'type':CHAT_TYPE.Usual}, function(data) {
                JJLog.print(data);
                if(data['code'] == 200)
                {
                    _this.removeFromParent();
                }else
                {

                }
            });
        }
    },

    showPanel:function()
    {
        cc.director.getRunningScene().addChild(this);
    }

});


