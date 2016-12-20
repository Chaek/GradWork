using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSocketsClientServer.Models
{
    internal class TextMessage
    {
        [JsonProperty("ProductID")]
        public uint? ProductID
        {
            get; set;
        }

        [JsonProperty("Name")]
        public string Name
        {
            get; set;
        }

        [JsonProperty("Description")]
        public string Description
        {
            get; set;
        }

        [JsonProperty("message")]
        public string Message
        {
            get; set;
        }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}

