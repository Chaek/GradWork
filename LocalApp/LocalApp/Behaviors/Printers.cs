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
                ResponseModel<DataToPrint> obj = Newtonsoft.Json.JsonConvert
                    .DeserializeObject<ResponseModel<DataToPrint>>(e.Data);

                DataToPrint data = obj.data;
                Models.Image imageToPrint = data.image;
                Printer printerInfo = data.printer;
                int count = "data:image/jpeg;base64,".Length;
                //remove redudant part of the image data
                string base64 = imageToPrint.data.Remove(0, count);
                
                byte[] bytes = Convert.FromBase64String(base64);

                string file = "../../../images/" + imageToPrint.name;

                using (var pd = new System.Drawing.Printing.PrintDocument())
                {
                    pd.PrintPage += (a, b) =>
                    {
                        //in case of printing an image
                        using (var ms = new System.IO.MemoryStream(bytes))
                        {
                            using (var img = System.Drawing.Image.FromStream(ms))
                            {
                                // This uses a 50 pixel margin - adjust as needed
                                b.Graphics.DrawImage(img, new Point(50, 50));
                            }
                        }
                    };
                    
                    pd.EndPrint += (sender, ev) => {
                        
                    };
                    
                    pd.PrinterSettings.PrintToFile = true;
                    pd.PrinterSettings.PrintFileName = "../../../printed/" + imageToPrint.name + ".oxps";
                    counter++;
                    pd.PrinterSettings.PrinterName = printerInfo.name;

                    try
                    {
                        pd.Print();
                        ResponseModel<Printer> response = new ResponseModel<Printer>
                        {
                            mes = ResponseModel<Printer>.OK,
                            type = ResponseModel<Printer>.PRINTER,
                            data = { }
                        };

                        var json = Newtonsoft.Json.JsonConvert.SerializeObject(response);
                        Send(json);
                    }
                    catch (Exception ex)
                    {
                        
                        ResponseModel<Exception> response = new ResponseModel<Exception>
                        {
                            mes = ResponseModel<Printer>.ERROR,
                            type = ResponseModel<Printer>.PRINTER,
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
                try
                {
                    updatePrinters();


                    ResponseModel<IEnumerable<Printer>> res = new ResponseModel<IEnumerable<Printer>>
                    {
                        mes = ResponseModel<Printer>.OK,
                        type = ResponseModel<Printer>.PRINTER,
                        data = printers,
                    };

                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(res);

                    Send(json);
                }
                catch (Exception ex)
                {

                    ResponseModel<Exception> res = new ResponseModel<Exception>
                    {
                        mes = ResponseModel<Printer>.ERROR,
                        type = ResponseModel<Printer>.PRINTER,
                        data = ex,
                    };
                }
            }
        }
    }
}
