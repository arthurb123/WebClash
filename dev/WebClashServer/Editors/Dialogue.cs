using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;
using WebClashServer.Classes;
using WebClashServer.Input;

namespace WebClashServer.Editors
{
    public partial class Dialogue : Form
    {
        public DialogueSystem dialogSystem = new DialogueSystem();
        public List<CanvasElement> elements = new List<CanvasElement>();
        
        private int curElement = -1;
        private Point oldMouse = new Point(-1, -1);

        public Dialogue(List<DialogueItem> items, List<CanvasElement> elements, DialogueType dialogueType)
        {
            InitializeComponent();

            //Load dialogue system

            dialogSystem.loadSystem(items);

            //Set canvas elements

            if (elements != null)
                this.elements = elements;

            //If not an item enable certain options
            //only applicable to NPCs

            switch (dialogueType)
            {
                case DialogueType.NPC:
                    turnHostileToolStripMenuItem.Enabled = true;
                    break;
                case DialogueType.NPCQuest:
                    turnHostileToolStripMenuItem.Enabled = true;
                    advanceQuestToolStripMenuItem.Enabled = true;
                    break;
                case DialogueType.Map:
                    //...
                    break;
                case DialogueType.Item:
                    //...
                    break;
            }
        }

        private void Dialogue_Load(object sender, EventArgs e)
        {
            canvas.Paint += new PaintEventHandler(paintCanvas);
            canvas.Resize += (object s, EventArgs ea) => { canvas.Invalidate();  };

            canvas.MouseDown += new MouseEventHandler(canvasMouseDown);
            canvas.MouseUp += new MouseEventHandler(canvasMouseUp);
            canvas.MouseMove += new MouseEventHandler(canvasMouseMove);
            canvas.MouseDoubleClick += new MouseEventHandler(openDialogueItem);

            canvas.Invalidate();
        }

        private void canvasMouseDown(object sender, MouseEventArgs e)
        {
            if (e.Button == MouseButtons.Left)
            {
                oldMouse = canvas.PointToClient(MousePosition);

                curElement = grabElement();
            }
            else
            {
                int el = grabElement();

                if (el != -1)
                {
                    dialogSystem.items[elements[el].id] = null;

                    elements[el] = null;

                    canvas.Invalidate();
                }
            }
        }

        private void openDialogueItem(object sender, MouseEventArgs e)
        {
            int item = grabElement();

            if (item == -1)
                return;

            if (!elements[item].isEvent)
            {
                DialogueProperties dp = new DialogueProperties(dialogSystem.items[elements[item].id]);

                dp.FormClosed += (object s, FormClosedEventArgs fcea) =>
                {
                    dialogSystem.items[elements[item].id] = dp.current;

                    if (dp.current.entry)
                        for (int i = 0; i < dialogSystem.items.Count; i++)
                            if (i != elements[item].id &&
                                dialogSystem.items[i] != null &&
                                dialogSystem.items[i].entry)
                            {
                                dp.current.entry = false;

                                MessageBox.Show("The dialog item could not be set as the entry point, as an entry point already exists.", "WebClash - Error");

                                break;
                            }

                    canvas.Invalidate();
                };

                dp.Text = "Edit item #" + elements[item].id;

                dp.ShowDialog();
            }
            else
            {
                //Make sure it is not the turn hostile event

                if (dialogSystem.items[elements[item].id].eventType == "TurnHostile")
                {
                    MessageBox.Show("The 'Turn Hostile' event has no event properties.", "WebClash - Message");

                    return;
                }

                //If it is a show shop event, open shop selection
                //form instead of dialogue event properties

                if (dialogSystem.items[elements[item].id].eventType == "ShowShop")
                {
                    //Open shop selection

                    ShopSelection ss = new ShopSelection("Shop event #" + elements[item].id, dialogSystem.items[elements[item].id].showShopEvent);
                    
                    ss.FormClosed += (object s, FormClosedEventArgs fcea) =>
                    {
                        dialogSystem.items[elements[item].id].showShopEvent = ss.GetResult();
                    };

                    ss.ShowDialog();

                    return;
                }

                //If it is a show bank event, open a text input
                //form instead of dialogue event properties

                if (dialogSystem.items[elements[item].id].eventType == "ShowBank")
                {
                    //Open text input

                    TextInput ti = new TextInput("Bank event #" + elements[item].id, "Set the bank name", dialogSystem.items[elements[item].id].showBankEvent.name);

                    ti.ShowDialog();
                    if (ti.DialogResult == DialogResult.OK)
                        dialogSystem.items[elements[item].id].showBankEvent.name = ti.GetResult();

                    return;
                }

                //Open event properties

                DialogueEventProperties dep = new DialogueEventProperties(dialogSystem.items[elements[item].id]);

                dep.FormClosed += (object s, FormClosedEventArgs fcea) =>
                {
                    dialogSystem.items[elements[item].id] = dep.current;

                    //Check if entry point (Get Global Variable)

                    if (dep.current.entry)
                        for (int i = 0; i < dialogSystem.items.Count; i++)
                            if (i != elements[item].id &&
                                dialogSystem.items[i] != null &&
                                dialogSystem.items[i].entry)
                            {
                                dep.current.entry = false;

                                MessageBox.Show("The dialog event could not be set as the entry point, as an entry point already exists.", "WebClash - Error");

                                break;
                            }

                    canvas.Invalidate();
                };

                dep.Text = "Edit event #" + elements[item].id;

                dep.ShowDialog();
            }
        }

        private void canvasMouseUp(object sender, MouseEventArgs e)
        {
            curElement = -1;
        }

        private void canvasMouseMove(object sender, MouseEventArgs e)
        {
            if (curElement != -1)
            {
                Point mouse = canvas.PointToClient(MousePosition);

                elements[curElement].p.X += mouse.X-oldMouse.X;
                elements[curElement].p.Y += mouse.Y-oldMouse.Y;

                oldMouse = mouse;

                canvas.Invalidate();
            }
        }

        private int grabElement()
        {
            for (int i = elements.Count-1; i >= 0; i--)
            {
                CanvasElement ca = elements[i];

                if (ca == null)
                    continue;

                if (new Rectangle(
                        ca.p,
                        ca.size
                    ).Contains(
                        canvas.PointToClient(MousePosition)
                    ))
                    return i;
            }

            return -1;
        }

        private void paintCanvas(object sender, PaintEventArgs pea)
        {
            Graphics g = pea.Graphics;

            //Clear canvas

            g.Clear(Color.FromKnownColor(KnownColor.ControlLight));

            //Draw all elements

            foreach (CanvasElement ca in elements)
                if (ca != null)
                    drawDialogueItem(g, ca);
        }

        private void drawDialogueItem(Graphics g, CanvasElement ca)
        {
            try
            {
                Rectangle r = new Rectangle(ca.p, ca.size);
                Pen p = new Pen(Brushes.Black, 2);

                p.CustomEndCap = new AdjustableArrowCap(4, 4);

                if (dialogSystem.items[ca.id].entry)
                    g.DrawLine(
                        p,
                        0,
                        ca.p.Y + ca.size.Height / 2,
                        ca.p.X,
                        ca.p.Y + ca.size.Height / 2
                    );

                for (int i = 0; i < dialogSystem.items[ca.id].options.Count; i++)
                {
                    if (dialogSystem.items[ca.id].options[i].next == -1)
                    {
                        int x = ca.p.X + ca.size.Width,
                            y = ca.p.Y + ca.size.Height / 2;

                        g.DrawLine(
                            p,
                            x, y,
                            x + ca.size.Width / 2,
                            y
                        );

                        g.DrawString(
                            "Exit",
                            DefaultFont,
                            Brushes.Black,
                            new Point(
                                x + ca.size.Width / 2 + 4,
                                y - 4
                            )
                        );
                    }
                    else if (dialogSystem.items[ca.id].options[i].next < elements.Count)
                    {
                        CanvasElement target = elements[dialogSystem.items[ca.id].options[i].next];

                        if (target == null)
                            continue;

                        g.DrawLine(
                            p,
                            ca.p.X + ca.size.Width,
                            ca.p.Y + ca.size.Height / 2,
                            target.p.X,
                            target.p.Y + target.size.Height / 2
                        );
                    }
                }

                g.FillRectangle(Brushes.WhiteSmoke, r);
                g.DrawRectangle(Pens.Black, r);

                int offset = 4;
                g.DrawString(
                    "#" + ca.id + ": " + (ca.isEvent ? dialogSystem.items[ca.id].eventType : dialogSystem.items[ca.id].text),
                    DefaultFont,
                    Brushes.Black,
                    new Rectangle(
                        r.X + offset,
                        r.Y + offset,
                        r.Width - offset,
                        r.Height - offset
                    )
                );
            }
            catch
            {
                //...
            }
        }

        private void newItemToolStripMenuItem_Click(object sender, EventArgs e)
        {
            bool done = false;
            CanvasElement ca = new CanvasElement(
                new Point(20, canvas.Height / 2 - 40),
                dialogSystem.addDialogueItem(false)
            );

            for (int i = 0; i < elements.Count; i++)
                if (elements[i] == null)
                {
                    elements[i] = ca;
                    done = true;
                    break;
                }

            if (!done)
                elements.Add(ca);

            canvas.Invalidate();
        }

        private void addCanvasEventElement(EventType et)
        {
            CanvasEventElement cee = new CanvasEventElement(
                new Point(20, canvas.Height / 2 - 40),
                dialogSystem,
                et
            );

            dialogSystem.items[cee.id].eventType = Enum.GetName(typeof(EventType), et);

            switch (dialogSystem.items[cee.id].eventType)
            {
                case "GiveItem":
                    dialogSystem.items[cee.id].giveItemEvent = new GiveItemEvent();
                    break;
                case "LoadMap":
                    dialogSystem.items[cee.id].loadMapEvent = new LoadMapEvent();
                    break;
                case "AffectPlayer":
                    dialogSystem.items[cee.id].affectPlayerEvent = new AffectPlayerEvent();
                    break;
                case "SpawnNPC":
                    dialogSystem.items[cee.id].spawnNPCEvent = new SpawnNPCEvent();
                    break;
                case "TurnHostile":
                    dialogSystem.items[cee.id].turnHostileEvent = new TurnHostileEvent();
                    dialogSystem.items[cee.id].repeatable = true;
                    break;
                case "ShowQuest":
                    dialogSystem.items[cee.id].showQuestEvent = new ShowQuestEvent();
                    break;
                case "ShowShop":
                    dialogSystem.items[cee.id].showShopEvent = new ShowShopEvent();
                    dialogSystem.items[cee.id].repeatable = true;
                    break;
                case "ShowBank":
                    dialogSystem.items[cee.id].showBankEvent = new ShowBankEvent();
                    dialogSystem.items[cee.id].repeatable = true;
                    break;
                case "AdvanceQuest":
                    dialogSystem.items[cee.id].advanceQuestEvent = new AdvanceQuestEvent();
                    dialogSystem.items[cee.id].repeatable = true;
                    break;
                case "GetVariable":
                    dialogSystem.items[cee.id].getVariableEvent = new GetVariableEvent();
                    dialogSystem.items[cee.id].repeatable = true;
                    break;
                case "SetVariable":
                    dialogSystem.items[cee.id].setVariableEvent = new SetVariableEvent();
                    dialogSystem.items[cee.id].repeatable = true;
                    break;
                default:
                    break;
            }

            dialogSystem.items[cee.id].options.Add(new DialogueOption(-1));
            dialogSystem.items[cee.id].options.Add(new DialogueOption(-1));

            bool done = false;

            for (int i = 0; i < elements.Count; i++)
                if (elements[i] == null)
                {
                    elements[i] = cee;
                    done = true;
                    break;
                }

            if (!done)
                elements.Add(cee);

            canvas.Invalidate();
        }

        //General Events

        private void giveItemToolStripMenuItem_Click(object sender, EventArgs e)
        {
            addCanvasEventElement(EventType.GiveItem);

            canvas.Invalidate();
        }

        private void loadMapToolStripMenuItem_Click(object sender, EventArgs e)
        {
            addCanvasEventElement(EventType.LoadMap);

            canvas.Invalidate();
        }

        private void affectPlayerToolStripMenuItem_Click(object sender, EventArgs e)
        {
            addCanvasEventElement(EventType.AffectPlayer);

            canvas.Invalidate();
        }

        private void spawnNPCToolStripMenuItem_Click(object sender, EventArgs e)
        {
            addCanvasEventElement(EventType.SpawnNPC);

            canvas.Invalidate();
        }

        private void showQuestToolStripMenuItem_Click(object sender, EventArgs e)
        {
            addCanvasEventElement(EventType.ShowQuest);

            canvas.Invalidate();
        }

        private void TurnHostileToolStripMenuItem_Click(object sender, EventArgs e)
        {
            addCanvasEventElement(EventType.TurnHostile);

            canvas.Invalidate();
        }

        private void ShowShopToolStripMenuItem_Click(object sender, EventArgs e)
        {
            addCanvasEventElement(EventType.ShowShop);

            canvas.Invalidate();
        }

        private void showBankToolStripMenuItem_Click(object sender, EventArgs e)
        {
            addCanvasEventElement(EventType.ShowBank);

            canvas.Invalidate();
        }

        private void advanceQuestToolStripMenuItem_Click(object sender, EventArgs e)
        {
            addCanvasEventElement(EventType.AdvanceQuest);

            canvas.Invalidate();
        }

        //Player Events

        private void GetVariableToolStripMenuItem_Click(object sender, EventArgs e)
        {
            addCanvasEventElement(EventType.GetVariable);

            canvas.Invalidate();
        }

        private void SetVariableToolStripMenuItem_Click(object sender, EventArgs e)
        {
            addCanvasEventElement(EventType.SetVariable);

            canvas.Invalidate();
        }
    }

    public enum DialogueType
    {
        NPC = 0,
        NPCQuest,
        Item,
        Map,
    }

    public class CanvasElement
    {
        public CanvasElement(Point p, int id)
        {
            this.p = p;
            this.id = id;

            size = new Size(100, 80);
        }

        public Point p = default(Point);
        public int id = 0;

        public bool isEvent = false;

        public Size size;
    }

    public class CanvasEventElement : CanvasElement
    {
        public CanvasEventElement(Point p, DialogueSystem ds, EventType tp) : base(p, ds.addDialogueItem(true))
        {
            isEvent = true;

            size = new Size(110, 20);
        }
    }

    public enum EventType
    {
        GiveItem = 0,
        LoadMap,
        AffectPlayer,
        SpawnNPC,
        TurnHostile,
        ShowQuest,
        ShowShop,
        ShowBank,
        AdvanceQuest,
        SetVariable,
        GetVariable
    }
}
