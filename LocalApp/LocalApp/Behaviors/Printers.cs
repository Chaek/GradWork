using System.Collections.Generic;
using WebSocketsClientServer.Models;
using WebSocketSharp;
using WebSocketSharp.Server;
using System.Management;
using System;
using System.Drawing;
using System.IO;

namespace WebSocketsClientServer.Behaviors
{
    static class Printers
    {
        public class Print : WebSocketBehavior
        {
            static int counter = 0;

            protected override void OnMessage(MessageEventArgs e)
            {
                var data = e.Data;
                //string file = "../../../images/ordinary_cat.jpg";
                //string name = Path.GetFileName(file);

                using (var pd = new System.Drawing.Printing.PrintDocument())
                {
                    pd.PrintPage += (a, b) =>
                    {
                        //in case of printing an image
                        //var img = System.Drawing.Image.FromFile(file);

                        b.Graphics.DrawString(data, 
                            new Font("Times New Roman", 30), 
                            new SolidBrush(Color.Black), 
                            new RectangleF(0, 0, 
                            pd.DefaultPageSettings.PrintableArea.Width, 
                            pd.DefaultPageSettings.PrintableArea.Height)
                        );

                        // This uses a 50 pixel margin - adjust as needed
                        //b.Graphics.DrawImage(img, new Point(50, 50));
                        
                    };
                    pd.EndPrint += (sender, ev) => {
                        ResponseModel<Printer> response = new ResponseModel<Printer>
                        {
                            mes = ResponseModel<Printer>.OK,
                            type = ResponseModel<Printer>.PRINTER_SUBMODEL,
                            data = { }
                        };

                        var json = Newtonsoft.Json.JsonConvert.SerializeObject(response);
                        Send(json);
                    };
                    
                    pd.PrinterSettings.PrintToFile = true;
                    pd.PrinterSettings.PrintFileName = "../../../printed/" + counter + ".oxps";
                    counter++;
                    pd.PrinterSettings.PrinterName = "Microsoft XPS Document Writer";
                    try
                    {
                        pd.Print();
                    }
                    catch (Exception ex)
                    {
                        ResponseModel<Exception> response = new ResponseModel<Exception>
                        {
                            mes = ResponseModel<Printer>.ERROR,
                            type = ResponseModel<Printer>.PRINTER_SUBMODEL,
                            data = ex
                        };

                        var json = Newtonsoft.Json.JsonConvert.SerializeObject(response);
                        Send(json);
                    }
                }
            }
        }

        public class Info : WebSocketBehavior
        {
            private IEnumerable<Printer> printers = null;

            private void updatePrinters()
            {
                List<Printer> printersUpdated = new List<Printer>();
                var printerQuery = new ManagementObjectSearcher("SELECT * from Win32_Printer");
                foreach (var printer in printerQuery.Get())
                {
                    Printer printerObj = new Printer()
                    {
                        name = (string)printer.GetPropertyValue("Name"),
                        status = (string)printer.GetPropertyValue("Status"),
                        isDefault = (bool)printer.GetPropertyValue("Default"),
                        isNetworkPrinter = (bool)printer.GetPropertyValue("Network")
                    };

                    printersUpdated.Add(printerObj);
                }
                printers = printersUpdated;
            }

            protected override void OnMessage(MessageEventArgs e)
            {
                updatePrinters();

                ResponseModel<IEnumerable<Printer>> res = new ResponseModel<IEnumerable<Printer>>
                {
                    mes = ResponseModel<Printer>.OK,
                    type = ResponseModel<Printer>.PRINTER_SUBMODEL,
                    data = printers,
                };

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(res);

                Send(json);
            }
        }
    }
}
