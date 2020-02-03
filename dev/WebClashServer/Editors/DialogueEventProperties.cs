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
                case "AffectPlayer":
                    affectPlayerPanel.Visible = true;

                    LoadAffectPlayerOptions();
                    break;
                case "SpawnNPC":
                    spawnNPCPanel.Visible = true;

                    LoadSpawnNPCOptions();
                    break;
                case "ShowQuest":
                    showQuestPanel.Visible = true;

                    loadShowQuestOptions();
                    break;
                case "AdvanceQuest":
                    advanceQuestPanel.Visible = true;

                    loadAdvanceQuestOptions();
                    break;
                case "SetVariable":
                    playerVariablePanel.Visible = true;

                    loadPlayerVariableOptions(true);
                    break;
                case "GetVariable":
                    playerVariablePanel.Visible = true;

                    loadPlayerVariableOptions(false);
                    break;
            }

            repeatable.Checked = current.repeatable;

            nextIndex.Value = current.options[0].next;
            nextIndex1.Value = current.options[1].next;
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
        
        private void nextIndex1_ValueChanged(object sender, EventArgs e)
        {
            current.options[1].next = (int)nextIndex1.Value;
        }

        //Load map event

        private void LoadMapOptions()
        {
            LoadMapsList();

            mapList.SelectedItem = current.loadMapEvent.map;

            positionX.Value = current.loadMapEvent.positionX;
            positionY.Value = current.loadMapEvent.positionY;
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

                string[] maps = Directory.GetFiles(Program.main.serverLocation + "/maps", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s)) && !s.Contains(".metadata")).ToArray();

                foreach (string m in maps)
                    mapList.Items.Add(m.Substring(m.LastIndexOf('\\') + 1, m.LastIndexOf('.') - m.LastIndexOf('\\') - 1));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash - Error");
            }
        }

        private void mapList_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.loadMapEvent.map = mapList.SelectedItem.ToString();
        }

        private void positionX_ValueChanged(object sender, EventArgs e)
        {
            current.loadMapEvent.positionX = (int)positionX.Value;
        }

        private void positionY_ValueChanged(object sender, EventArgs e)
        {
            current.loadMapEvent.positionY = (int)positionY.Value;
        }

        //Give item event

        private void LoadItemOptions()
        {
            LoadItemList();

            itemList.SelectedItem = current.giveItemEvent.item;
            itemAmount.Value = current.giveItemEvent.amount;
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

                string[] items = Directory.GetFiles(Program.main.serverLocation + "/items", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                for (int i = 0; i < items.Length; i++)
                {
                    string it = items[i];

                    itemList.Items.Add(it.Substring(it.LastIndexOf('\\') + 1, it.LastIndexOf('.') - it.LastIndexOf('\\') - 1));
                }
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash - Error");
            }
        }

        private void itemList_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.giveItemEvent.item = itemList.SelectedItem.ToString();
        }

        private void itemAmount_ValueChanged(object sender, EventArgs e)
        {
            current.giveItemEvent.amount = (int)itemAmount.Value;
        }

        //Affect player event

        private void LoadAffectPlayerOptions()
        {
            healthDifference.Value = current.affectPlayerEvent.healthDifference;
            manaDifference.Value = current.affectPlayerEvent.manaDifference;
            goldDifference.Value = current.affectPlayerEvent.goldDifference;
        }

        private void healthDifference_ValueChanged(object sender, EventArgs e)
        {
            current.affectPlayerEvent.healthDifference = (int)healthDifference.Value;
        }

        private void manaDifference_ValueChanged(object sender, EventArgs e)
        {
            current.affectPlayerEvent.manaDifference = (int)manaDifference.Value;
        }

        private void goldDifference_ValueChanged(object sender, EventArgs e)
        {
            current.affectPlayerEvent.goldDifference = (int)goldDifference.Value;
        }

        //Spawn NPC event

        private void LoadSpawnNPCOptions()
        {
            LoadNPCList();

            npcList.SelectedItem = current.spawnNPCEvent.name;
            npcAmount.Value = current.spawnNPCEvent.amount;
            npcHostile.Checked = current.spawnNPCEvent.hostile;
        }

        private void LoadNPCList()
        {
            npcList.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] items = Directory.GetFiles(Program.main.serverLocation + "/npcs", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                for (int i = 0; i < items.Length; i++)
                {
                    string it = items[i];

                    npcList.Items.Add(it.Substring(it.LastIndexOf('\\') + 1, it.LastIndexOf('.') - it.LastIndexOf('\\') - 1));
                }
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash - Error");
            }
        }

        private void npcList_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.spawnNPCEvent.name = npcList.SelectedItem.ToString();
        }

        private void npcAmount_ValueChanged(object sender, EventArgs e)
        {
            current.spawnNPCEvent.amount = (int)npcAmount.Value;
        }

        private void npcHostile_CheckedChanged(object sender, EventArgs e)
        {
            current.spawnNPCEvent.hostile = npcHostile.Checked;
        }

        //Show quest event

        private void loadShowQuestOptions()
        {
            LoadQuestList();

            questList.SelectedItem = current.showQuestEvent.name;
        }

        private void LoadQuestList()
        {
            questList.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] quests = Directory.GetFiles(Program.main.serverLocation + "/quests", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                for (int i = 0; i < quests.Length; i++)
                {
                    string it = quests[i];

                    questList.Items.Add(it.Substring(it.LastIndexOf('\\') + 1, it.LastIndexOf('.') - it.LastIndexOf('\\') - 1));
                }
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash - Error");
            }
        }

        private void questList_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.showQuestEvent.name = questList.SelectedItem.ToString();
        }

        //Advance quest event

        private void loadAdvanceQuestOptions()
        {
            advanceQuestEntryPoint.Checked = current.advanceQuestEvent.entry;
        }

        private void advanceQuestEntryPoint_CheckedChanged(object sender, EventArgs e)
        {
            current.advanceQuestEvent.entry = advanceQuestEntryPoint.Checked;
        }

        //Player variable event

        private void loadPlayerVariableOptions(bool set)
        {
            if (set)
            {
                playerVariableValue.Visible = true;
                getVariableEntryPoint.Visible = false;

                playerVariableName.Text = current.setVariableEvent.name;
                playerVariableValue.Checked = current.setVariableEvent.value;
            }
            else
            {
                succesText.Text = "Next (True)";
                occurredText.Text = "Next (False)";

                playerVariableName.Text = current.getVariableEvent.name;
                repeatable.Visible = false;

                getVariableEntryPoint.Checked = current.entry;
            }
        }

        private void PlayerVariableName_TextChanged(object sender, EventArgs e)
        {
            if (current.setVariableEvent != null)
                current.setVariableEvent.name = playerVariableName.Text;
            else
                current.getVariableEvent.name = playerVariableName.Text;
        }

        private void PlayerVariableValue_CheckedChanged(object sender, EventArgs e)
        {
            current.setVariableEvent.value = playerVariableValue.Checked;
        }

        private void GetVariableEntryPoint_CheckedChanged(object sender, EventArgs e)
        {
            current.entry = getVariableEntryPoint.Checked;
        }
    }
}
