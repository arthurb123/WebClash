using System.Drawing;

namespace WebClashServer.Classes
{
    public class Point2D
    {
        public Point2D(int x, int y)
        {
            this.x = x;
            this.y = y;
        }

        public int x = 0;
        public int y = 0;

        public Point ToDrawingPoint()
        {
            return new Point(x, y);
        }
    }

    public enum Direction
    {
        Down = 0,
        Left,
        Right,
        Up
    }
}
