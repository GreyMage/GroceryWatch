// "Main"
var catalog = JSON.parse(document.body.getAttribute("data-catalog")) || [];
document.body.removeAttribute("data-catalog"); // Just to keep the dom clean.
var container = document.getElementById("container");
catalog.forEach(function(i){
	new Item(i,container);
});