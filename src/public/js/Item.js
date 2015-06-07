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

	// Spawn Fields
	var fieldsDiv = ce("div",{class:"fields"});
	var fieldsSet = ce("fieldset");
	var fieldsLegend = ce("legend",{},"Basic Information -- ");
	this.innerDom.appendChild(fieldsDiv);
	fieldsDiv.appendChild(fieldsSet);
	fieldsSet.appendChild(fieldsLegend);
	// Add sweet-ass databound title to the legend
	var dbtitle = createBoundElement(self.attrs,"name",self.attrs._id,ce("span"));
	fieldsLegend.appendChild(dbtitle);
	
	var createField = function(prop,labeltext,tag){
		tag = tag || "input";
		var div = ce("div",{class:"fieldrow"}); fieldsSet.appendChild(div);
		var pad = ce("div",{class:"fieldrowpad"}); div.appendChild(pad);
		var label = ce("label",{},labeltext);  pad.appendChild(label);
		var input = createBoundElement(self.attrs,prop,self.attrs._id,ce(tag,{class:"field"})); pad.appendChild(input);
		
	};
	
	createField("_id","Internal ID");
	createField("name","Name");
	
	// Spawn Stats
	var stats = ce("div",{class:"stats"});
	this.innerDom.appendChild(stats);
	
	// Spawn Save
	var save = ce("div",{class:"save"});
	this.innerDom.appendChild(save);
	
	var submit = ce("button",{},"Save");
	save.appendChild(submit);
	submit.addEventListener("click",function(){self.save.apply(self);});
	
};

Item.prototype.save = function(){
	ajax("/saveitem","post",this.attrs).done(function(data){
		console.log(data);
	});
};