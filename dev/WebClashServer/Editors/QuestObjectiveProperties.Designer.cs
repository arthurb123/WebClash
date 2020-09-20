namespace WebClashServer.Editors
{
    partial class QuestObjectiveProperties
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(QuestObjectiveProperties));
            this.label1 = new System.Windows.Forms.Label();
            this.objectiveType = new System.Windows.Forms.ComboBox();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.talkObjectivePanel = new System.Windows.Forms.Panel();
            this.talkEditDialog = new System.Windows.Forms.Button();
            this.talkNpcSelection = new System.Windows.Forms.ComboBox();
            this.label7 = new System.Windows.Forms.Label();
            this.killObjectivePanel = new System.Windows.Forms.Panel();
            this.resetOnDeath = new System.Windows.Forms.CheckBox();
            this.killNpcAmount = new System.Windows.Forms.NumericUpDown();
            this.label3 = new System.Windows.Forms.Label();
            this.killNpcSelection = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.gatherObjectivePanel = new System.Windows.Forms.Panel();
            this.gatherAmount = new System.Windows.Forms.NumericUpDown();
            this.label4 = new System.Windows.Forms.Label();
            this.itemList = new System.Windows.Forms.ComboBox();
            this.label5 = new System.Windows.Forms.Label();
            this.label6 = new System.Windows.Forms.Label();
            this.gatherNpcSelection = new System.Windows.Forms.ComboBox();
            this.gatherRequiresTurnIn = new System.Windows.Forms.CheckBox();
            this.groupBox1.SuspendLayout();
            this.talkObjectivePanel.SuspendLayout();
            this.killObjectivePanel.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.killNpcAmount)).BeginInit();
            this.gatherObjectivePanel.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gatherAmount)).BeginInit();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(36, 15);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(79, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "Objective Type";
            // 
            // objectiveType
            // 
            this.objectiveType.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.objectiveType.FormattingEnabled = true;
            this.objectiveType.Location = new System.Drawing.Point(121, 12);
            this.objectiveType.Name = "objectiveType";
            this.objectiveType.Size = new System.Drawing.Size(111, 21);
            this.objectiveType.TabIndex = 1;
            this.objectiveType.SelectedIndexChanged += new System.EventHandler(this.objectiveType_SelectedIndexChanged);
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.gatherObjectivePanel);
            this.groupBox1.Controls.Add(this.talkObjectivePanel);
            this.groupBox1.Controls.Add(this.killObjectivePanel);
            this.groupBox1.Location = new System.Drawing.Point(12, 39);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(265, 161);
            this.groupBox1.TabIndex = 2;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Properties";
            // 
            // talkObjectivePanel
            // 
            this.talkObjectivePanel.Controls.Add(this.talkEditDialog);
            this.talkObjectivePanel.Controls.Add(this.talkNpcSelection);
            this.talkObjectivePanel.Controls.Add(this.label7);
            this.talkObjectivePanel.Location = new System.Drawing.Point(6, 19);
            this.talkObjectivePanel.Name = "talkObjectivePanel";
            this.talkObjectivePanel.Size = new System.Drawing.Size(253, 136);
            this.talkObjectivePanel.TabIndex = 5;
            this.talkObjectivePanel.Visible = false;
            // 
            // talkEditDialog
            // 
            this.talkEditDialog.Location = new System.Drawing.Point(21, 51);
            this.talkEditDialog.Name = "talkEditDialog";
            this.talkEditDialog.Size = new System.Drawing.Size(213, 23);
            this.talkEditDialog.TabIndex = 3;
            this.talkEditDialog.Text = "Edit Dialog";
            this.talkEditDialog.UseVisualStyleBackColor = true;
            this.talkEditDialog.Click += new System.EventHandler(this.talkEditDialog_Click);
            // 
            // talkNpcSelection
            // 
            this.talkNpcSelection.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.talkNpcSelection.FormattingEnabled = true;
            this.talkNpcSelection.Location = new System.Drawing.Point(113, 16);
            this.talkNpcSelection.Name = "talkNpcSelection";
            this.talkNpcSelection.Size = new System.Drawing.Size(121, 21);
            this.talkNpcSelection.TabIndex = 1;
            this.talkNpcSelection.SelectedIndexChanged += new System.EventHandler(this.talkNpcSelection_SelectedIndexChanged);
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(18, 19);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(29, 13);
            this.label7.TabIndex = 0;
            this.label7.Text = "NPC";
            // 
            // killObjectivePanel
            // 
            this.killObjectivePanel.Controls.Add(this.resetOnDeath);
            this.killObjectivePanel.Controls.Add(this.killNpcAmount);
            this.killObjectivePanel.Controls.Add(this.label3);
            this.killObjectivePanel.Controls.Add(this.killNpcSelection);
            this.killObjectivePanel.Controls.Add(this.label2);
            this.killObjectivePanel.Location = new System.Drawing.Point(6, 19);
            this.killObjectivePanel.Name = "killObjectivePanel";
            this.killObjectivePanel.Size = new System.Drawing.Size(253, 136);
            this.killObjectivePanel.TabIndex = 0;
            this.killObjectivePanel.Visible = false;
            // 
            // resetOnDeath
            // 
            this.resetOnDeath.AutoSize = true;
            this.resetOnDeath.Location = new System.Drawing.Point(45, 99);
            this.resetOnDeath.Name = "resetOnDeath";
            this.resetOnDeath.Size = new System.Drawing.Size(154, 17);
            this.resetOnDeath.TabIndex = 4;
            this.resetOnDeath.Text = "Reset upon death of player";
            this.resetOnDeath.UseVisualStyleBackColor = true;
            this.resetOnDeath.CheckedChanged += new System.EventHandler(this.ResetOnDeath_CheckedChanged);
            // 
            // killNpcAmount
            // 
            this.killNpcAmount.Location = new System.Drawing.Point(114, 54);
            this.killNpcAmount.Maximum = new decimal(new int[] {
            1215752191,
            23,
            0,
            0});
            this.killNpcAmount.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.killNpcAmount.Name = "killNpcAmount";
            this.killNpcAmount.Size = new System.Drawing.Size(120, 20);
            this.killNpcAmount.TabIndex = 3;
            this.killNpcAmount.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.killNpcAmount.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.killNpcAmount.ValueChanged += new System.EventHandler(this.killNpcAmount_ValueChanged);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(18, 56);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(43, 13);
            this.label3.TabIndex = 2;
            this.label3.Text = "Amount";
            // 
            // killNpcSelection
            // 
            this.killNpcSelection.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.killNpcSelection.FormattingEnabled = true;
            this.killNpcSelection.Location = new System.Drawing.Point(113, 16);
            this.killNpcSelection.Name = "killNpcSelection";
            this.killNpcSelection.Size = new System.Drawing.Size(121, 21);
            this.killNpcSelection.TabIndex = 1;
            this.killNpcSelection.SelectedIndexChanged += new System.EventHandler(this.killNpcSelection_SelectedIndexChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(18, 19);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(29, 13);
            this.label2.TabIndex = 0;
            this.label2.Text = "NPC";
            // 
            // gatherObjectivePanel
            // 
            this.gatherObjectivePanel.Controls.Add(this.gatherRequiresTurnIn);
            this.gatherObjectivePanel.Controls.Add(this.gatherNpcSelection);
            this.gatherObjectivePanel.Controls.Add(this.label6);
            this.gatherObjectivePanel.Controls.Add(this.gatherAmount);
            this.gatherObjectivePanel.Controls.Add(this.label4);
            this.gatherObjectivePanel.Controls.Add(this.itemList);
            this.gatherObjectivePanel.Controls.Add(this.label5);
            this.gatherObjectivePanel.Location = new System.Drawing.Point(6, 19);
            this.gatherObjectivePanel.Name = "gatherObjectivePanel";
            this.gatherObjectivePanel.Size = new System.Drawing.Size(253, 136);
            this.gatherObjectivePanel.TabIndex = 4;
            this.gatherObjectivePanel.Visible = false;
            // 
            // gatherAmount
            // 
            this.gatherAmount.Location = new System.Drawing.Point(113, 43);
            this.gatherAmount.Maximum = new decimal(new int[] {
            1215752191,
            23,
            0,
            0});
            this.gatherAmount.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.gatherAmount.Name = "gatherAmount";
            this.gatherAmount.Size = new System.Drawing.Size(121, 20);
            this.gatherAmount.TabIndex = 3;
            this.gatherAmount.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.gatherAmount.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.gatherAmount.ValueChanged += new System.EventHandler(this.gatherAmount_ValueChanged);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(18, 45);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(43, 13);
            this.label4.TabIndex = 2;
            this.label4.Text = "Amount";
            // 
            // itemList
            // 
            this.itemList.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.itemList.FormattingEnabled = true;
            this.itemList.Location = new System.Drawing.Point(113, 16);
            this.itemList.Name = "itemList";
            this.itemList.Size = new System.Drawing.Size(121, 21);
            this.itemList.TabIndex = 1;
            this.itemList.SelectedIndexChanged += new System.EventHandler(this.itemList_SelectedIndexChanged);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(18, 19);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(27, 13);
            this.label5.TabIndex = 0;
            this.label5.Text = "Item";
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(18, 104);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(70, 13);
            this.label6.TabIndex = 4;
            this.label6.Text = "Turn-in target";
            // 
            // gatherNpcSelection
            // 
            this.gatherNpcSelection.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.gatherNpcSelection.FormattingEnabled = true;
            this.gatherNpcSelection.Location = new System.Drawing.Point(113, 102);
            this.gatherNpcSelection.Name = "gatherNpcSelection";
            this.gatherNpcSelection.Size = new System.Drawing.Size(122, 21);
            this.gatherNpcSelection.TabIndex = 5;
            this.gatherNpcSelection.SelectedIndexChanged += new System.EventHandler(this.GatherNpcSelection_SelectedIndexChanged);
            // 
            // gatherRequiresTurnIn
            // 
            this.gatherRequiresTurnIn.AutoSize = true;
            this.gatherRequiresTurnIn.Location = new System.Drawing.Point(73, 80);
            this.gatherRequiresTurnIn.Name = "gatherRequiresTurnIn";
            this.gatherRequiresTurnIn.Size = new System.Drawing.Size(100, 17);
            this.gatherRequiresTurnIn.TabIndex = 6;
            this.gatherRequiresTurnIn.Text = "Requires turn-in";
            this.gatherRequiresTurnIn.UseVisualStyleBackColor = true;
            this.gatherRequiresTurnIn.CheckedChanged += new System.EventHandler(this.GatherRequiresTurnIn_CheckedChanged);
            // 
            // QuestObjectiveProperties
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(290, 212);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.objectiveType);
            this.Controls.Add(this.label1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(306, 251);
            this.MinimumSize = new System.Drawing.Size(306, 251);
            this.Name = "QuestObjectiveProperties";
            this.Text = "WebClash - Quest Objective";
            this.Load += new System.EventHandler(this.QuestObjectiveProperties_Load);
            this.groupBox1.ResumeLayout(false);
            this.talkObjectivePanel.ResumeLayout(false);
            this.talkObjectivePanel.PerformLayout();
            this.killObjectivePanel.ResumeLayout(false);
            this.killObjectivePanel.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.killNpcAmount)).EndInit();
            this.gatherObjectivePanel.ResumeLayout(false);
            this.gatherObjectivePanel.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.gatherAmount)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ComboBox objectiveType;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.Panel killObjectivePanel;
        private System.Windows.Forms.ComboBox killNpcSelection;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.NumericUpDown killNpcAmount;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Panel gatherObjectivePanel;
        private System.Windows.Forms.NumericUpDown gatherAmount;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.ComboBox itemList;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.CheckBox resetOnDeath;
        private System.Windows.Forms.Panel talkObjectivePanel;
        private System.Windows.Forms.Button talkEditDialog;
        private System.Windows.Forms.ComboBox talkNpcSelection;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.CheckBox gatherRequiresTurnIn;
        private System.Windows.Forms.ComboBox gatherNpcSelection;
        private System.Windows.Forms.Label label6;
    }
}