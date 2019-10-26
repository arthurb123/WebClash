namespace WebClashServer.Editors
{
    partial class MapLayers
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MapLayers));
            this.layerList = new System.Windows.Forms.ListBox();
            this.moveDown = new System.Windows.Forms.Button();
            this.moveUp = new System.Windows.Forms.Button();
            this.isHover = new System.Windows.Forms.CheckBox();
            this.SuspendLayout();
            // 
            // layerList
            // 
            this.layerList.FormattingEnabled = true;
            this.layerList.Location = new System.Drawing.Point(2, 2);
            this.layerList.Name = "layerList";
            this.layerList.Size = new System.Drawing.Size(122, 95);
            this.layerList.TabIndex = 0;
            this.layerList.SelectedIndexChanged += new System.EventHandler(this.layerList_SelectedIndexChanged);
            // 
            // moveDown
            // 
            this.moveDown.Location = new System.Drawing.Point(225, 54);
            this.moveDown.Name = "moveDown";
            this.moveDown.Size = new System.Drawing.Size(75, 23);
            this.moveDown.TabIndex = 19;
            this.moveDown.Text = "Move Down";
            this.moveDown.UseVisualStyleBackColor = true;
            this.moveDown.Click += new System.EventHandler(this.moveDown_Click);
            // 
            // moveUp
            // 
            this.moveUp.Location = new System.Drawing.Point(144, 54);
            this.moveUp.Name = "moveUp";
            this.moveUp.Size = new System.Drawing.Size(75, 23);
            this.moveUp.TabIndex = 18;
            this.moveUp.Text = "Move Up";
            this.moveUp.UseVisualStyleBackColor = true;
            this.moveUp.Click += new System.EventHandler(this.moveUp_Click);
            // 
            // isHover
            // 
            this.isHover.AutoSize = true;
            this.isHover.Location = new System.Drawing.Point(192, 27);
            this.isHover.Name = "isHover";
            this.isHover.Size = new System.Drawing.Size(55, 17);
            this.isHover.TabIndex = 20;
            this.isHover.Text = "Hover";
            this.isHover.UseVisualStyleBackColor = true;
            this.isHover.CheckedChanged += new System.EventHandler(this.isHover_CheckedChanged);
            // 
            // MapLayers
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(324, 99);
            this.Controls.Add(this.isHover);
            this.Controls.Add(this.moveDown);
            this.Controls.Add(this.moveUp);
            this.Controls.Add(this.layerList);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(340, 138);
            this.MinimumSize = new System.Drawing.Size(340, 138);
            this.Name = "MapLayers";
            this.Text = "MapLayers";
            this.Load += new System.EventHandler(this.MapLayers_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ListBox layerList;
        private System.Windows.Forms.Button moveDown;
        private System.Windows.Forms.Button moveUp;
        private System.Windows.Forms.CheckBox isHover;
    }
}