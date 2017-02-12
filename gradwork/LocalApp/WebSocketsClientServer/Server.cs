using System;
using WebSocket.Behaviors;
using WebSocketsClientServer.Behaviors;
using WebSocketsClientServer.Models;
using WebSocketSharp.Server;

namespace WebSocketsClientServer
{
    class Server
    {
        static void Main(string[] args)
        {
            var wssv = new WebSocketServer("ws://localhost:8000");
            wssv.AddWebSocketService<Echo>("/Echo");
            wssv.AddWebSocketService<Chat>("/Chat");
            wssv.AddWebSocketService<GiveMeJson>("/GiveMeJson");

            wssv.Start();

            Console.ReadKey(true);
            wssv.Stop();
        }
    }
}
