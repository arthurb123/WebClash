using System;
using System.Windows.Forms;
using WebClashServer.Classes;

namespace WebClashServer.Editors
{
    public partial class DialogueEventProperties : Form
    {
        public DialogueEvent current;

        public DialogueEventProperties(DialogueEvent de)
        {
            InitializeComponent();

            current = de;
        }

        private void DialogueEventProperties_Load(object sender, EventArgs e)
        {
            
        }
    }
}
