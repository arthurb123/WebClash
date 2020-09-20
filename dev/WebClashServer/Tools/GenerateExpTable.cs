using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Windows.Forms;
using WebClashServer.Classes;

namespace WebClashServer.Tools
{
    public partial class GenerateExpTable : Form
    {
        private List<int> table = new List<int>();
        private string serverLocation;

        public GenerateExpTable(string serverLocation)
        {
            InitializeComponent();

            this.serverLocation = serverLocation;

            GenerateTable();
        }

        private void GenerateTable()
        {
            table = new List<int>();

            int val = (int)startingValue.Value;
            for (int l = 0; l < (int)maxLevel.Value - 1; l++)
            {
                if (l > 0)
                    val += (int)Math.Round((float)valueIncrement.Value * ((float)growFactor.Value * l));

                table.Add(val);
            }

            ShowPreview();
        }

        private void ShowPreview()
        {
            previewList.Items.Clear();

            previewList.Items.Add("Level 1 - Base");

            for (int l = 0; l < table.Count; l++)
                previewList.Items.Add("Level " + (l + 2) + " - " + table[l] + " Experience");
        }

        private void startingValue_ValueChanged(object sender, EventArgs e)
        {
            GenerateTable();
        }

        private void valueIncrement_ValueChanged(object sender, EventArgs e)
        {
            GenerateTable();
        }

        private void growFactor_ValueChanged(object sender, EventArgs e)
        {
            GenerateTable();
        }

        private void maxLevel_ValueChanged(object sender, EventArgs e)
        {
            GenerateTable();
        }

        private void save_Click(object sender, EventArgs e)
        {
            try
            {
                string json = JsonConvert.SerializeObject(table, Formatting.Indented);
                File.WriteAllText(serverLocation + "/exptable.json", json);

                Logger.Message("The experience table has been saved!");
            }
            catch (Exception exc)
            {
                Logger.Error("Could not save the experience table: ", exc);
            }
        }

        private void help_Click(object sender, EventArgs e)
        {
            Logger.Message(
                "The starting value is the amount of experience\n" +
                "needed to advance to level 2, after that the amount\n" +
                "of experience required to level is based on the value\n" +
                "increment times the growth factor and the difference between\n" +
                "the 2nd and current level; plus the previous amount of experience.\n" +
                "So to reach level 3 from level 2 with a starting value of 8,\n" +
                "a value increment of 6 and a growth factor of 1.50\n" +
                "would require 8 + 6 * 1.5 * (3-2) = 17 experience."
            );
        }
    }
}
