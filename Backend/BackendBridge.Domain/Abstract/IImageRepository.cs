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
        Image Get(int ID);
        int Add(Image picture);
        Image Remove(int ID);
    }
}
