using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;

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

                string[] maps = Directory.GetFiles(Program.main.location + "/maps", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s)) && !s.Contains(".metadata")).ToArray();

                foreach (string m in maps)
                    mapList.Items.Add(m.Substring(m.LastIndexOf('\\') + 1, m.LastIndexOf('.') - m.LastIndexOf('\\') - 1));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }
        }

        private void LoadMap(string mapName)
        {
            if (mapName == string.Empty)
                return;
           
            current = new Map(Program.main.location + "/maps/" + mapName + ".json");
            currentMetadata = new MapMetadata(Program.main.location + "/maps/" + mapName + ".metadata.json");
            
            mapSize.Text = current.width + "x" + current.height;
            mapTilesets.Text = current.tilesets.Length.ToString();

            CheckTilesets();

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
            string clientLocation = Program.main.location + "/../client/res/tilesets/";

            int s = ts.image.LastIndexOf("/") + 1;

            string loc = clientLocation + ts.image.Substring(s, ts.image.Length - s);

            return File.Exists(loc);
        }

        private void import_Click(object sender, EventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();
            ofd.Title = "WebClash Server - Import Map";
            ofd.Filter = "Tiled JSON Map|*.json";

            if (ofd.ShowDialog() == DialogResult.OK)
            {
                try
                {
                    current = new Map(ofd.FileName);
                    for (int i = 0; i < current.tilesets.Length; i++)
                        current.tilesets[i].image = Path.GetDirectoryName(ofd.FileName) + "/" + current.tilesets[i].image;

                    string startLocation = Program.main.location + "\\maps\\";

                    File.Copy(ofd.FileName, startLocation + ofd.SafeFileName, true);

                    ImportTilesets();

                    SaveBGMSource("");
                    SaveMapType("Protected");
                    SaveMapAlwaysDark(false);
                    SaveMapDayNight(false);

                    LoadMapsList();

                    mapList.SelectedItem = ofd.SafeFileName.Substring(0, ofd.SafeFileName.IndexOf('.'));

                    dataHasChanged = true;
                }
                catch (Exception exc)
                {
                    MessageBox.Show(exc.Message, "WebClash Server - Error");
                }
            }
        }

        private void delete_Click(object sender, EventArgs e)
        {
            DialogResult dr = MessageBox.Show("Are you sure you want to delete map '" + mapList.SelectedItem.ToString() + "'?", "WebClash - Delete Map", MessageBoxButtons.YesNo);

            if (dr != DialogResult.Yes)
                return;

            string path = Program.main.location + "/maps/" + mapList.SelectedItem.ToString() + ".json",
                   pathMetadata = Program.main.location + "/maps/" + mapList.SelectedItem.ToString() + ".metadata.json";

            if (File.Exists(path))
                File.Delete(path);
            if (File.Exists(pathMetadata))
                File.Delete(pathMetadata);

            LoadMapsList();

            dataHasChanged = true;
        }

        private void help_Click(object sender, EventArgs e)
        {
            MessageBox.Show("You can import maps created with Tiled (www.mapeditor.org) in the JSON format. The tilemaps must also have the used tilesets embedded into them.\n\nTileset images are often imported automatically. If the tileset could not be found it will have to be selected manually.", "WebClash Server - Help");
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
            } else
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
                string startLocation = Program.main.location + "/maps/";

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
                                MessageBox.Show("Tileset '" + name + "' could not be imported.", "WebClash Server - Error");

                                continue;
                            }
                                
                        }

                        if (temp == null) {
                            MessageBox.Show("Tileset '" + name + "' could not be imported.", "WebClash Server - Error");

                            continue;
                        }

                        string clientLocation = Program.main.location + "/../client/res/tilesets/";

                        temp.Save(clientLocation + name);

                        temp.Dispose();
                    }

                CheckTilesets();
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash Server - Error");
            }
        }

        private void mapTypeHelp_Click(object sender, EventArgs e)
        {
            MessageBox.Show("Map types determine the behaviour of the map.\nPossible map types are as follows:\n\nProtected -> Regenerate all stats when out of combat\nNeutral -> No regeneration of stats", "WebClash Server - Map Types");
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
            MessageBox.Show("The BGM source determines which music file should be played as the background music in the map. If left empty no BGM will be played.", "WebClash Server - Background Music Source");
        }

        private void bgmSource_TextChanged(object sender, EventArgs e)
        {
            if (mapList.SelectedIndex == -1 || bgmSource.Text.Length == 0)
                return;

            SaveBGMSource(bgmSource.Text);
        }

        private void SaveBGMSource(string bgmSourceString)
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

        private void SaveMetadata()
        {
            File.WriteAllText(
                Program.main.location + "/maps/" + mapList.SelectedItem.ToString() + ".metadata.json", 
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
        public Map (string src)
        {
            try
            {
                if (!File.Exists(src))
                    return;

                Map temp = JsonConvert.DeserializeObject<Map>(File.ReadAllText(src));

                width = temp.width;
                height = temp.height;

                tilesets = temp.tilesets;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash Server - Error");
            }
        }

        public int width = 0,
                   height = 0;

        public Tileset[] tilesets = new Tileset[0];
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
                mapDialogs = temp.mapDialogs;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash Server - Error");
            }
        }

        public string mapType = string.Empty;
        public string bgmSource = string.Empty;

        public bool pvp = false;

        public bool showDayNight = false;
        public bool alwaysDark = false;

        public MapDialogue[] mapDialogs = new MapDialogue[0];
    }

    public class Tileset
    {
        public string image = "";
    }
}
