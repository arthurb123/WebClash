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

            canvas.Invalidate();
        }

        private void PaintCharacter(object sender, PaintEventArgs pea)
        {
            Graphics g = pea.Graphics;

            g.Clear(Color.FromKnownColor(KnownColor.ControlLight));

            if (charImage == null)
                return;

            g.DrawImage(charImage, new Rectangle(0, 0, canvas.Width, canvas.Height), animFrame * current.width, 0, current.width, current.height, GraphicsUnit.Pixel);
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
            if (name.Text.Length == 0 || !File.Exists(Program.main.location + "/characters/" + name.Text + ".json"))
            {
                MessageBox.Show("This character cannot be deleted as it is invalid.", "WebClash Server - Error");

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
    }

    public class Animation
    {
        public string direction = "horizontal";

        public int speed = 8;
    }
}
