/**
 * Created by atom on 16/1/8.
 * 通知
 */

var MajhongNotice = cc.Layer.extend({
  panel_msg:null,
  textArray:null,
  rollSpeed:40,
  fontSize:24,
  scrollTimes:0,
  msgArr:[],
  msgIndex:0,
  exitFlag: false,
  lastedIndex:0,
  isGaming:false,
  ctor: function (isInGame) {
    this._super();
    var Json = GameHallJson.Notice;
    if(GAMENAME =='qidong')
    {
      Json = QDMajhongJson.Notice;
      this.setRollSpeed(100);
    }
    var root = ccs.load(Json).node;
    this.addChild(root);
    this.panel_msg = ccui.helper.seekWidgetByName(root,"panel_msg");
    this.textArray = new Array();

    this.msgArr[0] = '测试的第一句话,不是那么长的一句话！';
    this.msgArr[1] = '测试的第二句话,有点短的一句话';
    this.msgArr[2] = '我们祖国我们爱你';
    this.msgArr[3] = '今天整理图片，晚上出个一张图大预览吧';
    this.msgArr[4] = '金雕CR500察打一体无人直升机，是中国兵器集团北方工业公司研制的最新型无人攻击直升机。';
    if(isInGame == true)
    {
      this.isGaming = true;
    }
  },

  onEnter:function()
  {
    this._super();
    if(this.isGaming)
    {
      var _this = this;
      qp.event.listen(this, 'hallTempNotify', function(data) {
        _this.setVisible(true);
        _this.scrollTimes = 0;
        var msg = data['hallTempNotify']['contents'];
        this.addMsg(msg);
      });
      this.scheduleOnce(this.rescrollMsg,2);

      qp.event.listen(this, 'hallMessageNotify', function(data) {
        var text = data['hallMessageNotify']['contents'];
        var msg  = {};
        msg['userName'] = '系统通知';
        msg['record'] = text;
        NoticeMsg.addMsg(msg);
      });

    }else
    {
      qp.event.listen(this, 'hallMessageNotify', function(data) {
        JJLog.print("hallMessageNotify");
        JJLog.print(data);
        var msg = data['hallMessageNotify']['contents'];
        this.addMsg(msg);
      });
      this.scheduleOnce(this.rescrollMsg,2);
    }
  },

  onExit:function()
  {
    if(this.isGaming)
    {
      qp.event.stop(this, 'hallTempNotify');
      qp.event.stop(this, 'hallMessageNotify');
    }
    else
    {
      qp.event.stop(this, 'hallMessageNotify');
    }
    this.scrollTimes = 0;
    this._super();
    this.exitFlag = true;
  },

  addMsg: function (text) {
    if (!text) {
      return;
    }
    var msg  = {};
    msg['userName'] = '系统通知';
    msg['record'] = text;
    this.pushMsg(msg);

    this.msgIndex++;
    if(this.msgIndex >= this.msgArr.length)
    {
      this.msgIndex = 0;
    }
  },

  pushMsg:function(jMsg)
  {
    if(this.isGaming)
    {
      NoticeMsg.addBoard(jMsg);
    }else
    {
      NoticeMsg.addMsg(jMsg);
    }


    if (this.exitFlag)
      return;

    if(this.textArray.length > 0)
    {
      this.runNextMaquee(jMsg);
    }else
    {
      this.setVisible(true);
      var pannelSize = this.panel_msg.getContentSize();
      this.runMarquee(jMsg,cc.p(pannelSize.width,0));
    }

  },

  runNextMaquee:function(msg)
  {
    var text = this.textArray[this.textArray.length -1];
    var textSize = text.getContentSize();
    var pos = text.getPosition();
    var pannelSize = this.panel_msg.getContentSize();

    if(pos.x + textSize.width < pannelSize.width) //在中间显示完全
    {
      this.runMarquee(msg,cc.p(pannelSize.width,0));
    }else if(pos.x + textSize.width >= pannelSize.width)//未显示完全
    {
      this.runMarquee(msg,cc.p(pos.x + textSize.width,0));
    }
  },

  runMarquee:function(msg,pos)
  {
    var _this = this;
    var name = new ccui.Text(msg["userName"]+":","Arial",24);
    name.setColor(cc.color.YELLOW);
    // name.setTouchScaleChangeEnabled(true);
    // name.setTouchEnabled(true);
    // name.addClickEventListener(this.showPlayer);
    var bMsg = new ccui.Text(msg["record"],"Arial",24);
    bMsg.setColor(cc.color.WHITE);

    var layout = new ccui.Layout();
    layout.setContentSize(cc.size(name.getContentSize().width+bMsg.getContentSize().width,name.getContentSize().height));
    layout.setAnchorPoint(0,0);
    layout.setPosition(pos);
    layout.addChild(name);
    layout.addChild(bMsg);
    name.setPosition(cc.p(name.getContentSize().width*0.5,name.getContentSize().height*0.5));
    bMsg.setPosition(cc.p(name.getContentSize().width+bMsg.getContentSize().width*0.5,name.getContentSize().height*0.5));

    var textSize = layout.getContentSize();
    this.panel_msg.addChild(layout,12);


    var pannelSize = this.panel_msg.getContentSize();
    var between = pos.x - pannelSize.width;
    var time1 = (between + textSize.width+pannelSize.width)/this.rollSpeed;

    var move1 = cc.moveTo(time1,cc.p(-textSize.width,pos.y));
    var clearAction = cc.callFunc(this.clearText,this);
    var removeSelf = cc.removeSelf(true);
    var seq = cc.sequence(move1,clearAction,removeSelf);
    //var seq = cc.sequence(move1,removeSelf);
    layout.runAction(seq);
    this.textArray.push(layout);

  },

  clearText:function()
  {
    if(this.textArray.length > 0)
    {
      this.textArray.splice(0,1);
      if(this.textArray.length == 0)
      {
        if(this.isGaming)
        {
          this.scrollTimes++;
          if(this.scrollTimes > 2)
          {
            this.scrollTimes = 0;
            this.setVisible(false);
          }else
          {
            this.scheduleOnce(this.rescrollMsg,2);
          }
        }else
        {
          this.scheduleOnce(this.rescrollMsg,2);
        }
      }else
      {
        JJLog.print("text wait next");
      }
    }
  },

  rescrollMsg:function(dt)
  {
    if(this.isGaming)
    {
      if(NoticeMsg.board.length <= 0 ) return;
      if(this.lastedIndex >= NoticeMsg.board ||this.lastedIndex >= NoticeMsg.size)
      {
        this.lastedIndex = 0;
      }
      this.pushMsg(NoticeMsg.getBoard(this.lastedIndex));
      this.lastedIndex++;
    }else
    {
      if(NoticeMsg.list.length <= 0 ) return;
      if(this.lastedIndex >= NoticeMsg.list ||this.lastedIndex >= NoticeMsg.size)
      {
        this.lastedIndex = 0;
      }
      this.pushMsg(NoticeMsg.getMsg(this.lastedIndex));
      this.lastedIndex++;
    }

  },


  setRollSpeed:function(jSpeed)
  {
    this.rollSpeed = jSpeed;
  },

  showPlayer:function()
  {
    JJLog.print("show name = "+this.getString());
  },






});
