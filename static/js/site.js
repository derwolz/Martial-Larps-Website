function toggle(Id, cl){
	let el;
	if (typeof(Id) == typeof('')){
		el = document.getElementById(Id);
	} else {
		el = Id;
	}
	if (el.classList.contains(cl)){
		el.classList.remove(cl);
	} else{
		el.classList.add(cl);
	} 
} 
