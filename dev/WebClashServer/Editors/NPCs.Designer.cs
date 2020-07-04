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
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.removeProfile = new System.Windows.Forms.Button();
            this.addProfile = new System.Windows.Forms.Button();
            this.profileSelect = new System.Windows.Forms.ComboBox();
            this.npcProfileName = new System.Windows.Forms.Label();
            this.label16 = new System.Windows.Forms.Label();
            this.name = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.equipmentButton = new System.Windows.Forms.Button();
            this.showNameplate = new System.Windows.Forms.CheckBox();
            this.dialogueButton = new System.Windows.Forms.Button();
            this.characterName = new System.Windows.Forms.Label();
            this.typeFriendly = new System.Windows.Forms.RadioButton();
            this.typeHostile = new System.Windows.Forms.RadioButton();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.collidesWithinMap = new System.Windows.Forms.CheckBox();
            this.facing = new System.Windows.Forms.ComboBox();
            this.label15 = new System.Windows.Forms.Label();
            this.range = new System.Windows.Forms.NumericUpDown();
            this.label4 = new System.Windows.Forms.Label();
            this.movementFree = new System.Windows.Forms.RadioButton();
            this.movementStatic = new System.Windows.Forms.RadioButton();
            this.statistics = new System.Windows.Forms.GroupBox();
            this.exp = new System.Windows.Forms.NumericUpDown();
            this.label14 = new System.Windows.Forms.Label();
            this.editLootTable = new System.Windows.Forms.Button();
            this.health = new System.Windows.Forms.NumericUpDown();
            this.label7 = new System.Windows.Forms.Label();
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
            this.editActions = new System.Windows.Forms.Button();
            this.level = new System.Windows.Forms.NumericUpDown();
            this.label5 = new System.Windows.Forms.Label();
            this.aggressive = new System.Windows.Forms.CheckBox();
            this.attackRange = new System.Windows.Forms.NumericUpDown();
            this.label6 = new System.Windows.Forms.Label();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.groupBox4 = new System.Windows.Forms.GroupBox();
            this.selectCharacter = new System.Windows.Forms.Button();
            this.profileGroupBox = new System.Windows.Forms.GroupBox();
            this.npcList = new System.Windows.Forms.ListBox();
            this.deleteLink = new System.Windows.Forms.LinkLabel();
            this.saveLink = new System.Windows.Forms.LinkLabel();
            this.newLink = new System.Windows.Forms.LinkLabel();
            this.groupBox1.SuspendLayout();
            this.groupBox2.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.range)).BeginInit();
            this.statistics.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.exp)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.health)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.vitality)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.wisdom)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.intelligence)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.toughness)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.agility)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.power)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.level)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.attackRange)).BeginInit();
            this.groupBox3.SuspendLayout();
            this.groupBox4.SuspendLayout();
            this.profileGroupBox.SuspendLayout();
            this.SuspendLayout();
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.removeProfile);
            this.groupBox1.Controls.Add(this.addProfile);
            this.groupBox1.Controls.Add(this.profileSelect);
            this.groupBox1.Controls.Add(this.npcProfileName);
            this.groupBox1.Controls.Add(this.label16);
            this.groupBox1.Controls.Add(this.name);
            this.groupBox1.Controls.Add(this.label3);
            this.groupBox1.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBox1.Location = new System.Drawing.Point(300, 6);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(458, 74);
            this.groupBox1.TabIndex = 4;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "General";
            // 
            // removeProfile
            // 
            this.removeProfile.Location = new System.Drawing.Point(379, 20);
            this.removeProfile.Name = "removeProfile";
            this.removeProfile.Size = new System.Drawing.Size(68, 23);
            this.removeProfile.TabIndex = 14;
            this.removeProfile.Text = "Remove";
            this.removeProfile.UseVisualStyleBackColor = true;
            this.removeProfile.Click += new System.EventHandler(this.removeProfile_Click);
            // 
            // addProfile
            // 
            this.addProfile.Location = new System.Drawing.Point(334, 20);
            this.addProfile.Name = "addProfile";
            this.addProfile.Size = new System.Drawing.Size(39, 23);
            this.addProfile.TabIndex = 13;
            this.addProfile.Text = "Add";
            this.addProfile.UseVisualStyleBackColor = true;
            this.addProfile.Click += new System.EventHandler(this.addProfile_Click);
            // 
            // profileSelect
            // 
            this.profileSelect.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.profileSelect.FormattingEnabled = true;
            this.profileSelect.Location = new System.Drawing.Point(272, 20);
            this.profileSelect.Name = "profileSelect";
            this.profileSelect.Size = new System.Drawing.Size(52, 23);
            this.profileSelect.TabIndex = 18;
            this.profileSelect.SelectedIndexChanged += new System.EventHandler(this.profile_SelectedIndexChanged);
            // 
            // npcProfileName
            // 
            this.npcProfileName.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.npcProfileName.Location = new System.Drawing.Point(13, 46);
            this.npcProfileName.Name = "npcProfileName";
            this.npcProfileName.Size = new System.Drawing.Size(434, 21);
            this.npcProfileName.TabIndex = 17;
            this.npcProfileName.Text = "(Tiled property: Name#Profile)";
            this.npcProfileName.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // label16
            // 
            this.label16.AutoSize = true;
            this.label16.Location = new System.Drawing.Point(224, 23);
            this.label16.Name = "label16";
            this.label16.Size = new System.Drawing.Size(42, 15);
            this.label16.TabIndex = 15;
            this.label16.Text = "Profile";
            // 
            // name
            // 
            this.name.Location = new System.Drawing.Point(57, 21);
            this.name.Name = "name";
            this.name.Size = new System.Drawing.Size(137, 21);
            this.name.TabIndex = 14;
            this.name.TextChanged += new System.EventHandler(this.name_TextChanged);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(10, 23);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(41, 15);
            this.label3.TabIndex = 13;
            this.label3.Text = "Name";
            // 
            // equipmentButton
            // 
            this.equipmentButton.Location = new System.Drawing.Point(206, 19);
            this.equipmentButton.Name = "equipmentButton";
            this.equipmentButton.Size = new System.Drawing.Size(144, 23);
            this.equipmentButton.TabIndex = 17;
            this.equipmentButton.Text = "Edit Equipment";
            this.equipmentButton.UseVisualStyleBackColor = true;
            this.equipmentButton.Click += new System.EventHandler(this.equipmentButton_Click);
            // 
            // showNameplate
            // 
            this.showNameplate.AutoSize = true;
            this.showNameplate.Location = new System.Drawing.Point(215, 50);
            this.showNameplate.Name = "showNameplate";
            this.showNameplate.Size = new System.Drawing.Size(121, 19);
            this.showNameplate.TabIndex = 16;
            this.showNameplate.Text = "Show Nameplate";
            this.showNameplate.UseVisualStyleBackColor = true;
            this.showNameplate.CheckedChanged += new System.EventHandler(this.showNameplate_CheckedChanged);
            // 
            // dialogueButton
            // 
            this.dialogueButton.Location = new System.Drawing.Point(57, 57);
            this.dialogueButton.Name = "dialogueButton";
            this.dialogueButton.Size = new System.Drawing.Size(119, 23);
            this.dialogueButton.TabIndex = 15;
            this.dialogueButton.Text = "Edit Dialogue";
            this.dialogueButton.UseVisualStyleBackColor = true;
            this.dialogueButton.Click += new System.EventHandler(this.dialogButton_Click);
            // 
            // characterName
            // 
            this.characterName.Location = new System.Drawing.Point(23, 49);
            this.characterName.Name = "characterName";
            this.characterName.Size = new System.Drawing.Size(169, 19);
            this.characterName.TabIndex = 11;
            this.characterName.Text = "Character: -";
            this.characterName.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            // 
            // typeFriendly
            // 
            this.typeFriendly.AutoSize = true;
            this.typeFriendly.Checked = true;
            this.typeFriendly.Location = new System.Drawing.Point(81, 20);
            this.typeFriendly.Name = "typeFriendly";
            this.typeFriendly.Size = new System.Drawing.Size(68, 19);
            this.typeFriendly.TabIndex = 1;
            this.typeFriendly.TabStop = true;
            this.typeFriendly.Text = "Friendly";
            this.typeFriendly.UseVisualStyleBackColor = true;
            this.typeFriendly.CheckedChanged += new System.EventHandler(this.typeFriendly_CheckedChanged);
            // 
            // typeHostile
            // 
            this.typeHostile.AutoSize = true;
            this.typeHostile.Location = new System.Drawing.Point(252, 20);
            this.typeHostile.Name = "typeHostile";
            this.typeHostile.Size = new System.Drawing.Size(63, 19);
            this.typeHostile.TabIndex = 0;
            this.typeHostile.Text = "Hostile";
            this.typeHostile.UseVisualStyleBackColor = true;
            this.typeHostile.CheckedChanged += new System.EventHandler(this.typeHostile_CheckedChanged);
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.collidesWithinMap);
            this.groupBox2.Controls.Add(this.facing);
            this.groupBox2.Controls.Add(this.label15);
            this.groupBox2.Controls.Add(this.range);
            this.groupBox2.Controls.Add(this.label4);
            this.groupBox2.Controls.Add(this.movementFree);
            this.groupBox2.Controls.Add(this.movementStatic);
            this.groupBox2.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBox2.Location = new System.Drawing.Point(10, 202);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(394, 103);
            this.groupBox2.TabIndex = 8;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Movement";
            // 
            // collidesWithinMap
            // 
            this.collidesWithinMap.AutoSize = true;
            this.collidesWithinMap.Location = new System.Drawing.Point(130, 75);
            this.collidesWithinMap.Name = "collidesWithinMap";
            this.collidesWithinMap.Size = new System.Drawing.Size(135, 19);
            this.collidesWithinMap.TabIndex = 19;
            this.collidesWithinMap.Text = "Collides Within Map";
            this.collidesWithinMap.UseVisualStyleBackColor = true;
            this.collidesWithinMap.CheckedChanged += new System.EventHandler(this.collidesWithinMap_CheckedChanged);
            // 
            // facing
            // 
            this.facing.DisplayMember = "Down";
            this.facing.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.facing.Enabled = false;
            this.facing.FormattingEnabled = true;
            this.facing.Items.AddRange(new object[] {
            "Down",
            "Left",
            "Right",
            "Up"});
            this.facing.Location = new System.Drawing.Point(292, 45);
            this.facing.Name = "facing";
            this.facing.Size = new System.Drawing.Size(88, 23);
            this.facing.TabIndex = 5;
            this.facing.ValueMember = "Down";
            this.facing.SelectedIndexChanged += new System.EventHandler(this.facing_SelectedIndexChanged);
            // 
            // label15
            // 
            this.label15.AutoSize = true;
            this.label15.Location = new System.Drawing.Point(190, 49);
            this.label15.Name = "label15";
            this.label15.Size = new System.Drawing.Size(96, 15);
            this.label15.TabIndex = 4;
            this.label15.Text = "Facing Direction";
            // 
            // range
            // 
            this.range.Location = new System.Drawing.Point(114, 47);
            this.range.Name = "range";
            this.range.Size = new System.Drawing.Size(70, 21);
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
            this.label4.Location = new System.Drawing.Point(9, 49);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(103, 15);
            this.label4.TabIndex = 2;
            this.label4.Text = "Maximum Range";
            // 
            // movementFree
            // 
            this.movementFree.AutoSize = true;
            this.movementFree.Checked = true;
            this.movementFree.Location = new System.Drawing.Point(142, 18);
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
            this.movementStatic.Location = new System.Drawing.Point(199, 18);
            this.movementStatic.Name = "movementStatic";
            this.movementStatic.Size = new System.Drawing.Size(55, 19);
            this.movementStatic.TabIndex = 0;
            this.movementStatic.Text = "Static";
            this.movementStatic.UseVisualStyleBackColor = true;
            this.movementStatic.CheckedChanged += new System.EventHandler(this.movementStatic_CheckedChanged);
            // 
            // statistics
            // 
            this.statistics.Controls.Add(this.exp);
            this.statistics.Controls.Add(this.label14);
            this.statistics.Controls.Add(this.editLootTable);
            this.statistics.Controls.Add(this.health);
            this.statistics.Controls.Add(this.label7);
            this.statistics.Controls.Add(this.vitality);
            this.statistics.Controls.Add(this.label11);
            this.statistics.Controls.Add(this.wisdom);
            this.statistics.Controls.Add(this.label12);
            this.statistics.Controls.Add(this.intelligence);
            this.statistics.Controls.Add(this.label13);
            this.statistics.Controls.Add(this.toughness);
            this.statistics.Controls.Add(this.label10);
            this.statistics.Controls.Add(this.agility);
            this.statistics.Controls.Add(this.label9);
            this.statistics.Controls.Add(this.power);
            this.statistics.Controls.Add(this.label8);
            this.statistics.Controls.Add(this.editActions);
            this.statistics.Controls.Add(this.level);
            this.statistics.Controls.Add(this.label5);
            this.statistics.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.statistics.Location = new System.Drawing.Point(409, 21);
            this.statistics.Name = "statistics";
            this.statistics.Size = new System.Drawing.Size(373, 284);
            this.statistics.TabIndex = 9;
            this.statistics.TabStop = false;
            this.statistics.Text = "Hostile Statistics";
            // 
            // exp
            // 
            this.exp.Location = new System.Drawing.Point(278, 25);
            this.exp.Maximum = new decimal(new int[] {
            9999999,
            0,
            0,
            0});
            this.exp.Name = "exp";
            this.exp.Size = new System.Drawing.Size(83, 21);
            this.exp.TabIndex = 28;
            this.exp.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.exp.ValueChanged += new System.EventHandler(this.exp_ValueChanged);
            // 
            // label14
            // 
            this.label14.AutoSize = true;
            this.label14.Location = new System.Drawing.Point(241, 27);
            this.label14.Name = "label14";
            this.label14.Size = new System.Drawing.Size(31, 15);
            this.label14.TabIndex = 27;
            this.label14.Text = "Exp.";
            // 
            // editLootTable
            // 
            this.editLootTable.Location = new System.Drawing.Point(189, 252);
            this.editLootTable.Name = "editLootTable";
            this.editLootTable.Size = new System.Drawing.Size(172, 23);
            this.editLootTable.TabIndex = 26;
            this.editLootTable.Text = "Edit Loot Table";
            this.editLootTable.UseVisualStyleBackColor = true;
            this.editLootTable.Click += new System.EventHandler(this.editLootTable_Click);
            // 
            // health
            // 
            this.health.Location = new System.Drawing.Point(155, 26);
            this.health.Maximum = new decimal(new int[] {
            9999999,
            0,
            0,
            0});
            this.health.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.health.Name = "health";
            this.health.Size = new System.Drawing.Size(80, 21);
            this.health.TabIndex = 25;
            this.health.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.health.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.health.ValueChanged += new System.EventHandler(this.health_ValueChanged);
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(109, 28);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(43, 15);
            this.label7.TabIndex = 24;
            this.label7.Text = "Health";
            // 
            // vitality
            // 
            this.vitality.Location = new System.Drawing.Point(244, 163);
            this.vitality.Name = "vitality";
            this.vitality.Size = new System.Drawing.Size(61, 21);
            this.vitality.TabIndex = 23;
            this.vitality.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.vitality.ValueChanged += new System.EventHandler(this.vitality_ValueChanged);
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(190, 165);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(41, 15);
            this.label11.TabIndex = 22;
            this.label11.Text = "Vitality";
            // 
            // wisdom
            // 
            this.wisdom.Location = new System.Drawing.Point(244, 136);
            this.wisdom.Name = "wisdom";
            this.wisdom.Size = new System.Drawing.Size(61, 21);
            this.wisdom.TabIndex = 21;
            this.wisdom.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.wisdom.ValueChanged += new System.EventHandler(this.wisdom_ValueChanged);
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(190, 138);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(52, 15);
            this.label12.TabIndex = 20;
            this.label12.Text = "Wisdom";
            // 
            // intelligence
            // 
            this.intelligence.Location = new System.Drawing.Point(244, 107);
            this.intelligence.Name = "intelligence";
            this.intelligence.Size = new System.Drawing.Size(61, 21);
            this.intelligence.TabIndex = 19;
            this.intelligence.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.intelligence.ValueChanged += new System.EventHandler(this.intelligence_ValueChanged);
            // 
            // label13
            // 
            this.label13.AutoSize = true;
            this.label13.Location = new System.Drawing.Point(190, 109);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(46, 15);
            this.label13.TabIndex = 18;
            this.label13.Text = "Intellig.";
            // 
            // toughness
            // 
            this.toughness.Location = new System.Drawing.Point(103, 163);
            this.toughness.Name = "toughness";
            this.toughness.Size = new System.Drawing.Size(61, 21);
            this.toughness.TabIndex = 17;
            this.toughness.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.toughness.ValueChanged += new System.EventHandler(this.toughness_ValueChanged);
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(54, 165);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(45, 15);
            this.label10.TabIndex = 16;
            this.label10.Text = "Tough.";
            // 
            // agility
            // 
            this.agility.Location = new System.Drawing.Point(103, 136);
            this.agility.Name = "agility";
            this.agility.Size = new System.Drawing.Size(61, 21);
            this.agility.TabIndex = 15;
            this.agility.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.agility.ValueChanged += new System.EventHandler(this.agility_ValueChanged);
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(54, 138);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(38, 15);
            this.label9.TabIndex = 14;
            this.label9.Text = "Agility";
            // 
            // power
            // 
            this.power.Location = new System.Drawing.Point(103, 107);
            this.power.Name = "power";
            this.power.Size = new System.Drawing.Size(61, 21);
            this.power.TabIndex = 13;
            this.power.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.power.ValueChanged += new System.EventHandler(this.power_ValueChanged);
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(54, 109);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(42, 15);
            this.label8.TabIndex = 12;
            this.label8.Text = "Power";
            // 
            // editActions
            // 
            this.editActions.Location = new System.Drawing.Point(11, 252);
            this.editActions.Name = "editActions";
            this.editActions.Size = new System.Drawing.Size(172, 23);
            this.editActions.TabIndex = 2;
            this.editActions.Text = "Edit Actions";
            this.editActions.UseVisualStyleBackColor = true;
            this.editActions.Click += new System.EventHandler(this.editActions_Click);
            // 
            // level
            // 
            this.level.Location = new System.Drawing.Point(50, 26);
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
            this.level.Size = new System.Drawing.Size(53, 21);
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
            this.label5.Location = new System.Drawing.Point(8, 28);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(36, 15);
            this.label5.TabIndex = 0;
            this.label5.Text = "Level";
            // 
            // aggressive
            // 
            this.aggressive.AutoSize = true;
            this.aggressive.Location = new System.Drawing.Point(241, 49);
            this.aggressive.Name = "aggressive";
            this.aggressive.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.aggressive.Size = new System.Drawing.Size(85, 19);
            this.aggressive.TabIndex = 18;
            this.aggressive.Text = "Aggressive";
            this.aggressive.UseVisualStyleBackColor = true;
            this.aggressive.CheckedChanged += new System.EventHandler(this.aggressive_CheckedChanged);
            // 
            // attackRange
            // 
            this.attackRange.Location = new System.Drawing.Point(297, 74);
            this.attackRange.Maximum = new decimal(new int[] {
            9999999,
            0,
            0,
            0});
            this.attackRange.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.attackRange.Name = "attackRange";
            this.attackRange.Size = new System.Drawing.Size(53, 21);
            this.attackRange.TabIndex = 29;
            this.attackRange.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.attackRange.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.attackRange.ValueChanged += new System.EventHandler(this.attackRange_ValueChanged);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(212, 76);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(79, 15);
            this.label6.TabIndex = 30;
            this.label6.Text = "Attack Range";
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.label6);
            this.groupBox3.Controls.Add(this.typeHostile);
            this.groupBox3.Controls.Add(this.dialogueButton);
            this.groupBox3.Controls.Add(this.attackRange);
            this.groupBox3.Controls.Add(this.typeFriendly);
            this.groupBox3.Controls.Add(this.aggressive);
            this.groupBox3.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBox3.Location = new System.Drawing.Point(10, 100);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(394, 103);
            this.groupBox3.TabIndex = 10;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "Behaviour";
            // 
            // groupBox4
            // 
            this.groupBox4.Controls.Add(this.selectCharacter);
            this.groupBox4.Controls.Add(this.showNameplate);
            this.groupBox4.Controls.Add(this.equipmentButton);
            this.groupBox4.Controls.Add(this.characterName);
            this.groupBox4.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBox4.Location = new System.Drawing.Point(10, 21);
            this.groupBox4.Name = "groupBox4";
            this.groupBox4.Size = new System.Drawing.Size(394, 80);
            this.groupBox4.TabIndex = 11;
            this.groupBox4.TabStop = false;
            this.groupBox4.Text = "Appearance";
            // 
            // selectCharacter
            // 
            this.selectCharacter.Location = new System.Drawing.Point(40, 19);
            this.selectCharacter.Name = "selectCharacter";
            this.selectCharacter.Size = new System.Drawing.Size(144, 23);
            this.selectCharacter.TabIndex = 18;
            this.selectCharacter.Text = "Select Character";
            this.selectCharacter.UseVisualStyleBackColor = true;
            this.selectCharacter.Click += new System.EventHandler(this.selectCharacter_Click);
            // 
            // profileGroupBox
            // 
            this.profileGroupBox.Controls.Add(this.groupBox4);
            this.profileGroupBox.Controls.Add(this.groupBox2);
            this.profileGroupBox.Controls.Add(this.groupBox3);
            this.profileGroupBox.Controls.Add(this.statistics);
            this.profileGroupBox.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.profileGroupBox.Location = new System.Drawing.Point(130, 84);
            this.profileGroupBox.Name = "profileGroupBox";
            this.profileGroupBox.Size = new System.Drawing.Size(792, 320);
            this.profileGroupBox.TabIndex = 12;
            this.profileGroupBox.TabStop = false;
            this.profileGroupBox.Text = "NPC Profile";
            // 
            // npcList
            // 
            this.npcList.FormattingEnabled = true;
            this.npcList.Location = new System.Drawing.Point(4, 5);
            this.npcList.Name = "npcList";
            this.npcList.Size = new System.Drawing.Size(120, 381);
            this.npcList.TabIndex = 13;
            this.npcList.SelectedIndexChanged += new System.EventHandler(this.npcList_SelectedIndexChanged);
            // 
            // deleteLink
            // 
            this.deleteLink.ActiveLinkColor = System.Drawing.Color.Red;
            this.deleteLink.AutoSize = true;
            this.deleteLink.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.deleteLink.LinkColor = System.Drawing.Color.Red;
            this.deleteLink.Location = new System.Drawing.Point(101, 392);
            this.deleteLink.Name = "deleteLink";
            this.deleteLink.Size = new System.Drawing.Size(23, 13);
            this.deleteLink.TabIndex = 16;
            this.deleteLink.TabStop = true;
            this.deleteLink.Text = "Del";
            this.deleteLink.VisitedLinkColor = System.Drawing.Color.Red;
            this.deleteLink.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.deleteLink_LinkClicked);
            // 
            // saveLink
            // 
            this.saveLink.ActiveLinkColor = System.Drawing.Color.Blue;
            this.saveLink.AutoSize = true;
            this.saveLink.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.saveLink.Location = new System.Drawing.Point(51, 392);
            this.saveLink.Name = "saveLink";
            this.saveLink.Size = new System.Drawing.Size(32, 13);
            this.saveLink.TabIndex = 15;
            this.saveLink.TabStop = true;
            this.saveLink.Text = "Save";
            this.saveLink.VisitedLinkColor = System.Drawing.Color.Blue;
            this.saveLink.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.saveLink_LinkClicked);
            // 
            // newLink
            // 
            this.newLink.ActiveLinkColor = System.Drawing.Color.Blue;
            this.newLink.AutoSize = true;
            this.newLink.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.newLink.Location = new System.Drawing.Point(8, 392);
            this.newLink.Name = "newLink";
            this.newLink.Size = new System.Drawing.Size(29, 13);
            this.newLink.TabIndex = 14;
            this.newLink.TabStop = true;
            this.newLink.Text = "New";
            this.newLink.VisitedLinkColor = System.Drawing.Color.Blue;
            this.newLink.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.newLink_LinkClicked);
            // 
            // NPCs
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(929, 411);
            this.Controls.Add(this.deleteLink);
            this.Controls.Add(this.saveLink);
            this.Controls.Add(this.newLink);
            this.Controls.Add(this.npcList);
            this.Controls.Add(this.profileGroupBox);
            this.Controls.Add(this.groupBox1);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(945, 450);
            this.MinimumSize = new System.Drawing.Size(945, 450);
            this.Name = "NPCs";
            this.Text = "WebClash - NPCs";
            this.Load += new System.EventHandler(this.NPCs_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.range)).EndInit();
            this.statistics.ResumeLayout(false);
            this.statistics.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.exp)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.health)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.vitality)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.wisdom)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.intelligence)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.toughness)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.agility)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.power)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.level)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.attackRange)).EndInit();
            this.groupBox3.ResumeLayout(false);
            this.groupBox3.PerformLayout();
            this.groupBox4.ResumeLayout(false);
            this.groupBox4.PerformLayout();
            this.profileGroupBox.ResumeLayout(false);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.Label characterName;
        private System.Windows.Forms.TextBox name;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Button dialogueButton;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.NumericUpDown range;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.RadioButton movementFree;
        private System.Windows.Forms.RadioButton movementStatic;
        private System.Windows.Forms.GroupBox statistics;
        private System.Windows.Forms.RadioButton typeFriendly;
        private System.Windows.Forms.RadioButton typeHostile;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.NumericUpDown level;
        private System.Windows.Forms.Button editActions;
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
        private System.Windows.Forms.NumericUpDown power;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.NumericUpDown health;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Button editLootTable;
        private System.Windows.Forms.NumericUpDown exp;
        private System.Windows.Forms.Label label14;
        private System.Windows.Forms.CheckBox showNameplate;
        private System.Windows.Forms.ComboBox facing;
        private System.Windows.Forms.Label label15;
        private System.Windows.Forms.Button equipmentButton;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.NumericUpDown attackRange;
        private System.Windows.Forms.CheckBox aggressive;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.CheckBox collidesWithinMap;
        private System.Windows.Forms.Label npcProfileName;
        private System.Windows.Forms.Label label16;
        private System.Windows.Forms.GroupBox groupBox4;
        private System.Windows.Forms.GroupBox profileGroupBox;
        private System.Windows.Forms.Button removeProfile;
        private System.Windows.Forms.Button addProfile;
        private System.Windows.Forms.ComboBox profileSelect;
        private System.Windows.Forms.Button selectCharacter;
        private System.Windows.Forms.ListBox npcList;
        private System.Windows.Forms.LinkLabel deleteLink;
        private System.Windows.Forms.LinkLabel saveLink;
        private System.Windows.Forms.LinkLabel newLink;
    }
}