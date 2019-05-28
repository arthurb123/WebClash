using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using WebClashServer.Editors;


namespace WebClashServer
{
    public partial class Main : Form
    {
        //Server variables

        private bool running = false;

        public string location = "server";

        private Process p = null;

        private bool shouldRestart = false;

        //Forms

        Characters characters = new Characters();
        Maps maps = new Maps();
        NPCs npcs = new NPCs();
        Actions actions = new Actions();
        Items items = new Items();
        Quests quests = new Quests();

        public Main()
        {
            InitializeComponent();

            //Setup command enter event

            inputCommand.KeyDown += new KeyEventHandler((object s, KeyEventArgs kea) =>
            {
                if (kea.KeyCode == Keys.Enter && 
                    running && 
                    p != null)
                {
                    if (inputCommand.Text.IndexOf("shutdown") == -1)
                        p.StandardInput.WriteLine(inputCommand.Text);
                    else
                        AttemptStopServer();

                    inputCommand.Text = "";
                }
            });

            FormClosing += ((object s, FormClosingEventArgs e) =>
            {
                AttemptStopServer();
            });
        }

        private void startButton_Click(object sender, EventArgs e)
        {
            if (!running)
                AttemptStartServer();
            else
                AttemptStopServer();
        }

        private void AttemptStartServer()
        {
            if (p != null)
                return;

            if (!CheckServerLocation())
                return;

            string nodeLocation = getNodeJSLocation();

            if (nodeLocation == "")
            {
                MessageBox.Show("Could not locate NodeJS, the server could not be started. \nNodeJS can be downloaded from https://www.nodejs.org/", "WebClash Server - Error");

                return;
            }

            startButton.Text = "Stop";

            running = true;

            output.Text = "";

            try
            {
                ProcessStartInfo pi = new ProcessStartInfo(nodeLocation + "/node.exe", "index.js");
                p = new Process();

                pi.CreateNoWindow = true;
                pi.UseShellExecute = false;
                pi.WorkingDirectory = location;

                pi.RedirectStandardError = true;
                pi.RedirectStandardOutput = true;
                pi.RedirectStandardInput = true;

                p = Process.Start(pi);

                p.BeginOutputReadLine();
                p.BeginErrorReadLine();

                p.OutputDataReceived += ((object sender, DataReceivedEventArgs e) =>
                {
                    AddOutput(e.Data);
                });

                p.ErrorDataReceived += ((object sender, DataReceivedEventArgs e) =>
                {
                    AddOutput(e.Data);
                });
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash Server - Error");
            }

            status.Text = "Server has been started.";
        }

        private void AttemptStopServer()
        {
            if (running)
            {
                if (p.HasExited)
                {
                    FinalShutDownProcedure();

                    return;
                }

                p.StandardInput.WriteLine("shutdown");
            }
        }

        private void FinalShutDownProcedure()
        {
            status.Text = "Server has been stopped.";

            startButton.Text = "Start";

            p = null;

            running = false;

            if (shouldRestart)
            {
                shouldRestart = false;

                AttemptStartServer();
            }
        }

        private void RestartServerOnChange(string changedData)
        {
            if (!restartAfterNewChangesToolStripMenuItem.Checked)
                AddOutput("The " + changedData + " have changed, changes will be visible after a server restart.");
            else
            {
                //AddOutput("The " + changedData + " have changed, restarting server..");

                status.Text = "Restarting server..";

                shouldRestart = true;

                AttemptStopServer();
            }
        }

        private bool CheckServerLocation()
        {
            if (Directory.Exists(location) ||
                File.Exists(location + "/index.js"))
                return true;

            while (!Directory.Exists(location) ||
                !File.Exists(location + "/index.js"))
            {
                status.Text = "Server folder not located.";

                MessageBox.Show("Server folder could not be located, please select the server location.", "WebClash Server - Error");

                if (RequestServerLocation())
                {
                    status.Text = "Server folder located.";

                    return true;
                }
                else
                    break;
            }

            return false;
        }

        private bool RequestServerLocation()
        {
            using (FolderBrowserDialog dialog = new FolderBrowserDialog())
            {
                if (dialog.ShowDialog() == DialogResult.OK)
                {
                    location = dialog.SelectedPath;

                    return true;
                }
            }

            return false;
        }

        public void AddOutput(string msg)
        {
            try
            {
                if (!running || msg == null)
                    return;

                if (!InvokeRequired)
                {
                    output.Text += msg + "\n";

                    output.SelectionStart = output.TextLength;
                    output.ScrollToCaret();

                    if (msg.IndexOf("Completed shut down procedure.") != -1)
                        FinalShutDownProcedure();
                }
                else
                    Invoke(new Action<string>(AddOutput), msg);
            }
            catch (Exception exc)
            {
                //...
            }
        }

        private string getNodeJSLocation()
        {
            string result = "";

            if (Directory.Exists("C:/nodejs"))
                result = "C:/nodejs";
            else if (Directory.Exists("C:/Program Files/nodejs"))
                result = "C:/Program Files/nodejs";
            else if (Directory.Exists("C:/Program Files (x86)/nodejs"))
                result = "C:/Program Files (x86)/nodejs";

            if (result == "")
            {
                DialogResult manuallySelect = MessageBox.Show("NodeJS could not be found, do you want to manually select the installation folder?", "WebClash Server - Error", MessageBoxButtons.YesNo);
                
                if (manuallySelect == DialogResult.Yes)
                    using (FolderBrowserDialog dialog = new FolderBrowserDialog())
                        if (dialog.ShowDialog() == DialogResult.OK)
                            result = dialog.SelectedPath;
            }

            return result;
        }

        private void settings_Click(object sender, EventArgs e)
        {
            if (!CheckServerLocation())
                return;

            try
            {
                if (location.IndexOf("\\") == -1)
                    location = Application.StartupPath + "/" + location;

                Process.Start(new ProcessStartInfo(location + "/properties.json"));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }
        }

        private void permissions_Click(object sender, EventArgs e)
        {
            if (!CheckServerLocation())
                return;

            try
            {
                if (location.IndexOf("\\") == -1)
                    location = Application.StartupPath + "/" + location;

                Process.Start(new ProcessStartInfo(location + "/permissions.json"));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }
        }

        private void charactersToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (!CheckServerLocation())
                return;

            if (characters.Visible)
            {
                characters.Focus();
                return;
            }
            else
                characters = new Characters();

            characters.FormClosed += (object s, FormClosedEventArgs fcea) => {
                if (characters.GetChanged())
                    RestartServerOnChange("characters");
            };

            characters.Show();
        }

        private void mapsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (!CheckServerLocation())
                return;

            if (maps.Visible)
            {
                maps.Focus();
                return;
            }
            else
                maps = new Maps();

            maps.FormClosed += (object s, FormClosedEventArgs fcea) => {
                if (maps.GetChanged())
                    RestartServerOnChange("maps");
            };

            maps.Show();
        }

        private void NPCsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (!CheckServerLocation())
                return;

            if (npcs.Visible)
            {
                npcs.Focus();
                return;
            }
            else
                npcs = new NPCs();

            npcs.FormClosed += (object s, FormClosedEventArgs fcea) => {
                if (npcs.GetChanged())
                    RestartServerOnChange("NPCs");
            };

            npcs.Show();
        }

        private void actionsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (!CheckServerLocation())
                return;

            if (actions.Visible)
            {
                actions.Focus();
                return;
            }
            else
                actions = new Actions();

            actions.FormClosed += (object s, FormClosedEventArgs fcea) => {
                if (actions.GetChanged())
                    RestartServerOnChange("actions");
            };

            actions.Show();
        }

        private void itemsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (!CheckServerLocation())
                return;

            if (items.Visible)
            {
                items.Focus();
                return;
            }
            else
                items = new Items();

            items.FormClosed += (object s, FormClosedEventArgs fcea) => {
                if (items.GetChanged())
                    RestartServerOnChange("items");
            };

            items.Show();
        }
        
        private void questsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (!CheckServerLocation())
                return;

            if (quests.Visible)
            {
                quests.Focus();
                return;
            }
            else
                quests = new Quests();

            quests.FormClosed += (object s, FormClosedEventArgs fcea) => {
                if (quests.GetChanged())
                    RestartServerOnChange("quests");
            };

            quests.Show();
        }

        //Tools

        private void resetDataToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (!CheckServerLocation())
                return;

            new ResetData(location).ShowDialog();
        }
    }
}
