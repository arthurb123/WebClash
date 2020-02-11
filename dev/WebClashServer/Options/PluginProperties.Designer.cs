namespace WebClashServer.Options
{
    partial class PluginProperties
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(PluginProperties));
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.properties = new System.Windows.Forms.ListBox();
            this.pluginTitle = new System.Windows.Forms.Label();
            this.pluginDescription = new System.Windows.Forms.RichTextBox();
            this.groupBox1.SuspendLayout();
            this.SuspendLayout();
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.pluginDescription);
            this.groupBox1.Controls.Add(this.pluginTitle);
            this.groupBox1.Location = new System.Drawing.Point(8, 4);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(206, 180);
            this.groupBox1.TabIndex = 0;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Plugin Data";
            // 
            // properties
            // 
            this.properties.FormattingEnabled = true;
            this.properties.Location = new System.Drawing.Point(220, 10);
            this.properties.Name = "properties";
            this.properties.Size = new System.Drawing.Size(192, 173);
            this.properties.TabIndex = 1;
            // 
            // pluginTitle
            // 
            this.pluginTitle.AutoSize = true;
            this.pluginTitle.Location = new System.Drawing.Point(6, 18);
            this.pluginTitle.Name = "pluginTitle";
            this.pluginTitle.Size = new System.Drawing.Size(55, 13);
            this.pluginTitle.TabIndex = 0;
            this.pluginTitle.Text = "Plugin title";
            // 
            // pluginDescription
            // 
            this.pluginDescription.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.pluginDescription.Location = new System.Drawing.Point(6, 36);
            this.pluginDescription.Name = "pluginDescription";
            this.pluginDescription.ReadOnly = true;
            this.pluginDescription.Size = new System.Drawing.Size(194, 138);
            this.pluginDescription.TabIndex = 1;
            this.pluginDescription.Text = "Plugin description";
            // 
            // PluginProperties
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(420, 191);
            this.Controls.Add(this.properties);
            this.Controls.Add(this.groupBox1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(436, 230);
            this.MinimumSize = new System.Drawing.Size(436, 230);
            this.Name = "PluginProperties";
            this.Text = "WebClash - Plugin Properties";
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.ListBox properties;
        private System.Windows.Forms.RichTextBox pluginDescription;
        private System.Windows.Forms.Label pluginTitle;
    }
}