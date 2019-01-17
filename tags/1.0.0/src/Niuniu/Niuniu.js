
var Niuniu = {
    appId :'com.qp.hall.niuniu',
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
        //SSSPoker.table = new SSSPoker.Table();
        this.room = new Room();
        this.room.runGame();
    },

    searchRoom : function(tableId,cb)
    {
        qp.event.bind(qp.events);
        Niuniu.net.private_search(tableId, function(data) {
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
        qp.event.stop(Niuniu, 'imPlayVoice');

        Niuniu.net.leavePrivateTable(function(data){
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

        Niuniu.net.createPrivateTable(name,function(data) {
            if(data["code"] == 200)
            {
                //Niuniu.table = new SSSPoker.Table(name);
                Niuniu.owner = hall.user.uid;
            }
            cb(data);
            hall.inRoom = true;
        });
    },

    reCreatePrivate : function(name, cb) {

        Niuniu.net.reCreatePrivateTable(name,function(data) {
            if(data["code"] == 200)
            {

            }
            cb(data);
        });
    },

    deleteRePrivate : function(name, cb) {

        Niuniu.net.deleteRePrivateTable(name,function(data) {
            if(data["code"] == 200)
            {

            }
            cb(data);
        });
    },

    listPrivates : function(cb){
        Niuniu.net.listPrivateTables(function(data) {
            JJLog.print(data);
            cb(data);
        });
    },

    joinPrivate : function(tableId, cb){
        qp.event.bind(qp.events);
        qp.event.listen(qp, 'imPlayVoice', qp.onPlayVoice);

        Niuniu.net.joinPrivateTable(tableId, function(data) {
            JJLog.print(data);
            if(data['code'] == 200)
            {
                //Niuniu.table = new Niuniu.Table(data.tableId);
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
            Niuniu.imIsPlaying = true;
        } else {
            Niuniu.imIsPlaying = false;
            Niuniu.imReceivedVoice = false;

            if (Niuniu.flag_background_music == 1) {
                util.setCacheItem('background_music', 1);
            }
            if (Niuniu.flag_sound_effect == 1) {
                util.setCacheItem('sound_effect', 1);
            }
        }
    },

    onReceivedVoice:function () {
        Niuniu.imReceivedVoice = true;
        if (!Niuniu.imIsRecording && !Niuniu.imIsPlaying) {

            if (util.getCacheItem('background_music') == 1)
                Niuniu.flag_background_music = 1;
            if (util.getCacheItem('sound_effect') == 1)
                Niuniu.flag_sound_effect = 1;

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

hall.registerGame(Niuniu);

