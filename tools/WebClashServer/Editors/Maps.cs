using Newtonsoft.Json;
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

            mapID.Text = mapList.SelectedIndex.ToString();
            mapSize.Text = current.width + "x" + current.height;
            mapTilesets.Text = current.tilesets.Length.ToString();

            CheckTilesets();
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
            string path = Program.main.location + "/maps/" + mapList.SelectedItem.ToString() + ".json";

            if (mapList.Items.Count == 1)
            {
                MessageBox.Show("This map cannot be removed as there must always be one map present.", "WebClash Server - Error");

                return;
            }

            if (File.Exists(path))
                File.Delete(path);

            LoadMapsList();
        }

        private void help_Click(object sender, EventArgs e)
        {
            MessageBox.Show("You can import maps created with Tiled (www.mapeditor.org) in the JSON format. The tilemaps must also have the used tilesets embedded into them.\n\nTileset images are imported automatically, as long as they have not been moved before importing the map.", "WebClash Server - Help");
        }

        private void mapList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (mapList.SelectedItem == null)
                return;

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
                        Image temp;

                        if (File.Exists(startLocation + ts.image))
                            temp = Image.FromFile(startLocation + ts.image);
                        else if (File.Exists(ts.image))
                            temp = Image.FromFile(ts.image);
                        else continue;

                        string clientLocation = Program.main.location + "/../client/res/tilesets/";

                        int s = ts.image.LastIndexOf("/") + 1;

                        temp.Save(clientLocation + ts.image.Substring(s, ts.image.Length - s));
                    }

                CheckTilesets();
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash Server - Error");
            }
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

    public class Tileset
    {
        public string image = "";
    }
}
