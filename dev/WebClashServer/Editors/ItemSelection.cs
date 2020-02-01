using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace WebClashServer.Editors
{
    public partial class ItemSelection : Form
    {
        private List<PossibleItem> items = new List<PossibleItem>();
        private int current = -1;

        private bool showDropFactor = true;

        public ItemSelection(string title, PossibleItem[] items, bool showDropFactor = true)
        {
            InitializeComponent();

            Text = title;

            this.items = new List<PossibleItem>(items);
            this.showDropFactor = showDropFactor;

            if (!showDropFactor)
            {
                dropChance.Visible = false;
                dropChanceText.Visible = false;
                dropFactorText.Visible = false;
            }
        }

        private void ItemSelection_Load(object sender, EventArgs e)
        {
            Reloaditems();

            ReloadItemList();
        }

        private void ReloadItemList()
        {
            itemList.Items.Clear();

            try
            {
                if (items.Count == 0)
                {
                    itemSelect.Enabled = false;
                    dropChance.Enabled = false;
                }
                else
                {
                    itemSelect.Enabled = true;
                    dropChance.Enabled = true;
                }

                for (int i = 0; i < items.Count; i++)
                {
                    string it = items[i].item;

                    itemList.Items.Add((i + 1) + ". " + items[i].item + (showDropFactor ? " (" + items[i].dropChance + ")" : ""));
                }
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash - Error");
            }

            if (current == -1 &&
                items.Count > 0)
                itemList.SelectedItem = itemList.Items[0];
            else if (items.Count > 0 &&
                     current < items.Count)
                itemList.SelectedItem = itemList.Items[current];
        }

        private void Reloaditems()
        {
            itemSelect.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] items = Directory.GetFiles(Program.main.location + "/items", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                foreach (string i in items)
                    itemSelect.Items.Add(i.Substring(i.LastIndexOf('\\') + 1, i.LastIndexOf('.') - i.LastIndexOf('\\') - 1));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash - Error");
            }
        }

        private void itemList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (itemList.SelectedIndex == -1 ||
                items.Count <= itemList.SelectedIndex)
                return;

            current = itemList.SelectedIndex;

            if (items[current].item == "")
                itemSelect.SelectedItem = null;
            else
                itemSelect.SelectedItem = items[current].item;

            dropChance.Value = items[current].dropChance;
        }

        private void itemSelect_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (current == -1 || itemSelect.SelectedItem == null)
                return;

            items[current].item = itemSelect.SelectedItem.ToString();

            ReloadItemList();
        }

        private void dropChance_ValueChanged(object sender, EventArgs e)
        {
            if (current == -1)
                return;

            items[current].dropChance = (int)dropChance.Value;

            ReloadItemList();
        }

        private void newLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            items.Add(new PossibleItem());

            ReloadItemList();
            itemList.SelectedIndex = items.Count - 1;
        }

        private void delete_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == -1)
                return;

            items.RemoveAt(current);
            current = -1;

            ReloadItemList();
        }

        public PossibleItem[] GetSelection()
        {
            return items.ToArray();
        }
    }

    public class PossibleItem
    {
        public string item = "";
        public int dropChance = 1;
    }
}
