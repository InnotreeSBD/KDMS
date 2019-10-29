var fileio = ODS.GetFileIOManager();
var storage_path = get_env("STORAGE_PATH");
var Hash_Code = Request.ParamGet("hash_code");
var file_path = storage_path + Request.ParamGet("file_path");

if ( fileio.IsFileExist(file_path) )
	fileio.DeleteFile( file_path );
