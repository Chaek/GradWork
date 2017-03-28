using System;
using System.Diagnostics;
using System.Management;
using WebSocketsClientServer.Behaviors;
using WebSocketSharp.Server;
using WebSocketsClientServer.Abstract;
using WebSocketsClientServer.Concrete;
using System.Collections.Generic;
using WebSocketsClientServer.Models;


namespace WebSocketsClientServer
{

    class Server
    {
        static void Main(string[] args)
        {
            //Sychronize database records with local files
            //Images.Initialize();

            var wssv = new WebSocketServer("ws://localhost:8000");
            wssv.AddWebSocketService<Printers.Info>("/Printers/Info");
            wssv.AddWebSocketService<Images.Update>("/Images/Update");
            wssv.AddWebSocketService<Images.Synchronize>("/Images/Synchronize");
            wssv.AddWebSocketService<Images.Edit>("/Images/Edit");
            wssv.AddWebSocketService<Printers.Print>("/Printers/Print");
            wssv.AddWebSocketService<Scanners.Scan>("/Scanners/Scan");
            wssv.AddWebSocketService<Scanners.Info>("/Scanners/Info");
            wssv.Start();
            
            Console.ReadKey(true);
            wssv.Stop();
            
            
        }
    }
}
