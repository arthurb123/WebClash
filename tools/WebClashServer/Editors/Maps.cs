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
            LoadMaps();

            if (mapList.Items.Count > 0)
                mapList.SelectedIndex = 0;
        }

        private void LoadMaps()
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

        }

        private void delete_Click(object sender, EventArgs e)
        {

        }

        private void help_Click(object sender, EventArgs e)
        {

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

            string startLocation = Program.main.location + "/maps/";

            foreach (Tileset ts in current.tilesets)
                if (!CheckTileset(ts) &&
                    File.Exists(startLocation + ts.image))
                {
                    Image temp = Image.FromFile(startLocation + ts.image);

                    string clientLocation = Program.main.location + "/../client/res/tilesets/";

                    int s = ts.image.LastIndexOf("/") + 1;

                    temp.Save(clientLocation + ts.image.Substring(s, ts.image.Length - s));
                }

            CheckTilesets();
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
