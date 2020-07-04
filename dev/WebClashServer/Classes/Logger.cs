using System;
using System.Windows.Forms;
using MessageBox = System.Windows.Forms.MessageBox;
using MessageBoxButton = System.Windows.Forms.MessageBoxButtons;

namespace WebClashServer.Classes
{
    public static class Logger
    {
        public static void Error(string message, Exception exc = null)
        {
            MessageBox.Show(
                message + (exc != null ? exc.Message + exc.StackTrace : ""), 
                "WebClash - Error"
            );
        }

        public static void Message(string message)
        {
            MessageBox.Show(message, "WebClash - Message");
        }

        public static bool Question(string message)
        {
            return MessageBox.Show(message, "WebClash - Question", MessageBoxButton.YesNo) == DialogResult.Yes;
        }
    }
}
