using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketsClientServer.Models;

namespace WebSocketsClientServer.Concrete
{

    public class EFDbContext : DbContext
    {
        public DbSet<ImageRecord> ImageRecords { get; set; }
    }
}
