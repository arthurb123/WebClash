using System;
using System.Collections.Generic;
using WebClashServer.Editors;

namespace WebClashServer.Classes
{
    public class DialogueSystem
    {
        public List<DialogueItem> items;

        public void loadSystem(List<DialogueItem> items)
        {
            if (items == null ||
                items.Count == 0)
            {
                items = new List<DialogueItem>();
            }

            this.items = items;
        }

        public int addDialogueItem()
        {
            items.Add(new DialogueItem());

            return items.Count - 1;
        }

        public int addDialogueEvent(EventType et)
        {
            switch (et)
            {
                case EventType.GiveItem:
                    items.Add(new GiveItemEvent());
                    break;
                case EventType.LoadMap:
                    items.Add(new LoadMapEvent());
                    break;
            }

            return items.Count - 1;
        }
    }

    public class DialogueItem
    {
        public DialogueItem()
        {
            text = "";
            portrait = "";

            entry = false;

            options = new List<DialogueOption>();
        }

        public string text;
        public string portrait;

        public bool entry;

        public List<DialogueOption> options;
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
    
    public class DialogueEvent : DialogueItem
    {
        public DialogueEvent(EventType et) : base()
        {
            eventType = Enum.GetName(typeof(EventType), et);
        }

        public string eventType = "";

        public bool repeatable = false;
    }

    //Custom events

    public class GiveItemEvent : DialogueEvent
    {
        public GiveItemEvent() : base(EventType.GiveItem)
        {
            //...
        }

        public string item = "";
        public int amount = 1;
    }

    public class LoadMapEvent : DialogueEvent
    {
        public LoadMapEvent() : base(EventType.LoadMap)
        {
            //...
        }

        public string map = "";

        public int positionX = 0,
                   positionY = 0;
    }
}
