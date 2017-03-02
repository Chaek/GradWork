using System;
using System.Management;
using WebSocketsClientServer.Behaviors;
using WebSocketSharp.Server;

namespace WebSocketsClientServer
{

    class Server
    {
        static void Main(string[] args)
        {
            var wssv = new WebSocketServer("ws://localhost:8000");
            wssv.AddWebSocketService<PrinterInfoUpdate>("/PrinterInfoUpdate");
            wssv.AddWebSocketService<ImageUpdate>("/ImageUpdate");

            wssv.Start();

            Console.ReadKey(true);
            wssv.Stop();
            
        }
    }
}
