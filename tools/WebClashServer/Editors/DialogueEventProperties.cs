using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using WebClashServer.Classes;

namespace WebClashServer.Editors
{
    public partial class DialogueEventProperties : Form
    {
        public DialogueItem current;

        public DialogueEventProperties(DialogueItem di)
        {
            InitializeComponent();

            current = di;

            switch (di.eventType)
            {
                case "GiveItem":
                    giveItemPanel.Visible = true;

                    LoadItemOptions();
                    break;
                case "LoadMap":
                    loadMapPanel.Visible = true;

                    LoadMapOptions();
                    break;
            }

            repeatable.Checked = current.repeatable;
            nextIndex.Value = current.options[0].next;
        }

        private void DialogueEventProperties_Load(object sender, EventArgs e)
        {
            //...
        }

        private void repeatable_CheckedChanged(object sender, EventArgs e)
        {
            current.repeatable = repeatable.Checked;
        }

        private void nextIndex_ValueChanged(object sender, EventArgs e)
        {
            current.options[0].next = (int)nextIndex.Value;
        }

        //Load map event

        private void LoadMapOptions()
        {
            LoadMapsList();

            mapList.SelectedItem = current.map;

            positionX.Value = current.positionX;
            positionY.Value = current.positionY;
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

        private void mapList_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.map = mapList.SelectedItem.ToString();
        }

        private void positionX_ValueChanged(object sender, EventArgs e)
        {
            current.positionX = (int)positionX.Value;
        }

        private void positionY_ValueChanged(object sender, EventArgs e)
        {
            current.positionY = (int)positionY.Value;
        }

        //Give item event

        private void LoadItemOptions()
        {
            LoadItemList();

            itemList.SelectedItem = current.item;
            itemAmount.Value = current.amount;
        }

        private void LoadItemList()
        {
            itemList.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] items = Directory.GetFiles(Program.main.location + "/items", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                for (int i = 0; i < items.Length; i++)
                {
                    string it = items[i];

                    itemList.Items.Add(it.Substring(it.LastIndexOf('\\') + 1, it.LastIndexOf('.') - it.LastIndexOf('\\') - 1));
                }
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }
        }

        private void itemList_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.item = itemList.SelectedItem.ToString();
        }

        private void itemAmount_ValueChanged(object sender, EventArgs e)
        {
            current.amount = (int)itemAmount.Value;
        }
    }
}
