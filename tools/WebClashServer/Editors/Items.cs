using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace WebClashServer
{
    public partial class Items : Form
    {
        private Item current;

        public Items()
        {
            InitializeComponent();
        }

        private void Items_Load(object sender, EventArgs e)
        {
            ReloadItems();
            ReloadActions();

            SetRarities();
            SetEquippables();

            if (itemList.Items.Count > 0)
                itemList.SelectedItem = itemList.Items[0];
        }

        private void ReloadItems()
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

                    itemList.Items.Add(i + ". " + it.Substring(it.LastIndexOf('\\') + 1, it.LastIndexOf('.') - it.LastIndexOf('\\') - 1));
                }
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }
        }

        private void ReloadActions()
        {
            equippableAction.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] actions = Directory.GetFiles(Program.main.location + "/actions", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                foreach (string c in actions)
                    equippableAction.Items.Add(c.Substring(c.LastIndexOf('\\') + 1, c.LastIndexOf('.') - c.LastIndexOf('\\') - 1));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }
        }

        private void LoadItem(string itemName)
        {
            if (itemName == string.Empty)
                current = new Item();
            else
                current = new Item(Program.main.location + "/items/" + itemName + ".json");

            name.Text = itemName;
            src.Text = current.source;

            rarity.SelectedItem = FirstCharToUpper(current.rarity);
            value.Value = current.value;

            if (current.equippable != string.Empty)
                equippable.SelectedItem = FirstCharToUpper(current.equippable);
            else
                equippable.SelectedItem = "None";

            equippableSource.Text = current.equippableSource;

            if (current.equippableAction != string.Empty)
                equippableAction.SelectedItem = FirstCharToUpper(current.equippableAction);
            else
                equippableAction.SelectedItem = null;

            AttemptSetIcon();
        }

        private void itemList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (itemList.SelectedItem == null)
                return;

            string t = itemList.SelectedItem.ToString();

            LoadItem(t.Substring(t.IndexOf(" ")+1, t.Length - t.IndexOf(" ")-1));
        }

        private void newLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            string i = itemList.Items.Count + ". " + string.Empty;

            itemList.Items.Add(i);
            itemList.SelectedItem = i;

            LoadItem(string.Empty);
        }

        private void saveLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == null || name.Text.Length == 0)
            {
                MessageBox.Show("Could not save item as it is invalid.", "WebClash Server - Error");
                return;
            }

            File.WriteAllText(Program.main.location + "/items/" + name.Text + ".json", JsonConvert.SerializeObject(current));

            MessageBox.Show("Item has been saved!", "WebClash Server - Message");

            ReloadItems();

            itemList.SelectedItem = name.Text;
        }

        private void SetRarities()
        {
            foreach(Rarity rty in Enum.GetValues(typeof(Rarity)))
            {
                rarity.Items.Add(rty.ToString());
            }
        }

        private void SetEquippables()
        {
            foreach (Equippable eqp in Enum.GetValues(typeof(Equippable)))
            {
                equippable.Items.Add(eqp.ToString());
            }
        }

        public string FirstCharToUpper(string input)
        {
            if (!String.IsNullOrEmpty(input))
                return input.First().ToString().ToUpper() + input.Substring(1);

            return input;
        }

        private void src_TextChanged(object sender, EventArgs e)
        {
            AttemptSetIcon();
        }

        private void AttemptSetIcon()
        {
            string location = Program.main.location + "/../client/" + src.Text;

            if (!File.Exists(location))
            {
                icon.BackgroundImage = null;
                current.source = string.Empty;
                return;
            }

            icon.BackgroundImage = Image.FromFile(location);
            current.source = src.Text;
        }

        private void rarity_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.rarity = rarity.SelectedItem.ToString().ToLower();
        }

        private void value_ValueChanged(object sender, EventArgs e)
        {
            current.value = (int)value.Value;
        }

        private void equippable_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (equippable.SelectedIndex == 0)
            {
                current.equippable = string.Empty;

                return;
            }

            current.equippable = equippable.SelectedItem.ToString().ToLower();
        }

        private void equippableSource_TextChanged(object sender, EventArgs e)
        {
            current.equippableSource = equippableSource.Text;
        }

        private void equippableAction_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (equippableAction.SelectedItem == null)
                return;

            current.equippableAction = equippableAction.SelectedItem.ToString();
        }

        public int GetAmount()
        {
            return itemList.Items.Count;
        }
    }

    public class Item
    {
        public Item()
        {
            //...
        }

        public Item(string src)
        {
            try
            {
                Item temp = JsonConvert.DeserializeObject<Item>(File.ReadAllText(src));

                source = temp.source;
                rarity = temp.rarity;

                value = temp.value;

                equippable = temp.equippable;
                equippableSource = temp.equippableSource;
                equippableAction = temp.equippableAction;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash Server - Error");
            }
        }

        public string source = string.Empty;
        public string rarity = "common";

        public int value = 0;

        public string equippable = "none";
        public string equippableSource = string.Empty;
        public string equippableAction = string.Empty;
    }

    public enum Equippable
    {
        None = 0,
        Head,
        Torso,
        Hands,
        Legs,
        Feet, 
        Main,
        Offhand
    }

    public enum Rarity
    {
        Crude = 0,
        Common,
        Uncommon,
        Rare,
        Exotic,
        Legendary
    }
}
