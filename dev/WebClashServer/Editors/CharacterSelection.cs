using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using WebClashServer.Classes;

namespace WebClashServer.Editors
{
    public partial class CharacterSelection : Form
    {
        private List<string> characters;
        private int current = -1;
        private Character currentCharacter;

        private Image charImage;
        private int animFrame = 0;

        private string selected;

        public CharacterSelection(string title, string selectedCharacter)
        {
            InitializeComponent();

            Text = title;
            selected = selectedCharacter;

            canvas.Paint += PaintCharacter;
        }

        private void CharacterSelection_Load(object sender, EventArgs e)
        {
            ReloadCharacters();

            if (selected != "")
            {
                int index = characters.IndexOf(selected);

                if (index != -1)
                    characterList.SelectedIndex = index;
            }
        }

        private void ReloadCharacters()
        {
            characterList.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] chars = Directory.GetFiles(Program.main.serverLocation + "/characters", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                characters = new List<string>();

                for (int c = 0; c < chars.Length; c++)
                {
                    string character = chars[c].Replace('\\', '/');
                    character = character.Substring(character.LastIndexOf('/') + 1, character.LastIndexOf('.') - character.LastIndexOf('/') - 1);

                    characters.Add(character);

                    characterList.Items.Add((c + 1) + ". " + character);
                }
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load characters: ", exc);
            }
        }

        private void characterList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (characterList.SelectedIndex == -1)
                return;

            current = characterList.SelectedIndex;

            LoadCharacter();
        }

        private void LoadCharacter()
        {
            try
            {
                currentCharacter = new Character(Program.main.serverLocation + "/characters/" + characters[current] + ".json");

                LoadCharacterImage(currentCharacter.src);
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load character: ", exc);
            }
        }

        private void LoadCharacterImage(string src)
        {
            try
            {
                if (!File.Exists(Program.main.clientLocation + src))
                {
                    charImage = null;

                    return;
                }

                charImage = Image.FromFile(Program.main.clientLocation + src);

                animation.Interval = (1000 / 60) * currentCharacter.animation.speed;
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load the character image: ", exc);
            }

            canvas.Invalidate();
        }

        private void PaintCharacter(object sender, PaintEventArgs pea)
        {
            Graphics g = pea.Graphics;

            g.Clear(Color.FromKnownColor(KnownColor.ControlLight));

            if (charImage == null)
                return;

            Point sp = new Point(
                canvas.Width / 2 - currentCharacter.width / 2, 
                canvas.Height / 2 - currentCharacter.height / 2
            );

            //Draw sprite

            if (currentCharacter.animation.direction == "horizontal")
                g.DrawImage(
                    charImage, 
                    new Rectangle(sp.X, sp.Y, currentCharacter.width, currentCharacter.height), 
                    animFrame * currentCharacter.width, 
                    0,
                    currentCharacter.width,
                    currentCharacter.height, 
                    GraphicsUnit.Pixel
                );
            else if (currentCharacter.animation.direction == "vertical")
                g.DrawImage(
                    charImage, 
                    new Rectangle(sp.X, sp.Y, currentCharacter.width, currentCharacter.height), 
                    0, 
                    animFrame * currentCharacter.height, 
                    currentCharacter.width,
                    currentCharacter.height, 
                    GraphicsUnit.Pixel
                );
        }

        public string GetResult()
        {
            if (current == -1)
                return "";

            return characters[current];
        }

        private void animation_Tick(object sender, EventArgs e)
        {
            if (charImage == null)
            {
                animFrame = 0;

                return;
            }

            animFrame++;

            if (animFrame * currentCharacter.width >= charImage.Width)
                animFrame = 0;

            canvas.Invalidate();
        }
    }
}
