
var printMsg = function(msg) {
    // jsb.reflection.callStaticMethod("com/luminositygame/wxapi/AppActivity",
    //     "printMsg", "(Ljava/lang/String;)V",msg);
};

var __failCount = 0;
var AssetsManagerLoaderScene = cc.Scene.extend({
    _am:null,
    _progress:null,
    _hotVersion:0,
   //_localVersion:0,
    panel_tip:null,
    text_tip:null,
    // panel_newVersionTip:null,
    // newVersion_text_tip:null,
    failReason:0,
    _listener:null,
    getVersionInteger: function(version){
        if(!version || typeof version !== "string") return 0;
        var arr = version.split(".");
        var num = 0;
        arr.forEach(function(n, i){
            num += n * Math.pow(10, 3 - i);
        });
        return num;
    },
    run:function(){
        printMsg("run----------------1");
        if (!cc.sys.isNative) {
            printMsg("run----------------2");
            this.loadGame();
            return;
        }

        var local_cv_path = this.prepareURL("res/local_cv.txt");
        if(!jsb.fileUtils.isFileExist(local_cv_path))                //为了兼容老版本，如果缓存里面没有local_cv.txt 则清理一次缓存
        {
            var path = jsb.fileUtils.getWritablePath()+ "qipai/";
            jsb.fileUtils.removeDirectory(path);
        }
        printMsg("run----------------3");
        if(!jsb.fileUtils.isFileExist("res/cv.txt"))
        {
            printMsg("run----------------4");
            this.onStartGame();
        }
        else
        {
            printMsg("run----------------5");
            cc.loader.loadTxt("res/cv.txt",function(err,data){
                var version = data;
                var local_cv_path = this.prepareURL("res/local_cv.txt");
                // console.log("local_cv_path===",local_cv_path);
                printMsg("run----------------6");
                if(jsb.fileUtils.isFileExist(local_cv_path))
                {
                    //console.log("文件已存在",version);
                    printMsg("run----------------7");
                    cc.loader.loadTxt(local_cv_path,function(err,data){
                        // console.log("手机当前版本====",data);
                        // console.log("新的版本===",version);
                        //console.log("data  version",data+"/"+version);
                        printMsg("run----------------8");
                        if(data != version)
                        {
                            printMsg("run----------------9");
                            // console.log("删除缓存",local_cv_path);
                            var path = jsb.fileUtils.getWritablePath()+ "qipai/";
                            jsb.fileUtils.removeDirectory(path);
                            cc.game.restart();
                            return;
                        }
                        printMsg("run----------------10");
                        this.onStartGame();
                    }.bind(this));
                }else{
                    //console.log("文件不存在",version);
                    printMsg("run----------------11");
                    jsb.fileUtils.writeStringToFile(version,local_cv_path);
                    this.onStartGame();
                }
            }.bind(this));
        }
    },

    onStartGame:function()
    {
        cc.loader.load(["res/MajhongWH/WuHanDownLoad.json"], function() {
            var root = ccs.load("res/MajhongWH/WuHanDownLoad.json").node;
            this.addChild(root);
            this._progress = ccui.helper.seekWidgetByName(root,"LoadingBar");
            this.panel_tip = ccui.helper.seekWidgetByName(root,"img_tip");
            this.text_tip = ccui.helper.seekWidgetByName(root,"text_des");
            var btn = ccui.helper.seekWidgetByName(root,"btn_confirm");
            btn.addClickEventListener(this.downloadAgain.bind(this));
        }.bind(this));
        this.createListener();
        cc.director.runScene(this);
    } ,

    prepareURL:function(url){
        var tmpurl = jsb.fileUtils.getWritablePath() + "qipai/"+ url;
        var index = tmpurl.lastIndexOf('/');
        var path = tmpurl.substring(0,index);
        if(!jsb.fileUtils.isDirectoryExist(path))
        {
            console.log("111111",path);
            jsb.fileUtils.createDirectory(path);
        }

        return tmpurl;
    },

    createListener:function(){

        if(this._am != null)
        {
            this._am.release();
            this._am = null;
        }
        if(this._listener != null)
        {
            cc.eventManager.removeListener(this._listener);
        }
        var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./") +"qipai/";

       this._am = new jsb.AssetsManager("res/project.manifest", storagePath);
       this._am.retain();
       if (!this._am.getLocalManifest().isLoaded())
       {
       this.apkBreak();
       return;
       }
        var that = this;
        this._listener = new jsb.EventListenerAssetsManager(this._am, function(event) {
            that.failReason =event.getEventCode();
            switch (event.getEventCode()){
                case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFESTERROR_NO_LOCAL_MANIFEST:
                    that.downloadFail("ERROR_NO_LOCAL_MANIFEST");
                    break;
                case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                    // that._hotVersion = that._am.getRemoteManifest().getVersion();
                    that.updateProgress(event.getPercent());
                    var msg = event.getMessage();
                    if (msg) {
                        console.log(msg);
                    }
                    break;
                case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                {
                    __failCount ++;
                    if(__failCount < 5)
                    {
                        cc.setTimeout(function() {
                            that.createListener();
                        }, 1000);
                    }else{
                        that.networkFail("ERROR_DOWNLOAD_MANIFEST");
                    }

                }
                    break;
                case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                    that.downloadFail("ERROR_PARSE_MANIFEST");
                    break;
                case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                case jsb.EventAssetsManager.UPDATE_FINISHED:
                    console.log("updatefinish");
                    that.loadGame();
                    break;
                case jsb.EventAssetsManager.UPDATE_FAILED:
                    __failCount ++;
                    if (__failCount < 5)
                    {
                        that._am.downloadFailedAssets();
                    }else{
                        that.downloadFail("UPDATE_FAILED");
                    }
                    break;
                case jsb.EventAssetsManager.ERROR_UPDATING:
                    that.downloadFail("ERROR_UPDATING:"+event.getMessage());
                    break;
                case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                    that.downloadFail(event.getMessage());
                    break;
                default:
                    break;
            }});
        cc.eventManager.addListener(this._listener, 1);
        this._am.update();
    },

    downloadAgain:function(){
        if(this.failReason == 0)
        {
            return;
        }
        this.panel_tip.setVisible(false);
        __failCount = 0;
        this.updateProgress(0);
        if(this.failReason == 1)
        {
            this.createListener();
        }else
        {
            this._am.downloadFailedAssets();
        }

    },

    apkBreak:function(){
        this.text_tip.setString("游戏资源损坏，请重新下载游戏!");
        this.panel_tip.setVisible(true);
    },
    downloadFail:function(reason){
        this.text_tip.setString("资源更新失败!\n"+reason);
        this.panel_tip.setVisible(true);
    },
    networkFail:function(reason){
        this.text_tip.setString("更新失败!请检查您的网络连接\n"+reason);
        this.panel_tip.setVisible(true);
    },

    loadGame:function(){
        printMsg("loadGame----------------1");
        if (cc.sys.isNative && this.panel_tip!= null) {
            this.panel_tip.setVisible(false);
        }
        var _this = this;
        cc.loader.loadJs(["src/jsList.js"], function(err){
            cc.loader.loadJs(jsList, function(err){
                cc.loader.load(hall.uiRes, function() {
                    _this.updateProgress(100);
                    cc.director.runScene(new SangongLoginScene());
                });
            });
        });
    },
    updateProgress:function(percent){
        if (!!this._progress)
        {
            this._progress.setPercent(percent);
        }
    },
    onExit:function(){
        console.log("AssetsManager::onExit");

        this._am.release();
        this._super();
    }
});

var HelloWorldLayer = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        //var root = ccs.load("res/poke.json").node;

        //this.addChild(root);
//        var poke1 = new poke();
//        this.addChild(poke1);
//        poke1.x = 640;
//        poke1.y = 360;

//        poke1.showFrontWithAnimation();
//        return true;
        // /////////////////////////////
        // // 2. add a menu item with "X" image, which is clicked to quit the program
        // //    you may modify it.
        // // ask director the window size
        var size = cc.director.getWinSize();

        // /////////////////////////////
        // // 3. add your codes below...
        // // add a label shows "Hello World"
        // // create and initialize a label
        this.helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
        // position the label on the center of the screen
        this.helloLabel.x = size.width / 2;
        this.helloLabel.y = 0;
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        // var lazyLayer = cc.Layer.create();
        // this.addChild(lazyLayer);

        // // add "HelloWorld" splash screen"
        // this.sprite = cc.Sprite.create(res.HelloWorld_png);
        // this.sprite.attr({
        //     x: size.width / 2,
        //     y: size.height / 2,
        //     scale: 0.5,
        //     rotation: 180
        // });
        // lazyLayer.addChild(this.sprite, 0);

        // var rotateToA = cc.RotateTo.create(2, 0);
        // var scaleToA = cc.ScaleTo.create(2, 1, 1);

        // this.sprite.runAction(cc.Sequence.create(rotateToA, scaleToA));
        // this.helloLabel.runAction(cc.Spawn.create(cc.MoveBy.create(2.5, cc.p(0, size.height - 40)),cc.TintTo.create(2.5,255,125,0)));

        // var mylistener = qp.event.listen(qp.event.types.hall_login, function(msg) {
        //     JJLog.print(msg);
        //     _this.init(_this);

        //     hall.enterGame('com.qp.douniu.douniu', 1, function(data) {
        //         JJLog.print(data);
        //     });
        //     // qp.event.stop(mylistener);
        // });

        //hall.net.checkVersion('ios', function(data) {
        //    JJLog.print(data);

//        // hall.net.register("1", 'bruceyang', 'bruceyang', 'bruceyang', function(data) {
//        //     JJLog.print(data);
//        // });
//
//

        //hall.net.login("1", 'bruceyang', 'bruceyang', function(data) {
        //    JJLog.print(data);

        // _this.init(_this);
//                hall.enterGame('com.qp.douniu.douniu', 1, function(data) {
//                JJLog.print(data);

//              qp.net.request('gamehttp.httpHandler.httpHandlerTest',
//                {uid: hall.user.uid},
//                function(resp) {
//                  JJLog.print(resp);
//                });

        //      hall.net.createSafeBox('123', function(data) {
        //        JJLog.print(data);
        //      });
        //    });
        //});


        //var mycards = new sangong.HandCard();
        //mycards.parse(["D5","S3","C4"]);
        //var otherCards = new sangong.HandCard();
        //otherCards.parse(["S1", "H11", "D1"]);
        //JJLog.print(mycards.compare(otherCards.cards, otherCards.cardType));
        //JJLog.print(otherCards.compare(mycards.cards, mycards.cardType));
//      JJLog.print(util.verifyIDNum('510824198407231937'));

        //JJLog.print(Math.random());

        //var handcards = mycards.getLuckCards([80, 10]);
        //
        //JJLog.print(handcards);


        var pool = new majhong.Pool();
        var pais = pool.faPai_debug();

        var seat0 = new majhong.Seat(0);
        //var seat1 = new majhong.Seat(1);
        //var seat2 = new majhong.Seat(2);
        //var seat3 = new majhong.Seat(3);

        //seat0.faPai(['W2','W2','W5','W8','W8','W8', 'B2', 'B5','B8','B8','T5','T5','T5']);
        //seat0.faPai(['T1','T1','T1','T2','T3','T4', 'T5', 'T5','T5','T7','T7','T7','T9']);
        //seat0.faPai(['T1','T1','T1','T1','B2','B2', 'B2', 'B2','B5','B5', 'B5', 'T8','T8']);
        //seat0.faPai(['T6','T7','B1','B2','B2', 'B2', 'B3','B5','B6', 'B7']);
        seat0.faPai(['W3','W4', 'W4', 'W5', 'W5', 'W5', 'W6', 'W6', 'B8', 'B8']);
        //seat0.faPai(pais['0']);
        //seat1.faPai(pais['1']);
        //seat2.faPai(pais['2']);
        //seat3.faPai(pais['3']);

        //seat0.delPai({type:'B', value:3});
        //var pai = pool.qiPai();
        //seat1.addPai(pai);
        //seat0.delPai(new majhong.Pai(pai));
        //seat0.checkTianHu();
        //JJLog.print(seat0.tianhuChoice);

//        seat0.paiPeng['B'] = [{type:'B',value:7}, {type:'B',value:7},{type:'B',value:7}, {type:'B',value:6},{type:'B',value:6},{type:'B',value:6}];
//        seat0.paiChi['W'] = [{type:'B',value:2}, {type:'B',value:3},{type:'B',value:4}];
//        seat0.paiQi['W'] = [{type:'B',value:4}, {type:'B',value:4}, {type:'B',value:5},{type:'B',value:5}];
//        seat0.paiQi['B'] = [{type:'B',value:6}];

//        JJLog.print(seat0.CheckTING());
//        JJLog.print(seat0.checkGang(null));
//        JJLog.print(seat0.gangChoice);
        //JJLog.print(seat0.checkPeng({type:'B', value:3}));
        console.log(seat0.checkHu({type:'W', value:7}));

        //JJLog.print(seat0.tianhuChoice);

        //seat1.chiPai(0, {type:'W', value:3});
        //JJLog.print(seat0.CheckTING());

        return true;
    },

    init : function(_this) {

        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.director.getWinSize();

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        _this.helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
        // position the label on the center of the screen
        _this.helloLabel.x = size.width / 2;
        _this.helloLabel.y = 0;
        // add the label as a child to this layer
        _this.addChild(_this.helloLabel, 5);

        var lazyLayer = cc.Layer.create();
        _this.addChild(lazyLayer);

        // add "HelloWorld" splash screen"
        // _this.sprite = cc.Sprite.create(res.HelloWorld_png);
        // _this.sprite.attr({
        //     x: size.width / 2,
        //     y: size.height / 2,
        //     scale: 0.5,
        //     rotation: 180
        // });
        // lazyLayer.addChild(_this.sprite, 0);

        var rotateToA = cc.RotateTo.create(2, 0);
        var scaleToA = cc.ScaleTo.create(2, 1, 1);

        // _this.sprite.runAction(cc.Sequence.create(rotateToA, scaleToA));
        _this.helloLabel.runAction(cc.Spawn.create(cc.MoveBy.create(2.5, cc.p(0, size.height - 40)),cc.TintTo.create(2.5,255,125,0)));

    }

});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});




