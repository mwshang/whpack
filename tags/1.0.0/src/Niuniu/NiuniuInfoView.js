/**
 * Created by chenhua on 2017/11/4.
 */
var NiuniuInfoView = cc.Layer.extend({
    panel_root:null,
    panel_1:null,
    text_wanfa:null,//玩法
    text_difen:null,
    text_fanbei:null,//翻倍
    text_guize:null,//规则
    text_sp:null,//
    _room:null,
    ctor:function(_data){
        this._super();
        var root = ccs.load(NiuniuJson.Info).node;
        this.addChild(root);
        //this._room = _data["room"];
        var info = _data;//["room"];//this._room["data"];
        console.log("NiuniuInfoView view -=====");
        console.log(_data);

        this.panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
        this.panel_root.setTouchEnabled(true);
        this.panel_root.addClickEventListener(function(data){

           this.removeFromParent();

        }.bind(this));

        this.panel_1 = ccui.helper.seekWidgetByName(root,"panel_1");

        this.text_wanfa = ccui.helper.seekWidgetByName(this.panel_1,"text_wanfa");

        this.text_difen = ccui.helper.seekWidgetByName(root,"text_difen");
        this.text_fanbei = ccui.helper.seekWidgetByName(this.panel_1,"text_fanbei");
        this.text_guize = ccui.helper.seekWidgetByName(this.panel_1,"text_guize");
        this.text_sp = ccui.helper.seekWidgetByName(this.panel_1,"text_sp");
        if(info["wanfa"] == 1){
            this.text_wanfa.setString("通比牛牛");
        }else if(info["wanfa"] == 2){
            this.text_wanfa.setString("赢家上庄");
        }else if(info["wanfa"] == 3){
            this.text_wanfa.setString("明牌抢庄");
        }

        this.text_difen.setString(info["difen"])
        if(info["aaGem"] == 0){
            this.text_guize.setString("房主付费");
        }else if(info["aaGem"] == 1){
            this.text_guize.setString("AA付费");
        }else if(info["aaGem"] == 2){
            this.text_guize.setString("赢家付费");
        }

        if(info["fanBei"] == 1){
            this.text_fanbei.setString("牛牛x3 牛九x2 牛八x2");
        }else if(info["fanBei"] == 2){
            this.text_fanbei.setString("牛牛x4 牛九x3 牛八x2 牛七x2");
        }



        if(info["spePai"] == 1){
            this.text_sp.setString("五花牛(5倍)");
        }else if(info["spePai"] == 2){
            this.text_sp.setString("炸弹牛(6倍)");
        }else if(info["spePai"] == 4){
            this.text_sp.setString("五小牛(8倍)");
        }else if(info["spePai"] == 6){
            this.text_sp.setString("炸弹牛(6倍),五花牛(5倍)");
        }else if(info["spePai"] == 7){
            this.text_sp.setString("五花牛(5倍),炸弹牛(6倍),五小牛(8倍)");
        }else if(info["spePai"] == 3){
            this.text_sp.setString("五花牛(5倍),炸弹牛(6倍)");
        }else if(info["spePai"] == 5){
            this.text_sp.setString("五花牛(5倍),五小牛(8倍)");
        }else{
            this.text_sp.setString("无");
        }


        this.text_difen.setString(info["difen"]);

    },

    onEnter: function () {
        this._super();

    },

    onExit:function(){

        this._super();
    },




});