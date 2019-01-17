/**
 * Created by chenh on 16/2/23.
 */

if(GAMENAME == "xuezhan")
{
    var HallLoginLayer = cc.Layer.extend({
        textfield_account:null,
        textfield_pwd:null,
        btn_find_pwd:null,
        btn_login:null,
        btn_quick_reg:null,
        btn_weixin:null,
        text_tip:null,
        ctor: function () {
            this._super();
            var root = ccs.load(XueZhanMajhongJson.GameLogin).node;
            this.addChild(root);
            this.textfield_account = ccui.helper.seekWidgetByName(root,"textfield_account");
            this.textfield_account.setPlaceHolderColor(cc.color.GRAY);
            this.textfield_account.setTextColor(cc.color.BLACK);

            this.textfield_pwd = ccui.helper.seekWidgetByName(root,"textfield_pwd");
            this.textfield_pwd.setPlaceHolderColor(cc.color.GRAY);
            this.textfield_pwd.setTextColor(cc.color.BLACK);

            this.btn_login = ccui.helper.seekWidgetByName(root,"btn_login");
            this.btn_login.addClickEventListener(this.onClickLogin.bind(this));

            this.text_tip = ccui.helper.seekWidgetByName(root,"text_tip");
            this.text_tip.setString("");
            this.text_tip.setVisible(false);

            this.btn_weixin = ccui.helper.seekWidgetByName(root,"btn_weixin");
            this.btn_weixin.addClickEventListener(function () {
                JJLog.print('on weixin button click!');
                //cc.sys.openURL("http://www.cocos2d-x.org/");
                //return;

                //load.show("登录中...");
                if(this.agreexieyi <= 0)
                {
                    var dialog = new JJConfirmDialog();
                    dialog.setDes("请先阅读并同意《用户协议》");
                    dialog.showDialog();
                    return;
                }
                MajhongLoading.show('登录中');
                if (qp.net.state == 'init')
                    this.checkVersion();
                else {
                    hall.net.wxLogin(function(data) {
                        JJLog.print("login response msg ->");
                        JJLog.print(data);

                        if(data['code'] == 500)
                        {
                            MajhongLoading.dismiss();
                            var dialog = new JJConfirmDialog();
                            dialog.setDes("网络异常,请稍后再试！");
                            dialog.showDialog();
                        } else if (data.code == 410) {
                            MajhongLoading.dismiss();
                            var dialog = new JJConfirmDialog();
                            dialog.setDes("取消登录！");
                            dialog.showDialog();
                        } else if (data.code == 1000) {
                            MajhongLoading.dismiss();
                            var dialog = new JJConfirmDialog();
                            dialog.setDes("账号已被封停，请联系客服！");
                            dialog.showDialog();
                        } else if (data.code == 1001) {
                            MajhongLoading.dismiss();
                            var dialog = new JJConfirmDialog();
                            dialog.setDes("服务器正在维护中，请稍后再登录游戏！");
                            dialog.showDialog();
                        } else if(data['code'] != 200) {
                            MajhongLoading.dismiss();
                            var dialog = new JJConfirmDialog();
                            dialog.setDes("账号或者密码错误！");
                            dialog.showDialog();
                        } else {
                            MajhongLoading.dismiss();
                        }

                    }.bind(this));
                }
            }.bind(this));

            if (cc.sys.isNative) {
                var account = ccui.helper.seekWidgetByName(root,"sprite_account");
                account.setVisible(false);
                var pwd = ccui.helper.seekWidgetByName(root,"sprite_pwd");
                pwd.setVisible(false);
                var install = util.getWXAppInstalled();
                this.btn_weixin.setVisible(install);
                this.btn_login.setVisible(!install);
                if(!install)
                {
                    this.btn_login.setPositionX(220);
                }
            }
        },

        onClickOpenXieyi:function()
        {
            JJLog.print('打开协议界面')
            var msg = new MajhongXieyi();
            msg.showHelp();
        },
        onClickChooseXieyi:function (sender,type) {
            switch (type)
            {
                case ccui.CheckBox.EVENT_SELECTED:
                    this.agreexieyi = 1;
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    this.agreexieyi = 0;
                    break;
            }
            JJLog.print('协议='+ this.agreexieyi)
        },
        decToHex:function(str) {
            var res=[];
            for(var i=0;i < str.length;i++)
                res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
            return "\\u"+res.join("\\u");
        },
        hexToDec:function(str) {
            str=str.replace(/\\/g,"%");
            return unescape(str);
        },

        onClickLogin:function()
        {
            if(cc.sys.isNative)
            {
                MajhongLoading.show('登录中.....');
                hall.net.guestLogin(function(data) {
                    MajhongLoading.dismiss();
                });
                return;
            }

            if(this.checkInput())
            {
                this.loginAccount();
            }

        },

        loginAccount:function()
        {
            MajhongLoading.show('登录中.....');
            //load.show("登录中...");
            hall.net.login("1",this.textfield_account.getString(), this.textfield_pwd.getString(), '', function(data) {
                // hall.net.guestLogin(function(data) {
                //hall.net.wxLogin(function(data) {

                JJLog.print(data);
                if(data['code'] == 500)
                {
                    MajhongLoading.dismiss();
                    var dialog = new JJConfirmDialog();
                    dialog.setDes("网络异常,请稍后再试！");
                    dialog.showDialog();
                } else if (data.code == 410) {
                    MajhongLoading.dismiss();
                    var dialog = new JJConfirmDialog();
                    dialog.setDes("取消登录！");
                    dialog.showDialog();

                }  else if(data['code'] != 200) {
                    MajhongLoading.dismiss();
                    var dialog = new JJConfirmDialog();
                    dialog.setDes("账号或者密码错误！");
                    dialog.showDialog();
                }  else {
                    MajhongLoading.dismiss();
                }
            }.bind(this));
        },

        onClickQuickReg:function()
        {
            // var panel = new SangongReg();
            // panel.showPanel();

            //hall.net.wxShareScreen(0);
        },

        checkInput:function()
        {
            var account = this.textfield_account.getString();
            this.text_tip.setVisible(false);
            if(account.length <= 0)
            {
                this.text_tip.setString("账户不能为空!");
                this.text_tip.setVisible(true);
                return false;
            }

            var pwd = this.textfield_pwd.getString();
            this.text_tip.setVisible(false);
            if(pwd.length <= 0)
            {
                this.text_tip.setString("密码不能为空!");
                this.text_tip.setVisible(true);
                return false;
            }

            return true;

        },

        onExit:function() {
            // qp.event.stop(this, 'disconnect');
            this._super();
        },

        checkVersion: function () {
            var _this = this;
            hall.net.checkVersion('', function() {
                var user = util.getCacheItem('wxUser');
                if (user != null && user != '') {
                    var lastLogin = util.getCacheItem('wxLoginTime');
                    if (lastLogin != null && lastLogin != '')
                        lastLogin = parseInt(lastLogin);
                    else
                        lastLogin = 0;

                    var now = new Date().getTime();
                    JJLog.print(lastLogin);
                    JJLog.print(now);
                    JJLog.print(now - lastLogin);
                    if (now - lastLogin > 3600*1000*24)
                        util.removeCacheItem('wxUser');

                    var user = util.getCacheItem('wxUser');
                    JJLog.print('user:', user);
                    if (user != null && user != '') {
                        hall.net.wxLogin(function(data) {
                            JJLog.print("login response msg ->");
                            JJLog.print(data);
                            if(data['code'] == 500)
                            {
                                MajhongLoading.dismiss();
                                var dialog = new JJConfirmDialog();
                                dialog.setDes("网络异常,请稍后再试！");
                                dialog.showDialog();
                            }else if (data.code == 1000) {
                                MajhongLoading.dismiss();
                                var dialog = new JJConfirmDialog();
                                dialog.setDes("账号已被封停，请联系客服！");
                                dialog.showDialog();
                            } else if (data.code == 1001) {
                                MajhongLoading.dismiss();
                                var dialog = new JJConfirmDialog();
                                dialog.setDes("服务器正在维护中，请稍后再登录游戏！");
                                dialog.showDialog();
                            } else if(data['code'] != 200) {
                                MajhongLoading.dismiss();
                                var dialog = new JJConfirmDialog();
                                dialog.setDes("账号或者密码错误！");
                                dialog.showDialog();
                            } else {
                                MajhongLoading.dismiss();
                            }

                        }.bind(this));

                    } else
                        MajhongLoading.dismiss();
                } else
                    MajhongLoading.dismiss();
            }.bind(this));
        },

        onEnter:function()
        {
            this._super();

            if (util.getCacheItem('deviceId') == undefined || util.getCacheItem('deviceId') == "")
                util.setCacheItem('deviceId', util.uuid(16, 16));

            if (util.getCacheItem('audioInited') == undefined || util.getCacheItem('audioInited') == "") {
                util.setCacheItem('background_music', 1);
                util.setCacheItem('sound_effect', 1);
                util.setCacheItem('GameMusic', 1);
                util.setCacheItem('GameEffect', 1);
                util.setCacheItem('music_volume', 1);
                util.setCacheItem('effect_volume', 1);
                util.setCacheItem('audioInited', 1);
                util.setCacheItem('sss_model', 1);
            }

            var soundVolume =  util.getCacheItem('effect_volume');
            var musicVolume = util.getCacheItem('music_volume');

            if(musicVolume != null && musicVolume != "" && musicVolume != undefined)
            {
                cc.audioEngine.setMusicVolume(musicVolume);
            }

            if(soundVolume != null && soundVolume != "" && soundVolume != undefined)
            {
                cc.audioEngine.setEffectsVolume(soundVolume);
            }


            var ls = cc.sys.localStorage;
            var key = "sound_switch";
            var result = ls.getItem(key);
            //if(result == "on")
            //{
            //    sound.soundOn = true;
            //}else
            //{
            //    sound.soundOn = false;
            //}

            if (util.getCacheItem('userName') != undefined && util.getCacheItem('userPwd') != undefined) {
                this.textfield_account.setString(util.getCacheItem('userName') );
                this.textfield_pwd.setString(util.getCacheItem('userPwd') );
            }
            var node = new cc.Node();
            cc.director.setNotificationNode(node);
            MajhongLoading.show('连接中...');

            hall.net.init();

            // qp.event.listen(this, "disconnect", function() {
            //     JJLog.print("disconnect");
            //     //暂时屏蔽  刚进游戏一定会弹出来一次
            //     if (qp.net.state == 'init' && qp.net.connectFirst == true) {
            //         MajhongLoading.dismiss();
            //         var panel = new JJConfirmDialog();
            //         panel.setDes('网络不给力，请稍候重新登录!');
            //         panel.showDialog();
            //     }
            // });

            this.checkVersion();
        }

    });
}else
{
    var HallLoginLayer = cc.Layer.extend({
        textfield_account:null,
        textfield_pwd:null,
        btn_find_pwd:null,
        btn_login:null,
        btn_quick_reg:null,
        btn_weixin:null,
        text_tip:null,
        _this:null,
        checkbox_xieyi:null,
        panel_xieyi:null,
        agreexieyi:1,

        ctor: function () {
            this._super();
            var jsonRes = GameHallJson.GameLogin;
            if(GAMENAME.indexOf("shisanshui") != -1)
                jsonRes = SSSPokerJson.GameLogin;
            if(GAMENAME.indexOf("qidong") != -1)
                jsonRes = QDMajhongJson.GameLogin;
            if(GAMENAME.indexOf("wuhan") != -1)
                jsonRes = WHMajhongJson.GameLogin;
            var root = ccs.load(jsonRes).node;
            this.addChild(root);
            this._this = this;

            this.textfield_account = ccui.helper.seekWidgetByName(root,"textfield_account");
            this.textfield_account.setPlaceHolderColor(cc.color.GRAY);
            this.textfield_account.setTextColor(cc.color.BLACK);

            this.textfield_pwd = ccui.helper.seekWidgetByName(root,"textfield_pwd");
            this.textfield_pwd.setPlaceHolderColor(cc.color.GRAY);
            this.textfield_pwd.setTextColor(cc.color.BLACK);

            this.btn_login = ccui.helper.seekWidgetByName(root,"btn_login");
            this.btn_login.addClickEventListener(this.onClickLogin.bind(this));

            this.text_tip = ccui.helper.seekWidgetByName(root,"text_tip");
            this.text_tip.setString("");
            this.text_tip.setVisible(false);

            this.checkbox_xieyi = ccui.helper.seekWidgetByName(root,"checkbox_xieyi");
            this.checkbox_xieyi.setSelected(true);
            this.checkbox_xieyi.addEventListener(this.onClickChooseXieyi,this);

            this.panel_xieyi =  ccui.helper.seekWidgetByName(root,"panel_xieyi");
            this.panel_xieyi.setTouchEnabled(true);
            this.panel_xieyi.addClickEventListener(this.onClickOpenXieyi);

            this.btn_weixin = ccui.helper.seekWidgetByName(root,"btn_weixin");
            this.btn_weixin.addClickEventListener(function () {
                JJLog.print('on weixin button click!');
                //cc.sys.openURL("http://www.cocos2d-x.org/");
                //return;

                //load.show("登录中...");
                if(this.agreexieyi <= 0)
                {
                    var dialog = new JJConfirmDialog();
                    dialog.setDes("请先阅读并同意《用户协议》");
                    dialog.showDialog();
                    return;
                }
                MajhongLoading.show('登录中');
                if (qp.net.state == 'init')
                    this.checkVersion();
                else {
                    hall.net.wxLogin(function(data) {
                        JJLog.print("login response msg ->");
                        JJLog.print(data);

                        if(data['code'] == 500)
                        {
                            MajhongLoading.dismiss();
                            var dialog = new JJConfirmDialog();
                            dialog.setDes("网络异常,请稍后再试！");
                            dialog.showDialog();
                        } else if (data.code == 410) {
                            MajhongLoading.dismiss();
                            var dialog = new JJConfirmDialog();
                            dialog.setDes("取消登录！");
                            dialog.showDialog();
                        }else if (data.code == 1000) {
                            MajhongLoading.dismiss();
                            var dialog = new JJConfirmDialog();
                            dialog.setDes("账号已被封停，请联系客服！");
                            dialog.showDialog();
                        } else if (data.code == 1001) {
                            MajhongLoading.dismiss();
                            var dialog = new JJConfirmDialog();
                            dialog.setDes("服务器正在维护中，请稍后再登录游戏！");
                            dialog.showDialog();
                        } else if(data['code'] != 200) {
                            MajhongLoading.dismiss();
                            var dialog = new JJConfirmDialog();
                            dialog.setDes("账号或者密码错误！");
                            dialog.showDialog();
                        } else {
                            MajhongLoading.dismiss();
                        }

                    }.bind(this));
                }
            }.bind(this));

            //this.text_test = ccui.helper.seekWidgetByName(root,"text_test");
            //this.text_test.setVisible(false);
            //
            //var str = this.decToHex("U+2600");
            //console.log(str);
            //this.text_test.setText(str);
            //str = this.hexToDec("U+2600");
            //console.log(str);
            //
//        var s =base64.encode("❄❄❄❄❄❄☀☁☁☁☁☁☁☁❄❄❄❄❄❄❄");
            //console.log(s);
            //console.log(" ============ ");
            //var s2 = base64.decode(s);
            //console.log(s2);
//        this.text_name.setString('😰😭');

            //var pos = this.textfield_account.getParent().convertToWorldSpace(this.textfield_account.getPosition());
            //var bakeLayer = cc.LayerColor.create(cc.color(128,0, 128, 255), 20, 20);     //test for LayerColor
            //bakeLayer.setPosition(pos);
            //this.addChild(bakeLayer,100);
            if (cc.sys.isNative) {
                var account = ccui.helper.seekWidgetByName(root,"sprite_account");
                account.setVisible(false);
                var pwd = ccui.helper.seekWidgetByName(root,"sprite_pwd");
                pwd.setVisible(false);
                var install = util.getWXAppInstalled();
                this.btn_weixin.setVisible(install);
                this.btn_login.setVisible(!install);
                if(!install)
                {
                    this.btn_login.setPositionX(220);
                }
            }
        },

        onClickOpenXieyi:function()
        {
            JJLog.print('打开协议界面')
            var msg = new MajhongXieyi();
            msg.showHelp();
        },
        onClickChooseXieyi:function (sender,type) {
            switch (type)
            {
                case ccui.CheckBox.EVENT_SELECTED:
                    this.agreexieyi = 1;
                    break;
                case ccui.CheckBox.EVENT_UNSELECTED:
                    this.agreexieyi = 0;
                    break;
            }
            JJLog.print('协议='+ this.agreexieyi)
        },
        decToHex:function(str) {
            var res=[];
            for(var i=0;i < str.length;i++)
                res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
            return "\\u"+res.join("\\u");
        },
        hexToDec:function(str) {
            str=str.replace(/\\/g,"%");
            return unescape(str);
        },

        onClickLogin:function()
        {
            ///////////////////////////////
            // test
            // var str = '{"banker":100005,"oldBanker":100005,"newBanker":100005,"baseScore":0.05,"roundResult":1,"players":[{"uid":100005,"userName":"chen2","nickName":"岑尔曼","paiDest":[{"type":"gang","pai":{"type":"B","value":4},"origin":4},{"type":"peng","pai":{"type":"B","value":1},"sourceChair":0},{"type":"chi","pai":[{"type":"W","value":3},{"type":"W","value":5},{"type":"W","value":4}]},{"type":"gang","pai":{"type":"B","value":5},"origin":5}],"qiPai":{"J":[],"F":[],"W":[],"B":[{"type":"B","value":2},{"type":"B","value":2},{"type":"B","value":6},{"type":"B","value":8}],"T":[{"type":"T","value":7},{"type":"T","value":8},{"type":"T","value":9}]},"winScore":1024,"diScore":640,"tianhu":[],"coinNum":1024,"niao":0,"niaoPai":[],"huType":[{"type":0,"pais":[{"type":"B","value":7}]}],"isHu":1,"isZimo":0,"isFangPao":0,"isDaHu":0,"huDiSocre":1,"isYingHu":1,"fanShu":7,"isKaiKou":1,"isBaoPai":0,"isJinDing":0,"isYuanLai":0,"isFengLai":0,"isYiJiuLai":0,"isLianJin":0},{"uid":110009,"userName":"oFL0xxK0sv6DNlaLzGy3COgyDBgY","nickName":"有烟味的男人","paiDest":[],"qiPai":{"J":[{"type":"J","value":1},{"type":"J","value":2},{"type":"J","value":3}],"F":[{"type":"F","value":1},{"type":"F","value":2},{"type":"F","value":3},{"type":"F","value":4},{"type":"F","value":4}],"W":[],"B":[{"type":"B","value":3},{"type":"B","value":4},{"type":"B","value":5},{"type":"B","value":5}],"T":[{"type":"T","value":9}]},"winScore":-256,"diScore":256,"tianhu":[],"coinNum":-256,"niao":0,"niaoPai":[],"huType":[],"isHu":0,"isZimo":0,"isFangPao":0,"isDaHu":0,"huDiSocre":1,"isYingHu":0,"fanShu":0,"isKaiKou":0,"isBaoPai":0,"isJinDing":0,"isYuanLai":0,"isFengLai":0,"isYiJiuLai":0,"isLianJin":0},{"uid":110016,"userName":"oFL0xxElkBGwgmqcTu6YAZZdeGpA","nickName":"爱梦","paiDest":[],"qiPai":{"J":[{"type":"J","value":1},{"type":"J","value":1}],"F":[{"type":"F","value":1},{"type":"F","value":2},{"type":"F","value":4}],"W":[],"B":[{"type":"B","value":3},{"type":"B","value":3},{"type":"B","value":3},{"type":"B","value":4}],"T":[{"type":"T","value":4},{"type":"T","value":6},{"type":"T","value":8},{"type":"T","value":9}]},"winScore":-512,"diScore":512,"tianhu":[],"coinNum":-512,"niao":0,"niaoPai":[],"huType":[],"isHu":0,"isZimo":0,"isFangPao":1,"isDaHu":0,"huDiSocre":1,"isYingHu":0,"fanShu":1,"isKaiKou":0,"isBaoPai":0,"isJinDing":0,"isYuanLai":0,"isFengLai":0,"isYiJiuLai":0,"isLianJin":0},{"uid":110017,"userName":"oFL0xxJLbSZY2MLa77UFB9BMmunU","nickName":"爱丽","paiDest":[],"qiPai":{"J":[{"type":"J","value":1},{"type":"J","value":2},{"type":"J","value":3},{"type":"J","value":3}],"F":[{"type":"F","value":2},{"type":"F","value":3},{"type":"F","value":3},{"type":"F","value":4}],"W":[],"B":[{"type":"B","value":5}],"T":[{"type":"T","value":5},{"type":"T","value":6},{"type":"T","value":7},{"type":"T","value":9}]},"winScore":-256,"diScore":256,"tianhu":[],"coinNum":-256,"niao":0,"niaoPai":[],"huType":[],"isHu":0,"isZimo":0,"isFangPao":0,"isDaHu":0,"huDiSocre":1,"isYingHu":0,"fanShu":0,"isKaiKou":0,"isBaoPai":0,"isJinDing":0,"isYuanLai":0,"isFengLai":0,"isYiJiuLai":0,"isLianJin":0}],"niao":[],"isOver":0}'
            // var data = JSON.parse(str);
            // var result = new WHMJRoundResult(data,this);
            // result.showResult();
            // return
            /////////////////////////////
            if(cc.sys.isNative)
            {
                MajhongLoading.show('登录中.....');
                hall.net.guestLogin(function(data) {
                    MajhongLoading.dismiss();
                });
                return;
            }

            if(this.checkInput())
            {
                this.loginAccount();
            }

        },

        loginAccount:function()
        {
            MajhongLoading.show('登录中.....');
            //load.show("登录中...");
            hall.net.login("1",this.textfield_account.getString(), this.textfield_pwd.getString(), '', function(data) {
                // hall.net.guestLogin(function(data) {
                //hall.net.wxLogin(function(data) {

                JJLog.print(data);
                if(data['code'] == 500)
                {
                    MajhongLoading.dismiss();
                    var dialog = new JJConfirmDialog();
                    dialog.setDes("网络异常,请稍后再试！");
                    dialog.showDialog();
                } else if (data.code == 410) {
                    MajhongLoading.dismiss();
                    var dialog = new JJConfirmDialog();
                    dialog.setDes("取消登录！");
                    dialog.showDialog();

                }  else if(data['code'] != 200) {
                    MajhongLoading.dismiss();
                    var dialog = new JJConfirmDialog();
                    dialog.setDes("账号或者密码错误！");
                    dialog.showDialog();
                }  else {
                    MajhongLoading.dismiss();
                }
            }.bind(this));
        },


        onClickFindPwd:function()
        {
//        var panel = new SangongPrivateCreatePanel();
//        panel.showPanel();
//        return;

            var panel = new SangongDialogFindPwd();
            panel.showPanel();
        },

        onClickQuickReg:function()
        {
            // var panel = new SangongReg();
            // panel.showPanel();

            //hall.net.wxShareScreen(0);
        },

        checkInput:function()
        {
            var account = this.textfield_account.getString();
            this.text_tip.setVisible(false);
            if(account.length <= 0)
            {
                this.text_tip.setString("账户不能为空!");
                this.text_tip.setVisible(true);
                return false;
            }

            var pwd = this.textfield_pwd.getString();
            this.text_tip.setVisible(false);
            if(pwd.length <= 0)
            {
                this.text_tip.setString("密码不能为空!");
                this.text_tip.setVisible(true);
                return false;
            }

            return true;

        },

        onExit:function() {
            // qp.event.stop(this, 'disconnect');
            this._super();
        },

        checkVersion: function () {
            var _this = this;
            hall.net.checkVersion('', function() {
                // hall.songshen = data['isShen'];
                // if(hall.songshen == 1)
                // {
                //     _this.btn_login.setVisible(true);
                // }
                //
                // if (data['isDownGame'] == 1)
                // {
                //     MajhongLoading.dismiss();
                //     var dialog = new JJConfirmDialog();
                //     dialog.setDes('发现新版本，前去下载更新！');
                //     dialog.setCallback(function () {
                //         if (cc.sys.isNative && cc.sys.OS_IOS == cc.sys.os) {
                //             cc.sys.openURL(data['downloadUrlIOS']);
                //         }else if(cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID)
                //         {
                //             cc.sys.openURL(data['downloadUrlAndroid']);
                //         }else
                //         {
                //             cc.sys.openURL('Http://www.baidu.com');
                //             cc.director.end();
                //             qp.exit();
                //         }
                //     });
                //     dialog.showDialog();
                //     return;
                // }


                var user = util.getCacheItem('wxUser');
                if (user != null && user != '') {
                    var lastLogin = util.getCacheItem('wxLoginTime');
                    if (lastLogin != null && lastLogin != '')
                        lastLogin = parseInt(lastLogin);
                    else
                        lastLogin = 0;

                    var now = new Date().getTime();
                    JJLog.print(lastLogin);
                    JJLog.print(now);
                    JJLog.print(now - lastLogin);
                    if (now - lastLogin > 3600*1000*24)
                        util.removeCacheItem('wxUser');

                    var user = util.getCacheItem('wxUser');
                    JJLog.print('user:', user);
                    if (user != null && user != '') {
                        hall.net.wxLogin(function(data) {
                            JJLog.print("login response msg ->");
                            JJLog.print(data);
                            if(data['code'] == 500)
                            {
                                MajhongLoading.dismiss();
                                var dialog = new JJConfirmDialog();
                                dialog.setDes("网络异常,请稍后再试！");
                                dialog.showDialog();
                            }else if (data.code == 1000) {
                                MajhongLoading.dismiss();
                                var dialog = new JJConfirmDialog();
                                dialog.setDes("账号已被封停，请联系客服！");
                                dialog.showDialog();
                            } else if (data.code == 1001) {
                                MajhongLoading.dismiss();
                                var dialog = new JJConfirmDialog();
                                dialog.setDes("服务器正在维护中，请稍后再登录游戏！");
                                dialog.showDialog();
                            } else if(data['code'] != 200) {
                                MajhongLoading.dismiss();
                                var dialog = new JJConfirmDialog();
                                dialog.setDes("账号或者密码错误！");
                                dialog.showDialog();
                            } else {
                                MajhongLoading.dismiss();
                            }

                        }.bind(this));

                    } else
                        MajhongLoading.dismiss();
                } else
                    MajhongLoading.dismiss();
            }.bind(this));
        },

        onEnter:function()
        {
            this._super();

            if (util.getCacheItem('deviceId') == undefined || util.getCacheItem('deviceId') == "")
                util.setCacheItem('deviceId', util.uuid(16, 16));

            if (util.getCacheItem('audioInited') == undefined || util.getCacheItem('audioInited') == "") {
                util.setCacheItem('background_music', 1);
                util.setCacheItem('sound_effect', 1);
                util.setCacheItem('GameMusic', 1);
                util.setCacheItem('GameEffect', 1);
                util.setCacheItem('music_volume', 1);
                util.setCacheItem('effect_volume', 1);
                util.setCacheItem('audioInited', 1);
                util.setCacheItem('sss_model', 1);
            }

            var soundVolume =  util.getCacheItem('effect_volume');
            var musicVolume = util.getCacheItem('music_volume');

            if(musicVolume != null && musicVolume != "" && musicVolume != undefined)
            {
                cc.audioEngine.setMusicVolume(musicVolume);
            }

            if(soundVolume != null && soundVolume != "" && soundVolume != undefined)
            {
                cc.audioEngine.setEffectsVolume(soundVolume);
            }


            var ls = cc.sys.localStorage;
            var key = "sound_switch";
            var result = ls.getItem(key);
            //if(result == "on")
            //{
            //    sound.soundOn = true;
            //}else
            //{
            //    sound.soundOn = false;
            //}

            if (util.getCacheItem('userName') != undefined && util.getCacheItem('userPwd') != undefined) {
                this.textfield_account.setString(util.getCacheItem('userName') );
                this.textfield_pwd.setString(util.getCacheItem('userPwd') );
            }
            var node = new cc.Node();
            cc.director.setNotificationNode(node);
            MajhongLoading.show('连接中...');

            hall.net.init();

            // qp.event.listen(this, "disconnect", function() {
            //     JJLog.print("disconnect");
            //     //暂时屏蔽  刚进游戏一定会弹出来一次
            //     if (qp.net.state == 'init' && qp.net.connectFirst == true) {
            //         MajhongLoading.dismiss();
            //         var panel = new JJConfirmDialog();
            //         panel.setDes('网络不给力，请稍候重新登录!');
            //         panel.showDialog();
            //     }
            // });

            this.checkVersion();
            club.initClub();
        }

    });
}
var SangongLoginScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var loginmain = new HallLoginLayer();
        this.addChild(loginmain);
    }
});

