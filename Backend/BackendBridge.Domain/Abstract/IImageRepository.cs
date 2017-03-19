using BackendBridge.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackendBridge.Domain.Abstract
{
    public interface IImageRepository
    {

        IEnumerable<Image> m_images { get; }
        Image Get(String name);
        void Add(Image image);
        Image Remove(String name);
    }
}
