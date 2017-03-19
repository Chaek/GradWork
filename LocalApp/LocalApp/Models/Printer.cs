using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSocketsClientServer.Models
{
    class Printer
    {
        public string name { get; set; }
        public string status { get; set; }
        public bool isDefault { get; set; }
        public bool isNetworkPrinter { get; set; }
    }
}
