/**
 * Created by chenh on 16/5/26.
 */

var CCaudioEngine = cc.audioEngine;

var sound = {
    'male':1,
    'female':0,
    'putonghua':'pt_',
    'changsha':'fy_',
soundOn:true,
bgOn:true,
soundLocation:'common_',//普通话
sexType:'man',
timeUpAlarm:null,
    
stopBgSound:function()
    {
        CCaudioEngine.stopMusic();
    },
    
stopEffect:function()
    {
        CCaudioEngine.stopAllEffects();
    },
    
isBgOn:function()
    {
        var bgOn = util.getCacheItem('background_music');
        if(bgOn == 0)
        {
            return false;
        }
        
        return true
    },
    
isEffectOn:function()
    {
        var effectOn = util.getCacheItem('sound_effect');
        if(effectOn == 0)
        {
            return false;
        }
        
        return true;
    },

gameSoundQuiet:function()
{
    cc.audioEngine.setMusicVolume(0);
    cc.audioEngine.setEffectsVolume(0);
},
    
gameSoundResume:function()
{
    var soundVolume =  util.getCacheItem('effect_volume');
    var musicVolume = util.getCacheItem('music_volume');
    if(musicVolume != null && musicVolume != "" && musicVolume != undefined)
    {
        cc.audioEngine.setMusicVolume(musicVolume);
    }
    
    if(soundVolume != null && soundVolume != "" && soundVolume != undefined)
    {
        cc.audioEngine.setEffectsVolume(soundVolume);
    }

},
    
playBgSound: function () {
    
    if(!this.isBgOn())
    {
        return;
    }
    var randomNum = util.getCacheItem('backgroundmusic');
    var bgStr = 'res/audio/music/';
    if(GAMENAME == "shisanshui")
    {
        if(randomNum == 4)
        {
            bgStr += 'SSSbgm4.mp3';
        }else if(randomNum == 3)
        {
            bgStr += 'SSSbgm3.mp3';
        }else if(randomNum == 2)
        {
            bgStr += 'SSSbgm2.mp3';
        }else
        {
            bgStr += 'SSSbgm1.mp3';
        }
    }else
    {
        if(randomNum != 2)
        {
            bgStr += 'bgm1.mp3';
        }else
        {
            bgStr += 'bgm2.mp3';
        }
    }

    CCaudioEngine.playMusic(bgStr,true);
    if(!CCaudioEngine.isMusicPlaying())
    {
        CCaudioEngine.playMusic(bgStr,true);
    }
},
playMusic:function(path)
    {
        if(!this.isBgOn())
        {
            return;
        }
        CCaudioEngine.playMusic(path,false);
    },

    playNiuniuMusic:function(){
        if(!this.isBgOn())
        {
            return;
        }
        CCaudioEngine.playMusic(NiuniuSound.BG,true);
    },
    
playSound: function (path) {
    if(!this.isEffectOn())
    {
        return ;
    }
    CCaudioEngine.playEffect(path,false);
},
    playSelectCard: function () {
        if(!this.isEffectOn())
        {
            return ;
        }
        CCaudioEngine.playEffect('res/audio/effect/game_p_select_card.mp3',false);
    },

    playCardDown: function () {
        if(!this.isEffectOn())
        {
            return ;
        }
        CCaudioEngine.playEffect('res/audio/effect/game_p_discard.mp3',false);
    },
    
playBtnSound:function()
    {
        if(!this.isEffectOn())
        {
            return ;
        }
        CCaudioEngine.playEffect('res/audio/effect/audio_button_click.mp3',false);
    },
    
playPlayerEnter:function()
    {
        if(!this.isEffectOn())
        {
            return ;
        }
        CCaudioEngine.playEffect('res/audio/effect/audio_enter.mp3',false);
    },
    
playTimeUpAlarm:function()
    {
        if(!this.isEffectOn())
        {
            return ;
        }
//        this.timeUpAlarm = CCaudioEngine.playEffect('res/audio/effect/timeup_alarm.mp3',true);
    },
    
stopTimeUpAlarm:function()
    {
        if(this.timeUpAlarm != null && this.timeUpAlarm != undefined)
        {
            CCaudioEngine.stopEffect(this.timeUpAlarm);
            this.timeUpAlarm = null;
        }
        
    },
    
playCard:function(data)
    {
        var sexType = data['userSex'];
        var cardType = data['cardType'];

        //printMsg("playCard-----------1");
        
        if(!this.isEffectOn())
        {
            return;
        }
        //printMsg("playCard-----------2");
        var location = util.getCacheItem('location');
        if(location == undefined || location == null || location == 0 || location == 1)
        {
            //printMsg("playCard-----------3");
            location = this.putonghua;
        }else
        {
            //printMsg("playCard-----------4");
            location = this.changsha;
        }
        
        if(sexType == undefined || sexType == null || sexType == 1)
        {
            //printMsg("playCard-----------5");
            sexType = this.male;
        }else
        {
            //printMsg("playCard-----------6");
            sexType = this.female;
        }
       // printMsg("playCard-----------location:" + location + " sexType:" + sexType + " cardType:" + cardType);
        
        var path = 'res/MajhongBase/Resoures/'+location+sexType+'/'+cardType+'.mp3';
       // printMsg("playCard-----------path:" + path);
        CCaudioEngine.playEffect(path,false);
    },
    
playOption:function(optionData)
    {
        var sexType = optionData['userSex'];
        var optionType = optionData['optionType'];
        
        if(!this.isEffectOn())
        {
            return;
        }
        
        var location = util.getCacheItem('location');
        if(location == undefined || location == null || location == 0 || location == 1)
        {
            location = this.putonghua;
        }else
        {
            location = this.changsha;
        }
        
        if(sexType == undefined || sexType == null || sexType == 1)
        {
            sexType = this.male;
        }else
        {
            sexType = this.female;
        }
        
        
        
        switch (optionType)
        {
            case OPERATIONNAME.CHI:
            {
                optionType = 'chi1';
            }
                break;
            case OPERATIONNAME.GANG:
            {
                optionType = 'gang1';
            }
                break;
            case OPERATIONNAME.GUO:
            {
                return;
            }
                break;
            case OPERATIONNAME.BUZHANG:
            {
                optionType = 'gang1';
            }
                break;
            case OPERATIONNAME.PENG:
            {
                var x = Math.random();
                var randomNum = Math.ceil(2*x);
                JJLog.print('xx = '+x);
                optionType = 'peng'+randomNum;
            }
                break;
            case OPERATIONNAME.HU:
            {
                var x = Math.random();
                var randomNum = Math.ceil(3*x);
                JJLog.print('xx = '+x);
                optionType = 'hu'+randomNum;
            }
                break;
            case OPERATIONNAME.Gebailao:
            {
                var x = Math.random();
                var randomNum = Math.ceil(2*x);
                JJLog.print('xx = '+x);
                optionType = 'peng'+randomNum;
            }
                break;
                
        }
        var path = 'res/MajhongBase/Resoures/'+location+sexType+'/'+optionType+'.mp3';
        //JJLog.print('playCard Sound:'+path);
        CCaudioEngine.playEffect(path,false);
    },
    
playHu:function(soundData)
    {
        var sexType = soundData['userSex'];
        var huType = soundData['huType'];
        var ziMo = soundData['ziMo'];
        if(huType == 0)
        {
            return;
        }
        
        if(!this.isEffectOn())
        {
            return;
        }
        
        var location = util.getCacheItem('location');
        if(location == undefined || location == null || location == 0 || location == 1)
        {
            location = this.putonghua;
        }else
        {
            location = this.changsha;
        }
        
        if(sexType == undefined || sexType == null || sexType == 1)
        {
            sexType = this.male;
        }else
        {
            sexType = this.female;
        }
        
        huType = QuanZhouHuSound[huType];
        var path = 'res/MajhongBase/Resoures/'+location+sexType+'/'+huType+'.mp3';
        CCaudioEngine.playEffect(path,false);
    },

playYongChunHu:function(soundData)
    {
        var sexType = soundData['userSex'];
        var huType = soundData['huType'];
        var ziMo = soundData['ziMo'];
        if(huType == 0)
        {
            return;
        }

        if(!this.isEffectOn())
        {
            return;
        }

        var location = util.getCacheItem('location');
        if(location == undefined || location == null || location == 0 || location == 1)
        {
            location = this.putonghua;
        }else
        {
            location = this.changsha;
        }

        if(sexType == undefined || sexType == null || sexType == 1)
        {
            sexType = this.male;
        }else
        {
            sexType = this.female;
        }

        huType = YongChunHuSound[huType];
        var path = 'res/MajhongBase/Resoures/'+location+sexType+'/'+huType+'.mp3';
        CCaudioEngine.playEffect(path,false);
    },

    playXueZhanHu:function(soundData)
    {
        var sexType = soundData['userSex'];
        var huType = soundData['huType'];
        var ziMo = soundData['ziMo'];
        if(huType == 0)
        {
            return;
        }

        if(!this.isEffectOn())
        {
            return;
        }

        var location = util.getCacheItem('location');
        if(location == undefined || location == null || location == 0 || location == 1)
        {
            location = this.putonghua;
        }else
        {
            location = this.changsha;
        }

        if(sexType == undefined || sexType == null || sexType == 1)
        {
            sexType = this.male;
        }else
        {
            sexType = this.female;
        }

        huType = XueZhanHuSound[huType];
        var path = 'res/MajhongBase/Resoures/'+location+sexType+'/'+huType+'.mp3';
        CCaudioEngine.playEffect(path,false);
    },
    
playTianhu:function(soundData)
    {
        var sexType = soundData['userSex'];
        var huType = soundData['huType'];
        var dt = soundData['dt'];
        
        if(huType == -1)
        {
            return;
        }
        
        if(!this.isEffectOn())
        {
            return;
        }
        
        var location = util.getCacheItem('location');
        if(location == undefined || location == null || location == 0 || location == 1)
        {
            location = this.putonghua;
        }else
        {
            location = this.changsha;
        }
        
        if(sexType == undefined || sexType == null || sexType == 1)
        {
            sexType = this.male;
        }else
        {
            sexType = this.female;
        }
        
        huType = DaHuSound[huType];
        var path = 'res/MajhongBase/Resoures/'+location+sexType+'/'+huType+'.mp3';
        JJLog.print('playTianhu Sound:'+path);
        CCaudioEngine.playEffect(path,false);
    },
    
    playMsg:function(soundData)
    {
        var sexType = soundData['userSex'];
        var index = soundData['index'];
        if(index == -1)
        {
            return;
        }
        
        if(!this.isEffectOn())
        {
            return;
        }
        
        var location = util.getCacheItem('location');
        if(location == undefined || location == null || location == 0 || location == 1)
        {
            location = this.putonghua;
        }else
        {
            location = this.changsha;
        }
        
        if(sexType == undefined || sexType == null || sexType == 1)
        {
            sexType = this.male;
        }else
        {
            sexType = this.female;
        }
        
        var msgPath = "fix_msg_" + index;
        var path = 'res/MajhongBase/Resoures/'+location+sexType+'/'+msgPath+'.mp3';
        CCaudioEngine.playEffect(path,false);
    },

    playPokerMsg:function(soundData)
    {
        var sexType = soundData['userSex'];
        var index = soundData['index'];
        if(index == -1)
        {
            return;
        }

        if(!this.isEffectOn())
        {
            return;
        }

        if(sexType == undefined || sexType == null || sexType == 1)
        {
            sexType = this.male;
        }else
        {
            sexType = this.female;
        }

        var msgPath = "fix_msg_" + index;
        var path = 'res/PokerBase/Resoures/pt_'+sexType+'/'+msgPath+'.mp3';
        CCaudioEngine.playEffect(path,false);
    },

    playPokerCard:function(data)
    {
        if(!this.isEffectOn())
        {
            return;
        }

        var sexType = data['sex'];
        var cardType = data['cardsType'];
        var cards = data['cards'];
        if(sexType == undefined || sexType == null || sexType == 1)
        {
            sexType = this.male;
        }else
        {
            sexType = this.female;
        }
        var sound = null;
        if(cards.length>0)
        {
            var value = cards[0].value;
            switch (cardType)
            {
                case PuKeType.CT_SINGLE:
                    sound = '1_'+value;
                    break;
                case PuKeType.CT_DOUBLE:
                    sound = '2_'+value;
                    break;
                case PuKeType.CT_THREE:
                    sound = '3_'+value;
                    break;
                case PuKeType.CT_SINGLE_LINE:
                    sound = '1S_0';
                    break;
                case PuKeType.CT_DOUBLE_LINE:
                    sound = '2S_0';
                    break;
                case PuKeType.CT_THREE_LINE_TAKE_ONE:
                    sound = '3D1_0';
                    break;
                case PuKeType.CT_THREE_LINE_TAKE_TWO:
                    sound = '3D2_0';
                    break;
                case PuKeType.CT_FORE_LINE_TAKE_THREE:
                    var len = cards.length - 4;
                    sound = '4D'+len+"_0";
                    break;
                case PuKeType.CT_SIX_LINE_TAKE_FORE:
                    sound = 'FEIJI';
                    break;
                case PuKeType.CT_BOMB:
                    sound = 'ZHADAN';
                    break;
            }
        }else
        {
            sound = 'Pass_3'
        }
        var path = 'res/PokerBase/Resoures/pt_'+sexType+'/'+sound+'.mp3';
        CCaudioEngine.playEffect(path,false);
    },
    playSSSCardType:function(data)
    {
        var sexType = data['userSex'];
        var cardType = data['Type'];

        if(!this.isEffectOn())
        {
            return;
        }

        var location = util.getCacheItem('location');

        location = this.putonghua;

        if(sexType == undefined || sexType == null || sexType == 1)
        {
            sexType = this.male;
        }else
        {
            sexType = this.female;
        }

        var path = 'res/PokerSSS/Resoures/'+location+sexType+'/common'+cardType+'.mp3';
        CCaudioEngine.playEffect(path,false);
    },
    playSSSStartCompare:function(data)
    {
        var sexType = data['userSex'];

        if(!this.isEffectOn())
        {
            return;
        }

        var location = util.getCacheItem('location');

        location = this.putonghua;

        if(sexType == undefined || sexType == null || sexType == 1)
        {
            sexType = this.male;
        }else
        {
            sexType = this.female;
        }

        var path = 'res/PokerSSS/Resoures/'+location+sexType+'/start_compare.mp3';
        // JJLog.print('playCard Sound:'+path);
        CCaudioEngine.playEffect(path,false);
    },
    playSSSQuanleida:function(data)
    {
        var sexType = data['userSex'];

        if(!this.isEffectOn())
        {
            return;
        }

        var location = util.getCacheItem('location');

        location = this.putonghua;

        if(sexType == undefined || sexType == null || sexType == 1)
        {
            sexType = this.male;
        }else
        {
            sexType = this.female;
        }

        var path = 'res/PokerSSS/Resoures/'+location+sexType+'/'+'quanleida'+'.mp3';
        CCaudioEngine.playEffect(path,false);
    },
    playSSSPokerMsg:function(soundData)
    {
        var sexType = soundData['userSex'];
        var index = soundData['index'];
        if(index == -1)
        {
            return;
        }

        if(!this.isEffectOn())
        {
            return;
        }

        var location = util.getCacheItem('location');
        if(location == undefined || location == null || location == 0 || location == 1)
        {
            location = this.putonghua;
        }else
        {
            location = this.changsha;
        }

        if(sexType == undefined || sexType == null || sexType == 1)
        {
            sexType = this.male;
        }else
        {
            sexType = this.female;
        }

        var msgPath = "fix_msg_" + index;
        var path = 'res/PokerSSS/Resoures/'+location+sexType+'/'+msgPath+'.wav';
        CCaudioEngine.playEffect(path,false);
    },
    playSSSOnFire:function(data)
    {
        var sexType = data['userSex'];

        if(!this.isEffectOn())
        {
            return;
        }

        var location = util.getCacheItem('location');

        location = this.putonghua;

        if(sexType == undefined || sexType == null || sexType == 1)
        {
            sexType = this.male;
        }else
        {
            sexType = this.female;
        }

        var path = 'res/PokerSSS/Resoures/'+location+sexType+'/daqiang.mp3';
        CCaudioEngine.playEffect(path,false);
    },

    playQiDongCard:function(data)
    {
        var sexType = data['userSex'];
        var cardType = data['cardType'];

        if(!this.isEffectOn())
        {
            return;
        }

        var location = util.getCacheItem('location');
        if(location == undefined || location == null || location == 0 || location == 1)
        {
            location = this.putonghua;
        }else
        {
            location = this.changsha;
        }

        if(sexType == undefined || sexType == null || sexType == 1)
        {
            sexType = this.male;
        }else
        {
            sexType = this.female;
        }

        var path = 'res/MajhongQD/Resoures/'+location+sexType+'/'+cardType+'.mp3';
        CCaudioEngine.playEffect(path,false);
    },

    playQiDongOption:function(optionData)
    {
        var sexType = optionData['userSex'];
        var optionType = optionData['optionType'];

        if(!this.isEffectOn())
        {
            return;
        }

        var location = util.getCacheItem('location');
        if(location == undefined || location == null || location == 0 || location == 1)
        {
            location = this.putonghua;
        }else
        {
            location = this.changsha;
        }

        if(sexType == undefined || sexType == null || sexType == 1)
        {
            sexType = this.male;
        }else
        {
            sexType = this.female;
        }



        switch (optionType)
        {
            case OPERATIONNAME.CHI:
            {
                optionType = 'chi1';
            }
                break;
            case OPERATIONNAME.GANG:
            {
                optionType = 'gang1';
            }
                break;
            case OPERATIONNAME.GUO:
            {
                return;
            }
                break;
            case OPERATIONNAME.BUZHANG:
            {
                optionType = 'gang1';
            }
                break;
            case OPERATIONNAME.PENG:
            {
                var x = Math.random();
                var randomNum = Math.ceil(2*x);
                JJLog.print('xx = '+x);
                optionType = 'peng'+randomNum;
            }
                break;
            case OPERATIONNAME.HU:
            {
                var x = Math.random();
                var randomNum = Math.ceil(3*x);
                JJLog.print('xx = '+x);
                optionType = 'hu'+randomNum;
            }
                break;
            case OPERATIONNAME.Gebailao:
            {
                optionType = 'gebaida';
            }
                break;

        }
        var path = 'res/MajhongQD/Resoures/'+location+sexType+'/'+optionType+'.mp3';
        //JJLog.print('playCard Sound:'+path);
        CCaudioEngine.playEffect(path,false);
    },
    playQiDongMsg:function(soundData)
    {
        var sexType = soundData['userSex'];
        var index = soundData['index'];
        if(index == -1)
        {
            return;
        }

        if(!this.isEffectOn())
        {
            return;
        }

        var location = util.getCacheItem('location');
        if(location == undefined || location == null || location == 0 || location == 1)
        {
            location = this.putonghua;
        }else
        {
            location = this.changsha;
        }

        if(sexType == undefined || sexType == null || sexType == 1)
        {
            sexType = this.male;
        }else
        {
            sexType = this.female;
        }

        var msgPath = "fix_msg_" + index;
        var path = 'res/MajhongQD/Resoures/'+location+sexType+'/'+msgPath+'.mp3';
        CCaudioEngine.playEffect(path,false);
    },


}