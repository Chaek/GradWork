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
    public class ProductController : ApiController
    {
        public IProductRepository repository;
        public ProductController(IProductRepository productRepository)
        {
            this.repository = productRepository;
        }

        [System.Web.Http.HttpGet]
        public IHttpActionResult GetAll()
        {
            ResponseModel<IEnumerable<Product>> res = new ResponseModel<IEnumerable<Product>> {
                mes = "All products!",
                type = DataType.PRODUCT,
                data = repository.Products,
            };

            return Ok(res);
        }

        [System.Web.Http.HttpGet]
        public IHttpActionResult Get(int id)
        {
            var product = repository.Get(id);
            //var product = repository.Products.FirstOrDefault((p) => p.ProductID == id);

            if (product == null)
            {
                return NotFound();
            }

            ResponseModel<Product> res = new ResponseModel<Product>
            {
                mes = "Concrete product",
                type = DataType.PRODUCT,
                data = product,
            };

            return Ok(res);
        }

        [System.Web.Http.HttpPost]
        public IHttpActionResult Add(Product prod)
        {
            if (prod == null)
            {
                throw new ArgumentNullException("item");
            }

            //try catch
            repository.Add(prod);
            return Ok();
        }

        [System.Web.Http.HttpDelete]
        public IHttpActionResult Remove(int id)
        {
            repository.Remove(id);
            return Ok();
        }
    }
}
