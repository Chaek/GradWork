using System;
using WebSocketsClientServer.Behaviors;
using WebSocketSharp.Server;

namespace WebSocketsClientServer
{

    class Server
    {
        static void Main(string[] args)
        {
            /*
            ImageUpdate a = new ImageUpdate();
            a.UpdateImages();
            */

            var wssv = new WebSocketServer("ws://localhost:8000");
            wssv.AddWebSocketService<PrinterInfoUpdate>("/PrinterInfoUpdate");
            wssv.AddWebSocketService<ImageUpdate>("/ImageUpdate");

            wssv.Start();

            Console.ReadKey(true);
            wssv.Stop();
        }
    }
}
