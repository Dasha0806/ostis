module.exports = function() {

    var kb = 'kb/ui_components/series_add_component';
    var components = 'sc-web/components/series_add_component/';
    var clientJsDirPath = '../../sc-web/client/static/components/js/';
    var clientCssDirPath = '../../sc-web/client/static/components/css/';
    var clientHtmlDirPath = '../../sc-web/client/static/components/html/';
    var clientImgDirPath = '../../sc-web/client/static/components/images/';

    return  {
        concat: {
            series_add_component: {
                src: [
                    components + 'src/series_add_component.js'],
                dest: clientJsDirPath + 'series_add_component/series_add_component.js'
            }
        },
        copy: {
            series_add_component_IMG: {
                cwd: components + 'static/components/images/',
                src: ['*'],
                dest: clientImgDirPath + 'series_add_component/',
                expand: true,
                flatten: true
            },
            series_add_component_CSS: {
                cwd: components + 'static/components/css/',
                src: ['series_add_component.css'],
                dest: clientCssDirPath,
                expand: true,
                flatten: true
            },
            series_add_component_HTML: {
                cwd: components + 'static/components/html/',
                src: ['*.html'],
                dest: clientHtmlDirPath,
                expand: true,
                flatten: true
            },
            kb: {
                cwd: kb,
                src: ['*'],
                dest: '../../kb/ui_components/series_add_component/',
                expand: true,
                flatten: true
            }
        },
        watch: {
            series_add_component: {
                files: components + 'src/**',
                tasks: ['concat:series_add_component']
            },
            series_add_component_IMG: {
                files: [components + 'static/components/images/**'],
                tasks: ['copy:series_add_component_IMG']
            },
            series_add_component_CSS: {
                files: [components + 'static/components/css/**'],
                tasks: ['copy:series_add_component_CSS']
            },
            series_add_component_HTML: {
                files: [components + 'static/components/html/**',],
                tasks: ['copy:series_add_component_HTML']
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

