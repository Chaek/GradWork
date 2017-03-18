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
            get { return m_context.Images; }
        }

        public int Add(Image image)
        {
            if (image.ID == 0)
            {
                m_context.Images.Add(image);
            }
            else
            {
                Image dbEntry = m_context.Images.Find(image.ID);
                if (dbEntry != null)
                {
                    dbEntry.Name = image.Name;
                    dbEntry.ID = image.ID;
                    dbEntry.Data = image.Data;
                    //data
                }
            }
            m_context.SaveChanges();
            return image.ID;
        }

        public Image Get(int ID)
        {
            return m_context.Images.FirstOrDefault((im) => im.ID == ID);
        }

        public Image Remove(int ID)
        {
            Image dbEntry = m_context.Images.Find(ID);
            if (dbEntry != null)
            {
                m_context.Images.Remove(dbEntry);
                m_context.SaveChanges();
                System.Diagnostics.Debug.WriteLine(string.Format("Removed"));
            }
            return dbEntry;
        }
    }
}
