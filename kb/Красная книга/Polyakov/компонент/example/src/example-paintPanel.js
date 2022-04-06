/**
 * Paint panel.
 */

Example.PaintPanel = function (containerId) {
    this.containerId = containerId;
};

Example.PaintPanel.prototype = {

    init: function () {
        this._initMarkup(this.containerId);
    },

    _initMarkup: function (containerId) {
        var container = $('#' + containerId);

        var self = this;
        container.append('<div class="sc-no-default-cmd">Show protected territories</div>');
        container.append('<button id="showTree" type="button">Отобразить классификацию природоохранных зон</button>');


		container.append('<p><table id="classificationTable" border="1"><tbody id="classificationTableBody"></tbody></table></p>');



       
		$('#showTree').click(function () {
			self._showTree();
		});


		SCWeb.core.Server.resolveScAddr(['ui_menu_na_keynodes'], function (keynodes) {
			$('#moveToNavigationNode').attr("sc_addr", keynodes['ui_menu_na_keynodes']);
		});

		
    },

    
	
	
	_showTree: function () {
		
		var tableBody = $('#classificationTableBody');
		tableBody.empty();
		var type_addr, terr_addr;
		var curr_lang;
		
		var concept_protected_area_addr, concept_protected_area_idtf, concept_territory_addr;
		SCWeb.core.Server.resolveScAddr(['concept_protected_area','concept_territorry'], function (classification) {
			concept_protected_area_addr = classification['concept_protected_area'];
			concept_territory_addr = classification['concept_territorry'];
			curr_lang = SCWeb.core.Server._current_language;
		
							window.scHelper.getIdentifier(concept_protected_area_addr, curr_lang).done(function(get_concept_protected_area_idtf){
								concept_protected_area_idtf = get_concept_protected_area_idtf;
								tableBody.append('<tr><td>class</td><td>type</td><td>territory</td></tr>');
								tableBody.append('<tr><td sc_addr = "' + concept_protected_area_addr + '">'+concept_protected_area_idtf+'</td><td></td><td></td><td></td></tr>');
								addType(concept_protected_area_addr,type_addr,curr_lang,tableBody);
								addTerritory(concept_territory_addr,terr_addr,tableBody,curr_lang);
									//порядки (orders)
									
										
									});
										
								});
						
					
	},


	_findMainIdentifier: function () {
		var fromInt = $('#sizeInput').value;
		fromInt = parseInt(fromInt);
		alert(fromInt);

		
    },

	/*_findMainIdentifier: function () {
		console.log("inFind");
		var main_menu_addr, nrel_main_idtf_addr;
		// Resolve sc-addrs.
		SCWeb.core.Server.resolveScAddr(['ui_main_menu', 'nrel_main_idtf'], function (keynodes) {
			main_menu_addr = keynodes['ui_main_menu'];
			nrel_main_idtf_addr = keynodes['nrel_main_idtf'];
			console.log(main_menu_addr);
			console.log(nrel_main_idtf_addr);
			// Resolve sc-addr of ui_menu_view_full_semantic_neighborhood node
			window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F, [
 				main_menu_addr,
 				sc_type_arc_common | sc_type_const,
 				sc_type_link,
 				sc_type_arc_pos_const_perm,
 				nrel_main_idtf_addr]).
			done(function(identifiers){	 
				 window.sctpClient.get_link_content(identifiers[0][2],'string').done(function(content){
				 	alert('Главный идентификатор: ' + content);
				 });			
			});
		});
    },*/

    _generateNodes: function () {
		var main_menu_addr, nrel_main_idtf_addr, lang_en_addr;
		// Resolve sc-addr. Get sc-addr of ui_main_menu node
		SCWeb.core.Server.resolveScAddr(['ui_main_menu', 'lang_en', 'nrel_main_idtf'], function (keynodes) {
			main_menu_addr = keynodes['ui_main_menu'];
			nrel_main_idtf_addr = keynodes['nrel_main_idtf'];
			lang_en_addr = keynodes['lang_en'];

			window.sctpClient.create_link().done(function (generatedLink) {
				window.sctpClient.set_link_content(generatedLink, 'Main menu');
				window.sctpClient.create_arc(sc_type_arc_common | sc_type_const, main_menu_addr, generatedLink).done(function (generatedCommonArc) {
					window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrel_main_idtf_addr, generatedCommonArc);
				});
				window.sctpClient.create_arc(sc_type_arc_pos_const_perm, lang_en_addr, generatedLink);
			});
			$('#generateNodes').attr("sc_addr", main_menu_addr);
			SCWeb.core.Server.resolveScAddr(["ui_menu_view_full_semantic_neighborhood"],
			function (data) {
				// Get command of ui_menu_view_full_semantic_neighborhood
				var cmd = data["ui_menu_view_full_semantic_neighborhood"];
				// Simulate click on ui_menu_view_full_semantic_neighborhood button
				SCWeb.core.Main.doCommand(cmd,
				[main_menu_addr], function (result) {
					// waiting for result
					if (result.question != undefined) {
						// append in history
						SCWeb.ui.WindowManager.appendHistoryItem(result.question);
					}
				});
			});			
		});
	}
};
function addType(concept_protected_area_addr, type_addr, curr_lang, tableBody){
	var num_of_orders;
					window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A, [
						concept_protected_area_addr,
						sc_type_arc_pos_const_perm,
							sc_type_node]).done(function(get_types){	 
											num_of_orders = get_types.length;
											for(var order_ind = 0; order_ind < num_of_orders; order_ind++){
												type_addr = get_types[order_ind][2];	
												window.scHelper.getIdentifier(type_addr, curr_lang).done(function(get_type_idtf){
													tableBody.append('<tr><td></td><td sc_addr = "' + type_addr + '">'+get_type_idtf+'</td><td></td><td></td></tr>');
													tableBody.append('<tr><td></td><td>' + "заповедник" + '</td><td></td><td></td></tr>');
													tableBody.append('<tr><td></td><td>' + "заказник" + '</td><td></td><td></td></tr>');
							
												});	
											}
											
										});
}
	function addTerritory(concept_territory_addr, terr_addr,tableBody,curr_lang){
		var num_of_terrs;
										window.sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_3F_A_A, [
										concept_territory_addr,
										sc_type_arc_pos_const_perm,
										sc_type_node]).done(function(get_territories){	 
											num_of_terrs = get_territories.length;
											for(var order_index = 0; order_index < num_of_terrs; order_index++){
												terr_addr = get_territories[order_index][2];	
												window.scHelper.getIdentifier(terr_addr, curr_lang).done(function(get_terr_idtf){
													tableBody.append('<tr><td></td><td></td><td sc_addr = "' + terr_addr + '">'+get_terr_idtf+'</td><td></td></tr>');
													//семейства (genus)
													
												});	
											}

										});
	}
