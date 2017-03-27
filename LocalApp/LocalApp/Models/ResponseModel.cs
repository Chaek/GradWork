using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSocketsClientServer.Models
{
    public enum DataType { PRODUCT = 0, IMAGE, ERROR };

    //some constraints on T should be added
    public class ResponseModel<T>
    {
        public static readonly string COMMAND_STATUS_NOTHING = "COMMAND_STATUS_NOTHING";
        public static readonly string COMMAND_STATUS_FAIL = "COMMAND_STATUS_NOTHING";
        public static readonly string COMMAND_STATUS_OK = "COMMAND_STATUS_OK";
        public static readonly string COMMAND_STATUS_WAITING = "COMMAND_STATUS_OK";

        public static readonly string COMMAND_TYPE_NOTHING = "COMMAND_TYPE_NOTHING";
        public static readonly string COMMAND_TYPE_PRINT = "COMMAND_TYPE_PRINT";
        public static readonly string COMMAND_TYPE_SCAN = "COMMAND_TYPE_SCAN";
        public static readonly string COMMAND_TYPE_WAITING = "COMMAND_TYPE_WAITING";
        public static readonly string COMMAND_TYPE_EDIT = "COMMAND_TYPE_EDIT";

        public static readonly string IMAGE_SUBMODEL = "IMAGE";
        public static readonly string PRINTER_SUBMODEL = "PRINTER";
        public static readonly string PRODUCT_SUBMODEL = "PRODUCT";

        
        ///
        public static readonly string ERROR = "ERROR";
        public static readonly string OK = "OK";
        public static readonly string PRINTER = "PRINTER";

        public string type;
        public String mes;
        public T data { get; set; }
    }
}
