using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace WebSocket.Behaviors
{
    public class Chat : WebSocketBehavior
    {
        private string _suffix;

        public Chat()
          : this(null)
        {
        }

        public Chat(string suffix)
        {
            _suffix = suffix ?? String.Empty;
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            Sessions.Broadcast(e.Data + _suffix);
        }
    }
}
