using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace WebSocketsClientServer.Behaviors
{
    class PrinterScan : WebSocketBehavior
    {
        protected override void OnMessage(MessageEventArgs e)
        {
            //Send("Printer Scan is here");
        }
    }
}
