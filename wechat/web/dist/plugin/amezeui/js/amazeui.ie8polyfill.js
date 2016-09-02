/*! Amaze UI v2.7.0 ~ IE8 Fucker | by Amaze UI Team | (c) 2016 AllMobilize, Inc. | Licensed under MIT | 2016-05-24T10:02:50+0800 */

/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */

// Console-polyfill. MIT license.

/**
 * Module: rem - v1.3.4
 * Description: A polyfill to parse CSS links and rewrite pixel equivalents into head for non supporting browsers
 * Date Built: 2014-07-02
 * Copyright (c) 2014  | Chuck Carpenter <chuck.carpenter@me.com>,Lucas Serven <lserven@gmail.com>;
 * @see https://github.com/chuckcarpenter/REM-unit-polyfill
**/

/*! Respond.js v1.4.2: min/max-width media query polyfill
 * Copyright 2014 Scott Jehl
 * Licensed under MIT
 * http://j.mp/respondjs */

!function(e,t){"use strict";"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.returnExports=t()}(this,function(){var e,t,n=Array,r=n.prototype,o=Object,i=o.prototype,a=Function,s=a.prototype,u=String,c=u.prototype,l=Number,f=l.prototype,p=r.slice,h=r.splice,d=r.push,y=r.unshift,g=r.concat,m=r.join,v=s.call,b=s.apply,w=Math.max,O=Math.min,T=i.toString,j="function"==typeof Symbol&&"symbol"==typeof Symbol.toStringTag,x=Function.prototype.toString,E=/^\s*class /,S=function(e){try{var t=x.call(e),n=t.replace(/\/\/.*\n/g,""),r=n.replace(/\/\*[.\s\S]*\*\//g,""),o=r.replace(/\n/gm," ").replace(/ {2}/g," ");return E.test(o)}catch(i){return!1}},D=function(e){try{return S(e)?!1:(x.call(e),!0)}catch(t){return!1}},_="[object Function]",M="[object GeneratorFunction]",e=function(e){if(!e)return!1;if("function"!=typeof e&&"object"!=typeof e)return!1;if(j)return D(e);if(S(e))return!1;var t=T.call(e);return t===_||t===M},P=RegExp.prototype.exec,I=function(e){try{return P.call(e),!0}catch(t){return!1}},C="[object RegExp]";t=function(e){return"object"!=typeof e?!1:j?I(e):T.call(e)===C};var F,N=String.prototype.valueOf,k=function(e){try{return N.call(e),!0}catch(t){return!1}},z="[object String]";F=function(e){return"string"==typeof e?!0:"object"!=typeof e?!1:j?k(e):T.call(e)===z};var R=o.defineProperty&&function(){try{var e={};o.defineProperty(e,"x",{enumerable:!1,value:e});for(var t in e)return!1;return e.x===e}catch(n){return!1}}(),$=function(e){var t;return t=R?function(e,t,n,r){!r&&t in e||o.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:!0,value:n})}:function(e,t,n,r){!r&&t in e||(e[t]=n)},function(n,r,o){for(var i in r)e.call(r,i)&&t(n,i,r[i],o)}}(i.hasOwnProperty),U=function(e){var t=typeof e;return null===e||"object"!==t&&"function"!==t},A=l.isNaN||function(e){return e!==e},L={ToInteger:function(e){var t=+e;return A(t)?t=0:0!==t&&t!==1/0&&t!==-(1/0)&&(t=(t>0||-1)*Math.floor(Math.abs(t))),t},ToPrimitive:function(t){var n,r,o;if(U(t))return t;if(r=t.valueOf,e(r)&&(n=r.call(t),U(n)))return n;if(o=t.toString,e(o)&&(n=o.call(t),U(n)))return n;throw new TypeError},ToObject:function(e){if(null==e)throw new TypeError("can't convert "+e+" to object");return o(e)},ToUint32:function(e){return e>>>0}},X=function(){};$(s,{bind:function(t){var n=this;if(!e(n))throw new TypeError("Function.prototype.bind called on incompatible "+n);for(var r,i=p.call(arguments,1),s=function(){if(this instanceof r){var e=b.call(n,this,g.call(i,p.call(arguments)));return o(e)===e?e:this}return b.call(n,t,g.call(i,p.call(arguments)))},u=w(0,n.length-i.length),c=[],l=0;u>l;l++)d.call(c,"$"+l);return r=a("binder","return function ("+m.call(c,",")+"){ return binder.apply(this, arguments); }")(s),n.prototype&&(X.prototype=n.prototype,r.prototype=new X,X.prototype=null),r}});var B=v.bind(i.hasOwnProperty),G=v.bind(i.toString),J=v.bind(p),q=b.bind(p),Z=v.bind(c.slice),H=v.bind(c.split),W=v.bind(c.indexOf),Y=v.bind(d),Q=v.bind(i.propertyIsEnumerable),V=v.bind(r.sort),K=n.isArray||function(e){return"[object Array]"===G(e)},ee=1!==[].unshift(0);$(r,{unshift:function(){return y.apply(this,arguments),this.length}},ee),$(n,{isArray:K});var te=o("a"),ne="a"!==te[0]||!(0 in te),re=function(e){var t=!0,n=!0,r=!1;if(e)try{e.call("foo",function(e,n,r){"object"!=typeof r&&(t=!1)}),e.call([1],function(){"use strict";n="string"==typeof this},"x")}catch(o){r=!0}return!!e&&!r&&t&&n};$(r,{forEach:function(t){var n,r=L.ToObject(this),o=ne&&F(this)?H(this,""):r,i=-1,a=L.ToUint32(o.length);if(arguments.length>1&&(n=arguments[1]),!e(t))throw new TypeError("Array.prototype.forEach callback must be a function");for(;++i<a;)i in o&&("undefined"==typeof n?t(o[i],i,r):t.call(n,o[i],i,r))}},!re(r.forEach)),$(r,{map:function(t){var r,o=L.ToObject(this),i=ne&&F(this)?H(this,""):o,a=L.ToUint32(i.length),s=n(a);if(arguments.length>1&&(r=arguments[1]),!e(t))throw new TypeError("Array.prototype.map callback must be a function");for(var u=0;a>u;u++)u in i&&("undefined"==typeof r?s[u]=t(i[u],u,o):s[u]=t.call(r,i[u],u,o));return s}},!re(r.map)),$(r,{filter:function(t){var n,r,o=L.ToObject(this),i=ne&&F(this)?H(this,""):o,a=L.ToUint32(i.length),s=[];if(arguments.length>1&&(r=arguments[1]),!e(t))throw new TypeError("Array.prototype.filter callback must be a function");for(var u=0;a>u;u++)u in i&&(n=i[u],("undefined"==typeof r?t(n,u,o):t.call(r,n,u,o))&&Y(s,n));return s}},!re(r.filter)),$(r,{every:function(t){var n,r=L.ToObject(this),o=ne&&F(this)?H(this,""):r,i=L.ToUint32(o.length);if(arguments.length>1&&(n=arguments[1]),!e(t))throw new TypeError("Array.prototype.every callback must be a function");for(var a=0;i>a;a++)if(a in o&&!("undefined"==typeof n?t(o[a],a,r):t.call(n,o[a],a,r)))return!1;return!0}},!re(r.every)),$(r,{some:function(t){var n,r=L.ToObject(this),o=ne&&F(this)?H(this,""):r,i=L.ToUint32(o.length);if(arguments.length>1&&(n=arguments[1]),!e(t))throw new TypeError("Array.prototype.some callback must be a function");for(var a=0;i>a;a++)if(a in o&&("undefined"==typeof n?t(o[a],a,r):t.call(n,o[a],a,r)))return!0;return!1}},!re(r.some));var oe=!1;r.reduce&&(oe="object"==typeof r.reduce.call("es5",function(e,t,n,r){return r})),$(r,{reduce:function(t){var n=L.ToObject(this),r=ne&&F(this)?H(this,""):n,o=L.ToUint32(r.length);if(!e(t))throw new TypeError("Array.prototype.reduce callback must be a function");if(0===o&&1===arguments.length)throw new TypeError("reduce of empty array with no initial value");var i,a=0;if(arguments.length>=2)i=arguments[1];else for(;;){if(a in r){i=r[a++];break}if(++a>=o)throw new TypeError("reduce of empty array with no initial value")}for(;o>a;a++)a in r&&(i=t(i,r[a],a,n));return i}},!oe);var ie=!1;r.reduceRight&&(ie="object"==typeof r.reduceRight.call("es5",function(e,t,n,r){return r})),$(r,{reduceRight:function(t){var n=L.ToObject(this),r=ne&&F(this)?H(this,""):n,o=L.ToUint32(r.length);if(!e(t))throw new TypeError("Array.prototype.reduceRight callback must be a function");if(0===o&&1===arguments.length)throw new TypeError("reduceRight of empty array with no initial value");var i,a=o-1;if(arguments.length>=2)i=arguments[1];else for(;;){if(a in r){i=r[a--];break}if(--a<0)throw new TypeError("reduceRight of empty array with no initial value")}if(0>a)return i;do a in r&&(i=t(i,r[a],a,n));while(a--);return i}},!ie);var ae=r.indexOf&&-1!==[0,1].indexOf(1,2);$(r,{indexOf:function(e){var t=ne&&F(this)?H(this,""):L.ToObject(this),n=L.ToUint32(t.length);if(0===n)return-1;var r=0;for(arguments.length>1&&(r=L.ToInteger(arguments[1])),r=r>=0?r:w(0,n+r);n>r;r++)if(r in t&&t[r]===e)return r;return-1}},ae);var se=r.lastIndexOf&&-1!==[0,1].lastIndexOf(0,-3);$(r,{lastIndexOf:function(e){var t=ne&&F(this)?H(this,""):L.ToObject(this),n=L.ToUint32(t.length);if(0===n)return-1;var r=n-1;for(arguments.length>1&&(r=O(r,L.ToInteger(arguments[1]))),r=r>=0?r:n-Math.abs(r);r>=0;r--)if(r in t&&e===t[r])return r;return-1}},se);var ue=function(){var e=[1,2],t=e.splice();return 2===e.length&&K(t)&&0===t.length}();$(r,{splice:function(e,t){return 0===arguments.length?[]:h.apply(this,arguments)}},!ue);var ce=function(){var e={};return r.splice.call(e,0,0,1),1===e.length}();$(r,{splice:function(e,t){if(0===arguments.length)return[];var n=arguments;return this.length=w(L.ToInteger(this.length),0),arguments.length>0&&"number"!=typeof t&&(n=J(arguments),n.length<2?Y(n,this.length-e):n[1]=L.ToInteger(t)),h.apply(this,n)}},!ce);var le=function(){var e=new n(1e5);return e[8]="x",e.splice(1,1),7===e.indexOf("x")}(),fe=function(){var e=256,t=[];return t[e]="a",t.splice(e+1,0,"b"),"a"===t[e]}();$(r,{splice:function(e,t){for(var n,r=L.ToObject(this),o=[],i=L.ToUint32(r.length),a=L.ToInteger(e),s=0>a?w(i+a,0):O(a,i),c=O(w(L.ToInteger(t),0),i-s),l=0;c>l;)n=u(s+l),B(r,n)&&(o[l]=r[n]),l+=1;var f,p=J(arguments,2),h=p.length;if(c>h){l=s;for(var d=i-c;d>l;)n=u(l+c),f=u(l+h),B(r,n)?r[f]=r[n]:delete r[f],l+=1;l=i;for(var y=i-c+h;l>y;)delete r[l-1],l-=1}else if(h>c)for(l=i-c;l>s;)n=u(l+c-1),f=u(l+h-1),B(r,n)?r[f]=r[n]:delete r[f],l-=1;l=s;for(var g=0;g<p.length;++g)r[l]=p[g],l+=1;return r.length=i-c+h,o}},!le||!fe);var pe,he=r.join;try{pe="1,2,3"!==Array.prototype.join.call("123",",")}catch(de){pe=!0}pe&&$(r,{join:function(e){var t="undefined"==typeof e?",":e;return he.call(F(this)?H(this,""):this,t)}},pe);var ye="1,2"!==[1,2].join(void 0);ye&&$(r,{join:function(e){var t="undefined"==typeof e?",":e;return he.call(this,t)}},ye);var ge=function(e){for(var t=L.ToObject(this),n=L.ToUint32(t.length),r=0;r<arguments.length;)t[n+r]=arguments[r],r+=1;return t.length=n+r,n+r},me=function(){var e={},t=Array.prototype.push.call(e,void 0);return 1!==t||1!==e.length||"undefined"!=typeof e[0]||!B(e,0)}();$(r,{push:function(e){return K(this)?d.apply(this,arguments):ge.apply(this,arguments)}},me);var ve=function(){var e=[],t=e.push(void 0);return 1!==t||1!==e.length||"undefined"!=typeof e[0]||!B(e,0)}();$(r,{push:ge},ve),$(r,{slice:function(e,t){var n=F(this)?H(this,""):this;return q(n,arguments)}},ne);var be=function(){try{return[1,2].sort(null),[1,2].sort({}),!0}catch(e){}return!1}(),we=function(){try{return[1,2].sort(/a/),!1}catch(e){}return!0}(),Oe=function(){try{return[1,2].sort(void 0),!0}catch(e){}return!1}();$(r,{sort:function(t){if("undefined"==typeof t)return V(this);if(!e(t))throw new TypeError("Array.prototype.sort callback must be a function");return V(this,t)}},be||!Oe||!we);var Te=!{toString:null}.propertyIsEnumerable("toString"),je=function(){}.propertyIsEnumerable("prototype"),xe=!B("x","0"),Ee=function(e){var t=e.constructor;return t&&t.prototype===e},Se={$window:!0,$console:!0,$parent:!0,$self:!0,$frame:!0,$frames:!0,$frameElement:!0,$webkitIndexedDB:!0,$webkitStorageInfo:!0,$external:!0},De=function(){if("undefined"==typeof window)return!1;for(var e in window)try{!Se["$"+e]&&B(window,e)&&null!==window[e]&&"object"==typeof window[e]&&Ee(window[e])}catch(t){return!0}return!1}(),_e=function(e){if("undefined"==typeof window||!De)return Ee(e);try{return Ee(e)}catch(t){return!1}},Me=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],Pe=Me.length,Ie=function(e){return"[object Arguments]"===G(e)},Ce=function(t){return null!==t&&"object"==typeof t&&"number"==typeof t.length&&t.length>=0&&!K(t)&&e(t.callee)},Fe=Ie(arguments)?Ie:Ce;$(o,{keys:function(t){var n=e(t),r=Fe(t),o=null!==t&&"object"==typeof t,i=o&&F(t);if(!o&&!n&&!r)throw new TypeError("Object.keys called on a non-object");var a=[],s=je&&n;if(i&&xe||r)for(var c=0;c<t.length;++c)Y(a,u(c));if(!r)for(var l in t)s&&"prototype"===l||!B(t,l)||Y(a,u(l));if(Te)for(var f=_e(t),p=0;Pe>p;p++){var h=Me[p];f&&"constructor"===h||!B(t,h)||Y(a,h)}return a}});var Ne=o.keys&&function(){return 2===o.keys(arguments).length}(1,2),ke=o.keys&&function(){var e=o.keys(arguments);return 1!==arguments.length||1!==e.length||1!==e[0]}(1),ze=o.keys;$(o,{keys:function(e){return ze(Fe(e)?J(e):e)}},!Ne||ke);var Re,$e,Ue=0!==new Date(-0xc782b5b342b24).getUTCMonth(),Ae=new Date(-0x55d318d56a724),Le=new Date(14496624e5),Xe="Mon, 01 Jan -45875 11:59:59 GMT"!==Ae.toUTCString(),Be=Ae.getTimezoneOffset();-720>Be?(Re="Tue Jan 02 -45875"!==Ae.toDateString(),$e=!/^Thu Dec 10 2015 \d\d:\d\d:\d\d GMT[-\+]\d\d\d\d(?: |$)/.test(Le.toString())):(Re="Mon Jan 01 -45875"!==Ae.toDateString(),$e=!/^Wed Dec 09 2015 \d\d:\d\d:\d\d GMT[-\+]\d\d\d\d(?: |$)/.test(Le.toString()));var Ge=v.bind(Date.prototype.getFullYear),Je=v.bind(Date.prototype.getMonth),qe=v.bind(Date.prototype.getDate),Ze=v.bind(Date.prototype.getUTCFullYear),He=v.bind(Date.prototype.getUTCMonth),We=v.bind(Date.prototype.getUTCDate),Ye=v.bind(Date.prototype.getUTCDay),Qe=v.bind(Date.prototype.getUTCHours),Ve=v.bind(Date.prototype.getUTCMinutes),Ke=v.bind(Date.prototype.getUTCSeconds),et=v.bind(Date.prototype.getUTCMilliseconds),tt=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],nt=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],rt=function(e,t){return qe(new Date(t,e,0))};$(Date.prototype,{getFullYear:function(){if(!(this&&this instanceof Date))throw new TypeError("this is not a Date object.");var e=Ge(this);return 0>e&&Je(this)>11?e+1:e},getMonth:function(){if(!(this&&this instanceof Date))throw new TypeError("this is not a Date object.");var e=Ge(this),t=Je(this);return 0>e&&t>11?0:t},getDate:function(){if(!(this&&this instanceof Date))throw new TypeError("this is not a Date object.");var e=Ge(this),t=Je(this),n=qe(this);if(0>e&&t>11){if(12===t)return n;var r=rt(0,e+1);return r-n+1}return n},getUTCFullYear:function(){if(!(this&&this instanceof Date))throw new TypeError("this is not a Date object.");var e=Ze(this);return 0>e&&He(this)>11?e+1:e},getUTCMonth:function(){if(!(this&&this instanceof Date))throw new TypeError("this is not a Date object.");var e=Ze(this),t=He(this);return 0>e&&t>11?0:t},getUTCDate:function(){if(!(this&&this instanceof Date))throw new TypeError("this is not a Date object.");var e=Ze(this),t=He(this),n=We(this);if(0>e&&t>11){if(12===t)return n;var r=rt(0,e+1);return r-n+1}return n}},Ue),$(Date.prototype,{toUTCString:function(){if(!(this&&this instanceof Date))throw new TypeError("this is not a Date object.");var e=Ye(this),t=We(this),n=He(this),r=Ze(this),o=Qe(this),i=Ve(this),a=Ke(this);return tt[e]+", "+(10>t?"0"+t:t)+" "+nt[n]+" "+r+" "+(10>o?"0"+o:o)+":"+(10>i?"0"+i:i)+":"+(10>a?"0"+a:a)+" GMT"}},Ue||Xe),$(Date.prototype,{toDateString:function(){if(!(this&&this instanceof Date))throw new TypeError("this is not a Date object.");var e=this.getDay(),t=this.getDate(),n=this.getMonth(),r=this.getFullYear();return tt[e]+" "+nt[n]+" "+(10>t?"0"+t:t)+" "+r}},Ue||Re),(Ue||$e)&&(Date.prototype.toString=function(){if(!(this&&this instanceof Date))throw new TypeError("this is not a Date object.");var e=this.getDay(),t=this.getDate(),n=this.getMonth(),r=this.getFullYear(),o=this.getHours(),i=this.getMinutes(),a=this.getSeconds(),s=this.getTimezoneOffset(),u=Math.floor(Math.abs(s)/60),c=Math.floor(Math.abs(s)%60);return tt[e]+" "+nt[n]+" "+(10>t?"0"+t:t)+" "+r+" "+(10>o?"0"+o:o)+":"+(10>i?"0"+i:i)+":"+(10>a?"0"+a:a)+" GMT"+(s>0?"-":"+")+(10>u?"0"+u:u)+(10>c?"0"+c:c)},R&&o.defineProperty(Date.prototype,"toString",{configurable:!0,enumerable:!1,writable:!0}));var ot=-621987552e5,it="-000001",at=Date.prototype.toISOString&&-1===new Date(ot).toISOString().indexOf(it),st=Date.prototype.toISOString&&"1969-12-31T23:59:59.999Z"!==new Date(-1).toISOString(),ut=v.bind(Date.prototype.getTime);$(Date.prototype,{toISOString:function(){if(!isFinite(this)||!isFinite(ut(this)))throw new RangeError("Date.prototype.toISOString called on non-finite value.");var e=Ze(this),t=He(this);e+=Math.floor(t/12),t=(t%12+12)%12;var n=[t+1,We(this),Qe(this),Ve(this),Ke(this)];e=(0>e?"-":e>9999?"+":"")+Z("00000"+Math.abs(e),e>=0&&9999>=e?-4:-6);for(var r=0;r<n.length;++r)n[r]=Z("00"+n[r],-2);return e+"-"+J(n,0,2).join("-")+"T"+J(n,2).join(":")+"."+Z("000"+et(this),-3)+"Z"}},at||st);var ct=function(){try{return Date.prototype.toJSON&&null===new Date(NaN).toJSON()&&-1!==new Date(ot).toJSON().indexOf(it)&&Date.prototype.toJSON.call({toISOString:function(){return!0}})}catch(e){return!1}}();ct||(Date.prototype.toJSON=function(t){var n=o(this),r=L.ToPrimitive(n);if("number"==typeof r&&!isFinite(r))return null;var i=n.toISOString;if(!e(i))throw new TypeError("toISOString property is not callable");return i.call(n)});var lt=1e15===Date.parse("+033658-09-27T01:46:40.000Z"),ft=!isNaN(Date.parse("2012-04-04T24:00:00.500Z"))||!isNaN(Date.parse("2012-11-31T23:59:59.000Z"))||!isNaN(Date.parse("2012-12-31T23:59:60.000Z")),pt=isNaN(Date.parse("2000-01-01T00:00:00.000Z"));if(pt||ft||!lt){var ht=Math.pow(2,31)-1,dt=A(new Date(1970,0,1,0,0,0,ht+1).getTime());Date=function(e){var t=function(n,r,o,i,a,s,c){var l,f=arguments.length;if(this instanceof e){var p=s,h=c;if(dt&&f>=7&&c>ht){var d=Math.floor(c/ht)*ht,y=Math.floor(d/1e3);p+=y,h-=1e3*y}l=1===f&&u(n)===n?new e(t.parse(n)):f>=7?new e(n,r,o,i,a,p,h):f>=6?new e(n,r,o,i,a,p):f>=5?new e(n,r,o,i,a):f>=4?new e(n,r,o,i):f>=3?new e(n,r,o):f>=2?new e(n,r):f>=1?new e(n instanceof e?+n:n):new e}else l=e.apply(this,arguments);return U(l)||$(l,{constructor:t},!0),l},n=new RegExp("^(\\d{4}|[+-]\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2})(?::(\\d{2})(?:(\\.\\d{1,}))?)?(Z|(?:([-+])(\\d{2}):(\\d{2})))?)?)?)?$"),r=[0,31,59,90,120,151,181,212,243,273,304,334,365],o=function(e,t){var n=t>1?1:0;return r[t]+Math.floor((e-1969+n)/4)-Math.floor((e-1901+n)/100)+Math.floor((e-1601+n)/400)+365*(e-1970)},i=function(t){var n=0,r=t;if(dt&&r>ht){var o=Math.floor(r/ht)*ht,i=Math.floor(o/1e3);n+=i,r-=1e3*i}return l(new e(1970,0,1,0,0,n,r))};for(var a in e)B(e,a)&&(t[a]=e[a]);$(t,{now:e.now,UTC:e.UTC},!0),t.prototype=e.prototype,$(t.prototype,{constructor:t},!0);var s=function(t){var r=n.exec(t);if(r){var a,s=l(r[1]),u=l(r[2]||1)-1,c=l(r[3]||1)-1,f=l(r[4]||0),p=l(r[5]||0),h=l(r[6]||0),d=Math.floor(1e3*l(r[7]||0)),y=Boolean(r[4]&&!r[8]),g="-"===r[9]?1:-1,m=l(r[10]||0),v=l(r[11]||0),b=p>0||h>0||d>0;return(b?24:25)>f&&60>p&&60>h&&1e3>d&&u>-1&&12>u&&24>m&&60>v&&c>-1&&c<o(s,u+1)-o(s,u)&&(a=60*(24*(o(s,u)+c)+f+m*g),a=1e3*(60*(a+p+v*g)+h)+d,y&&(a=i(a)),a>=-864e13&&864e13>=a)?a:NaN}return e.parse.apply(this,arguments)};return $(t,{parse:s}),t}(Date)}Date.now||(Date.now=function(){return(new Date).getTime()});var yt=f.toFixed&&("0.000"!==8e-5.toFixed(3)||"1"!==.9.toFixed(0)||"1.25"!==1.255.toFixed(2)||"1000000000000000128"!==0xde0b6b3a7640080.toFixed(0)),gt={base:1e7,size:6,data:[0,0,0,0,0,0],multiply:function(e,t){for(var n=-1,r=t;++n<gt.size;)r+=e*gt.data[n],gt.data[n]=r%gt.base,r=Math.floor(r/gt.base)},divide:function(e){for(var t=gt.size,n=0;--t>=0;)n+=gt.data[t],gt.data[t]=Math.floor(n/e),n=n%e*gt.base},numToString:function(){for(var e=gt.size,t="";--e>=0;)if(""!==t||0===e||0!==gt.data[e]){var n=u(gt.data[e]);""===t?t=n:t+=Z("0000000",0,7-n.length)+n}return t},pow:function zt(e,t,n){return 0===t?n:t%2===1?zt(e,t-1,n*e):zt(e*e,t/2,n)},log:function(e){for(var t=0,n=e;n>=4096;)t+=12,n/=4096;for(;n>=2;)t+=1,n/=2;return t}},mt=function(e){var t,n,r,o,i,a,s,c;if(t=l(e),t=A(t)?0:Math.floor(t),0>t||t>20)throw new RangeError("Number.toFixed called with invalid number of decimals");if(n=l(this),A(n))return"NaN";if(-1e21>=n||n>=1e21)return u(n);if(r="",0>n&&(r="-",n=-n),o="0",n>1e-21)if(i=gt.log(n*gt.pow(2,69,1))-69,a=0>i?n*gt.pow(2,-i,1):n/gt.pow(2,i,1),a*=4503599627370496,i=52-i,i>0){for(gt.multiply(0,a),s=t;s>=7;)gt.multiply(1e7,0),s-=7;for(gt.multiply(gt.pow(10,s,1),0),s=i-1;s>=23;)gt.divide(1<<23),s-=23;gt.divide(1<<s),gt.multiply(1,1),gt.divide(2),o=gt.numToString()}else gt.multiply(0,a),gt.multiply(1<<-i,0),o=gt.numToString()+Z("0.00000000000000000000",2,2+t);return t>0?(c=o.length,o=t>=c?r+Z("0.0000000000000000000",0,t-c+2)+o:r+Z(o,0,c-t)+"."+Z(o,c-t)):o=r+o,o};$(f,{toFixed:mt},yt);var vt=function(){try{return"1"===1..toPrecision(void 0)}catch(e){return!0}}(),bt=f.toPrecision;$(f,{toPrecision:function(e){return"undefined"==typeof e?bt.call(this):bt.call(this,e)}},vt),2!=="ab".split(/(?:ab)*/).length||4!==".".split(/(.?)(.?)/).length||"t"==="tesst".split(/(s)*/)[1]||4!=="test".split(/(?:)/,-1).length||"".split(/.?/).length||".".split(/()()/).length>1?!function(){var e="undefined"==typeof/()??/.exec("")[1],n=Math.pow(2,32)-1;c.split=function(r,o){var i=String(this);if("undefined"==typeof r&&0===o)return[];if(!t(r))return H(this,r,o);var a,s,u,c,l=[],f=(r.ignoreCase?"i":"")+(r.multiline?"m":"")+(r.unicode?"u":"")+(r.sticky?"y":""),p=0,h=new RegExp(r.source,f+"g");e||(a=new RegExp("^"+h.source+"$(?!\\s)",f));var y="undefined"==typeof o?n:L.ToUint32(o);for(s=h.exec(i);s&&(u=s.index+s[0].length,!(u>p&&(Y(l,Z(i,p,s.index)),!e&&s.length>1&&s[0].replace(a,function(){for(var e=1;e<arguments.length-2;e++)"undefined"==typeof arguments[e]&&(s[e]=void 0)}),s.length>1&&s.index<i.length&&d.apply(l,J(s,1)),c=s[0].length,p=u,l.length>=y)));)h.lastIndex===s.index&&h.lastIndex++,s=h.exec(i);return p===i.length?(c||!h.test(""))&&Y(l,""):Y(l,Z(i,p)),l.length>y?J(l,0,y):l}}():"0".split(void 0,0).length&&(c.split=function(e,t){return"undefined"==typeof e&&0===t?[]:H(this,e,t)});var wt=c.replace,Ot=function(){var e=[];return"x".replace(/x(.)?/g,function(t,n){Y(e,n)}),1===e.length&&"undefined"==typeof e[0]}();Ot||(c.replace=function(n,r){var o=e(r),i=t(n)&&/\)[*?]/.test(n.source);if(o&&i){var a=function(e){var t=arguments.length,o=n.lastIndex;n.lastIndex=0;var i=n.exec(e)||[];return n.lastIndex=o,Y(i,arguments[t-2],arguments[t-1]),r.apply(this,i)};return wt.call(this,n,a)}return wt.call(this,n,r)});var Tt=c.substr,jt="".substr&&"b"!=="0b".substr(-1);$(c,{substr:function(e,t){var n=e;return 0>e&&(n=w(this.length+e,0)),Tt.call(this,n,t)}},jt);var xt="	\n\x0B\f\r   ᠎             　\u2028\u2029\ufeff",Et="​",St="["+xt+"]",Dt=new RegExp("^"+St+St+"*"),_t=new RegExp(St+St+"*$"),Mt=c.trim&&(xt.trim()||!Et.trim());$(c,{trim:function(){if("undefined"==typeof this||null===this)throw new TypeError("can't convert "+this+" to object");return u(this).replace(Dt,"").replace(_t,"")}},Mt);var Pt=v.bind(String.prototype.trim),It=c.lastIndexOf&&-1!=="abcあい".lastIndexOf("あい",2);$(c,{lastIndexOf:function(e){if("undefined"==typeof this||null===this)throw new TypeError("can't convert "+this+" to object");for(var t=u(this),n=u(e),r=arguments.length>1?l(arguments[1]):NaN,o=A(r)?1/0:L.ToInteger(r),i=O(w(o,0),t.length),a=n.length,s=i+a;s>0;){s=w(0,s-a);var c=W(Z(t,s,i+a),n);if(-1!==c)return s+c}return-1}},It);var Ct=c.lastIndexOf;if($(c,{lastIndexOf:function(e){return Ct.apply(this,arguments)}},1!==c.lastIndexOf.length),(8!==parseInt(xt+"08")||22!==parseInt(xt+"0x16"))&&(parseInt=function(e){var t=/^[\-+]?0[xX]/;return function(n,r){var o=Pt(n),i=l(r)||(t.test(o)?16:10);return e(o,i)}}(parseInt)),1/parseFloat("-0")!==-(1/0)&&(parseFloat=function(e){return function(t){var n=Pt(t),r=e(n);return 0===r&&"-"===Z(n,0,1)?-0:r}}(parseFloat)),"RangeError: test"!==String(new RangeError("test"))){var Ft=function(){if("undefined"==typeof this||null===this)throw new TypeError("can't convert "+this+" to object");var e=this.name;"undefined"==typeof e?e="Error":"string"!=typeof e&&(e=u(e));var t=this.message;return"undefined"==typeof t?t="":"string"!=typeof t&&(t=u(t)),e?t?e+": "+t:e:t};Error.prototype.toString=Ft}if(R){var Nt=function(e,t){if(Q(e,t)){var n=Object.getOwnPropertyDescriptor(e,t);n.enumerable=!1,Object.defineProperty(e,t,n)}};Nt(Error.prototype,"message"),""!==Error.prototype.message&&(Error.prototype.message=""),Nt(Error.prototype,"name")}if("/a/gim"!==String(/a/gim)){var kt=function(){var e="/"+this.source+"/";return this.global&&(e+="g"),this.ignoreCase&&(e+="i"),this.multiline&&(e+="m"),e};RegExp.prototype.toString=kt}}),function(e,t){"use strict";"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.returnExports=t()}(this,function(){var e,t,n,r,o=Function.call,i=Object.prototype,a=o.bind(i.hasOwnProperty),s=o.bind(i.propertyIsEnumerable),u=o.bind(i.toString),c=a(i,"__defineGetter__");c&&(e=o.bind(i.__defineGetter__),t=o.bind(i.__defineSetter__),n=o.bind(i.__lookupGetter__),r=o.bind(i.__lookupSetter__)),Object.getPrototypeOf||(Object.getPrototypeOf=function(e){var t=e.__proto__;return t||null===t?t:"[object Function]"===u(e.constructor)?e.constructor.prototype:e instanceof Object?i:null});var l=function(e){try{return e.sentinel=0,0===Object.getOwnPropertyDescriptor(e,"sentinel").value}catch(t){return!1}};if(Object.defineProperty){var f=l({}),p="undefined"==typeof document||l(document.createElement("div"));if(!p||!f)var h=Object.getOwnPropertyDescriptor}if(!Object.getOwnPropertyDescriptor||h){var d="Object.getOwnPropertyDescriptor called on a non-object: ";Object.getOwnPropertyDescriptor=function(e,t){if("object"!=typeof e&&"function"!=typeof e||null===e)throw new TypeError(d+e);if(h)try{return h.call(Object,e,t)}catch(o){}var u;if(!a(e,t))return u;if(u={enumerable:s(e,t),configurable:!0},c){var l=e.__proto__,f=e!==i;f&&(e.__proto__=i);var p=n(e,t),y=r(e,t);if(f&&(e.__proto__=l),p||y)return p&&(u.get=p),y&&(u.set=y),u}return u.value=e[t],u.writable=!0,u}}if(Object.getOwnPropertyNames||(Object.getOwnPropertyNames=function(e){return Object.keys(e)}),!Object.create){var y,g=!({__proto__:null}instanceof Object),m=function(){if(!document.domain)return!1;try{return!!new ActiveXObject("htmlfile")}catch(e){return!1}},v=function(){var e,t;return t=new ActiveXObject("htmlfile"),t.write("<script></script>"),t.close(),e=t.parentWindow.Object.prototype,t=null,e},b=function(){var e,t=document.createElement("iframe"),n=document.body||document.documentElement;return t.style.display="none",n.appendChild(t),t.src="javascript:",e=t.contentWindow.Object.prototype,n.removeChild(t),t=null,e};y=g||"undefined"==typeof document?function(){return{__proto__:null}}:function(){var e=m()?v():b();delete e.constructor,delete e.hasOwnProperty,delete e.propertyIsEnumerable,delete e.isPrototypeOf,delete e.toLocaleString,delete e.toString,delete e.valueOf;var t=function(){};return t.prototype=e,y=function(){return new t},new t},Object.create=function(e,t){var n,r=function(){};if(null===e)n=y();else{if("object"!=typeof e&&"function"!=typeof e)throw new TypeError("Object prototype may only be an Object or null");r.prototype=e,n=new r,n.__proto__=e}return void 0!==t&&Object.defineProperties(n,t),n}}var w=function(e){try{return Object.defineProperty(e,"sentinel",{}),"sentinel"in e}catch(t){return!1}};if(Object.defineProperty){var O=w({}),T="undefined"==typeof document||w(document.createElement("div"));if(!O||!T)var j=Object.defineProperty,x=Object.defineProperties}if(!Object.defineProperty||j){var E="Property description must be an object: ",S="Object.defineProperty called on non-object: ",D="getters & setters can not be defined on this javascript engine";Object.defineProperty=function(o,a,s){if("object"!=typeof o&&"function"!=typeof o||null===o)throw new TypeError(S+o);if("object"!=typeof s&&"function"!=typeof s||null===s)throw new TypeError(E+s);if(j)try{return j.call(Object,o,a,s)}catch(u){}if("value"in s)if(c&&(n(o,a)||r(o,a))){var l=o.__proto__;o.__proto__=i,delete o[a],o[a]=s.value,o.__proto__=l}else o[a]=s.value;else{if(!c&&("get"in s||"set"in s))throw new TypeError(D);"get"in s&&e(o,a,s.get),"set"in s&&t(o,a,s.set)}return o}}(!Object.defineProperties||x)&&(Object.defineProperties=function(e,t){if(x)try{return x.call(Object,e,t)}catch(n){}return Object.keys(t).forEach(function(n){"__proto__"!==n&&Object.defineProperty(e,n,t[n])}),e}),Object.seal||(Object.seal=function(e){if(Object(e)!==e)throw new TypeError("Object.seal can only be called on Objects.");return e}),Object.freeze||(Object.freeze=function(e){if(Object(e)!==e)throw new TypeError("Object.freeze can only be called on Objects.");return e});try{Object.freeze(function(){})}catch(_){Object.freeze=function(e){return function(t){return"function"==typeof t?t:e(t)}}(Object.freeze)}Object.preventExtensions||(Object.preventExtensions=function(e){if(Object(e)!==e)throw new TypeError("Object.preventExtensions can only be called on Objects.");return e}),Object.isSealed||(Object.isSealed=function(e){if(Object(e)!==e)throw new TypeError("Object.isSealed can only be called on Objects.");return!1}),Object.isFrozen||(Object.isFrozen=function(e){if(Object(e)!==e)throw new TypeError("Object.isFrozen can only be called on Objects.");return!1}),Object.isExtensible||(Object.isExtensible=function(e){if(Object(e)!==e)throw new TypeError("Object.isExtensible can only be called on Objects.");for(var t="";a(e,t);)t+="?";e[t]=!0;var n=a(e,t);return delete e[t],n})}),function(e){"use strict";e.console=e.console||{};for(var t,n,r=e.console,o={},i=function(){},a="memory".split(","),s="assert,clear,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn".split(",");t=a.pop();)r[t]||(r[t]=o);for(;n=s.pop();)"function"!=typeof r[n]&&(r[n]=i)}("undefined"==typeof window?this:window),!window.addEventListener&&function(e,t,n,r,o,i,a){e[r]=t[r]=n[r]=function(e,t){var n=this;a.unshift([n,e,t,function(e){e.currentTarget=n,e.preventDefault=function(){e.returnValue=!1},e.stopPropagation=function(){e.cancelBubble=!0},e.target=e.srcElement||n,t.call(n,e)}]),this.attachEvent("on"+e,a[0][3])},e[o]=t[o]=n[o]=function(e,t){for(var n,r=0;n=a[r];++r)if(n[0]==this&&n[1]==e&&n[2]==t)return this.detachEvent("on"+e,a.splice(r,1)[0][3])},e[i]=t[i]=n[i]=function(e){return this.fireEvent("on"+e.type,e)}}(Window.prototype,HTMLDocument.prototype,Element.prototype,"addEventListener","removeEventListener","dispatchEvent",[]),function(e,t){"use strict";var n=function(){var e=document.createElement("div");return e.style.cssText="font-size: 1rem;",/rem/.test(e.style.fontSize)},r=function(){for(var e=document.getElementsByTagName("link"),t=[],n=0;n<e.length;n++)"stylesheet"===e[n].rel.toLowerCase()&&null===e[n].getAttribute("data-norem")&&t.push(e[n].href);return t},o=function(){for(var e=0;e<h.length;e++)l(h[e],i)},i=function(e,t){if(m.push(e.responseText),v.push(t),v.length===h.length){for(var n=0;n<v.length;n++)a(m[n],v[n]);(h=d.slice(0)).length>0?(v=[],m=[],d=[],o()):s()}},a=function(e,t){for(var n,r=f(e).replace(/\/\*[\s\S]*?\*\//g,""),o=/[\w\d\s\-\/\\\[\]:,.'"*()<>+~%#^$_=|@]+\{[\w\d\s\-\/\\%#:!;,.'"*()]+\d*\.?\d+rem[\w\d\s\-\/\\%#:!;,.'"*()]*\}/g,i=r.match(o),a=/\d*\.?\d+rem/g,s=r.match(a),u=/(.*\/)/,c=u.exec(t)[0],l=/@import (?:url\()?['"]?([^'\)"]*)['"]?\)?[^;]*/gm;null!==(n=l.exec(e));)0===n[1].indexOf("/")?d.push(n[1]):d.push(c+n[1]);null!==i&&0!==i.length&&(y=y.concat(i),g=g.concat(s))},s=function(){for(var e=/[\w\d\s\-\/\\%#:,.'"*()]+\d*\.?\d+rem[\w\d\s\-\/\\%#:!,.'"*()]*[;}]/g,t=0;t<y.length;t++){p+=y[t].substr(0,y[t].indexOf("{")+1);for(var n=y[t].match(e),r=0;r<n.length;r++)p+=n[r],r===n.length-1&&"}"!==p[p.length-1]&&(p+="\n}")}u()},u=function(){for(var e=0;e<g.length;e++)b[e]=Math.round(parseFloat(g[e].substr(0,g[e].length-3)*w))+"px";c()},c=function(){for(var e=0;e<b.length;e++)b[e]&&(p=p.replace(g[e],b[e]));var t=document.createElement("style");t.setAttribute("type","text/css"),t.id="remReplace",document.getElementsByTagName("head")[0].appendChild(t),t.styleSheet?t.styleSheet.cssText=p:t.appendChild(document.createTextNode(p))},l=function(t,n){try{var r=e.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP")||new ActiveXObject("Msxml2.XMLHTTP"):new XMLHttpRequest;r.open("GET",t,!0),r.onreadystatechange=function(){4===r.readyState&&n(r,t)},r.send(null)}catch(o){if(e.XDomainRequest){var i=new XDomainRequest;i.open("get",t),i.onload=function(){n(i,t)},i.onerror=function(){return!1},i.send()}}},f=function(t){return e.matchMedia||e.msMatchMedia||(t=t.replace(/@media[\s\S]*?\}\s*\}/g,"")),t};if(!n()){var p="",h=r(),d=[],y=[],g=[],m=[],v=[],b=[],w="";w=function(){var e,t=document,n=t.documentElement,r=t.body||t.createElement("body"),o=!t.body,i=t.createElement("div"),a=r.style.fontSize;return o&&n.appendChild(r),i.style.cssText="width:1em; position:absolute; visibility:hidden; padding: 0;",r.style.fontSize="1em",r.appendChild(i),e=i.offsetWidth,o?n.removeChild(r):(r.removeChild(i),r.style.fontSize=a),e}(),o()}}(window),!function(e){"use strict";e.matchMedia=e.matchMedia||function(e){var t,n=e.documentElement,r=n.firstElementChild||n.firstChild,o=e.createElement("body"),i=e.createElement("div");return i.id="mq-test-1",i.style.cssText="position:absolute;top:-100em",o.style.background="none",o.appendChild(i),function(e){return i.innerHTML='&shy;<style media="'+e+'"> #mq-test-1 { width: 42px; }</style>',n.insertBefore(o,r),t=42===i.offsetWidth,n.removeChild(o),{matches:t,media:e}}}(e.document)}(this),function(e){"use strict";function t(){O(!0)}var n={};e.respond=n,n.update=function(){};var r=[],o=function(){var t=!1;try{t=new e.XMLHttpRequest}catch(n){t=new e.ActiveXObject("Microsoft.XMLHTTP")}return function(){return t}}(),i=function(e,t){var n=o();n&&(n.open("GET",e,!0),n.onreadystatechange=function(){4!==n.readyState||200!==n.status&&304!==n.status||t(n.responseText);
},4!==n.readyState&&n.send(null))},a=function(e){return e.replace(n.regex.minmaxwh,"").match(n.regex.other)};if(n.ajax=i,n.queue=r,n.unsupportedmq=a,n.regex={media:/@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,keyframes:/@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,comments:/\/\*[^*]*\*+([^\/][^*]*\*+)*\//gi,urls:/(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,findStyles:/@media *([^\{]+)\{([\S\s]+?)$/,only:/(only\s+)?([a-zA-Z]+)\s?/,minw:/\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,maxw:/\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,minmaxwh:/\(\s*m(in|ax)\-(height|width)\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/gi,other:/\([^\)]*\)/g},n.mediaQueriesSupported=e.matchMedia&&null!==e.matchMedia("only all")&&e.matchMedia("only all").matches,!n.mediaQueriesSupported){var s,u,c,l=e.document,f=l.documentElement,p=[],h=[],d=[],y={},g=30,m=l.getElementsByTagName("head")[0]||f,v=l.getElementsByTagName("base")[0],b=m.getElementsByTagName("link"),w=function(){var e,t=l.createElement("div"),n=l.body,r=f.style.fontSize,o=n&&n.style.fontSize,i=!1;return t.style.cssText="position:absolute;font-size:1em;width:1em",n||(n=i=l.createElement("body"),n.style.background="none"),f.style.fontSize="100%",n.style.fontSize="100%",n.appendChild(t),i&&f.insertBefore(n,f.firstChild),e=t.offsetWidth,i?f.removeChild(n):n.removeChild(t),f.style.fontSize=r,o&&(n.style.fontSize=o),e=c=parseFloat(e)},O=function(t){var n="clientWidth",r=f[n],o="CSS1Compat"===l.compatMode&&r||l.body[n]||r,i={},a=b[b.length-1],y=(new Date).getTime();if(t&&s&&g>y-s)return e.clearTimeout(u),void(u=e.setTimeout(O,g));s=y;for(var v in p)if(p.hasOwnProperty(v)){var T=p[v],j=T.minw,x=T.maxw,E=null===j,S=null===x,D="em";j&&(j=parseFloat(j)*(j.indexOf(D)>-1?c||w():1)),x&&(x=parseFloat(x)*(x.indexOf(D)>-1?c||w():1)),T.hasquery&&(E&&S||!(E||o>=j)||!(S||x>=o))||(i[T.media]||(i[T.media]=[]),i[T.media].push(h[T.rules]))}for(var _ in d)d.hasOwnProperty(_)&&d[_]&&d[_].parentNode===m&&m.removeChild(d[_]);d.length=0;for(var M in i)if(i.hasOwnProperty(M)){var P=l.createElement("style"),I=i[M].join("\n");P.type="text/css",P.media=M,m.insertBefore(P,a.nextSibling),P.styleSheet?P.styleSheet.cssText=I:P.appendChild(l.createTextNode(I)),d.push(P)}},T=function(e,t,r){var o=e.replace(n.regex.comments,"").replace(n.regex.keyframes,"").match(n.regex.media),i=o&&o.length||0;t=t.substring(0,t.lastIndexOf("/"));var s=function(e){return e.replace(n.regex.urls,"$1"+t+"$2$3")},u=!i&&r;t.length&&(t+="/"),u&&(i=1);for(var c=0;i>c;c++){var l,f,d,y;u?(l=r,h.push(s(e))):(l=o[c].match(n.regex.findStyles)&&RegExp.$1,h.push(RegExp.$2&&s(RegExp.$2))),d=l.split(","),y=d.length;for(var g=0;y>g;g++)f=d[g],a(f)||p.push({media:f.split("(")[0].match(n.regex.only)&&RegExp.$2||"all",rules:h.length-1,hasquery:f.indexOf("(")>-1,minw:f.match(n.regex.minw)&&parseFloat(RegExp.$1)+(RegExp.$2||""),maxw:f.match(n.regex.maxw)&&parseFloat(RegExp.$1)+(RegExp.$2||"")})}O()},j=function(){if(r.length){var t=r.shift();i(t.href,function(n){T(n,t.href,t.media),y[t.href]=!0,e.setTimeout(function(){j()},0)})}},x=function(){for(var t=0;t<b.length;t++){var n=b[t],o=n.href,i=n.media,a=n.rel&&"stylesheet"===n.rel.toLowerCase();o&&a&&!y[o]&&(n.styleSheet&&n.styleSheet.rawCssText?(T(n.styleSheet.rawCssText,o,i),y[o]=!0):(!/^([a-zA-Z:]*\/\/)/.test(o)&&!v||o.replace(RegExp.$1,"").split("/")[0]===e.location.host)&&("//"===o.substring(0,2)&&(o=e.location.protocol+o),r.push({href:o,media:i})))}j()};x(),n.update=x,n.getEmValue=w,e.addEventListener?e.addEventListener("resize",t,!1):e.attachEvent&&e.attachEvent("onresize",t)}}(this);