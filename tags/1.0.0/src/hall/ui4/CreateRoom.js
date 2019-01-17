/**
 * Created by atom on 2016/9/10.
 */

//---------------------------------武汉麻将------------------------------------------------
var WuHanCreateRoom = cc.Layer.extend({
  gameBtns:null,
  gameIndex:0,
  gameShowPanels:null,
  //武汉麻将
  qdOpArray:null,
  qdOpPanel:null,
  qdOpArray1:null,
  qdOpPanel1:null,

  btn_createOther:null,

    //罗松
    panel_rounds: null,
    panel_zuozhuang: null,
    panel_moshi: null,
    panel_fufei: null,
    panel_wanfa: null,
    panel_mapai: null,
    panel_laizi: null,
    panel_person:null,
    panel_sss: null,
    itme_ops: null,
    panel_maCards: null,
    maPai: {type: 4, value: 10},

    //niuniu牛牛
  niuniuRound:4,
  niuniuRoundpanel:null,
  niuniuScore:0,
  niuniuScorepanel:null,
  niuniuFufei:0,
  niuniuFufeipanel:null,
  niuniuFanbei:1,
  niuniuFanbeipanel:null,
  niuniuWanfa:3,
  niuniuWanfapanel:null,
  niuniuOpArray:null,
  niuniuOpPanel:null,
  text_niuniuscore0:null,
  text_niuniuscore1:null,
  text_niuniuscore2:null,
  text_niuniugem0:null,
  text_niuniugem1:null,
  text_niuniugem2:null,

  btn_createOther:null,
  image_tip:null,
  ctor: function () {
    this._super();
    var root = ccs.load(WHMajhongJson.CreateRoom).node;
    this.addChild(root);
    this.gameBtns = new Array();
    this.gameShowPanels = new Array();
    // 取消AA收费开关
    this.aaChargeEnabled = false
    //武汉
    this.whOpArray = [1,1,1,1,1,1];
    this.whOpPanel = new Array();
    this.whOpArray1 = [0,0,0,0];
    this.whOpPanel1 = new Array();

     //牛牛
      this.niuniuOpArray = [1,1,1,1];
      this.niuniuOpPanel = new Array();
      this.niuniuRoundpanel = new Array();
      this.niuniuScorepanel = new Array();
      this.niuniuFufeipanel = new Array();
      this.niuniuWanfapanel = new Array();
    var btn_back = ccui.helper.seekWidgetByName(root,"btn_back");
    btn_back.addClickEventListener(function () {
      this.removeFromParent();
    }.bind(this));


    //武汉//
    var panel_game0 = ccui.helper.seekWidgetByName(root,"panel_game0");
    this.gameShowPanels.push(panel_game0);
    for (var i = 0 ;i<6;i++)
    {
      var checkBox = ccui.helper.seekWidgetByName(panel_game0,"checkbox_"+i);
      checkBox.setTouchEnabled(false);
      var opPanel = ccui.helper.seekWidgetByName(panel_game0,"panel_"+i);
      opPanel._checkBox = checkBox;
      opPanel._index = i;
      var floor = Math.floor(i/2); //0 1 2 3 4 5  0 0 1 1 2 2
      var index = i%2== 1?0:1;     // 1 0 1 0 1 0
      var saveOp = util.getCacheItem('config_whOp'+floor);
      if(saveOp == 2)
      {
        this.whOpArray[floor] = 0 ;
      }else
      {
        this.whOpArray[floor] = 1 ;
      }
      checkBox.setSelected(this.whOpArray[floor] == index);
      opPanel.addClickEventListener(this.onClickWHOp.bind(this));
      this.whOpPanel.push(opPanel);
    }

    if (this.aaChargeEnabled == false) {// 获取AA收费显示
        var checkBox = ccui.helper.seekWidgetByName(panel_game0,"checkbox_5");
        if (checkBox) {
          checkBox.setVisible(false)
        }
        var constPanel = ccui.helper.seekWidgetByName(panel_game0,"const");
        var text = ccui.helper.seekWidgetByName(constPanel,"Text_46_1_0_5");
        if (text) {
          text.setVisible(false)
        }
    }
    // 2018.12.21 mwshang 底金
    if (true) {//底金UI初始化
        this.baseScorePanel = ccui.helper.seekWidgetByName(panel_game0,"panel_5");
        this.baseScoreTxt = this.baseScorePanel.getChildByName("Text_1_0");        
        this.baseScoreListBg = ccui.helper.seekWidgetByName(panel_game0,"ListView_bg");
        this.baseScoreList = ccui.helper.seekWidgetByName(panel_game0,"ListView_1");
        this.btnBaseScore = ccui.helper.seekWidgetByName(panel_game0,"btnBaseScore");
        this.btnBaseScore.addClickEventListener(this.onBaseScoreClickWHOp.bind(this));
        this.baseScorePanel.addClickEventListener(this.onBaseScoreClickWHOp.bind(this));
        this.baseScorePanel.setTouchEnabled(true);
        this.baseScorePanel.setVisible(true)
        this.baseScoreList.setItemsMargin(5)

        var Text_Input_1 = ccui.helper.seekWidgetByName(panel_game0,"Text_Input_1")
        if (Text_Input_1) {
          Text_Input_1.setVisible(false)
        }

        this.downListIsHidden = true        
        this.setBaseScoreDownListVisible(false);

        this.baseCashs = basecashdata.baseCashs;
        var _this = this;
        this.baseCashs.forEach(function(data) {
            var lbl = cc.LabelTTF.create(data.desc, "Arial", 28)
            var layout = new ccui.Layout();

            layout.data = data

            lbl.setAnchorPoint(cc.p(0,0));
            lbl.setPositionX(10);
            layout.setContentSize(lbl.getContentSize());
            layout.addChild(lbl);
            layout.setTouchEnabled(true)
            layout.addTouchEventListener(_this.baseScoreItemClick.bind(_this,layout));
            _this.baseScoreList.pushBackCustomItem(layout)
        })

        this.setBaseScore(this.baseCashs[0].score);
        
    }

    for (var i = 0 ;i<4;i++)
    {
      var checkBox = ccui.helper.seekWidgetByName(panel_game0,"checkbox_op"+i);
      checkBox.setTouchEnabled(false);
      var opPanel = ccui.helper.seekWidgetByName(panel_game0,"panel_op"+i);
      opPanel._checkBox = checkBox;
      opPanel._index = i;
      var saveOp = util.getCacheItem('config_whOption'+i);
      if(saveOp == 1)
      {
        this.whOpArray1[i] = 1 ;
      }else
      {
        this.whOpArray1[i] = 0 ;
      }
      checkBox.setSelected(this.whOpArray1[i] == 1);
      opPanel.addClickEventListener(this.onClickWHOption.bind(this));
      this.whOpPanel1.push(opPanel);
    }
    // end 底金


   // 十三水
    var panel_game1 = ccui.helper.seekWidgetByName(root,"panel_game1");
    this.gameShowPanels.push(panel_game1);

      this.item_ops = {round: 10, person: 2, fufei: 0, moshi: 2, ma: 0, bei: 2, wanfa: -1, wang: 1};

      this.panel_sss = ccui.helper.seekWidgetByName(panel_game1, "panel_sss");
      this.panel_rounds = new Array();
      for (var i = 0; i < 3; i++) {
          var panel = ccui.helper.seekWidgetByName(this.panel_sss, "panel_" + i);
          var checkbox = ccui.helper.seekWidgetByName(this.panel_sss, "checkbox_" + i);
          checkbox.setTouchEnabled(false);
          var num = ccui.helper.seekWidgetByName(checkbox, "text_num");
          panel._checkBox = checkbox;
          panel._labelNum = num;
          var saveOp = util.getCacheItem('config_round');
          if (saveOp == 10 || saveOp == 20 || saveOp == 30) {
              this.item_ops["round"] = saveOp;
          }
          var bl = this.item_ops["round"] == (i + 1) * 10;
          checkbox.setSelected(bl);
          panel.setTouchEnabled(!bl);
          this.panel_rounds.push(panel);
          var clickData = {};
          clickData['this'] = this;
          clickData['itemValue'] = (i + 1) * 10;
          clickData['index'] = i;
          clickData['array'] = this.panel_rounds;
          clickData['itemKey'] = "round";
          panel.addClickEventListener(this.onToggle.bind(clickData));
      }
      //this.gameShowPanels.push(this.panel_sss);

      this.panel_person = new Array();
      var per = [2, 3, 4, 5, 6, 7, 8];
      for (var i = 0; i < 7; i++) {
          var panel = ccui.helper.seekWidgetByName(this.panel_sss, "panel_ren" + i);
          var checkbox = ccui.helper.seekWidgetByName(this.panel_sss, "checkbox_ren" + i);
          checkbox.setTouchEnabled(false);
          panel._checkBox = checkbox;
          var saveOp = util.getCacheItem('config_person');
          if (saveOp == 2 || saveOp == 3 || saveOp == 4 || saveOp == 5 || saveOp == 6 || saveOp == 7 || saveOp == 8) {
              this.item_ops["person"] = saveOp;
          }
          var bl = this.item_ops["person"] == per[i];
          checkbox.setSelected(bl);
          panel.setTouchEnabled(!bl);
          this.panel_person.push(panel);

          var clickData = {};
          clickData['this'] = this;
          clickData['itemValue'] = per[i];
          clickData['index'] = i;
          clickData['array'] = this.panel_person;
          clickData['itemKey'] = "person";
          panel.addClickEventListener(this.onToggle.bind(clickData));
      }

      this.panel_moshi = ccui.helper.seekWidgetByName(root, "panel_moshi");
      var moshi = new Array();
      for (var i = 0; i < 3; i++) {
          var panel = ccui.helper.seekWidgetByName(this.panel_moshi, "panel_moshi" + i);
          var checkbox = ccui.helper.seekWidgetByName(this.panel_moshi, "checkbox_moshi" + i);
          checkbox.setTouchEnabled(false);
          panel._checkBox = checkbox;
          var saveOp = util.getCacheItem('config_moshi');
          if (saveOp == 1 || saveOp == 2 || saveOp == 3) {
              this.item_ops["moshi"] = saveOp;
          }
          var bl = this.item_ops["moshi"] == (i + 1);
          checkbox.setSelected(bl);
          panel.setTouchEnabled(!bl);
          moshi.push(panel);

          var clickData = {};
          clickData['this'] = this;
          clickData['itemValue'] = i + 1;
          clickData['index'] = i;
          clickData['array'] = moshi;
          clickData['itemKey'] = "moshi";
          panel.addClickEventListener(this.onToggle.bind(clickData));
      }
      //this.gameShowPanels.push(this.panel_moshi);

      this.panel_fufei = ccui.helper.seekWidgetByName(root, "panel_fufei");
      var fufei = new Array();
      for (var i = 0; i < 3; i++) {
          var panel = ccui.helper.seekWidgetByName(this.panel_fufei, "panel_fufei" + i);
          var checkbox = ccui.helper.seekWidgetByName(this.panel_fufei, "checkbox_fufei" + i);
          var saveOp = util.getCacheItem('config_fufei');
          if (saveOp == 1 || saveOp == 2 || saveOp == 0) {
              this.item_ops["fufei"] = saveOp;
          }
          checkbox.setTouchEnabled(false);
          panel._checkBox = checkbox;
          var bl = this.item_ops["fufei"] == i;
          checkbox.setSelected(bl);
          fufei.push(panel);

          var clickData = {};
          clickData['this'] = this;
          clickData['itemValue'] = i;
          clickData['index'] = i;
          clickData['array'] = fufei;
          clickData['itemKey'] = "fufei";
          panel.addClickEventListener(this.onToggle.bind(clickData));
      }

      this.panel_zuozhuang = ccui.helper.seekWidgetByName(root, "panel_zuozhuang");
      var panel_bei = new Array();
      for (var i = 0; i < 4; i++) {
          var panel = ccui.helper.seekWidgetByName(this.panel_zuozhuang, "panel_bei" + i);
          var checkbox = ccui.helper.seekWidgetByName(this.panel_zuozhuang, "checkbox_bei" + i);
          checkbox.setTouchEnabled(false);
          panel._checkBox = checkbox;
          var saveOp = util.getCacheItem('config_bei');
          if (saveOp == 2 || saveOp == 3 || saveOp == 4 || saveOp == 5) {
              this.item_ops["bei"] = saveOp;
          }
          var bl = this.item_ops["bei"] == per[i];
          checkbox.setSelected(bl);
          panel.setTouchEnabled(!bl);
          panel_bei.push(panel);

          var clickData = {};
          clickData['this'] = this;
          clickData['itemValue'] = per[i];
          clickData['index'] = i;
          clickData['array'] = panel_bei;
          clickData['itemKey'] = "bei";
          panel.addClickEventListener(this.onToggle.bind(clickData));
      }
      //this.gameShowPanels.push(this.panel_zuozhuang);

      /*
      this.panel_laizi = ccui.helper.seekWidgetByName(root, "panel_laizi");
      var panel_laizi = new Array();
      for (var i = 0; i < 4; i++) {
          var panel = ccui.helper.seekWidgetByName(this.panel_laizi, "panel_wang" + i);
          var checkbox = ccui.helper.seekWidgetByName(this.panel_laizi, "checkbox_wang" + i);
          checkbox.setTouchEnabled(false);
          panel._checkBox = checkbox;
          var saveOp = util.getCacheItem('config_wang');
          if (saveOp == 2 || saveOp == 3 || saveOp == 4 || saveOp == 1) {
              this.item_ops["wang"] = saveOp;
          }
          var bl = this.item_ops["wang"] == i + 1;
          checkbox.setSelected(bl);
          panel.setTouchEnabled(!bl);
          panel_laizi.push(panel);

          var clickData = {};
          clickData['this'] = this;
          clickData['itemValue'] = i + 1;
          clickData['index'] = i;
          clickData['array'] = panel_laizi;
          clickData['itemKey'] = "wang";
          panel.addClickEventListener(this.onToggle.bind(clickData));
      }
      this.gameShowPanels.push(this.panel_laizi);
       */

      this.panel_wanfa = ccui.helper.seekWidgetByName(root, "panel_wanfa");
      var panel_wanfas = new Array();
      var values = [4, 1, 2];
      for (var i = 0; i < 3; i++) {
          var panel = ccui.helper.seekWidgetByName(this.panel_wanfa, "panel_op" + i);
          var checkbox = ccui.helper.seekWidgetByName(this.panel_wanfa, "checkbox_op" + i);
          checkbox.setTouchEnabled(false);
          panel._checkBox = checkbox;
          var saveOp = util.getCacheItem('config_wanfa');
          if (saveOp == 4 || saveOp == 1 || saveOp == 2) {
              this.item_ops["wanfa"] = saveOp;
          }
          var bl = this.item_ops["wanfa"] == values[i];
          checkbox.setSelected(bl);
          panel_wanfas.push(panel);
          var clickData = {};
          clickData['this'] = this;
          clickData['itemValue'] = values[i];
          clickData['index'] = i;
          clickData['array'] = panel_wanfas;
          clickData['itemKey'] = "wanfa";
          panel.addClickEventListener(this.onSwitch.bind(clickData));
      }

      this.panel_mapai = ccui.helper.seekWidgetByName(root, "panel_mapai");
      // this.panel_mapai.setVisible(false);

      var panel = ccui.helper.seekWidgetByName(this.panel_mapai, "panel_ma");
      var checkbox = ccui.helper.seekWidgetByName(this.panel_mapai, "checkbox_ma");
      checkbox.setTouchEnabled(false);
      panel._checkBox = checkbox;
      var saveOp = util.getCacheItem('config_ma');
      if (saveOp == 1) {
          this.item_ops["ma"] = saveOp;
      }
      var bl = this.item_ops["ma"] == 1;
      checkbox.setSelected(bl);
      var clickData = {};
      clickData['this'] = this;
      clickData['checkBox'] = checkbox;
      clickData['itemKey'] = "ma";
      panel.addClickEventListener(this.onSwitchSelect.bind(clickData));
      var btn_ma = ccui.helper.seekWidgetByName(this.panel_mapai,"panel_selectMa");
      this.panel_maCards = ccui.helper.seekWidgetByName(root,"panel_maPaiCards");
      btn_ma.addClickEventListener(function (sender) {
          //this.panel_maCards.setVisible(true);
      }.bind(this));
      var image_maTip = ccui.helper.seekWidgetByName(this.panel_mapai,"image_maTip");
      image_maTip.runAction(cc.sequence(cc.fadeOut(1),cc.fadeIn(1),cc.delayTime(0.3)).repeatForever());

      var card = ccui.helper.seekWidgetByName(this.panel_mapai,"image_card");
      var scale = 0.82;
      /*for(var j =0;j<4;j++)
      {
          for(var i=1;i<14;i++)
          {
              var key = (j+1)+""+i;
              var img = "YJ"+SSSPoker.PokerPaiImage["paiImage"][key];
              var image = new ccui.ImageView(img,ccui.Widget.PLIST_TEXTURE);
              image._image = img;
              image._card = {type:j+1,value:i};
              image.setScale(scale);
              image.setAnchorPoint(cc.p(0,1));
              image.setTouchEnabled(true);
              image.addClickEventListener(function (sender) {
                  card.loadTexture(sender._image,ccui.Widget.PLIST_TEXTURE);
                  this.maPai = sender._card;
                  this.panel_maCards.setVisible(false);
              }.bind(this));

              var ind = i-1;
              image.setPosition(cc.p(120*ind*scale,720 -175*j*scale));
              //this.panel_maCards.addChild(image);
          }
      }*/

      //牛牛--------------------------------------------------
      var panel_game5 = ccui.helper.seekWidgetByName(root,"panel_game2");
      panel_game5.setName("panel_niuniu");
      this.gameShowPanels.push(panel_game5);
      this.text_niuniuscore0 = ccui.helper.seekWidgetByName(panel_game5,"text_score0");
      this.text_niuniuscore1 = ccui.helper.seekWidgetByName(panel_game5,"text_score1");
      this.text_niuniuscore2 = ccui.helper.seekWidgetByName(panel_game5,"text_score2");
      var img0 = ccui.helper.seekWidgetByName(panel_game5,"img_cost0");
      this.text_niuniugem0 = ccui.helper.seekWidgetByName(img0,"num");
      var img1 = ccui.helper.seekWidgetByName(panel_game5,"img_cost1");
      this.text_niuniugem1 = ccui.helper.seekWidgetByName(img1,"num");
      var img2 = ccui.helper.seekWidgetByName(panel_game5,"img_cost2");
      this.text_niuniugem2 = ccui.helper.seekWidgetByName(img2,"num");

      var saveNNRound = util.getCacheItem('config_niuniuRound');
      if(saveNNRound == 30)
      {
          this.niuniuRound = 30;
      }else if(saveNNRound == 20)
      {
          this.niuniuRound = 20;
      }
      else
      {
          this.niuniuRound = 10;
      }
      for (var i = 0 ;i<3;i++)
      {
          var checkBox = ccui.helper.seekWidgetByName(panel_game5,"checkbox_round"+i);
          checkBox.setTouchEnabled(false);
          var opPanel = ccui.helper.seekWidgetByName(panel_game5,"panel_round"+i);
          opPanel._checkBox = checkBox;
          checkBox.setSelected(this.niuniuRound == (i+1)*10);
          opPanel.addClickEventListener(this.onClickNNRound.bind(this));
          this.niuniuRoundpanel.push(opPanel);
      }
      var saveNNScore = util.getCacheItem('config_niuniuScore');
      if(saveNNScore == 2)
      {
          this.niuniuScore = 2;
      }else if(saveNNScore == 1)
      {
          this.niuniuScore =1;
      }
      else
      {
          this.niuniuScore = 0;
      }
      for (var i = 0 ;i<3;i++)
      {
          var checkBox = ccui.helper.seekWidgetByName(panel_game5,"checkbox_score"+i);
          checkBox.setTouchEnabled(false);
          var opPanel = ccui.helper.seekWidgetByName(panel_game5,"panel_score"+i);
          opPanel._checkBox = checkBox;
          checkBox.setSelected(this.niuniuScore == i);
          opPanel.addClickEventListener(this.onClickNNScore.bind(this));
          this.niuniuScorepanel.push(opPanel);
      }
      var saveNNFufei = util.getCacheItem('config_niuniuFufei');
      if(saveNNFufei == 2)
      {
          this.niuniuFufei = 2;
      }else if(saveNNFufei == 1)
      {
          this.niuniuFufei =1;
      }
      else
      {
          this.niuniuFufei = 0;
      }
      for (var i = 0 ;i<3;i++)
      {
          var checkBox = ccui.helper.seekWidgetByName(panel_game5,"checkbox_cost"+i);
          checkBox.setTouchEnabled(false);
          var opPanel = ccui.helper.seekWidgetByName(panel_game5,"panel_cost"+i);
          opPanel._checkBox = checkBox;
          checkBox.setSelected(this.niuniuFufei == i);
          opPanel.addClickEventListener(this.onClickNNFufei.bind(this));
          this.niuniuFufeipanel.push(opPanel);
      }

      var saveNNWanfa = util.getCacheItem('config_niuniuWanfa');
      if(saveNNWanfa == 2)
      {
          this.niuniuWanfa = 2;
      }else if(saveNNWanfa == 1)
      {
          this.niuniuWanfa =1;
      }
      else
      {
          this.niuniuWanfa = 3;
      }
      for (var i = 0 ;i<3;i++)
      {
          var checkBox = ccui.helper.seekWidgetByName(panel_game5,"checkbox_wanfa"+i);
          checkBox.setTouchEnabled(false);
          var opPanel = ccui.helper.seekWidgetByName(panel_game5,"panel_wanfa"+i);
          opPanel._checkBox = checkBox;
          checkBox.setSelected(this.niuniuWanfa == (i+1));
          opPanel.addClickEventListener(this.onClickNNWanfa.bind(this));
          this.niuniuWanfapanel.push(opPanel);
      }
      for (var i = 0 ;i<4;i++)
      {
          var checkBox = ccui.helper.seekWidgetByName(panel_game5,"checkbox_"+i);
          checkBox.setTouchEnabled(false);
          var opPanel = ccui.helper.seekWidgetByName(panel_game5,"panel_"+i);
          opPanel._checkBox = checkBox;
          opPanel._index = i;
          var floor = Math.floor(i/2);
          var index = i%2== 1?0:1;
          var saveOp = util.getCacheItem('config_NNOp'+floor);
          if(saveOp == 2)
          {
              this.niuniuOpArray[floor] = 0 ;
          }else
          {
              this.niuniuOpArray[floor] = 1 ;
          }
          checkBox.setSelected(this.niuniuOpArray[floor] == index);
          opPanel.addClickEventListener(this.onClickNNOp.bind(this));
          this.niuniuOpPanel.push(opPanel);
      }
      var scores = [];
      if(this.niuniuWanfa == WAN_FA.TONGBI){
          scores = [1,2,4];
      }else if(this.niuniuWanfa == WAN_FA.NIUNIUSHANGZHUANG){
          scores = ["1|2","2|4","4|8"];
      }else if(this.niuniuWanfa == WAN_FA.MINGPAIQIANGZHAUNG){
          scores = ["1|2","2|4","4|8"];
      }
      this.text_niuniuscore0.setString(scores[0]);
      this.text_niuniuscore1.setString(scores[1]);
      this.text_niuniuscore2.setString(scores[2]);
      if(this.niuniuFufei == 1)
      {
          this.text_niuniugem0.setString(8);
          this.text_niuniugem1.setString(15);
          this.text_niuniugem2.setString(20);
      }else
      {
          this.text_niuniugem0.setString(18);
          this.text_niuniugem1.setString(36);
          this.text_niuniugem2.setString(54);
      }
      this.text_niuniugem0.setContentSize(this.text_niuniugem0.getVirtualRendererSize());
      this.text_niuniugem1.setContentSize(this.text_niuniugem1.getVirtualRendererSize());
      this.text_niuniugem2.setContentSize(this.text_niuniugem2.getVirtualRendererSize());

    //-------游戏标签------------------------------------
    for(var i = 0; i< 3;i++)
    {
      var btn = ccui.helper.seekWidgetByName(root,"btn_game"+i);
      btn.addClickEventListener(this.onSwitchGame.bind(this));
      if(i == 0)
      {
        btn.setBright(false);
        btn.setTouchEnabled(false);
      }
      //隐藏
        if(i > 0){
            btn.setVisible(false);
        }
      this.gameBtns.push(btn);
    }

    if (hall.songshen == 1 && cc.sys.os == cc.sys.OS_ANDROID)
    {
      //武汉
      var panel_qzCost = ccui.helper.seekWidgetByName(panel_game0,"panel_cost");
      panel_qzCost.setVisible(false);
    }

    var btn_create = ccui.helper.seekWidgetByName(root,"btn_create");
    btn_create.addClickEventListener(this.onCreateRoom.bind(this));

    this.btn_createOther = ccui.helper.seekWidgetByName(root,"btn_createother");
    this.btn_createOther.addClickEventListener(this.onCreateOtherRoom.bind(this));
  },

  onSwitchGame:function (sender) {
    this.gameIndex = sender.name.substring(8);
    for(var i=0;i<this.gameBtns.length;i++)
    {
      var btn = this.gameBtns[i];
      btn.setBright(btn.name != sender.name);
      btn.setTouchEnabled(btn.name != sender.name);
      this.gameShowPanels[i].setVisible(btn.name == sender.name);
    }
    this.btn_createOther.setVisible(this.gameIndex == 2)
  },

  onSwitchSelect:function () {
      var _this = this['this'];
      var checkBox = this['checkBox'];
      var key = this['itemKey'];
      checkBox.setSelected(!checkBox.isSelected());
      _this.item_ops[key] = checkBox.isSelected()?1:0;

      var lab = ccui.helper.seekWidgetByName(checkBox,"content")
      // if(checkBox.isSelected())
      // {
      //     lab.setTextColor(CommonParam.selectColor);
      // }else
      // {
      //     lab.setTextColor(CommonParam.unselectColor);
      // }
  },

    onToggle: function () {
        var index = this['index'];
        var _this = this['this'];
        var array = this['array'];
        var key = this['itemKey'];
        var value = this['itemValue'];
        // console.log("index=====",index);
        // console.log("key ,value===",key,value);
        _this.item_ops[key] = value;
        // console.log("this.item_ops.fufei ====",_this.item_ops.fufei);
        for (var i = 0; i < array.length; i++) {
            array[i].setTouchEnabled(i != index);
            array[i]._checkBox.setSelected(i == index);
        }

        if (key == "person" || key == "fufei" || key == "moshi") {
            //   var cost = {"2": 2, "3": 3, "4": 4, "5": 32, "6": 40,"7":58,"8":72}
            var aaCost = {
                "2": [1, 1, 2],
                "3": [1, 1, 2],
                "4": [1, 1, 2],
                "5": [1, 1, 2],
                "6": [1, 1, 2],
                "7": [1, 2, 2],
                "8": [1, 2, 2]
            };
            var fangzhuCost = {
                "2": [2, 2, 4],
                "3": [2, 3, 5],
                "4": [2, 4, 6],
                "5": [4, 5, 7],
                "6": [4, 6, 8],
                "7": [4, 7, 10],
                "8": [4, 8, 12]
            };

            var opt = 1
            if(_this.gameIndex == 5 )//双将
            {
                opt = 2;
            }
            for (var i = 0; i < _this.panel_rounds.length; i++) {
                // if (index == 3 ) {
                //     _this.item_ops.fufei = 0; //坐庄罗松 都是房主付费
                // }
                if (_this.item_ops.fufei == 1 && _this.gameIndex != 3) // AA 付费  this.gameIndex =3 坐庄罗松 都是房主付费
                {
                    _this.panel_rounds[i]._labelNum.setString("（    x" + opt*aaCost[opt*_this.item_ops.person][i] + "）");  //aa 付费
                } else  // 房主付费
                {
                    _this.panel_rounds[i]._labelNum.setString("（    x" + fangzhuCost[opt*_this.item_ops.person][i] + "）");
                }
            }
        }
    },
  onSwitch: function () {
      var index = this['index'];
      var _this = this['this'];
      var array = this['array'];
      var key = this['itemKey'];
      var value = this['itemValue'];
      for (var i = 0; i < array.length; i++) {
          if (i == index) {
              array[i]._checkBox.setSelected(!array[i]._checkBox.isSelected());
              _this.item_ops[key] = array[i]._checkBox.isSelected() ? value : 0;
          } else {
              array[i]._checkBox.setSelected(false);
          }
      }

      //console.log("onSwitch=====",key);
      if (key == "fufei") {
          // var cost = {"2": 13, "3": 18, "4": 25, "5": 32, "6": 40,"7":58,"8":72};
          var aaCost = {
              "2": [1, 1, 2],
              "3": [1, 1, 2],
              "4": [1, 1, 2],
              "5": [1, 1, 2],
              "6": [1, 1, 2],
              "7": [1, 2, 2],
              "8": [1, 2, 2]
          };
          var fangzhuCost = {
              "2": [2, 2, 4],
              "3": [2, 3, 5],
              "4": [2, 4, 6],
              "5": [4, 5, 7],
              "6": [4, 6, 8],
              "7": [4, 7, 10],
              "8": [4, 8, 12]
          };

          var opt = 1
          if(_this.gameIndex == 5 )//双将
          {
              opt = 2;
          }

          for (var i = 0; i < _this.panel_rounds.length; i++) {
              if (_this.item_ops.fufei == 1) {
                  _this.panel_rounds[i]._labelNum.setString("（    x" + opt*aaCost[opt*_this.item_ops.person][i] + "）");  //aa 付费
              } else {
                  _this.panel_rounds[i]._labelNum.setString("（    x" + fangzhuCost[opt*_this.item_ops.person][i] + "）");
              }
          }
      }
  },
//武汉
  onBaseScoreClickWHOp:function (sender){
    console.log("onBaseScoreClickWHOp")
    this.setBaseScoreDownListVisible(this.downListIsHidden);
  },
  baseScoreItemClick:function (sender,layout,eType){
    if (eType == 2) { // end touch
        this.setBaseScoreDownListVisible(false);
        if (layout.data.score == -1) {//自定义
           
           var layer = new InputDailog(function (score) {
                this.setBaseScore(score)
            }.bind(this));
            layer.show();

        }else {
          this.setBaseScore(layout.data.score);  
        }
        
    }
  },
  setBaseScore:function(score) { // 设置底金
    if (score) {
      this.baseScoreTxt.setVisible(true);
      basecashdata.setBaseCash(score);
      this.baseScoreTxt.setString(basecashdata.curBaseCashDesc);
    }      
  },
  setBaseScoreDownListVisible:function(v) { // 
      this.baseScoreListBg.setVisible(v);
      this.baseScoreList.setVisible(v);
      this.downListIsHidden = !v;
  },
  onClickWHOp:function (sender) {
    sender._checkBox.setSelected(!sender._checkBox.isSelected());
    var opIndex = Math.floor(sender._index/2);
    if(sender._index%2 == 0)
    {
      this.whOpArray[opIndex] = sender._checkBox.isSelected()?1:0;
    }else
    {
      this.whOpArray[opIndex] = sender._checkBox.isSelected()?0:1;
    }
    var index = sender._index%2 == 0 ? sender._index + 1:sender._index - 1;
    if(index < this.whOpPanel.length)
      this.whOpPanel[index]._checkBox.setSelected(!sender._checkBox.isSelected());
  },
  onClickWHOption:function (sender) {
    sender._checkBox.setSelected(!sender._checkBox.isSelected());
    this.whOpArray1[sender._index] = sender._checkBox.isSelected()?1:0;
  },
  showPanel:function()
  {
    cc.director.getRunningScene().addChild(this);
  },

  recordNewConfig: function () {
    if(this.gameIndex == 0)
    {
      for(var i = 0;i<this.whOpArray.length;i++)
      {
        util.setCacheItem('config_whOp'+i, this.whOpArray[i] == 1?1:2);
      }

      for(var i = 0;i<this.whOpArray1.length;i++)
      {
        util.setCacheItem('config_whOption'+i, this.whOpArray1[i] == 1?1:2);
      }
    }
  },

onClickNNRound:function (sender) {
    this.niuniuRound = sender.name == "panel_round0" ?10:sender.name == "panel_round1"?20:30;
    for(var i = 0;i<this.niuniuRoundpanel.length;i++)
    {
      this.niuniuRoundpanel[i].setTouchEnabled(this.niuniuRound!=(i+1)*10);
      this.niuniuRoundpanel[i]._checkBox.setSelected(this.niuniuRound==(i+1)*10);
    }
  },
  onClickNNScore:function (sender) {
    this.niuniuScore = sender.name == "panel_score0" ?0:sender.name == "panel_score1"?1:2;
    for(var i = 0;i<this.niuniuScorepanel.length;i++)
    {
      this.niuniuScorepanel[i].setTouchEnabled(this.niuniuScore!=i);
      this.niuniuScorepanel[i]._checkBox.setSelected(this.niuniuScore==i);
    }
  },
  onClickNNFufei:function (sender) {
    this.niuniuFufei = sender.name == "panel_cost0" ?0:sender.name == "panel_cost1"?1:2;
    for(var i = 0;i<this.niuniuFufeipanel.length;i++)
    {
      this.niuniuFufeipanel[i].setTouchEnabled(this.niuniuFufei!=i);
      this.niuniuFufeipanel[i]._checkBox.setSelected(this.niuniuFufei==i);
    }

    if(this.niuniuFufei == 1)
    {
      this.text_niuniugem0.setString(8);
      this.text_niuniugem1.setString(15);
      this.text_niuniugem2.setString(20);
    }else
    {
      this.text_niuniugem0.setString(18);
      this.text_niuniugem1.setString(36);
      this.text_niuniugem2.setString(54);
    }
    this.text_niuniugem0.setContentSize(this.text_niuniugem0.getVirtualRendererSize());
    this.text_niuniugem1.setContentSize(this.text_niuniugem1.getVirtualRendererSize());
    this.text_niuniugem2.setContentSize(this.text_niuniugem2.getVirtualRendererSize());
  },
  onClickNNWanfa:function (sender) {
    this.niuniuWanfa = sender.name == "panel_wanfa0" ?1:sender.name == "panel_wanfa1"?2:3;
    for(var i = 0;i<this.niuniuWanfapanel.length;i++)
    {
      this.niuniuWanfapanel[i].setTouchEnabled(this.niuniuWanfa!=(i+1));
      this.niuniuWanfapanel[i]._checkBox.setSelected(this.niuniuWanfa==(i+1));
    }

    var scores = [];
    if(this.niuniuWanfa == WAN_FA.TONGBI){
      scores = [1,2,4];
    }else if(this.niuniuWanfa == WAN_FA.NIUNIUSHANGZHUANG){
      scores = ["1|2","2|4","4|8"];
    }else if(this.niuniuWanfa == WAN_FA.MINGPAIQIANGZHAUNG){
      scores = ["1|2","2|4","4|8"];
    }
    this.text_niuniuscore0.setString(scores[0]);
    this.text_niuniuscore1.setString(scores[1]);
    this.text_niuniuscore2.setString(scores[2]);
  },


  onClickNNOp:function (sender) {
    sender._checkBox.setSelected(!sender._checkBox.isSelected());
    var opIndex = Math.floor(sender._index/2);
    if(sender._index%2 == 0)
    {
      this.niuniuOpArray[opIndex] = sender._checkBox.isSelected()?1:0;
    }else
    {
      this.niuniuOpArray[opIndex] = sender._checkBox.isSelected()?0:1;
    }
    var index = sender._index%2 == 0 ? sender._index + 1:sender._index - 1;
    if(index < this.niuniuOpPanel.length)
      this.niuniuOpPanel[index]._checkBox.setSelected(!sender._checkBox.isSelected());

  },
  onCreateRoom:function()
  {
    var roomData = {};
    roomData["uid"] = hall.user.uid;
    if(this.gameIndex == 0)
    {
      roomData['rounds'] = this.whOpArray[0] ==1?8:16;//mwshang 局数:8局或16局
      roomData['aaGem'] = this.whOpArray[2]==1?0:1;//0为房主付费
      roomData['yuanLaiFan'] = this.whOpArray1[0];//原赖翻番
      roomData['fengLaiFan'] = this.whOpArray1[1];//风赖翻番
      roomData['yiJiuLaiFan'] = this.whOpArray1[2];//一九翻番
      roomData['lianJinFan'] = this.whOpArray1[3];//连金翻番
      roomData['tableName'] = 'WHMajhong';
        //2018.12.20 mwshang增加底金
      roomData['baseScore'] = basecashdata.curBaseCash;//底金

      hall.createPrivate(whmajhong.appId,roomData,function(data){
        if(data["code"]== 200)
        {
          hall.enter(whmajhong.appId);
        }else
        {
          var dialog = new JJConfirmDialog();
          dialog.setDes(data['error']);
          dialog.showDialog();
        }
      });
    }
    else if(this.gameIndex == 1)  // 十三水
    {
        var areas = ["fj", "fj", "fj", "fj", "fj", "fj"];
        roomData['area'] = areas[this.gameIndex];
        roomData['tableName'] = areas[this.gameIndex];
        roomData['uid'] = hall.user.uid;
        roomData['rounds'] = this.item_ops.round;        //局数
        roomData['person'] = this.item_ops.person;         //人数
        roomData['banker'] = 0;
        roomData['isMa'] = this.item_ops.ma;
        roomData['aaGem'] = this.item_ops.fufei;
        roomData['mode'] = this.item_ops["moshi"]         //模式
        roomData['isQiangZhi'] = 1;                       //强制比牌

        if(this.item_ops.ma == 1)
            roomData['maPai'] = this.maPai;

        if (this.gameIndex == 3) //坐庄
        {
            roomData['mode'] = 1;                         //模式
            roomData['aaGem'] = 0;
            roomData['wanFa'] = this.item_ops.wanfa > 0 ? this.item_ops.wanfa : 0;
            roomData['bei'] = this.item_ops.bei;
            roomData['banker'] = 1;
        }
        else if (this.gameIndex == 4) //百变
        {
            roomData['wanFa'] = this.item_ops.wanfa > 0 ? this.item_ops.wanfa : 0;
            roomData['wang'] = this.item_ops.wang;
        }
        else if (this.gameIndex == 5)//双将
        {
            roomData['wanFa'] = this.item_ops.wanfa > 0 ? this.item_ops.wanfa : 0;
            roomData['wanFaType'] = 1;
        }

        console.log("十三水创建=====", roomData);
        this.recordSSSConfig();
        hall.createPrivate(SSSPoker.appId, roomData, function (data) {
            if (data["code"] == 200) {
                hall.enter(SSSPoker.appId);
            } else {
                var dialog = new JJConfirmDialog();
                dialog.setDes(data['error']);
                dialog.showDialog();
            }
        }.bind(this));
    }else if(this.gameIndex == 2)
    {
      console.log("create_index_5");

      roomData["rounds"] = parseInt(this.niuniuRound);        //局数
      roomData["aaGem"] = parseInt(this.niuniuFufei); //0房主支付 1--AA  2赢家付费
        if(this.niuniuWanfa == WAN_FA.TONGBI){
            var scores = [1,2,4];
            roomData["diFen"] = scores[this.niuniuScore];

        }else if(this.niuniuWanfa == WAN_FA.NIUNIUSHANGZHUANG){
            var scores = ["1|2","2|4","4|8"];
            roomData["diFen"] = scores[this.niuniuScore];
        }else if(this.niuniuWanfa == WAN_FA.MINGPAIQIANGZHAUNG){
            var scores = ["1|2","2|4","4|8"];
            roomData["diFen"] = scores[this.niuniuScore];  //parseInt(this.niuniuScore); //"1/2" 低分可以下注1分或者2分
        }
      roomData["wanFa"] = parseInt(this.niuniuWanfa);//// 1庄家模式 0 通比模式 //1 是通比  2是牛牛上庄 3明牌上庄
      roomData["fanBei"] =  parseInt(this.niuniuOpArray[0]== 1?1:2);//游戏翻倍  翻倍选择 1表示牛牛3倍 牛九2倍 牛八2倍   2表示牛牛4倍 牛九3倍 牛八2倍 牛七2倍
      roomData["person"] = 8;
      roomData["bankerBei"] = 4;
      roomData["spePai"] = parseInt(this.niuniuOpArray[1]== 1?0:7); //特殊牌型 组合表示选择了几种 依次是五花牛 炸弹牛 五小牛 特殊牌型  1 3 4 5 6 7
      roomData["shangZhuang"] = 0;    //上庄分数
      roomData["tuiZhu"] = 0; //闲家推注

      hall.createPrivate(Niuniu.appId,roomData,function(data){JJLog.print("创建返回="+ JSON.stringify(data));
        if(data["code"]== 200)
        {
          hall.enter(Niuniu.appId);
        }else
        {
          var dialog = new JJConfirmDialog();
          dialog.setDes(data['error']);
          dialog.showDialog();
        }
      }.bind(this));


      console.log("niuniu create data=========:")
      console.log(roomData);
    }
    JJLog.print(JSON.stringify(roomData));
    this.recordNewConfig(roomData);
  },

  recordSSSConfig: function () {
      for (var key in this.item_ops) {
          util.setCacheItem('config_' + key, this.item_ops[key]);
      }
      util.setCacheItem('config_qdgameindex', this.gameIndex);
  },
  onCreateOtherRoom:function()
  {
    var roomData = {};
    roomData["uid"] = hall.user.uid;
    if(this.gameIndex == 0)
    {
      roomData['rounds'] = this.qdOpArray[0] ==1?8:16;
      roomData['niao'] = this.qdOpArray[1]==1?0:1;
      roomData['aaGem'] = this.qdOpArray[2]==1?0:1;
      roomData['diScore'] = 1;
      roomData['jia'] = this.qdOpArray1[1];
      roomData['tableName'] = 'WHMajhong';

      hall.reCreatePrivate(whmajhong.appId,roomData,function(data){
        if(data["code"]== 200)
        {
          this.removeFromParent();
          var dialog = new MajhongOtherRoomPanel();
          dialog.showPanel();

        }else
        {
          var dialog = new JJConfirmDialog();
          dialog.setDes(data['error']);
          dialog.showDialog();
        }

      }.bind(this));

    }
    JJLog.print(JSON.stringify(roomData));
    this.recordNewConfig(roomData);
  }

});
var InputRoomPanel = cc.Layer.extend({
  btn_del:null,
  btn_set:null,
  textArray:null,
  btnArray:null,
  ctor:function(){
    this._super();

    var root = ccs.load(GameHallJson.Join).node;
    this.addChild(root);
    this.btnArray = new Array();
    for(var i = 0;i < 10;i++)
    {
      var str = "btn_"+i;
      var btn = ccui.helper.seekWidgetByName(root,str);
      btn.setTag(i);
      var data = {};
      data['root'] = this;
      data['tag'] = i;
      btn.addClickEventListener(this.onNum.bind(data));
      this.btnArray.push(btn);
    }

    this.textArray = new Array();
    for(var i = 0 ;i<6;i++)
    {
      var str = "text"+i;
      var text = ccui.helper.seekWidgetByName(root,str);
      text.setString('');
      this.textArray.push(text);
    }

    this.btn_del = ccui.helper.seekWidgetByName(root,"btn_del");
    this.btn_del.addClickEventListener(this.onDel.bind(this));

    this.btn_set = ccui.helper.seekWidgetByName(root,"btn_set");
    this.btn_set.addClickEventListener(this.onReSet.bind(this));


    this.btn_close = ccui.helper.seekWidgetByName(root,"btn_close");

    this.btn_close.addClickEventListener(function(){
      this.removeFromParent();
    }.bind(this));

  },

  onNum:function()
  {

    var root = this['root'];
    if ( root.textArray[root.textArray.length-1].length > 0)
      return;
    var num = this['tag'];
    for(var i = 0 ;  i < root.textArray.length;i++)
    {
      var text = root.textArray[i];
      if(text.getString().length  <= 0)
      {
        text.setString(num);
        break;
      }
    }

    var roomId = '';
    for(var i = 0 ;  i < root.textArray.length;i++)
    {
      var text = root.textArray[i];
      roomId += text.getString();
      if(text.getString().length  <= 0)
      {
        return;
      }
    }
    var _r = root;

      hall.net.getTableServerType(roomId,function(data){
          JJLog.print('加入房间返回=' + JSON.stringify(data));
          if(data["code"]== 200)
          {

              // 2019.1.2 mwshang
              if (!!data["config"] && !!data["config"]["baseScore"]) {
                basecashdata.setBaseCash(parseFloat(data["config"]["baseScore"]));
              }
              // 

              var appId ='';
              if(data["serverType"] == 'wuhan')
              {
                  appId = whmajhong.appId;
              }
              else if(data["serverType"] == 'shisanshui')
              {
                  appId = SSSPoker.appId;
              }
              else if(data["serverType"] == 'douniu')
              {
                  appId = Niuniu.appId;
              }
              hall.joinPrivate(appId,roomId,function(data){
                  if(data["code"]== 200)
                  {
                      hall.enter(appId);
                  }else
                  {
                      _r.showErr(data);
                  }
              });

          }else
          {
              _r.showErr(data);
          }
      });

  },


  showErr: function (data) {
    this.onRest();
    var dialog = new JJConfirmDialog();
    dialog.setDes(data['error']);
    dialog.showDialog();
  },



  onRest: function () {
    for(var i = 0; i < this.textArray.length;i++)
    {
      var text = this.textArray[i];
      text.setString('');

    }
  },

  onDel: function () {

    for(var i = this.textArray.length;i>0;i--)
    {
      var text = this.textArray[i-1];
      if(text.getString().length > 0)
      {
        text.setString('');
        break;
      }
    }
  },

  onReSet: function () {

    for(var i = this.textArray.length;i>0;i--)
    {
      var text = this.textArray[i-1];
      if(text.getString().length > 0)
      {
        text.setString('');
      }
    }
  },

  onEnter: function(){
    this._super();

  },

  showPanel:function()
  {
    cc.director.getRunningScene().addChild(this);
  }

});