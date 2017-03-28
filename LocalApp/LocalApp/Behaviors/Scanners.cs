using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketsClientServer.Helpers;
using WebSocketsClientServer.Models;
//using WebSocketsClientServer.Models;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace WebSocketsClientServer.Behaviors
{
    static class Scanners
    {
        public class Scan : WebSocketBehavior
        {

            protected override void OnMessage(MessageEventArgs e)
            {
                try
                {
                    ResponseModel<String> obj = Newtonsoft.Json.JsonConvert
                    .DeserializeObject<ResponseModel<String>>(e.Data);

                    String name = obj.data;

                    string device_name = WIAScanner.GetDevices().FirstOrDefault(n => n == name);

                    //check if device is not available
                    if (device_name == null)
                    {
                        throw new Exception("There is no such device");
                    }
                    //get images from scanner
                    //WIAScanner.Scan()
                    List<System.Drawing.Image> images = WIAScanner.Scan(device_name);
                    foreach (System.Drawing.Image image in images)
                    {
                        //DOSOMETHING
                    }
                }
                catch (Exception ex)
                {
                    ResponseModel<Exception> response = new ResponseModel<Exception>
                    {
                        mes = ResponseModel<Object>.ERROR,
                        type = ResponseModel<Object>.SCANNER,
                        data = ex
                    };

                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(response);
                    Send(json);
                }
            }
        }

        public class Info : WebSocketBehavior
        {

            protected override void OnMessage(MessageEventArgs e)
            {
                try
                {
                    IEnumerable<string> devices = WIAScanner.GetDevices();
                    ResponseModel<IEnumerable<string>> res = new ResponseModel<IEnumerable<string>>
                    {
                        mes = ResponseModel<Object>.OK,
                        type = ResponseModel<Object>.SCANNER,
                        data = new List<string>() { "ONE", "SECOND"}//devices
                    };

                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(res);
                    Send(json);
                }
                catch (Exception ex)
                {
                    ResponseModel<Exception> response = new ResponseModel<Exception>
                    {
                        mes = ResponseModel<Object>.ERROR,
                        type = ResponseModel<Object>.SCANNER,
                        data = ex
                    };

                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(response);
                    Send(json);
                }
            }
        }
    }
}
