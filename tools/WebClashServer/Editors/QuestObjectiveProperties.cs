using System;
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

                killNpcSelection.SelectedItem = current.killObjective.npc;
                killNpcAmount.Value = current.killObjective.amount;
            }

            objectiveType.SelectedItem = char.ToUpper(current.type[0]) + current.type.Substring(1, current.type.Length - 1);
        }

        private void objectiveType_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.type = objectiveType.SelectedItem.ToString().ToLower();

            LoadObjectiveProperties();
        }

        //Kill Quest Objective

        private void LoadNPCSelection()
        {
            killNpcSelection.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] items = Directory.GetFiles(Program.main.location + "/npcs", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                for (int i = 0; i < items.Length; i++)
                {
                    string it = items[i];

                    killNpcSelection.Items.Add(it.Substring(it.LastIndexOf('\\') + 1, it.LastIndexOf('.') - it.LastIndexOf('\\') - 1));
                }
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }
        }

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

        public QuestObjective GetResult()
        {
            return current;
        }
    }
}
