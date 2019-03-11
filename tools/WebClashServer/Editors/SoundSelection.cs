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
            ReloadSoundList(sounds.ToArray());
        }

        private void ReloadSoundList(PossibleSound[] sounds)
        {
            soundList.Items.Clear();

            try
            {
                for (int i = 0; i < sounds.Length; i++)
                {
                    int ls = sounds[i].src.LastIndexOf('/');
                    string src = sounds[i].src;

                    if (ls != -1)
                        src = "..." + sounds[i].src.Substring(ls, sounds[i].src.Length-ls);

                    soundList.Items.Add(i + ". " + src);
                }
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }
            
            if (current == -1 &&
                sounds.Length > 0)
                soundList.SelectedItem = soundList.Items[0];
            else if (sounds.Length > 0 &&
                     current < sounds.Length)
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
            string i = soundList.Items.Count + ". " + string.Empty;

            sounds.Add(new PossibleSound());

            soundList.Items.Add(i);
            soundList.SelectedItem = i;

            soundSource.Text = "";
        }

        private void delete_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == -1)
                return;

            sounds.RemoveAt(current);

            ReloadSoundList(sounds.ToArray());
        }

        private void soundSource_TextChanged(object sender, EventArgs e)
        {
            if (current == -1)
                return;

            sounds[current].src = soundSource.Text;

            ReloadSoundList(sounds.ToArray());
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (current == -1)
                return;

            string location = Program.main.location + "/../client/" + sounds[current].src;

            if (!File.Exists(location)) {
                MessageBox.Show("The sound file could not be found, make sure it refers to an existing sound file.", "WebClash Server - Oof");

                return;
            }
            if (!location.Contains(".wav"))
            {
                MessageBox.Show("Unfortunately only .wav files can be played as of right now, however it will work in-game.", "WebClash Server - Oof");

                return;
            }

            try
            {
                SoundPlayer player = new SoundPlayer(location);
                player.Play();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "WebClash Server - Oof");
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
