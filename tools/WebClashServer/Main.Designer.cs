namespace WebClashServer
{
    partial class Main
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Main));
            this.output = new System.Windows.Forms.RichTextBox();
            this.startButton = new System.Windows.Forms.Button();
            this.status = new System.Windows.Forms.Label();
            this.settings = new System.Windows.Forms.Button();
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.editToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.charactersToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.mapsToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menuStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // output
            // 
            this.output.BackColor = System.Drawing.SystemColors.Control;
            this.output.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.output.Dock = System.Windows.Forms.DockStyle.Top;
            this.output.Location = new System.Drawing.Point(0, 24);
            this.output.Name = "output";
            this.output.ReadOnly = true;
            this.output.Size = new System.Drawing.Size(404, 193);
            this.output.TabIndex = 0;
            this.output.Text = "";
            // 
            // startButton
            // 
            this.startButton.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.startButton.Location = new System.Drawing.Point(0, 218);
            this.startButton.MaximumSize = new System.Drawing.Size(120, 23);
            this.startButton.MinimumSize = new System.Drawing.Size(120, 23);
            this.startButton.Name = "startButton";
            this.startButton.Size = new System.Drawing.Size(120, 23);
            this.startButton.TabIndex = 1;
            this.startButton.Text = "Start";
            this.startButton.UseVisualStyleBackColor = true;
            this.startButton.Click += new System.EventHandler(this.startButton_Click);
            // 
            // status
            // 
            this.status.BackColor = System.Drawing.SystemColors.ControlLight;
            this.status.Font = new System.Drawing.Font("Microsoft Sans Serif", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.status.Location = new System.Drawing.Point(121, 218);
            this.status.Name = "status";
            this.status.Size = new System.Drawing.Size(247, 20);
            this.status.TabIndex = 2;
            this.status.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            // 
            // settings
            // 
            this.settings.BackgroundImage = ((System.Drawing.Image)(resources.GetObject("settings.BackgroundImage")));
            this.settings.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Center;
            this.settings.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.settings.ImageAlign = System.Drawing.ContentAlignment.TopCenter;
            this.settings.Location = new System.Drawing.Point(374, 218);
            this.settings.Name = "settings";
            this.settings.Size = new System.Drawing.Size(28, 23);
            this.settings.TabIndex = 3;
            this.settings.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            this.settings.UseVisualStyleBackColor = true;
            this.settings.Click += new System.EventHandler(this.settings_Click);
            // 
            // menuStrip1
            // 
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.editToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(404, 24);
            this.menuStrip1.TabIndex = 4;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // editToolStripMenuItem
            // 
            this.editToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.charactersToolStripMenuItem,
            this.mapsToolStripMenuItem});
            this.editToolStripMenuItem.Name = "editToolStripMenuItem";
            this.editToolStripMenuItem.Size = new System.Drawing.Size(39, 20);
            this.editToolStripMenuItem.Text = "Edit";
            // 
            // charactersToolStripMenuItem
            // 
            this.charactersToolStripMenuItem.Name = "charactersToolStripMenuItem";
            this.charactersToolStripMenuItem.Size = new System.Drawing.Size(130, 22);
            this.charactersToolStripMenuItem.Text = "Characters";
            this.charactersToolStripMenuItem.Click += new System.EventHandler(this.charactersToolStripMenuItem_Click);
            // 
            // mapsToolStripMenuItem
            // 
            this.mapsToolStripMenuItem.Name = "mapsToolStripMenuItem";
            this.mapsToolStripMenuItem.Size = new System.Drawing.Size(130, 22);
            this.mapsToolStripMenuItem.Text = "Maps";
            // 
            // Main
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.SystemColors.ControlLight;
            this.ClientSize = new System.Drawing.Size(404, 241);
            this.Controls.Add(this.settings);
            this.Controls.Add(this.status);
            this.Controls.Add(this.startButton);
            this.Controls.Add(this.output);
            this.Controls.Add(this.menuStrip1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MainMenuStrip = this.menuStrip1;
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(420, 280);
            this.MinimumSize = new System.Drawing.Size(420, 280);
            this.Name = "Main";
            this.Text = "WebClash Server";
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.RichTextBox output;
        private System.Windows.Forms.Button startButton;
        private System.Windows.Forms.Label status;
        private System.Windows.Forms.Button settings;
        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem editToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem mapsToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem charactersToolStripMenuItem;
    }
}

