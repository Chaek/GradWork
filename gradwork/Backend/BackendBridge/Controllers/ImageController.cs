using BackendBridge.Domain.Entity;
using BackendBridge.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BackendBridge.Domain.Abstract;

namespace BackendBridge.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ImageController : ApiController
    {
        public IImageRepository repository;
        public ImageController(IImageRepository imageRepository)
        {
            this.repository = imageRepository;
        }
        
        public IHttpActionResult GetAll()
        {
            ResponseModel<IEnumerable<Image> > res = new ResponseModel<IEnumerable<Image> >
            {
                mes = "All products!",
                type = DataType.PRODUCT,
                data = repository.m_images,
            };

            return Ok(res);
        }
    }
}
