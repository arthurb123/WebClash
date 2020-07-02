namespace WebClashServer
{
    partial class StatusEffects
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(StatusEffects));
            this.statusEffectList = new System.Windows.Forms.ListBox();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.itemSounds = new System.Windows.Forms.Button();
            this.duration = new System.Windows.Forms.NumericUpDown();
            this.label5 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.src = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.name = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.icon = new System.Windows.Forms.PictureBox();
            this.newLink = new System.Windows.Forms.LinkLabel();
            this.saveLink = new System.Windows.Forms.LinkLabel();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.description = new System.Windows.Forms.RichTextBox();
            this.delete = new System.Windows.Forms.LinkLabel();
            this.consumablePanel = new System.Windows.Forms.Panel();
            this.equipmentPanel = new System.Windows.Forms.Panel();
            this.dialogPanel = new System.Windows.Forms.Panel();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.cooldownTimeFactor = new System.Windows.Forms.NumericUpDown();
            this.castingTimeFactor = new System.Windows.Forms.NumericUpDown();
            this.movementSpeedFactor = new System.Windows.Forms.NumericUpDown();
            this.damageFactor = new System.Windows.Forms.NumericUpDown();
            this.experienceGainFactor = new System.Windows.Forms.NumericUpDown();
            this.itemFindFactor = new System.Windows.Forms.NumericUpDown();
            this.manaTickDelta = new System.Windows.Forms.NumericUpDown();
            this.healthTickDelta = new System.Windows.Forms.NumericUpDown();
            this.label12 = new System.Windows.Forms.Label();
            this.label11 = new System.Windows.Forms.Label();
            this.label10 = new System.Windows.Forms.Label();
            this.label9 = new System.Windows.Forms.Label();
            this.label8 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.label6 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.groupBox1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.duration)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.icon)).BeginInit();
            this.groupBox3.SuspendLayout();
            this.groupBox2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.cooldownTimeFactor)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.castingTimeFactor)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.movementSpeedFactor)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.damageFactor)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.experienceGainFactor)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.itemFindFactor)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.manaTickDelta)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.healthTickDelta)).BeginInit();
            this.SuspendLayout();
            // 
            // statusEffectList
            // 
            this.statusEffectList.FormattingEnabled = true;
            this.statusEffectList.Location = new System.Drawing.Point(2, 2);
            this.statusEffectList.Name = "statusEffectList";
            this.statusEffectList.Size = new System.Drawing.Size(120, 407);
            this.statusEffectList.TabIndex = 0;
            this.statusEffectList.SelectedIndexChanged += new System.EventHandler(this.itemList_SelectedIndexChanged);
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.itemSounds);
            this.groupBox1.Controls.Add(this.duration);
            this.groupBox1.Controls.Add(this.label5);
            this.groupBox1.Controls.Add(this.label4);
            this.groupBox1.Controls.Add(this.src);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Controls.Add(this.name);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Controls.Add(this.icon);
            this.groupBox1.Location = new System.Drawing.Point(126, 3);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(316, 150);
            this.groupBox1.TabIndex = 1;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "General Settings";
            // 
            // itemSounds
            // 
            this.itemSounds.Location = new System.Drawing.Point(11, 119);
            this.itemSounds.Name = "itemSounds";
            this.itemSounds.Size = new System.Drawing.Size(292, 21);
            this.itemSounds.TabIndex = 20;
            this.itemSounds.Text = "Edit Sound(s)";
            this.itemSounds.UseVisualStyleBackColor = true;
            this.itemSounds.Click += new System.EventHandler(this.itemSounds_Click);
            // 
            // duration
            // 
            this.duration.Location = new System.Drawing.Point(85, 75);
            this.duration.Maximum = new decimal(new int[] {
            -1981284353,
            -1966660860,
            0,
            0});
            this.duration.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.duration.Name = "duration";
            this.duration.Size = new System.Drawing.Size(101, 20);
            this.duration.TabIndex = 15;
            this.duration.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.duration.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.duration.ValueChanged += new System.EventHandler(this.duration_ValueChanged);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(10, 77);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(69, 13);
            this.label5.TabIndex = 14;
            this.label5.Text = "Duration (ms)";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(243, 16);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(28, 13);
            this.label4.TabIndex = 11;
            this.label4.Text = "Icon";
            // 
            // src
            // 
            this.src.Location = new System.Drawing.Point(51, 49);
            this.src.Name = "src";
            this.src.Size = new System.Drawing.Size(135, 20);
            this.src.TabIndex = 8;
            this.src.TextChanged += new System.EventHandler(this.src_TextChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(10, 52);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(41, 13);
            this.label2.TabIndex = 7;
            this.label2.Text = "Source";
            // 
            // name
            // 
            this.name.Location = new System.Drawing.Point(51, 23);
            this.name.Name = "name";
            this.name.Size = new System.Drawing.Size(135, 20);
            this.name.TabIndex = 6;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(10, 26);
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
            this.icon.Location = new System.Drawing.Point(226, 32);
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
            this.newLink.Location = new System.Drawing.Point(4, 419);
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
            this.saveLink.Location = new System.Drawing.Point(47, 419);
            this.saveLink.Name = "saveLink";
            this.saveLink.Size = new System.Drawing.Size(32, 13);
            this.saveLink.TabIndex = 3;
            this.saveLink.TabStop = true;
            this.saveLink.Text = "Save";
            this.saveLink.VisitedLinkColor = System.Drawing.Color.Blue;
            this.saveLink.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.saveLink_LinkClicked);
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.description);
            this.groupBox3.Location = new System.Drawing.Point(126, 156);
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
            this.delete.Location = new System.Drawing.Point(97, 419);
            this.delete.Name = "delete";
            this.delete.Size = new System.Drawing.Size(23, 13);
            this.delete.TabIndex = 6;
            this.delete.TabStop = true;
            this.delete.Text = "Del";
            this.delete.VisitedLinkColor = System.Drawing.Color.Red;
            this.delete.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.delete_LinkClicked);
            // 
            // consumablePanel
            // 
            this.consumablePanel.AutoSize = true;
            this.consumablePanel.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.consumablePanel.Location = new System.Drawing.Point(126, 252);
            this.consumablePanel.Name = "consumablePanel";
            this.consumablePanel.Size = new System.Drawing.Size(0, 0);
            this.consumablePanel.TabIndex = 22;
            this.consumablePanel.Visible = false;
            // 
            // equipmentPanel
            // 
            this.equipmentPanel.AutoSize = true;
            this.equipmentPanel.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.equipmentPanel.Location = new System.Drawing.Point(126, 251);
            this.equipmentPanel.Name = "equipmentPanel";
            this.equipmentPanel.Size = new System.Drawing.Size(0, 0);
            this.equipmentPanel.TabIndex = 23;
            this.equipmentPanel.Visible = false;
            // 
            // dialogPanel
            // 
            this.dialogPanel.AutoSize = true;
            this.dialogPanel.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.dialogPanel.Location = new System.Drawing.Point(126, 251);
            this.dialogPanel.Name = "dialogPanel";
            this.dialogPanel.Size = new System.Drawing.Size(0, 0);
            this.dialogPanel.TabIndex = 23;
            this.dialogPanel.Visible = false;
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.cooldownTimeFactor);
            this.groupBox2.Controls.Add(this.castingTimeFactor);
            this.groupBox2.Controls.Add(this.movementSpeedFactor);
            this.groupBox2.Controls.Add(this.damageFactor);
            this.groupBox2.Controls.Add(this.experienceGainFactor);
            this.groupBox2.Controls.Add(this.itemFindFactor);
            this.groupBox2.Controls.Add(this.manaTickDelta);
            this.groupBox2.Controls.Add(this.healthTickDelta);
            this.groupBox2.Controls.Add(this.label12);
            this.groupBox2.Controls.Add(this.label11);
            this.groupBox2.Controls.Add(this.label10);
            this.groupBox2.Controls.Add(this.label9);
            this.groupBox2.Controls.Add(this.label8);
            this.groupBox2.Controls.Add(this.label7);
            this.groupBox2.Controls.Add(this.label6);
            this.groupBox2.Controls.Add(this.label3);
            this.groupBox2.Location = new System.Drawing.Point(126, 230);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(316, 202);
            this.groupBox2.TabIndex = 6;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Effects";
            // 
            // cooldownTimeFactor
            // 
            this.cooldownTimeFactor.DecimalPlaces = 2;
            this.cooldownTimeFactor.Location = new System.Drawing.Point(222, 170);
            this.cooldownTimeFactor.Maximum = new decimal(new int[] {
            99990,
            0,
            0,
            65536});
            this.cooldownTimeFactor.Name = "cooldownTimeFactor";
            this.cooldownTimeFactor.Size = new System.Drawing.Size(88, 20);
            this.cooldownTimeFactor.TabIndex = 15;
            this.cooldownTimeFactor.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.cooldownTimeFactor.Value = new decimal(new int[] {
            100,
            0,
            0,
            131072});
            this.cooldownTimeFactor.ValueChanged += new System.EventHandler(this.cooldownTimeFactor_ValueChanged);
            // 
            // castingTimeFactor
            // 
            this.castingTimeFactor.DecimalPlaces = 2;
            this.castingTimeFactor.Location = new System.Drawing.Point(222, 149);
            this.castingTimeFactor.Maximum = new decimal(new int[] {
            99990,
            0,
            0,
            65536});
            this.castingTimeFactor.Name = "castingTimeFactor";
            this.castingTimeFactor.Size = new System.Drawing.Size(88, 20);
            this.castingTimeFactor.TabIndex = 14;
            this.castingTimeFactor.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.castingTimeFactor.Value = new decimal(new int[] {
            100,
            0,
            0,
            131072});
            this.castingTimeFactor.ValueChanged += new System.EventHandler(this.castingTimeFactor_ValueChanged);
            // 
            // movementSpeedFactor
            // 
            this.movementSpeedFactor.DecimalPlaces = 2;
            this.movementSpeedFactor.Location = new System.Drawing.Point(222, 126);
            this.movementSpeedFactor.Maximum = new decimal(new int[] {
            99990,
            0,
            0,
            65536});
            this.movementSpeedFactor.Name = "movementSpeedFactor";
            this.movementSpeedFactor.Size = new System.Drawing.Size(88, 20);
            this.movementSpeedFactor.TabIndex = 13;
            this.movementSpeedFactor.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.movementSpeedFactor.Value = new decimal(new int[] {
            100,
            0,
            0,
            131072});
            this.movementSpeedFactor.ValueChanged += new System.EventHandler(this.movementSpeedFactor_ValueChanged);
            // 
            // damageFactor
            // 
            this.damageFactor.DecimalPlaces = 2;
            this.damageFactor.Location = new System.Drawing.Point(222, 104);
            this.damageFactor.Maximum = new decimal(new int[] {
            99990,
            0,
            0,
            65536});
            this.damageFactor.Name = "damageFactor";
            this.damageFactor.Size = new System.Drawing.Size(88, 20);
            this.damageFactor.TabIndex = 12;
            this.damageFactor.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.damageFactor.Value = new decimal(new int[] {
            100,
            0,
            0,
            131072});
            this.damageFactor.ValueChanged += new System.EventHandler(this.damageFactor_ValueChanged);
            // 
            // experienceGainFactor
            // 
            this.experienceGainFactor.DecimalPlaces = 2;
            this.experienceGainFactor.Location = new System.Drawing.Point(222, 81);
            this.experienceGainFactor.Maximum = new decimal(new int[] {
            99990,
            0,
            0,
            65536});
            this.experienceGainFactor.Name = "experienceGainFactor";
            this.experienceGainFactor.Size = new System.Drawing.Size(88, 20);
            this.experienceGainFactor.TabIndex = 11;
            this.experienceGainFactor.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.experienceGainFactor.Value = new decimal(new int[] {
            100,
            0,
            0,
            131072});
            this.experienceGainFactor.ValueChanged += new System.EventHandler(this.experienceGainFactor_ValueChanged);
            // 
            // itemFindFactor
            // 
            this.itemFindFactor.DecimalPlaces = 2;
            this.itemFindFactor.Location = new System.Drawing.Point(222, 59);
            this.itemFindFactor.Maximum = new decimal(new int[] {
            99990,
            0,
            0,
            65536});
            this.itemFindFactor.Name = "itemFindFactor";
            this.itemFindFactor.Size = new System.Drawing.Size(88, 20);
            this.itemFindFactor.TabIndex = 10;
            this.itemFindFactor.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.itemFindFactor.Value = new decimal(new int[] {
            100,
            0,
            0,
            131072});
            this.itemFindFactor.ValueChanged += new System.EventHandler(this.itemFindFactor_ValueChanged);
            // 
            // manaTickDelta
            // 
            this.manaTickDelta.Location = new System.Drawing.Point(222, 37);
            this.manaTickDelta.Maximum = new decimal(new int[] {
            -727379969,
            232,
            0,
            0});
            this.manaTickDelta.Minimum = new decimal(new int[] {
            -727379969,
            232,
            0,
            -2147483648});
            this.manaTickDelta.Name = "manaTickDelta";
            this.manaTickDelta.Size = new System.Drawing.Size(88, 20);
            this.manaTickDelta.TabIndex = 9;
            this.manaTickDelta.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.manaTickDelta.ValueChanged += new System.EventHandler(this.manaTickDelta_ValueChanged);
            // 
            // healthTickDelta
            // 
            this.healthTickDelta.Location = new System.Drawing.Point(222, 15);
            this.healthTickDelta.Maximum = new decimal(new int[] {
            -727379969,
            232,
            0,
            0});
            this.healthTickDelta.Minimum = new decimal(new int[] {
            -727379969,
            232,
            0,
            -2147483648});
            this.healthTickDelta.Name = "healthTickDelta";
            this.healthTickDelta.Size = new System.Drawing.Size(88, 20);
            this.healthTickDelta.TabIndex = 8;
            this.healthTickDelta.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.healthTickDelta.ValueChanged += new System.EventHandler(this.healthTickDelta_ValueChanged);
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(10, 174);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(113, 13);
            this.label12.TabIndex = 7;
            this.label12.Text = "Cooldown Time Factor";
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(10, 152);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(101, 13);
            this.label11.TabIndex = 6;
            this.label11.Text = "Casting Time Factor";
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(10, 130);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(124, 13);
            this.label10.TabIndex = 5;
            this.label10.Text = "Movement Speed Factor";
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(10, 109);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(80, 13);
            this.label9.TabIndex = 4;
            this.label9.Text = "Damage Factor";
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(10, 86);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(86, 13);
            this.label8.TabIndex = 3;
            this.label8.Text = "Exp. Gain Factor";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(10, 64);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(83, 13);
            this.label7.TabIndex = 2;
            this.label7.Text = "Item Find Factor";
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(10, 19);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(140, 13);
            this.label6.TabIndex = 1;
            this.label6.Text = "Health Tick Delta (Health/s)";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(9, 41);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(132, 13);
            this.label3.TabIndex = 0;
            this.label3.Text = "Mana Tick Delta (Mana/s)";
            // 
            // StatusEffects
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(451, 441);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.dialogPanel);
            this.Controls.Add(this.equipmentPanel);
            this.Controls.Add(this.consumablePanel);
            this.Controls.Add(this.delete);
            this.Controls.Add(this.groupBox3);
            this.Controls.Add(this.saveLink);
            this.Controls.Add(this.newLink);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.statusEffectList);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(467, 480);
            this.MinimumSize = new System.Drawing.Size(467, 480);
            this.Name = "StatusEffects";
            this.Text = "WebClash - Status Effects";
            this.Load += new System.EventHandler(this.StatusEffects_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.duration)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.icon)).EndInit();
            this.groupBox3.ResumeLayout(false);
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.cooldownTimeFactor)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.castingTimeFactor)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.movementSpeedFactor)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.damageFactor)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.experienceGainFactor)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.itemFindFactor)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.manaTickDelta)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.healthTickDelta)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ListBox statusEffectList;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.LinkLabel newLink;
        private System.Windows.Forms.TextBox name;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.PictureBox icon;
        private System.Windows.Forms.LinkLabel saveLink;
        private System.Windows.Forms.TextBox src;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.NumericUpDown duration;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.RichTextBox description;
        private System.Windows.Forms.LinkLabel delete;
        private System.Windows.Forms.Panel consumablePanel;
        private System.Windows.Forms.Panel equipmentPanel;
        private System.Windows.Forms.Panel dialogPanel;
        private System.Windows.Forms.Button itemSounds;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.NumericUpDown healthTickDelta;
        private System.Windows.Forms.NumericUpDown itemFindFactor;
        private System.Windows.Forms.NumericUpDown manaTickDelta;
        private System.Windows.Forms.NumericUpDown cooldownTimeFactor;
        private System.Windows.Forms.NumericUpDown castingTimeFactor;
        private System.Windows.Forms.NumericUpDown movementSpeedFactor;
        private System.Windows.Forms.NumericUpDown damageFactor;
        private System.Windows.Forms.NumericUpDown experienceGainFactor;
    }
}