using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;
using WebClashServer.Classes;

namespace WebClashServer.Editors
{
    public partial class MapDialogues : Form
    {
        private List<MapDialogue> dialogs = new List<MapDialogue>();
        private int current = -1;

        public MapDialogues(string title, MapDialogue[] dialogs)
        {
            InitializeComponent();

            Text = title;

            this.dialogs = new List<MapDialogue>(dialogs);
        }

        private void MapDialogues_Load(object sender, EventArgs e)
        {
            ReloadDialogueList();
        }

        private void ReloadDialogueList()
        {
            dialogueList.Items.Clear();

            try
            {
                if (dialogs.Count == 0)
                {
                    dialogueName.Enabled = false;
                    editDialogue.Enabled = false;
                }
                else
                {
                    dialogueName.Enabled = true;
                    editDialogue.Enabled = true;
                }

                for (int i = 0; i < dialogs.Count; i++)
                    dialogueList.Items.Add((i + 1) + ". " + dialogs[i].name);
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }
            
            if (current == -1 &&
                dialogs.Count > 0)
                dialogueList.SelectedItem = dialogueList.Items[0];
            else if (dialogs.Count > 0 &&
                     current < dialogs.Count)
                dialogueList.SelectedItem = dialogueList.Items[current];
        }

        private void dialogueList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (dialogueList.SelectedIndex == -1 ||
                dialogs.Count <= dialogueList.SelectedIndex)
                return;

            current = dialogueList.SelectedIndex;

            dialogueName.Text = dialogs[current].name;
        }

        private void newLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            dialogs.Add(new MapDialogue());

            ReloadDialogueList();
            dialogueList.SelectedIndex = dialogs.Count - 1;
        }

        private void delete_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == -1)
                return;

            dialogs.RemoveAt(current);
            current = -1;

            ReloadDialogueList();
        }

        private void dialogueName_TextChanged(object sender, EventArgs e)
        {
            if (current == -1)
                return;

            dialogs[current].name = dialogueName.Text;

            ReloadDialogueList();
        }

        private void editDialogue_Click(object sender, EventArgs e)
        {
            if (current == -1)
                return;

            Dialogue mapDialogue = new Dialogue(
                dialogs[current].dialog.ToList(), 
                dialogs[current].dialogElements.ToList(), 
                true
            );

            mapDialogue.Text = "Edit dialogue for '" + dialogs[current].name + "'";

            mapDialogue.FormClosed += (object s, FormClosedEventArgs fcea) => {
                dialogs[current].dialog = mapDialogue.dialogSystem.items.ToArray();
                dialogs[current].dialogElements = mapDialogue.elements.ToArray();
            };

            mapDialogue.ShowDialog();
        }

        public MapDialogue[] GetSelection()
        {
            return dialogs.ToArray();
        }
    }

    public class MapDialogue
    {
        public string name = "";

        public DialogueItem[] dialog = new DialogueItem[0];
        public CanvasElement[] dialogElements = new CanvasElement[0];
    }
}
