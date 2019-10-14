namespace WebClashServer.Editors
{
    partial class DialogueEventProperties
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(DialogueEventProperties));
            this.loadMapPanel = new System.Windows.Forms.Panel();
            this.positionY = new System.Windows.Forms.NumericUpDown();
            this.positionX = new System.Windows.Forms.NumericUpDown();
            this.label4 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.mapList = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.giveItemPanel = new System.Windows.Forms.Panel();
            this.itemAmount = new System.Windows.Forms.NumericUpDown();
            this.label7 = new System.Windows.Forms.Label();
            this.itemList = new System.Windows.Forms.ComboBox();
            this.label8 = new System.Windows.Forms.Label();
            this.succesText = new System.Windows.Forms.Label();
            this.nextIndex = new System.Windows.Forms.NumericUpDown();
            this.label6 = new System.Windows.Forms.Label();
            this.repeatable = new System.Windows.Forms.CheckBox();
            this.nextIndex1 = new System.Windows.Forms.NumericUpDown();
            this.occurredText = new System.Windows.Forms.Label();
            this.affectPlayerPanel = new System.Windows.Forms.Panel();
            this.goldDifference = new System.Windows.Forms.NumericUpDown();
            this.label11 = new System.Windows.Forms.Label();
            this.manaDifference = new System.Windows.Forms.NumericUpDown();
            this.label10 = new System.Windows.Forms.Label();
            this.healthDifference = new System.Windows.Forms.NumericUpDown();
            this.label9 = new System.Windows.Forms.Label();
            this.spawnNPCPanel = new System.Windows.Forms.Panel();
            this.npcHostile = new System.Windows.Forms.CheckBox();
            this.npcAmount = new System.Windows.Forms.NumericUpDown();
            this.label12 = new System.Windows.Forms.Label();
            this.npcList = new System.Windows.Forms.ComboBox();
            this.label13 = new System.Windows.Forms.Label();
            this.showQuestPanel = new System.Windows.Forms.Panel();
            this.questList = new System.Windows.Forms.ComboBox();
            this.label15 = new System.Windows.Forms.Label();
            this.playerVariablePanel = new System.Windows.Forms.Panel();
            this.playerVariableValue = new System.Windows.Forms.CheckBox();
            this.playerVariableName = new System.Windows.Forms.TextBox();
            this.label14 = new System.Windows.Forms.Label();
            this.getVariableEntryPoint = new System.Windows.Forms.CheckBox();
            this.loadMapPanel.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.positionY)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.positionX)).BeginInit();
            this.giveItemPanel.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.itemAmount)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nextIndex)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nextIndex1)).BeginInit();
            this.affectPlayerPanel.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.goldDifference)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.manaDifference)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.healthDifference)).BeginInit();
            this.spawnNPCPanel.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.npcAmount)).BeginInit();
            this.showQuestPanel.SuspendLayout();
            this.playerVariablePanel.SuspendLayout();
            this.SuspendLayout();
            // 
            // loadMapPanel
            // 
            this.loadMapPanel.Controls.Add(this.positionY);
            this.loadMapPanel.Controls.Add(this.positionX);
            this.loadMapPanel.Controls.Add(this.label4);
            this.loadMapPanel.Controls.Add(this.label3);
            this.loadMapPanel.Controls.Add(this.mapList);
            this.loadMapPanel.Controls.Add(this.label2);
            this.loadMapPanel.Location = new System.Drawing.Point(12, 12);
            this.loadMapPanel.Name = "loadMapPanel";
            this.loadMapPanel.Size = new System.Drawing.Size(286, 126);
            this.loadMapPanel.TabIndex = 0;
            this.loadMapPanel.Visible = false;
            // 
            // positionY
            // 
            this.positionY.Location = new System.Drawing.Point(156, 91);
            this.positionY.Maximum = new decimal(new int[] {
            276447231,
            23283,
            0,
            0});
            this.positionY.Name = "positionY";
            this.positionY.Size = new System.Drawing.Size(120, 20);
            this.positionY.TabIndex = 5;
            this.positionY.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.positionY.ValueChanged += new System.EventHandler(this.positionY_ValueChanged);
            // 
            // positionX
            // 
            this.positionX.Location = new System.Drawing.Point(156, 47);
            this.positionX.Maximum = new decimal(new int[] {
            1215752191,
            23,
            0,
            0});
            this.positionX.Name = "positionX";
            this.positionX.Size = new System.Drawing.Size(120, 20);
            this.positionX.TabIndex = 4;
            this.positionX.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.positionX.ValueChanged += new System.EventHandler(this.positionX_ValueChanged);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(12, 85);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(57, 26);
            this.label4.TabIndex = 3;
            this.label4.Text = "Position Y \r\n(Tile)";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(12, 47);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(57, 26);
            this.label3.TabIndex = 2;
            this.label3.Text = "Position X \r\n(Tile)";
            // 
            // mapList
            // 
            this.mapList.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.mapList.FormattingEnabled = true;
            this.mapList.Location = new System.Drawing.Point(156, 6);
            this.mapList.Name = "mapList";
            this.mapList.Size = new System.Drawing.Size(121, 21);
            this.mapList.TabIndex = 1;
            this.mapList.SelectedIndexChanged += new System.EventHandler(this.mapList_SelectedIndexChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(12, 9);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(28, 13);
            this.label2.TabIndex = 0;
            this.label2.Text = "Map";
            // 
            // giveItemPanel
            // 
            this.giveItemPanel.Controls.Add(this.itemAmount);
            this.giveItemPanel.Controls.Add(this.label7);
            this.giveItemPanel.Controls.Add(this.itemList);
            this.giveItemPanel.Controls.Add(this.label8);
            this.giveItemPanel.Location = new System.Drawing.Point(12, 12);
            this.giveItemPanel.Name = "giveItemPanel";
            this.giveItemPanel.Size = new System.Drawing.Size(286, 126);
            this.giveItemPanel.TabIndex = 6;
            this.giveItemPanel.Visible = false;
            // 
            // itemAmount
            // 
            this.itemAmount.Location = new System.Drawing.Point(156, 47);
            this.itemAmount.Maximum = new decimal(new int[] {
            1215752191,
            23,
            0,
            0});
            this.itemAmount.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.itemAmount.Name = "itemAmount";
            this.itemAmount.Size = new System.Drawing.Size(120, 20);
            this.itemAmount.TabIndex = 4;
            this.itemAmount.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.itemAmount.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.itemAmount.ValueChanged += new System.EventHandler(this.itemAmount_ValueChanged);
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(12, 47);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(43, 13);
            this.label7.TabIndex = 2;
            this.label7.Text = "Amount";
            // 
            // itemList
            // 
            this.itemList.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.itemList.FormattingEnabled = true;
            this.itemList.Location = new System.Drawing.Point(156, 6);
            this.itemList.Name = "itemList";
            this.itemList.Size = new System.Drawing.Size(121, 21);
            this.itemList.TabIndex = 1;
            this.itemList.SelectedIndexChanged += new System.EventHandler(this.itemList_SelectedIndexChanged);
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(12, 9);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(27, 13);
            this.label8.TabIndex = 0;
            this.label8.Text = "Item";
            // 
            // succesText
            // 
            this.succesText.AutoSize = true;
            this.succesText.Location = new System.Drawing.Point(130, 148);
            this.succesText.Name = "succesText";
            this.succesText.Size = new System.Drawing.Size(79, 13);
            this.succesText.TabIndex = 1;
            this.succesText.Text = "Next (Success)";
            // 
            // nextIndex
            // 
            this.nextIndex.Location = new System.Drawing.Point(215, 144);
            this.nextIndex.Maximum = new decimal(new int[] {
            99999999,
            0,
            0,
            0});
            this.nextIndex.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            -2147483648});
            this.nextIndex.Name = "nextIndex";
            this.nextIndex.Size = new System.Drawing.Size(83, 20);
            this.nextIndex.TabIndex = 2;
            this.nextIndex.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.nextIndex.Value = new decimal(new int[] {
            1,
            0,
            0,
            -2147483648});
            this.nextIndex.ValueChanged += new System.EventHandler(this.nextIndex_ValueChanged);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Font = new System.Drawing.Font("Microsoft Sans Serif", 6.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label6.Location = new System.Drawing.Point(195, 194);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(100, 12);
            this.label6.TabIndex = 35;
            this.label6.Text = "* -1 will close the dialog";
            // 
            // repeatable
            // 
            this.repeatable.AutoSize = true;
            this.repeatable.Location = new System.Drawing.Point(12, 148);
            this.repeatable.Name = "repeatable";
            this.repeatable.Size = new System.Drawing.Size(81, 17);
            this.repeatable.TabIndex = 36;
            this.repeatable.Text = "Repeatable";
            this.repeatable.UseVisualStyleBackColor = true;
            this.repeatable.CheckedChanged += new System.EventHandler(this.repeatable_CheckedChanged);
            // 
            // nextIndex1
            // 
            this.nextIndex1.Location = new System.Drawing.Point(215, 170);
            this.nextIndex1.Maximum = new decimal(new int[] {
            99999999,
            0,
            0,
            0});
            this.nextIndex1.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            -2147483648});
            this.nextIndex1.Name = "nextIndex1";
            this.nextIndex1.Size = new System.Drawing.Size(83, 20);
            this.nextIndex1.TabIndex = 38;
            this.nextIndex1.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.nextIndex1.Value = new decimal(new int[] {
            1,
            0,
            0,
            -2147483648});
            this.nextIndex1.ValueChanged += new System.EventHandler(this.nextIndex1_ValueChanged);
            // 
            // occurredText
            // 
            this.occurredText.AutoSize = true;
            this.occurredText.Location = new System.Drawing.Point(128, 172);
            this.occurredText.Name = "occurredText";
            this.occurredText.Size = new System.Drawing.Size(82, 13);
            this.occurredText.TabIndex = 37;
            this.occurredText.Text = "Next (Occurred)";
            // 
            // affectPlayerPanel
            // 
            this.affectPlayerPanel.Controls.Add(this.goldDifference);
            this.affectPlayerPanel.Controls.Add(this.label11);
            this.affectPlayerPanel.Controls.Add(this.manaDifference);
            this.affectPlayerPanel.Controls.Add(this.label10);
            this.affectPlayerPanel.Controls.Add(this.healthDifference);
            this.affectPlayerPanel.Controls.Add(this.label9);
            this.affectPlayerPanel.Location = new System.Drawing.Point(12, 12);
            this.affectPlayerPanel.Name = "affectPlayerPanel";
            this.affectPlayerPanel.Size = new System.Drawing.Size(286, 126);
            this.affectPlayerPanel.TabIndex = 7;
            this.affectPlayerPanel.Visible = false;
            // 
            // goldDifference
            // 
            this.goldDifference.Location = new System.Drawing.Point(174, 61);
            this.goldDifference.Maximum = new decimal(new int[] {
            1215752191,
            23,
            0,
            0});
            this.goldDifference.Minimum = new decimal(new int[] {
            -727379969,
            232,
            0,
            -2147483648});
            this.goldDifference.Name = "goldDifference";
            this.goldDifference.Size = new System.Drawing.Size(102, 20);
            this.goldDifference.TabIndex = 8;
            this.goldDifference.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.goldDifference.ValueChanged += new System.EventHandler(this.goldDifference_ValueChanged);
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(12, 63);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(63, 13);
            this.label11.TabIndex = 7;
            this.label11.Text = "Gold (Delta)";
            // 
            // manaDifference
            // 
            this.manaDifference.Location = new System.Drawing.Point(174, 35);
            this.manaDifference.Maximum = new decimal(new int[] {
            1215752191,
            23,
            0,
            0});
            this.manaDifference.Minimum = new decimal(new int[] {
            -727379969,
            232,
            0,
            -2147483648});
            this.manaDifference.Name = "manaDifference";
            this.manaDifference.Size = new System.Drawing.Size(102, 20);
            this.manaDifference.TabIndex = 6;
            this.manaDifference.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.manaDifference.ValueChanged += new System.EventHandler(this.manaDifference_ValueChanged);
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(12, 37);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(68, 13);
            this.label10.TabIndex = 5;
            this.label10.Text = "Mana (Delta)";
            // 
            // healthDifference
            // 
            this.healthDifference.Location = new System.Drawing.Point(174, 9);
            this.healthDifference.Maximum = new decimal(new int[] {
            1215752191,
            23,
            0,
            0});
            this.healthDifference.Minimum = new decimal(new int[] {
            -727379969,
            232,
            0,
            -2147483648});
            this.healthDifference.Name = "healthDifference";
            this.healthDifference.Size = new System.Drawing.Size(102, 20);
            this.healthDifference.TabIndex = 4;
            this.healthDifference.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.healthDifference.ValueChanged += new System.EventHandler(this.healthDifference_ValueChanged);
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(12, 11);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(72, 13);
            this.label9.TabIndex = 2;
            this.label9.Text = "Health (Delta)";
            // 
            // spawnNPCPanel
            // 
            this.spawnNPCPanel.Controls.Add(this.npcHostile);
            this.spawnNPCPanel.Controls.Add(this.npcAmount);
            this.spawnNPCPanel.Controls.Add(this.label12);
            this.spawnNPCPanel.Controls.Add(this.npcList);
            this.spawnNPCPanel.Controls.Add(this.label13);
            this.spawnNPCPanel.Location = new System.Drawing.Point(12, 12);
            this.spawnNPCPanel.Name = "spawnNPCPanel";
            this.spawnNPCPanel.Size = new System.Drawing.Size(286, 126);
            this.spawnNPCPanel.TabIndex = 9;
            this.spawnNPCPanel.Visible = false;
            // 
            // npcHostile
            // 
            this.npcHostile.AutoSize = true;
            this.npcHostile.Location = new System.Drawing.Point(15, 84);
            this.npcHostile.Name = "npcHostile";
            this.npcHostile.Size = new System.Drawing.Size(134, 17);
            this.npcHostile.TabIndex = 5;
            this.npcHostile.Text = "Hostile (Attacks player)";
            this.npcHostile.UseVisualStyleBackColor = true;
            this.npcHostile.CheckedChanged += new System.EventHandler(this.npcHostile_CheckedChanged);
            // 
            // npcAmount
            // 
            this.npcAmount.Location = new System.Drawing.Point(156, 47);
            this.npcAmount.Maximum = new decimal(new int[] {
            1215752191,
            23,
            0,
            0});
            this.npcAmount.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.npcAmount.Name = "npcAmount";
            this.npcAmount.Size = new System.Drawing.Size(120, 20);
            this.npcAmount.TabIndex = 4;
            this.npcAmount.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.npcAmount.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.npcAmount.ValueChanged += new System.EventHandler(this.npcAmount_ValueChanged);
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(12, 47);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(43, 13);
            this.label12.TabIndex = 2;
            this.label12.Text = "Amount";
            // 
            // npcList
            // 
            this.npcList.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.npcList.FormattingEnabled = true;
            this.npcList.Location = new System.Drawing.Point(156, 6);
            this.npcList.Name = "npcList";
            this.npcList.Size = new System.Drawing.Size(121, 21);
            this.npcList.TabIndex = 1;
            this.npcList.SelectedIndexChanged += new System.EventHandler(this.npcList_SelectedIndexChanged);
            // 
            // label13
            // 
            this.label13.AutoSize = true;
            this.label13.Location = new System.Drawing.Point(12, 9);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(29, 13);
            this.label13.TabIndex = 0;
            this.label13.Text = "NPC";
            // 
            // showQuestPanel
            // 
            this.showQuestPanel.Controls.Add(this.questList);
            this.showQuestPanel.Controls.Add(this.label15);
            this.showQuestPanel.Location = new System.Drawing.Point(12, 12);
            this.showQuestPanel.Name = "showQuestPanel";
            this.showQuestPanel.Size = new System.Drawing.Size(286, 126);
            this.showQuestPanel.TabIndex = 10;
            this.showQuestPanel.Visible = false;
            // 
            // questList
            // 
            this.questList.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.questList.FormattingEnabled = true;
            this.questList.Location = new System.Drawing.Point(119, 6);
            this.questList.Name = "questList";
            this.questList.Size = new System.Drawing.Size(158, 21);
            this.questList.TabIndex = 1;
            this.questList.SelectedIndexChanged += new System.EventHandler(this.questList_SelectedIndexChanged);
            // 
            // label15
            // 
            this.label15.AutoSize = true;
            this.label15.Location = new System.Drawing.Point(12, 9);
            this.label15.Name = "label15";
            this.label15.Size = new System.Drawing.Size(35, 13);
            this.label15.TabIndex = 0;
            this.label15.Text = "Quest";
            // 
            // playerVariablePanel
            // 
            this.playerVariablePanel.Controls.Add(this.getVariableEntryPoint);
            this.playerVariablePanel.Controls.Add(this.playerVariableValue);
            this.playerVariablePanel.Controls.Add(this.playerVariableName);
            this.playerVariablePanel.Controls.Add(this.label14);
            this.playerVariablePanel.Location = new System.Drawing.Point(12, 12);
            this.playerVariablePanel.Name = "playerVariablePanel";
            this.playerVariablePanel.Size = new System.Drawing.Size(286, 126);
            this.playerVariablePanel.TabIndex = 11;
            this.playerVariablePanel.Visible = false;
            // 
            // playerVariableValue
            // 
            this.playerVariableValue.AutoSize = true;
            this.playerVariableValue.Location = new System.Drawing.Point(111, 77);
            this.playerVariableValue.Name = "playerVariableValue";
            this.playerVariableValue.Size = new System.Drawing.Size(53, 17);
            this.playerVariableValue.TabIndex = 2;
            this.playerVariableValue.Text = "Value";
            this.playerVariableValue.UseVisualStyleBackColor = true;
            this.playerVariableValue.Visible = false;
            this.playerVariableValue.CheckedChanged += new System.EventHandler(this.PlayerVariableValue_CheckedChanged);
            // 
            // playerVariableName
            // 
            this.playerVariableName.Location = new System.Drawing.Point(112, 46);
            this.playerVariableName.Name = "playerVariableName";
            this.playerVariableName.Size = new System.Drawing.Size(164, 20);
            this.playerVariableName.TabIndex = 1;
            this.playerVariableName.TextChanged += new System.EventHandler(this.PlayerVariableName_TextChanged);
            // 
            // label14
            // 
            this.label14.AutoSize = true;
            this.label14.Location = new System.Drawing.Point(8, 49);
            this.label14.Name = "label14";
            this.label14.Size = new System.Drawing.Size(76, 13);
            this.label14.TabIndex = 0;
            this.label14.Text = "Variable Name";
            // 
            // getVariableEntryPoint
            // 
            this.getVariableEntryPoint.AutoSize = true;
            this.getVariableEntryPoint.Location = new System.Drawing.Point(203, 7);
            this.getVariableEntryPoint.Name = "getVariableEntryPoint";
            this.getVariableEntryPoint.Size = new System.Drawing.Size(76, 17);
            this.getVariableEntryPoint.TabIndex = 3;
            this.getVariableEntryPoint.Text = "Entry point";
            this.getVariableEntryPoint.UseVisualStyleBackColor = true;
            this.getVariableEntryPoint.CheckedChanged += new System.EventHandler(this.GetVariableEntryPoint_CheckedChanged);
            // 
            // DialogueEventProperties
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(312, 215);
            this.Controls.Add(this.playerVariablePanel);
            this.Controls.Add(this.showQuestPanel);
            this.Controls.Add(this.spawnNPCPanel);
            this.Controls.Add(this.affectPlayerPanel);
            this.Controls.Add(this.nextIndex1);
            this.Controls.Add(this.occurredText);
            this.Controls.Add(this.giveItemPanel);
            this.Controls.Add(this.repeatable);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.nextIndex);
            this.Controls.Add(this.succesText);
            this.Controls.Add(this.loadMapPanel);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(328, 254);
            this.MinimumSize = new System.Drawing.Size(328, 254);
            this.Name = "DialogueEventProperties";
            this.Text = "WebClash Server - DialogEvent";
            this.Load += new System.EventHandler(this.DialogueEventProperties_Load);
            this.loadMapPanel.ResumeLayout(false);
            this.loadMapPanel.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.positionY)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.positionX)).EndInit();
            this.giveItemPanel.ResumeLayout(false);
            this.giveItemPanel.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.itemAmount)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nextIndex)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nextIndex1)).EndInit();
            this.affectPlayerPanel.ResumeLayout(false);
            this.affectPlayerPanel.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.goldDifference)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.manaDifference)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.healthDifference)).EndInit();
            this.spawnNPCPanel.ResumeLayout(false);
            this.spawnNPCPanel.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.npcAmount)).EndInit();
            this.showQuestPanel.ResumeLayout(false);
            this.showQuestPanel.PerformLayout();
            this.playerVariablePanel.ResumeLayout(false);
            this.playerVariablePanel.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Panel loadMapPanel;
        private System.Windows.Forms.Label succesText;
        private System.Windows.Forms.NumericUpDown nextIndex;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.CheckBox repeatable;
        private System.Windows.Forms.ComboBox mapList;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.NumericUpDown positionY;
        private System.Windows.Forms.NumericUpDown positionX;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Panel giveItemPanel;
        private System.Windows.Forms.NumericUpDown itemAmount;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.ComboBox itemList;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.NumericUpDown nextIndex1;
        private System.Windows.Forms.Label occurredText;
        private System.Windows.Forms.Panel affectPlayerPanel;
        private System.Windows.Forms.NumericUpDown healthDifference;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.NumericUpDown manaDifference;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.NumericUpDown goldDifference;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.Panel spawnNPCPanel;
        private System.Windows.Forms.NumericUpDown npcAmount;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.ComboBox npcList;
        private System.Windows.Forms.Label label13;
        private System.Windows.Forms.CheckBox npcHostile;
        private System.Windows.Forms.Panel showQuestPanel;
        private System.Windows.Forms.ComboBox questList;
        private System.Windows.Forms.Label label15;
        private System.Windows.Forms.Panel playerVariablePanel;
        private System.Windows.Forms.TextBox playerVariableName;
        private System.Windows.Forms.Label label14;
        private System.Windows.Forms.CheckBox playerVariableValue;
        private System.Windows.Forms.CheckBox getVariableEntryPoint;
    }
}