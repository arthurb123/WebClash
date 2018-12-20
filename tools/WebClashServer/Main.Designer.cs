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
            this.SuspendLayout();
            // 
            // output
            // 
            this.output.BackColor = System.Drawing.SystemColors.ControlLight;
            this.output.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.output.Dock = System.Windows.Forms.DockStyle.Top;
            this.output.Location = new System.Drawing.Point(0, 0);
            this.output.Name = "output";
            this.output.ReadOnly = true;
            this.output.Size = new System.Drawing.Size(404, 218);
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
            // Main
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.SystemColors.Control;
            this.ClientSize = new System.Drawing.Size(404, 241);
            this.Controls.Add(this.settings);
            this.Controls.Add(this.status);
            this.Controls.Add(this.startButton);
            this.Controls.Add(this.output);
            this.MaximumSize = new System.Drawing.Size(420, 280);
            this.MinimumSize = new System.Drawing.Size(420, 280);
            this.Name = "Main";
            this.ShowIcon = false;
            this.Text = "WebClash Server";
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.RichTextBox output;
        private System.Windows.Forms.Button startButton;
        private System.Windows.Forms.Label status;
        private System.Windows.Forms.Button settings;
    }
}

