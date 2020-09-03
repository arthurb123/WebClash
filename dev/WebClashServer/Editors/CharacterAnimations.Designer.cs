namespace WebClashServer.Editors
{
    partial class CharacterAnimations
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(CharacterAnimations));
            this.animationList = new System.Windows.Forms.ListBox();
            this.downGroupBox = new System.Windows.Forms.GroupBox();
            this.editDownFrames = new System.Windows.Forms.Button();
            this.downCanvas = new System.Windows.Forms.PictureBox();
            this.upGroupBox = new System.Windows.Forms.GroupBox();
            this.editUpFrames = new System.Windows.Forms.Button();
            this.upCanvas = new System.Windows.Forms.PictureBox();
            this.leftGroupBox = new System.Windows.Forms.GroupBox();
            this.editLeftFrames = new System.Windows.Forms.Button();
            this.leftCanvas = new System.Windows.Forms.PictureBox();
            this.rightGroupBox = new System.Windows.Forms.GroupBox();
            this.editRightFrames = new System.Windows.Forms.Button();
            this.rightCanvas = new System.Windows.Forms.PictureBox();
            this.useOther = new System.Windows.Forms.CheckBox();
            this.others = new System.Windows.Forms.ComboBox();
            this.speed = new System.Windows.Forms.NumericUpDown();
            this.label7 = new System.Windows.Forms.Label();
            this.downGroupBox.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.downCanvas)).BeginInit();
            this.upGroupBox.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.upCanvas)).BeginInit();
            this.leftGroupBox.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.leftCanvas)).BeginInit();
            this.rightGroupBox.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.rightCanvas)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.speed)).BeginInit();
            this.SuspendLayout();
            // 
            // animationList
            // 
            this.animationList.Dock = System.Windows.Forms.DockStyle.Left;
            this.animationList.FormattingEnabled = true;
            this.animationList.Items.AddRange(new object[] {
            "Idle",
            "Walking",
            "Running",
            "Casting",
            "Attacking"});
            this.animationList.Location = new System.Drawing.Point(0, 0);
            this.animationList.Name = "animationList";
            this.animationList.Size = new System.Drawing.Size(120, 394);
            this.animationList.TabIndex = 0;
            this.animationList.SelectedIndexChanged += new System.EventHandler(this.animationList_SelectedIndexChanged);
            // 
            // downGroupBox
            // 
            this.downGroupBox.Controls.Add(this.editDownFrames);
            this.downGroupBox.Controls.Add(this.downCanvas);
            this.downGroupBox.Location = new System.Drawing.Point(126, 26);
            this.downGroupBox.Name = "downGroupBox";
            this.downGroupBox.Size = new System.Drawing.Size(186, 180);
            this.downGroupBox.TabIndex = 1;
            this.downGroupBox.TabStop = false;
            this.downGroupBox.Text = "Down";
            // 
            // editDownFrames
            // 
            this.editDownFrames.Location = new System.Drawing.Point(59, 151);
            this.editDownFrames.Name = "editDownFrames";
            this.editDownFrames.Size = new System.Drawing.Size(75, 23);
            this.editDownFrames.TabIndex = 1;
            this.editDownFrames.Text = "Edit Frames";
            this.editDownFrames.UseVisualStyleBackColor = true;
            this.editDownFrames.Click += new System.EventHandler(this.editDownFrames_Click);
            // 
            // downCanvas
            // 
            this.downCanvas.BackColor = System.Drawing.SystemColors.ControlLight;
            this.downCanvas.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.downCanvas.Location = new System.Drawing.Point(32, 19);
            this.downCanvas.Name = "downCanvas";
            this.downCanvas.Size = new System.Drawing.Size(128, 128);
            this.downCanvas.TabIndex = 0;
            this.downCanvas.TabStop = false;
            this.downCanvas.Paint += new System.Windows.Forms.PaintEventHandler(this.downCanvas_Paint);
            // 
            // upGroupBox
            // 
            this.upGroupBox.Controls.Add(this.editUpFrames);
            this.upGroupBox.Controls.Add(this.upCanvas);
            this.upGroupBox.Location = new System.Drawing.Point(318, 26);
            this.upGroupBox.Name = "upGroupBox";
            this.upGroupBox.Size = new System.Drawing.Size(186, 180);
            this.upGroupBox.TabIndex = 2;
            this.upGroupBox.TabStop = false;
            this.upGroupBox.Text = "Up";
            // 
            // editUpFrames
            // 
            this.editUpFrames.Location = new System.Drawing.Point(55, 151);
            this.editUpFrames.Name = "editUpFrames";
            this.editUpFrames.Size = new System.Drawing.Size(75, 23);
            this.editUpFrames.TabIndex = 2;
            this.editUpFrames.Text = "Edit Frames";
            this.editUpFrames.UseVisualStyleBackColor = true;
            this.editUpFrames.Click += new System.EventHandler(this.editUpFrames_Click);
            // 
            // upCanvas
            // 
            this.upCanvas.BackColor = System.Drawing.SystemColors.ControlLight;
            this.upCanvas.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.upCanvas.Location = new System.Drawing.Point(29, 19);
            this.upCanvas.Name = "upCanvas";
            this.upCanvas.Size = new System.Drawing.Size(128, 128);
            this.upCanvas.TabIndex = 1;
            this.upCanvas.TabStop = false;
            this.upCanvas.Paint += new System.Windows.Forms.PaintEventHandler(this.upCanvas_Paint);
            // 
            // leftGroupBox
            // 
            this.leftGroupBox.Controls.Add(this.editLeftFrames);
            this.leftGroupBox.Controls.Add(this.leftCanvas);
            this.leftGroupBox.Location = new System.Drawing.Point(126, 208);
            this.leftGroupBox.Name = "leftGroupBox";
            this.leftGroupBox.Size = new System.Drawing.Size(186, 180);
            this.leftGroupBox.TabIndex = 2;
            this.leftGroupBox.TabStop = false;
            this.leftGroupBox.Text = "Left";
            // 
            // editLeftFrames
            // 
            this.editLeftFrames.Location = new System.Drawing.Point(59, 151);
            this.editLeftFrames.Name = "editLeftFrames";
            this.editLeftFrames.Size = new System.Drawing.Size(75, 23);
            this.editLeftFrames.TabIndex = 3;
            this.editLeftFrames.Text = "Edit Frames";
            this.editLeftFrames.UseVisualStyleBackColor = true;
            this.editLeftFrames.Click += new System.EventHandler(this.editLeftFrames_Click);
            // 
            // leftCanvas
            // 
            this.leftCanvas.BackColor = System.Drawing.SystemColors.ControlLight;
            this.leftCanvas.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.leftCanvas.Location = new System.Drawing.Point(32, 19);
            this.leftCanvas.Name = "leftCanvas";
            this.leftCanvas.Size = new System.Drawing.Size(128, 128);
            this.leftCanvas.TabIndex = 2;
            this.leftCanvas.TabStop = false;
            this.leftCanvas.Paint += new System.Windows.Forms.PaintEventHandler(this.leftCanvas_Paint);
            // 
            // rightGroupBox
            // 
            this.rightGroupBox.Controls.Add(this.editRightFrames);
            this.rightGroupBox.Controls.Add(this.rightCanvas);
            this.rightGroupBox.Location = new System.Drawing.Point(318, 208);
            this.rightGroupBox.Name = "rightGroupBox";
            this.rightGroupBox.Size = new System.Drawing.Size(186, 180);
            this.rightGroupBox.TabIndex = 2;
            this.rightGroupBox.TabStop = false;
            this.rightGroupBox.Text = "Right";
            // 
            // editRightFrames
            // 
            this.editRightFrames.Location = new System.Drawing.Point(55, 151);
            this.editRightFrames.Name = "editRightFrames";
            this.editRightFrames.Size = new System.Drawing.Size(75, 23);
            this.editRightFrames.TabIndex = 4;
            this.editRightFrames.Text = "Edit Frames";
            this.editRightFrames.UseVisualStyleBackColor = true;
            this.editRightFrames.Click += new System.EventHandler(this.editRightFrames_Click);
            // 
            // rightCanvas
            // 
            this.rightCanvas.BackColor = System.Drawing.SystemColors.ControlLight;
            this.rightCanvas.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.rightCanvas.Location = new System.Drawing.Point(29, 19);
            this.rightCanvas.Name = "rightCanvas";
            this.rightCanvas.Size = new System.Drawing.Size(128, 128);
            this.rightCanvas.TabIndex = 3;
            this.rightCanvas.TabStop = false;
            this.rightCanvas.Paint += new System.Windows.Forms.PaintEventHandler(this.rightCanvas_Paint);
            // 
            // useOther
            // 
            this.useOther.AutoSize = true;
            this.useOther.Location = new System.Drawing.Point(126, 7);
            this.useOther.Name = "useOther";
            this.useOther.Size = new System.Drawing.Size(72, 17);
            this.useOther.TabIndex = 3;
            this.useOther.Text = "Use other";
            this.useOther.UseVisualStyleBackColor = true;
            this.useOther.CheckedChanged += new System.EventHandler(this.useOther_CheckedChanged);
            // 
            // others
            // 
            this.others.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.others.FormattingEnabled = true;
            this.others.Location = new System.Drawing.Point(196, 5);
            this.others.Name = "others";
            this.others.Size = new System.Drawing.Size(104, 21);
            this.others.TabIndex = 4;
            this.others.SelectedIndexChanged += new System.EventHandler(this.others_SelectedIndexChanged);
            // 
            // speed
            // 
            this.speed.Location = new System.Drawing.Point(440, 7);
            this.speed.Maximum = new decimal(new int[] {
            10000,
            0,
            0,
            0});
            this.speed.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.speed.Name = "speed";
            this.speed.Size = new System.Drawing.Size(64, 20);
            this.speed.TabIndex = 11;
            this.speed.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.speed.Value = new decimal(new int[] {
            100,
            0,
            0,
            0});
            this.speed.ValueChanged += new System.EventHandler(this.speed_ValueChanged);
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(380, 10);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(60, 13);
            this.label7.TabIndex = 12;
            this.label7.Text = "Speed (ms)";
            // 
            // CharacterAnimations
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(513, 394);
            this.Controls.Add(this.speed);
            this.Controls.Add(this.label7);
            this.Controls.Add(this.others);
            this.Controls.Add(this.useOther);
            this.Controls.Add(this.rightGroupBox);
            this.Controls.Add(this.leftGroupBox);
            this.Controls.Add(this.upGroupBox);
            this.Controls.Add(this.downGroupBox);
            this.Controls.Add(this.animationList);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(529, 433);
            this.MinimumSize = new System.Drawing.Size(529, 433);
            this.Name = "CharacterAnimations";
            this.Text = "CharacterAnimations";
            this.Load += new System.EventHandler(this.CharacterAnimations_Load);
            this.downGroupBox.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.downCanvas)).EndInit();
            this.upGroupBox.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.upCanvas)).EndInit();
            this.leftGroupBox.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.leftCanvas)).EndInit();
            this.rightGroupBox.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.rightCanvas)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.speed)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ListBox animationList;
        private System.Windows.Forms.GroupBox downGroupBox;
        private System.Windows.Forms.GroupBox upGroupBox;
        private System.Windows.Forms.GroupBox leftGroupBox;
        private System.Windows.Forms.GroupBox rightGroupBox;
        private System.Windows.Forms.PictureBox downCanvas;
        private System.Windows.Forms.PictureBox upCanvas;
        private System.Windows.Forms.PictureBox leftCanvas;
        private System.Windows.Forms.PictureBox rightCanvas;
        private System.Windows.Forms.Button editDownFrames;
        private System.Windows.Forms.Button editUpFrames;
        private System.Windows.Forms.Button editLeftFrames;
        private System.Windows.Forms.Button editRightFrames;
        private System.Windows.Forms.CheckBox useOther;
        private System.Windows.Forms.ComboBox others;
        private System.Windows.Forms.NumericUpDown speed;
        private System.Windows.Forms.Label label7;
    }
}