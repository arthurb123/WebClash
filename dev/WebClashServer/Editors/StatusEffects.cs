using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using WebClashServer.Classes;
using WebClashServer.Editors;

namespace WebClashServer
{
    public partial class StatusEffects : Form
    {
        private StatusEffect current;
        private string oldName;

        private bool dataHasChanged = false;

        public StatusEffects()
        {
            InitializeComponent();
        }

        private void StatusEffects_Load(object sender, EventArgs e)
        {
            ReloadStatusEffects();

            if (statusEffectList.Items.Count > 0)
                statusEffectList.SelectedItem = statusEffectList.Items[0];
        }

        private void ReloadStatusEffects()
        {
            statusEffectList.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] effects = Directory.GetFiles(Program.main.serverLocation + "/effects", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                for (int i = 0; i < effects.Length; i++)
                {
                    string se = effects[i].Replace('\\', '/');

                    statusEffectList.Items.Add((i+1) + ". " + se.Substring(se.LastIndexOf('/') + 1, se.LastIndexOf('.') - se.LastIndexOf('/') - 1));
                }
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load status effects: ", exc);
            }
        }

        private void LoadStatusEffect(string statusEffectName)
        {
            if (statusEffectName == string.Empty)
                current = new StatusEffect();
            else
                current = new StatusEffect(Program.main.serverLocation + "/effects/" + statusEffectName + ".json");

            name.Text = statusEffectName;
            oldName = name.Text;

            src.Text = current.icon;

            duration.Value = current.duration;

            description.Text = current.description;

            healthTickDelta.Value = current.effects.healthTickDelta;
            manaTickDelta.Value = current.effects.manaTickDelta;
            itemFindFactor.Value = (decimal)current.effects.itemFindFactor;
            experienceGainFactor.Value = (decimal)current.effects.experienceGainFactor;
            damageFactor.Value = (decimal)current.effects.damageFactor;
            movementSpeedFactor.Value = (decimal)current.effects.movementSpeedFactor;
            castingTimeFactor.Value = (decimal)current.effects.castingTimeFactor;
            cooldownTimeFactor.Value = (decimal)current.effects.cooldownTimeFactor;

            AttemptSetIcon();
        }

        private void itemList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (statusEffectList.SelectedItem == null)
                return;

            string t = statusEffectList.SelectedItem.ToString();

            LoadStatusEffect(t.Substring(t.IndexOf(" ")+1, t.Length - t.IndexOf(" ")-1));
        }

        private void newLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            string i = (statusEffectList.Items.Count+1) + ". " + string.Empty;

            statusEffectList.Items.Add(i);
            statusEffectList.SelectedItem = i;

            LoadStatusEffect(string.Empty);
        }

        private void saveLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == null || name.Text.Length == 0)
            {
                Logger.Error("Could not save status effect as it is invalid.");
                return;
            }

            if (oldName != name.Text)
                File.Delete(Program.main.serverLocation + "/effects/" + oldName + ".json");

            File.WriteAllText(Program.main.serverLocation + "/effects/" + name.Text + ".json", JsonConvert.SerializeObject(current, Formatting.Indented));

            Logger.Message("Status effect has been saved!");

            ReloadStatusEffects();

            statusEffectList.SelectedItem = name.Text;

            dataHasChanged = true;
        }

        private void src_TextChanged(object sender, EventArgs e)
        {
            AttemptSetIcon();
        }

        private void duration_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.duration = (int)duration.Value;
        }

        private void AttemptSetIcon()
        {
            string serverLocation = Program.main.clientLocation + src.Text;

            if (!File.Exists(serverLocation))
            {
                icon.BackgroundImage = null;
                current.icon = string.Empty;
                return;
            }

            icon.BackgroundImage = Image.FromFile(serverLocation);
            current.icon = src.Text;
        }

        private void itemSounds_Click(object sender, EventArgs e)
        {
            SoundSelection soundSelection = new SoundSelection("Set sounds for status effect '" + name.Text + "'", current.sounds);

            soundSelection.FormClosed += (object s, FormClosedEventArgs fcea) => {
                current.sounds = soundSelection.GetSelection();
            };

            soundSelection.ShowDialog();
        }

        private void description_TextChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.description = description.Text;
        }

        private void delete_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == null)
            {
                Logger.Error("Could not remove item as it is invalid.");
                return;
            }

            File.Delete(Program.main.serverLocation + "/effects/" + oldName + ".json");

            ReloadStatusEffects();

            if (statusEffectList.Items.Count > 0)
                statusEffectList.SelectedItem = statusEffectList.Items[0];
            else
                newLink_LinkClicked(sender, e);

            dataHasChanged = true;
        }

        private void healthTickDelta_ValueChanged(object sender, EventArgs e)
        {
            current.effects.healthTickDelta = (int)healthTickDelta.Value;
        }

        private void manaTickDelta_ValueChanged(object sender, EventArgs e)
        {
            current.effects.manaTickDelta = (int)manaTickDelta.Value;
        }

        private void itemFindFactor_ValueChanged(object sender, EventArgs e)
        {
            current.effects.itemFindFactor = float.Parse(itemFindFactor.Value.ToString("0.00"));
        }

        private void experienceGainFactor_ValueChanged(object sender, EventArgs e)
        {
            current.effects.experienceGainFactor = float.Parse(experienceGainFactor.Value.ToString("0.00"));
        }

        private void damageFactor_ValueChanged(object sender, EventArgs e)
        {
            current.effects.damageFactor = float.Parse(damageFactor.Value.ToString("0.00"));
        }

        private void movementSpeedFactor_ValueChanged(object sender, EventArgs e)
        {
            current.effects.movementSpeedFactor = float.Parse(movementSpeedFactor.Value.ToString("0.00"));
        }

        private void castingTimeFactor_ValueChanged(object sender, EventArgs e)
        {
            current.effects.castingTimeFactor = float.Parse(castingTimeFactor.Value.ToString("0.00"));
        }

        private void cooldownTimeFactor_ValueChanged(object sender, EventArgs e)
        {
            current.effects.cooldownTimeFactor = float.Parse(cooldownTimeFactor.Value.ToString("0.00"));
        }

        public bool GetChanged()
        {
            return dataHasChanged;
        }
    }

    //Status effect classes

    public class StatusEffect
    {
        public StatusEffect()
        {

        }

        public StatusEffect(string src)
        {
            StatusEffect temp = JsonConvert.DeserializeObject<StatusEffect>(File.ReadAllText(src));

            description = temp.description;

            icon = temp.icon;

            duration = temp.duration;

            sounds = temp.sounds;

            effects = temp.effects;
        }

        public string description = "";
        public string icon = "";
        public int duration = 1;
        public PossibleSound[] sounds = new PossibleSound[0];
        public Effects effects = new Effects();
    }

    //An effects class which holds
    //all possible numerical changes

    public class Effects
    {
        public int manaTickDelta = 0;
        public int healthTickDelta = 0;
        public float itemFindFactor = 1;
        public float experienceGainFactor = 1;
        public float damageFactor = 1;
        public float movementSpeedFactor = 1;
        public float castingTimeFactor = 1;
        public float cooldownTimeFactor = 1;
    }
}
