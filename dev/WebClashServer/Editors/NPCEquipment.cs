using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using WebClashServer.Classes;

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

        private List<Equipment> equipment = new List<Equipment>();
        private List<EquipmentImage> equipmentImages = new List<EquipmentImage>();
        private int current = -1;

        public NPCEquipment(string title, string charName, Equipment[] equipment)
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
                    isGeneric.Enabled = false;
                    isMainHand.Enabled = false;
                    isOffHand.Enabled = false;
                } else
                {
                    moveDown.Enabled = true;
                    moveUp.Enabled = true;
                    equipmentSource.Enabled = true;
                    isGeneric.Enabled = true;
                    isMainHand.Enabled = true;
                    isOffHand.Enabled = true;
                }

                for (int i = 0; i < equipment.Count; i++)
                {
                    int ls = equipment[i].source.LastIndexOf('/');
                    string src = equipment[i].source;

                    if (ls != -1)
                    {
                        src = "..." + src.Substring(ls, src.Length - ls);

                        if (equipment[i].type == "main")
                            src += " (MH)";
                        else if (equipment[i].type == "offhand")
                            src += " (OH)";
                    }

                    equipmentList.Items.Add((i+1) + ". " + src);
                }

                LoadGearImages();
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load equipment list: ", exc);
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
                string serverLocation = Program.main.clientLocation + equipment[i].source;

                if (!File.Exists(serverLocation))
                    continue;

                if (i >= equipmentImages.Count)
                    equipmentImages.Add(new EquipmentImage(serverLocation));
                else if (equipmentImages[i].source != equipment[i].source)
                    equipmentImages[i] = new EquipmentImage(serverLocation);
            }
        }

        private void LoadCharacter()
        {
            character = new Character(Program.main.serverLocation + "/characters/" + charName + ".json");

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

            g.DrawImage(
                charImage,
                new Rectangle(
                    sp.X, 
                    sp.Y, 
                    character.width, 
                    character.height
                ),
                character.width,
                0,
                character.width,
                character.height,
                GraphicsUnit.Pixel
            );

            //Draw all equipment besides main and offhand

            List<EquipmentImage> possibleMains = new List<EquipmentImage>();
            List<EquipmentImage> possibleOffhands = new List<EquipmentImage>();

            for (int i = 0; i < equipmentImages.Count; i++) 
                if (equipmentImages[i] != null && equipmentImages[i].image != null)
                {
                    //Skip main and offhand

                    if (equipment[i].type == "main")
                    {
                        possibleMains.Add(equipmentImages[i]);
                        continue;
                    }
                    else if (equipment[i].type == "offhand")
                    {
                        possibleOffhands.Add(equipmentImages[i]);
                        continue;
                    }

                    //Draw equipment image

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

            //Draw main if it exists

            for (int i = 0; i < possibleMains.Count; i++)
                g.DrawImage(
                    possibleMains[i].image,
                    new Rectangle(
                        sp.X, 
                        sp.Y, 
                        character.width, 
                        character.height
                    ),
                    character.width,
                    0,
                    character.width,
                    character.height,
                    GraphicsUnit.Pixel
                );

            //Draw offhand if it exists

            for (int i = 0; i < possibleOffhands.Count; i++)
                g.DrawImage(
                    possibleOffhands[i].image,
                    new Rectangle(
                        sp.X, 
                        sp.Y, 
                        character.width, 
                        character.height
                    ),
                    character.width,
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
                if (!File.Exists(Program.main.clientLocation + src))
                {
                    charImage = null;

                    return;
                }

                charImage = Image.FromFile(Program.main.clientLocation + src);

                character.src = src;
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load character image: ", exc);
            }

            canvas.Invalidate();
        }

        private void equipmentList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (equipmentList.SelectedIndex == -1 ||
                equipment.Count <= equipmentList.SelectedIndex)
                return;

            current = equipmentList.SelectedIndex;

            equipmentSource.Text = equipment[current].source;

            switch (equipment[current].type)
            {
                case "generic":
                    isGeneric.Checked = true;
                    break;
                case "main":
                    isMainHand.Checked = true;
                    break;
                case "offhand":
                    isOffHand.Checked = true;
                    break;
            }
        }

        private void newLink_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            equipment.Add(new Equipment());

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

            equipment[current].source = equipmentSource.Text;

            ReloadGearList();
        }

        private void isGeneric_CheckedChanged(object sender, EventArgs e)
        {
            if (current == -1 || !isGeneric.Checked)
                return;

            equipment[current].type = "generic";

            ReloadGearList();
        }

        private void isMainHand_CheckedChanged(object sender, EventArgs e)
        {
            if (current == -1 || !isMainHand.Checked)
                return;

            equipment[current].type = "main";

            ReloadGearList();
        }

        private void isOffHand_CheckedChanged(object sender, EventArgs e)
        {
            if (current == -1 || !isOffHand.Checked)
                return;

            equipment[current].type = "offhand";

            ReloadGearList();
        }

        private void swapEquipment(int indexA, int indexB)
        {
            Equipment tmpGear = equipment[indexA];
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

        public Equipment[] GetSelection()
        {
            return equipment.ToArray();
        }
    }

    public class Equipment
    {
        public string source = "";
        public string type = "generic";
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
