using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSocketsClientServer.Models
{
    public class ImageRecord
    {
        public int ImageID { get; set; }
        [Key]
        public String Name { get; set; }
        public bool IsDirty { get; set; }
    }
}
