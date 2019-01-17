var NiuniuCard = ccui.Image.extend({
    _cardType:0,
    _cardValue:0,
    _cardPath:"",
    _key:"",
    ctor: function (_data) {
        this._super();
        this._cardType = _data["type"];
        this._cardValue = _data["value"];
        this._key = this._cardType +"" +this._cardType;
        this._cardPath = CardPath["this._key"];

    },
});