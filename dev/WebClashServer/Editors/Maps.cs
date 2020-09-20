using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using WebClashServer.Classes;

namespace WebClashServer.Editors
{
    public partial class Maps : Form
    {
        Map current;
        MapMetadata currentMetadata;

        private bool dataHasChanged = false;

        public Maps()
        {
            InitializeComponent();
        }

        private void Maps_Load(object sender, EventArgs e)
        {
            LoadMapsList();

            if (mapList.Items.Count > 0)
                mapList.SelectedIndex = 0;
        }

        private void LoadMapsList()
        {
            mapList.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] maps = Directory.GetFiles(Program.main.serverLocation + "/maps", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s)) && !s.Contains(".metadata")).ToArray();

                foreach (string m in maps)
                {
                    string map = m.Replace('\\', '/');

                    mapList.Items.Add(map.Substring(map.LastIndexOf('/') + 1, map.LastIndexOf('.') - map.LastIndexOf('/') - 1));
                }
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load map list: ", exc);
            }
        }

        private void LoadMap(string mapName)
        {
            if (mapName == string.Empty)
                return;

            current = new Map(Program.main.serverLocation + "/maps/" + mapName + ".json");
            currentMetadata = new MapMetadata(Program.main.serverLocation + "/maps/" + mapName + ".metadata.json");

            mapSize.Text = current.width + "x" + current.height;
            mapTilesets.Text = current.tilesets.Length.ToString();

            CheckTilesets();
            ExtractLayers();

            if (currentMetadata.mapType != null &&
                currentMetadata.mapType != string.Empty)
            {
                if (currentMetadata.mapType == "protected")
                    mapType.SelectedItem = "Protected";
                else if (currentMetadata.mapType == "neutral")
                    mapType.SelectedItem = "Neutral";
            }
            else
                mapType.SelectedItem = string.Empty;

            pvp.Checked = currentMetadata.pvp;

            if (currentMetadata.bgmSource != null)
                bgmSource.Text = currentMetadata.bgmSource;

            dayNight.Checked = currentMetadata.showDayNight;
            alwaysDark.Checked = currentMetadata.alwaysDark;
        }

        private void ExtractLayers()
        {
            List<MapLayer> layers = new List<MapLayer>(currentMetadata.mapLayers);

            //Check if existing layers also exist in the map,
            //to make sure old deleted layers get removed

            for (int l = 0; l < layers.Count; l++)
            {
                bool trulyExists = false;

                for (int ll = 0; ll < current.layers.Length; ll++)
                    if (layers[l].name == current.layers[ll].name)
                    {
                        trulyExists = true;
                        break;
                    }

                if (!trulyExists)
                    layers.RemoveAt(l);
            }

            //Import layers from map, if they already exist
            //skip these

            for (int l = 0; l < current.layers.Length; l++)
            {
                if (current.layers[l].type != "tilelayer")
                    continue;

                string name = current.layers[l].name;

                if (ExistsLayer(name))
                    continue;

                if (l <= 2)
                    layers.Insert(l, new MapLayer(name, false));
                else
                    layers.Insert(l, new MapLayer(name, true));
            }

            //Get old length of metadata map layers

            int mapLayers = currentMetadata.mapLayers.Length;

            //Set metadata map layers

            currentMetadata.mapLayers = layers.ToArray();

            //Check if maps have changed, if so save

            if (mapLayers != currentMetadata.mapLayers.Length)
                SaveMetadata();
        }

        private bool ExistsLayer(string layerName)
        {
            for (int i = 0; i < currentMetadata.mapLayers.Length; i++)
                if (currentMetadata.mapLayers[i].name == layerName)
                    return true;

            return false;
        }

        private void CheckTilesets()
        {
            if (current == null)
                return;

            foreach (Tileset ts in current.tilesets)
                if (!CheckTileset(ts))
                {
                    mapTilesetStatus.Text = "Not all Tilesets are present.";
                    mapTilesetStatus.ForeColor = Color.Red;

                    fixTilesets.Visible = true;

                    return;
                }

            mapTilesetStatus.Text = "All Tilesets are present.";
            mapTilesetStatus.ForeColor = Color.Green;

            fixTilesets.Visible = false;
        }

        private bool CheckTileset(Tileset ts)
        {
            string clientLocation = Program.main.ClientLocation + "/res/tilesets/";

            int s = ts.image.LastIndexOf("/") + 1;

            string loc = clientLocation + ts.image.Substring(s, ts.image.Length - s);

            return File.Exists(loc);
        }

        private void import_Click(object sender, EventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Title = "WebClash - Import Map";
            ofd.Filter = "Tiled JSON Map|*.json";

            if (ofd.ShowDialog() == DialogResult.OK)
            {
                try
                {
                    current = new Map(ofd.FileName);
                    for (int i = 0; i < current.tilesets.Length; i++)
                        current.tilesets[i].image = Path.GetDirectoryName(ofd.FileName) + "/" + current.tilesets[i].image;

                    string startLocation = Program.main.serverLocation + "/maps/";

                    File.Copy(ofd.FileName, startLocation + ofd.SafeFileName, true);

                    ImportTilesets();

                    SaveBgmSource("");
                    SaveMapType("Protected");
                    SaveMapAlwaysDark(false);
                    SaveMapDayNight(false);

                    LoadMapsList();

                    mapList.SelectedItem = ofd.SafeFileName.Substring(0, ofd.SafeFileName.IndexOf('.'));

                    dataHasChanged = true;
                }
                catch (Exception exc)
                {
                    Logger.Error("Could not import map: ", exc);
                }
            }
        }

        private void delete_Click(object sender, EventArgs e)
        {
            DialogResult dr = MessageBox.Show("Are you sure you want to delete map '" + mapList.SelectedItem.ToString() + "'?", "WebClash - Delete Map", MessageBoxButtons.YesNo);

            if (dr != DialogResult.Yes)
                return;

            string path = Program.main.serverLocation + "/maps/" + mapList.SelectedItem.ToString() + ".json",
                   pathMetadata = Program.main.serverLocation + "/maps/" + mapList.SelectedItem.ToString() + ".metadata.json";

            if (File.Exists(path))
                File.Delete(path);
            if (File.Exists(pathMetadata))
                File.Delete(pathMetadata);

            LoadMapsList();

            dataHasChanged = true;
        }

        private void help_Click(object sender, EventArgs e)
        {
            MessageBox.Show("You can import maps created with Tiled (www.mapeditor.org) in the JSON format. The tilemaps must also have the used tilesets embedded into them.\n\nTileset images are often imported automatically. If the tileset could not be found it will have to be selected manually.", "WebClash - Help");
        }

        private void mapList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (mapList.SelectedItem == null)
            {
                mapType.Enabled = false;
                bgmSource.Enabled = false;
                pvp.Enabled = false;
                editMapDialogues.Enabled = false;
                dayNight.Enabled = false;
                alwaysDark.Enabled = false;
                return;
            }
            else
            {
                mapType.Enabled = true;
                bgmSource.Enabled = true;
                pvp.Enabled = true;
                editMapDialogues.Enabled = true;
                if (!alwaysDark.Enabled)
                    dayNight.Enabled = true;
                if (!dayNight.Enabled)
                    alwaysDark.Enabled = true;
            }

            LoadMap(mapList.SelectedItem.ToString());
        }

        private void fixTilesets_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            ImportTilesets();
        }

        private void ImportTilesets()
        {
            if (current == null)
                return;

            try
            {
                string startLocation = Program.main.serverLocation + "/maps/";

                foreach (Tileset ts in current.tilesets)
                    if (!CheckTileset(ts))
                    {
                        Image temp = null;
                        int s = ts.image.LastIndexOf("/") + 1;
                        string name = ts.image.Substring(s, ts.image.Length - s);

                        if (File.Exists(startLocation + ts.image))
                            temp = Image.FromFile(startLocation + ts.image);
                        else if (File.Exists(ts.image))
                            temp = Image.FromFile(ts.image);
                        else
                        {
                            string result = string.Empty;

                            OpenFileDialog ofd = new OpenFileDialog();
                            ofd.Title = "Select tileset '" + name + "'";
                            ofd.Filter = "Tileset (Image File)|*.png;*.jpg;*.jpeg;*.gif;*.bmp";

                            if (ofd.ShowDialog() == DialogResult.OK)
                                temp = Image.FromFile(ofd.FileName);
                            else
                            {
                                Logger.Error("Tileset '" + name + "' could not be imported.");

                                continue;
                            }

                        }

                        if (temp == null)
                        {
                            Logger.Error("Tileset '" + name + "' could not be imported.");

                            continue;
                        }

                        string clientLocation = Program.main.ClientLocation + "/res/tilesets/";

                        temp.Save(clientLocation + name);

                        temp.Dispose();
                    }

                CheckTilesets();
            }
            catch (Exception exc)
            {
                Logger.Error("Could not import tilesets: ", exc);
            }
        }

        private void mapTypeHelp_Click(object sender, EventArgs e)
        {
            MessageBox.Show("Map types determine the behaviour of the map.\nPossible map types are as follows:\n\nProtected -> Regenerate all stats when out of combat\nNeutral -> No regeneration of stats", "WebClash - Map Types");
        }

        private void mapType_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (mapList.SelectedIndex == -1 || mapType.SelectedItem == null)
                return;

            SaveMapType(mapType.SelectedItem.ToString().ToLower());
        }

        private void SaveMapType(string mapType)
        {
            if (mapType == currentMetadata.mapType)
                return;

            currentMetadata.mapType = mapType;

            SaveMetadata();
        }

        private void bgmSourceHelp_Click(object sender, EventArgs e)
        {
            MessageBox.Show("The BGM source determines which music file should be played as the background music in the map. If left empty no BGM will be played.", "WebClash - Background Music Source");
        }

        private void bgmSource_TextChanged(object sender, EventArgs e)
        {
            if (mapList.SelectedIndex == -1 || bgmSource.Text.Length == 0)
                return;

            SaveBgmSource(bgmSource.Text);
        }

        private void SaveBgmSource(string bgmSourceString)
        {
            if (bgmSourceString == currentMetadata.bgmSource)
                return;

            currentMetadata.bgmSource = bgmSourceString;

            SaveMetadata();
        }

        private void DayNight_CheckedChanged(object sender, EventArgs e)
        {
            if (mapList.SelectedIndex == -1)
                return;

            if (dayNight.Checked)
            {
                alwaysDark.Enabled = false;
                alwaysDark.Checked = false;
            }
            else
                alwaysDark.Enabled = true;

            SaveMapDayNight(dayNight.Checked);
        }

        private void SaveMapDayNight(bool dayNight)
        {
            if (dayNight == currentMetadata.showDayNight)
                return;

            currentMetadata.showDayNight = dayNight;

            SaveMetadata();
        }

        private void AlwaysDark_CheckedChanged(object sender, EventArgs e)
        {
            if (mapList.SelectedIndex == -1)
                return;

            if (alwaysDark.Checked)
            {
                dayNight.Enabled = false;
                dayNight.Checked = false;
            }
            else
                dayNight.Enabled = true;

            SaveMapAlwaysDark(alwaysDark.Checked);
        }

        private void SaveMapAlwaysDark(bool alwaysDark)
        {
            if (alwaysDark == currentMetadata.alwaysDark)
                return;

            currentMetadata.alwaysDark = alwaysDark;

            SaveMetadata();
        }

        private void Pvp_CheckedChanged(object sender, EventArgs e)
        {
            if (mapList.SelectedIndex == -1)
                return;

            SaveMapPvP(pvp.Checked);
        }

        private void SaveMapPvP(bool pvp)
        {
            if (pvp == currentMetadata.pvp)
                return;

            currentMetadata.pvp = pvp;

            SaveMetadata();
        }

        private void editMapDialogues_Click(object sender, EventArgs e)
        {
            if (mapList.SelectedIndex == -1)
                return;

            MapDialogues mapDialogues = new MapDialogues(
                "Edit dialogues for map '" + mapList.SelectedItem.ToString() + "'",
                currentMetadata.mapDialogs
            );

            mapDialogues.FormClosed += ((object s, FormClosedEventArgs fcea) =>
            {
                currentMetadata.mapDialogs = mapDialogues.GetSelection();

                SaveMetadata();
            });

            mapDialogues.ShowDialog();
        }

        private void editLayers_Click(object sender, EventArgs e)
        {
            if (mapList.SelectedIndex == -1)
                return;

            MapLayers mapLayers = new MapLayers(
                "Edit layers for map '" + mapList.SelectedItem.ToString() + "'",
                currentMetadata.mapLayers
            );

            mapLayers.FormClosed += ((object s, FormClosedEventArgs fcea) =>
            {
                currentMetadata.mapLayers = mapLayers.GetSelection();

                SaveMetadata();
            });

            mapLayers.ShowDialog();
        }

        private void SaveMetadata()
        {
            File.WriteAllText(
                Program.main.serverLocation + "/maps/" + mapList.SelectedItem.ToString() + ".metadata.json",
                JsonConvert.SerializeObject(currentMetadata)
            );

            dataHasChanged = true;
        }

        public bool GetChanged()
        {
            return dataHasChanged;
        }
    }

    public class Map
    {
        public Map(string src)
        {
            try
            {
                if (!File.Exists(src))
                    return;

                Map temp = JsonConvert.DeserializeObject<Map>(File.ReadAllText(src));

                width = temp.width;
                height = temp.height;

                tilesets = temp.tilesets;
                layers = temp.layers;
            }
            catch (Exception exc)
            {
                Logger.Error("Could not construct map instance: ", exc);
            }
        }

        public int width = 0,
                   height = 0;

        public Tileset[] tilesets = new Tileset[0];
        public Layer[] layers = new Layer[0];
    }

    public class MapMetadata
    {
        public MapMetadata(string src)
        {
            try
            {
                if (!File.Exists(src))
                    return;

                MapMetadata temp = JsonConvert.DeserializeObject<MapMetadata>(File.ReadAllText(src));

                mapType = temp.mapType;
                bgmSource = temp.bgmSource;
                showDayNight = temp.showDayNight;
                alwaysDark = temp.alwaysDark;
                pvp = temp.pvp;
                mapLayers = temp.mapLayers;
                mapDialogs = temp.mapDialogs;
            }
            catch (Exception exc)
            {
                Logger.Error("Could not construct map metadata instance: ", exc);
            }
        }

        public string mapType = string.Empty;
        public string bgmSource = string.Empty;

        public bool pvp = false;

        public bool showDayNight = false;
        public bool alwaysDark = false;

        public MapLayer[] mapLayers = new MapLayer[0];
        public MapDialogue[] mapDialogs = new MapDialogue[0];
    }

    public class Tileset
    {
        public string image = "";
    }

    public class Layer
    {
        public int x = 0;
        public int y = 0;
        public int width = 0;
        public int height = 0;

        public string name = "";
        public string type = "";

        public bool visible = true;
        public int[] data = new int[0];
    }
}
