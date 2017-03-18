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
        readonly ResponseModel<Image> successful = new ResponseModel<Image>
        {
            mes = ResponseModel<Image>.OK,
            type = ResponseModel<Image>.IMAGE_SUBMODEL,
            data = { },
        };

        ResponseModel<Exception> unsuccessful = new ResponseModel<Exception>
        {
            mes = ResponseModel<Image>.ERROR,
            type = ResponseModel<Image>.IMAGE_SUBMODEL,
            data = { },
        };

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
                mes = ResponseModel<Image>.OK,
                type = ResponseModel<Image>.IMAGE_SUBMODEL,
                data = repository.m_images,
            };
            return Ok(res);
        }

        [System.Web.Http.HttpPost]
        public IHttpActionResult PostCollection(IEnumerable<Image> images)
        {
            if (images == null)
            {
                throw new ArgumentNullException("item");
            }

            try
            {
                foreach (var im in images)
                {
                    repository.Add(im);
                }
            }
            catch (Exception e)
            {
                unsuccessful.data = e;
                return Content(HttpStatusCode.BadRequest, unsuccessful);
            }
            ResponseModel<Image> res = new ResponseModel<Image>
            {
                mes = ResponseModel<Image>.OK,
                type = ResponseModel<Image>.IMAGE_SUBMODEL,
                data = { },
            };
            return Ok(successful);
        }

        [System.Web.Http.HttpPost]
        public IHttpActionResult Post(Image image)
        {
            UInt64 ID = 0;
            if (image == null)
            {
                throw new ArgumentNullException("item");
            }

            //try catch
            try
            {
                ID = Convert.ToUInt32(repository.Add(image));
            }
            catch (Exception e)
            {
                unsuccessful.data = e;
                return Content(HttpStatusCode.BadRequest, unsuccessful);
            }
            ResponseModel<Image> res = new ResponseModel<Image>
            {
                mes = ResponseModel<Image>.OK,
                type = ResponseModel<Image>.IMAGE_SUBMODEL,
                data = new Image()
                {
                    ID = Convert.ToInt32(ID),
                    Name = image.Name,
                    Data = ""
                },
            };
            return Ok(res);
        }

        [System.Web.Http.HttpDelete]
        public IHttpActionResult Remove(Image image)
        {

            //try catch
            try
            {
                repository.Remove(image.ID);
            }
            catch (Exception e)
            {
                unsuccessful.data = e;
                return Content(HttpStatusCode.BadRequest, unsuccessful);
            }
            
            return Ok(successful);
        }
    }
}
