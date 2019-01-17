/**
 * Created by atom on 2016/11/6.
 */
whmajhong.Record = cc.Class.extend({
        recordId:0,
        handCardsArr:[],
        playerInfoArr:[],
        chairArr:[],
        posArr:[],
        stepsArr:[],
        dirArr:{},
        SELF:'self',
        RIGHT:'right',
        UP:'up',
        LEFT:'left',
        selfHandCards:{},
        rightHandCards:{},
        upHandCards:{},
        leftHandCards:{},
        JinPaiId:null,
        PiziId1:null,
        PiziId2:null,
        PiziId3:null,

        totalrounds:8,
        yuanlaifan : 0,
        fenglaifan :1,
        yijiufan :0,
        lianjinfan :0,
        aaGem:0,

        stepNow:1,
        stepAll:1,
        playStatus:1,
        ctor: function (data) {
            MajhongInfo.MajhongNumber = data['mjNumber'] || 14;
            this.recordId = data['num'];
            this.posArr = data['position'];
            this.stepsArr = data['step'];
            this.JinPaiId = data["pizi"]["laiZi"].type + data["pizi"]["laiZi"].value;
            this.PiziId1 = data["pizi"]["p1"].type + data["pizi"]["p1"].value;
            this.PiziId2 = data["pizi"]["p2"].type + data["pizi"]["p2"].value;
            this.PiziId3 = data["pizi"]["p3"].type + data["pizi"]["p3"].value;
            this.stepAll = this.stepsArr.length;
            this.totalrounds = data['roundsTotal'];
            this.yuanlaifan = data['yuanLaiFan'];
            this.fenglaifan = data['fengLaiFan'];
            this.yijiufan = data['yiJiuLaiFan'];
            this.lianjinfan = data['lianJinFan'];
            this.aaGem = data['aaGem'];
            this.initDirArr(data);
            this.initPlayerInfo(data);
            this.initHandCards(data);
        },

        initDirArr:function(data)
        {
          var owerID = data['fangZhu'];
          for(var i = 0;i < this.posArr.length;i++)
          {
            var uid = this.posArr[i];
            if(uid == owerID)
            {
              this.dirArr[this.SELF] = i;
            }
          }

          this.dirArr[this.RIGHT] = this.dirArr[this.SELF] < 3 ? this.dirArr[this.SELF]+1 : 0;
          this.dirArr[this.UP] = this.dirArr[this.SELF] < 2 ? this.dirArr[this.SELF]+2 : this.dirArr[this.SELF]-2;
          this.dirArr[this.LEFT] = this.dirArr[this.SELF]  > 0 ? this.dirArr[this.SELF] -1 : 3;
        },

        initPlayerInfo:function(data)
        {
              for(var j=0;j<data['players'].length;j++)
              {
                var uid = Number(data['players'][j]['uid']);

                switch (uid)
                {
                  case this.posArr[this.dirArr[this.SELF]]:
                  {
                    this.playerInfoArr[0] = data['players'][j];
                  }
                    break;
                  case this.posArr[this.dirArr[this.RIGHT]]:
                  {
                    this.playerInfoArr[1] = data['players'][j];
                  }
                    break;
                  case this.posArr[this.dirArr[this.UP]]:
                  {
                    this.playerInfoArr[2] = data['players'][j];
                  }
                    break;
                  case this.posArr[this.dirArr[this.LEFT]]:
                  {
                    this.playerInfoArr[3] = data['players'][j];
                  }
                    break;
                  default :
                    break;
                }
              }
        },

        initHandCards:function(data)
        {
          var cards = data['playerPai'];
          for(var i = 0;i < cards.length;i++)
          {
            var uid = cards[i]['uid'];
            cards[i]['paiQi']['uid'] = uid;
            switch (uid)
            {
              case this.posArr[this.dirArr[this.SELF]]:
              {
                this.selfHandCards = cards[i]['paiQi'];

              }
                break;
              case this.posArr[this.dirArr[this.RIGHT]]:
              {
                this.rightHandCards = cards[i]['paiQi'];
              }
                break;
              case this.posArr[this.dirArr[this.UP]]:
              {
                this.upHandCards = cards[i]['paiQi'];
              }
                break;
              case this.posArr[this.dirArr[this.LEFT]]:
              {
                this.leftHandCards = cards[i]['paiQi'];
              }
                break;
              default :
                break;
            }
          }
        },

        indexOfStep: function () {
          return this.stepsArr[this.stepNow];
        },



        postStep: function () {
          if(this.playStatus == RecordStatus.PAUSE || this.stepNow >= this.stepsArr.length) return;
          var event = new cc.EventCustom(CommonEvent.EVT_RECORD);
          var data = this.indexOfStep();
          JJLog.print('step = '+this.stepNow);
          JJLog.print(JSON.stringify(data));
          event.setUserData(data);
          cc.eventManager.dispatchEvent(event);
        },

        setPlayStatus: function (status) {
          this.playStatus = status;
          if(this.playStatus == RecordStatus.PLAY)
          {
            this.postStep();
          }
        },

        postNextStep: function () {
          this.stepNow++;
          var event = new cc.EventCustom(CommonEvent.EVT_RECORD_NEXT_STEP);
          //var data = this.indexOfStep();
          event.setUserData(this.stepNow);
          cc.eventManager.dispatchEvent(event);
        },

    getTableDes:function () {

        var desc = this.totalrounds  +'局';
        if(this.yuanlaifan > 0 )
        {
            desc += ' 原赖翻番';

        }
        if(this.fenglaifan > 0)
        {
            desc += ' 风赖翻番';
        }
        if(this.yijiufan > 0)
        {
            desc += ' 一九赖翻番';
        }
        if(this.lianjinfan > 0)
        {
            desc += ' 连金翻番';
        }
        if(this.aaGem > 0)
        {
            desc += ' AA支付';
        }else
        {
            desc += ' 房主支付';
        }
        return desc;
    },

});