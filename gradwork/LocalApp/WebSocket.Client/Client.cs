using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSocket.Client
{
    class Client
    {
        static void Main(string[] args)
        {
            using (var ws = new WebSocketSharp.WebSocket("ws://localhost:80/Chat"))
            {
                ws.OnMessage += (sender, e) =>
                    Console.WriteLine("Laputa says: " + e.Data);

                ws.Connect();
                ws.Send("BALUS");
                while (true)
                {
                    string msg = Console.ReadLine();
                    ws.Send(msg);
                }
                Console.ReadKey(true);
            }
        }
    }
}
