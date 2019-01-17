var InputDailog = cc.Layer.extend({
    updateCallback: null,
    mRoot:null,
    ctor: function (cb) {
        this._super();
        var root = ccs.load(WHMajhongJson.CardInput).node;
        this.addChild(root);
        this.mRoot = root;
        this.updateCallback = cb;
        this.input_pack_name = ccui.helper.seekWidgetByName(root, "input_pack_name");

        var btn_ok = ccui.helper.seekWidgetByName(root, "btn_ok");
        btn_ok.addClickEventListener(function () {
            this.handleResult();
            this.removeFromParent();
        }.bind(this));
        var btn_cancel = ccui.helper.seekWidgetByName(root, "btn_cancel");
        btn_cancel.addClickEventListener(function () {
            this.removeFromParent();
        }.bind(this));
    },
    onEnter: function () {
        this._super();
        this.input_pack_name = util.ChangeTextField2EditBox(ccui.helper.seekWidgetByName(this.mRoot,"input_pack_name"));
    },
    handleResult: function () {
        var str = this.input_pack_name.getString();
        var cb = this.updateCallback;
        if (str != "") {
           var num= str.replace(/[^0-9.]/ig,"");
           if (cb) {
                cb(parseFloat(num));
           }
        }
    },
    show: function () {
        cc.director.getRunningScene().addChild(this);
    }
});