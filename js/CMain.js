var defaultLifeCycle = AQCore.defaultLifeCycle;
var Utils = AQCore.Utils;

function CMain(oData) {
  
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData = {};

    var _oPreloader;
    var _oMenu;
    var _oModeMenu;
    var _oHelp;
    var _oGame;
    var _props = oData.props;
    var _additionalInfo = _props.data.additionalInfo; 
   

    this.initContainer = function () {
    
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        s_oStage.preventSelection = true;
        createjs.Touch.enable(s_oStage);

        s_bMobile = jQuery.browser.mobile;
        if (s_bMobile === false) {
            s_oStage.enableMouseOver(FPS);
            $('body').on('contextmenu', '#canvas', function (e) { return false; });
        }

        s_iPrevTime = new Date().getTime();

        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.setFPS(FPS);

        if (navigator.userAgent.match(/Windows Phone/i)) {
            DISABLE_SOUND_MOBILE = true;
        }

        s_oSpriteLibrary = new CSpriteLibrary();

    };

    

    this.preloaderReady = function () {

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            this._initSounds();
        }

        this._loadImages();
        _bUpdate = true;
    };

    this.soundLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
       // _oPreloader.refreshLoader(iPerc);

        if (_iCurResource === RESOURCE_TO_LOAD) {
            s_oMain._onPreloaderComplete();
        }
    };

    this._initSounds = function () {

        var aSoundsInfo = new Array();

        aSoundsInfo.push({ path: './sounds/', filename: 'soundtrack', loop: true, volume: 1, ingamename: 'soundtrack' });
        aSoundsInfo.push({ path: './sounds/', filename: 'press_button', loop: false, volume: 1, ingamename: 'click' });
        aSoundsInfo.push({ path: './sounds/', filename: 'game_over', loop: false, volume: 1, ingamename: 'game_over' });
        aSoundsInfo.push({ path: './sounds/', filename: 'ball_collision', loop: false, volume: 1, ingamename: 'ball_collision' });
        aSoundsInfo.push({ path: './sounds/', filename: 'ball_in_basket', loop: false, volume: 1, ingamename: 'ball_in_basket' });
        aSoundsInfo.push({ path: './sounds/', filename: 'ball_in_basket_negative', loop: false, volume: 1, ingamename: 'ball_in_basket_negative' });

        RESOURCE_TO_LOAD += aSoundsInfo.length;

        s_aSounds = new Array();
        for (var i = 0; i < aSoundsInfo.length; i++) {
            s_aSounds[aSoundsInfo[i].ingamename] = new Howl({
                src: [aSoundsInfo[i].path + aSoundsInfo[i].filename + '.mp3', aSoundsInfo[i].path + aSoundsInfo[i].filename + '.ogg'],
                autoplay: false,
                preload: true,
                loop: aSoundsInfo[i].loop,
                volume: aSoundsInfo[i].volume,
                onload: s_oMain.soundLoaded
            });
        }

    };

    this._loadImages = function () {
     
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);

        s_oSpriteLibrary.addSprite("logo_game", "./sprites/logo_game.png");
        s_oSpriteLibrary.addSprite("logo_menu", "./sprites/logo_menu.png");
        s_oSpriteLibrary.addSprite("but_play", "./sprites/but_start.png");
        s_oSpriteLibrary.addSprite("ctl_logo", "./sprites/ctl_logo.png");
        s_oSpriteLibrary.addSprite("but_credits", "./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_no", "./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");

        s_oSpriteLibrary.addSprite("bg_menu", _additionalInfo.bg_menu);
        s_oSpriteLibrary.addSprite("bg_game", _additionalInfo.backgroundImage);
        s_oSpriteLibrary.addSprite("side_right", _additionalInfo.side_right);
        s_oSpriteLibrary.addSprite("side_left", _additionalInfo.side_left);
        s_oSpriteLibrary.addSprite("ball_panel", _additionalInfo.ball_panel);
        s_oSpriteLibrary.addSprite("ball", _additionalInfo.ball);
        s_oSpriteLibrary.addSprite("stake", _additionalInfo.stake);
        s_oSpriteLibrary.addSprite("ball_generator", _additionalInfo.ball_generator);
        s_oSpriteLibrary.addSprite("holes_occluder", _additionalInfo.holes_occluder);
        s_oSpriteLibrary.addSprite("hole_board_occluder", _additionalInfo.hole_board_occluder);
        s_oSpriteLibrary.addSprite("basket_display", _additionalInfo.basket_display);
        s_oSpriteLibrary.addSprite("hand_anim", _additionalInfo.hand_anim);
        s_oSpriteLibrary.addSprite("msg_box", _additionalInfo.msg_box);
        s_oSpriteLibrary.addSprite("image_0", _additionalInfo.image_0);
        s_oSpriteLibrary.addSprite("image_1", _additionalInfo.image_1);
        s_oSpriteLibrary.addSprite("image_2", _additionalInfo.image_2);
        s_oSpriteLibrary.addSprite("image_3", _additionalInfo.image_3);

        if (_props.devt) {
            // oData.shouldWin = _props.shouldWin;
            
        }
        this._loadAssets();

    };

    this._loadAssets = function () {
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    }
    this._onImagesLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        //console.log("PERC: "+iPerc);
       // _oPreloader.refreshLoader(iPerc);

        if (_iCurResource === RESOURCE_TO_LOAD) {
            s_oMain._onPreloaderComplete();
        }
    };

    this._onAllImagesLoaded = function () {

    };

    this._onPreloaderComplete = function () {
        _oPreloader.unload();

        if (!isIOS()) {
            s_oSoundtrack = playSound('soundtrack', 1, true);
        }

        this.gotoMenu();
    };

    this.onAllPreloaderImagesLoaded = function () {
        this._loadImages();
    };

    this.gotoMenu = function () {
      //  console.log('game start')
        defaultLifeCycle.informReady();
       // _oGame = new CGame(_oData);
       // _iState = STATE_GAME;
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };

    this.gotoGame = function () {
        _oGame = new CGame(_oData);
        _iState = STATE_GAME;
    };

    this.gotoHelp = function () {
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };

    this.stopUpdate = function () {
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display", "block");
        Howler.mute(true);
    };

    this.startUpdate = function () {
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display", "none");

        if (s_bAudioActive) {
            Howler.mute(false);
        }
    };

    this._update = function (event) {
        if (_bUpdate === false) {
            return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;

        if (s_iCntTime >= 1000) {
            s_iCurFps = s_iCntFps;
            s_iCntTime -= 1000;
            s_iCntFps = 0;
        }

        if (_iState === STATE_GAME) {
            _oGame.update();
        }

        s_oStage.update(event);

    };

    s_oMain = this;

    _oData = oData;

    ENABLE_CREDITS = true;
    ENABLE_FULLSCREEN = oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;

    NUM_IMAGES_BACKGROUNDS = oData.total_images_backgrounds_in_folder;

    this.initContainer();

    //pass to main app
 

    defaultLifeCycle.setAppData({
        bg_menu: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/bg_menu.jpg",
        backgroundImage: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/bg_game.jpg",
        side_right: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/side_right.png",
        side_left: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/side_left.png",
        ball_panel: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/ball_panel.png",
        ball: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/ball.png",
        stake: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/stake.png",
        ball_generator: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/ball_generator.png",
        holes_occluder: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/holes_occluder.png",
        hole_board_occluder: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/hole_board_occluder.png",
        basket_display: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/basket_display.jpg",
        hand_anim: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/hand_anim.png",
        msg_box: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/msg_box.png",
        image_0: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/prize/image_0.png",
        image_1: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/prize/image_1.png",
        image_2: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/prize/image_2.png",
        image_3: "https://s3-ap-southeast-1.amazonaws.com/funminiapps/ftdata/plinko/prize/image_3.png",
    });

    this._onData = function (data) {
        _additionalInfo = data.engagementInfo;
        _oData.shouldWin = data.shouldWin;
        _oData.backgroundImage = _additionalInfo.backgroundImage;
        //ADD PRELOADER
      //  this.gotoMenu();
        _oPreloader = new CPreloader();
    }

    this._onReset = function (newData) {
        _additionalInfo = newData.engagementInfo;
        _oData.shouldWin = newData.shouldWin;
        _oData.backgroundImage = _additionalInfo.backgroundImage;
        this.gotoMenu();
    }

    //setting call back handlers
    defaultLifeCycle.setOnDataCallback(this._onData.bind(this));
    defaultLifeCycle.setOnResetCallback(this._onReset.bind(this));

    if(_props.devt){
        this._onData(_props.data)
    }

}

var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_bFullscreen = false;
var s_aSounds = new Array();

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundtrack;
var s_oCanvas;
