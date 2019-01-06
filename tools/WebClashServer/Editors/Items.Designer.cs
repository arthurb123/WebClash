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
            this.equippableAction = new System.Windows.Forms.ComboBox();
            this.label8 = new System.Windows.Forms.Label();
            this.equippableSource = new System.Windows.Forms.TextBox();
            this.label7 = new System.Windows.Forms.Label();
            this.equippable = new System.Windows.Forms.ComboBox();
            this.label6 = new System.Windows.Forms.Label();
            this.groupBox1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.value)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.icon)).BeginInit();
            this.groupBox2.SuspendLayout();
            this.SuspendLayout();
            // 
            // itemList
            // 
            this.itemList.FormattingEnabled = true;
            this.itemList.Location = new System.Drawing.Point(0, 0);
            this.itemList.Name = "itemList";
            this.itemList.Size = new System.Drawing.Size(120, 225);
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
            this.groupBox1.Size = new System.Drawing.Size(316, 129);
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
            this.newLink.Location = new System.Drawing.Point(7, 230);
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
            this.saveLink.Location = new System.Drawing.Point(83, 230);
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
            this.groupBox2.Controls.Add(this.equippableAction);
            this.groupBox2.Controls.Add(this.label8);
            this.groupBox2.Controls.Add(this.equippableSource);
            this.groupBox2.Controls.Add(this.label7);
            this.groupBox2.Controls.Add(this.equippable);
            this.groupBox2.Controls.Add(this.label6);
            this.groupBox2.Location = new System.Drawing.Point(126, 138);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(316, 107);
            this.groupBox2.TabIndex = 4;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Equipment Settings";
            // 
            // equippableAction
            // 
            this.equippableAction.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.equippableAction.FormattingEnabled = true;
            this.equippableAction.Location = new System.Drawing.Point(74, 72);
            this.equippableAction.Name = "equippableAction";
            this.equippableAction.Size = new System.Drawing.Size(135, 21);
            this.equippableAction.TabIndex = 19;
            this.equippableAction.SelectedIndexChanged += new System.EventHandler(this.equippableAction_SelectedIndexChanged);
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(8, 75);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(37, 13);
            this.label8.TabIndex = 18;
            this.label8.Text = "Action";
            // 
            // equippableSource
            // 
            this.equippableSource.Location = new System.Drawing.Point(74, 46);
            this.equippableSource.Name = "equippableSource";
            this.equippableSource.Size = new System.Drawing.Size(135, 20);
            this.equippableSource.TabIndex = 17;
            this.equippableSource.TextChanged += new System.EventHandler(this.equippableSource_TextChanged);
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(8, 49);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(41, 13);
            this.label7.TabIndex = 16;
            this.label7.Text = "Source";
            // 
            // equippable
            // 
            this.equippable.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.equippable.FormattingEnabled = true;
            this.equippable.Location = new System.Drawing.Point(74, 19);
            this.equippable.Name = "equippable";
            this.equippable.Size = new System.Drawing.Size(135, 21);
            this.equippable.TabIndex = 17;
            this.equippable.SelectedIndexChanged += new System.EventHandler(this.equippable_SelectedIndexChanged);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(8, 22);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(25, 13);
            this.label6.TabIndex = 16;
            this.label6.Text = "Slot";
            // 
            // Items
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(451, 250);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.saveLink);
            this.Controls.Add(this.newLink);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.itemList);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximumSize = new System.Drawing.Size(467, 289);
            this.MinimumSize = new System.Drawing.Size(467, 289);
            this.Name = "Items";
            this.Text = "WebClash Server - Items";
            this.Load += new System.EventHandler(this.Items_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.value)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.icon)).EndInit();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
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
    }
}