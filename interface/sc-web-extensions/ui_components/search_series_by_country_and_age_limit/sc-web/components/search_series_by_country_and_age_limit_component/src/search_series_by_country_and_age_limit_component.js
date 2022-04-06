SearchSeriesByCountryAndAgeLimit = {
    ext_lang: 'search_series_by_country_and_age_limit_code',
    formats: ['format_search_series_by_country_and_age_limit_json'],
    struct_support: true,

    factory: function (sandbox) {
        return new setSearchSeriesByCountryAndAgeLimitViewerWindow(sandbox);
    }
};

var setSearchSeriesByCountryAndAgeLimitViewerWindow = function (sandbox) {

    var self = this;
    this.sandbox = sandbox;
    this.sandbox.container = sandbox.container;

    var inputAgeLimit = '#series-tools-' + sandbox.container + " #series_agelimit-input"

    var inputSeasons = '#series-tools-' + sandbox.container + " #series_episodes-input"

    var buttonFind = '#series-tools-' + sandbox.container + " #button-find-series";

    var keynodes = ['ui_search_series_by_country_and_age_limit_in_memory'];

    $('#' + sandbox.container).prepend('<div class="inputBox" id="series-tools-' + sandbox.container + '"></div>');
    $('#series-tools-' + sandbox.container).load('static/components/html/search_series_by_country_and_age_limit_component.html', function () {
        SCWeb.core.Server.resolveScAddr(keynodes, function (keynodes) {
            SCWeb.core.Server.resolveIdentifiers(keynodes, function (idf) {
                var buttonSearch = idf[keynodes['ui_search_series_by_country_and_age_limit_in_memory']];

                $(buttonFind).html(buttonSearch);
                $(buttonFind).click(function () {
                    var agelimitString = $(inputAgeLimit).val();

                    var countryString = $(inputSeasons).val();
                    
                    console.log("Film find " + agelimitString);
                    console.log("Film find series string" + countryString);

                    if (agelimitString && countryString) {
                        var searchParams = {
                            agelimit: agelimitString.toString(),
                            country: countryString.toString()
                        };

                        findSeriesBCAL(searchParams);
                    }
                });
            });
        });
    });

    this.applyTranslation = function (namesMap) {
        SCWeb.core.Server.resolveScAddr(keynodes, function (keynodes) {
            SCWeb.core.Server.resolveIdentifiers(keynodes, function (idf) {
                var buttonLoad = idf[keynodes['ui_search_series_by_country_and_age_limit_in_memory']];

                $(buttonFind).html(buttonLoad);
            });
        });
    };
    this.sandbox.eventApplyTranslation = $.proxy(this.applyTranslation, this);
};

SCWeb.core.ComponentManager.appendComponentInitialize(SearchSeriesByCountryAndAgeLimit);

function findSeriesBCAL(searchParams) {
    console.log(searchParams);
    
    SCWeb.core.Server.resolveScAddr([searchParams.agelimit, searchParams.country], function (keynodes) {
        //addr = 'Project_1';
        addr1 = keynodes[searchParams.country];
        addr2 = keynodes[searchParams.agelimit];
        console.log("addr1", addr1);
        console.log("addr2", addr2);
        console.log("arguments", SCWeb.core.Arguments._arguments);
        if (!addr1 && !addr2){
            return;
        }
        // Resolve sc-addr of ui_menu_view_full_semantic_neighborhood node
        SCWeb.core.Server.resolveScAddr(["ui_menu_file_for_finding_series_by_country_and_age_limit"], function (data) {
            // Get command of ui_menu_view_full_semantic_neighborhood
            var cmd = data["ui_menu_file_for_finding_series_by_country_and_age_limit"];
            console.log("cmd", cmd);
            // Simulate click on ui_menu_view_full_semantic_neighborhood button
            SCWeb.core.Main.doCommand(cmd, [addr2, addr1], function (result) {
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
