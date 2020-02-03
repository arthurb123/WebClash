﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace WebClashServer.Editors
{
    public partial class QuestObjectiveProperties : Form
    {
        QuestObjective current;

        public QuestObjectiveProperties(string title, QuestObjective qo)
        {
            InitializeComponent();

            Text = title;
            current = qo;
        }

        private void QuestObjectiveProperties_Load(object sender, EventArgs e)
        {
            LoadObjectiveTypes();

            LoadNPCSelection();

            LoadItemSelection();

            LoadObjectiveProperties();
        }

        private void LoadObjectiveTypes()
        {
            objectiveType.Items.Clear();

            foreach (QuestObjectiveType qot in Enum.GetValues(typeof(QuestObjectiveType)))
                objectiveType.Items.Add(qot.ToString());
        }

        private void LoadObjectiveProperties()
        {
            if (current.type == "")
                return;

            if (current.type == "kill")
            {
                if (current.killObjective == null)
                    current.killObjective = new QuestObjectiveKill();

                killObjectivePanel.Visible = true;
                gatherObjectivePanel.Visible = false;
                talkObjectivePanel.Visible = false;

                killNpcSelection.SelectedItem = current.killObjective.npc;
                killNpcAmount.Value = current.killObjective.amount;

                resetOnDeath.Checked = current.killObjective.resetOnDeath;
            }

            else if (current.type == "gather")
            {
                if (current.gatherObjective == null)
                    current.gatherObjective = new QuestObjectiveGather();

                gatherObjectivePanel.Visible = true;
                killObjectivePanel.Visible = false;
                talkObjectivePanel.Visible = false;

                itemList.SelectedItem = current.gatherObjective.item;
                gatherAmount.Value = current.gatherObjective.amount;
            }

            else if (current.type == "talk")
            {
                if (current.talkObjective == null)
                    current.talkObjective = new QuestObjectiveTalk();

                talkObjectivePanel.Visible = true;
                killObjectivePanel.Visible = false;
                gatherObjectivePanel.Visible = false;

                talkNpcSelection.SelectedItem = current.talkObjective.npc;
            }

            objectiveType.SelectedItem = char.ToUpper(current.type[0]) + current.type.Substring(1, current.type.Length - 1);
        }

        private void objectiveType_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.type = objectiveType.SelectedItem.ToString().ToLower();

            LoadObjectiveProperties();
        }

        //General methods for selection loading

        private void LoadNPCSelection()
        {
            killNpcSelection.Items.Clear();
            talkNpcSelection.Items.Clear();

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
                    string npc = it.Substring(it.LastIndexOf('\\') + 1, it.LastIndexOf('.') - it.LastIndexOf('\\') - 1);

                    killNpcSelection.Items.Add(npc);
                    talkNpcSelection.Items.Add(npc);
                }
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash - Error");
            }
        }


        private void LoadItemSelection()
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

        //Kill Quest Objective

        private void killNpcSelection_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.killObjective.npc = killNpcSelection.SelectedItem.ToString();
        }

        private void killNpcAmount_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.killObjective.amount = (int)killNpcAmount.Value;
        }

        private void ResetOnDeath_CheckedChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.killObjective.resetOnDeath = resetOnDeath.Checked;
        }

        //Gather Quest Objective

        private void itemList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.gatherObjective.item = itemList.SelectedItem.ToString();
        }

        private void gatherAmount_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.gatherObjective.amount = (int)gatherAmount.Value;
        }

        //Talk Quest Objective

        private void talkNpcSelection_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.talkObjective.npc = talkNpcSelection.SelectedItem.ToString();
        }

        private void talkEditDialog_Click(object sender, EventArgs e)
        {
            if (current == null)
                return;

            Dialogue talkDialogue = new Dialogue(
                current.talkObjective.dialog.ToList(),
                current.talkObjective.dialogElements.ToList(),
                DialogueType.NPCQuest
            );

            talkDialogue.Text = Text + " dialog for '" + current.talkObjective.npc + "'";

            talkDialogue.FormClosed += (object s, FormClosedEventArgs fcea) => {
                current.talkObjective.dialog = talkDialogue.dialogSystem.items.ToArray();
                current.talkObjective.dialogElements = talkDialogue.elements.ToArray();
            };

            talkDialogue.ShowDialog();
        }

        //Get result method

        public QuestObjective GetResult()
        {
            return current;
        }
    }
}
