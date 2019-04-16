namespace WebClashServer.Editors
{
    partial class ShopSelection
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(ShopSelection));
            this.itemList = new System.Windows.Forms.ListBox();
            this.delete = new System.Windows.Forms.LinkLabel();
            this.newLink = new System.Windows.Forms.LinkLabel();
            this.label1 = new System.Windows.Forms.Label();
            this.itemSelect = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.itemPrice = new System.Windows.Forms.NumericUpDown();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.label3 = new System.Windows.Forms.Label();
            this.shopName = new System.Windows.Forms.TextBox();
            ((System.ComponentModel.ISupportInitialize)(this.itemPrice)).BeginInit();
            this.groupBox1.SuspendLayout();
            this.SuspendLayout();
            // 
            // itemList
            // 
            this.itemList.FormattingEnabled = true;
            this.itemList.Location = new System.Drawing.Point(7, 20);
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
            this.delete.Location = new System.Drawing.Point(83, 157);
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
            this.newLink.Location = new System.Drawing.Point(11, 157);
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
            this.label1.Location = new System.Drawing.Point(120, 20);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(27, 13);
            this.label1.TabIndex = 9;
            this.label1.Text = "Item";
            // 
            // itemSelect
            // 
            this.itemSelect.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.itemSelect.FormattingEnabled = true;
            this.itemSelect.Location = new System.Drawing.Point(175, 17);
            this.itemSelect.Name = "itemSelect";
            this.itemSelect.Size = new System.Drawing.Size(112, 21);
            this.itemSelect.TabIndex = 10;
            this.itemSelect.SelectedIndexChanged += new System.EventHandler(this.itemSelect_SelectedIndexChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(120, 62);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(31, 13);
            this.label2.TabIndex = 11;
            this.label2.Text = "Price";
            // 
            // itemPrice
            // 
            this.itemPrice.Location = new System.Drawing.Point(175, 60);
            this.itemPrice.Maximum = new decimal(new int[] {
            -1530494977,
            232830,
            0,
            0});
            this.itemPrice.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.itemPrice.Name = "itemPrice";
            this.itemPrice.Size = new System.Drawing.Size(112, 20);
            this.itemPrice.TabIndex = 12;
            this.itemPrice.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.itemPrice.ValueChanged += new System.EventHandler(this.price_ValueChanged);
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.itemSelect);
            this.groupBox1.Controls.Add(this.delete);
            this.groupBox1.Controls.Add(this.itemPrice);
            this.groupBox1.Controls.Add(this.newLink);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Controls.Add(this.itemList);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Location = new System.Drawing.Point(2, 38);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(296, 177);
            this.groupBox1.TabIndex = 13;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Shop Content";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(11, 15);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(63, 13);
            this.label3.TabIndex = 14;
            this.label3.Text = "Shop Name";
            // 
            // shopName
            // 
            this.shopName.Location = new System.Drawing.Point(137, 12);
            this.shopName.Name = "shopName";
            this.shopName.Size = new System.Drawing.Size(152, 20);
            this.shopName.TabIndex = 15;
            this.shopName.TextChanged += new System.EventHandler(this.ShopName_TextChanged);
            // 
            // ShopSelection
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(301, 216);
            this.Controls.Add(this.shopName);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.groupBox1);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(317, 255);
            this.MinimumSize = new System.Drawing.Size(317, 255);
            this.Name = "ShopSelection";
            this.Text = "ShopSelection";
            this.Load += new System.EventHandler(this.ItemSelection_Load);
            ((System.ComponentModel.ISupportInitialize)(this.itemPrice)).EndInit();
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
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
        private System.Windows.Forms.NumericUpDown itemPrice;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox shopName;
    }
}