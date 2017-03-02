using System.Collections.Generic;
using WebSocketsClientServer.Models;
using WebSocketSharp;
using WebSocketSharp.Server;
using System.Management;
using System;

namespace WebSocketsClientServer.Behaviors
{
    class PrinterInfoUpdate : WebSocketBehavior
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
                    Name = (string)printer.GetPropertyValue("Name"),
                    Status = (string)printer.GetPropertyValue("Status"),
                    IsDefault = (bool)printer.GetPropertyValue("Default"),
                    IsNetworkPrinter = (bool)printer.GetPropertyValue("Network")
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
                mes = "All printers we have at the moment",
                type = ResponseModel<Printer>.PRINTER_SUBMODEL,
                data = printers,
            };

            var json = Newtonsoft.Json.JsonConvert.SerializeObject(res);

            Send(json);
        }
    }
}
