using System;
using System.Collections.Generic;
using System.Drawing;
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

        public static void ImageToByteArray(System.Drawing.Image imageIn, out byte[] bytes)
        {
            using (var ms = new MemoryStream())
            {
                imageIn.Save(ms, System.Drawing.Imaging.ImageFormat.Gif);
                bytes = ms.ToArray();
            }
        }

        public static void ToBase64FromImage(Image im, out string base64)
        {
            byte[] bytes;
            ImageToByteArray(im, out bytes);
            base64 = Convert.ToBase64String(bytes);
        }

        public static String AddBase64Prefix(String str)
        {
            return "data:image/jpeg;base64," + str;
        }

        public static String RemoveBase64Prefix(String str)
        {
            int count = "data:image/jpeg;base64,".Length;
            //remove redudant part of the image data
            return str.Remove(0, count);
      
        }
    }
}
