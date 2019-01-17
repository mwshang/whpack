//var DissloveView = cc.Layer.extend({
//    panel_root:null,
//    panel_1:null,
//    text_master:null,//发起人
//    panel_player:null,
//    btn_agree:null,//同意
//    btn_refuse:null,//拒绝
//    panel_cell:null,//
//    _room:null,
//    text_names:[],
//    text_decides:[],
//    masterUid:0,
//    masterName:"",
//    ctor:function(_data){
//        this._super();
//        var root = ccs.load(NiuniuJson.Dissolve).node;
//        this.addChild(root);
//        this._room = _data["room"];
//        this.masterUid = _data["uid"];
//        var info  = this._room.getPlayerInfo(this.masterUid);
//        this.masterName = info["nickName"];
//
//        //_data["wanFa"] = this._wanFa;
//        //_data["roomId"] = this._tableId;
//        //_data["round"] = this._roundTotal;
//        //_data["diFen"] = this._diFen;
//
//        console.log("Dissolve view -=====");
//        console.log(_data);
//
//        this.panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
//        this.panel_1 = ccui.helper.seekWidgetByName(root,"panel_1");
//
//        this.text_master = ccui.helper.seekWidgetByName(this.panel_1,"text_master");
//
//        this.panel_player = ccui.helper.seekWidgetByName(root,"panel_player");
//        this.btn_agree = ccui.helper.seekWidgetByName(this.panel_1,"btn_agree");
//        this.btn_refuse = ccui.helper.seekWidgetByName(this.panel_1,"btn_refuse");
//
//        this.text_master.setString(this.masterName);
//
//        if(hall.user.uid == this.masterUid){
//            this.btn_agree.setVisible(false);
//            this.btn_refuse.setVisible(false);
//        }
//
//        this.btn_agree.addClickEventListener(function(){
//            Niuniu.net.dissolveSeat(2, function (_data) {
//
//            });
//        }.bind(this));
//
//        this.btn_refuse.addClickEventListener(function(){
//            Niuniu.net.dissolveSeat(3, function (_data) {
//
//            });
//        }.bind(this));
//
//        this.panel_cell = ccui.helper.seekWidgetByName(root,"panel_cell");
//        this.panel_cell.setVisible(false);
//
//        for(var i = 0;i < this._room._players.length;i++){
//            var player = this._room._players[i];
//            var uid = player["uid"];
//            var name = player["nickName"];
//            var str = base64.decode(name);
//            if(str.length > 15)
//            {
//                str = str.slice(0,15);
//            }
//
//
//            var cell = this.panel_cell.clone();
//            this.text_names[i] = ccui.helper.seekWidgetByName(cell,"text_name");
//            this.text_decides[i] = ccui.helper.seekWidgetByName(cell,"text_decide");
//            this.text_names[i].setTag(uid);
//            this.text_names[i].setColor(cc.color(255,165,0));
//            this.text_decides[i].setTag(uid);
//            this.text_decides[i].setColor(cc.color(255,165,0));
//            this.text_names[i].setString(str);
//
//            if(uid == this.masterUid){
//                this.text_decides[i].setString("同意");
//            }else{
//                this.text_decides[i].setString("等待中");
//            }
//
//            this.panel_player.addChild(cell);
//            var size1 = this.panel_player.getContentSize();
//            cell.setVisible(true);
//            var size = cell.getContentSize();
//            var pos = cc.p(size.width*0.5*0+size.width*1.0*i,size1.height*0.0);
//            cell.setPosition(pos);
//        }
//    },
//
//    onEnter: function () {
//        this._super();
//        qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);
//    },
//
//    onExit:function(){
//        qp.event.stop(this, 'mjDissolutionTable');
//        this._super();
//    },
//
//    onDissolutionTable:function(_data){
//        console.log("dissolution view data");
//        var uid = _data["uid"];
//        var status = _data["status"];
//
//        if(uid == hall.user.uid){
//            this.btn_agree.setVisible(false);
//            this.btn_refuse.setVisible(false);
//        }
//
//        //uid status 1 2 3  (1代表申请者申请者肯定同意的  2代表同意 3代表拒绝)
//        var str = "同意";
//        if(status == 1){
//            str = "同意";
//        }else if(status == 2){
//            str = "同意";
//        }else if(status == 3){
//            str = "拒绝";
//        }
//
//        for(var i =0;i<this.text_decides.length;i++){
//            var tag = this.text_decides[i].getTag();
//            if(tag == uid){
//                this.text_decides[i].setString(str);
//                break;
//            }
//        }
//
//        if(status == 3){
//            this.runAction(cc.sequence(cc.delayTime(2.0),cc.removeSelf()));
//        }
//
//    },
//
//
//});

var NNDissloveResultDialog = JJDialog.extend({
    text_dissolve:null,
    text_dissolve_0:null,
    text_dissolve_1:null,
    text_dissolve_2:null,
    text_dissolve_3:null,
    text_dissolve_4:null,
    text_dissolve_5:null,
    text_dissolve_6:null,
    text_dissolve_7:null,
    text_clock:null,
    panel_root:null,
    text_dissolves:[],
    room:null,
    ctor: function (data) {
        this._super();
        this.room = data["room"];
        var root = ccs.load(SSSPokerJson.DissolveResult).node;
        this.addChild(root);
        this.panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
        this.text_dissolve = ccui.helper.seekWidgetByName(root,"text_dissolve");
        this.text_dissolve.setString('玩家['+sliceName(base64.decode(hall.user.nickName)) +']申请解散房间,请等待其他玩家选择.(超过五分钟未选择,默认同意)');
        this.text_dissolve_0 = ccui.helper.seekWidgetByName(root,"text_dissolve_0");
        this.text_dissolve_1 = ccui.helper.seekWidgetByName(root,"text_dissolve_1");
        this.text_dissolve_2 = ccui.helper.seekWidgetByName(root,"text_dissolve_2");
        this.text_dissolve_3 = ccui.helper.seekWidgetByName(root,"text_dissolve_3");
        this.text_dissolve_4 = ccui.helper.seekWidgetByName(root,"text_dissolve_4");
        this.text_dissolve_5 = ccui.helper.seekWidgetByName(root,"text_dissolve_5");
        this.text_dissolve_6 = ccui.helper.seekWidgetByName(root,"text_dissolve_6");
        this.text_dissolve_7 = ccui.helper.seekWidgetByName(root,"text_dissolve_7");

        this.text_clock = ccui.helper.seekWidgetByName(root,"text_clock");
        this.text_dissolves[0] =this.text_dissolve_0;
        this.text_dissolves[1] =this.text_dissolve_1;
        this.text_dissolves[2] =this.text_dissolve_2;
        this.text_dissolves[3] =this.text_dissolve_3;
        this.text_dissolves[4] =this.text_dissolve_4;
        this.text_dissolves[5] =this.text_dissolve_5;
        this.text_dissolves[6] =this.text_dissolve_6;
        this.text_dissolves[7] =this.text_dissolve_7;
        this.text_dissolves[0].setVisible(false);
        this.text_dissolves[1].setVisible(false);
        this.text_dissolves[2].setVisible(false);
        this.text_dissolves[3].setVisible(false);
        this.text_dissolves[4].setVisible(false);
        this.text_dissolves[5].setVisible(false);
        this.text_dissolves[6].setVisible(false);
        this.text_dissolves[7].setVisible(false);

        var index = 0;
        var players = this.room._players;

        console.log(players);

        for(var i=0;i<players.length;i++){
            var info = players[i];
            if(hall.user.uid != info['uid'])
            {
                this.text_dissolves[index].setString('['+sliceName(base64.decode(info['nickName']))+']'+ '  等待选择');
                this.text_dissolves[index].setVisible(true);
                this.text_dissolves[index].setTag(info['uid']);
                index++;
            }
        }


        //for(var i = 0;i<SSSPoker.table.seatArray.length;i++)
        //{
        //    if(SSSPoker.table.seatArray[i] != null)
        //    {
        //        var info = SSSPoker.table.seatArray[i];
        //        if(hall.user.uid != info['uid'])
        //        {
        //            this.text_dissolves[index].setString('['+sliceName(base64.decode(info['nickName']))+']'+ '  等待选择');
        //            this.text_dissolves[index].setVisible(true);
        //            this.text_dissolves[index].setTag(info['uid']);
        //            index++;
        //        }
        //    }
        //}

        if(!!data)
        {
            JJLog.print("解散===" + this.text_dissolve_1.getTag() +'===='+ this.text_dissolve_2.getTag());

            this.startClock(data['time']);
            for(var i=0;i<data.length;i++)
            {
                if( i == 0)
                {
                    var info = this.room.getPlayerInfo(data[i]);
                    this.text_dissolve.setString('玩家['+sliceName(base64.decode(info['nickName'])) +']申请解散房间,请等待其他玩家选择.(超过五分钟未选择,默认同意)');
                }

                if(this.text_dissolve_0.getTag() == data[i])
                {
                    var info = this.room.getPlayerInfo(data[i]);
                    this.text_dissolve_0.setString('['+sliceName(base64.decode(info['nickName']))+']'+ '  同意');
                }
                if(this.text_dissolve_1.getTag() == data[i])
                {
                    var info = this.room.getPlayerInfo(data[i]);
                    this.text_dissolve_1.setString('['+sliceName(base64.decode(info['nickName']))+']'+ '  同意');
                }
                if(this.text_dissolve_2.getTag() == data[i])
                {
                    var info = this.room.getPlayerInfo(data[i]);
                    this.text_dissolve_2.setString('['+sliceName(base64.decode(info['nickName']))+']'+ '  同意');
                }

                if(this.text_dissolve_3.getTag() == data[i])
                {
                    var info = this.room.getPlayerInfo(data[i]);
                    this.text_dissolve_3.setString('['+sliceName(base64.decode(info['nickName']))+']'+ '  同意');
                }
                if(this.text_dissolve_4.getTag() == data[i])
                {
                    var info = this.room.getPlayerInfo(data[i]);
                    this.text_dissolve_4.setString('['+sliceName(base64.decode(info['nickName']))+']'+ '  同意');
                }

                if(this.text_dissolve_5.getTag() == data[i])
                {
                    var info = this.room.getPlayerInfo(data[i]);
                    this.text_dissolve_5.setString('['+sliceName(base64.decode(info['nickName']))+']'+ '  同意');
                }

                if(this.text_dissolve_6.getTag() == data[i])
                {
                    var info = this.room.getPlayerInfo(data[i]);
                    this.text_dissolve_6.setString('['+sliceName(base64.decode(info['nickName']))+']'+ '  同意');
                }

                if(this.text_dissolve_7.getTag() == data[i])
                {
                    var info = this.room.getPlayerInfo(data[i]);
                    this.text_dissolve_7.setString('['+sliceName(base64.decode(info['nickName']))+']'+ '  同意');
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

        this.schedule(this.countDown,1);
    },

    onGameOver:function (data) {
        this.removeFromParent();
    },

    countDown: function (dt) {
        var sec = parseInt(this.text_clock.getString());
        if(sec >= 1)
        {
            sec--;
        }
        else
        {
            sec = '0';
        }

        this.text_clock.setString(sec);
    },

    stopClock: function () {
        this.unschedule(this.countDown);
    },


    onDissolutionTable: function (data) {

        if(data['result'] == 0)//0拒绝解散
        {
            this.removeFromParent();
        }else if(data['result'] == 1)//1 解散成功
        {
            //cc.director.runScene(new GameScene());
            this.removeFromParent();
        }else
        {
            if(data['status'] == 1)
            {
                if(data['uid'] == hall.user.uid)
                {
                    var secondTime = data['time'];
                    var minute = secondTime/60;
                    this.text_dissolve.setString('玩家['+sliceName(base64.decode(hall.user.nickName)) +']申请解散房间,请等待其他玩家选择.(超过 '+secondTime+' 秒钟未选择,默认同意)');
                    this.startClock(secondTime);
                }else
                {
                    var text = this.panel_root.getChildByTag(data['uid']);
                    if(text != null)
                    {
                        var msg = '拒绝';
                        if(data['status'] == 2)
                        {
                            msg = '同意';
                        }
                        var info = this.room.getPlayerInfo(data['uid']);
                        //var info =  SSSPoker.table.uidOfInfo(data['uid']);
                        text.setString(sliceName(base64.decode(info['nickName']))+ ' '+msg);
                    }
                }

            }else
            {
                var text = this.panel_root.getChildByTag(data['uid']);
                if(text != null)
                {
                    var msg = '拒绝';
                    if(data['status'] == 2)
                    {
                        msg = '同意';
                    }
                    var info = this.room.getPlayerInfo(data['uid']);
                    //var info =  SSSPoker.table.uidOfInfo(data['uid']);
                    text.setString('['+sliceName(base64.decode(info['nickName']))+']'+ ' '+msg);

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








var NNDissloveOptionDialog = JJDialog.extend({
    btn_pass:null,
    btn_agree:null,
    text_name:null,
    room:null,
    ctor: function (data) {
        this._super();
        var JsonRes = GameHallJson.Dissolve;
        var root = ccs.load(JsonRes).node;
        this.addChild(root);
        this.room = data["room"];
        this.btn_pass = ccui.helper.seekWidgetByName(root,"btn_pass");
        this.btn_pass.addClickEventListener(function () {
            hall.getPlayingGame().net.dissolveSeat(3, function (data) {
                this.dismissDialog();
            }.bind(this));
        }.bind(this));
        this.btn_agree = ccui.helper.seekWidgetByName(root,"btn_agree");
        this.btn_agree.addClickEventListener(function () {
            hall.getPlayingGame().net.dissolveSeat(2, function (data) {
                this.dismissDialog();
            }.bind(this));
        }.bind(this));
        this.text_name = ccui.helper.seekWidgetByName(root,"text_name");
        var info = this.room.getPlayerInfo(data['uid']);
        //var info = hall.getPlayingGame().table.uidOfInfo(data['uid']);
        this.text_name.setString(sliceName(base64.decode(info['nickName'])));
    },

    onEnter: function () {
        this._super();
        qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);
        qp.event.listen(this, 'mjGameOver', this.onGameOver);
    },

    onExit: function () {
        qp.event.stop(this, 'mjDissolutionTable');
        qp.event.stop(this, 'mjGameOver');
        this._super();
    },

    onGameOver:function (data) {
        this.removeFromParent();
    },

    onDissolutionTable: function (data) {
        if(data['result'] == 0)//0拒绝解散
        {
            this.removeFromParent();
        }else if(data['result'] == 1)//1 解散成功
        {
            this.removeFromParent();
        }else
        {

        }
    }


});


var NNNDissloveOptionDialog = JJDialog.extend({
    btn_pass:null,
    btn_agree:null,
    text_name:null,
    room:null,
    ctor: function (data) {
        this._super();

        var root = ccs.load(XueZhanMajhongJson.DissolveDialog).node;
        this.addChild(root);

        this.room = data["room"];

        this.btn_pass = ccui.helper.seekWidgetByName(root,"btn_pass");
        this.btn_pass.addClickEventListener(function () {
            hall.getPlayingGame().net.dissolveSeat(3, function (data) {
                this.dismissDialog();
            }.bind(this));
        }.bind(this));
        this.btn_agree = ccui.helper.seekWidgetByName(root,"btn_agree");
        this.btn_agree.addClickEventListener(function () {
            hall.getPlayingGame().net.dissolveSeat(2, function (data) {
                this.dismissDialog();
            }.bind(this));
        }.bind(this));
        this.text_name = ccui.helper.seekWidgetByName(root,"text_name");

        var info = this.room.getPlayerInfo(data['uid']);
        //var info = hall.getPlayingGame().table.uidOfInfo(data['uid']);
        this.text_name.setString(sliceName(base64.decode(info['nickName'])));
    },

    onEnter: function () {
        this._super();
        qp.event.listen(this, 'mjDissolutionTable', this.onDissolutionTable);
        qp.event.listen(this, 'mjGameOver', this.onGameOver);
    },

    onExit: function () {
        qp.event.stop(this, 'mjDissolutionTable');
        qp.event.stop(this, 'mjGameOver');
        this._super();
    },

    onGameOver:function (data) {
        this.removeFromParent();
    },

    onDissolutionTable: function (data) {
        if(data['result'] == 0)//0拒绝解散
        {
            this.removeFromParent();
        }else if(data['result'] == 1)//1 解散成功
        {
            this.removeFromParent();
        }else
        {

        }
    }


});
