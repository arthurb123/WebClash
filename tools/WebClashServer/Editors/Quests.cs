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
    public partial class Quests : Form
    {
        private Quest current;
        private string oldName;

        public Quests()
        {
            InitializeComponent();
        }

        private void Quests_Load(object sender, EventArgs e)
        {
            objectiveList.DoubleClick += OpenObjective;

            ReloadQuests();

            if (questList.Items.Count > 0)
                questList.SelectedItem = questList.Items[0];
        }

        private void ReloadQuests()
        {
            questList.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] quests = Directory.GetFiles(Program.main.location + "/quests", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                for (int i = 0; i < quests.Length; i++)
                {
                    string q = quests[i];

                    questList.Items.Add(i + ". " + q.Substring(q.LastIndexOf('\\') + 1, q.LastIndexOf('.') - q.LastIndexOf('\\') - 1));
                }
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }
        }

        private void LoadQuest(string questName)
        {
            if (questName == string.Empty)
                current = new Quest();
            else
                current = new Quest(Program.main.location + "/quests/" + questName + ".json");

            name.Text = questName;

            minLevel.Value = current.minLevel;

            description.Text = current.description;

            goldReward.Value = current.rewards.gold;
            experienceReward.Value = current.rewards.experience;

            LoadObjectives();
        }

        private void LoadObjectives()
        {
            objectiveList.Items.Clear();

            for (int i = 0; i < current.objectives.Length; i++)
            {
                string name = i + ". ";

                if (current.objectives[i].type == "kill")
                    name += "Kill " + current.objectives[i].killObjective.amount + " " + current.objectives[i].killObjective.npc + "(s)";
                else if (current.objectives[i].type == "gather")
                    name += "Gather " + current.objectives[i].gatherObjective.amount + " " + current.objectives[i].gatherObjective.item + "(s)";

                objectiveList.Items.Add(name);
            }
        }

        private void OpenObjective(object sender, EventArgs e)
        {
            if (current == null || objectiveList.SelectedIndex == -1)
                return;

            string title = "Edit objective #" + objectiveList.SelectedIndex;

            QuestObjectiveProperties qop = new QuestObjectiveProperties(title, current.objectives[objectiveList.SelectedIndex]);
            qop.FormClosed += (object s, FormClosedEventArgs fcea) =>
            {
                current.objectives[objectiveList.SelectedIndex] = qop.GetResult();

                switch (current.objectives[objectiveList.SelectedIndex].type)
                {
                    case "":
                        break;
                    case "kill":
                        //Clear everything except QuestObjectiveKill
                        current.objectives[objectiveList.SelectedIndex].gatherObjective = null;
                        break;
                    case "gather":
                        //Clear everything except QuestObjectiveGather
                        current.objectives[objectiveList.SelectedIndex].killObjective = null;
                        break;

                    //...
                };

                LoadObjectives();
            };

            qop.ShowDialog();
        }

        private void itemList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (questList.SelectedItem == null)
                return;

            string t = questList.SelectedItem.ToString();

            oldName = t.Substring(t.IndexOf(" ") + 1, t.Length - t.IndexOf(" ") - 1);

            LoadQuest(oldName);
        }

        private void newLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            string i = questList.Items.Count + ". " + string.Empty;

            questList.Items.Add(i);
            questList.SelectedItem = i;

            LoadQuest(string.Empty);
        }

        private void saveLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == null || name.Text.Length == 0)
            {
                MessageBox.Show("Could not save quest as it is invalid.", "WebClash Server - Error");
                return;
            }

            if (oldName != name.Text)
                File.Delete(Program.main.location + "/quests/" + oldName + ".json");

            File.WriteAllText(Program.main.location + "/quests/" + name.Text + ".json", JsonConvert.SerializeObject(current, Formatting.Indented));

            MessageBox.Show("Quest has been saved!", "WebClash Server - Message");

            ReloadQuests();

            questList.SelectedItem = name.Text;
        }
        
        private void minLevel_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.minLevel = (int)minLevel.Value;
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

            File.Delete(Program.main.location + "/quests/" + oldName + ".json");

            ReloadQuests();

            if (questList.Items.Count > 0)
                questList.SelectedItem = questList.Items[0];
            else
                newLink_LinkClicked(sender, e);
        }

        private void newObjective_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == null)
                return;

            List<QuestObjective> qos = current.objectives.ToList();
            qos.Add(new QuestObjective());

            current.objectives = qos.ToArray();

            LoadObjectives();
        }

        private void delObjective_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == null || objectiveList.SelectedIndex == -1)
                return;

            List<QuestObjective> qos = current.objectives.ToList();
            qos.RemoveAt(objectiveList.SelectedIndex);

            current.objectives = qos.ToArray();

            LoadObjectives();
        }

        private void goldReward_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.rewards.gold = (int)goldReward.Value;
        }

        private void experienceReward_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.rewards.experience = (int)experienceReward.Value;
        }

        public int GetAmount()
        {
            return questList.Items.Count;
        }
    }

    public class Quest
    {
        public Quest()
        {
            //...
        }

        public Quest(string src)
        {
            try
            {
                Quest temp = JsonConvert.DeserializeObject<Quest>(File.ReadAllText(src));
 
                description = temp.description;

                minLevel = temp.minLevel;

                objectives = temp.objectives;

                rewards = temp.rewards;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash Server - Error");
            }
        }
        
        public int minLevel = 0;

        public string description = "";

        public QuestObjective[] objectives = new QuestObjective[0];

        public QuestRewards rewards = new QuestRewards();
    }

    public class QuestRewards
    {
        public int gold = 0;

        public int experience = 0;
    }
    
    public class QuestObjective
    {
        public string type = "";

        public QuestObjectiveKill killObjective = null;

        public QuestObjectiveGather gatherObjective = null;
    }

    public class QuestObjectiveKill
    {
        public string npc = "";

        public int amount = 1;
        public int cur = 0;

        public bool resetOnDeath = false;
    }

    public class QuestObjectiveGather
    {
        public string item = "";

        public int amount = 1;
        public int cur = 0;
    }

    public enum QuestObjectiveType
    {
        Kill = 0,
        Gather,
    }
}
