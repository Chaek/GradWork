using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BackendBridge.Models
{
    
    public enum DataType { PRODUCT, IMAGE, ERROR };

    //some constraints on T should be added
    public class ResponseModel<T>
    {
        public static readonly string IMAGE_SUBMODEL = "IMAGE";
        public static readonly string PRINTER_SUBMODEL = "PRINTER";
        public static readonly string PRODUCT_SUBMODEL = "PRODUCT";
        public static readonly string ERROR = "ERROR";
        public static readonly string OK = "OK";

        public string type;
        public String mes;
        public T data { get; set; }
    }
}