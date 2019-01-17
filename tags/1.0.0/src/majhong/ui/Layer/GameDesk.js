/**
 * Created by atom on 2016/7/24.
 */
var GameDesk = cc.Layer.extend({
    panel_up:null,
    panel_left:null,
    panel_player:null,
    panel_right:null,
    upCards:null,
    ctor: function () {
        this._super();
        var root = ccs.load("res/MajhongBase/MajhongDesk.json").node;
        this.addChild(root);

        this.panel_up = ccui.helper.seekWidgetByName(root,"panel_up");
        this.panel_left = ccui.helper.seekWidgetByName(root,"panel_left");

        this.panel_player = ccui.helper.seekWidgetByName(root,"panel_player");
        this.panel_right = ccui.helper.seekWidgetByName(root,"panel_right");

        if(MajhongInfo.GameMode == GameMode.PLAY)
        {
            if(!!hall.getPlayingGame().table.selfSeatInfo())
            {
                var selfseat = new SelfSeat(hall.getPlayingGame().table.selfSeatInfo());
                this.panel_player.addChild(selfseat,100);
            }

            if (!!hall.getPlayingGame().table.rightSeatInfo())
            {
                var rightSeat = new RightSeat(hall.getPlayingGame().table.rightSeatInfo());
                this.panel_right.addChild(rightSeat,99);
            }

            if (!!hall.getPlayingGame().table.leftSeatInfo())
            {
                var leftSeat = new LeftSeat(hall.getPlayingGame().table.leftSeatInfo());
                this.panel_left.addChild(leftSeat,98);
            }
            if(!!hall.getPlayingGame().table.upSeatInfo())
            {
                var upSeat = new UpSeat(hall.getPlayingGame().table.upSeatInfo());
                this.panel_up.addChild(upSeat,97);
            }
        }else if(MajhongInfo.GameMode == GameMode.RECORD)
        {
          var selfseat = new SelfSeat(hall.getPlayingGame().record.selfHandCards);
          this.panel_player.addChild(selfseat,100);

            if(hall.getPlayingGame().record.rightHandCards!= null )
            {
                var rightSeat = new RightSeat(hall.getPlayingGame().record.rightHandCards);
                this.panel_right.addChild(rightSeat,99);
            }

            if(hall.getPlayingGame().record.leftHandCards!= null )
            {
                var leftSeat = new LeftSeat(hall.getPlayingGame().record.leftHandCards);
                this.panel_left.addChild(leftSeat,98);
            }
            
            if(hall.getPlayingGame().record.upHandCards != null )
            {

                var upSeat = new UpSeat(hall.getPlayingGame().record.upHandCards);
                this.panel_up.addChild(upSeat,97);
            }

        }

    },

    onEnter:function(){
        this._super();
    }



});