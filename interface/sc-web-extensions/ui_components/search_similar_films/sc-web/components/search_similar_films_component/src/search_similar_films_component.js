SearchSimilarFilms = {
    ext_lang: 'search_similar_films_code',
    formats: ['format_search_similar_films_json'],
    struct_support: true,

    factory: function (sandbox) {
        return new setSearchSimilarFilmsViewerWindow(sandbox);
    }
};

var setSearchSimilarFilmsViewerWindow = function (sandbox) {

    var self = this;
    this.sandbox = sandbox;
    this.sandbox.container = sandbox.container;

    var inputName = '#series-tools-' + sandbox.container + " #series_name-input"

    var buttonFind = '#series-tools-' + sandbox.container + " #button-find-series";

    var keynodes = ['ui_search_similar_films_in_memory'];

    $('#' + sandbox.container).prepend('<div class="inputBox" id="series-tools-' + sandbox.container + '"></div>');
    $('#series-tools-' + sandbox.container).load('static/components/html/search_similar_films_component.html', function () {
        SCWeb.core.Server.resolveScAddr(keynodes, function (keynodes) {
            SCWeb.core.Server.resolveIdentifiers(keynodes, function (idf) {
                var buttonSearch = idf[keynodes['ui_search_similar_films_in_memory']];

                $(buttonFind).html(buttonSearch);
                $(buttonFind).click(function () {
                    var nameString = $(inputName).val();

                    console.log("Film find " + nameString);

                    if (nameString) {
                        var searchParams = {
                            filmName: nameString.toString()
                        };

                        findSimilarFilms(searchParams);
                    }
                });
            });
        });
    });

    this.applyTranslation = function (namesMap) {
        SCWeb.core.Server.resolveScAddr(keynodes, function (keynodes) {
            SCWeb.core.Server.resolveIdentifiers(keynodes, function (idf) {
                var buttonLoad = idf[keynodes['ui_search_similar_films_in_memory']];

                $(buttonFind).html(buttonLoad);
            });
        });
    };
    this.sandbox.eventApplyTranslation = $.proxy(this.applyTranslation, this);
};

SCWeb.core.ComponentManager.appendComponentInitialize(SearchSimilarFilms);

function findSimilarFilms(searchParams) {
    console.log(searchParams);
    
    SCWeb.core.Server.resolveScAddr([searchParams.filmName], function (keynodes) {
        //addr = 'Project_1';
        addr1 = keynodes[searchParams.filmName];
        
        console.log("addr1", addr1);
        
        console.log("arguments", SCWeb.core.Arguments._arguments);
        if (!addr1){
            return;
        }
        // Resolve sc-addr of ui_menu_view_full_semantic_neighborhood node
        SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_similar_films"], function (data) {
            // Get command of ui_menu_view_full_semantic_neighborhood
            var cmd = data["ui_menu_file_for_finding_similar_films"];
            console.log("cmd", cmd);
            // Simulate click on ui_menu_view_full_semantic_neighborhood button
            SCWeb.core.Main.doCommand(cmd, [addr1], function (result) {
                // waiting for result
                if (result.question != undefined) {
                    // append in history
                    consonle.log(result.question);
                    SCWeb.ui.WindowManager.appendHistoryItem(result.question);
                }
            });
        });
    });
}
