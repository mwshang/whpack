/**
 * Created by atom on 2016/10/2.
 */

var JJDahuAninmation = cc.Layer.extend({
    action:null,
    root:null,
    sprite_hu_word:null,
    panel_root:null,
    ctor: function (huType) {
      this._super();
      var json = ccs.load("res/MajhongBase/MajhongHuAnimation.json");
      this.action = json.action;
      this.root = json.node;
      this.addChild(this.root);
      this.panel_root = ccui.helper.seekWidgetByName(this.root,"panel_root");
      this.panel_root.ignoreAnchorPointForPosition(false);
      var image_hu_word = ccui.helper.seekWidgetByName(this.root,"image_hu_word");
      JJLog.print('huType = '+ huType + ' , res = ' + QuanZhouHuRes[huType]);
      image_hu_word.loadTexture(QuanZhouHuRes[huType],ccui.Widget.PLIST_TEXTURE);
      image_hu_word.setVisible(false);
      //var contentSize = image_hu_word.getContentSize();

      this.sprite_hu_word =  ccui.helper.seekWidgetByName(this.root,"sprite_hu_word");
      this.sprite_hu_word.setSpriteFrame(new cc.Sprite('#'+QuanZhouHuRes[huType]).getSpriteFrame());
      var size = this.sprite_hu_word.getContentSize();
      this.setContentSize(size);
      this.panel_root.setContentSize(size);
      this.sprite_hu_word.setPosition(size.width*0.5,size.height*0.5);

      var sp_animation1 = ccui.helper.seekWidgetByName(this.root,"sp_animation1");
      sp_animation1.setScale(2.0);
      var size1 = sp_animation1.getContentSize();
      sp_animation1.setPosition(size.width-size1.width*0.5,size.height*0.5);
      var sp_animation2 = ccui.helper.seekWidgetByName(this.root,"sp_animation2");
      sp_animation2.setScale(2.0);
      var size2 = sp_animation2.getContentSize();
      sp_animation2.setPosition(size.width-size2.width*0.5,size.height*0.5);

      var particle = cc.ParticleSystem;

    },

    onEnter: function () {
      this._super();
      this.root.runAction(this.action);
      this.action.play('boom',false);
      //this.action.setLastFrameCallFunc(function () {
      //  JJLog.print('op play end');
      //  this.removeFromParent();
      //}.bind(this));
    },

});


var QZDahuAnim = cc.Layer.extend({
      sprite_hu_word:null,
      panel_root:null,
      huType:1,
      delayTime:0,
      showTime : 0.5,
      userSex:2,
      ziMo:false,
      ctor: function (huData) {
        this._super();
          cc.spriteFrameCache.addSpriteFrames(QZMajhongPlist.Dahu);
        this.huType = huData['huType'];
        this.userSex = huData['userSex'];
          if(this.userSex != 2 && this.userSex != 1)
          {
              this.userSex = 1;
          }
          this.ziMo =  huData['ziMo'];
          if(this.ziMo == true && this.huType == 0)
          {
              this.huType = 5;
          }
        cc.spriteFrameCache.addSpriteFrames('res/Animation/xiaohutexiao.plist');
        this.sprite_hu_word = new cc.Sprite('#'+QuanZhouHuRes[this.huType]);
        var size = this.sprite_hu_word.getContentSize();
        this.setContentSize(size);
        this.sprite_hu_word.setPosition(size.width*0.5,size.height*0.5);
        this.addChild(this.sprite_hu_word);
        this.setVisible(false);
      },

      initUI: function () {
        var size = this.sprite_hu_word.getContentSize();
        var dt = 0.1;
        this.sprite_hu_word.setOpacity(20);
        this.sprite_hu_word.setScale(2.8);
        this.sprite_hu_word.runAction(cc.sequence(
          cc.spawn(cc.scaleTo(dt,1.2),cc.fadeIn(0.1)),
          cc.moveBy(0.05,3,3),
          cc.moveBy(0.05,3,-3),
          cc.moveBy(0.05,-3,3),
          cc.moveBy(0.05,3,-3)
        ));

        dt += 0.4;
        var sp_ani1 = new cc.Sprite('#'+'cuan01.png');
        var size1 = sp_ani1.getContentSize();
        this.addChild(sp_ani1,1);
        sp_ani1.setPosition(size.width - size1.width*0.5,size.height*0.5);

        var animFrames = [];
        var str = "";
        var frame;
        for (var i = 1; i < 18; i++) {
          str = "cuan" + (i < 10 ? ("0" + i) : i) + ".png";
          frame = cc.spriteFrameCache.getSpriteFrame(str);
          animFrames.push(frame);
        }
        var anim = new cc.Animation(animFrames, 0.05);
        sp_ani1.setScale(1.5);
        sp_ani1.runAction(cc.sequence(cc.delayTime(0.2), cc.animate(anim),cc.removeSelf()));

        var sp_ani2 = new cc.Sprite('#'+'quan01.png');
        var size2 = sp_ani2.getContentSize();
        this.addChild(sp_ani2,2);
        sp_ani2.setVisible(false);
        sp_ani2.setPosition(size.width - size2.width*0.25,size.height*0.5);

        var animFrames2 = [];
        for (i = 1; i < 13;i++) {
          str = "quan" + (i < 10 ? ("0" + i) : i) + ".png";
          frame = cc.spriteFrameCache.getSpriteFrame(str);
          animFrames2.push(frame);
        }
        var anim2 = new cc.Animation(animFrames2, 0.05);
        sp_ani2.setScale(2.0);
        sp_ani2.runAction(cc.sequence(cc.delayTime(0.6),cc.show(),cc.animate(anim2),cc.removeSelf()));
        dt += 0.5;
        var num = Math.ceil(size.width/80);
        for(var i=0;i<num;i++)
        {
          var emitter = new cc.ParticleSystem("res/Animation/shanxing.plist");
          this.addChild(emitter);
          emitter.setPosition(40+80*i,0);
          emitter.setVisible(false);
          emitter.runAction(cc.sequence(cc.delayTime(0.2),cc.show()));
        }

        dt += this.showTime;
        this.delayTime = dt;

        var soundData = {};
        soundData['userSex'] = this.userSex;
          if(this.userSex != 2)
          {
              this.userSex = 1;
          }
        soundData['huType'] = this.huType;
        soundData['ziMo'] = this.ziMo;
        sound.playHu(soundData);
          if (this.huType > 0 && this.huType < 5)
          {
              cc.spriteFrameCache.addSpriteFrames('res/Animation/fenghuang.plist');
              var fenghuang_ani = new cc.Sprite('#'+'fenghuang01.png');
              fenghuang_ani.setScale(2.5);
              this.addChild(fenghuang_ani);
              fenghuang_ani.setPosition(size.width*0.5,size.height*1.5);
              var newanimFrames = [];
              for (var j = 1; j < 16; j++) {
                  str = "fenghuang" + (j < 10 ? ("0" + j) : j) + ".png";
                  frame = cc.spriteFrameCache.getSpriteFrame(str);
                  newanimFrames.push(frame);
              }
              var fenghuang = new cc.Animation(newanimFrames, 0.05);
              fenghuang_ani.runAction(cc.sequence(cc.animate(fenghuang),cc.removeSelf()));
          }
      },

      onEnter: function () {
        this._super();

      },

      runHuAnimation: function (dt) {
        this.runAction(cc.sequence(cc.delayTime(dt),cc.callFunc(this.initUI.bind(this)),
          cc.show(),cc.delayTime(MjTime.HU_SHOW_TIME),cc.callFunc(this.postResultIndex),cc.removeSelf()));
      },

      postResultIndex: function () {
        var event = new cc.EventCustom(CommonEvent.EVT_DESK_RESULT_INDEX);
        event.setUserData(ResultTag.DAHU);
        cc.eventManager.dispatchEvent(event);
      },

});


var JJZhuaNiaoAnim = cc.Layer.extend({
        sp_zhuaniao:null,
        ctor: function (posArray) {
            this._super();
            this.sp_zhuaniao = new cc.Sprite('#zhuaniao2.png');
            this.sp_zhuaniao.setPosition(640,280);
            this.sp_zhuaniao.setScale(2.0);
            this.addChild(this.sp_zhuaniao);
            var size = this.sp_zhuaniao.getContentSize();

            var sp_zhuaniao_flash = new  cc.Sprite('res/large/zhuaniao-guang.png');
            this.sp_zhuaniao.addChild(sp_zhuaniao_flash);
            sp_zhuaniao_flash.setPosition(size.width*0.5,size.height*0.5);
              sp_zhuaniao_flash.setVisible(false);
          var dt1 = 0.2;
            this.sp_zhuaniao.runAction(cc.sequence(cc.delayTime(dt1),
                                    cc.spawn(cc.scaleTo(0.25,0.9),cc.fadeTo(0.25,180)),
              cc.spawn(cc.scaleTo(0.1,1.0),cc.fadeTo(0.1,240))
                                      ,cc.delayTime(0.2),
                                      cc.spawn(cc.scaleTo(0.2,0.2),cc.rotateTo(0.2,1000)),
              cc.fadeOut(0.1),
              cc.removeSelf()
            ));
            sp_zhuaniao_flash.runAction(cc.sequence(cc.delayTime(dt1),cc.show(),
                    cc.spawn(cc.scaleTo(0.2,1.0),cc.fadeTo(0.2,180)),
                    cc.delayTime(0.2),
                      cc.fadeTo(0.1,10),
                        cc.removeSelf()
                    ));

            size = this.getContentSize();

          var niaoDt = 0.8;
          var overDt = 0.6;
          cc.spriteFrameCache.addSpriteFrames('res/Animation/birdbao.plist');

          var str = "";
          var frame;
          var usedPosArray = [];
            for(var i=0;i<posArray.length;i++)
            {

              var delayTimeLast = 0;
              if(usedPosArray.length > 0)
              {
                for(var k = 0;k < usedPosArray.length;k++)
                {
                  if(posArray[i].x == usedPosArray[k].x)
                  {
                    delayTimeLast += 0.2;
                  }
                }
              }

              //var bird = new cc.Sprite('#bird.png');
              var bird = new cc.Node();
              this.addChild(bird,2);
              bird.setVisible(false);
              bird.setScale(1.0);
              var size2 = bird.getContentSize();
              bird.setPosition(size.width*0.5,size.height*0.5);

              var flower = new cc.ParticleSystem("res/Animation/Flower.plist");
              bird.addChild(flower,1,1);
              flower.setPosition(size2.width*0.5,size2.height*0.3);

              var sp_ani1 = new cc.Sprite('#'+'yumao01.png');
              sp_ani1.setScale(2.5);
              sp_ani1.setVisible(false);
              bird.addChild(sp_ani1,1,2);
              sp_ani1.setPosition(size2.width*0.5,size2.height*0.5);

              var animaArray = new Array();
              animaArray.push(cc.delayTime(niaoDt + delayTimeLast));
              animaArray.push(cc.show());
              animaArray.push( cc.moveTo(overDt-0.2,posArray[i]));
              animaArray.push(cc.callFunc(function () {
                    this.getChildByTag(1).removeFromParent();
                    var newanimFrames = [];
                    for (var j = 1; j < 13; j++) {
                        str = "yumao" + (j < 10 ? ("0" + j) : j) + ".png";
                        frame = cc.spriteFrameCache.getSpriteFrame(str);
                        newanimFrames.push(frame);
                    }
                    var anim = new cc.Animation(newanimFrames, 0.05);
                    this.getChildByTag(2).runAction(cc.sequence(cc.show(), cc.animate(anim),cc.removeSelf()));
              }.bind(bird)));
              animaArray.push(cc.delayTime(0.65));

              if(i+1 == posArray.length)
              {
                  animaArray.push(cc.callFunc(this.postResultIndex.bind(this)));
              }
              var seq = cc.sequence(animaArray);
              bird.runAction(seq);
              usedPosArray.push(posArray[i]);
            }
        },

      removeHua: function () {

      },

      postResultIndex: function () {
        var event = new cc.EventCustom(CommonEvent.EVT_DESK_RESULT_INDEX);
        event.setUserData(ResultTag.BIRD);
        cc.eventManager.dispatchEvent(event);
        this.removeFromParent();
        // this.runAction(cc.sequence(cc.delayTime(2.0),cc.removeSelf()));
      },
  
  
});
