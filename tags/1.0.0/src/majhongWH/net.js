
// 斗牛游戏通讯命令
whmajhong.net = {};
var majhongAddRobot = 'majhong.majhongHandler.addRobot';
whmajhong.net.cmds = {
  'majhong_join' : 'majhong.majhongHandler.joinGame',

    'majhong_banker' : 'majhong.majhongHandler.bankerGame',
    'majhong_chip' : 'majhong.majhongHandler.chipInGame',
    'majhong_openCard' : 'majhong.majhongHandler.openCardGame',
    'majhong_chat' : 'majhong.majhongHandler.chatGame',
    'majhong_exit' : 'majhong.majhongHandler.leaveGame',
    'majhong_createPrivate' : 'wuhan.mjRoomHandler.createPrivateTable',
    'majhong_recreatePrivate' : 'wuhan.mjRoomHandler.reCreatePrivateTable',
    'majhong_deleteRePrivateTable' : 'wuhan.mjRoomHandler.deleteRePrivateTable',

  'majhong_listPrivates' : 'majhong.majhongPRoomHandler.getPrivateTableLists',
  'majhong_throw' : 'majhong.majhongHandler.throwObject',

   'majhong_search' : 'majhong.majhongPRoomHandler.searchPrivateTable', //搜索房间



    //********quanzhou*********
    'majhong_ready' : 'wuhan.mjRoomHandler.readyGame',
    'majhong_init' : 'wuhan.mjRoomHandler.initSeat',
    'majhong_joinPrivate' : 'wuhan.mjRoomHandler.joinPrivateTable',
    'changsha_updatePlayerDelCard' : 'wuhan.mjRoomHandler.updateDelCards',
    'changsha_updatePlayerOp' : 'wuhan.mjRoomHandler.updatePlayerOp',
    'majhong_leavePrivate' : 'wuhan.mjRoomHandler.leavePrivateTable',
    'majhong_addRobot' : 'wuhan.mjRoomHandler.addRobot',//机器人
    'majhong_haidilao':'wuhan.mjRoomHandler.haiDiGame',
    'majhong_localPosition':'wuhan.mjRoomHandler.localPosition',
    'majhong_dissolve':'wuhan.mjRoomHandler.dissolutionTable',
    'majhong_GMCommand':'wuhan.mjRoomHandler.gmQiPai',

    'majhong_fangka':'hall.fangkaHandler.operationFangka',


    'majhong_chat':'wuhan.mjRoomHandler.chatGame',// 常用语 表情
  'majhong_record':'hall.playerHandler.getHuifangRecord',
  'majhong_record_info':'hall.playerHandler.getHuifangInfo',
   'majhong_updateGdGangOp' : 'wuhan.mjRoomHandler.updateGdGangOp',             //开皮子杠是否补牌
};

whmajhong.net.events = { // 三公游戏事件
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
  'mjThrowStatus' : function(data) {
    qp.event.send('mjThrowStatus', data);
  }, // 桌子上扔道具消息

//======== ===========
//mjPlayerEnter
  'mjReadyStatus' : function(data) {
    qp.event.send('mjReadyStatus', data);
  }, // 准备状态
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
},

whmajhong.net.imRoomId = -1;
whmajhong.net.imCreateRoom = function(data) {
  //去重
  if(whmajhong.net.imRoomId == data.imRoomId || data.imRoomId <= 0){
      return;
  }
    whmajhong.net.imRoomId = data.imRoomId;
  JJLog.print("IMRoomID:" + whmajhong.net.imRoomId);
    if (cc.sys.isNative) {
        GameLink.onUserJoinRoom(GAMENAME+whmajhong.net.imRoomId);
    }
};
whmajhong.net.createPrivateTable = function(data, cb) {
  //清理IM ID  因为玩家不一定发送离开房间也有可能回到大厅
    whmajhong.net.imRoomId = -1;
  qp.event.listen(whmajhong, 'imCreateRoom', whmajhong.net.imCreateRoom);
    data['uid'] = hall.user.uid;
  qp.net.request(whmajhong.net.cmds.majhong_createPrivate,data,
      function(resp) {
        JJLog.print("private create");
        JJLog.print(resp);
        cb(resp);
      });
};

whmajhong.net.reCreatePrivateTable = function(data, cb) {

    data["uid"] = hall.user.uid;
    qp.net.request(whmajhong.net.cmds.majhong_recreatePrivate,data,
        function(resp) {
            JJLog.print("private Recreate");
            JJLog.print(resp);
            cb(resp);
        });
};

whmajhong.net.deleteRePrivateTable = function(data, cb) {
    data["uid"] = hall.user.uid;
    qp.net.request(whmajhong.net.cmds.majhong_deleteRePrivateTable,data,
        function(resp) {
            JJLog.print("private delete");
            JJLog.print(resp);
            cb(resp);
        });
};

whmajhong.net.updatePlayerDelCard = function(card, cb) {
  qp.net.request(whmajhong.net.cmds.changsha_updatePlayerDelCard,
      {'uid' : hall.user.uid,
        'opCard': card
      },
      function(resp) {
        cb(resp);
      });
};

whmajhong.net.updatePlayerOp = function(data, cb) {
  qp.net.request(whmajhong.net.cmds.changsha_updatePlayerOp,
      {'uid' : hall.user.uid,
        "opType":data["opType"],
        "opCard":data["opCard"],
        "index":data["index"]
      },
      function(resp) {
        cb(resp);
      });
};

whmajhong.net.updateLocalPosition = function() {
    console.log("whmajhong.net.updateLocalPosition~~~~"+hall.userNav);
    if(hall.userNav != null)
    {
        console.log("whmajhong.net.updateLocalPosition");
        qp.net.request(whmajhong.net.cmds.majhong_localPosition,
            {'uid' : hall.user.uid,
                "nav":hall.userNav
            },
            function(resp) {
            });
    }
};

whmajhong.net.giveRoomCard = function(data, cb) {
  qp.net.request(whmajhong.net.cmds.majhong_fangka,
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
whmajhong.net.addRobot = function(add, cb) {
    qp.net.request(whmajhong.net.cmds.majhong_addRobot,
        {'uid' : hall.user.uid,
         'status':add},//1 add 0 reduce
        function(resp) {
            cb(resp);
        });
};

whmajhong.net.getRecordInfo = function(recordId, cb) {
  qp.net.request(whmajhong.net.cmds.majhong_record_info,
    {
      'uid' : hall.user.uid,
      'huiFangNum':recordId,
    },
    function(resp) {
      cb(resp);
    });
};


whmajhong.net.getRecord = function( cb) {
  qp.net.request(whmajhong.net.cmds.majhong_record,
    {'uid' : hall.user.uid,

      },
    function(resp) {
      cb(resp);
    });
};

whmajhong.net.dissolveSeat = function(status, cb) {
  qp.net.request(whmajhong.net.cmds.majhong_dissolve,
    {'uid' : hall.user.uid,
      'status':status},//1代表申请者申请者肯定同意的  2代表同意 3代表拒绝)
    function(resp) {
      cb(resp);
    });
};


whmajhong.net.opHaidilao = function(status, cb) {
  qp.net.request(whmajhong.net.cmds.majhong_haidilao,
    {'uid' : hall.user.uid,
      'status':status},//1 bank 0 no
    function(resp) {
      cb(resp);
    });
};


// 进入游戏
whmajhong.net.join = function(gameId, areaId, tableId, cb) {
  qp.net.request(whmajhong.net.cmds.majhong_join,
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
whmajhong.net.init = function(cb) {
    qp.event.listen(qp, 'imPlayVoice', qp.onPlayVoice);
    qp.net.request(whmajhong.net.cmds.majhong_init,
      {'uid' : hall.user.uid},
      function(resp) {
        JJLog.print(resp.imRoomId);
        if (resp.code == 200) {

          if (!!resp.tableStatus["baseScore"]) {
            basecashdata.setBaseCash(resp.tableStatus["baseScore"]);
          }

          // if (whmajhong.net.imRoomId == -1 && resp.tableStatus.imRoomId != undefined && resp.tableStatus.imRoomId != -1) {
            if (whmajhong.net.imRoomId == -1 && resp.tableStatus.tableId != undefined && resp.tableStatus.tableId != -1) {
              whmajhong.net.imCreateRoom({'imRoomId': resp.tableStatus.tableId});
          }
        }
        cb(resp);
      });
  };

// 玩家准备
whmajhong.net.ready = function(status, cb) {
  qp.net.request(whmajhong.net.cmds.majhong_ready,
  {'uid' : hall.user.uid, 'status' : status},
  function(resp) {
    cb(resp);
  });
};

// 发表情或者文字
whmajhong.net.chat = function(msg, isEmoj, cb) {
  qp.net.request(whmajhong.net.cmds.majhong_chat,
    {'uid' : hall.user.uid, 'msg' : msg, 'isEmoj': isEmoj},
    function(resp) {
      cb(resp);
    });
};


whmajhong.net.joinPrivateTable = function(tableId, cb) {
  //这里不需要监听了 因为加入的时候IM肯定创建好了 并且在init方法里面加入了如果IM出问题的话那么init里面也判断了
  //qp.event.listen(majhong, 'imCreateRoom', majhong.net.imCreateRoom);
  qp.net.request(whmajhong.net.cmds.majhong_joinPrivate,
    {'uid' : hall.user.uid, 'tableId' : tableId, 'tablePassword': "", 'inviteUid': hall.wxInvite.inviteUid},
    function(resp) {
      cb(resp);
    });
};

whmajhong.net.private_search = function(tableId,cb) {
    qp.net.request(whmajhong.net.cmds.majhong_search,
        {'uid' : hall.user.uid,
            'tableId':tableId},
        function(resp) {

            cb(resp);
        });
};

whmajhong.net.chat = function(table,cb) {
  qp.net.request(whmajhong.net.cmds.majhong_chat,
      {'uid' : hall.user.uid,
        'data':table},
      function(resp) {
        cb(resp);
      });
};

whmajhong.net.leavePrivateTable = function(status,cb) {
  qp.net.request(whmajhong.net.cmds.majhong_leavePrivate,
    {'uid' : hall.user.uid,
      'isGameover':status,
    },
    function(resp) {
        whmajhong.net.imRoomId = -1;
        if (cc.sys.isNative)
        {
            GameLink.onUserLeaveRoom();
        }
      cb(resp);
    });
};

whmajhong.net.gmCommand = function(card) {
    qp.net.request(whmajhong.net.cmds.majhong_GMCommand,
        {'uid' : hall.user.uid, 'pai' : card},
        function(resp) {
        });
};


// 退出游戏
whmajhong.net.exit = function(cb) {
  qp.net.request(whmajhong.net.cmds.majhong_exit,
    {'uid' : hall.user.uid},
    function(resp) {
      cb(resp);
    });
};

whmajhong.net.throw = function(objId, cb) {
  qp.net.request(whmajhong.net.cmds.majhong_throw,
    {'uid' : hall.user.uid, 'objectId' : objId},
    function(resp) {
      cb(resp);
    });
};


whmajhong.net.talk = function(playerLeft, playerRight, playerOpposite) {
    sound.gameSoundQuiet();
    if (cc.sys.isNative)
    {
        GameLink.onUserStartTalk();
    }
  };

whmajhong.net.send = function() {
      sound.gameSoundResume();
      if (cc.sys.isNative)
      {
          GameLink.onUserStopTalk();
      }
  };

whmajhong.net.updateGdGangOp = function(gdGangBuPai, cb) {
    qp.net.request(whmajhong.net.cmds.majhong_updateGdGangOp,
        {'uid' : hall.user.uid,
          "gdGangBuPai":gdGangBuPai,
        },
        function(resp) {
            cb(resp);
        });
};
