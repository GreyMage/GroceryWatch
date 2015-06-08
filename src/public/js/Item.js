var Item = function(options,id,container){
	if(!container) throw "dude where do i put this";
	if(typeof id == "undefined") throw "gonna need an ID";
	
	this.attrs = {};
	this.container = container;
	this.id = id;
	
	for(var i in options) this.attrs[i] = options[i];
	
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
	var dbtitle = createBoundElement({
		object:self.attrs,
		property:"name",
		uniq:self.id,
		elem:ce("span"),
	});
	fieldsLegend.appendChild(dbtitle);
	
	// Create Databound text fields
	var createField = function(prop,labeltext,tag,readFunc,writeFunc){
		tag = tag || "input";
		var div = ce("div",{class:"fieldrow"}); fieldsSet.appendChild(div);
		var pad = ce("div",{class:"fieldrowpad"}); div.appendChild(pad);
		var label = ce("label",{},labeltext);  pad.appendChild(label);
		var input = createBoundElement({
			object:self.attrs,
			property:prop,
			uniq:self.id,
			elem:ce(tag,{class:"field"}),
			readFunc:readFunc,
			writeFunc:writeFunc,
		}); 
		pad.appendChild(input);
	};

	var padZ = function(number,to){
		var n = ""+number;
		while(n.length < to) n = "0" + n;
		return n;
	};
	
	var handleDateRead = function(raw){
		var d = new Date(raw);
		if(isNaN(d.getTime())) {
			console.log(d,"isnt a number",raw);
			return raw;
		}
		console.log("parsed into date");
		var out = d.getFullYear()+"-"+padZ(d.getUTCMonth()+1,2)+"-"+padZ(d.getUTCDate(),2);
		return out;
	};
	var handleDateWrite = function(raw){
		return "penis";
	};
	
	createField("name","Name");
	createField("restocked","Restocked",false,handleDateRead,handleDateWrite);
	createField("restocked","Restocked",false,handleDateRead,handleDateWrite);
	createField("restocked","Restocked",false,handleDateRead,handleDateWrite);
	
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
	var payload = {
		id:this.id,
		item:this.attrs
	};
	
	ajax({
		url:"/saveitem",
		method: "post",
		data:payload,
		sendDataAsJSON:true,
	}).done(function(data){
		console.log(data);
	});
};