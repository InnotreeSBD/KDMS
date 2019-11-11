// --------------------------------------------------------------
var ApDt =ODS.Now().FormatString("yyyy-MM-dd HH:mm:ss");
var ApUserID = ODS.GetUserID();
// --------------------------------------------------------------


var dbconn = ODS.GetConnection();

var plcy_id = 1;
var sql = "SELECT IFNULL(MAX(plcy_id),0)+1 plcy_id FROM ECMCntrPolicy"
var rset = dbconn.ExecuteReader(sql);
if ( rset.Read() )
{
	plcy_id = rset.GetString("plcy_id");
}
rset.Close();

var sql ="INSERT INTO ECMCntrPolicy(plcy_id, cntr_id, FileTitle \r\n"
         +"    , FileName, Hash_Code, HrNm \r\n"
         +"    , ApDt, ApUserID, UpDt, FileCategory \r\n"
         +"    , UpUserID) \r\n"
         +"VALUES(  @plcy_id, @cntr_id, @FileTitle \r\n"
         +"    , @FileName, @Hash_Code, @HrNm \r\n"
         +"    , @ApDt, @ApUserID, @UpDt, @FileCategory \r\n"
         +"    , @UpUserID) \r\n"

dbconn.AddParameterInt("@plcy_id", plcy_id);
dbconn.AddParameter("@cntr_id", Request.ParamGet("cntr_id"));
dbconn.AddParameter("@HrNm", Request.ParamGet("HrNm"));
dbconn.AddParameter("@FileTitle", Request.ParamGet("FileTitle"));
dbconn.AddParameter("@FileName", Request.ParamGet("FileName"));
dbconn.AddParameter("@Hash_Code", Request.ParamGet("Hash_Code"));
dbconn.AddParameter("@FileCategory", Request.ParamGet("FileCategory"));
dbconn.AddParameter("@ApDt", ApDt);
dbconn.AddParameter("@ApUserID", ApUserID);
dbconn.AddParameter("@UpDt", ApDt);
dbconn.AddParameter("@UpUserID", ApUserID);

//ODS.ShowWarning(Request.ParamGet("HrNm"));

ODS.TraceQueryState("plcy_insert_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);


Response.SetCellData("plcy_id", 0, plcy_id);