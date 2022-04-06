SeriesAddComponent = {
    ext_lang: 'series_code',
    formats: ['format_series_json'],
    struct_support: true,

    factory: function (sandbox) {
        return new setSeriesAddViewerWindow(sandbox);
    }
};

var setSeriesAddViewerWindow = function (sandbox) {

    var self = this;
    this.sandbox = sandbox;
    this.sandbox.container = sandbox.container;

    var inputName = '#series-tools-' + sandbox.container + " #series_name-input"
    var inputYear = '#series-tools-' + sandbox.container + " #series_year-input"
    var inputSeasons = '#series-tools-' + sandbox.container + " #series_seasons-input"
    var inputDescription = '#series-tools-' + sandbox.container + " #series_description-input"
    var buttonSave = '#series-tools-' + sandbox.container + " #button-load-series";

    var keynodes = ['ui_series_load_in_memory'];

    $('#' + sandbox.container).prepend('<div class="inputBox" id="series-tools-' + sandbox.container + '"></div>');
    $('#series-tools-' + sandbox.container).load('static/components/html/series_add_component-main-page.html', function () {
        SCWeb.core.Server.resolveScAddr(keynodes, function (keynodes) {
            SCWeb.core.Server.resolveIdentifiers(keynodes, function (idf) {
                var buttonLoad = idf[keynodes['ui_series_load_in_memory']];

                $(buttonSave).html(buttonLoad);
                $(buttonSave).click(function () {
                    var nameString = $(inputName).val();
                    var yearString = $(inputYear).val();
                    var seasonsString = $(inputSeasons).val();
                    var descriptionString = $(inputDescription).val();

                    if (isValidUserInput(nameString, descriptionString)) {
                        let userSeries = getUserSeries(nameString, yearString, seasonsString, descriptionString);
                        generateSeries(userSeries);
                    }
                });
            });
        });
    });

    this.applyTranslation = function (namesMap) {
        SCWeb.core.Server.resolveScAddr(keynodes, function (keynodes) {
            SCWeb.core.Server.resolveIdentifiers(keynodes, function (idf) {
                var buttonLoad = idf[keynodes['ui_series_load_in_memory']];

                $(buttonSave).html(buttonLoad);
            });
        });
    };
    this.sandbox.eventApplyTranslation = $.proxy(this.applyTranslation, this);
};

SCWeb.core.ComponentManager.appendComponentInitialize(SeriesAddComponent);

function getUserSeries(nameString, yearString, seasonsString, descriptionString) {
    if (isValidUserInput(nameString, descriptionString) != 1)
        return "Incorrect input!";

    var currentUserSeries = {
        name: nameString,
        year: yearString.toString(),
        seasons: seasonsString.toString(),
        description: descriptionString,
    };

    return currentUserSeries;
}

function isValidUserInput(nameString, descriptionString) {
    if (nameString.length == 0 || descriptionString.length == 0) {
        return false;
    }

    return true;
}

function generateSeries(userSeries) {
    var seriesName = userSeries.name;
    var seriesYear = userSeries.year;
    var seriesSeasons = userSeries.seasons;
    var seriesDescription = userSeries.description;

    var keynodes_to_search = ['nrel_system_identifier', 'concept_series', 'nrel_number_of_seasons',
                                'number', 'nrel_creation_year', 'nrel_description'];

    SCWeb.core.Server.resolveScAddr(keynodes_to_search, function (keynodes) {

        var conceptSeries        = keynodes['concept_series'];
        var conceptNumber        = keynodes['number'];
        var nrelSysId            = keynodes['nrel_system_identifier'];
        var nrelCreationYear     = keynodes['nrel_creation_year'];
        var nrelSeasons          = keynodes['nrel_number_of_seasons'];
        var nrelDescription      = keynodes['nrel_description'];

        window.sctpClient.create_node(sc_type_const).done(function (seriesNode) {
            console.log(seriesNode);
            window.sctpClient.create_link().done(function (linkId) {
                window.sctpClient.set_link_content(linkId, seriesName);
                window.sctpClient.create_arc(sc_type_const, seriesNode, linkId).done(function(commonArc) {
                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrelSysId, commonArc);
                });
                window.sctpClient.create_arc(sc_type_arc_pos_const_perm, conceptSeries, seriesNode);

                
                window.sctpClient.create_link().done(function (linkYear) {
                    window.sctpClient.set_link_content(linkYear, seriesYear);

                    window.sctpClient.create_arc(sc_type_const, seriesNode, linkYear).done(function(commonArc) {
                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrelCreationYear, commonArc);
                    });;
                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, conceptNumber, linkYear);
                });

                window.sctpClient.create_link().done(function (linkSeasons) {
                    window.sctpClient.set_link_content(linkSeasons, seriesSeasons);

                    window.sctpClient.create_arc(sc_type_const, seriesNode, linkSeasons).done(function(commonArc) {
                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrelSeasons, commonArc);
                    });;
                    window.sctpClient.create_arc(sc_type_arc_pos_const_perm, conceptNumber, linkSeasons);
                });

                window.sctpClient.create_link().done(function (linkDescription) {
                    window.sctpClient.set_link_content(linkDescription, seriesDescription);

                    window.sctpClient.create_arc(sc_type_const, seriesNode, linkDescription).done(function(commonArc) {
                        window.sctpClient.create_arc(sc_type_arc_pos_const_perm, nrelDescription, commonArc);
                    });;
                });
            });

            SCWeb.core.Main.doDefaultCommand([seriesNode]);
        });
    });
}