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
            wssv.AddWebSocketService<Behaviors.Printers.Info>("/Printers/Info");
            wssv.AddWebSocketService<Behaviors.Images.Update>("/Images/Update");
            wssv.AddWebSocketService<Behaviors.Printers.Scan>("/Printers/Scan");

            wssv.Start();

            Console.ReadKey(true);
            wssv.Stop();
            
        }
    }
}
