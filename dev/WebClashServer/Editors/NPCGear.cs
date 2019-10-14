using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace WebClashServer.Editors
{
    public partial class NPCGear : Form
    {
        //Character and animation

        private string charName;

        private Character character = new Character();
        private int animFrame = 0;
        private Image charImage;

        //Gear

        private List<string> gear = new List<string>();
        private List<GearImage> gearImages = new List<GearImage>();
        private int current = -1;

        public NPCGear(string title, string charName, string[] gear)
        {
            InitializeComponent();

            Text = title;

            this.charName = charName;
            this.gear = gear.ToList();
        }

        private void NPCGear_Load(object sender, EventArgs e)
        {
            canvas.Paint += new PaintEventHandler(PaintCharacter);

            LoadCharacter();

            ReloadGearList();
        }

        private void ReloadGearList()
        {
            gearList.Items.Clear();

            try
            {
                if (gear.Count == 0)
                {
                    moveDown.Enabled = false;
                    moveUp.Enabled = false;
                    gearSource.Enabled = false;
                } else
                {
                    moveDown.Enabled = true;
                    moveUp.Enabled = true;
                    gearSource.Enabled = true;
                }

                for (int i = 0; i < gear.Count; i++)
                {
                    int ls = gear[i].LastIndexOf('/');
                    string src = gear[i];

                    if (ls != -1)
                        src = "..." + gear[i].Substring(ls, gear[i].Length - ls);

                    gearList.Items.Add((i+1) + ". " + src);
                }

                LoadGearImages();
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }

            if (current == -1 &&
                gear.Count > 0)
                gearList.SelectedIndex = 0;
            else if (gear.Count > 0 &&
                     current < gear.Count)
                gearList.SelectedIndex = current;
        }

        private void LoadGearImages()
        {
            for (int i = 0; i < gear.Count; i++)
            {
                string location = Program.main.location + "/../client/" + gear[i];

                if (!File.Exists(location))
                    continue;

                if (i >= gearImages.Count)
                    gearImages.Add(new GearImage(location));
                else if (gearImages[i].source != gear[i])
                    gearImages[i] = new GearImage(location);
            }
        }

        private void LoadCharacter()
        {
            character = new Character(Program.main.location + "/characters/" + charName + ".json");

            AttemptSetCharImage(character.src);

            canvas.Invalidate();
        }

        private void PaintCharacter(object sender, PaintEventArgs pea)
        {
            Graphics g = pea.Graphics;

            g.Clear(Color.FromKnownColor(KnownColor.ControlLight));

            if (charImage == null)
                return;

            Point sp = new Point(canvas.Width / 2 - character.width / 2, canvas.Height / 2 - character.height / 2);

            //Draw sprite

            if (character.animation.direction == "horizontal")
                g.DrawImage(
                    charImage, 
                    new Rectangle(sp.X, sp.Y, character.width, character.height), 
                    animFrame * character.width, 
                    0, 
                    character.width, 
                    character.height, 
                    GraphicsUnit.Pixel
                );
            else if (character.animation.direction == "vertical")
                g.DrawImage(
                    charImage, 
                    new Rectangle(sp.X, sp.Y, character.width, character.height), 
                    0, 
                    animFrame * character.height, 
                    character.width, 
                    character.height, 
                    GraphicsUnit.Pixel
                );

            //Draw gear

            for (int i = 0; i < gearImages.Count; i++)
                if (gearImages[i] != null && gearImages[i].image != null)
                    g.DrawImage(
                        gearImages[i].image,
                        new Rectangle(sp.X, sp.Y, character.width, character.height),
                        animFrame * character.width,
                        0,
                        character.width,
                        character.height,
                        GraphicsUnit.Pixel
                    );
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

                animation.Interval = (1000 / 60) * character.animation.speed;

                character.src = src;
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

            if (animFrame * character.width >= charImage.Width)
                animFrame = 0;

            canvas.Invalidate();
        }

        private void gearList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (gearList.SelectedIndex == -1 ||
                gear.Count <= gearList.SelectedIndex)
                return;

            current = gearList.SelectedIndex;

            gearSource.Text = gear[current];
        }

        private void newLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            gear.Add("");

            ReloadGearList();
            gearList.SelectedIndex = gear.Count - 1;
        }

        private void delete_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == -1)
                return;

            gear.RemoveAt(current);
            if (current < gearImages.Count)
                gearImages.RemoveAt(current);

            current = -1;

            ReloadGearList();
        }

        private void gearSource_TextChanged(object sender, EventArgs e)
        {
            if (current == -1)
                return;

            gear[current] = gearSource.Text;

            ReloadGearList();
        }

        private void swapGear(int indexA, int indexB)
        {
            string tmpGear = gear[indexA];
            gear[indexA] = gear[indexB];
            gear[indexB] = tmpGear;

            if (indexA < gearImages.Count &&
                indexB < gearImages.Count)
            {
                GearImage tmpGearImage = gearImages[indexA];
                gearImages[indexA] = gearImages[indexB];
                gearImages[indexB] = tmpGearImage;
            }

            ReloadGearList();
        }

        private void moveDown_Click(object sender, EventArgs e)
        {
            if (current == -1 || gear.Count == 1)
                return;

            if (current == gear.Count - 1)
            {
                swapGear(current, 0);
                gearList.SelectedIndex = 0;
            }
            else
            {
                swapGear(current, current + 1);
                gearList.SelectedIndex = current + 1;
            }
        }

        private void moveUp_Click(object sender, EventArgs e)
        {
            if (current == -1 || gear.Count == 1)
                return;

            if (current == 0)
            {
                swapGear(current, gear.Count-1);
                gearList.SelectedIndex = gear.Count-1;
            }
            else
            {
                swapGear(current, current - 1);
                gearList.SelectedIndex = current - 1;
            }
        }

        public string[] GetSelection()
        {
            return gear.ToArray();
        }
    }

    public class GearImage
    {
        public GearImage(string source)
        {
            this.source = source;
            image = Image.FromFile(source);
        }

        public string source = "";
        public Image image;
    }
}
