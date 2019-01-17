/**
 * Created by atom on 2016/11/1.
 */
var MajhongOtherRoomPanel = cc.Layer.extend({
    listview_session:null,
    btn_back:null,
    panel_session_cell:null,
    text_gotoplay:null,
    listArry:null,

    ctor:function()
    {
      this._super();
      var JsonRes = GameHallJson.OtherRoom;
      if(GAMENAME =='qidong')
      {
        JsonRes = QDMajhongJson.OtherRoom
      }
      var root = ccs.load(JsonRes).node;
      this.addChild(root);

      this.listArry = new Array();

      this.listview_session = ccui.helper.seekWidgetByName(root,"listview_session");
      this.btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
      this.btn_back.addClickEventListener(function () {
        this.removeFromParent();
      }.bind(this));

      this.panel_session_cell = ccui.helper.seekWidgetByName(root,"panel_session_cell");
      this.text_gotoplay = ccui.helper.seekWidgetByName(root,"text_gotoplay");
      this.text_gotoplay.setVisible(false);
      this.panel_session_cell.setVisible(false);

      //if(GAMENAME == "shisanshui")
      //{
      //  var btn_history= ccui.helper.seekWidgetByName(root,"btn_history");
      //  btn_history.addClickEventListener(function () {
      //    var history = new MajhongOtherRoomHistory();
      //    history.showHistory();
      //    this.removeFromParent();
      //  }.bind(this));
      //  btn_history.setVisible(true);
      //}
      var btn_history= ccui.helper.seekWidgetByName(root,"btn_history");
      btn_history.addClickEventListener(function () {
        var history = new MajhongOtherRoomHistory();
        history.showHistory();
        this.removeFromParent();
      }.bind(this));
      btn_history.setVisible(true);
    },

    onEnter: function () {
      this._super();

      this.showListSession();
    },

    showListSession: function () {

      this.listview_session.setVisible(true);
      var _this = this;

      hall.net.reCreateTables({'uid':hall.user.uid},function(data) {
        JJLog.print('获取代开房间列表!=' + JSON.stringify(data));
        if(data['code'] == 200)
        {
          _this.listArry.splice(0, _this.listArry.length);
          // JJLog.print(JSON.stringify(data));
          var roomList = data['reTables'];
          _this.text_gotoplay.setVisible(roomList.length == 0);
          for(var i = 0 ; i < roomList.length;i++)
          {
            var cellData = roomList[i];
            var fanghao = cellData['tableId'];
            var person = cellData['playerCount'];
            var wanfa = cellData['tableType'];
            if(wanfa!= null && wanfa.indexOf("qidong") != -1)
            {
              cellData['person']= 4;
            }

            var cell = _this.panel_session_cell.clone();
            cell.setTouchEnabled(true);

            var layout = new ccui.Layout();
            layout.setContentSize(cell.getContentSize());
            layout.addChild(cell);

            layout.roomid = cellData['tableId'];

            var text_room_id = ccui.helper.seekWidgetByName(cell,"text_room_id");
            text_room_id.setString(fanghao);
            var text_room_person = ccui.helper.seekWidgetByName(cell,"text_room_person");
            text_room_person.setString(person +"/" + cellData['person']);
            var text_room_wanfa = ccui.helper.seekWidgetByName(cell,"text_room_wanfa");

            var text_room_other = ccui.helper.seekWidgetByName(cell,"text_room_other");

            text_room_wanfa.setString(GAMENAMES[wanfa]);
            var desc = "";
            if(wanfa == "quanzhou")
            {
              desc = _this.getTableDes(cellData);
            }else if(wanfa == "yongchun")
            {
              desc = _this.getYCTableDes(cellData);
            }
            else if(wanfa == "shisanshui")
            {
              desc = _this.getSSSTableDes(cellData);
              if(GAMENAME == "xyshisanshui")
              {
                text_room_wanfa.setString(_this.getXYSSSTableTitle(cellData));
                cellData["gameName"] =_this.getXYSSSTableTitle(cellData);
              }else
              {
                text_room_wanfa.setString(_this.getSSSTableTitle(cellData));
                cellData["gameName"] =_this.getSSSTableTitle(cellData);
              }

            }else if(wanfa == "qidongbd")
            {
              desc = _this.getBDTableDes(cellData);

            }else if(wanfa == "qidong")
            {
              desc = _this.getQDTableDes(cellData);

            }
            text_room_other.setString(desc);

            var btn_inwaite = ccui.helper.seekWidgetByName(cell,"btn_inwaite");

            var inviteData =cellData;
            btn_inwaite.addClickEventListener(function () {
              JJLog.print('click it');
              var tmpData = this;
              if(tmpData["tableType"]=="quanzhou")
              {
                _this.onInvite(tmpData);
              }else if(tmpData["tableType"]=="yongchun")
              {
                _this.onYCInvite(tmpData);
              }
              else if(tmpData["tableType"]=="shisanshui")
              {
                _this.onSSSInvite(tmpData);
              }
              else if(tmpData["tableType"]=="qidongbd")
              {
                _this.onBDInvite(tmpData);
              }
              else if(tmpData["tableType"]=="qidong")
              {
                _this.onQDInvite(tmpData);
              }
            }.bind(inviteData));

            var btn_dissolve = ccui.helper.seekWidgetByName(cell,"btn_dissolve");

            var deledeData =cellData;
            btn_dissolve.addClickEventListener(function () {
              var tmpData = this;
              _this.ondeleteRoom(tmpData);
            }.bind(deledeData));

            if(!cc.sys.isNative) {
              var color = {r: 135, g: 82, b: 54};
              text_room_id.setTextColor(color);
              text_room_person.setTextColor(color);
              text_room_other.setTextColor(color);
              text_room_wanfa.setTextColor(color);
            }
            cell.x = 0;
            cell.y = 0;
            cell.setVisible(true);

            _this.listArry.push(layout);
            _this.listview_session.pushBackCustomItem(layout);
          }
        }

      });
    },




  ondeleteRoom: function (data) {

    var _this =this;

    var temp = {};
    temp['tableId'] =data['tableId'];

    hall.deleteRePrivate(GAMETYPES[data["tableType"]],temp,function(data){
      JJLog.print('删除房间回调!=' + JSON.stringify(data));
      if(data["code"]== 200)
      {
        _this.removefromlist(temp['tableId']);
      }else
      {
        var dialog = new JJConfirmDialog();
        dialog.setDes(data['error']);
        dialog.showDialog();
      }
    });

  },

  onInvite: function (data) {
    var desc =this.getTableDes(data) ;
    JJLog.print('邀请房号=' + data['tableId']  +'描述=' + desc);
    hall.net.wxShareURL('泉州麻将,房号:'+ data['tableId'] , desc, 0);
  },


  onYCInvite: function (data) {
    var desc = this.getYCTableDes(data) ;
    hall.net.wxShareURL('永春麻将,房号:'+ data['tableId'] , desc, 0);
  },

  onSSSInvite: function (data) {
    var desc = this.getSSSTableDes(data) ;
    hall.wxEnterRoom = data['tableId'];
    if(data["gameName"]!= null && data["gameName"]!= undefined)
        desc ="代开:"+data["gameName"]+" "+desc;
    JJLog.print(JSON.stringify(desc));
    hall.net.wxShareURL(PackageNames[GAMENAME]+',房号:'+ data['tableId'] , desc, 0);
  },
  onBDInvite: function (data) {
    var desc = this.getBDTableDes(data) ;
    hall.wxEnterRoom = data['tableId'];
    hall.net.wxShareURL('启东百搭'+',房号:'+ data['tableId'] , desc, 0);
  },
  onQDInvite: function (data) {
    var desc = this.getQDTableDes(data) ;
    hall.wxEnterRoom = data['tableId'];
    hall.net.wxShareURL('启东敲麻'+',房号:'+ data['tableId'] , desc, 0);
  },
  removefromlist:function(roomid)
  {
    for(var i=0;i< this.listArry.length;i++)
    {
      if(roomid == this.listArry[i].roomid)
      {
        this.listArry[i].removeFromParent();
        this.listArry.splice(i, 1);
        break;
      }
    }
  },


  getTableDes:function (data) {
    var str = '';
    if(data['oneKe'] > 0 )
    {
      str = '1课 ';

    }else
    {
      str = data['rounds']+'局(4倍积分) ';
    }

    str += data['person']+"人 ";


    str +='游金X'+ data['youJin'];


    if(data['jinTwo']> 0)
    {
      str +=' 双金不平胡';
    }

    return str;
  },

  getYCTableDes:function (data) {
    var str = data['rounds']+'局 ';
    str += data['person']+"人 ";
    if(data['isPlayType'] == 1)
    {
      str +='三游场';
    }else
    {
      str +='五游场';
    }
    return str;
  },

  getXYSSSTableTitle:function(data){
    var str = '';
    var ishavebanker =data['banker'];
    var area = data['area'];
    if(area == "sx")
    {
      str = "罗松十三道";
    }else if(area == "nb")
    {
      str = "宁波十三道";
    }else
    {
      if(ishavebanker == 1)
      {
        str = "坐庄十三水";
      }else
      {
        str = "经典十三水";
      }
    }
    return str;
  },

  getSSSTableTitle:function(data)
  {
    var desc = '';
    var ishavebanker =data['banker'];
    var wanfa = data['wanFa'];
    var wang = data['wang'];

    if (ishavebanker > 0)
    {
      desc = '坐庄十三水';
    }else
    {
      if(wanfa == 0)
        desc = "经典十三水";
      else if(wanfa == 4)
      {
        desc = "加一色十三水";
      }
      else if(wanfa == 1)
      {
        desc = "加三张十三水";
      }
      else if(wanfa == 2)
      {
        desc = "减一色十三水";
      }else
      {
        desc = "全一色十三水";
      }
      if(wang > 0)
      {
        desc = "百变十三水";
      }
    }

    return desc;

  },
  getSSSTableDes:function (data) {
    var str = '';

    var person = data['person'];
    var duose = data['duose'];
    var aaGem  = data['aaGem'];
    var mode = data['mode'];
    var isMa = data['isMa'];
    var ishavebanker =data['banker'];
    var bei = data['bei'];
    var wanfa = data['wanFa'];
    var wang = data['wang'];
    var chongSan = data['chongSan'];

    str += data['person']+"人 ";

    str += data['rounds']+'局 ';

    if(wang > 0)
      str += '百变'+wang+"张 ";

    if (ishavebanker > 0 || wang>0)
    {
      if(wanfa == 1)
      {
        str += '加三张 ';
      }else if(wanfa == 2)
      {
        str += '减一色 ';
      }else if(wanfa == 4)
      {
        str += '加一色 ';
      }

      if(bei > 0 && ishavebanker > 0)
      {
        str +=  bei +'倍 ';
      }
    }

    if(mode == 1)
    {
      str += '打枪加1';
    }else
    {
      str += '打枪'+mode+"倍";
    }

    if(isMa > 0 )
    {
      var maPaiId = data["maPai"].type +"" + data["maPai"].value;
      str += ' 马牌('+SSSPoker.PokerPaiImage.paiName[maPaiId]+')';
    }

    if(chongSan == 1)
      str += " 冲三";

    return str;
  },

  getQDTableDes:function (data) {
    var str = data['rounds']+'局 ';
    if(data['jia'] == 1)
    {
      str +='嵌张 ';
    }
    if(data['diScore'] == 1)
    {
      str +='底花X1 ';
    }
    if(data['niao'] == 1)
    {
      str +='飞苍蝇X1 ';
    }
    if(data['isQiDui'] == 1)
    {
      str +='七对胡 ';
    }
      str += "代支付";
    return str;
  },

  getBDTableDes:function (data) {
    var str = data['rounds']+'局 ';
    str += data['laZi']+"番 ";
    if(data['isSBL'] == 1)
    {
      str +='双百佬 ';
    }else
    {
      str +='单百佬 ';
    }
    if(data['isMaiZhuang"'] == 1)
    {
      str +='买庄 ';
    }
    if(data['isHuangDaoDi'] == 1)
    {
      str +='一荒到底 ';
    }
    if(data['isQiDui'] == 1)
    {
      str +='七对胡 ';
    }
      str += "代支付";
    return str
  },

    showPanel:function()
    {
      cc.director.getRunningScene().addChild(this,1000);
    }


});

var MajhongOtherRoomHistory = cc.Layer.extend({
  listview_session:null,
  listview_round:null,
  btn_back:null,
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
    var JsonRes = GameHallJson.OtherRoomHistory;
    if(GAMENAME =='qidong')
    {
      JsonRes = QDMajhongJson.OtherRoomHistory
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


  showListRound: function (roundData) {
    this.panel_list.setVisible(false);
    this.panel_round.setVisible(true);
    this.listview_round.removeAllChildren();
    this.listview_round.setVisible(true);
    this.listview_session.setVisible(false);
    var resultList = roundData['data'];
    var serverType = roundData['serverType'];
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
                  hall.enterRecord(GAMETYPES[data['serverType']],data['record']);
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
      for(var j = 0;j < values.length;j++)
      {
        var text_players = ccui.helper.seekWidgetByName(cell,"text_player"+j);
        text_players.setString(base64.decode(values[j]['userName']));
        text_players.setVisible(true);
        var score = ccui.helper.seekWidgetByName(cell,"text_score"+j);
        score.setString(values[j]['winScore']);
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
    hall.net.reCreateTables({'uid':hall.user.uid,type:2},function (data) {
      JJLog.print('get record!' + JSON.stringify(data));
      var recordList = data['record'];
      _this.text_gotoplay.setVisible(recordList.length == 0);
      for(var i = 0 ; i < recordList.length;i++)
      {
        var cellData = recordList[i];
        var fanghao = cellData['fangHao'];
        var id = cellData['id'];

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
          _this.showListRound(this);
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

        for(var j = 0; j < resultArr.length;j++)
        {
          var text_player = ccui.helper.seekWidgetByName(cell,"text_player"+j);
          var text_score = ccui.helper.seekWidgetByName(cell,"text_score"+j);
          var img_scores =  ccui.helper.seekWidgetByName(cell,"img_scores"+j);
          if(img_scores != null)
          {
            img_scores.setVisible(true);
          }
          text_player.setString(base64.decode(resultArr[j]['nickName']));
          text_score.setString(resultArr[j]['coinNum']);
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
    cc.director.getRunningScene().addChild(this,1000);
  },
});
