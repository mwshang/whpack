var SSSGameScene = cc.Scene.extend({
    panel_head: null,
    seatHeads: [],
    seatHeadPos: [],
    gunPosArray: [],
    imgReadyArray: [],

    panel_status: null,
    text_round: null,

    panel_ready: null,
    btn_ready: null,

    panel_desk: null,

    btn_add: null,

    panel_cover: null,

    panel_option_waiting: null,
    btn_invite_wechat: null,
    btn_back_hall: null,
    btn_dissolve: null,
    btn_lessStart: null,

    panel_option_playing: null,
    btn_setting: null,
    btn_msg: null,
    btn_force: null,

    panel_infomation: null,
    text_room_id: null,
    text_time: null,
    btn_speak: null,

    deskArray: null,

    speakTip: null,
    totalIndex: 0,
    nowIndex: 0,
    _Listeners: [],
    resultData: null,
    totalRound: 0,
    autoSendRecord: false,
    intervalTouchSpeak: 0,
    beginSpeak: false,
    talkRecordTime: 0,
    gameMode: GameMode.PLAY,

    panel_Act: null,
    node_Act: null,
    image_Bg: null,

    panelrule: null,
    btn_rule: null,
    panel_lei: null,
//--下注
    panel_chouma: null,
    btn_choumaClone: null,
    listview_chouma: null,
    text_startclock: null,
    quanleidaAct: null,

    panel_qiepai: null,
    panel_cards: null,
    btn_qiepai: null,
    image_mask: null,
    image_other: null,
    image_self: null,
    int_qiePaiTime: 0,
    text_qiepai: null,
    slider: null,
    int_forceTime:0,
ctor: function () {
        this._super();
        var jsonres = ccs.load(SSSPokerJson.Room);
        var root = jsonres.node;
        this.quanleidaAct = jsonres.action;
        root.runAction(this.quanleidaAct);
        this.quanleidaAct.setTimeSpeed(1);

        this.addChild(root);
        var _this = this;

        this.image_Bg = ccui.helper.seekWidgetByName(root, "image_bg");

        if (GAMENAME == "xyshisanshui" || GAMENAME == "quanzhou" || GAMENAME == "yongchun") {
            var img_logo = ccui.helper.seekWidgetByName(this.image_Bg, "image_logo");
            img_logo.setVisible(false);
        }

        this.SprShuffleCard = [];

        this.panel_head = ccui.helper.seekWidgetByName(root, "panel_head");
        this.seatHeads = new Array();
        this.seatHeadPos = new Array();
        this.gunPosArray = new Array();
        this.imgReadyArray = new Array();
        for (var i = 0; i < 8; i++) {
            var head = ccui.helper.seekWidgetByName(this.panel_head, "seat_" + i);
            head.setVisible(false);
            this.seatHeads.push(head);
            this.seatHeadPos.push(head.getPosition());

            var img_ready = ccui.helper.seekWidgetByName(head, "img_ready");
            img_ready.setVisible(false);
            this.imgReadyArray.push(img_ready);

            var gunPos = ccui.helper.seekWidgetByName(head, "gunPos");
            this.gunPosArray.push(gunPos);
        }

        this.panel_status = ccui.helper.seekWidgetByName(root, "panel_status");
        this.text_round = ccui.helper.seekWidgetByName(this.panel_status, "text_round");
        this.panel_status.setVisible(false);

        this.panel_ready = ccui.helper.seekWidgetByName(root, "panel_ready");
        this.btn_ready = ccui.helper.seekWidgetByName(this.panel_ready, "btn_ready");
        this.btn_ready.addClickEventListener(function (data) {
            sound.playBtnSound();
            SSSPoker.table.ready(function (data) {
                _this.btn_ready.setVisible(false);
            });
        });
        this.panel_ready.setVisible(false);

        this.panel_desk = ccui.helper.seekWidgetByName(root, "panel_desk");
        this.panel_cover = ccui.helper.seekWidgetByName(root, "panel_cover");
        this.panel_cover.setVisible(false);

        this.panel_option_waiting = ccui.helper.seekWidgetByName(root, "panel_option_waiting");
        this.btn_invite_wechat = ccui.helper.seekWidgetByName(this.panel_option_waiting, "btn_invite_wechat");
        this.btn_back_hall = ccui.helper.seekWidgetByName(this.panel_option_waiting, "btn_back_hall");
        this.btn_dissolve = ccui.helper.seekWidgetByName(this.panel_option_waiting, "btn_dissolve");
        this.btn_dissolve.addClickEventListener(function () {
            sound.playBtnSound();
            this.showDissolveTip();
        }.bind(this));

        this.btn_invite_wechat.addClickEventListener(this.onInviteWeChat);
        this.btn_back_hall.addClickEventListener(function () {
            sound.playBtnSound();

            SSSPoker.net.leavePrivateTable(0, function (data) {
                console.log(data);
                if (data['code'] == 200) {
                    if (!!hall.inRoom) {
                        var hall2 = new MajhongHall();
                        hall2.showHall();
                        hall.inRoom = false;
                    }
                } else {
                    if (data['err'] != undefined && data['err'] != null) {
                        var dialog = new JJConfirmDialog();
                        dialog.setDes(data['err']);
                        dialog.showDialog();
                    }

                }

            });
        });

        this.btn_lessStart = ccui.helper.seekWidgetByName(this.panel_option_waiting, "btn_start");
        this.btn_lessStart.addClickEventListener(function () {
            sound.playBtnSound();
            this.btn_lessStart.setTouchEnabled(false);
            SSSPoker.net.lessPersonStart(function (data) {
                this.btn_lessStart.setTouchEnabled(true);
                if (data.code == 200) {
                    this.btn_lessStart.setVisible(false);
                }
                else {
                    var dialog = new JJConfirmDialog();
                    dialog.setDes(data['err']);
                    dialog.showDialog();
                }
            }.bind(this))
        }.bind(this));
        this.btn_lessStart.setVisible(false);
        this.panel_option_waiting.setVisible(false);

        this.panel_option_playing = ccui.helper.seekWidgetByName(root, "panel_option_playing");
        this.btn_setting = ccui.helper.seekWidgetByName(root, "btn_setting");
        this.btn_msg = ccui.helper.seekWidgetByName(this.panel_option_playing, "btn_msg");
        this.btn_setting.addClickEventListener(this.onSetting.bind(this));
        this.btn_msg.addClickEventListener(this.sendMsg.bind(this));
        this.btn_force = ccui.helper.seekWidgetByName(this.panel_option_playing, "btn_force");
        this.btn_force.addClickEventListener(function () {
            if (this.int_forceTime > 0) {
                var dialog = new JJConfirmDialog();
                dialog.setDes(this.int_forceTime + "秒可以强制比牌！\n强制比牌后游戏将结束。");
                dialog.showDialog();
            } else {
                SSSPoker.net.updateForceDelPai(function (response) {
                    if (response.code == 500) {
                        this.int_forceTime = 300 - Math.ceil(response.err / 10);
                        var dialog = new JJConfirmDialog();
                        dialog.setDes(this.int_forceTime + "秒可以强制比牌！\n强制比牌后游戏将结束。");
                        dialog.showDialog();
                    }
                }.bind(this));
            }
        }.bind(this));

        this.btn_force.setVisible(false);
        this.panel_option_playing.setVisible(false);

        this.panel_infomation = ccui.helper.seekWidgetByName(root, "panel_infomation");
        this.btn_speak = ccui.helper.seekWidgetByName(this.panel_option_playing, "btn_speak");
        this.text_room_id = ccui.helper.seekWidgetByName(this.panel_infomation, "text_room_id");
        this.text_time = ccui.helper.seekWidgetByName(this.panel_infomation, "text_time");
        this.schedule(this.updateTime, 1);
        this.text_room_id.setString('');

        this.btn_speak.addTouchEventListener(this.touchEvent, this);

        this.panel_chouma = ccui.helper.seekWidgetByName(root, "panel_chouma");
        this.panel_chouma.setVisible(false);
        this.btn_choumaClone = ccui.helper.seekWidgetByName(this.panel_chouma, "btn_choumaclone");
        this.listview_chouma = ccui.helper.seekWidgetByName(this.panel_chouma, "listview_chouma");
        this.text_startclock = ccui.helper.seekWidgetByName(this.panel_chouma, "text_startclock");


        this.deskArray = new Array();

        this.btn_add = ccui.helper.seekWidgetByName(root, "btn_add");
        //if (!cc.sys.isNative)
        if (!cc.sys.isNative) {
            this.btn_add.addClickEventListener(function () {
                sound.playBtnSound();
                SSSPoker.net.addRobot(1, function (data) {
                    JJLog.print('add rebot resp');
                });
            });
        } else {
            this.btn_add.setVisible(false);
        }

        this.panel_Act = ccui.helper.seekWidgetByName(root, "panel_Act");
        this.panel_Act.setVisible(false);

        this.panel_lei = ccui.helper.seekWidgetByName(this.panel_Act, "panel_Lei");
        this.panel_lei.setVisible(false);

        this.node_Act = ccui.helper.seekWidgetByName(this.panel_Act, "node_Act");

        this.panelrule = ccui.helper.seekWidgetByName(root, "panel_roomrule");
        this.panelrule.setVisible(false);
        this.panelrule.addClickEventListener(function () {

            this.panelrule.setVisible(false);
        }.bind(this));

        this.btn_rule = ccui.helper.seekWidgetByName(this.panel_option_playing, "btn_rule");
        this.btn_rule.addClickEventListener(function () {
            this.panelrule.setVisible(true);
        }.bind(this));

        if (hall.songshen == 1)
            this.btn_rule.setVisible(false);

        var btn_bet = ccui.helper.seekWidgetByName(this.panel_option_playing, "btn_bet");
        var panel_bet = ccui.helper.seekWidgetByName(root, "panel_bet");
        panel_bet.setVisible(false);
        btn_bet.addClickEventListener(function () {
            panel_bet.setVisible(true);
        }.bind(this));
        panel_bet.addClickEventListener(function () {
            this.setVisible(false);
        }.bind(panel_bet));

        this.panel_qiepai = ccui.helper.seekWidgetByName(root, "panel_qiepai");
        this.panel_qiepai.setVisible(false);
        this.panel_cards = ccui.helper.seekWidgetByName(this.panel_qiepai, "panel_cards");
        this.image_mask = ccui.helper.seekWidgetByName(this.panel_qiepai, "image_mask");
        this.image_other = ccui.helper.seekWidgetByName(this.panel_qiepai, "image_other");
        this.image_self = ccui.helper.seekWidgetByName(this.panel_qiepai, "image_self");
        this.text_qiepai = ccui.helper.seekWidgetByName(this.panel_qiepai, "text_qiepai");
        this.slider = ccui.helper.seekWidgetByName(this.panel_qiepai, "slider");
        this.slider.addEventListener(this.sliderEvent, this);
        this.btn_qiepai = ccui.helper.seekWidgetByName(this.panel_qiepai, "btn_qiepai");
        this.btn_qiepai.addClickEventListener(this.onQiePai.bind(this));
        this.btn_qiepai.setVisible(false);
        // this.showQiePai();
    },

    showQiePai: function () {
        for (var i = 0; i < 52; i++) {
            var card = new ccui.ImageView("YJ0x00.png", ccui.Widget.PLIST_TEXTURE);
            card.setAnchorPoint(cc.p(0, 0));
            card.setScale(0.83);
            this.panel_cards.addChild(card, i, i + 1);
            card.setPosition(cc.p(this.panel_cards.getContentSize().width / 52 * i, -3));
        }
        this.int_qiePaiTime = 8;
        //  this.btn_qiepai.setVisible(true);
        this.text_qiepai.getParent().setVisible(true);
        this.slider.setVisible(true);
        this.image_mask.setVisible(true);
        this.panel_qiepai.setVisible(true);
    },

    sliderEvent: function (sender, type) {
        switch (type) {
            case ccui.Slider.EVENT_PERCENT_CHANGED: {
                this.image_mask.setPercent(sender.getPercent());
            }
                break;
            default:
                break;
        }
    },

    onQiePai: function () {
        this.btn_qiepai.setVisible(false);
        this.text_qiepai.getParent().setVisible(false);
        this.slider.setVisible(false);
        this.image_mask.setVisible(false);
        this.int_qiePaiTime = 0;
        var currentPer = this.image_mask.getPercent();
        var index = Math.ceil(currentPer / 100 * 52);

        var moveTime = 0.3;
        for (var i = index; i <= 52; i++) {
            var card = this.panel_cards.getChildByTag(i);
            card.runAction(cc.moveTo(moveTime, cc.p(421, 200)));
        }

        for (var i = 1; i < index; i++) {
            var card = this.panel_cards.getChildByTag(i);
            card.runAction(cc.sequence(cc.delayTime(moveTime * 2), cc.moveTo(moveTime, cc.p(421, 200))));
        }
        this.runAction(cc.sequence(cc.delayTime(moveTime * 4), cc.callFunc(function () {
            this.panel_qiepai.setVisible(false);
            this.panel_cards.removeAllChildren();
        }.bind(this))));
    },

    getTablePerson: function () {
        var num = 0;
        for (var i = 0; i < this.deskArray.length; i++) {
            if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
            num++;
        }
        return num;
    },

    showDissolveTip: function () {
        var dialog = new JJMajhongDecideDialog();
        if (hall.songshen == 1) {
            dialog.setDes('您未开始一局游戏,是否解散?');
        } else {
            dialog.setDes('您未开始一局游戏,解散房间不扣钻石,是否解散?');
        }
        //dialog.setTitle('解散房间');
        dialog.showDialog();
        dialog.setCallback(function () {
            SSSPoker.net.leavePrivateTable(0, function (data) {
                //cc.director.runScene(new SangongHallScene());
                if (data['code'] == 200) {
                    if (!!hall.inRoom) {
                        var hall2 = new MajhongHall();
                        hall2.showHall();
                        hall.inRoom = false;
                    }
                } else {
                    if (data['err'] != undefined && data['err'] != null) {
                        var dialog = new JJConfirmDialog();
                        dialog.setDes(data['err']);
                        dialog.showDialog();
                    }
                }

            });
        });
    },

    startRecordSpeaker: function () {
        this.schedule(this.recordTime, 1);
    },

    stopRecordSpeaker: function () {
        this.unschedule(this.recordTime);
    },

    resetRecordTime: function () {
        this.talkRecordTime = 0;
        this.beginSpeak = false;
        this.stopRecordSpeaker();
        JJLog.print('resetRecordTime ======' + this.speakTip != null);
        if (this.speakTip || !!this.speakTip || this.speakTip != null) {
            this.speakTip.dismiss();
            this.speakTip = null;
        }
    },

    recordTime: function (dt) {
        this.talkRecordTime++;
        if (this.talkRecordTime > 10) {
            this.autoSendRecord = true;
            this.resetRecordTime();
            SSSPoker.net.send();
        }
    },

    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN: {
                JJLog.print('SPEAKER TOUCH_BEGAN 1======' + this.talkRecordTime);
                if (sender == this.btn_speak) {
//          this.intervalTouchSpeak = curTime;
                    this.autoSendRecord = false;
                    this.beginSpeak = true;
                    JJLog.print('SPEAKER TOUCH_BEGAN 2======' + this.talkRecordTime);
                    this.startRecordSpeaker();
                    this.speakTip = new SpeakTip();
                    this.speakTip.showTip();
                    SSSPoker.net.talk("", "", "");
                }
                break;
            }
            case ccui.Widget.TOUCH_MOVED: {
                //JJLog.print('SPAEKER TOUCH_MOVED ======');
            }
                break;

            case ccui.Widget.TOUCH_ENDED: {
                JJLog.print('SPEAKER TOUCH_ENDED   1=========' + this.talkRecordTime);
                if (sender == this.btn_speak && !this.autoSendRecord) {
                    this.autoSendRecord = false;
                    JJLog.print('SPEAKER TOUCH_ENDED   2=========' + this.talkRecordTime);
                    SSSPoker.net.send();
                    this.resetRecordTime();
                }
            }
                break;

            case ccui.Widget.TOUCH_CANCELED: {
                JJLog.print('SPAEKER TOUCH_CANCELED   1=========' + this.talkRecordTime);
                if (sender == this.btn_speak && !this.autoSendRecord) {
                    // JJLog.print('SPAEKER TOUCH_CANCELED   2=========' + this.talkRecordTime);
                    SSSPoker.net.send();
                    this.resetRecordTime();
                }
            }
                break;

            default:
                break;
        }
    },

    //微信邀请
    onInviteWeChat: function () {
        sound.playBtnSound();
        JJLog.print('click invite wechat');

        var juNum = SSSPoker.table.roundTotal;
        var person = SSSPoker.table.person;
        var duose = SSSPoker.table.duose;
        var mode = SSSPoker.table.mode;
        var ishavebanker = SSSPoker.table.ishavebanker;
        var aaGem = SSSPoker.table.AAgem;
        var area = SSSPoker.table.area;
        var wanfa = SSSPoker.table.wanfa;
        var chongSan = SSSPoker.table.chongSan;
        var wang = SSSPoker.table.wang;
        var desc = '';

        if (area == 'nb') {
            desc = "宁波十三道";
        } else {
            if (ishavebanker > 0) {
                desc = '坐庄十三水';
            } else {
                if (wanfa == 0)
                    desc = "经典十三水";
                else if (wanfa == 4) {
                    desc = "加一色十三水";
                }
                else if (wanfa == 1) {
                    desc = "加三张十三水";
                }
                else if (wanfa == 2) {
                    desc = "减一色十三水";
                } else if (wanfa == 3) {
                    desc = "全一色十三水";
                }
                if (wang > 0)
                    desc = "百变十三水";
                if (SSSPoker.table.shuangJiang == 1)
                    desc = "双将十三水";
            }
        }

        desc += " " + person + "人";
        desc += '(' + juNum + '局)';

        if (wang > 0)
            desc += ' 百变' + wang + "张";
        if (ishavebanker > 0 || wang > 0 || SSSPoker.table.shuangJiang == 1) {
            if (wanfa == 1) {
                desc += ' 加三张';
            } else if (wanfa == 2) {
                desc += ' 减一色';
            } else if (wanfa == 4) {
                desc += ' 加一色';
            }
        }

        if (mode == 1) {
            desc += ' 打枪加一';
        } else {
            desc += ' 打枪' + mode + "倍";
        }

        if (SSSPoker.table.isMa == 1) {
            desc += ' 马牌(' + SSSPoker.PokerPaiImage.paiName[SSSPoker.table.maPaiId] + ')';
        }
        if (aaGem == 0) {
            desc += ' 房主付费';
        }
        else if (aaGem == 1) {
            desc += ' 平摊付费';
        } else if (aaGem == 2) {

            desc += ' 大赢家付费';
        }

        if (chongSan == 1)
            desc += " 冲三";

        console.log("desc===", desc);
        hall.wxEnterRoom = SSSPoker.table.tableId;
        hall.net.wxShareURL('江苏罗松' + ',房号:' + SSSPoker.table.tableId, desc, 0);
    },


    setWaitMode: function () {
        this.panel_ready.setVisible(true);
        this.btn_ready.setVisible(false);
        this.resetImageReady();
        this.panel_desk.removeAllChildren();
    },

    resetImageReady: function () {
        for (var i = 0; i < this.imgReadyArray.length; i++) {
            this.imgReadyArray[i].setVisible(false);
        }
    },

    setTurnLightOff: function () {
    },

    speaking: function () {

    },

    onSetting: function () {
        sound.playBtnSound();
        var set = new SetupDialog(1);
        set.showDialog();
    },


    updateTime: function (dt) {
        var date = new Date();
        var hour = date.getHours();
        var timeStr = '';
        if (hour < 10) {
            timeStr = '0' + hour + ':';
        } else {
            timeStr = hour + ':';
        }

        var minute = date.getMinutes();
        if (minute < 10) {
            timeStr = timeStr + '0' + minute + ':';
        } else {
            timeStr = timeStr + minute + ':';
        }

        var sec = date.getSeconds();

        if (sec < 10) {
            timeStr = timeStr + '0' + sec;
        } else {
            timeStr = timeStr + sec;
        }
        this.text_time.setString(timeStr);

        if (this.int_qiePaiTime > 0) {
            this.int_qiePaiTime--;
            this.text_qiepai.setString(this.int_qiePaiTime);
            if (this.int_qiePaiTime == 0)
                this.onQiePai();
        }

        if (this.int_forceTime > 0) {
            this.int_forceTime--;
        }
    },

    onEnter: function () {
        this._super();
        if (hall.songshen != 1) {
            var notice = new MajhongNotice(true);
            notice.setVisible(false);
            this.addChild(notice, 100);
        }


        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.registerAllEvents();
            this.initTable();
            this.registerCustomEvt();
            hall.wxEnterRoom = 0;
        }
    },

    onExit: function () {
        if (MajhongInfo.GameMode == GameMode.PLAY) {
            this.removeAllEvents();
            SSSPoker.table.deinit();
            this.removeCustomEvt();
        }
        this._super();
    },

    checkMsg: function (data) {
        if (data["code"] == NetErr.OK) {
            return true;
        }
        return false;
    },

    readyStatus: function () {
        var _this = this;
        SSSPoker.table.ready(function (data) {
            _this.btn_ready.setVisible(false);
        });
    },

    initTable: function () {
        var _this = this;
        this.btn_ready.setVisible(false);
        SSSPoker.table.initSeat(function (data) {
            JJLog.print("init table response");
            JJLog.print(JSON.stringify(data));

            if (_this.checkMsg(data)) {
                SSSPoker.table.initSeatInfo(data);
                SSSPoker.net.updateLocalPosition();
                SSSPoker.table.currentRound = data['tableStatus']['currRounds'];
                _this.showTableInfo(data['tableStatus']);
                _this.showPanelPlayer(data['tableStatus']);
                _this.checkGameStatus(data);
                var infoPlayers = data['tableStatus']['players'];
                if (data['tableStatus']['isOffline'] != 1) {
                    for (var i = 0; i < infoPlayers.length; i++) {
                        var ready = infoPlayers[i]['isReady'];
                        var uid = infoPlayers[i]['uid'];
                        if (uid == hall.user.uid) {
                            if (SSSPoker.table.ishavebanker == 1) {
                                if (ready == 0) {
                                    SSSPoker.table.ready(function (data) {
                                    });
                                }
                            }
                            break;
                        }
                    }
                }


                if (hall.songshen == 1) {
                    cc.setTimeout(function () {
                        SSSPoker.net.addRobot(1, function (data) {
                            JJLog.print('add rebot resp');
                        });
                    }, 800);

                    cc.setTimeout(function () {
                        SSSPoker.net.addRobot(1, function (data) {
                            JJLog.print('add rebot resp');
                        });
                    }, 1000);

                    cc.setTimeout(function () {
                        SSSPoker.net.addRobot(1, function (data) {
                            JJLog.print('add rebot resp');
                        });
                    }, 2000);
                }


            }
        });
    },

    sendMsg: function () {
        sound.playBtnSound();
        var chat = new PDKChat();
        chat.showPanel();
    },

    registerAllEvents: function () {
        qp.event.listen(this, 'mjReadyStatus', this.onReadyStatus.bind(this));
        qp.event.listen(this, 'mjGameStart', this.onGameStart.bind(this));
        qp.event.listen(this, 'mjPlayerEnter', this.onPlayerEnter.bind(this));
        qp.event.listen(this, 'mjGameResult', this.onGameResult);
        qp.event.listen(this, 'mjSyncDelCards', this.onSyncDelCards.bind(this));
        qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);
        qp.event.listen(this, 'mjChatStatus', this.onReciveChat);
        qp.event.listen(this, 'mjGameOver', this.onGameOver);
        qp.event.listen(this, 'mjPlayerLeave', this.onPlayerLeave);
        qp.event.listen(this, 'pkChipInStart', this.onNotifypkChipInStart.bind(this));
        qp.event.listen(this, 'mjSendHandCards', this.onSendHandCards.bind(this));
        qp.event.listen(this, 'mjThrowStatus', this.onGamethorw.bind(this));
    },

    removeAllEvents: function () {
        qp.event.stop(this, 'mjReadyStatus');
        qp.event.stop(this, 'mjGameStart');
        qp.event.stop(this, 'mjPlayerEnter');
        qp.event.stop(this, 'mjGameResult');
        qp.event.stop(this, 'mjSyncDelCards');
        qp.event.stop(this, 'mjDissolutionTable');
        qp.event.stop(this, 'mjChatStatus');
        qp.event.stop(this, 'mjGameOver');
        qp.event.stop(this, 'mjPlayerLeave');
        qp.event.stop(this, 'pkChipInStart');
        qp.event.stop(this, 'mjSendHandCards');
        qp.event.stop(this, 'mjThrowStatus');
    },

    onGamethorw: function (data) {
        var throwType = data['throwType'];
        if (throwType != 0) {
            cc.spriteFrameCache.addSpriteFrames("res/Animation/throwThing.plist");
            var target = data['targetUid'];
            var uid = data['uid'];
            var startPos = cc.p(0, 0);
            var endPos = cc.p(0, 0);
            var off = cc.p(50, 80);
            var index = SSSPoker.table.uidofPos(uid);
            startPos = this.seatHeads[index].getPosition();

            index = SSSPoker.table.uidofPos(target);
            endPos = cc.p(this.seatHeads[index].getPosition().x - 51, this.seatHeads[index].getPosition().y);
            if (THROWTHINGTYPE[throwType] != null && THROWTHINGTYPE[throwType] != undefined) {
                var img = new ccui.ImageView(THROWTHINGTYPE[throwType] + ".png", ccui.Widget.PLIST_TEXTURE);
                img.setPosition(cc.pAdd(off, startPos));
                this.panel_option_playing.addChild(img, 100);
                img.runAction(cc.sequence(cc.moveTo(0.3, cc.pAdd(off, endPos)), cc.callFunc(function () {
                    var ani = new cc.Sprite('#' + THROWTHINGTYPE[throwType] + "_1.png");
                    ani.setScale(2);
                    this.panel_option_playing.addChild(ani, 100);
                    ani.setPosition(cc.pAdd(off, endPos));
                    var animFrames = [];
                    for (var j = 1; j <= THROWTHINGPNGLEGTH[throwType]; j++) {
                        var str = THROWTHINGTYPE[throwType] + "_" + j + ".png";
                        var frame = cc.spriteFrameCache.getSpriteFrame(str);
                        animFrames.push(frame);
                    }
                    var bomb = new cc.Animation(animFrames, 0.06);
                    sound.playSound("res/audio/effect/" + THROWTHINGTYPE[throwType] + ".mp3", false);
                    ani.runAction(cc.sequence(cc.animate(bomb), cc.removeSelf()));
                }.bind(this)), cc.removeSelf()));
            }
        }
    },

    //---------quanzhou-----------

    showTableInfo: function (data) {
        JJLog.print("桌子=" + JSON.stringify(data));
        SSSPoker.table.tableId = data['tableId'];
        this.text_room_id.setString(data['tableId']);
        SSSPoker.table.status = data['tableStatus'];
        SSSPoker.table.chairArr = data['chairArr'];
        this.initInvite(data);
        this.showPanelReady(data);
        this.showPanelInfomation(data);
        this.showPanelPlaying(data);
        this.showPanelStatus(data);
        this.showPanelWaiting(data);
    },

    initInvite: function (data) {
        if (data.pid > 0) {
            club.gamePackId = data.pid;
            this.btn_invite_pack = new clubInviteButton(data.pid, data.tableId);
            this.btn_invite_pack.show(this.panel_option_waiting);
        }
    },

    showPanelWaiting: function (data) {

        switch (SSSPoker.table.status) {
            case GameStatus.SEATING: {
                this.panel_option_waiting.setVisible(true);
                this.btn_invite_wechat.setVisible(true);
                if (hall.songshen == 1) {
                    this.btn_invite_wechat.setVisible(false);
                }
                if (data['isRePrivateTable'] != null && data['isRePrivateTable'] != undefined && data['isRePrivateTable'] == 1)  //代开房间
                {
                    this.btn_dissolve.setVisible(false);
                    this.btn_back_hall.setVisible(true);
                } else {
                    this.btn_dissolve.setVisible(data['fangZhu'] == hall.user.uid);
                    this.btn_back_hall.setVisible(data['fangZhu'] != hall.user.uid);
                }
            }
                break;
            case GameStatus.WATING: {
                this.panel_option_waiting.setVisible(false);
                if (SSSPoker.table.currentRound == 1) {
                    this.panel_option_waiting.setVisible(true);
                    if (data['isRePrivateTable'] != null && data['isRePrivateTable'] != undefined && data['isRePrivateTable'] == 1)  //代开房间
                    {
                        this.btn_dissolve.setVisible(false);
                        this.btn_back_hall.setVisible(true);
                    } else {
                        this.btn_dissolve.setVisible(data['fangZhu'] == hall.user.uid);
                        this.btn_back_hall.setVisible(data['fangZhu'] != hall.user.uid);
                        //this.btn_lessStart.setVisible(data['fangZhu'] == hall.user.uid);
                    }
                }
            }
                break;
            case GameStatus.PLAYING: {
                this.panel_option_waiting.setVisible(false);
            }
                break;
        }
    },

    showPanelPlaying: function (data) {

        switch (SSSPoker.table.status) {
            case GameStatus.SEATING: {
                this.panel_option_playing.setVisible(true);
                this.btn_setting.setVisible(false);
            }
                break;
            case GameStatus.WATING: {
                this.panel_option_playing.setVisible(true);
                this.btn_setting.setVisible(false);
                this.btn_msg.setVisible(false);
            }
                break;
            case GameStatus.PLAYING: {
                this.panel_option_playing.setVisible(true);
                this.btn_setting.setVisible(true);
                this.btn_msg.setVisible(true);
            }
                break;
            case GameStatus.GAMERESULT: {
                this.panel_option_playing.setVisible(true);
                this.btn_setting.setVisible(true);
                this.btn_msg.setVisible(true);
            }
                break;
        }
    },

    showPanelInfomation: function (data) {
        this.panel_infomation.setVisible(true);
        this.btn_speak.setVisible(true);

        this.text_room_id.setString(data['tableId']);
        this.totalRound = data['roundsTotal'];

        var person = data['person'];
        var mode = data['mode'];
        var ishavebanker = data['isHaveBanker'];
        var AAgem = data['aaGem'];
        var area = data['area'];
        var wanfa = data['wanFa'];
        var wang = data['wang'];
        var isMa = data['isMa'];

        var checkboxround = ccui.helper.seekWidgetByName(this.panelrule, "checkbox_ju" + data['roundsTotal']);
        checkboxround.setSelected(true);

        var checkboxperson = ccui.helper.seekWidgetByName(this.panelrule, "checkbox_person");
        checkboxperson.setSelected(true);
        var text = ccui.helper.seekWidgetByName(checkboxperson, "text_person");
        text.setString(person + "人");

        var checkboxmode = ccui.helper.seekWidgetByName(this.panelrule, "checkbox_mode" + mode);
        checkboxmode.setSelected(true);

        var checkboxFufei = ccui.helper.seekWidgetByName(this.panelrule, "checkbox_fufei" + AAgem);
        if (checkboxFufei != null)
            checkboxFufei.setSelected(true);

        var checkbox_ma = ccui.helper.seekWidgetByName(this.panelrule, "checkbox_ma");
        checkbox_ma.setSelected(isMa == 1);
        var image_ma = ccui.helper.seekWidgetByName(checkbox_ma, "image_ma");
        image_ma.setVisible(false);

        if (SSSPoker.table.maPaiId != null) {
            var img = "YJ" + SSSPoker.PokerPaiImage["paiImage"][SSSPoker.table.maPaiId];
            image_ma.loadTexture(img, ccui.Widget.PLIST_TEXTURE);
            image_ma.setVisible(true);
        }

        var checkbox_jiayi = ccui.helper.seekWidgetByName(this.panelrule, "checkbox_jiayi");
        var checkbox_jianyi = ccui.helper.seekWidgetByName(this.panelrule, "checkbox_jianyi");
        var checkbox_jiasan = ccui.helper.seekWidgetByName(this.panelrule, "checkbox_jiasan");
        var checkbox_qys = ccui.helper.seekWidgetByName(this.panelrule, "checkbox_qys");
        checkbox_jiayi.setSelected(wanfa == 4);
        checkbox_jianyi.setSelected(wanfa == 2);
        checkbox_jiasan.setSelected(wanfa == 1);
        checkbox_qys.setSelected(wanfa == 3);
        var desc = '';

        if (area == 'nb') {
            desc = "宁波十三道";
        } else {
            if (ishavebanker > 0) {
                desc = '坐庄十三水';
            } else {
                if (wanfa == 0)
                    desc = "经典十三水";
                else if (wanfa == 4) {
                    desc = "加一色十三水";
                }
                else if (wanfa == 1) {
                    desc = "加三张十三水";
                }
                else if (wanfa == 2) {
                    desc = "减一色十三水";
                } else {
                    desc = "全一色十三水";
                }
                if (wang > 0) {
                    desc = "百变十三水";
                    var title = ccui.helper.seekWidgetByName(this.panelrule, "text_laiziTitle");
                    title.setVisible(true);
                    var checkbox_laizi = ccui.helper.seekWidgetByName(title, "checkbox_laizi");
                    checkbox_laizi.setSelected(true);
                    var text_laizi = ccui.helper.seekWidgetByName(checkbox_laizi, "text_laizi");
                    text_laizi.setString(wang + "张王")
                }

                if (SSSPoker.table.shuangJiang == 1)
                    desc = "双将十三水";
            }
        }

        var text_area = ccui.helper.seekWidgetByName(this.panelrule, "text_area");
        text_area.setString(desc);
    },

    showPanelStatus: function (data) {
        switch (SSSPoker.table.status) {
            case GameStatus.SEATING: {
                this.panel_status.setVisible(false);
            }
                break;
            case GameStatus.WATING: {
                this.panel_status.setVisible(false);
            }
                break;
            case GameStatus.PLAYING: {
                this.panel_status.setVisible(true);

                if (data['isOffline'] == 1) {
                    this.text_round.setString(data['currRounds'] + '/' + data['roundsTotal']);
                } else {
                    this.text_round.setString(data['currRounds'] + '/' + this.totalRound);
                }
            }
                break;
        }
    },

    showPanelReady: function (data) {
        switch (SSSPoker.table.status) {
            case GameStatus.SEATING: {
                this.panel_ready.setVisible(true);
                this.btn_ready.setVisible(false);
                this.resetImageReady();
            }
                break;
            case GameStatus.WATING: {
                this.panel_ready.setVisible(true);
                this.btn_ready.setVisible(false);
                this.resetImageReady();

            }
                break;
            case GameStatus.PLAYING: {
                this.panel_ready.setVisible(false);
                this.btn_ready.setVisible(false);
                this.resetImageReady();

            }
                break;
        }
    },

    showPanelPlayer: function (data) {
        for (var i = 0; i < 8; i++) {
            this.addHeadsDesk(i);
        }

        if (SSSPoker.table.status == GameStatus.WATING || SSSPoker.table.status == GameStatus.SEATING) {
            var infoPlayers = data['players'];
            for (var i = 0; i < infoPlayers.length; i++) {
                var ready = infoPlayers[i]['isReady'];
                var uid = infoPlayers[i]['uid'];

                for (var j = 0; j < this.deskArray.length; j++) {
                    if (this.deskArray[j] == undefined || this.deskArray[j] == null) continue;
                    if (this.deskArray[j] && uid == this.deskArray[j].uid) {
                        if (ready == 1) {
                            this.imgReadyArray[j].setVisible(true);
                        } else {
                            this.imgReadyArray[j].setVisible(false);
                            if (hall.user.uid == uid) {
                                if (SSSPoker.table.ishavebanker != 1) {
                                    var info = SSSPoker.table.getCardByPlayer(hall.user.uid);
                                    if (info['paiQi'] == 0) {
                                        this.btn_ready.setVisible(true);
                                    }
                                } else {
                                    this.imgReadyArray[j].setVisible(true);
                                }
                            }
                        }
                        break;
                    }
                }
            }
        }

    },


    addHeadsDesk: function (pos) {
        var info = SSSPoker.table.seatPosInfo(pos);
        if (info != null) {
            var index = SSSPoker.table.uidofPos(info['uid']);
            this.seatHeads[index].removeChildByTag(1, true);
            this.deskArray[index] = new SSSDeskHead(info);
            this.seatHeads[index].addChild(this.deskArray[index], 1, 1);
            this.seatHeads[index].setVisible(true);
            var frame = ccui.helper.seekWidgetByName(this.seatHeads[index], "image_frame");
            frame.setVisible(false);

            var personTotal = parseInt(SSSPoker.table.SEAT_TOTAL);
            if (SSSPoker.table.shuangJiang == 1)
                personTotal += personTotal;

            if (personTotal < 8) {
                var offPos = SSSHEADOFFPOSITIONS[personTotal][index];
                if (offPos != null)
                    this.seatHeads[index].setPosition(cc.pAdd(this.seatHeadPos[index], offPos));
            }

        }
    },

    checkGameStatus: function (data) {
        if (data['tableStatus']['isOffline'] == 1) {
            JJLog.print("断线重连=" + JSON.stringify(data));
            sound.stopBgSound();
            SSSPoker.table.isOffline = true;
            SSSPoker.table.offLineInfo['currOp'] = data["tableStatus"]['currOp'];
            SSSPoker.table.offLineInfo['nextChuPai'] = data["tableStatus"]['nextChuPai'];
            SSSPoker.table.offLineInfo['mjGameResult'] = data["tableStatus"]['mjGameResult'];
            this.panel_desk.removeAllChildren();
            var players = data["tableStatus"]['players'];
            this.btn_setting.setVisible(data['tableStatus']['tableStatus'] > GameStatus.SEATING);
            this.btn_msg.setVisible(data['tableStatus']['tableStatus'] > GameStatus.SEATING);
            if (data['tableStatus']['tableStatus'] == GameStatus.PLAYING || data['tableStatus']['mjGameResult'] != null) {

                if (data['tableStatus']['mjGameResult'] != null) {
                    this.resultData = data['tableStatus']['mjGameResult'];
                }
                this.btn_add.setVisible(false);
                var desk = new SSSGameDesk();
                this.panel_desk.addChild(desk);

            }
            this.setBankerId(data['tableStatus']);

            if (players.length > 1 && players.length < SSSPoker.table.SEAT_TOTAL && SSSPoker.table.bankerId == hall.user.uid && data['tableStatus']['tableStatus'] == GameStatus.SEATING) {
                this.btn_lessStart.setVisible(true);
            }

            if (data['tableStatus']['tableStatus'] == GameStatus.PLAYING) {
                for (var i = 0; i < players.length; i++) {
                    if (players[i]['bei'] > 0) {
                        this.setChipinCount(players[i])
                    }
                    if ((players[i].uid == hall.user.uid && players[i].isPutCard == 1 && SSSPoker.table.shuangJiang == 0) || (players[i].uid == hall.user.uid + "00" && players[i].isPutCard == 1 && SSSPoker.table.shuangJiang == 1)) {
                         this.btn_force.setVisible(true);
                    }
                }
            }

            //解散房间
            if (data['tableStatus']['dissolutionTable'] != -1 && data['tableStatus']['dissolutionTable']['result'] != 1) {
                var disarr = data['tableStatus']['dissolutionTable']['disArr'];
                var isDisarr = true;
                var disUid = {};
                for (var k = 0; k < disarr.length; k++) {
                    if (k == 0) {
                        disUid['uid'] = disarr[k];
                    }
                    if (hall.user.uid == disarr[k]) {
                        isDisarr = false;
                    }
                }

                if (isDisarr) {
                    var option = new DissloveOptionDialog(disUid);
                    option.showDialog();
                } else {
                    var option = new SSSDissloveResultDialog(disarr, data['tableStatus']['dissolutionTable']['time']);
                    option.showDialog();
                }
            }
        }
    },

    setBankerId: function (data) {

        if (data['isHaveBanker'] == 1) {
            var bankerId = data['fangZhu'];
            SSSPoker.Table.bankerId = bankerId;
            for (var i = 0; i < this.deskArray.length; i++) {
                if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
                this.deskArray[i].setBanker(this.deskArray[i].uid == bankerId);
            }
        }
    },

    setChipinCount: function (player) {
        for (var i = 0; i < this.deskArray.length; i++) {
            if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
            if (this.deskArray[i].uid == player['uid'] && player['uid'] != SSSPoker.table.bankerId) {
                if (SSSPoker.table.ishavebanker == 1) {
                    this.deskArray[i].setchipinCount(player['bei']);
                }

            }
            if (this.deskArray[i].uid == player['uid']) {
                JJLog.print('状态=' + player['uid'] + 'isPutCard == ' + player['isPutCard'])
                if (player['isPutCard'] == 1) {
                    this.deskArray[i].isPutout = true;
                    this.deskArray[i].showThrow(false);
                } else {
                    this.deskArray[i].isPutout = false;
                    this.deskArray[i].showThrow(true);
                }
            }
        }
    },
    onPlayerLeave: function (data) {
        if (SSSPoker.table.currentRound > 1)
            return;
        var num = 0;
        for (var i = 0; i < this.deskArray.length; i++) {
            if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
            num++;
            if (data['uid'] == this.deskArray[i].uid) {
                num--;
                SSSPoker.table.onPlayerExit(data);
                var parentPanel = this.deskArray[i].getParent();
                var frame = ccui.helper.seekWidgetByName(parentPanel, "image_frame");
                frame.setVisible(false);
                this.deskArray[i].removeFromParent();
                this.deskArray[i] = null;
                var ready = ccui.helper.seekWidgetByName(parentPanel, "img_ready");
                ready.setVisible(false);
            }
        }
        if (num > 1 && num < SSSPoker.table.SEAT_TOTAL && SSSPoker.table.bankerId == hall.user.uid) {
            this.btn_lessStart.setVisible(true);
        } else {
            this.btn_lessStart.setVisible(false);
        }

        if ((SSSPoker.table.status == GameStatus.SEATING || (SSSPoker.table.status == GameStatus.WATING && SSSPoker.table.currentRound == 1)) && data['uid'] == data['fangZhu'] && SSSPoker.table.isRePrivateTable != 1) {
            var hall2 = new MajhongHall();
            hall2.showHall();
        }

        if ((SSSPoker.table.status == GameStatus.SEATING || (SSSPoker.table.status == GameStatus.WATING && SSSPoker.table.currentRound == 1)) && data['uid'] == hall.user.uid && SSSPoker.table.isRePrivateTable == 1) {
            var hall2 = new MajhongHall();
            hall2.showHall();
        }
    },
    onNotifypkChipInStart: function (data) {
        JJLog.print("通知下注" + JSON.stringify(data));
        this.panel_option_waiting.setVisible(false);
        for (var i = 0; i < this.deskArray.length; i++) {
            if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;

            this.deskArray[i].showPkChipInStatus(false);
        }
        if (SSSPoker.table.bankerId == hall.user.uid) {
            return;
        }
        var _this = this;
        var Maxchouma = SSSPoker.table.bei;
        for (var i = 1; i <= Maxchouma; i++) {
            var btn_chouma = _this.btn_choumaClone.clone();
            var img_chouma = ccui.helper.seekWidgetByName(btn_chouma, "img_chouma");
            var textimg = 'img_chouma_' + i + '.png';
            img_chouma.loadTexture(textimg, ccui.Widget.PLIST_TEXTURE);
            var temp = {};
            temp['chouma'] = i;
            temp['this'] = _this;
            btn_chouma.addClickEventListener(function () {
                SSSPoker.net.ChipInStatus(this['chouma'], function (data) {
                    if (data['code'] == 200) {
                        console.log('下注成功' + this['chouma']);
                        _this.panel_chouma.setVisible(false);
                        _this.listview_chouma.removeAllChildren();
                        _this.unschedule(_this.ChipIncountDown);
                    }
                }.bind(this));
            }.bind(temp));
            var layout = new ccui.Layout();
            layout.setContentSize(btn_chouma.getContentSize());
            layout.addChild(btn_chouma);
            if (Maxchouma == 2) {
                btn_chouma.x = 180;
            } else if (Maxchouma == 3) {
                btn_chouma.x = 120;
            } else if (Maxchouma == 4) {
                btn_chouma.x = 60;
            } else {
                btn_chouma.x = 0;
            }

            btn_chouma.y = 0;
            _this.listview_chouma.pushBackCustomItem(layout);

        }
        _this.panel_chouma.setVisible(true);
        _this.startChipIntime(9);
    },
    startChipIntime: function (sec) {
        this.text_startclock.setString(sec);
        this.schedule(this.ChipIncountDown, 1);
    },

    ChipIncountDown: function (dt) {
        var sec = parseInt(this.text_startclock.getString());
        if (sec >= 1) {
            sec--;
        }
        else {
            sec = '0';
            this.unschedule(this.ChipIncountDown);
            this.panel_chouma.setVisible(false);
            this.listview_chouma.removeAllChildren();
            SSSPoker.net.ChipInStatus(1, function (data) {
                if (data['code'] == 200) {
                    console.log('下注成功' + this['chouma']);
                } else {
                    console.log('下注失败');
                }
            }.bind(this));
        }

        this.text_startclock.setString(sec);
    },
    //游戏状态
    onGameStart: function (data) {
        JJLog.print("start info=" + JSON.stringify(data));
        SSSPoker.table.status = GameStatus.PLAYING;
        SSSPoker.table.JinPaiId = null;
        SSSPoker.table.isOffline = false;
        SSSPoker.table.offLineInfo = {};
        SSSPoker.table.chairArr = data['chairArr'];
        SSSPoker.table.bankerId = data["banker"];
        SSSPoker.table.currentRound = data['currRounds'];
        var bankerId = data["banker"];

        var pos = 0;
        for (var i = 0; i < SSSPoker.table.chairArr.length; i++) {
            var uid = SSSPoker.table.chairArr[i];
            if (uid == bankerId) {
                pos = i;
                break;
            }
        }
        this.resetReady();
        this.showPanelPlaying(data);
        this.showPanelWaiting(data);
        this.showPanelStatus(data);
        this.showPanelReady(data);

        this.panel_desk.removeAllChildren();
        var desk = new SSSGameDesk();
        this.panel_desk.addChild(desk);

        this.btn_add.setVisible(false);

        this.resultData = null;
        this.totalIndex = 0;
        this.nowIndex = 0;
        sound.stopBgSound();
    },

    onReadyStatus: function (data) {
        var status = data['readyStatus'];//0,1
        var uid = data['uid'];
        JJLog.print("准备完成=" + JSON.stringify(data) + "chang=" + this.deskArray.length);
        for (var i = 0; i < this.deskArray.length; i++) {
            if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
            if (uid == this.deskArray[i].uid) {
                JJLog.print("准备完成3333333333333333");
                if (status == 1) {
                    this.panel_ready.setVisible(true);
                    this.imgReadyArray[i].setVisible(true);

                } else {
                    this.imgReadyArray[i].setVisible(false);
                }
                break;
            }
        }
    },

    onSendHandCards: function (data) {
        this.panel_chouma.setVisible(false);
        this.listview_chouma.removeAllChildren();
        this.unschedule(this.ChipIncountDown);
    },

    onSyncDelCards: function (data) {
        JJLog.print("通知立牌完成 " + JSON.stringify(data));

        for (var i = 0; i < this.deskArray.length; i++) {
            if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
            if (data['uid'] == this.deskArray[i].uid) {
                this.deskArray[i].isPutout = true;
            }
        }
        var all = true;

        for (var i = 0; i < this.deskArray.length; i++) {
            if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
            if (this.deskArray[i].isPutout == false) {
                this.deskArray[i].showThrow(true);
                all = false;
            } else {
                this.deskArray[i].showThrow(false);
            }
        }


        if ((data.uid == hall.user.uid && all == false && SSSPoker.table.shuangJiang == 0) || (data.uid == hall.user.uid + "00" && all == false && SSSPoker.table.shuangJiang == 1)) {
            this.btn_force.setVisible(true);
        }

    },

    onReciveChat: function (data) {
        JJLog.print(JSON.stringify(data));
        var uid = data['uid'];
        var type = data['data']['type'];
        var index = data['data']['index'];
        var content = data['data']['content'];
        for (var i = 0; i < this.deskArray.length; i++) {
            if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
            if (uid == this.deskArray[i].uid) {
                if (type == CHAT_TYPE.Usual) {
                    this.deskArray[i].showMsg(index, content);
                } else {
                    this.deskArray[i].showFace(index);
                }
                break;
            }
        }
    },

    onGameResult: function (data) {
        this.resetDeskMode();
        this.resultData = data;
        JJLog.print("结束通知=" + JSON.stringify(data));

        for (var i = 0; i < this.deskArray.length; i++) {
            if (this.deskArray[i] == undefined || this.deskArray[i] == null) continue;
            this.deskArray[i].showThrow(false);
        }
        //开始比牌动画
        var _this = this;
        _this.panel_Act.setVisible(true);

        var img1 = new ccui.ImageView("sssStartCompearCard.png", ccui.Widget.PLIST_TEXTURE);
        img1.setScale(1);
        var scale1 = cc.scaleTo(0.1, 1);
        var fadeIn1 = cc.fadeIn(0.3);
        img1.runAction(cc.sequence(
            cc.spawn(scale1, fadeIn1),
            cc.delayTime(SSSCommonParam.STARTCOMPAREDELAY - 0.4),
            cc.callFunc(function () {
                _this.panel_Act.setVisible(false);
            }),
            cc.removeSelf()
        ));

        var soundData = {};
        soundData['userSex'] = hall.user.userSex;
        sound.playSSSStartCompare(soundData);

        _this.node_Act.addChild(img1, 200);

        //var result = new RoundResult(data,this);
        //result.showResult();

        //********quanzhou*********
        // this.resetBuhua();
        //---------quanzhou-----------

    },

    onGameOver: function (data) {
        JJLog.print('GameOver Response -- -- -- -- ' + JSON.stringify(data));
        qp.event.stop(this, 'mjPlayerLeave');
        SSSPoker.table.report = data;
        if (this.resultData && this.resultData["isOver"] == 1) {
            return;
        }
        var tip = new JJConfirmDialog();
        var str = '经玩家 ';
        for (var i = 0; i < data['players'].length; i++) {
            str += ('【' + base64.decode(data['players'][i]['nickName']) + '】');
        }
        str += ('同意,房间解散成功!');
        tip.setDes(str);
        tip.setCallback(function () {
            JJLog.print('this is test callback');
            var endReport = new SSSEndResult();
            endReport.showGameResult();
        });
        tip.showDialog();
    },

    registerCustomEvt: function () {
        var _this = this;

        var ls = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEvent.EVT_DESK_MODE,
            callback: this.updateDeskMode.bind(this)
        });
        var listener = cc.eventManager.addListener(ls, this);
        this._Listeners.push(listener);

        var ls2 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEvent.EVT_DESK_RESULT_INDEX,
            callback: this.indexCallback.bind(this)
        });
        listener = cc.eventManager.addListener(ls2, this);
        this._Listeners.push(listener);

        var ls3 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEvent.EVT_GAMING,
            callback: function (data) {
                console.log(data);
                var dialog = new JJConfirmDialog();
                dialog.setCallback(function () {
                    var hall2 = new MajhongHall();
                    hall2.showHall();
                });
                dialog.setDes('房间已经解散了！');
                dialog.showDialog();
            }
        });
        listener = cc.eventManager.addListener(ls3, this);
        this._Listeners.push(listener);
        //切换桌面背景事件
        var ls5 = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: CommonEvent.ChangeGameSceneBg,
            callback: function (event) {
                var background_bg = util.getCacheItem('background_bg');
                if (background_bg == 2) {
                    _this.image_Bg.loadTexture('res/PokerSSS/Resoures/large/mahjong_tabl_1.png', ccui.Widget.LOCAL_TEXTURE);
                } else {
                    _this.image_Bg.loadTexture('res/PokerSSS/Resoures/large/mahjong_tabl_0.png', ccui.Widget.LOCAL_TEXTURE);
                }
            }
        });
        var listener2 = cc.eventManager.addListener(ls5, this);
        this._Listeners.push(listener2);
    },

    removeCustomEvt: function () {
        for (var i = 0; i < this._Listeners.length; i++) {
            cc.eventManager.removeListener(this._Listeners[i]);
        }
        this._Listeners.splice(0, this._Listeners.length);
    },

    indexCallback: function (event) {
        JJLog.print('index call back');
        JJLog.print(event);

        var _this = this;
        //打枪
        var delay = 0;
        var players = this.resultData['players'];
        var islei = false;
        var leisex = 1;

        for (var i = 0; i < players.length; i++) {
            var qiang = players[i]['qiang'];
            var uid = players[i]['uid'];
            if (qiang != null && qiang.length > 0) {
                for (var y = 0; y < qiang.length; y++) {
                    this.onFire(delay, uid, qiang[y]['uid'], players[i]['userSex']);
                    delay += 1.5;
                }
            }
            if (players[i]['isLei'] > 0) {
                islei = true;
                leisex = players[i]['userSex'];
            }
        }


        if (islei == true) {
            //delay+=1;
            _this.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function () {
                var soundData = {};
                soundData['userSex'] = leisex;
                sound.playSSSQuanleida(soundData);
                _this.panel_Act.setVisible(true);
                _this.panel_lei.setVisible(true);
                _this.quanleidaAct.play('quanleida', false);
                _this.quanleidaAct.setLastFrameCallFunc(function () {
                    _this.panel_Act.setVisible(false);
                    _this.panel_lei.setVisible(false);
                });

            })));

            delay += 2;
        }
        delay += 1;

        //   _this.runAction(cc.sequence(cc.delayTime(delay),cc.callFunc(function ()
        //   {
        //     sound.playSound('res/audio/effect/audio_pokerdeal.mp3');
        //
        //     _this.panel_Act.setVisible(true);
        //     _this.panel_lei.setVisible(true);
        //     var soundData = {};
        //     soundData['userSex'] = leisex;
        //     sound.playSSSQuanleida(soundData);
        //
        //   }),cc.delayTime(2),cc.callFunc(function ()
        //   {
        //     _this.panel_Act.setVisible(false);
        //     _this.panel_lei.setVisible(false);
        //
        //   })));
        //
        //   delay+=2;
        //
        // }


        this.runAction(cc.sequence(cc.delayTime(delay), cc.callFunc(function () {
            var result = new SSSRoundResult(_this.resultData, _this);
            result.showResult();

        })));


    },

    onFire: function (delay, uid, onfireUid, userSex) {

        var _this = this;
        _this.runAction(cc.sequence(
            cc.delayTime(delay),
            cc.callFunc(function () {
                var soundData = {};
                soundData['userSex'] = userSex;
                sound.playSSSOnFire(soundData);

                sound.playSound('res/audio/effect/audio_gun.mp3');
                var posfire = SSSPoker.table.uidofPos(uid);
                var gun = new cc.Sprite('res/PokerSSS/Resoures/large/gun.png');
                gun.setScale(0.6);
                gun.setAnchorPoint(cc.p(0.5, 0.5));

                var personTotal = SSSPoker.table.SEAT_TOTAL;
                if (SSSPoker.table.shuangJiang == 1)
                    personTotal += personTotal;

                var pos = _this.seatHeads[posfire].convertToWorldSpace(_this.gunPosArray[posfire].getPosition());
                if (personTotal < 7 && SSSPoker.table.shuangJiang == 0)
                    pos = cc.pAdd(pos, cc.pSub(SSSDESKOFFPOSITIONS[personTotal][posfire], SSSHEADOFFPOSITIONS[personTotal][posfire]));
                gun.setPosition(pos);
                _this.panel_desk.addChild(gun, 100);

                var posaifire = SSSPoker.table.uidofPos(onfireUid);
                var firePos = _this.seatHeads[posaifire].convertToWorldSpace(_this.gunPosArray[posaifire].getPosition());
                if (personTotal < 7 && SSSPoker.table.shuangJiang == 0)
                    firePos = cc.pAdd(firePos, cc.pSub(SSSDESKOFFPOSITIONS[personTotal][posaifire], SSSHEADOFFPOSITIONS[personTotal][posaifire]));

                var x = firePos.x - pos.x;
                var y = firePos.y - pos.y;
                if (y == 0)
                    y = 1;
                var at = Math.atan(x / y) * 180 / Math.PI;
                if (y < 0) {
                    if (x < 0)
                        at = 180 + Math.abs(at);
                    else
                        at = 180 - Math.abs(at);
                }
                at -= 90;

                if (x <= 0)
                    gun.setFlippedY(true);
                gun.setRotation(Math.floor(at));

                var delayzidan = 1.5;
                var times = 0;
                var action = cc.sequence(cc.rotateBy(0.15, -25),
                    cc.callFunc(function () {
                        times++;
                        var zidan = new cc.Sprite('res/PokerSSS/Resoures/large/hole.png');
                        _this.panel_desk.addChild(zidan, 100);
                        zidan.setPosition(firePos.x - Math.random() * 80 + times * 20, firePos.y - Math.random() * 80 + times * 20);
                        zidan.runAction(cc.sequence(cc.delayTime(delayzidan), cc.removeSelf()));
                        delayzidan -= 0.3;
                    }),
                    cc.rotateBy(0.15, 25));
                gun.runAction(cc.sequence(action.repeat(3), cc.removeSelf()));
            })
        ));


    },

    onDissolutionTable: function (data) {
        JJLog.print('onDissolutionTable ');
        JJLog.print(JSON.stringify(data));

        if (data['result'] == 0)//0拒绝解散
        {
            var tip = new JJConfirmDialog();
            var nickName = base64.decode(SSSPoker.table.uidOfInfo(data['uid'])["nickName"]);
            tip.setDes('玩家' + '【' + nickName + '】' + '拒绝解散房间,解散房间失败！');
            tip.setCallback(function () {
                JJLog.print('this is test callback');
            });
            tip.showDialog();
        } else if (data['result'] == 1)//1解散成功
        {

        } else if (data['result'] == -1) {
            if (data['status'] == 1) {
                if (data['uid'] == hall.user.uid) {
                    var result = new SSSDissloveResultDialog();
                    result.showDialog();
                } else {
                    var option = new DissloveOptionDialog(data);
                    option.showDialog();
                }
            }
        }
    },

    resetReady: function () {

        this.panel_ready.setVisible(false);
        for (var i = 0; i < this.imgReadyArray.length; i++) {
            this.imgReadyArray[i].setVisible(false);
        }
        this.btn_ready.setVisible(false);
    },

    showReady: function () {
        this.panel_desk.removeAllChildren();
        this.btn_setting.setVisible(true);
        this.panel_ready.setVisible(true);
        this.btn_ready.setVisible(false);
        this.readyStatus();
        this.resetonfire();

    },

    resetonfire: function () {
        for (var i = 0; i < this.gunPosArray.length; i++) {
            this.gunPosArray[i].removeAllChildren();
        }
    },

    onPlayerEnter: function (data) {
        JJLog.print("gamescene player enter" + JSON.stringify(data));
        if (!SSSPoker.table.inited) return;

        var userData = data["user"];
        var pos = userData["position"];
        SSSPoker.table.setSeatPosInfo(userData);
        this.addHeadsDesk(pos);
        var isShow = true;
        for (var i = 0; i < SSSPoker.table.SEAT_TOTAL; i++) {
            if (this.deskArray[i] == undefined || this.deskArray[i] == null) {
                isShow = false;
                break;
            }
        }
        this.btn_setting.setVisible(isShow);
        if (isShow == false && SSSPoker.table.bankerId == hall.user.uid) {
            this.btn_lessStart.setVisible(true);
        }
        if (this.getTablePerson() == SSSPoker.table.SEAT_TOTAL)
            this.btn_lessStart.setVisible(false);
    },

    updateDeskMode: function (event) {
        var evt = event.getUserData();
        if (evt == CommonEventAction.GANG_EVT) {
            this.panel_cover.setVisible(true);
        }
    },

    resetDeskMode: function () {
        this.panel_cover.setVisible(false);
        this.btn_force.setVisible(false);
        SSSPoker.table.isOffline = false;
        SSSPoker.table.offLineInfo = null;
        this.int_forceTime = 0;
        this.int_qiePaiTime = 0;
    },


    runGame: function () {
        if (cc.sys.isNative) {
            cc.director.replaceScene(this);
        } else {
            cc.director.runScene(this);
        }
    },

    runToPlay: function () {
        MajhongInfo.GameMode = GameMode.PLAY;
        this.runGame();
    },

});

var SSSDissloveResultDialog = JJDialog.extend({
    text_dissolve: null,
    text_dissolve_0: null,
    text_dissolve_1: null,
    text_dissolve_2: null,
    text_dissolve_3: null,
    text_dissolve_4: null,
    text_dissolve_5: null,
    text_dissolve_6: null,
    text_dissolve_7: null,
    text_clock: null,
    panel_root: null,
    text_dissolves: [],
    ctor: function (data, time) {
        this._super();
        var root = ccs.load(SSSPokerJson.DissolveResult).node;
        this.addChild(root);
        this.panel_root = ccui.helper.seekWidgetByName(root, "panel_root");
        this.text_dissolve = ccui.helper.seekWidgetByName(root, "text_dissolve");
        this.text_dissolve.setString('玩家[' + sliceName(base64.decode(hall.user.nickName)) + ']申请解散房间,请等待其他玩家选择.(超过五分钟未选择,默认同意)');
        this.text_dissolve_0 = ccui.helper.seekWidgetByName(root, "text_dissolve_0");
        this.text_dissolve_1 = ccui.helper.seekWidgetByName(root, "text_dissolve_1");
        this.text_dissolve_2 = ccui.helper.seekWidgetByName(root, "text_dissolve_2");
        this.text_dissolve_3 = ccui.helper.seekWidgetByName(root, "text_dissolve_3");
        this.text_dissolve_4 = ccui.helper.seekWidgetByName(root, "text_dissolve_4");
        this.text_dissolve_5 = ccui.helper.seekWidgetByName(root, "text_dissolve_5");
        this.text_dissolve_6 = ccui.helper.seekWidgetByName(root, "text_dissolve_6");
        this.text_dissolve_7 = ccui.helper.seekWidgetByName(root, "text_dissolve_7");

        this.text_clock = ccui.helper.seekWidgetByName(root, "text_clock");
        this.text_dissolves[0] = this.text_dissolve_0;
        this.text_dissolves[1] = this.text_dissolve_1;
        this.text_dissolves[2] = this.text_dissolve_2;
        this.text_dissolves[3] = this.text_dissolve_3;
        this.text_dissolves[4] = this.text_dissolve_4;
        this.text_dissolves[5] = this.text_dissolve_5;
        this.text_dissolves[6] = this.text_dissolve_6;
        this.text_dissolves[7] = this.text_dissolve_7;
        this.text_dissolves[0].setVisible(false);
        this.text_dissolves[1].setVisible(false);
        this.text_dissolves[2].setVisible(false);
        this.text_dissolves[3].setVisible(false);
        this.text_dissolves[4].setVisible(false);
        this.text_dissolves[5].setVisible(false);
        this.text_dissolves[6].setVisible(false);
        this.text_dissolves[7].setVisible(false);

        var index = 0;
        for (var i = 0; i < SSSPoker.table.seatArray.length; i++) {
            if (SSSPoker.table.seatArray[i] != null) {
                var info = SSSPoker.table.seatArray[i];
                if (hall.user.uid != info['uid']) {
                    this.text_dissolves[index].setString('[' + sliceName(base64.decode(info['nickName'])) + ']' + '  等待选择');
                    this.text_dissolves[index].setVisible(true);
                    this.text_dissolves[index].setTag(info['uid']);
                    index++;
                }
            }
        }

        if (!!data) {
            JJLog.print("解散===" + this.text_dissolve_1.getTag() + '====' + this.text_dissolve_2.getTag());

            this.startClock(time);
            for (var i = 0; i < data.length; i++) {
                if (i == 0) {
                    this.text_dissolve.setString('玩家[' + sliceName(base64.decode(SSSPoker.table.uidOfInfo(data[i])['nickName'])) + ']申请解散房间,请等待其他玩家选择.(超过五分钟未选择,默认同意)');
                }

                if (this.text_dissolve_0.getTag() == data[i]) {
                    this.text_dissolve_0.setString('[' + sliceName(base64.decode(SSSPoker.table.uidOfInfo(data[i])['nickName'])) + ']' + '  同意');
                }
                if (this.text_dissolve_1.getTag() == data[i]) {
                    this.text_dissolve_1.setString('[' + sliceName(base64.decode(SSSPoker.table.uidOfInfo(data[i])['nickName'])) + ']' + '  同意');
                }
                if (this.text_dissolve_2.getTag() == data[i]) {

                    this.text_dissolve_2.setString('[' + sliceName(base64.decode(SSSPoker.table.uidOfInfo(data[i])['nickName'])) + ']' + '  同意');
                }

                if (this.text_dissolve_3.getTag() == data[i]) {

                    this.text_dissolve_3.setString('[' + sliceName(base64.decode(SSSPoker.table.uidOfInfo(data[i])['nickName'])) + ']' + '  同意');
                }
                if (this.text_dissolve_4.getTag() == data[i]) {

                    this.text_dissolve_4.setString('[' + sliceName(base64.decode(SSSPoker.table.uidOfInfo(data[i])['nickName'])) + ']' + '  同意');
                }

                if (this.text_dissolve_5.getTag() == data[i]) {

                    this.text_dissolve_5.setString('[' + sliceName(base64.decode(SSSPoker.table.uidOfInfo(data[i])['nickName'])) + ']' + '  同意');
                }

                if (this.text_dissolve_6.getTag() == data[i]) {

                    this.text_dissolve_6.setString('[' + sliceName(base64.decode(SSSPoker.table.uidOfInfo(data[i])['nickName'])) + ']' + '  同意');
                }

                if (this.text_dissolve_7.getTag() == data[i]) {

                    this.text_dissolve_7.setString('[' + sliceName(base64.decode(SSSPoker.table.uidOfInfo(data[i])['nickName'])) + ']' + '  同意');
                }

            }
        }
    },

    onEnter: function () {
        this._super();
        qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);
        qp.event.listen(this, 'mjGameOver', this.onGameOver);

    },

    startClock: function (sec) {
        this.text_clock.setString(sec);

        this.schedule(this.countDown, 1);
    },

    onGameOver: function (data) {
        this.removeFromParent();
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


    onDissolutionTable: function (data) {

        if (data['result'] == 0)//0拒绝解散
        {
            this.removeFromParent();
        } else if (data['result'] == 1)//1 解散成功
        {
            //cc.director.runScene(new GameScene());
            this.removeFromParent();
        } else {
            if (data['status'] == 1) {
                if (data['uid'] == hall.user.uid) {
                    var secondTime = data['time'];
                    var minute = secondTime / 60;
                    this.text_dissolve.setString('玩家[' + sliceName(base64.decode(hall.user.nickName)) + ']申请解散房间,请等待其他玩家选择.(超过 ' + secondTime + ' 秒钟未选择,默认同意)');
                    this.startClock(secondTime);
                } else {
                    var text = this.panel_root.getChildByTag(data['uid']);
                    if (text != null) {
                        var msg = '拒绝';
                        if (data['status'] == 2) {
                            msg = '同意';
                        }
                        var info = SSSPoker.table.uidOfInfo(data['uid']);
                        text.setString(sliceName(base64.decode(info['nickName'])) + ' ' + msg);
                    }
                }

            } else {
                var text = this.panel_root.getChildByTag(data['uid']);
                if (text != null) {
                    var msg = '拒绝';
                    if (data['status'] == 2) {
                        msg = '同意';
                    }
                    var info = SSSPoker.table.uidOfInfo(data['uid']);
                    text.setString('[' + sliceName(base64.decode(info['nickName'])) + ']' + ' ' + msg);

                }
            }
        }


    },

    onExit: function () {
        qp.event.stop(this, 'mjDissolutionTable');
        qp.event.stop(this, 'mjGameOver');
        this._super();
        //var majHall = new MajhongHall();
        //majHall.showHall();
    },


});



