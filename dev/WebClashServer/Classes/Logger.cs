using System;
using System.Windows;

namespace WebClashServer.Classes
{
    public static class Logger
    {
        public static void Error(string message, Exception exc = null)
        {
            MessageBox.Show(
                message + (exc != null ? exc.Message + " (" + exc.StackTrace + ")" : ""), 
                "WebClash - Error"
            );
        }

        public static void Message(string message)
        {
            MessageBox.Show(message, "WebClash - Message");
        }
    }
}
