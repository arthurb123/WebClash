namespace WebClashServer.Editors
{
    partial class SoundSelection
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(SoundSelection));
            this.soundList = new System.Windows.Forms.ListBox();
            this.delete = new System.Windows.Forms.LinkLabel();
            this.newLink = new System.Windows.Forms.LinkLabel();
            this.label1 = new System.Windows.Forms.Label();
            this.soundSource = new System.Windows.Forms.TextBox();
            this.button1 = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // soundList
            // 
            this.soundList.FormattingEnabled = true;
            this.soundList.Location = new System.Drawing.Point(2, 2);
            this.soundList.Name = "soundList";
            this.soundList.Size = new System.Drawing.Size(109, 134);
            this.soundList.TabIndex = 0;
            this.soundList.SelectedIndexChanged += new System.EventHandler(this.soundList_SelectedIndexChanged);
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
            this.label1.Location = new System.Drawing.Point(117, 33);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(75, 13);
            this.label1.TabIndex = 9;
            this.label1.Text = "Sound Source";
            // 
            // soundSource
            // 
            this.soundSource.Location = new System.Drawing.Point(120, 51);
            this.soundSource.Name = "soundSource";
            this.soundSource.Size = new System.Drawing.Size(169, 20);
            this.soundSource.TabIndex = 10;
            this.soundSource.TextChanged += new System.EventHandler(this.soundSource_TextChanged);
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(120, 77);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(169, 23);
            this.button1.TabIndex = 11;
            this.button1.Text = "Play";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // SoundSelection
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(301, 158);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.soundSource);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.delete);
            this.Controls.Add(this.newLink);
            this.Controls.Add(this.soundList);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(317, 197);
            this.MinimumSize = new System.Drawing.Size(317, 197);
            this.Name = "SoundSelection";
            this.Text = "SoundSelection";
            this.Load += new System.EventHandler(this.SoundSelection_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ListBox soundList;
        private System.Windows.Forms.LinkLabel delete;
        private System.Windows.Forms.LinkLabel newLink;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox soundSource;
        private System.Windows.Forms.Button button1;
    }
}