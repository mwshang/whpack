
var util = {
  verifyIDNum: function(idcard) {
    var Errors=new Array(
      "验证通过!",
      "身份证号码位数不对!",
      "身份证号码出生日期超出范围或含有非法字符!",
      "身份证号码校验错误!",
      "身份证地区非法!");

    var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",
              31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
              41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",
              61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}

    var idcard,Y,JYM;
    var S,M;
    var idcard_array = new Array();
    idcard_array = idcard.split("");
    //地区检验
    if(area[parseInt(idcard.substr(0,2))]==null) return Errors[4];
    //身份号码位数及格式检验
    switch(idcard.length){
      case 15:
        if ( (parseInt(idcard.substr(6,2))+1900) % 4 == 0 || ((parseInt(idcard.substr(6,2))+1900) % 100 == 0 &&
            (parseInt(idcard.substr(6,2))+1900) % 4 == 0 )){
              ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
        } else {
              ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
        }

        if(ereg.test(idcard)) return Errors[0];
        else return Errors[2];

        break;
      case 18:
      //18位身份号码检测
      //出生日期的合法性检查
      //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
      //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
        if ( parseInt(idcard.substr(6,4)) % 4 == 0 || (parseInt(idcard.substr(6,4)) % 100 == 0 &&
            parseInt(idcard.substr(6,4))%4 == 0 )){
            ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
        } else {
            ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
        }

        if(ereg.test(idcard)){//测试出生日期的合法性
              //计算校验位
            S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
             + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
             + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
             + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
             + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
             + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
             + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
             + parseInt(idcard_array[7]) * 1
             + parseInt(idcard_array[8]) * 6
             + parseInt(idcard_array[9]) * 3 ;
             Y = S % 11;
             M = "F";
             JYM = "10X98765432";
             M = JYM.substr(Y,1);//判断校验位
             if(M == idcard_array[17]) return Errors[0]; //检测ID的校验位
             else return Errors[3];
       }
       else return Errors[2];
       break;
       default:
         return Errors[1];
       break;
    }

  },

  setCacheItem: function(key, value) {
//    if (cc.sys.localStorage.getItem(key) == undefined)
      cc.sys.localStorage.setItem(key, value);
  },

  getCacheItem: function(key) {
    return cc.sys.localStorage.getItem(key);
  },

  removeCacheItem: function(key) {
    cc.sys.localStorage.removeItem(key);
  },

  uuid: function(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  },

  textureCache : [],

  cacheImage : function(path, image) {
      this.textureCache[path] = image;
  },

  getTextureForKey: function(path) {
      return this.textureCache[path];
  },
  getWXAppInstalled:function() {
    var install = false;
    if (cc.sys.os == cc.sys.OS_IOS) {
        install = jsb.reflection.callStaticMethod("NativeOcClass",
                                                  "getWXAppInstalled");
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        install = jsb.reflection.callStaticMethod("com/luminositygame/wxapi/AppActivity",
                                                  "getWXAppInstalled", "()Z");
    }
    return install;
  },
copyLabel:function(content){
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("NativeOcClass",
                                        "copyLabel:", ''+content);
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod("com/luminositygame/wxapi/AppActivity",
                                        "copyLabel", "(Ljava/lang/String;)V", content);
    }
},
    
getCopyLabel:function(){
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod("NativeOcClass",
                                        "getCopyLabel");
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod("com/luminositygame/wxapi/AppActivity",
                                        "getCopyLabel", "()V");
    }
},
  getNativeVersion:function() {
    var version = 0x010000;
    console.log('getNativeVersion default:'+version);
    try {
      if (cc.sys.os == cc.sys.OS_IOS) {
        version = jsb.reflection.callStaticMethod("NativeOcClass",
          "getNativeVersion");
      } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        version = jsb.reflection.callStaticMethod("com/luminositygame/wxapi/AppActivity",
          "getNativeVersion", "()I");
      }
    } catch (e) {
      console.log('getNativeVersion', e);
    }

    console.log('getNativeVersion:'+version);
    return version;
  },

    getDistance: function(lon1, lat1, lon2, lat2) {
        var DEF_PI180 = 0.01745329252; // PI/180.0
        var radLat1 = lat1*DEF_PI180;
        var radLat2 = lat2*DEF_PI180;
        var a = radLat1 - radLat2;
        var b = lon1*DEF_PI180 - lon2*DEF_PI180;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2)+Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
        s = s * 6378137;
        return s.toFixed(0);;
    },
    LoadHead: function (parent, headUrl) {
        if (!cc.sys.isNative || !headUrl) {
            return;
        }
        var savePath = "";
        savePath = "WxHeadCache/" + hex_md5(headUrl) + ".png";

        var createHead = function (tex) {
            parent.removeAllChildren();
            var size = parent.getContentSize();
            size.width += 5;
            size.height += 5;
            var layer = new ccui.Layout();
            layer.setContentSize(size);
            parent.addChild(layer, 1000);

            var sprite = new cc.Sprite(tex);

            var size_sp = sprite.getContentSize();
            sprite.setScaleX(size.width / size_sp.width);
            sprite.setScaleY(size.height / size_sp.height);

            sprite.setPosition(cc.p(size.width / 2, size.height / 2));
            layer.addChild(sprite);

        };
        var cachePath = jsb.fileUtils.getWritablePath() + savePath;
        if (jsb.fileUtils.isFileExist(cachePath)) {
            createHead(cachePath);
        } else {
            cc.loader.loadImg(
                headUrl,
                {isCrossOrigin: true},
                function (err, tex) {
                    if (err == null && tex != null) {
                        createHead(tex);
                        util.CacheImage(tex, savePath);
                    } else {

                    }
                }
            );
        }
    },

    CacheImage: function (tex, savePath) {
        if (typeof (tex) != "string") {
            var saveSprite = new cc.Sprite(tex);
            //必须要再绘制区域内
            saveSprite.setPosition(cc.p(saveSprite.width / 2, saveSprite.height / 2));
            cc.director.getRunningScene().addChild(saveSprite, 255);

            var tmpurl = jsb.fileUtils.getWritablePath() + savePath;
            var index = tmpurl.lastIndexOf('/');
            var path = tmpurl.substring(0, index);
            if (!jsb.fileUtils.isDirectoryExist(path)) {
                jsb.fileUtils.createDirectory(path);
            }
            var renderTexture = cc.RenderTexture.create(
                saveSprite.width,
                saveSprite.height,
                cc.Texture2D.PIXEL_FORMAT_RGBA8888,
                gl.DEPTH24_STENCIL8_OES
            );

            renderTexture.begin();
            saveSprite.visit();
            renderTexture.end();
            saveSprite.setVisible(false);
            renderTexture.saveToFile(savePath, 1, true, function () {
                saveSprite.removeFromParent();
            });
        }
    },

    //调用此方法 必选要再onEnter里使用
    ChangeTextField2EditBox : function (textField) {
        if(!textField) return;
        var eSize = textField.getContentSize();
        var ePosition = textField.getPosition();
        var eParent = textField.parent;
        var eName = textField.getName();
        var eTag = textField.getTag();
        var eFontSize = textField.getFontSize();
        var eFontColor = textField.getColor();
        var eFontName = textField.getFontName();
        var ePlaceHolderStr =  textField.getPlaceHolder();
        var ePlaceHolderColor = eFontColor; //textField.getPlaceHolderColor();
        var eMaxLength = textField.getMaxLength();
        var eIsPassW   = textField.isPasswordEnabled();
        var ePassWT = textField.getPasswordStyleText();


        var editBox = new cc.EditBox(eSize , new cc.Scale9Sprite("res/Default/Tran_1.png"));
        editBox.setPosition(ePosition);
        editBox.setName(eName);
        editBox.setTag(eTag);
        editBox.setFontSize(eFontSize);
        editBox.setFontColor(cc.color(0,0,0 , 255)); //设置默认颜色
        editBox.setFontName(eFontName);

        editBox.setPlaceHolder(ePlaceHolderStr);
        editBox.setPlaceholderFontName(eFontName);
        editBox.setPlaceholderFontSize(eFontSize);
        if(eIsPassW){
            editBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_PASSWORD);
        }
        if(textField.isMaxLengthEnabled()){
            editBox.setMaxLength(eMaxLength);
        }

        eParent.addChild(editBox);

        //重写方法
        editBox.setPlaceHolderColor = editBox.setPlaceholderFontColor;
        editBox.setTextColor = editBox.setFontColor;


        textField.removeFromParent();
        return editBox;
    },
    transformAsEditBox:function(node) {
      var sz = node.getContentSize()
      // var eb = new cc.EditBox(
      //         sz, 
      //         ccui.Scale9Sprite.create(
                
      //           ))
      
      var eb = new cc.EditBox(sz , new cc.Scale9Sprite("res/Default/Tran_1.png"));
      
      eb.setAnchorPoint(node.getAnchorPoint())
      eb.setPosition(node.getPosition())
      eb.setFontName(node.getFontName())
      eb.setFontSize(node.getFontSize())
      eb.setFontColor(node.getColor())
      eb.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE) 
      eb.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE) 
      eb.setGlobalZOrder(node.getGlobalZOrder())
      //eb.ignoreContentAdaptWithSize(node.isIgnoreContentAdaptWithSize())
      //eb.ignoreContentAdaptWithSize(false)

      //eb.setText(node.getString())
      eb.setPlaceHolder(node.getString())
      // eb.setInputMode(2) -- NUMERIC
      // eb.setMaxLength(20)
      // eb.registerScriptEditBoxHandler(cb)
      // eb.getText()
      node.getParent().addChild(eb)
      node.setVisible(false)
      return eb
    }

};

