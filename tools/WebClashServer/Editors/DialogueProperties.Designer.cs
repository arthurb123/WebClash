namespace WebClashServer.Editors
{
    partial class DialogueProperties
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(DialogueProperties));
            this.entryPoint = new System.Windows.Forms.CheckBox();
            this.label1 = new System.Windows.Forms.Label();
            this.dialogue = new System.Windows.Forms.RichTextBox();
            this.portraitSource = new System.Windows.Forms.TextBox();
            this.portrait = new System.Windows.Forms.PictureBox();
            this.label13 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.delete = new System.Windows.Forms.LinkLabel();
            this.newLink = new System.Windows.Forms.LinkLabel();
            this.optionList = new System.Windows.Forms.ListBox();
            this.label2 = new System.Windows.Forms.Label();
            this.optionText = new System.Windows.Forms.RichTextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.optionNext = new System.Windows.Forms.NumericUpDown();
            this.saveOptionButton = new System.Windows.Forms.Button();
            this.label6 = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.portrait)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.optionNext)).BeginInit();
            this.SuspendLayout();
            // 
            // entryPoint
            // 
            this.entryPoint.AutoSize = true;
            this.entryPoint.Location = new System.Drawing.Point(471, 12);
            this.entryPoint.Name = "entryPoint";
            this.entryPoint.Size = new System.Drawing.Size(77, 17);
            this.entryPoint.TabIndex = 0;
            this.entryPoint.Text = "Entry Point";
            this.entryPoint.UseVisualStyleBackColor = true;
            this.entryPoint.CheckedChanged += new System.EventHandler(this.entryPoint_CheckedChanged);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(77, 38);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(77, 13);
            this.label1.TabIndex = 1;
            this.label1.Text = "Portrait Source";
            // 
            // dialogue
            // 
            this.dialogue.Location = new System.Drawing.Point(12, 146);
            this.dialogue.Name = "dialogue";
            this.dialogue.Size = new System.Drawing.Size(315, 209);
            this.dialogue.TabIndex = 2;
            this.dialogue.Text = "";
            this.dialogue.TextChanged += new System.EventHandler(this.dialogue_TextChanged);
            // 
            // portraitSource
            // 
            this.portraitSource.Location = new System.Drawing.Point(43, 54);
            this.portraitSource.Name = "portraitSource";
            this.portraitSource.Size = new System.Drawing.Size(155, 20);
            this.portraitSource.TabIndex = 3;
            this.portraitSource.TextChanged += new System.EventHandler(this.portraitSource_TextChanged);
            // 
            // portrait
            // 
            this.portrait.BackColor = System.Drawing.SystemColors.ControlLight;
            this.portrait.Location = new System.Drawing.Point(221, 28);
            this.portrait.Name = "portrait";
            this.portrait.Size = new System.Drawing.Size(80, 80);
            this.portrait.TabIndex = 4;
            this.portrait.TabStop = false;
            // 
            // label13
            // 
            this.label13.AutoSize = true;
            this.label13.Font = new System.Drawing.Font("Microsoft Sans Serif", 6.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label13.Location = new System.Drawing.Point(35, 80);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(172, 12);
            this.label13.TabIndex = 19;
            this.label13.Text = "* If left empty no portrait will be displayed";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(12, 130);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(44, 13);
            this.label3.TabIndex = 24;
            this.label3.Text = "Content";
            // 
            // delete
            // 
            this.delete.ActiveLinkColor = System.Drawing.Color.Red;
            this.delete.AutoSize = true;
            this.delete.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.delete.LinkColor = System.Drawing.Color.Red;
            this.delete.Location = new System.Drawing.Point(419, 344);
            this.delete.Name = "delete";
            this.delete.Size = new System.Drawing.Size(23, 13);
            this.delete.TabIndex = 27;
            this.delete.TabStop = true;
            this.delete.Text = "Del";
            this.delete.VisitedLinkColor = System.Drawing.Color.Red;
            this.delete.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.delete_LinkClicked);
            // 
            // newLink
            // 
            this.newLink.ActiveLinkColor = System.Drawing.Color.Blue;
            this.newLink.AutoSize = true;
            this.newLink.LinkBehavior = System.Windows.Forms.LinkBehavior.HoverUnderline;
            this.newLink.Location = new System.Drawing.Point(333, 342);
            this.newLink.Name = "newLink";
            this.newLink.Size = new System.Drawing.Size(29, 13);
            this.newLink.TabIndex = 26;
            this.newLink.TabStop = true;
            this.newLink.Text = "New";
            this.newLink.VisitedLinkColor = System.Drawing.Color.Blue;
            this.newLink.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.newLink_LinkClicked);
            // 
            // optionList
            // 
            this.optionList.FormattingEnabled = true;
            this.optionList.Location = new System.Drawing.Point(333, 146);
            this.optionList.Name = "optionList";
            this.optionList.Size = new System.Drawing.Size(109, 186);
            this.optionList.TabIndex = 25;
            this.optionList.SelectedIndexChanged += new System.EventHandler(this.optionList_SelectedIndexChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(330, 130);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(43, 13);
            this.label2.TabIndex = 28;
            this.label2.Text = "Options";
            // 
            // optionText
            // 
            this.optionText.Location = new System.Drawing.Point(450, 163);
            this.optionText.Name = "optionText";
            this.optionText.Size = new System.Drawing.Size(100, 63);
            this.optionText.TabIndex = 29;
            this.optionText.Text = "";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(450, 147);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(62, 13);
            this.label4.TabIndex = 30;
            this.label4.Text = "Option Text";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(450, 243);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(62, 13);
            this.label5.TabIndex = 31;
            this.label5.Text = "Next Dialog";
            // 
            // optionNext
            // 
            this.optionNext.Location = new System.Drawing.Point(450, 259);
            this.optionNext.Maximum = new decimal(new int[] {
            999999999,
            0,
            0,
            0});
            this.optionNext.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            -2147483648});
            this.optionNext.Name = "optionNext";
            this.optionNext.Size = new System.Drawing.Size(100, 20);
            this.optionNext.TabIndex = 32;
            this.optionNext.Value = new decimal(new int[] {
            1,
            0,
            0,
            -2147483648});
            // 
            // saveOptionButton
            // 
            this.saveOptionButton.Location = new System.Drawing.Point(461, 309);
            this.saveOptionButton.Name = "saveOptionButton";
            this.saveOptionButton.Size = new System.Drawing.Size(75, 23);
            this.saveOptionButton.TabIndex = 33;
            this.saveOptionButton.Text = "Save";
            this.saveOptionButton.UseVisualStyleBackColor = true;
            this.saveOptionButton.Click += new System.EventHandler(this.button1_Click);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Font = new System.Drawing.Font("Microsoft Sans Serif", 6.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label6.Location = new System.Drawing.Point(450, 283);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(100, 12);
            this.label6.TabIndex = 34;
            this.label6.Text = "* -1 will close the dialog";
            // 
            // DialogueProperties
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(559, 366);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.saveOptionButton);
            this.Controls.Add(this.optionNext);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.optionText);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.delete);
            this.Controls.Add(this.newLink);
            this.Controls.Add(this.optionList);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label13);
            this.Controls.Add(this.portrait);
            this.Controls.Add(this.portraitSource);
            this.Controls.Add(this.dialogue);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.entryPoint);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(575, 405);
            this.MinimumSize = new System.Drawing.Size(575, 405);
            this.Name = "DialogueProperties";
            this.Text = "WebClash Server - DialogItem";
            this.Load += new System.EventHandler(this.DialogueItem_Load);
            ((System.ComponentModel.ISupportInitialize)(this.portrait)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.optionNext)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.CheckBox entryPoint;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.RichTextBox dialogue;
        private System.Windows.Forms.TextBox portraitSource;
        private System.Windows.Forms.PictureBox portrait;
        private System.Windows.Forms.Label label13;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.LinkLabel delete;
        private System.Windows.Forms.LinkLabel newLink;
        private System.Windows.Forms.ListBox optionList;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.RichTextBox optionText;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.NumericUpDown optionNext;
        private System.Windows.Forms.Button saveOptionButton;
        private System.Windows.Forms.Label label6;
    }
}