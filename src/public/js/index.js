(function(){
	// WELCOME TO MY NAMESPACE MUAHAHA.	
	// Few fun bits
	
	var deferred = function(){
        var resolved = false;
        var rejected = false;
        var resolvedCallbacks = [];
        var rejectedCallbacks = [];
        var resolveArgs = [];
        var rejectArgs = [];
        var ns = {};
        ns.done = function(cb){
            if(resolved) {
                cb.apply(null,resolveArgs);
                return;
            }
            resolvedCallbacks.push(cb);
            return this;
        };
        ns.fail = function(cb){
            if(rejected) {
                cb.apply(null,rejectArgs);
                return;
            }
            rejectedCallbacks.push(cb);
            return this;
        };
        ns.always = function(cb){
            return ns.done(cb).fail(cb);
        };
        ns.resolve = function(){
            if(rejected || resolved) return;
            resolved = true;
            resolveArgs = arguments;
            for(var i=0;i<resolvedCallbacks.length;i++){
                resolvedCallbacks[i].apply(null,resolveArgs);
            }
            return this;
        };
        ns.reject = function(){
            if(rejected || resolved) return;
            rejected = true;
            rejectArgs = arguments;
            for(var i=0;i<rejectedCallbacks.length;i++){
                rejectedCallbacks[i].apply(null,rejectArgs);
            }
            return this;
        };
        ns.promise = function(){
            return {
                done:function(){ns.done.apply(null,arguments); return this;},
                fail:function(){ns.fail.apply(null,arguments); return this;},
                always:function(){ns.always.apply(null,arguments); return this;}
            };
        };
        return ns;
    };
	var storage = function(){
		var ns={};
		ns.get = function(name){
			if(localStorage) return localStorage.getItem(name);
		};
		ns.set = function(name,val){
			if(localStorage) return localStorage.setItem(name,val);
		};
		ns.del = function(name){
			if(localStorage) return localStorage.removeItem(name);
		};
		return ns;
	};
	var faIcon = function(name){
		//<i class="fa fa-camera-retro"></i>
		var i = document.createElement('i');
		i.classList.add("fa");
		i.classList.add("fa-"+name);
		return i;
	};
	function fadeIn(el) {
		var d = new deferred();
		el.style.opacity = 0;

		var last = +new Date();
		var tick = function() {
			el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
			last = +new Date();

			if (+el.style.opacity < 1) {
				if (window.requestAnimationFrame)
					requestAnimationFrame(tick);
				else 
					setTimeout(tick, 16);
			} else {
				d.resolve();
			}
		};

		tick();
		return d.promise();
	}
	function fadeOut(el) {
		var d = new deferred();
		el.style.opacity = 1;

		var last = +new Date();
		var tick = function() {
			el.style.opacity = +el.style.opacity - (new Date() - last) / 400;
			last = +new Date();

			if (+el.style.opacity > 0) {
				if (window.requestAnimationFrame)
					requestAnimationFrame(tick);
				else 
					setTimeout(tick, 16);
			} else {
				d.resolve();
			}
		};

		tick();
		return d.promise();
	}
	var getFragObj = function(){
		var base = window.location.hash.match(/^#(.*)/);
		if(!base) return {};
		var bits = base[1].split("&");
		var out = {};
		bits.forEach(function(elem){
		  var splat = elem.split("=");
		  out[splat[0]] = true;
		  if(splat.length > 1) out[splat[0]] = splat[1];
		});
		return out;
	};	
	var setFragObj = function(obj){
		if(!obj && window.location.hash.length > 0){
			console.log("pushing history state to /");
			history.pushState({}, "", "/");
			return;
		}
		var frag = "#";
		var temp = [];
		for(var key in obj){
			var value = obj[key];
			temp.push(key+"="+value);
		}
		frag += temp.join("&");
		
		if(frag == "#") frag = "";
		
		if(frag != window.location.hash){
			console.log(window.location.hash,"!=",frag);
			console.log("pushing history state to ",frag);
			history.pushState({}, "", frag);
		}
	};	
	var modFragObj = function(delta){
		var x = getFragObj;
		for(var i in delta){
			x[i] = delta[i];
		}
		setFragObj(x);
	};

	// Do Things
  
})(); 
