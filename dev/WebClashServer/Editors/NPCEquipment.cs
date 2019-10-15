using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace WebClashServer.Editors
{
    public partial class NPCEquipment : Form
    {
        //Character and animation

        private string charName;

        private Character character = new Character();
        private int animFrame = 0;
        private Image charImage;

        //Gear

        private List<string> equipment = new List<string>();
        private List<EquipmentImage> equipmentImages = new List<EquipmentImage>();
        private int current = -1;

        public NPCEquipment(string title, string charName, string[] equipment)
        {
            InitializeComponent();

            Text = title;

            this.charName = charName;
            this.equipment = equipment.ToList();
        }

        private void NPCGear_Load(object sender, EventArgs e)
        {
            canvas.Paint += new PaintEventHandler(PaintCharacter);

            LoadCharacter();

            ReloadGearList();
        }

        private void ReloadGearList()
        {
            equipmentList.Items.Clear();

            try
            {
                if (equipment.Count == 0)
                {
                    moveDown.Enabled = false;
                    moveUp.Enabled = false;
                    equipmentSource.Enabled = false;
                } else
                {
                    moveDown.Enabled = true;
                    moveUp.Enabled = true;
                    equipmentSource.Enabled = true;
                }

                for (int i = 0; i < equipment.Count; i++)
                {
                    int ls = equipment[i].LastIndexOf('/');
                    string src = equipment[i];

                    if (ls != -1)
                        src = "..." + equipment[i].Substring(ls, equipment[i].Length - ls);

                    equipmentList.Items.Add((i+1) + ". " + src);
                }

                LoadGearImages();
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }

            if (current == -1 &&
                equipment.Count > 0)
                equipmentList.SelectedIndex = 0;
            else if (equipment.Count > 0 &&
                     current < equipment.Count)
                equipmentList.SelectedIndex = current;
        }

        private void LoadGearImages()
        {
            for (int i = 0; i < equipment.Count; i++)
            {
                string location = Program.main.location + "/../client/" + equipment[i];

                if (!File.Exists(location))
                    continue;

                if (i >= equipmentImages.Count)
                    equipmentImages.Add(new EquipmentImage(location));
                else if (equipmentImages[i].source != equipment[i])
                    equipmentImages[i] = new EquipmentImage(location);
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

            //Draw equipment

            for (int i = 0; i < equipmentImages.Count; i++)
                if (equipmentImages[i] != null && equipmentImages[i].image != null)
                    g.DrawImage(
                        equipmentImages[i].image,
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

        private void equipmentList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (equipmentList.SelectedIndex == -1 ||
                equipment.Count <= equipmentList.SelectedIndex)
                return;

            current = equipmentList.SelectedIndex;

            equipmentSource.Text = equipment[current];
        }

        private void newLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            equipment.Add("");

            ReloadGearList();
            equipmentList.SelectedIndex = equipment.Count - 1;
        }

        private void delete_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == -1)
                return;

            equipment.RemoveAt(current);
            if (current < equipmentImages.Count)
                equipmentImages.RemoveAt(current);

            current = -1;

            ReloadGearList();
        }

        private void equipmentSource_TextChanged(object sender, EventArgs e)
        {
            if (current == -1)
                return;

            equipment[current] = equipmentSource.Text;

            ReloadGearList();
        }

        private void swapEquipment(int indexA, int indexB)
        {
            string tmpGear = equipment[indexA];
            equipment[indexA] = equipment[indexB];
            equipment[indexB] = tmpGear;

            if (indexA < equipmentImages.Count &&
                indexB < equipmentImages.Count)
            {
                EquipmentImage tmpGearImage = equipmentImages[indexA];
                equipmentImages[indexA] = equipmentImages[indexB];
                equipmentImages[indexB] = tmpGearImage;
            }

            ReloadGearList();
        }

        private void moveDown_Click(object sender, EventArgs e)
        {
            if (current == -1 || equipment.Count == 1)
                return;

            if (current == equipment.Count - 1)
            {
                swapEquipment(current, 0);
                equipmentList.SelectedIndex = 0;
            }
            else
            {
                swapEquipment(current, current + 1);
                equipmentList.SelectedIndex = current + 1;
            }
        }

        private void moveUp_Click(object sender, EventArgs e)
        {
            if (current == -1 || equipment.Count == 1)
                return;

            if (current == 0)
            {
                swapEquipment(current, equipment.Count-1);
                equipmentList.SelectedIndex = equipment.Count-1;
            }
            else
            {
                swapEquipment(current, current - 1);
                equipmentList.SelectedIndex = current - 1;
            }
        }

        public string[] GetSelection()
        {
            return equipment.ToArray();
        }
    }

    public class EquipmentImage
    {
        public EquipmentImage(string source)
        {
            this.source = source;
            image = Image.FromFile(source);
        }

        public string source = "";
        public Image image;
    }
}
