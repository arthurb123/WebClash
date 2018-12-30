namespace WebClashServer.Editors
{
    partial class Characters
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
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Characters));
            this.label1 = new System.Windows.Forms.Label();
            this.charSelect = new System.Windows.Forms.ComboBox();
            this.add = new System.Windows.Forms.Button();
            this.delete = new System.Windows.Forms.Button();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.label5 = new System.Windows.Forms.Label();
            this.height = new System.Windows.Forms.NumericUpDown();
            this.width = new System.Windows.Forms.NumericUpDown();
            this.src = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.name = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.speed = new System.Windows.Forms.NumericUpDown();
            this.label7 = new System.Windows.Forms.Label();
            this.direction = new System.Windows.Forms.ComboBox();
            this.label6 = new System.Windows.Forms.Label();
            this.canvas = new System.Windows.Forms.PictureBox();
            this.animation = new System.Windows.Forms.Timer(this.components);
            this.save = new System.Windows.Forms.LinkLabel();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.label11 = new System.Windows.Forms.Label();
            this.label10 = new System.Windows.Forms.Label();
            this.label9 = new System.Windows.Forms.Label();
            this.label8 = new System.Windows.Forms.Label();
            this.collY = new System.Windows.Forms.NumericUpDown();
            this.collX = new System.Windows.Forms.NumericUpDown();
            this.collHeight = new System.Windows.Forms.NumericUpDown();
            this.collWidth = new System.Windows.Forms.NumericUpDown();
            this.groupBox4 = new System.Windows.Forms.GroupBox();
            this.maxVelocity = new System.Windows.Forms.NumericUpDown();
            this.label12 = new System.Windows.Forms.Label();
            this.label15 = new System.Windows.Forms.Label();
            this.acceleration = new System.Windows.Forms.NumericUpDown();
            this.label13 = new System.Windows.Forms.Label();
            this.groupBox1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.height)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.width)).BeginInit();
            this.groupBox2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.speed)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.canvas)).BeginInit();
            this.groupBox3.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.collY)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.collX)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.collHeight)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.collWidth)).BeginInit();
            this.groupBox4.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.maxVelocity)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.acceleration)).BeginInit();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(24, 15);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(103, 15);
            this.label1.TabIndex = 0;
            this.label1.Text = "Current Character";
            // 
            // charSelect
            // 
            this.charSelect.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.charSelect.FormattingEnabled = true;
            this.charSelect.Location = new System.Drawing.Point(131, 13);
            this.charSelect.Name = "charSelect";
            this.charSelect.Size = new System.Drawing.Size(121, 21);
            this.charSelect.TabIndex = 1;
            this.charSelect.SelectedIndexChanged += new System.EventHandler(this.charSelect_SelectedIndexChanged);
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
            this.groupBox1.Controls.Add(this.label5);
            this.groupBox1.Controls.Add(this.height);
            this.groupBox1.Controls.Add(this.width);
            this.groupBox1.Controls.Add(this.src);
            this.groupBox1.Controls.Add(this.label4);
            this.groupBox1.Controls.Add(this.name);
            this.groupBox1.Controls.Add(this.label3);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBox1.Location = new System.Drawing.Point(15, 43);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(373, 78);
            this.groupBox1.TabIndex = 4;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Character";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(120, 49);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(13, 15);
            this.label5.TabIndex = 7;
            this.label5.Text = "x";
            // 
            // height
            // 
            this.height.Location = new System.Drawing.Point(139, 47);
            this.height.Maximum = new decimal(new int[] {
            640,
            0,
            0,
            0});
            this.height.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.height.Name = "height";
            this.height.Size = new System.Drawing.Size(64, 21);
            this.height.TabIndex = 6;
            this.height.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.height.Value = new decimal(new int[] {
            64,
            0,
            0,
            0});
            this.height.ValueChanged += new System.EventHandler(this.height_ValueChanged);
            // 
            // width
            // 
            this.width.Location = new System.Drawing.Point(50, 47);
            this.width.Maximum = new decimal(new int[] {
            640,
            0,
            0,
            0});
            this.width.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.width.Name = "width";
            this.width.Size = new System.Drawing.Size(64, 21);
            this.width.TabIndex = 5;
            this.width.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.width.Value = new decimal(new int[] {
            64,
            0,
            0,
            0});
            this.width.ValueChanged += new System.EventHandler(this.width_ValueChanged);
            // 
            // src
            // 
            this.src.Location = new System.Drawing.Point(195, 20);
            this.src.Name = "src";
            this.src.Size = new System.Drawing.Size(164, 21);
            this.src.TabIndex = 4;
            this.src.TextChanged += new System.EventHandler(this.src_TextChanged);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(166, 22);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(25, 15);
            this.label4.TabIndex = 3;
            this.label4.Text = "Src";
            // 
            // name
            // 
            this.name.Location = new System.Drawing.Point(50, 20);
            this.name.Name = "name";
            this.name.Size = new System.Drawing.Size(110, 21);
            this.name.TabIndex = 2;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(6, 49);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(31, 15);
            this.label3.TabIndex = 1;
            this.label3.Text = "Size";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(5, 22);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(41, 15);
            this.label2.TabIndex = 0;
            this.label2.Text = "Name";
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.speed);
            this.groupBox2.Controls.Add(this.label7);
            this.groupBox2.Controls.Add(this.direction);
            this.groupBox2.Controls.Add(this.label6);
            this.groupBox2.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBox2.Location = new System.Drawing.Point(15, 127);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(373, 63);
            this.groupBox2.TabIndex = 5;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Animation";
            // 
            // speed
            // 
            this.speed.Location = new System.Drawing.Point(265, 26);
            this.speed.Maximum = new decimal(new int[] {
            640,
            0,
            0,
            0});
            this.speed.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.speed.Name = "speed";
            this.speed.Size = new System.Drawing.Size(64, 21);
            this.speed.TabIndex = 8;
            this.speed.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.speed.Value = new decimal(new int[] {
            8,
            0,
            0,
            0});
            this.speed.ValueChanged += new System.EventHandler(this.speed_ValueChanged);
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(216, 28);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(43, 15);
            this.label7.TabIndex = 10;
            this.label7.Text = "Speed";
            // 
            // direction
            // 
            this.direction.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.direction.FormattingEnabled = true;
            this.direction.Items.AddRange(new object[] {
            "Horizontal",
            "Vertical"});
            this.direction.Location = new System.Drawing.Point(90, 25);
            this.direction.Name = "direction";
            this.direction.Size = new System.Drawing.Size(110, 23);
            this.direction.TabIndex = 9;
            this.direction.SelectedIndexChanged += new System.EventHandler(this.direction_SelectedIndexChanged);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(28, 28);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(56, 15);
            this.label6.TabIndex = 8;
            this.label6.Text = "Direction";
            // 
            // canvas
            // 
            this.canvas.BackColor = System.Drawing.SystemColors.ControlLight;
            this.canvas.Location = new System.Drawing.Point(105, 341);
            this.canvas.Name = "canvas";
            this.canvas.Size = new System.Drawing.Size(200, 200);
            this.canvas.TabIndex = 6;
            this.canvas.TabStop = false;
            // 
            // animation
            // 
            this.animation.Enabled = true;
            this.animation.Interval = 1000;
            this.animation.Tick += new System.EventHandler(this.animation_Tick);
            // 
            // save
            // 
            this.save.ActiveLinkColor = System.Drawing.Color.Blue;
            this.save.AutoSize = true;
            this.save.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.save.LinkColor = System.Drawing.Color.Blue;
            this.save.Location = new System.Drawing.Point(360, 528);
            this.save.Name = "save";
            this.save.Size = new System.Drawing.Size(32, 13);
            this.save.TabIndex = 7;
            this.save.TabStop = true;
            this.save.Text = "Save";
            this.save.VisitedLinkColor = System.Drawing.Color.Blue;
            this.save.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.save_LinkClicked);
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.label13);
            this.groupBox3.Controls.Add(this.label11);
            this.groupBox3.Controls.Add(this.label10);
            this.groupBox3.Controls.Add(this.label9);
            this.groupBox3.Controls.Add(this.label8);
            this.groupBox3.Controls.Add(this.collY);
            this.groupBox3.Controls.Add(this.collX);
            this.groupBox3.Controls.Add(this.collHeight);
            this.groupBox3.Controls.Add(this.collWidth);
            this.groupBox3.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBox3.Location = new System.Drawing.Point(15, 196);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(373, 70);
            this.groupBox3.TabIndex = 11;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "Collider";
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(276, 28);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(16, 15);
            this.label11.TabIndex = 17;
            this.label11.Text = "H";
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(183, 28);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(18, 15);
            this.label10.TabIndex = 16;
            this.label10.Text = "W";
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(95, 28);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(14, 15);
            this.label9.TabIndex = 15;
            this.label9.Text = "Y";
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(9, 28);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(15, 15);
            this.label8.TabIndex = 8;
            this.label8.Text = "X";
            // 
            // collY
            // 
            this.collY.Location = new System.Drawing.Point(113, 26);
            this.collY.Maximum = new decimal(new int[] {
            640,
            0,
            0,
            0});
            this.collY.Minimum = new decimal(new int[] {
            640,
            0,
            0,
            -2147483648});
            this.collY.Name = "collY";
            this.collY.Size = new System.Drawing.Size(64, 21);
            this.collY.TabIndex = 14;
            this.collY.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.collY.ValueChanged += new System.EventHandler(this.collY_ValueChanged);
            // 
            // collX
            // 
            this.collX.Location = new System.Drawing.Point(27, 26);
            this.collX.Maximum = new decimal(new int[] {
            640,
            0,
            0,
            0});
            this.collX.Minimum = new decimal(new int[] {
            640,
            0,
            0,
            -2147483648});
            this.collX.Name = "collX";
            this.collX.Size = new System.Drawing.Size(64, 21);
            this.collX.TabIndex = 13;
            this.collX.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.collX.ValueChanged += new System.EventHandler(this.collX_ValueChanged);
            // 
            // collHeight
            // 
            this.collHeight.Location = new System.Drawing.Point(295, 26);
            this.collHeight.Maximum = new decimal(new int[] {
            640,
            0,
            0,
            0});
            this.collHeight.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.collHeight.Name = "collHeight";
            this.collHeight.Size = new System.Drawing.Size(64, 21);
            this.collHeight.TabIndex = 10;
            this.collHeight.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.collHeight.Value = new decimal(new int[] {
            64,
            0,
            0,
            0});
            this.collHeight.ValueChanged += new System.EventHandler(this.collHeight_ValueChanged);
            // 
            // collWidth
            // 
            this.collWidth.Location = new System.Drawing.Point(206, 26);
            this.collWidth.Maximum = new decimal(new int[] {
            640,
            0,
            0,
            0});
            this.collWidth.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.collWidth.Name = "collWidth";
            this.collWidth.Size = new System.Drawing.Size(64, 21);
            this.collWidth.TabIndex = 9;
            this.collWidth.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.collWidth.Value = new decimal(new int[] {
            64,
            0,
            0,
            0});
            this.collWidth.ValueChanged += new System.EventHandler(this.collWidth_ValueChanged);
            // 
            // groupBox4
            // 
            this.groupBox4.Controls.Add(this.maxVelocity);
            this.groupBox4.Controls.Add(this.label12);
            this.groupBox4.Controls.Add(this.label15);
            this.groupBox4.Controls.Add(this.acceleration);
            this.groupBox4.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBox4.Location = new System.Drawing.Point(15, 272);
            this.groupBox4.Name = "groupBox4";
            this.groupBox4.Size = new System.Drawing.Size(373, 63);
            this.groupBox4.TabIndex = 18;
            this.groupBox4.TabStop = false;
            this.groupBox4.Text = "Movement";
            // 
            // maxVelocity
            // 
            this.maxVelocity.DecimalPlaces = 2;
            this.maxVelocity.Increment = new decimal(new int[] {
            1,
            0,
            0,
            65536});
            this.maxVelocity.Location = new System.Drawing.Point(265, 25);
            this.maxVelocity.Maximum = new decimal(new int[] {
            640,
            0,
            0,
            0});
            this.maxVelocity.Name = "maxVelocity";
            this.maxVelocity.Size = new System.Drawing.Size(76, 21);
            this.maxVelocity.TabIndex = 15;
            this.maxVelocity.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.maxVelocity.ValueChanged += new System.EventHandler(this.maxVelocity_ValueChanged);
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(184, 27);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(75, 15);
            this.label12.TabIndex = 14;
            this.label12.Text = "Max Velocity";
            // 
            // label15
            // 
            this.label15.AutoSize = true;
            this.label15.Location = new System.Drawing.Point(24, 27);
            this.label15.Name = "label15";
            this.label15.Size = new System.Drawing.Size(74, 15);
            this.label15.TabIndex = 8;
            this.label15.Text = "Acceleration";
            // 
            // acceleration
            // 
            this.acceleration.DecimalPlaces = 2;
            this.acceleration.Increment = new decimal(new int[] {
            1,
            0,
            0,
            65536});
            this.acceleration.Location = new System.Drawing.Point(99, 25);
            this.acceleration.Maximum = new decimal(new int[] {
            640,
            0,
            0,
            0});
            this.acceleration.Name = "acceleration";
            this.acceleration.Size = new System.Drawing.Size(76, 21);
            this.acceleration.TabIndex = 13;
            this.acceleration.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.acceleration.ValueChanged += new System.EventHandler(this.acceleration_ValueChanged);
            // 
            // label13
            // 
            this.label13.AutoSize = true;
            this.label13.Font = new System.Drawing.Font("Microsoft Sans Serif", 6.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label13.Location = new System.Drawing.Point(248, 52);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(111, 12);
            this.label13.TabIndex = 18;
            this.label13.Text = "* NPCs don\'t use colliders";
            // 
            // Characters
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(404, 551);
            this.Controls.Add(this.groupBox4);
            this.Controls.Add(this.groupBox3);
            this.Controls.Add(this.save);
            this.Controls.Add(this.canvas);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.delete);
            this.Controls.Add(this.add);
            this.Controls.Add(this.charSelect);
            this.Controls.Add(this.label1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(420, 590);
            this.MinimumSize = new System.Drawing.Size(420, 590);
            this.Name = "Characters";
            this.Text = "WebClash Server - Characters";
            this.Load += new System.EventHandler(this.Characters_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.height)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.width)).EndInit();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.speed)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.canvas)).EndInit();
            this.groupBox3.ResumeLayout(false);
            this.groupBox3.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.collY)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.collX)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.collHeight)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.collWidth)).EndInit();
            this.groupBox4.ResumeLayout(false);
            this.groupBox4.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.maxVelocity)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.acceleration)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ComboBox charSelect;
        private System.Windows.Forms.Button add;
        private System.Windows.Forms.Button delete;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.NumericUpDown width;
        private System.Windows.Forms.TextBox src;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox name;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.PictureBox canvas;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.NumericUpDown height;
        private System.Windows.Forms.ComboBox direction;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.NumericUpDown speed;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Timer animation;
        private System.Windows.Forms.LinkLabel save;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.NumericUpDown collY;
        private System.Windows.Forms.NumericUpDown collX;
        private System.Windows.Forms.NumericUpDown collHeight;
        private System.Windows.Forms.NumericUpDown collWidth;
        private System.Windows.Forms.GroupBox groupBox4;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.Label label15;
        private System.Windows.Forms.NumericUpDown acceleration;
        private System.Windows.Forms.NumericUpDown maxVelocity;
        private System.Windows.Forms.Label label13;
    }
}