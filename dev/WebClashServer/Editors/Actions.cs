using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using WebClashServer.Classes;

using Action = WebClashServer.Classes.Action;

namespace WebClashServer.Editors
{
    public partial class Actions : Form
    {
        private Action current = null;
        private Element clipboardActionElement = null;
        private Character currentCharacter = null;
        private Image charImage = null;
        private ActionElement actionElement = null;
        private string oldName;

        private int curElement = 0;
        private int cellSize = 32;

        private bool moving = false;
        private bool disableSnapping = false;
        private Point oldMP = default;

        private Dictionary<Element, Frame> elementFrames = new Dictionary<Element, Frame>();
        private Dictionary<Element, int> remainingDelays = new Dictionary<Element, int>();
        private Dictionary<Element, bool> finished = new Dictionary<Element, bool>();
        private Dictionary<string, Image> savedImages = new Dictionary<string, Image>();

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

            ReloadActions();

            LoadFirstCharacter();

            if (actionList.Items.Count > 0)
                actionList.SelectedItem = actionList.Items[0];
            else
                newAction_LinkClicked(sender, null);

            canvas.Invalidate();
        }

        private void ReloadActions()
        {
            actionList.Items.Clear();

            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] actions = Directory.GetFiles(Program.main.serverLocation + "/actions", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                for (int a = 0; a < actions.Length; a++)
                {
                    string action = actions[a].Replace('\\', '/');
                    action = action.Substring(action.LastIndexOf('/') + 1, action.LastIndexOf('.') - action.LastIndexOf('/') - 1);

                    actionList.Items.Add((a + 1) + ". " + action);
                }
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load actions: ", exc);
            }
        }

        private void LoadFirstCharacter()
        {
            try
            {
                List<string> ext = new List<string>()
                {
                    ".json"
                };

                string[] characters = Directory.GetFiles(Program.main.serverLocation + "/characters", "*.*", SearchOption.AllDirectories)
                    .Where(s => ext.Contains(Path.GetExtension(s))).ToArray();

                string character = characters[0].Replace('\\', '/');
                character = character.Substring(character.LastIndexOf('/') + 1, character.LastIndexOf('.') - character.LastIndexOf('/') - 1);

                LoadCharacter(character);
            }
            catch (Exception exc)
            {
                Logger.Error("Could not load a testing character: ", exc);
            }
        }

        private void LoadAction(string actionName)
        {
            if (actionName == string.Empty)
                current = new Action();
            else
                current = new Action(Program.main.serverLocation + "/actions/" + actionName + ".json");

            current.sw = canvas.Width;
            current.sh = canvas.Height;

            name.Text = current.name;
            oldName = name.Text;

            icon.Text = current.src;
            AttemptSetIcon();
            LoadElements();

            description.Text = current.description;

            heal.Value = current.heal;
            mana.Value = current.mana;

            castingTime.Value = (int)Math.Round((double)current.castingTime * (1000d / 60));
            cooldown.Value = (int)Math.Round((double)current.cooldown * (1000d / 60));

            if (current.elements.Length > 0)
                GrabElement(0);

            finished.Clear();
            remainingDelays.Clear();
            elementFrames.Clear();

            canvas.Invalidate();
        }

        private void LoadCharacter(string charName)
        {
            characterName.Text = charName;

            if (charName == string.Empty)
                currentCharacter = new Character();
            else
                currentCharacter = new Character(Program.main.serverLocation + "/characters/" + charName + ".json");

            if (currentCharacter.src != string.Empty)
                AttemptSetCharImage(currentCharacter.src);
        }

        private void LoadElements()
        {
            if (current == null)
                return;

            elementList.Items.Clear();

            for (int e = 0; e < current.elements.Length; e++)
                elementList.Items.Add("#" + (e + 1) + " (" + current.elements[e].type + ")");
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
            }
            catch (Exception exc)
            {
                Logger.Error("Could not set character image: ", exc);
            }

            canvas.Invalidate();
        }

        private Image GetClientImage(string src)
        {
            if (!savedImages.ContainsKey(src))
            {
                if (!File.Exists(Program.main.clientLocation + src))
                    return null;

                savedImages[src] = Image.FromFile(Program.main.clientLocation + src);
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

                Point sp = new Point(
                    canvas.Width / 2 - currentCharacter.width / 2, 
                    canvas.Height / 2 - currentCharacter.height / 2
                );

                //Render grid

                int widthCells  = canvas.Width / cellSize;
                int heightCells = canvas.Height / cellSize;

                //Render sub-cells

                for (int x = 0; x < widthCells * 2; x++)
                    for (int y = 0; y < heightCells * 2; y++)
                    {
                        int subCellSize = cellSize / 2;

                        Pen dottedPen = new Pen(Color.FromArgb(16, 0, 0, 0), 1)
                        {
                            DashStyle = System.Drawing.Drawing2D.DashStyle.Dash
                        };

                        g.DrawRectangle(
                            dottedPen,
                            new Rectangle(
                                x * subCellSize, 
                                y * subCellSize, 
                                subCellSize, 
                                subCellSize
                            )
                        );
                    }

                //Render cells

                for (int x = 0; x < widthCells; x++)
                    for (int y = 0; y < heightCells; y++)
                        g.DrawRectangle(
                            new Pen(Color.FromArgb(48, 0, 0, 0), 1), 
                            new Rectangle(
                                x * cellSize, 
                                y * cellSize, 
                                cellSize, 
                                cellSize
                            )
                        );

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
                    {
                        //Draw position text

                        g.DrawString(
                            "#" + (curElement+1) + " (" + r.X + ", " + r.Y + ")",
                            new Font("Verdana", 10),
                            Brushes.Black,
                            new Point(2, 2)
                        );

                        //Draw rectangle

                        g.DrawRectangle(new Pen(Color.DeepPink, 1), r);
                    }
                    else
                        g.DrawRectangle(new Pen(Color.Blue, 1), r);
                    
                    //Draw projectile arrow (if projectile)

                    if (cur.type == "projectile")
                    {
                        Pen p = new Pen(Color.FromArgb(125, Color.Black), 6)
                        {
                            EndCap = System.Drawing.Drawing2D.LineCap.ArrowAnchor
                        };

                        int x = (int)(cur.x + (cur.w * cur.scale) / 2),
                            y = (int)(cur.y + (cur.h * cur.scale) / 2);

                        float dx = (x - canvas.Width / 2),
                              dy = (y - canvas.Height / 2);

                        float len = (float)Math.Sqrt(dx * dx + dy * dy);

                        dx /= len;
                        dy /= len;

                        int arrowLength = 48;

                        g.DrawLine(
                            p, 
                            x, 
                            y, 
                            x + dx * arrowLength, 
                            y + dy * arrowLength
                        );
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
            //If moving an element, handle movement

            if (moving)
            {
                //Get mouse position

                Point mp = canvas.PointToClient(MousePosition);

                //Calculate new position

                float x = current.elements[curElement].x + mp.X - oldMP.X;
                float y = current.elements[curElement].y + mp.Y - oldMP.Y;

                //Check for snapping

                if (!disableSnapping)
                {
                    int snappingSize = 1;

                    for (int sx = -snappingSize; sx <= snappingSize; sx++)
                    {
                        if ((x + sx) % cellSize == 0)
                        {
                            x = (float)Math.Round(x / cellSize) * cellSize;
                            break;
                        }
                        else if ((x + sx) % (cellSize / 2) == 0)
                        {
                            x = (float)Math.Round(x / cellSize * 2) * cellSize / 2;
                            break;
                        }
                    }

                    for (int sy = -snappingSize; sy <= snappingSize; sy++)
                    {
                        if ((y + sy) % cellSize == 0)
                        {
                            y = (float)Math.Round(y / cellSize) * cellSize;
                            break;
                        }
                        else if ((y + sy) % (cellSize / 2) == 0)
                        {
                            y = (float)Math.Round(y / cellSize * 2) * cellSize / 2;
                            break;
                        }
                    }
                }

                //Set position

                current.elements[curElement].x = (int)x;
                current.elements[curElement].y = (int)y;

                //Set old mouse position

                oldMP = mp;

                //Repaint canvas

                canvas.Invalidate();
            }
        }

        private void mouseUpCanvas(object sender, EventArgs e)
        {
            moving = false;
        }


        private void actionList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (actionList.SelectedItem == null)
                return;

            string t = actionList.SelectedItem.ToString();

            LoadAction(t.Substring(t.IndexOf(" ") + 1, t.Length - t.IndexOf(" ") - 1));
        }

        private void newAction_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            string i = (actionList.Items.Count + 1) + ". " + string.Empty;

            actionList.Items.Add(i);
            actionList.SelectedItem = i;

            LoadAction(string.Empty);
        }

        private void delete_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (!File.Exists(Program.main.serverLocation + "/actions/" + current.name + ".json"))
            {
                Logger.Error("This action cannot be deleted as it does not exist yet.");

                return;
            }

            if (!Logger.Question("Are you sure you want to delete the action?"))
                return;

            File.Delete(Program.main.serverLocation + "/actions/" + current.name + ".json");

            ReloadActions();

            if (actionList.Items.Count > 0)
                actionList.SelectedItem = actionList.Items[0];
            else
                newAction_LinkClicked(sender, e);

            dataHasChanged = true;
        }

        private void save_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == null || name.Text.Length == 0)
            {
                Logger.Error("Could not save action as it is invalid.");
                return;
            }

            if (oldName != name.Text)
                File.Delete(Program.main.serverLocation + "/actions/" + oldName + ".json");

            File.WriteAllText(Program.main.serverLocation + "/actions/" + name.Text + ".json", JsonConvert.SerializeObject(current, Formatting.Indented));

            Logger.Message("Action has been saved!");

            ReloadActions();

            actionList.SelectedItem = name.Text;

            dataHasChanged = true;
        }


        private void icon_TextChanged(object sender, EventArgs e)
        {
            AttemptSetIcon();
        }

        private void Name_TextChanged(object sender, EventArgs e)
        {
            if (current == null)
                return;

            current.name = name.Text;
        }

        private void richTextBox1_TextChanged(object sender, EventArgs e)
        {
            current.description = description.Text;
        }

        private void heal_ValueChanged(object sender, EventArgs e)
        {
            current.heal = (int)heal.Value;
        }

        private void mana_ValueChanged(object sender, EventArgs e)
        {
            current.mana = (int)mana.Value;
        }

        private void castingTime_ValueChanged(object sender, EventArgs e)
        {
            current.castingTime = (int)Math.Round((double)castingTime.Value / (1000d / 60));
        }

        private void cooldown_ValueChanged(object sender, EventArgs e)
        {
            current.cooldown = (int)Math.Round((double)cooldown.Value / (1000d / 60));
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
            string serverLocation = Program.main.clientLocation + icon.Text;

            if (!File.Exists(serverLocation))
            {
                iconImage.BackgroundImage = null;
                current.src = string.Empty;
                return;
            }

            iconImage.BackgroundImage = Image.FromFile(serverLocation);
            current.src = icon.Text;
        }

        private void addElement_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == null)
                return;

            current.AddElement();

            LoadElements();

            GrabElement(current.elements.Length - 1);

            canvas.Invalidate();
        }

        private void removeElement_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            if (current == null)
                return;

            if (current.elements.Length > 0)
            {
                current.RemoveElement(curElement);

                LoadElements();

                GrabElement(current.elements.Length - 1);
            }

            canvas.Invalidate();
        }

        private void elementList_SelectedIndexChanged(object sender, EventArgs e)
        {
            curElement = elementList.SelectedIndex;
        }

        private void elementList_KeyDown(object sender, KeyEventArgs e)
        {
            if (e.Control && e.KeyCode == Keys.C)
                copyElement_Click(null, null);

            else if (e.Control && e.KeyCode == Keys.V)
                pasteElement_Click(null, null);

            else if (e.Alt)
                disableSnapping = true;

            e.Handled = true;
        }

        private void elementList_KeyUp(object sender, KeyEventArgs e)
        {
            disableSnapping = false;

            e.Handled = true;
        }

        private void copyElement_Click(object sender, EventArgs e)
        {
            if (curElement == -1)
                return;

            clipboardActionElement = current.elements[curElement];
        }

        private void pasteElement_Click(object sender, EventArgs e)
        {
            if (clipboardActionElement == null)
                return;

            List<Element> elements = new List<Element>(current.elements)
            {
                (Element)clipboardActionElement.Clone()
            };

            current.elements = elements.ToArray();

            LoadElements();

            GrabElement(current.elements.Length - 1);

            canvas.Invalidate();
        }

        private void editElement_Click(object sender, EventArgs e)
        {
            if (current == null || curElement == -1)
                return;

            if (actionElement != null)
            {
                actionElement.Close();
                actionElement = null;
            }

            actionElement = new ActionElement(
                current.elements[curElement],
                canvas,
                curElement
            );
            actionElement.Show();
        }

        private void GrabElement(int id)
        {
            curElement = id;
            elementList.SelectedIndex = curElement;

            elementList.Focus();
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

                if (!finished.ContainsKey(cur) || finished[cur])
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

        private void changeCharacter_Click(object sender, EventArgs e)
        {
            CharacterSelection charSelection = new CharacterSelection("Select testing character", characterName.Text);

            charSelection.FormClosed += (object s, FormClosedEventArgs fcea) =>
            {
                string result = charSelection.GetResult();

                if (result != "")
                    LoadCharacter(result);
            };

            charSelection.ShowDialog();
        }

        public bool GetChanged()
        {
            return dataHasChanged;
        }
    }
}
