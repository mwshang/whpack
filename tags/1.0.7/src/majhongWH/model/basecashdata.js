var basecashdata = {
	curBaseCash:0.05,//
	curBaseCashDesc:"底金:半分",
	baseCashs:[
          {score:0.03,desc:"底金:0.3分"},
          {score:0.05,desc:"底金:半分"},
          {score:0.1,desc:"底金:1分"},
          {score:0.2,desc:"底金:2分"},
          {score:0.3,desc:"底金:3分"},
          {score:0.5,desc:"底金:5分"},
          // {score:1,desc:"底金:1条"},
          // {score:2,desc:"底金:2条"},
          {score:-1,desc:"自定义"}
        ],
    getBaseCashDesc:function(score) {
    	var desc = "底金:"  + score;
    	for(var j = 0,len = basecashdata.baseCashs.length; j < len; j++){
	          if (basecashdata.baseCashs[j].score == score) {
	            desc = basecashdata.baseCashs[j].desc;
	            break;
	          }
	    }
	    return desc;
    },
    setBaseCash:function(score) {
    	if (basecashdata.curBaseCash != score) {
    		basecashdata.curBaseCash = score
    		basecashdata.curBaseCashDesc = basecashdata.getBaseCashDesc(score);
    	}
    }
};