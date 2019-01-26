namespace WebClashServer
{
    partial class Items
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Items));
            this.itemList = new System.Windows.Forms.ListBox();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.value = new System.Windows.Forms.NumericUpDown();
            this.label5 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.rarity = new System.Windows.Forms.ComboBox();
            this.label3 = new System.Windows.Forms.Label();
            this.src = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.name = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.icon = new System.Windows.Forms.PictureBox();
            this.newLink = new System.Windows.Forms.LinkLabel();
            this.saveLink = new System.Windows.Forms.LinkLabel();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.groupBox4 = new System.Windows.Forms.GroupBox();
            this.vitality = new System.Windows.Forms.NumericUpDown();
            this.label11 = new System.Windows.Forms.Label();
            this.wisdom = new System.Windows.Forms.NumericUpDown();
            this.label12 = new System.Windows.Forms.Label();
            this.intelligence = new System.Windows.Forms.NumericUpDown();
            this.label13 = new System.Windows.Forms.Label();
            this.toughness = new System.Windows.Forms.NumericUpDown();
            this.label10 = new System.Windows.Forms.Label();
            this.agility = new System.Windows.Forms.NumericUpDown();
            this.label9 = new System.Windows.Forms.Label();
            this.power = new System.Windows.Forms.NumericUpDown();
            this.label14 = new System.Windows.Forms.Label();
            this.equippableAction = new System.Windows.Forms.ComboBox();
            this.label8 = new System.Windows.Forms.Label();
            this.equippableSource = new System.Windows.Forms.TextBox();
            this.label7 = new System.Windows.Forms.Label();
            this.equippable = new System.Windows.Forms.ComboBox();
            this.label6 = new System.Windows.Forms.Label();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.description = new System.Windows.Forms.RichTextBox();
            this.delete = new System.Windows.Forms.LinkLabel();
            this.groupBox1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.value)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.icon)).BeginInit();
            this.groupBox2.SuspendLayout();
            this.groupBox4.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.vitality)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.wisdom)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.intelligence)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.toughness)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.agility)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.power)).BeginInit();
            this.groupBox3.SuspendLayout();
            this.SuspendLayout();
            // 
            // itemList
            // 
            this.itemList.FormattingEnabled = true;
            this.itemList.Location = new System.Drawing.Point(2, 2);
            this.itemList.Name = "itemList";
            this.itemList.Size = new System.Drawing.Size(120, 355);
            this.itemList.TabIndex = 0;
            this.itemList.SelectedIndexChanged += new System.EventHandler(this.itemList_SelectedIndexChanged);
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.value);
            this.groupBox1.Controls.Add(this.label5);
            this.groupBox1.Controls.Add(this.label4);
            this.groupBox1.Controls.Add(this.rarity);
            this.groupBox1.Controls.Add(this.label3);
            this.groupBox1.Controls.Add(this.src);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Controls.Add(this.name);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Controls.Add(this.icon);
            this.groupBox1.Location = new System.Drawing.Point(126, 3);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(316, 126);
            this.groupBox1.TabIndex = 1;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "General Settings";
            // 
            // value
            // 
            this.value.Location = new System.Drawing.Point(49, 98);
            this.value.Maximum = new decimal(new int[] {
            -1981284353,
            -1966660860,
            0,
            0});
            this.value.Name = "value";
            this.value.Size = new System.Drawing.Size(135, 20);
            this.value.TabIndex = 15;
            this.value.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.value.ValueChanged += new System.EventHandler(this.value_ValueChanged);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(9, 100);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(34, 13);
            this.label5.TabIndex = 14;
            this.label5.Text = "Value";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(238, 20);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(28, 13);
            this.label4.TabIndex = 11;
            this.label4.Text = "Icon";
            // 
            // rarity
            // 
            this.rarity.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.rarity.FormattingEnabled = true;
            this.rarity.Location = new System.Drawing.Point(49, 69);
            this.rarity.Name = "rarity";
            this.rarity.Size = new System.Drawing.Size(135, 21);
            this.rarity.TabIndex = 10;
            this.rarity.SelectedIndexChanged += new System.EventHandler(this.rarity_SelectedIndexChanged);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(8, 72);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(34, 13);
            this.label3.TabIndex = 9;
            this.label3.Text = "Rarity";
            // 
            // src
            // 
            this.src.Location = new System.Drawing.Point(49, 43);
            this.src.Name = "src";
            this.src.Size = new System.Drawing.Size(135, 20);
            this.src.TabIndex = 8;
            this.src.TextChanged += new System.EventHandler(this.src_TextChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(8, 46);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(41, 13);
            this.label2.TabIndex = 7;
            this.label2.Text = "Source";
            // 
            // name
            // 
            this.name.Location = new System.Drawing.Point(49, 17);
            this.name.Name = "name";
            this.name.Size = new System.Drawing.Size(135, 20);
            this.name.TabIndex = 6;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(8, 20);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(35, 13);
            this.label1.TabIndex = 5;
            this.label1.Text = "Name";
            // 
            // icon
            // 
            this.icon.BackColor = System.Drawing.SystemColors.ButtonHighlight;
            this.icon.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            this.icon.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.icon.Location = new System.Drawing.Point(220, 39);
            this.icon.Name = "icon";
            this.icon.Size = new System.Drawing.Size(64, 64);
            this.icon.TabIndex = 4;
            this.icon.TabStop = false;
            // 
            // newLink
            // 
            this.newLink.ActiveLinkColor = System.Drawing.Color.Blue;
            this.newLink.AutoSize = true;
            this.newLink.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.newLink.Location = new System.Drawing.Point(7, 366);
            this.newLink.Name = "newLink";
            this.newLink.Size = new System.Drawing.Size(29, 13);
            this.newLink.TabIndex = 2;
            this.newLink.TabStop = true;
            this.newLink.Text = "New";
            this.newLink.VisitedLinkColor = System.Drawing.Color.Blue;
            this.newLink.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.newLink_LinkClicked);
            // 
            // saveLink
            // 
            this.saveLink.ActiveLinkColor = System.Drawing.Color.Blue;
            this.saveLink.AutoSize = true;
            this.saveLink.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.saveLink.Location = new System.Drawing.Point(47, 366);
            this.saveLink.Name = "saveLink";
            this.saveLink.Size = new System.Drawing.Size(32, 13);
            this.saveLink.TabIndex = 3;
            this.saveLink.TabStop = true;
            this.saveLink.Text = "Save";
            this.saveLink.VisitedLinkColor = System.Drawing.Color.Blue;
            this.saveLink.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.saveLink_LinkClicked);
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.groupBox4);
            this.groupBox2.Controls.Add(this.equippableAction);
            this.groupBox2.Controls.Add(this.label8);
            this.groupBox2.Controls.Add(this.equippableSource);
            this.groupBox2.Controls.Add(this.label7);
            this.groupBox2.Controls.Add(this.equippable);
            this.groupBox2.Controls.Add(this.label6);
            this.groupBox2.Location = new System.Drawing.Point(126, 209);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(316, 170);
            this.groupBox2.TabIndex = 4;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Equipment Settings";
            // 
            // groupBox4
            // 
            this.groupBox4.Controls.Add(this.vitality);
            this.groupBox4.Controls.Add(this.label11);
            this.groupBox4.Controls.Add(this.wisdom);
            this.groupBox4.Controls.Add(this.label12);
            this.groupBox4.Controls.Add(this.intelligence);
            this.groupBox4.Controls.Add(this.label13);
            this.groupBox4.Controls.Add(this.toughness);
            this.groupBox4.Controls.Add(this.label10);
            this.groupBox4.Controls.Add(this.agility);
            this.groupBox4.Controls.Add(this.label9);
            this.groupBox4.Controls.Add(this.power);
            this.groupBox4.Controls.Add(this.label14);
            this.groupBox4.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBox4.Location = new System.Drawing.Point(28, 14);
            this.groupBox4.Name = "groupBox4";
            this.groupBox4.Size = new System.Drawing.Size(256, 97);
            this.groupBox4.TabIndex = 20;
            this.groupBox4.TabStop = false;
            this.groupBox4.Text = "Stat increase";
            // 
            // vitality
            // 
            this.vitality.Location = new System.Drawing.Point(181, 69);
            this.vitality.Maximum = new decimal(new int[] {
            1874919423,
            2328306,
            0,
            0});
            this.vitality.Name = "vitality";
            this.vitality.Size = new System.Drawing.Size(61, 20);
            this.vitality.TabIndex = 11;
            this.vitality.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.vitality.ValueChanged += new System.EventHandler(this.vitality_ValueChanged);
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(127, 71);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(37, 13);
            this.label11.TabIndex = 10;
            this.label11.Text = "Vitality";
            // 
            // wisdom
            // 
            this.wisdom.Location = new System.Drawing.Point(181, 45);
            this.wisdom.Maximum = new decimal(new int[] {
            -1530494977,
            232830,
            0,
            0});
            this.wisdom.Name = "wisdom";
            this.wisdom.Size = new System.Drawing.Size(61, 20);
            this.wisdom.TabIndex = 9;
            this.wisdom.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.wisdom.ValueChanged += new System.EventHandler(this.wisdom_ValueChanged);
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(127, 47);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(45, 13);
            this.label12.TabIndex = 8;
            this.label12.Text = "Wisdom";
            // 
            // intelligence
            // 
            this.intelligence.Location = new System.Drawing.Point(181, 20);
            this.intelligence.Maximum = new decimal(new int[] {
            -727379969,
            232,
            0,
            0});
            this.intelligence.Name = "intelligence";
            this.intelligence.Size = new System.Drawing.Size(61, 20);
            this.intelligence.TabIndex = 7;
            this.intelligence.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.intelligence.ValueChanged += new System.EventHandler(this.intelligence_ValueChanged);
            // 
            // label13
            // 
            this.label13.AutoSize = true;
            this.label13.Location = new System.Drawing.Point(127, 22);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(40, 13);
            this.label13.TabIndex = 6;
            this.label13.Text = "Intellig.";
            // 
            // toughness
            // 
            this.toughness.Location = new System.Drawing.Point(59, 69);
            this.toughness.Maximum = new decimal(new int[] {
            -727379969,
            232,
            0,
            0});
            this.toughness.Name = "toughness";
            this.toughness.Size = new System.Drawing.Size(61, 20);
            this.toughness.TabIndex = 5;
            this.toughness.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.toughness.ValueChanged += new System.EventHandler(this.toughness_ValueChanged);
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(10, 71);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(41, 13);
            this.label10.TabIndex = 4;
            this.label10.Text = "Tough.";
            // 
            // agility
            // 
            this.agility.Location = new System.Drawing.Point(59, 45);
            this.agility.Maximum = new decimal(new int[] {
            99999999,
            0,
            0,
            0});
            this.agility.Name = "agility";
            this.agility.Size = new System.Drawing.Size(61, 20);
            this.agility.TabIndex = 3;
            this.agility.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.agility.ValueChanged += new System.EventHandler(this.agility_ValueChanged);
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(10, 47);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(34, 13);
            this.label9.TabIndex = 2;
            this.label9.Text = "Agility";
            // 
            // power
            // 
            this.power.Location = new System.Drawing.Point(59, 20);
            this.power.Maximum = new decimal(new int[] {
            999999999,
            0,
            0,
            0});
            this.power.Name = "power";
            this.power.Size = new System.Drawing.Size(61, 20);
            this.power.TabIndex = 1;
            this.power.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.power.ValueChanged += new System.EventHandler(this.power_ValueChanged);
            // 
            // label14
            // 
            this.label14.AutoSize = true;
            this.label14.Location = new System.Drawing.Point(10, 22);
            this.label14.Name = "label14";
            this.label14.Size = new System.Drawing.Size(37, 13);
            this.label14.TabIndex = 0;
            this.label14.Text = "Power";
            // 
            // equippableAction
            // 
            this.equippableAction.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.equippableAction.Enabled = false;
            this.equippableAction.FormattingEnabled = true;
            this.equippableAction.Location = new System.Drawing.Point(192, 142);
            this.equippableAction.Name = "equippableAction";
            this.equippableAction.Size = new System.Drawing.Size(112, 21);
            this.equippableAction.TabIndex = 19;
            this.equippableAction.SelectedIndexChanged += new System.EventHandler(this.equippableAction_SelectedIndexChanged);
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(150, 145);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(37, 13);
            this.label8.TabIndex = 18;
            this.label8.Text = "Action";
            // 
            // equippableSource
            // 
            this.equippableSource.Location = new System.Drawing.Point(130, 117);
            this.equippableSource.Name = "equippableSource";
            this.equippableSource.Size = new System.Drawing.Size(150, 20);
            this.equippableSource.TabIndex = 17;
            this.equippableSource.TextChanged += new System.EventHandler(this.equippableSource_TextChanged);
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(25, 119);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(97, 13);
            this.label7.TabIndex = 16;
            this.label7.Text = "Equippable Source";
            // 
            // equippable
            // 
            this.equippable.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.equippable.FormattingEnabled = true;
            this.equippable.Location = new System.Drawing.Point(41, 142);
            this.equippable.Name = "equippable";
            this.equippable.Size = new System.Drawing.Size(98, 21);
            this.equippable.TabIndex = 17;
            this.equippable.SelectedIndexChanged += new System.EventHandler(this.equippable_SelectedIndexChanged);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(10, 145);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(25, 13);
            this.label6.TabIndex = 16;
            this.label6.Text = "Slot";
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.description);
            this.groupBox3.Location = new System.Drawing.Point(126, 133);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(316, 73);
            this.groupBox3.TabIndex = 5;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "Description";
            // 
            // description
            // 
            this.description.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.description.Dock = System.Windows.Forms.DockStyle.Fill;
            this.description.Location = new System.Drawing.Point(3, 16);
            this.description.Name = "description";
            this.description.Size = new System.Drawing.Size(310, 54);
            this.description.TabIndex = 0;
            this.description.Text = "";
            this.description.TextChanged += new System.EventHandler(this.description_TextChanged);
            // 
            // delete
            // 
            this.delete.ActiveLinkColor = System.Drawing.Color.Red;
            this.delete.AutoSize = true;
            this.delete.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.delete.LinkColor = System.Drawing.Color.Red;
            this.delete.Location = new System.Drawing.Point(94, 366);
            this.delete.Name = "delete";
            this.delete.Size = new System.Drawing.Size(23, 13);
            this.delete.TabIndex = 6;
            this.delete.TabStop = true;
            this.delete.Text = "Del";
            this.delete.VisitedLinkColor = System.Drawing.Color.Red;
            this.delete.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.delete_LinkClicked);
            // 
            // Items
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(451, 385);
            this.Controls.Add(this.delete);
            this.Controls.Add(this.groupBox3);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.saveLink);
            this.Controls.Add(this.newLink);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.itemList);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(467, 424);
            this.MinimumSize = new System.Drawing.Size(467, 424);
            this.Name = "Items";
            this.Text = "WebClash Server - Items";
            this.Load += new System.EventHandler(this.Items_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.value)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.icon)).EndInit();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.groupBox4.ResumeLayout(false);
            this.groupBox4.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.vitality)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.wisdom)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.intelligence)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.toughness)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.agility)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.power)).EndInit();
            this.groupBox3.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ListBox itemList;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.LinkLabel newLink;
        private System.Windows.Forms.TextBox name;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.PictureBox icon;
        private System.Windows.Forms.LinkLabel saveLink;
        private System.Windows.Forms.TextBox src;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.ComboBox rarity;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.NumericUpDown value;
        private System.Windows.Forms.ComboBox equippableAction;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.TextBox equippableSource;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.ComboBox equippable;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.RichTextBox description;
        private System.Windows.Forms.LinkLabel delete;
        private System.Windows.Forms.GroupBox groupBox4;
        private System.Windows.Forms.NumericUpDown vitality;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.NumericUpDown wisdom;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.NumericUpDown intelligence;
        private System.Windows.Forms.Label label13;
        private System.Windows.Forms.NumericUpDown toughness;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.NumericUpDown agility;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.NumericUpDown power;
        private System.Windows.Forms.Label label14;
    }
}