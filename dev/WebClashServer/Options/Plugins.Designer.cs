namespace WebClashServer.Options
{
    partial class Plugins
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
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Plugins));
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.clientPlugins = new System.Windows.Forms.CheckedListBox();
            this.addClientPlugin = new System.Windows.Forms.Button();
            this.removeClientPlugin = new System.Windows.Forms.Button();
            this.editClientPlugin = new System.Windows.Forms.Button();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.editServerPlugin = new System.Windows.Forms.Button();
            this.serverPlugins = new System.Windows.Forms.CheckedListBox();
            this.addServerPlugin = new System.Windows.Forms.Button();
            this.removeServerPlugin = new System.Windows.Forms.Button();
            this.removeChecker = new System.Windows.Forms.Timer(this.components);
            this.groupBox1.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.SuspendLayout();
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.clientPlugins);
            this.groupBox1.Controls.Add(this.addClientPlugin);
            this.groupBox1.Controls.Add(this.removeClientPlugin);
            this.groupBox1.Controls.Add(this.editClientPlugin);
            this.groupBox1.Location = new System.Drawing.Point(1, 4);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(272, 161);
            this.groupBox1.TabIndex = 2;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Client Plugins";
            // 
            // clientPlugins
            // 
            this.clientPlugins.FormattingEnabled = true;
            this.clientPlugins.Location = new System.Drawing.Point(6, 19);
            this.clientPlugins.Name = "clientPlugins";
            this.clientPlugins.Size = new System.Drawing.Size(260, 109);
            this.clientPlugins.TabIndex = 3;
            this.clientPlugins.SelectedValueChanged += new System.EventHandler(this.clientPlugins_SelectedValueChanged);
            // 
            // addClientPlugin
            // 
            this.addClientPlugin.Location = new System.Drawing.Point(6, 128);
            this.addClientPlugin.Name = "addClientPlugin";
            this.addClientPlugin.Size = new System.Drawing.Size(50, 23);
            this.addClientPlugin.TabIndex = 2;
            this.addClientPlugin.Text = "Add";
            this.addClientPlugin.UseVisualStyleBackColor = true;
            this.addClientPlugin.Click += new System.EventHandler(this.addClientPlugin_Click);
            // 
            // removeClientPlugin
            // 
            this.removeClientPlugin.Location = new System.Drawing.Point(206, 128);
            this.removeClientPlugin.Name = "removeClientPlugin";
            this.removeClientPlugin.Size = new System.Drawing.Size(60, 23);
            this.removeClientPlugin.TabIndex = 4;
            this.removeClientPlugin.Text = "Remove Plugin";
            this.removeClientPlugin.UseVisualStyleBackColor = true;
            this.removeClientPlugin.Click += new System.EventHandler(this.removeClientPlugin_Click);
            // 
            // editClientPlugin
            // 
            this.editClientPlugin.Location = new System.Drawing.Point(55, 128);
            this.editClientPlugin.Name = "editClientPlugin";
            this.editClientPlugin.Size = new System.Drawing.Size(50, 23);
            this.editClientPlugin.TabIndex = 5;
            this.editClientPlugin.Text = "Edit";
            this.editClientPlugin.UseVisualStyleBackColor = true;
            this.editClientPlugin.Click += new System.EventHandler(this.editClientPlugin_Click);
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.editServerPlugin);
            this.groupBox2.Controls.Add(this.serverPlugins);
            this.groupBox2.Controls.Add(this.addServerPlugin);
            this.groupBox2.Controls.Add(this.removeServerPlugin);
            this.groupBox2.Location = new System.Drawing.Point(1, 168);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(272, 161);
            this.groupBox2.TabIndex = 3;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Server Plugins";
            // 
            // editServerPlugin
            // 
            this.editServerPlugin.Location = new System.Drawing.Point(55, 128);
            this.editServerPlugin.Name = "editServerPlugin";
            this.editServerPlugin.Size = new System.Drawing.Size(50, 23);
            this.editServerPlugin.TabIndex = 6;
            this.editServerPlugin.Text = "Edit";
            this.editServerPlugin.UseVisualStyleBackColor = true;
            this.editServerPlugin.Click += new System.EventHandler(this.editServerPlugin_Click);
            // 
            // serverPlugins
            // 
            this.serverPlugins.FormattingEnabled = true;
            this.serverPlugins.Location = new System.Drawing.Point(6, 19);
            this.serverPlugins.Name = "serverPlugins";
            this.serverPlugins.Size = new System.Drawing.Size(260, 109);
            this.serverPlugins.TabIndex = 4;
            this.serverPlugins.SelectedValueChanged += new System.EventHandler(this.serverPlugins_SelectedValueChanged);
            // 
            // addServerPlugin
            // 
            this.addServerPlugin.Location = new System.Drawing.Point(6, 128);
            this.addServerPlugin.Name = "addServerPlugin";
            this.addServerPlugin.Size = new System.Drawing.Size(50, 23);
            this.addServerPlugin.TabIndex = 2;
            this.addServerPlugin.Text = "Add";
            this.addServerPlugin.UseVisualStyleBackColor = true;
            this.addServerPlugin.Click += new System.EventHandler(this.addServerPlugin_Click);
            // 
            // removeServerPlugin
            // 
            this.removeServerPlugin.Location = new System.Drawing.Point(206, 128);
            this.removeServerPlugin.Name = "removeServerPlugin";
            this.removeServerPlugin.Size = new System.Drawing.Size(60, 23);
            this.removeServerPlugin.TabIndex = 5;
            this.removeServerPlugin.Text = "Remove";
            this.removeServerPlugin.UseVisualStyleBackColor = true;
            this.removeServerPlugin.Click += new System.EventHandler(this.removeServerPlugin_Click);
            // 
            // removeChecker
            // 
            this.removeChecker.Enabled = true;
            this.removeChecker.Tick += new System.EventHandler(this.removeChecker_Tick);
            // 
            // Plugins
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(274, 336);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.groupBox1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(290, 375);
            this.MinimumSize = new System.Drawing.Size(290, 375);
            this.Name = "Plugins";
            this.Text = "WebClash - Plugins";
            this.Load += new System.EventHandler(this.Plugins_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox2.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.Button addClientPlugin;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.Button addServerPlugin;
        private System.Windows.Forms.CheckedListBox clientPlugins;
        private System.Windows.Forms.CheckedListBox serverPlugins;
        private System.Windows.Forms.Button removeClientPlugin;
        private System.Windows.Forms.Button removeServerPlugin;
        private System.Windows.Forms.Timer removeChecker;
        private System.Windows.Forms.Button editClientPlugin;
        private System.Windows.Forms.Button editServerPlugin;
    }
}