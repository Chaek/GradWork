using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketsClientServer.Models;

namespace WebSocketsClientServer.Helpers
{
    static class ResponseConstructor<T>
    {
        static public String GetErrorResponse(T data, String type)
        {
            ResponseModel<T> error = new ResponseModel<T>
            {
                type = type,
                mes = ResponseModel<T>.ERROR,
                data = data
            };
            return Newtonsoft.Json.JsonConvert.SerializeObject(error);
        }

        static public String GetSuccessResponse(T data, String type)
        {
            ResponseModel<T> success = new ResponseModel<T>
            {
                type = type,
                mes = ResponseModel<T>.OK,
                data = data
            };
            return Newtonsoft.Json.JsonConvert.SerializeObject(success);
        }
    }
}
