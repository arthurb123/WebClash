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

        Dictionary<int, string> mapBGMSaveRequests = new Dictionary<int, string>();

        public Maps()
        {
            InitializeComponent();
        }

        private void Maps_Load(object sender, EventArgs e)
        {
            FormClosing += Maps_FormClosing;

            LoadMapsList();

            if (mapList.Items.Count > 0)
                mapList.SelectedIndex = 0;
        }

        private void Maps_FormClosing(object sender, FormClosingEventArgs e)
        {
            SaveBGMRequests();
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

                string[] characters = Directory.GetFiles(Program.main.location + "/maps", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                foreach (string c in characters)
                    mapList.Items.Add(c.Substring(c.LastIndexOf('\\') + 1, c.LastIndexOf('.') - c.LastIndexOf('\\') - 1));
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
            
            mapSize.Text = current.width + "x" + current.height;
            mapTilesets.Text = current.tilesets.Length.ToString();

            CheckTilesets();

            if (current.mapType != null &&
                current.mapType != string.Empty)
                mapType.SelectedItem = current.mapType[0].ToString().ToUpper() + current.mapType.Substring(1, current.mapType.Length - 1);
            else
                mapType.SelectedItem = string.Empty;

            if (current.bgmSource != null)
                bgmSource.Text = current.bgmSource;

            dayNight.Checked = current.showDayNight;
            alwaysDark.Checked = current.alwaysDark;

            dayNight.Enabled = !current.alwaysDark;
            alwaysDark.Enabled = !current.showDayNight;
        }

        private void CheckTilesets()
        {
            if (current == null)
                return;

            foreach (Tileset ts in current.tilesets)
                if (!CheckTileset(ts))
                {
                    mapTilesetStatus.Text = "Not all Tilesets are present.";
                    mapTilesetStatus.ForeColor = System.Drawing.Color.Red;

                    fixTilesets.Visible = true;

                    return;
                }

            mapTilesetStatus.Text = "All Tilesets are present.";
            mapTilesetStatus.ForeColor = System.Drawing.Color.Green;

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

                    SaveBGMRequests();

                    SetMapType("Protected");

                    SaveMapAlwaysDark(false);
                    SaveMapDayNight(false);

                    LoadMapsList();

                    mapList.SelectedItem = ofd.SafeFileName.Substring(0, ofd.SafeFileName.IndexOf('.'));
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

            string path = Program.main.location + "/maps/" + mapList.SelectedItem.ToString() + ".json";

            /*
            if (mapList.Items.Count == 1)
            {
                MessageBox.Show("This map cannot be removed as there must always be one map present.", "WebClash Server - Error");

                return;
            }
            */

            if (File.Exists(path))
                File.Delete(path);

            LoadMapsList();
        }

        private void help_Click(object sender, EventArgs e)
        {
            MessageBox.Show("You can import maps created with Tiled (www.mapeditor.org) in the JSON format. The tilemaps must also have the used tilesets embedded into them.\n\nTileset images are often imported automatically. If the tileset could not be found it will have to be selected manually.", "WebClash Server - Help");
        }

        private void mapList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (mapList.SelectedItem == null)
                return;
            
            SaveBGMRequests();

            LoadMap(mapList.SelectedItem.ToString());
        }

        public int GetAmount()
        {
            return mapList.Items.Count;
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

        private void mapType_SelectedIndexChanged(object sender, EventArgs e)
        {
            SetMapType(mapType.SelectedItem.ToString());
        }

        private void mapTypeHelp_Click(object sender, EventArgs e)
        {
            MessageBox.Show("Map types determine the behaviour of the map.\nPossible map types are as follows:\n\nProtected -> Regenerate all stats\nNeutral -> No regeneration\nHostile -> No regeneration, NPCs attack players (not implemented yet)", "WebClash Server - Map Types");
        }

        private void SetMapType(string mapTypeString)
        {
            if (mapTypeString == null ||
                mapTypeString == string.Empty)
                return;

            string map = Program.main.location + "/maps/" + mapList.SelectedItem.ToString() + ".json";

            JObject mjo = (JObject)JsonConvert.DeserializeObject(File.ReadAllText(map));

            if (mjo.Property("mapType") != null)
                mjo.Remove("mapType");

            mjo.Add("mapType", mapTypeString.ToLower());

            File.WriteAllText(map, JsonConvert.SerializeObject(mjo));
        }

        private void bgmSourceHelp_Click(object sender, EventArgs e)
        {
            MessageBox.Show("The BGM source determines which music file should be played as the background music in the map. If left empty no BGM will be played.", "WebClash Server - Background Music Source");
        }

        private void bgmSource_TextChanged(object sender, EventArgs e)
        {
            if (mapList.SelectedIndex == -1)
                return;

            if (mapBGMSaveRequests.ContainsKey(mapList.SelectedIndex))
                mapBGMSaveRequests.Remove(mapList.SelectedIndex);

            mapBGMSaveRequests.Add(mapList.SelectedIndex, bgmSource.Text);

            current.bgmSource = bgmSource.Text;
        }

        private void SaveBGMRequests()
        {
            //Check if BGMs exist, if so save

            if (mapBGMSaveRequests.Count == 0)
                return;

            foreach (KeyValuePair<int, string> entry in mapBGMSaveRequests)
                if (File.Exists(Program.main.location + "/../client/" + entry.Value))
                    SetMapBGMSource(entry.Key, entry.Value);

            mapBGMSaveRequests = new Dictionary<int, string>();
        }

        private void SetMapBGMSource(int index, string bgmSourceString)
        {
            if (bgmSourceString == null ||
                bgmSourceString == string.Empty)
                return;

            string map = Program.main.location + "/maps/" + mapList.Items[index].ToString() + ".json";

            JObject mjo = (JObject)JsonConvert.DeserializeObject(File.ReadAllText(map));

            if (mjo.Property("bgmSource") != null)
                mjo.Remove("bgmSource");

            mjo.Add("bgmSource", bgmSourceString);

            File.WriteAllText(map, JsonConvert.SerializeObject(mjo, Formatting.Indented));
        }

        private void DayNight_CheckedChanged(object sender, EventArgs e)
        {
            if (mapList.SelectedIndex == -1)
                return;

            current.showDayNight = dayNight.Checked;
            current.alwaysDark = !current.showDayNight;

            if (current.showDayNight)
                alwaysDark.Checked = false;

            alwaysDark.Enabled = !current.showDayNight;

            SaveMapDayNight(current.showDayNight);
        }

        private void SaveMapDayNight(bool dayNight)
        {
            string map = Program.main.location + "/maps/" + mapList.SelectedItem.ToString() + ".json";

            JObject mjo = (JObject)JsonConvert.DeserializeObject(File.ReadAllText(map));

            if (mjo.Property("showDayNight") != null)
                mjo.Remove("showDayNight");

            mjo.Add("showDayNight", dayNight);

            File.WriteAllText(map, JsonConvert.SerializeObject(mjo));
        }

        private void AlwaysDark_CheckedChanged(object sender, EventArgs e)
        {
            if (mapList.SelectedIndex == -1)
                return;

            current.alwaysDark = alwaysDark.Checked;
            current.showDayNight = !current.alwaysDark;

            if (current.alwaysDark)
                dayNight.Checked = false;

            dayNight.Enabled = !current.alwaysDark;

            SaveMapDayNight(current.showDayNight);
            SaveMapAlwaysDark(current.alwaysDark);
        }

        private void SaveMapAlwaysDark(bool alwaysDark)
        {
            string map = Program.main.location + "/maps/" + mapList.SelectedItem.ToString() + ".json";

            JObject mjo = (JObject)JsonConvert.DeserializeObject(File.ReadAllText(map));

            if (mjo.Property("alwaysDark") != null)
                mjo.Remove("alwaysDark");

            mjo.Add("alwaysDark", alwaysDark);

            File.WriteAllText(map, JsonConvert.SerializeObject(mjo));
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

                mapType = temp.mapType;
                bgmSource = temp.bgmSource;
                showDayNight = temp.showDayNight;
                alwaysDark = temp.alwaysDark;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash Server - Error");
            }
        }

        public int width = 0,
                   height = 0;

        public Tileset[] tilesets = new Tileset[0];

        public string mapType = string.Empty;
        public string bgmSource = string.Empty;

        public bool showDayNight = false;
        public bool alwaysDark = false;
    }

    public class Tileset
    {
        public string image = "";
    }
}
