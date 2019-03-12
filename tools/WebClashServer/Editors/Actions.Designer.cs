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
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Actions));
            this.label1 = new System.Windows.Forms.Label();
            this.actionSelect = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.charSelect = new System.Windows.Forms.ComboBox();
            this.canvas = new System.Windows.Forms.PictureBox();
            this.properties = new System.Windows.Forms.GroupBox();
            this.behaviourPanel = new System.Windows.Forms.Panel();
            this.projectilePanel = new System.Windows.Forms.Panel();
            this.projectileDistance = new System.Windows.Forms.NumericUpDown();
            this.projectileSpeed = new System.Windows.Forms.NumericUpDown();
            this.label20 = new System.Windows.Forms.Label();
            this.label19 = new System.Windows.Forms.Label();
            this.propertyType = new System.Windows.Forms.ComboBox();
            this.label18 = new System.Windows.Forms.Label();
            this.appearancePanel = new System.Windows.Forms.Panel();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.label6 = new System.Windows.Forms.Label();
            this.height = new System.Windows.Forms.NumericUpDown();
            this.source = new System.Windows.Forms.TextBox();
            this.width = new System.Windows.Forms.NumericUpDown();
            this.label3 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.animation = new System.Windows.Forms.GroupBox();
            this.direction = new System.Windows.Forms.ComboBox();
            this.label5 = new System.Windows.Forms.Label();
            this.speed = new System.Windows.Forms.NumericUpDown();
            this.label4 = new System.Windows.Forms.Label();
            this.propertyView = new System.Windows.Forms.ComboBox();
            this.button2 = new System.Windows.Forms.Button();
            this.button1 = new System.Windows.Forms.Button();
            this.button3 = new System.Windows.Forms.Button();
            this.button4 = new System.Windows.Forms.Button();
            this.save = new System.Windows.Forms.LinkLabel();
            this.animationTimer = new System.Windows.Forms.Timer(this.components);
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.vitality = new System.Windows.Forms.NumericUpDown();
            this.label11 = new System.Windows.Forms.Label();
            this.wisdom = new System.Windows.Forms.NumericUpDown();
            this.label12 = new System.Windows.Forms.Label();
            this.intelligence = new System.Windows.Forms.NumericUpDown();
            this.label13 = new System.Windows.Forms.Label();
            this.toughness = new System.Windows.Forms.NumericUpDown();
            this.label10 = new System.Windows.Forms.Label();
            this.agility = new System.Windows.Forms.NumericUpDown();
            this.label9 = new System.Windows.Forms.Label();
            this.power = new System.Windows.Forms.NumericUpDown();
            this.label8 = new System.Windows.Forms.Label();
            this.heal = new System.Windows.Forms.NumericUpDown();
            this.label14 = new System.Windows.Forms.Label();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.editSounds = new System.Windows.Forms.Button();
            this.description = new System.Windows.Forms.RichTextBox();
            this.label16 = new System.Windows.Forms.Label();
            this.iconImage = new System.Windows.Forms.PictureBox();
            this.icon = new System.Windows.Forms.TextBox();
            this.label15 = new System.Windows.Forms.Label();
            this.cooldown = new System.Windows.Forms.NumericUpDown();
            this.label17 = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.canvas)).BeginInit();
            this.properties.SuspendLayout();
            this.behaviourPanel.SuspendLayout();
            this.projectilePanel.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.projectileDistance)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.projectileSpeed)).BeginInit();
            this.appearancePanel.SuspendLayout();
            this.groupBox3.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.height)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.width)).BeginInit();
            this.animation.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.speed)).BeginInit();
            this.groupBox1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.vitality)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.wisdom)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.intelligence)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.toughness)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.agility)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.power)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.heal)).BeginInit();
            this.groupBox2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.iconImage)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.cooldown)).BeginInit();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(13, 15);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(74, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "Current Action";
            // 
            // actionSelect
            // 
            this.actionSelect.FormattingEnabled = true;
            this.actionSelect.Location = new System.Drawing.Point(131, 12);
            this.actionSelect.Name = "actionSelect";
            this.actionSelect.Size = new System.Drawing.Size(135, 21);
            this.actionSelect.TabIndex = 1;
            this.actionSelect.SelectedIndexChanged += new System.EventHandler(this.actionSelect_SelectedIndexChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(419, 21);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(77, 13);
            this.label2.TabIndex = 2;
            this.label2.Text = "Test Character";
            // 
            // charSelect
            // 
            this.charSelect.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.charSelect.FormattingEnabled = true;
            this.charSelect.Location = new System.Drawing.Point(597, 15);
            this.charSelect.Name = "charSelect";
            this.charSelect.Size = new System.Drawing.Size(135, 21);
            this.charSelect.TabIndex = 3;
            this.charSelect.SelectedIndexChanged += new System.EventHandler(this.charSelect_SelectedIndexChanged);
            // 
            // canvas
            // 
            this.canvas.Location = new System.Drawing.Point(412, 48);
            this.canvas.Name = "canvas";
            this.canvas.Size = new System.Drawing.Size(320, 320);
            this.canvas.TabIndex = 4;
            this.canvas.TabStop = false;
            // 
            // properties
            // 
            this.properties.Controls.Add(this.behaviourPanel);
            this.properties.Controls.Add(this.appearancePanel);
            this.properties.Controls.Add(this.propertyView);
            this.properties.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.properties.Location = new System.Drawing.Point(145, 184);
            this.properties.Name = "properties";
            this.properties.Size = new System.Drawing.Size(254, 187);
            this.properties.TabIndex = 5;
            this.properties.TabStop = false;
            this.properties.Text = "Properties";
            this.properties.Visible = false;
            // 
            // behaviourPanel
            // 
            this.behaviourPanel.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.behaviourPanel.Controls.Add(this.projectilePanel);
            this.behaviourPanel.Controls.Add(this.propertyType);
            this.behaviourPanel.Controls.Add(this.label18);
            this.behaviourPanel.Location = new System.Drawing.Point(9, 38);
            this.behaviourPanel.Margin = new System.Windows.Forms.Padding(0);
            this.behaviourPanel.Name = "behaviourPanel";
            this.behaviourPanel.Size = new System.Drawing.Size(239, 142);
            this.behaviourPanel.TabIndex = 18;
            this.behaviourPanel.Visible = false;
            // 
            // projectilePanel
            // 
            this.projectilePanel.Controls.Add(this.projectileDistance);
            this.projectilePanel.Controls.Add(this.projectileSpeed);
            this.projectilePanel.Controls.Add(this.label20);
            this.projectilePanel.Controls.Add(this.label19);
            this.projectilePanel.Location = new System.Drawing.Point(9, 47);
            this.projectilePanel.Name = "projectilePanel";
            this.projectilePanel.Size = new System.Drawing.Size(221, 89);
            this.projectilePanel.TabIndex = 17;
            this.projectilePanel.Visible = false;
            // 
            // projectileDistance
            // 
            this.projectileDistance.Location = new System.Drawing.Point(112, 44);
            this.projectileDistance.Name = "projectileDistance";
            this.projectileDistance.Size = new System.Drawing.Size(81, 21);
            this.projectileDistance.TabIndex = 5;
            this.projectileDistance.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.projectileDistance.ValueChanged += new System.EventHandler(this.projectileDistance_ValueChanged);
            // 
            // projectileSpeed
            // 
            this.projectileSpeed.Location = new System.Drawing.Point(113, 11);
            this.projectileSpeed.Maximum = new decimal(new int[] {
            50,
            0,
            0,
            0});
            this.projectileSpeed.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.projectileSpeed.Name = "projectileSpeed";
            this.projectileSpeed.Size = new System.Drawing.Size(81, 21);
            this.projectileSpeed.TabIndex = 4;
            this.projectileSpeed.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.projectileSpeed.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.projectileSpeed.ValueChanged += new System.EventHandler(this.projectileSpeed_ValueChanged);
            // 
            // label20
            // 
            this.label20.AutoSize = true;
            this.label20.Location = new System.Drawing.Point(14, 46);
            this.label20.Name = "label20";
            this.label20.Size = new System.Drawing.Size(85, 30);
            this.label20.TabIndex = 3;
            this.label20.Text = "Max Distance \r\n(Tiles)";
            // 
            // label19
            // 
            this.label19.AutoSize = true;
            this.label19.Location = new System.Drawing.Point(14, 11);
            this.label19.Name = "label19";
            this.label19.Size = new System.Drawing.Size(43, 30);
            this.label19.TabIndex = 2;
            this.label19.Text = "Speed\r\n(1-50)";
            // 
            // propertyType
            // 
            this.propertyType.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.propertyType.FormattingEnabled = true;
            this.propertyType.Items.AddRange(new object[] {
            "Static",
            "Projectile"});
            this.propertyType.Location = new System.Drawing.Point(82, 17);
            this.propertyType.Name = "propertyType";
            this.propertyType.Size = new System.Drawing.Size(121, 23);
            this.propertyType.TabIndex = 1;
            this.propertyType.SelectedIndexChanged += new System.EventHandler(this.propertyType_SelectedIndexChanged);
            // 
            // label18
            // 
            this.label18.AutoSize = true;
            this.label18.Location = new System.Drawing.Point(33, 21);
            this.label18.Name = "label18";
            this.label18.Size = new System.Drawing.Size(33, 15);
            this.label18.TabIndex = 0;
            this.label18.Text = "Type";
            // 
            // appearancePanel
            // 
            this.appearancePanel.AutoSize = true;
            this.appearancePanel.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.appearancePanel.Controls.Add(this.groupBox3);
            this.appearancePanel.Controls.Add(this.animation);
            this.appearancePanel.Location = new System.Drawing.Point(9, 41);
            this.appearancePanel.Margin = new System.Windows.Forms.Padding(0);
            this.appearancePanel.Name = "appearancePanel";
            this.appearancePanel.Size = new System.Drawing.Size(239, 142);
            this.appearancePanel.TabIndex = 17;
            this.appearancePanel.Visible = false;
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.label6);
            this.groupBox3.Controls.Add(this.height);
            this.groupBox3.Controls.Add(this.source);
            this.groupBox3.Controls.Add(this.width);
            this.groupBox3.Controls.Add(this.label3);
            this.groupBox3.Controls.Add(this.label7);
            this.groupBox3.Location = new System.Drawing.Point(0, 0);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(236, 69);
            this.groupBox3.TabIndex = 9;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "Image";
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(6, 44);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(38, 15);
            this.label6.TabIndex = 5;
            this.label6.Text = "Width";
            // 
            // height
            // 
            this.height.Location = new System.Drawing.Point(164, 42);
            this.height.Maximum = new decimal(new int[] {
            320,
            0,
            0,
            0});
            this.height.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.height.Name = "height";
            this.height.Size = new System.Drawing.Size(66, 21);
            this.height.TabIndex = 8;
            this.height.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.height.Value = new decimal(new int[] {
            64,
            0,
            0,
            0});
            this.height.ValueChanged += new System.EventHandler(this.height_ValueChanged);
            // 
            // source
            // 
            this.source.Location = new System.Drawing.Point(65, 15);
            this.source.Name = "source";
            this.source.Size = new System.Drawing.Size(165, 21);
            this.source.TabIndex = 1;
            this.source.TextChanged += new System.EventHandler(this.source_TextChanged);
            // 
            // width
            // 
            this.width.Location = new System.Drawing.Point(45, 42);
            this.width.Maximum = new decimal(new int[] {
            320,
            0,
            0,
            0});
            this.width.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.width.Name = "width";
            this.width.Size = new System.Drawing.Size(66, 21);
            this.width.TabIndex = 6;
            this.width.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.width.Value = new decimal(new int[] {
            64,
            0,
            0,
            0});
            this.width.ValueChanged += new System.EventHandler(this.width_ValueChanged);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(6, 18);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(46, 15);
            this.label3.TabIndex = 0;
            this.label3.Text = "Source";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(118, 44);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(43, 15);
            this.label7.TabIndex = 7;
            this.label7.Text = "Height";
            // 
            // animation
            // 
            this.animation.Controls.Add(this.direction);
            this.animation.Controls.Add(this.label5);
            this.animation.Controls.Add(this.speed);
            this.animation.Controls.Add(this.label4);
            this.animation.Location = new System.Drawing.Point(0, 68);
            this.animation.Name = "animation";
            this.animation.Size = new System.Drawing.Size(236, 71);
            this.animation.TabIndex = 4;
            this.animation.TabStop = false;
            this.animation.Text = "Animation";
            // 
            // direction
            // 
            this.direction.DisplayMember = "0";
            this.direction.FormattingEnabled = true;
            this.direction.Items.AddRange(new object[] {
            "Horizontal",
            "Vertical"});
            this.direction.Location = new System.Drawing.Point(106, 42);
            this.direction.Name = "direction";
            this.direction.Size = new System.Drawing.Size(119, 23);
            this.direction.TabIndex = 6;
            this.direction.SelectedIndexChanged += new System.EventHandler(this.direction_SelectedIndexChanged);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(6, 45);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(56, 15);
            this.label5.TabIndex = 5;
            this.label5.Text = "Direction";
            // 
            // speed
            // 
            this.speed.Location = new System.Drawing.Point(106, 15);
            this.speed.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.speed.Name = "speed";
            this.speed.Size = new System.Drawing.Size(63, 21);
            this.speed.TabIndex = 4;
            this.speed.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.speed.Value = new decimal(new int[] {
            8,
            0,
            0,
            0});
            this.speed.ValueChanged += new System.EventHandler(this.speed_ValueChanged);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(6, 17);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(43, 15);
            this.label4.TabIndex = 3;
            this.label4.Text = "Speed";
            // 
            // propertyView
            // 
            this.propertyView.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.propertyView.FormattingEnabled = true;
            this.propertyView.Items.AddRange(new object[] {
            "Appearance",
            "Behaviour"});
            this.propertyView.Location = new System.Drawing.Point(74, 15);
            this.propertyView.Name = "propertyView";
            this.propertyView.Size = new System.Drawing.Size(121, 23);
            this.propertyView.TabIndex = 10;
            this.propertyView.SelectedIndexChanged += new System.EventHandler(this.propertyView_SelectedIndexChanged);
            // 
            // button2
            // 
            this.button2.Location = new System.Drawing.Point(299, 373);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(100, 23);
            this.button2.TabIndex = 7;
            this.button2.Text = "Remove Element";
            this.button2.UseVisualStyleBackColor = true;
            this.button2.Click += new System.EventHandler(this.button2_Click);
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(145, 373);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(75, 23);
            this.button1.TabIndex = 6;
            this.button1.Text = "Add Element";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // button3
            // 
            this.button3.Location = new System.Drawing.Point(299, 37);
            this.button3.Name = "button3";
            this.button3.Size = new System.Drawing.Size(100, 23);
            this.button3.TabIndex = 9;
            this.button3.Text = "Remove Action";
            this.button3.UseVisualStyleBackColor = true;
            this.button3.Click += new System.EventHandler(this.button3_Click);
            // 
            // button4
            // 
            this.button4.Location = new System.Drawing.Point(12, 37);
            this.button4.Name = "button4";
            this.button4.Size = new System.Drawing.Size(75, 23);
            this.button4.TabIndex = 8;
            this.button4.Text = "Add Action";
            this.button4.UseVisualStyleBackColor = true;
            this.button4.Click += new System.EventHandler(this.button4_Click);
            // 
            // save
            // 
            this.save.ActiveLinkColor = System.Drawing.Color.Blue;
            this.save.AutoSize = true;
            this.save.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.save.LinkColor = System.Drawing.Color.Blue;
            this.save.Location = new System.Drawing.Point(700, 381);
            this.save.Name = "save";
            this.save.Size = new System.Drawing.Size(32, 13);
            this.save.TabIndex = 11;
            this.save.TabStop = true;
            this.save.Text = "Save";
            this.save.VisitedLinkColor = System.Drawing.Color.Blue;
            this.save.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.save_LinkClicked);
            // 
            // animationTimer
            // 
            this.animationTimer.Enabled = true;
            this.animationTimer.Interval = 16;
            this.animationTimer.Tick += new System.EventHandler(this.animationTimer_Tick);
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.vitality);
            this.groupBox1.Controls.Add(this.label11);
            this.groupBox1.Controls.Add(this.wisdom);
            this.groupBox1.Controls.Add(this.label12);
            this.groupBox1.Controls.Add(this.intelligence);
            this.groupBox1.Controls.Add(this.label13);
            this.groupBox1.Controls.Add(this.toughness);
            this.groupBox1.Controls.Add(this.label10);
            this.groupBox1.Controls.Add(this.agility);
            this.groupBox1.Controls.Add(this.label9);
            this.groupBox1.Controls.Add(this.power);
            this.groupBox1.Controls.Add(this.label8);
            this.groupBox1.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBox1.Location = new System.Drawing.Point(145, 64);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(254, 96);
            this.groupBox1.TabIndex = 12;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Scaling";
            // 
            // vitality
            // 
            this.vitality.DecimalPlaces = 3;
            this.vitality.Increment = new decimal(new int[] {
            1,
            0,
            0,
            65536});
            this.vitality.Location = new System.Drawing.Point(181, 69);
            this.vitality.Name = "vitality";
            this.vitality.Size = new System.Drawing.Size(61, 21);
            this.vitality.TabIndex = 11;
            this.vitality.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.vitality.ValueChanged += new System.EventHandler(this.vitality_ValueChanged);
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(127, 71);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(41, 15);
            this.label11.TabIndex = 10;
            this.label11.Text = "Vitality";
            // 
            // wisdom
            // 
            this.wisdom.DecimalPlaces = 3;
            this.wisdom.Increment = new decimal(new int[] {
            1,
            0,
            0,
            65536});
            this.wisdom.Location = new System.Drawing.Point(181, 45);
            this.wisdom.Name = "wisdom";
            this.wisdom.Size = new System.Drawing.Size(61, 21);
            this.wisdom.TabIndex = 9;
            this.wisdom.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.wisdom.ValueChanged += new System.EventHandler(this.wisdom_ValueChanged);
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(127, 47);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(52, 15);
            this.label12.TabIndex = 8;
            this.label12.Text = "Wisdom";
            // 
            // intelligence
            // 
            this.intelligence.DecimalPlaces = 3;
            this.intelligence.Increment = new decimal(new int[] {
            1,
            0,
            0,
            65536});
            this.intelligence.Location = new System.Drawing.Point(181, 20);
            this.intelligence.Name = "intelligence";
            this.intelligence.Size = new System.Drawing.Size(61, 21);
            this.intelligence.TabIndex = 7;
            this.intelligence.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.intelligence.ValueChanged += new System.EventHandler(this.intelligence_ValueChanged);
            // 
            // label13
            // 
            this.label13.AutoSize = true;
            this.label13.Location = new System.Drawing.Point(127, 22);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(46, 15);
            this.label13.TabIndex = 6;
            this.label13.Text = "Intellig.";
            // 
            // toughness
            // 
            this.toughness.DecimalPlaces = 3;
            this.toughness.Increment = new decimal(new int[] {
            1,
            0,
            0,
            65536});
            this.toughness.Location = new System.Drawing.Point(59, 69);
            this.toughness.Name = "toughness";
            this.toughness.Size = new System.Drawing.Size(61, 21);
            this.toughness.TabIndex = 5;
            this.toughness.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.toughness.ValueChanged += new System.EventHandler(this.toughness_ValueChanged);
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(10, 71);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(45, 15);
            this.label10.TabIndex = 4;
            this.label10.Text = "Tough.";
            // 
            // agility
            // 
            this.agility.DecimalPlaces = 3;
            this.agility.Increment = new decimal(new int[] {
            1,
            0,
            0,
            65536});
            this.agility.Location = new System.Drawing.Point(59, 45);
            this.agility.Name = "agility";
            this.agility.Size = new System.Drawing.Size(61, 21);
            this.agility.TabIndex = 3;
            this.agility.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.agility.ValueChanged += new System.EventHandler(this.agility_ValueChanged);
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(10, 47);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(38, 15);
            this.label9.TabIndex = 2;
            this.label9.Text = "Agility";
            // 
            // power
            // 
            this.power.DecimalPlaces = 3;
            this.power.Increment = new decimal(new int[] {
            1,
            0,
            0,
            65536});
            this.power.Location = new System.Drawing.Point(59, 20);
            this.power.Name = "power";
            this.power.Size = new System.Drawing.Size(61, 21);
            this.power.TabIndex = 1;
            this.power.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.power.ValueChanged += new System.EventHandler(this.power_ValueChanged);
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(10, 22);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(42, 15);
            this.label8.TabIndex = 0;
            this.label8.Text = "Power";
            // 
            // heal
            // 
            this.heal.Location = new System.Drawing.Point(329, 164);
            this.heal.Maximum = new decimal(new int[] {
            99999999,
            0,
            0,
            0});
            this.heal.Name = "heal";
            this.heal.Size = new System.Drawing.Size(61, 20);
            this.heal.TabIndex = 13;
            this.heal.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.heal.ValueChanged += new System.EventHandler(this.heal_ValueChanged);
            // 
            // label14
            // 
            this.label14.AutoSize = true;
            this.label14.Location = new System.Drawing.Point(295, 168);
            this.label14.Name = "label14";
            this.label14.Size = new System.Drawing.Size(29, 13);
            this.label14.TabIndex = 12;
            this.label14.Text = "Heal";
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.editSounds);
            this.groupBox2.Controls.Add(this.description);
            this.groupBox2.Controls.Add(this.label16);
            this.groupBox2.Controls.Add(this.iconImage);
            this.groupBox2.Controls.Add(this.icon);
            this.groupBox2.Controls.Add(this.label15);
            this.groupBox2.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBox2.Location = new System.Drawing.Point(12, 64);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(127, 307);
            this.groupBox2.TabIndex = 14;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "General Info";
            // 
            // editSounds
            // 
            this.editSounds.Location = new System.Drawing.Point(6, 275);
            this.editSounds.Name = "editSounds";
            this.editSounds.Size = new System.Drawing.Size(115, 23);
            this.editSounds.TabIndex = 5;
            this.editSounds.Text = "Edit Sound(s)";
            this.editSounds.UseVisualStyleBackColor = true;
            this.editSounds.Click += new System.EventHandler(this.editSounds_Click);
            // 
            // description
            // 
            this.description.Location = new System.Drawing.Point(6, 157);
            this.description.Name = "description";
            this.description.Size = new System.Drawing.Size(115, 111);
            this.description.TabIndex = 4;
            this.description.Text = "";
            this.description.TextChanged += new System.EventHandler(this.richTextBox1_TextChanged);
            // 
            // label16
            // 
            this.label16.AutoSize = true;
            this.label16.Location = new System.Drawing.Point(28, 138);
            this.label16.Name = "label16";
            this.label16.Size = new System.Drawing.Size(69, 15);
            this.label16.TabIndex = 3;
            this.label16.Text = "Description";
            // 
            // iconImage
            // 
            this.iconImage.BackColor = System.Drawing.SystemColors.ControlLight;
            this.iconImage.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.iconImage.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.iconImage.Location = new System.Drawing.Point(30, 68);
            this.iconImage.Name = "iconImage";
            this.iconImage.Size = new System.Drawing.Size(64, 64);
            this.iconImage.TabIndex = 2;
            this.iconImage.TabStop = false;
            // 
            // icon
            // 
            this.icon.Location = new System.Drawing.Point(6, 39);
            this.icon.Name = "icon";
            this.icon.Size = new System.Drawing.Size(115, 21);
            this.icon.TabIndex = 1;
            this.icon.TextChanged += new System.EventHandler(this.icon_TextChanged);
            // 
            // label15
            // 
            this.label15.AutoSize = true;
            this.label15.Location = new System.Drawing.Point(45, 20);
            this.label15.Name = "label15";
            this.label15.Size = new System.Drawing.Size(30, 15);
            this.label15.TabIndex = 0;
            this.label15.Text = "Icon";
            // 
            // cooldown
            // 
            this.cooldown.Location = new System.Drawing.Point(227, 165);
            this.cooldown.Maximum = new decimal(new int[] {
            99999999,
            0,
            0,
            0});
            this.cooldown.Name = "cooldown";
            this.cooldown.Size = new System.Drawing.Size(61, 20);
            this.cooldown.TabIndex = 16;
            this.cooldown.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.cooldown.ValueChanged += new System.EventHandler(this.cooldown_ValueChanged);
            // 
            // label17
            // 
            this.label17.AutoSize = true;
            this.label17.Location = new System.Drawing.Point(151, 168);
            this.label17.Name = "label17";
            this.label17.Size = new System.Drawing.Size(76, 13);
            this.label17.TabIndex = 15;
            this.label17.Text = "Cooldown (ms)";
            // 
            // Actions
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(744, 403);
            this.Controls.Add(this.cooldown);
            this.Controls.Add(this.label17);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.heal);
            this.Controls.Add(this.label14);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.save);
            this.Controls.Add(this.button2);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.button3);
            this.Controls.Add(this.button4);
            this.Controls.Add(this.properties);
            this.Controls.Add(this.canvas);
            this.Controls.Add(this.charSelect);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.actionSelect);
            this.Controls.Add(this.label1);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(760, 442);
            this.MinimumSize = new System.Drawing.Size(760, 442);
            this.Name = "Actions";
            this.Text = "WebClash Server - Actions";
            this.Load += new System.EventHandler(this.Actions_Load);
            ((System.ComponentModel.ISupportInitialize)(this.canvas)).EndInit();
            this.properties.ResumeLayout(false);
            this.properties.PerformLayout();
            this.behaviourPanel.ResumeLayout(false);
            this.behaviourPanel.PerformLayout();
            this.projectilePanel.ResumeLayout(false);
            this.projectilePanel.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.projectileDistance)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.projectileSpeed)).EndInit();
            this.appearancePanel.ResumeLayout(false);
            this.groupBox3.ResumeLayout(false);
            this.groupBox3.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.height)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.width)).EndInit();
            this.animation.ResumeLayout(false);
            this.animation.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.speed)).EndInit();
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.vitality)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.wisdom)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.intelligence)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.toughness)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.agility)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.power)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.heal)).EndInit();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.iconImage)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.cooldown)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ComboBox actionSelect;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.ComboBox charSelect;
        private System.Windows.Forms.PictureBox canvas;
        private System.Windows.Forms.GroupBox properties;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.Button button2;
        private System.Windows.Forms.Button button3;
        private System.Windows.Forms.Button button4;
        private System.Windows.Forms.LinkLabel save;
        private System.Windows.Forms.TextBox source;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.GroupBox animation;
        private System.Windows.Forms.NumericUpDown speed;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.ComboBox direction;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.NumericUpDown width;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.NumericUpDown height;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Timer animationTimer;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.NumericUpDown power;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.NumericUpDown vitality;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.NumericUpDown wisdom;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.NumericUpDown intelligence;
        private System.Windows.Forms.Label label13;
        private System.Windows.Forms.NumericUpDown toughness;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.NumericUpDown agility;
        private System.Windows.Forms.Label label9;
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
        private System.Windows.Forms.ComboBox propertyView;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.Panel appearancePanel;
        private System.Windows.Forms.Panel behaviourPanel;
        private System.Windows.Forms.ComboBox propertyType;
        private System.Windows.Forms.Label label18;
        private System.Windows.Forms.Panel projectilePanel;
        private System.Windows.Forms.Label label20;
        private System.Windows.Forms.Label label19;
        private System.Windows.Forms.NumericUpDown projectileDistance;
        private System.Windows.Forms.NumericUpDown projectileSpeed;
        private System.Windows.Forms.Button editSounds;
    }
}