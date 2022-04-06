SearchAnimeByMetagenreAndYear = {
    ext_lang: 'search_anime_by_metagenre_and_year_code',
    formats: ['format_search_anime_by_metagenre_and_year_json'],
    struct_support: true,

    factory: function (sandbox) {
        return new setSearchAnimeByMetagenreAndYearViewerWindow(sandbox);
    }
};

var setSearchAnimeByMetagenreAndYearViewerWindow = function (sandbox) {

    var self = this;
    this.sandbox = sandbox;
    this.sandbox.container = sandbox.container;

    var inputYear = '#series-tools-' + sandbox.container + " #series_year-input"

    var inputSeasons = '#series-tools-' + sandbox.container + " #series_episodes-input"

    var buttonFind = '#series-tools-' + sandbox.container + " #button-find-series";

    var keynodes = ['ui_search_anime_by_metagenre_and_year_in_memory'];

    $('#' + sandbox.container).prepend('<div class="inputBox" id="series-tools-' + sandbox.container + '"></div>');
    $('#series-tools-' + sandbox.container).load('static/components/html/search_anime_by_metagenre_and_year_component.html', function () {
        SCWeb.core.Server.resolveScAddr(keynodes, function (keynodes) {
            SCWeb.core.Server.resolveIdentifiers(keynodes, function (idf) {
                var buttonSearch = idf[keynodes['ui_search_anime_by_metagenre_and_year_in_memory']];

                $(buttonFind).html(buttonSearch);
                $(buttonFind).click(function () {
                    var yearString = $(inputYear).val();

                    var countryString = $(inputSeasons).val();
                    
                    console.log("Film find " + yearString);
                    console.log("Film find cinocompany string" + countryString);

                    if (yearString && countryString) {
                        var searchParams = {
                            year: yearString.toString(),
                            country: countryString.toString()
                        };

                        findAnimeByMgAngYear(searchParams);
                    }
                });
            });
        });
    });

    this.applyTranslation = function (namesMap) {
        SCWeb.core.Server.resolveScAddr(keynodes, function (keynodes) {
            SCWeb.core.Server.resolveIdentifiers(keynodes, function (idf) {
                var buttonLoad = idf[keynodes['ui_search_anime_by_metagenre_and_year_in_memory']];

                $(buttonFind).html(buttonLoad);
            });
        });
    };
    this.sandbox.eventApplyTranslation = $.proxy(this.applyTranslation, this);
};

SCWeb.core.ComponentManager.appendComponentInitialize(SearchAnimeByMetagenreAndYear);

function findAnimeByMgAngYear(searchParams) {
    console.log(searchParams);
    
    SCWeb.core.Server.resolveScAddr([searchParams.country, searchParams.year], function (keynodes) {
        //addr = 'Project_1';
        addr1 = keynodes[searchParams.country];
        addr2 = keynodes[searchParams.year];
        console.log("addr1", addr1);
        console.log("addr2", addr2);
        console.log("arguments", SCWeb.core.Arguments._arguments);
        if (!addr1 && !addr2){
            return;
        }
        // Resolve sc-addr of ui_menu_view_full_semantic_neighborhood node
        SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_anime_by_metagenre_and_year"], function (data) {
            // Get command of ui_menu_view_full_semantic_neighborhood
            var cmd = data["ui_menu_file_for_finding_anime_by_metagenre_and_year"];
            console.log("cmd", cmd);
            // Simulate click on ui_menu_view_full_semantic_neighborhood button
            SCWeb.core.Main.doCommand(cmd, [addr1, addr2], function (result) {
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
