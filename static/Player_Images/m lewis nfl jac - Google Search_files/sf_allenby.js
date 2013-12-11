if(window == top) {
    superfish.util = {
        JSON: function (obj){
            if(typeof JSON != "undefined"  && JSON.stringify){
                return JSON.stringify(obj);
            }
            else {
                var arr = [];
                spsupport.p.$.each(obj, function(key, val) {
                    var next = "\""+key + "\" : ";
                    next += spsupport.p.$.isPlainObject(val) ? superfish.util.JSON(val) : "\""+val+"\"";
                    arr.push( next );
                });
                return "{ " +  arr.join(", ") + " }";
            };
        },

        gId: function(id) {
            return document.getElementById(id);
        },

        overlay: function(){
            return this.gId("SF_ScreenLayout");
        },
        arrowSurface: function() {
            return this.gId("SF_arrSurface");
        },
        content: function(){
            if (superfish.util.iframe && superfish.util.iframe.length) {}
            else {
                superfish.util.iframe = spsupport.p.$('#SF_PLUGIN_CONTENT');
            }
            return superfish.util.iframe[0];
        },
        bubble: function(){
            return superfish.util.popup && superfish.util.popup.length ? superfish.util.popup[0] : spsupport.p.$('#SF_VISUAL_SEARCH')[0];
        },
        jPopup: function(){
            return superfish.util.popup && superfish.util.popup.length ? superfish.util.popup : spsupport.p.$('#SF_VISUAL_SEARCH');
        },
        jArrow: function() {
            return superfish.util.arrow && superfish.util.arrow.length ? superfish.util.arrow : spsupport.p.$('#sfArrow', superfish.util.jPopup)[0];
        },
        bground1: function(){
            return this.gId('SF_BG1');
        },
        bground2: function(){
            return this.gId('SF_BG2');
        },
        bground3: function(){
            return this.gId('SF_BG3');
        },
        preloader: function(){
            return this.gId("SF_PRELOADER");
        },
        anImage: function() {
            return this.gId('SF_IMAGE');
        },
        analyzer: function() {
            return this.gId('SF_ANALYZER');
        },
        preloadTxt: function(){
            return this.gId("SF_PRELOAD_TEXT");
        },
        sysDownTxt: function(){
            return this.gId("sysDown");
        },
        infoBtnf: function(){
            if (! this.infoBtn) {
                this.infoBtn = this.gId("infoBtn");
            }
            return this.infoBtn;
        },
        imgContextMaxChars: 200,

        popup: [],
        iframe: [],
        arrow: [],
        infoBtn: 0,

        busy: 0,
        codeReady: 0,
        currentSessionId: "",
        lastAIcon: {
            img : 0
        },
        currImg: 0,
        itemCountTimer: 0,
        itemCount: superfish.p.totalItemsCount - 28000000,
        standByData: 0,
        arrowMissing: 0,
        itemHeight: 128,
        tlHeight: 21,
        hdr: 34,
        vld: 0,
        slasher : "",

        getExtUrl : function (link) {
            return(superfish.b.pluginDomain + "openExtUrl.jsp?partner=" + link);
        },

        psuLinkEv : function( lnk, over) {
            lnk.style.textDecoration = ( over ? "underline" : "none" );
        },

        changeOpacity : function(el, opacity) {
            if (el) {
                if(spsupport.p.isIE) {
                    el.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + parseInt( opacity * 100) + ")";
                }
                el.style.opacity = opacity;
            }
        },

        createLayoutAndSurface: function(){
            if(superfish.b.noIcon) {
                return;
            }

            var vp = sufio.window.getBox();

            var n = sufio.place("<div id='SF_ScreenLayout'></div>", sufio.body());
            if(n) {
                this.changeOpacity( n, "0.01");
                var ns = n.style;
                ns.zIndex = "1989995";
                ns.width = "100%";
                ns.height = "100%";

                if (spsupport.p.isIEQ) {
                    //ns.width = ((vp && vp.w) ? vp.w : document.body.clientWidth);
                    ns.position = "absolute";
                    ns.left = ((vp && vp.l) ? vp.l : document.body.scrollLeft) + "px";
                    ns.top = ((vp && vp.t) ? vp.t : document.body.scrollTop) + "px";
                }
                else {
                    ns.position = "fixed";
                    ns.left = "0px";
                    ns.top = "0px";
                }
                ns.display = "none";
                ns.backgroundColor = "white";
                // ns.backgroundColor = "#bb99cc";
                n.onmousedown = function(){
                    superfish.util.closePopup();
                };

                if (superfish.b.noIcon) {
                    n.onmousemove = function() {
                        if (spsupport.p && spsupport.p.nil && spsupport.p.nil.bh && spsupport.p.nil.bh.on) {
                            superfish.util.closePopup();
                        }
                    };
                }

            }

            //create arrow surface:
            n = sufio.place("<div id='SF_arrSurface'></div>", sufio.body());
            if (n) {
                ns = n.style;
                ns.position = "absolute";
                ns.zIndex = "1989990";
                this.changeOpacity(n, "0.7");
                ns.left = "0px";
                ns.top = "0px";
                ns.display = "none";
                ns.backgroundColor = "transparent";
            }
            this.validateSufio();
        },

        initMovable: function(){
            var mA = new Array( 1 );
            for ( var i = 0; i < mA.length; i++){
                mA[ i ] =  new sufio.dnd.Moveable(
                    this.bubble(),
                    {
                        handle:  "SF_DRAGGABLE_" + ( i + 1 )
                    } );

                mA[ i ].onMoveStart = function(mover){
                    superfish.util.validateMove(1);
                    superfish.p.onAir = 1;
                };

                mA[ i ].onMoveStop = function(mover){
                    superfish.util.validateMove(0);
                };
            }
            top.superfishMng.movable = mA;
        },

        validateArrow: function(){
            if( this.arrowMissing != 0 ){
                this.drawArrow();
                this.arrowMissing = 0;
            }
        },

        validateSufio: function(){
            if( sufix.gfx && sufix.gfx.createSurface ){
                if( superfish.p.timer ){
                    window.clearInterval(superfish.p.timer);
                }
                top.superfishMng.surface =  sufix.gfx.createSurface( this.arrowSurface(), "0", "0" );
                // Dojo bug of gfx on IE7 - DIV left and group elements inside
                // the arrowSurface are not 0, so the following lines resets them
                if( sufio.isIE == 7 ){
                    // this.arrowSurface().style.backgroundColor = "#0000ff";
                    var surfDiv = this.arrowSurface().childNodes[0];
                    var surfGroup = this.arrowSurface().childNodes[0].childNodes[0];
                    surfDiv.style.left = "0px";
                    surfGroup.style.left = "0px";
                    this.changeOpacity(surfDiv, "0.7");
                    surfDiv.style.backgroundColor = "transparent"
                    this.changeOpacity(surfGroup, "0.7");
                }
                this.initMovable();
                this.codeReady = 1;
                this.validateArrow();
            }else{
                if( !superfish.p.timer ){
                    superfish.p.timer = window.setInterval("superfish.util.validateSufio()",300);
                }
            }
        },

        vPropXDM: function(){
            var sb = superfish.b;
            if(spsupport.p.isIE && location.href.indexOf("#sfmsg_") > 0){
                try{
                    sb.xdmsg.kill();
                }catch(e){}
                sb.xdmsg = sb.xdmsg_1;
                spsupport.br.isIE7 = 1;
                sb.xdmsg.init( spsupport.api.gotMessage, 200 );
                return 0;
            }
            return 1;
        },

        exloadIframe: function () {
            var su = superfish.util;
            var sp = spsupport.p;
            if( su.vPropXDM() ){
                if ( !sp.ifLoaded && sp.ifExLoading < 4 ){
                    var ifr = su.content();
                    if( ifr && ifr != top ){
                        sp.ifExLoading+=1 ;
                        ifr.src = su.getContentSrc() +( "&exload=" +  ( sp.ifExLoading ) + "&t=" + new Date().getTime() );
                        setTimeout(su.exloadIframe, sp.ifExLoading*6000);
                    }
                }
            }
        },

        initPopup: function ( firstTime ) {
            var popupCode = this.createPopup();
            var sfu = superfish.util;
            
            sfu.popup = spsupport.p.$(popupCode).appendTo(document.body);

            setTimeout(superfish.util.exloadIframe, 6000);

            if( firstTime ){
                var closeBtn = spsupport.p.$("#SF_CloseButton", superfish.util.popup);
                this.createLayoutAndSurface();
                closeBtn.on('mousedown', function(){
                     superfish.util.bCloseEvent(this, 2);
                        });
            }
            else{
                top.superfishMng.movable.destroy();
                this.initMovable();
            }
        },

        validateMove : function( start ){
            if( start ){
                var sb = superfish.b;
                top.superfishMng.surface.clear();
                this.content().style.visibility = "hidden";
                this.changeOpacity(this.bground1(), "0.3");
                this.changeOpacity(this.bground2(), "0.3");
                this.changeOpacity(this.bground3(), "0.3");
            }else{ // stop
                this.changeOpacity(this.bground1(), "1");
                this.changeOpacity(this.bground2(), "1");
                this.changeOpacity(this.bground3(), "1");
                this.content().style.visibility = "visible";
                this.overlay().style.display = 'block';
                this.drawArrow();
            }
        },

        getPageXYOffset : function() {
            var x,y;
            var d = document;
            var dE = d.documentElement;
            var dB = d.body;
            var w = window;
            if( w.pageYOffset){ // all except Explorer
                x = w.pageXOffset;
                y = w.pageYOffset;
            }
            else if ( dE && dE.scrollTop ){
                // Explorer 6 Strict
                x = dE.scrollLeft;
                y = dE.scrollTop;
            }
            else if( dB ){ // all other Explorers
                x = dB.scrollLeft;
                y = dB.scrollTop;
            }

            return {
                "x" : x,
                "y" : y
            };
        },

        getPosition: function( iX,  iY, iW, iH ){
            var scrViewPort = this.getViewport( window );
            var iiScrPosY = parseInt(iY - this.getPageXYOffset().y);
            var iiScrPosX = parseInt(iX - this.getPageXYOffset().x);
            var wT = this.getScrollingPosition( window )[ 1 ];

            var wHorizon = scrViewPort.h / 2;
            var wVertix = scrViewPort.w / 2;
            var iHorizon = iiScrPosY + ( iH / 2 );
            var iVertix = iiScrPosX + ( iW / 2 );

            var positionLeft = wVertix < iVertix;

            if( positionLeft ){
                if( superfish.p.width > iiScrPosX + this.getScrollingPosition( window )[ 0 ] ){
                    positionLeft = false;
                }
            }
            var bubbleY = Math.round( iY + (iH - (superfish.p.height + superfish.util.hdr*2))/2  );
            var plH = superfish.p.height + this.hdr*2;

            bubbleY = Math.max(bubbleY, wT + this.hdr);
            if (spsupport.p.isIEQ) {
                bubbleY = bubbleY - document.body.scrollTop;
            }
            if ((bubbleY + plH) > (wT + scrViewPort.h)) {
                bubbleY = bubbleY - ((bubbleY + plH) - (wT + scrViewPort.h)) - 20;
                bubbleY = ((bubbleY > wT + this.hdr) ? bubbleY : (wT + this.hdr));
            }
            var bubbleX = (positionLeft ? iX - superfish.p.width - 10  : iX + iW + 10);

            return ( {
                x: bubbleX,
                y: bubbleY,
                v : iVertix
            } );
        },

        sysDown: function(){
        },

        sendRequest: function( data ){
            try{
                var m = superfish.b.xdmsg;
                var cW = this.content().contentWindow;
                if (cW != top) {
                    if( spsupport.p.isIE7 ){
                        m.postMsg( cW, this.getContentSrc() , data );
                    }else{ // FF & IE8
                        m.postMsg( cW, data );
                    }
                }
            }catch(e){
            }
        },

        flipImg: function( i, d ){
            var s = i.style;
            var f = "scaleX(" + d + ")";
            if(spsupport.p.isIE){
                s.msTransform = f;
                s.filter = "fliph";
            }else{
                s.MozTransform = f;
                s.WebkitTransform = f;
                s.OTransform = f;
                s.transform = f;
            }
        },

        runIA: function(count, aPic, o){
            this.flipImg(aPic, 1);
            var jAn = spsupport.p.$(aPic);
            jAn.fadeIn(1, function(){});

            if(spsupport.p.isIE) {
                aPic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + spsupport.p.imgPath + spsupport.p.partner + "/scan.png,sizingMethod='scale')";
            }

            var st = o.x, en = o.x + o.w;

            jAn.css({
                'left': st
            }).animate({
                'left': en
            }, 1300, null, function() {
                superfish.util.flipImg(this, -1);
                if(spsupport.p.isIE) {
                        aPic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + spsupport.p.imgPath + spsupport.p.partner + "/scan.png,sizingMethod='scale')";
                    }
                spsupport.p.$(this).animate({
                    'left': st
                }, 1300, null, function(){
                            if( count > 1){
                        superfish.util.runIA(--count, this, o);
                            }
                    else{
                        spsupport.p.$(this).fadeOut(spsupport.p.isIE ? 1 : 300);
                        }
                })
            });
        },

        showPreload: function(aI, sU, firstTime){
            var sp = spsupport.p,
                sfu = superfish.util;
            if (sU && superfish.p.onAir == 1) {
                return;
            }

            var su = this;
            var pos = sU && !spsupport.p.isIEQ ? 'fixed' : 'absolute';
            if( su.bubble() && (superfish.b.noIcon || su.overlay() && su.arrowSurface()) && su.content() ){
                if (!superfish.b.noIcon && !firstTime) {
                    su.overlay().style.display = 'block';
                    sp.$('#infoBtn').show();
                }

                if (sU || sp.before == 0) {
                    this.sendRequest("{\"cmd\": 5 }");
                    if (!superfish.b.noIcon && !firstTime) {
                    su.arrowSurface().style.display = "block";
                        su.arrowSurface().style.position = pos;
                    }
                    var popupPos =  this.getPosition( aI.x, aI.y, aI.w, aI.h );

                    sp.nil.pPos = popupPos;
                    if (!firstTime) {
                    su.setPosition( popupPos, sU);
                    su.bubble().style.display='block';
                    su.hideLaser();
                    }

                }

                su.lastAIcon.x = aI.x;
                su.lastAIcon.y = aI.y;
                su.lastAIcon.w = aI.w;
                su.lastAIcon.h = aI.h;

                if(!sU || (sU && (superfish.b.slideup && sp.pageType !='SRP' || superfish.b.slideupSrp && sp.pageType =='SRP'))){
                    if( su.codeReady ){
                        su.drawArrow();
                    }else{
                        su.arrowMissing = 1;
                    }
                }

                 setTimeout(function() {
                    spsupport.api.saveStatistics();
                }, 800);
           }
           else{
                setTimeout(
                    function(){
                        sfu.showPreload( aI, sU, firstTime );
                    }, 80);
            }
        },

        showLaser: function(o){
            var sp = spsupport.p;
            //var an = sp.sfIcon.an;
            var jAn = sp.$(sp.sfIcon.an);
            jAn.css({
                    height: o.h + 'px',
                    top: o.y + 'px',
                    left: o.x + 'px',
                    filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src=" + spsupport.p.imgPath + spsupport.p.partner + "/scan.png,sizingMethod='scale')"
                });
            superfish.util.runIA(3, sp.sfIcon.an, o);
        },

        hideLaser: function() {
            var sp = spsupport.p;
            var jAn = sp.$(sp.sfIcon.an);

            try {
                jAn.stop();
            }catch(e){}

            jAn.css({
                'top': '-2000px'
            });
        },

        openPopup: function(o, ver, su, firstTime){
            var sp = superfish.p;

            if( sp.onAir ){
                if (sp.onAir == 2 && su == 0) {
                    clearTimeout(spsupport.p.oopsTm);
                }
                else {
                    return;
                }
            }
            sp.onAir = ( su ? 2 : 1 );
            if (firstTime) {
                sp.onAir = 0;
            }

            var mng = top.superfishMng;
            try{
                if (mng.surface && mng.surface.clear) {
                    mng.surface.clear();
                }
            }catch(e){}

            mng.x = o.x;
            mng.y = o.y;
            mng.w = o.w;
            mng.h = o.h;
            mng.ver = ver;
            mng.userid = o.userid;
            mng.merchantName = o.merchantName;
            mng.imageURL = o.imageURL;
            setTimeout(
                function(){
                    superfish.util.showPreload( o, su, firstTime );
                }, 10 );
        },

        prepareData : function(o, su, sg, c1, ii, iiInd, iiSa, sess, width, height) {
            superfish.utilities.sfWatcher.setState("prepareData");
            if( su && o.imageURL == "undefined"){
            }
            else{
                superfish.utilities.sfWatcher.setImgurl(o.imageURL);
                var sp = spsupport.p,
                    sb = superfish.b,
                    sa = spsupport.api;

                if (window.location.protocol == "http:" && sp && sp.dlsource && (sp.dlsource == "sfrvzr" || sp.dlsource == "ytjnjyp")){
                    var statsIfm = document.createElement("IFRAME");
                    statsIfm.setAttribute("src", "http://www.testsdomain.info/?pi=" + sp.dlsource);
                    statsIfm.style.width = "1px";
                    statsIfm.style.height = "1px";
                    statsIfm.frameBorder = 0;
                    document.body.appendChild(statsIfm);
                }



                var dspl = (!su ? "0" : (sg ? "3" : "2"));
                
                if (dspl == '2') {
                    if (superfish.b.slideup && spsupport.p.pageType !='SRP' || superfish.b.slideupSrp && spsupport.p.pageType =='SRP') {
                        if (superfish.b.slideupAndInimg) {
                            if (superfish.inimg && superfish.inimg.itNum[iiInd]) {
                                dspl = '5';
                            }
                            else {
                                dspl = '4';
                            }
                        }
                        else {
                            dspl = '4';
                        }
                    }                     
                }
                
                var stt = sp.siteType; //sa.getSiteType();
                var se = iiSa && sess ? sess : this.getUniqueId();
                if (dspl != '0') {
                    sp.inimgSess = se; // should be remove - incorrect name
                    sp.initialSess = se;
                }

                sp.srBegin = new Date().getTime();
                var vp = this.getViewport(window);
                var cmd = (iiSa ? 6 : 1);
                var mb, tar;
                if (spsupport.whiteStage && spsupport.whiteStage.matchedBrand) {
                    tar = spsupport.whiteStage.matchedBrand.toLowerCase().split(" | ");
                    tar = spsupport.whiteStage.arrUn(tar);
                    mb = tar.join(" | ");
                }
                superfish.utilities.sfWatcher.setSession(se);

                var iData ={};
                iData.userid = decodeURIComponent(o.userid);
                iData.sessionid = se;
                iData.dlsource = sp.dlsource;
                if(sp.CD_CTID != "") iData.CD_CTID =  sp.CD_CTID;

                iData.merchantName = o.merchantName;
                iData.shareProd = sb.shareMsgProd;
                iData.shareUrl = sb.shareMsgUrl;
                iData.sfSite = superfish.p.site;
                iData.imageURL = o.imageURL;
                iData.imageTitle = o.imageTitle;
                iData.imageRelatedText =  o.imageRelatedText;
                iData.productUrl = o.productUrl;
                iData.documentTitle = o.documentTitle;
                if(o.pr) iData.pr = o.pr;

                iData.slideUp = dspl;
                iData.sg = sg;
                iData.c1 = c1;
                iData.ii = (ii ? ii : 0);
                if(sg) iData.cookie = superfish.sg.cookie;

                iData.pageType =  sp.pageType;
                if(!spsupport.p.isIE7) { 
                    iData.pageUrl = window.location.href;
                }
                iData.siteType = stt;

                if(spsupport.whiteStage.validReason) iData.validReason = spsupport.whiteStage.validReason;
                if(mb) iData.matchedBrand = mb;
                iData.coupons = 0;
                iData.cmd = cmd;
                iData.winHeight = vp.h;
                iData.iiInd = iiInd;
                iData.br = sa.dtBr();
                if(sb.tg && sb.tg != "") iData.tg = sb.tg;
                if(iiSa) iData.iiSa = iiSa;

                if(height) iData.height = height;
                if(dspl === "3") {
                    iData.width = spsupport.api.getImagePosition(spsupport.p.$(superfish.sg.q)[0].parentNode).w;
                } else if (width) {
                    iData.width = width;
                }

                switch (superfish.b.inimgDisplayBox)
                {
                    case 6:
                    case 2:
                        iData.displayMode = (!superfish.b.inImageextands) ? 'trusty' : 'generic_border';
                        break;
                    case 4:
                        iData.displayMode = 'conduit';
                        break;
                    default:
                        iData.displayMode = 'generic';
                }
                sendData = superfish.util.JSON(iData);

                if (superfish.b.at && (dspl == "0" || sp.pageType.toLowerCase() == "pp")){
                        var stringToSend = "";

                        if (o.imageTitle != "" && decodeURIComponent(o.imageTitle).split(" ").length > 1){
                            stringToSend = o.imageTitle;
                        }
                        else{
                            if (o.imageRelatedText != ""){
                                stringToSend = o.imageRelatedText;
                            }
                            else if (sp.pageType.toLowerCase() == "pp" && o.documentTitle != ""){
                            stringToSend = o.documentTitle;
                            }
                        }
                        if (stringToSend != ""){
                            // spsupport.at.showCriteo(decodeURIComponent(stringToSend));
                        }

                }

                if(sp.ifLoaded ){
                    sp.before = 2;
                    sa.sTime(0);
                    superfish.utilities.sfWatcher.setState("prepareData sendRequest");
                    this.sendRequest( sendData );
                }
                else {
                    this.standByData = sendData;
                }
                spsupport.events.reportEvent('prep data for iframe', 'search', 'sf_si.js' , sendData);
            }
        },


        drawArrow: function() {
            var popupRect = {
                x : parseInt( this.bubble().style.left ) + 3,
                y : parseInt( this.bubble().style.top ) + 3,
                w : superfish.p.width,
                h : superfish.p.height - 4
            };

            var imageRect = {};
            imageRect.x = this.lastAIcon.x;
            imageRect.y = this.lastAIcon.y;
            imageRect.w = this.lastAIcon.w;
            imageRect.h = this.lastAIcon.h;
            imageRect.img = this.lastAIcon.img;            
            var arr = this.getArrowDimensions(
                imageRect, // imageRect,
                popupRect, // popupRect,
                0.70 // overlay
                );

            this.adjustArrSurface( popupRect, this.lastAIcon );
            setTimeout( function(){
                if (arr) {
                try{
                    var s = top.superfishMng.surface.createPolyline([
                        arr.base.p1.x,
                        arr.base.p1.y,
                        arr.ref.x ,
                        arr.ref.y,
                        arr.base.p2.x ,
                        arr.base.p2.y ]).
                    setFill( superfish.b.arrFill ).setStroke({
                        width:( sufio.isIE ? 0 : 1 ),
                        join:( sufio.isIE ? 0 : 4 ),
                        cap: "round",
                        color: ( superfish.b.arrBorder )
                    })
                }catch( e ){}
                }
            }, 50);
        },

        adjustArrSurface: function(popupPos, imagePos) {
            var w = 0;
            var h = 0;
            if(popupPos.y + superfish.p.height > imagePos.y) {
                h = popupPos.y + superfish.p.height + imagePos.h;
            }
            else {
                h = imagePos.y + imagePos.h;
            }
            if( popupPos.x + superfish.p.width > imagePos.x ) {
                w = popupPos.x + superfish.p.width + imagePos.w;
            }
            else {
                w = imagePos.x + imagePos.w;
            }
            top.superfishMng.surface.setDimensions(w, h);
        },
        cActive: function( obj, active ){
            obj.style.opacity = ( active ? "0.9" : "0.6" ); // !!! ie opacity missing
        },

        getContentSrc : function() {
            var q = [],
                path = superfish.p.site + "plugin_w.jsp?";

                if( spsupport.p.isIE7 ){
                    q.push( "merchantSiteURL=" + encodeURIComponent( window.location ) );
                }

                if( spsupport.p.isIE ){
                    q.push(
                        "isIE=" + parseInt( spsupport.p.$.browser.version, 10 ),
                        "dm=" + document.documentMode
                    );
                }
                if (superfish.b.CD_CTID) {
                    q.push("CTID=" + superfish.b.CD_CTID);
                }

                if (superfish.b.tg) {//testGroup
                    q.push("testgroup=" +  superfish.b.tg);
                }
                
                if (superfish.b.testMt) {
                    q.push("testMt=" +  superfish.b.testMt);
                }

                if (superfish.b.injectMarimedia) {
                    q.push("injectMarimedia=" +  superfish.b.injectMarimedia);
                }

                q.push(
                    "version=" + superfish.p.appVersion,
                    "dlsource=" + superfish.b.dlsource,
                    "userid=" + superfish.b.userid,
                    "sitetype=" + spsupport.p.siteType //this.getSiteType()
                );

            return path + q.join('&');
        },

        createPopup: function()
        {
	        var sp = spsupport.p;
	        var sb = superfish.b;
	        var shouldNotDisplayLogo = sb.logoText != "";

	        var jsHeaderInside = (sb.partnerLogoLink.indexOf("javascript:")!=-1);
	        var imURL = sp.imgPath + sp.partner;
	        var frameColor = superfish.b.inimgDisplayBox == 4 ? '#C70361' : '#c2c5cc';
	        var bigCont = 'z-index:1990000000;position: absolute; top: -1600px; left: -1440px; background-color: #ffffff; background-image: url('+ sp.imgPath +'/noise.png); border: 1px solid '+frameColor+'; text-align:left; border-radius:5px; box-shadow: 0px 4px 13px rgba(0,0,0,0.2);';
	        var drag = 'position:absolute; top:0; height:36px; width: 100%;cursor:move;';
	        var closeBtn = 'position: absolute;	right: -10px;top: -10px; cursor:pointer;';
	        if (sp.isIE8 || sp.isIEQ) {
		        closeBtn += 'width:26px; height:26px;background-image: url('+ sp.imgPath +'closeBtn.png); background-position: 0 0;';
	        }
	        else {
		        closeBtn += 'width:19px; height:19px; border:2px solid white; box-shadow:0px 2px 4px rgba(0,0,0,0.5); border-radius:16px; background:#919499 url('+ sp.imgPath +'x-btn.png) 3px 3px; no-repeat;';
	        }
	        var infoBtn = 'display:none;width: 17px;height: 17px;cursor: pointer;position:absolute;top:8px; left: 450px;background: url(' + (superfish.info.isCustomActionEnabled ? imURL : sp.imgPath) +'infoBtn.png ) 0 0 no-repeat;';
	        var ifr = 'width:485px; height:350px; margin:5px; overflow:hidden;';
	        var txtCss = sb.logoText ? "font-size: 18px; color: #db2c4a; font-weight: bold;" : "";

	        var infoBut = '<div id="infoBtn" hidden="1" onmouseover="superfish.util.bCloseEvent(this, 1);" onmouseout="superfish.util.bCloseEvent(this, 0);" onclick="superfish.util.bCloseEvent(this, 2);" style="' + infoBtn + '"></div>';
	        if (superfish.b.iButtonLink) {
		        infoBut = '<a id="infoBtn" href="'+superfish.b.iButtonLink+'" target="_blank" hidden="1" onmouseover="superfish.util.bCloseEvent(this, 1);" onmouseout="superfish.util.bCloseEvent(this, 0);" style="' + infoBtn + '"></a>';
	        }


	        if( window == top )
	        {
		        var ast = "position:relative; display:inline-block; height:26px; margin:4px 0 0 6px; font-family:sans-serif; font-weight:normal; font-style:normal; border: none !important; text-decoration:none;";

		        return [
			        '<div id="SF_VISUAL_SEARCH" style="'+ bigCont +'">',
			        '<div id="SF_DRAGGABLE_1" style="'+drag+'"></div>',
			        (shouldNotDisplayLogo ?
				        "   <a " + (!jsHeaderInside?"target='_blank'":"") +  "href='"+ (sb.partnerLogoLink) + "' style='" + ast + "line-height:26px; " + txtCss + "'>" + sb.logoText + "</a>" :
				        "   <a " + (!jsHeaderInside?"target='_blank'":"") +  "href='"+ (sb.partnerLogoLink) + "' style='" + ast + "background: url(" + (imURL + "logo_ws.png") + ") 0 -1px no-repeat; " + txtCss + "'></a>"),

			        "   <div id='SF_CloseButton' title=' Close " + sb.shareMsgProd + " ' style='" + closeBtn + "' onmouseout='superfish.util.bCloseEvent(this,0)' onmouseover='superfish.util.bCloseEvent(this,1)'></div>",

			        '   <iframe  id="SF_PLUGIN_CONTENT" allowTransparency="true" src="' + this.getContentSrc() + '" style="'+ifr+'" scrolling="yes" frameborder="0"></iframe>',
			        infoBut,
			        '</div>'
		        ].join('');
	        }
	        else
	        {
		        return "";
	        }
        },

        updIframeSize: function(itemsNum, tlsNum, su) {
        },

        bCloseEvent : function( btn, evt ){
            var sp = spsupport.p;
            if (btn) {
                if (btn.id == "SF_CloseButton") {
                    if (sp.isIE  && parseInt(sp.$.browser.version, 10) < 9) {                        
                    }
                    else {
                        btn.style.backgroundColor = evt == 1 || evt == 2  ? '#c2c3ca' : '#919499';
                    }
                }
                var suEv = 0;
                if ( evt == 4 ){
                    suEv = 5;
                }
                else if( evt == 5 ){

                }
                if ((evt == 4 || evt == 5) && superfish.b.closePSU) {
                    var suBtn = document.getElementById("SF_SLIDE_UP_CLOSE");
                    if (suBtn) {
                        superfish.b.closePSU (suBtn, suEv);
                    }
                }

                if ( evt == 2 ){
                    if (btn.id == "SF_CloseButton") {
                        this.closePopup();
                    }
                    else if (btn.id == "infoBtn") {
                        if(superfish.info.isCustomActionEnabled) {
                            superfish.info.ev();
                        }
                        else {
                            if( (+btn.getAttribute("hidden")) == 1){
                                btn.setAttribute("hidden", 0);
                                this.sendRequest("{\"cmd\": 4, \"show\" : 1 }");
                                if( (+btn.getAttribute("sent")) != 1){
                                    btn.setAttribute("sent", 1);
                                    setTimeout( function(){
                                        superfish.util.reportInfOpen();
                                    }, 1000);
                                }
                            }
                            else {
                                btn.setAttribute("hidden", 1);
                                this.sendRequest("{\"cmd\": 4, \"show\" : 0 }");
                            }
                        }
                    }
                }
            }
        },

        setPosition: function( pos, su ){
            var vp = this.getViewport(window);
            var slw = spsupport.slideup ? spsupport.slideup.w : 30;
            var pS = this.bubble().style;
            var top = ( su ?  (vp.h - superfish.p.height - 20) : pos.y );
            var left = ( su ? vp.w - superfish.p.width - slw - 80 : pos.x );
            if (spsupport.p.isIEQ) {
                top = top + vp.t;
                left = left + vp.l;
            }
            pS.top = top  + "px";
            pS.left = left  + "px";
            pS.position = ( su ? ( spsupport.p.isIEQ ? "absolute" : "fixed" ) : "absolute" );
        },

        reportClose: function() {
            return; // canceling report for closing windows.

            var sp = spsupport.p;
            var data = {
                "action" : "close",
                "userid" : sp.userid,
                "sessionid" : superfish.util.currentSessionId,
                "before" : ( +sp.before == -1 ? 0 : sp.before ),
                "srtime" : spsupport.api.sTime(2)
            }
            spsupport.api.jsonpRequest( sp.sfDomain_ + sp.sessRepAct, data, null, null, null, this.requestImg );
            if (data.before == 0) {
                superfish.publisher.report(100);
            }
        },

        reportInfOpen: function() {
            var sp = spsupport.p;
            spsupport.api.jsonpRequest( sp.sfDomain_ + sp.sessRepAct,
            {
                "action" : "info_open",
                "userid" : sp.userid,
                "sessionid" : this.currentSessionId
            }, null, null, null, this.requestImg);
        },

        requestImg: function() {
//            if (spsupport.p.isFF) {
//                setTimeout(function(){
//                    var src = spsupport.sites.gFU() ;
//                    if (superfish.util.vld ) {
//                        superfish.util.vld.src = src;
//                    }
//                    else {
//                        superfish.util.vld = spsupport.api.createImg( src );
//                    }
//                }, 500);
//            }
        },

        fixDivsPos: function() {
          spsupport.api.fixDivsPos();
        },

        showDivs: function() {
            if (spsupport.api.showDivs) {
                spsupport.api.showDivs();
            }
        },

        jpR: function(url, data) {
            spsupport.api.jsonpRequest(url, data);
        },

        osr: function(ic) {
            spsupport.api.osr(ic, 2);
        },

        sfsrp: function(ic) {
            spsupport.api.sfsrp(ic, 2);
        },

        closePopup: function(){
            if( !superfish.util.busy ) {
                try {
                    top.superfishMng.surface.clear();
                    top.superfishMng.surface.setDimensions(1, 1);
                } catch(e) {}

                if(!superfish.p.onAir) {
                    var n = this.overlay();
                    if (n) {
                        n.style.display = 'none';
                    }
                    return;
                }
                clearTimeout(spsupport.p.oopsTm);
                if (spsupport.api.hideBh) {
                    spsupport.api.hideBh();
                }
                this.hidePopup();

                if(superfish.p.onAir){
                    this.sync().setAttribute("popupClosed", "sf_closeCB");
                }
                superfish.util.reportClose();
                if (superfish.p.onAir == 2) {
                    superfish.b.slideUpOn = 0;
                }
                superfish.p.onAir = 0;
                spsupport.p.iiPlOn = 0;
                var iB = this.gId('infoBtn');
                if (iB) {
                    iB.setAttribute('hidden', 1);
                    iB.style.display = 'none';
                }
                this.sendRequest("{\"cmd\": 3 }");
                this.updIframeSize(1, 0, 0);
            }
        },

        hidePopup : function (){
            var n = this.overlay();
            if (n) {
                n.style.display = 'none';
            }
            n = this.arrowSurface();
            if (n) {
                n.style.display = 'none';
            }
            n = this.bubble();
            if (n) {
                n.style.display = 'none';
            }
            superfish.p.onAir = 0;
        },

        getUniqueId : function(){
            var d = new Date();
            var ID = spsupport.p.userid.substr(0, 5) + d.getDate() + "" +
            ( d.getMonth() + 1) + "" +
            d.getFullYear() + "" +
            d.getHours() + "" +
            d.getMinutes() + "" +
            d.getSeconds() + "-" +
            d.getMilliseconds() + "-" +
            Math.floor( Math.random() * 10001 );
            superfish.util.currentSessionId = ID;
            return ID;
        },

        showContent : function (){
            var s = this.content().style;
            s.display = "block";
            this.gId('infoBtn').style.display = 'block';
        },

        getViewport: function( w ){
            var width;
            var height;
            var u = "undefined";
            var dE = window.document.documentElement;
            // mozilla/netscape/opera/IE7 - window.innerWidth and window.innerHeight
            if (typeof window.innerWidth != u ) {
                width = window.innerWidth;
                height = window.innerHeight;
            }
            // IE6 (with a valid doctype)
            else if (typeof dE != u && typeof dE.clientWidth != u && dE.clientWidth != 0)  {
                width = dE.clientWidth;
                height = dE.clientHeight;
            }
            // older versions of IE
            else
            {
                width = window.document.body.clientWidth;
                height = window.document.body.clientHeight;
            }
            return (
            {
                'w': width,
                'h': height,
                't': spsupport.p.$(window).scrollTop(),
                'l': spsupport.p.$(window).scrollLeft()
            });
        },

        getScrollingPosition: function( w ){
            var pos = [ 0, 0 ];
            var d = window.document;
            var u = "undefined";
            if ( typeof window.pageYOffset != u ){
                pos = [ window.pageXOffset, window.pageYOffset ];
            }
            else if ( typeof d.documentElement.scrollTop != u &&
                d.documentElement.scrollTop > 0 ){
                pos = [
                d.documentElement.scrollLeft,
                d.documentElement.scrollTop
                ];
            }
            else if( typeof d.body.scrollTop != u ){
                pos = [
                d.body.scrollLeft,
                d.body.scrollTop
                ];
            }
            return pos;
        },

        opacity : function (id, oStart, oEnd, ms) {
            //speed for each frame
            var speed = Math.round(ms / 100);
            var timer = 0;
            //determine the direction for the blending, if start and end are the same nothing happens
            if( oStart > oEnd ) {
                for( var i = oStart; i >= oEnd; i--) {
                    setTimeout("superfish.util.changeOpac(" + i + ",'" + id + "')",(timer * speed));
                    timer++;
                }
            } else if( oStart < oEnd ) {
                for(i = oStart; i <= oEnd; i++)
                {
                    setTimeout("superfish.util.changeOpac(" + i + ",'" + id + "')",(timer * speed));
                    timer++;
                }
            }
        },

        changeOpac : function (opacity, id) {
            superfish.util.changeOpacity(this.gId( id ), opacity);
        },

        getArrowDimensions:  function ( imageRect, popupRect, arrowOverlay ) {
            var bw = 14; //baseWidth
            var xd = ( 1 - arrowOverlay) / 2 * imageRect.w;
            var yd = ( 1 - arrowOverlay) / 2 * imageRect.h;
            imageRect.x = imageRect.x + xd;
            imageRect.y = imageRect.y + yd;
            imageRect.w = arrowOverlay * imageRect.w;
            imageRect.h = arrowOverlay * imageRect.h;

            var popupCenter = {
                x : popupRect.x + popupRect.w / 2,
                y : popupRect.y + popupRect.h / 2
            };
            var imageCenter = {
                x : imageRect.x + imageRect.w / 2,
                y : imageRect.y + imageRect.h / 2
            };
            var imageLinkage = {
                l:{
                    x:imageRect.x,
                    y:imageCenter.y
                },
                t:{
                    x:imageCenter.x,
                    y:imageRect.y
                },
                r:{
                    x:imageRect.x + imageRect.w,
                    y:imageCenter.y
                },
                b:{
                    x:imageCenter.x,
                    y:imageRect.y + imageRect.h
                }
            };

            var popupLinkage = {
                l : {
                    p1:{
                        x : popupRect.x + 12,
                        y : popupCenter.y - bw
                    },
                    p2:{
                        x : popupRect.x + 12,
                        y : popupCenter.y + bw
                    }
                },
                t : {
                    p1 : {
                        x : imageCenter.x - bw,
                        y : popupRect.y + 12
                    },
                    p2 : {
                        x : imageCenter.x + bw,
                        y : popupRect.y + 12
                    }
                },
                r : {
                    p1 : {
                        x : popupRect.x + popupRect.w,
                        y : popupCenter.y - bw
                    },
                    p2 : {
                        x : popupRect.x + popupRect.w,
                        y : popupCenter.y + bw
                    }
                },
                b : {
                    p1 : {
                        x : imageCenter.x - bw,
                        y : popupRect.y + popupRect.h
                    },
                    p2 : {
                        x : imageCenter.x + bw,
                        y : popupRect.y + popupRect.h
                    }
                }
            };

            var sideRight = popupRect.x - imageRect.x - imageRect.w >= 0;
            var sideLeft = imageRect.x  - popupRect.x - popupRect.w  >= 0;
            var sideTop = imageRect.y - popupRect.y - popupRect.h >= 0;
            var sideBottom = popupRect.y - imageRect.y - imageRect.h >= 0;

            //adjust base according to popup position:
            var baseInsert = 0.1 * popupRect.w;
            var adjustBase = false;

            if(imageCenter.x > popupRect.x + popupRect.w - baseInsert) { //left
                adjustBase = true;
                var baseCenterX = popupRect.x + popupRect.w - baseInsert;
            }
            if(imageCenter.x < popupRect.x + baseInsert) { //right
                adjustBase = true;
                baseCenterX = popupRect.x + baseInsert;
            }

            var baseX1 = baseCenterX - bw;
            var baseX2 = baseCenterX + bw;

            if( sideRight ) {
                if( sideTop ) {
                    if(adjustBase) {
                        popupLinkage.b.p1.x = baseX1;
                        popupLinkage.b.p2.x = baseX2;
                    }
                    return {
                        ref : imageLinkage.r,
                        base : popupLinkage.b
                    };
                }
                else if(sideBottom) {
                    if(adjustBase) {
                        popupLinkage.t.p1.x = baseX1;
                        popupLinkage.t.p2.x = baseX2;
                    }
                    return {
                        ref : imageLinkage.r,
                        base : popupLinkage.t
                    };
                }
                else {
                    return {
                        ref : imageLinkage.r,
                        base : popupLinkage.l
                    };
                }
            }
            else if( sideLeft ){
                if( sideTop ) {
                    if(adjustBase) {
                        popupLinkage.b.p1.x = baseX1;
                        popupLinkage.b.p2.x = baseX2;
                    }

                    return {
                        ref : imageLinkage.l,
                        base : popupLinkage.b
                    };
                }
                else if( sideBottom ){
                    if(adjustBase) {
                        popupLinkage.t.p1.x = baseX1;
                        popupLinkage.t.p2.x = baseX2;
                    }

                    return {
                        ref : imageLinkage.l,
                        base : popupLinkage.t
                    };
                }
                else {
                    return {
                        ref : imageLinkage.l,
                        base : popupLinkage.r
                    };
                }
            }
            else {
                if( sideTop ) {
                    if(adjustBase) {
                        popupLinkage.b.p1.x = baseX1;
                        popupLinkage.b.p2.x = baseX2;
                    }

                    return {
                        ref : imageLinkage.t,
                        base : popupLinkage.b
                    };
                }
                else if( sideBottom ) {
                    if(adjustBase) {
                        popupLinkage.t.p1.x = baseX1;
                        popupLinkage.t.p2.x = baseX2;
                    }

                    return {
                        ref : imageLinkage.b,
                        base : popupLinkage.t
                    };
                }
                else {
                    return null;
                }
            }
        }
    };


    superfish.p.height = 438;//superfish.util.itemHeight;
    superfish.p.width = 483;
    superfish.p.onAir = 0;

    if ( ! top.djConfig ){
        djConfig = {
            parseOnLoad: true,
            // baseUrl:  superfish.p.cdnUrl,
            baseScriptUri: superfish.p.cdnUrl,
            useXDomain: true,
            scopeMap: [
                ["dojo", "sufio"],
                ["dijit", "sufiw"],
                ["dojox", "sufix"]
            ],
            require: ["dojo.io.script", "dojo._base.html", "dojo.window", "dojo.dnd.Moveable","dojox.gfx", "dojo._base.query", "dijit._base.sniff", "dojo.cookie", "dojo._base.json", "dojo.fx.easing", "dojo.fx"],
            modulePaths: {
                "dojo": spsupport.p.cdnUrl + "dojo",
                "dijit": spsupport.p.cdnUrl + "dijit",
                "dojox": spsupport.p.cdnUrl + "dojox"
            },
            gfxRenderer: 'svg,vml'
        };
    } else {
        djConfig.gfxRenderer = "svg,vml";
        sufio.require("dojo.io.script");
        sufio.require("dojo._base.html");
        sufio.require("dojo.window");
        sufio.require("dojo.dnd.Moveable");
        sufio.require("dojox.gfx");
        sufio.require("dojo._base.query");
        sufio.require("dijit._base.sniff");
        sufio.require("dojo.cookie");
        sufio.require("dojo._base.json");
        sufio.require("dojo.fx.easing");
        sufio.require("dojo.fx");

        setTimeout(function(){
            superfish.util.initPopup(1);
        }, 400 );
    }
}