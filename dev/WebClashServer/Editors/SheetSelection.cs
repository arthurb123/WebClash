using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;
using WebClashServer.Classes;

namespace WebClashServer.Editors
{
    public partial class SheetSelection : Form
    {
        private Character current;
        private Image currentImage;
        private AnimationSheet currentSheet;
        private Direction currentDirection;

        private Point camera = Point.Empty;
        private Point oldMp = Point.Empty;
        private bool moving = false;

        public SheetSelection(Character character, AnimationSheet sheet, Image image, string animation, Direction direction)
        {
            InitializeComponent();

            Text = "WebClash - Edit " + animation.ToLower() + " " + direction.ToString().ToLower() + " frames";

            current = character;
            currentSheet = sheet;
            currentImage = image;
            currentDirection = direction;

            camera = new Point(
                canvas.Width / 2 - image.Width / 2,
                canvas.Height / 2 - image.Height / 2
            );

            LoadFrameList();

            canvas.Paint += Canvas_Paint;
            canvas.Invalidate();
        }

        private void LoadFrameList()
        {
            frameList.Items.Clear();

            Point2D[] frames = currentSheet.frames[(int)currentDirection];

            for (int f = 0; f < frames.Length; f++)
                frameList.Items.Add((f + 1) + ". (" + frames[f].x + ", " + frames[f].y + ")");
        }

        private void clear_Click(object sender, EventArgs e)
        {
            currentSheet.frames[(int)currentDirection] = new Point2D[0];

            LoadFrameList();
        }

        private void Canvas_Paint(object sender, PaintEventArgs e)
        {
            Graphics g = e.Graphics;
            g.SmoothingMode = SmoothingMode.HighQuality;

            g.Clear(SystemColors.ControlLight);

            //Draw spritesheet

            g.DrawImage(
                currentImage,
                new Rectangle(
                    camera.X, camera.Y,
                    currentImage.Width, currentImage.Height
                )
            );

            //Draw character grid

            int tx = currentImage.Width / current.width;
            int ty = currentImage.Height / current.height;

            Pen gridPen = new Pen(new SolidBrush(Color.FromArgb(125, 0, 0, 0)), 1);
            for (int x = 0; x < tx; x++)
                for (int y = 0; y < ty; y++)
                    g.DrawRectangle(
                        gridPen,
                        new Rectangle(
                            camera.X + x * current.width,
                            camera.Y + y * current.height,
                            current.width,
                            current.height
                        )
                    );

            //Draw frames

            Point2D[] frames = currentSheet.frames[(int)currentDirection];

            Pen framePen = new Pen(Brushes.Magenta, 1.5f);
            for (int f = 0; f < frames.Length; f++)
            {
                //Draw frame rectangle

                g.DrawRectangle(
                    framePen,
                    new Rectangle(
                        camera.X + frames[f].x,
                        camera.Y + frames[f].y,
                        current.width,
                        current.height
                    )
                );

                //Draw shadowed ID

                g.DrawString(
                    "#" + (f + 1),
                    new Font(DefaultFont, FontStyle.Bold),
                    Brushes.Black,
                    new Point(
                        camera.X + frames[f].x + 1,
                        camera.Y + frames[f].y + 2
                    )
                );
            }
        }

        private void canvas_MouseDown(object sender, MouseEventArgs e)
        {
            switch (e.Button)
            {
                case MouseButtons.Left:
                    //Create frame if mouse is in
                    //the sheet area, otherwise
                    //default to camera movement

                    if (IsMouseInSheet())
                        CreateFrame();
                    else
                    {
                        oldMp = e.Location;
                        moving = true;
                    }

                    break;
                case MouseButtons.Middle:
                    //Allow for camera movement

                    oldMp = e.Location;
                    moving = true;

                    break;
                case MouseButtons.Right:
                    //Remove frame if mouse is in
                    //the sheet area, otherwise
                    //default to camera movement

                    if (IsMouseInSheet())
                        RemoveFrame();
                    else
                    {
                        oldMp = e.Location;
                        moving = true;
                    }

                    break;
            }
        }

        private void canvas_MouseMove(object sender, MouseEventArgs e)
        {
            if (!moving)
                return;

            camera.X += e.X - oldMp.X;
            camera.Y += e.Y - oldMp.Y;

            oldMp = e.Location;

            canvas.Invalidate();
        }

        private void canvas_MouseUp(object sender, MouseEventArgs e)
        {
            moving = false;
        }

        private bool IsMouseInSheet()
        {
            Point mouse = canvas.PointToClient(MousePosition);
            mouse.X -= camera.X;
            mouse.Y -= camera.Y;

            Rectangle sheet = new Rectangle(
                0, 0,
                currentImage.Width, currentImage.Height
            );

            return sheet.Contains(mouse);
        }

        private void CreateFrame()
        {
            //Get the frame the mouse is in

            Point mouse = canvas.PointToClient(MousePosition);
            mouse.X -= camera.X;
            mouse.Y -= camera.Y;

            int fx = (int)Math.Floor((float)mouse.X / current.width) * current.width;
            int fy = (int)Math.Floor((float)mouse.Y / current.height) * current.height;

            //Check if frame already exists

            Point2D[] frames = currentSheet.frames[(int)currentDirection];

            for (int f = 0; f < frames.Length; f++)
                if (frames[f].x == fx &&
                    frames[f].y == fy)
                    return;

            //Add frame

            List<Point2D> newFrames = new List<Point2D>(frames)
            {
                new Point2D(fx, fy)
            };

            currentSheet.frames[(int)currentDirection] = newFrames.ToArray();

            //Reset animation timers

            CharacterAnimations.ResetAnimationTimers();

            //Refresh UI

            LoadFrameList();
            canvas.Invalidate();
        }

        private void RemoveFrame()
        {
            //Get the frame the mouse is in

            Point mouse = canvas.PointToClient(MousePosition);
            mouse.X -= camera.X;
            mouse.Y -= camera.Y;

            int fx = (int)Math.Floor((float)mouse.X / current.width) * current.width;
            int fy = (int)Math.Floor((float)mouse.Y / current.height) * current.height;

            //Check if frame already exists

            Point2D[] frames = currentSheet.frames[(int)currentDirection];

            List<Point2D> newFrames = new List<Point2D>(frames);

            for (int f = 0; f < frames.Length; f++)
                if (frames[f].x == fx &&
                    frames[f].y == fy)
                {
                    newFrames.RemoveAt(f);
                    break;
                }

            currentSheet.frames[(int)currentDirection] = newFrames.ToArray();

            //Reset animation timers

            CharacterAnimations.ResetAnimationTimers();

            //Refresh UI

            LoadFrameList();
            canvas.Invalidate();
        }
    }
}
