using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace WebClashServer.Editors
{
    public partial class MapLayers : Form
    {
        private List<MapLayer> layers = new List<MapLayer>();
        private int current = -1;

        public MapLayers(string title, Map map, MapLayer[] layers)
        {
            InitializeComponent();
            Text = title;

            ExtractLayers(map, layers);
        }

        private void MapLayers_Load(object sender, EventArgs e)
        {
            ReloadLayerList();
        }

        private void ExtractLayers(Map map, MapLayer[] existingLayers)
        {
            layers = new List<MapLayer>(existingLayers);

            //Check if existing layers also exist in the map,
            //to make sure old deleted layers get removed

            for (int l = 0; l < layers.Count; l++) {
                bool trulyExists = false;

                for (int ll = 0; ll < map.layers.Length; ll++)
                    if (layers[l].name == map.layers[ll].name)
                    {
                        trulyExists = true;
                        break;
                    }

                if (!trulyExists) 
                    layers.RemoveAt(l);
            }

            //Import layers from map, if they already exist
            //skip these

            for (int l = 0; l < map.layers.Length; l++)
            {
                if (map.layers[l].type != "tilelayer")
                    continue;

                string name = map.layers[l].name;

                if (ExistsLayer(name))
                    continue;

                if (l <= 2)
                    layers.Insert(l, new MapLayer(name, false));
                else
                    layers.Insert(l, new MapLayer(name, true));
            }
        }

        private bool ExistsLayer(string layerName)
        {
            for (int i = 0; i < layers.Count; i++)
                if (layers[i].name == layerName)
                    return true;

            return false;
        }

        private void ReloadLayerList()
        {
            layerList.Items.Clear();

            try
            {
                if (layers.Count == 0)
                {
                    moveDown.Enabled = false;
                    moveUp.Enabled = false;
                    isHover.Enabled = false;
                }
                else
                {
                    moveDown.Enabled = true;
                    moveUp.Enabled = true;
                    isHover.Enabled = true;
                }

                for (int i = 0; i < layers.Count; i++)
                {
                    string hover = (layers[i].hover ? " (H)" : "");

                    layerList.Items.Add((i + 1) + ". " + layers[i].name + hover);
                }
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }
            
            if (current == -1 &&
                layers.Count > 0)
                layerList.SelectedItem = layerList.Items[0];
            else if (layers.Count > 0 &&
                     current < layers.Count)
                layerList.SelectedItem = layerList.Items[current];
        }

        private void layerList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (layerList.SelectedIndex == -1 ||
                layers.Count <= layerList.SelectedIndex)
                return;

            current = layerList.SelectedIndex;

            isHover.Checked = layers[current].hover;
        }


        private void swapLayers(int indexA, int indexB)
        {
            MapLayer tmpLayer = layers[indexA];
            layers[indexA] = layers[indexB];
            layers[indexB] = tmpLayer;

            ReloadLayerList();
        }

        private void moveDown_Click(object sender, EventArgs e)
        {
            if (current == -1 || layers.Count == 1)
                return;

            if (current < layers.Count - 1)
            {
                if (!layers[current].hover && layers[current+1].hover)
                {
                    MessageBox.Show("Could not move layer down, as hover layers should always be on top.", "WebClash Server - Error");
                    return;
                }

                swapLayers(current, current + 1);
                layerList.SelectedIndex = current + 1;
            }
        }

        private void moveUp_Click(object sender, EventArgs e)
        {
            if (current == -1 || layers.Count == 1)
                return;

            if (current > 0) {
                if (layers[current].hover && !layers[current - 1].hover)
                {
                    MessageBox.Show("Could not move layer up, as hover layers should always be on top.", "WebClash Server - Error");
                    return;
                }

                swapLayers(current, current - 1);
                layerList.SelectedIndex = current - 1;
            }
        }

        private void isHover_CheckedChanged(object sender, EventArgs e)
        {
            if (current == -1)
                return;

            layers[current].hover = isHover.Checked;

            ReloadLayerList();
        }

        public MapLayer[] GetSelection()
        {
            return layers.ToArray();
        }
    }

    public class MapLayer
    {
        public MapLayer (string name, bool hover)
        {
            this.name = name;
            this.hover = hover;
        }

        public string name = "";
        public bool hover = false;
    }
}
