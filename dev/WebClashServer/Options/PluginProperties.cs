using System;
using System.Windows.Forms;
using WebClashServer.Classes;
using WebClashServer.Input;

namespace WebClashServer.Options
{
    public partial class PluginProperties : Form
    {
        private Plugin plugin;
        private string settingsLocation;
        private bool enabled;

        public PluginProperties(string settingsLocation, bool enabled, Plugin plugin)
        {
            InitializeComponent();

            this.plugin = plugin;
            this.enabled = enabled;
            this.settingsLocation = settingsLocation;

            pluginTitle.Text = plugin.name + " (by " + plugin.author + ")";
            pluginDescription.Text = plugin.description;

            properties.DoubleClick += Properties_DoubleClick;

            LoadProperties();
        }

        private void Properties_DoubleClick(object sender, EventArgs e)
        {
            if (properties.SelectedIndex == -1)
                return;

            switch (plugin.properties[properties.SelectedIndex])
            {
                //String property

                case PluginStringProperty psp:
                    TextInput ti = new TextInput(
                        "Edit '" + psp.name + "'", 
                        "Change the property value", 
                        psp.value
                    );
                    if (ti.ShowDialog() == DialogResult.OK)
                        psp.value = ti.GetResult();
                    break;

                //Number property

                case PluginNumberProperty pnp:
                    NumberInput ni = new NumberInput(
                        "Edit '" + pnp.name + "'",
                        "Change the property value",
                        pnp.value
                    );
                    if (ni.ShowDialog() == DialogResult.OK)
                        pnp.value = ni.GetResult();
                    break;

                //Bool property

                case PluginBoolProperty pbp:
                    BoolInput bi = new BoolInput(
                        "Edit '" + pbp.name + "'",
                        "Change the property value",
                        pbp.value
                    );
                    if (bi.ShowDialog() == DialogResult.OK)
                        pbp.value = bi.GetResult();
                    break;
            }

            //Save new settings

            PluginSystem.SavePluginSettings(
                settingsLocation,
                enabled,
                plugin.properties
            );

            //Reload properties

            LoadProperties();
        }

        private void LoadProperties()
        {
            //Clear properties listbox

            properties.Items.Clear();

            //Add items

            for (int p = 0; p < plugin.properties.Length; p++)
            {
                //Get property values

                string property = plugin.properties[p].name;
                string value = plugin.properties[p].GetValue().ToString();

                properties.Items.Add(property + " = " + value);
            }
        }
    }
}
