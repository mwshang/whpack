
// 斗牛游戏通讯命令
SSSPoker.net = {};
SSSPoker.net.cmds = {
    'majhong_join' : 'SSSPoker.majhongHandler.joinGame',

    'majhong_banker' : 'SSSPoker.majhongHandler.bankerGame',
    'majhong_chip' : 'SSSPoker.majhongHandler.chipInGame',
    'majhong_openCard' : 'SSSPoker.majhongHandler.openCardGame',

    'majhong_createPrivate' : 'shisanshui.pkRoomHandler.createPrivateTable',

    'majhong_recreatePrivate' : 'shisanshui.pkRoomHandler.reCreatePrivateTable',
    'majhong_deleteRePrivateTable' : 'shisanshui.pkRoomHandler.deleteRePrivateTable',

    'majhong_listPrivates' : 'SSSPoker.majhongPRoomHandler.getPrivateTableLists',
    'majhong_throw' : 'shisanshui.pkRoomHandler.throwObject',


    //********shisanshui*********
    'majhong_ready' : 'shisanshui.pkRoomHandler.readyGame',
    'majhong_init' : 'shisanshui.pkRoomHandler.initSeat',
    'majhong_joinPrivate' : 'shisanshui.pkRoomHandler.joinPrivateTable',
    'changsha_updatePlayerDelCard' : 'shisanshui.pkRoomHandler.updateDelCards',
    'changsha_updatePlayerOp' : 'shisanshui.pkRoomHandler.updatePlayerOp',
    'majhong_leavePrivate' : 'shisanshui.pkRoomHandler.leavePrivateTable',
    'majhong_addRobot' : 'shisanshui.pkRoomHandler.addRobot',//机器人
    'majhong_haidilao':'shisanshui.pkRoomHandler.haiDiGame',
    'majhong_localPosition':'shisanshui.pkRoomHandler.localPosition',
    'majhong_dissolve':'shisanshui.pkRoomHandler.dissolutionTable',
    'majhong_chat':'shisanshui.pkRoomHandler.chatGame',// 常用语 表情
    'majhong_GMCommand':'shisanshui.pkRoomHandler.gmQiPai',
    'majhong_ChipInStatus' : 'shisanshui.pkRoomHandler.mjChipInStatus',  //下注
    'majhong_start':'shisanshui.pkRoomHandler.lessPersonStart',
    'majhong_GMCards':'shisanshui.pkRoomHandler.gmOp',
    'sss_updateForceDelPai':'shisanshui.pkRoomHandler.updateForceDelPai',
    'sss_updateQiePai':'shisanshui.pkRoomHandler.updateQiePai',
};

SSSPoker.net.events = { // 三公游戏事件
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

SSSPoker.net.imRoomId = -1;
SSSPoker.net.imCreateRoom = function(data) {
  //去重
  if(SSSPoker.net.imRoomId == data.imRoomId || data.imRoomId <= 0){
      return;
  }
  SSSPoker.net.imRoomId = data.imRoomId;
  JJLog.print("IMRoomID:" + SSSPoker.net.imRoomId);
  if (cc.sys.isNative) {
        GameLink.onUserJoinRoom("xyyj"+GAMENAME+SSSPoker.net.imRoomId);
  }
};
SSSPoker.net.createPrivateTable = function(data, cb) {
  //清理IM ID  因为玩家不一定发送离开房间也有可能回到大厅
  SSSPoker.net.imRoomId = -1;
  qp.event.listen(SSSPoker, 'imCreateRoom', SSSPoker.net.imCreateRoom);
  qp.net.request(SSSPoker.net.cmds.majhong_createPrivate,
      data,
      function(resp) {
        JJLog.print("private create");
        JJLog.print(resp);
        cb(resp);
      });
};
SSSPoker.net.reCreatePrivateTable = function(data, cb) {
    qp.net.request(SSSPoker.net.cmds.majhong_recreatePrivate,
        data,
        function(resp) {
            JJLog.print("private Recreate");
            JJLog.print(resp);
            cb(resp);
        });
};

SSSPoker.net.deleteRePrivateTable = function(data, cb) {

    data["uid"] = hall.user.uid;
    qp.net.request(SSSPoker.net.cmds.majhong_deleteRePrivateTable,data,
        function(resp) {
            JJLog.print("private delete");
            JJLog.print(resp);
            cb(resp);
        });
};

SSSPoker.net.updatePlayerDelCard = function(data, cb) {
  qp.net.request(SSSPoker.net.cmds.changsha_updatePlayerDelCard,
      data,
      function(resp) {
        cb(resp);
      });
};

SSSPoker.net.updatePlayerOp = function(data, cb) {
  qp.net.request(SSSPoker.net.cmds.changsha_updatePlayerOp,
      {'uid' : hall.user.uid,
        "opType":data["opType"],
        "opCard":data["opCard"],
        "index":data["index"]
      },
      function(resp) {
        cb(resp);
      });
};

SSSPoker.net.updateLocalPosition = function() {
    console.log("SSSPoker.net.updateLocalPosition~~~~"+hall.userNav);
    if(hall.userNav != null)
    {
        console.log("SSSPoker.net.updateLocalPosition");
        qp.net.request(SSSPoker.net.cmds.majhong_localPosition,
            {'uid' : hall.user.uid,
                "nav":hall.userNav
            },
            function(resp) {
            });
    }
};

SSSPoker.net.giveRoomCard = function(data, cb) {
  qp.net.request(SSSPoker.net.cmds.majhong_fangka,
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
SSSPoker.net.addRobot = function(add, cb) {
    qp.net.request(SSSPoker.net.cmds.majhong_addRobot,
        {'uid' : hall.user.uid,
         'status':add},//1 add 0 reduce
        function(resp) {
            cb(resp);
        });
};

SSSPoker.net.getRecordInfo = function(recordId, cb) {
  qp.net.request(SSSPoker.net.cmds.majhong_record_info,
    {
      'uid' : hall.user.uid,
      'huiFangNum':recordId,
    },
    function(resp) {
      cb(resp);
    });
};


SSSPoker.net.getRecord = function( cb) {
  qp.net.request(SSSPoker.net.cmds.majhong_record,
    {'uid' : hall.user.uid,

      },
    function(resp) {
      cb(resp);
    });
};

SSSPoker.net.dissolveSeat = function(status, cb) {
  qp.net.request(SSSPoker.net.cmds.majhong_dissolve,
    {'uid' : hall.user.uid,
      'status':status},//1代表申请者申请者肯定同意的  2代表同意 3代表拒绝)
    function(resp) {
      cb(resp);
    });
};


SSSPoker.net.opHaidilao = function(status, cb) {
  qp.net.request(SSSPoker.net.cmds.majhong_haidilao,
    {'uid' : hall.user.uid,
      'status':status},//1 bank 0 no
    function(resp) {
      cb(resp);
    });
};


// 进入游戏
SSSPoker.net.join = function(gameId, areaId, tableId, cb) {
  qp.net.request(SSSPoker.net.cmds.majhong_join,
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
  SSSPoker.net.init = function(cb) {
    qp.event.listen(SSSPoker, 'imPlayVoice', SSSPoker.onPlayVoice);
    qp.event.listen(SSSPoker, 'imReceivedVoice', SSSPoker.onReceivedVoice);

    qp.net.request(SSSPoker.net.cmds.majhong_init,
      {'uid' : hall.user.uid},
      function(resp) {
        JJLog.print(resp.imRoomId);
        if (resp.code == 200) {
          if (SSSPoker.net.imRoomId == -1 && resp.tableStatus.tableId != undefined && resp.tableStatus.tableId != -1) {
            SSSPoker.net.imCreateRoom({'imRoomId': resp.tableStatus.tableId});
          }
          hall.inRoom = true;
        }
        cb(resp);
      });
  };

// 玩家准备
SSSPoker.net.ready = function(status, cb) {
  qp.net.request(SSSPoker.net.cmds.majhong_ready,
  {'uid' : hall.user.uid, 'status' : status},
  function(resp) {
    cb(resp);
  });
};

// 发表情或者文字
SSSPoker.net.chat = function(msg, isEmoj, cb) {
  qp.net.request(SSSPoker.net.cmds.majhong_chat,
    {'uid' : hall.user.uid, 'msg' : msg, 'isEmoj': isEmoj},
    function(resp) {
      cb(resp);
    });
};


SSSPoker.net.joinPrivateTable = function(tableId, cb) {
  //这里不需要监听了 因为加入的时候IM肯定创建好了 并且在init方法里面加入了如果IM出问题的话那么init里面也判断了
  //qp.event.listen(majhong, 'imCreateRoom', SSSPoker.net.imCreateRoom);
  qp.net.request(SSSPoker.net.cmds.majhong_joinPrivate,
    {'uid' : hall.user.uid, 'tableId' : tableId, 'tablePassword': "", 'inviteUid': hall.wxInvite.inviteUid},
    function(resp) {
      cb(resp);
    });
};

SSSPoker.net.chat = function(table,cb) {
  qp.net.request(SSSPoker.net.cmds.majhong_chat,
      {'uid' : hall.user.uid,
        'data':table},
      function(resp) {
        cb(resp);
      });
};

SSSPoker.net.leavePrivateTable = function(status,cb) {
  qp.net.request(SSSPoker.net.cmds.majhong_leavePrivate,
    {'uid' : hall.user.uid,
      'isGameover':status,
    },
    function(resp) {
      SSSPoker.net.imRoomId = -1;
      if (cc.sys.isNative) {
        GameLink.onUserLeaveRoom();
      }
      cb(resp);
    });
};

SSSPoker.net.gmCommand = function(card) {
    qp.net.request(SSSPoker.net.cmds.majhong_GMCommand,
        {'uid' : hall.user.uid, 'pai' : card},
        function(resp) {
        });
};


// 退出游戏
SSSPoker.net.exit = function(cb) {
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

SSSPoker.net.ChipInStatus = function(objId, cb) {
    qp.net.request(SSSPoker.net.cmds.majhong_ChipInStatus,
        {'uid' : hall.user.uid, 'bei' : objId},
        function(resp) {
            cb(resp);
        });
};


  SSSPoker.net.talk = function(playerLeft, playerRight, playerOpposite) {
      SSSPoker.imIsRecording = true;
      sound.gameSoundQuiet();
      GameLink.onUserStartTalk();
  };

  SSSPoker.net.send = function() {
    SSSPoker.imIsRecording = false;
    sound.gameSoundResume();
    GameLink.onUserStopTalk();
  };

SSSPoker.net.lessPersonStart = function(cb) {
    qp.net.request(SSSPoker.net.cmds.majhong_start,
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

SSSPoker.net.updateForceDelPai = function(cb) {
    qp.net.request(SSSPoker.net.cmds.sss_updateForceDelPai,
        {'uid' : hall.user.uid},
        function(resp) {
            cb(resp);
        });
};

SSSPoker.net.sss_readyQiePai = function(cb) {
    qp.net.request(SSSPoker.net.cmds.sss_updateQiePai,
        {'uid' : hall.user.uid,'type':1},
        function(resp) {
            cb(resp);
        });
};

SSSPoker.net.sss_updateQiePai = function(percent,cb) {
    qp.net.request(SSSPoker.net.cmds.sss_updateQiePai,
        {'uid' : hall.user.uid,'type':2,'percent':percent},
        function(resp) {
            cb(resp);
        });
};

SSSPoker.net.sss_shuffleCard = function(cb) {
    qp.net.request(SSSPoker.net.cmds.sss_updateQiePai,
        {'uid' : hall.user.uid,'type':3},
        function(resp) {
            cb(resp);
        });
};
