namespace WebClashServer.Editors
{
    partial class MapDialogues
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MapDialogues));
            this.dialogueList = new System.Windows.Forms.ListBox();
            this.delete = new System.Windows.Forms.LinkLabel();
            this.newLink = new System.Windows.Forms.LinkLabel();
            this.label1 = new System.Windows.Forms.Label();
            this.dialogueName = new System.Windows.Forms.TextBox();
            this.editDialogue = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // dialogueList
            // 
            this.dialogueList.FormattingEnabled = true;
            this.dialogueList.Location = new System.Drawing.Point(2, 2);
            this.dialogueList.Name = "dialogueList";
            this.dialogueList.Size = new System.Drawing.Size(109, 134);
            this.dialogueList.TabIndex = 0;
            this.dialogueList.SelectedIndexChanged += new System.EventHandler(this.dialogueList_SelectedIndexChanged);
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
            this.label1.Location = new System.Drawing.Point(117, 24);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(80, 13);
            this.label1.TabIndex = 9;
            this.label1.Text = "Dialogue Name";
            // 
            // dialogueName
            // 
            this.dialogueName.Location = new System.Drawing.Point(120, 40);
            this.dialogueName.Name = "dialogueName";
            this.dialogueName.Size = new System.Drawing.Size(169, 20);
            this.dialogueName.TabIndex = 10;
            this.dialogueName.TextChanged += new System.EventHandler(this.dialogueName_TextChanged);
            // 
            // editDialogue
            // 
            this.editDialogue.Location = new System.Drawing.Point(120, 85);
            this.editDialogue.Name = "editDialogue";
            this.editDialogue.Size = new System.Drawing.Size(169, 23);
            this.editDialogue.TabIndex = 11;
            this.editDialogue.Text = "Edit Dialogue";
            this.editDialogue.UseVisualStyleBackColor = true;
            this.editDialogue.Click += new System.EventHandler(this.editDialogue_Click);
            // 
            // MapDialogues
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(301, 158);
            this.Controls.Add(this.editDialogue);
            this.Controls.Add(this.dialogueName);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.delete);
            this.Controls.Add(this.newLink);
            this.Controls.Add(this.dialogueList);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(317, 197);
            this.MinimumSize = new System.Drawing.Size(317, 197);
            this.Name = "MapDialogues";
            this.Text = "MapDialogues";
            this.Load += new System.EventHandler(this.MapDialogues_Load);
            this.ResumeLayout(false);
            this.PerformLayout();
        }

        #endregion

        private System.Windows.Forms.ListBox dialogueList;
        private System.Windows.Forms.LinkLabel delete;
        private System.Windows.Forms.LinkLabel newLink;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox dialogueName;
        private System.Windows.Forms.Button editDialogue;
    }
}