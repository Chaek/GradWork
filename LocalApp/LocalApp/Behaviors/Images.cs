using System.Collections.Generic;
using WebSocketsClientServer.Models;
using WebSocketSharp;
using WebSocketSharp.Server;
using WebSocketsClientServer.Helpers;
using System.IO;
using System.Diagnostics;

namespace WebSocketsClientServer.Behaviors
{
    namespace Images
    {
        public class Edit : WebSocketBehavior
        {
            //very bad use relevent path
            public readonly string kFolderName = "C:/Users/ankar_000/Desktop/gradwork/LocalApp/images/";
            protected override void OnMessage(MessageEventArgs e)
            {
                System.Object res = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Object>(e.Data);
                AdvancedImage im = Newtonsoft.Json.JsonConvert.DeserializeObject<AdvancedImage>(res.ToString());

                var fileName = im.Name;
                var dir = kFolderName + fileName;
                ProcessStartInfo startInfo = new ProcessStartInfo(dir);
                //startInfo.EnableRaisingEvents = true;
                //startInfo.WorkingDirectory = curDirectory;
                startInfo.Verb = "edit";
                Process editor = Process.Start(startInfo);
                editor.EnableRaisingEvents = true;

                editor.Exited += (a, b) => {

                    string base64data = "";
                    ConvertHelper.ToBase64StringFromFile(dir, out base64data);

                    AdvancedImage new_im = new AdvancedImage()
                    {
                        ID = im.ID,
                        Name = im.Name,
                        Data = "data:image/jpeg;base64," + base64data,
                        Ref = im.Ref,
                        isActual = im.isActual
                    };
                    ResponseModel<AdvancedImage> response = new ResponseModel<AdvancedImage>
                    {
                        mes = ResponseModel<Image>.COMMAND_STATUS_OK,
                        type = ResponseModel<Image>.IMAGE_SUBMODEL,
                        data = new_im
                    };

                    var json = Newtonsoft.Json.JsonConvert.SerializeObject(response);
                    /*CHECK FOR CHANGES*/
                    //NOW image is returned anyway no matter has it been edited or hasn't
                    Send(json);
                };
            }
        }

        public class Update : WebSocketBehavior
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
                IEnumerable<string> imagesPaths =
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
}
