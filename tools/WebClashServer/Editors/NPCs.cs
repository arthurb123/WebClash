using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace WebClashServer.Editors
{
    public partial class NPCs : Form
    {
        NPC current;

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

                string[] npcs = Directory.GetFiles(Program.main.location + "/npcs", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                foreach (string n in npcs)
                    npcSelect.Items.Add(n.Substring(n.LastIndexOf('\\') + 1, n.LastIndexOf('.') - n.LastIndexOf('\\') - 1));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
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

                string[] characters = Directory.GetFiles(Program.main.location + "/characters", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                foreach (string c in characters)
                    charSelect.Items.Add(c.Substring(c.LastIndexOf('\\') + 1, c.LastIndexOf('.') - c.LastIndexOf('\\') - 1));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }
        }

        private void LoadNPC(string npcName)
        {
            if (npcName == string.Empty)
                current = new NPC();
            else
                current = new NPC(Program.main.location + "/npcs/" + npcName + ".json");

            name.Text = current.name;

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

            switch (current.type)
            {
                case "friendly":
                    typeFriendly.Checked = true;
                    break;
                case "hostile":
                    typeHostile.Checked = true;
                    break;
            }

            if (current.stats != null)
            {
                level.Value = current.stats.level;

                power.Value = current.stats.power;
                agility.Value = current.stats.agility;
                intelligence.Value = current.stats.intelligence;
                wisdom.Value = current.stats.wisdom;
                toughness.Value = current.stats.toughness;
                vitality.Value = current.stats.vitality;
            }

            if (current.health != null)
                health.Value = current.health.max;

            checkStatisticsEnabled();

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
            if (current.type == "friendly")
                current.stats = null;

            if (name.Text.Length == 0)
            {
                MessageBox.Show("This NPC cannot be saved as it has an invalid name.", "WebClash Server - Error");

                return;
            }

            File.WriteAllText(Program.main.location + "/npcs/" + name.Text + ".json", JsonConvert.SerializeObject(current));

            MessageBox.Show("NPC has been saved!", "WebClash Server - Message");

            ReloadNPCs();

            npcSelect.SelectedItem = name.Text;
        }

        private void add_Click(object sender, EventArgs e)
        {
            npcSelect.Items.Add(string.Empty);

            npcSelect.SelectedItem = string.Empty;
        }

        private void delete_Click(object sender, EventArgs e)
        {
            if (!File.Exists(Program.main.location + "/npcs/" + name.Text + ".json"))
            {
                MessageBox.Show("This character cannot be deleted as it does not exist yet.", "WebClash Server - Error");

                return;
            }

            File.Delete(Program.main.location + "/npcs/" + name.Text + ".json");

            ReloadNPCs();

            if (npcSelect.Items.Count > 0)
                npcSelect.SelectedItem = npcSelect.Items[0];
        }

        private void checkStatisticsEnabled()
        {
            if (current.type != "friendly")
            {
                statistics.Enabled = true;

                dialogButton.Enabled = false;
            }
            else
            {
                statistics.Enabled = false;

                dialogButton.Enabled = true;
            }
        }

        public int GetAmount()
        {
            return npcSelect.Items.Count; 
        }

        private void typeFriendly_CheckedChanged(object sender, EventArgs e)
        {
            if (typeFriendly.Checked)
                current.type = "friendly";

            checkStatisticsEnabled();
        }

        private void typeHostile_CheckedChanged(object sender, EventArgs e)
        {
            if (typeHostile.Checked)
                current.type = "hostile";

            checkStatisticsEnabled();
        }

        private void name_TextChanged(object sender, EventArgs e)
        {
            current.name = name.Text;
        }

        private void movementFree_CheckedChanged(object sender, EventArgs e)
        {
            if (movementFree.Checked)
            {
                current.movement = "free";

                range.Enabled = true;
            }
        }

        private void movementStatic_CheckedChanged(object sender, EventArgs e)
        {
            if (movementStatic.Checked)
            {
                current.movement = "static";

                range.Enabled = false;
            }
        }

        private void range_ValueChanged(object sender, EventArgs e)
        {
            current.range = (int)range.Value;
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
    }

    public class NPC
    {
        public NPC()
        {

        }

        public NPC(string source)
        {
            try
            {
                NPC temp = JsonConvert.DeserializeObject<NPC>(File.ReadAllText(source));

                name = temp.name;

                movement = temp.movement;

                type = temp.type;

                character = temp.character;

                stats = temp.stats;

                range = temp.range;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash Server - Error");
            }
        }

        public string name = "New NPC";

        public string movement = "free";
        public int range = 10;

        public string type = "friendly";

        public string character = "player";

        public Stats stats = new Stats();

        public Health health = new Health();
    }

    public class Stats
    {
        public int level = 1;

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
