var load_obj = ODS.LoadClass("pdf.PdfFileParser");

var file_path = Request.ParamGet("file_path");
var storage_path = get_env("STORAGE_PATH");

var result = load_obj.pdfFileParser(storage_path + file_path);

Response.SetCellData("http_result", 0 , result);