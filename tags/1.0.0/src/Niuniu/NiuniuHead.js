var NiuniuHead = cc.Layer.extend({
    panel_root:null,
    panel_info:null,
    text_name:null,
    text_id:null,
    text_ip:null,//低分
    playerData:null,
    sprite_head:null,

    ctor:function(_data){
        this._super();
        var root = ccs.load(NiuniuJson.Head).node;
        this.addChild(root);

        console.log("over view -=====");
        console.log(_data);
        this.playerData = _data;
        this.panel_root = ccui.helper.seekWidgetByName(root,"panel_root");
        this.panel_root.setTouchEnabled(true);
        this.panel_root.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));

        this.sprite_head = ccui.helper.seekWidgetByName(root,"img_head");
        this.panel_info = ccui.helper.seekWidgetByName(root,"panel_info");

        this.text_name = ccui.helper.seekWidgetByName(root,"text_name");
        this.text_id = ccui.helper.seekWidgetByName(root,"text_id");
        this.text_ip = ccui.helper.seekWidgetByName(root,"text_ip");

        this.text_name.setString(_data["nickName"]);
        this.text_id.setString(_data["uid"]);
        this.text_ip.setString(_data["ip"]);

        this.loadHead();

    },

    loadHead:function()
    {

        if (this.playerData != null && this.playerData.headUrl != undefined && this.playerData.headUrl.length > 0) {
            if(this.playerData.headUrl.substring(this.playerData.headUrl.length-1,this.playerData.headUrl.length) == "0")
            {
                this.playerData.headUrl = this.playerData.headUrl.substring(0,this.playerData.headUrl.length-1)+"96";
            }
            var tex = util.getTextureForKey(this.playerData.headUrl);
            if (tex != null && tex != undefined) {
                var size = this.sprite_head.getContentSize();
                var sprite = new cc.Sprite(tex);
                var size_sp = sprite.getContentSize();
                sprite.setScaleX(size.width/size_sp.width);
                sprite.setScaleY(size.height/size_sp.height);
                sprite.setAnchorPoint(cc.p(0, 0));
                this.sprite_head.addChild(sprite);
            } else {
                cc.loader.loadImg(this.playerData.headUrl,{isCrossOrigin : true },
                    function (err, tex) {
                        JJLog.print(err, tex);
                        if (err == null) {
                            var size = this.sprite_head.getContentSize();
                            var sprite = new cc.Sprite(tex);
                            var size_sp = sprite.getContentSize();
                            sprite.setScaleX(size.width/size_sp.width);
                            sprite.setScaleY(size.height/size_sp.height);
                            sprite.setAnchorPoint(cc.p(0, 0));
                            this.sprite_head.addChild(sprite);
                        }
                    }.bind(this));
            }
        }
    },

    showDialog: function () {
        cc.director.getRunningScene().addChild(this);
    },


});