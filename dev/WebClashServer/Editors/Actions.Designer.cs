namespace WebClashServer.Editors
{
    partial class Actions
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Actions));
            this.canvas = new System.Windows.Forms.PictureBox();
            this.save = new System.Windows.Forms.LinkLabel();
            this.heal = new System.Windows.Forms.NumericUpDown();
            this.label14 = new System.Windows.Forms.Label();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.mana = new System.Windows.Forms.NumericUpDown();
            this.castingTime = new System.Windows.Forms.NumericUpDown();
            this.label21 = new System.Windows.Forms.Label();
            this.name = new System.Windows.Forms.TextBox();
            this.label25 = new System.Windows.Forms.Label();
            this.label22 = new System.Windows.Forms.Label();
            this.editSounds = new System.Windows.Forms.Button();
            this.description = new System.Windows.Forms.RichTextBox();
            this.label16 = new System.Windows.Forms.Label();
            this.iconImage = new System.Windows.Forms.PictureBox();
            this.cooldown = new System.Windows.Forms.NumericUpDown();
            this.icon = new System.Windows.Forms.TextBox();
            this.label15 = new System.Windows.Forms.Label();
            this.label17 = new System.Windows.Forms.Label();
            this.changeCharacter = new System.Windows.Forms.Button();
            this.characterName = new System.Windows.Forms.Label();
            this.actionList = new System.Windows.Forms.ListBox();
            this.delete = new System.Windows.Forms.LinkLabel();
            this.newAction = new System.Windows.Forms.LinkLabel();
            this.elementList = new System.Windows.Forms.ListBox();
            this.editElement = new System.Windows.Forms.Button();
            this.groupBox4 = new System.Windows.Forms.GroupBox();
            this.pasteElement = new System.Windows.Forms.Button();
            this.copyElement = new System.Windows.Forms.Button();
            this.removeElement = new System.Windows.Forms.LinkLabel();
            this.addElement = new System.Windows.Forms.LinkLabel();
            ((System.ComponentModel.ISupportInitialize)(this.canvas)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.heal)).BeginInit();
            this.groupBox2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.mana)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.castingTime)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.iconImage)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.cooldown)).BeginInit();
            this.groupBox4.SuspendLayout();
            this.SuspendLayout();
            // 
            // canvas
            // 
            this.canvas.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.canvas.Location = new System.Drawing.Point(396, 42);
            this.canvas.Name = "canvas";
            this.canvas.Size = new System.Drawing.Size(448, 448);
            this.canvas.TabIndex = 4;
            this.canvas.TabStop = false;
            // 
            // save
            // 
            this.save.ActiveLinkColor = System.Drawing.Color.Blue;
            this.save.AutoSize = true;
            this.save.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.save.LinkColor = System.Drawing.Color.Blue;
            this.save.Location = new System.Drawing.Point(47, 510);
            this.save.Name = "save";
            this.save.Size = new System.Drawing.Size(32, 13);
            this.save.TabIndex = 11;
            this.save.TabStop = true;
            this.save.Text = "Save";
            this.save.VisitedLinkColor = System.Drawing.Color.Blue;
            this.save.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.save_LinkClicked);
            // 
            // heal
            // 
            this.heal.Location = new System.Drawing.Point(5, 334);
            this.heal.Maximum = new decimal(new int[] {
            99999999,
            0,
            0,
            0});
            this.heal.Minimum = new decimal(new int[] {
            999999999,
            0,
            0,
            -2147483648});
            this.heal.Name = "heal";
            this.heal.Size = new System.Drawing.Size(115, 20);
            this.heal.TabIndex = 13;
            this.heal.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.heal.ValueChanged += new System.EventHandler(this.heal_ValueChanged);
            // 
            // label14
            // 
            this.label14.AutoSize = true;
            this.label14.Location = new System.Drawing.Point(2, 318);
            this.label14.Name = "label14";
            this.label14.Size = new System.Drawing.Size(62, 13);
            this.label14.TabIndex = 12;
            this.label14.Text = "Health Cost";
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.mana);
            this.groupBox2.Controls.Add(this.castingTime);
            this.groupBox2.Controls.Add(this.label21);
            this.groupBox2.Controls.Add(this.heal);
            this.groupBox2.Controls.Add(this.name);
            this.groupBox2.Controls.Add(this.label25);
            this.groupBox2.Controls.Add(this.label14);
            this.groupBox2.Controls.Add(this.label22);
            this.groupBox2.Controls.Add(this.editSounds);
            this.groupBox2.Controls.Add(this.description);
            this.groupBox2.Controls.Add(this.label16);
            this.groupBox2.Controls.Add(this.iconImage);
            this.groupBox2.Controls.Add(this.cooldown);
            this.groupBox2.Controls.Add(this.icon);
            this.groupBox2.Controls.Add(this.label15);
            this.groupBox2.Controls.Add(this.label17);
            this.groupBox2.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBox2.Location = new System.Drawing.Point(124, 4);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(128, 525);
            this.groupBox2.TabIndex = 14;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "General Info";
            // 
            // mana
            // 
            this.mana.Location = new System.Drawing.Point(5, 376);
            this.mana.Maximum = new decimal(new int[] {
            99999999,
            0,
            0,
            0});
            this.mana.Minimum = new decimal(new int[] {
            999999999,
            0,
            0,
            -2147483648});
            this.mana.Name = "mana";
            this.mana.Size = new System.Drawing.Size(115, 20);
            this.mana.TabIndex = 18;
            this.mana.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.mana.ValueChanged += new System.EventHandler(this.mana_ValueChanged);
            // 
            // castingTime
            // 
            this.castingTime.Location = new System.Drawing.Point(5, 423);
            this.castingTime.Maximum = new decimal(new int[] {
            99999999,
            0,
            0,
            0});
            this.castingTime.Name = "castingTime";
            this.castingTime.Size = new System.Drawing.Size(115, 20);
            this.castingTime.TabIndex = 20;
            this.castingTime.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.castingTime.ValueChanged += new System.EventHandler(this.castingTime_ValueChanged);
            // 
            // label21
            // 
            this.label21.AutoSize = true;
            this.label21.Location = new System.Drawing.Point(3, 360);
            this.label21.Name = "label21";
            this.label21.Size = new System.Drawing.Size(58, 13);
            this.label21.TabIndex = 17;
            this.label21.Text = "Mana Cost";
            // 
            // name
            // 
            this.name.Location = new System.Drawing.Point(6, 38);
            this.name.Name = "name";
            this.name.Size = new System.Drawing.Size(115, 20);
            this.name.TabIndex = 18;
            this.name.TextChanged += new System.EventHandler(this.Name_TextChanged);
            // 
            // label25
            // 
            this.label25.AutoSize = true;
            this.label25.Location = new System.Drawing.Point(3, 407);
            this.label25.Name = "label25";
            this.label25.Size = new System.Drawing.Size(86, 13);
            this.label25.TabIndex = 19;
            this.label25.Text = "Casting time (ms)";
            // 
            // label22
            // 
            this.label22.AutoSize = true;
            this.label22.Location = new System.Drawing.Point(3, 20);
            this.label22.Name = "label22";
            this.label22.Size = new System.Drawing.Size(35, 13);
            this.label22.TabIndex = 17;
            this.label22.Text = "Name";
            // 
            // editSounds
            // 
            this.editSounds.Location = new System.Drawing.Point(6, 496);
            this.editSounds.Name = "editSounds";
            this.editSounds.Size = new System.Drawing.Size(115, 23);
            this.editSounds.TabIndex = 5;
            this.editSounds.Text = "Edit Sound(s)";
            this.editSounds.UseVisualStyleBackColor = true;
            this.editSounds.Click += new System.EventHandler(this.editSounds_Click);
            // 
            // description
            // 
            this.description.Location = new System.Drawing.Point(6, 204);
            this.description.Name = "description";
            this.description.Size = new System.Drawing.Size(115, 102);
            this.description.TabIndex = 4;
            this.description.Text = "";
            this.description.TextChanged += new System.EventHandler(this.richTextBox1_TextChanged);
            // 
            // label16
            // 
            this.label16.AutoSize = true;
            this.label16.Location = new System.Drawing.Point(3, 181);
            this.label16.Name = "label16";
            this.label16.Size = new System.Drawing.Size(60, 13);
            this.label16.TabIndex = 3;
            this.label16.Text = "Description";
            // 
            // iconImage
            // 
            this.iconImage.BackColor = System.Drawing.SystemColors.ControlLight;
            this.iconImage.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.iconImage.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.iconImage.Location = new System.Drawing.Point(29, 109);
            this.iconImage.Name = "iconImage";
            this.iconImage.Size = new System.Drawing.Size(64, 64);
            this.iconImage.TabIndex = 2;
            this.iconImage.TabStop = false;
            // 
            // cooldown
            // 
            this.cooldown.Location = new System.Drawing.Point(6, 466);
            this.cooldown.Maximum = new decimal(new int[] {
            99999999,
            0,
            0,
            0});
            this.cooldown.Name = "cooldown";
            this.cooldown.Size = new System.Drawing.Size(115, 20);
            this.cooldown.TabIndex = 16;
            this.cooldown.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.cooldown.ValueChanged += new System.EventHandler(this.cooldown_ValueChanged);
            // 
            // icon
            // 
            this.icon.Location = new System.Drawing.Point(6, 78);
            this.icon.Name = "icon";
            this.icon.Size = new System.Drawing.Size(115, 20);
            this.icon.TabIndex = 1;
            this.icon.TextChanged += new System.EventHandler(this.icon_TextChanged);
            // 
            // label15
            // 
            this.label15.AutoSize = true;
            this.label15.Location = new System.Drawing.Point(3, 61);
            this.label15.Name = "label15";
            this.label15.Size = new System.Drawing.Size(65, 13);
            this.label15.TabIndex = 0;
            this.label15.Text = "Icon Source";
            // 
            // label17
            // 
            this.label17.AutoSize = true;
            this.label17.Location = new System.Drawing.Point(3, 450);
            this.label17.Name = "label17";
            this.label17.Size = new System.Drawing.Size(76, 13);
            this.label17.TabIndex = 15;
            this.label17.Text = "Cooldown (ms)";
            // 
            // changeCharacter
            // 
            this.changeCharacter.Location = new System.Drawing.Point(396, 12);
            this.changeCharacter.Name = "changeCharacter";
            this.changeCharacter.Size = new System.Drawing.Size(139, 23);
            this.changeCharacter.TabIndex = 18;
            this.changeCharacter.Text = "Select Testing Character";
            this.changeCharacter.UseVisualStyleBackColor = true;
            this.changeCharacter.Click += new System.EventHandler(this.changeCharacter_Click);
            // 
            // characterName
            // 
            this.characterName.AutoSize = true;
            this.characterName.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Italic, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.characterName.Location = new System.Drawing.Point(542, 17);
            this.characterName.Name = "characterName";
            this.characterName.Size = new System.Drawing.Size(24, 13);
            this.characterName.TabIndex = 19;
            this.characterName.Text = "test";
            // 
            // actionList
            // 
            this.actionList.FormattingEnabled = true;
            this.actionList.Location = new System.Drawing.Point(2, 4);
            this.actionList.Name = "actionList";
            this.actionList.Size = new System.Drawing.Size(116, 498);
            this.actionList.TabIndex = 20;
            this.actionList.SelectedIndexChanged += new System.EventHandler(this.actionList_SelectedIndexChanged);
            // 
            // delete
            // 
            this.delete.ActiveLinkColor = System.Drawing.Color.Red;
            this.delete.AutoSize = true;
            this.delete.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.delete.LinkColor = System.Drawing.Color.Red;
            this.delete.Location = new System.Drawing.Point(95, 510);
            this.delete.Name = "delete";
            this.delete.Size = new System.Drawing.Size(23, 13);
            this.delete.TabIndex = 23;
            this.delete.TabStop = true;
            this.delete.Text = "Del";
            this.delete.VisitedLinkColor = System.Drawing.Color.Red;
            this.delete.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.delete_LinkClicked);
            // 
            // newAction
            // 
            this.newAction.ActiveLinkColor = System.Drawing.Color.Blue;
            this.newAction.AutoSize = true;
            this.newAction.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.newAction.Location = new System.Drawing.Point(5, 510);
            this.newAction.Name = "newAction";
            this.newAction.Size = new System.Drawing.Size(29, 13);
            this.newAction.TabIndex = 21;
            this.newAction.TabStop = true;
            this.newAction.Text = "New";
            this.newAction.VisitedLinkColor = System.Drawing.Color.Blue;
            this.newAction.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.newAction_LinkClicked);
            // 
            // elementList
            // 
            this.elementList.FormattingEnabled = true;
            this.elementList.Location = new System.Drawing.Point(5, 38);
            this.elementList.Name = "elementList";
            this.elementList.Size = new System.Drawing.Size(115, 420);
            this.elementList.TabIndex = 24;
            this.elementList.SelectedIndexChanged += new System.EventHandler(this.elementList_SelectedIndexChanged);
            this.elementList.DoubleClick += new System.EventHandler(this.editElement_Click);
            this.elementList.KeyDown += new System.Windows.Forms.KeyEventHandler(this.elementList_KeyDown);
            this.elementList.KeyUp += new System.Windows.Forms.KeyEventHandler(this.elementList_KeyUp);
            // 
            // editElement
            // 
            this.editElement.Location = new System.Drawing.Point(5, 496);
            this.editElement.Name = "editElement";
            this.editElement.Size = new System.Drawing.Size(117, 23);
            this.editElement.TabIndex = 25;
            this.editElement.Text = "Edit Element";
            this.editElement.UseVisualStyleBackColor = true;
            this.editElement.Click += new System.EventHandler(this.editElement_Click);
            // 
            // groupBox4
            // 
            this.groupBox4.Controls.Add(this.pasteElement);
            this.groupBox4.Controls.Add(this.copyElement);
            this.groupBox4.Controls.Add(this.removeElement);
            this.groupBox4.Controls.Add(this.addElement);
            this.groupBox4.Controls.Add(this.elementList);
            this.groupBox4.Controls.Add(this.editElement);
            this.groupBox4.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBox4.Location = new System.Drawing.Point(258, 4);
            this.groupBox4.Name = "groupBox4";
            this.groupBox4.Size = new System.Drawing.Size(128, 525);
            this.groupBox4.TabIndex = 26;
            this.groupBox4.TabStop = false;
            this.groupBox4.Text = "Elements";
            // 
            // pasteElement
            // 
            this.pasteElement.Location = new System.Drawing.Point(64, 466);
            this.pasteElement.Name = "pasteElement";
            this.pasteElement.Size = new System.Drawing.Size(56, 23);
            this.pasteElement.TabIndex = 30;
            this.pasteElement.Text = "Paste";
            this.pasteElement.UseVisualStyleBackColor = true;
            this.pasteElement.Click += new System.EventHandler(this.pasteElement_Click);
            // 
            // copyElement
            // 
            this.copyElement.Location = new System.Drawing.Point(6, 466);
            this.copyElement.Name = "copyElement";
            this.copyElement.Size = new System.Drawing.Size(56, 23);
            this.copyElement.TabIndex = 29;
            this.copyElement.Text = "Copy";
            this.copyElement.UseVisualStyleBackColor = true;
            this.copyElement.Click += new System.EventHandler(this.copyElement_Click);
            // 
            // removeElement
            // 
            this.removeElement.ActiveLinkColor = System.Drawing.Color.Red;
            this.removeElement.AutoSize = true;
            this.removeElement.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.removeElement.LinkColor = System.Drawing.Color.Red;
            this.removeElement.Location = new System.Drawing.Point(99, 20);
            this.removeElement.Name = "removeElement";
            this.removeElement.Size = new System.Drawing.Size(23, 13);
            this.removeElement.TabIndex = 28;
            this.removeElement.TabStop = true;
            this.removeElement.Text = "Del";
            this.removeElement.VisitedLinkColor = System.Drawing.Color.Red;
            this.removeElement.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.removeElement_LinkClicked);
            // 
            // addElement
            // 
            this.addElement.ActiveLinkColor = System.Drawing.Color.Blue;
            this.addElement.AutoSize = true;
            this.addElement.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.addElement.Location = new System.Drawing.Point(2, 20);
            this.addElement.Name = "addElement";
            this.addElement.Size = new System.Drawing.Size(29, 13);
            this.addElement.TabIndex = 27;
            this.addElement.TabStop = true;
            this.addElement.Text = "New";
            this.addElement.VisitedLinkColor = System.Drawing.Color.Blue;
            this.addElement.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.addElement_LinkClicked);
            // 
            // Actions
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(854, 536);
            this.Controls.Add(this.groupBox4);
            this.Controls.Add(this.delete);
            this.Controls.Add(this.newAction);
            this.Controls.Add(this.actionList);
            this.Controls.Add(this.characterName);
            this.Controls.Add(this.changeCharacter);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.save);
            this.Controls.Add(this.canvas);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(870, 575);
            this.MinimumSize = new System.Drawing.Size(870, 575);
            this.Name = "Actions";
            this.Text = "WebClash - Actions";
            this.Load += new System.EventHandler(this.Actions_Load);
            ((System.ComponentModel.ISupportInitialize)(this.canvas)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.heal)).EndInit();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.mana)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.castingTime)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.iconImage)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.cooldown)).EndInit();
            this.groupBox4.ResumeLayout(false);
            this.groupBox4.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.PictureBox canvas;
        private System.Windows.Forms.LinkLabel save;
        private System.Windows.Forms.NumericUpDown heal;
        private System.Windows.Forms.Label label14;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.PictureBox iconImage;
        private System.Windows.Forms.TextBox icon;
        private System.Windows.Forms.Label label15;
        private System.Windows.Forms.RichTextBox description;
        private System.Windows.Forms.Label label16;
        private System.Windows.Forms.NumericUpDown cooldown;
        private System.Windows.Forms.Label label17;
        private System.Windows.Forms.Button editSounds;
        private System.Windows.Forms.NumericUpDown mana;
        private System.Windows.Forms.Label label21;
        private System.Windows.Forms.TextBox name;
        private System.Windows.Forms.Label label22;
        private System.Windows.Forms.NumericUpDown castingTime;
        private System.Windows.Forms.Label label25;
        private System.Windows.Forms.Button changeCharacter;
        private System.Windows.Forms.Label characterName;
        private System.Windows.Forms.ListBox actionList;
        private System.Windows.Forms.LinkLabel delete;
        private System.Windows.Forms.LinkLabel newAction;
        private System.Windows.Forms.ListBox elementList;
        private System.Windows.Forms.Button editElement;
        private System.Windows.Forms.GroupBox groupBox4;
        private System.Windows.Forms.LinkLabel removeElement;
        private System.Windows.Forms.LinkLabel addElement;
        private System.Windows.Forms.Button pasteElement;
        private System.Windows.Forms.Button copyElement;
    }
}