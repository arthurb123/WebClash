using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace WebClashServer.Editors
{
    public partial class Characters : Form
    {
        Character current = new Character();

        int animFrame = 0;

        Image charImage;

        private Pen colliderPen = new Pen(Brushes.Purple, 2);

        private bool dataHasChanged = false;

        public Characters()
        {
            InitializeComponent();
        }

        private void Characters_Load(object sender, EventArgs e)
        {
            canvas.Paint += new PaintEventHandler(PaintCharacter);

            ReloadCharacters();

            if (charSelect.Items.Count > 0)
                charSelect.SelectedItem = charSelect.Items[0];
        }

        private void ReloadCharacters()
        {
            charSelect.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] characters = Directory.GetFiles(Program.main.serverLocation + "/characters", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                foreach (string c in characters)
                    charSelect.Items.Add(c.Substring(c.LastIndexOf('\\') + 1, c.LastIndexOf('.') - c.LastIndexOf('\\') - 1));

                CheckInput();
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash - Error");
            }
        }

        private void CheckInput()
        {
            if (charSelect.Items.Count == 0)
            {
                generalGroupBox.Enabled = false;
                movementGroupBox.Enabled = false;
                colliderGroupBox.Enabled = false;
                animationGroupBox.Enabled = false;
                soundGroupBox.Enabled = false;
                miscGroupBox.Enabled = false;
            }
            else
            {
                generalGroupBox.Enabled = true;
                movementGroupBox.Enabled = true;
                colliderGroupBox.Enabled = true;
                animationGroupBox.Enabled = true;
                soundGroupBox.Enabled = true;
                miscGroupBox.Enabled = true;
            }
        }

        private void LoadCharacter(string charName)
        {
            if (charName == string.Empty)
                current = new Character();
            else
                current = new Character(Program.main.serverLocation + "/characters/" + charName + ".json");

            name.Text = charName;

            width.Value = current.width;
            height.Value = current.height;

            AttemptSetCharImage(current.src);
            src.Text = current.src;

            direction.SelectedItem = current.animation.direction.First().ToString().ToUpper() + current.animation.direction.Substring(1);
            speed.Value = current.animation.speed;
            alwaysAnimate.Checked = current.animation.alwaysAnimate;

            collX.Value = current.collider.x;
            collY.Value = current.collider.y;
            collWidth.Value = current.collider.width;
            collHeight.Value = current.collider.height;

            maxVelocity.Value = (decimal)current.movement.max;

            damageParticles.Checked = current.damageParticles;
            particleSource.Enabled = current.damageParticles;
            particleSource.Text = current.particleSrc;

            canvas.Invalidate();
        }

        private void PaintCharacter(object sender, PaintEventArgs pea)
        {
            Graphics g = pea.Graphics;

            g.Clear(Color.FromKnownColor(KnownColor.ControlLight));

            if (charImage == null)
                return;

            Point sp = new Point(canvas.Width / 2 - current.width / 2, canvas.Height / 2 - current.height / 2);

            //Draw sprite

            if (current.animation.direction == "horizontal")
                g.DrawImage(charImage, new Rectangle(sp.X, sp.Y, current.width, current.height), animFrame * current.width, 0, current.width, current.height, GraphicsUnit.Pixel);
            else if (current.animation.direction == "vertical")
                g.DrawImage(charImage, new Rectangle(sp.X, sp.Y, current.width, current.height), 0, animFrame * current.height, current.width, current.height, GraphicsUnit.Pixel);

            //Draw collider

            g.DrawRectangle(colliderPen, new Rectangle(
                sp.X + current.collider.x,
                sp.Y + current.collider.y,
                current.collider.width,
                current.collider.height
            ));
        }

        private void AttemptSetCharImage(string src)
        {
            try
            {
                if (!File.Exists(Program.main.serverLocation + "/../client/" + src))
                {
                    charImage = null;

                    return;
                }

                charImage = Image.FromFile(Program.main.serverLocation + "/../client/" + src);

                animation.Interval = (1000 / 60) * current.animation.speed;

                current.src = src;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash - Error");
            }

            canvas.Invalidate();
        }

        private void animation_Tick(object sender, EventArgs e)
        {
            if (charImage == null)
            {
                animFrame = 0;

                return;
            }

            animFrame++;

            if (animFrame * current.width >= charImage.Width)
                animFrame = 0;

            canvas.Invalidate();
        }

        private void charSelect_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (charSelect.SelectedItem.ToString() != "New Character")
                LoadCharacter(charSelect.SelectedItem.ToString());
            else
                LoadCharacter(string.Empty);
        }

        private void src_TextChanged(object sender, EventArgs e)
        {
            AttemptSetCharImage(src.Text);
        }

        private void width_ValueChanged(object sender, EventArgs e)
        {
            current.width = (int)width.Value;

            canvas.Invalidate();
        }

        private void height_ValueChanged(object sender, EventArgs e)
        {
            current.height = (int)height.Value;

            canvas.Invalidate();
        }

        private void speed_ValueChanged(object sender, EventArgs e)
        {
            current.animation.speed = (int)speed.Value;

            animation.Interval = (1000 / 60) * current.animation.speed;
        }

        private void save_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (name.Text.Length == 0)
            {
                MessageBox.Show("This character cannot be saved as it has an invalid name.", "WebClash - Error");

                return;
            }

            File.WriteAllText(Program.main.serverLocation + "/characters/" + name.Text + ".json", JsonConvert.SerializeObject(current, Formatting.Indented));

            MessageBox.Show("Character has been saved!", "WebClash - Message");

            ReloadCharacters();

            charSelect.SelectedItem = name.Text;

            dataHasChanged = true;
        }

        private void add_Click(object sender, EventArgs e)
        {
            if (charSelect.SelectedItem != null &&
                charSelect.SelectedItem.ToString() == "New Character")
                return;

            charSelect.Items.Add("New Character");
            charSelect.SelectedItem = "New Character";

            CheckInput();
        }

        private void delete_Click(object sender, EventArgs e)
        {
            if (!File.Exists(Program.main.serverLocation + "/characters/" + name.Text + ".json"))
            {
                MessageBox.Show("This character cannot be deleted as it does not exist yet.", "WebClash - Error");

                return;
            }

            File.Delete(Program.main.serverLocation + "/characters/" + name.Text + ".json");

            ReloadCharacters();

            if (charSelect.Items.Count > 0)
                charSelect.SelectedItem = charSelect.Items[0];

            dataHasChanged = true;
        }

        private void alwaysAnimate_CheckedChanged(object sender, EventArgs e)
        {
            current.animation.alwaysAnimate = alwaysAnimate.Checked;
        }

        private void collX_ValueChanged(object sender, EventArgs e)
        {
            current.collider.x = (int)collX.Value;

            canvas.Invalidate();
        }

        private void collY_ValueChanged(object sender, EventArgs e)
        {
            current.collider.y = (int)collY.Value;

            canvas.Invalidate();
        }

        private void collWidth_ValueChanged(object sender, EventArgs e)
        {
            current.collider.width = (int)collWidth.Value;

            canvas.Invalidate();
        }

        private void collHeight_ValueChanged(object sender, EventArgs e)
        {
            current.collider.height = (int)collHeight.Value;

            canvas.Invalidate();
        }

        private void maxVelocity_ValueChanged(object sender, EventArgs e)
        {
            current.movement.max = float.Parse(maxVelocity.Value.ToString("0.00"));
        }

        private void direction_SelectedIndexChanged(object sender, EventArgs e)
        {
            current.animation.direction = direction.SelectedItem.ToString().ToLower();

            canvas.Invalidate();
        }

        private void onHitSounds_Click(object sender, EventArgs e)
        {
            SoundSelection soundSelection = new SoundSelection("Set hit sounds for '" + name.Text + "'", current.sounds.hitSounds);

            soundSelection.FormClosed += (object s, FormClosedEventArgs fcea) => {
                current.sounds.hitSounds = soundSelection.GetSelection();
            };

            soundSelection.ShowDialog();
        }

        private void onDeathSounds_Click(object sender, EventArgs e)
        {
            SoundSelection soundSelection = new SoundSelection("Set death sounds for '" + name.Text + "'", current.sounds.deathSounds);

            soundSelection.FormClosed += (object s, FormClosedEventArgs fcea) => {
                current.sounds.deathSounds = soundSelection.GetSelection();
            };

            soundSelection.ShowDialog();
        }

        private void damageParticles_CheckedChanged(object sender, EventArgs e)
        {
            particleSource.Enabled = damageParticles.Checked;

            current.damageParticles = damageParticles.Checked;
        }

        private void particleSource_TextChanged(object sender, EventArgs e)
        {
            current.particleSrc = particleSource.Text;
        }

        public bool GetChanged()
        {
            return dataHasChanged;
        }
    }

    public class Character
    {
        public Character()
        {

        }

        public Character(string source)
        {
            try
            {
                Character temp = JsonConvert.DeserializeObject<Character>(File.ReadAllText(source));

                width = temp.width;
                height = temp.height;

                src = temp.src;

                animation = temp.animation;
                collider = temp.collider;
                movement = temp.movement;

                sounds = temp.sounds;

                damageParticles = temp.damageParticles;
                particleSrc = temp.particleSrc;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash - Error");
            }
        }

        //Character graphics

        public string src = "";

        public int width = 64,
                   height = 64;

        //Animation

        public Animation animation = new Animation();

        //Collider

        public Collider collider = new Collider();

        //Movement

        public Movement movement = new Movement();

        //Audio

        public CharacterSounds sounds = new CharacterSounds();

        //Misc

        public bool damageParticles = false;
        public string particleSrc = "";
    }

    public class Animation
    {
        public string direction = "horizontal";

        public int speed = 8;

        public bool alwaysAnimate = false;
    }

    public class Collider
    {
        public int x = 0,
                   y = 0;

        public int width = 64,
                   height = 64;
    }

    public class Movement
    {
        public float max = 1.50f;
    }

    public class CharacterSounds
    {
        public PossibleSound[] hitSounds = new PossibleSound[0];
        public PossibleSound[] deathSounds = new PossibleSound[0];
    }
}
