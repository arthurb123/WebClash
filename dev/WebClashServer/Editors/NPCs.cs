using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using WebClashServer.Classes;

namespace WebClashServer.Editors
{
    public partial class NPCs : Form
    {
        private NPC current;

        private bool dataHasChanged = false;

        public NPCs()
        {
            InitializeComponent();
        }

        private void NPCs_Load(object sender, EventArgs e)
        {
            ReloadCharacters();
            ReloadNPCs();

            if (npcSelect.Items.Count > 0)
                npcSelect.SelectedItem = npcSelect.Items[0];
            else
                npcSelect.SelectedItem = string.Empty;
        }

        private void ReloadNPCs()
        {
            npcSelect.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] npcs = Directory.GetFiles(Program.main.serverLocation + "/npcs", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                foreach (string n in npcs)
                    npcSelect.Items.Add(n.Substring(n.LastIndexOf('\\') + 1, n.LastIndexOf('.') - n.LastIndexOf('\\') - 1));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash - Error");
            }
        }

        private void ReloadCharacters()
        {
            charSelect.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] characters = Directory.GetFiles(Program.main.serverLocation + "/characters", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                foreach (string c in characters)
                    charSelect.Items.Add(c.Substring(c.LastIndexOf('\\') + 1, c.LastIndexOf('.') - c.LastIndexOf('\\') - 1));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash - Error");
            }
        }

        private void LoadNPC(string npcName)
        {
            if (npcName == string.Empty)
                current = new NPC();
            else
                current = new NPC(Program.main.serverLocation + "/npcs/" + npcName + ".json");

            name.Text = current.name;
            showNameplate.Checked = current.showNameplate;

            switch (current.movement)
            {
                case "free":
                    movementFree.Checked = true;
                    break;
                case "static":
                    movementStatic.Checked = true;
                    break;
            }

            range.Value = current.range;
            facing.SelectedIndex = current.facing;
            collidesWithinMap.Checked = current.collidesWithinMap;

            switch (current.type)
            {
                case "friendly":
                    typeFriendly.Checked = true;
                    break;
                case "hostile":
                    typeHostile.Checked = true;
                    break;
            }

            aggressive.Checked = current.aggressive;
            attackRange.Value = current.attackRange;
            attackRange.Enabled = current.aggressive;

            if (current.stats == null)
                current.stats = new Stats();

            level.Value = current.stats.level;

            exp.Value = current.stats.exp;

            power.Value = current.stats.power;
            agility.Value = current.stats.agility;
            intelligence.Value = current.stats.intelligence;
            wisdom.Value = current.stats.wisdom;
            toughness.Value = current.stats.toughness;
            vitality.Value = current.stats.vitality;

            if (current.health != null)
                health.Value = current.health.max;

            checkTypeEnabled();

            charSelect.SelectedItem = current.character;
        }

        private void npcSelect_SelectedIndexChanged(object sender, EventArgs e)
        {
            LoadNPC(npcSelect.SelectedItem.ToString());
        }

        private void charSelect_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.character = charSelect.SelectedItem.ToString();
        }

        private void save_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (name.Text.Length == 0)
            {
                MessageBox.Show("This NPC cannot be saved as it has an invalid name.", "WebClash - Error");

                return;
            }

            File.WriteAllText(Program.main.serverLocation + "/npcs/" + name.Text + ".json", JsonConvert.SerializeObject(current, Formatting.Indented));

            MessageBox.Show("NPC has been saved!", "WebClash - Message");

            ReloadNPCs();

            npcSelect.SelectedItem = name.Text;

            dataHasChanged = true;
        }

        private void add_Click(object sender, EventArgs e)
        {
            npcSelect.Items.Add(string.Empty);

            npcSelect.SelectedItem = string.Empty;
        }

        private void delete_Click(object sender, EventArgs e)
        {
            if (!File.Exists(Program.main.serverLocation + "/npcs/" + name.Text + ".json"))
            {
                MessageBox.Show("This character cannot be deleted as it does not exist yet.", "WebClash - Error");

                return;
            }

            File.Delete(Program.main.serverLocation + "/npcs/" + name.Text + ".json");

            ReloadNPCs();

            if (npcSelect.Items.Count > 0)
                npcSelect.SelectedItem = npcSelect.Items[0];
        }

        private void checkTypeEnabled()
        {
            if (current.type != "friendly")
            {
                dialogueButton.Enabled = false;
                aggressive.Enabled = true;
            }
            else
            {
                dialogueButton.Enabled = true;
                aggressive.Enabled = false;
            }
        }

        private void typeFriendly_CheckedChanged(object sender, EventArgs e)
        {
            if (typeFriendly.Checked)
                current.type = "friendly";

            checkTypeEnabled();
        }

        private void typeHostile_CheckedChanged(object sender, EventArgs e)
        {
            if (typeHostile.Checked)
                current.type = "hostile";

            checkTypeEnabled();
        }

        private void aggressive_CheckedChanged(object sender, EventArgs e)
        {
            attackRange.Enabled = aggressive.Checked;

            current.aggressive = aggressive.Checked;
        }

        private void attackRange_ValueChanged(object sender, EventArgs e)
        {
            current.attackRange = (int)attackRange.Value;
        }

        private void name_TextChanged(object sender, EventArgs e)
        {
            current.name = name.Text;
        }
        
        private void showNameplate_CheckedChanged(object sender, EventArgs e)
        {
            current.showNameplate = showNameplate.Checked;
        }

        private void movementFree_CheckedChanged(object sender, EventArgs e)
        {
            if (movementFree.Checked)
            {
                current.movement = "free";

                range.Enabled = true;
                facing.Enabled = false;
            }
        }

        private void movementStatic_CheckedChanged(object sender, EventArgs e)
        {
            if (movementStatic.Checked)
            {
                current.movement = "static";

                range.Enabled = false;
                facing.Enabled = true;
            }
        }

        private void range_ValueChanged(object sender, EventArgs e)
        {
            current.range = (int)range.Value;
        }

        private void collidesWithinMap_CheckedChanged(object sender, EventArgs e)
        {
            current.collidesWithinMap = collidesWithinMap.Checked;
        }

        private void facing_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.facing = facing.SelectedIndex;
        }

        private void level_ValueChanged(object sender, EventArgs e)
        {
            current.stats.level = (int)level.Value;
        }

        private void power_ValueChanged(object sender, EventArgs e)
        {
            current.stats.power = (int)power.Value;
        }

        private void agility_ValueChanged(object sender, EventArgs e)
        {
            current.stats.agility = (int)agility.Value;
        }

        private void toughness_ValueChanged(object sender, EventArgs e)
        {
            current.stats.toughness = (int)toughness.Value;
        }

        private void intelligence_ValueChanged(object sender, EventArgs e)
        {
            current.stats.intelligence = (int)intelligence.Value;
        }

        private void wisdom_ValueChanged(object sender, EventArgs e)
        {
            current.stats.wisdom = (int)wisdom.Value;
        }

        private void vitality_ValueChanged(object sender, EventArgs e)
        {
            current.stats.vitality = (int)vitality.Value;
        }

        private void health_ValueChanged(object sender, EventArgs e)
        {
            current.health.cur = current.health.max = (int)health.Value;
        }

        private void exp_ValueChanged(object sender, EventArgs e)
        {
            current.stats.exp = (int)exp.Value;
        }

        private void editActions_Click(object sender, EventArgs e)
        {
            ActionSelection actionSelection = new ActionSelection("Set actions for '" + current.name + "'", current.actions);

            actionSelection.FormClosed += (object s, FormClosedEventArgs fcea) => {
                current.actions = actionSelection.GetSelection();
            };

            actionSelection.ShowDialog();
        }

        private void editLootTable_Click(object sender, EventArgs e)
        {
            ItemSelection itemSelection = new ItemSelection("Set items for '" + current.name + "'", current.items);

            itemSelection.FormClosed += (object s, FormClosedEventArgs fcea) => {
                current.items = itemSelection.GetSelection();
            };

            itemSelection.ShowDialog();
        }

        private void dialogButton_Click(object sender, EventArgs e)
        {
            Dialogue npcDialogue = new Dialogue(
                current.dialog.ToList(), 
                current.dialogElements.ToList(), 
                DialogueType.NPC
            );

            npcDialogue.Text = "Edit dialogue for '" + current.name + "'";

            npcDialogue.FormClosed += (object s, FormClosedEventArgs fcea) => {
                current.dialog = npcDialogue.dialogSystem.items.ToArray();
                current.dialogElements = npcDialogue.elements.ToArray();
            };

            npcDialogue.ShowDialog();
        }

        private void equipmentButton_Click(object sender, EventArgs e)
        {
            NPCEquipment npcEquipment = new NPCEquipment(
                "Edit equipment for '" + current.name + "'", 
                current.character, 
                current.equipment
            );

            npcEquipment.FormClosed += (object s, FormClosedEventArgs fcea) => {
                current.equipment = npcEquipment.GetSelection();
            };

            npcEquipment.ShowDialog();
        }

        public bool GetChanged()
        {
            return dataHasChanged;
        }
    }

    public class NPC
    {
        public NPC() { }

        public NPC(string source)
        {
            try
            {
                NPC temp = JsonConvert.DeserializeObject<NPC>(File.ReadAllText(source));

                name = temp.name;

                showNameplate = temp.showNameplate;

                movement = temp.movement;

                health = temp.health;

                type = temp.type;

                character = temp.character;

                aggressive = temp.aggressive;

                attackRange = temp.attackRange;

                stats = temp.stats;

                range = temp.range;

                facing = temp.facing;

                collidesWithinMap = temp.collidesWithinMap;

                actions = temp.actions;

                items = temp.items;

                equipment = temp.equipment;

                dialog = temp.dialog;

                dialogElements = temp.dialogElements;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash - Error");
            }
        }

        public string name = "New NPC";
        public bool showNameplate = true;

        public string movement = "free";
        public int range = 10;
        public int facing = 0;
        public bool collidesWithinMap = true;

        public string type = "friendly";
        public bool aggressive = false;
        public int attackRange = 1;

        public string character = "player";

        public Stats stats = new Stats();

        public Health health = new Health();

        public PossibleAction[] actions = new PossibleAction[0];

        public PossibleItem[] items = new PossibleItem[0];

        public Equipment[] equipment = new Equipment[0];

        public DialogueItem[] dialog = new DialogueItem[0];

        public CanvasElement[] dialogElements = new CanvasElement[0];
    }

    public class Stats
    {
        public int level = 1;

        public int exp = 0;

        public int power = 0,
                   toughness = 0,
                   agility = 0,
                   wisdom = 0,
                   intelligence = 0,
                   vitality = 0;
    }

    public class Health
    {
        public int cur = 100;
        public int max = 100;
    }
}
