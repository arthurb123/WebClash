using System;
using System.Collections.Generic;
using System.IO;
using System.Media;
using System.Windows.Forms;

namespace WebClashServer.Editors
{
    public partial class SoundSelection : Form
    {
        private List<PossibleSound> sounds = new List<PossibleSound>();
        private int current = -1;

        public SoundSelection(string title, PossibleSound[] sounds)
        {
            InitializeComponent();

            Text = title;

            this.sounds = new List<PossibleSound>(sounds);
        }

        private void SoundSelection_Load(object sender, EventArgs e)
        {
            ReloadSoundList();
        }

        private void ReloadSoundList()
        {
            soundList.Items.Clear();

            try
            {
                if (sounds.Count == 0)
                    soundSource.Enabled = false;
                else
                    soundSource.Enabled = true;

                for (int i = 0; i < sounds.Count; i++)
                {
                    int ls = sounds[i].src.LastIndexOf('/');
                    string src = sounds[i].src;

                    if (ls != -1)
                        src = "..." + sounds[i].src.Substring(ls, sounds[i].src.Length-ls);

                    soundList.Items.Add((i + 1) + ". " + src);
                }
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash - Error");
            }
            
            if (current == -1 &&
                sounds.Count > 0)
                soundList.SelectedItem = soundList.Items[0];
            else if (sounds.Count > 0 &&
                     current < sounds.Count)
                soundList.SelectedItem = soundList.Items[current];
        }

        private void soundList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (soundList.SelectedIndex == -1 ||
                sounds.Count <= soundList.SelectedIndex)
                return;

            current = soundList.SelectedIndex;

            soundSource.Text = sounds[current].src;
        }

        private void newLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            sounds.Add(new PossibleSound());

            ReloadSoundList();
            soundList.SelectedIndex = sounds.Count - 1;
        }

        private void delete_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == -1)
                return;

            sounds.RemoveAt(current);
            current = -1;

            ReloadSoundList();
        }

        private void soundSource_TextChanged(object sender, EventArgs e)
        {
            if (current == -1)
                return;

            sounds[current].src = soundSource.Text;

            ReloadSoundList();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (current == -1)
                return;

            string serverLocation = Program.main.serverLocation + "/../client/" + sounds[current].src;

            if (!File.Exists(serverLocation)) {
                MessageBox.Show("The sound file could not be found, make sure it refers to an existing sound file.", "WebClash - Error");

                return;
            }
            if (!serverLocation.Contains(".wav"))
            {
                MessageBox.Show("Unfortunately only .wav files can be played as of right now, however it will work in-game.", "WebClash - Error");

                return;
            }

            try
            {
                SoundPlayer player = new SoundPlayer(serverLocation);
                player.Play();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "WebClash - Error");
            }
        }

        public PossibleSound[] GetSelection()
        {
            return sounds.ToArray();
        }
    }

    public class PossibleSound
    {
        public string src = "";
    }
}
