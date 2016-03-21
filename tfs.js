var TFS={};
var TFS_style=document.createElement ('style');
chrome.storage.local.get ('TFS', function (val) {
	TFS_init(val.TFS);
});

function TFS_init (init) {
	TFS = init || {};
	chrome.runtime.onMessage.addListener (
		function (request) {
			if (request.message == 'delete') {
				TFS_delete();
			}
		}
	);
    
	document.addEventListener ('click', TFS_click, true);
	document.body.appendChild (TFS_style);
	TFS_update();
}

function TFS_click (event) {
	if (event.shiftKey && event.ctrlKey) {
		TFS_add (event.target);
		event.preventDefault();
		event.stopPropagation();
		return false;
	}
}

/* C.R.U.D. */
function TFS_add (target) {
	var site = TFS_get_site ();
	if (target.id) {
		site.tags.ids.push (target.id);
		TFS_update();
	} else if (TFS_is_unique (target)) {
		site.tags.classes.push (target.className);
		TFS_update();
	} else { // No unique way of storing this, so thats bad :(
		target.classList.add ('TFS_hide');
	}
}

function TFS_update () {
	var str = '.TFS_hide';
	var site = TFS_get_site ();
	if (site && (site.tags.ids.length || site.tags.classes.length)) {
		var i=0;
		for (; i<site.tags.ids.length; i++) {
			str += '#' + site.tags.ids[i];
			if (i+1 < site.tags.ids.length || site.tags.classes.length) {str += ', ';}
		}
		for (i=0; i<site.tags.classes.length; i++) {
			str += '.' + site.tags.classes[i].replace(/ /g, '.');
			if (i+1 < site.tags.classes.length) {str += ', ';}
		}
	}
	str += '{display: none !important;}';
	TFS_style.innerHTML = str;
	chrome.storage.local.set ({'TFS': TFS});
}

function TFS_delete () {
	delete TFS[window.location.hostname];
	var list = document.getElementsByClassName ('TFS_hide');
	var i=0;
	for (i=list.length-1; i>=0; i--) { // The 'remove' call affects the size of 'list' immidiately. The loop has to start at the end to prevent stupid behaviour
		list[i].classList.remove('TFS_hide');
	}
	TFS_update ();
}

/* Helper Functions */
function TFS_is_unique (target) { // Consider making this smarter in the future. Or don't. See if I care.
	var matches = document.getElementsByClassName (target.className);
	if (matches.length == 1) {return true;}
	else {return false;}
}

function TFS_get_site () { // Find the current site out of the list of known sites
	if (!TFS[window.location.hostname]) {
		TFS[window.location.hostname] = new TFS_site();
	}
	return TFS[window.location.hostname];
}

/* Object Classes */
function TFS_site () {
	this.hostName = window.location.hostname;
	this.tags = new TFS_tags();
}

function TFS_tags () {
	this.ids = [];
	this.classes = [];
}
