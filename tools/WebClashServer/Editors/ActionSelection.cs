using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Windows.Forms;

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

            ReloadActionList(actions.ToArray());
        }

        private void ReloadActionList(PossibleAction[] actions)
        {
            actionList.Items.Clear();

            try
            {
                for (int i = 0; i < actions.Length; i++)
                {
                    string it = actions[i].action;

                    actionList.Items.Add(i + ". " + actions[i].action + " (" + actions[i].range + ")");
                }
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }

            if (current == -1 &&
                actions.Length > 0)
                actionList.SelectedItem = actionList.Items[0];
            else if (actions.Length > 0 &&
                     current < actions.Length)
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

                string[] characters = Directory.GetFiles(Program.main.location + "/actions", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                foreach (string c in characters)
                    actionSelect.Items.Add(c.Substring(c.LastIndexOf('\\') + 1, c.LastIndexOf('.') - c.LastIndexOf('\\') - 1));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }
        }

        private void actionList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (actionList.SelectedIndex == -1 ||
                actions.Count <= actionList.SelectedIndex)
                return;

            current = actionList.SelectedIndex;

            actionSelect.SelectedItem = actions[current].action;
            range.Value = actions[current].range;
            extraCooldown.Value = actions[current].extraCooldown*16;
        }

        private void actionSelect_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (current == -1)
                return;

            actions[current].action = actionSelect.SelectedItem.ToString();

            ReloadActionList(actions.ToArray());
        }

        private void range_ValueChanged(object sender, EventArgs e)
        {
            if (current == -1)
                return;

            actions[current].range = (int)range.Value;

            ReloadActionList(actions.ToArray());
        }

        private void newLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            string i = actionList.Items.Count + ". " + string.Empty;

            actions.Add(new PossibleAction());

            actionList.Items.Add(i);
            actionList.SelectedItem = i;
        }

        private void delete_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == -1)
                return;

            actions.RemoveAt(current);

            ReloadActionList(actions.ToArray());
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
