//俱乐部弹出层页面

var ClubInputJoinPack = cc.Layer.extend({
    btn_reset:null,
    btn_del: null,
    textArray: null,
    btnArray: null,
    callback:null,
    ctor: function (cb) {
        this._super();

        var root = ccs.load(ClubJson.InputJoinPack).node;
        this.addChild(root);
        this.callback = cb;
        this.btnArray = new Array();
        for (var i = 0; i < 10; i++) {
            var str = "btn_" + i;
            var btn = ccui.helper.seekWidgetByName(root, str);
            btn.setTag(i);
            var data = {};
            data['root'] = this;
            data['tag'] = i;
            btn.addClickEventListener(this.onNum.bind(data));
            this.btnArray.push(btn);
        }

        this.textArray = new Array();
        for (var i = 0; i < 7; i++) {
            var str = "text" + i;
            var text = ccui.helper.seekWidgetByName(root, str);
            text.setString('');
            this.textArray.push(text);
        }

        this.btn_del = ccui.helper.seekWidgetByName(root, "btn_del");
        this.btn_del.addClickEventListener(this.onDel.bind(this));
        this.btn_reset = ccui.helper.seekWidgetByName(root, "btn_reset");
        this.btn_reset.addClickEventListener(this.onRest.bind(this));
        this.btn_close = ccui.helper.seekWidgetByName(root, "btn_close");

        this.btn_close.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));

    },

    onNum: function () {

        var root = this['root'];
        if (root.textArray[root.textArray.length - 1].length > 0)
            return;
        var num = this['tag'];
        for (var i = 0; i < root.textArray.length; i++) {
            var text = root.textArray[i];
            if (text.getString().length <= 0) {
                text.setString(num);
                break;
            }
        }

        var packNum = '';
        for (var i = 0; i < root.textArray.length; i++) {
            var text = root.textArray[i];
            packNum += text.getString();
            if (text.getString().length <= 0) {
                return;
            }
        }
        // var _r = root;

        root.callback(packNum);
        root.removeFromParent();

    },


    showErr: function (data) {
        this.onRest();
        var dialog = new JJConfirmDialog();
        dialog.setDes(data['error']);
        dialog.showDialog();
    },


    onRest: function () {
        for (var i = 0; i < this.textArray.length; i++) {
            var text = this.textArray[i];
            text.setString('');

        }
    },

    onDel: function () {

        for (var i = this.textArray.length; i > 0; i--) {
            var text = this.textArray[i - 1];
            if (text.getString().length > 0) {
                text.setString('');
                break;
            }
        }
    },

    onEnter: function () {
        this._super();

    },

    showPanel: function () {
        cc.director.getRunningScene().addChild(this);
    }

});

var ClubInputPlayerPanel = cc.Layer.extend({
    btn_reset:null,
    btn_del: null,
    textArray: null,
    btnArray: null,
    callback:null,
    ctor: function (cb) {
        this._super();

        var root = ccs.load(ClubJson.InviteInputPlayer).node;
        this.addChild(root);
        this.callback = cb;
        this.btnArray = new Array();
        for (var i = 0; i < 10; i++) {
            var str = "btn_" + i;
            var btn = ccui.helper.seekWidgetByName(root, str);
            btn.setTag(i);
            var data = {};
            data['root'] = this;
            data['tag'] = i;
            btn.addClickEventListener(this.onNum.bind(data));
            this.btnArray.push(btn);
        }

        this.textArray = new Array();
        for (var i = 0; i < 6; i++) {
            var str = "text" + i;
            var text = ccui.helper.seekWidgetByName(root, str);
            text.setString('');
            this.textArray.push(text);
        }

        this.btn_del = ccui.helper.seekWidgetByName(root, "btn_del");
        this.btn_del.addClickEventListener(this.onDel.bind(this));
        this.btn_reset = ccui.helper.seekWidgetByName(root, "btn_reset");
        this.btn_reset.addClickEventListener(this.onRest.bind(this));
        this.btn_close = ccui.helper.seekWidgetByName(root, "btn_close");

        this.btn_close.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));

    },

    onNum: function () {

        var root = this['root'];
        if (root.textArray[root.textArray.length - 1].length > 0)
            return;
        var num = this['tag'];
        for (var i = 0; i < root.textArray.length; i++) {
            var text = root.textArray[i];
            if (text.getString().length <= 0) {
                text.setString(num);
                break;
            }
        }

        var player_uid = '';
        for (var i = 0; i < root.textArray.length; i++) {
            var text = root.textArray[i];
            player_uid += text.getString();
            if (text.getString().length <= 0) {
                return;
            }
        }
        // var _r = root;

        root.callback(player_uid);
        root.removeFromParent();

    },


    showErr: function (data) {
        this.onRest();
        var dialog = new JJConfirmDialog();
        dialog.setDes(data['error']);
        dialog.showDialog();
    },


    onRest: function () {
        for (var i = 0; i < this.textArray.length; i++) {
            var text = this.textArray[i];
            text.setString('');

        }
    },

    onDel: function () {

        for (var i = this.textArray.length; i > 0; i--) {
            var text = this.textArray[i - 1];
            if (text.getString().length > 0) {
                text.setString('');
                break;
            }
        }
    },

    onEnter: function () {
        this._super();

    },

    showPanel: function () {
        cc.director.getRunningScene().addChild(this);
    }

});

var clubInviteButton = cc.Layer.extend({
    pid: null,
    tableId: null,
    ctor: function (pid, tableId) {
        this._super();
        var root = ccs.load(ClubJson.InviteButton).node;
        this.addChild(root);
        this.pid = pid;
        this.tableId = tableId;
        this.btn_invite = ccui.helper.seekWidgetByName(root, "btn_invite_pack");
        this.btn_invite.addClickEventListener(function () {
            this.onInvite();
        }.bind(this));
    },
    onEnter: function () {
        this._super();
    },
    onInvite: function () {
            var DecideDialog = new JJMajhongDecideDialog();
            DecideDialog.setCallback(function () {
                club.net.packApplyJoinGame(this.pid, this.tableId, function (data) {
                    JJLog.print(JSON.stringify(data));
                })
            }.bind(this));
            DecideDialog.setDes("确定要邀请群成员加入房间吗?");
            DecideDialog.showDialog();
    },
    show: function (node) {
        if (node) {
            node.addChild(this);
        } else {
            cc.director.getRunningScene().addChild(this);
        }
    },
});

var clubPackNotice = cc.Layer.extend({
    input_notice: null,
    text_notice: null,
    updateCallback: null,
    pid: null,
    type: null,
    notice: null,
    mRoot:null,

    ctor: function (data, notice, type, cb) {
        this._super();
        var root = ccs.load(ClubJson.Notice).node;
        this.addChild(root);
        this.mRoot =  root;
        this.pid = data;
        this.updateCallback = cb;
        this.notice = notice;
        this.type = type;
        this.input_notice = ccui.helper.seekWidgetByName(root, "input_notice");
        this.text_notice = ccui.helper.seekWidgetByName(root, "text_notice");
        this.input_notice.setVisible(false);
        this.text_notice.setVisible(true);

        var btn_back = ccui.helper.seekWidgetByName(root, "btn_back");
        btn_back.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
        var btn_xiugai = ccui.helper.seekWidgetByName(root, "btn_xiugai");
        btn_xiugai.setVisible(false);
        if (type == club.type.admin) {
            btn_xiugai.setVisible(true);
            btn_xiugai.addClickEventListener(function () {
                this.onSetNotice();
                this.removeFromParent();
            }.bind(this));

            this.input_notice.setVisible(true);
            this.text_notice.setVisible(false);
        }
    },
    onEnter: function () {
        this._super();

        //this.input_notice = util.ChangeTextField2EditBox(ccui.helper.seekWidgetByName(this.mRoot,"input_notice"));
        this.updateLayer();
    },
    updateLayer: function () {
        if (this.type == club.type.admin) {
            this.input_notice.setString(this.notice);
        } else {
            this.text_notice.setString(this.notice || "暂时没有群公告");
            this.text_notice.setContentSize(this.text_notice.getVirtualRenderer());
        }
    },
    onSetNotice: function () {
        var str = this.input_notice.getString();
        var cb = this.updateCallback;
        if (str != "") {
            if (str == this.notice) {
                // var dialog = new JJConfirmDialog();
                // dialog.setDes("不要设置重复的公告!");
                // dialog.showDialog();
                return;
            }
            club.net.updatePackNotice(this.pid, str, function (data) {
                console.log("data=>", data);
                if (data.code == 200) {
                    cb();
                    var dialog = new JJConfirmDialog();
                    dialog.setDes("设置群公告成功!");
                    dialog.showDialog();
                } else {
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(data.error);
                    dialog.showDialog();
                }
            })
        } else {
            var dialog = new JJConfirmDialog();
            dialog.setDes("群公告不能为空!");
            dialog.showDialog();
        }
    },
    show: function () {
        cc.director.getRunningScene().addChild(this);
    }
});

var clubRecharge = cc.Layer.extend({
    input_recharge: null,
    updateCallback: null,
    pid: null,
    mRoot:null,

    ctor: function (data, cb) {
        this._super();
        var root = ccs.load(ClubJson.Recharge).node;
        this.addChild(root);
        this.mRoot = root;
        this.pid = data;
        this.updateCallback = cb;
        this.input_recharge = ccui.helper.seekWidgetByName(root, "input_recharge");

        var btn_ok = ccui.helper.seekWidgetByName(root, "btn_ok");
        btn_ok.addClickEventListener(function () {
            this.addFangka();
            this.removeFromParent();
        }.bind(this));
        var btn_cancel = ccui.helper.seekWidgetByName(root, "btn_cancel");
        btn_cancel.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
    },
    onEnter: function () {
        this._super();
       // this.input_recharge = util.ChangeTextField2EditBox(ccui.helper.seekWidgetByName(this.mRoot,"input_recharge"));

    },
    addFangka: function () {
        var str = this.input_recharge.getString();
        var cb = this.updateCallback;
        if (str != "") {
            if (parseInt(str) == str && parseInt(str) > 0) {
                club.net.addPackFangka(this.pid, str, function (data) {
                    console.log("data=>", data);
                    if (data.code == 200) {
                        cb();
                        var dialog = new JJConfirmDialog();
                        dialog.setDes("添加钻石成功!");
                        dialog.showDialog();
                    } else {
                        var dialog = new JJConfirmDialog();
                        dialog.setDes(data.error);
                        dialog.showDialog();
                    }
                })
            } else {
                var dialog = new JJConfirmDialog();
                dialog.setDes("请输入正确的钻石数量!");
                dialog.showDialog();
            }
        } else {
            var dialog = new JJConfirmDialog();
            dialog.setDes("充值数量不能为空!");
            dialog.showDialog();
        }
    },
    show: function () {
        cc.director.getRunningScene().addChild(this);
    }
});

var clubCreatePack = cc.Layer.extend({
    updateCallback: null,
    mRoot:null,
    ctor: function (cb) {
        this._super();
        var root = ccs.load(ClubJson.CreatePack).node;
        this.addChild(root);
        this.mRoot = root;
        this.updateCallback = cb;
        this.input_pack_name = ccui.helper.seekWidgetByName(root, "input_pack_name");

        var btn_ok = ccui.helper.seekWidgetByName(root, "btn_ok");
        btn_ok.addClickEventListener(function () {
            this.createPack();
            this.removeFromParent();
        }.bind(this));
        var btn_cancel = ccui.helper.seekWidgetByName(root, "btn_cancel");
        btn_cancel.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
    },
    onEnter: function () {
        this._super();
        this.input_pack_name = util.ChangeTextField2EditBox(ccui.helper.seekWidgetByName(this.mRoot,"input_pack_name"));
    },
    createPack: function () {
        var str = this.input_pack_name.getString();
        var cb = this.updateCallback;
        if (str != "") {
            club.net.createPack(str, function (data) {
                console.log("data=>", data);
                if (data.code == 200) {
                    cb(data.pid);
                } else {
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(data.error);
                    dialog.showDialog();
                }
            })
        }
    },
    show: function () {
        cc.director.getRunningScene().addChild(this);
    }
});

var clubMainLayer = cc.Layer.extend(
    {
        item_pack: null,
        list_pack: null,

        panel_list_applyPack: null,
        panel_applyPack_cell: null,

        panel_have_pack: null,
        panel_no_pack: null,

        panel_title: null,
        panel_no_apply: null,

        select_pack: null,
        input_pack_id: null,
        //type 1 表示正常状态打开 2 表示管理界面打开
        type: null,

        ctor: function (type) {
            this._super();
            var root = ccs.load(ClubJson.ClubMain).node;
            this.addChild(root);

            this.type = type;
            this.input_pack_id = ccui.helper.seekWidgetByName(root, "input_pack_id");

            var panel_input_pack = ccui.helper.seekWidgetByName(root, "panel_input_pack");
            panel_input_pack.addClickEventListener(function () {
                var panel = new ClubInputJoinPack(function (data) {
                    this.input_pack_id.setString(data);
                }.bind(this));
                panel.showPanel();
            }.bind(this));

            var btn_back = ccui.helper.seekWidgetByName(root, "btn_back");
            btn_back.addClickEventListener(function () {
                this.removeFromParent();
            }.bind(this));

            var btn_join = ccui.helper.seekWidgetByName(root, "btn_join");
            btn_join.addClickEventListener(function () {
                this.packApplyJoin();
            }.bind(this));

            var btn_create_pack = ccui.helper.seekWidgetByName(root, "btn_create_pack");
            btn_create_pack.addClickEventListener(function (sender) {
                this.createPack();
            }.bind(this));
            // if (hall.user.vipLevel < 10) {
            //     btn_create_pack.setVisible(false);
            // }

            this.list_pack = ccui.helper.seekWidgetByName(root, "panel_list_pack");
            this.list_pack.setVisible(true);
            this.item_pack = ccui.helper.seekWidgetByName(root, 'panel_pack');
            this.item_pack.setVisible(true);
            var btn_select_pack = ccui.helper.seekWidgetByName(this.item_pack, 'btn_select_pack');
            btn_select_pack.addClickEventListener(function (sender) {
                this.clickItemPack(sender);
            }.bind(this));
            var btn_guanli_pack = ccui.helper.seekWidgetByName(this.item_pack, 'btn_guanli_pack');
            btn_guanli_pack.addClickEventListener(function (sender) {
                this.clickItemAdiminPack(sender);
            }.bind(this));

            this.panel_have_pack = ccui.helper.seekWidgetByName(root, "panel_have_pack");
            this.panel_no_pack = ccui.helper.seekWidgetByName(root, "panel_no_pack");
            this.panel_have_pack.setVisible(false);
            this.panel_no_pack.setVisible(false);

            var panel_right = ccui.helper.seekWidgetByName(root, "panel_right");
            this.panel_applyPack_cell = ccui.helper.seekWidgetByName(panel_right, "panel_applyPack_cell");
            this.panel_title = ccui.helper.seekWidgetByName(panel_right, "panel_title");
            this.panel_no_apply = ccui.helper.seekWidgetByName(panel_right, "panel_no_apply");

            this.panel_title.setVisible(false);
            this.panel_no_apply.setVisible(false);

            var btn_reject = ccui.helper.seekWidgetByName(this.panel_applyPack_cell, "btn_reject");
            btn_reject.addClickEventListener(function (sender) {
                this.playerCancelApply(sender);
            }.bind(this));
            btn_reject.setVisible(true);
            this.panel_list_applyPack = ccui.helper.seekWidgetByName(panel_right, "panel_list_applyPack");

        },
        onEnter: function () {
            this._super();
            this.registerListener();
            this.getPlayerPack();
            this.getPlayerApplyList();
        },
        onExit: function () {
            this._super();
            this.removeAllListener();
        },
        enter: function () {
            cc.director.getRunningScene().addChild(this);
        },
        registerListener: function () {
            qp.event.listen(this, 'packNotifyJoin', this.packNotifyJoin.bind(this));
            qp.event.listen(this, 'packNotifyRejectJoin', this.packNotifyRejectJoin.bind(this));
        },
        removeAllListener: function () {
            qp.event.stop(this, 'packNotifyOnlineList');
            qp.event.stop(this, 'packNotifyRejectJoin');
        },
        getPlayerPack: function () {
            club.net.getPlayerPack(function (data) {
                if (data.code == 200) {
                    data = data.data;
                    data = this.sortPack(data);
                    this.updatePlayerPack(data);
                } else {
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(data["error"]);
                    dialog.showDialog();
                }
            }.bind(this))
        },
        sortPack: function (data) {
            var _data = data.sort(function (a, b) {
                if (club.default_pack > 0) {
                    if (a.pid == club.default_pack) return -1;
                    if (b.pid == club.default_pack) return 1;
                }
                return 0;
            });
            return _data;
        },
        updatePlayerPack: function (data) {
            console.log("data=>", data);
            this.list_pack.removeAllChildren();
            if (data.length > 0) {
                this.panel_have_pack.setVisible(true);
                this.panel_no_pack.setVisible(false);
                for (var i = 0; i < data.length; i++) {
                    var cell = this.item_pack.clone();
                    var item = data[i];
                    var pack_name = ccui.helper.seekWidgetByName(cell, "text_pack_name");
                    var pack_id = ccui.helper.seekWidgetByName(cell, "text_pack_id");
                    var img_tip = ccui.helper.seekWidgetByName(cell, "img_tip");
                    var btn_select_pack = ccui.helper.seekWidgetByName(cell, 'btn_select_pack');
                    var btn_guanli_pack = ccui.helper.seekWidgetByName(cell, 'btn_guanli_pack');
                    var tip_apply = ccui.helper.seekWidgetByName(btn_guanli_pack, "apply_tip_number");
                    var text_apply = ccui.helper.seekWidgetByName(btn_guanli_pack, "text_tip_apply");
                    btn_select_pack.clickData = item;
                    btn_guanli_pack.clickData = item;

                    pack_id.setString("ID:" + item.packNum);
                    pack_id.setColor(club.colors.pack_id);

                    pack_name.setString(item.name);
                    pack_name.setColor(club.colors.pack_name);

                    img_tip.setVisible(false);
                    tip_apply.setVisible(false);
                    text_apply.setVisible(false);
                    btn_select_pack.setVisible(true);
                    btn_guanli_pack.setVisible(false);
                    if (hall.user.uid == item.ownerUid) {
                        btn_guanli_pack.setVisible(true);
                        btn_select_pack.setPositionY(81);
                        this.getPackApplyList(item.pid, tip_apply, text_apply);
                    } else {
                        btn_select_pack.setPositionY(50);
                    }
                    if (club.default_pack > 0 && club.default_pack == item.pid) {
                        img_tip.setVisible(true);
                        btn_select_pack.setVisible(false);
                        if (this.type == club.type.admin) {
                            btn_select_pack.setVisible(true);
                            btn_select_pack.setPositionY(25);
                            btn_guanli_pack.setVisible(false);
                        }
                    }
                    this.list_pack.pushBackCustomItem(cell);
                }
            } else {
                this.panel_have_pack.setVisible(false);
                this.panel_no_pack.setVisible(true);
            }
        },
        clickItemPack: function (sender) {
            console.log(sender.clickData);
            this.joinPack(sender.clickData);

        },
        clickItemAdiminPack: function (sender) {
            console.log(sender.clickData);
            this.adminPack(sender.clickData);
        },
        joinPack: function (data) {
            console.log("select pack", data);
            // if (club.default_pack != data.pid) {
            util.setCacheItem("default_pack", data.pid);
            club.default_pack = data.pid;
            club.joinPack(data);
            // }
            this.removeFromParent();
        },
        adminPack: function (data) {
            console.log("admin pack", data);
            util.setCacheItem("default_pack", data.pid);
            club.default_pack = data.pid;
            club.joinAdminPack(data);
            this.removeFromParent();
        },
        createPack: function () {
            var layer = new clubCreatePack(function (data) {
                this.createAndJoinPack(data);
            }.bind(this));
            layer.show();
        },
        createAndJoinPack: function (pid) {
            club.net.getPlayerPack(function (data) {
                if (data.code == 200) {
                    data = data.data;
                    for (var i =0; i<data.length; i++) {
                        var item = data[i];
                        if (item.pid == pid) {
                            this.adminPack(item);
                        }
                    }
                    var dialog = new JJConfirmDialog();
                    dialog.setDes("创建俱乐部成功!");
                    dialog.showDialog();
                } else {
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(data["error"]);
                    dialog.showDialog();
                }
            }.bind(this))
        },
        getPackApplyList: function (pid, tip, text) {
            club.net.packApplyList(pid, function (data) {
                console.log("data =>", data);
                if (data.code == 200) {
                    data = data.data;
                    if (data.length > 0) {
                        tip.setVisible(true);
                        text.setVisible(true);
                        text.setString(data.length);
                    } else {
                        tip.setVisible(false);
                    }
                }
            }.bind(this))
        },
        getPlayerApplyList: function () {
            club.net.playerApplyList(function (data) {
                var data = data.data;
                console.log("data =>", data);
                this.updatePlayApplyList(data);
            }.bind(this))
        },
        updatePlayApplyList: function (data) {
            this.panel_list_applyPack.removeAllChildren();
            this.panel_title.setVisible(false);
            this.panel_no_apply.setVisible(true);
            if (data && data.length > 0) {
                this.panel_title.setVisible(true);
                this.panel_no_apply.setVisible(false);
                for (var i = 0; i < data.length; i++) {
                    var cell = this.panel_applyPack_cell.clone();
                    var _data = data[i];
                    var pack_name = ccui.helper.seekWidgetByName(cell, "text_apply_pack_name");
                    pack_name.setColor(club.colors.pack_name);
                    var pack_id = ccui.helper.seekWidgetByName(cell, "text_apply_pack_id");
                    pack_id.setColor(club.colors.pack_id);
                    var pack_person = ccui.helper.seekWidgetByName(cell, "text_apply_pack_person");
                    var tip_person = ccui.helper.seekWidgetByName(cell, "tip_person");
                    pack_person.setColor(club.colors.pack_id);
                    tip_person.setColor(club.colors.pack_id);
                    // var tip_status = ccui.helper.seekWidgetByName(cell, "text_tip_status");
                    var btn_reject = ccui.helper.seekWidgetByName(cell, "btn_reject");
                    btn_reject.clickData = _data;

                    pack_id.setString("ID:" + _data.packNum);
                    pack_name.setString(_data.name);
                    pack_person.setString(_data.num + "/" + club.maxPerson);
                    if (_data.audit == 0) {
                        btn_reject.setVisible(true);
                        btn_reject.setBright(true);
                        btn_reject.setTouchEnabled(true);
                    } else if (_data.audit == -2) {
                        btn_reject.setVisible(true);
                        btn_reject.setBright(false);
                        btn_reject.setTouchEnabled(false);
                    }

                    this.panel_list_applyPack.pushBackCustomItem(cell);
                }
            }
        },
        packApplyJoin: function () {
            var str = this.input_pack_id.getString();
            console.log("str", str);
            if (str == "" || str == null) {
                var dialog = new JJConfirmDialog();
                dialog.setDes("俱乐部ID不能为空!");
                dialog.showDialog();
                return;
            }
            if (parseInt(str) == str) {
                club.net.packApplyJoin(parseInt(str), function (data) {
                    console.log("data", data);
                    this.input_pack_id.setString("");
                    if (data.code == 200) {
                        var dialog = new JJConfirmDialog();
                        dialog.setDes("申请成功");
                        dialog.showDialog();
                        this.getPlayerApplyList();
                    } else if (data.code == 500) {
                        var dialog = new JJConfirmDialog();
                        dialog.setDes(data.error);
                        dialog.showDialog();
                    }
                }.bind(this));
            } else {
                var dialog = new JJConfirmDialog();
                dialog.setDes("俱乐部ID只能为数字!");
                dialog.showDialog();
            }
        },
        playerCancelApply: function (sender) {
            console.log(sender.clickData);
            sender.setTouchEnabled(false);
            club.net.playerCancelApply(sender.clickData.pid, function (data) {
                console.log("data =>", data);
                this.getPlayerApplyList();
            }.bind(this));
        },
        packNotifyJoin: function () {
            this.getPlayerPack();
            this.getPlayerApplyList();
        },
        packNotifyRejectJoin: function () {
            this.getPlayerPack();
            this.getPlayerApplyList();
        },
    }
);