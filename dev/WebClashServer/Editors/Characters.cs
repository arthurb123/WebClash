using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using WebClashServer.Classes;

namespace WebClashServer.Editors
{
    public partial class Characters : Form
    {
        private Character current = new Character();
        private Image currentImage;

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
                {
                    string character = c.Replace('\\', '/');

                    charSelect.Items.Add(character.Substring(character.LastIndexOf('/') + 1, character.LastIndexOf('.') - character.LastIndexOf('/') - 1));
                }

                CheckInput();
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load characters: ", exc);
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

            AttemptSetCharacterImage(current.src);
            src.Text = current.src;

            collX.Value = current.collider.x;
            collY.Value = current.collider.y;
            collWidth.Value = current.collider.width;
            collHeight.Value = current.collider.height;

            maxVelocity.Value = (decimal)current.movement.max;

            damageParticles.Checked = current.damageParticles;
            particleSource.Enabled = current.damageParticles;
            particleSource.Text = current.particleSrc;

            CheckPresentAnimations();

            canvas.Invalidate();
        }

        private void PaintCharacter(object sender, PaintEventArgs pea)
        {
            Graphics g = pea.Graphics;

            g.Clear(Color.FromKnownColor(KnownColor.ControlLight));

            if (currentImage == null)
                return;

            Point sp = new Point(
                canvas.Width / 2 - current.width / 2, 
                canvas.Height / 2 - current.height / 2
            );

            //Draw sprite

            g.DrawImage(
                currentImage, 
                new Rectangle(
                    sp.X, 
                    sp.Y, 
                    current.width, 
                    current.height
                ), 
                0, 0, 
                current.width, current.height,
                GraphicsUnit.Pixel
            );

            //Draw collider

            g.DrawRectangle(
                colliderPen, 
                new Rectangle(
                    sp.X + current.collider.x,
                    sp.Y + current.collider.y,
                    current.collider.width,
                    current.collider.height
                )
            );
        }

        private void AttemptSetCharacterImage(string src)
        {
            try
            {
                if (!File.Exists(Program.main.clientLocation + src))
                {
                    currentImage = null;

                    return;
                }

                currentImage = Image.FromFile(Program.main.clientLocation + src);

                current.src = src;
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load the character image: ", exc);
            }

            canvas.Invalidate();
        }

        private void CheckPresentAnimations()
        {
            //Check for present animations

            int present = 0;
            if (CheckPresentAnimation(current.animations.idle))
                present++;
            if (CheckPresentAnimation(current.animations.walking))
                present++;
            if (CheckPresentAnimation(current.animations.running))
                present++;
            if (CheckPresentAnimation(current.animations.casting))
                present++;
            if (CheckPresentAnimation(current.animations.attacking))
                present++;

            //Give feedback to user on amount of animations present

            if (present == 5)
            {
                presentAnimations.Text = "All Animations Available";
                presentAnimations.ForeColor = Color.Green;
            }
            else
            {
                presentAnimations.Text = "Missing " + (5 - present) + "/5 Animations";
                presentAnimations.ForeColor = Color.Red;
            }
        }

        private bool CheckPresentAnimation(AnimationSheet sheet)
        {
            if (sheet.useOther)
            {
                AnimationSheet other = CharacterAnimations.GrabSheet(current, sheet.other);

                if (other == null)
                    return false;

                return CheckPresentAnimation(other);
            }

            return !sheet.IsEmpty();
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
            AttemptSetCharacterImage(src.Text);
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

        private void setupAnimations_Click(object sender, EventArgs e)
        {
            CharacterAnimations charAnimations = new CharacterAnimations(current, currentImage, name.Text);

            charAnimations.FormClosed += new FormClosedEventHandler((_, __) =>
            {
                CheckPresentAnimations();
            });
            charAnimations.ShowDialog();
        }

        private void save_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (name.Text.Length == 0)
            {
                Logger.Error("This character cannot be saved as it has an invalid name.");

                return;
            }

            File.WriteAllText(Program.main.serverLocation + "/characters/" + name.Text + ".json", JsonConvert.SerializeObject(current, Formatting.Indented));

            Logger.Message("Character has been saved!");

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
                Logger.Error("This character cannot be deleted as it does not exist yet.");

                return;
            }

            File.Delete(Program.main.serverLocation + "/characters/" + name.Text + ".json");

            ReloadCharacters();

            if (charSelect.Items.Count > 0)
                charSelect.SelectedItem = charSelect.Items[0];

            dataHasChanged = true;
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
        public Character() { }

        public Character(string source)
        {
            try
            {
                Character temp = JsonConvert.DeserializeObject<Character>(File.ReadAllText(source));

                width = temp.width;
                height = temp.height;

                animations = temp.animations;

                src = temp.src;

                collider = temp.collider;
                movement = temp.movement;

                sounds = temp.sounds;

                damageParticles = temp.damageParticles;
                particleSrc = temp.particleSrc;
            }
            catch (Exception exc)
            {
                Logger.Error("Could not construct character instance: ", exc);
            }
        }

        //Character graphics

        public string src = "";

        public int width = 64,
                   height = 64;

        //Animation sheets

        public Animations animations = new Animations();

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

    public class Animations
    {
        //Animation sheets

        public AnimationSheet idle      = new AnimationSheet("Idle");
        public AnimationSheet walking   = new AnimationSheet("Walking");
        public AnimationSheet running   = new AnimationSheet("Running");
        public AnimationSheet casting   = new AnimationSheet("Casting");
        public AnimationSheet attacking = new AnimationSheet("Attacking");
    }

    public class AnimationSheet
    {
        [JsonIgnore]
        public string name = "";

        public AnimationSheet(string name)
        {
            this.name = name;
        }

        public bool IsEmpty()
        {
            for (int fl = 0; fl < frames.Length; fl++)
                if (frames[fl].Length != 0)
                    return false;

            return true;
        }

        public int speed = 100;
        public Point2D[][] frames = new Point2D[][]
        {
            new Point2D[0],
            new Point2D[0],
            new Point2D[0],
            new Point2D[0]
        };

        public bool useOther = false;
        public string other = "";
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
