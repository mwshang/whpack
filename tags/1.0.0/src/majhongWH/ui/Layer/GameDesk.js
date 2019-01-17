/**
 * Created by atom on 2016/7/24.
 */
var WHMJGameDesk = cc.Layer.extend({
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
          var selfseat = new WHMJSelfSeat(hall.getPlayingGame().table.selfSeatInfo());
          this.panel_player.addChild(selfseat,100);

          var rightSeat = new WHMJRightSeat(hall.getPlayingGame().table.rightSeatInfo());
          this.panel_right.addChild(rightSeat,99);

          var leftSeat = new WHMJLeftSeat(hall.getPlayingGame().table.leftSeatInfo());
          this.panel_left.addChild(leftSeat,98);

          var upSeat = new WHMJUpSeat(hall.getPlayingGame().table.upSeatInfo());
          this.panel_up.addChild(upSeat,97);
        }else if(MajhongInfo.GameMode == GameMode.RECORD)
        {
          var selfseat = new WHMJSelfSeat(hall.getPlayingGame().record.selfHandCards);
          this.panel_player.addChild(selfseat,100);

          var rightSeat = new WHMJRightSeat(hall.getPlayingGame().record.rightHandCards);
          this.panel_right.addChild(rightSeat,99);

          var leftSeat = new WHMJLeftSeat(hall.getPlayingGame().record.leftHandCards);
          this.panel_left.addChild(leftSeat,98);

          var upSeat = new WHMJUpSeat(hall.getPlayingGame().record.upHandCards);
          this.panel_up.addChild(upSeat,97);
        }

    },

    onEnter:function(){
        this._super();
    }
});