namespace WebClashServer.Editors
{
    partial class NpcEquipment
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(NpcEquipment));
            this.canvas = new System.Windows.Forms.PictureBox();
            this.equipmentSource = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.delete = new System.Windows.Forms.LinkLabel();
            this.newLink = new System.Windows.Forms.LinkLabel();
            this.equipmentList = new System.Windows.Forms.ListBox();
            this.moveUp = new System.Windows.Forms.Button();
            this.moveDown = new System.Windows.Forms.Button();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.isOffHand = new System.Windows.Forms.RadioButton();
            this.isMainHand = new System.Windows.Forms.RadioButton();
            this.isGeneric = new System.Windows.Forms.RadioButton();
            ((System.ComponentModel.ISupportInitialize)(this.canvas)).BeginInit();
            this.groupBox1.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.SuspendLayout();
            // 
            // canvas
            // 
            this.canvas.BackColor = System.Drawing.SystemColors.ControlLight;
            this.canvas.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.canvas.Location = new System.Drawing.Point(53, 21);
            this.canvas.Name = "canvas";
            this.canvas.Size = new System.Drawing.Size(200, 200);
            this.canvas.TabIndex = 6;
            this.canvas.TabStop = false;
            // 
            // equipmentSource
            // 
            this.equipmentSource.Location = new System.Drawing.Point(126, 42);
            this.equipmentSource.Name = "equipmentSource";
            this.equipmentSource.Size = new System.Drawing.Size(168, 20);
            this.equipmentSource.TabIndex = 15;
            this.equipmentSource.TextChanged += new System.EventHandler(this.equipmentSource_TextChanged);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(123, 26);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(94, 13);
            this.label1.TabIndex = 14;
            this.label1.Text = "Equipment Source";
            // 
            // delete
            // 
            this.delete.ActiveLinkColor = System.Drawing.Color.Red;
            this.delete.AutoSize = true;
            this.delete.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.delete.LinkColor = System.Drawing.Color.Red;
            this.delete.Location = new System.Drawing.Point(97, 170);
            this.delete.Name = "delete";
            this.delete.Size = new System.Drawing.Size(23, 13);
            this.delete.TabIndex = 13;
            this.delete.TabStop = true;
            this.delete.Text = "Del";
            this.delete.VisitedLinkColor = System.Drawing.Color.Red;
            this.delete.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.delete_LinkClicked);
            // 
            // newLink
            // 
            this.newLink.ActiveLinkColor = System.Drawing.Color.Blue;
            this.newLink.AutoSize = true;
            this.newLink.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.newLink.Location = new System.Drawing.Point(8, 170);
            this.newLink.Name = "newLink";
            this.newLink.Size = new System.Drawing.Size(29, 13);
            this.newLink.TabIndex = 12;
            this.newLink.TabStop = true;
            this.newLink.Text = "New";
            this.newLink.VisitedLinkColor = System.Drawing.Color.Blue;
            this.newLink.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.newLink_LinkClicked);
            // 
            // equipmentList
            // 
            this.equipmentList.FormattingEnabled = true;
            this.equipmentList.Location = new System.Drawing.Point(11, 18);
            this.equipmentList.Name = "equipmentList";
            this.equipmentList.Size = new System.Drawing.Size(109, 147);
            this.equipmentList.TabIndex = 11;
            this.equipmentList.SelectedIndexChanged += new System.EventHandler(this.equipmentList_SelectedIndexChanged);
            // 
            // moveUp
            // 
            this.moveUp.Location = new System.Drawing.Point(131, 142);
            this.moveUp.Name = "moveUp";
            this.moveUp.Size = new System.Drawing.Size(75, 23);
            this.moveUp.TabIndex = 16;
            this.moveUp.Text = "Move Up";
            this.moveUp.UseVisualStyleBackColor = true;
            this.moveUp.Click += new System.EventHandler(this.moveUp_Click);
            // 
            // moveDown
            // 
            this.moveDown.Location = new System.Drawing.Point(212, 142);
            this.moveDown.Name = "moveDown";
            this.moveDown.Size = new System.Drawing.Size(75, 23);
            this.moveDown.TabIndex = 17;
            this.moveDown.Text = "Move Down";
            this.moveDown.UseVisualStyleBackColor = true;
            this.moveDown.Click += new System.EventHandler(this.moveDown_Click);
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.canvas);
            this.groupBox1.Location = new System.Drawing.Point(12, 208);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(300, 234);
            this.groupBox1.TabIndex = 18;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Preview";
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.isOffHand);
            this.groupBox2.Controls.Add(this.isMainHand);
            this.groupBox2.Controls.Add(this.isGeneric);
            this.groupBox2.Controls.Add(this.equipmentList);
            this.groupBox2.Controls.Add(this.newLink);
            this.groupBox2.Controls.Add(this.moveDown);
            this.groupBox2.Controls.Add(this.delete);
            this.groupBox2.Controls.Add(this.moveUp);
            this.groupBox2.Controls.Add(this.label1);
            this.groupBox2.Controls.Add(this.equipmentSource);
            this.groupBox2.Location = new System.Drawing.Point(12, 8);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(300, 192);
            this.groupBox2.TabIndex = 19;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Equipment Setup";
            // 
            // isOffHand
            // 
            this.isOffHand.AutoSize = true;
            this.isOffHand.Location = new System.Drawing.Point(170, 109);
            this.isOffHand.Name = "isOffHand";
            this.isOffHand.Size = new System.Drawing.Size(68, 17);
            this.isOffHand.TabIndex = 20;
            this.isOffHand.TabStop = true;
            this.isOffHand.Text = "Off Hand";
            this.isOffHand.UseVisualStyleBackColor = true;
            this.isOffHand.CheckedChanged += new System.EventHandler(this.isOffHand_CheckedChanged);
            // 
            // isMainHand
            // 
            this.isMainHand.AutoSize = true;
            this.isMainHand.Location = new System.Drawing.Point(170, 88);
            this.isMainHand.Name = "isMainHand";
            this.isMainHand.Size = new System.Drawing.Size(77, 17);
            this.isMainHand.TabIndex = 19;
            this.isMainHand.TabStop = true;
            this.isMainHand.Text = "Main Hand";
            this.isMainHand.UseVisualStyleBackColor = true;
            this.isMainHand.CheckedChanged += new System.EventHandler(this.isMainHand_CheckedChanged);
            // 
            // isGeneric
            // 
            this.isGeneric.AutoSize = true;
            this.isGeneric.Location = new System.Drawing.Point(170, 68);
            this.isGeneric.Name = "isGeneric";
            this.isGeneric.Size = new System.Drawing.Size(62, 17);
            this.isGeneric.TabIndex = 18;
            this.isGeneric.TabStop = true;
            this.isGeneric.Text = "Generic";
            this.isGeneric.UseVisualStyleBackColor = true;
            this.isGeneric.CheckedChanged += new System.EventHandler(this.isGeneric_CheckedChanged);
            // 
            // NPCEquipment
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(324, 456);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.groupBox1);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(340, 495);
            this.MinimumSize = new System.Drawing.Size(340, 495);
            this.Name = "NpcEquipment";
            this.Text = "WebClash - NPC Equipment";
            this.Load += new System.EventHandler(this.NPCGear_Load);
            ((System.ComponentModel.ISupportInitialize)(this.canvas)).EndInit();
            this.groupBox1.ResumeLayout(false);
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.PictureBox canvas;
        private System.Windows.Forms.TextBox equipmentSource;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.LinkLabel delete;
        private System.Windows.Forms.LinkLabel newLink;
        private System.Windows.Forms.ListBox equipmentList;
        private System.Windows.Forms.Button moveUp;
        private System.Windows.Forms.Button moveDown;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.RadioButton isGeneric;
        private System.Windows.Forms.RadioButton isOffHand;
        private System.Windows.Forms.RadioButton isMainHand;
    }
}