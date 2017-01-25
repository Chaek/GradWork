using BackendBridge.Domain.Abstract;
using BackendBridge.Domain.Entity;
using BackendBridge.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace BackendBridge.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ProductApiController : ApiController
    {
        public IProductRepository repository;
        public ProductApiController(IProductRepository productRepository)
        {
            this.repository = productRepository;
        }

        public IHttpActionResult GetAll()
        {
            return Ok(repository.Products);
        }
        
        public IHttpActionResult GetProduct(int id)
        {
            var product = repository.Get(id);
            //var product = repository.Products.FirstOrDefault((p) => p.ProductID == id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }


        public IHttpActionResult PostProduct(Protocol obj)
        {
            if (obj == null)
            {
                throw new ArgumentNullException("item");
            }

            States state = obj.state;
            switch (state)
            {
                case States.Error:
                    break;
                case States.Message:
                    Product prod = (Product)obj.data;
                    repository.Add(prod);
                    break;
                case States.Picture:
                    break;

            }
            return Ok();
        }
        
        public IHttpActionResult DeleteProduct(int id)
        {
            repository.Remove(id);
            return Ok();
        }
    }
}
