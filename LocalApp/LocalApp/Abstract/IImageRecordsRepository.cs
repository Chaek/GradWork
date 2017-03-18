

using System;
using System.Collections.Generic;
using WebSocketsClientServer.Models;

namespace WebSocketsClientServer.Abstract
{
    public interface IImageRecordsRepository
    {
        void Clear();
        void Add(ImageRecord record);
        void Add(IEnumerable<ImageRecord> records);
        ImageRecord Remove(String name);
        ImageRecord Find(String name);
    }
}
