namespace WebClashServer.Input
{
    partial class NumberInput
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(NumberInput));
            this.confirm = new System.Windows.Forms.Button();
            this.prompt = new System.Windows.Forms.Label();
            this.input = new System.Windows.Forms.NumericUpDown();
            ((System.ComponentModel.ISupportInitialize)(this.input)).BeginInit();
            this.SuspendLayout();
            // 
            // confirm
            // 
            this.confirm.Location = new System.Drawing.Point(81, 76);
            this.confirm.Name = "confirm";
            this.confirm.Size = new System.Drawing.Size(100, 23);
            this.confirm.TabIndex = 0;
            this.confirm.Text = "Confirm";
            this.confirm.UseVisualStyleBackColor = true;
            this.confirm.Click += new System.EventHandler(this.confirm_Click);
            // 
            // prompt
            // 
            this.prompt.Location = new System.Drawing.Point(12, 9);
            this.prompt.Name = "prompt";
            this.prompt.Size = new System.Drawing.Size(240, 38);
            this.prompt.TabIndex = 2;
            this.prompt.Text = "Prompt";
            this.prompt.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            // 
            // input
            // 
            this.input.DecimalPlaces = 2;
            this.input.Location = new System.Drawing.Point(12, 50);
            this.input.Maximum = new decimal(new int[] {
            1215752191,
            23,
            0,
            0});
            this.input.Minimum = new decimal(new int[] {
            1410065407,
            2,
            0,
            -2147483648});
            this.input.Name = "input";
            this.input.Size = new System.Drawing.Size(240, 20);
            this.input.TabIndex = 3;
            this.input.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // NumberInput
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(264, 111);
            this.Controls.Add(this.input);
            this.Controls.Add(this.prompt);
            this.Controls.Add(this.confirm);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(280, 150);
            this.MinimumSize = new System.Drawing.Size(280, 150);
            this.Name = "NumberInput";
            this.Text = "NumberInput";
            ((System.ComponentModel.ISupportInitialize)(this.input)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button confirm;
        private System.Windows.Forms.Label prompt;
        private System.Windows.Forms.NumericUpDown input;
    }
}