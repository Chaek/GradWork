using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProtocolParser
{
    class Program
    {

        public class Example
        {
            public string Email { get; set; }
        }

        public class Protocol
        {
            
            public Object example{ get; set; }
            public string Email { get; set; }
            public bool Active { get; set; }
            public DateTime CreatedDate { get; set; }
            public IList<string> Roles { get; set; }
        }

        static void Main(string[] args)
        {
            string json = @"{
                'example': {
                    'Email': 'ankarenkosergey@gmail.com'
                },
                'Email': 'james@example.com',
                'Active': true,
                'CreatedDate': '2013-01-20T00:00:00Z',
                'Roles': [
                    'User',
                    'Admin'
                ]
            }";
            
            Protocol acc = JsonConvert.DeserializeObject<Protocol>(json);
            Console.WriteLine(acc.example);
            Example ex = JsonConvert.DeserializeObject<Example>(acc.example.ToString());
            Console.WriteLine(ex.Email);
            Console.Read();
        }
    }
}
