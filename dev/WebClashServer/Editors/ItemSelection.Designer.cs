namespace WebClashServer.Editors
{
    partial class ItemSelection
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(ItemSelection));
            this.itemList = new System.Windows.Forms.ListBox();
            this.delete = new System.Windows.Forms.LinkLabel();
            this.newLink = new System.Windows.Forms.LinkLabel();
            this.label1 = new System.Windows.Forms.Label();
            this.itemSelect = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.dropChance = new System.Windows.Forms.NumericUpDown();
            this.label3 = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.dropChance)).BeginInit();
            this.SuspendLayout();
            // 
            // itemList
            // 
            this.itemList.FormattingEnabled = true;
            this.itemList.Location = new System.Drawing.Point(2, 2);
            this.itemList.Name = "itemList";
            this.itemList.Size = new System.Drawing.Size(109, 134);
            this.itemList.TabIndex = 0;
            this.itemList.SelectedIndexChanged += new System.EventHandler(this.itemList_SelectedIndexChanged);
            // 
            // delete
            // 
            this.delete.ActiveLinkColor = System.Drawing.Color.Red;
            this.delete.AutoSize = true;
            this.delete.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.delete.LinkColor = System.Drawing.Color.Red;
            this.delete.Location = new System.Drawing.Point(78, 139);
            this.delete.Name = "delete";
            this.delete.Size = new System.Drawing.Size(23, 13);
            this.delete.TabIndex = 8;
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
            this.newLink.Location = new System.Drawing.Point(6, 139);
            this.newLink.Name = "newLink";
            this.newLink.Size = new System.Drawing.Size(29, 13);
            this.newLink.TabIndex = 7;
            this.newLink.TabStop = true;
            this.newLink.Text = "New";
            this.newLink.VisitedLinkColor = System.Drawing.Color.Blue;
            this.newLink.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.newLink_LinkClicked);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(122, 15);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(27, 13);
            this.label1.TabIndex = 9;
            this.label1.Text = "Item";
            // 
            // itemSelect
            // 
            this.itemSelect.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.itemSelect.FormattingEnabled = true;
            this.itemSelect.Location = new System.Drawing.Point(177, 12);
            this.itemSelect.Name = "itemSelect";
            this.itemSelect.Size = new System.Drawing.Size(112, 21);
            this.itemSelect.TabIndex = 10;
            this.itemSelect.SelectedIndexChanged += new System.EventHandler(this.itemSelect_SelectedIndexChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(120, 43);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(37, 26);
            this.label2.TabIndex = 11;
            this.label2.Text = "Drop\r\nFactor";
            // 
            // dropChance
            // 
            this.dropChance.Location = new System.Drawing.Point(177, 46);
            this.dropChance.Maximum = new decimal(new int[] {
            -1530494977,
            232830,
            0,
            0});
            this.dropChance.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.dropChance.Name = "dropChance";
            this.dropChance.Size = new System.Drawing.Size(112, 20);
            this.dropChance.TabIndex = 12;
            this.dropChance.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.dropChance.ValueChanged += new System.EventHandler(this.dropChance_ValueChanged);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.Location = new System.Drawing.Point(118, 78);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(175, 26);
            this.label3.TabIndex = 13;
            this.label3.Text = "Drop chance = 1/x - where x is the \r\nspecified drop factor (higher is rarer)";
            // 
            // ItemSelection
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(301, 158);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.dropChance);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.itemSelect);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.delete);
            this.Controls.Add(this.newLink);
            this.Controls.Add(this.itemList);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(317, 197);
            this.MinimumSize = new System.Drawing.Size(317, 197);
            this.Name = "ItemSelection";
            this.Text = "ItemSelection";
            this.Load += new System.EventHandler(this.ItemSelection_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dropChance)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ListBox itemList;
        private System.Windows.Forms.LinkLabel delete;
        private System.Windows.Forms.LinkLabel newLink;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ComboBox itemSelect;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.NumericUpDown dropChance;
        private System.Windows.Forms.Label label3;
    }
}