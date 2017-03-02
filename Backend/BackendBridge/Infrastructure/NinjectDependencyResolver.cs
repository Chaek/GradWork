using System;
using System.Collections.Generic;
using System.Web.Mvc;
using Ninject;
using Moq;
using BackendBridge.Domain.Entity;
using BackendBridge.Domain.Abstract;
using BackendBridge.Domain.Concrete;

namespace SportsStore.WebUI.Infrastructure
{
    public class NinjectDependencyResolver : IDependencyResolver
    {
        private IKernel kernel;
        public NinjectDependencyResolver(IKernel kernelParam)
        {
            kernel = kernelParam;
            AddBindings();
        }
        public object GetService(Type serviceType)
        {
            return kernel.TryGet(serviceType);
        }
        public IEnumerable<object> GetServices(Type serviceType)
        {
            return kernel.GetAll(serviceType);
        }
        private void AddBindings()
        {
            // put bindings here
            
            /*
            Mock<IProductRepository> mock = new Mock<IProductRepository>();

            mock.Setup(m => m.Products).Returns(new List<Product> {
                new Product { ProductID = 1, Name = "Football", Description = "GJHGJH", Price = 25, Category = "afsafas" }
            });

            kernel.Bind<IProductRepository>().ToConstant(mock.Object); */
            kernel.Bind<IProductRepository>().To<EFProductRepository>().InSingletonScope();
            kernel.Bind<IImageRepository>().To<EFImageRepository>().InSingletonScope();
        }
    }
}