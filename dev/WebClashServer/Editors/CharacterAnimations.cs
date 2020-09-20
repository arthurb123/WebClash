using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Timers;
using System.Windows.Forms;
using WebClashServer.Classes;
using Timer = System.Timers.Timer;

namespace WebClashServer.Editors
{
    public partial class CharacterAnimations : Form
    {
        public static CharacterAnimations instance;

        private Character current = null;
        private Image currentImage = null;
        private AnimationSheet currentSheet = null;
        private readonly int canvasSize = 128;

        private int elapsed = 0;
        private int upFrame = 0;
        private int downFrame = 0;
        private int leftFrame = 0;
        private int rightFrame = 0;

        private Timer frameTimer;
        private Stopwatch stopwatch;

        public CharacterAnimations(Character character, Image image, string name)
        {
            InitializeComponent();
            instance = this;

            current = character;
            currentImage = image;

            Text = "WebClash - Edit animations for '" + name + "'";
        }

        private void CharacterAnimations_Load(object sender, EventArgs e)
        {
            animationList.SelectedIndex = 0;

            stopwatch = Stopwatch.StartNew();

            frameTimer = new Timer(1);
            frameTimer.Elapsed += frameTimer_Tick;
            frameTimer.AutoReset = true;
            frameTimer.Start();
        }

        private void animationList_SelectedIndexChanged(object sender, EventArgs e)
        {
            LoadSheet(GrabSheet(current, (string)animationList.SelectedItem));
        }

        private void LoadSheet(AnimationSheet sheet)
        {
            if (sheet == null)
                return;

            ResetAnimationTimers();
            currentSheet = sheet;

            //Construct others list

            List<string> items = new List<string>()
            {
                "Idle",
                "Walking",
                "Running",
                "Casting",
                "Attacking"
            };
            items.Remove(sheet.name);

            others.Items.Clear();
            for (int i = 0; i < items.Count; i++)
                if (!GrabSheet(current, items[i]).IsEmpty())
                    others.Items.Add(items[i]);

            //Set UI

            useOther.Checked = sheet.useOther;

            leftGroupBox.Enabled = !useOther.Checked;
            rightGroupBox.Enabled = !useOther.Checked;
            upGroupBox.Enabled = !useOther.Checked;
            downGroupBox.Enabled = !useOther.Checked;
            speed.Enabled = !useOther.Checked;

            others.SelectedItem = sheet.other;
            others.Enabled = useOther.Checked;

            //Load frames

            speed.Value = sheet.speed;

            //Invalidate

            InvalidateCanvasses();
        }

        public static AnimationSheet GrabSheet(Character character, string name)
        {
            switch (name)
            {
                case "Idle":
                    return character.animations.idle;
                case "Walking":
                    return character.animations.walking;
                case "Running":
                    return character.animations.running;
                case "Casting":
                    return character.animations.casting;
                case "Attacking":
                    return character.animations.attacking;
            }

            return null;
        }

        private void EditSheet(Direction direction)
        {
            if (currentSheet == null)
                return;

            string name = (string)animationList.SelectedItem;

            SheetSelection sheetSelection = new SheetSelection(
                current,
                currentSheet,
                currentImage,
                name,
                direction
            );

            sheetSelection.ShowDialog();
            sheetSelection.FormClosed += new FormClosedEventHandler((_, __) =>
            {
                LoadSheet(currentSheet);
            });
        }

        private void editDownFrames_Click(object sender, EventArgs e)
        {
            EditSheet(Direction.Down);
        }

        private void editUpFrames_Click(object sender, EventArgs e)
        {
            EditSheet(Direction.Up);
        }

        private void editLeftFrames_Click(object sender, EventArgs e)
        {
            EditSheet(Direction.Left);
        }

        private void editRightFrames_Click(object sender, EventArgs e)
        {
            EditSheet(Direction.Right);
        }

        private void useOther_CheckedChanged(object sender, EventArgs e)
        {
            if (currentSheet == null)
                return;

            if (!useOther.Checked)
            {
                currentSheet.other = "";
                others.SelectedItem = "";
            }

            currentSheet.useOther = useOther.Checked;
            others.Enabled = useOther.Checked;

            leftGroupBox.Enabled = !useOther.Checked;
            rightGroupBox.Enabled = !useOther.Checked;
            upGroupBox.Enabled = !useOther.Checked;
            downGroupBox.Enabled = !useOther.Checked;
            speed.Enabled = !useOther.Checked;
        }

        private void others_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (currentSheet == null || !currentSheet.useOther)
                return;

            currentSheet.other = (string)others.SelectedItem;
        }

        public static void ResetAnimationTimers()
        {
            instance.elapsed = 0;

            instance.upFrame = 0;
            instance.downFrame = 0;
            instance.leftFrame = 0;
            instance.rightFrame = 0;
        }

        private void speed_ValueChanged(object sender, EventArgs e)
        {
            if (currentSheet == null)
                return;

            currentSheet.speed = (int)speed.Value;

            ResetAnimationTimers();
        }

        private void downCanvas_Paint(object sender, PaintEventArgs e)
        {
            DrawFrame(e.Graphics, Direction.Down, downFrame);
        }

        private void upCanvas_Paint(object sender, PaintEventArgs e)
        {
            DrawFrame(e.Graphics, Direction.Up, upFrame);
        }

        private void leftCanvas_Paint(object sender, PaintEventArgs e)
        {
            DrawFrame(e.Graphics, Direction.Left, leftFrame);
        }

        private void rightCanvas_Paint(object sender, PaintEventArgs e)
        {
            DrawFrame(e.Graphics, Direction.Right, rightFrame);
        }

        private void InvalidateCanvasses()
        {
            upCanvas.Invalidate();
            downCanvas.Invalidate();
            rightCanvas.Invalidate();
            leftCanvas.Invalidate();
        }

        private void DrawFrame(Graphics g, Direction direction, int frame)
        {
            try
            {
                g.Clear(SystemColors.ControlLight);
                g.SmoothingMode = SmoothingMode.HighQuality;

                //Grab correct sheet

                AnimationSheet sheet =
                    (currentSheet.useOther
                        ? GrabSheet(current, currentSheet.other)
                        : currentSheet);

                if (sheet == null)
                    return;

                Point2D[] frames = sheet.frames[(int)direction];
                if (frames.Length == 0 || frame >= frames.Length)
                    return;

                //Get clip data

                Size s = new Size(current.width, current.height);
                Point2D p = frames[frame];

                //Calculate centered drawing point
                //and destination rectangle

                Point center = new Point(
                    canvasSize / 2 - current.width / 2,
                    canvasSize / 2 - current.height / 2
                );

                Rectangle destination = new Rectangle(center, s);

                //Draw frame

                g.DrawImage(
                    currentImage,
                    destination,
                    p.x, p.y,
                    s.Width, s.Height,
                    GraphicsUnit.Pixel
                );

                //Draw frame indicator

                g.DrawString(
                    (frame + 1) + "/" + frames.Length,
                    DefaultFont,
                    Brushes.Black,
                    new Point(3, 3)
                );
            }
            catch
            {
                //...
            }
        }

        private void frameTimer_Tick(object sender, ElapsedEventArgs e)
        {
            if (currentSheet == null)
                return;

            AnimationSheet sheet =
                (currentSheet.useOther
                    ? GrabSheet(current, currentSheet.other)
                    : currentSheet);

            if (sheet == null)
                return;

            elapsed += (int)(stopwatch.ElapsedTicks / TimeSpan.TicksPerMillisecond);
            stopwatch = Stopwatch.StartNew();

            if (elapsed >= sheet.speed)
            {
                upFrame++;
                downFrame++;
                leftFrame++;
                rightFrame++;

                if (upFrame >= sheet.frames[(int)Direction.Up].Length)
                    upFrame = 0;
                if (downFrame >= sheet.frames[(int)Direction.Down].Length)
                    downFrame = 0;
                if (leftFrame >= sheet.frames[(int)Direction.Left].Length)
                    leftFrame = 0;
                if (rightFrame >= sheet.frames[(int)Direction.Right].Length)
                    rightFrame = 0;

                elapsed = 0;

                InvalidateCanvasses();
            }
        }
    }
}
