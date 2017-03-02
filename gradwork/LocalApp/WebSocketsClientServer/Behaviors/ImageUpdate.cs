using System.Collections.Generic;
using WebSocketsClientServer.Models;
using WebSocketSharp;
using WebSocketSharp.Server;
using WebSocketsClientServer.Helpers;
using System.IO;

namespace WebSocketsClientServer.Behaviors
{
    
    public class ImageUpdate : WebSocketBehavior
    {
        public readonly string kFolderName = "../../../images";
        private IEnumerable<Image> images = null;

        //an optimisation should be perfomed in the future
        //not all images are exposed to updating but
        //ones which have been edited
        private void UpdateImages()
        {
            string base64data = "";
            List<Image> imagesUpdated = new List<Image>();
            IEnumerable <string> imagesPaths = 
                Directory.GetFiles(kFolderName, "*.jpg", SearchOption.TopDirectoryOnly);
            
            foreach (var path in imagesPaths)
            {
                ConvertHelper.ToBase64StringFromFile(path, out base64data);
                Image image = new Image
                {
                    ID = 0, //DataBase'll initialize it
                    Name = Path.GetFileName(path),
                    Data = "data:image/jpeg;base64," + base64data
                };

                imagesUpdated.Add(image);
            }
            images = imagesUpdated;
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            UpdateImages();

            ResponseModel<IEnumerable<Image>> res = new ResponseModel<IEnumerable<Image>>
            {
                mes = "Files from the directory 'images'!",
                type = ResponseModel<Image>.IMAGE_SUBMODEL,
                data = images,
            };

            var json = Newtonsoft.Json.JsonConvert.SerializeObject(res);

            Send(json);
        }
    }
}
