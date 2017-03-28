using System.Collections.Generic;
using WebSocketsClientServer.Models;
using WebSocketSharp;
using WebSocketSharp.Server;
using WebSocketsClientServer.Helpers;
using System.IO;
using System.Diagnostics;
using WebSocketsClientServer.Concrete;
using System.Linq;

namespace WebSocketsClientServer.Behaviors
{
    static class Images
    {
        //very bad! use a relevent path
        static private readonly EFImageRecordsRepository repository = null; // new EFImageRecordsRepository();
        static private readonly string kFolderName = "C:/Users/ankar_000/Desktop/gradwork/LocalApp/images/";
        static public void Initialize()
        {
            IEnumerable<string> imageNames =
                    Directory.GetFiles(kFolderName, "*.jpg", SearchOption.TopDirectoryOnly)
                    .Select(path => Path.GetFileName(path)).ToList();

            List<ImageRecord> records_to_add = new List<ImageRecord>();   
            foreach (var name in imageNames)
            {
                ImageRecord record = repository.Find(name);
                if (record == null)
                {
                    ImageRecord record_to_add = new ImageRecord()
                    {
                        ImageID = 0,
                        Name = name,
                        IsDirty = true
                    };
                    repository.Add(record);
                }
            }

            List<string> names_to_delete = new List<string>();
            IEnumerable<ImageRecord> records = repository.records;
            foreach (var record in records)
            {
                if (default(string) == imageNames.FirstOrDefault(name => name == record.Name))
                {
                    names_to_delete.Add(record.Name);   
                }
            }

            foreach(var name in names_to_delete)
            {
                repository.Remove(name);
            }
        }

        public class Synchronize : WebSocketBehavior
        {
            protected override void OnMessage(MessageEventArgs e)
            {
                //I don't know why, but the direct conversion from json to responsemodel wasn't allowed
                System.Object res = Newtonsoft.Json.JsonConvert
                    .DeserializeObject<System.Object>(e.Data);
                ResponseModel<ImageRecord> response = Newtonsoft.Json.JsonConvert
                    .DeserializeObject<ResponseModel<ImageRecord>>(res.ToString());

                ImageRecord record = response.data;
                repository.Add(record);
                ResponseModel<Image> successfull = new ResponseModel<Image>
                {
                    mes = ResponseModel<Image>.OK,
                    type = ResponseModel<Image>.IMAGE_SUBMODEL,
                    data = { }
                };
                var json = Newtonsoft.Json.JsonConvert.SerializeObject(successfull);
                Send(json);
            }
        }

        public class Edit : WebSocketBehavior
        {
            protected override void OnMessage(MessageEventArgs e)
            {
                System.Object res = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Object>(e.Data);
                Image im = Newtonsoft.Json.JsonConvert.DeserializeObject<Image>(res.ToString());

                var fileName = im.name;
                var dir = Images.kFolderName + fileName;
                ProcessStartInfo startInfo = new ProcessStartInfo(dir);
                //startInfo.EnableRaisingEvents = true;
                //startInfo.WorkingDirectory = curDirectory;
                startInfo.Verb = "edit";
                Process editor = Process.Start(startInfo);
                editor.EnableRaisingEvents = true;

                editor.Exited += (a, b) =>
                {

                    string base64data = "";
                    ConvertHelper.ToBase64StringFromFile(dir, out base64data);

                    Image new_im = new Image()
                    {
                        id = im.id,
                        name = im.name,
                        data = "data:image/jpeg;base64," + base64data,
                    };
                    ResponseModel<Image> response = new ResponseModel<Image>
                    {
                        mes = ResponseModel<Image>.OK,
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
                    var name = Path.GetFileName(path);
                    //now there is no need in using database
                    //ImageRecord record = repository.Find(name);
                    ConvertHelper.ToBase64StringFromFile(path, out base64data);
                    Image image = new Image
                    {
                        id = 0, //(record == null)? 0 : record.ImageID,
                        name = name,
                        data = ConvertHelper.AddBase64Prefix(base64data)
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
                    mes = ResponseModel<Image>.OK,
                    type = ResponseModel<Image>.IMAGE_SUBMODEL,
                    data = images,
                };

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(res);

                Send(json);
            }
        }
    }
}
