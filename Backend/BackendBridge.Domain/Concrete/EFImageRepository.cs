using BackendBridge.Domain.Abstract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BackendBridge.Domain.Entity;

namespace BackendBridge.Domain.Concrete
{
    public class EFImageRepository : IImageRepository
    {
        private EFDbContext m_context = new EFDbContext();

        public IEnumerable<Image> m_images
        {
            get
            {
                return m_context.Images;
            }
        }

        public void Add(Image record)
        {
            Image dbEntry = Get(record.name);
            if (dbEntry != null)
            {
                dbEntry.data = record.data;
            }
            else
            {
                m_context.Images.Add(record);
            }
            m_context.SaveChanges();
        }

        public Image Get(string name)
        {
            return m_images.FirstOrDefault(rec => rec.name == name);
        }

        public Image Remove(string name)
        {
            Image dbEntry = Get(name);
            if (dbEntry != null)
            {
                m_context.Images.Remove(dbEntry);
                m_context.SaveChanges();
            }
            return dbEntry;
        }
    }
}
