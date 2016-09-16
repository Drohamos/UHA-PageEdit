javascript:(function(){
	addJQuery();
})();

function addJQuery() {
	console.log('Début addJQuery');
	// Ajout jQuery
	var jq = document.createElement('script');
	jq.type = 'text/javascript';
	jq.async = true;
	jq.src = 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js';
	(document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(jq);
	console.log('Fin addJQuery');

	editPanel();
}

function editPanel() {
	console.log('editPanel');

	// Ajout CSS
	$("body").prepend('<style type="text/css">#editPanel,.hover{background-color:#d3d3d3}.selected{outline:red dashed 2px!important}#editPanel{background:linear-gradient(to right,rgba(220,220,220,.6) 0,rgba(220,220,220,.975) 15%,rgba(220,220,220,.975) 100%);font-family:Arial;padding:1em;position:fixed;top:0;right:0;text-align:center;z-index:10}#editPanel button,#editPanel select{background-color:#f2f2f2;border:1px solid #000;color:#282828;margin:.25em;padding:.5em}#editPanel button{min-width:2em}#editPanel button:hover{background-color:#d9d9d9;cursor:pointer}#editPanel h5{color:#373737;margin-bottom:.5em;text-transform:uppercase}#panel_colorPicker{padding:0}#panel_colorPicker li{border:2px solid transparent;display:inline-block;width:1.5em;height:1.5em;margin:.25em}</style>');

	// Ajout Panneau de modif.
	$("body").prepend('<div id="editPanel" style=""><code id="panel_currTag" style="display: block;"></code><p></p><ul id="panel_colorPicker"></ul></div>');

	var editableTags = "div, p, h1, h2, h3, h4, h5"; // Tags modifiables
	var selectedTag; // Element sélectionné pour modification
	var selectedColor;
	var editPanel = document.getElementById("editPanel");
	var colorPicker = document.getElementById("panel_colorPicker");

	// Définition des contrôles et de leurs actions
	var controls = [
		{
			"type" : "title",
			"label" : "texte"
		},
		{
			"type" : "button",
			"label" : "G",
			"property" : "font-weight",
			"value" : "bold",
			"applyToBtn" : true
		},
		{
			"type" : "button",
			"label" : "I",
			"property" : "font-style",
			"value" : "italic",
			"applyToBtn" : true
		},
		{
			"type" : "button",
			"label" : "S",
			"property" : "text-decoration",
			"value" : "underline",
			"applyToBtn" : true
		},
		{
			"type" : "button",
			"label" : "B",
			"property" : "text-decoration",
			"value" : "line-through",
			"applyToBtn" : true
		},
		{
			"type" : "list",
			"label" : "Taille",
			"property" : "font-size",
			"values" : [8, 9, 10, 11, 12, 14, 16, 20, 22, 24, 26, 28, 36, 48, 72],
			"unit" : "pt"
		},
		{
			"type" : "br"
		},
		{
			"type" : "button",
			"label" : "<",
			"property" : "text-align",
			"value" : "left"
		},
		{
			"type" : "button",
			"label" : "=",
			"property" : "text-align",
			"value" : "center"
		},
		{
			"type" : "button",
			"label" : ">",
			"property" : "text-align",
			"value" : "right"
		},
		{
			"type" : "br"
		},
		{
			"type" : "title",
			"label" : "BLOC"
		},
		{
			"type" : "button",
			"label" : "TEXTE",
			"property" : "color",
			"value" : "$colors"
		},
		{
			"type" : "button",
			"label" : "FOND",
			"property" : "background-color",
			"value" : "$colors"
		},
		{
			"type" : "button",
			"label" : "BORDER",
			"property" : "border-color",
			"value" : "$colors"
		}
	];

	var colors = [
		"black", "white", "red", "green", "blue",
		"yellow", "aqua", "#FF00FF", "gray", "brown"];

	// Parcours et ajout des contrôles au panneau
	for (i = 0; i < controls.length; i++) {
		switch(controls[i]["type"]) {
			case "button":
				$(editPanel).append('<button id="panel_btn_' + i + '">' + controls[i]['label'] + '</button>');
				break;
			case "br":
				$(editPanel).append('</p><p>');
				break;
			case "title":
				$(editPanel).append('<h5>' + controls[i]['label'] + '</h5>');
				break;
			case "list":
				var options;
				$.each(controls[i]["values"], function(key, val) {
					options += '<option value="' + key + '">' + val + '</option>';
				});
				$(editPanel).append('<select id="panel_list_' + i + '">' + options + '</select>');
				break;
		}
	}

	// Parcours et ajout boutons au colorPicker
	for (i = 0; i < colors.length; i++) {
		$(colorPicker).append('<li style="background-color: ' + colors[i] + '" id="panel_color_' + i + '"></li>');
		if (i == 4) $(colorPicker).append('<br />');
	}

	// Highlight éléments modifiables au survol
	$(editableTags).hover(
		function(event) { $('.hover').removeClass("hover"); $(event.target).addClass('hover'); },
		function(event) { $(event.target).removeClass('hover'); }
	);

	// Au clic sur tag modifiable
	$("body").on("click", editableTags, function(event) {
		// Cette condition exclut le panneau de contrôle et ses enfants
		if (event.target.id != "editPanel" && !($.contains(editPanel, event.target))) {
			// Switch classe selected
			$(selectedTag).removeClass('selected');
			selectedTag = event.target;
			$(selectedTag).addClass('selected');

			// Affichage tag sélectionné
			$("#panel_currTag").text(selectedTag.nodeName);
		}

	});

	// Clic sur un bouton de contrôle
	$("body").on("click", "#editPanel button", function(event) {
		// On trim le début de l'id, pour ne récupérer que l'index du tableau
		var itemId = event.target.id.replace("panel_btn_", "");
		var cssValue;

		if (controls[itemId]["value"] == "$colors")
			cssValue = colors[selectedColor];
		else
			cssValue = controls[itemId]["value"];

		console.log("cssValue : " + controls[itemId]["property"] + " -> " + cssValue);

		if (selectedTag) {
			$(selectedTag).css(controls[itemId]["property"], cssValue);
		}
	});
	// Changement d'une liste
	$("body").on("change", "#editPanel select", function(event) {
		// On trim le début de l'id, pour ne récupérer que l'index du tableau
		var itemId = event.target.id.replace("panel_list_", "");
		var valueId = $(event.target).val();

		if (selectedTag) {
			$(selectedTag).css(controls[itemId]["property"], controls[itemId]["values"][valueId] + rIfKey(controls[itemId], "unit"));
		}
	});
	// Clic sur une couleur
	$("body").on("click", "#panel_colorPicker li", function(event) {
		$("#panel_color_" + selectedColor).css({"opacity" : 1, "border-color" : "transparent"});
		$(event.target).css({"opacity" : 0.8, "border-color" : "black"});
		// On trim le début de l'id, pour ne récupérer que l'index du tableau
		selectedColor = event.target.id.replace("panel_color_", "");
		console.log(selectedColor);
	});

	function rIfKey(array, key) {
		if (key in array)
			return array[key];
		else return false;
	}
}