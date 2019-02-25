using System;
using System.Collections.Generic;
using WebClashServer.Editors;

namespace WebClashServer.Classes
{
    public class DialogueSystem
    {
        public List<DialogueItem> items = new List<DialogueItem>();

        public void loadSystem(List<DialogueItem> items)
        {
            if (items == null ||
                items.Count == 0)
                return;

            this.items = items;
        }

        public int addDialogueItem(bool isEvent)
        {
            for (int i = 0; i < items.Count; i++)
                if (items[i] == null)
                {
                    items[i] = new DialogueItem(isEvent);

                    return i;
                }

            items.Add(new DialogueItem(isEvent));

            return items.Count - 1;
        }
    }

    public class DialogueItem
    {
        public DialogueItem(bool isEvent)
        {
            text = "";
            portrait = "";

            this.isEvent = isEvent;

            options = new List<DialogueOption>();
        }

        public string text;
        public string portrait;

        public bool entry = false;

        public bool isEvent = false;

        public List<DialogueOption> options;
        
        //Event stuff

        public string eventType = "";

        public bool repeatable = false;

        //Give item event

        public string item = "";

        public int amount = 1;

        //Load map event

        public string map = "";

        public int positionX = 0,
                   positionY = 0;
    }

    public class DialogueOption
    {
        public DialogueOption(int next)
        {
            this.next = next;
        }

        public override string ToString()
        {
            return "'" + text + "' → #" + next;
        }

        public string text = "";
        public int next = -1;
    }
}
