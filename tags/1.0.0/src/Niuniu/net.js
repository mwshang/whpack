
// 斗牛游戏通讯命令
Niuniu.net = {};
Niuniu.net.cmds = {

    'CREATE' : 'douniu.pkRoomHandler.createPrivateTable',

    'RECREATE' : 'douniu.pkRoomHandler.reCreatePrivateTable',
    'DELETE_RECREATE' : 'douniu.pkRoomHandler.deleteRePrivateTable',
    'THROW' : 'douniu.pkRoomHandler.throwObject',


    //********shisanshui*********
    'READY' : 'douniu.pkRoomHandler.readyGame',
    'INIT' : 'douniu.pkRoomHandler.initSeat',
    'JOIN' : 'douniu.pkRoomHandler.joinPrivateTable',
    'UPDATE_DEL_CARDS' : 'douniu.pkRoomHandler.updateDelCards',
    'UPDATE_PLAYER_OP' : 'douniu.pkRoomHandler.updatePlayerOp',
    'LEAVE' : 'douniu.pkRoomHandler.leavePrivateTable',
    'ADD_ROBOT' : 'douniu.pkRoomHandler.addRobot',//机器人
    'ADD_AUTO' :  'douniu.pkRoomHandler.addAuto',//托管
    'HAIDILAO':'douniu.pkRoomHandler.haiDiGame',
    'LOCAL_POS':'douniu.pkRoomHandler.localPosition',
    'DISSOLVE':'douniu.pkRoomHandler.dissolutionTable',
    'CHAT_MSG':'douniu.pkRoomHandler.chatGame',// 常用语 表情
    'GM_CMD':'douniu.pkRoomHandler.gmQiPai',
    'CHIP' : 'douniu.pkRoomHandler.mjChipInStatus',  //下注
    'START':'douniu.pkRoomHandler.lessPersonStart',
    'GM_OP':'douniu.pkRoomHandler.gmOp',
    'SHOW':'douniu.pkRoomHandler.updateForceDelPai',
    'HOG':'douniu.pkRoomHandler.gamblingBanker',
};

Niuniu.net.events = { // 三公游戏事件
    'mjTableStatus' : function(data) {
        qp.event.send('mjTableStatus', data);
    }, // 牌桌状态
    'mjPlayerEnter' : function(data) {
        qp.event.send('mjPlayerEnter', data);
    }, // 玩家进入

    'mjBankerStart' : function(data) {
        qp.event.send('mjBankerStart', data);
    }, // 开始抢庄
    'mjBankerStatus' : function(data) {
        qp.event.send('mjBankerStatus', data);
    }, // 抢庄状态
    'mjBankerResult' : function(data) {
        qp.event.send('mjBankerResult', data);
    }, // 抢庄结果
    'mjSendHandCards' : function(data) {
        qp.event.send('mjSendHandCards', data);
    }, // 发牌
    'pkChipInStart' : function(data) {
        qp.event.send('pkChipInStart', data);
    }, // 通知玩家下注

    'mjPlayerLeave' : function(data) {
        qp.event.send('mjPlayerLeave', data);
    }, // 玩家退出
    'mjPlayerInfoChange' : function(data) {
        qp.event.send('mjPlayerInfoChange', data);
    }, // 玩家信息变化
    'mjChipInStart' : function(data) {
        qp.event.send('mjChipInStart', data);
    }, // 开始下注
    'mjChipInStatus' : function(data) {
        qp.event.send('mjChipInStatus', data);
    }, // 下注状态
    'mjOpenCardStart' : function(data) {
        qp.event.send('mjOpenCardStart', data);
    }, // 开始亮牌
    'mjOpenCardStatus' : function(data) {
        qp.event.send('mjOpenCardStatus', data);
    }, // 亮牌状态
    'mjResetTable' : function(data) {
        qp.event.send('mjResetTable', data);
    }, // 重置桌子
    'sgChatStatus' : function(data) {
        qp.event.send('mjChatStatus', data);
    }, // 桌子上聊天消息
    'mjThrowStatus' : function(data) { //震动事件
        qp.event.send('mjThrowStatus', data);
    }, // 桌子上扔道具消息

    'pkChipInStatus' : function(data) { //同步下注信息
        qp.event.send('pkChipInStatus', data);
    },

    'gamblingBanker' : function(data) { //抢庄
        qp.event.send('gamblingBanker', data);
    },


    //gamblingBanker

//======== ===========
//mjPlayerEnter
    'mjReadyStatus' : function(data) {
        qp.event.send('mjReadyStatus', data);
    },
    // 准备状态
    'mjReadyStart' : function(data) {
        qp.event.send('mjReadyStart', data);
    }, // 等待玩家准备

    'mjGameResult' : function(data) {
        qp.event.send('mjGameResult', data);
    }, // 结算结果
    'mjGameStart' : function(data) {
        qp.event.send('mjGameStart', data);
    },

    'mjNotifyDelCards' : function(data) {
        qp.event.send('mjNotifyDelCards', data);
    },

    'mjSyncDelCards' : function(data) {
        qp.event.send('mjSyncDelCards', data);
    },

    'mjPlayerMoCards' : function(data) {
        qp.event.send('mjPlayerMoCards', data);
    },

    'mjSyncPlayerMocards' : function(data) {
        qp.event.send('mjSyncPlayerMocards', data);
    },

    //通知某个玩家可以做的操作类型 天胡 吃碰杠补过胡出牌
    'mjNotifyPlayerOP' : function(data) {
        qp.event.send('mjNotifyPlayerOP', data);
    },

    'mjSyncPlayerOP' : function(data) {
        qp.event.send('mjSyncPlayerOP', data);
    },

    'mjNiaoPai' : function(data) {
        qp.event.send('mjNiaoPai', data);
    },
    //mySyncParams
    'mjSyncParams' : function(data) {
        qp.event.send('mjSyncParams', data);
    },

    //mjSyncPlayerTianHu
    'mjSyncPlayerTianHu' : function(data) {
        qp.event.send('mjSyncPlayerTianHu', data);
    },

    'mjHaiDiPai' : function(data) {
        qp.event.send('mjHaiDiPai', data);
    },

    'mjDissolutionTable' : function(data) {
        qp.event.send('mjDissolutionTable', data);
    },

    'imPlayVoice' : function(data) { // 语音事件 data = {state: 0}  0: start  1: end  -1: error
        qp.event.send('imPlayVoice', data);
    },
    'imReceivedVoice' : function(data) {
        qp.event.send('imReceivedVoice', data);
    },

    'mjChatStatus' : function(data) { //
        qp.event.send('mjChatStatus', data);
    },
    //mjGameOver
    'mjGameOver' : function(data) { //
        qp.event.send('mjGameOver', data);
    },

    //mjPlayerOffLine
    'mjPlayerOffLine' : function(data) { //
        qp.event.send('mjPlayerOffLine', data);
    },

    'mjSyncAutoState' : function(data) { //
        qp.event.send('mjSyncAutoState', data);
    },

    // imCreateRoom
    'imCreateRoom' : function(data) { //
        qp.event.send('imCreateRoom', data);
    },

    //********quanzhou*********
    //补花
    'mjHuaPai' : function(data) { //
        qp.event.send('mjHuaPai', data);
    },

    //同步其他玩家补花牌 群发
    'mjSyncHuaPai' : function(data) { //
        qp.event.send('mjSyncHuaPai', data);
    },

    //金牌
    'mjJinPai' : function(data) { //
        qp.event.send('mjJinPai', data);
    },

    //大胡
    'mjNotifyDaHu' : function(data) { //
        qp.event.send('mjNotifyDaHu', data);
    },

    'mjNotifyTingChoice' : function(data) { //
        qp.event.send('mjNotifyTingChoice', data);
    },

    'mjLocalPosition' : function(data) {  //断线重连
        qp.event.send('mjLocalPosition', data);
        console.log("mjLocalPosition~~~~~~~~~~~~~~");
        JJLog.print(data);
    },

    'pkGamblingStart' : function(data) { //
        qp.event.send('pkGamblingStart', data);
    },

    'pkGamblingResult' : function(data) { //
        qp.event.send('pkGamblingResult', data);
    },

    'pkChipInResult' : function(data) { //
        qp.event.send('pkChipInResult', data);
    },

    'pkGamblingStatus' : function(data) { //
        qp.event.send('pkGamblingStatus', data);
    },
},

Niuniu.net.imRoomId = -1;
Niuniu.net.imCreateRoom = function(data) {
    //去重
    if(Niuniu.net.imRoomId == data.imRoomId || data.imRoomId <= 0){
        return;
    }
    Niuniu.net.imRoomId = data.imRoomId;
    JJLog.print("IMRoomID:" + Niuniu.net.imRoomId);
    if (cc.sys.isNative) {
        GameLink.onUserJoinRoom("xyyj"+GAMENAME+Niuniu.net.imRoomId);
    }
};
Niuniu.net.createPrivateTable = function(data, cb) {
    //清理IM ID  因为玩家不一定发送离开房间也有可能回到大厅
    Niuniu.net.imRoomId = -1;
    qp.event.listen(Niuniu, 'imCreateRoom', Niuniu.net.imCreateRoom);
    qp.net.request(Niuniu.net.cmds.CREATE,
        data,
        function(resp) {
            JJLog.print("private create");
            JJLog.print(resp);
            cb(resp);
        });
};

Niuniu.net.reCreatePrivateTable = function(data, cb) {
    qp.net.request(Niuniu.net.cmds.RECREATE,
        data,
        function(resp) {
            JJLog.print("private Recreate");
            JJLog.print(resp);
            cb(resp);
        });
};

Niuniu.net.deleteRePrivateTable = function(data, cb) {

    data["uid"] = hall.user.uid;
    qp.net.request(Niuniu.net.cmds.DELETE_RECREATE,data,
        function(resp) {
            JJLog.print("private delete");
            JJLog.print(resp);
            cb(resp);
        });
};

Niuniu.net.updatePlayerDelCard = function(cb) {
    qp.net.request(Niuniu.net.cmds.UPDATE_DEL_CARDS,
        {'uid' : hall.user.uid
            //'pai': data
        },
        function(resp) {
            cb(resp);
        });
};

Niuniu.net.updatePlayerOp = function(data, cb) {
    qp.net.request(Niuniu.net.cmds.UPDATE_PLAYER_OP,
        {'uid' : hall.user.uid,
            "opType":data["opType"],
            "opCard":data["opCard"],
            "index":data["index"]
        },
        function(resp) {
            cb(resp);
        });
};

Niuniu.net.updateLocalPosition = function() {
    console.log("Niuniu.net.updateLocalPosition~~~~"+hall.userNav);
    if(hall.userNav != null)
    {
        console.log("SSSPoker.net.updateLocalPosition");
        qp.net.request(Niuniu.net.cmds.LOCAL_POS,
            {'uid' : hall.user.uid,
                "nav":hall.userNav
            },
            function(resp) {
            });
    }
};

Niuniu.net.giveRoomCard = function(data, cb) {
    qp.net.request(Niuniu.net.cmds.majhong_fangka,
        {'uid' : hall.user.uid,
            "type":data["type"],
            "gemNum":data["gemNum"],
            "giveUid":data["giveUid"]
        },
        function(resp) {
            cb(resp);
        });
};


//=====================================================================
//增加机器人
Niuniu.net.addRobot = function(add, cb) {
    qp.net.request(Niuniu.net.cmds.ADD_ROBOT,
        {'uid' : hall.user.uid,
            'status':add},//1 add 0 reduce
        function(resp) {
            cb(resp);
        });
};

Niuniu.net.addAuto = function(add, cb) {
    qp.net.request(Niuniu.net.cmds.ADD_AUTO,
        {'uid' : hall.user.uid,
            'status':add},//1 trust 0 cancel
        function(resp) {
            cb(resp);
        });
};
Niuniu.net.getRecordInfo = function(recordId, cb) {
    qp.net.request(SSSPoker.net.cmds.majhong_record_info,
        {
            'uid' : hall.user.uid,
            'huiFangNum':recordId,
        },
        function(resp) {
            cb(resp);
        });
};


Niuniu.net.getRecord = function( cb) {
    qp.net.request(SSSPoker.net.cmds.majhong_record,
        {'uid' : hall.user.uid,

        },
        function(resp) {
            cb(resp);
        });
};

//解散房间
Niuniu.net.dissolveSeat = function(status, cb) {
    qp.net.request(Niuniu.net.cmds.DISSOLVE,
        {'uid' : hall.user.uid,
            'status':status},//1代表申请者申请者肯定同意的  2代表同意 3代表拒绝)
        function(resp) {
            cb(resp);
        });
};

Niuniu.net.hog = function(bei, cb) {
    qp.net.request(Niuniu.net.cmds.HOG,
        {'uid' : hall.user.uid,
            'bei':bei},//抢庄下注)
        function(resp) {
            cb(resp);
        });
};


Niuniu.net.opHaidilao = function(status, cb) {
    qp.net.request(Niuniu.net.cmds.HAIDILAO,
        {'uid' : hall.user.uid,
            'status':status},//1 bank 0 no
        function(resp) {
            cb(resp);
        });
};


// 进入游戏
Niuniu.net.join = function(gameId, areaId, tableId, cb) {
    qp.net.request(Niuniu.net.cmds.JOIN,
        {'appId' : hall.appId,
            'uid' : hall.user.uid,
            'gameId' : gameId,
            'tableType':areaId,
            'inviteUid': hall.wxInvite.inviteUid},
        function(resp) {
            cb(resp);
        });
};

// 玩家已经进入桌子
Niuniu.net.init = function(cb) {
    //qp.event.listen(SSSPoker, 'imPlayVoice', Niuniu.onPlayVoice);
    //qp.event.listen(SSSPoker, 'imReceivedVoice', Niuniu.onReceivedVoice);

    qp.net.request(Niuniu.net.cmds.INIT,
        {'uid' : hall.user.uid},
        function(resp) {
            JJLog.print(resp.imRoomId);
            if (resp.code == 200) {
                if (Niuniu.net.imRoomId == -1 && resp.tableStatus.tableId != undefined && resp.tableStatus.tableId != -1) {
                    Niuniu.net.imCreateRoom({'imRoomId': resp.tableStatus.tableId});
                }
                hall.inRoom = true;
            }
            cb(resp);
        });
};

// 玩家准备
Niuniu.net.ready = function(status, cb) {
    qp.net.request(Niuniu.net.cmds.READY,
        {'uid' : hall.user.uid, 'status' : status},
        function(resp) {
            cb(resp);
        });
};

// 发表情或者文字
Niuniu.net.chat = function(msg, isEmoj, cb) {
    qp.net.request(Niuniu.net.cmds.CHAT_MSG,
        {'uid' : hall.user.uid, 'msg' : msg, 'isEmoj': isEmoj},
        function(resp) {
            cb(resp);
        });
};


Niuniu.net.joinPrivateTable = function(tableId, cb) {
    //这里不需要监听了 因为加入的时候IM肯定创建好了 并且在init方法里面加入了如果IM出问题的话那么init里面也判断了
    //qp.event.listen(majhong, 'imCreateRoom', SSSPoker.net.imCreateRoom);
    qp.net.request(Niuniu.net.cmds.JOIN,
        {'uid' : hall.user.uid, 'tableId' : tableId, 'tablePassword': "", 'inviteUid': hall.wxInvite.inviteUid},
        function(resp) {
            cb(resp);
        });
};

Niuniu.net.chat = function(table,cb) {
    qp.net.request(Niuniu.net.cmds.CHAT_MSG,
        {'uid' : hall.user.uid,
            'data':table},
        function(resp) {
            cb(resp);
        });
};

Niuniu.net.leavePrivateTable = function(status,cb) {
    qp.net.request(Niuniu.net.cmds.LEAVE,
        {'uid' : hall.user.uid,
            'isGameover':status,
        },
        function(resp) {
            Niuniu.net.imRoomId = -1;
            if (cc.sys.isNative) {
                GameLink.onUserLeaveRoom();
            }
            cb(resp);
        });
};

Niuniu.net.gmCommand = function(card) {
    qp.net.request(Niuniu.net.cmds.GM_CMD,
        {'uid' : hall.user.uid, 'pai' : card},
        function(resp) {
        });
};


// 退出游戏
Niuniu.net.exit = function(cb) {
    qp.net.request(SSSPoker.net.cmds.majhong_exit,
        {'uid' : hall.user.uid},
        function(resp) {
            cb(resp);
        });
};

SSSPoker.net.throw = function(throwData, cb) {
    qp.net.request(SSSPoker.net.cmds.majhong_throw,
        {'uid' : hall.user.uid, 'targetUid' : throwData.uid, 'throwType' : throwData.type},
        function(resp) {
            cb(resp);
        });
};

Niuniu.net.ChipInStatus = function(objId, cb) {
    qp.net.request(Niuniu.net.cmds.CHIP,
        {'uid' : hall.user.uid, 'bei' : objId},
        function(resp) {
            cb(resp);
        });
};


Niuniu.net.talk = function(playerLeft, playerRight, playerOpposite) {
    SSSPoker.imIsRecording = true;
    sound.gameSoundQuiet();
    GameLink.onUserStartTalk();
};

Niuniu.net.send = function() {
    SSSPoker.imIsRecording = false;
    sound.gameSoundResume();
    GameLink.onUserStopTalk();
};

Niuniu.net.lessPersonStart = function(cb) {
    qp.net.request(Niuniu.net.cmds.START,
        {'uid' : hall.user.uid,
            'lessStart':1},//1同意 0拒绝
        function(resp) {
            cb(resp);
        });
};

SSSPoker.net.gmOp = function(card) {
    qp.net.request(SSSPoker.net.cmds.majhong_GMCards,
        {'uid' : hall.user.uid, 'op' : card},
        function(resp) {
            console.log(JSON.stringify(resp));
        });
};

Niuniu.net.updateForceDelPai = function(cb) {
    qp.net.request(Niuniu.net.cmds.SHOW,
        {'uid' : hall.user.uid},
        function(resp) {
            cb(resp);
        });
};
