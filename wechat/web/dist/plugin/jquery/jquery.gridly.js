/*
jQuery Gridly
Copyright 2015 Kevin Sylvestre
1.2.9
 */

(function(){"use strict";var t,i,e,n,s=function(t,i){return function(){return t.apply(i,arguments)}},o=[].slice;t=jQuery,i=function(){function t(){}return t.transitions={webkitTransition:"webkitTransitionEnd",mozTransition:"mozTransitionEnd",oTransition:"oTransitionEnd",transition:"transitionend"},t.transition=function(t){var i,e,n,s;i=t[0],e=this.transitions;for(s in e)if(n=e[s],null!=i.style[s])return n},t.execute=function(t,i){var e;return e=this.transition(t),null!=e?t.one(e,i):i()},t}(),e=function(){function i(t,i,e){this.touchend=s(this.touchend,this),this.click=s(this.click,this),this.moved=s(this.moved,this),this.ended=s(this.ended,this),this.began=s(this.began,this),this.coordinate=s(this.coordinate,this),this.off=s(this.off,this),this.on=s(this.on,this),this.toggle=s(this.toggle,this),this.bind=s(this.bind,this),this.$container=t,this.selector=i,this.callbacks=e,this.toggle()}return i.prototype.bind=function(i){return null==i&&(i="on"),t(document)[i]("mousemove touchmove",this.moved),t(document)[i]("mouseup touchcancel",this.ended)},i.prototype.toggle=function(t){return null==t&&(t="on"),this.$container[t]("mousedown touchstart",this.selector,this.began),this.$container[t]("touchend",this.selector,this.touchend),this.$container[t]("click",this.selector,this.click)},i.prototype.on=function(){return this.toggle("on")},i.prototype.off=function(){return this.toggle("off")},i.prototype.coordinate=function(t){switch(t.type){case"touchstart":case"touchmove":case"touchend":case"touchcancel":return t.originalEvent.touches[0];default:return t}},i.prototype.began=function(i){var e;if(!this.$target)return i.preventDefault(),i.stopPropagation(),this.bind("on"),this.$target=t(i.target).closest(this.$container.find(this.selector)),this.$target.addClass("dragging"),this.origin={x:this.coordinate(i).pageX-this.$target.position().left,y:this.coordinate(i).pageY-this.$target.position().top},null!=(e=this.callbacks)&&"function"==typeof e.began?e.began(i):void 0},i.prototype.ended=function(t){var i;if(null!=this.$target)return"touchend"!==t.type&&(t.preventDefault(),t.stopPropagation()),this.bind("off"),this.$target.removeClass("dragging"),delete this.$target,delete this.origin,null!=(i=this.callbacks)&&"function"==typeof i.ended?i.ended(t):void 0},i.prototype.moved=function(t){var i;if(null!=this.$target)return t.preventDefault(),t.stopPropagation(),this.$target.css({left:this.coordinate(t).pageX-this.origin.x,top:this.coordinate(t).pageY-this.origin.y}),this.dragged=this.$target,null!=(i=this.callbacks)&&"function"==typeof i.moved?i.moved(t):void 0},i.prototype.click=function(t){return this.dragged?(t.preventDefault(),t.stopPropagation(),delete this.dragged):void 0},i.prototype.touchend=function(t){return this.ended(t),this.click(t)},i}(),n=function(){function i(e,n){return null==n&&(n={}),this.optimize=s(this.optimize,this),this.layout=s(this.layout,this),this.structure=s(this.structure,this),this.position=s(this.position,this),this.size=s(this.size,this),this.draggingMoved=s(this.draggingMoved,this),this.draggingEnded=s(this.draggingEnded,this),this.draggingBegan=s(this.draggingBegan,this),this.$sorted=s(this.$sorted,this),this.draggable=s(this.draggable,this),this.compare=s(this.compare,this),this.$=s(this.$,this),this.reordinalize=s(this.reordinalize,this),this.ordinalize=s(this.ordinalize,this),this.$el=e,this.settings=t.extend({},i.settings,n),this.ordinalize(this.$("> *")),this.settings.draggable!==!1&&this.draggable(),this}return i.settings={base:60,gutter:20,columns:12,draggable:{zIndex:800,selector:"> *"}},i.gridly=function(t,e){var n;return null==e&&(e={}),n=t.data("_gridly"),n||(n=new i(t,e),t.data("_gridly",n)),n},i.prototype.ordinalize=function(i){var e,n,s,o,r;for(r=[],n=s=0,o=i.length;o>=0?o>=s:s>=o;n=o>=0?++s:--s)e=t(i[n]),r.push(e.data("position",n));return r},i.prototype.reordinalize=function(t,i){return t.data("position",i)},i.prototype.$=function(t){return this.$el.find(t)},i.prototype.compare=function(t,i){return t.y>i.y+i.h?1:i.y>t.y+t.h?-1:t.x+t.w/2>i.x+i.w/2?1:i.x+i.w/2>t.x+t.w/2?-1:0},i.prototype.draggable=function(t){return null==this._draggable&&(this._draggable=new e(this.$el,this.settings.draggable.selector,{began:this.draggingBegan,ended:this.draggingEnded,moved:this.draggingMoved})),null!=t?this._draggable[t]():void 0},i.prototype.$sorted=function(i){return(i||this.$("> *")).sort(function(i,e){var n,s,o,r,h,a;return n=t(i),s=t(e),o=n.data("position"),h=s.data("position"),r=parseInt(o),a=parseInt(h),null!=o&&null==h?-1:null!=h&&null==o?1:!o&&!h&&n.index()<s.index()?-1:!h&&!o&&s.index()<n.index()?1:a>r?-1:r>a?1:0})},i.prototype.draggingBegan=function(t){var i,e,n;return i=this.$sorted(),this.ordinalize(i),setTimeout(this.layout,0),null!=(e=this.settings)&&null!=(n=e.callbacks)&&"function"==typeof n.reordering?n.reordering(i):void 0},i.prototype.draggingEnded=function(t){var i,e,n;return i=this.$sorted(),this.ordinalize(i),setTimeout(this.layout,0),null!=(e=this.settings)&&null!=(n=e.callbacks)&&"function"==typeof n.reordered?n.reordered(i,this._draggable.dragged):void 0},i.prototype.draggingMoved=function(i){var e,n,s,o,r,h,a,g,u,l,d,c,p;for(e=t(i.target).closest(this.$(this.settings.draggable.selector)),n=this.$sorted(this.$(this.settings.draggable.selector)),l=this.structure(n).positions,u=r=e.data("position"),d=l.filter(function(t){return t.$element.is(e)}),h=0,g=d.length;g>h;h++)s=d[h],s.x=e.position().left,s.y=e.position().top,s.w=e.data("width")||e.outerWidth(),s.h=e.data("height")||e.outerHeight();for(l.sort(this.compare),n=l.map(function(t){return t.$element}),n=((null!=(c=this.settings.callbacks)?c.optimize:void 0)||this.optimize)(n),o=a=0,p=n.length;p>=0?p>a:a>p;o=p>=0?++a:--a)this.reordinalize(t(n[o]),o);return this.layout()},i.prototype.size=function(t){return((t.data("width")||t.outerWidth())+this.settings.gutter)/(this.settings.base+this.settings.gutter)},i.prototype.position=function(t,i){var e,n,s,o,r,h,a,g,u,l;for(l=this.size(t),n=1/0,e=0,s=o=0,a=i.length-l;a>=0?a>o:o>a;s=a>=0?++o:--o)h=Math.max.apply(Math,i.slice(s,s+l)),n>h&&(n=h,e=s);for(s=r=g=e,u=e+l;u>=g?u>r:r>u;s=u>=g?++r:--r)i[s]=n+(t.data("height")||t.outerHeight())+this.settings.gutter;return{x:e*(this.settings.base+this.settings.gutter),y:n}},i.prototype.structure=function(i){var e,n,s,o,r,h,a,g;for(null==i&&(i=this.$sorted()),a=[],n=function(){var t,i,e;for(e=[],s=t=0,i=this.settings.columns;i>=0?i>=t:t>=i;s=i>=0?++t:--t)e.push(0);return e}.call(this),o=r=0,g=i.length;g>=0?g>r:r>g;o=g>=0?++r:--r)e=t(i[o]),h=this.position(e,n),a.push({x:h.x,y:h.y,w:e.data("width")||e.outerWidth(),h:e.data("height")||e.outerHeight(),$element:e});return{height:Math.max.apply(Math,n),positions:a}},i.prototype.layout=function(){var i,e,n,s,o,r,h,a;for(e=((null!=(r=this.settings.callbacks)?r.optimize:void 0)||this.optimize)(this.$sorted()),a=this.structure(e),n=s=0,h=e.length;h>=0?h>s:s>h;n=h>=0?++s:--s)i=t(e[n]),o=a.positions[n],i.is(".dragging")||i.css({position:"absolute",left:o.x,top:o.y});return this.$el.css({height:a.height})},i.prototype.optimize=function(i){var e,n,s,o,r;for(r=[],e=0;i.length>0;){for(e===this.settings.columns&&(e=0),n=0,n=s=0,o=i.length;(o>=0?o>s:s>o)&&e+this.size(t(i[n]))>this.settings.columns;n=o>=0?++s:--s);n===i.length&&(n=0,e=0),e+=this.size(t(i[n])),r.push(i.splice(n,1)[0])}return r},i}(),t.fn.extend({gridly:function(){var i,e;return i=arguments[0],e=2<=arguments.length?o.call(arguments,1):[],null==i&&(i={}),this.each(function(){var s,o,r;return s=t(this),r=t.extend({},t.fn.gridly.defaults,"object"==typeof i&&i),o="string"==typeof i?i:i.action,null==o&&(o="layout"),n.gridly(s,r)[o](e)})}})}).call(this);