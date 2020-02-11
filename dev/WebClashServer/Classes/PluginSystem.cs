using System;
using System.Collections.Generic;
using System.IO;
using System.Windows;

namespace WebClashServer.Classes
{
    public static class PluginSystem
    {
        public static Plugin ReadPlugin(string file)
        {
            try
            {
                //Read plugin file

                string plugin = File.ReadAllText(file);

                //Setup base data

                int lastSlash = file.LastIndexOf('/');
                string name = file.Substring(lastSlash + 1, file.Length - lastSlash - 1);
                string author = "Unknown";
                string description = "No description found.";
                List<PluginProperty> properties = new List<PluginProperty>();

                //Check if settings exist

                string settingsFile = file.Substring(0, file.LastIndexOf(".js")) + ".settings.js";
                bool settingsExist = File.Exists(settingsFile);

                //Go over all lines and handle plugin
                //specific commands (//@)

                string[] lines = plugin.Split('\n');
                for (int l = 0; l < lines.Length; l++)
                    if (lines[l].IndexOf("//@") != -1)
                    {
                        //Get words of line

                        string[] words;
                        if (lines[l].IndexOf(' ') != -1)
                            words = lines[l].Split(' ');
                        else
                            words = new string[1] { lines[l] };

                        //Handle based on the type
                        //(author, description, etc.)

                        string lineType = words[0].Replace("//@", "").Trim();
                        switch (lineType)
                        {
                            //Author command

                            case "author":
                                author = "";
                                for (int w = 1; w < words.Length; w++)
                                    author += (w > 1 ? " " : "") + words[w].Trim();
                                break;

                            //Description command

                            case "description":
                                description = "";
                                for (int sl = l + 1; sl < lines.Length; sl++)
                                    if (lines[sl].IndexOf("//") != -1 && lines[sl].IndexOf("//@") == -1)
                                        description += lines[sl].Replace("//", "").Trim() + " ";
                                    else
                                        break;
                                break;

                            //Default to a property command

                            default:
                                if (settingsExist)
                                    break;

                                PluginProperty pp = ReadProperty(lines[l].Trim());
                                if (pp != null)
                                    properties.Add(pp);
                                break;
                        }
                    }

                //If settings exist, read properties

                if (settingsExist)
                {
                    string settings = File.ReadAllText(settingsFile);
                    lines = settings.Split('\n');

                    for (int l = 0; l < lines.Length; l++)
                        if (lines[l].IndexOf("//@") != -1)
                        {
                            string[] words = lines[l + 1].Split(' ');
                            string settingType = lines[l].Replace("//@", "").Trim();
                            string settingName = words[1];
                            string settingValue = words[3].Replace(";", "").Trim();

                            PluginProperty pp = null;

                            switch (settingType) {
                                case "string":
                                    string stringValue = "";

                                    for (int w = 3; w < words.Length; w++)
                                        if (words[w].IndexOf('\'') != -1)
                                            stringValue += (w > 3 ? " " : "") + words[w].Replace("'", "").Replace(";", "").Trim();
                                        else
                                            break;
                                    pp = new PluginStringProperty(settingName, stringValue);
                                    break;
                                case "number":
                                    pp = new PluginNumberProperty(settingName, double.Parse(settingValue));
                                    break;
                                case "bool":
                                    pp = new PluginBoolProperty(settingName, bool.Parse(settingValue));
                                    break;
                            }

                            if (pp != null)
                                properties.Add(pp);
                        }
                }

                //Create plugin and return

                return new Plugin(
                    name,
                    author,
                    description,
                    properties.ToArray()
                );
            }
            catch (Exception exc)
            {
                MessageBox.Show("Could not read plugin: " + exc.Message, "WebClash - Error");
                return null;
            }
        }

        public static PluginProperty ReadProperty(string line)
        {
            try
            {
                PluginProperty result = null;

                //Read property values

                string[] words = line.Replace("//@", "").Split(' ');

                //Check if valid property

                if (words.Length <= 1)
                    return null;

                //Read property data

                string propertyType = words[0].ToLower();
                string propertyName = words[1];
                string propertyValue;

                //Handle p

                switch (propertyType)
                {
                    //Number property

                    case "number":
                        propertyValue = words[2];

                        result = new PluginNumberProperty(
                            propertyName,
                            double.Parse(propertyValue)
                        );
                        break;

                    //Bool property

                    case "bool":
                        propertyValue = words[2];

                        result = new PluginBoolProperty(
                            propertyName,
                            bool.Parse(propertyValue)
                        );
                        break;

                    //String property

                    case "string":
                        propertyValue = "";

                        for (int w = 2; w < words.Length; w++)
                            if (words[w].IndexOf('\"') != -1)
                                propertyValue += (w > 2 ? " " : "") + words[w].Replace("\"", "");
                            else
                                break;

                        result = new PluginStringProperty(
                            propertyName,
                            propertyValue
                        );
                        break;
                }

                return result;
            }
            catch (Exception exc)
            {
                MessageBox.Show("Could not load plugin property: " + exc.Message, "WebClash - Error");
                return null;
            }
        }

        public static void SavePluginSettings(string settings, bool enabled, PluginProperty[] properties)
        {
            try
            {
                //Create settings file

                string content = "//This file is automatically generated by the\n" +
                                 "//WebClash binary and should not be modified.\n\n" +
                                 "//ENABLED=true\n\n";

                //For all properties, add property to content

                for (int p = 0; p < properties.Length; p++)
                {
                    if (properties[p] == null)
                        continue;

                    PluginProperty pp = properties[p];

                    switch (pp)
                    {
                        case PluginStringProperty psp:
                            content += "//@string\n";
                            break;
                        case PluginNumberProperty pnp:
                            content += "//@number\n";
                            break;
                        case PluginBoolProperty pbp:
                            content += "//@bool\n";
                            break;
                    }

                    content += "let " + pp.name + " = " + pp.GetValue() + "\n";
                }

                //Write settings

                File.WriteAllText(settings, content);
            }
            catch (Exception exc)
            {
                MessageBox.Show("Could not save plugin settings: " + exc.Message, "WebClash - Error");
            }
        }
    }

    //Plugin class

    public class Plugin
    {
        public Plugin(string name, string author, string description, PluginProperty[] properties)
        {
            this.name = name;
            this.author = author;
            this.description = description;
            this.properties = properties;
        }

        public string name;
        public string author;
        public string description;
        public PluginProperty[] properties;
    }

    //Plugin property classes

    public abstract class PluginProperty
    {
        public string name;

        public PluginProperty(string name)
        {
            this.name = name;
        }

        public abstract object GetValue();
    }

    public class PluginNumberProperty : PluginProperty
    {
        public double value = 0;

        public PluginNumberProperty(string name, double value)
            : base(name)
        {
            this.value = value;
        }

        public override object GetValue()
        {
            return value;
        }
    }

    public class PluginStringProperty : PluginProperty
    {
        public string value = "";

        public PluginStringProperty(string name, string value)
            : base(name)
        {
            this.value = value;
        }

        public override object GetValue()
        {
            return "'" + value + "'";
        }
    }

    public class PluginBoolProperty : PluginProperty
    {
        public bool value;

        public PluginBoolProperty(string name, bool value)
            : base(name)
        {
            this.value = value;
        }

        public override object GetValue()
        {
            return value.ToString().ToLower();
        }
    }
}
