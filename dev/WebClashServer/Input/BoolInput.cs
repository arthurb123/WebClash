using System;
using System.Windows.Forms;

namespace WebClashServer.Input
{
    public partial class BoolInput : Form
    {
        public BoolInput(string title, string prompt, bool value)
        {
            InitializeComponent();

            Text = title;
            this.prompt.Text = prompt;
            input.Checked = value;
        }

        private void confirm_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.OK;
        }

        public bool GetResult()
        {
            return input.Checked;
        }
    }
}
