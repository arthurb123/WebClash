using System;
using System.IO;
using System.Windows.Forms;

namespace WebClashServer.Editors
{
    public partial class ResetData : Form
    {
        string serverLocation = "";

        public ResetData(string serverLocation)
        {
            this.serverLocation = serverLocation;

            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            DialogResult dr = MessageBox.Show("Are you sure you want to delete all server data?", "WebClash - Reset Server", MessageBoxButtons.YesNo);

            if (dr == DialogResult.Yes)
                ResetAllData();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            Close();
        }

        private void ResetAllData()
        {
            ResetDirectory("actions");
            ResetDirectory("items");
            ResetDirectory("maps");
            ResetDirectory("npcs");

            ResetDirectory("data/accounts");
            ResetDirectory("data/stats");

            ResetDirectoryExcept("characters", "player.json");

            MessageBox.Show("All server data has been deleted/resetted.", "WebClash - Reset Complete");

            Close();
        }

        private void ResetDirectory(string name)
        {
            DirectoryInfo di = new DirectoryInfo(serverLocation + "/" + name);

            foreach (FileInfo file in di.GetFiles())
                file.Delete();
        }

        private void ResetDirectoryExcept(string name, string except)
        {
            DirectoryInfo di = new DirectoryInfo(serverLocation + "/" + name);

            foreach (FileInfo file in di.GetFiles())
            {
                if (file.Name == except)
                    continue;

                file.Delete();
            }
        }
    }
}
