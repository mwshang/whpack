var Chat = cc.Layer.extend({
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
        var root = ccs.load("res/MajhongBase/MajhongChat.json").node;
        this.addChild(root);
        this.panel_usual = ccui.helper.seekWidgetByName(root,"Panel_Usual");
        this.panel_expression = ccui.helper.seekWidgetByName(root,"Panel_Expression");
        this.panel_usual.setVisible(this.bool_msg);
        this.panel_expression.setVisible(!this.bool_msg);
        this.list_usual = ccui.helper.seekWidgetByName(this.panel_usual,"ListView_Usual");
        this.list_usual .addEventListener(this.selectedItemEvent,this);
        this.list_expression = ccui.helper.seekWidgetByName(this.panel_expression,"ListView_Expression");
        this.editbox_input = ccui.helper.seekWidgetByName(root,"TextField_Input");
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
        var usualRoot = ccs.load("res/MajhongBase/MajhongChatUsualItem.json").node;
        var usual_item = ccui.helper.seekWidgetByName(usualRoot, "Panel");
        usual_item.setTouchEnabled(true);
        this.list_usual.setItemModel(usual_item);
        for (var i = 0; i <  CHAT_USUALMSG.length; ++i) {
            this.list_usual.pushBackDefaultItem();
            var item = this.list_usual.getItem(i);
            item.getChildByName("Text_Content").setString(CHAT_USUALMSG[i]);
        }
        ////表情
        //var expRoot = ccs.load("res/MajhongChatExpItem.json").node;
        //var exp_item = ccui.helper.seekWidgetByName(expRoot, "Panel");
        //this.list_expression.setItemModel(exp_item);
        //for (var i = 0; i < CHAT_EMOJI.length/8; ++i) {
        //    this.list_expression.pushBackDefaultItem();
        //    var item = this.list_expression.getItem(i);
        //    for( var j = 0;j < 8; j++)
        //    {
        //        var btn = item.getChildByName("Button_"+ j);
        //        if (btn)
        //        {
        //            btn.loadTextureNormal(CHAT_EMOJI[i*8+j],ccui.Widget.PLIST_TEXTURE);
        //            btn.loadTexturePressed(CHAT_EMOJI[i*8+j],ccui.Widget.PLIST_TEXTURE);
        //            btn.setTag(i*8 + j);
        //            btn.addClickEventListener(this.selectExpression.bind(this))
        //        }
        //    }
        //}
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
      //this.loadEmoji();
      this.scheduleOnce(this.loadEmoji,0.2);
    },



    loadEmoji: function (dt) {
      if(!this.isEmojiLoad)
      {
        //表情
        var expRoot = ccs.load("res/MajhongBase/MajhongChatExpItem.json").node;
        var exp_item = ccui.helper.seekWidgetByName(expRoot, "Panel");
        var btn_emoji = exp_item.getChildByName('btn_emoji');
        btn_emoji.setVisible(false);
        this.list_expression.setItemModel(exp_item);
        for (var i = 0; i < CHAT_EMOJI.length/7; ++i) {
          var cell = exp_item.clone();
          var btn_emoji = cell.getChildByName('btn_emoji');
          var size = btn_emoji.getContentSize();
          for( var j = 0;j < 7; j++)
          {
            var emoji = btn_emoji.clone();
            emoji.loadTextureNormal(CHAT_EMOJI[i*7+j],ccui.Widget.PLIST_TEXTURE);
            //emoji.loadTexturePressed(CHAT_EMOJI[i*7+j],ccui.Widget.PLIST_TEXTURE);
            emoji.setTag(i*7 + j);
            emoji.addClickEventListener(this.selectExpression.bind(this))
            cell.addChild(emoji);
            emoji.setVisible(true);
            emoji.setPosition(size.width*0.5+j*size.width+10*j+14,40);
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
                majhong.net.gmCommand(content);
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




