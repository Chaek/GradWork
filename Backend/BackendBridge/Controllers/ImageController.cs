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
        private IImageRepository m_repository;

        public ImageController(IImageRepository repository)
        {
            m_repository = repository;
        }

        private ResponseModel<Image> successful = new ResponseModel<Image>
        {
            mes = ResponseModel<Image>.OK,
            type = ResponseModel<Image>.IMAGE_RECORD_SUBMODEL,
            data = { },
        };

        private ResponseModel<Exception> unsuccessful = new ResponseModel<Exception>
        {
            mes = ResponseModel<Image>.ERROR,
            type = ResponseModel<Image>.IMAGE_RECORD_SUBMODEL,
            data = { },
        };

        [System.Web.Http.HttpGet]
        public IHttpActionResult All()
        {
            ResponseModel<IEnumerable<Image>> res;
            try
            {
                var images = m_repository.m_images;
                res = new ResponseModel<IEnumerable<Image>>
                {
                    mes = ResponseModel<Image>.OK,
                    type = ResponseModel<Image>.IMAGE_RECORD_SUBMODEL,
                    data = m_repository.m_images
                };
                
            }
            catch (Exception e)
            {
                unsuccessful.data = e;
                return Content(HttpStatusCode.BadRequest, unsuccessful);
            }
            return Ok(res);

        }

        [System.Web.Http.HttpPost]
        public IHttpActionResult Post(Image record)
        {
            try
            {
                if (record == null)
                {
                    throw new ArgumentNullException("Argument is null");
                }

                m_repository.Add(record);
            }
            catch (Exception e)
            {
                unsuccessful.data = e;
                return Content(HttpStatusCode.BadRequest, unsuccessful);
            }

            return Ok(successful);
        }

        [System.Web.Http.HttpDelete]
        public IHttpActionResult Remove(Image record)
        {

            try
            {
                m_repository.Remove(record.name);
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
