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

        //Events

        public GiveItemEvent giveItemEvent = null;

        public LoadMapEvent loadMapEvent = null;

        public AffectPlayerEvent affectPlayerEvent = null;

        public SpawnNPCEvent spawnNPCEvent = null;

        public TurnHostileEvent turnHostileEvent = null;

        public ShowQuestEvent showQuestEvent = null;

        public ShowShopEvent showShopEvent = null;

        public ShowBankEvent showBankEvent = null;

        public AdvanceQuestEvent advanceQuestEvent = null;

        public GetVariableEvent getVariableEvent = null;

        public SetVariableEvent setVariableEvent = null;
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

    //Events

    public class GiveItemEvent
    {
        public string item = "";

        public int amount = 1;
    }

    public class LoadMapEvent
    {
        public string map = "";

        public int positionX = 0,
                   positionY = 0;
    }

    public class AffectPlayerEvent
    {
        public int healthDifference = 0;
        public int manaDifference = 0;
        public int currencyDifference = 0;
    }

    public class SpawnNPCEvent
    {
        public string name = "";

        public int profile = 0;

        public int amount = 1;

        public bool hostile = false;
    }

    public class TurnHostileEvent
    {
        //...
    }

    public class ShowQuestEvent
    {
        public string name = "";
    }

    public class ShowShopEvent
    {
        public string name = "Shop";

        public ShopItem[] items = new ShopItem[0];

        public bool acceptSell = true;
    }

    public class ShowBankEvent
    {
        public string name = "Bank";
    }

    public class AdvanceQuestEvent
    {
        public bool entry = false;
    }

    public class GetVariableEvent
    {
        public string name = "";
    }

    public class SetVariableEvent
    {
        public string name = "";

        public bool value = false;
    }
}
