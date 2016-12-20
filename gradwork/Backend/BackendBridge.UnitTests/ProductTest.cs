using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using BackendBridge.Domain.Entity;
using Moq;
using BackendBridge.Domain.Abstract;
using BackendBridge.Controllers;
using System.Collections.Generic;
using System.Linq;

namespace BackendBridge.UnitTests
{
    [TestClass]
    public class ProductTest
    {
        [TestMethod]
        public void Can_Get_List_View()
        {
            // Arrange
            Mock<IProductRepository> mock = new Mock<IProductRepository>();
            Product[] input = new Product[] {
                new Product {ProductID = 1, Name = "P1"},
                new Product {ProductID = 2, Name = "P2"},
                new Product {ProductID = 3, Name = "P3"},
                new Product {ProductID = 4, Name = "P4"},
                new Product {ProductID = 5, Name = "P5"}
            };

            mock.Setup(m => m.Products).Returns(input);
            
            ProductController controller = new ProductController(mock.Object);
            // Act
            Product[] result = ((IEnumerable<Product>)controller.List().Model).ToArray();
            // Assert
            Assert.AreEqual(input.Length, result.Length);
            Assert.AreEqual(result[0].Name, input[0].Name);
            Assert.AreEqual(result[1].Name, input[1].Name);
            Assert.AreEqual(result[2].Name, input[2].Name);
            Assert.AreEqual(result[3].Name, input[3].Name);
            Assert.AreEqual(result[4].Name, input[4].Name);
        }
    }
}
