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

        [System.Web.Http.HttpGet]
        public IHttpActionResult All()
        {
            ResponseModel<IEnumerable<Image> > res = new ResponseModel<IEnumerable<Image> >
            {
                mes = "All images!",
                type = ResponseModel<Image>.IMAGE_SUBMODEL,
                data = repository.m_images,
            };

            return Ok(res);
        }

        [System.Web.Http.HttpPost]
        public IHttpActionResult Post(Image image)
        {
            if (image == null)
            {
                throw new ArgumentNullException("item");
            }

            //try catch
            repository.Add(image);
            return Ok();
        }
    }
}
