using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using WebClashServer.Editors;

namespace WebClashServer.Classes
{
    public class Action
    {
        public Action(string source)
        {
            try
            {
                Action temp = JsonConvert.DeserializeObject<Action>(File.ReadAllText(source));

                elements = temp.elements;

                sounds = temp.sounds;

                name = temp.name;

                targetType = temp.targetType;

                maxRange = temp.maxRange;

                heal = temp.heal;

                mana = temp.mana;

                src = temp.src;

                description = temp.description;

                cooldown = temp.cooldown;

                castingTime = temp.castingTime;
            }
            catch (Exception exc)
            {
                Logger.Error("Could not construct action instance: ", exc);
            }
        }

        public Action()
        {
        }

        public void AddElement()
        {
            List<Element> temp = new List<Element>(elements)
            {
                new Element()
            };

            elements = temp.ToArray();
        }

        public void RemoveElement(int id)
        {
            List<Element> temp = new List<Element>(elements);

            temp.RemoveAt(id);

            elements = temp.ToArray();
        }

        public int sw = 448,
                   sh = 448;

        public string name = "New Action";
        public string src = "";
        public string description = "";

        public Element[] elements = new Element[0];

        public PossibleSound[] sounds = new PossibleSound[0];

        public string targetType = "none";
        public int maxRange = 1;

        public int heal = 0,
                   mana = 0;

        public int cooldown = 0,
                   castingTime = 0;
    };

    //Element

    public class Element : ICloneable
    {
        public int x = 0,
                   y = 0;

        public int w = 64,
                   h = 64;

        public float scale = 1.0f;
        public string src = "";
        public bool animated = true;
        public int speed = 8;
        public string direction = "horizontal";

        public string type = "static";
        public bool rotates = true;
        public int projectileSpeed = 1;
        public int projectileDistance = 0;

        public Scaling scaling = new Scaling();
        public int delay = 0;
        public string statusEffect = "";

        public bool snappedX = false;
        public bool snappedY = false;

        public object Clone()
        {
            return MemberwiseClone();
        }
    };

    public class Scaling
    {
        public float
            power = 0.0f,
            agility = 0.0f,
            intelligence = 0.0f,
            wisdom = 0.0f,
            toughness = 0.0f,
            vitality = 0.0f;
    };

    public class Frame
    {
        public int cur = 0;
        public int frame = 0;
    };
}
