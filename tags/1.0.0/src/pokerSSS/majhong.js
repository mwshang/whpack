
var SSSPoker = {
  appId :'com.qp.hall.pokerSSS',
  CHAT_USUALMSG:[
    '很高兴和你们一起打牌！',
    '快点吧，我等到花都谢了！',
    '急什么，让我想想怎么打！',
    '这把牌真好，全垒打有希望啊！',
    '我是一个神枪手，打枪本领大！',
    '这把牌敢不敢再水一点啊',
    '又输啦，大爷给条活路吧！',
    '我有事先走了，下次再玩吧！',
  ],

  enter : function() {
    SSSPoker.table = new SSSPoker.Table();
    var game = new  SSSGameScene();
    game.runToPlay();
  },

  searchRoom : function(tableId,cb)
  {
      qp.event.bind(qp.events);
      SSSPoker.net.private_search(tableId, function(data) {
          JJLog.print(data);
          if(data['code'] == 200)
          {

          }else
          {

          }

          cb(data);
      });

  },


  leavePrivateTable:function(cb) {
    qp.event.stop(SSSPoker, 'imPlayVoice');

        SSSPoker.net.leavePrivateTable(function(data){
           if(data["code"] == 200)
           {

           }
            hall.inRoom = false;
           cb(data);
        });
    },

  createPrivate : function(name, cb) {
    qp.event.bind(qp.events);
    qp.event.listen(qp, 'imPlayVoice', qp.onPlayVoice);

    SSSPoker.net.createPrivateTable(name,function(data) {
    if(data["code"] == 200)
    {
        SSSPoker.table = new SSSPoker.Table(name);
        SSSPoker.table.owner = hall.user.uid;
    }
      cb(data);
        hall.inRoom = true;
    });
  },

  reCreatePrivate : function(name, cb) {

    SSSPoker.net.reCreatePrivateTable(name,function(data) {
      if(data["code"] == 200)
      {

      }
      cb(data);
    });
  },

  deleteRePrivate : function(name, cb) {

    SSSPoker.net.deleteRePrivateTable(name,function(data) {
      if(data["code"] == 200)
      {

      }
      cb(data);
    });
  },

  listPrivates : function(cb){
    SSSPoker.net.listPrivateTables(function(data) {
      JJLog.print(data);
      cb(data);
    });
  },

  joinPrivate : function(tableId, cb){
    qp.event.bind(qp.events);
    qp.event.listen(qp, 'imPlayVoice', qp.onPlayVoice);

    SSSPoker.net.joinPrivateTable(tableId, function(data) {
      JJLog.print(data);
        if(data['code'] == 200)
        {
            SSSPoker.table = new SSSPoker.Table(data.tableId);
            cb(data);
            hall.inRoom = true;
        }else
        {
            cb(data);
        }


    });
  },

  onPlayVoice:function (data) {
    if (data.state == 0) {
      SSSPoker.imIsPlaying = true;
    } else {
      SSSPoker.imIsPlaying = false;
      SSSPoker.imReceivedVoice = false;

      if (SSSPoker.flag_background_music == 1) {
        util.setCacheItem('background_music', 1);
      }
      if (SSSPoker.flag_sound_effect == 1) {
        util.setCacheItem('sound_effect', 1);
      }
    }
  },

  onReceivedVoice:function () {
    SSSPoker.imReceivedVoice = true;
    if (!SSSPoker.imIsRecording && !SSSPoker.imIsPlaying) {

      if (util.getCacheItem('background_music') == 1)
        SSSPoker.flag_background_music = 1;
      if (util.getCacheItem('sound_effect') == 1)
        SSSPoker.flag_sound_effect = 1;

      util.setCacheItem('background_music',0);
      util.setCacheItem('sound_effect',0);

      sound.stopBgSound();
      sound.stopEffect();

      SSSPoker.playVoice();
    }
  },
  
  playVoice:function () {
    if (util.getNativeVersion() > 0x010000) {
      console.log('playVoice');
      if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("NativeOcClass",
          "imPlayVoice");
      } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod("com/luminositygame/wxapi/AppActivity",
          "imPlayVoice", "()V");
      }
    }
  }
};

hall.registerGame(SSSPoker);

