using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketsClientServer.Abstract;
using WebSocketsClientServer.Models;

namespace WebSocketsClientServer.Concrete
{
    public class EFImageRecordsRepository : IImageRecordsRepository
    {
        private EFDbContext m_context = new EFDbContext();
        public IEnumerable<ImageRecord> records
        {
            get { return m_context.ImageRecords; }
        }

        public void Add(ImageRecord record)
        {
            ImageRecord dbEntry = Find(record.Name);
            if (dbEntry == null)
            {
                m_context.ImageRecords.Add(record);
            }
            else
            {
                dbEntry.ImageID = record.ImageID;
                dbEntry.IsDirty = record.IsDirty;
            }
            m_context.SaveChanges();
        }

        public void Add(IEnumerable<ImageRecord> records)
        {
            foreach (var record in records)
            {
                ImageRecord dbEntry = Find(record.Name);
                if (dbEntry == null)
                {
                    m_context.ImageRecords.Add(record);
                }
                else
                {
                    dbEntry.ImageID = record.ImageID;
                    dbEntry.IsDirty = record.IsDirty;
                }
            }
            m_context.SaveChanges();
            
        }

        public void Clear()
        {
            m_context.ImageRecords.RemoveRange(m_context.ImageRecords);
            m_context.SaveChanges();
        }

        public ImageRecord Find(String name)
        {
            return m_context.ImageRecords.Where(v => v.Name == name).FirstOrDefault();
        }

        public ImageRecord Remove(String name)
        {
            ImageRecord dbEntry = Find(name);
            if (dbEntry != null)
            {
                m_context.ImageRecords.Remove(dbEntry);
                m_context.SaveChanges();
            }
            return dbEntry;
        }
    }
}
