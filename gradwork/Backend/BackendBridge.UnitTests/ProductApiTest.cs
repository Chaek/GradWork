using BackendBridge.Controllers;
using BackendBridge.Domain.Abstract;
using BackendBridge.Domain.Entity;
using BackendBridge.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;

namespace BackendBridge.UnitTests
{
    [TestClass]
    public class ProductApiTest
    {
        [TestMethod]
        public void Can_Get_By_Id()
        {
            // Arrange
            Mock<IProductRepository> mock = new Mock<IProductRepository>();

            mock.Setup(m => m.Get(2)).Returns(new Product { 
                ProductID = 2,
                Name = "Name2",
                Price = 4
            });

            ProductController controller = new ProductController(mock.Object);

            // Act
            IHttpActionResult actionResult = controller.Get(2);
            //bad
            var contentResult = actionResult as OkNegotiatedContentResult<ResponseModel<Product>>;

            // Assert
            Assert.IsNotNull(contentResult);
            Assert.IsNotNull(contentResult.Content.data);
            Assert.AreEqual("Name2", contentResult.Content.data.Name);
        }

        [TestMethod]
        public void Should_Not_Find_By_Id()
        {
            // Arrange
            Mock<IProductRepository> mock = new Mock<IProductRepository>();
            ProductController controller = new ProductController(mock.Object);

            // Act
            IHttpActionResult actionResult = controller.Get(2);
            var contentResult = actionResult as OkNegotiatedContentResult<Product>;

            // Assert
            Assert.IsInstanceOfType(actionResult, typeof(NotFoundResult));
        }

        [TestMethod]
        public void Can_Delete_Product()
        {
            //arrange
            Mock<IProductRepository> mock = new Mock<IProductRepository>();
            ProductController controller = new ProductController(mock.Object);

            // Act
            controller.Remove(3);

            // Assert
            mock.Verify(m => m.Remove(3));
        }

        /*
        [TestMethod]

        public void Can_Post_Product()
        {
            //arrange
            Mock<IProductRepository> mock = new Mock<IProductRepository>();
            ProductApiController controller = new ProductApiController(mock.Object);
            Product prod = new Product {
                Name = "Name",
                ProductID = 1,
                Price = 2
            };
            // Act
            controller.PostProduct(prod);

            // Assert
            mock.Verify(m => m.Add(prod));
        }
        */

        [TestMethod]

        public void Can_Post_Product()
        {
            //arrange
            Mock<IProductRepository> mock = new Mock<IProductRepository>();
            ProductController controller = new ProductController(mock.Object);
            Product prod = new Product()
            {
                ProductID = 1,
                Name = "Name",
                Description = "dsdsa",
                Price = 2,
                Category = "dsdas"
            };

            /*
            Protocol protocol = new Protocol {
                state = States.Message,
                mes = "Hello",
                data = prod
            };*/
            // Act
            controller.Add(prod);

            // Assert
            mock.Verify(m => m.Add(prod));
        }

        [TestMethod]

        public void Can_Post_Image()
        {
            //arrange
            Mock<IImageRepository> mock = new Mock<IImageRepository>();
            ImageController controller = new ImageController(mock.Object);
            Image prod = new Image()
            {
                ID = 1,
                Name = "Name",
                Data = "Data"
            };

            // Act
            controller.Post(prod);

            // Assert
            mock.Verify(m => m.Add(prod));
        }


    }
}
