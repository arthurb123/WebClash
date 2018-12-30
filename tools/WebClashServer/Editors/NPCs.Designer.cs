namespace WebClashServer.Editors
{
    partial class NPCs
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(NPCs));
            this.label1 = new System.Windows.Forms.Label();
            this.npcSelect = new System.Windows.Forms.ComboBox();
            this.add = new System.Windows.Forms.Button();
            this.delete = new System.Windows.Forms.Button();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.dialogButton = new System.Windows.Forms.Button();
            this.name = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.charSelect = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.save = new System.Windows.Forms.LinkLabel();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.range = new System.Windows.Forms.NumericUpDown();
            this.label4 = new System.Windows.Forms.Label();
            this.movementFree = new System.Windows.Forms.RadioButton();
            this.movementStatic = new System.Windows.Forms.RadioButton();
            this.statistics = new System.Windows.Forms.GroupBox();
            this.level = new System.Windows.Forms.NumericUpDown();
            this.label5 = new System.Windows.Forms.Label();
            this.typeFriendly = new System.Windows.Forms.RadioButton();
            this.typeHostile = new System.Windows.Forms.RadioButton();
            this.label6 = new System.Windows.Forms.Label();
            this.groupBox1.SuspendLayout();
            this.groupBox2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.range)).BeginInit();
            this.statistics.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.level)).BeginInit();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(24, 15);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(75, 15);
            this.label1.TabIndex = 0;
            this.label1.Text = "Current NPC";
            // 
            // npcSelect
            // 
            this.npcSelect.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.npcSelect.FormattingEnabled = true;
            this.npcSelect.Location = new System.Drawing.Point(105, 13);
            this.npcSelect.Name = "npcSelect";
            this.npcSelect.Size = new System.Drawing.Size(121, 21);
            this.npcSelect.TabIndex = 1;
            this.npcSelect.SelectedIndexChanged += new System.EventHandler(this.npcSelect_SelectedIndexChanged);
            // 
            // add
            // 
            this.add.Location = new System.Drawing.Point(256, 13);
            this.add.Name = "add";
            this.add.Size = new System.Drawing.Size(39, 21);
            this.add.TabIndex = 2;
            this.add.Text = "Add";
            this.add.UseVisualStyleBackColor = true;
            this.add.Click += new System.EventHandler(this.add_Click);
            // 
            // delete
            // 
            this.delete.Location = new System.Drawing.Point(301, 13);
            this.delete.Name = "delete";
            this.delete.Size = new System.Drawing.Size(75, 21);
            this.delete.TabIndex = 3;
            this.delete.Text = "Remove";
            this.delete.UseVisualStyleBackColor = true;
            this.delete.Click += new System.EventHandler(this.delete_Click);
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.dialogButton);
            this.groupBox1.Controls.Add(this.name);
            this.groupBox1.Controls.Add(this.label3);
            this.groupBox1.Controls.Add(this.charSelect);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBox1.Location = new System.Drawing.Point(15, 43);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(373, 105);
            this.groupBox1.TabIndex = 4;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "NPC";
            // 
            // dialogButton
            // 
            this.dialogButton.Location = new System.Drawing.Point(12, 69);
            this.dialogButton.Name = "dialogButton";
            this.dialogButton.Size = new System.Drawing.Size(344, 23);
            this.dialogButton.TabIndex = 15;
            this.dialogButton.Text = "Edit Dialog";
            this.dialogButton.UseVisualStyleBackColor = true;
            // 
            // name
            // 
            this.name.Location = new System.Drawing.Point(56, 26);
            this.name.Name = "name";
            this.name.Size = new System.Drawing.Size(119, 21);
            this.name.TabIndex = 14;
            this.name.TextChanged += new System.EventHandler(this.name_TextChanged);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(9, 27);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(41, 15);
            this.label3.TabIndex = 13;
            this.label3.Text = "Name";
            // 
            // charSelect
            // 
            this.charSelect.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.charSelect.FormattingEnabled = true;
            this.charSelect.Items.AddRange(new object[] {
            "Horizontal"});
            this.charSelect.Location = new System.Drawing.Point(246, 24);
            this.charSelect.Name = "charSelect";
            this.charSelect.Size = new System.Drawing.Size(110, 23);
            this.charSelect.TabIndex = 12;
            this.charSelect.SelectedIndexChanged += new System.EventHandler(this.charSelect_SelectedIndexChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(181, 27);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(60, 15);
            this.label2.TabIndex = 11;
            this.label2.Text = "Character";
            // 
            // save
            // 
            this.save.ActiveLinkColor = System.Drawing.Color.Blue;
            this.save.AutoSize = true;
            this.save.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.save.LinkColor = System.Drawing.Color.Blue;
            this.save.Location = new System.Drawing.Point(360, 417);
            this.save.Name = "save";
            this.save.Size = new System.Drawing.Size(32, 13);
            this.save.TabIndex = 7;
            this.save.TabStop = true;
            this.save.Text = "Save";
            this.save.VisitedLinkColor = System.Drawing.Color.Blue;
            this.save.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.save_LinkClicked);
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.range);
            this.groupBox2.Controls.Add(this.label4);
            this.groupBox2.Controls.Add(this.movementFree);
            this.groupBox2.Controls.Add(this.movementStatic);
            this.groupBox2.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBox2.Location = new System.Drawing.Point(15, 154);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(373, 60);
            this.groupBox2.TabIndex = 8;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Movement";
            // 
            // range
            // 
            this.range.Location = new System.Drawing.Point(286, 25);
            this.range.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.range.Name = "range";
            this.range.Size = new System.Drawing.Size(60, 21);
            this.range.TabIndex = 3;
            this.range.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.range.Value = new decimal(new int[] {
            10,
            0,
            0,
            0});
            this.range.ValueChanged += new System.EventHandler(this.range_ValueChanged);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(173, 27);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(103, 15);
            this.label4.TabIndex = 2;
            this.label4.Text = "Maximum Range";
            // 
            // movementFree
            // 
            this.movementFree.AutoSize = true;
            this.movementFree.Checked = true;
            this.movementFree.Location = new System.Drawing.Point(12, 25);
            this.movementFree.Name = "movementFree";
            this.movementFree.Size = new System.Drawing.Size(50, 19);
            this.movementFree.TabIndex = 1;
            this.movementFree.TabStop = true;
            this.movementFree.Text = "Free";
            this.movementFree.UseVisualStyleBackColor = true;
            this.movementFree.CheckedChanged += new System.EventHandler(this.movementFree_CheckedChanged);
            // 
            // movementStatic
            // 
            this.movementStatic.AutoSize = true;
            this.movementStatic.Location = new System.Drawing.Point(90, 25);
            this.movementStatic.Name = "movementStatic";
            this.movementStatic.Size = new System.Drawing.Size(55, 19);
            this.movementStatic.TabIndex = 0;
            this.movementStatic.Text = "Static";
            this.movementStatic.UseVisualStyleBackColor = true;
            this.movementStatic.CheckedChanged += new System.EventHandler(this.movementStatic_CheckedChanged);
            // 
            // statistics
            // 
            this.statistics.Controls.Add(this.level);
            this.statistics.Controls.Add(this.label5);
            this.statistics.Enabled = false;
            this.statistics.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.statistics.Location = new System.Drawing.Point(15, 249);
            this.statistics.Name = "statistics";
            this.statistics.Size = new System.Drawing.Size(373, 154);
            this.statistics.TabIndex = 9;
            this.statistics.TabStop = false;
            this.statistics.Text = "Statistics";
            // 
            // level
            // 
            this.level.Location = new System.Drawing.Point(56, 24);
            this.level.Maximum = new decimal(new int[] {
            9999999,
            0,
            0,
            0});
            this.level.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.level.Name = "level";
            this.level.Size = new System.Drawing.Size(80, 21);
            this.level.TabIndex = 1;
            this.level.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.level.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.level.ValueChanged += new System.EventHandler(this.level_ValueChanged);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(9, 26);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(36, 15);
            this.label5.TabIndex = 0;
            this.label5.Text = "Level";
            // 
            // typeFriendly
            // 
            this.typeFriendly.AutoSize = true;
            this.typeFriendly.Checked = true;
            this.typeFriendly.Location = new System.Drawing.Point(167, 226);
            this.typeFriendly.Name = "typeFriendly";
            this.typeFriendly.Size = new System.Drawing.Size(61, 17);
            this.typeFriendly.TabIndex = 1;
            this.typeFriendly.TabStop = true;
            this.typeFriendly.Text = "Friendly";
            this.typeFriendly.UseVisualStyleBackColor = true;
            this.typeFriendly.CheckedChanged += new System.EventHandler(this.typeFriendly_CheckedChanged);
            // 
            // typeHostile
            // 
            this.typeHostile.AutoSize = true;
            this.typeHostile.Location = new System.Drawing.Point(234, 226);
            this.typeHostile.Name = "typeHostile";
            this.typeHostile.Size = new System.Drawing.Size(57, 17);
            this.typeHostile.TabIndex = 0;
            this.typeHostile.Text = "Hostile";
            this.typeHostile.UseVisualStyleBackColor = true;
            this.typeHostile.CheckedChanged += new System.EventHandler(this.typeHostile_CheckedChanged);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(95, 228);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(56, 13);
            this.label6.TabIndex = 10;
            this.label6.Text = "NPC Type";
            // 
            // NPCs
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(404, 442);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.statistics);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.typeFriendly);
            this.Controls.Add(this.save);
            this.Controls.Add(this.typeHostile);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.delete);
            this.Controls.Add(this.add);
            this.Controls.Add(this.npcSelect);
            this.Controls.Add(this.label1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.Name = "NPCs";
            this.Text = "WebClash Server - NPCs";
            this.Load += new System.EventHandler(this.NPCs_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.range)).EndInit();
            this.statistics.ResumeLayout(false);
            this.statistics.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.level)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ComboBox npcSelect;
        private System.Windows.Forms.Button add;
        private System.Windows.Forms.Button delete;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.LinkLabel save;
        private System.Windows.Forms.ComboBox charSelect;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox name;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Button dialogButton;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.NumericUpDown range;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.RadioButton movementFree;
        private System.Windows.Forms.RadioButton movementStatic;
        private System.Windows.Forms.GroupBox statistics;
        private System.Windows.Forms.RadioButton typeFriendly;
        private System.Windows.Forms.RadioButton typeHostile;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.NumericUpDown level;
    }
}