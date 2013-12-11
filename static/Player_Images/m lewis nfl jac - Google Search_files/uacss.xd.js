/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


window[(typeof (djConfig)!="undefined"&&djConfig.scopeMap&&djConfig.scopeMap[0][1])||"dojo"]._xdResourceLoaded(function(_1,_2,_3){return {depends:[["provide","dojo.uacss"]],defineResource:function(_4,_5,_6){if(!_4._hasResource["dojo.uacss"]){_4._hasResource["dojo.uacss"]=true;_4.provide("dojo.uacss");(function(){var d=_4,_7=d.doc.documentElement,ie=d.isIE,_8=d.isOpera,_9=Math.floor,ff=d.isFF,_a=d.boxModel.replace(/-/,""),_b={dj_ie:ie,dj_ie6:_9(ie)==6,dj_ie7:_9(ie)==7,dj_ie8:_9(ie)==8,dj_quirks:d.isQuirks,dj_iequirks:ie&&d.isQuirks,dj_opera:_8,dj_khtml:d.isKhtml,dj_webkit:d.isWebKit,dj_safari:d.isSafari,dj_chrome:d.isChrome,dj_gecko:d.isMozilla,dj_ff3:_9(ff)==3};_b["dj_"+_a]=true;var _c="";for(var _d in _b){if(_b[_d]){_c+=_d+" ";}}_7.className=d.trim(_7.className+" "+_c);_4._loaders.unshift(function(){if(!_4._isBodyLtr()){var _e="dj_rtl dijitRtl "+_c.replace(/ /g,"-rtl ");_7.className=d.trim(_7.className+" "+_e);}});})();}}};});