var Item = function(options,container){
	if(!container) throw "dude where do i put this";
	this.attrs = {};
	for(var i in options) this.attrs[i] = options[i];
	this.container = container;
	this.spawn();
};

Item.prototype.spawn = function(){
	
	var self = this;

	// Strap together the base.
	this.outerDom = ce("div",{class:"item"});
	this.innerDom = ce("div",{class:"pad"});
	this.outerDom.appendChild(this.innerDom);
	this.container.appendChild(this.outerDom);
	
	var newInput = function(classes){
		return ce("input",{class:classes});
	};
	
	var nameInput = createBoundField(this.attrs,"name",newInput("attr"));
	this.innerDom.appendChild(nameInput);
	
	var submit = ce("button",{},"Save");
	this.innerDom.appendChild(submit);
	submit.addEventListener("click",function(){
		ajax("/saveitem","post",self.attrs).done(function(data){
			console.log(data);
		});
	});
	
};