using System.Collections.Generic;

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

            return items.Count-1;
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
}
