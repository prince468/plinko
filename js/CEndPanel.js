function CEndPanel(iPrizeIndex, bHasWin){
    
    var _oButExit;
    var _oFade;
    var _oPanelContainer;
    var _oParent;
    
    var _pStartPanelPos;
    
    this._init = function(iPrizeIndex, bHasWin){
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0;
        _oFade.on("mousedown",function(){});
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0.7},500);
        
        _oPanelContainer = new createjs.Container();        
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT + oSprite.height/2;  
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};
        createjs.Tween.get(_oPanelContainer).to({y:CANVAS_HEIGHT/2 - 40},500, createjs.Ease.quartIn);

        if(bHasWin){
            var oTitleGlow = new createjs.Text(TEXT_WIN," 60px "+PRIMARY_FONT, "#f9de00");
            oTitleGlow.y = -oSprite.height/2 + 140;
            oTitleGlow.textAlign = "center";
            oTitleGlow.textBaseline = "middle";
            oTitleGlow.lineWidth = 400;
            oTitleGlow.lineHeight = 70;
            oTitleGlow.alpha = 0.7;
            //oTitle.shadow = new createjs.Shadow("#000000", 5, 5, 10);
            oTitleGlow.filters = [
               // new createjs.ColorFilter(0, 0, 0, 1, 255, 0, 0),
                new createjs.BlurFilter(10, 10, 20)
            ];
            oTitleGlow.cache(-200,-70, 400, 200);

            _oPanelContainer.addChild(oTitleGlow);

            var oTitle = new createjs.Text(TEXT_WIN," 60px "+PRIMARY_FONT, "#f9de00");
            oTitle.y = -oSprite.height/2 + 140;
            oTitle.textAlign = "center";
            oTitle.textBaseline = "middle";
            oTitle.lineWidth = 400;
            oTitle.lineHeight = 70;
     
            _oPanelContainer.addChild(oTitle);
          




            
            var szPrize = PRIZE[iPrizeIndex].background;
            var oSprite = s_oSpriteLibrary.getSprite(szPrize);
            var oPrize = createBitmap(oSprite);   
            oPrize.scaleX=oPrize.scaleY = 1.8;     
            oPrize.regX = oSprite.width/2;
            oPrize.regY = oSprite.height/2;
            
           /* var oRedeem = new createjs.Text(TEXT_REDEEM," 60px "+PRIMARY_FONT, "#f9de00");
            oRedeem.y = 140;
            oRedeem.textAlign = "center";
            oRedeem.textBaseline = "middle";
            oRedeem.lineWidth = 600;
            _oPanelContainer.addChild(oRedeem);*/
            
            _oPanelContainer.addChild(oPrize);
            
          //  oPanel.on("mousedown",this.redeem);
          //  oPanel.cursor = "pointer";
            
        }else {

            var oTitleGlow = new createjs.Text(TEXT_GAMEOVER," 60px "+PRIMARY_FONT, "#f9de00");
            oTitleGlow.y = -oSprite.height/2 + 280;
            oTitleGlow.textAlign = "center";
            oTitleGlow.textBaseline = "middle";
            oTitleGlow.lineWidth = 600;
            oTitleGlow.lineHeight = 70;
            oTitleGlow.alpha = 0.7;
            oTitleGlow.filters = [
                // new createjs.ColorFilter(0, 0, 0, 1, 255, 0, 0),
                 new createjs.BlurFilter(10, 10, 20)
             ];
             oTitleGlow.cache(-200,-70, 400, 200);
 
             _oPanelContainer.addChild(oTitleGlow);
            _oPanelContainer.addChild(oTitleGlow);


            var oTitle = new createjs.Text(TEXT_GAMEOVER," 60px "+PRIMARY_FONT, "#f9de00");
            oTitle.y = -oSprite.height/2 + 280;
            oTitle.textAlign = "center";
            oTitle.textBaseline = "middle";
            oTitle.lineWidth = 600;
            oTitle.lineHeight = 70;
            _oPanelContainer.addChild(oTitle);
            
            /*_oButExit = new CGfxButton(0, 80, s_oSpriteLibrary.getSprite('but_home'), _oPanelContainer);
            _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);*/
        }
        

        //_oButRestart = new CGfxButton(110, 80, s_oSpriteLibrary.getSprite('but_restart'), _oPanelContainer);
        //_oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);
        //_oButRestart.pulseAnimation();

        
        $(s_oMain).trigger("save_score",iPrizeIndex);        
        
        
    
        $(s_oMain).trigger("share_event",iPrizeIndex);
        
    };
    
    this.unload = function(){
        _oFade.off("mousedown",function(){});
        s_oStage.removeChild(_oFade);
        s_oStage.removeChild(_oPanelContainer);
        
        if(!bHasWin){
            _oButExit.unload();
        }
    };

    this.redeem = function(){
        _oParent._onExit();
        window.open(PRIZE[iPrizeIndex].redeemlink);
    };  
    
    /*
    this._onRestart = function(){
        _oParent.unload();
        s_oGame.restartGame();
        
        $(s_oMain).trigger("end_level",1);
    };
    */
    
    this._onExit = function(){
        $(s_oMain).trigger("show_interlevel_ad");

        _oParent.unload();
        
        s_oGame.onExit();
    };
    
    _oParent = this;
    this._init(iPrizeIndex, bHasWin);

    return this;
}
