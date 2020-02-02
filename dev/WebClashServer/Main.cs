using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;
using WebClashServer.Editors;

using Action = System.Action;

namespace WebClashServer
{
    public partial class Main : Form
    {
        //Server variables

        private bool    running       = false;
        private bool    shouldRestart = false;
        private Process p             = null;

        public string serverLocation = "server";
        public string nodeLocation   = "";

        //Forms

        Characters characters = new Characters();
        Maps       maps       = new Maps();
        NPCs       npcs       = new NPCs();
        Actions    actions    = new Actions();
        Items      items      = new Items();
        Quests     quests     = new Quests();

        public Main()
        {
            InitializeComponent();

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

        private void InstallDependencies()
        {
            output.Text = "";
            status.Text = "Installing dependencies..";
            startButton.Enabled = false;

            StartNodeProcess(
                "npm.cmd", 
                "install package.json", 
                FinishInstallingDependencies
            );
        }

        private void FinishInstallingDependencies()
        {
            if (!InvokeRequired)
            {
                p = null;
                startButton.Enabled = true;

                if (!Directory.Exists(serverLocation + "/node_modules"))
                {
                    status.Text = "Dependencies failed.";

                    MessageBox.Show(
                        "Could not install the server dependencies, " +
                        "please try again or use 'npm install package.json' in the console.",
                        "WebClash - Error"
                    );
                }
                else
                {
                    status.Text = "Dependencies installed.";

                    DialogResult startServer = MessageBox.Show(
                        "Finished installing dependencies, do you want to start the server?",
                        "WebClash - Question",
                        MessageBoxButtons.YesNo
                    );

                    if (startServer == DialogResult.Yes)
                        AttemptStartServer();
                }
            }
            else
                Invoke(new Action(FinishInstallingDependencies));
        }

        private void AttemptStartServer()
        {
            if (p != null || !CheckServerLocation())
                return;

            //Check if NodeJS is present

            if (nodeLocation == "")
            {
                nodeLocation = getNodeJSLocation();

                if (nodeLocation == "")
                {
                    MessageBox.Show(
                        "Could not locate NodeJS, the server could not be started. " +
                        "\nNodeJS can be downloaded from https://www.nodejs.org/",
                        "WebClash - Error"
                    );

                    return;
                }
            }

            //Check if NodeJS modules exist

            if (!Directory.Exists(serverLocation + "/node_modules"))
            {
                DialogResult installDependencies = MessageBox.Show(
                    "The server dependencies could not be found, do you want to install these now?",
                    "WebClash - Question",
                    MessageBoxButtons.YesNo
                );

                if (installDependencies == DialogResult.Yes)
                {
                    InstallDependencies();
                    return;
                }
            }

            //Start server

            StartNodeProcess("node.exe", "index.js");

            running          = true;
            startButton.Text = "Stop";
            output.Text      = "";
            status.Text      = "Server has been started.";
        }

        private void StartNodeProcess(string target, string arguments, Action exitCallback = null)
        {
            try
            {
                ProcessStartInfo pi = new ProcessStartInfo(nodeLocation + "/" + target, arguments);
                p = new Process();

                pi.CreateNoWindow   = true;
                pi.UseShellExecute  = false;
                pi.WorkingDirectory = serverLocation;

                pi.RedirectStandardError  = true;
                pi.RedirectStandardOutput = true;
                pi.RedirectStandardInput  = true;

                p = Process.Start(pi);

                p.BeginOutputReadLine();
                p.BeginErrorReadLine();

                p.OutputDataReceived += (object sender, DataReceivedEventArgs e) =>
                {
                    AddOutput(e.Data);
                };
                p.ErrorDataReceived += (object sender, DataReceivedEventArgs e) =>
                {
                    AddOutput(e.Data);

                    if (p != null && !p.HasExited)
                        p.Kill();
                };

                if (exitCallback != null)
                    p.Exited += (object sender, EventArgs e) =>
                    {
                        exitCallback();
                    };
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash - Error");
            }
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
            status.Text      = "Server has been stopped.";
            startButton.Text = "Start";
            running          = false;
            p                = null;

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
            else if (running)
            {
                //AddOutput("The " + changedData + " have changed, restarting server..");

                status.Text = "Restarting server..";

                shouldRestart = true;

                AttemptStopServer();
            }
        }

        private bool CheckServerLocation()
        {
            if (Directory.Exists(serverLocation) ||
                File.Exists(serverLocation + "/index.js"))
                return true;

            while (!Directory.Exists(serverLocation) ||
                !File.Exists(serverLocation + "/index.js"))
            {
                status.Text = "Server folder not located.";

                MessageBox.Show("Server folder could not be located, please select the server location.", "WebClash - Error");

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
                    serverLocation = dialog.SelectedPath;

                    return true;
                }
            }

            return false;
        }

        public void AddOutput(string msg)
        {
            try
            {
                if (msg == null)
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
            catch
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
                DialogResult manuallySelect = MessageBox.Show(
                    "NodeJS could not be found, do you want to manually select the installation folder?", 
                    "WebClash - Error", 
                    MessageBoxButtons.YesNo
                );
                
                if (manuallySelect == DialogResult.Yes)
                    using (FolderBrowserDialog dialog = new FolderBrowserDialog())
                        if (dialog.ShowDialog() == DialogResult.OK)
                            result = dialog.SelectedPath;
            }

            if (result == "")
                status.Text = "NodeJS folder not located.";
            else
                status.Text = "NodeJS folder located.";

            return result;
        }

        private void settings_Click(object sender, EventArgs e)
        {
            if (!CheckServerLocation())
                return;

            try
            {
                if (serverLocation.IndexOf("\\") == -1)
                    serverLocation = Application.StartupPath + "/" + serverLocation;

                Process.Start(new ProcessStartInfo(serverLocation + "/properties.json"));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash - Error");
            }
        }

        private void permissions_Click(object sender, EventArgs e)
        {
            if (!CheckServerLocation())
                return;

            try
            {
                if (serverLocation.IndexOf("\\") == -1)
                    serverLocation = Application.StartupPath + "/" + serverLocation;

                Process.Start(new ProcessStartInfo(serverLocation + "/permissions.json"));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash - Error");
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

            new ResetData(serverLocation).ShowDialog();
        }

        //About

        private void aboutToolStripMenuItem_Click(object sender, EventArgs e)
        {
            MessageBox.Show(
                "WebClash, an ORPG suite for the browser.\nThis binary serves as the design tool for WebClash.\n" +
                "Usable for personal and commercial usage.\n\nCreated by Arthur Baars 2019/2020\nwww.github.com/arthurb123/webclash", 

                "WebClash - About", 
                MessageBoxButtons.OK, 
                MessageBoxIcon.Information
            );
        }
    }
}
