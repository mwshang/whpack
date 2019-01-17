/**
 * Created by atom on 2016/7/24.
 */
var SSSGameDesk = cc.Layer.extend({
    ctor: function () {
        this._super();
        var root = ccs.load(SSSPokerJson.Desk).node;
        this.addChild(root);
        var node_players = [];
        for(var i = 0; i<8;i++)
        {
            var node = ccui.helper.seekWidgetByName(root,"node"+i);
            node_players.push(node);
        }

        if(MajhongInfo.GameMode == GameMode.PLAY)
        {
            for(var i=0;i< SSSPoker.table.seatArray.length;i++)
            {
                var info = SSSPoker.table.seatArray[i];
                if(info!= undefined && info!= null)
                {
                    var index = SSSPoker.table.uidofPos(info.uid);
                    var totalPerson = SSSPoker.table.SEAT_TOTAL;
                    if(SSSPoker.table.shuangJiang == 1)
                    {
                        totalPerson += totalPerson;
                    }

                    if(index==0)
                    {
                        var selfseat = new SSSSelfSeat(info);
                        node_players[index].addChild(selfseat);
                    }else
                    {
                        var seat;
                        if(index < 5){
                            seat = new SSSLeftSeat(info);
                        }else
                        {
                            seat = new SSSRightSeat(info);
                        }
                        node_players[index].addChild(seat);
                        if(totalPerson < 8)
                        {
                            var offPos = SSSDESKOFFPOSITIONS[totalPerson][index];
                            if(offPos != null)
                                node_players[index].setPosition(cc.pAdd(node_players[index].getPosition(),offPos));
                        }
                    }

                }
            }
        }

    },

    onEnter:function(){
        this._super();
    }
});