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
        private Action current = null;
        private Character currentCharacter = null;
        private Image charImage = null;

        private int curElement = 0;

        private bool moving = false;
        private Point oldMP = default;

        private Dictionary<Element, Frame> elementFrames = new Dictionary<Element, Frame>();
        private Dictionary<Element, int> remainingDelays = new Dictionary<Element, int>();
        private Dictionary<Element, bool> finished = new Dictionary<Element, bool>();
        private Dictionary<string, Image> savedImages = new Dictionary<string, Image>();

        private int oldActionSelection = 0;
        private bool dataHasChanged = false;

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
                addAction_Click(sender, e);

            if (charSelect.Items.Count > 0)
            {
                if (charSelect.Items.Contains("player"))
                    charSelect.SelectedItem = "player";
                else
                    charSelect.SelectedItem = charSelect.Items[0];
            }

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

                string[] characters = Directory.GetFiles(Program.main.serverLocation + "/actions", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                foreach (string c in characters)
                    actionSelect.Items.Add(c.Substring(c.LastIndexOf('\\') + 1, c.LastIndexOf('.') - c.LastIndexOf('\\') - 1));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash - Error");
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

                string[] characters = Directory.GetFiles(Program.main.serverLocation + "/characters", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                foreach (string c in characters)
                    charSelect.Items.Add(c.Substring(c.LastIndexOf('\\') + 1, c.LastIndexOf('.') - c.LastIndexOf('\\') - 1));
            }
            catch (Exception exc)
            {
                MessageBox.Show(exc.Message, "WebClash - Error");
            }
        }

        private void LoadAction(string actionName)
        {
            if (actionName == string.Empty)
                current = new Action();
            else
                current = new Action(Program.main.serverLocation + "/actions/" + actionName + ".json");

            if (current.elements.Length > 0)
                GrabElement(0);
            else
                properties.Visible = false;

            name.Text = current.name;

            power.Value = (decimal)current.scaling.power;
            intelligence.Value = (decimal)current.scaling.intelligence;
            wisdom.Value = (decimal)current.scaling.wisdom;
            agility.Value = (decimal)current.scaling.agility;
            toughness.Value = (decimal)current.scaling.toughness;
            vitality.Value = (decimal)current.scaling.vitality;

            icon.Text = current.src;
            AttemptSetIcon();

            description.Text = current.description;

            heal.Value = current.heal;
            mana.Value = current.mana;

            castingTime.Value = (int)Math.Round((double)current.castingTime * (1000d / 60));
            cooldown.Value = (int)Math.Round((double)current.cooldown * (1000d / 60));

            finished.Clear();
            remainingDelays.Clear();
            elementFrames.Clear();

            canvas.Invalidate();
        }

        private void LoadCharacter(string charName)
        {
            if (charName == string.Empty)
                currentCharacter = new Character();
            else
                currentCharacter = new Character(Program.main.serverLocation + "/characters/" + charName + ".json");

            if (currentCharacter.src != string.Empty)
                AttemptSetCharImage(currentCharacter.src);
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
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash - Error");
            }

            canvas.Invalidate();
        }

        private Image GetClientImage(string src)
        {
            if (!savedImages.ContainsKey(src))
            {
                if (!File.Exists(Program.main.serverLocation + "/../client/" + src))
                    return null;

                savedImages[src] = Image.FromFile(Program.main.serverLocation + "/../client/" + src);
            }

            return savedImages[src];
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

                g.DrawImage(
                    charImage, 
                    new Rectangle(
                        sp.X, sp.Y, 
                        currentCharacter.width, currentCharacter.height), 
                    0, 0,
                    currentCharacter.width, currentCharacter.height, 
                    GraphicsUnit.Pixel
                );

                //Render elements

                foreach (Element cur in current.elements)
                {
                    //Setup element rectangle

                    int w = (int)(cur.w * cur.scale),
                        h = (int)(cur.h * cur.scale);

                    Rectangle r = new Rectangle(cur.x, cur.y, w, h);

                    //Check if already finished, if so only draw rectangle

                    if (finished.ContainsKey(cur) && finished[cur])
                        goto DrawRectangle;

                    //If remaining delay exists, draw delay

                    if (remainingDelays.ContainsKey(cur) && remainingDelays[cur] > 0)
                    {
                        //Draw delay in seconds

                        double remainingTime = remainingDelays[cur] * (1000d / 60) / 1000;
                        StringFormat format = new StringFormat();
                        format.LineAlignment = StringAlignment.Center;
                        format.Alignment = StringAlignment.Center;
                        g.DrawString(
                            remainingTime.ToString("0.#s"),
                            new Font("Verdana", 10), 
                            new SolidBrush(Color.FromArgb(150, 0, 0, 0)), 
                            cur.x + w / 2, cur.y + h / 2,
                            format
                        );

                        goto DrawRectangle;
                    }

                    //Draw image if possible

                    if (elementFrames.ContainsKey(cur) && cur.src.Length > 0)
                    {
                        Image img = GetClientImage(cur.src);

                        if (img == null)
                            goto DrawRectangle;

                        if (cur.direction == "horizontal")
                            g.DrawImage(img, r, elementFrames[cur].frame * cur.w, 0, cur.w, cur.h, GraphicsUnit.Pixel);
                        else if (cur.direction == "vertical")
                            g.DrawImage(img, r, 0, elementFrames[cur].frame * cur.h, cur.w, cur.h, GraphicsUnit.Pixel);
                    }

                    //Draw rectangle

                    DrawRectangle:
                        if (cur == current.elements[curElement])
                            g.DrawRectangle(Pens.Blue, r);
                        else
                            g.DrawRectangle(Pens.Purple, r);
                    
                    //Draw projectile arrow (if projectile)

                    if (cur.type == "projectile")
                    {
                        Pen p = new Pen(Color.FromArgb(125, Color.Black), 6);

                        p.EndCap = System.Drawing.Drawing2D.LineCap.ArrowAnchor;

                        int x = cur.x + cur.w / 2,
                            y = cur.y + cur.h / 2;

                        int dx = (x - current.sw / 2),
                            dy = (y - current.sh / 2);

                        int l = current.sw/6;

                        if (dx > l)
                            dx = l;
                        else if (dx < -l)
                            dx = -l;
                        if (dy > l)
                            dy = l;
                        else if (dy < -l)
                            dy = -l;

                        g.DrawLine(p, x, y, x + dx, y + dy);
                    }
                }
            }
            catch
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
                    (int)(current.elements[i].w * current.elements[i].scale),
                    (int)(current.elements[i].h * current.elements[i].scale)
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

        private void addAction_Click(object sender, EventArgs e)
        {
            actionSelect.Items.Add(string.Empty);

            actionSelect.SelectedItem = string.Empty;
        }

        private void removeAction_Click(object sender, EventArgs e)
        {
            if (!File.Exists(Program.main.serverLocation + "/actions/" + current.name + ".json"))
            {
                MessageBox.Show("This action cannot be deleted as it does not exist yet.", "WebClash - Error");

                return;
            }

            File.Delete(Program.main.serverLocation + "/actions/" + current.name + ".json");

            ReloadActions();

            if (charSelect.Items.Count > 0)
                charSelect.SelectedItem = charSelect.Items[0];

            dataHasChanged = true;
        }

        private void save_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == null)
                return;

            File.WriteAllText(Program.main.serverLocation + "/actions/" + current.name + ".json", JsonConvert.SerializeObject(current, Formatting.Indented));

            MessageBox.Show("Action has been saved!", "WebClash - Message");

            ReloadActions();

            actionSelect.SelectedItem = current.name;

            dataHasChanged = true;
        }

        private void Name_TextChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.name = name.Text;
        }

        private void addElement_Click(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.AddElement();

            GrabElement(current.elements.Length - 1);

            canvas.Invalidate();
        }

        private void removeElement_Click(object sender, EventArgs e)
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

                if (propertyView.SelectedItem == null)
                    propertyView.SelectedItem = propertyView.Items[0];

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
            scale.Value = (decimal)current.elements[curElement].scale;

            source.Text = current.elements[curElement].src;

            delay.Value = (int)Math.Round((double)current.elements[curElement].delay * (1000d / 60));

            animationEnabled.Checked = current.elements[curElement].animated;
            speed.Enabled = current.elements[curElement].animated;
            direction.Enabled = current.elements[curElement].animated;
            projectileRotates.Checked = current.elements[curElement].rotates;

            projectileSpeed.Value = current.elements[curElement].projectileSpeed;
            projectileDistance.Value = current.elements[curElement].projectileDistance;

            if (current.elements[curElement].direction == "horizontal")
                direction.SelectedItem = "Horizontal";
            else if (current.elements[curElement].direction == "vertical")
                direction.SelectedItem = "Vertical";

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

        private void Scale_ValueChanged(object sender, EventArgs e)
        {
            current.elements[curElement].scale = float.Parse(scale.Value.ToString("0.000")); ;

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
            if (current == null)
                return;

            //Check if all elements have finished

            bool allFinished = true;
            foreach (KeyValuePair<Element, bool> kp in finished)
                if (!kp.Value)
                {
                    allFinished = false;
                    break;
                }

            //If finished, reset all delays and set unfinished

            if (allFinished)
            {
                elementFrames.Clear();

                finished.Clear();
                remainingDelays.Clear();

                foreach (Element cur in current.elements)
                {
                    finished[cur] = false;
                    remainingDelays[cur] = cur.delay;
                }
            }

            //Handle all elements

            foreach (Element cur in current.elements)
            {
                //Check if already finished

                if (finished[cur])
                    continue;

                //If the element has no source, set finished and continue

                if (cur.src.Length == 0)
                {
                    finished[cur] = true;
                    continue;
                }

                //If delay exists, eat away at the delay first

                if (remainingDelays[cur] > 0)
                {
                    remainingDelays[cur]--;
                    continue;
                }

                //If no frame exists yet, add frame

                if (!elementFrames.ContainsKey(cur))
                    elementFrames.Add(cur, new Frame());
                
                //Check if not animated

                if (!cur.animated)
                {
                    elementFrames[cur].frame = 0;

                    continue;
                }

                //If frame should be advanced, advance frame

                if (elementFrames[cur].cur >= cur.speed)
                {
                    elementFrames[cur].frame++;

                    //Check frame boundaries

                    Image img = GetClientImage(cur.src);
                    if (img == null)
                        continue;

                    if (cur.direction == "horizontal" &&
                        elementFrames[cur].frame * cur.w >= img.Width)
                        finished[cur] = true;
                    else if (cur.direction == "vertical" &&
                        elementFrames[cur].frame * cur.h >= img.Height)
                        finished[cur] = true;

                    //Set animation timer to zero

                    elementFrames[cur].cur = 0;
                }

                //Increment animation duration

                elementFrames[cur].cur++;
            }

            canvas.Invalidate();
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

        private void heal_ValueChanged(object sender, EventArgs e)
        {
            current.heal = (int)heal.Value;
        }
        
        private void mana_ValueChanged(object sender, EventArgs e)
        {
            current.mana = (int)mana.Value;
        }

        private void icon_TextChanged(object sender, EventArgs e)
        {
            AttemptSetIcon();
        }

        private void richTextBox1_TextChanged(object sender, EventArgs e)
        {
            current.description = description.Text;
        }

        private void editSounds_Click(object sender, EventArgs e)
        {
            SoundSelection soundSelection = new SoundSelection("Set sounds for action '" + current.name + "'", current.sounds);

            soundSelection.FormClosed += (object s, FormClosedEventArgs fcea) => {
                current.sounds = soundSelection.GetSelection();
            };

            soundSelection.ShowDialog();
        }

        private void AttemptSetIcon()
        {
            string serverLocation = Program.main.serverLocation + "/../client/" + icon.Text;

            if (!File.Exists(serverLocation))
            {
                iconImage.BackgroundImage = null;
                current.src = string.Empty;
                return;
            }

            iconImage.BackgroundImage = Image.FromFile(serverLocation);
            current.src = icon.Text;
        }

        private void castingTime_ValueChanged(object sender, EventArgs e)
        {
            current.castingTime = (int)Math.Round((double)castingTime.Value / (1000d / 60));
        }

        private void cooldown_ValueChanged(object sender, EventArgs e)
        {
            current.cooldown = (int)Math.Round((double)cooldown.Value / (1000d / 60));
        }

        private void propertyView_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (propertyView.SelectedItem.ToString() == "Appearance")
            {
                appearancePanel.Visible = true;
                behaviourPanel.Visible = false;
            }
            else if (propertyView.SelectedItem.ToString() == "Behaviour")
            {
                appearancePanel.Visible = false;
                behaviourPanel.Visible = true;

                delay.Value = (int)Math.Round((double)current.elements[curElement].delay * (1000d/60d));

                propertyType.SelectedItem = char.ToUpper(current.elements[curElement].type[0]) + current.elements[curElement].type.Substring(1, current.elements[curElement].type.Length - 1);

                animationEnabled.Checked = current.elements[curElement].animated;
                projectileRotates.Checked = current.elements[curElement].rotates;

                projectileSpeed.Value = current.elements[curElement].projectileSpeed;
                projectileDistance.Value = current.elements[curElement].projectileDistance;
            }
        }

        private void delay_ValueChanged(object sender, EventArgs e)
        {
            current.elements[curElement].delay = (int)Math.Round((double)delay.Value / (1000d/60d));
        }

        private void animationEnabled_CheckedChanged(object sender, EventArgs e)
        {
            current.elements[curElement].animated = animationEnabled.Checked;

            speed.Enabled = current.elements[curElement].animated;
            direction.Enabled = current.elements[curElement].animated;
        }

        private void projectileRotates_CheckedChanged(object sender, EventArgs e)
        {
            current.elements[curElement].rotates = projectileRotates.Checked;
        }

        private void projectileSpeed_ValueChanged(object sender, EventArgs e)
        {
            if (current.elements[curElement] == null)
                return;

            current.elements[curElement].projectileSpeed = (int)projectileSpeed.Value;
        }

        private void projectileDistance_ValueChanged(object sender, EventArgs e)
        {
            if (current.elements[curElement] == null)
                return;

            current.elements[curElement].projectileDistance = (int)projectileDistance.Value;
        }

        private void propertyType_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (current.elements[curElement] == null)
                return;

            current.elements[curElement].type = propertyType.SelectedItem.ToString().ToLower();

            if (current.elements[curElement].type == "projectile")
            {
                projectilePanel.Visible = true;
            }
            else
            {
                animationEnabled.Checked = true;

                projectilePanel.Visible = false;
            }

            canvas.Invalidate();
        }

        public bool GetChanged()
        {
            return dataHasChanged;
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

                sounds = temp.sounds;

                scaling = temp.scaling;

                name = temp.name;

                heal = temp.heal;

                mana = temp.mana;

                src = temp.src;

                description = temp.description;

                cooldown = temp.cooldown;

                castingTime = temp.castingTime;
            }
            catch (Exception e)
            {
                MessageBox.Show(e.Message, "WebClash - Error");
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

        public int sw = 320,
                   sh = 320;

        public string name = "New Action";

        public string src = "";

        public string description = "";

        public Scaling scaling = new Scaling();

        public Element[] elements = new Element[0];

        public PossibleSound[] sounds = new PossibleSound[0];

        public int heal = 0,
                   mana = 0;

        public int cooldown = 0;
        public int castingTime = 0;
    }

    public class Scaling
    {
        public float power = 0.0f,
                   agility = 0.0f,
                   intelligence = 0.0f,
                   wisdom = 0.0f,
                   toughness = 0.0f,
                   vitality = 0.0f;
    }
    
    public class Element
    {
        public int x = 0,
                   y = 0;

        public int w = 64,
                   h = 64;

        public float scale = 1.0f;

        public string type = "static";

        public string src = "";

        public bool animated = true;
        public int speed = 8;
        public string direction = "horizontal";
        public int delay = 0;

        public bool rotates = true;
        public int projectileSpeed = 1;
        public int projectileDistance = 0;
    }

    public class Frame
    {
        public int cur = 0;
        public int frame = 0;
    }
}
