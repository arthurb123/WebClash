namespace WebClashServer.Tools
{
    partial class GenerateExpTable
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(GenerateExpTable));
            this.save = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.startingValue = new System.Windows.Forms.NumericUpDown();
            this.valueIncrement = new System.Windows.Forms.NumericUpDown();
            this.label2 = new System.Windows.Forms.Label();
            this.growFactor = new System.Windows.Forms.NumericUpDown();
            this.label3 = new System.Windows.Forms.Label();
            this.maxLevel = new System.Windows.Forms.NumericUpDown();
            this.label4 = new System.Windows.Forms.Label();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.previewList = new System.Windows.Forms.ListBox();
            this.help = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.startingValue)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.valueIncrement)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.growFactor)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.maxLevel)).BeginInit();
            this.groupBox1.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.SuspendLayout();
            // 
            // save
            // 
            this.save.Location = new System.Drawing.Point(10, 147);
            this.save.Name = "save";
            this.save.Size = new System.Drawing.Size(130, 23);
            this.save.TabIndex = 0;
            this.save.Text = "Save";
            this.save.UseVisualStyleBackColor = true;
            this.save.Click += new System.EventHandler(this.save_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(7, 25);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(59, 13);
            this.label1.TabIndex = 1;
            this.label1.Text = "Start Value";
            // 
            // startingValue
            // 
            this.startingValue.Location = new System.Drawing.Point(92, 23);
            this.startingValue.Maximum = new decimal(new int[] {
            999999999,
            0,
            0,
            0});
            this.startingValue.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.startingValue.Name = "startingValue";
            this.startingValue.Size = new System.Drawing.Size(77, 20);
            this.startingValue.TabIndex = 2;
            this.startingValue.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.startingValue.Value = new decimal(new int[] {
            8,
            0,
            0,
            0});
            this.startingValue.ValueChanged += new System.EventHandler(this.startingValue_ValueChanged);
            // 
            // valueIncrement
            // 
            this.valueIncrement.Location = new System.Drawing.Point(92, 49);
            this.valueIncrement.Maximum = new decimal(new int[] {
            999999999,
            0,
            0,
            0});
            this.valueIncrement.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.valueIncrement.Name = "valueIncrement";
            this.valueIncrement.Size = new System.Drawing.Size(77, 20);
            this.valueIncrement.TabIndex = 4;
            this.valueIncrement.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.valueIncrement.Value = new decimal(new int[] {
            6,
            0,
            0,
            0});
            this.valueIncrement.ValueChanged += new System.EventHandler(this.valueIncrement_ValueChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(7, 51);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(84, 13);
            this.label2.TabIndex = 3;
            this.label2.Text = "Value Increment";
            // 
            // growFactor
            // 
            this.growFactor.DecimalPlaces = 2;
            this.growFactor.Location = new System.Drawing.Point(92, 75);
            this.growFactor.Maximum = new decimal(new int[] {
            999999999,
            0,
            0,
            0});
            this.growFactor.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            131072});
            this.growFactor.Name = "growFactor";
            this.growFactor.Size = new System.Drawing.Size(77, 20);
            this.growFactor.TabIndex = 6;
            this.growFactor.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.growFactor.Value = new decimal(new int[] {
            15,
            0,
            0,
            65536});
            this.growFactor.ValueChanged += new System.EventHandler(this.growFactor_ValueChanged);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(7, 77);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(65, 13);
            this.label3.TabIndex = 5;
            this.label3.Text = "Grow Factor";
            // 
            // maxLevel
            // 
            this.maxLevel.Location = new System.Drawing.Point(92, 110);
            this.maxLevel.Maximum = new decimal(new int[] {
            999999999,
            0,
            0,
            0});
            this.maxLevel.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.maxLevel.Name = "maxLevel";
            this.maxLevel.Size = new System.Drawing.Size(77, 20);
            this.maxLevel.TabIndex = 8;
            this.maxLevel.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.maxLevel.Value = new decimal(new int[] {
            100,
            0,
            0,
            0});
            this.maxLevel.ValueChanged += new System.EventHandler(this.maxLevel_ValueChanged);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(7, 112);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(56, 13);
            this.label4.TabIndex = 7;
            this.label4.Text = "Max Level";
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.help);
            this.groupBox1.Controls.Add(this.save);
            this.groupBox1.Controls.Add(this.maxLevel);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Controls.Add(this.label4);
            this.groupBox1.Controls.Add(this.startingValue);
            this.groupBox1.Controls.Add(this.growFactor);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Controls.Add(this.label3);
            this.groupBox1.Controls.Add(this.valueIncrement);
            this.groupBox1.Location = new System.Drawing.Point(6, 4);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(181, 176);
            this.groupBox1.TabIndex = 9;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Table Settings";
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.previewList);
            this.groupBox2.Location = new System.Drawing.Point(193, 4);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(208, 176);
            this.groupBox2.TabIndex = 10;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Preview";
            // 
            // previewList
            // 
            this.previewList.FormattingEnabled = true;
            this.previewList.Location = new System.Drawing.Point(6, 23);
            this.previewList.Name = "previewList";
            this.previewList.Size = new System.Drawing.Size(196, 147);
            this.previewList.TabIndex = 0;
            // 
            // help
            // 
            this.help.Location = new System.Drawing.Point(146, 147);
            this.help.Name = "help";
            this.help.Size = new System.Drawing.Size(23, 23);
            this.help.TabIndex = 9;
            this.help.Text = "?";
            this.help.UseVisualStyleBackColor = true;
            this.help.Click += new System.EventHandler(this.help_Click);
            // 
            // GenerateExpTable
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(408, 184);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.groupBox1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(424, 223);
            this.MinimumSize = new System.Drawing.Size(424, 223);
            this.Name = "GenerateExpTable";
            this.Text = "WebClash - Generate Experience Table";
            ((System.ComponentModel.ISupportInitialize)(this.startingValue)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.valueIncrement)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.growFactor)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.maxLevel)).EndInit();
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.groupBox2.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button save;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.NumericUpDown startingValue;
        private System.Windows.Forms.NumericUpDown valueIncrement;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.NumericUpDown growFactor;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.NumericUpDown maxLevel;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.ListBox previewList;
        private System.Windows.Forms.Button help;
    }
}