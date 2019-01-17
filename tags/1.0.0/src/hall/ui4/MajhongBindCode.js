/**
 * Created by chenh on 16/2/23.
 */

var MajhongBindCode = cc.Layer.extend({
    textfield_code:null,
    btn_bind:null,
    btn_close:null,
    img_isbind:null,
    ctor: function () {
        this._super();
        var JsonRes = GameHallJson.BindCode;
        if(GAMENAME.indexOf("ningxiang") != -1)
            JsonRes = WHMajhongJson.BindCode;
        var root = ccs.load(JsonRes).node;
        this.addChild(root);

        this.textfield_code =ccui.helper.seekWidgetByName(root,"textfield_code");
        this.textfield_code.setPlaceHolderColor(cc.color.GRAY);
        this.textfield_code.setTextColor(cc.color.WHITE);

        this.text_tip = ccui.helper.seekWidgetByName(root,"text_tip");
        this.text_tip.setString("");
        this.text_tip.setVisible(false);

        this.btn_bind =ccui.helper.seekWidgetByName(root,"btn_bind");
        this.btn_bind.addClickEventListener(this.onclickBindCode.bind(this));
        //this.btn_bind.setVisible(false);
        this.btn_close =  ccui.helper.seekWidgetByName(root,"btn_close");
        this.btn_close.addClickEventListener(this.onclickBtnClose.bind(this));

        this.img_isbind = ccui.helper.seekWidgetByName(root,"img_isbind");
        this.img_isbind.setVisible(false);

        //this.checkBing();
    },

    checkBing:function()
    {
        var _this = this;

        if(hall.user['agentCode'] == '0' || hall.user['agentCode']== null ||hall.user['agentCode']== undefined ||
            hall.user['agentCode']=='')
        {
            hall.net.checkBind(function(data) {
                JJLog.print('查询绑定回调=' + JSON.stringify(data));
                if(data['code'] == 200)
                {
                    if(data['data']  == '0' || data['data'] == null ||data['data'] == undefined ||
                        data['data'] =='')
                    {
                        _this.btn_bind.setVisible(true);
                        _this.img_isbind.setVisible(false);
                    }else
                    {
                        _this.btn_bind.setVisible(false);
                        _this.img_isbind.setVisible(true);
                    }
                }else
                {
                    if(data['msg'] != undefined && data['msg'] != null)
                    {
                        var dialog = new JJConfirmDialog();
                        dialog.setDes(data['msg']);
                        dialog.showDialog();
                    }
                }
            });
        }else
        {JJLog.print('-----------------------=');
            _this.btn_bind.setVisible(false);
            _this.img_isbind.setVisible(true);
        }
    },

    onclickBindCode:function()
    {
        var _this = this;
        if(this.checkInput())
        {
            var code = _this.textfield_code.getString();
            hall.net.bindCode({'uid':hall.user.uid ,'inviteCode':code,'serverType':'qidong'},function(data)
                {
                    JJLog.print('绑定回调=' + JSON.stringify(data));
                    if(data['code'] == 200)
                    {
                        hall.user['agentCode'] = code;
                        _this.btn_bind.setVisible(false);
                        _this.img_isbind.setVisible(true);

                    }else
                    {
                        if(data['msg'] != undefined && data['msg'] != null)
                        {
                            var dialog = new JJConfirmDialog();
                            dialog.setDes(data['msg']);
                            dialog.showDialog();
                        }
                    }

                }
            )

        }

    },

    onclickBtnClose:function()
    {
        this.removeFromParent();
    },
    checkInput:function()
    {
        var code = this.textfield_code.getString();
        this.text_tip.setVisible(false);
        if(code.length <= 0)
        {
            this.text_tip.setString("邀请码不能为空!");
            this.text_tip.setVisible(true);
            return false;
        }

        return true;
    },

    showBindCode: function () {
        cc.director.getRunningScene().addChild(this);
    },

    onEnter:function()
    {
        this._super();
    },
    onExit: function ()
    {
        this._super();
    },

});



