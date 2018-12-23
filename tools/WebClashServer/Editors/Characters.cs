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

        public Characters()
        {
            InitializeComponent();
        }

        private void Characters_Load(object sender, EventArgs e)
        {
            canvas.Paint += new PaintEventHandler(PaintCharacter);

            direction.SelectedItem = "Horizontal";

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

                string[] characters = Directory.GetFiles(Program.main.location + "/characters", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                foreach (string c in characters)
                    charSelect.Items.Add(c.Substring(c.LastIndexOf('\\') + 1, c.LastIndexOf('.') - c.LastIndexOf('\\') - 1));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }
        }

        private void LoadCharacter(string charName)
        {
            if (charName == string.Empty)
                current = new Character();
            else
                current = new Character(Program.main.location + "/characters/" + charName + ".json");

            name.Text = charName;

            width.Value = current.width;
            height.Value = current.height;

            AttemptSetCharImage(current.src);

            src.Text = current.src;

            //Set direction

            speed.Value = current.animation.speed;

            collX.Value = current.collider.x;
            collY.Value = current.collider.y;
            collWidth.Value = current.collider.width;
            collHeight.Value = current.collider.height;

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

            g.DrawImage(charImage, new Rectangle(sp.X, sp.Y, current.width, current.height), animFrame * current.width, 0, current.width, current.height, GraphicsUnit.Pixel);

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
                if (!File.Exists(Program.main.location + "/../client/" + src))
                {
                    charImage = null;

                    return;
                }

                charImage = Image.FromFile(Program.main.location + "/../client/" + src);

                animation.Interval = (1000 / 60) * current.animation.speed;

                current.src = src;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash Server - Error");
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
            LoadCharacter(charSelect.SelectedItem.ToString());
        }

        private void src_TextChanged(object sender, EventArgs e)
        {
            AttemptSetCharImage(src.Text);
        }

        private void width_ValueChanged(object sender, EventArgs e)
        {
            current.width = (int)width.Value;
        }

        private void height_ValueChanged(object sender, EventArgs e)
        {
            current.width = (int)height.Value;
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
                MessageBox.Show("This character cannot be saved as it has an invalid name.", "WebClash Server - Error");

                return;
            }

            File.WriteAllText(Program.main.location + "/characters/" + name.Text + ".json", JsonConvert.SerializeObject(current));

            MessageBox.Show("Character has been saved!", "WebClash Server - Message");

            ReloadCharacters();

            charSelect.SelectedItem = name.Text;
        }

        private void add_Click(object sender, EventArgs e)
        {
            charSelect.Items.Add(string.Empty);

            charSelect.SelectedItem = string.Empty;
        }

        private void delete_Click(object sender, EventArgs e)
        {
            if (!File.Exists(Program.main.location + "/characters/" + name.Text + ".json"))
            {
                MessageBox.Show("This character cannot be deleted as it does not exist yet.", "WebClash Server - Error");

                return;
            }

            if (name.Text == "player")
            {
                MessageBox.Show("The player character cannot be removed, this is a standard character.", "WebClash Server - Error");

                return;
            }

            File.Delete(Program.main.location + "/characters/" + name.Text + ".json");

            ReloadCharacters();

            if (charSelect.Items.Count > 0)
                charSelect.SelectedItem = charSelect.Items[0];
        }

        public int GetAmount()
        {
            return charSelect.Items.Count; 
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
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash Server - Error");
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
    }

    public class Animation
    {
        public string direction = "horizontal";

        public int speed = 8;
    }

    public class Collider
    {
        public int x = 0,
                   y = 0;

        public int width = 64,
                   height = 64;
    }
}
