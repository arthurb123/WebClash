using System;
using System.Windows.Forms;

namespace WebClashServer.Input
{
    public partial class NumberInput : Form
    {
        public NumberInput(string title, string prompt, double value = 0)
        {
            InitializeComponent();

            Text = title;
            this.prompt.Text = prompt;
            input.Value = (decimal)value;
        }

        private void confirm_Click(object sender, EventArgs e)
        {
            DialogResult = DialogResult.OK;
        }

        public double GetResult()
        {
            return (double)input.Value;
        }
    }
}
