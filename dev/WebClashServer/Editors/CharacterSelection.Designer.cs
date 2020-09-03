namespace WebClashServer.Editors
{
    partial class CharacterSelection
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(CharacterSelection));
            this.characterList = new System.Windows.Forms.ListBox();
            this.canvas = new System.Windows.Forms.PictureBox();
            ((System.ComponentModel.ISupportInitialize)(this.canvas)).BeginInit();
            this.SuspendLayout();
            // 
            // characterList
            // 
            this.characterList.FormattingEnabled = true;
            this.characterList.Location = new System.Drawing.Point(3, 2);
            this.characterList.Name = "characterList";
            this.characterList.Size = new System.Drawing.Size(109, 251);
            this.characterList.TabIndex = 0;
            this.characterList.SelectedIndexChanged += new System.EventHandler(this.characterList_SelectedIndexChanged);
            // 
            // canvas
            // 
            this.canvas.BackColor = System.Drawing.SystemColors.ControlLight;
            this.canvas.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.canvas.Location = new System.Drawing.Point(140, 28);
            this.canvas.Name = "canvas";
            this.canvas.Size = new System.Drawing.Size(200, 200);
            this.canvas.TabIndex = 7;
            this.canvas.TabStop = false;
            // 
            // CharacterSelection
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(364, 255);
            this.Controls.Add(this.canvas);
            this.Controls.Add(this.characterList);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(380, 294);
            this.MinimumSize = new System.Drawing.Size(380, 294);
            this.Name = "CharacterSelection";
            this.Text = "CharacterSelection";
            this.Load += new System.EventHandler(this.CharacterSelection_Load);
            ((System.ComponentModel.ISupportInitialize)(this.canvas)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.ListBox characterList;
        private System.Windows.Forms.PictureBox canvas;
    }
}