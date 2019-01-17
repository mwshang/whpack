/**
 * Created by atom on 2016/8/21.
 */
var SSSRoundResult = cc.Layer.extend({

    listview_result:null,
    btn_start:null,
    panel_cell:null,
    room:null,
    panel_bird:null,
    img_result_title_bg:null,
    img_result_title:null,
    label_result_count :null,
    btn_end_report:null,
    btn_share:null,

    panel_root :null,
    btn_showresult:null,
    btn_hideresult:null,
    image_head_deinit: false,
    text_roomid:null,

    ctor: function (data,jRoom) {
        this._super();
        this.room = jRoom;
        var root = ccs.load(SSSPokerJson.RoundResult).node;
        this.addChild(root);
        this.img_result_title = ccui.helper.seekWidgetByName(root,"img_result_title");

        this.listview_result = ccui.helper.seekWidgetByName(root,"listview_result");
        this.panel_cell = ccui.helper.seekWidgetByName(root,"panel_cell");
        this.panel_cell.setVisible(false);
        this.btn_start = ccui.helper.seekWidgetByName(root,"btn_start");
        this.btn_share = ccui.helper.seekWidgetByName(root,"btn_share");
        this.btn_share.addClickEventListener(function () {
            hall.net.wxShareScreen(0);
        }.bind(this));

        this.btn_start.addClickEventListener(function () {
            this.room.showReady();
            this.removeFromParent();
        }.bind(this));

        this.btn_end_report = ccui.helper.seekWidgetByName(root,"btn_end_report");
        this.btn_end_report.addClickEventListener(function () {
          this.removeFromParent();
          var endReport = new SSSEndResult();
          var scene = new cc.Scene();
          scene.addChild(endReport);
          if(cc.sys.isNative)
          {
            cc.director.replaceScene(scene);
          }else
          {
            cc.director.runScene(scene);
          }

        }.bind(this));


        if(data['isOver'] == 0){
          this.btn_start.setVisible(true);
          this.btn_end_report.setVisible(false);
        }else if(data['isOver'] == 1)
        {
          this.btn_start.setVisible(false);
          this.btn_end_report.setVisible(true);
        }

        this.panel_root  = ccui.helper.seekWidgetByName(root,"panel_root");
        this.btn_showresult  = ccui.helper.seekWidgetByName(root,"btn_showresult");
        this.btn_showresult.setVisible(false);
        this.btn_showresult.addClickEventListener(function () {
            this.onclickshowresult();
        }.bind(this));

        this.btn_hideresult  = ccui.helper.seekWidgetByName(root,"btn_hideresult");
        this.btn_hideresult.setVisible(true);
        this.btn_hideresult.addClickEventListener(function () {
            this.onclickhideresult();
        }.bind(this));

        this.text_roomid =  ccui.helper.seekWidgetByName(root,"text_roomid");
        this.text_roomid.setString('房号：'+ SSSPoker.table.roomId);
        this.initList(data);


    },

    initList: function (data) {
        var bankerId = data['banker'];
        var players = data['players'];
        var playercount = players.length;
        for(var i = 0; i <playercount;i++)
        {
            var info = players[i];
            if(hall.user.uid == info['uid'])
            {
                if(info['winScore'] > 0)
                {
                  sound.playSound('res/audio/effect/audio_win.mp3');
                  this.img_result_title.loadTexture('sss_win_title.png',ccui.Widget.PLIST_TEXTURE);
                  this.img_result_title.setVisible(true);
                }else
                {
                  sound.playSound('res/audio/effect/audio_lose.mp3');
                  this.img_result_title.loadTexture('sss_lose_title.png',ccui.Widget.PLIST_TEXTURE);
                  this.img_result_title.setVisible(true);
                }
            }

            var cell = this.panel_cell.clone();
            var text_name = ccui.helper.seekWidgetByName(cell,"text_name");
            var image_bank = ccui.helper.seekWidgetByName(cell,"image_bank");
            var text_score = ccui.helper.seekWidgetByName(cell,"text_score");
            var sprite_head = ccui.helper.seekWidgetByName(cell,"sprite_head");
            var img_lei = ccui.helper.seekWidgetByName(cell,"image_lei");
            var text_uid = ccui.helper.seekWidgetByName(cell,"text_id");

            text_uid.setString('ID:'+ info['uid']);
            text_score.setString(info['winScore']);
            if(info['isLei'] > 0)
            {
                img_lei.setVisible(true);
            }else
            {
                img_lei.setVisible(false);
            }

            var name = base64.decode(info['nickName']);
            // if(name.length > 4)
            // {
            //     name = name.slice(0,4);
            //     name += '..';
            // }
            name = cutStringLenght(name);
            text_name.setString(name);

            if(info['uid'] == bankerId)
            {
                image_bank.setVisible(true);

            }else
            {
                image_bank.setVisible(false);
            }

            if (info.headUrl != undefined && info.headUrl.length > 0) {
                if(info.headUrl.substring(info.headUrl.length-1,info.headUrl.length) == "0")
                {
                    info.headUrl = info.headUrl.substring(0,info.headUrl.length-1)+"96";
                }
                // var tex = util.getTextureForKey(info.headUrl);
                // if (tex != null && tex != undefined) {
                //     var size = sprite_head.getContentSize();
                //     var sprite = new cc.Sprite(tex);
                //     var size_sp = sprite.getContentSize();
                //     sprite.setScaleX(size.width/size_sp.width);
                //     sprite.setScaleY(size.height/size_sp.height);
                //     sprite.setAnchorPoint(cc.p(0, 0));
                //     sprite_head.addChild(sprite);
                // }else {
                //     cc.loader.loadImg(info.headUrl,
                //         function (err, tex) {
                //             JJLog.print(err);
                //             if (err == null && !this.image_head_deinit) {
                //                 var size = this.getContentSize();
                //                 var sprite = new cc.Sprite(tex);
                //                 var size_sp = sprite.getContentSize();
                //                 sprite.setScaleX(size.width/size_sp.width);
                //                 sprite.setScaleY(size.height/size_sp.height);
                //                 sprite.setAnchorPoint(cc.p(0, 0));
                //                 this.addChild(sprite);
                //             }
                //         }.bind(sprite_head));
                // }
                util.LoadHead(sprite_head , info.headUrl);
            }
            var layout = new ccui.Layout();
            layout.setContentSize(cell.getContentSize());

            if(playercount==7)
            {
                layout.setContentSize(cc.size(cell.getContentSize().width*0.87,cell.getContentSize().height*0.87));
                cell.setScale(0.9);
            }else if(playercount==8)
            {
                layout.setContentSize(cc.size(cell.getContentSize().width*0.76,cell.getContentSize().height*0.76));
                cell.setScale(0.8);
            }

            if(playercount == 2)
            {
                cell.x = 200;
                this.listview_result.setItemsMargin(150);  //设置间隔
            }else if(playercount == 3)
            {
                cell.x = 150;
                this.listview_result.setItemsMargin(60);  //设置间隔
            }
            else if(playercount == 4)
            {
                cell.x = 80;
                this.listview_result.setItemsMargin(40);  //设置间隔
            }
            else if(playercount == 5)
            {
                cell.x = 40;
                this.listview_result.setItemsMargin(15);  //设置间隔
            }else
            {
                cell.x = 0;
            }
            cell.y = 0;

            layout.addChild(cell);
            cell.setVisible(true);
            this.listview_result.pushBackCustomItem(layout);
        }
    },

    onclickshowresult:function()
    {
        this.btn_showresult.setVisible(false);
        this.btn_hideresult.setVisible(true);
        this.panel_root.setVisible(true);
    },

    onclickhideresult:function()
    {
        this.btn_showresult.setVisible(true);
        this.btn_hideresult.setVisible(false);
        this.panel_root.setVisible(false);
    },

    showResult: function () {
        this.setVisible(false);
        cc.director.getRunningScene().addChild(this,900);
       this.runAction(cc.sequence(cc.delayTime(1),cc.show()));
    },

    onExit: function() {
        this._super();
        this.image_head_deinit = true;
    },
});
