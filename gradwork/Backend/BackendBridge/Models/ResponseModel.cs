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
        public DataType type;
        public String mes;
        public T data { get; set; }
    }
}