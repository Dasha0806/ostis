module.exports = function() {

    var kb = 'kb/ui_components/search_film_by_cinocompany_and_year_component';
    var components = 'sc-web/components/search_film_by_cinocompany_and_year_component/';
    var clientJsDirPath = '../../sc-web/client/static/components/js/';
    var clientCssDirPath = '../../sc-web/client/static/components/css/';
    var clientHtmlDirPath = '../../sc-web/client/static/components/html/';
    var clientImgDirPath = '../../sc-web/client/static/components/images/';

    return  {
        concat: {
            search_film_by_cinocompany_and_year_component: {
                src: [
                    components + 'src/search_film_by_cinocompany_and_year_component.js'],
                dest: clientJsDirPath + 'search_film_by_cinocompany_and_year_component/search_film_by_cinocompany_and_year_component.js'
            }
        },
        copy: {
            search_film_by_cinocompany_and_year_component_IMG: {
                cwd: components + 'static/components/images/',
                src: ['*'],
                dest: clientImgDirPath + 'search_film_by_cinocompany_and_year_component/',
                expand: true,
                flatten: true
            },
            search_film_by_cinocompany_and_year_component_CSS: {
                cwd: components + 'static/components/css/',
                src: ['search_film_by_cinocompany_and_year_component.css'],
                dest: clientCssDirPath,
                expand: true,
                flatten: true
            },
            search_film_by_cinocompany_and_year_component_HTML: {
                cwd: components + 'static/components/html/',
                src: ['*.html'],
                dest: clientHtmlDirPath,
                expand: true,
                flatten: true
            },
            kb: {
                cwd: kb,
                src: ['*'],
                dest: '../../kb/ui_components/search_film_by_cinocompany_and_year_component/',
                expand: true,
                flatten: true
            }
        },
        watch: {
            search_film_by_cinocompany_and_year_component: {
                files: components + 'src/**',
                tasks: ['concat:search_film_by_cinocompany_and_year_component']
            },
            search_film_by_cinocompany_and_year_component_IMG: {
                files: [components + 'static/components/images/**'],
                tasks: ['copy:search_film_by_cinocompany_and_year_component_IMG']
            },
            search_film_by_cinocompany_and_year_component_CSS: {
                files: [components + 'static/components/css/**'],
                tasks: ['copy:search_film_by_cinocompany_and_year_component_CSS']
            },
            search_film_by_cinocompany_and_year_component_HTML: {
                files: [components + 'static/components/html/**',],
                tasks: ['copy:search_film_by_cinocompany_and_year_component_HTML']
            },
            copyKB: {
                files: [kb + '**',],
                tasks: ['copy:kb']
            }
        },
        exec: {
          updateCssAndJs: 'sh add-css-and-js.sh'
        }
    }
};

