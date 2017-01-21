using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackendBridge.Models
{
    public enum States { Error = -1, Message, Picture };
    public class Protocol
    {
        public States state { get; set; }
        public string mes { get; set; }
        public Object data { get; set; }
    }
}