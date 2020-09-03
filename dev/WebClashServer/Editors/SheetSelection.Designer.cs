namespace WebClashServer.Editors
{
    partial class SheetSelection
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(SheetSelection));
            this.canvas = new System.Windows.Forms.PictureBox();
            this.panel1 = new System.Windows.Forms.Panel();
            this.frameList = new System.Windows.Forms.ListBox();
            this.clear = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.canvas)).BeginInit();
            this.panel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // canvas
            // 
            this.canvas.BackColor = System.Drawing.SystemColors.ControlLight;
            this.canvas.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.canvas.Dock = System.Windows.Forms.DockStyle.Fill;
            this.canvas.Location = new System.Drawing.Point(118, 0);
            this.canvas.Name = "canvas";
            this.canvas.Size = new System.Drawing.Size(476, 456);
            this.canvas.TabIndex = 0;
            this.canvas.TabStop = false;
            this.canvas.MouseDown += new System.Windows.Forms.MouseEventHandler(this.canvas_MouseDown);
            this.canvas.MouseMove += new System.Windows.Forms.MouseEventHandler(this.canvas_MouseMove);
            this.canvas.MouseUp += new System.Windows.Forms.MouseEventHandler(this.canvas_MouseUp);
            // 
            // panel1
            // 
            this.panel1.Controls.Add(this.frameList);
            this.panel1.Controls.Add(this.clear);
            this.panel1.Dock = System.Windows.Forms.DockStyle.Left;
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(118, 456);
            this.panel1.TabIndex = 1;
            // 
            // frameList
            // 
            this.frameList.Dock = System.Windows.Forms.DockStyle.Fill;
            this.frameList.Enabled = false;
            this.frameList.FormattingEnabled = true;
            this.frameList.Location = new System.Drawing.Point(0, 0);
            this.frameList.Name = "frameList";
            this.frameList.Size = new System.Drawing.Size(118, 433);
            this.frameList.TabIndex = 1;
            // 
            // clear
            // 
            this.clear.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.clear.Location = new System.Drawing.Point(0, 433);
            this.clear.Name = "clear";
            this.clear.Size = new System.Drawing.Size(118, 23);
            this.clear.TabIndex = 0;
            this.clear.Text = "Clear";
            this.clear.UseVisualStyleBackColor = true;
            this.clear.Click += new System.EventHandler(this.clear_Click);
            // 
            // SheetSelection
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(594, 456);
            this.Controls.Add(this.canvas);
            this.Controls.Add(this.panel1);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(610, 495);
            this.MinimumSize = new System.Drawing.Size(610, 495);
            this.Name = "SheetSelection";
            this.Text = "SheetSelection";
            ((System.ComponentModel.ISupportInitialize)(this.canvas)).EndInit();
            this.panel1.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.PictureBox canvas;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.ListBox frameList;
        private System.Windows.Forms.Button clear;
    }
}