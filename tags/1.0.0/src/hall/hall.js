var GAMENAME = "wuhan";

var GAMETYPES = {
    'quanzhou':'com.qp.hall.qzmajhong',
    'paodekuai':'com.qp.hall.pokerPDK',
    'yongchun':'com.qp.hall.majhongYC',
    'shisanshui':'com.qp.hall.pokerSSS',
    'xyshisanshui':'com.qp.hall.pokerSSS',
    'qidong':'com.qp.hall.majhongQD',
    'qidongbd':'com.qp.hall.majhongBD',
    'qidongljc':'com.qp.hall.majhongLJC',
    'xuezhan':'com.qp.hall.xuezhanmajhong',
    'wuhan':'com.qp.hall.majhongWH',
    'chizhou':'com.qp.hall.czmajhong',
    'douniu':'com.qp.hall.niuniu',
};

var GAMENAMES = {
    'quanzhou':'泉州麻将',
    'paodekuai':'跑得快',
    'yongchun':'永春麻将',
    'shisanshui':'十三水',
    'xyshisanshui':'闲娱十三水',
    'qidong':'启东敲麻',
    'qidongbd':'启东百搭',
    'qidongljc':'启东老韭菜',
    'xuezhan':'云南血战麻将',
    'wuhan':'红中赖子杠',
    'chizhou':'辣子麻将',
    'douniu':'牛牛',
};

var PackageNames = {
    'quanzhou':'乐8泉州麻将',
    'paodekuai':'跑得快',
    'yongchun':'乐8永春麻将',
    'shisanshui':'十三水',
    'xyshisanshui':'闲娱十三水',
    'qidong':'启东麻将',
    'qidongbd':'启东百搭',
    'xuezhan':'云南血战麻将',
    'wuhan':'红中赖子杠麻将',
};

var PackageShare = {
    'quanzhou':'好友约局，线上麻将，随时随地干一把！最正宗的泉州本土麻将！',
    'paodekuai':'好友约局，线上麻将，随时随地干一把！最正宗的泉州本土麻将！',
    'yongchun':'好友约局，线上麻将，随时随地干一把！最正宗的永春本土麻将！',
    'shisanshui':'好友约局，线上扑克，随时随地干一把！最正宗的十三水！',
    'xyshisanshui':'好友约局，线上扑克，随时随地干一把！最正宗的十三水！',
    'qidong':'好友约局，线上麻将，随时随地干一把！最正宗的启东麻将！',
    'qidongbd':'好友约局，线上麻将，随时随地干一把！最正宗的启东麻将！',
    'qidongljc':'好友约局，线上麻将，随时随地干一把！最正宗的启东老韭菜！',
    'xuezhan':'好友约局，线上麻将，随时随地干一把！最正宗的血战麻将！',
    'wuhan':'好友约局，线上麻将，随时随地干一把！最正宗的红中赖子杠麻将！',
};

var PackageAgentShare = {
    'shisanshui':'好友约局，线上扑克，随时随地干一把！最正宗的十三水！',
    'qidong':'畅玩姚记启东麻将，绑码即送10钻，充值返利优惠多多！',
};

var PackageAgentTYPE = {
    'shisanshui':'sss',
    'qidong':'qd',
};

var PackageURLTYPE =
{
    "xyshisanshui":"&t=shisanshui&s=sssxy",
    "shisanshui":"&t=shisanshui&s=sss",
    "qidong":"&t=qidong&s=qd",
}

var PackageURLPORT =
{
    "xyshisanshui":"3007",
    "shisanshui":"30060",
    "qidong":"30010",
    "yongchun":"3015",
    "wuhan":"30160"
}

var hall = {
  appId : 'com.qp.hall',
  curVersion : '1.0.0',
  distChannel : 'default',

  gameCfgs : [],
  gameEntries : [],
  inTableId:null,

  net : {},
  user : {},
  userNav:null,
  shopItems : [],

  inRoom : false,

  SPEAK_MSG_LENGTH:20,
  speakMsg:[],//喇叭消息
  feedMsg:[],//反馈消息
  mailType : {system: 1, game: 2},
  mails : [],
  safeBox:null,
  soundOn:true,
  notice : {},
  bLogined:false,
  podiumList:[],//领取奖励
  shopList:[],
  speakerInfo:null,
  songshen:0,
  mustUpdate: false,
  updateUrl: '',
  //  agentWeChat:[],

  wxEnterRoom: 0,
  club:null,

  registerGame : function(game, cb) {
    hall.gameEntries[game.appId] = game;
  },
  registerClub: function (game) {
      hall.club = game;
  },
  listGames : function() {
    return hall.gameCfgs;
  },

  gameConfig :function(index){
    return hall.gameCfgs[index];
  },

  getSpeakerCount:function()
  {
       if(hall.speakerInfo['hallBagMsg'] != undefined && hall.speakerInfo['hallBagMsg'] != null
           && hall.speakerInfo['hallBagMsg']['items'] != undefined
           && hall.speakerInfo['hallBagMsg']['items'] != null
           && hall.speakerInfo['hallBagMsg']['items'].length > 0)
       {
           for(var i = 0; i < hall.speakerInfo['hallBagMsg']['items'].length; i++ )
           {
               var item = hall.speakerInfo['hallBagMsg']['items'][i];
               if(item["type"] == "itemChat" )
               {
                   return item['count'];
               }
           }
       }

      return 0;
  },

  isCanSpeak:function()
  {
    if(this.getSpeakerCount() > 0)
    {
        return true;
    }
      return false;
  },


  gameSize : function(){
    return hall.gameCfgs.length;
  },

  enter : function(gameId) {
    hall.wxEnterRoom = 0;
    hall.inRoom = true;
    hall.inTableId = gameId;
    hall.gameEntries[gameId].enter();
  },

  enterRecord : function(gameId,recordData) {
    hall.inTableId = gameId;
    hall.gameEntries[gameId].enterRecord(recordData);
  },

  getPlayingGame:function () {
      return  hall.gameEntries[hall.inTableId];
  },

  searchRoom : function(gameId,tableId, cb) {
    hall.gameEntries[gameId].searchRoom(tableId, cb);
  },
    //创建房间
  createPrivate : function(gameId, tableName, cb) {
    hall.gameEntries[gameId].createPrivate(tableName, cb);
  },
  //代开房间
    reCreatePrivate : function(gameId, tableName, cb) {
        hall.gameEntries[gameId].reCreatePrivate(tableName, cb);
    },
    //删除代开房间
    deleteRePrivate : function(gameId, tableName, cb) {
        hall.gameEntries[gameId].deleteRePrivate(tableName, cb);
    },

  listPrivates : function(gameId, cb) {
    hall.gameEntries[gameId].listPrivates(cb);
  },

  joinPrivate : function(gameId, tableId , cb) {
    hall.gameEntries[gameId].joinPrivate(tableId, cb);
  },

  isSafeBoxUsed:function()
  {
      //noSafebox

      if(hall.safeBox["noSafebox"]
          == 1)
      {
          return false;
      }else
      {
          return true;
      }
  },

   logoutAccount:function()
   {
       window.pomelo.disconnect();
       qp.net.state = 'gate'
       hall.speakMsg = [];
       hall.safeBox = [];
       hall.user = {};
       hall.userNav = null;
   }
};

