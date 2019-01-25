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

        public ItemSelection(string title, PossibleItem[] items)
        {
            InitializeComponent();

            Text = title;

            this.items = new List<PossibleItem>(items);
        }

        private void ItemSelection_Load(object sender, EventArgs e)
        {
            Reloaditems();

            ReloadItemList(items.ToArray());
        }

        private void ReloadItemList(PossibleItem[] items)
        {
            itemList.Items.Clear();

            try
            {
                for (int i = 0; i < items.Length; i++)
                {
                    string it = items[i].item;

                    itemList.Items.Add(i + ". " + items[i].item + " (" + items[i].dropChance + ")");
                }
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }

            if (current == -1 &&
                items.Length > 0)
                itemList.SelectedItem = itemList.Items[0];
            else if (items.Length > 0 &&
                     current < items.Length)
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
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }
        }

        private void itemList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (itemList.SelectedIndex == -1 ||
                items.Count <= itemList.SelectedIndex)
                return;

            current = itemList.SelectedIndex;

            itemSelect.SelectedItem = items[current].item;
            dropChance.Value = items[current].dropChance;
        }

        private void itemSelect_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (current == -1)
                return;

            items[current].item = itemSelect.SelectedItem.ToString();

            ReloadItemList(items.ToArray());
        }

        private void dropChance_ValueChanged(object sender, EventArgs e)
        {
            if (current == -1)
                return;

            items[current].dropChance = (int)dropChance.Value;

            ReloadItemList(items.ToArray());
        }

        private void newLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            string i = itemList.Items.Count + ". " + string.Empty;

            items.Add(new PossibleItem());

            itemList.Items.Add(i);
            itemList.SelectedItem = i;
        }

        private void delete_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == -1)
                return;

            items.RemoveAt(current);

            ReloadItemList(items.ToArray());
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
