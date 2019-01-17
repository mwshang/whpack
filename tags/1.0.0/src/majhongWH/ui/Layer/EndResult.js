/**
 * Created by atom on 2016/9/24.
 */
var WHMJEndResult = cc.Layer.extend({
  root:null,
  panel_cell:null,
  listview_result:null,
  image_head_deinit: false,
  data:null,
    ctor: function (data) {
      this._super(data);
      this.data = whmajhong.table.report;

      JJLog.print('End Result:' + JSON.stringify(this.data));

      this.root = ccs.load("res/MajhongBase/MajhongEndResult.json").node;
      this.addChild(this.root);
      var image_title_word = ccui.helper.seekWidgetByName(this.root,"image_title_word");
      var image_title_bg = ccui.helper.seekWidgetByName(this.root,"image_title_bg");
      var btn_back = ccui.helper.seekWidgetByName(this.root,"btn_back");
      btn_back.addClickEventListener(function () {
        whmajhong.net.leavePrivateTable(1,function (data) {
          JJLog.print('End report leave table resp');
          var majHall = new MajhongHall();
          majHall.showHall();
        });
      });

      var baseScore = -1
      if (!!data && !!data["baseScore"]) {
        baseScore = parseFloat(data["baseScore"]);
      }
      if (baseScore == -1) {
        baseScore = basecashdata.curBaseCash
      }

      var txtBaseCash = ccui.helper.seekWidgetByName(this.root,"text_dijin_name");
      txtBaseCash.setString(basecashdata.getBaseCashDesc(baseScore));

      var btn_share = ccui.helper.seekWidgetByName(this.root,"btn_share");
      btn_share.addClickEventListener(function () {
          hall.net.wxShareScreen(0);
      });
      if(hall.songshen == 1)
      {
        btn_share.setVisible(false);
      }
      var text_room_id = ccui.helper.seekWidgetByName(this.root,"text_room_id");
      var text_room_info = ccui.helper.seekWidgetByName(this.root,"text_room_info");
      var text_room_time = ccui.helper.seekWidgetByName(this.root,"text_room_time");
      var text_forbidden = ccui.helper.seekWidgetByName(this.root,"text_forbidden");
      // var version = util.getCacheItem('hotVersion');
      // if (version == null || version == "" || version == undefined)
      // {
      //   version = hall.curVersion;
      // }
      var text_version = ccui.helper.seekWidgetByName(this.root,"text_version");
      text_version.setString("Version: " + hall.curVersion);

      this.listview_result = ccui.helper.seekWidgetByName(this.root,"listview_result");

      this.panel_cell = ccui.helper.seekWidgetByName(this.root,"panel_cell");
      this.panel_cell.setVisible(false);

      text_room_id.setString('房号:'+whmajhong.table.roomId);
      text_room_id.setVisible(true);
      text_room_info.setString('局数:'+whmajhong.table.roundTotal);
      text_room_info.setVisible(true);

      var date = new Date();
      var timeStr = '';
      var month = date.getMonth();
      month += 1;
      timeStr += month < 10? '0'+month+'-':month+'-';
      var day = date.getDate();
      timeStr += day < 10? '0'+day+' ':day+' ';
      var hour = date.getHours();
      timeStr += hour < 10? '0'+hour+':':hour+':';
      var minute = date.getMinutes();
      timeStr += minute < 10? '0'+minute+':':minute+':';
      var sec = date.getSeconds();
      timeStr += sec < 10? '0'+sec :sec
      ;
      text_room_time.setString(timeStr);
      text_room_time.setVisible(true);


    },

    initList: function () {

      var data = this.data;
      JJLog.print(JSON.stringify(data));

      this.listview_result.removeAllChildren();
      var playerArray = data['players'];
      JJLog.print(playerArray.length);

      var winner_id = -1;
      var paoer_id = -1;
      var owner_id = -1;
      var baseCash = 1;//底金
      if(data['bigWiner'] != undefined) winner_id = data['bigWiner'];
      if(data['fangZhu'] != undefined) owner_id = data['fangZhu'];
      if(data['paoShou'] != undefined) paoer_id = data['paoShou'];
      if(data['baseScore'] != undefined) baseCash = data['baseScore'];

      for(var i = 0; i < playerArray.length;i++)
      {
        var info = playerArray[i];
        var id = info['uid'];
        var cell = this.panel_cell.clone();
        var layout = new ccui.Layout();
        layout.setContentSize(cell.getContentSize());
        layout.addChild(cell);
        var text_name = ccui.helper.seekWidgetByName(cell,"text_name");
        var name = base64.decode(info['nickName']);
        if(name.length > 10)
        {
          name = name.slice(0,10);
        }
        text_name.setString(name);
        JJLog.print(info['nickName']);

        var sprite_head = ccui.helper.seekWidgetByName(cell,"image_head");
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

        var text_id = ccui.helper.seekWidgetByName(cell,"text_id");
        text_id.setString('ID:'+info['uid']);

        var text_dahu_zimo = ccui.helper.seekWidgetByName(cell,"text_dahu_zimo");
        text_dahu_zimo.setString('大胡放炮   '+ (info['dahuPao']));
        var text_xiaohu_zimo = ccui.helper.seekWidgetByName(cell,"text_xiaohu_zimo");
        text_xiaohu_zimo.setString('小胡放炮   '+ (info['xiaoHuPao']));
        var text_dahu_dianpao = ccui.helper.seekWidgetByName(cell,"text_dahu_dianpao");
        text_dahu_dianpao. setString('大胡自摸   '+ (info['zimoBigCount']));
        var text_xiaohu_dianpao = ccui.helper.seekWidgetByName(cell,"text_xiaohu_dianpao");
        text_xiaohu_dianpao.setString('小胡自摸   '+info['zimoSmallCount']);
        var text_daohu_jiepao = ccui.helper.seekWidgetByName(cell,"text_daohu_jiepao");
        text_daohu_jiepao.setString('大胡次数   '+info['dahuCount']);
        var text_xiaohu_jiepao = ccui.helper.seekWidgetByName(cell,"text_xiaohu_jiepao");
        text_xiaohu_jiepao.setString('小胡次数   '+info['xiaoHuCount']);
        var text_score = ccui.helper.seekWidgetByName(cell,"text_score");
//        text_score.setTextColor(color);
        var winScore = parseInt(info['coinNum']) * baseCash;
        winScore = winScore.toFixed(1);
        text_score.setString(winScore);

        var image_paoer = ccui.helper.seekWidgetByName(cell,"image_paoer");
        image_paoer.setVisible(false);
        var image_winner = ccui.helper.seekWidgetByName(cell,"image_winner");
        image_winner.setVisible(false);
        var image_owner = ccui.helper.seekWidgetByName(cell,"image_owner");
        image_owner.setVisible(false);
        if(id == paoer_id) image_paoer.setVisible(true);
        if(id == owner_id) image_owner.setVisible(true);
        if(id == winner_id) image_winner.setVisible(true);

        cell.x = 0;
        cell.y = 0;
        cell.setVisible(true);
        if(id == owner_id)
        {
          this.listview_result.insertCustomItem(layout,0);
        }else
        {
          this.listview_result.pushBackCustomItem(layout);
        }


      }
      whmajhong.table.report = {};
    },

    onEnter: function () {
      this._super();
      this.initList();
      sound.stopBgSound();
      sound.stopEffect();
    },

    onExit: function() {
      this._super();
      this.image_head_deinit = true;
    },

  showGameResult: function () {
    var scene = new cc.Scene();
    scene.addChild(this);
    if(cc.sys.isNative)
    {
      cc.director.replaceScene(scene);
    }else
    {
      cc.director.runScene(scene);
    }
  }
});
