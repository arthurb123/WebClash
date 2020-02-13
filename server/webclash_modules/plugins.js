//Plugins module for WebClash

exports.load = function() {
    let plugins = fs.readdirSync('plugins');
    if (plugins.length > 0) {
        //For all plugins, build one whole
        //and require that plugin

        let done = 0;
        for (let p = 0; p < plugins.length; p++) {
            //Check if settings of plugin

            let plugin = plugins[p];
            if (plugin.indexOf('.settings.js') !== -1)
                continue;

            //Check if settings specify if the plugin
            //is enabled

            let name = plugin.substr(0, plugin.lastIndexOf('.'));
            let settings = fs.readFileSync('plugins/' + name + '.settings.js').toString();

            let lines = settings.split('\n');
            let enabled = false;
            for (let l = 0; l < lines.length; l++) {
                let match = "//ENABLED=";
                let enabledIndex = lines[l].indexOf("//ENABLED=");
                if (enabledIndex !== -1) {
                    let enabledString = lines[l].substr(match.length, lines[l].length - match.length);
                    enabled = (enabledString === 'true');
                    break;
                }
            }

            if (!enabled)
                continue;

            //Build plugin

            let build = settings + '\n' + fs.readFileSync('plugins/' + name + '.js');

            //Require from string

            tools.requireFromString(build);

            done++;
        }

        //Output

        if (done > 0)
            output.give('Loaded ' + done + ' plugin(s).');
    }
};