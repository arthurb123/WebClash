namespace WebClashServer
{
    partial class Quests
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Quests));
            this.questList = new System.Windows.Forms.ListBox();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.globalVariableName = new System.Windows.Forms.Label();
            this.minLevel = new System.Windows.Forms.NumericUpDown();
            this.label21 = new System.Windows.Forms.Label();
            this.name = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.newLink = new System.Windows.Forms.LinkLabel();
            this.saveLink = new System.Windows.Forms.LinkLabel();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.description = new System.Windows.Forms.RichTextBox();
            this.delete = new System.Windows.Forms.LinkLabel();
            this.consumablePanel = new System.Windows.Forms.Panel();
            this.equipmentPanel = new System.Windows.Forms.Panel();
            this.dialogPanel = new System.Windows.Forms.Panel();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.delObjective = new System.Windows.Forms.LinkLabel();
            this.objectiveList = new System.Windows.Forms.ListBox();
            this.newObjective = new System.Windows.Forms.LinkLabel();
            this.groupBox4 = new System.Windows.Forms.GroupBox();
            this.goldReward = new System.Windows.Forms.NumericUpDown();
            this.label3 = new System.Windows.Forms.Label();
            this.experienceReward = new System.Windows.Forms.NumericUpDown();
            this.label2 = new System.Windows.Forms.Label();
            this.editItemRewards = new System.Windows.Forms.Button();
            this.groupBox1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.minLevel)).BeginInit();
            this.groupBox3.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.groupBox4.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.goldReward)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.experienceReward)).BeginInit();
            this.SuspendLayout();
            // 
            // questList
            // 
            this.questList.FormattingEnabled = true;
            this.questList.Location = new System.Drawing.Point(2, 2);
            this.questList.Name = "questList";
            this.questList.Size = new System.Drawing.Size(120, 420);
            this.questList.TabIndex = 0;
            this.questList.SelectedIndexChanged += new System.EventHandler(this.itemList_SelectedIndexChanged);
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.globalVariableName);
            this.groupBox1.Controls.Add(this.minLevel);
            this.groupBox1.Controls.Add(this.label21);
            this.groupBox1.Controls.Add(this.name);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Location = new System.Drawing.Point(126, 3);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(222, 89);
            this.groupBox1.TabIndex = 1;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "General Settings";
            // 
            // globalVariableName
            // 
            this.globalVariableName.AutoSize = true;
            this.globalVariableName.Font = new System.Drawing.Font("Microsoft Sans Serif", 6.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.globalVariableName.Location = new System.Drawing.Point(11, 67);
            this.globalVariableName.Name = "globalVariableName";
            this.globalVariableName.Size = new System.Drawing.Size(74, 12);
            this.globalVariableName.TabIndex = 20;
            this.globalVariableName.Text = "Variable Name: -";
            // 
            // minLevel
            // 
            this.minLevel.Location = new System.Drawing.Point(61, 43);
            this.minLevel.Maximum = new decimal(new int[] {
            -1981284353,
            -1966660860,
            0,
            0});
            this.minLevel.Name = "minLevel";
            this.minLevel.Size = new System.Drawing.Size(78, 20);
            this.minLevel.TabIndex = 19;
            this.minLevel.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.minLevel.ValueChanged += new System.EventHandler(this.minLevel_ValueChanged);
            // 
            // label21
            // 
            this.label21.AutoSize = true;
            this.label21.Location = new System.Drawing.Point(10, 46);
            this.label21.Name = "label21";
            this.label21.Size = new System.Drawing.Size(44, 13);
            this.label21.TabIndex = 18;
            this.label21.Text = "Min. Lvl";
            // 
            // name
            // 
            this.name.Location = new System.Drawing.Point(61, 17);
            this.name.Name = "name";
            this.name.Size = new System.Drawing.Size(154, 20);
            this.name.TabIndex = 6;
            this.name.TextChanged += new System.EventHandler(this.Name_TextChanged);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(10, 20);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(35, 13);
            this.label1.TabIndex = 5;
            this.label1.Text = "Name";
            // 
            // newLink
            // 
            this.newLink.ActiveLinkColor = System.Drawing.Color.Blue;
            this.newLink.AutoSize = true;
            this.newLink.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.newLink.Location = new System.Drawing.Point(-1, 429);
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
            this.saveLink.Location = new System.Drawing.Point(51, 429);
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
            this.groupBox3.Location = new System.Drawing.Point(126, 95);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(222, 98);
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
            this.description.Size = new System.Drawing.Size(216, 79);
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
            this.delete.Location = new System.Drawing.Point(103, 429);
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
            this.groupBox2.Controls.Add(this.delObjective);
            this.groupBox2.Controls.Add(this.objectiveList);
            this.groupBox2.Controls.Add(this.newObjective);
            this.groupBox2.Location = new System.Drawing.Point(126, 195);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(222, 146);
            this.groupBox2.TabIndex = 24;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Objectives";
            // 
            // delObjective
            // 
            this.delObjective.ActiveLinkColor = System.Drawing.Color.Red;
            this.delObjective.AutoSize = true;
            this.delObjective.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.delObjective.LinkColor = System.Drawing.Color.Red;
            this.delObjective.Location = new System.Drawing.Point(193, 127);
            this.delObjective.Name = "delObjective";
            this.delObjective.Size = new System.Drawing.Size(23, 13);
            this.delObjective.TabIndex = 27;
            this.delObjective.TabStop = true;
            this.delObjective.Text = "Del";
            this.delObjective.VisitedLinkColor = System.Drawing.Color.Red;
            this.delObjective.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.delObjective_LinkClicked);
            // 
            // objectiveList
            // 
            this.objectiveList.Dock = System.Windows.Forms.DockStyle.Top;
            this.objectiveList.FormattingEnabled = true;
            this.objectiveList.Location = new System.Drawing.Point(3, 16);
            this.objectiveList.Name = "objectiveList";
            this.objectiveList.Size = new System.Drawing.Size(216, 108);
            this.objectiveList.TabIndex = 0;
            // 
            // newObjective
            // 
            this.newObjective.ActiveLinkColor = System.Drawing.Color.Blue;
            this.newObjective.AutoSize = true;
            this.newObjective.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.newObjective.Location = new System.Drawing.Point(10, 127);
            this.newObjective.Name = "newObjective";
            this.newObjective.Size = new System.Drawing.Size(29, 13);
            this.newObjective.TabIndex = 25;
            this.newObjective.TabStop = true;
            this.newObjective.Text = "New";
            this.newObjective.VisitedLinkColor = System.Drawing.Color.Blue;
            this.newObjective.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.newObjective_LinkClicked);
            // 
            // groupBox4
            // 
            this.groupBox4.Controls.Add(this.editItemRewards);
            this.groupBox4.Controls.Add(this.goldReward);
            this.groupBox4.Controls.Add(this.label3);
            this.groupBox4.Controls.Add(this.experienceReward);
            this.groupBox4.Controls.Add(this.label2);
            this.groupBox4.Location = new System.Drawing.Point(126, 344);
            this.groupBox4.Name = "groupBox4";
            this.groupBox4.Size = new System.Drawing.Size(222, 98);
            this.groupBox4.TabIndex = 25;
            this.groupBox4.TabStop = false;
            this.groupBox4.Text = "Rewards";
            // 
            // goldReward
            // 
            this.goldReward.Location = new System.Drawing.Point(98, 19);
            this.goldReward.Maximum = new decimal(new int[] {
            -1981284353,
            -1966660860,
            0,
            0});
            this.goldReward.Name = "goldReward";
            this.goldReward.Size = new System.Drawing.Size(117, 20);
            this.goldReward.TabIndex = 23;
            this.goldReward.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.goldReward.ValueChanged += new System.EventHandler(this.goldReward_ValueChanged);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(10, 21);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(29, 13);
            this.label3.TabIndex = 22;
            this.label3.Text = "Gold";
            // 
            // experienceReward
            // 
            this.experienceReward.Location = new System.Drawing.Point(98, 45);
            this.experienceReward.Maximum = new decimal(new int[] {
            -1981284353,
            -1966660860,
            0,
            0});
            this.experienceReward.Name = "experienceReward";
            this.experienceReward.Size = new System.Drawing.Size(117, 20);
            this.experienceReward.TabIndex = 21;
            this.experienceReward.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.experienceReward.ValueChanged += new System.EventHandler(this.experienceReward_ValueChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(10, 47);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(60, 13);
            this.label2.TabIndex = 20;
            this.label2.Text = "Experience";
            // 
            // editItemRewards
            // 
            this.editItemRewards.Location = new System.Drawing.Point(11, 69);
            this.editItemRewards.Name = "editItemRewards";
            this.editItemRewards.Size = new System.Drawing.Size(204, 22);
            this.editItemRewards.TabIndex = 24;
            this.editItemRewards.Text = "Edit Item Rewards";
            this.editItemRewards.UseVisualStyleBackColor = true;
            this.editItemRewards.Click += new System.EventHandler(this.editItemRewards_Click);
            // 
            // Quests
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(353, 447);
            this.Controls.Add(this.groupBox4);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.dialogPanel);
            this.Controls.Add(this.equipmentPanel);
            this.Controls.Add(this.consumablePanel);
            this.Controls.Add(this.delete);
            this.Controls.Add(this.groupBox3);
            this.Controls.Add(this.saveLink);
            this.Controls.Add(this.newLink);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.questList);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(369, 486);
            this.MinimumSize = new System.Drawing.Size(369, 486);
            this.Name = "Quests";
            this.Text = "WebClash Server - Quests";
            this.Load += new System.EventHandler(this.Quests_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.minLevel)).EndInit();
            this.groupBox3.ResumeLayout(false);
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.groupBox4.ResumeLayout(false);
            this.groupBox4.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.goldReward)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.experienceReward)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ListBox questList;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.LinkLabel newLink;
        private System.Windows.Forms.TextBox name;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.LinkLabel saveLink;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.RichTextBox description;
        private System.Windows.Forms.LinkLabel delete;
        private System.Windows.Forms.Panel consumablePanel;
        private System.Windows.Forms.Panel equipmentPanel;
        private System.Windows.Forms.NumericUpDown minLevel;
        private System.Windows.Forms.Label label21;
        private System.Windows.Forms.Panel dialogPanel;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.ListBox objectiveList;
        private System.Windows.Forms.LinkLabel delObjective;
        private System.Windows.Forms.LinkLabel newObjective;
        private System.Windows.Forms.GroupBox groupBox4;
        private System.Windows.Forms.NumericUpDown goldReward;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.NumericUpDown experienceReward;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label globalVariableName;
        private System.Windows.Forms.Button editItemRewards;
    }
}