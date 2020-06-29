using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using WebClashServer.Classes;

namespace WebClashServer.Editors
{
    public partial class ActionSelection : Form
    {
        private List<PossibleAction> actions = new List<PossibleAction>();
        private int current = -1;

        public ActionSelection(string title, PossibleAction[] actions)
        {
            InitializeComponent();

            Text = title;

            this.actions = new List<PossibleAction>(actions);
        }

        private void ActionSelection_Load(object sender, EventArgs e)
        {
            ReloadActions();

            ReloadActionList();
        }

        private void ReloadActionList()
        {
            actionList.Items.Clear();

            try
            {
                if (actions.Count == 0)
                {
                    actionSelect.Enabled = false;
                    range.Enabled = false;
                    extraCooldown.Enabled = false;
                } else
                {
                    actionSelect.Enabled = true;
                    range.Enabled = true;
                    extraCooldown.Enabled = true;
                }

                for (int i = 0; i < actions.Count; i++)
                {
                    string it = actions[i].action;

                    actionList.Items.Add((i + 1) + ". " + actions[i].action + " (" + actions[i].range + ")");
                }
            }
            catch (Exception exc)
            {
                Logger.Error("Could not create actions list: ", exc);
            }

            if (current == -1 &&
                actions.Count > 0)
                actionList.SelectedItem = actionList.Items[0];
            else if (actions.Count > 0 &&
                     current < actions.Count)
                actionList.SelectedItem = actionList.Items[current];
        }

        private void ReloadActions()
        {
            actionSelect.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] actions = Directory.GetFiles(Program.main.serverLocation + "/actions", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                foreach (string a in actions)
                {
                    string action = a.Replace('\\', '/');

                    actionSelect.Items.Add(action.Substring(action.LastIndexOf('/') + 1, action.LastIndexOf('.') - action.LastIndexOf('/') - 1));
                }
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load actions: ", exc);
            }
        }

        private void actionList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (actionList.SelectedIndex == -1 ||
                actions.Count <= actionList.SelectedIndex)
                return;

            current = actionList.SelectedIndex;

            if (actions[current].action == "")
                actionSelect.SelectedItem = null;
            else
                actionSelect.SelectedItem = actions[current].action;

            range.Value = actions[current].range;
            extraCooldown.Value = actions[current].extraCooldown*16;
        }

        private void actionSelect_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (current == -1 || actionSelect.SelectedItem == null)
                return;

            actions[current].action = actionSelect.SelectedItem.ToString();

            ReloadActionList();
        }

        private void range_ValueChanged(object sender, EventArgs e)
        {
            if (current == -1)
                return;

            actions[current].range = (int)range.Value;

            ReloadActionList();
        }

        private void newLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            actions.Add(new PossibleAction());

            ReloadActionList();
            actionList.SelectedIndex = actions.Count - 1;
        }

        private void delete_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == -1)
                return;

            actions.RemoveAt(current);
            current = -1;

            ReloadActionList();
        }

        private void extraCooldown_ValueChanged(object sender, EventArgs e)
        {
            if (current == -1)
                return;

            actions[current].extraCooldown = (int)extraCooldown.Value / 16;
        }

        public PossibleAction[] GetSelection()
        {
            return actions.ToArray();
        }
    }

    public class PossibleAction
    {
        public string action = "";
        public int range = 0;
        public int extraCooldown = 0;
    }
}
