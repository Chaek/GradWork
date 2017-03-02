using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSocketsClientServer.Helpers
{
    static class ConvertHelper
    {
        public static void ToByteArrayFromStream(/*const(error)*/StreamReader sr, out byte[] bytes)
        {
            using (var memstream = new MemoryStream())
            {
                sr.BaseStream.CopyTo(memstream);
                bytes = memstream.ToArray();
            }
        }

        public static void ToBase64StringFromFile(string fileName, out string base64)
        {
            System.IO.StreamReader sr = new System.IO.StreamReader(fileName);
            var bytes = default(byte[]);
            ToByteArrayFromStream(sr, out bytes);

            base64 = Convert.ToBase64String(bytes);
            sr.Close();
        }
    }
}
