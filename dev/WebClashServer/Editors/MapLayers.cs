using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace WebClashServer.Editors
{
    public partial class MapLayers : Form
    {
        private List<MapLayer> layers = new List<MapLayer>();
        private int current = -1;

        public MapLayers(string title, MapLayer[] layers)
        {
            InitializeComponent();
            Text = title;

            this.layers = new List<MapLayer>(layers);
        }

        private void MapLayers_Load(object sender, EventArgs e)
        {
            ReloadLayerList();
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
