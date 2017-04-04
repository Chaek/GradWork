using System.Collections.Generic;
using WebSocketsClientServer.Models;
using WebSocketSharp;
using WebSocketSharp.Server;
using WebSocketsClientServer.Helpers;
using System.IO;
using System.Diagnostics;
using WebSocketsClientServer.Concrete;
using System.Linq;
using System;

namespace WebSocketsClientServer.Behaviors
{
    static class Images
    {
        //local db isn't used anymore
        static private readonly EFImageRecordsRepository repository = null; // new EFImageRecordsRepository();
        static private readonly string kImageDirectory = GetImageDirectory();

        private static string GetImageDirectory()
        {
            string path = Directory.GetCurrentDirectory();
            path = System.IO.Directory.GetParent(path).FullName;
            path = System.IO.Directory.GetParent(path).FullName;
            path = System.IO.Directory.GetParent(path).FullName;
            path += "\\images\\";
            return path;
        }

        /*
        static public void Initialize()
        {
            IEnumerable<string> imageNames =
                    Directory.GetFiles(kImageDirectory, "*.jpg", SearchOption.TopDirectoryOnly)
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
        }*/

        public class Synchronize : WebSocketBehavior
        {
            protected override void OnMessage(MessageEventArgs e)
            {
                /*
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
                Send(json);*/
            }
        }

        public class Save : WebSocketBehavior
        {
            protected override void OnMessage(MessageEventArgs e)
            {
                try
                {
                    System.Object res = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Object>(e.Data);
                    ResponseModel<Image> mes =
                        Newtonsoft.Json.JsonConvert.DeserializeObject<ResponseModel<Image>>(res.ToString());

                    System.Drawing.Image im = null;
                    string base64 = Helpers.ConvertHelper.RemoveBase64Prefix(mes.data.data);
                    Helpers.ConvertHelper.ToImageFromBase64(base64, out im);

                    string path = kImageDirectory + mes.data.name;
                    im.Save(path, System.Drawing.Imaging.ImageFormat.Jpeg);
                }
                catch (Exception ex)
                {
                    Send(Helpers.ResponseConstructor<Exception>
                        .GetErrorResponse(ex, ResponseModel<Object>.IMAGE));
                }
                Send(Helpers.ResponseConstructor<Exception>
                    .GetSuccessResponse(null, ResponseModel<Object>.IMAGE));

            }
        }

        public class Delete : WebSocketBehavior
        {

            protected override void OnMessage(MessageEventArgs e)
            {
                try
                {
                    System.Object res = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Object>(e.Data);
                    ResponseModel<String> mes =
                        Newtonsoft.Json.JsonConvert.DeserializeObject<ResponseModel<String>>(res.ToString());

                    System.IO.DirectoryInfo di = new DirectoryInfo(kImageDirectory);

                    foreach (FileInfo file in di.GetFiles())
                    {
                        if (file.Name == mes.data)
                        {
                            file.Delete();
                        }
                    }
                }
                catch (Exception ex)
                {
                    Send(Helpers.ResponseConstructor<Exception>
                        .GetErrorResponse(ex, ResponseModel<Object>.IMAGE));
                }

                Send(Helpers.ResponseConstructor<Exception>
                    .GetSuccessResponse(null, ResponseModel<Object>.IMAGE));
            }
        }

        public class Edit : WebSocketBehavior
        {
            protected override void OnMessage(MessageEventArgs e)
            {
                //try catch!
                System.Object res = Newtonsoft.Json.JsonConvert.DeserializeObject<System.Object>(e.Data);
                Image im = Newtonsoft.Json.JsonConvert.DeserializeObject<Image>(res.ToString());

                var fileName = im.name;
                var dir = Images.kImageDirectory + fileName;
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
                        data = Helpers.ConvertHelper.AddBase64Prefix(base64data)
                    };

                    /*CHECK FOR CHANGES*/
                    //NOW image is returned anyway no matter has it been edited or hasn't
                    Send(Helpers.ResponseConstructor<Image>
                        .GetSuccessResponse(new_im, ResponseModel<Object>.IMAGE));  
                };
            }
        }

        public class Update : WebSocketBehavior
        {
            //public readonly string kImageDirectory = "../../../images";
            private IEnumerable<Image> images = null;

            //an optimisation should be perfomed in the future
            //not all images are exposed to updating but
            //ones which have been edited
            private void UpdateImages()
            {
                string base64data = "";
                List<Image> imagesUpdated = new List<Image>();
                IEnumerable<string> imagesPaths =
                    Directory.GetFiles(kImageDirectory, "*.jpg", SearchOption.TopDirectoryOnly);

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
                try
                {
                    UpdateImages();
                }
                catch (Exception ex)
                {
                    Send(Helpers.ResponseConstructor<Exception>
                        .GetErrorResponse(ex, ResponseModel<Object>.IMAGE));
                }
                Send(Helpers.ResponseConstructor<IEnumerable<Image>>
                        .GetSuccessResponse(images, ResponseModel<Object>.IMAGE));
            }
        }
    }
}
