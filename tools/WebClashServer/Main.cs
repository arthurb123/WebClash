﻿using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;
using System.Management;
using WebClashServer.Editors;

namespace WebClashServer
{
    public partial class Main : Form
    {
        private bool running = false;

        public string location = "server";

        private Process p = null;

        public Main()
        {
            InitializeComponent();

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

            startButton.Text = "Stop";

            running = true;

            try
            {
                ProcessStartInfo pi = new ProcessStartInfo("cmd.exe", "/c node index.js");
                p = new Process();

                pi.CreateNoWindow = true;
                pi.UseShellExecute = false;

                pi.WorkingDirectory = location;

                pi.RedirectStandardError = true;
                pi.RedirectStandardOutput = true;

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
                running = false;

                startButton.Text = "Start";

                KillProcessAndChildrens(p.Id);

                status.Text = "Server has been stopped.";

                output.Text = "";

                p = null;
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
            if (!running)
                return;

            if (!InvokeRequired)
            {
                output.Text += msg + "\n";

                output.ScrollToCaret();
            }
            else
                Invoke(new Action<string>(AddOutput), msg);
        }

        private void KillProcessAndChildrens(int pid)
        {
            ManagementObjectSearcher processSearcher = new ManagementObjectSearcher
              ("Select * From Win32_Process Where ParentProcessID=" + pid);
            ManagementObjectCollection processCollection = processSearcher.Get();

            try
            {
                Process proc = Process.GetProcessById(pid);
                if (!proc.HasExited) proc.Kill();
            }
            catch (ArgumentException)
            {
                // Process already exited.
            }

            if (processCollection != null)
            {
                foreach (ManagementObject mo in processCollection)
                {
                    KillProcessAndChildrens(Convert.ToInt32(mo["ProcessID"])); //kill child processes(also kills childrens of childrens etc.)
                }
            }
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

        private void charactersToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (!CheckServerLocation())
                return;

            int amount = 0;

            Characters characters = new Characters();
            characters.VisibleChanged += (object s, EventArgs ea) =>
            {
                amount = characters.GetAmount();
            };
            characters.FormClosed += (object s, FormClosedEventArgs fcea) => {
                if (amount != characters.GetAmount())
                    AddOutput("The amount of characters has changed, changes will be visible after a server restart.");
            };

            characters.ShowDialog();
        }

        private void mapsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (!CheckServerLocation())
                return;

            int amount = 0;

            Maps maps = new Maps();
            maps.VisibleChanged += (object s, EventArgs ea) =>
            {
                amount = maps.GetAmount();
            };
            maps.FormClosed += (object s, FormClosedEventArgs fcea) => {
                if (amount != maps.GetAmount())
                    AddOutput("The amount of maps has changed, changes will be visible after a server restart.");
            };

            maps.ShowDialog();
        }

        private void NPCsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (!CheckServerLocation())
                return;

            int amount = 0;

            NPCs npcs = new NPCs();
            npcs.VisibleChanged += (object s, EventArgs ea) =>
            {
                amount = npcs.GetAmount();
            };
            npcs.FormClosed += (object s, FormClosedEventArgs fcea) => {
                if (amount != npcs.GetAmount())
                    AddOutput("The amount of NPCs has changed, changes will be visible after a server restart.");
            };

            npcs.ShowDialog();
        }

        private void actionsToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (!CheckServerLocation())
                return;

            int amount = 0;

            Actions actions = new Actions();
            actions.VisibleChanged += (object s, EventArgs ea) =>
            {
                amount = actions.GetAmount();
            };
            actions.FormClosed += (object s, FormClosedEventArgs fcea) => {
                if (amount != actions.GetAmount())
                    AddOutput("The amount of Actions has changed, changes will be visible after a server restart.");
            };

            actions.ShowDialog();
        }
    }
}
