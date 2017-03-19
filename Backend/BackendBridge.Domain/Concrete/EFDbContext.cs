using BackendBridge.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendBridge.Domain.Concrete
{
    public class EFDbContext : DbContext
    {
        public DbSet<Image> Images { get; set; }
    }

}
