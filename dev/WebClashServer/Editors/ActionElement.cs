using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using WebClashServer.Classes;

namespace WebClashServer.Editors
{
    public partial class ActionElement : Form
    {
        private Element current;
        private Control parentCanvas;

        public ActionElement(Element element, Control canvas, int elementId)
        {
            current = element;
            parentCanvas = canvas;

            InitializeComponent();

            Text = "WebClash - Edit action element #" + elementId;
        }

        private void ActionElement_Load(object sender, EventArgs e)
        {
            ReloadStatusEffects();

            LoadProperties();

            propertyView.SelectedIndex = 0;
        }

        private void LoadProperties()
        {
            //Position

            elementX.Value = current.x;
            elementY.Value = current.y;

            //Scaling

            power.Value = (decimal)current.scaling.power;
            intelligence.Value = (decimal)current.scaling.intelligence;
            wisdom.Value = (decimal)current.scaling.wisdom;
            agility.Value = (decimal)current.scaling.agility;
            toughness.Value = (decimal)current.scaling.toughness;
            vitality.Value = (decimal)current.scaling.vitality;

            //Appearance

            source.Text = current.src;

            width.Value = current.w;
            height.Value = current.h;

            scale.Value = (decimal)current.scale;
            speed.Value = current.speed;

            delay.Value = (int)Math.Round((double)current.delay * (1000d / 60));

            animationEnabled.Checked = current.animated;
            speed.Enabled = current.animated;
            direction.Enabled = current.animated;
            projectileRotates.Checked = current.rotates;

            projectileSpeed.Value = current.projectileSpeed;
            projectileDistance.Value = current.projectileDistance;

            if (current.direction == "horizontal")
                direction.SelectedItem = "Horizontal";
            else if (current.direction == "vertical")
                direction.SelectedItem = "Vertical";

            //Behaviour

            delay.Value = (int)Math.Round((double)current.delay * (1000d / 60d));

            propertyType.SelectedItem = char.ToUpper(current.type[0]) + current.type.Substring(1, current.type.Length - 1);

            animationEnabled.Checked = current.animated;
            projectileRotates.Checked = current.rotates;

            projectileSpeed.Value = current.projectileSpeed;
            projectileDistance.Value = current.projectileDistance;

            //Status effects

            statusEffectSelect.SelectedItem = current.statusEffect;
        }

        private void ReloadStatusEffects()
        {
            statusEffectSelect.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] effects = Directory.GetFiles(Program.main.serverLocation + "/effects", "*.*", SearchOption.AllDirectories)
                    .Where(e => ext.Contains(Path.GetExtension(e))).ToArray();

                statusEffectSelect.Items.Add("");

                foreach (string e in effects)
                {
                    string effect = e.Replace('\\', '/');

                    statusEffectSelect.Items.Add(effect.Substring(effect.LastIndexOf('/') + 1, effect.LastIndexOf('.') - effect.LastIndexOf('/') - 1));
                }
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load status effects: ", exc);
            }
        }

        //Position 

        private void elementX_ValueChanged(object sender, EventArgs e)
        {
            current.x = (int)elementX.Value;

            parentCanvas.Invalidate();
        }

        private void elementY_ValueChanged(object sender, EventArgs e)
        {
            current.y = (int)elementY.Value;

            parentCanvas.Invalidate();
        }

        //Appearance panel

        private void width_ValueChanged(object sender, EventArgs e)
        {
            current.w = (int)width.Value;

            parentCanvas.Invalidate();
        }

        private void height_ValueChanged(object sender, EventArgs e)
        {
            current.h = (int)height.Value;

            parentCanvas.Invalidate();
        }

        private void scale_ValueChanged(object sender, EventArgs e)
        {
            current.scale = float.Parse(scale.Value.ToString("0.000")); ;

            parentCanvas.Invalidate();
        }

        private void source_TextChanged(object sender, EventArgs e)
        {
            current.src = source.Text;

            parentCanvas.Invalidate();
        }

        private void speed_ValueChanged(object sender, EventArgs e)
        {
            current.speed = (int)speed.Value;
        }

        private void direction_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (direction.SelectedItem.ToString() == "Horizontal")
                current.direction = "horizontal";
            else if (direction.SelectedItem.ToString() == "Vertical")
                current.direction = "vertical";
        }

        private void power_ValueChanged(object sender, EventArgs e)
        {
            current.scaling.power = float.Parse(power.Value.ToString("0.000"));
        }

        private void agility_ValueChanged(object sender, EventArgs e)
        {
            current.scaling.agility = float.Parse(agility.Value.ToString("0.000"));
        }

        private void toughness_ValueChanged(object sender, EventArgs e)
        {
            current.scaling.toughness = float.Parse(toughness.Value.ToString("0.000"));
        }

        private void intelligence_ValueChanged(object sender, EventArgs e)
        {
            current.scaling.intelligence = float.Parse(intelligence.Value.ToString("0.000"));
        }

        private void wisdom_ValueChanged(object sender, EventArgs e)
        {
            current.scaling.wisdom = float.Parse(wisdom.Value.ToString("0.000"));
        }

        private void vitality_ValueChanged(object sender, EventArgs e)
        {
            current.scaling.vitality = float.Parse(vitality.Value.ToString("0.000"));
        }

        private void propertyView_SelectedIndexChanged(object sender, EventArgs e)
        {
            switch (propertyView.SelectedItem.ToString())
            {
                case "Appearance":
                    appearancePanel.Visible = true;
                    behaviourPanel.Visible = false;
                    statusEffectsPanel.Visible = false;

                    break;
                case "Behaviour":
                    appearancePanel.Visible = false;
                    behaviourPanel.Visible = true;
                    statusEffectsPanel.Visible = false;

                    break;
                case "Status Effects":
                    appearancePanel.Visible = false;
                    behaviourPanel.Visible = false;
                    statusEffectsPanel.Visible = true;

                    break;
            }
        }

        //Behaviour panel

        private void delay_ValueChanged(object sender, EventArgs e)
        {
            current.delay = (int)Math.Round((double)delay.Value / (1000d/60d));
        }

        private void animationEnabled_CheckedChanged(object sender, EventArgs e)
        {
            current.animated = animationEnabled.Checked;

            speed.Enabled = current.animated;
            direction.Enabled = current.animated;
        }

        private void projectileRotates_CheckedChanged(object sender, EventArgs e)
        {
            current.rotates = projectileRotates.Checked;
        }

        private void projectileSpeed_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.projectileSpeed = (int)projectileSpeed.Value;
        }

        private void projectileDistance_ValueChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.projectileDistance = (int)projectileDistance.Value;
        }

        private void propertyType_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.type = propertyType.SelectedItem.ToString().ToLower();

            if (current.type == "projectile")
            {
                projectilePanel.Visible = true;
            }
            else
            {
                animationEnabled.Checked = true;

                projectilePanel.Visible = false;
            }

            parentCanvas.Invalidate();
        }

        //Status effects panel

        private void statusEffectSelect_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.statusEffect = statusEffectSelect.SelectedItem.ToString();
        }
    }
}
