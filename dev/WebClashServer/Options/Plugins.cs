using System;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using WebClashServer.Classes;

namespace WebClashServer.Options
{
    public partial class Plugins : Form
    {
        private string clientPluginsLocation;
        private string serverPluginsLocation;

        private Plugin[] clientPluginsArray;
        private Plugin[] serverPluginsArray;

        public Plugins()
        {
            InitializeComponent();
        }

        private void Plugins_Load(object sender, EventArgs e)
        {
            clientPluginsLocation = Program.main.serverLocation + "/../client/plugins/";
            serverPluginsLocation = Program.main.serverLocation + "/plugins/";

            ReloadClientPlugins();
            ReloadServerPlugins();
        }

        private void WriteEnabledSettings(bool enabled, string location)
        {
            try
            {
                //Read the settings file

                string settings = File.ReadAllText(location);

                //From the lines, read if enabled or not

                string lookup = "//ENABLED=";
                string[] lines = settings.Split('\n');
                for (int l = 0; l < lines.Length; l++)
                    if (lines[l].IndexOf(lookup) != -1)
                    {
                        lines[l] = "//ENABLED=" + enabled.ToString().ToLower();
                        break;
                    }

                //Write new settings

                File.WriteAllText(location, string.Join("\n", lines));
            }
            catch (Exception exc)
            {
                MessageBox.Show("Could not set plugin enabled: " + exc.Message, "WebClash - Error");
            }
        }

        private bool ReadEnabledSettings(string location)
        {
            try
            {
                //Read the settings file

                string settings = File.ReadAllText(location);

                //From the lines, read if enabled or not

                bool enabled = false;
                string lookup = "//ENABLED=";
                string[] lines = settings.Split('\n');
                for (int l = 0; l < lines.Length; l++)
                {
                    int index = lines[l].IndexOf(lookup);
                    if (index != -1)
                    {
                        int start = index + lookup.Length;
                        string value = lines[l].Substring(
                            start,
                            lines[l].Length - start
                        );
                        value = value[0].ToString().ToUpper() + value.Substring(1, value.Length - 1);
                        enabled = bool.Parse(value);
                        break;
                    }
                }

                return enabled;
            }
            catch (Exception exc)
            {
                MessageBox.Show("Could not check if plugin was enabled: " + exc.Message, "WebClash - Error");
                return false;
            }
        }

        private void removeChecker_Tick(object sender, EventArgs e)
        {
            editClientPlugin.Enabled   =
            removeClientPlugin.Enabled =
                (clientPlugins.SelectedItem != null);

            editServerPlugin.Enabled   =
            removeServerPlugin.Enabled = 
                (serverPlugins.SelectedItem != null);
        }

        #region "Client Plugin Handling"

        private void ReloadClientPlugins()
        {
            try
            {
                //Read all client plugins

                string[] clientFiles =
                    Directory.GetFiles(clientPluginsLocation)
                        .Where(name => name.IndexOf(".settings.js") == -1).ToArray();

                //Clear plugin list

                clientPlugins.Items.Clear();

                //Create new client plugin array

                clientPluginsArray = new Plugin[clientFiles.Length];

                //Handle all plugins

                foreach (string file in clientFiles)
                {
                    //Read plugin

                    Plugin plugin = PluginSystem.ReadPlugin(file);
                    if (plugin == null)
                        continue;

                    //Create settings location

                    string settingsLoc = file.Substring(0, file.LastIndexOf('.')) + ".settings.js";

                    //Check if settings exist

                    if (!File.Exists(settingsLoc))
                        PluginSystem.SavePluginSettings(
                            settingsLoc,
                            true,
                            plugin.properties
                        );

                    //Read if enabled or not

                    bool enabled = ReadEnabledSettings(settingsLoc);

                    //Add plugin

                    clientPlugins.Items.Add(plugin.name, enabled);
                    clientPluginsArray[clientPlugins.Items.Count - 1] = plugin;
                }

                //Save plugin list

                SaveClientPluginsList();
            }
            catch (Exception exc)
            {
                MessageBox.Show("Could not reload client plugins: " + exc.Message, "WebClash - Error");
            }
        }

        private void SaveClientPluginsList()
        {
            //Get all plugin names

            string pluginNames = "";
            for (int p = 0; p < clientPluginsArray.Length; p++)
            {
                if (clientPluginsArray[p] == null)
                    continue;

                string name = clientPluginsArray[p].name;
                bool enabled = ReadEnabledSettings(
                    clientPluginsLocation + name.Substring(0, name.LastIndexOf('.')) + ".settings.js"
                );

                if (!enabled)
                    continue;

                pluginNames += (p > 0 ? ",\n" : "") + " '" + clientPluginsArray[p].name + "'";
            }

            if (pluginNames != "")
                pluginNames = "\n" + pluginNames + "\n";

            //Create javascript file

            File.WriteAllText(
                clientPluginsLocation + "../plugins.js",
                "//This file is generated by the\n" + 
                "//the WebClash binary and should not\n" + 
                "//be modified\n\n" +
                "const plugins = [" + pluginNames + "];"
            );
        }

        private void clientPlugins_SelectedValueChanged(object sender, EventArgs e)
        {
            //Check if value still exists

            if (clientPlugins.SelectedItem == null ||
                clientPlugins.SelectedIndex == -1)
                return;

            //Write new enabled

            string file = (string)clientPlugins.SelectedItem;

            WriteEnabledSettings(
                clientPlugins.GetItemChecked(clientPlugins.SelectedIndex),
                clientPluginsLocation + file.Substring(0, file.LastIndexOf('.')) + ".settings.js"
            );

            //Save the client plugins list

            SaveClientPluginsList();
        }

        private void addClientPlugin_Click(object sender, EventArgs e)
        {
            OpenFileDialog fd = new OpenFileDialog();
            fd.Title = "Import client plugin";
            fd.Filter = "Plugin|*.js";

            DialogResult dr = fd.ShowDialog();
            if (dr == DialogResult.OK)
            {
                string target = clientPluginsLocation + fd.SafeFileName;

                //Check if plugin already exists

                if (File.Exists(target))
                    File.Delete(target);

                //Copy plugin file

                File.Copy(fd.FileName, target);

                //Create settings

                PluginSystem.SavePluginSettings(
                    target.Substring(0, target.LastIndexOf('.')) + ".settings.js",
                    true,
                    PluginSystem.ReadPlugin(target).properties
                );

                //Refresh client plugins

                ReloadClientPlugins();
            }
        }

        private void editClientPlugin_Click(object sender, EventArgs e)
        {
            //Create new plugin properties form

            Plugin plugin = clientPluginsArray[clientPlugins.SelectedIndex];

            PluginProperties pp = new PluginProperties(
                clientPluginsLocation + plugin.name.Substring(0, plugin.name.LastIndexOf('.')) + ".settings.js",
                ReadEnabledSettings(clientPluginsLocation + plugin.name),
                plugin
            );

            //Show pp as dialog

            pp.ShowDialog();
        }

        private void removeClientPlugin_Click(object sender, EventArgs e)
        {
            //Delete currently selected plugin

            string file = clientPluginsLocation + (string)clientPlugins.SelectedItem;

            File.Delete(file);
            File.Delete(file.Substring(0, file.LastIndexOf('.')) + ".settings.js");

            //Reload client plugins

            ReloadClientPlugins();
        }

        #endregion

        #region "Server Plugin Handling"

        private void ReloadServerPlugins()
        {
            try
            {
                //Read all server plugins

                string[] serverFiles =
                    Directory.GetFiles(serverPluginsLocation)
                        .Where(name => name.IndexOf(".settings.js") == -1).ToArray();

                //Clear plugin list

                serverPlugins.Items.Clear();

                //Create new server plugin array

                serverPluginsArray = new Plugin[serverFiles.Length];

                //Handle all plugins

                foreach (string file in serverFiles)
                {
                    //Read plugin

                    Plugin plugin = PluginSystem.ReadPlugin(file);
                    if (plugin == null)
                        continue;

                    //Create settings location

                    string settingsLoc = file.Substring(0, file.LastIndexOf('.')) + ".settings.js";

                    //Check if settings exist

                    if (!File.Exists(settingsLoc))
                        if (!File.Exists(settingsLoc))
                            PluginSystem.SavePluginSettings(
                                settingsLoc,
                                true,
                                plugin.properties
                            );

                    //Read if enabled or not

                    bool enabled = ReadEnabledSettings(settingsLoc);

                    //Add plugin

                    serverPlugins.Items.Add(plugin.name, enabled);
                    serverPluginsArray[serverPlugins.Items.Count - 1] = plugin;
                }
            }
            catch (Exception exc)
            {
                MessageBox.Show("Could not reload server plugins: " + exc.Message, "WebClash - Error");
            }
        }

        private void serverPlugins_SelectedValueChanged(object sender, EventArgs e)
        {
            //Check if value still exists

            if (serverPlugins.SelectedItem == null ||
                serverPlugins.SelectedIndex == -1)
                return;

            //Write new enabled

            string file = (string)serverPlugins.SelectedItem;

            WriteEnabledSettings(
                serverPlugins.GetItemChecked(serverPlugins.SelectedIndex),
                serverPluginsLocation + file.Substring(0, file.LastIndexOf('.')) + ".settings.js"
            );
        }

        private void addServerPlugin_Click(object sender, EventArgs e)
        {
            OpenFileDialog fd = new OpenFileDialog();
            fd.Title = "Import server plugin";
            fd.Filter = "Plugin|*.js";

            DialogResult dr = fd.ShowDialog();
            if (dr == DialogResult.OK)
            {
                string target = serverPluginsLocation + fd.SafeFileName;

                //Check if plugin already exists

                if (File.Exists(target))
                    File.Delete(target);

                //Copy plugin file

                File.Copy(fd.FileName, target);

                //Create settings

                PluginSystem.SavePluginSettings(
                    target.Substring(0, target.LastIndexOf('.')) + ".settings.js",
                    true,
                    PluginSystem.ReadPlugin(target).properties
                );

                //Refresh client plugins

                ReloadServerPlugins();
            }
        }

        private void editServerPlugin_Click(object sender, EventArgs e)
        {
            //Create new plugin properties form

            Plugin plugin = serverPluginsArray[serverPlugins.SelectedIndex];

            PluginProperties pp = new PluginProperties(
                serverPluginsLocation + plugin.name.Substring(0, plugin.name.LastIndexOf('.')) + ".settings.js",
                ReadEnabledSettings(serverPluginsLocation + plugin.name),
                plugin
            );

            //Show pp as dialog

            pp.ShowDialog();
        }

        private void removeServerPlugin_Click(object sender, EventArgs e)
        {
            //Delete currently selected plugin

            string file = serverPluginsLocation + (string)serverPlugins.SelectedItem;

            File.Delete(file);
            File.Delete(file.Substring(0, file.LastIndexOf('.')) + ".settings.js");

            //Reload client plugins

            ReloadServerPlugins();
        }

        #endregion
    }
}
