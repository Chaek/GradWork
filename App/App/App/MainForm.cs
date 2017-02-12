using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace App
{
    public partial class MainForm : Form
    {
        string base64image = "";
        public MainForm()
        {
            InitializeComponent();
        }

        private void openFileButton_Click(object sender, EventArgs e)
        {
            if (openFileDialog1.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {
                System.IO.StreamReader sr = new System.IO.StreamReader(openFileDialog1.FileName);
                var bytes = default(byte[]);
                using (var memstream = new MemoryStream())
                {
                    sr.BaseStream.CopyTo(memstream);
                    bytes = memstream.ToArray();
                }

                string base64Image = Convert.ToBase64String(bytes);
                sr.Close();
            }
        }
    }
}
