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
        private NPCProfile currentProfile;

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

        private void ReloadNPCProfiles()
        {
            profileSelect.Items.Clear();

            for (int p = 0; p < current.profiles.Length; p++)
                if (current.profiles[p] != null)
                    profileSelect.Items.Add(p);
        }

        private void LoadNPC(string npcName)
        {
            try
            {
                string loc = Program.main.serverLocation + "/npcs/" + npcName + ".json";

                if (npcName == string.Empty)
                    current = new NPC();
                else
                    current = new NPC(loc);

                //Check if the NPC makes use of the
                //profile system or not, if not ask
                //upgrade the NPC

                if (current.profiles.Length == 0)
                {
                    string text = File.ReadAllText(loc);
                    List<string> lines = text.Split('\n').ToList();

                    lines.Insert(3, "\"profiles\": [{\n");
                    lines.Insert(lines.Count - 1, "}]\n");

                    text = String.Join(string.Empty, lines);
                    File.WriteAllText(loc, text);

                    //Reload the NPC

                    LoadNPC(npcName);
                    return;
                }

                //Else open the first profile
                //by default, and set the name

                else
                {
                    name.Text = npcName;

                    ReloadNPCProfiles();

                    profileSelect.SelectedItem = FindFirstNPCProfile();
                }
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash - Error");
            }
        }

        private int FindFirstNPCProfile()
        {
            for (int p = 0; p < current.profiles.Length; p++)
                if (current.profiles[p] != null)
                    return p;

            //No profile was found, thus create one
            //and use that

            addProfile_Click(null, new EventArgs());

            MessageBox.Show(
                "A new profile was created for the NPC '" + current.name + "', as no other profiles were found.", 
                "WebClash - Message"
            );

            return FindFirstNPCProfile();
        }

        private void LoadNPCProfile(int profile)
        {
            //Check if the profile is valid

            if (profile >= current.profiles.Length ||
                current.profiles[profile] == null)
            {
                MessageBox.Show(
                    "The profile #" + profile + " is invalid for the NPC '" + current.name + "'!", 
                    "WebClash - Error"
                );

                return;
            }

            //Load the profile

            currentProfile = current.profiles[profile];

            //Set the NPC#Profile string

            npcProfileName.Text = "(Tiled property: " + current.name + "#" + profile + ")";

            //Set values

            showNameplate.Checked = currentProfile.showNameplate;

            switch (currentProfile.movement)
            {
                case "free":
                    movementFree.Checked = true;
                    break;
                case "static":
                    movementStatic.Checked = true;
                    break;
            }

            range.Value = currentProfile.range;
            facing.SelectedIndex = currentProfile.facing;
            collidesWithinMap.Checked = currentProfile.collidesWithinMap;

            switch (currentProfile.type)
            {
                case "friendly":
                    typeFriendly.Checked = true;
                    break;
                case "hostile":
                    typeHostile.Checked = true;
                    break;
            }

            aggressive.Checked = currentProfile.aggressive;
            attackRange.Value = currentProfile.attackRange;
            attackRange.Enabled = currentProfile.aggressive;

            if (currentProfile.stats == null)
                currentProfile.stats = new Stats();

            level.Value = currentProfile.stats.level;

            exp.Value = currentProfile.stats.exp;

            power.Value = currentProfile.stats.power;
            agility.Value = currentProfile.stats.agility;
            intelligence.Value = currentProfile.stats.intelligence;
            wisdom.Value = currentProfile.stats.wisdom;
            toughness.Value = currentProfile.stats.toughness;
            vitality.Value = currentProfile.stats.vitality;

            if (currentProfile.health != null)
                health.Value = currentProfile.health.max;

            checkTypeEnabled();

            charSelect.SelectedItem = currentProfile.character;
        }

        private void npcSelect_SelectedIndexChanged(object sender, EventArgs e)
        {
            LoadNPC(npcSelect.SelectedItem.ToString());
        }

        private void charSelect_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            currentProfile.character = charSelect.SelectedItem.ToString();
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
            //Create empty NPC

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

        private void addProfile_Click(object sender, EventArgs e)
        {
            //Convert the current profile array to a list

            List<NPCProfile> profiles = current.profiles.ToList();

            //Create a profile with some default values

            NPCProfile profile = new NPCProfile()
            {
                character = currentProfile.character
            };

            //Find the first empty spot, or append a new one
            //if this is not available

            bool added = false;
            int nextProfile = 0;
            for (int p = 0; p < profiles.Count; p++)
            {
                if (profiles[p] == null)
                {
                    added = true;

                    profiles[p] = profile;
                    nextProfile = p;

                    break;
                }
            }

            if (!added)
            {
                profiles.Add(profile);

                nextProfile = profiles.Count - 1;
            }

            //Convert the list back to an array

            current.profiles = profiles.ToArray();

            //Reload the profiles

            ReloadNPCProfiles();

            //Load the new (next) profile

            profileSelect.SelectedItem = nextProfile;
        }

        private void removeProfile_Click(object sender, EventArgs e)
        {
            int profile = (int)profileSelect.SelectedItem;

            //Make sure that atleast one profile is available

            int amount = 0;
            for (int p = 0; p < current.profiles.Length; p++)
                if (current.profiles[p] != null)
                    amount++;

            if (amount <= 1)
            {
                MessageBox.Show(
                    "Profile #" + profile + " could not be deleted, as a NPC should have atleast one profile available at all time.", 
                    "WebClash - Error"
                );

                return;
            }

            //"Remove" the profile at the index

            current.profiles[profile] = null;

            //Reload the profiles

            ReloadNPCProfiles();

            //Open the first found profile

            profileSelect.SelectedItem = FindFirstNPCProfile();
        }

        private void profile_SelectedIndexChanged(object sender, EventArgs e)
        {
            LoadNPCProfile((int)profileSelect.SelectedItem);
        }

        private void checkTypeEnabled()
        {
            if (currentProfile.type != "friendly")
            {
                dialogueButton.Enabled = false;
                aggressive.Enabled = true;
                attackRange.Enabled = true;
            }
            else
            {
                dialogueButton.Enabled = true;
                aggressive.Enabled = false;
                attackRange.Enabled = false;
            }
        }

        private void typeFriendly_CheckedChanged(object sender, EventArgs e)
        {
            if (typeFriendly.Checked)
                currentProfile.type = "friendly";

            checkTypeEnabled();
        }

        private void typeHostile_CheckedChanged(object sender, EventArgs e)
        {
            if (typeHostile.Checked)
                currentProfile.type = "hostile";

            checkTypeEnabled();
        }

        private void aggressive_CheckedChanged(object sender, EventArgs e)
        {
            attackRange.Enabled = aggressive.Checked;

            currentProfile.aggressive = aggressive.Checked;
        }

        private void attackRange_ValueChanged(object sender, EventArgs e)
        {
            currentProfile.attackRange = (int)attackRange.Value;
        }

        private void name_TextChanged(object sender, EventArgs e)
        {
            current.name = name.Text;
        }
        
        private void showNameplate_CheckedChanged(object sender, EventArgs e)
        {
            currentProfile.showNameplate = showNameplate.Checked;
        }

        private void movementFree_CheckedChanged(object sender, EventArgs e)
        {
            if (movementFree.Checked)
            {
                currentProfile.movement = "free";

                range.Enabled = true;
                facing.Enabled = false;
            }
        }

        private void movementStatic_CheckedChanged(object sender, EventArgs e)
        {
            if (movementStatic.Checked)
            {
                currentProfile.movement = "static";

                range.Enabled = false;
                facing.Enabled = true;
            }
        }

        private void range_ValueChanged(object sender, EventArgs e)
        {
            currentProfile.range = (int)range.Value;
        }

        private void collidesWithinMap_CheckedChanged(object sender, EventArgs e)
        {
            currentProfile.collidesWithinMap = collidesWithinMap.Checked;
        }

        private void facing_SelectedIndexChanged(object sender, EventArgs e)
        {
            currentProfile.facing = facing.SelectedIndex;
        }

        private void level_ValueChanged(object sender, EventArgs e)
        {
            currentProfile.stats.level = (int)level.Value;
        }

        private void power_ValueChanged(object sender, EventArgs e)
        {
            currentProfile.stats.power = (int)power.Value;
        }

        private void agility_ValueChanged(object sender, EventArgs e)
        {
            currentProfile.stats.agility = (int)agility.Value;
        }

        private void toughness_ValueChanged(object sender, EventArgs e)
        {
            currentProfile.stats.toughness = (int)toughness.Value;
        }

        private void intelligence_ValueChanged(object sender, EventArgs e)
        {
            currentProfile.stats.intelligence = (int)intelligence.Value;
        }

        private void wisdom_ValueChanged(object sender, EventArgs e)
        {
            currentProfile.stats.wisdom = (int)wisdom.Value;
        }

        private void vitality_ValueChanged(object sender, EventArgs e)
        {
            currentProfile.stats.vitality = (int)vitality.Value;
        }

        private void health_ValueChanged(object sender, EventArgs e)
        {
            currentProfile.health.cur = currentProfile.health.max = (int)health.Value;
        }

        private void exp_ValueChanged(object sender, EventArgs e)
        {
            currentProfile.stats.exp = (int)exp.Value;
        }

        private void editActions_Click(object sender, EventArgs e)
        {
            ActionSelection actionSelection = new ActionSelection("Set actions for '" + current.name + "'", currentProfile.actions);

            actionSelection.FormClosed += (object s, FormClosedEventArgs fcea) => {
                currentProfile.actions = actionSelection.GetSelection();
            };

            actionSelection.ShowDialog();
        }

        private void editLootTable_Click(object sender, EventArgs e)
        {
            ItemSelection itemSelection = new ItemSelection("Set items for '" + current.name + "'", currentProfile.items);

            itemSelection.FormClosed += (object s, FormClosedEventArgs fcea) => {
                currentProfile.items = itemSelection.GetSelection();
            };

            itemSelection.ShowDialog();
        }

        private void dialogButton_Click(object sender, EventArgs e)
        {
            Dialogue npcDialogue = new Dialogue(
                currentProfile.dialog.ToList(), 
                currentProfile.dialogElements.ToList(), 
                DialogueType.NPC
            );

            npcDialogue.Text = "Edit dialogue for '" + current.name + "'";

            npcDialogue.FormClosed += (object s, FormClosedEventArgs fcea) => {
                currentProfile.dialog = npcDialogue.dialogSystem.items.ToArray();
                currentProfile.dialogElements = npcDialogue.elements.ToArray();
            };

            npcDialogue.ShowDialog();
        }

        private void equipmentButton_Click(object sender, EventArgs e)
        {
            NPCEquipment npcEquipment = new NPCEquipment(
                "Edit equipment for '" + current.name + "'", 
                currentProfile.character, 
                currentProfile.equipment
            );

            npcEquipment.FormClosed += (object s, FormClosedEventArgs fcea) => {
                currentProfile.equipment = npcEquipment.GetSelection();
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

                profiles = temp.profiles;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash - Error");
            }
        }

        public string name = "New NPC";
        public NPCProfile[] profiles = new NPCProfile[0];
    }

    public class NPCProfile
    {
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
