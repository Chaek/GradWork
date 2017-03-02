using BackendBridge.Domain.Abstract;
using BackendBridge.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendBridge.Domain.Concrete
{
    public class EFProductRepository : IProductRepository
    {

        static int counter = 0;
        public EFProductRepository()
        {
            System.Diagnostics.Debug.WriteLine(string.Format("Instance {0} created", ++counter));
        }

        private EFDbContext context = null; //new EFDbContext();
        public IEnumerable<Product> Products
        {
            get { return context.Products; }
        }

        public void Add(Product product)
        {
            if (product.ProductID == 0)
            {
                context.Products.Add(product);
            }
            else
            {
                Product dbEntry = context.Products.Find(product.ProductID);
                if (dbEntry != null)
                {
                    dbEntry.Name = product.Name;
                    dbEntry.Description = product.Description;
                    dbEntry.Price = product.Price;
                    dbEntry.Category = product.Category;
                }
            }
            context.SaveChanges();
        }

        public Product Get(int id)
        {
            return context.Products.FirstOrDefault((p) => p.ProductID == id);
        }

        public Product Remove(int id)
        {
            Product dbEntry = context.Products.Find(id);
            if (dbEntry != null)
            {
                context.Products.Remove(dbEntry);
                context.SaveChanges();
                System.Diagnostics.Debug.WriteLine(string.Format("Removed"));
            }
            return dbEntry;
        }
    }
}
