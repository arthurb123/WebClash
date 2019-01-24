namespace WebClashServer.Editors
{
    partial class ActionSelection
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(ActionSelection));
            this.actionList = new System.Windows.Forms.ListBox();
            this.delete = new System.Windows.Forms.LinkLabel();
            this.newLink = new System.Windows.Forms.LinkLabel();
            this.label1 = new System.Windows.Forms.Label();
            this.actionSelect = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.range = new System.Windows.Forms.NumericUpDown();
            ((System.ComponentModel.ISupportInitialize)(this.range)).BeginInit();
            this.SuspendLayout();
            // 
            // actionList
            // 
            this.actionList.FormattingEnabled = true;
            this.actionList.Location = new System.Drawing.Point(0, 0);
            this.actionList.Name = "actionList";
            this.actionList.Size = new System.Drawing.Size(109, 134);
            this.actionList.TabIndex = 0;
            this.actionList.SelectedIndexChanged += new System.EventHandler(this.actionList_SelectedIndexChanged);
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
            this.label1.Size = new System.Drawing.Size(37, 13);
            this.label1.TabIndex = 9;
            this.label1.Text = "Action";
            // 
            // actionSelect
            // 
            this.actionSelect.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.actionSelect.FormattingEnabled = true;
            this.actionSelect.Location = new System.Drawing.Point(177, 12);
            this.actionSelect.Name = "actionSelect";
            this.actionSelect.Size = new System.Drawing.Size(104, 21);
            this.actionSelect.TabIndex = 10;
            this.actionSelect.SelectedIndexChanged += new System.EventHandler(this.actionSelect_SelectedIndexChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(120, 43);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(39, 13);
            this.label2.TabIndex = 11;
            this.label2.Text = "Range";
            // 
            // range
            // 
            this.range.Location = new System.Drawing.Point(177, 39);
            this.range.Name = "range";
            this.range.Size = new System.Drawing.Size(104, 20);
            this.range.TabIndex = 12;
            this.range.ValueChanged += new System.EventHandler(this.range_ValueChanged);
            // 
            // ActionSelection
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(293, 158);
            this.Controls.Add(this.range);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.actionSelect);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.delete);
            this.Controls.Add(this.newLink);
            this.Controls.Add(this.actionList);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.Name = "ActionSelection";
            this.Text = "ActionSelection";
            this.Load += new System.EventHandler(this.ActionSelection_Load);
            ((System.ComponentModel.ISupportInitialize)(this.range)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ListBox actionList;
        private System.Windows.Forms.LinkLabel delete;
        private System.Windows.Forms.LinkLabel newLink;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ComboBox actionSelect;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.NumericUpDown range;
    }
}