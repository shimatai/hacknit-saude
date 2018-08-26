import { Dimensions, Clipboard, Linking } from "react-native";
import { Toast } from 'native-base';
import EventEmitter from 'EventEmitter';
import { WebBrowser } from 'expo';

export function getProportionalSize(dimension, porcentage) {
    if (dimension == 'h' || dimension == 'height') {
        return (porcentage * Dimensions.get('window').height) / 100;
    } else if (dimension == 'w' || dimension == 'width') {
        return (porcentage * Dimensions.get('window').width) / 100;
    }
}

/**
Screen dimensions (Mi Max): 392.72727272727275 x 698.1818181818181
Proportional size:  2 = 0.5092592592592592% x 0.28645833333333337%
Proportional size:  4 = 1.0185185185185184% x 0.5729166666666667%
Proportional size:  6 = 1.5277777777777777% x 0.8593750000000001%
Proportional size:  8 = 2.0370370370370368% x 1.1458333333333335%
Proportional size: 10 = 2.5462962962962963% x 1.4322916666666667%
Proportional size: 12 = 3.0555555555555554% x 1.7187500000000002%
Proportional size: 14 = 3.5648148148148144% x 2.0052083333333335%
Proportional size: 16 = 4.0740740740740735% x 2.291666666666667%
Proportional size: 18 = 4.583333333333333% x 2.578125%
Proportional size: 20 = 5.092592592592593% x 2.8645833333333335%
Proportional size: 22 = 5.601851851851851% x 3.151041666666667%
Proportional size: 24 = 6.111111111111111% x 3.4375000000000004%
Proportional size: 26 = 6.62037037037037% x 3.7239583333333335%
Proportional size: 28 = 7.129629629629629% x 4.010416666666667%
Proportional size: 30 = 7.638888888888888% x 4.296875%
Proportional size: 32 = 8.148148148148147% x 4.583333333333334%
Proportional size: 34 = 8.657407407407407% x 4.869791666666667%
Proportional size: 36 = 9.166666666666666% x 5.15625%
 */

export function getAvatarFromService(service, userid, size) {
    // this return the url that redirects to the according user image/avatar/profile picture
    // implemented services: google profiles, facebook, gravatar, twitter, tumblr, default fallback
    // for google   use get_avatar_from_service('google', profile-name or user-id , size-in-px )
    // for facebook use get_avatar_from_service('facebook', vanity url or user-id , size-in-px or size-as-word )
    // for gravatar use get_avatar_from_service('gravatar', md5 hash email@adress, size-in-px )
    // for twitter  use get_avatar_from_service('twitter', username, size-in-px or size-as-word )
    // for tumblr   use get_avatar_from_service('tumblr', blog-url, size-in-px )
    // everything else will go to the fallback
    // google and gravatar scale the avatar to any site, others will guided to the next best version
    
    var isNumber = function(n) {
        // see http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    
    var url = '';

    switch (service) {

    case "google":
        // see http://googlesystem.blogspot.com/2011/03/unedited-google-profile-pictures.html (couldn't find a better link)
        // available sizes: all, google rescales for you
        url = "http://profiles.google.com/s2/photos/profile/" + userid + "?sz=" + size;
        break;

    case "facebook":
        // see https://developers.facebook.com/docs/reference/api/
        // available sizes: square (50x50), small (50xH) , normal (100xH), large (200xH)
        var sizeparam = '';
        if (isNumber(size)) {
            if (size >= 200) {
                sizeparam = 'large'
            };
            if (size >= 100 && size < 200) {
                sizeparam = 'normal'
            };
            if (size >= 50 && size < 100) {
                sizeparam = 'small'
            };
            if (size < 50) {
                sizeparam = 'square'
            };
        } else {
            sizeparam = size;
        }
        url = "https://graph.facebook.com/" + userid + "/picture?type=" + sizeparam;
        break;

    case "gravatar":
        // see http://en.gravatar.com/site/implement/images/
        // available sizes: all, gravatar rescales for you
        url = "http://www.gravatar.com/avatar/" + userid + "?s=" + size
        break;

    case "twitter":
        // see https://dev.twitter.com/docs/api/1/get/users/profile_image/%3Ascreen_name
        // available sizes: bigger (73x73), normal (48x48), mini (24x24), no param will give you full size
        var sizeparam = '';
        if (isNumber(size)) {
            if (size >= 73) {
                sizeparam = 'bigger'
            };
            if (size >= 48 && size < 73) {
                sizeparam = 'normal'
            };
            if (size < 48) {
                sizeparam = 'mini'
            };
        } else {
            sizeparam = size;
        }

        url = "http://api.twitter.com/1/users/profile_image?screen_name=" + userid + "&size=" + sizeparam;
        break;

    case "tumblr":
        // see http://www.tumblr.com/docs/en/api/v2#blog-avatar
        //TODO do something smarter with the ranges
        // available sizes: 16, 24, 30, 40, 48, 64, 96, 128, 512
        var sizeparam = '';
        if (size >= 512) {
            sizeparam = 512
        };
        if (size >= 128 && size < 512) {
            sizeparam = 128
        };
        if (size >= 96 && size < 128) {
            sizeparam = 96
        };
        if (size >= 64 && size < 96) {
            sizeparam = 64
        };
        if (size >= 48 && size < 64) {
            sizeparam = 48
        };
        if (size >= 40 && size < 48) {
            sizeparam = 40
        };
        if (size >= 30 && size < 40) {
            sizeparam = 30
        };
        if (size >= 24 && size < 30) {
            sizeparam = 24
        };
        if (size < 24) {
            sizeparam = 16
        };

        url = "http://api.tumblr.com/v2/blog/" + userid + "/avatar/" + sizeparam;
        break;

    default:
        // http://www.iconfinder.com/icondetails/23741/128/avatar_devil_evil_green_monster_vampire_icon
        // find your own
        url = "http://i.imgur.com/RLiDK.png"; // 48x48
    }


    return url;
}

export function openSite(url) {
    WebBrowser.openBrowserAsync(url);
};

export function copiarTextoClipboard(msg, showToast) {
    Clipboard.setString(msg);
    if (showToast) {
        Toast.show({
            text: 'Copiado para a área de transferência:\n' + msg,
            position: 'bottom',
            //type: type, // success, warning, danger
            buttonText: 'OK'
        });
    }
};

// https://docs.expo.io/versions/latest/guides/linking.html
export function callPhone(phone) {
    Linking.openURL('tel:' + phone);
};

export function openExternalUrl(url) {
    Linking.openURL(url.indexOf('http') < 0 ? 'http://' + url : url);
}

export const AppEventEmitter = new EventEmitter();
