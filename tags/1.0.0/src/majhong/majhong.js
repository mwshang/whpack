//需要更改 -- 更换名字
var majhong = {
  appId :'com.qp.hall.qzmajhong',
  CHAT_USUALMSG: [
    '你太牛了',
    '哈哈,手气真好',
    '快点出牌啊',
    '今天真高兴',
    '这个吃的好',
    '你放炮我不胡',
    '你家里是开银行的撒',
    '不好意思,有事情要先走了',
    '你的牌打的太好了',
    '大家好,很高兴见到各位',
    '怎么又断线了啊,网络这么差',
  ],
  enter : function() {
    majhong.table = new MajhongQuanZhouTable();
    var game = new  GameScene();
    game.runToPlay();
  },

  enterRecord : function(data) {
    var game = new GameScene();
    game.runToRecord(data);
  },

  exit : function(reason, cb) {
    majhong.table.deinit();
    if (majhong.table.private) {
      majhong.net.leavePrivateTable(function(data) {
        hall.wxInvite = {inviteUid: 0, areaId: 0, tableId: 0, baseChip: 0, vip: 0, password: 0};
        cb(data);
      });
    } else {
      majhong.net.exit(hall.user.uid, function(data) {
        hall.wxInvite = {inviteUid: 0, areaId: 0, tableId: 0, baseChip: 0, vip: 0, password: 0};
        cb(data);
      });
    }
//    return qp.code.OK;
  },

  searchRoom : function(tableId,cb)
  {
    qp.event.bind(qp.events);
      majhong.net.private_search(tableId, function(data) {
          JJLog.print(data);
          if(data['code'] == 200)
          {

          }else
          {

          }

          cb(data);
      });

  },


  leavePrivateTable:function(status,cb) {
    qp.event.stop(qp, 'imPlayVoice');
    majhong.net.leavePrivateTable(status,function(data){
      if(data["code"] == 200) {};
      cb(data)
    });
  },

  createPrivate : function(name, cb) {
    //qp.event.bind(majhong.net.events);
    qp.event.bind(qp.events);
    qp.event.listen(qp, 'imPlayVoice', qp.onPlayVoice);

    majhong.net.createPrivateTable(name,function(data) {
      if(data["code"] == 200)
      {
        //majhong.table = new MajhongTDHTable();
        // majhong.table.owner = hall.user.uid;
      }
      cb(data);
    });
  },

  reCreatePrivate : function(name, cb) {
    majhong.net.reCreatePrivateTable(name,function(data) {
      if(data["code"] == 200)
      {
      }
      cb(data);
    });
  },

  deleteRePrivate : function(name, cb) {

    majhong.net.deleteRePrivateTable(name,function(data) {
      if(data["code"] == 200)
      {
      }
      cb(data);
    });
  },

  listPrivates : function(cb){
    majhong.net.listPrivateTables(function(data) {
      JJLog.print(data);
      cb(data);
    });
  },

  joinPrivate : function(tableId, cb){
    qp.event.bind(qp.events);
    qp.event.listen(qp, 'imPlayVoice', qp.onPlayVoice);

    majhong.net.joinPrivateTable(tableId, function(data) {
      JJLog.print(data);
      cb(data);
    });
  }
};

hall.registerGame(majhong);

