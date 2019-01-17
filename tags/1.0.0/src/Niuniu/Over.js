var OverView = cc.Scene.extend({
    panel_cell:null,
    text_room_id:null,
    text_round:null,
    text_base:null,//低分
    text_type:null,//玩法
    text_time:null,//时间
    btn_exit:null,
    btn_share:null,
    panel_top:null,
    ctor:function(_data){
        this._super();
        var root = ccs.load(NiuniuJson.Over).node;
        this.addChild(root);

        //_data["wanFa"] = this._wanFa;
        //_data["roomId"] = this._tableId;
        //_data["round"] = this._roundTotal;
        //_data["diFen"] = this._diFen;

        console.log("over view -=====");
        console.log(_data);

        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }

        if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
        }

        if (min >= 0 && min <= 9) {
            min = "0" + min;
        }

        if (sec >= 0 && sec <= 9) {
            sec = "0" + sec;
        }

        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + hour + seperator2 + min
            + seperator2 + sec;



        this.panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
        this.panel_top = ccui.helper.seekWidgetByName(root,"panel_top");

        this.text_room_id = ccui.helper.seekWidgetByName(root,"text_room_id");
        this.text_room_id.setString(_data["roomId"]);
        this.text_round = ccui.helper.seekWidgetByName(root,"text_round");
        this.text_round.setString(_data["round"]);
        this.text_base = ccui.helper.seekWidgetByName(root,"text_base");//低分
        this.text_base.setString(_data["diFen"]);
        this.text_type = ccui.helper.seekWidgetByName(root,"text_type");
        this.text_type.setString(NiuniuWanFa[_data["wanFa"]]);
        this.text_time = ccui.helper.seekWidgetByName(root,"text_time");
        this.text_time.setString(currentdate);
        this.btn_exit = ccui.helper.seekWidgetByName(root,"btn_exit");
        this.btn_share = ccui.helper.seekWidgetByName(root,"btn_share");
        var ownerId = _data["fangZhu"];
        var winnerId = _data["bigWiner"];
        this.btn_exit.addClickEventListener(function(){
            var majHall = new MajhongHall();
            majHall.showHall();
        }.bind(this));

        this.btn_share.addClickEventListener(function(){
            hall.net.wxShareScreen(0);
        }.bind(this));

        this.panel_cell = ccui.helper.seekWidgetByName(root,"panel_cell");
        this.panel_cell.setVisible(false);

        var posArr = [];
        posArr.push(cc.p(26,373));  //309
        posArr.push(cc.p(335,373));
        posArr.push(cc.p(644,373));
        posArr.push(cc.p(953,373));
        posArr.push(cc.p(26,172));
        posArr.push(cc.p(335,172));
        posArr.push(cc.p(644,172));
        posArr.push(cc.p(953,172));

        var players = _data["players"];
        for(var i = 0;i < players.length;i++){
            var info = players[i];
            var uid = info["uid"];
            var name = info["nickName"];
            var coin = info["coinNum"];

            var cell = this.panel_cell.clone();
            var sprite_head  = ccui.helper.seekWidgetByName(cell,"img_head");
            var img_fangzhu  = ccui.helper.seekWidgetByName(cell,"img_fangzhu");
            var text_id  = ccui.helper.seekWidgetByName(cell,"text_id");
            var text_name  = ccui.helper.seekWidgetByName(cell,"text_name");
            var text_score_win  = ccui.helper.seekWidgetByName(cell,"text_score_win");
            var text_score_lost  = ccui.helper.seekWidgetByName(cell,"text_score_lost");
            var img_win  = ccui.helper.seekWidgetByName(cell,"img_win");
            var img_lost  = ccui.helper.seekWidgetByName(cell,"img_lost");
            img_win.setVisible(false);
            img_lost.setVisible(false);
            img_fangzhu.setVisible(false);
            text_score_win.setTextColor(cc.color(224,61,24));
            text_score_lost.setTextColor(cc.color(28,201,28));
            text_id.setTextColor(cc.color(255,165,0));
            text_name.setTextColor(cc.color(174,83,23));

            if (info.headUrl != undefined && info.headUrl.length > 0) {
                if(info.headUrl.substring(info.headUrl.length-1,info.headUrl.length) == "0")
                {
                    info.headUrl = info.headUrl.substring(0,info.headUrl.length-1)+"96";
                }
                var tex = util.getTextureForKey(info.headUrl);
                if (tex != null && tex != undefined) {
                    var size = sprite_head.getContentSize();
                    var sprite = new cc.Sprite(tex);
                    var size_sp = sprite.getContentSize();
                    sprite.setScaleX(size.width/size_sp.width);
                    sprite.setScaleY(size.height/size_sp.height);
                    sprite.setAnchorPoint(cc.p(0, 0));
                    sprite_head.addChild(sprite);
                }else {
                    cc.loader.loadImg(info.headUrl,
                        function (err, tex) {
                            JJLog.print(err);
                            if (err == null && !this.image_head_deinit) {
                                var size = this.getContentSize();
                                var sprite = new cc.Sprite(tex);
                                var size_sp = sprite.getContentSize();
                                sprite.setScaleX(size.width/size_sp.width);
                                sprite.setScaleY(size.height/size_sp.height);
                                sprite.setAnchorPoint(cc.p(0, 0));
                                this.addChild(sprite);
                            }
                        }.bind(sprite_head));
                }
            }



            var str = base64.decode(name);
            if(str.length > 15)
            {
                str = str.slice(0,15);
            }

            text_name.setString(str);
            text_id.setString(uid);
            if(uid == winnerId){
                img_win.setVisible(true);
            }

            if(uid == ownerId){
                img_fangzhu.setVisible(true);
            }

            if(coin >= 0){


                text_score_win.setString("+"+coin);
                text_score_lost.setVisible(false);


            }else{

                text_score_lost.setString(coin);
                text_score_win.setVisible(false);
            }

            cell.setPosition(posArr[i]);
            cell.setVisible(true);
            root.addChild(cell);
        }

    },


});