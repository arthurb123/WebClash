using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;
using System.Management;

namespace WebClashServer
{
    public partial class Main : Form
    {
        private bool running = false;

        private string location = "server";

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
            {
                AttemptStartServer();

                startButton.Text = "Stop";
            }
            else
            {
                AttemptStopServer();

                startButton.Text = "Start";
            }
        }

        private void AttemptStartServer()
        {
            if (p != null)
                return;

            CheckServerLocation();

            running = true;
            
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

        private void AttemptStopServer()
        {
            if (running)
            {
                running = false;

                KillProcessAndChildrens(p.Id);

                output.Text = "";
            }
        }

        private void CheckServerLocation()
        {
            if (!Directory.Exists(location) ||
                !File.Exists(location + "/index.js"))
            {
                RequestServerLocation();

                return;
            }
        }

        private void RequestServerLocation()
        {
            using (FolderBrowserDialog dialog = new FolderBrowserDialog())
            {
                if (dialog.ShowDialog() == DialogResult.OK)
                    location = dialog.SelectedPath;
            }
        }

        public void AddOutput(string msg)
        {
            if (!running)
                return;

            if (!InvokeRequired)
                output.Text += msg;
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
    }
}
