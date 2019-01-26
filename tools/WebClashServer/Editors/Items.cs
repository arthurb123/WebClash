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
        private string oldName;

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
            oldName = name.Text;

            src.Text = current.source;

            rarity.SelectedItem = FirstCharToUpper(current.rarity);
            value.Value = current.value;

            description.Text = current.description;

            if (current.equippable != string.Empty)
                equippable.SelectedItem = FirstCharToUpper(current.equippable);
            else
                equippable.SelectedItem = "None";

            equippableSource.Text = current.equippableSource;

            if (current.equippableAction != string.Empty)
                equippableAction.SelectedItem = FirstCharToUpper(current.equippableAction);
            else
                equippableAction.SelectedItem = null;

            if (current.stats != null)
            {
                power.Value = current.stats.power;
                toughness.Value = current.stats.toughness;
                vitality.Value = current.stats.vitality;
                intelligence.Value = current.stats.intelligence;
                wisdom.Value = current.stats.wisdom;
                agility.Value = current.stats.agility;
            }

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

            if (oldName != name.Text)
                File.Delete(Program.main.location + "/items/" + oldName + ".json");

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

            if ((string)equippable.SelectedItem == nameof(Equippable.Main) ||
                (string)equippable.SelectedItem == nameof(Equippable.Offhand))
            {
                equippableAction.Enabled = true;
            }
            else
                equippableAction.Enabled = false;

            current.equippable = equippable.SelectedItem.ToString().ToLower();
        }

        private void equippableSource_TextChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.equippableSource = equippableSource.Text;
        }

        private void equippableAction_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            if (equippableAction.SelectedItem == null)
                return;

            current.equippableAction = equippableAction.SelectedItem.ToString();
        }
        
        private void description_TextChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.description = description.Text;
        }
        
        private void delete_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == null)
            {
                MessageBox.Show("Could not remove item as it is invalid.", "WebClash Server - Error");
                return;
            }

            File.Delete(Program.main.location + "/items/" + oldName + ".json");

            ReloadItems();

            if (itemList.Items.Count > 0)
                itemList.SelectedItem = itemList.Items[0];
            else
                newLink_LinkClicked(sender, e);
        }

        private void power_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.stats.power = (int)power.Value;
        }

        private void agility_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.stats.agility = (int)agility.Value;
        }

        private void toughness_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.stats.toughness = (int)toughness.Value;
        }

        private void intelligence_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.stats.intelligence = (int)intelligence.Value;
        }

        private void wisdom_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.stats.wisdom = (int)wisdom.Value;
        }

        private void vitality_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.stats.vitality = (int)vitality.Value;
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

                description = temp.description;

                value = temp.value;

                equippable = temp.equippable;
                equippableSource = temp.equippableSource;
                equippableAction = temp.equippableAction;

                if (temp.stats != null)
                    stats = temp.stats;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash Server - Error");
            }
        }

        public string source = string.Empty;
        public string rarity = "common";

        public int value = 0;

        public string description = "";

        public string equippable = "none";
        public string equippableSource = string.Empty;
        public string equippableAction = string.Empty;

        public Stats stats = new Stats();
    }

    public class Stats
    {
        public int power = 0;
        public int toughness = 0;
        public int vitality = 0;
        public int intelligence = 0;
        public int wisdom = 0;
        public int agility = 0;
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
