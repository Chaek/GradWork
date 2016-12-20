using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketsClientServer.Models;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace WebSocketsClientServer.Behaviors
{
    class GiveMeJson : WebSocketBehavior
    {
        protected override void OnMessage(MessageEventArgs e)
        {
            TextMessage msg = new TextMessage();
            //let's pretend we got it from db
            msg.Name = "Sergey";
            msg.ProductID = 1;
            msg.Description = "Hello, world";

            Send(msg.ToString());

        }
    }
}
