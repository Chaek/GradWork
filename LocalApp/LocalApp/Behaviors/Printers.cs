using System.Collections.Generic;
using WebSocketsClientServer.Models;
using WebSocketSharp;
using WebSocketSharp.Server;
using System.Management;
using System;
using System.Drawing;
using System.IO;
using System.Printing;

namespace WebSocketsClientServer.Behaviors
{
    static class Printers
    {

        public class Print : WebSocketBehavior
        {
            private String SpotTroubleUsingJobAttributes(PrintSystemJobInfo theJob)
            {
                if ((theJob.JobStatus & PrintJobStatus.Blocked) == PrintJobStatus.Blocked)
                {
                    return "The job is blocked.";
                }
                if (((theJob.JobStatus & PrintJobStatus.Completed) == PrintJobStatus.Completed)
                    ||
                    ((theJob.JobStatus & PrintJobStatus.Printed) == PrintJobStatus.Printed))
                {
                    return "The job has finished. Have user recheck all output bins and be sure the correct printer is being checked.";
                }
                if (((theJob.JobStatus & PrintJobStatus.Deleted) == PrintJobStatus.Deleted)
                    ||
                    ((theJob.JobStatus & PrintJobStatus.Deleting) == PrintJobStatus.Deleting))
                {
                    return "The user or someone with administration rights to the queue has deleted the job. It must be resubmitted.";
                }
                if ((theJob.JobStatus & PrintJobStatus.Error) == PrintJobStatus.Error)
                {
                    return "The job has errored.";
                }
                if ((theJob.JobStatus & PrintJobStatus.Offline) == PrintJobStatus.Offline)
                {
                    return "The printer is offline. Have user put it online with printer front panel.";
                }
                if ((theJob.JobStatus & PrintJobStatus.PaperOut) == PrintJobStatus.PaperOut)
                {
                    return "The printer is out of paper of the size required by the job. Have user add paper.";
                }
                if ((theJob.JobStatus & PrintJobStatus.Printing) == PrintJobStatus.Printing)
                {
                    return "The job is printing now.";
                }
                if ((theJob.JobStatus & PrintJobStatus.Spooling) == PrintJobStatus.Spooling)
                {
                    return "The job is spooling now.";
                }
                if ((theJob.JobStatus & PrintJobStatus.UserIntervention) == PrintJobStatus.UserIntervention)
                {
                    return "The printer needs human intervention.";
                }
                else return "Nothing";
            }

            protected override void OnMessage(MessageEventArgs e)
            {
                ResponseModel<DataToPrint> obj = Newtonsoft.Json.JsonConvert
                    .DeserializeObject<ResponseModel<DataToPrint>>(e.Data);

                DataToPrint data = obj.data;
                Models.Image imageToPrint = data.image;
                Printer printerInfo = data.printer;

                string base64 = Helpers.ConvertHelper.RemoveBase64Prefix(imageToPrint.data);
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

                    pd.EndPrint += (sender, ev) =>
                    {
                        //try it // should return status of printing
                        /*
                        PrintServer myPrintServer = new LocalPrintServer();
                        PrintQueueCollection myPrintQueues = myPrintServer.GetPrintQueues();
                        foreach (PrintQueue pq in myPrintQueues)
                        {
                            pq.Refresh();
                            PrintJobInfoCollection pCollection = pq.GetPrintJobInfoCollection();
                            foreach (PrintSystemJobInfo job in pCollection)
                            {
                                var res = SpotTroubleUsingJobAttributes(job);
                            }
                        }*/
                    };

                    if (printerInfo.name == "Microsoft XPS Document Writer")
                    {
                        pd.PrinterSettings.PrintToFile = true;
                        pd.PrinterSettings.PrintFileName = "../../../printed/" + imageToPrint.name + ".oxps";
                    }
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
