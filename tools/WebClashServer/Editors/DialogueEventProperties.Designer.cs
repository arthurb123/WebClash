namespace WebClashServer.Editors
{
    partial class DialogueEventProperties
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(DialogueEventProperties));
            this.loadMapPanel = new System.Windows.Forms.Panel();
            this.positionY = new System.Windows.Forms.NumericUpDown();
            this.positionX = new System.Windows.Forms.NumericUpDown();
            this.label4 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.mapList = new System.Windows.Forms.ComboBox();
            this.label2 = new System.Windows.Forms.Label();
            this.giveItemPanel = new System.Windows.Forms.Panel();
            this.itemAmount = new System.Windows.Forms.NumericUpDown();
            this.label7 = new System.Windows.Forms.Label();
            this.itemList = new System.Windows.Forms.ComboBox();
            this.label8 = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.nextIndex = new System.Windows.Forms.NumericUpDown();
            this.label6 = new System.Windows.Forms.Label();
            this.repeatable = new System.Windows.Forms.CheckBox();
            this.nextIndex1 = new System.Windows.Forms.NumericUpDown();
            this.label5 = new System.Windows.Forms.Label();
            this.loadMapPanel.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.positionY)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.positionX)).BeginInit();
            this.giveItemPanel.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.itemAmount)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nextIndex)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.nextIndex1)).BeginInit();
            this.SuspendLayout();
            // 
            // loadMapPanel
            // 
            this.loadMapPanel.Controls.Add(this.positionY);
            this.loadMapPanel.Controls.Add(this.positionX);
            this.loadMapPanel.Controls.Add(this.label4);
            this.loadMapPanel.Controls.Add(this.label3);
            this.loadMapPanel.Controls.Add(this.mapList);
            this.loadMapPanel.Controls.Add(this.label2);
            this.loadMapPanel.Location = new System.Drawing.Point(12, 12);
            this.loadMapPanel.Name = "loadMapPanel";
            this.loadMapPanel.Size = new System.Drawing.Size(286, 126);
            this.loadMapPanel.TabIndex = 0;
            this.loadMapPanel.Visible = false;
            // 
            // positionY
            // 
            this.positionY.Location = new System.Drawing.Point(156, 91);
            this.positionY.Maximum = new decimal(new int[] {
            276447231,
            23283,
            0,
            0});
            this.positionY.Name = "positionY";
            this.positionY.Size = new System.Drawing.Size(120, 20);
            this.positionY.TabIndex = 5;
            this.positionY.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.positionY.ValueChanged += new System.EventHandler(this.positionY_ValueChanged);
            // 
            // positionX
            // 
            this.positionX.Location = new System.Drawing.Point(156, 47);
            this.positionX.Maximum = new decimal(new int[] {
            1215752191,
            23,
            0,
            0});
            this.positionX.Name = "positionX";
            this.positionX.Size = new System.Drawing.Size(120, 20);
            this.positionX.TabIndex = 4;
            this.positionX.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.positionX.ValueChanged += new System.EventHandler(this.positionX_ValueChanged);
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(12, 85);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(57, 26);
            this.label4.TabIndex = 3;
            this.label4.Text = "Position Y \r\n(Tile)";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(12, 47);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(57, 26);
            this.label3.TabIndex = 2;
            this.label3.Text = "Position X \r\n(Tile)";
            // 
            // mapList
            // 
            this.mapList.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.mapList.FormattingEnabled = true;
            this.mapList.Location = new System.Drawing.Point(156, 6);
            this.mapList.Name = "mapList";
            this.mapList.Size = new System.Drawing.Size(121, 21);
            this.mapList.TabIndex = 1;
            this.mapList.SelectedIndexChanged += new System.EventHandler(this.mapList_SelectedIndexChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(12, 9);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(28, 13);
            this.label2.TabIndex = 0;
            this.label2.Text = "Map";
            // 
            // giveItemPanel
            // 
            this.giveItemPanel.Controls.Add(this.itemAmount);
            this.giveItemPanel.Controls.Add(this.label7);
            this.giveItemPanel.Controls.Add(this.itemList);
            this.giveItemPanel.Controls.Add(this.label8);
            this.giveItemPanel.Location = new System.Drawing.Point(12, 12);
            this.giveItemPanel.Name = "giveItemPanel";
            this.giveItemPanel.Size = new System.Drawing.Size(286, 126);
            this.giveItemPanel.TabIndex = 6;
            this.giveItemPanel.Visible = false;
            // 
            // itemAmount
            // 
            this.itemAmount.Location = new System.Drawing.Point(156, 47);
            this.itemAmount.Maximum = new decimal(new int[] {
            1215752191,
            23,
            0,
            0});
            this.itemAmount.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.itemAmount.Name = "itemAmount";
            this.itemAmount.Size = new System.Drawing.Size(120, 20);
            this.itemAmount.TabIndex = 4;
            this.itemAmount.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.itemAmount.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.itemAmount.ValueChanged += new System.EventHandler(this.itemAmount_ValueChanged);
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(12, 47);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(43, 13);
            this.label7.TabIndex = 2;
            this.label7.Text = "Amount";
            // 
            // itemList
            // 
            this.itemList.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.itemList.FormattingEnabled = true;
            this.itemList.Location = new System.Drawing.Point(156, 6);
            this.itemList.Name = "itemList";
            this.itemList.Size = new System.Drawing.Size(121, 21);
            this.itemList.TabIndex = 1;
            this.itemList.SelectedIndexChanged += new System.EventHandler(this.itemList_SelectedIndexChanged);
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(12, 9);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(27, 13);
            this.label8.TabIndex = 0;
            this.label8.Text = "Item";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(130, 148);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(79, 13);
            this.label1.TabIndex = 1;
            this.label1.Text = "Next (Success)";
            // 
            // nextIndex
            // 
            this.nextIndex.Location = new System.Drawing.Point(215, 144);
            this.nextIndex.Maximum = new decimal(new int[] {
            99999999,
            0,
            0,
            0});
            this.nextIndex.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            -2147483648});
            this.nextIndex.Name = "nextIndex";
            this.nextIndex.Size = new System.Drawing.Size(83, 20);
            this.nextIndex.TabIndex = 2;
            this.nextIndex.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.nextIndex.Value = new decimal(new int[] {
            1,
            0,
            0,
            -2147483648});
            this.nextIndex.ValueChanged += new System.EventHandler(this.nextIndex_ValueChanged);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Font = new System.Drawing.Font("Microsoft Sans Serif", 6.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label6.Location = new System.Drawing.Point(195, 194);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(100, 12);
            this.label6.TabIndex = 35;
            this.label6.Text = "* -1 will close the dialog";
            // 
            // repeatable
            // 
            this.repeatable.AutoSize = true;
            this.repeatable.Location = new System.Drawing.Point(12, 148);
            this.repeatable.Name = "repeatable";
            this.repeatable.Size = new System.Drawing.Size(81, 17);
            this.repeatable.TabIndex = 36;
            this.repeatable.Text = "Repeatable";
            this.repeatable.UseVisualStyleBackColor = true;
            this.repeatable.CheckedChanged += new System.EventHandler(this.repeatable_CheckedChanged);
            // 
            // nextIndex1
            // 
            this.nextIndex1.Location = new System.Drawing.Point(215, 170);
            this.nextIndex1.Maximum = new decimal(new int[] {
            99999999,
            0,
            0,
            0});
            this.nextIndex1.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            -2147483648});
            this.nextIndex1.Name = "nextIndex1";
            this.nextIndex1.Size = new System.Drawing.Size(83, 20);
            this.nextIndex1.TabIndex = 38;
            this.nextIndex1.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.nextIndex1.Value = new decimal(new int[] {
            1,
            0,
            0,
            -2147483648});
            this.nextIndex1.ValueChanged += new System.EventHandler(this.nextIndex1_ValueChanged);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(128, 172);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(82, 13);
            this.label5.TabIndex = 37;
            this.label5.Text = "Next (Occurred)";
            // 
            // DialogueEventProperties
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(312, 215);
            this.Controls.Add(this.nextIndex1);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.giveItemPanel);
            this.Controls.Add(this.repeatable);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.nextIndex);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.loadMapPanel);
            this.DoubleBuffered = true;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MaximumSize = new System.Drawing.Size(328, 254);
            this.MinimumSize = new System.Drawing.Size(328, 254);
            this.Name = "DialogueEventProperties";
            this.Text = "WebClash Server - DialogEvent";
            this.Load += new System.EventHandler(this.DialogueEventProperties_Load);
            this.loadMapPanel.ResumeLayout(false);
            this.loadMapPanel.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.positionY)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.positionX)).EndInit();
            this.giveItemPanel.ResumeLayout(false);
            this.giveItemPanel.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.itemAmount)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nextIndex)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.nextIndex1)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Panel loadMapPanel;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.NumericUpDown nextIndex;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.CheckBox repeatable;
        private System.Windows.Forms.ComboBox mapList;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.NumericUpDown positionY;
        private System.Windows.Forms.NumericUpDown positionX;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Panel giveItemPanel;
        private System.Windows.Forms.NumericUpDown itemAmount;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.ComboBox itemList;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.NumericUpDown nextIndex1;
        private System.Windows.Forms.Label label5;
    }
}