/**
 * Created by atom on 2016/11/1.
 */
var MajhongHistory = cc.Layer.extend({
  listview_session:null,
  listview_round:null,
  btn_back:null,
  btn_view_others:null,
  panel_session_cell:null,
  panel_round_cell:null,
  panel_list:null,
  panel_round:null,
  loaded:false,
  text_gotoplay:null,
  panel_sss_session_cell:null,
  panel_sss_round_cell:null,
  ctor:function()
  {
    this._super();
    var JsonRes = GameHallJson.Histrory;
    if(GAMENAME =='qidong')
    {
      JsonRes = QDMajhongJson.Histrory
    }
    var root = ccs.load(JsonRes).node;
    this.addChild(root);
    this.panel_list = ccui.helper.seekWidgetByName(root,"panel_list");
    this.panel_list.setVisible(true);
    this.panel_round = ccui.helper.seekWidgetByName(root,"panel_round");
    this.panel_round.setVisible(false);
    this.listview_session = ccui.helper.seekWidgetByName(root,"listview_session");
    this.listview_round = ccui.helper.seekWidgetByName(root,"listview_round");
    this.listview_round.setVisible(false);
    this.btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
    this.btn_back.addClickEventListener(function () {
      if(this.listview_round.isVisible())
      {
        this.showListSession();
      }else
      {
        this.removeFromParent();
      }


    }.bind(this));
    this.btn_view_others = ccui.helper.seekWidgetByName(root,"btn_view_others");
    this.btn_view_others.addClickEventListener(function () {
      var dialog = new JJCheckRecord();
      dialog.showDialog();
    }.bind(this));

    if(GAMENAME.indexOf("shisanshui") != -1)
    {
      this.btn_view_others.setVisible(false);
    }



    this.panel_session_cell = ccui.helper.seekWidgetByName(root,"panel_session_cell");
    this.panel_round_cell = ccui.helper.seekWidgetByName(root,"panel_round_cell");
    this.text_gotoplay = ccui.helper.seekWidgetByName(root,"text_gotoplay");
    this.text_gotoplay.setVisible(false);
    this.panel_round_cell.setVisible(false);
    this.panel_session_cell.setVisible(false);
    //十三水
    this.panel_sss_session_cell = ccui.helper.seekWidgetByName(root,"panel_sss_session_cell");
    this.panel_sss_round_cell = ccui.helper.seekWidgetByName(root,"panel_sss_round_cell");
    this.panel_sss_session_cell.setVisible(false);
    this.panel_sss_round_cell.setVisible(false);

    var text_tip = ccui.helper.seekWidgetByName(root,"text_tip");
    text_tip.setString('提醒:保存最近三天的录像');

  },

  onEnter: function () {
    this._super();

    this.showListSession();
  },


  showListRound: function (roundData,baseScore) {
    this.panel_list.setVisible(false);
    this.panel_round.setVisible(true);
    this.listview_round.removeAllChildren();
    this.listview_round.setVisible(true);
    this.listview_session.setVisible(false);
    var resultList = roundData['data'];
    var serverType = roundData['serverType'];
    JJLog.print("单个回放="+ JSON.stringify(roundData));
    for(var i = 0;i<resultList.length;i++)
    {
      var result = resultList[i];
      var cell = null;
      if(serverType == 'shisanshui' || serverType == "")
      {
        cell = this.panel_sss_round_cell.clone();
      }else
      {
        cell = this.panel_round_cell.clone();
        var btn_view =  ccui.helper.seekWidgetByName(cell,"btn_view");
        var btn_share =  ccui.helper.seekWidgetByName(cell,"btn_share");

        var info = {};
        info['recordId'] = result['num'];
        btn_share.addClickEventListener(function () {
          var recordId = this['recordId'];
          hall.net.wxShareURL(GAMENAMES[serverType],'玩家['+base64.decode(hall.user.nickName) + ']分享了一个回访码:'+recordId+'在大厅点击进入战绩页面然后点击查看他人回放输入回访码.', 0);

        }.bind(info));
        btn_view.addClickEventListener(function () {

          MajhongLoading.show('加载中...');
          var recordId = this['recordId'];
          hall.net.getHuiFangInfo(recordId,
              function(data)
              {
                JJLog.print("回放数据="+ JSON.stringify(data));
                if(data['code'] == 200)
                {
                  hall.enterRecord(GAMETYPES[data['serverType']],data['record']); //GAMETYPES[data['serverType']]
                }else{
                  MajhongLoading.dismiss();
                  var dialog = new JJConfirmDialog();
                  dialog.setDes(data['err']);
                  dialog.showDialog();
                }

              });

        }.bind(info));
      }
      var layout = new ccui.Layout();
      layout.setContentSize(cell.getContentSize());
      layout.addChild(cell);

      var text_id =  ccui.helper.seekWidgetByName(cell,"text_order");
      text_id.setString(i+1);
      var text_time =  ccui.helper.seekWidgetByName(cell,"text_room_time");
      text_time.setString(result['time']);

      var values = result['result'];
      //战绩字符串截取
      for(var j = 0;j < values.length;j++)
      {
        var text_players = ccui.helper.seekWidgetByName(cell,"text_player"+j);
        text_players.setString(base64.decode(values[j]['userName']).substring(0,6));
        text_players.setVisible(true);
        var winScore = values[j]['winScore']
        winScore = baseScore * winScore
        winScore = winScore.toFixed(1)
        var score = ccui.helper.seekWidgetByName(cell,"text_score"+j);
        score.setString(winScore);
        score.setVisible(true);
        var img_scores =  ccui.helper.seekWidgetByName(cell,"img_scores"+j);
        if(img_scores != null)
        {
          img_scores.setVisible(true);
        }
      }

      if(values.length > 6)
      {
        var panel_content = ccui.helper.seekWidgetByName(cell,"panel_content");
        panel_content.setScale(0.8);
      }

      cell.x = 0;
      cell.y = 0;
      cell.setVisible(true);

      this.listview_round.pushBackCustomItem(layout);
    }

  },

  showListSession: function () {
    this.panel_list.setVisible(true);
    this.panel_round.setVisible(false);
    this.listview_round.setVisible(false);
    this.listview_session.setVisible(true);
    var _this = this;
    if(this.loaded) return;
    hall.net.getHuiFangList(function(data) {
      JJLog.print('get record!');
      var recordList = data['record'];      
      JJLog.print("回放="+ JSON.stringify(data));
      _this.text_gotoplay.setVisible(recordList.length == 0);
      for(var i = 0 ; i < recordList.length;i++)
      {
        var cellData = recordList[i];
        var fanghao = cellData['fangHao'];
        var id = cellData['id'];
        var baseScore = cellData['baseScore'];

        var resultArr = cellData['lastResult'];
        var cell = null;
        if(cellData["serverType"] == "shisanshui" || cellData["serverType"] == "")
        {
          cell = _this.panel_sss_session_cell.clone();
        }else
        {
          cell = _this.panel_session_cell.clone();
        }
        cell.setTouchEnabled(true);
        var childData ={};
        childData['data'] = cellData['record'];
        childData['serverType'] = cellData['serverType'];
        cell.addClickEventListener(function () {
          _this.showListRound(this,baseScore);
        }.bind(childData));

        var layout = new ccui.Layout();
        layout.setContentSize(cell.getContentSize());
        layout.addChild(cell);
        var text_order = ccui.helper.seekWidgetByName(cell,"text_order");
        text_order.setString(i+1);
        var text_room_id = ccui.helper.seekWidgetByName(cell,"text_room_id");
        text_room_id.setString(fanghao);
        var text_gameName = ccui.helper.seekWidgetByName(cell,"text_gameName");
        text_gameName.setString(GAMENAMES[cellData["serverType"]]);
        var text_room_time = ccui.helper.seekWidgetByName(cell,"text_room_time");
        text_room_time.setString(cellData['recordTime']);
        //战绩里回放字符串截取
        for(var j = 0; j < resultArr.length;j++)
        {
          var text_player = ccui.helper.seekWidgetByName(cell,"text_player"+j);
          var text_score = ccui.helper.seekWidgetByName(cell,"text_score"+j);
          var img_scores =  ccui.helper.seekWidgetByName(cell,"img_scores"+j);
          if(img_scores != null)
          {
            img_scores.setVisible(true);
          }
          text_player.setString(base64.decode(resultArr[j]['nickName']).substring(0,6));

          var coinNum = resultArr[j]['coinNum']
          coinNum = (coinNum * baseScore).toFixed(1)

          text_score.setString(coinNum);
          text_score.setVisible(true);
          text_player.setVisible(true);

        }
        if(resultArr.length > 6)
        {
          var panel_content = ccui.helper.seekWidgetByName(cell,"panel_content");
          panel_content.setScale(0.75);
        }

        cell.x = 0;
        cell.y = 0;
        cell.setVisible(true);

        _this.listview_session.pushBackCustomItem(layout);
      }
      _this.loaded = true;
    });
  },

  showHistory:function()
  {
    cc.director.getRunningScene().addChild(this);
  },
});