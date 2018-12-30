using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace WebClashServer.Editors
{
    public partial class Actions : Form
    {
        public Action current = null;
        public Character currentCharacter = null;
        public Image charImage = null;
        
        public int curElement = 0;

        public bool moving = false;
        public Point oldMP = default(Point);

        public Dictionary<Element, Frame> elementFrames = new Dictionary<Element, Frame>();

        private int oldActionSelection = 0;

        public Actions()
        {
            InitializeComponent();
        }

        private void Actions_Load(object sender, EventArgs e)
        {
            canvas.Paint += new PaintEventHandler(paintCanvas);
            canvas.MouseDown += new MouseEventHandler(mouseDownCanvas);
            canvas.MouseMove += new MouseEventHandler(mouseMoveCanvas);
            canvas.MouseUp += new MouseEventHandler(mouseUpCanvas);

            actionSelect.TextChanged += ((object s, EventArgs ea) =>
            {
                if (current == null)
                    return;

                if (oldActionSelection == actionSelect.SelectedIndex)
                    current.name = actionSelect.Text;
                else
                    oldActionSelection = actionSelect.SelectedIndex;
            });

            ReloadActions();
            ReloadCharacters();

            if (actionSelect.Items.Count > 0)
                actionSelect.SelectedItem = actionSelect.Items[0];
            else
                button4_Click(sender, e);

            if (charSelect.Items.Count > 0)
                charSelect.SelectedItem = charSelect.Items[0];

            canvas.Invalidate();
        }

        private void ReloadActions()
        {
            actionSelect.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] characters = Directory.GetFiles(Program.main.location + "/actions", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                foreach (string c in characters)
                    actionSelect.Items.Add(c.Substring(c.LastIndexOf('\\') + 1, c.LastIndexOf('.') - c.LastIndexOf('\\') - 1));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash Server - Error");
            }
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

        private void LoadAction(string actionName)
        {
            if (actionName == string.Empty)
                current = new Action();
            else
                current = new Action(Program.main.location + "/actions/" + actionName + ".json");

            if (current.elements.Length > 0)
                GrabElement(0);
            else
                properties.Visible = false;

            power.Value = (decimal)current.scaling.power;
            intelligence.Value = (decimal)current.scaling.intelligence;
            wisdom.Value = (decimal)current.scaling.wisdom;
            agility.Value = (decimal)current.scaling.agility;
            toughness.Value = (decimal)current.scaling.toughness;
            vitality.Value = (decimal)current.scaling.vitality;

            canvas.Invalidate();
        }

        private void LoadCharacter(string charName)
        {
            if (charName == string.Empty)
                currentCharacter = new Character();
            else
                currentCharacter = new Character(Program.main.location + "/characters/" + charName + ".json");

            if (currentCharacter.src != string.Empty)
                AttemptSetCharImage(currentCharacter.src);
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
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash Server - Error");
            }

            canvas.Invalidate();
        }

        private Image GetClientImage(string src)
        {
            if (!File.Exists(Program.main.location + "/../client/" + src))
                return null;

            return Image.FromFile(Program.main.location + "/../client/" + src);
        }

        private void paintCanvas(object sender, PaintEventArgs e)
        {
            if (current == null)
                return;

            try
            {
                Graphics g = e.Graphics;

                g.Clear(Color.FromKnownColor(KnownColor.ControlLight));

                Point sp = new Point(canvas.Width / 2 - currentCharacter.width / 2, canvas.Height / 2 - currentCharacter.height / 2);

                //Render character

                g.DrawImage(charImage, new Rectangle(sp.X, sp.Y, currentCharacter.width, currentCharacter.height), 0, 0, currentCharacter.width, currentCharacter.height, GraphicsUnit.Pixel);

                //Render elements

                for (int i = 0; i < current.elements.Length; i++)
                {
                    Element el = current.elements[i];

                    Rectangle r = new Rectangle(el.x, el.y, el.w, el.h);

                    if (el.src.Length > 0)
                    {
                        Image img = GetClientImage(el.src);

                        if (el.animates)
                        {
                            if (el.direction == "horizontal")
                                g.DrawImage(img, r, elementFrames[el].frame * el.w, 0, el.w, el.h, GraphicsUnit.Pixel);
                            else if (el.direction == "vertical")
                                g.DrawImage(img, r, 0, elementFrames[el].frame * el.h, el.w, el.h, GraphicsUnit.Pixel);
                        }
                        else
                            g.DrawImage(img, r);
                    }

                    g.DrawRectangle(Pens.Purple, r);
                }
            }
            catch (Exception exc)
            {
                //...
            }
        }

        private void mouseDownCanvas(object sender, EventArgs e)
        {
            Point mp = canvas.PointToClient(MousePosition);

            for (int i = 0; i < current.elements.Length; i++)
            {
                Rectangle r = new Rectangle(
                    current.elements[i].x,
                    current.elements[i].y,
                    current.elements[i].w,
                    current.elements[i].h
                );

                if (r.Contains(mp))
                {
                    GrabElement(i);
                    moving = true;
                    oldMP = mp;

                    break;
                }
            }
        }

        private void mouseMoveCanvas(object sender, EventArgs e)
        {
            if (moving)
            {
                Point mp = canvas.PointToClient(MousePosition);

                current.elements[curElement].x += mp.X - oldMP.X;
                current.elements[curElement].y += mp.Y - oldMP.Y;

                oldMP = mp;

                canvas.Invalidate();
            }
        }

        private void mouseUpCanvas(object sender, EventArgs e)
        {
            moving = false;
        }

        private void actionSelect_SelectedIndexChanged(object sender, EventArgs e)
        {
            LoadAction(actionSelect.SelectedItem.ToString());
        }

        private void charSelect_SelectedIndexChanged(object sender, EventArgs e)
        {
            LoadCharacter(charSelect.SelectedItem.ToString());
        }

        private void button4_Click(object sender, EventArgs e)
        {
            actionSelect.Items.Add(string.Empty);

            actionSelect.SelectedItem = string.Empty;
        }

        private void button3_Click(object sender, EventArgs e)
        {
            if (!File.Exists(Program.main.location + "/actions/" + current.name + ".json"))
            {
                MessageBox.Show("This action cannot be deleted as it does not exist yet.", "WebClash Server - Error");

                return;
            }

            File.Delete(Program.main.location + "/actions/" + current.name + ".json");

            ReloadActions();

            if (charSelect.Items.Count > 0)
                charSelect.SelectedItem = charSelect.Items[0];
        }

        private void save_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == null)
                return;

            File.WriteAllText(Program.main.location + "/actions/" + current.name + ".json", JsonConvert.SerializeObject(current));

            MessageBox.Show("Action has been saved!", "WebClash Server - Message");

            ReloadActions();

            charSelect.SelectedItem = current.name;
        }

        public int GetAmount()
        {
            return actionSelect.Items.Count;
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.AddElement();

            GrabElement(current.elements.Length - 1);

            canvas.Invalidate();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            if (current == null)
                return;

            if (current.elements.Length > 0)
            {
                current.RemoveElement(curElement);

                GrabElement(current.elements.Length - 1);
            }

            canvas.Invalidate();
        }

        private void GrabElement(int id)
        {
            curElement = id;

            if (id == -1)
                properties.Visible = false;
            else
            {
                properties.Visible = true;

                LoadProperties();
            }
        }

        private void LoadProperties()
        {
            if (current.elements.Length == 0) { 
                return;
            }

            speed.Value = current.elements[curElement].speed;

            width.Value = current.elements[curElement].w;
            height.Value = current.elements[curElement].h;

            source.Text = current.elements[curElement].src;

            if (current.elements[curElement].direction == "horizontal")
                direction.SelectedItem = "Horizontal";
            else if (current.elements[curElement].direction == "vertical")
                direction.SelectedItem = "Vertical";

            animates.Checked = current.elements[curElement].animates;
            animation.Enabled = current.elements[curElement].animates;

            canvas.Invalidate();
        }

        private void animates_CheckedChanged(object sender, EventArgs e)
        {
            current.elements[curElement].animates = animates.Checked;
            animationTimer.Enabled = animates.Checked;

            animation.Enabled = current.elements[curElement].animates;

            canvas.Invalidate();
        }

        private void width_ValueChanged(object sender, EventArgs e)
        {
            current.elements[curElement].w = (int)width.Value;

            canvas.Invalidate();
        }

        private void height_ValueChanged(object sender, EventArgs e)
        {
            current.elements[curElement].h = (int)height.Value;

            canvas.Invalidate();
        }

        private void source_TextChanged(object sender, EventArgs e)
        {
            current.elements[curElement].src = source.Text;

            canvas.Invalidate();
        }

        private void speed_ValueChanged(object sender, EventArgs e)
        {
            current.elements[curElement].speed = (int)speed.Value;
        }

        private void direction_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (direction.SelectedItem.ToString() == "Horizontal")
                current.elements[curElement].direction = "horizontal";
            else if (direction.SelectedItem.ToString() == "Vertical")
                current.elements[curElement].direction = "vertical";
        }

        private void animationTimer_Tick(object sender, EventArgs e)
        {
            bool done = false;

            for (int i = 0; i < current.elements.Length; i++)
            {
                if (!current.elements[i].animates)
                    continue;

                if (!elementFrames.ContainsKey(current.elements[i]))
                    elementFrames.Add(current.elements[i], new Frame());

                elementFrames[current.elements[i]].cur++;

                if (elementFrames[current.elements[i]].cur >= current.elements[i].speed)
                {
                    elementFrames[current.elements[i]].frame++;

                    Image img = GetClientImage(current.elements[i].src);

                    if (current.elements[i].direction == "horizontal" &&
                        elementFrames[current.elements[i]].frame * current.elements[i].w >= img.Width)
                        elementFrames[current.elements[i]].frame = 0;
                    if (current.elements[i].direction == "vertical" &&
                        elementFrames[current.elements[i]].frame * current.elements[i].h >= img.Height)
                        elementFrames[current.elements[i]].frame = 0;

                    elementFrames[current.elements[i]].cur = 0;
                    done = true;
                }
            }

            if (done)
                canvas.Invalidate();
        }

        private void power_ValueChanged(object sender, EventArgs e)
        {
            current.scaling.power = float.Parse(power.Text, System.Globalization.NumberStyles.Any);
        }

        private void agility_ValueChanged(object sender, EventArgs e)
        {
            current.scaling.agility = float.Parse(agility.Text, System.Globalization.NumberStyles.Any);
        }

        private void toughness_ValueChanged(object sender, EventArgs e)
        {
            current.scaling.toughness = float.Parse(toughness.Text, System.Globalization.NumberStyles.Any);
        }

        private void intelligence_ValueChanged(object sender, EventArgs e)
        {
            current.scaling.intelligence = float.Parse(intelligence.Text, System.Globalization.NumberStyles.Any);
        }

        private void wisdom_ValueChanged(object sender, EventArgs e)
        {
            current.scaling.wisdom = float.Parse(wisdom.Text, System.Globalization.NumberStyles.Any);
        }

        private void vitality_ValueChanged(object sender, EventArgs e)
        {
            current.scaling.vitality = float.Parse(vitality.Text, System.Globalization.NumberStyles.Any);
        }
    }

    public class Action
    {
        public Action()
        {
            //...
        }

        public Action(string source)
        {
            try
            {
                Action temp = JsonConvert.DeserializeObject<Action>(File.ReadAllText(source));

                elements = temp.elements;

                scaling = temp.scaling;

                name = temp.name;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash Server - Error");
            }
        }

        public void AddElement()
        {
            List<Element> temp = new List<Element>(elements);

            temp.Add(new Element());

            elements = temp.ToArray();
        }

        public void RemoveElement(int id)
        {
            List<Element> temp = new List<Element>(elements);

            temp.RemoveAt(id);

            elements = temp.ToArray();
        }

        public string name = "New Action";

        public Scaling scaling = new Scaling();

        public Element[] elements = new Element[0];
    }

    public class Scaling
    {
        public float power = 0,
                   agility = 0,
                   intelligence = 0,
                   wisdom = 0,
                   toughness = 0,
                   vitality = 0;
    }
    
    public class Element
    {
        public int x = 0,
                   y = 0;

        public int w = 64,
                   h = 64;

        public string src = "";

        public bool animates = false;

        public int speed = 8;
        public string direction = "horizontal";
    }

    public class Frame
    {
        public Frame()
        {

        }

        public int cur = 0;

        public int frame = 0;
    }
}
