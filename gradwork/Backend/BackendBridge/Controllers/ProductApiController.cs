using BackendBridge.Domain.Abstract;
using BackendBridge.Domain.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace BackendBridge.Controllers
{
    [EnableCors(origins: "http://localhost:8000", headers: "*", methods: "*")]
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
        
        public IHttpActionResult PostProduct(Product item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }
            repository.Add(item);
            return Ok();
        }
        
        public IHttpActionResult DeleteProduct(int id)
        {
            repository.Remove(id);
            return Ok();
        }
    }
}
