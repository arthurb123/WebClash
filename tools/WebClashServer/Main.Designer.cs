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
            this.output = new System.Windows.Forms.RichTextBox();
            this.startButton = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // output
            // 
            this.output.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.output.Location = new System.Drawing.Point(12, 12);
            this.output.Name = "output";
            this.output.ReadOnly = true;
            this.output.Size = new System.Drawing.Size(380, 188);
            this.output.TabIndex = 0;
            this.output.Text = "";
            // 
            // startButton
            // 
            this.startButton.Location = new System.Drawing.Point(12, 206);
            this.startButton.Name = "startButton";
            this.startButton.Size = new System.Drawing.Size(107, 23);
            this.startButton.TabIndex = 1;
            this.startButton.Text = "Start";
            this.startButton.UseVisualStyleBackColor = true;
            this.startButton.Click += new System.EventHandler(this.startButton_Click);
            // 
            // Main
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(404, 241);
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
    }
}

