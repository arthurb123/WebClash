using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using WebClashServer.Classes;
using WebClashServer.Editors;

namespace WebClashServer
{
    public partial class Items : Form
    {
        private Item current;
        private string oldName;

        private bool dataHasChanged = false;

        public Items()
        {
            InitializeComponent();
        }

        private void Items_Load(object sender, EventArgs e)
        {
            ReloadItems();
            ReloadActions();

            SetTypes();
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

                string[] items = 
                    Directory.GetFiles(Program.main.serverLocation + "/items", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                for (int i = 0; i < items.Length; i++)
                {
                    string it = items[i].Replace('\\', '/');

                    itemList.Items.Add((i+1) + ". " + it.Substring(it.LastIndexOf('/') + 1, it.LastIndexOf('.') - it.LastIndexOf('/') - 1));
                }
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load items: ", exc);
            }
        }

        private void ReloadActions()
        {
            equippableAction.Items.Clear();
            consumableAction.Items.Clear();

            consumableAction.Items.Add("None");

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] actions = Directory.GetFiles(Program.main.serverLocation + "/actions", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                foreach (string c in actions)
                {
                    string a = c.Replace('\\', '/');
                    a = a.Substring(a.LastIndexOf('/') + 1, a.LastIndexOf('.') - a.LastIndexOf('/') - 1);

                    equippableAction.Items.Add(a);
                    consumableAction.Items.Add(a);
                }
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load actions: ", exc);
            }
        }

        private void LoadItem(string itemName)
        {
            if (itemName == string.Empty)
                current = new Item();
            else
                current = new Item(Program.main.serverLocation + "/items/" + itemName + ".json");

            name.Text = itemName;
            oldName = name.Text;

            src.Text = current.source;

            rarity.SelectedItem = FirstCharToUpper(current.rarity);
            type.SelectedItem = FirstCharToUpper(current.type);

            value.Value = current.value;
            minLevel.Value = current.minLevel;

            description.Text = current.description;

            //Consumable settings

            heals.Value = current.heal;
            mana.Value = current.mana;
            currency.Value = current.currency;

            if (current.consumableAction != string.Empty)
                consumableAction.SelectedItem = FirstCharToUpper(current.consumableAction);
            else
                consumableAction.SelectedItem = "None";

            actionUses.Value = current.consumableActionUses;

            //Equipment settings

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

            //Dialog settings

            dialogConsumable.Checked = current.consumableDialog;

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
            string i = (itemList.Items.Count+1) + ". " + string.Empty;

            itemList.Items.Add(i);
            itemList.SelectedItem = i;

            LoadItem(string.Empty);
        }

        private void saveLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == null || name.Text.Length == 0)
            {
                Logger.Error("Could not save item as it is invalid.");
                return;
            }

            if (current.consumableAction == "None")
                current.consumableAction = string.Empty;

            if (current.equippable == "None")
                current.equippable = string.Empty;

            if (oldName != name.Text)
                File.Delete(Program.main.serverLocation + "/items/" + oldName + ".json");

            File.WriteAllText(Program.main.serverLocation + "/items/" + name.Text + ".json", JsonConvert.SerializeObject(current, Formatting.Indented));

            Logger.Message("Item has been saved!");

            ReloadItems();

            itemList.SelectedItem = name.Text;

            dataHasChanged = true;
        }

        private void SetTypes()
        {
            foreach (ItemType it in Enum.GetValues(typeof(ItemType)))
                type.Items.Add(it.ToString());
        }

        private void SetRarities()
        {
            foreach(Rarity rty in Enum.GetValues(typeof(Rarity)))
                rarity.Items.Add(rty.ToString());
        }

        private void SetEquippables()
        {
            foreach (Equippable eqp in Enum.GetValues(typeof(Equippable)))
                equippable.Items.Add(eqp.ToString());
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
            string serverLocation = Program.main.clientLocation + src.Text;

            if (!File.Exists(serverLocation))
            {
                icon.BackgroundImage = null;
                current.source = string.Empty;
                return;
            }

            icon.BackgroundImage = Image.FromFile(serverLocation);
            current.source = src.Text;
        }

        private void type_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.type = type.SelectedItem.ToString().ToLower();

            if (type.SelectedItem.ToString() == ItemType.Consumable.ToString())
            {
                consumablePanel.Visible = true;
                equipmentPanel.Visible = false;
                dialogPanel.Visible = false;
            }
            else if (type.SelectedItem.ToString() == ItemType.Equipment.ToString())
            {
                consumablePanel.Visible = false;
                equipmentPanel.Visible = true;
                dialogPanel.Visible = false;
            }
            else if (type.SelectedItem.ToString() == ItemType.Dialog.ToString())
            {
                consumablePanel.Visible = false;
                equipmentPanel.Visible = false;
                dialogPanel.Visible = true;
            }
        }

        private void rarity_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.rarity = rarity.SelectedItem.ToString().ToLower();
        }

        private void value_ValueChanged(object sender, EventArgs e)
        {
            current.value = (int)value.Value;
        }
        
        private void minLevel_ValueChanged(object sender, EventArgs e)
        {
            current.minLevel = (int)minLevel.Value;
        }

        private void itemSounds_Click(object sender, EventArgs e)
        {
            SoundSelection soundSelection = new SoundSelection("Set sounds for item '" + name.Text + "'", current.sounds);

            soundSelection.FormClosed += (object s, FormClosedEventArgs fcea) => {
                current.sounds = soundSelection.GetSelection();
            };

            soundSelection.ShowDialog();
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
                Logger.Error("Could not remove item as it is invalid.");
                return;
            }

            File.Delete(Program.main.serverLocation + "/items/" + oldName + ".json");

            ReloadItems();

            if (itemList.Items.Count > 0)
                itemList.SelectedItem = itemList.Items[0];
            else
                newLink_LinkClicked(sender, e);

            dataHasChanged = true;
        }

        //Consumable settings

        private void heals_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.heal = (int)heals.Value;
        }

        private void currency_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.currency = (int)currency.Value;
        }

        private void mana_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.mana = (int)mana.Value;
        }

        private void consumableAction_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            if (consumableAction.SelectedItem == null)
                return;

            current.consumableAction = consumableAction.SelectedItem.ToString();
        }

        private void actionUses_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.consumableActionUses = (int)actionUses.Value;
        }

        //Equipment settings

        private void equippable_SelectedIndexChanged(object sender, EventArgs e)
        {
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

        //Dialog settings

        private void dialogButton_Click(object sender, EventArgs e)
        {
            Dialogue dialogue = new Dialogue(current.dialog.ToList(), current.dialogElements.ToList(), DialogueType.Item);

            dialogue.Text = "Edit dialogue for '" + name.Text + "'";

            dialogue.FormClosed += (object s, FormClosedEventArgs fcea) => {
                current.dialog = dialogue.dialogSystem.items.ToArray();
                current.dialogElements = dialogue.elements.ToArray();
            };

            dialogue.ShowDialog();
        }

        private void dialogConsumable_CheckedChanged(object sender, EventArgs e)
        {
            current.consumableDialog = dialogConsumable.Checked;
        }

        public bool GetChanged()
        {
            return dataHasChanged;
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
                type = temp.type;
                rarity = temp.rarity;

                description = temp.description;

                value = temp.value;
                minLevel = temp.minLevel;

                sounds = temp.sounds;

                //Consumable settings

                heal = temp.heal;
                mana = temp.mana;
                currency = temp.currency;

                consumableAction = temp.consumableAction;
                consumableActionUses = temp.consumableActionUses;

                //Equipment settings

                equippable = temp.equippable;
                equippableSource = temp.equippableSource;
                equippableAction = temp.equippableAction;

                if (temp.stats != null)
                    stats = temp.stats;

                //Dialog settings

                dialog = temp.dialog;
                dialogElements = temp.dialogElements;

                consumableDialog = temp.consumableDialog;
            }
            catch (Exception exc)
            {
                Logger.Error("Could not construct item instance: ", exc);
            }
        }

        public string source = string.Empty;
        public string type = "consumable";
        public string rarity = "common";

        public int value = 0;
        public int minLevel = 0;

        public PossibleSound[] sounds = new PossibleSound[0];

        public string description = "";

        //Consumable settings

        public int heal = 0;
        public int mana = 0;
        public int currency = 0;

        public string consumableAction = string.Empty;
        public int consumableActionUses = 1;

        //Equipment settings

        public string equippable = "none";
        public string equippableSource = string.Empty;
        public string equippableAction = string.Empty;

        public Stats stats = new Stats();

        //Dialog settings

        public DialogueItem[] dialog = new DialogueItem[0];
        public CanvasElement[] dialogElements = new CanvasElement[0];

        public bool consumableDialog = false;
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

    public enum ItemType
    {
        Consumable = 0,
        Equipment,
        Dialog
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

    public enum Equippable
    {
        Head = 0,
        Torso,
        Hands,
        Legs,
        Feet, 
        Main,
        Offhand
    }
}
