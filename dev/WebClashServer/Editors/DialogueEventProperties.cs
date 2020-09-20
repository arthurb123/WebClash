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
                case "GiveStatusEffect":
                    giveStatusEffectPanel.Visible = true;

                    LoadStatusEffectOptions();
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

                    LoadSpawnNpcOptions();
                    break;
                case "ShowQuest":
                    showQuestPanel.Visible = true;

                    LoadShowQuestOptions();
                    break;
                case "AdvanceQuest":
                    advanceQuestPanel.Visible = true;

                    LoadAdvanceQuestOptions();
                    break;
                case "SetVariable":
                    playerVariablePanel.Visible = true;

                    LoadPlayerVariableOptions(true);
                    break;
                case "GetVariable":
                    playerVariablePanel.Visible = true;

                    LoadPlayerVariableOptions(false);
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
                {
                    string map = m.Replace('\\', '/');

                    mapList.Items.Add(map.Substring(map.LastIndexOf('/') + 1, map.LastIndexOf('.') - map.LastIndexOf('/') - 1));
                }
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load maps: ", exc);
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
                    string it = items[i].Replace('\\', '/');

                    itemList.Items.Add(it.Substring(it.LastIndexOf('/') + 1, it.LastIndexOf('.') - it.LastIndexOf('/') - 1));
                }
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load items: ", exc);
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

        //Give status effect event

        private void LoadStatusEffectOptions()
        {
            LoadStatusEffectList();

            statusEffectList.SelectedItem = current.giveStatusEffectEvent.statusEffect;
            casterName.Text = current.giveStatusEffectEvent.caster;
            hostileStatusEffect.Checked = current.giveStatusEffectEvent.hostile;
        }

        private void LoadStatusEffectList()
        {
            statusEffectList.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] effects = Directory.GetFiles(Program.main.serverLocation + "/effects", "*.*", SearchOption.AllDirectories)
                    .Where(e => ext.Contains(Path.GetExtension(e))).ToArray();

                for (int e = 0; e < effects.Length; e++)
                {
                    string effect = effects[e].Replace('\\', '/');

                    statusEffectList.Items.Add(effect.Substring(effect.LastIndexOf('/') + 1, effect.LastIndexOf('.') - effect.LastIndexOf('/') - 1));
                }
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load status effects: ", exc);
            }
        }

        private void statusEffectList_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.giveStatusEffectEvent.statusEffect = statusEffectList.SelectedItem.ToString();
        }

        private void casterName_TextChanged(object sender, EventArgs e)
        {
            current.giveStatusEffectEvent.caster = casterName.Text;
        }

        private void hostileStatusEffect_CheckedChanged(object sender, EventArgs e)
        {
            current.giveStatusEffectEvent.hostile = hostileStatusEffect.Checked;
        }

        //Affect player event

        private void LoadAffectPlayerOptions()
        {
            healthDifference.Value = current.affectPlayerEvent.healthDifference;
            manaDifference.Value = current.affectPlayerEvent.manaDifference;
            currencyDifference.Value = current.affectPlayerEvent.currencyDifference;
        }

        private void healthDifference_ValueChanged(object sender, EventArgs e)
        {
            current.affectPlayerEvent.healthDifference = (int)healthDifference.Value;
        }

        private void manaDifference_ValueChanged(object sender, EventArgs e)
        {
            current.affectPlayerEvent.manaDifference = (int)manaDifference.Value;
        }

        private void currencyDifference_ValueChanged(object sender, EventArgs e)
        {
            current.affectPlayerEvent.currencyDifference = (int)currencyDifference.Value;
        }

        //Spawn NPC event

        private void LoadSpawnNpcOptions()
        {
            LoadNpcList();

            npcList.SelectedItem = current.spawnNpcEvent.name;

            LoadNpcProfileList();

            npcProfileList.SelectedItem = current.spawnNpcEvent.profile;
            npcAmount.Value = current.spawnNpcEvent.amount;
            npcHostile.Checked = current.spawnNpcEvent.hostile;
        }

        private void LoadNpcList()
        {
            npcList.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] npcs = Directory.GetFiles(Program.main.serverLocation + "/npcs", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                for (int i = 0; i < npcs.Length; i++)
                {
                    string npc = npcs[i].Replace('\\', '/');

                    npcList.Items.Add(npc.Substring(npc.LastIndexOf('/') + 1, npc.LastIndexOf('.') - npc.LastIndexOf('/') - 1));
                }
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load NPCs: ", exc);
            }
        }

        private void LoadNpcProfileList()
        {
            npcProfileList.Items.Clear();

            try
            {
                //Check if the NPC is valid

                if (current.spawnNpcEvent.name == "" ||
                    current.spawnNpcEvent.name == null)
                    return;

                //Load the NPC

                Npc npc = new Npc(Program.main.serverLocation + "/npcs/" + current.spawnNpcEvent.name + ".json");

                //Construct the profile list

                for (int p = 0; p < npc.profiles.Length; p++)
                    if (npc.profiles[p] != null)
                        npcProfileList.Items.Add(p);
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load NPC profile list: ", exc);
            }
        }

        private void npcList_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.spawnNpcEvent.name = npcList.SelectedItem.ToString();
            npcProfileList.SelectedItem = 0;

            LoadNpcProfileList();
        }

        private void npcProfileList_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.spawnNpcEvent.profile = (int)npcProfileList.SelectedItem;
        }

        private void npcAmount_ValueChanged(object sender, EventArgs e)
        {
            current.spawnNpcEvent.amount = (int)npcAmount.Value;
        }

        private void npcHostile_CheckedChanged(object sender, EventArgs e)
        {
            current.spawnNpcEvent.hostile = npcHostile.Checked;
        }

        //Show quest event

        private void LoadShowQuestOptions()
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
                    string q = quests[i].Replace('\\', '/');

                    questList.Items.Add(q.Substring(q.LastIndexOf('/') + 1, q.LastIndexOf('.') - q.LastIndexOf('/') - 1));
                }
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load quests: ", exc);
            }
        }

        private void questList_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.showQuestEvent.name = questList.SelectedItem.ToString();
        }

        //Advance quest event

        private void LoadAdvanceQuestOptions()
        {
            advanceQuestEntryPoint.Checked = current.advanceQuestEvent.entry;
        }

        private void advanceQuestEntryPoint_CheckedChanged(object sender, EventArgs e)
        {
            current.advanceQuestEvent.entry = advanceQuestEntryPoint.Checked;
        }

        //Player variable event

        private void LoadPlayerVariableOptions(bool set)
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
