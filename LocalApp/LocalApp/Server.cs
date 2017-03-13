using System;
using System.Diagnostics;
using System.Management;
using WebSocketsClientServer.Behaviors;
using WebSocketSharp.Server;

namespace WebSocketsClientServer
{

    class Server
    {
        static void Main(string[] args)
        {
            /*
            ProcessStartInfo startInfo = new ProcessStartInfo("C:/Users/ankar_000/Desktop/gradwork/LocalApp/images/ordinary_cat.jpg");
            startInfo.Verb = "edit";

            Console.WriteLine("starting");
            var i = 0;
            Process editor = Process.Start(startInfo);
            editor.Exited += (a, b) => { i = 1; };
            */
            

            
            var wssv = new WebSocketServer("ws://localhost:8000");
            wssv.AddWebSocketService<Behaviors.Printers.Info>("/Printers/Info");
            wssv.AddWebSocketService<Behaviors.Images.Update>("/Images/Update");
            wssv.AddWebSocketService<Behaviors.Images.Edit>("/Images/Edit");
            wssv.AddWebSocketService<Behaviors.Printers.Print>("/Printers/Print");
            wssv.Start();
            
            Console.ReadKey(true);
            wssv.Stop();
            
            
        }
    }
}
