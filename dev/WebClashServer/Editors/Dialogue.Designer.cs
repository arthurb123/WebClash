namespace WebClashServer.Editors
{
    partial class Dialogue
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Dialogue));
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.newItemToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.eventsToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.setVariableToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.giveItemToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.loadMapToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.affectPlayerToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.spawnNPCToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.showQuestToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.showShopToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.turnHostileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.advanceQuestToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.playerToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.getVariableToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.canvas = new System.Windows.Forms.PictureBox();
            this.showBankToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.menuStrip1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.canvas)).BeginInit();
            this.SuspendLayout();
            // 
            // menuStrip1
            // 
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.newItemToolStripMenuItem,
            this.eventsToolStripMenuItem,
            this.playerToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(649, 24);
            this.menuStrip1.TabIndex = 1;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // newItemToolStripMenuItem
            // 
            this.newItemToolStripMenuItem.Name = "newItemToolStripMenuItem";
            this.newItemToolStripMenuItem.Size = new System.Drawing.Size(70, 20);
            this.newItemToolStripMenuItem.Text = "New Item";
            this.newItemToolStripMenuItem.Click += new System.EventHandler(this.newItemToolStripMenuItem_Click);
            // 
            // eventsToolStripMenuItem
            // 
            this.eventsToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.setVariableToolStripMenuItem,
            this.giveItemToolStripMenuItem,
            this.loadMapToolStripMenuItem,
            this.affectPlayerToolStripMenuItem,
            this.spawnNPCToolStripMenuItem,
            this.showQuestToolStripMenuItem,
            this.showShopToolStripMenuItem,
            this.showBankToolStripMenuItem,
            this.turnHostileToolStripMenuItem,
            this.advanceQuestToolStripMenuItem});
            this.eventsToolStripMenuItem.Name = "eventsToolStripMenuItem";
            this.eventsToolStripMenuItem.Size = new System.Drawing.Size(53, 20);
            this.eventsToolStripMenuItem.Text = "Events";
            // 
            // setVariableToolStripMenuItem
            // 
            this.setVariableToolStripMenuItem.Name = "setVariableToolStripMenuItem";
            this.setVariableToolStripMenuItem.Size = new System.Drawing.Size(180, 22);
            this.setVariableToolStripMenuItem.Text = "Set Variable";
            this.setVariableToolStripMenuItem.Click += new System.EventHandler(this.SetVariableToolStripMenuItem_Click);
            // 
            // giveItemToolStripMenuItem
            // 
            this.giveItemToolStripMenuItem.Name = "giveItemToolStripMenuItem";
            this.giveItemToolStripMenuItem.Size = new System.Drawing.Size(180, 22);
            this.giveItemToolStripMenuItem.Text = "Give Item";
            this.giveItemToolStripMenuItem.Click += new System.EventHandler(this.giveItemToolStripMenuItem_Click);
            // 
            // loadMapToolStripMenuItem
            // 
            this.loadMapToolStripMenuItem.Name = "loadMapToolStripMenuItem";
            this.loadMapToolStripMenuItem.Size = new System.Drawing.Size(180, 22);
            this.loadMapToolStripMenuItem.Text = "Load Map";
            this.loadMapToolStripMenuItem.Click += new System.EventHandler(this.loadMapToolStripMenuItem_Click);
            // 
            // affectPlayerToolStripMenuItem
            // 
            this.affectPlayerToolStripMenuItem.Name = "affectPlayerToolStripMenuItem";
            this.affectPlayerToolStripMenuItem.Size = new System.Drawing.Size(180, 22);
            this.affectPlayerToolStripMenuItem.Text = "Affect Player";
            this.affectPlayerToolStripMenuItem.Click += new System.EventHandler(this.affectPlayerToolStripMenuItem_Click);
            // 
            // spawnNPCToolStripMenuItem
            // 
            this.spawnNPCToolStripMenuItem.Name = "spawnNPCToolStripMenuItem";
            this.spawnNPCToolStripMenuItem.Size = new System.Drawing.Size(180, 22);
            this.spawnNPCToolStripMenuItem.Text = "Spawn NPC";
            this.spawnNPCToolStripMenuItem.Click += new System.EventHandler(this.spawnNPCToolStripMenuItem_Click);
            // 
            // showQuestToolStripMenuItem
            // 
            this.showQuestToolStripMenuItem.Name = "showQuestToolStripMenuItem";
            this.showQuestToolStripMenuItem.Size = new System.Drawing.Size(180, 22);
            this.showQuestToolStripMenuItem.Text = "Show Quest";
            this.showQuestToolStripMenuItem.Click += new System.EventHandler(this.showQuestToolStripMenuItem_Click);
            // 
            // showShopToolStripMenuItem
            // 
            this.showShopToolStripMenuItem.Name = "showShopToolStripMenuItem";
            this.showShopToolStripMenuItem.Size = new System.Drawing.Size(180, 22);
            this.showShopToolStripMenuItem.Text = "Show Shop";
            this.showShopToolStripMenuItem.Click += new System.EventHandler(this.ShowShopToolStripMenuItem_Click);
            // 
            // turnHostileToolStripMenuItem
            // 
            this.turnHostileToolStripMenuItem.Enabled = false;
            this.turnHostileToolStripMenuItem.Name = "turnHostileToolStripMenuItem";
            this.turnHostileToolStripMenuItem.Size = new System.Drawing.Size(180, 22);
            this.turnHostileToolStripMenuItem.Text = "Turn Hostile";
            this.turnHostileToolStripMenuItem.Click += new System.EventHandler(this.TurnHostileToolStripMenuItem_Click);
            // 
            // advanceQuestToolStripMenuItem
            // 
            this.advanceQuestToolStripMenuItem.Enabled = false;
            this.advanceQuestToolStripMenuItem.Name = "advanceQuestToolStripMenuItem";
            this.advanceQuestToolStripMenuItem.Size = new System.Drawing.Size(180, 22);
            this.advanceQuestToolStripMenuItem.Text = "Advance Quest";
            this.advanceQuestToolStripMenuItem.Click += new System.EventHandler(this.advanceQuestToolStripMenuItem_Click);
            // 
            // playerToolStripMenuItem
            // 
            this.playerToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.getVariableToolStripMenuItem});
            this.playerToolStripMenuItem.Name = "playerToolStripMenuItem";
            this.playerToolStripMenuItem.Size = new System.Drawing.Size(57, 20);
            this.playerToolStripMenuItem.Text = "Checks";
            // 
            // getVariableToolStripMenuItem
            // 
            this.getVariableToolStripMenuItem.Name = "getVariableToolStripMenuItem";
            this.getVariableToolStripMenuItem.Size = new System.Drawing.Size(136, 22);
            this.getVariableToolStripMenuItem.Text = "Get Variable";
            this.getVariableToolStripMenuItem.Click += new System.EventHandler(this.GetVariableToolStripMenuItem_Click);
            // 
            // canvas
            // 
            this.canvas.BackColor = System.Drawing.SystemColors.ControlLight;
            this.canvas.Dock = System.Windows.Forms.DockStyle.Fill;
            this.canvas.Location = new System.Drawing.Point(0, 24);
            this.canvas.Name = "canvas";
            this.canvas.Size = new System.Drawing.Size(649, 342);
            this.canvas.TabIndex = 2;
            this.canvas.TabStop = false;
            // 
            // showBankToolStripMenuItem
            // 
            this.showBankToolStripMenuItem.Name = "showBankToolStripMenuItem";
            this.showBankToolStripMenuItem.Size = new System.Drawing.Size(180, 22);
            this.showBankToolStripMenuItem.Text = "Show Bank";
            this.showBankToolStripMenuItem.Click += new System.EventHandler(this.showBankToolStripMenuItem_Click);
            // 
            // Dialogue
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(649, 366);
            this.Controls.Add(this.canvas);
            this.Controls.Add(this.menuStrip1);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MainMenuStrip = this.menuStrip1;
            this.MinimumSize = new System.Drawing.Size(665, 405);
            this.Name = "Dialogue";
            this.Text = "WebClash - Dialogue";
            this.Load += new System.EventHandler(this.Dialogue_Load);
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.canvas)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem newItemToolStripMenuItem;
        private System.Windows.Forms.PictureBox canvas;
        private System.Windows.Forms.ToolStripMenuItem eventsToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem giveItemToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem loadMapToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem affectPlayerToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem spawnNPCToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem showQuestToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem turnHostileToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem showShopToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem playerToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem getVariableToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem setVariableToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem advanceQuestToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem showBankToolStripMenuItem;
    }
}