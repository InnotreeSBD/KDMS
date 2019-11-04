// --------------------------------------------------------------
var ApDt =ODS.Now().FormatString("yyyy-MM-dd HH:mm:ss");
var ApUserID = ODS.GetUserID();
// --------------------------------------------------------------

var dbconn = ODS.GetConnection();


var cntr_id = 1;
var lv = 1;
var sql = "SELECT LPAD(IFNULL(MAX(cntr_id), 0) + 1, 32, 0) cntr_id FROM ECMCntr \r\n"
var rset = dbconn.ExecuteReader(sql);
if ( rset.Read() ) cntr_id = rset.GetString("cntr_id");
rset.Close();

var sort_seq = 1;
sql = "SELECT IFNULL(MAX(sort_seq), 0) + 1 sort_seq FROM ECMCntr WHERE up_cntr_id = @up_cntr_id AND cntr_lv = @cntr_lv \r\n"
dbconn.AddParameterInt("@up_cntr_id", Request.ParamGet("up_cntr_id"));
dbconn.AddParameterInt("@cntr_lv", Request.ParamGet("cntr_lv"));
var rset = dbconn.ExecuteReader(sql);
if ( rset.Read() ) sort_seq = rset.GetString("sort_seq");
rset.Close();

var sql ="INSERT INTO ECMCntr(cntr_id, box_id, up_cntr_id \r\n"
         +"    , cntr_nm, cntr_lv, use_yn \r\n"
         +"    , sort_seq, ApDt, ApUserID \r\n"
         +"    , UpDt, UpUserID) \r\n"
         +"VALUES(  @cntr_id, @box_id, @up_cntr_id \r\n"
         +"    , @cntr_nm, @cntr_lv, @use_yn \r\n"
         +"    , @sort_seq, @ApDt, @ApUserID \r\n"
         +"    , @UpDt, @UpUserID) \r\n"


dbconn.AddParameter("@cntr_id", cntr_id);
dbconn.AddParameterInt("@box_id", Request.ParamGet("box_id"));
dbconn.AddParameter("@up_cntr_id", Request.ParamGet("up_cntr_id"));
dbconn.AddParameter("@cntr_nm", Request.ParamGet("cntr_nm"));
dbconn.AddParameterInt("@cntr_lv", Request.ParamGet("cntr_lv"));
dbconn.AddParameter("@use_yn", Request.ParamGet("use_yn"));
dbconn.AddParameterInt("@sort_seq", sort_seq);
dbconn.AddParameter("@ApDt", ApDt);
dbconn.AddParameter("@ApUserID", ApUserID);
dbconn.AddParameter("@UpDt", ApDt);
dbconn.AddParameter("@UpUserID", ApUserID);


ODS.TraceQueryState("insert_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);

Response.SetCellData("cntr_id", 0, cntr_id);
Response.SetCellData("sort_seq", 0, sort_seq);
