using System;
using System.Windows.Forms;

namespace WebClashServer.Input
{
    public partial class TextInput : Form
    {
        public TextInput(string title, string prompt, string value = "")
        {
            InitializeComponent();

            Text = title;
            this.prompt.Text = prompt;
            input.Text = value;
        }

        private void confirm_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.OK;
        }

        public string GetResult()
        {
            return input.Text;
        }
    }
}
